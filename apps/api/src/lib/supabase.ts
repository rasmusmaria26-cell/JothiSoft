import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Force load env from absolute paths
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

// Admin client to bypass RLS and execute server-side operations securely.
// IMPORTANT: This instance must NEVER be used for token/auth verification (getUser),
// as doing so pollutes the singleton's Authorization header with the user's JWT,
// causing subsequent admin operations to fail with RLS violations!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

// Dedicated client for user token/auth verification.
// Using this instance prevents credentials pollution on the administrative client.
export const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
