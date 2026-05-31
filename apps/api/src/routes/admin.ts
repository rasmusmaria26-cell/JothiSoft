import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';
import { requireRole } from '../middleware/role';

const router = Router();

// Apply auth and admin authentication to all admin routes
router.use(authenticate);
router.use(requireAdmin);

/**
 * GET /api/admin/stats
 * Retrieves overview metrics for the admin dashboard.
 */
router.get('/stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date().toISOString();

    // 1. Total Users count
    const { count: totalUsers, error: usersErr } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (usersErr) throw usersErr;

    // 2. Active Trial count (plan = FREE and created_at > 24 hours ago)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count: activeTrials, error: trialErr } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('plan', 'FREE')
      .gt('created_at', twentyFourHoursAgo);

    if (trialErr) throw trialErr;

    // 3. Active PRO count (plan = PRO and expires_at > NOW)
    const { count: activePros, error: proErr } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('plan', 'PRO')
      .gt('expires_at', now);

    if (proErr) throw proErr;

    // 4. Expired count (FREE + expired trial OR PRO + expired plan)
    const { count: totalSubs, error: subsErr } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    if (subsErr) throw subsErr;

    const expired = (totalSubs || 0) - (activeTrials || 0) - (activePros || 0);

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        activeTrials: activeTrials || 0,
        activePros: activePros || 0,
        expired: Math.max(0, expired),
      },
    });
  } catch (error: any) {
    console.error('[Admin Stats Error]:', error);
    res.status(500).json({
      success: false,
      error: 'STATS_FETCH_FAILED',
      message: error.message || 'Failed to retrieve administrative statistics',
    });
  }
});

