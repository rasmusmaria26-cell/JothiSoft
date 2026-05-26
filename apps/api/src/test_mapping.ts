import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { getDailyPanchangam } from './services/panchangam.service';

async function test() {
  try {
    const date = '2026-05-26';
    const lat = 13.0827;
    const lng = 80.2707;
    const utcOffset = 5.5;

    console.log('Calling getDailyPanchangam in English...');
    const p = await getDailyPanchangam(date, lat, lng, utcOffset, 'en');

    console.log('Raw Prokerala keys in p:', Object.keys(p || {}));

    const normalizeKaranam = (name: string): string => {
      const lower = name.toLowerCase();
      if (lower.includes('bava')) return 'Bava';
      if (lower.includes('balava')) return 'Balava';
      if (lower.includes('kaulava')) return 'Kaulava';
      if (lower.includes('taitila')) return 'Taitila';
      if (lower.includes('garaja') || lower.includes('gara')) return 'Garaja';
      if (lower.includes('vanija') || lower.includes('vanise')) return 'Vanija';
      if (lower.includes('vishti') || lower.includes('bhadra')) return 'Vishti';
      if (lower.includes('shakuni')) return 'Shakuni';
      if (lower.includes('chatushpada')) return 'Chatushpada';
      if (lower.includes('naga')) return 'Naga';
      if (lower.includes('kimstughna') || lower.includes('kintughna')) return 'Kimstughna';
      return name;
    };

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

    let yogaVal = { name: 'Siddhi', index: 1 };
    if (p.yoga && p.yoga.length > 0) {
      yogaVal = {
        name: p.yoga[0].name || 'Siddhi',
        index: p.yoga[0].id !== undefined ? (p.yoga[0].id + 1) : (p.yoga[0].index || 1)
      };
    }

    let karanamVal = { name: 'Bava' };
    if (p.karanam && p.karanam.length > 0) {
      karanamVal = {
        name: normalizeKaranam(p.karanam[0].name || 'Bava')
      };
    }

    console.log('Mapped Results:');
    console.log('Tithi:', tithiVal);
    console.log('Paksha:', pakshaVal);
    console.log('Nakshatra:', nakshatraVal);
    console.log('Yoga:', yogaVal);
    console.log('Karanam:', karanamVal);
    console.log('Raw response:');
    console.log(JSON.stringify(p, null, 2));
  } catch (err) {
    console.error('Error in test:', err);
  }
}

test();
