import config from '../data/special-days-config.json';
import { getLocalPanchangam } from './localPanchangam.service';

export type SpecialDayType = 
  'amavasai' | 'pournami' | 'sashti' | 'krithigai' | 
  'uthiram' | 'kantha_vrat' | 'tharpanam' | 
  'tamil_new_year' | 'jwalini' | 'pradosham';

export interface SpecialDay {
  type:        SpecialDayType;
  name_en:     string;
  name_ta:     string;
  date:        string;          // "2026-04-14"
  day_of_week: string;
  significance_en: string;
  significance_ta: string;
  deity_en?: string;
  deity_ta?: string;
  fasting?: boolean;
  fasting_rules_en?: string | null;
  fasting_rules_ta?: string | null;
  ritual_en?: string;
  ritual_ta?: string;
  avoid_en?: string;
  avoid_ta?: string;
  color_accent?: string;
  icon?: string;
  card_shape?: string;
  auspicious_time_en?: string;
  auspicious_time_ta?: string;
  offerings?: { en: string; ta: string }[];
  mantra?: { text_ta?: string; transliteration?: string; meaning_en?: string };
  key_temples?: { name: string; location: string; reason_en?: string }[];
}

// Pre-compute all special days for a year
// Call this once on server startup or via cron, cache the result
export const computeSpecialDaysForYear = async (
  year:      number,
  lat:       number,
  lng:       number,
  utcOffset: number
): Promise<SpecialDay[]> => {
  const results: SpecialDay[] = [];
  const daysInYear = isLeapYear(year) ? 366 : 365;
  const startDate  = new Date(year, 0, 1);

  for (let i = 0; i < daysInYear; i++) {
    const current = new Date(startDate);
    current.setDate(startDate.getDate() + i);
    const dateStr = formatDate(current);          // "2026-04-14"
    const mmdd    = dateStr.slice(5);             // "04-14"

    // 1. Handle fixed-date specials first
    for (const type of config.types) {
      if (type.filter.fixed_date === mmdd) {
        results.push(buildEntry(type, dateStr, current));
      }
    }

    // 2. Fetch panchangam locally (instant, zero cost, no rate limits!)
    const panchang = getLocalPanchangam(current);

    const tithiId     = panchang?.tithi?.index;
    const nakshatraId = panchang?.nakshatra?.index;
    const paksha      = panchang?.tithi?.paksha?.toLowerCase();

    for (const type of config.types) {
      if (type.filter.fixed_date) continue; // already handled above

      const matchesTithi     = type.filter.tithi     === undefined || type.filter.tithi     === null || type.filter.tithi     === tithiId;
      const matchesNakshatra = type.filter.nakshatra === undefined || type.filter.nakshatra === null || type.filter.nakshatra === nakshatraId;
      const matchesPaksha    = type.filter.paksha    === undefined || type.filter.paksha    === null || type.filter.paksha    === paksha;

      if (matchesTithi && matchesNakshatra && matchesPaksha) {
        results.push(buildEntry(type, dateStr, current));
      }
    }
  }

  return results.sort((a, b) => a.date.localeCompare(b.date));
};

// Filter pre-computed results by type
export const getSpecialDaysByType = (
  allDays: SpecialDay[],
  type: SpecialDayType
): SpecialDay[] => allDays.filter(d => d.type === type);

// ── Helpers ──────────────────────────────────────────────────────────────────

const buildEntry = (type: any, date: string, d: Date): SpecialDay => ({
  ...type,
  type:            type.id as SpecialDayType,
  name_en:         type.name_en,
  name_ta:         type.name_ta,
  date,
  day_of_week:     d.toLocaleDateString('en-US', { weekday: 'long' }),
  significance_en: type.significance_en,
  significance_ta: type.significance_ta,
});

const formatDate = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

const isLeapYear = (y: number): boolean =>
  (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
