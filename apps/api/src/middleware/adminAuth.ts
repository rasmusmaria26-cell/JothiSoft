import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';

/**
 * Middleware to restrict access to admin users only.
 * Must be used AFTER the authenticate middleware!
 */
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required before admin check',
      });
    }

    const email = req.user.email;
    const userId = req.user.id;

    // 1. Check bootstrap ADMIN_EMAILS from environment variables
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (email && adminEmails.includes(email.toLowerCase())) {
      return next();
    }

    // 2. Check dynamic admin status in Supabase Auth user metadata
    if (req.user.user_metadata?.is_admin === true || req.user.user_metadata?.role === 'admin') {
      return next();
    }

    // Reject if neither check passes
    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN',
      message: 'அணுகல் மறுக்கப்பட்டது · Administrative access is required to view this resource',
    });
  } catch (error) {
    console.error('[Admin Auth Middleware Error]:', error);
    res.status(500).json({
      success: false,
      error: 'ADMIN_AUTH_ERROR',
      message: 'Failed to verify administrative permissions',
    });
  }
};
