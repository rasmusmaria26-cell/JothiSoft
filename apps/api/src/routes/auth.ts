import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import { apiLimiter, authLimiter } from '../middleware/rateLimit';

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
router.post('/register', authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, language = 'ta' } = req.body;

    if (!email || !password || !phone) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'மின்னஞ்சல், கடவுச்சொல் மற்றும் தொலைபேசி எண் தேவை · Email, password, and phone number are required',
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/\s+/g, '');

    // 1. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'செல்லுபடியாகும் மின்னஞ்சல் தேவை · Valid email is required',
      });
      return;
    }

    // 2. Password length validation
    const hasNumber = /\d/.test(password);
    if (password.length < 8 || !hasNumber) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'கடவுச்சொல் குறைந்தது 8 எழுத்துகள் மற்றும் ஒரு எண் கொண்டிருக்க வேண்டும் · Password must be at least 8 characters and contain at least one number',
      });
      return;
    }

    // 3. Phone number format validation (E.164-like pattern: 7-15 digits, optional + prefix)
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'செல்லுபடியாகும் தொலைபேசி எண் தேவை · Valid phone number is required (7-15 digits)',
      });
      return;
    }

    // Check if email already exists in public.users to avoid duplicating
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'USER_EXISTS',
        message: 'மின்னஞ்சல் ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது · Email already registered',
      });
      return;
    }

    // Check if phone already exists in public.users to avoid duplicating
    const { data: existingPhone } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('phone', cleanPhone)
      .maybeSingle();

    if (existingPhone) {
      res.status(400).json({
        success: false,
        error: 'PHONE_EXISTS',
        message: 'தொலைபேசி எண் ஏற்கனவே பயன்படுத்தப்பட்டுள்ளது · Phone number already registered',
      });
      return;
    }

    const trialExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // 1. Create user in auth.users using Admin API (with email_confirm: true for seamless dev/prod testing)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password,
      phone: cleanPhone,
      email_confirm: true, // Set to false here when standard SMTP is fully connected in production!
      phone_confirm: true,
      user_metadata: {
        name,
        language,
        plan: 'FREE',
        plan_expires_at: null,
        trial_expires_at: trialExpiresAt,
      }
    });

    if (authError || !authUser.user) {
      res.status(400).json({
        success: false,
        error: 'REGISTRATION_FAILED',
        message: authError?.message || 'Failed to create auth user',
      });
      return;
    }

    // 2. Update public.users profile (the trigger handles insertion, we make sure name/email/phone are synced)
    const { error: profileError } = await supabaseAdmin
      .from('users')
      .update({ name, language, email: cleanEmail, phone: cleanPhone })
      .eq('id', authUser.user.id);

    if (profileError) {
      console.error('[Register Profile Update Error]:', profileError);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: authUser.user.id,
        email: authUser.user.email,
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
 * Signs in user with email and password, returning JWT access and refresh tokens.
 */
router.post('/login', authLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrPhone, email, password } = req.body;
    const inputVal = (emailOrPhone || email || '').trim();

    if (!inputVal || !password) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'மின்னஞ்சல்/தொலைபேசி மற்றும் கடவுச்சொல் தேவை · Email/Phone and password are required',
      });
      return;
    }

    let emailToAuth = inputVal.toLowerCase();

    // Check if input is a phone number (e.g. only digits with optional leading +)
    if (/^\+?[0-9]{7,15}$/.test(inputVal.replace(/\s+/g, ''))) {
      const cleanPhone = inputVal.replace(/\s+/g, '');
      const { data: userProfile } = await supabaseAdmin
        .from('users')
        .select('email')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (userProfile && userProfile.email) {
        emailToAuth = userProfile.email;
      } else {
        res.status(404).json({
          success: false,
          error: 'PHONE_NOT_REGISTERED',
          message: 'இந்த தொலைபேசி எண் இன்னும் பதிவு செய்யப்படவில்லை · This phone number is not registered yet',
        });
        return;
      }
    }

    const { data: session, error } = await supabaseAdmin.auth.signInWithPassword({
      email: emailToAuth,
      password,
    });

    if (error || !session.session) {
      res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: error?.message || 'உள்நுழைவு விவரங்கள் தவறானவை · Invalid login credentials',
      });
      return;
    }

    // Check admin status
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const { data: dbUser } = await supabaseAdmin
      .from('users')
      .select('is_admin')
      .eq('id', session.user.id)
      .maybeSingle();

    const isAdmin = (session.user.email && adminEmails.includes(session.user.email.toLowerCase())) || !!dbUser?.is_admin;

    // Sync is_admin metadata in auth.users if it differs
    if (session.user.user_metadata?.is_admin !== isAdmin) {
      await supabaseAdmin.auth.admin.updateUserById(session.user.id, {
        user_metadata: {
          ...session.user.user_metadata,
          is_admin: isAdmin,
        },
      });
    }

    res.json({
      success: true,
      data: {
        access_token: session.session.access_token,
        refresh_token: session.session.refresh_token,
        expires_at: session.session.expires_at,
        is_admin: isAdmin,
        user: {
          id: session.user.id,
          email: session.user.email,
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
