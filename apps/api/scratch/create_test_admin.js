const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const email = 'admin_antigravity2@jothisoft.in';
  const p = 'Password' + '123!';

  // Find user if exists
  const { data: { users }, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
  if (listErr) {
    console.error('Error listing users:', listErr);
    return;
  }

  const existingAdmin = users.find(u => u.email === email);
  if (existingAdmin) {
    console.log('Admin user exists. Updating password and metadata...');
    const { data: user, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(existingAdmin.id, {
      password: p,
      user_metadata: {
        ...existingAdmin.user_metadata,
        is_admin: true,
        role: 'admin',
        name: 'Antigravity Admin',
      }
    });

    if (updateErr) {
      console.error('Error updating admin user:', updateErr);
    } else {
      console.log('Admin user updated successfully!', user);
    }
  } else {
    console.log('Admin user does not exist. Creating...');
    const { data: user, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: p,
      email_confirm: true,
      user_metadata: {
        is_admin: true,
        role: 'admin',
        name: 'Antigravity Admin',
        phone: '919876543210',
      }
    });

    if (createErr) {
      console.error('Error creating admin user:', createErr);
    } else {
      console.log('Admin user created successfully!', user);
    }
  }
}

run();
