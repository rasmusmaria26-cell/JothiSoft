const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const targetEmail = 'test3@gmail.com';
  console.log(`Searching for user: ${targetEmail}`);
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = users.find(u => u.email === targetEmail);
  if (!user) {
    console.error(`User with email ${targetEmail} not found`);
    return;
  }

  console.log(`Found user: ${user.id}, email_confirmed_at: ${user.email_confirmed_at}`);
  
  const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { email_confirm: true }
  );

  if (updateError) {
    console.error('Error updating user:', updateError);
  } else {
    console.log('Successfully confirmed email for user:', data.user.email);
  }
}

run();
