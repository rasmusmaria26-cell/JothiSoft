import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { getAccessToken, prokeralaFetch } from './lib/prokerala';

async function main() {
  try {
    console.log('Fetching access token...');
    const token = await getAccessToken();
    console.log('Token fetched successfully!');

    const params = {
      datetime: '2026-05-26T00:00:00+05:30',
      coordinates: '13.0827,80.2707', // Chennai
      ayanamsa: '1',
      la: 'ta',
    };

    console.log('Querying panchang endpoint in Tamil...');
    const res = await prokeralaFetch('/astrology/panchang', params);
    console.log('Response metadata:', JSON.stringify(res.metadata, null, 2));
    console.log('Response data:', JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('Error running test:', err);
  }
}

main();
