import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { supabaseAdmin } from './lib/supabase';

async function test() {
  try {
    const { data, error } = await supabaseAdmin
      .from('cities')
      .select('*')
      .or(`name.ilike.%Ramanathapuram%,ascii_name.ilike.%Ramanathapuram%`);

    console.log('Error:', error);
    console.log('Data:', data);
  } catch (err) {
    console.error('Error in test:', err);
  }
}

test();
