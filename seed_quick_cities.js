const url = 'https://mnuwoeayngxmsqtpfvpy.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1udXdvZWF5bmd4bXNxdHBmdnB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTE3NTM2OCwiZXhwIjoyMDk0NzUxMzY4fQ.Q42hcxkNwQv9W7uYpAj4aYBWOoFH1201N9KZDGoJxN4';

const cities = [
  { name: 'Ramanathapuram', ascii_name: 'Ramanathapuram', state: 'Tamil Nadu', lat: 9.3667, lng: 78.8333, utc_offset: 5.50, population: 61977 },
  { name: 'Chennai', ascii_name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, utc_offset: 5.50, population: 4646732 },
  { name: 'Madurai', ascii_name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198, utc_offset: 5.50, population: 1017865 },
  { name: 'Coimbatore', ascii_name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558, utc_offset: 5.50, population: 959811 },
  { name: 'Tiruchirappalli', ascii_name: 'Tiruchirappalli', state: 'Tamil Nadu', lat: 10.7905, lng: 78.7047, utc_offset: 5.50, population: 847387 },
  { name: 'Salem', ascii_name: 'Salem', state: 'Tamil Nadu', lat: 11.6643, lng: 78.1460, utc_offset: 5.50, population: 696760 },
  { name: 'Tirunelveli', ascii_name: 'Tirunelveli', state: 'Tamil Nadu', lat: 8.7139, lng: 77.7567, utc_offset: 5.50, population: 475476 },
  { name: 'Vellore', ascii_name: 'Vellore', state: 'Tamil Nadu', lat: 12.9165, lng: 79.1325, utc_offset: 5.50, population: 185803 },
  { name: 'Erode', ascii_name: 'Erode', state: 'Tamil Nadu', lat: 11.3410, lng: 77.7172, utc_offset: 5.50, population: 157101 },
  { name: 'Thoothukudi', ascii_name: 'Thoothukudi', state: 'Tamil Nadu', lat: 8.7642, lng: 78.1348, utc_offset: 5.50, population: 237830 },
  { name: 'Thanjavur', ascii_name: 'Thanjavur', state: 'Tamil Nadu', lat: 10.7870, lng: 79.1378, utc_offset: 5.50, population: 222943 },
  { name: 'Nagercoil', ascii_name: 'Nagercoil', state: 'Tamil Nadu', lat: 8.1833, lng: 77.4119, utc_offset: 5.50, population: 224849 },
  { name: 'Dindigul', ascii_name: 'Dindigul', state: 'Tamil Nadu', lat: 10.3673, lng: 77.9803, utc_offset: 5.50, population: 202555 },
  { name: 'Kanchipuram', ascii_name: 'Kanchipuram', state: 'Tamil Nadu', lat: 12.8342, lng: 79.7036, utc_offset: 5.50, population: 164265 },
  { name: 'Tiruvannamalai', ascii_name: 'Tiruvannamalai', state: 'Tamil Nadu', lat: 12.2253, lng: 79.0747, utc_offset: 5.50, population: 144278 },
  { name: 'Cuddalore', ascii_name: 'Cuddalore', state: 'Tamil Nadu', lat: 11.7480, lng: 79.7680, utc_offset: 5.50, population: 158634 },
  { name: 'Kumbakonam', ascii_name: 'Kumbakonam', state: 'Tamil Nadu', lat: 10.9617, lng: 79.3883, utc_offset: 5.50, population: 140156 },
  { name: 'Karaikudi', ascii_name: 'Karaikudi', state: 'Tamil Nadu', lat: 10.0747, lng: 78.7842, utc_offset: 5.50, population: 106714 },
  { name: 'Neyveli', ascii_name: 'Neyveli', state: 'Tamil Nadu', lat: 11.6000, lng: 79.4833, utc_offset: 5.50, population: 105731 },
  { name: 'Puducherry', ascii_name: 'Puducherry', state: 'Puducherry', lat: 11.9416, lng: 79.8083, utc_offset: 5.50, population: 244377 },
  { name: 'Bengaluru', ascii_name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946, utc_offset: 5.50, population: 8443675 },
  { name: 'Mumbai', ascii_name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, utc_offset: 5.50, population: 12442373 },
  { name: 'New Delhi', ascii_name: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, utc_offset: 5.50, population: 317797 },
  { name: 'Kolkata', ascii_name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, utc_offset: 5.50, population: 4496694 },
  { name: 'Hyderabad', ascii_name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, utc_offset: 5.50, population: 6809970 }
];

async function seed() {
  console.log('Seeding quick cities list into Supabase...');
  try {
    const res = await fetch(`${url}/rest/v1/cities`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(cities)
    });
    console.log('Seed response status:', res.status);
    const data = await res.json();
    console.log('Successfully seeded:', data.length, 'cities.');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

seed();
