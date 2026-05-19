const url = 'https://mnuwoeayngxmsqtpfvpy.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udXdvZWF5bmd4bXNxdHBmdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzUzNjgsImV4cCI6MjA5NDc1MTM2OH0.n9mnjeBa9RciS98OoRIJ58vIcJamnu_kRwUiKkTdEoc';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udXdvZWF5bmd4bXNxdHBmdnB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE3NTM2OCwiZXhwIjoyMDk0NzUxMzY4fQ.Q42hcxkNwQv9W7uYpAj4aYBWOoFH1201N9KZDGoJxN4';

async function main() {
  console.log('--- Checking users in public.users ---');
  try {
    const res = await fetch(`${url}/rest/v1/users?select=*`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });
    const users = await res.json();
    console.log('public.users:', users);
  } catch (err) {
    console.error('Failed to get public.users:', err);
  }

  console.log('--- Checking birth_profiles ---');
  try {
    const res = await fetch(`${url}/rest/v1/birth_profiles?select=*`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });
    const profiles = await res.json();
    console.log('birth_profiles:', profiles);
  } catch (err) {
    console.error('Failed to get birth_profiles:', err);
  }

  console.log('--- Checking auth.users via admin API ---');
  try {
    const res = await fetch(`${url}/auth/v1/admin/users`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });
    const authData = await res.json();
    console.log('auth.users:', JSON.stringify(authData, null, 2));
  } catch (err) {
    console.error('Failed to get auth.users:', err);
  }
}

main();
