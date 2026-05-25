const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  try {
    const { data: users, error: usersErr } = await supabaseAdmin
      .from('users')
      .select('*');
    if (usersErr) throw usersErr;

    console.log('--- USERS IN DATABASE ---');
    console.log(users);

    const { data: subs, error: subsErr } = await supabaseAdmin
      .from('subscriptions')
      .select('*');
    if (subsErr) throw subsErr;

    console.log('--- SUBSCRIPTIONS IN DATABASE ---');
    console.log(subs);

  } catch (err) {
    console.error(err);
  }
}

test();
