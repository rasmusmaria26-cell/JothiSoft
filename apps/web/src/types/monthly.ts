/**
 * types/monthly.ts
 * TypeScript declarations for Monthly Panchangam calendar days.
 */

export interface MonthlyPanchangamDay {
  date: string;               // YYYY-MM-DD
  day_of_week: string;        // e.g. "Friday"
  day_of_week_ta: string;     // e.g. "வெள்ளி"
  tithi: string;
  tithi_ta: string;
  tithi_index: number;
  paksha: 'shukla' | 'krishna';
  paksha_ta: string;
  nakshatra: string;
  nakshatra_ta: string;
  nakshatra_index: number;
  yogam: string;
  yogam_ta: string;
  karanam: string;
  karanam_ta: string;
  rahu_kalam: {
    start: string;
    end: string;
  };
  sunrise: string;
  sunset: string;
}

export interface DetailedPanchangamResponse {
  date: string;
  paksha: string;
  tithi: { name: string; index: number };
  nakshatra: { name: string; index: number; pada: number };
  yogam: { name: string; index: number };
  karanam: { name: string };
  rahu_kalam: { start: string; end: string };
  sun_longitude: number;
  moon_longitude: number;
}
