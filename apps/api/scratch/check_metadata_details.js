const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  
  const { data: retailerLinks } = await supabaseAdmin
    .from('retailer_customers')
    .select('*');
    
  const links = retailerLinks || [];
  
  const targetUser = users.find(u => u.email === '98765@gmail.com');
  if (targetUser) {
    console.log('--- 98765@gmail.com ---');
    console.log('Metadata:', JSON.stringify(targetUser.user_metadata, null, 2));
    const link = links.find(l => l.customer_id === targetUser.id);
    console.log('Link:', JSON.stringify(link, null, 2));
  }

  const targetUser2 = users.find(u => u.email === 'sosrjpm22@gmail.com');
  if (targetUser2) {
    console.log('--- sosrjpm22@gmail.com ---');
    console.log('Metadata:', JSON.stringify(targetUser2.user_metadata, null, 2));
    const link = links.find(l => l.customer_id === targetUser2.id);
    console.log('Link:', JSON.stringify(link, null, 2));
  }
}

run();
