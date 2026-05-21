import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';
import { sendOtpSms } from '../services/sms.service';

const router = Router();
router.use(apiLimiter);

// In-memory cache for OTP codes with 5-minute expiration
interface OtpEntry {
  code: string;
  expiresAt: number;
}
const otpCache = new Map<string, OtpEntry>();

/**
 * POST /api/auth/register
 * Two-Step Registration with OTP verification:
 * Step 1: If 'otp' is missing, generate and log a verification code, returning otp_sent = true.
 * Step 2: If 'otp' is provided, verify the code and create the user account in Supabase.
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password, name, otp, language = 'ta' } = req.body;

    if (!phone || !password) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Phone number and password are required',
      });
      return;
    }

    // Ensure phone exists or is valid
    const cleanPhone = '+' + phone.replace(/\D/g, '');

    // Step 1: Send/Generate OTP
    if (!otp) {
      // Check if user already exists in public.users to avoid duplicating
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (existingUser) {
        res.status(400).json({
          success: false,
          error: 'USER_EXISTS',
          message: 'கைபேசி எண் ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது · Phone number already registered',
        });
        return;
      }

      // Generate a clean 6-digit OTP code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store in memory cache
      otpCache.set(cleanPhone, {
        code,
        expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes validity
      });

      console.log(`
===================================================
[SMS OTP SIMULATOR]
Verification code for ${cleanPhone} is: ${code}
===================================================
`);

      // Send the real SMS OTP via Twilio!
      try {
        await sendOtpSms(cleanPhone, code);
      } catch (smsError: any) {
        console.error('[Register SMS Send Error]:', smsError);
        // We log the error but still allow the process to proceed in dev environment
        // so trial account restrictions don't block local development.
      }

      res.json({
        success: true,
        otp_sent: true,
        message: 'உறுதிப்படுத்தல் குறியீடு அனுப்பப்பட்டது · Verification code sent to your phone',
      });
      return;
    }

    // Step 2: Verify OTP
    const cachedEntry = otpCache.get(cleanPhone);
    if (!cachedEntry) {
      res.status(400).json({
        success: false,
        error: 'INVALID_OTP',
        message: 'அங்கீகரிக்கப்படாத குறியீடு · Verification code expired or not found. Please request a new one.',
      });
      return;
    }

    if (Date.now() > cachedEntry.expiresAt) {
      otpCache.delete(cleanPhone);
      res.status(400).json({
        success: false,
        error: 'EXPIRED_OTP',
        message: 'காலாவதியான குறியீடு · Verification code expired. Please request a new one.',
      });
      return;
    }

    if (cachedEntry.code !== otp.trim()) {
      res.status(400).json({
        success: false,
        error: 'WRONG_OTP',
        message: 'தவறான குறியீடு · Invalid verification code. Please check and try again.',
      });
      return;
    }

    // OTP is valid! Clear it from cache and create account
    otpCache.delete(cleanPhone);

    // 1. Create user in auth.users using Admin API (bypass external SMS confirmation)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      phone: cleanPhone,
      password,
      phone_confirm: true,
      user_metadata: { name, language, plan: 'FREE', plan_expires_at: null }
    });

    if (authError || !authUser.user) {
      res.status(400).json({
        success: false,
        error: 'REGISTRATION_FAILED',
        message: authError?.message || 'Failed to create auth user',
      });
      return;
    }

    // 2. Update public.users profile
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .update({ name, language })
      .eq('id', authUser.user.id);

    if (profileError) {
      console.error('[Register Profile Update Error]:', profileError);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: authUser.user.id,
        phone: authUser.user.phone,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred during registration',
    });
  }
});

/**
 * POST /api/auth/login
 * Signs in user with phone and password, returning JWT access and refresh tokens.
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Phone number and password are required',
      });
      return;
    }

    const { data: session, error } = await supabaseAdmin.auth.signInWithPassword({
      phone,
      password,
    });

    if (error || !session.session) {
      res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: error?.message || 'Invalid phone number or password',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        access_token: session.session.access_token,
        refresh_token: session.session.refresh_token,
        expires_at: session.session.expires_at,
        user: {
          id: session.user.id,
          phone: session.user.phone,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred during login',
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refreshes session via refresh token.
 */
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Refresh token is required',
      });
      return;
    }

    const { data: session, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token,
    });

    if (error || !session.session) {
      res.status(401).json({
        success: false,
        error: 'INVALID_REFRESH_TOKEN',
        message: error?.message || 'Failed to refresh token',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        access_token: session.session.access_token,
        refresh_token: session.session.refresh_token,
        expires_at: session.session.expires_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred during token refresh',
    });
  }
});

/**
 * POST /api/auth/logout
 * Logs out user (requires authentication).
 */
router.post('/logout', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization!;
    const token = authHeader.split(' ')[1];

    // Sign out from Supabase
    const { error } = await supabaseAdmin.auth.signOut();

    if (error) {
      res.status(400).json({
        success: false,
        error: 'LOGOUT_FAILED',
        message: error.message,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred during logout',
    });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current user and subscription status (requires authentication).
 */
router.get('/me', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .select('*, subscriptions(plan, expires_at)')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Could not find user profile details',
      });
      return;
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred fetching user profile',
    });
  }
});

/**
 * GET /api/auth/sync-meta
 * Called by dashboard layout on mount, updates user_metadata from DB
 */
router.get('/sync-meta', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('plan, expires_at')
      .eq('user_id', req.user.id)
      .single();

    const plan = sub?.plan ?? 'FREE';
    const expiresAt = sub?.expires_at ?? null;

    await supabaseAdmin.auth.admin.updateUserById(req.user.id, {
      user_metadata: { plan, plan_expires_at: expiresAt }
    });

    res.json({ success: true, plan, expiresAt });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'SERVER_ERROR',
      message: error.message || 'An unexpected error occurred during subscription metadata sync',
    });
  }
});

export default router;