// GET /api/admin/users — full user list with filters
router.get('/users', authenticate, requireRole('admin'), async (req, res, next) => {
  try {
    const { role, filter, search, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;

    // 1. Fetch a large list of users from Supabase Auth to allow accurate global searching & filtering
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
      page:    1,
      perPage: 1000,
    });

    if (error) return next(error);

    // 2. Fetch all retailer-to-customer linkages from DB
    const { data: retailerLinks } = await supabaseAdmin
      .from('retailer_customers')
      .select('*');

    const links = retailerLinks || [];

    // 3. Fetch all subscriptions from DB
    const { data: dbSubscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('*');
    const dbSubs = dbSubscriptions || [];

    // 4. Map all users first to ensure fully reconciled statuses from DB source of truth
    const mappedAllUsers = users.map(u => {
      const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
      const adminEmails = adminEmailsEnv
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      const isUserAdmin = (u.email && adminEmails.includes(u.email.toLowerCase())) || u.user_metadata?.is_admin === true || u.user_metadata?.role === 'admin';
      const userRole = u.user_metadata?.role || (isUserAdmin ? 'admin' : 'customer');

      // Reconcile subscription plan from the database
      const dbSub = dbSubs.find(s => s.user_id === u.id);
      const link = links.find(l => l.customer_id === u.id);

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
          // FREE/TRIAL check
          const trialExpires = dbSub.trial_expires_at 
            ? new Date(dbSub.trial_expires_at)
            : new Date(new Date(dbSub.created_at || u.created_at).getTime() + 24 * 60 * 60 * 1000);
          if (trialExpires > new Date()) {
            calculatedStatus = 'TRIAL';
          } else {
            calculatedStatus = 'EXPIRED';
          }
        }
      } else if (link) {
        // Retailer bridge link fallback
        plan = 'PRO';
        planExpiresAt = link.expires_at;
        const expires = link.expires_at ? new Date(link.expires_at) : null;
        if (!expires || expires > new Date()) {
          calculatedStatus = 'PRO';
        } else {
          calculatedStatus = 'EXPIRED';
        }
      } else {
        // Absolute fallback: 24h trial from user registration
        const createdAt = u.created_at ? new Date(u.created_at) : new Date();
        const trialExpires = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
        if (trialExpires > new Date()) {
          calculatedStatus = 'TRIAL';
        } else {
          calculatedStatus = 'EXPIRED';
        }
      }

      // Check if user has been upgraded by a retailer
      let upgradedBy = null;
      if (link) {
        const retailerUser = users.find(r => r.id === link.retailer_id);
        upgradedBy = {
          retailerId: link.retailer_id,
          name: retailerUser?.user_metadata?.name || 'Unknown Retailer',
          email: retailerUser?.email || '',
          phone: retailerUser?.phone || '',
          activated_at: link.activated_at || link.created_at,
        };
      }

      return {
        id:              u.id,
        phone:           u.phone || '',
        email:           u.email || '',
        name:            u.user_metadata?.name || 'Anonymous User',
        role:            userRole,
        plan,
        plan_expires_at: planExpiresAt,
        created_at:      u.created_at,
        calculatedStatus,
        upgradedBy,
      };
    });

    let filtered = mappedAllUsers;

    // 5. Apply Search
    const searchVal = search as string;
    if (searchVal) {
      const term = searchVal.toLowerCase();
      filtered = filtered.filter(u => 
        (u.email && u.email.toLowerCase().includes(term)) ||
        (u.phone && u.phone.includes(term)) ||
        (u.name && u.name.toLowerCase().includes(term))
      );
    }

    // 6. Apply Filter (ALL, PRO, TRIAL, EXPIRED, ADMIN, RETAILER, RETAILER_UPGRADED, DIRECT_SIGNUP or specific role)
    const filterVal = (filter || role) as string;
    if (filterVal && filterVal !== 'ALL') {
      if (filterVal === 'PRO') {
        filtered = filtered.filter(u => u.calculatedStatus === 'PRO');
      } else if (filterVal === 'TRIAL') {
        filtered = filtered.filter(u => u.calculatedStatus === 'TRIAL');
      } else if (filterVal === 'EXPIRED') {
        filtered = filtered.filter(u => u.calculatedStatus === 'EXPIRED');
      } else if (filterVal === 'ADMIN') {
        filtered = filtered.filter(u => u.calculatedStatus === 'ADMIN' || u.role === 'admin');
      } else if (filterVal === 'RETAILER') {
        filtered = filtered.filter(u => u.role === 'retailer');
      } else if (filterVal === 'RETAILER_UPGRADED') {
        filtered = filtered.filter(u => u.upgradedBy !== null);
      } else if (filterVal === 'DIRECT_SIGNUP') {
        filtered = filtered.filter(u => u.role === 'customer' && u.upgradedBy === null);
      } else {
        filtered = filtered.filter(u => u.role === filterVal);
      }
    }

    // 7. Paginate the filtered results
    const total = filtered.length;
    const totalPages = Math.ceil(total / limitNum);
    const offset = (pageNum - 1) * limitNum;
    const paginatedUsers = filtered.slice(offset, offset + limitNum);

    return res.json({
      success: true,
      data: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        users: paginatedUsers,
      }
    });
  } catch (err) { next(err); }
});

/**
 * GET /api/admin/users/:userId
 * Retrieves full details for a single user, including subscription history.
 */
