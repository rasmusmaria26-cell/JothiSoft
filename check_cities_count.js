const url = 'https://mnuwoeayngxmsqtpfvpy.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udXdvZWF5bmd4bXNxdHBmdnB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE3NTM2OCwiZXhwIjoyMDk0NzUxMzY4fQ.Q42hcxkNwQv9W7uYpAj4aYBWOoFH1201N9KZDGoJxN4';

async function main() {
  try {
    const res = await fetch(`${url}/rest/v1/cities?select=count`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'count=exact'
      }
    });
    console.log('Cities response headers:', res.headers.get('content-range'));
    const data = await res.json();
    console.log('Cities data:', data);
  } catch (err) {
    console.error('Failed to get cities count:', err);
  }
}

main();
