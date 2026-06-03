const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  console.log(`Total Auth Users: ${users.length}`);
  
  users.forEach(u => {
    console.log(`Email: ${u.email} | Phone: ${u.phone} | Role: ${u.user_metadata?.role} | IsAdmin: ${u.user_metadata?.is_admin}`);
  });
}

run();
