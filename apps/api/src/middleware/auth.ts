import { Request, Response, NextFunction } from 'express';
import { supabaseAnon } from '../lib/supabase';

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to verify Supabase JWT token and attach user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Missing or invalid authorization header',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token with the dedicated, non-privileged Supabase client to prevent pollution of supabaseAdmin
    const { data: { user }, error } = await supabaseAnon.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Error]:', error);
    res.status(500).json({
      success: false,
      error: 'AUTH_SERVICE_ERROR',
      message: 'Failed to authenticate user',
    });
  }
};