router.get('/users/:userId', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;

    // 1. Fetch user and their current subscription
    const { data: user, error: userErr } = await supabaseAdmin
      .from('users')
      .select('*, subscriptions(*)')
      .eq('id', userId)
      .maybeSingle();

    if (userErr) throw userErr;
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Could not find the requested user',
      });
      return;
    }

    // 2. Fetch manual activation audit logs from subscription_history
    const { data: dbHistory, error: historyErr } = await supabaseAdmin
      .from('subscription_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (historyErr) {
      console.error('[Admin Single User History Fetch Error]:', historyErr);
    }
    const history = dbHistory || [];

    // 3. Fetch retailer link if exists to show who upgraded this customer
    let upgradedBy = null;
    let link = null;
    try {
      const { data: dbLink } = await supabaseAdmin
        .from('retailer_customers')
        .select('*')
        .eq('customer_id', userId)
        .maybeSingle();

      if (dbLink) {
        link = dbLink;
        const { data: { user: retailerUser } } = await supabaseAdmin.auth.admin.getUserById(dbLink.retailer_id);
        if (retailerUser) {
          upgradedBy = {
            retailerId: dbLink.retailer_id,
            name: retailerUser.user_metadata?.name || 'Unknown Retailer',
            email: retailerUser.email || '',
            phone: retailerUser.phone || '',
            activated_at: dbLink.activated_at || dbLink.created_at,
          };
        }
      }
    } catch (err) {
      console.error('[Admin Single User upgradedBy Fetch Error]:', err);
    }

    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    // Determine status aligned with users list logic
    const sub = user.subscriptions?.[0] || user.subscriptions || null;
    let status: 'TRIAL' | 'PRO' | 'EXPIRED' | 'ADMIN' = 'EXPIRED';
    const isUserAdmin = (user.email && adminEmails.includes(user.email.toLowerCase())) || user.user_metadata?.is_admin === true || user.user_metadata?.role === 'admin';

    if (isUserAdmin) {
      status = 'ADMIN';
    } else if (sub) {
      if (sub.plan === 'PRO') {
        const expires = sub.expires_at ? new Date(sub.expires_at) : null;
        if (!expires || expires > new Date()) {
          status = 'PRO';
        } else {
          status = 'EXPIRED';
        }
      } else {
        // FREE/TRIAL check
        const trialExpires = sub.trial_expires_at 
          ? new Date(sub.trial_expires_at)
          : new Date(new Date(sub.created_at || user.created_at).getTime() + 24 * 60 * 60 * 1000);
        if (trialExpires > new Date()) {
          status = 'TRIAL';
        } else {
          status = 'EXPIRED';
        }
      }
    } else if (link) {
      // Retailer bridge link fallback
      const expires = link.expires_at ? new Date(link.expires_at) : null;
      if (!expires || expires > new Date()) {
        status = 'PRO';
      } else {
        status = 'EXPIRED';
      }
    } else {
      // Absolute fallback: 24h trial from user registration
      const createdAt = user.created_at ? new Date(user.created_at) : new Date();
      const trialExpires = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
      if (trialExpires > new Date()) {
        status = 'TRIAL';
      } else {
        status = 'EXPIRED';
      }
    }

    const subWithNote = sub ? {
      ...sub,
      payment_note: user.user_metadata?.payment_note || null,
    } : null;

    res.json({
      success: true,
      data: {
        ...user,
        is_admin: isUserAdmin,
        subscription: subWithNote,
        calculatedStatus: status,
        history: history || [],
        upgradedBy,
      },
    });
  } catch (error: any) {
    console.error('[Admin Single User Fetch Error]:', error);
    res.status(500).json({
      success: false,
      error: 'USER_DETAIL_FETCH_FAILED',
      message: error.message || 'Failed to retrieve user details',
    });
  }
});

/**
 * POST /api/admin/users/:userId/activate
 * Manually activates or extends a user's PRO plan by 30 days.
 */
