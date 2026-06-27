export const NAKSHATRAS_EN = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
];

export const NAKSHATRAS_TA_MAP: Record<string, string> = {
  "Ashwini": "அஸ்வினி", "Bharani": "பரணி", "Krittika": "கார்த்திகை", "Rohini": "ரோகிணி",
  "Mrigashira": "மிருகசீரிடம்", "Ardra": "திருவாதிரை", "Punarvasu": "புனர்பூசம்",
  "Pushya": "பூசம்", "Ashlesha": "ஆயில்யம்", "Magha": "மகம்", "Purva Phalguni": "பூரம்",
  "Uttara Phalguni": "உத்திரம்", "Hasta": "அஸ்தம்", "Chitra": "சித்திரை", "Swati": "சுவாதி",
  "Vishakha": "விசாகம்", "Anuradha": "அனுஷம்", "Jyeshtha": "கேட்டை", "Mula": "மூலம்",
  "Purva Ashadha": "பூராடம்", "Uttara Ashadha": "உத்திராடம்", "Shravana": "திருவோணம்",
  "Dhanishtha": "அவிட்டம்", "Shatabhisha": "சதயம்", "Purva Bhadrapada": "பூரட்டாதி",
  "Uttara Bhadrapada": "உத்திரட்டாதி", "Revati": "ரேவதி"
};

export const getNakshatraIndex = (nakName: string): number => {
  if (!nakName) return 1;
  const normalized = nakName.toLowerCase().replace(/[^a-z]/g, '');
  const list = NAKSHATRAS_EN.map(s => s.toLowerCase().replace(/[^a-z]/g, ''));
  
  let idx = list.indexOf(normalized);
  if (idx === -1) {
    if (normalized === 'mrigasira') return 5;
    if (normalized === 'dhanishta') return 23;
    if (normalized === 'satabhisha') return 24;
    
    idx = list.findIndex(s => s.includes(normalized) || normalized.includes(s));
  }
  return idx !== -1 ? idx + 1 : 1;
};

export const getGana = (nakName: string): 'Deva' | 'Manusha' | 'Rakshasa' => {
  const idx = getNakshatraIndex(nakName);
  const deva = [1, 5, 7, 8, 13, 15, 17, 22, 27];
  const manusha = [2, 4, 6, 11, 12, 14, 20, 21, 25];
  if (deva.includes(idx)) return 'Deva';
  if (manusha.includes(idx)) return 'Manusha';
  return 'Rakshasa';
};

export const getNadi = (nakName: string): 'Adi' | 'Madhya' | 'Antya' => {
  const idx = getNakshatraIndex(nakName);
  const adi = [1, 6, 7, 12, 13, 18, 19, 24, 25];
  const madhya = [2, 5, 8, 11, 14, 17, 20, 23, 26];
  if (adi.includes(idx)) return 'Adi';
  if (madhya.includes(idx)) return 'Madhya';
  return 'Antya';
};

export const getRajju = (nakName: string): 'Siro' | 'Kanta' | 'Nabhi' | 'Kuru' | 'Pada' => {
  const idx = getNakshatraIndex(nakName);
  const siro = [5, 14, 23];
  const kanta = [4, 6, 13, 15, 22, 24];
  const nabhi = [3, 7, 12, 16, 21, 25];
  const kuru = [2, 8, 11, 17, 20, 26];
  if (siro.includes(idx)) return 'Siro';
  if (kanta.includes(idx)) return 'Kanta';
  if (nabhi.includes(idx)) return 'Nabhi';
  if (kuru.includes(idx)) return 'Kuru';
  return 'Pada';
};

const PAKSHA_BIRD_MAP: Record<number, ['Vulture'|'Owl'|'Crow'|'Cock'|'Peacock', 'Vulture'|'Owl'|'Crow'|'Cock'|'Peacock']> = {
  1:  ['Vulture',  'Peacock'], 2:  ['Vulture',  'Owl'],
  3:  ['Peacock',  'Vulture'], 4:  ['Owl',      'Crow'],
  5:  ['Vulture',  'Cock'],    6:  ['Owl',      'Vulture'],
  7:  ['Peacock',  'Owl'],     8:  ['Owl',      'Peacock'],
  9:  ['Crow',     'Cock'],    10: ['Cock',     'Crow'],
  11: ['Crow',     'Peacock'], 12: ['Cock',     'Vulture'],
  13: ['Crow',     'Owl'],     14: ['Peacock',  'Crow'],
  15: ['Crow',     'Vulture'], 16: ['Cock',     'Peacock'],
  17: ['Crow',     'Cock'],    18: ['Peacock',  'Crow'],
  19: ['Cock',     'Owl'],     20: ['Cock',     'Peacock'],
  21: ['Peacock',  'Cock'],    22: ['Peacock',  'Crow'],
  23: ['Owl',      'Vulture'], 24: ['Peacock',  'Owl'],
  25: ['Vulture',  'Crow'],    26: ['Crow',     'Vulture'],
  27: ['Peacock',  'Cock'],
};

export const getBird = (
  nakName: string,
  paksha: 'shukla' | 'krishna' = 'shukla'
): 'Vulture' | 'Owl' | 'Crow' | 'Cock' | 'Peacock' => {
  const idx = getNakshatraIndex(nakName);
  const pair = PAKSHA_BIRD_MAP[idx] ?? ['Vulture', 'Vulture'];
  return paksha === 'shukla' ? pair[0] : pair[1];
};
