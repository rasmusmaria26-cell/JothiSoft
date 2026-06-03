const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById('fa33fcd3-8fa5-47b3-ae96-722206e6893b');
  if (error) {
    console.error('Error fetching auth user:', error);
  } else {
    console.log('--- AUTH USER ---');
    console.log(JSON.stringify(user, null, 2));
  }
}

run();
