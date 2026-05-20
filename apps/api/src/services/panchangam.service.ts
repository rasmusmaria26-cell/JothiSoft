import { cachedProkeralaFetch } from '../lib/prokerala';
import { formatDatetime, formatCoordinates } from '../lib/utils';

export const getDailyPanchangam = async (
  date: string,
  lat: number,
  lng: number,
  utcOffset: number,
  language: string = 'ta'
) => {
  // Use 00:00 as the base time for daily panchangam
  const datetime = formatDatetime(date, '00:00', utcOffset);
  const coordinates = formatCoordinates(lat, lng);

  const params = {
    datetime,
    coordinates,
    ayanamsa: '1', // Lahiri
    la: language,
  };

  // Cache panchangam calls for 24 hours (86400 seconds) since they don't change
  const response = await cachedProkeralaFetch('/astrology/panchang', params, 86400);

  return response.data;
};
