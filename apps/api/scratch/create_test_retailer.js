const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const email = 'successastrologyservices@gmail.com';
  const p = 'Password' + '123!';

  // Find user if exists
  const { data: { users }, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
  if (listErr) {
    console.error('Error listing users:', listErr);
    return;
  }

  const existingRetailer = users.find(u => u.email === email);
  if (existingRetailer) {
    console.log('Retailer user exists. Updating password and metadata...');
    const { data: user, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(existingRetailer.id, {
      password: p,
      user_metadata: {
        ...existingRetailer.user_metadata,
        is_admin: false,
        role: 'retailer',
        name: 'G VIGNESHKUMAR',
      }
    });

    if (updateErr) {
      console.error('Error updating retailer user:', updateErr);
    } else {
      console.log('Retailer user updated successfully!', user);
    }
  } else {
    console.log('Retailer user does not exist. Creating...');
    const { data: user, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: p,
      email_confirm: true,
      user_metadata: {
        is_admin: false,
        role: 'retailer',
        name: 'G VIGNESHKUMAR',
        phone: '9659657770',
      }
    });

    if (createErr) {
      console.error('Error creating retailer user:', createErr);
    } else {
      console.log('Retailer user created successfully!', user);
    }
  }
}

run();
