import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { calculateHoroscope } from './services/horoscope.service';

async function main() {
  console.log('Testing horoscope calculation...');
  try {
    const result = await calculateHoroscope('1990-01-01', '12:00', 13.0827, 80.2707, 5.5, 'ta');
    console.log('SUCCESS!');
    console.log('Planets returned:', result.planets);
  } catch (error) {
    console.error('ERROR:', error);
  }
}

main();
