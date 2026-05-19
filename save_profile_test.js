const url = 'https://mnuwoeayngxmsqtpfvpy.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udXdvZWF5bmd4bXNxdHBmdnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzUzNjgsImV4cCI6MjA5NDc1MTM2OH0.n9mnjeBa9RciS98OoRIJ58vIcJamnu_kRwUiKkTdEoc';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udXdvZWF5bmd4bXNxdHBmdnB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE3NTM2OCwiZXhwIjoyMDk0NzUxMzY4fQ.Q42hcxkNwQv9W7uYpAj4aYBWOoFH1201N9KZDGoJxN4';

const testUserId = '92a8a68b-91f3-4ab0-82fc-9d785eafbb21';

async function testWithServiceKey() {
  console.log('--- Testing Upsert with Service Key (RLS Bypassed) ---');
  
  const birthProfileData = {
    user_id: testUserId,
    name: 'Maria Rasmus',
    dob: '2004-11-26', // date format: YYYY-MM-DD
    tob: '06:30:00',   // time format: HH:MM:SS
    lat: 9.3667,       // Ramanathapuram lat
    lng: 78.8333,      // Ramanathapuram lng
    place_name: 'Ramanathapuram, Tamil Nadu'
  };

  try {
    const res = await fetch(`${url}/rest/v1/birth_profiles`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(birthProfileData)
    });
    
    const text = await res.text();
    console.log('Service key upsert response status:', res.status);
    console.log('Response body:', text);
  } catch (err) {
    console.error('Service key upsert failed:', err);
  }
}

testWithServiceKey();