router.post('/users/:userId/activate', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const { payment_note = '', duration = '30_DAYS' } = req.body;
    const adminEmail = req.user.email || 'Admin';

    // 1. Fetch current subscription details
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (subErr) throw subErr;

    const now = new Date();
    let newExpiresStr: string | null = null;
    const isNewSubscription = !sub;

    if (duration !== 'LIFETIME') {
      let newExpires: Date;
      if (sub) {
        let currentExpires = sub.expires_at ? new Date(sub.expires_at) : null;
        // Calculate new expiration date (extend by 30 days)
        if (sub.plan === 'PRO' && currentExpires && currentExpires > now) {
          newExpires = new Date(currentExpires.getTime() + 30 * 24 * 60 * 60 * 1000);
        } else {
          newExpires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        }
      } else {
        newExpires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      }
      newExpiresStr = newExpires.toISOString();
    }

    if (sub) {
      // 2. Update the subscription in Supabase
      const { error: updateErr } = await supabaseAdmin
        .from('subscriptions')
        .update({
          plan: 'PRO',
          starts_at: now.toISOString(),
          expires_at: newExpiresStr,
        })
        .eq('user_id', userId);

      if (updateErr) throw updateErr;
    } else {
      // 2. Insert the subscription in Supabase
      const { error: insertErr } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan: 'PRO',
          starts_at: now.toISOString(),
          expires_at: newExpiresStr,
        });

      if (insertErr) throw insertErr;
    }

    // 4. Update the user metadata in Supabase Auth dynamically so Next.js middleware and frontend is updated instantly
    const { error: authMetaErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        plan: 'PRO',
        plan_expires_at: newExpiresStr,
        payment_note,
      },
    });

    if (authMetaErr) {
      console.error('[Auth Metadata Update Failed]:', authMetaErr);
    }

    // 5. Log manual activation into subscription_history for auditing
    const { error: historyLogErr } = await supabaseAdmin
      .from('subscription_history')
      .insert({
        user_id: userId,
        activated_by: adminEmail,
        plan: 'PRO',
        starts_at: now.toISOString(),
        expires_at: newExpiresStr || '2099-12-31T23:59:59.000Z',
        payment_note: payment_note || 'Manual activation by Admin',
      });

    if (historyLogErr) {
      console.error('[Admin Subscription History Log Failed]:', historyLogErr);
    }

    res.json({
      success: true,
      message: 'Plan manual activation successful',
      data: {
        plan: 'PRO',
        expires_at: newExpiresStr,
      },
    });
  } catch (error: any) {
    console.error('[Admin Manual Activation Error]:', error);
    res.status(500).json({
      success: false,
      error: 'ACTIVATION_FAILED',
      message: error.message || 'Failed to manually activate plan',
    });
  }
});

/**
 * POST /api/admin/users/:userId/toggle-admin
 * Dynamically promotes/demotes a user to/from administrative role.
 */
router.post('/users/:userId/toggle-admin', async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId as string;
    const currentAdminId = req.user.id;
    const currentAdminEmail = req.user.email;

    // 1. Fetch user to toggle
    const { data: targetUser, error: userErr } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (userErr) throw userErr;
    if (!targetUser) {
      res.status(404).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'Could not find the target user',
      });
      return;
    }

    // Prevent self-demotion
    if (userId === currentAdminId) {
      res.status(400).json({
        success: false,
        error: 'SELF_DEMOTION_FORBIDDEN',
        message: 'நீங்களே உங்களது நிர்வாகி பதவியை நீக்க முடியாது · You cannot demote yourself from admin status',
      });
      return;
    }

    // Prevent demoting bootstrap admins listed in ADMIN_EMAILS
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (targetUser.email && adminEmails.includes(targetUser.email.toLowerCase())) {
      res.status(400).json({
        success: false,
        error: 'BOOTSTRAP_DEMOTION_FORBIDDEN',
        message: 'அடிப்படை சூழல் கோப்பு நிர்வாகிகளை நீக்க முடியாது · Bootstrap environment admins cannot be demoted',
      });
      return;
    }

    // Determine current admin status of target user (from auth user metadata or bootstrap list)
    const { data: authUser, error: authUserErr } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (authUserErr) throw authUserErr;

    const currentTargetIsAdmin = authUser.user?.user_metadata?.is_admin === true ||
      (targetUser.email && adminEmails.includes(targetUser.email.toLowerCase()));

    const newAdminStatus = !currentTargetIsAdmin;

    // 3. Sync auth.users metadata for instant session middleware gate reflection
    const { error: authMetaErr } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        is_admin: newAdminStatus,
      },
    });

    if (authMetaErr) {
      console.error('[Admin Metadata Sync Error]:', authMetaErr);
    }

    res.json({
      success: true,
      message: newAdminStatus
        ? 'நிர்வாகி அந்தஸ்து வெற்றிகரமாக வழங்கப்பட்டது · Admin role successfully granted'
        : 'நிர்வாகி அந்தஸ்து வெற்றிகரமாக நீக்கப்பட்டது · Admin role successfully revoked',
      data: {
        userId,
        is_admin: newAdminStatus,
      },
    });
  } catch (error: any) {
    console.error('[Admin Toggle Admin Error]:', error);
    res.status(500).json({
      success: false,
      error: 'TOGGLE_ADMIN_FAILED',
      message: error.message || 'Failed to toggle administrative role status',
    });
  }
});

