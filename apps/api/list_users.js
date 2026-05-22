const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('id, name, phone, email, is_admin');
  
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  
  console.log('--- REGISTERED USERS ---');
  console.log(JSON.stringify(users, null, 2));
}

run();
