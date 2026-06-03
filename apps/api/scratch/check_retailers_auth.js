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
  const { data: { users }, error: usersErr } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  const { data: links, error: linksErr } = await supabaseAdmin
    .from('retailer_customers')
    .select('*');

  console.log(`Loaded ${users.length} users and ${links.length} retailer-customer links.`);

  for (const link of links) {
    const customer = users.find(u => u.id === link.customer_id);
    const retailer = users.find(u => u.id === link.retailer_id);

    console.log(`\nLink ID: ${link.id}`);
    console.log(`Customer ID: ${link.customer_id} -> ${customer ? customer.email || customer.phone : 'NOT FOUND in listUsers'}`);
    console.log(`Retailer ID: ${link.retailer_id} -> ${retailer ? retailer.email || retailer.phone : 'NOT FOUND in listUsers'}`);
    if (retailer) {
      console.log(`Retailer metadata:`, JSON.stringify(retailer.user_metadata, null, 2));
    }
  }
}

run();
