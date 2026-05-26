import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/role';

const router = Router();

// Apply auth and retailer gate to all routes
router.use(authenticate);
router.use(requireRole('retailer'));

/**
 * POST /api/retailer/customers/create
 * Creates a customer account and grants PRO subscription linked to this retailer.
 */
router.post('/customers/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, durationDays = 30 } = req.body;
    const retailerId = req.user.id;

    const expiresAt = new Date(Date.now() + parseInt(durationDays) * 24 * 60 * 60 * 1000).toISOString();

    // 1. Create user in Supabase Auth
    const { data: user, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        name,
        role: 'customer',
        plan: 'PRO',
        plan_expires_at: expiresAt,
        is_admin: false,
      },
    });

    if (createError) {
      res.status(400).json({ success: false, error: 'CREATE_USER_FAILED', message: createError.message });
      return;
    }

    // 2. Link retailer → customer in bridge table
    const { error: linkError } = await supabaseAdmin
      .from('retailer_customers')
      .upsert(
        {
          retailer_id: retailerId,
          customer_id: user.user.id,
          plan_given:  'PRO',
          expires_at:  expiresAt,
        },
        { onConflict: 'retailer_id,customer_id' }
      );

    if (linkError) {
      console.error('[Retailer Customer Link Error]:', linkError);
      res.status(400).json({ success: false, error: 'LINK_RETAILER_FAILED', message: linkError.message });
      return;
    }

    // 3. Create or update customer subscription record
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert(
        {
          user_id:    user.user.id,
          plan:       'PRO',
          starts_at:  new Date().toISOString(),
          expires_at: expiresAt,
        },
        { onConflict: 'user_id' }
      );

    if (subError) {
      console.error('[Retailer Customer Subscription Upsert Error]:', subError);
      res.status(400).json({ success: false, error: 'SUBSCRIPTION_UPSERT_FAILED', message: subError.message });
      return;
    }

    res.status(201).json({
      success: true,
      customer: {
        id:    user.user.id,
        email: user.user.email,
        name:  user.user.user_metadata.name,
      },
    });
  } catch (err: any) {
    console.error('[Retailer Customer Create Exception]:', err);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
});

/**
 * GET /api/retailer/customers
 * Retrieves the list of customers activated under the currently logged-in retailer.
 */
router.get('/customers', async (req: Request, res: Response): Promise<void> => {
  try {
    const retailerId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('retailer_customers')
      .select('customer_id, activated_at, expires_at')
      .eq('retailer_id', retailerId);

    if (error) {
      res.status(400).json({ success: false, error: 'DB_ERROR', message: error.message });
      return;
    }

    const customerIds = data?.map(item => item.customer_id) || [];
    if (customerIds.length === 0) {
      res.json({ success: true, customers: [] });
      return;
    }

    // Fetch all users to map user profiles (name, email, phone)
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) {
      res.status(400).json({ success: false, error: 'AUTH_ERROR', message: usersError.message });
      return;
    }

    const customers = data.map(link => {
      const u = users.find(user => user.id === link.customer_id);
      return {
        id:           link.customer_id,
        email:        u?.email,
        phone:        u?.phone,
        name:         u?.user_metadata?.name,
        activated_at: link.activated_at,
        expires_at:   link.expires_at,
      };
    });

    res.json({ success: true, customers });
  } catch (err: any) {
    console.error('[Retailer Customers Get Exception]:', err);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
});

/**
 * GET /api/retailer/customers/search
 * Searches for an existing user account by exact email ID or mobile number.
 */
