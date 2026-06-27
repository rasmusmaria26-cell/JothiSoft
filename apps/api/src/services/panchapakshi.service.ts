/**
 * Panchapakshi Shastra — Bird Assignment Per Agastyar Tradition
 *
 * The same Nakshatra maps to different birds depending on birth Paksha:
 *   Shukla Paksha (வளர்பிறை) — waxing moon (Tithis 1–15)
 *   Krishna Paksha (தேய்பிறை) — waning moon (Tithis 16–30)
 *
 * Reference: Agastyar Panchapakshi Shastra, Southern Tamil tradition.
 * Sripathi software uses this dual-map which is why the same Nakshatra
 * can yield a different bird than a sequential grouping of 27/5 would give.
 */

export type BirdName = 'Vulture' | 'Owl' | 'Crow' | 'Cock' | 'Peacock';
export type ActivityName = 'Eating' | 'Walking' | 'Ruling' | 'Sleeping' | 'Dying';
export type Paksha = 'shukla' | 'krishna';

const BIRDS: BirdName[] = ['Vulture', 'Owl', 'Crow', 'Cock', 'Peacock'];
const ACTIVITIES: ActivityName[] = ['Eating', 'Walking', 'Ruling', 'Sleeping', 'Dying'];

/**
 * Dual Paksha bird map.
 * Nakshatra index 1–27 → [shukla_bird, krishna_bird]
 * Based on Agastyar/Sripathi tradition used in Tamil Nadu.
 */
const PAKSHA_BIRD_MAP: Record<number, [BirdName, BirdName]> = {
  1:  ['Vulture',  'Peacock'], // Ashwini
  2:  ['Vulture',  'Owl'],     // Bharani
  3:  ['Peacock',  'Vulture'], // Krittika  ← Peacock in Shukla, Vulture in Krishna
  4:  ['Owl',      'Crow'],    // Rohini
  5:  ['Vulture',  'Cock'],    // Mrigashira
  6:  ['Owl',      'Vulture'], // Ardra
  7:  ['Peacock',  'Owl'],     // Punarvasu
  8:  ['Owl',      'Peacock'], // Pushya
  9:  ['Crow',     'Cock'],    // Ashlesha
  10: ['Cock',     'Crow'],    // Magha
  11: ['Crow',     'Peacock'], // Purva Phalguni
  12: ['Cock',     'Vulture'], // Uttara Phalguni
  13: ['Crow',     'Owl'],     // Hasta
  14: ['Peacock',  'Crow'],    // Chitra
  15: ['Crow',     'Vulture'], // Swati
  16: ['Cock',     'Peacock'], // Vishakha
  17: ['Crow',     'Cock'],    // Anuradha
  18: ['Peacock',  'Crow'],    // Jyeshtha
  19: ['Cock',     'Owl'],     // Mula
  20: ['Cock',     'Peacock'], // Purva Ashadha
  21: ['Peacock',  'Cock'],    // Uttara Ashadha
  22: ['Peacock',  'Crow'],    // Shravana
  23: ['Owl',      'Vulture'], // Dhanishtha
  24: ['Peacock',  'Owl'],     // Shatabhisha
  25: ['Vulture',  'Crow'],    // Purva Bhadrapada
  26: ['Crow',     'Vulture'], // Uttara Bhadrapada
  27: ['Peacock',  'Cock'],    // Revati
};

// Tamil bird names
const BIRD_NAME_TA: Record<BirdName, string> = {
  Vulture: 'வல்லூறு',
  Owl:     'ஆந்தை',
  Crow:    'காகம்',
  Cock:    'சேவல்',
  Peacock: 'மயில்',
};

// Element mapping
const BIRD_ELEMENT: Record<BirdName, { en: string; ta: string }> = {
  Vulture: { en: 'Fire',  ta: 'அக்னி' },
  Owl:     { en: 'Earth', ta: 'பூமி' },
  Crow:    { en: 'Ether', ta: 'ஆகாயம்' },
  Cock:    { en: 'Water', ta: 'ஜலம்' },
  Peacock: { en: 'Air',   ta: 'வாயு' },
};

// Activity sequence mapping based on day of week (0 = Sunday … 6 = Saturday)
// Derived from classical Agastyar day-bird ruling sequences.
const ACTIVITY_SEQUENCE: Record<number, ActivityName[]> = {
  0: ['Ruling',  'Eating',  'Walking', 'Sleeping', 'Dying'],   // Sun
  1: ['Eating',  'Walking', 'Ruling',  'Dying',    'Sleeping'], // Mon
  2: ['Walking', 'Ruling',  'Eating',  'Sleeping', 'Dying'],    // Tue
  3: ['Ruling',  'Walking', 'Dying',   'Eating',   'Sleeping'], // Wed
  4: ['Eating',  'Ruling',  'Walking', 'Sleeping', 'Dying'],    // Thu
  5: ['Ruling',  'Eating',  'Sleeping','Walking',  'Dying'],    // Fri
  6: ['Walking', 'Eating',  'Dying',   'Ruling',   'Sleeping'], // Sat
};

