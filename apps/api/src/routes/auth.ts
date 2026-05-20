import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimit';

const router = Router();
router.use(apiLimiter);

/**
 * POST /api/auth/register
 * Create a new user with phone and password.
 * Uses Admin API to bypass SMS OTP verification for testing/development.
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, password, name, language = 'ta' } = req.body;

    if (!phone || !password) {
      res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Phone number and password are required',
      });
      return;
    }

    // 1. Create the user in auth.users using Admin API (marks phone as confirmed)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      phone,
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

    // 2. Update the public.users table with the name and language
    // The database trigger 'on_auth_user_created' automatically inserted the row,
    // so we just perform an update to fill name and language.
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
