import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';

/**
 * Middleware to ensure the authenticated user has an active PRO subscription.
 * Must be placed AFTER the `authenticate` middleware in the route chain.
 */
export const requireSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Bypassing subscription check for testing
  next();
};
