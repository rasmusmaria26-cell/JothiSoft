const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '../../.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function test() {
  try {
    let selectString = '*, subscriptions(plan, expires_at, created_at)';
    
    let query = supabaseAdmin
      .from('users')
      .select(selectString, { count: 'exact' });

    query = query.order('created_at', { ascending: false }).range(0, 9);

    const { data: users, count, error } = await query;
    if (error) {
      console.error('--- QUERY ERROR ---');
      console.error(error);
      return;
    }

    console.log('--- QUERY SUCCESS ---');
    console.log('Count:', count);
    console.log('Users returned:', users.length);
    console.log(JSON.stringify(users, null, 2));

  } catch (err) {
    console.error(err);
  }
}

test();
