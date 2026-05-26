import { supabaseAdmin } from './src/lib/supabase';

async function testRLS() {
  console.log('Testing Supabase Admin Client...');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Service Key length:', process.env.SUPABASE_SERVICE_KEY?.length);
  
  // Try to list a single record or insert a mock
  const mockRetailerId = '00000000-0000-0000-0000-000000000000';
  const mockCustomerId = '00000000-0000-0000-0000-000000000000';
  
  console.log('Attempting upsert on retailer_customers...');
  const { data, error } = await supabaseAdmin
    .from('retailer_customers')
    .upsert({
      retailer_id: 'd89b142c-ca01-447b-832f-b4437a34651f', // Use dummy valid UUID
      customer_id: 'd89b142c-ca01-447b-832f-b4437a34651f',
      plan_given: 'PRO',
      expires_at: new Date().toISOString()
    });
    
  if (error) {
    console.error('Error during upsert:', error);
  } else {
    console.log('Upsert succeeded!', data);
  }
}

testRLS();