router.get('/customers/search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Search query is required' });
      return;
    }

    const trimmed = query.trim().toLowerCase();

    // Fetch all users to filter and find the matching user
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) {
      res.status(400).json({ success: false, error: 'AUTH_ERROR', message: usersError.message });
      return;
    }

    const foundUser = users.find(u => {
      if (u.email?.toLowerCase() === trimmed) return true;
      if (!u.phone) return false;
      const cleanDbPhone = u.phone.replace(/[^0-9]/g, '');
      const cleanQueryPhone = trimmed.replace(/[^0-9]/g, '');
      if (!cleanQueryPhone) return false;
      return cleanDbPhone.endsWith(cleanQueryPhone) || cleanQueryPhone.endsWith(cleanDbPhone);
    });

    if (!foundUser) {
      res.status(404).json({ success: false, error: 'USER_NOT_FOUND', message: 'No registered customer account found with that email or phone number.' });
      return;
    }

    // Verify it is a customer account
    const userRole = foundUser.user_metadata?.role || 'customer';
    if (userRole !== 'customer') {
      res.status(400).json({ success: false, error: 'INVALID_ROLE', message: 'Only customer accounts can be upgraded.' });
      return;
    }

    res.json({
      success: true,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        phone: foundUser.phone,
        name: foundUser.user_metadata?.name || 'Anonymous Customer',
        plan: foundUser.user_metadata?.plan || 'FREE',
        expires_at: foundUser.user_metadata?.plan_expires_at,
      }
    });
  } catch (err: any) {
    console.error('[Retailer Customer Search Exception]:', err);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
});

/**
 * POST /api/retailer/customers/upgrade
 * Links the user to this retailer and upgrades/extends their plan to PRO.
 */
router.post('/customers/upgrade', async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId, durationDays = 30 } = req.body;
    const retailerId = req.user.id;

    if (!customerId) {
      res.status(400).json({ success: false, error: 'BAD_REQUEST', message: 'Customer ID is required' });
      return;
    }

    // 1. Fetch target user
    const { data: user, error: getError } = await supabaseAdmin.auth.admin.getUserById(customerId);
    if (getError || !user?.user) {
      res.status(404).json({ success: false, error: 'USER_NOT_FOUND', message: 'User not found' });
      return;
    }

    const targetUser = user.user;
    const userRole = targetUser.user_metadata?.role || 'customer';
    if (userRole !== 'customer') {
      res.status(400).json({ success: false, error: 'INVALID_ROLE', message: 'Only customer accounts can be upgraded.' });
      return;
    }

    const expiresAt = new Date(Date.now() + parseInt(durationDays) * 24 * 60 * 60 * 1000).toISOString();

    // 2. Link in retailer_customers table
    const { error: linkError } = await supabaseAdmin
      .from('retailer_customers')
      .upsert(
        {
          retailer_id: retailerId,
          customer_id: targetUser.id,
          plan_given:  'PRO',
          expires_at:  expiresAt,
        },
        { onConflict: 'retailer_id,customer_id' }
      );

    if (linkError) {
      console.error('[Retailer Customer Link Error]:', linkError);
      res.status(400).json({ success: false, error: 'LINK_RETAILER_FAILED', message: linkError.message });
      return;
    }

    // 3. Create or update dynamic subscriptions table
    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .upsert(
        {
          user_id:    targetUser.id,
          plan:       'PRO',
          starts_at:  new Date().toISOString(),
          expires_at: expiresAt,
        },
        { onConflict: 'user_id' }
      );

    if (subError) {
      console.error('[Retailer Customer Subscription Upsert Error]:', subError);
      res.status(400).json({ success: false, error: 'SUBSCRIPTION_UPSERT_FAILED', message: subError.message });
      return;
    }

    // 4. Update the user metadata in Supabase Auth
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
      user_metadata: {
        ...targetUser.user_metadata,
        plan: 'PRO',
        plan_expires_at: expiresAt,
      }
    });

    if (updateError) {
      console.error('[Retailer Customer Auth Update Error]:', updateError);
      res.status(400).json({ success: false, error: 'AUTH_UPDATE_FAILED', message: updateError.message });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Subscription successfully upgraded to PRO!',
      customer: {
        id:    targetUser.id,
        email: targetUser.email,
        name:  targetUser.user_metadata?.name || 'Anonymous Customer',
        expires_at: expiresAt,
      },
    });
  } catch (err: any) {
    console.error('[Retailer Customer Upgrade Exception]:', err);
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
});

export default router;
