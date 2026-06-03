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
  const customerId = 'eeb47ca6-454b-452d-a964-59e759718dbf'; // G VIGNESHKUMAR (customer)
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  console.log('Running test upsert...');
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .upsert(
      {
        user_id:    customerId,
        plan:       'PRO',
        starts_at:  new Date().toISOString(),
        expires_at: expiresAt,
      },
      { onConflict: 'user_id' }
    )
    .select();

  if (error) {
    console.error('Upsert failed:', error);
  } else {
    console.log('Upsert succeeded! Returned data:');
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
