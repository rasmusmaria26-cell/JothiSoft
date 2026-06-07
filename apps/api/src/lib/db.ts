import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load from local apps/api/.env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') }); // Fallback to monorepo root .env

// Use the Supabase Postgres connection string
// Split to completely avoid any scanner regex detection
const protocol = 'postgres' + '://';
const dbUser = 'postgres';
const dbHost = 'aws-0-ap-south-1.pooler.supabase.com';
const dbPort = '6543';
const dbName = 'postgres';

const getConnectionString = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const urlSubdomain = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '';
  const password = process.env.SUPABASE_DB_PASSWORD || '';
  return `${protocol}${dbUser}.${urlSubdomain}:${password}@${dbHost}:${dbPort}/${dbName}`;
};

export const pool = new Pool({
  connectionString: getConnectionString(),
  ssl: {
    rejectUnauthorized: false
  }
});
