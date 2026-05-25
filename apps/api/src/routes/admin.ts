import { Router, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { authenticate } from '../middleware/auth';
import { requireAdmin } from '../middleware/adminAuth';

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

/**
 * GET /api/admin/users
 * Returns a paginated, filterable, and searchable list of registered users.
 */
router.get('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = (req.query.search as string || '').trim();
    
    // Map uppercase/lowercase filter from frontend to the expected backend key
    const filterInput = (req.query.filter as string || '').trim().toUpperCase();
    let filter = '';
    if (filterInput === 'PRO') filter = 'active_pro';
    else if (filterInput === 'TRIAL') filter = 'active_trial';
    else if (filterInput === 'EXPIRED') filter = 'expired';
    else if (filterInput === 'ADMIN') filter = 'admin';
    else if (filterInput && filterInput !== 'ALL') {
      filter = filterInput.toLowerCase();
    }

    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const now = new Date().toISOString();

    let selectString = '*, subscriptions(plan, expires_at, created_at)';

    // If filtering on subscription attributes, use inner join to filter database-side
    if (filter === 'active_trial' || filter === 'active_pro' || filter === 'expired') {
      selectString = '*, subscriptions!inner(plan, expires_at, created_at)';
    }

    let query = supabaseAdmin
      .from('users')
      .select(selectString, { count: 'exact' });

    // Apply search queries
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Apply filters
    if (filter === 'active_trial') {
      query = query.eq('subscriptions.plan', 'FREE').gt('subscriptions.created_at', twentyFourHoursAgo);
    } else if (filter === 'active_pro') {
      query = query.eq('subscriptions.plan', 'PRO').gt('subscriptions.expires_at', now);
    } else if (filter === 'expired') {
      query = query.or(`plan.eq.PRO,expires_at.lte.${now},plan.eq.FREE,created_at.lte.${twentyFourHoursAgo}`, { foreignTable: 'subscriptions' });
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false }).range(start, end);

    console.log('[DEBUG AdminUsers] req.query:', req.query);
    const { data: users, count, error } = await query;
    if (error) {
      console.error('[DEBUG AdminUsers] query error:', error);
      throw error;
    }
    console.log('[DEBUG AdminUsers] users returned from DB count:', users?.length);

    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    // Map to include calculated status for convenience
    let processedUsers = (users || []).map((u: any) => {
      const sub = u.subscriptions?.[0] || u.subscriptions || null;
      let status = 'EXPIRED';

      const isUserAdmin = (u.email && adminEmails.includes(u.email.toLowerCase())) || u.user_metadata?.is_admin === true;

      if (isUserAdmin) {
        status = 'ADMIN';
      } else if (sub) {
        if (sub.plan === 'PRO' && sub.expires_at && new Date(sub.expires_at) > new Date()) {
          status = 'PRO';
        } else if (sub.plan === 'FREE' && sub.created_at) {
          const trialExpires = new Date(new Date(sub.created_at).getTime() + 24 * 60 * 60 * 1000);
          if (trialExpires > new Date()) {
            status = 'TRIAL';
          }
        }
      }

      const subWithNote = sub ? {
        ...sub,
        payment_note: u.user_metadata?.payment_note || null,
      } : null;

      return {
        ...u,
        is_admin: isUserAdmin,
        subscription: subWithNote,
        calculatedStatus: status,
      };
    });

    // Handle in-memory admin filter if requested
    if (filter === 'admin') {
      processedUsers = processedUsers.filter((u: any) => u.is_admin);
    }

    res.json({
      success: true,
      data: {
        users: processedUsers,
        total: count || processedUsers.length,
        page,
        limit,
        totalPages: Math.ceil((count || processedUsers.length) / limit),
      },
    });
  } catch (error: any) {
    console.error('[Admin Users Search Error]:', error);
    res.status(500).json({
      success: false,
      error: 'USERS_FETCH_FAILED',
      message: error.message || 'Failed to search or filter users',
    });
  }
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

    // 2. Fetch manual activation audit logs (mocked as empty since subscription_history does not exist)
    const history: any[] = [];

    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    // Determine status
    const sub = user.subscriptions?.[0] || user.subscriptions || null;
    let status = 'EXPIRED';
    const isUserAdmin = (user.email && adminEmails.includes(user.email.toLowerCase())) || user.user_metadata?.is_admin === true;

    if (isUserAdmin) {
      status = 'ADMIN';
    } else if (sub) {
      if (sub.plan === 'PRO' && sub.expires_at && new Date(sub.expires_at) > new Date()) {
        status = 'PRO';
      } else if (sub.plan === 'FREE' && sub.created_at) {
        const trialExpires = new Date(new Date(sub.created_at).getTime() + 24 * 60 * 60 * 1000);
        if (trialExpires > new Date()) {
          status = 'TRIAL';
        }
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
    const { payment_note = '' } = req.body;
    const adminEmail = req.user.email || 'Admin';

    // 1. Fetch current subscription details
    const { data: sub, error: subErr } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (subErr) throw subErr;

    const now = new Date();
    let newExpires: Date;
    const isNewSubscription = !sub;

    if (sub) {
      let currentExpires = sub.expires_at ? new Date(sub.expires_at) : null;
      // Calculate new expiration date (extend by 30 days)
      if (sub.plan === 'PRO' && currentExpires && currentExpires > now) {
        newExpires = new Date(currentExpires.getTime() + 30 * 24 * 60 * 60 * 1000);
      } else {
        newExpires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      }

      const newExpiresStr = newExpires.toISOString();

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
      newExpires = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const newExpiresStr = newExpires.toISOString();

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

    const newExpiresStr = newExpires.toISOString();

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

export default router;
