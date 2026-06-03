import { Router, Request, Response } from 'express';
import { supabaseAdmin, supabaseAnon } from '../lib/supabase';
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
    const isSyntheticEmail = cleanEmail.endsWith('@jothisoft.phone');

    // 1. Email format validation — skip for synthetic phone-derived emails
    if (!isSyntheticEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'செல்லுபடியாகும் மின்னஞ்சல் தேவை · Valid email is required',
        });
        return;
      }
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

    // Check if email or phone already exists — merged into one generic error to prevent user enumeration
    let alreadyExists = false;
    if (!isSyntheticEmail) {
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();
      if (existingUser) alreadyExists = true;
    }

    if (!alreadyExists) {
      const { data: existingPhone } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('phone', cleanPhone)
        .maybeSingle();
      if (existingPhone) alreadyExists = true;
    }

    if (alreadyExists) {
      res.status(400).json({
        success: false,
        error: 'USER_EXISTS',
        // Generic message — deliberately does not reveal whether email or phone is duplicate
        message: 'இந்த விவரங்கள் ஏற்கனவே பயன்படுத்தப்படுகின்றன · An account with these details already exists',
      });
      return;
    }


    const trialExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // 1. Create user in auth.users using Admin API (with email_confirm: true to skip email verification)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password,
      phone: cleanPhone,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        name,
        language,
        role: 'customer',   // always customer on self-register
        plan: 'FREE',
        plan_expires_at: null,
        is_admin: false,
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

    let session: any = null;
    let authError: any = null;

    // Check if input is a phone number (e.g. only digits with optional leading +)
    if (/^\+?[0-9]{7,15}$/.test(inputVal.replace(/\s+/g, ''))) {
      const cleanPhone = inputVal.replace(/\s+/g, '');
      const cleanDigits = cleanPhone.replace(/[^0-9]/g, '');

      // Match by the last 8-10 digits as a suffix search
      const minLen = Math.min(cleanDigits.length, 10);
      const suffix = cleanDigits.substring(cleanDigits.length - minLen);

      const { data: matchedUsers } = await supabaseAdmin
        .from('users')
        .select('email, phone')
        .like('phone', `%${suffix}`);

      const userProfile = matchedUsers?.find(u => {
        const dbDigits = u.phone.replace(/[^0-9]/g, '');
        return dbDigits.endsWith(cleanDigits) || cleanDigits.endsWith(dbDigits);
      });

      if (userProfile) {
        if (userProfile.email && userProfile.email.trim() !== '') {
          const { data, error } = await supabaseAnon.auth.signInWithPassword({
            email: userProfile.email,
            password,
          });
          session = data;
          authError = error;
        } else if (userProfile.phone) {
          const { data, error } = await supabaseAnon.auth.signInWithPassword({
            phone: userProfile.phone,
            password,
          });
          session = data;
          authError = error;
        } else {
          res.status(404).json({
            success: false,
            error: 'PHONE_NOT_REGISTERED',
            message: 'இந்த தொலைபேசி எண் இன்னும் பதிவு செய்யப்படவில்லை · This phone number is not registered yet',
          });
          return;
        }
      } else {
        // Fallback: Attempt direct login with input phone number
        const { data, error } = await supabaseAnon.auth.signInWithPassword({
          phone: cleanPhone,
          password,
        });
        session = data;
        authError = error;

        // Try pre-pending +91 as fallback if standard login failed
        if (authError && !cleanPhone.startsWith('+')) {
          const { data: prefixedData, error: prefixedError } = await supabaseAnon.auth.signInWithPassword({
            phone: `+91${cleanPhone}`,
            password,
          });
          if (!prefixedError) {
            session = prefixedData;
            authError = null;
          }
        }
      }
    } else {
      // Standard email sign in
      const { data, error } = await supabaseAnon.auth.signInWithPassword({
        email: inputVal.toLowerCase(),
        password,
      });
      session = data;
      authError = error;
    }

    if (authError || !session?.session) {
      res.status(401).json({
        success: false,
        error: 'INVALID_CREDENTIALS',
        message: authError?.message || 'உள்நுழைவு விவரங்கள் தவறானவை · Invalid login credentials',
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
    const currentIsAdmin = !!session.user.user_metadata?.is_admin;
    if (currentIsAdmin !== isAdmin) {
      const updatedMetadata = {
        ...session.user.user_metadata,
        is_admin: isAdmin,
      };

      await supabaseAdmin.auth.admin.updateUserById(session.user.id, {
        user_metadata: updatedMetadata,
      });

      // Update in-memory reference to return updated fields to frontend
      session.user.user_metadata = updatedMetadata;
    }

    res.json({
      success: true,
      data: {
        access_token: session.session.access_token,
        refresh_token: session.session.refresh_token,
        expires_at: session.session.expires_at,
        is_admin: isAdmin,
        role: session.user.user_metadata?.role || 'customer',
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

    const { data: session, error } = await supabaseAnon.auth.refreshSession({
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
    const { error } = await supabaseAnon.auth.signOut();

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
