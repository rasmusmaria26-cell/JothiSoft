import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';

/**
 * Middleware to ensure the authenticated user has an active PRO subscription
 * or is within their active 24-hour trial period.
 * Admins are automatically bypassed and granted full access.
 * Must be placed AFTER the `authenticate` middleware in the route chain.
 */
export const requireSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required before subscription check',
      });
    }

    const userId = req.user.id;
    const email = req.user.email;

    // Add role bypass so admin and retailer always pass the subscription gate
    const role = req.user?.user_metadata?.role;
    if (role === 'admin' || role === 'retailer') return next();

    // 1. Bypass check for bootstrap administrators
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (email && adminEmails.includes(email.toLowerCase())) {
      return next();
    }

    // 2. Bypass check for dynamic admins
    if (req.user.user_metadata?.is_admin === true) {
      return next();
    }

    const now = new Date();

    // 3. Primary check: Validate directly from the verified Supabase Auth JWT metadata first
    // This provides instant DB-independent checks and prevents database connection bottleneck failures.
    const meta = req.user.user_metadata ?? {};
    const metaPlan = meta.plan;
    const metaExpiresAt = meta.plan_expires_at ? new Date(meta.plan_expires_at) : null;
    const createdAt = req.user.created_at ? new Date(req.user.created_at) : new Date();
    
    // Trial expires 24 hours after user registration
    const metaTrialExpiresAt = meta.trial_expires_at 
      ? new Date(meta.trial_expires_at) 
      : new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);

    const isProActiveInMeta =
      (metaPlan === 'PRO' && (!metaExpiresAt || metaExpiresAt > now)) ||
      (metaPlan === 'FREE' && metaTrialExpiresAt && metaTrialExpiresAt > now) ||
      (!metaPlan && metaTrialExpiresAt && metaTrialExpiresAt > now);

    if (isProActiveInMeta) {
      return next();
    }

    // 4. Secondary check: Fetch user's subscription details from DB as database fallback
    const { data: sub, error } = await supabaseAdmin
      .from('subscriptions')
      .select('plan, expires_at, created_at')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('[Subscription Middleware DB Error]:', error);
    }

    if (sub) {
      // Check 1: Active PRO subscription in DB
      if (sub.plan === 'PRO' && (!sub.expires_at || new Date(sub.expires_at) > now)) {
        return next();
      }

      // Check 2: Active 24-hour trial period (created_at + 24 hours) in DB
      if (sub.plan === 'FREE' && sub.created_at) {
        const trialExpires = new Date(new Date(sub.created_at).getTime() + 24 * 60 * 60 * 1000);
        if (trialExpires > now) {
          return next();
        }
      }
    } else {
      // Ultimate Fallback: If no DB subscription record exists, calculate trial from user's account creation date in Auth
      const accountCreatedAt = req.user.created_at ? new Date(req.user.created_at) : new Date();
      const trialExpires = new Date(accountCreatedAt.getTime() + 24 * 60 * 60 * 1000);
      if (trialExpires > now) {
        return next();
      }
    }

    // Reject access if both checks fail
    return res.status(403).json({
      success: false,
      error: 'SUBSCRIPTION_REQUIRED',
      message: 'உங்கள் இலவச சோதனை காலம் முடிவடைந்தது. இந்த அம்சத்தை அணுக கட்டண சந்தா தேவை · Your free trial has expired. A PRO subscription is required to access this feature.',
    });
  } catch (error) {
    console.error('[Subscription Validation Middleware Error]:', error);
    res.status(500).json({
      success: false,
      error: 'SUBSCRIPTION_CHECK_FAILED',
      message: 'Failed to validate subscription status',
    });
  }
};
