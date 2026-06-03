const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  // 1. Fetch a large list of users from Supabase Auth
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
    page:    1,
    perPage: 1000,
  });

  if (error) {
    console.error('Error fetching users:', error);
    return;
  }

  // 2. Fetch all retailer-to-customer linkages from DB
  const { data: retailerLinks } = await supabaseAdmin
    .from('retailer_customers')
    .select('*');

  const links = retailerLinks || [];

  // Let's inspect the logic specifically for a linked user: eeb47ca6-454b-452d-a964-59e759718dbf
  const u = users.find(user => user.id === 'eeb47ca6-454b-452d-a964-59e759718dbf');
  if (u) {
    console.log('--- FOUND AUTH USER ---');
    console.log(JSON.stringify(u, null, 2));

    const link = links.find(l => l.customer_id === u.id);
    console.log('\n--- FOUND LINK ---');
    console.log(JSON.stringify(link, null, 2));

    if (link) {
      const retailerUser = users.find(r => r.id === link.retailer_id);
      console.log('\n--- FOUND RETAILER USER IN AUTH ---');
      console.log(JSON.stringify(retailerUser, null, 2));

      const upgradedBy = {
        retailerId: link.retailer_id,
        name: retailerUser?.user_metadata?.name || 'Unknown Retailer',
        email: retailerUser?.email || '',
        phone: retailerUser?.phone || '',
        activated_at: link.activated_at || link.created_at,
      };

      console.log('\n--- MAPPED UPGRADED BY ---');
      console.log(JSON.stringify(upgradedBy, null, 2));
    }
  } else {
    console.log('Could not find auth user eeb47ca6-454b-452d-a964-59e759718dbf');
  }
}

run();
