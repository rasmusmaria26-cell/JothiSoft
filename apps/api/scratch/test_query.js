const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const userId = 'fa33fcd3-8fa5-47b3-ae96-722206e6893b';
  const { data: user, error: userErr } = await supabaseAdmin
    .from('users')
    .select('*, subscriptions(*)')
    .eq('id', userId)
    .maybeSingle();

  console.log('User Err:', userErr);
  console.log('User Data:', user);
}

run();