/**
 * GET /api/admin/expiring
 * Retrieves users whose subscriptions expire within the next 7 days, sorted by expiration.
 */
router.get('/expiring', async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const { data: expiringUsers, error } = await supabaseAdmin
      .from('users')
      .select('*, subscriptions!inner(*)')
      .eq('subscriptions.plan', 'PRO')
      .gt('subscriptions.expires_at', now.toISOString())
      .lte('subscriptions.expires_at', sevenDaysFromNow.toISOString())
      .order('expires_at', { foreignTable: 'subscriptions', ascending: true });

    if (error) throw error;

    const processed = (expiringUsers || []).map((u: any) => {
      const sub = u.subscriptions?.[0] || u.subscriptions || null;
      return {
        ...u,
        subscription: sub,
        daysLeft: sub
          ? Math.ceil((new Date(sub.expires_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : 0,
      };
    });

    res.json({
      success: true,
      data: processed,
    });
  } catch (error: any) {
    console.error('[Admin Expiring Fetch Error]:', error);
    res.status(500).json({
      success: false,
      error: 'EXPIRING_USERS_FETCH_FAILED',
      message: error.message || 'Failed to fetch users expiring soon',
    });
  }
});

// POST /api/admin/retailers/create — create a retailer account
router.post('/retailers/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone } = req.body;

    const { data: user, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      phone,
      email_confirm: true,
      phone_confirm: true,
      user_metadata: {
        name,
        role: 'retailer',
      },
    });

    if (error) {
      res.status(400).json({ success: false, error: 'CREATE_RETAILER_FAILED', message: error.message });
      return;
    }

    res.status(201).json({
      success: true,
      data: {
        retailer: {
          id:    user.user.id,
          email: user.user.email,
          name:  user.user.user_metadata.name,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
});

// GET /api/admin/retailers/:id/customers — see any retailer's customer list
router.get('/retailers/:id/customers', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('retailer_customers')
      .select('customer_id, activated_at, plan_given, expires_at')
      .eq('retailer_id', id);

    if (error) {
      res.status(400).json({ success: false, error: 'DB_ERROR', message: error.message });
      return;
    }

    const customerIds = data?.map(item => item.customer_id) || [];
    if (customerIds.length === 0) {
      res.json({ success: true, customers: [] });
      return;
    }

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
        plan_given:   link.plan_given,
        expires_at:   link.expires_at,
      };
    });

    res.json({ success: true, customers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
});

// PUT /api/admin/users/:id/role — change any user's role (retailer ↔ customer only)
router.put('/users/:id/role', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Block admin role assignment via this endpoint — use /toggle-admin instead
    if (!['retailer', 'customer'].includes(role)) {
      res.status(400).json({ success: false, message: 'Invalid role. Only "retailer" and "customer" are assignable via this endpoint.' });
      return;
    }

    const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(id as string, {
      user_metadata: { role },
    });

    if (error) {
      res.status(400).json({ success: false, error: 'UPDATE_FAILED', message: error.message });
      return;
    }

    // Audit log: role change is a sensitive privileged action
    const adminEmail = req.user?.email || req.user?.id || 'unknown';
    await supabaseAdmin
      .from('subscription_history')
      .insert({
        user_id: id,
        activated_by: adminEmail,
        plan: 'ROLE_CHANGE',
        payment_note: `Role changed to "${role}" by admin (${adminEmail})`,
        starts_at: new Date().toISOString(),
        expires_at: null,
      })
      .then(({ error: logErr }) => {
        if (logErr) console.error('[Role Change Audit Log Failed]:', logErr);
      });

    res.json({
      success: true,
      message: `Successfully set role to ${role}`,
      data: {
        user: {
          id:   user.user.id,
          role: user.user.user_metadata.role,
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'SERVER_ERROR', message: err.message });
  }
});

export default router;
