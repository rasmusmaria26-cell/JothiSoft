import * as Astronomy from 'astronomy-engine';

/**
 * Mandhi (Gulikan) Calculation — Upagraha of Saturn
 *
 * Mandhi is calculated from the sunrise time at the birth location on the birth day.
 * The day is divided into 8 equal parts (each = 1/8 of the day length).
 * Each weekday assigns a specific part to Saturn's upagraha (Mandhi).
 *
 * Mandhi time slot (1-indexed parts from sunrise):
 *   Sunday:    7th part
 *   Monday:    6th part
 *   Tuesday:   5th part
 *   Wednesday: 4th part
 *   Thursday:  3rd part
 *   Friday:    2nd part
 *   Saturday:  1st part (very first slot)
 *
 * Mandhi's longitude = Sun's longitude at that Mandhi moment.
 */

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const ZODIAC_SIGNS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
  'Simha', 'Kanya', 'Thula', 'Vrischika',
  'Dhanus', 'Makara', 'Kumbha', 'Meena',
];

// Which 1/8 day-part belongs to Mandhi, by weekday (0=Sun…6=Sat)
const MANDHI_PART_BY_DAY: Record<number, number> = {
  0: 7, // Sunday
  1: 6, // Monday
  2: 5, // Tuesday
  3: 4, // Wednesday
  4: 3, // Thursday
  5: 2, // Friday
  6: 1, // Saturday
};

const getNakshatraAndPada = (longitude: number): { nakshatra: string; pada: number } => {
  const span = 360 / 27;
  const index = Math.floor(longitude / span) % 27;
  const positionInNakshatra = longitude - index * span;
  const pada = Math.floor(positionInNakshatra / (span / 4)) + 1;
  return { nakshatra: NAKSHATRAS[index], pada: Math.min(4, Math.max(1, pada)) };
};

const getApproxAyanamsa = (year: number) => 24.1 + (year - 2000) * (50.29 / 3600);

/**
 * Calculate the sidereal longitude of Mandhi (Gulikan) at the birth date/location.
 *
 * @param birthDateStr  ISO date string "YYYY-MM-DD"
 * @param lat           Latitude of birth place
 * @param lng           Longitude of birth place
 * @param utcOffset     UTC offset in decimal hours (e.g. 5.5 for IST)
 * @returns PlanetData-compatible object for Mandhi
 */
export const calculateMandhi = (
  birthDateStr: string,
  lat: number,
  lng: number,
  utcOffset: number
): {
  planet: string;
  sign: string;
  sign_degree: number;
  house: number;
  nakshatra: string;
  pada: number | null;
} => {
  try {
    // Build a Date at local midnight of the birth date
    const [year, month, day] = birthDateStr.split('-').map(Number);
    const localMidnight = new Date(
      Date.UTC(year, month - 1, day) - utcOffset * 3600 * 1000
    );

    const time = Astronomy.MakeTime(localMidnight);

    // Calculate sunrise for birth location
    const observer = new Astronomy.Observer(lat, lng, 0);
    const sunrise = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      +1,        // +1 = rise
      time,
      1          // search within 1 day
    );

    const sunriseDate = sunrise ? sunrise.date : localMidnight;

    // Estimate sunset (~12 hours after sunrise as simple approximation)
    const sunrisePlus1 = new Astronomy.AstroTime(sunriseDate.getTime() / 86400000 + 0.5);
    const sunset = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      -1,         // -1 = set
      sunrisePlus1,
      1
    );
    const sunsetDate = sunset ? sunset.date : new Date(sunriseDate.getTime() + 12 * 3600 * 1000);

    // Day length in ms
    const dayLengthMs = sunsetDate.getTime() - sunriseDate.getTime();
    const partMs = dayLengthMs / 8;

    const weekday = localMidnight.getUTCDay();
    const mandhiPart = MANDHI_PART_BY_DAY[weekday] ?? 7;

    // Mandhi moment = sunrise + (part - 1) full parts + half a part (midpoint)
    const mandhiMs = sunriseDate.getTime() + (mandhiPart - 1) * partMs + partMs / 2;
    const mandhiDate = new Date(mandhiMs);

    // Compute Sun's sidereal longitude at the Mandhi moment
    const mandhiAstroTime = Astronomy.MakeTime(mandhiDate);
    const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, mandhiAstroTime, true);
    const sunEcl = Astronomy.Ecliptic(sunVec);
    const ayanamsa = getApproxAyanamsa(year);
    const mandhiLongitude = (sunEcl.elon - ayanamsa + 360) % 360;

    const signIndex = Math.floor(mandhiLongitude / 30);
    const signDegree = mandhiLongitude % 30;
    const { nakshatra, pada } = getNakshatraAndPada(mandhiLongitude);

    return {
      planet: 'Mandhi',
      sign: ZODIAC_SIGNS[signIndex] ?? 'Mesha',
      sign_degree: parseFloat(signDegree.toFixed(2)),
      house: 1, // Will be recalculated relative to Lagna in horoscope.service.ts
      nakshatra,
      pada,
    };
  } catch (err) {
    // Graceful fallback — return a neutral Mandhi entry
    console.warn('[Mandhi] Calculation failed, using fallback:', err);
    return {
      planet: 'Mandhi',
      sign: 'Mesha',
      sign_degree: 0,
      house: 1,
      nakshatra: 'Ashwini',
      pada: 1,
    };
  }
};
