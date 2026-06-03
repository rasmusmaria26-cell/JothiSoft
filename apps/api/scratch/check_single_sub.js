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
  const { data: sub, error } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', 'eeb47ca6-454b-452d-a964-59e759718dbf')
    .maybeSingle();

  console.log('--- SUBSCRIPTION RECORD ---');
  console.log(JSON.stringify(sub, null, 2));
}

run();
