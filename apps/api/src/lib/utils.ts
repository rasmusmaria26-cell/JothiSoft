// apps/api/src/lib/utils.ts

/**
 * Format datetime for Prokerala API (ISO 8601 with offset).
 * Always use ayanamsa=1 (Lahiri) for Tamil/Vedic astrology.
 * Prokerala datetime format: "2026-05-20T14:30:00+05:30"
 * 
 * @param date YYYY-MM-DD
 * @param time HH:mm
 * @param utcOffset Decimal offset, e.g. 5.5 for IST
 */
export const formatDatetime = (
  date: string,
  time: string,
  utcOffset: number
): string => {
  const sign = utcOffset >= 0 ? '+' : '-';
  const abs = Math.abs(utcOffset);
  const hours = String(Math.floor(abs)).padStart(2, '0');
  const mins = String(Math.round((abs % 1) * 60)).padStart(2, '0');
  
  // ensure time has seconds
  let timeStr = time;
  if (timeStr.split(':').length === 2) {
    timeStr += ':00';
  }
  
  return `${date}T${timeStr}${sign}${hours}:${mins}`;
};

/**
 * Format coordinates for Prokerala API.
 * @param lat Latitude
 * @param lng Longitude
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat},${lng}`;
};

/**
 * Sleep utility for rate-limiting batch requests (like monthly panchangam).
 * @param ms milliseconds to sleep
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
