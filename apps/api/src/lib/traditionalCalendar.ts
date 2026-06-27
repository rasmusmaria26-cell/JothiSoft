/**
 * Traditional Indian and World Calendar Era Converters
 *
 * Converts a standard ISO date to several historically significant calendar eras
 * used in traditional Tamil and South Indian astrology printouts.
 */

/**
 * Julian Day Number from a Gregorian calendar date.
 * Used as the basis for all era calculations.
 */
const toJulianDay = (year: number, month: number, day: number): number => {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
};

/**
 * Kaliyuga Year
 * Epoch: 3102 BCE, February 18 (Julian calendar)
 * The Julian Day of this epoch start = 588465.5
 * One Kali year = 365.25... days (sidereal), but for display we use civil year difference.
 */
export const getKaliyugaYear = (isoDate: string): number => {
  const [year] = isoDate.split('-').map(Number);
  // Kali epoch is 3102 BCE; add 3101 for the BC year offset then add CE year
  return year + 3101;
};

/**
 * Salivahana Saka Era (Shalivahana Shaka)
 * Epoch: 78 CE, March (spring equinox)
 * Used as the official Indian national calendar base.
 */
export const getSalivahanaYear = (isoDate: string): number => {
  const [year, month] = isoDate.split('-').map(Number);
  // Saka year starts around mid-March. Before March 15 → use previous Saka year.
  return month < 3 || (month === 3 && parseInt(isoDate.split('-')[2]) < 15)
    ? year - 79
    : year - 78;
};

/**
 * Kollam Era (Malayalam Era / Parasurama Era)
 * Epoch: 825 CE
 * Used in Kerala and parts of Tamil Nadu.
 */
export const getKollamYear = (isoDate: string): number => {
  const [year, month] = isoDate.split('-').map(Number);
  // Kollam year starts around mid-August (Chingam). Before Aug 17 → previous Kollam year.
  return month < 8 || (month === 8 && parseInt(isoDate.split('-')[2]) < 17)
    ? year - 826
    : year - 825;
};

/**
 * Hijri (Islamic Calendar) Year — Approximate
 * Epoch: July 16, 622 CE (Julian)
 * Formula: AH ≈ (Gregorian year - 622) × (33/32)
 * This is a civil approximation; precise calculation requires lunar month tracking.
 */
export const getHijriYear = (isoDate: string): number => {
  const [year, month, day] = isoDate.split('-').map(Number);
  const jd = toJulianDay(year, month, day);
  const hijriEpochJD = 1948438.5; // Julian Day of 1 Muharram 1 AH (July 16, 622 CE)
  const daysSinceEpoch = jd - hijriEpochJD;
  return Math.floor(daysSinceEpoch / 354.367); // Average Islamic year length
};

/**
 * Get all era years as a bundle for a given ISO date string.
 */
export const getCalendarEras = (isoDate: string): {
  kaliyuga: number;
  salivahana: number;
  kollam: number;
  hijri: number;
} => ({
  kaliyuga: getKaliyugaYear(isoDate),
  salivahana: getSalivahanaYear(isoDate),
  kollam: getKollamYear(isoDate),
  hijri: getHijriYear(isoDate),
});
