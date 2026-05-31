import { Request, Response, NextFunction } from 'express';

type Role = 'admin' | 'retailer' | 'customer';

export const requireRole = (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    let role = req.user?.user_metadata?.role as Role | undefined;
    if (!role && req.user?.user_metadata?.is_admin === true) {
      role = 'admin';
    }

    // Admin bypass: Administrators are superusers and can access all role-restricted endpoints
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const isBootstrapAdmin = req.user?.email && adminEmails.includes(req.user.email.toLowerCase());
    const isAdmin = role === 'admin' || req.user?.user_metadata?.is_admin === true || isBootstrapAdmin;

    if (isAdmin) {
      return next();
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
