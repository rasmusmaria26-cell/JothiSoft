/**
 * Nazhigai / Vinadi Traditional Indian Time Unit Converter
 *
 * Classical Tamil astrology measures time in:
 *   1 Nazhigai (நாழிகை) = 24 minutes
 *   1 Vinadi (வினாடி)   = 24 seconds = 1/60 Nazhigai
 *   1 Full Day           = 60 Nazhigai = 3600 Vinadi
 *
 * Udhayadhi Nazhigai (உதயாதி நாழிகை) = elapsed time from local sunrise to birth.
 */

import * as Astronomy from 'astronomy-engine';

export interface NazhigaiTime {
  nazhigai: number;
  vinadi: number;
  total_minutes: number;
}

/**
 * Convert a duration in decimal minutes to Nazhigai + Vinadi.
 */
export function minutesToNazhigai(totalMinutes: number): NazhigaiTime {
  const abs = Math.abs(totalMinutes);
  const nazhigai = Math.floor(abs / 24);
  const remaining = abs % 24;               // leftover minutes
  const vinadi = Math.floor(remaining * 2.5); // 1 min = 2.5 Vinadi (60s / 24s)
  return { nazhigai, vinadi, total_minutes: totalMinutes };
}

/**
 * Format a NazhigaiTime for display.
 * Tamil : "நாழிகை 26 வினாடி 18"
 * English: "26 Naz 18 Vin"
 */
export function nazhigaiLabel(nzt: NazhigaiTime, lang: 'ta' | 'en'): string {
  if (lang === 'ta') {
    return `நாழிகை ${nzt.nazhigai} வினாடி ${nzt.vinadi}`;
  }
  return `${nzt.nazhigai} Naz ${nzt.vinadi} Vin`;
}

/**
 * Compute the local sunrise time at the birth location for the given birth date.
 * Returns an ISO string and a Date object.
 */
export function getSunriseAtLocation(
  birthDate: Date,
  lat: number,
  lng: number
): Date {
  const observer = new Astronomy.Observer(lat, lng, 0);
  // Start search from midnight of the birth date (UTC)
  const midnight = new Date(birthDate);
  midnight.setUTCHours(0, 0, 0, 0);
  const startTime = Astronomy.MakeTime(new Date(midnight.getTime() - 60_000)); // 1 min before midnight

  try {
    const riseEvent = Astronomy.SearchRiseSet(
      Astronomy.Body.Sun,
      observer,
      +1,       // +1 = rising
      startTime,
      2         // search within 2 days
    );
    if (riseEvent) return riseEvent.date;
  } catch (_) {
    // fall through to fallback
  }

  // Fallback: assume 6:00 AM UTC on birth date
  const fallback = new Date(birthDate);
  fallback.setUTCHours(6, 0, 0, 0);
  return fallback;
}

/**
 * Calculate Udhayadhi Nazhigai — time elapsed from local sunrise to birth moment.
 * This is the cornerstone of traditional Panchangam timing.
 */
export function getUdhayadhiNazhigai(
  birthDate: Date,
  lat: number,
  lng: number
): NazhigaiTime {
  const sunrise = getSunriseAtLocation(birthDate, lat, lng);
  const elapsedMs = birthDate.getTime() - sunrise.getTime();
  const elapsedMinutes = elapsedMs / 60_000;
  return minutesToNazhigai(Math.max(0, elapsedMinutes));
}

/**
 * Estimate how many minutes until the Moon reaches a target sidereal longitude.
 * Uses a linear interpolation based on average Moon speed (13.176°/day).
 *
 * @param degreesRemaining - degrees left until the boundary
 * @returns minutes until boundary
 */
export function minutesToNextMoonBoundary(degreesRemaining: number): number {
  const MOON_SPEED_DEG_PER_MIN = 13.176 / 1440; // sidereal
  return degreesRemaining / MOON_SPEED_DEG_PER_MIN;
}

/**
 * Estimate minutes until the Moon-Sun elongation reaches a target boundary.
 * Used for Tithi and Karana endings.
 *
 * @param degreesRemaining - degrees left until next 12° (tithi) or 6° (karana) multiple
 */
export function minutesToNextTithiBoundary(degreesRemaining: number): number {
  const TITHI_RATE_DEG_PER_MIN = 12.2 / 1440; // Moon speed - Sun speed
  return degreesRemaining / TITHI_RATE_DEG_PER_MIN;
}

/**
 * Estimate minutes until the (Moon + Sun) combined longitude crosses the next Yoga boundary (13.333°).
 */
export function minutesToNextYogaBoundary(degreesRemaining: number): number {
  const YOGA_RATE_DEG_PER_MIN = 14.2 / 1440; // Moon + Sun combined speed
  return degreesRemaining / YOGA_RATE_DEG_PER_MIN;
}
