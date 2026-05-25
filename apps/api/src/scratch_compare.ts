import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { calculateHoroscope, calculateVimshottariDasha } from './services/horoscope.service';

async function main() {
  console.log('Testing comparison between regular and PDF horoscope...');
  try {
    const horoData = await calculateHoroscope('1990-01-01', '12:00', 13.0827, 80.2707, 5.5, 'ta');
    
    // Backend dashaResult:
    console.log('Backend current dasha from calculateHoroscope:', horoData.current_dasha);

    // Frontend dasha calculation:
    const moonPlanet = horoData.planets.find(p => p.planet.toLowerCase() === 'moon');
    if (moonPlanet) {
      const moonSignIndex = [
        'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
        'Simha', 'Kanya', 'Thula', 'Vrischika',
        'Dhanus', 'Makara', 'Kumbha', 'Meena'
      ].indexOf(moonPlanet.sign);
      const moonLongitude = (moonSignIndex * 30) + moonPlanet.sign_degree;

      console.log('Frontend moonSignIndex:', moonSignIndex);
      console.log('Frontend moonPlanet.sign_degree:', moonPlanet.sign_degree);
      console.log('Frontend moonLongitude:', moonLongitude);

      const dasaRes = calculateVimshottariDasha('1990-01-01', moonLongitude);
      console.log('Frontend Dasa current:', dasaRes.current);
    } else {
      console.log('No moon planet found!');
    }
  } catch (error) {
    console.error('ERROR:', error);
  }
}

main();
