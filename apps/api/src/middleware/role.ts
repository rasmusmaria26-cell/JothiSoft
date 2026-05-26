import { Request, Response, NextFunction } from 'express';

type Role = 'admin' | 'retailer' | 'customer';

export const requireRole = (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    let role = req.user?.user_metadata?.role as Role | undefined;
    if (!role && req.user?.user_metadata?.is_admin === true) {
      role = 'admin';
    }
    if (!role || !roles.includes(role)) {
      return res.status(403).json({
        success:    false,
        message:    'Access denied. Insufficient role.',
        message_ta: 'அணுகல் மறுக்கப்பட்டது.',
      });
    }
    return next();
  };
