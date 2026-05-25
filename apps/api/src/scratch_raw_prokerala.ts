import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.join(__dirname, '../../../.env') });

import { cachedProkeralaFetch } from './lib/prokerala';
import { formatDatetime, formatCoordinates } from './lib/utils';

async function main() {
  console.log('Testing raw Prokerala API response...');
  try {
    const datetime = formatDatetime('1990-01-01', '12:00', 5.5);
    const coordinates = formatCoordinates(13.0827, 80.2707);

    const params = {
      datetime,
      coordinates,
      ayanamsa: '1',
      la: 'en',
    };

    const res = await cachedProkeralaFetch('/astrology/planet-position', params, 0);
    console.log('SUCCESS!');
    console.log('Planets and Rasi details:');
    res.data.planet_position.forEach((p: any) => {
      console.log(`- ${p.name}: longitude=${p.longitude}, position=${p.position}, rasi=${JSON.stringify(p.rasi)}`);
    });
  } catch (error) {
    console.error('ERROR:', error);
  }
}

main();