const BIRD_INTERPRETATIONS: Record<BirdName, Record<ActivityName, string>> = {
  Vulture: {
    Ruling:   'Vulture is in Ruling state. Outstanding time for critical decisions, legal matters, and key investments. Success is highly likely.',
    Eating:   'Vulture is in Eating state. Excellent time for negotiations, signing deals, and starting new projects. High energy level.',
    Walking:  'Vulture is in Walking state. Average time. Suitable for travel, communication, and routine tasks. Avoid high-risk actions.',
    Sleeping: 'Vulture is in Sleeping state. Low energy period. Rest, plan, and analyze. Delay major steps or launches.',
    Dying:    'Vulture is in Dying state. Weak period. Postpone important work, signature of contracts, and significant operations.',
  },
  Owl: {
    Ruling:   'Owl is in Ruling state. Extremely positive period. Outstanding for business strategies, meetings, and solving complex problems.',
    Eating:   'Owl is in Eating state. Good time for learning, research, planning, and financial transactions.',
    Walking:  'Owl is in Walking state. Stable period. Focus on execution and team discussions. Moderate success expected.',
    Sleeping: 'Owl is in Sleeping state. Rest and recover. Best for backend works and self-reflection. Avoid major pitches.',
    Dying:    'Owl is in Dying state. Avoid argument, traveling, or signing deals. Keep a low profile.',
  },
  Crow: {
    Ruling:   'Crow is in Ruling state. Power period. Excellent for leadership activities, public speaking, and taking command.',
    Eating:   'Crow is in Eating state. Nourishing period. Ideal for relationship building, family decisions, and acquiring resources.',
    Walking:  'Crow is in Walking state. Dynamic period. Great for quick actions, multi-tasking, and physical activities.',
    Sleeping: 'Crow is in Sleeping state. Quiet period. Plan next moves, organize documents, and rest.',
    Dying:    'Crow is in Dying state. Challenging slot. Stay calm, avoid major decisions, and guard health.',
  },
  Cock: {
    Ruling:   'Cock is in Ruling state. Bright and victorious period. Showcase your talent, pitch to clients, and launch key initiatives.',
    Eating:   'Cock is in Eating state. Feasting period. Excellent for material achievements, food-related business, and partnership deals.',
    Walking:  'Cock is in Walking state. Active period. Suitable for marketing, sales calls, and physical work.',
    Sleeping: 'Cock is in Sleeping state. Subdued period. Recharge your energies, avoid rash statements or actions.',
    Dying:    'Cock is in Dying state. Crucial caution needed. Postpone financial risks and heavy physical tasks.',
  },
  Peacock: {
    Ruling:   'Peacock is in Ruling state. Golden hour. High recognition, charm, and success. Perfect for public presence and major launches.',
    Eating:   'Peacock is in Eating state. Favorable period. Great for creative work, writing, and starting long-term assets.',
    Walking:  'Peacock is in Walking state. Graceful movement. Good for traveling, short trips, and networking events.',
    Sleeping: 'Peacock is in Sleeping state. Restful time. Meditate, plan, and keep thoughts organized.',
    Dying:    'Peacock is in Dying state. Unfavorable period. Maintain silence, avoid conflicts, and defer all important work.',
  },
};

const NAKSHATRA_INDEX_MAP: Record<string, number> = {
  ashwini: 1, bharani: 2, krittika: 3, rohini: 4, mrigashira: 5,
  ardra: 6, punarvasu: 7, pushya: 8, ashlesha: 9, magha: 10,
  'purva phalguni': 11, 'uttara phalguni': 12, hasta: 13, chitra: 14, swati: 15,
  vishakha: 16, anuradha: 17, jyeshtha: 18, mula: 19,
  'purva ashadha': 20, 'uttara ashadha': 21, shravana: 22, dhanishtha: 23,
  dhanishta: 23, shatabhisha: 24, satabhisha: 24,
  'purva bhadrapada': 25, 'uttara bhadrapada': 26, revati: 27,
};

export const getPanchapakshiCalculation = (
  nakshatra: string,
  lat: number,
  lng: number,
  queryTimeStr?: string,
  paksha: Paksha = 'shukla'
) => {
  const targetNak = nakshatra.toLowerCase().trim();

  // Resolve Nakshatra index (1–27)
  let nakIdx = NAKSHATRA_INDEX_MAP[targetNak];
  if (!nakIdx) {
    // Fuzzy fallback
    const key = Object.keys(NAKSHATRA_INDEX_MAP).find(
      k => k.includes(targetNak) || targetNak.includes(k)
    );
    nakIdx = key ? NAKSHATRA_INDEX_MAP[key] : 1;
  }

  // Determine bird based on Paksha
  const birdPair = PAKSHA_BIRD_MAP[nakIdx] ?? ['Vulture', 'Vulture'];
  const bird: BirdName = paksha === 'shukla' ? birdPair[0] : birdPair[1];

  const queryDate = queryTimeStr ? new Date(queryTimeStr) : new Date();
  const hours = queryDate.getHours();

  // Daytime: 06:00–18:00
  const is_daytime = hours >= 6 && hours < 18;

  // 5 equal slots of 2.4 hours each within the 12-hour period
  const relativeHour = is_daytime
    ? hours - 6
    : hours >= 18 ? hours - 18 : hours + 6;
  const time_slot = Math.min(5, Math.max(1, Math.floor(relativeHour / 2.4) + 1));

  const dayOfWeek = queryDate.getDay();
  const sequence = ACTIVITY_SEQUENCE[dayOfWeek] ?? ACTIVITY_SEQUENCE[0];

  // Rotate sequence based on bird index to give each bird a unique phase
  const birdIdx = BIRDS.indexOf(bird);
  const activityIdx = (time_slot - 1 + birdIdx) % 5;
  const current_activity = sequence[activityIdx];

  const interpretation = BIRD_INTERPRETATIONS[bird]?.[current_activity]
    ?? `${bird} is in ${current_activity} phase.`;

  return {
    birth_nakshatra: nakshatra,
    birth_bird: bird,
    birth_bird_ta: BIRD_NAME_TA[bird],
    birth_paksha: paksha,
    bird_element: BIRD_ELEMENT[bird],
    query_time: queryDate.toISOString(),
    is_daytime,
    time_slot,
    current_activity,
    interpretation,
  };
};
