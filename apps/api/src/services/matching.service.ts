import { cachedProkeralaFetch } from '../lib/prokerala';
import { formatDatetime, formatCoordinates } from '../lib/utils';
import { HoroscopeResponse, PlanetData } from './horoscope.service';

export interface StarInput {
  nakshatra: number;
  pada: number;
}

export interface BirthInput {
  date: string;
  time: string;
  lat: number;
  lng: number;
  utcOffset: number;
}

export interface MatchingResponse {
  overall_compatible: boolean;
  papasamyam: {
    boy_score: number;
    girl_score: number;
    difference: number;
    compatible: boolean;
  };
  mangal_dosha: {
    boy_has_dosha: boolean;
    girl_has_dosha: boolean;
    compatible: boolean;
  };
}

export interface PoruthamItem {
  type: string;
  passed: boolean;
  score: number;
  weight: number;
}

export interface StarMatchResponse {
  boy_star: string;
  girl_star: string;
  score_percent: number;
  verdict: 'Excellent' | 'Good' | 'Average' | 'Not Recommended';
  dosha_free: boolean;
  poruthams: PoruthamItem[];
}

const NAKSHATRA_ORDER = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export const calculateStarMatching = (boyStar: string, girlStar: string): StarMatchResponse => {
  const boyIdx = NAKSHATRA_ORDER.findIndex(s => s.toLowerCase() === boyStar.toLowerCase()) + 1;
  const girlIdx = NAKSHATRA_ORDER.findIndex(s => s.toLowerCase() === girlStar.toLowerCase()) + 1;

  if (boyIdx === 0 || girlIdx === 0) {
    throw new Error('Invalid star name provided');
  }

  const dist = (boyIdx - girlIdx + 27) % 27 + 1;

  // 1. Dinam
  const dinamPassed = ![1, 3, 5, 7].includes(dist % 9);
  const dinamScore = dinamPassed ? 1 : 0;

  // 2. Ganam
  const getGanam = (idx: number): 'Deva' | 'Manusha' | 'Rakshasa' => {
    const deva = [1, 5, 7, 8, 13, 15, 17, 22, 27];
    const manusha = [2, 4, 6, 11, 12, 14, 20, 21, 25];
    if (deva.includes(idx)) return 'Deva';
    if (manusha.includes(idx)) return 'Manusha';
    return 'Rakshasa';
  };
  const boyGanam = getGanam(boyIdx);
  const girlGanam = getGanam(girlIdx);
  let ganamScore = 0;
  let ganamPassed = false;
  if (boyGanam === girlGanam) {
    ganamScore = 1;
    ganamPassed = true;
  } else if ((boyGanam === 'Deva' && girlGanam === 'Manusha') || (boyGanam === 'Manusha' && girlGanam === 'Deva')) {
    ganamScore = 0.5;
    ganamPassed = true;
  }

  // 3. Mahendram
  const mahendramPassed = [4, 7, 10, 13, 16, 19, 22, 25].includes(dist);
  const mahendramScore = mahendramPassed ? 1 : 0;

  // 4. Stree Deergham
  const streeDeerghamPassed = dist > 13;
  const streeDeerghamScore = streeDeerghamPassed ? 1 : 0;

  // 5. Yoni
  // Assign animal classes to make compatibility deterministic
  const getYoniGroup = (idx: number): number => {
    // 0 to 13 groups of animals
    return idx % 14;
  };
  const boyYoni = getYoniGroup(boyIdx);
  const girlYoni = getYoniGroup(girlIdx);
  const yoniPassed = Math.abs(boyYoni - girlYoni) <= 7;
  const yoniScore = yoniPassed ? (boyYoni === girlYoni ? 1 : 0.5) : 0;

  // 6. Rasi
  // 12 Rasis mapped from 27 stars (each star spans 13.33 degrees)
  const getRasiIndex = (idx: number): number => {
    return Math.floor((idx - 1) * 2.25) % 12;
  };
  const boyRasi = getRasiIndex(boyIdx);
  const girlRasi = getRasiIndex(girlIdx);
  const rasiDist = (boyRasi - girlRasi + 12) % 12 + 1;
  const rasiPassed = [1, 7, 9, 10, 11, 12].includes(rasiDist);
  const rasiScore = rasiPassed ? 1 : 0;

  // 7. Rasi Adhipathi
  const rasiAdhiPassed = (boyRasi + girlRasi) % 2 === 0 || Math.abs(boyRasi - girlRasi) === 1;
  const rasiAdhiScore = rasiAdhiPassed ? 1 : 0;

  // 8. Vasya
  const vasyaPassed = Math.abs(boyRasi - girlRasi) % 3 === 0;
  const vasyaScore = vasyaPassed ? 1 : 0;

  // 9. Rajju
  const getRajju = (idx: number): 'Siro' | 'Kanta' | 'Nabhi' | 'Kuru' | 'Pada' => {
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
  const boyRajju = getRajju(boyIdx);
  const girlRajju = getRajju(girlIdx);
  const rajjuPassed = boyRajju !== girlRajju;
  const rajjuScore = rajjuPassed ? 1 : 0;

  // 10. Vedha
  const vedhaPairs: Record<number, number> = {
    1: 18, 2: 17, 3: 16, 4: 15, 6: 13, 7: 12, 8: 11, 9: 10,
    10: 9, 11: 8, 12: 7, 13: 6, 15: 4, 16: 3, 17: 2, 18: 1
  };
  const vedhaPassed = vedhaPairs[boyIdx] !== girlIdx;
  const vedhaScore = vedhaPassed ? 1 : 0;

  const poruthams: PoruthamItem[] = [
    { type: 'dinam', passed: dinamPassed, score: dinamScore, weight: 1 },
    { type: 'ganam', passed: ganamPassed, score: ganamScore, weight: 1 },
    { type: 'mahendram', passed: mahendramPassed, score: mahendramScore, weight: 1 },
    { type: 'streeDeergham', passed: streeDeerghamPassed, score: streeDeerghamScore, weight: 1 },
    { type: 'yoni', passed: yoniPassed, score: yoniScore, weight: 1 },
    { type: 'rasi', passed: rasiPassed, score: rasiScore, weight: 1 },
    { type: 'rasiAdhipathi', passed: rasiAdhiPassed, score: rasiAdhiScore, weight: 1 },
    { type: 'vasya', passed: vasyaPassed, score: vasyaScore, weight: 1 },
    { type: 'rajju', passed: rajjuPassed, score: rajjuScore, weight: 1 },
    { type: 'vedha', passed: vedhaPassed, score: vedhaScore, weight: 1 }
  ];

  const maxPoints = poruthams.reduce((sum, p) => sum + p.weight, 0);
  const earnedPoints = poruthams.reduce((sum, p) => sum + (p.passed ? p.score * p.weight : 0), 0);
  const score_percent = Math.round((earnedPoints / maxPoints) * 100);

  // Critical checks: Rajju and Vedha are mandatory
  const dosha_free = rajjuPassed && vedhaPassed;

  let verdict: 'Excellent' | 'Good' | 'Average' | 'Not Recommended' = 'Average';
  if (!dosha_free) {
    verdict = 'Not Recommended';
  } else if (score_percent >= 80) {
    verdict = 'Excellent';
  } else if (score_percent >= 60) {
    verdict = 'Good';
  } else if (score_percent >= 45) {
    verdict = 'Average';
  } else {
    verdict = 'Not Recommended';
  }

  return {
    boy_star: boyStar,
    girl_star: girlStar,
    score_percent,
    verdict,
    dosha_free,
    poruthams
  };
};

export const getNakshatraPorutham = async (boy: StarInput, girl: StarInput, language: string = 'ta') => {
  const params = {
    boy_nakshatra: boy.nakshatra.toString(),
    boy_nakshatra_pada: boy.pada.toString(),
    girl_nakshatra: girl.nakshatra.toString(),
    girl_nakshatra_pada: girl.pada.toString(),
    la: language,
  };

  const response = await cachedProkeralaFetch('/astrology/nakshatra-porutham', params, 0);
  return response.data;
};

// Calculate Papasamyam score based on malefic planet house placements
const calculatePapasamyamScore = (planets: PlanetData[]): number => {
  let score = 0;
  const maleficPlanets = ['Sun', 'Mars', 'Saturn', 'Rahu', 'Ketu'];
  const maleficHouses = [1, 2, 4, 7, 8, 12];

  planets.forEach((p) => {
    if (maleficPlanets.includes(p.planet) && maleficHouses.includes(p.house)) {
      // Standard weight in South Indian matching
      if (p.planet === 'Mars') {
        score += 2; // Mars dosha carries higher weight
      } else {
        score += 1;
      }
    }
  });

  return score;
};

// Calculate Mangal Dosha (Mars in 1, 2, 4, 7, 8, 12)
const hasMangalDosha = (planets: PlanetData[]): boolean => {
  const mars = planets.find(p => p.planet === 'Mars');
  if (!mars) return false;
  return [1, 2, 4, 7, 8, 12].includes(mars.house);
};

export const calculateHoroscopeMatching = (boy: HoroscopeResponse, girl: HoroscopeResponse): MatchingResponse => {
  const boyPapasamyam = calculatePapasamyamScore(boy.planets);
  const girlPapasamyam = calculatePapasamyamScore(girl.planets);
  const difference = Math.abs(boyPapasamyam - girlPapasamyam);
  
  // Papasamyam is compatible if the points difference is 2 or less
  const papasamyamCompatible = difference <= 2;

  const boyMangal = hasMangalDosha(boy.planets);
  const girlMangal = hasMangalDosha(girl.planets);
  
  // Mangal Dosha is compatible if either both have it or both do not have it
  const mangalCompatible = boyMangal === girlMangal;

  const overall_compatible = papasamyamCompatible && mangalCompatible;

  return {
    overall_compatible,
    papasamyam: {
      boy_score: boyPapasamyam,
      girl_score: girlPapasamyam,
      difference,
      compatible: papasamyamCompatible
    },
    mangal_dosha: {
      boy_has_dosha: boyMangal,
      girl_has_dosha: girlMangal,
      compatible: mangalCompatible
    }
  };
};

export const getChartMatching = async (boy: BirthInput, girl: BirthInput, language: string = 'ta') => {
  const boyDatetime = formatDatetime(boy.date, boy.time, boy.utcOffset);
  const boyCoordinates = formatCoordinates(boy.lat, boy.lng);
  
  const girlDatetime = formatDatetime(girl.date, girl.time, girl.utcOffset);
  const girlCoordinates = formatCoordinates(girl.lat, girl.lng);

  const params = {
    boy_datetime: boyDatetime,
    boy_coordinates: boyCoordinates,
    girl_datetime: girlDatetime,
    girl_coordinates: girlCoordinates,
    ayanamsa: '1',
    la: language,
  };

  const [kundliMatch, papasamyamCheck] = await Promise.all([
    cachedProkeralaFetch('/astrology/kundli-matching', params, 0),
    cachedProkeralaFetch('/astrology/papasamyam-check', params, 0).catch(() => null)
  ]);

  return {
    kundliMatching: kundliMatch?.data,
    papasamyam: papasamyamCheck?.data,
  };
};

export const getMangalDosha = async (input: BirthInput, language: string = 'ta') => {
  const datetime = formatDatetime(input.date, input.time, input.utcOffset);
  const coordinates = formatCoordinates(input.lat, input.lng);

  const params = {
    datetime,
    coordinates,
    ayanamsa: '1',
    la: language,
  };

  const response = await cachedProkeralaFetch('/astrology/mangal-dosha', params, 0);
  return response.data;
};
