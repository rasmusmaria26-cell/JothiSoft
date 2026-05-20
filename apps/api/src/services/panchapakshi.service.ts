const BIRDS = ['Vulture', 'Owl', 'Crow', 'Cock', 'Peacock'];
const ACTIVITIES = ['Eating', 'Walking', 'Ruling', 'Sleeping', 'Dying'];

const NAKSHATRA_BIRD_MAP: Record<string, string> = {
  ashwini: 'Vulture', bharani: 'Vulture', krittika: 'Vulture', rohini: 'Vulture', mrigashira: 'Vulture',
  ardra: 'Owl', punarvasu: 'Owl', pushya: 'Owl', ashlesha: 'Owl', magha: 'Owl',
  'purva phalguni': 'Crow', 'uttara phalguni': 'Crow', hasta: 'Crow', chitra: 'Crow', swati: 'Crow',
  vishakha: 'Cock', anuradha: 'Cock', jyeshtha: 'Cock', mula: 'Cock', 'purva ashadha': 'Cock', 'uttara ashadha': 'Cock',
  shravana: 'Peacock', dhanishta: 'Peacock', shatabhisha: 'Peacock', 'purva bhadrapada': 'Peacock', 'uttara bhadrapada': 'Peacock', revati: 'Peacock'
};

// Activity sequence mapping based on day of week (0 = Sunday, ..., 6 = Saturday)
// For simplified deterministic biorhythms:
const ACTIVITY_SEQUENCE: Record<number, string[]> = {
  0: ['Ruling', 'Eating', 'Walking', 'Sleeping', 'Dying'], // Sun
  1: ['Eating', 'Walking', 'Ruling', 'Dying', 'Sleeping'], // Mon
  2: ['Walking', 'Ruling', 'Eating', 'Sleeping', 'Dying'], // Tue
  3: ['Ruling', 'Walking', 'Dying', 'Eating', 'Sleeping'], // Wed
  4: ['Eating', 'Ruling', 'Walking', 'Sleeping', 'Dying'], // Thu
  5: ['Ruling', 'Eating', 'Sleeping', 'Walking', 'Dying'], // Fri
  6: ['Walking', 'Eating', 'Dying', 'Ruling', 'Sleeping']  // Sat
};

const BIRD_INTERPRETATIONS: Record<string, Record<string, string>> = {
  Vulture: {
    Ruling: 'Vulture is in Ruling state. Outstanding time for critical decisions, legal matters, and key investments. Success is highly likely.',
    Eating: 'Vulture is in Eating state. Excellent time for negotiations, signing deals, and starting new projects. High energy level.',
    Walking: 'Vulture is in Walking state. Average time. Suitable for travel, communication, and routine tasks. Avoid high-risk actions.',
    Sleeping: 'Vulture is in Sleeping state. Low energy period. Rest, plan, and analyze. Delay major steps or launches.',
    Dying: 'Vulture is in Dying state. Weak period. Postpone important work, signature of contracts, and significant operations.'
  },
  Owl: {
    Ruling: 'Owl is in Ruling state. Extremely positive period. Outstanding for business strategies, meetings, and solving complex problems.',
    Eating: 'Owl is in Eating state. Good time for learning, research, planning, and consuming content or financial transactions.',
    Walking: 'Owl is in Walking state. Stable period. Focus on execution and team discussions. Moderate success expected.',
    Sleeping: 'Owl is in Sleeping state. Rest and recover. Best for backend works and self-reflection. Avoid major pitches.',
    Dying: 'Owl is in Dying state. Sleep or rest. Avoid argument, traveling, or signing deals. Keep a low profile.'
  },
  Crow: {
    Ruling: 'Crow is in Ruling state. Power period. Excellent for leadership activities, public speaking, and taking command.',
    Eating: 'Crow is in Eating state. Nourishing period. Ideal for relationship building, family decisions, and acquiring resources.',
    Walking: 'Crow is in Walking state. Dynamic period. Great for quick actions, multi-tasking, and physical activities.',
    Sleeping: 'Crow is in Sleeping state. Quiet period. Plan next moves, organize documents, and rest.',
    Dying: 'Crow is in Dying state. Challenging slot. Stay calm, avoid major decisions, and guard health.'
  },
  Cock: {
    Ruling: 'Cock is in Ruling state. Bright and victorious period. Showcase your talent, pitch to clients, and launch key initiatives.',
    Eating: 'Cock is in Eating state. Feasting period. Excellent for material achievements, food-related business, and partnership deals.',
    Walking: 'Cock is in Walking state. Active period. Suitable for marketing, sales calls, and physical work.',
    Sleeping: 'Cock is in Sleeping state. Subdued period. Recharge your energies, avoid rash statements or actions.',
    Dying: 'Cock is in Dying state. Crucial caution needed. Postpone financial risks and heavy physical tasks.'
  },
  Peacock: {
    Ruling: 'Peacock is in Ruling state. Golden hour. High recognition, charm, and success. Perfect for public presence and major launches.',
    Eating: 'Peacock is in Eating state. Favorable period. Great for creative creations, writing, and starting long-term assets.',
    Walking: 'Peacock is in Walking state. Graceful movement. Good for traveling, short trips, and networking events.',
    Sleeping: 'Peacock is in Sleeping state. Restful time. Meditate, plan, and keep thoughts organized.',
    Dying: 'Peacock is in Dying state. Unfavorable period. Maintain silence, avoid conflicts, and defer all important work.'
  }
};

export const getPanchapakshiCalculation = (nakshatra: string, lat: number, lng: number, queryTimeStr?: string) => {
  const targetNak = nakshatra.toLowerCase().trim();
  const bird = NAKSHATRA_BIRD_MAP[targetNak] || 'Vulture';

  const queryDate = queryTimeStr ? new Date(queryTimeStr) : new Date();
  const hours = queryDate.getHours();
  
  // Determine Daytime vs Nighttime (Daytime = 6:00 to 18:00)
  const is_daytime = hours >= 6 && hours < 18;
  
  // Determine 2-hour slot (1 to 5)
  const relativeHour = is_daytime ? (hours - 6) : (hours >= 18 ? hours - 18 : hours + 6);
  const time_slot = Math.min(5, Math.max(1, Math.floor(relativeHour / 2.4) + 1));

  // Determine current activity based on day of the week
  const dayOfWeek = queryDate.getDay();
  const sequence = ACTIVITY_SEQUENCE[dayOfWeek] || ACTIVITY_SEQUENCE[0];
  
  // Rotate sequence based on bird index to give each bird a unique phase
  const birdIdx = BIRDS.indexOf(bird);
  const activityIdx = (time_slot - 1 + birdIdx) % 5;
  const current_activity = sequence[activityIdx];

  const interpretation = BIRD_INTERPRETATIONS[bird]?.[current_activity] || `${bird} is in ${current_activity} phase.`;

  return {
    birth_nakshatra: nakshatra,
    birth_bird: bird,
    query_time: queryDate.toISOString(),
    is_daytime,
    time_slot,
    current_activity,
    interpretation
  };
};
