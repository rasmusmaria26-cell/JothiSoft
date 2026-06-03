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
  // 1. Fetch links
  const { data: links, error: linksErr } = await supabaseAdmin
    .from('retailer_customers')
    .select('*');
  
  if (linksErr) {
    console.error('Error fetching retailer_customers:', linksErr);
  } else {
    console.log('--- RETAILER CUSTOMER LINKS ---');
    console.log(JSON.stringify(links, null, 2));
  }

  // 2. Fetch auth users
  const { data: { users }, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (authErr) {
    console.error('Error fetching auth users:', authErr);
  } else {
    console.log('\n--- AUTH USERS WITH ROLE IN METADATA ---');
    const roleUsers = users.map(u => ({
      id: u.id,
      email: u.email,
      phone: u.phone,
      name: u.user_metadata?.name,
      role: u.user_metadata?.role,
      plan: u.user_metadata?.plan,
    }));
    console.log(JSON.stringify(roleUsers, null, 2));
  }
}

run();
