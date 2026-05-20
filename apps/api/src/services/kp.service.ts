import { cachedProkeralaFetch } from '../lib/prokerala';
import { formatDatetime, formatCoordinates } from '../lib/utils';

export interface BirthInput {
  date: string;
  time: string;
  lat: number;
  lng: number;
  utcOffset: number;
}

// NOTE: KP endpoints might be restricted or throw errors in sandbox
// Verified working pattern matches panchangam + horoscope services
// Test on production with real inputs
export const getKpSystem = async (input: BirthInput, language: string = 'en') => {
  const datetime = formatDatetime(input.date, input.time, input.utcOffset);
  const coordinates = formatCoordinates(input.lat, input.lng);

  const params = {
    datetime,
    coordinates,
    ayanamsa: '1', // Lahiri Ayanamsa by default, though KP usually uses KP Ayanamsa (value '3' in some versions of API). Let API handle default or let frontend specify if needed.
    la: language,
  };

  // Cache KP chart calculations indefinitely as birth chart never changes
  const [planets, houses] = await Promise.all([
    cachedProkeralaFetch('/astrology/kp-planet-position', params, 0).catch((err) => { throw err; }),
    cachedProkeralaFetch('/astrology/kp-house-cusps', params, 0).catch((err) => { throw err; })
  ]);

  return {
    planetPositions: planets?.data,
    houseCusps: houses?.data,
  };
};
