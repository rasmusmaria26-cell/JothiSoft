const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const { data: dbUsers, error } = await supabaseAdmin.from('users').select('*');
  if (error) {
    console.error('Error fetching users:', error);
  } else {
    console.log('--- PUBLIC USERS IN DB ---');
    console.log(dbUsers);
  }
}

run();
