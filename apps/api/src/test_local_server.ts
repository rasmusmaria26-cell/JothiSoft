import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const API_URL = 'http://localhost:4000/api';

async function runTest() {
  try {
    const email = `test_server_test_${Date.now()}@jothisoft.in`;
    const password = 'Password123';
    const name = 'Server Test User';
    const phone = `99999${Math.floor(10000 + Math.random() * 90000)}`;

    console.log('1. Registering test user:', email);
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone, language: 'ta' })
    });

    const regJson = await regRes.json();
    console.log('Register Response:', regJson);

    if (!regJson.success) {
      throw new Error('Registration failed');
    }

    console.log('\n2. Logging in...');
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone: email, password })
    });

    const loginJson = await loginRes.json();
    console.log('Login Response success:', loginJson.success);

    if (!loginJson.success || !loginJson.data?.access_token) {
      throw new Error('Login failed');
    }

    const token = loginJson.data.access_token;
    console.log('JWT Token retrieved successfully.');

    const queryParams = {
      date: '2026-05-26',
      lat: 13.0827,
      lng: 80.2707,
      utcOffset: 5.5
    };

    console.log('\n3. Querying /panchangam/daily with language: "en"...');
    const resEn = await fetch(`${API_URL}/panchangam/daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...queryParams, language: 'en' })
    });

    const jsonEn = await resEn.json();
    console.log('English Response Data:', JSON.stringify(jsonEn.data, null, 2));

    console.log('\n4. Querying /panchangam/daily with language: "ta"...');
    const resTa = await fetch(`${API_URL}/panchangam/daily`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ ...queryParams, language: 'ta' })
    });

    const jsonTa = await resTa.json();
    console.log('Tamil Response Data:', JSON.stringify(jsonTa.data, null, 2));

  } catch (err) {
    console.error('Error in runTest:', err);
  }
}

runTest();
