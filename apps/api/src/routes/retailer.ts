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

    const rawDays = parseInt(durationDays) || 30;
    const clampedDays = Math.min(Math.max(rawDays, 1), 365); // min 1 day, max 1 year
    const expiresAt = new Date(Date.now() + clampedDays * 24 * 60 * 60 * 1000).toISOString();

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
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
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
 * GET /api/retailer/customers/available
 * Fetches all available (unclaimed, non-admin, non-retailer, TRIAL/EXPIRED) customers.
 * Supports optional search by name or phone, and pagination.
 */
router.get('/customers/available', async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const searchTerm = search ? (search as string).trim().toLowerCase() : '';

    // 1. Fetch up to 1000 users from Supabase Auth
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (usersError) {
      res.status(400).json({ success: false, error: 'AUTH_ERROR', message: usersError.message });
      return;
    }

    // 2. Fetch all retailer-to-customer linkages to exclude claimed users
    const { data: retailerLinks, error: linksErr } = await supabaseAdmin
      .from('retailer_customers')
      .select('customer_id');

    if (linksErr) {
      console.error('[Available Customers Link Check Error]:', linksErr);
    }
    const claimedCustomerIds = new Set((retailerLinks || []).map(l => l.customer_id));

    // 3. Fetch all subscriptions to check plans
    const { data: subscriptions, error: subsErr } = await supabaseAdmin
      .from('subscriptions')
      .select('*');

    if (subsErr) {
      console.error('[Available Customers Subscriptions Error]:', subsErr);
    }
    const dbSubs = subscriptions || [];

    // 4. Map & filter users
    const availableUsers = users
      .map(u => {
        const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
        const adminEmails = adminEmailsEnv
          .split(',')
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean);

        const isUserAdmin = (u.email && adminEmails.includes(u.email.toLowerCase())) || u.user_metadata?.is_admin === true || u.user_metadata?.role === 'admin';
        const userRole = u.user_metadata?.role || (isUserAdmin ? 'admin' : 'customer');

        // Reconcile subscription status
        const dbSub = dbSubs.find(s => s.user_id === u.id);
        let calculatedStatus: 'TRIAL' | 'PRO' | 'EXPIRED' | 'ADMIN' = 'EXPIRED';
        let plan = 'FREE';
        let planExpiresAt = null;

        if (isUserAdmin) {
          calculatedStatus = 'ADMIN';
          plan = 'PRO';
        } else if (dbSub) {
          plan = dbSub.plan || 'FREE';
          if (dbSub.plan === 'PRO') {
            const expires = dbSub.expires_at ? new Date(dbSub.expires_at) : null;
            planExpiresAt = dbSub.expires_at;
            if (!expires || expires > new Date()) {
              calculatedStatus = 'PRO';
            } else {
              calculatedStatus = 'EXPIRED';
            }
          } else {
            // TRIAL check
            const trialExpires = dbSub.trial_expires_at 
              ? new Date(dbSub.trial_expires_at)
              : new Date(new Date(dbSub.created_at || u.created_at).getTime() + 24 * 60 * 60 * 1000);
            if (trialExpires > new Date()) {
              calculatedStatus = 'TRIAL';
            } else {
              calculatedStatus = 'EXPIRED';
            }
          }
        } else {
          // If no subscription record, check registration time as TRIAL
          const trialExpires = new Date(new Date(u.created_at).getTime() + 24 * 60 * 60 * 1000);
          if (trialExpires > new Date()) {
            calculatedStatus = 'TRIAL';
          } else {
            calculatedStatus = 'EXPIRED';
          }
        }

        return {
          id: u.id,
          email: u.email || null,
          phone: u.phone || '',
          name: u.user_metadata?.name || 'Anonymous Customer',
          role: userRole,
          is_admin: isUserAdmin,
          created_at: u.created_at,
          calculatedStatus,
          plan,
          planExpiresAt,
        };
      })
      .filter(u => {
        // Exclude admins & retailers
        if (u.role === 'admin' || u.role === 'retailer' || u.is_admin) return false;
        // Must be TRIAL or EXPIRED status
        if (u.calculatedStatus !== 'TRIAL' && u.calculatedStatus !== 'EXPIRED') return false;
        // Must not be claimed by any retailer
        if (claimedCustomerIds.has(u.id)) return false;
        // Must not have an active PRO plan
        if (u.plan === 'PRO' && (!u.planExpiresAt || new Date(u.planExpiresAt) > new Date())) return false;

        // Apply search query if provided
        if (searchTerm) {
          const nameMatch = u.name.toLowerCase().includes(searchTerm);
          
          // Clean phone match
          const cleanQueryPhone = searchTerm.replace(/[^0-9]/g, '');
          const cleanUserPhone = u.phone.replace(/[^0-9]/g, '');
          const phoneMatch = cleanQueryPhone && cleanUserPhone && (cleanUserPhone.includes(cleanQueryPhone) || cleanQueryPhone.includes(cleanUserPhone));

          // Check if synthetic email (ends with @jothisoft.phone)
          const isSyntheticEmail = u.email && u.email.toLowerCase().endsWith('@jothisoft.phone');
          
          let emailMatch = false;
          if (u.email && !isSyntheticEmail) {
            emailMatch = u.email.toLowerCase().includes(searchTerm);
          }

          return nameMatch || phoneMatch || emailMatch;
        }

        return true;
      });

    // 5. Sort by creation date descending (newest first)
    availableUsers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // 6. Paginate
    const totalCount = availableUsers.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    const paginatedUsers = availableUsers.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      customers: paginatedUsers.map(u => ({
        id: u.id,
        email: u.email,
        phone: u.phone,
        name: u.name,
        created_at: u.created_at,
        calculatedStatus: u.calculatedStatus,
      })),
      totalCount,
      totalPages,
      page: pageNum,
    });
  } catch (err: any) {
    console.error('[Available Customers Exception]:', err);
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

    // Verify the user is an unapproved customer account
    const userRole = foundUser.user_metadata?.role || 'customer';
    const isAdmin = foundUser.user_metadata?.is_admin === true || userRole === 'admin';
    const isRetailer = userRole === 'retailer';
    if (isAdmin || isRetailer) {
      res.status(400).json({
        success: false,
        error: 'INVALID_ROLE',
        message: 'நிர்வாகிகள் அல்லது சில்லறை விற்பனையாளர்களை மேம்படுத்த முடியாது · Admins or retailers cannot be upgraded.'
      });
      return;
    }

    // Exclude users claimed by ANY retailer
    const { data: claim, error: claimErr } = await supabaseAdmin
      .from('retailer_customers')
      .select('retailer_id')
      .eq('customer_id', foundUser.id)
      .limit(1);

    if (claimErr) {
      console.error('[Search Customer Claim Check Error]:', claimErr);
    }

    if (claim && claim.length > 0) {
      res.status(400).json({
        success: false,
        error: 'ALREADY_CLAIMED',
        message: 'இந்த பயனர் ஏற்கனவே ஒரு சில்லறை விற்பனையாளரால் கோரப்பட்டுள்ளார் · This user is already claimed by a retailer.'
      });
      return;
    }

    // Exclude users with active PRO subscription
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', foundUser.id)
      .maybeSingle();

    if (subErr) {
      console.error('[Search Customer Subscription Check Error]:', subErr);
    }

    const isPro = sub && sub.plan === 'PRO' && (!sub.expires_at || new Date(sub.expires_at) > new Date());
    if (isPro) {
      res.status(400).json({
        success: false,
        error: 'ACTIVE_PRO',
        message: 'இந்த பயனர் ஏற்கனவே செயலில் உள்ள PRO திட்டத்தை கொண்டுள்ளார் · This user already has an active PRO subscription.'
      });
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
    // Verify the user is an unapproved customer account
    const userRole = targetUser.user_metadata?.role || 'customer';
    const isAdmin = targetUser.user_metadata?.is_admin === true || userRole === 'admin';
    const isRetailer = userRole === 'retailer';
    if (isAdmin || isRetailer) {
      res.status(400).json({
        success: false,
        error: 'INVALID_ROLE',
        message: 'நிர்வாகிகள் அல்லது சில்லறை விற்பனையாளர்களை மேம்படுத்த முடியாது · Admins or retailers cannot be upgraded.'
      });
      return;
    }

    // Exclude users claimed by ANY retailer
    const { data: claim, error: claimErr } = await supabaseAdmin
      .from('retailer_customers')
      .select('retailer_id')
      .eq('customer_id', targetUser.id)
      .limit(1);

    if (claimErr) {
      console.error('[Upgrade Customer Claim Check Error]:', claimErr);
    }

    if (claim && claim.length > 0) {
      res.status(400).json({
        success: false,
        error: 'ALREADY_CLAIMED',
        message: 'இந்த பயனர் ஏற்கனவே ஒரு சில்லறை விற்பனையாளரால் கோரப்பட்டுள்ளார் · This user is already claimed by a retailer.'
      });
      return;
    }

    // Exclude users with active PRO subscription
    const { data: subCheck, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', targetUser.id)
      .maybeSingle();

    if (subErr) {
      console.error('[Upgrade Customer Subscription Check Error]:', subErr);
    }

    const isPro = subCheck && subCheck.plan === 'PRO' && (!subCheck.expires_at || new Date(subCheck.expires_at) > new Date());
    if (isPro) {
      res.status(400).json({
        success: false,
        error: 'ACTIVE_PRO',
        message: 'இந்த பயனர் ஏற்கனவே செயலில் உள்ள PRO திட்டத்தை கொண்டுள்ளார் · This user already has an active PRO subscription.'
      });
      return;
    }

    const rawDays2 = parseInt(durationDays) || 30;
    const clampedDays2 = Math.min(Math.max(rawDays2, 1), 365); // min 1 day, max 1 year
    const expiresAt = new Date(Date.now() + clampedDays2 * 24 * 60 * 60 * 1000).toISOString();

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

    // 5. Log manual activation into subscription_history for auditing
    const retailerNameOrEmail = req.user.email || req.user.phone || retailerId;
    const { error: historyLogErr } = await supabaseAdmin
      .from('subscription_history')
      .insert({
        user_id: targetUser.id,
        activated_by: `Retailer: ${retailerNameOrEmail}`,
        plan: 'PRO',
        starts_at: new Date().toISOString(),
        expires_at: expiresAt,
        payment_note: `Upgraded by Retailer Partner (Duration: ${durationDays} days)`,
      });

    if (historyLogErr) {
      console.error('[Retailer Upgrade Subscription History Log Failed]:', historyLogErr);
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
