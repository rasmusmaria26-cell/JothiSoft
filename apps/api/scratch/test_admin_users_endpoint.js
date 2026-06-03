const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  try {
    const { data: { users }, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (authErr) throw authErr;

    const { data: retailerLinks, error: dbErr } = await supabaseAdmin
      .from('retailer_customers')
      .select('*');
    if (dbErr) throw dbErr;

    console.log(`Found ${retailerLinks.length} links in retailer_customers table:`);
    console.log(JSON.stringify(retailerLinks, null, 2));

    const mappedUsers = users.map(u => {
      const link = retailerLinks.find(l => l.customer_id === u.id);
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
        name: u.user_metadata?.name || 'Anonymous User',
        role: u.user_metadata?.role,
        upgradedBy,
      };
    });

    const upgradedUsers = mappedUsers.filter(u => u.upgradedBy !== null);
    console.log(`\nFound ${upgradedUsers.length} upgraded users in mapping:`);
    console.log(JSON.stringify(upgradedUsers, null, 2));
  } catch (err) {
    console.error(err);
  }
}

run();
