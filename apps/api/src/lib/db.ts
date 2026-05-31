import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load from local apps/api/.env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') }); // Fallback to monorepo root .env

// Use the Supabase Postgres connection string
const connectionString = process.env.DATABASE_URL || 
  `postgres://postgres.${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '')}:${process.env.SUPABASE_DB_PASSWORD}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;

export const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
