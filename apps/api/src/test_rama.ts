import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { getDailyPanchangam } from './services/panchangam.service';

async function test() {
  try {
    const date = '2026-05-26';
    const lat = 9.3639; // Ramanathapuram lat
    const lng = 78.8395; // Ramanathapuram lng
    const utcOffset = 5.5;

    console.log('Calling getDailyPanchangam in English...');
    const p = await getDailyPanchangam(date, lat, lng, utcOffset, 'en');

    let tithiVal = { name: 'Dwitiya', index: 2 };
    let pakshaVal = 'Shukla';
    if (p.tithi && p.tithi.length > 0) {
      tithiVal = {
        name: p.tithi[0].name || 'Dwitiya',
        index: p.tithi[0].id !== undefined ? p.tithi[0].id : (p.tithi[0].index || 2)
      };
      const rawPaksha = p.tithi[0].paksha || 'Shukla';
      pakshaVal = rawPaksha.toLowerCase().includes('krishna') ? 'Krishna' : 'Shukla';
    }

    let nakshatraVal = { name: 'Ashwini', index: 1, pada: 1 };
    if (p.nakshatra && p.nakshatra.length > 0) {
      nakshatraVal = {
        name: p.nakshatra[0].name || 'Ashwini',
        index: p.nakshatra[0].id !== undefined ? (p.nakshatra[0].id + 1) : (p.nakshatra[0].index || 1),
        pada: p.nakshatra[0].pada || 1
      };
    }

    console.log('Mapped Results for Ramanathapuram:');
    console.log('Tithi:', tithiVal);
    console.log('Paksha:', pakshaVal);
    console.log('Nakshatra:', nakshatraVal);
  } catch (err) {
    console.error('Error in test:', err);
  }
}

test();
