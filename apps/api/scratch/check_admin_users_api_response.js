const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  // 1. Fetch users from Supabase Auth
  const { data: { users }, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (authErr) {
    console.error('Error fetching auth users:', authErr);
    return;
  }

  // 2. Fetch all retailer-to-customer linkages from DB
  const { data: links } = await supabaseAdmin
    .from('retailer_customers')
    .select('*');

  // 3. Fetch all subscriptions from DB
  const { data: dbSubs } = await supabaseAdmin
    .from('subscriptions')
    .select('*');

  // Map users exactly like in apps/api/src/routes/admin.ts
  const mapped = users.map(u => {
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const isUserAdmin = (u.email && adminEmails.includes(u.email.toLowerCase())) || u.user_metadata?.is_admin === true || u.user_metadata?.role === 'admin';
    const userRole = u.user_metadata?.role || (isUserAdmin ? 'admin' : 'customer');

    const dbSub = dbSubs.find(s => s.user_id === u.id);
    const link = links.find(l => l.customer_id === u.id);

    let calculatedStatus = 'EXPIRED';
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
      plan = 'PRO';
      planExpiresAt = link.expires_at;
      const expires = link.expires_at ? new Date(link.expires_at) : null;
      if (!expires || expires > new Date()) {
        calculatedStatus = 'PRO';
      } else {
        calculatedStatus = 'EXPIRED';
      }
    }

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
      id: u.id,
      email: u.email,
      phone: u.phone,
      name: u.user_metadata?.name || 'Anonymous',
      role: userRole,
      plan,
      plan_expires_at: planExpiresAt,
      calculatedStatus,
      upgradedBy,
    };
  });

  console.log('--- RETAILERS IN API RESPONSE ---');
  console.log(JSON.stringify(mapped.filter(u => u.role === 'retailer'), null, 2));

  console.log('\n--- UPGRADED BY RETAILER IN API RESPONSE ---');
  console.log(JSON.stringify(mapped.filter(u => u.upgradedBy !== null), null, 2));
}

run();
