/**
 * Athiyandham (ஆதியந்தம்) — Birth Nakshatra Star Duration Calculator
 *
 * Traditional Sripathi printouts display:
 *   நட்சத்திர மொத்தம் — total duration of the birth star on birth day
 *   சென்றது            — time elapsed inside the star before birth (gone)
 *   இருப்பு             — time remaining in the star at birth (balance)
 *
 * This is the mathematical foundation for the Vimshottari Dasha balance at birth.
 * The Dasha remaining = (remaining / total) × lord_years
 */

import * as Astronomy from 'astronomy-engine';
import {
  minutesToNazhigai,
  getSunriseAtLocation,
  NazhigaiTime,
} from './nazhigai';

// Vimshottari Dasha years per lord (total 120 years)
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

// Nakshatra → Dasha lord (1-indexed, Ashwini = 1)
const NAKSHATRA_LORDS: string[] = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu',
  'Jupiter', 'Saturn', 'Mercury',
];

const NAKSHATRA_NAMES_EN: string[] = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const DEG_PER_NAKSHATRA = 360 / 27; // 13.333...°
const MOON_SPEED_DEG_PER_MIN = 13.176 / 1440; // average sidereal Moon speed

/** Approximate Lahiri ayanamsa for a given year */
function getLahiriAyanamsa(year: number): number {
  return 24.1 + (year - 2000) * (50.29 / 3600);
}

/** Get sidereal Moon longitude at a given Date */
function getMoonSiderealLongitude(date: Date): number {
  const time = Astronomy.MakeTime(date);
  const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, time, true);
  const moonEcl = Astronomy.Ecliptic(moonVec);
  const ayanamsa = getLahiriAyanamsa(date.getUTCFullYear());
  return (moonEcl.elon - ayanamsa + 360) % 360;
}

export interface AthiyandhamResult {
  nakshatra: string;
  nakshatra_index: number;       // 0-based
  dasha_lord: string;
  dasha_lord_years: number;

  // Star span in wall-clock minutes
  total_minutes: number;
  gone_minutes: number;          // சென்றது
  remaining_minutes: number;     // இருப்பு

  // Star span ISO timestamps
  star_start_iso: string;
  star_end_iso: string;

  // Traditional Nazhigai format
  total_naz: NazhigaiTime;
  gone_naz: NazhigaiTime;       // சென்றது
  remaining_naz: NazhigaiTime;  // இருப்பு

  // Udhayadhi (from sunrise) for the star start
  star_start_udhayadhi?: NazhigaiTime;
  star_end_udhayadhi?: NazhigaiTime;
}

/**
 * Calculate the Athiyandham for the birth Nakshatra.
 *
 * @param birthDate  - exact birth datetime (UTC)
 * @param lat        - birth latitude
 * @param lng        - birth longitude
 */
export function calculateAthiyandham(
  birthDate: Date,
  lat: number,
  lng: number,
): AthiyandhamResult {
  const moonLon = getMoonSiderealLongitude(birthDate);

  // --- Nakshatra identification ---
  const nakshatraIndex = Math.floor(moonLon / DEG_PER_NAKSHATRA) % 27;
  const starBoundaryStart = nakshatraIndex * DEG_PER_NAKSHATRA;
  const starBoundaryEnd   = starBoundaryStart + DEG_PER_NAKSHATRA;

  // Degrees already traversed inside this star
  const degGone      = moonLon - starBoundaryStart;
  const degRemaining = starBoundaryEnd - moonLon;

  // Convert degree fractions to wall-clock minutes
  const minsGone      = degGone      / MOON_SPEED_DEG_PER_MIN;
  const minsRemaining = degRemaining / MOON_SPEED_DEG_PER_MIN;
  const minsTotal     = minsGone + minsRemaining;

  // Star start and end timestamps
  const starStartDate = new Date(birthDate.getTime() - minsGone * 60_000);
  const starEndDate   = new Date(birthDate.getTime() + minsRemaining * 60_000);

  // Udhayadhi from sunrise
  const sunrise = getSunriseAtLocation(birthDate, lat, lng);
  const starStartUdha = minutesToNazhigai(
    Math.max(0, (starStartDate.getTime() - sunrise.getTime()) / 60_000),
  );
  const starEndUdha = minutesToNazhigai(
    Math.max(0, (starEndDate.getTime() - sunrise.getTime()) / 60_000),
  );

  const dashaLord  = NAKSHATRA_LORDS[nakshatraIndex];
  const lordYears  = DASHA_YEARS[dashaLord] ?? 7;

  return {
    nakshatra:        NAKSHATRA_NAMES_EN[nakshatraIndex],
    nakshatra_index:  nakshatraIndex,
    dasha_lord:       dashaLord,
    dasha_lord_years: lordYears,

    total_minutes:     minsTotal,
    gone_minutes:      minsGone,
    remaining_minutes: minsRemaining,

    star_start_iso: starStartDate.toISOString(),
    star_end_iso:   starEndDate.toISOString(),

    total_naz:     minutesToNazhigai(minsTotal),
    gone_naz:      minutesToNazhigai(minsGone),
    remaining_naz: minutesToNazhigai(minsRemaining),

    star_start_udhayadhi: starStartUdha,
    star_end_udhayadhi:   starEndUdha,
  };
}
