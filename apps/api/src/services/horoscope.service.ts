import { cachedProkeralaFetch } from '../lib/prokerala';
import { formatDatetime, formatCoordinates } from '../lib/utils';

export interface PlanetData {
  planet: string;
  sign: string;
  sign_degree: number;
  house: number;
  nakshatra: string;
  pada: number | null;
}

export interface HoroscopeChart {
  [key: string]: string[];
}

export interface PredictionItem {
  title_en: string;
  title_ta: string;
  description_en: string;
  description_ta: string;
}

export interface PredictionData {
  lagna: PredictionItem;
  rasi: PredictionItem;
  nakshatra: PredictionItem;
}

export interface HoroscopeResponse {
  lagna: {
    sign: string;
    sign_degree: number;
    nakshatra: string;
    longitude: number;
  };
  planets: PlanetData[];
  rasi_chart: HoroscopeChart;
  navamsam_chart: HoroscopeChart;
  predictions: PredictionData;
}

const ZODIAC_SIGNS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
  'Simha', 'Kanya', 'Thula', 'Vrischika',
  'Dhanus', 'Makara', 'Kumbha', 'Meena'
];

const DASA_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const DASA_YEARS: Record<string, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17
};

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const getNakshatraAndPada = (longitude: number): { nakshatra: string; pada: number } => {
  const span = 360 / 27; // 13.333333 degrees
  const index = Math.floor(longitude / span) % 27;
  const positionInNakshatra = longitude - (index * span);
  const pada = Math.floor(positionInNakshatra / (span / 4)) + 1;
  return {
    nakshatra: NAKSHATRAS[index],
    pada: Math.min(4, Math.max(1, pada))
  };
};

const getSignName = (p: any): string => {
  if (p.rasi && typeof p.rasi === 'object' && p.rasi.id !== undefined) {
    return ZODIAC_SIGNS[p.rasi.id];
  }
  if (typeof p.rasi === 'string') {
    return p.rasi;
  }
  return ZODIAC_SIGNS[Math.floor(p.longitude / 30)] || 'Mesha';
};

// Map planet name returned by Prokerala to standardized names
const standardizePlanetName = (name: string): string => {
  const n = name.trim().toLowerCase();
  if (n.includes('ascendant') || n.includes('lagna')) return 'Lagna';
  if (n.includes('sun')) return 'Sun';
  if (n.includes('moon')) return 'Moon';
  if (n.includes('mars')) return 'Mars';
  if (n.includes('mercury')) return 'Mercury';
  if (n.includes('jupiter')) return 'Jupiter';
  if (n.includes('venus')) return 'Venus';
  if (n.includes('saturn')) return 'Saturn';
  if (n.includes('rahu')) return 'Rahu';
  if (n.includes('ketu')) return 'Ketu';
  return name;
};

export const calculateHoroscope = async (
  date: string,
  time: string,
  lat: number,
  lng: number,
  utcOffset: number,
  language: string = 'ta'
): Promise<HoroscopeResponse> => {
  const datetime = formatDatetime(date, time, utcOffset);
  const coordinates = formatCoordinates(lat, lng);

  const params = {
    datetime,
    coordinates,
    ayanamsa: '1', // Lahiri
    la: 'en', // Always request in English to ensure standardized parsing
  };

  // Cache horoscope calculations indefinitely since birth details don't change
  const res = await cachedProkeralaFetch('/astrology/planet-position', params, 0);

  const rawPlanets: any[] = res.data.planet_position || res.data || [];
  
  // Standardize and sort planets
  const mappedPlanets: PlanetData[] = rawPlanets.map((p: any) => {
    const stdName = standardizePlanetName(p.name || p.planet);
    const signDegree = p.degree !== undefined ? p.degree : (p.longitude % 30);
    const calculated = getNakshatraAndPada(p.longitude);
    
    return {
      planet: stdName,
      sign: getSignName(p),
      sign_degree: signDegree,
      house: p.house || p.position || 1,
      nakshatra: p.nakshatra || calculated.nakshatra,
      pada: p.pada !== undefined ? Number(p.pada) : calculated.pada,
    };
  });

  // Extract Lagna/Ascendant
  let lagnaNode = mappedPlanets.find(p => p.planet === 'Lagna');
  if (!lagnaNode) {
    // If not returned explicitly, default to house 1
    const p1 = rawPlanets[0];
    const p1Calculated = p1 ? getNakshatraAndPada(p1.longitude) : { nakshatra: 'Ashwini', pada: 1 };
    lagnaNode = {
      planet: 'Lagna',
      sign: p1 ? getSignName(p1) : 'Mesha',
      sign_degree: p1?.degree || 0,
      house: 1,
      nakshatra: p1?.nakshatra || p1Calculated.nakshatra,
      pada: p1?.pada !== undefined ? Number(p1.pada) : p1Calculated.pada,
    };
    mappedPlanets.push(lagnaNode);
  }

  const lagnaSign = lagnaNode.sign;
  const lagnaIndex = ZODIAC_SIGNS.indexOf(lagnaSign);
  const lagnaDegree = lagnaNode.sign_degree;
  const lagnaLong = (lagnaIndex * 30) + lagnaDegree;

  // Build Rasi Chart (D1)
  const rasi_chart: HoroscopeChart = {};
  for (let i = 1; i <= 12; i++) {
    rasi_chart[`house_${i}`] = [];
  }

  mappedPlanets.forEach((p) => {
    const signIndex = ZODIAC_SIGNS.indexOf(p.sign);
    const houseIndex = ((signIndex - lagnaIndex + 12) % 12) + 1;
    p.house = houseIndex; // Update house dynamically relative to Lagna
    rasi_chart[`house_${houseIndex}`].push(p.planet);
  });

  // Build Navamsam Chart (D9)
  const navamsam_chart: HoroscopeChart = {};
  for (let i = 1; i <= 12; i++) {
    navamsam_chart[`house_${i}`] = [];
  }

  // Calculate Navamsa sign for Lagna first
  const lagnaNavamsaIndex = Math.floor(lagnaLong / (10 / 3)) % 12;

  mappedPlanets.forEach((p) => {
    const pIndex = ZODIAC_SIGNS.indexOf(p.sign);
    const pLong = (pIndex * 30) + p.sign_degree;
    const navamsaIndex = Math.floor(pLong / (10 / 3)) % 12;
    const houseIndex = ((navamsaIndex - lagnaNavamsaIndex + 12) % 12) + 1;
    navamsam_chart[`house_${houseIndex}`].push(p.planet);
  });

  // Moon node for predictions
  const moonNode = mappedPlanets.find(p => p.planet === 'Moon') || lagnaNode;

  // Generate customized predictions
  const predictions: PredictionData = {
    lagna: {
      title_en: `Lagna in ${lagnaSign}`,
      title_ta: `${language === 'ta' ? 'லக்னம்' : 'Lagna'} - ${lagnaSign}`,
      description_en: `Your Ascendant is in ${lagnaSign}. This bestows you with a magnetic personality, a robust constitution, and a natural ability to command respect. You approach life's challenges with courage and an optimistic outlook, often leading others by example.`,
      description_ta: `உங்கள் லக்னம் ${lagnaSign} ஆகும். இது உங்களுக்கு கவர்ச்சிகரமான ஆளுமை, வலுவான உடல் அமைப்பு மற்றும் மற்றவர்களின் மரியாதையைப் பெறும் இயல்பான திறனை வழங்குகிறது. நீங்கள் வாழ்க்கையின் சவால்களை தைரியத்துடனும் நேர்மறையான கண்ணோட்டத்துடனும் எதிர்கொள்வீர்கள்.`
    },
    rasi: {
      title_en: `Moon Sign (Rasi) in ${moonNode.sign}`,
      title_ta: `இராசி - ${moonNode.sign}`,
      description_en: `Your Moon sign is ${moonNode.sign}. This indicates a highly intuitive and emotional nature. You have deep empathy for others and value harmonious relationships above all. Your mind is creative, and you possess a strong sense of inner peace during stressful times.`,
      description_ta: `உங்கள் சந்திர இராசி ${moonNode.sign} ஆகும். இது ஒரு சிறந்த உள்ளுணர்வு மற்றும் உணர்ச்சிப்பூர்வமான தன்மையைக் குறிக்கிறது. நீங்கள் மற்றவர்களிடம் ஆழமான அனுதாபம் கொண்டுள்ளீர்கள் மற்றும் இணக்கமான உறவுகளுக்கு அதிக முக்கியத்துவம் கொடுப்பீர்கள்.`
    },
    nakshatra: {
      title_en: `Birth Star (Nakshatra) is ${moonNode.nakshatra}`,
      title_ta: `பிறந்த நட்சத்திரம் - ${moonNode.nakshatra}`,
      description_en: `You were born under the auspicious star ${moonNode.nakshatra}. This brings intellectual brilliance, a compassionate heart, and a life filled with spiritual growth. You possess refined artistic tastes and excel in communication and leadership roles.`,
      description_ta: `நீங்கள் புகழ்பெற்ற ${moonNode.nakshatra} நட்சத்திரத்தில் பிறந்துள்ளீர்கள். இது உங்களுக்கு அறிவுத்திறன், இரக்கமுள்ள இதயம் மற்றும் ஆன்மீக வளர்ச்சியைக் கொண்டுவருகிறது. நீங்கள் கலை ஆர்வமும் சிறந்த பேச்சுத்திறனும் கொண்டிருப்பீர்கள்.`
    }
  };

  return {
    lagna: {
      sign: lagnaSign,
      sign_degree: lagnaDegree,
      nakshatra: lagnaNode.nakshatra,
      longitude: lagnaLong
    },
    planets: mappedPlanets,
    rasi_chart,
    navamsam_chart,
    predictions
  };
};

export const calculateVimshottariDasha = (birthDateStr: string, moonLongitude: number) => {
  const birthDate = new Date(birthDateStr);
  
  // Total span of 27 Nakshatras is 360 degrees
  const nakshatraSpan = 360 / 27; // 13.33333 degrees
  const nakshatraIndex = Math.floor(moonLongitude / nakshatraSpan) % 27;
  
  // Calculate lord index
  const startingLordIndex = nakshatraIndex % 9;
  const startingDasaLord = DASA_LORDS[startingLordIndex];
  
  const positionInNakshatra = moonLongitude - (nakshatraIndex * nakshatraSpan);
  const fractionElapsed = positionInNakshatra / nakshatraSpan;
  
  const startingDasaYears = DASA_YEARS[startingDasaLord];
  const remainingYears = (1 - fractionElapsed) * startingDasaYears;
  
  const timeline: any[] = [];
  let currentDate = new Date(birthDate);

  // Compute 9 successive dashas starting from the birth lord
  for (let i = 0; i < 9; i++) {
    const lordIdx = (startingLordIndex + i) % 9;
    const lord = DASA_LORDS[lordIdx];
    const totalYears = DASA_YEARS[lord];
    
    // First dasha is only the remaining balance
    const dashaYears = i === 0 ? remainingYears : totalYears;
    
    const startDate = new Date(currentDate);
    const endDate = new Date(startDate);
    
    // Add years and days accurately
    const fractionalYears = dashaYears;
    const fullYears = Math.floor(fractionalYears);
    const remainingDays = Math.floor((fractionalYears - fullYears) * 365.25);
    
    endDate.setFullYear(endDate.getFullYear() + fullYears);
    endDate.setDate(endDate.getDate() + remainingDays);
    
    // Calculate sub-dashas (Bhuktis)
    const bhuktis: any[] = [];
    let bhuktiStartDate = new Date(startDate);
    
    for (let j = 0; j < 9; j++) {
      const bhuktiLordIdx = (lordIdx + j) % 9;
      const bhuktiLord = DASA_LORDS[bhuktiLordIdx];
      
      // Bhukti proportion: (MahaDasa Years * BhuktiLord Years) / 120
      const bhuktiSpanYears = (totalYears * DASA_YEARS[bhuktiLord]) / 120;
      const actualBhuktiYears = i === 0 ? (bhuktiSpanYears * (remainingYears / totalYears)) : bhuktiSpanYears;
      
      const bStart = new Date(bhuktiStartDate);
      const bEnd = new Date(bStart);
      
      const bFullYears = Math.floor(actualBhuktiYears);
      const bRemainingDays = Math.floor((actualBhuktiYears - bFullYears) * 365.25);
      
      bEnd.setFullYear(bEnd.getFullYear() + bFullYears);
      bEnd.setDate(bEnd.getDate() + bRemainingDays);
      
      bhuktis.push({
        dasha_lord: bhuktiLord,
        start_date: bStart.toISOString().split('T')[0],
        end_date: bEnd.toISOString().split('T')[0],
      });
      
      bhuktiStartDate = new Date(bEnd);
    }
    
    timeline.push({
      dasha_lord: lord,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      years: Number(dashaYears.toFixed(2)),
      bhuktis
    });
    
    currentDate = new Date(endDate);
  }

  // Determine current active dasa at current time
  const now = new Date();
  let currentDasa = 'Ketu';
  let currentBhukti = 'Ketu';
  let currentEnds = '';

  for (const period of timeline) {
    const start = new Date(period.start_date);
    const end = new Date(period.end_date);
    if (now >= start && now <= end) {
      currentDasa = period.dasha_lord;
      currentEnds = period.end_date;
      
      // Find matching bhukti
      for (const bh of period.bhuktis) {
        const bStart = new Date(bh.start_date);
        const bEnd = new Date(bh.end_date);
        if (now >= bStart && now <= bEnd) {
          currentBhukti = bh.dasha_lord;
          break;
        }
      }
      break;
    }
  }

  return {
    current: {
      dasha: currentDasa,
      bhukti: currentBhukti,
      anthara: 'Swayam',
      ends_at: currentEnds || timeline[0].end_date
    },
    timeline
  };
};

export interface TransitData {
  natal_moon_sign: string;
  transit_date: string;
  transits: Record<string, {
    sign: string;
    sign_degree: number;
    house: number;
    interpretation_en: string;
    interpretation_ta: string;
  }>;
  special_transits: {
    ezharai_sani: {
      active: boolean;
      phase: string;
      phase_ta: string;
      desc: string;
      desc_ta: string;
    };
    ashtama_sani: {
      active: boolean;
      desc: string;
      desc_ta: string;
    };
    ardhastama_sani: {
      active: boolean;
      desc: string;
      desc_ta: string;
    };
    guru_transit: {
      house: number;
      auspicious: boolean;
      desc: string;
      desc_ta: string;
    };
  };
}

export const calculateTransit = (rasi: string): TransitData => {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Transiting planet positions in 2026
  const transitingPlanets = {
    Saturn: { sign: 'Meena', degree: 14.5 },
    Jupiter: { sign: 'Mithuna', degree: 8.2 },
    Rahu: { sign: 'Kumbha', degree: 21.4 },
    Ketu: { sign: 'Simha', degree: 21.4 }
  };

  const rasiIdx = ZODIAC_SIGNS.indexOf(rasi);
  if (rasiIdx === -1) {
    throw new Error('Invalid rasi moon sign provided');
  }

  const transits: Record<string, {
    sign: string;
    sign_degree: number;
    house: number;
    interpretation_en: string;
    interpretation_ta: string;
  }> = {};

  // Saturn Interpretations
  const getSaturnInterpretation = (house: number) => {
    switch (house) {
      case 1:
        return {
          en: 'Saturn is transiting your Janma Rasi (1st house). This is the peak phase of Ezharai Sani. Expect increased responsibilities, career challenges, and the need for hard work and patience. Take care of health.',
          ta: 'சனி பகவான் உங்கள் ஜென்ம ராசியில் சஞ்சரிக்கிறார். இது ஏழரை சனியின் மத்திம காலமாகும். கூடுதல் பொறுப்புகள், தொழில் சவால்கள் மற்றும் பொறுமை தேவைப்படும் காலமாகும். ஆரோக்கியத்தில் கவனம் செலுத்துங்கள்.'
        };
      case 2:
        return {
          en: 'Saturn is transiting your 2nd house (final phase of Ezharai Sani). Watch your speech and financial expenditures. Family issues will require gentle handling, but overall relief is on the horizon.',
          ta: 'சனி பகவான் உங்கள் 2-ஆம் இடத்தில் சஞ்சரிக்கிறார் (ஏழரை சனியின் இறுதிக்கட்டம்). வார்த்தைகளிலும் நிதிச் செலவுகளிலும் கவனம் தேவை. குடும்பப் பிரச்சனைகளை நிதானமாக கையாள்வது நன்று.'
        };
      case 3:
        return {
          en: 'Saturn in the 3rd house is highly auspicious! This brings tremendous success, victory over adversaries, career advancement, courage, and relief from past struggles.',
          ta: '3-ஆம் இடத்தில் சனி பகவான் சஞ்சரிப்பது உன்னத பலன்களைத் தரும்! இது அபார வெற்றி, எதிரிகளை வெல்லுதல், தொழில் முன்னேற்றம், தைரியம் மற்றும் கடந்த கால இன்னல்களிலிருந்து நிவாரணத்தைக் கொண்டுவரும்.'
        };
      case 4:
        return {
          en: 'Saturn is in the 4th house, constituting Ardhastama Sani. Focus on domestic peace, avoid real estate disputes, and drive carefully. Career transition is possible.',
          ta: '4-ஆம் இடத்தில் சனி சஞ்சரிப்பதால் அர்த்தாஷ்டம சனி நடைபெறுகிறது. குடும்ப அமைதிக்கு முக்கியத்துவம் கொடுங்கள், சொத்து தகராறுகளைத் தவிர்க்கவும், வாகன பயணங்களில் கவனம் தேவை.'
        };
      case 5:
        return {
          en: 'Saturn in the 5th house affects speculative investments and decision making. Focus on children\'s welfare and avoid hasty financial risks. Deepen spiritual practices.',
          ta: '5-ஆம் இடத்தில் சனி சஞ்சரிப்பதால் ஊக முதலீடுகள் மற்றும் அவசர முடிவுகளைத் தவிர்க்க வேண்டும். குழந்தைகளின் நலனில் அக்கறை காட்டுங்கள். ஆன்மீகப் பழக்கங்களை மேம்படுத்துங்கள்.'
        };
      case 6:
        return {
          en: 'Saturn in the 6th house is extremely favorable! It brings debt clearance, health recovery, professional dominance, success in competitive pursuits, and overall stability.',
          ta: '6-ஆம் இடத்தில் சனி சஞ்சரிப்பது மிகவும் சாதகமானது! இது கடன் நிவர்த்தி, உடல்நல முன்னேற்றம், தொழில் வெற்றி மற்றும் ஒட்டுமொத்த ஸ்திரத்தன்மையைக் கொண்டுவரும்.'
        };
      case 7:
        return {
          en: 'Saturn in the 7th house (Kanda Sani) influences partnerships and marital life. Maintain transparency with partners, avoid conflicts, and focus on collaborative efforts.',
          ta: '7-ஆம் இடத்தில் சனி சஞ்சரிப்பதால் (கண்ட சனி) கூட்டாண்மை மற்றும் திருமண வாழ்க்கையில் கவனம் தேவை. துணையுடன் வெளிப்படைத்தன்மையைப் பேணுங்கள்.'
        };
      case 8:
        return {
          en: 'Saturn is in the 8th house, signifying Ashtama Sani. This calls for extreme caution in all areas. Avoid risky ventures, watch your health, and practice meditation to maintain peace of mind.',
          ta: '8-ஆம் இடத்தில் சனி சஞ்சரிப்பதால் அஷ்டம சனி நடைபெறுகிறது. அனைத்து விஷயங்களிலும் மிகுந்த எச்சரிக்கை தேவை. ஆபத்தான முயற்சிகளைத் தவிர்த்து, ஆரோக்கியத்தில் கவனம் செலுத்துங்கள்.'
        };
      case 9:
        return {
          en: 'Saturn in the 9th house affects long journeys, higher studies, and relationships with mentors/father. Rewards will come but with delays. Spiritual inclinations will increase.',
          ta: '9-ஆம் இடத்தில் சனி சஞ்சரிப்பது நீண்ட தூர பயணங்கள், தந்தை மற்றும் குருமார்களுடனான உறவில் தாமதமான பலன்களைத் தரும். ஆன்மீக நாட்டம் அதிகரிக்கும்.'
        };
      case 10:
        return {
          en: 'Saturn in the 10th house demands dedicated efforts at the workplace. Career growth is promised through persistent diligence. Avoid workplace politics and controversies.',
          ta: '10-ஆம் இடத்தில் சனி சஞ்சரிப்பதால் பணியிடத்தில் அர்ப்பணிப்புடன் உழைக்க வேண்டும். விடாமுயற்சியால் தொழில் வளர்ச்சி நிச்சயம். தேவையற்ற விவாதங்களைத் தவிர்க்கவும்.'
        };
      case 11:
        return {
          en: 'Saturn in the 11th house is exceptionally auspicious! Expect gain of wealth, realization of long-held desires, recognition, support from friends, and massive business growth.',
          ta: '11-ஆம் இடத்தில் சனி சஞ்சரிப்பது மிகச் சிறந்த சுப பலன்களைத் தரும்! பண வரவு, நீண்ட நாள் ஆசைகள் நிறைவேறுதல், நண்பர்களின் ஆதரவு மற்றும் தொழில் வளர்ச்சி நிச்சயம்.'
        };
      case 12:
      default:
        return {
          en: 'Saturn is in the 12th house, marking the beginning of Ezharai Sani (Viraya Sani). Expenses will rise. Focus on investments, control impulse buying, and schedule regular medical checkups.',
          ta: '12-ஆம் இடத்தில் சனி சஞ்சரிப்பதால் ஏழரை சனியின் ஆரம்பக் கட்டம் (விரைய சனி) தொடங்குகிறது. செலவுகள் அதிகரிக்கும். சுப விரையங்களாக மாற்றுவது நல்லது.'
        };
    }
  };

  // Jupiter Interpretations
  const getJupiterInterpretation = (house: number) => {
    switch (house) {
      case 1:
        return {
          en: 'Jupiter is in your 1st house. Focus on self-discipline, mental clarity, and spiritual learning. Avoid ego conflicts.',
          ta: 'குரு பகவான் உங்கள் 1-ஆம் இடத்தில் சஞ்சரிக்கிறார். மன அமைதி மற்றும் ஆன்மீகக் கற்றலில் கவனம் செலுத்துங்கள்.'
        };
      case 2:
        return {
          en: 'Jupiter in the 2nd house is incredibly favorable! Expect financial prosperity, sweet speech, family harmony, and successful family celebrations.',
          ta: '2-ஆம் இடத்தில் குரு சஞ்சரிப்பது மிகவும் சாதகமானது! தன வரவு, குடும்பத்தில் சுப காரியங்கள், மற்றும் மகிழ்ச்சியைக் கொண்டுவரும்.'
        };
      case 3:
        return {
          en: 'Jupiter in the 3rd house emphasizes self-efforts and communication. Short travels will be fruitful. Maintain good relations with siblings.',
          ta: '3-ஆம் இடத்தில் குரு சஞ்சரிப்பது சுய முயற்சியையும் தகவல் தொடர்பையும் வலியுறுத்துகிறது. சகோதர உறவுகள் சீராகும்.'
        };
      case 4:
        return {
          en: 'Jupiter in the 4th house promotes domestic comforts, happiness, purchase of vehicles/property, and peace of mind.',
          ta: '4-ஆம் இடத்தில் குரு சஞ்சரிப்பது வீட்டு வசதி, மகிழ்ச்சி, வாகனச் சேர்க்கை மற்றும் மன அமைதியை மேம்படுத்தும்.'
        };
      case 5:
        return {
          en: 'Jupiter in the 5th house is highly auspicious (Poorva Punya). It brings wisdom, birth of children, intellect, success in studies, and investments.',
          ta: '5-ஆம் இடத்தில் குரு சஞ்சரிப்பது புத்திர பாக்கியம், கல்வி வெற்றி, மற்றும் புத்தி கூர்மையைத் தரும் சிறந்த காலம் ஆகும்.'
        };
      case 6:
        return {
          en: 'Jupiter in the 6th house helps resolve debts, defeat illnesses, and overcome professional challenges through wisdom.',
          ta: '6-ஆம் இடத்தில் குரு சஞ்சரிப்பது கடன் நிவர்த்தி, நோய் குணமாகுதல் மற்றும் சவால்களை அறிவுத்திறனால் வெல்ல உதவும்.'
        };
      case 7:
        return {
          en: 'Jupiter in the 7th house is excellent for marriage, partnership, travel, and public relations. Harmonious relationships are promised.',
          ta: '7-ஆம் இடத்தில் குரு சஞ்சரிப்பது திருமணம், கூட்டாண்மை மற்றும் உறவுகளில் உன்னத மகிழ்ச்சியைத் தரும்.'
        };
      case 8:
        return {
          en: 'Jupiter in the 8th house brings deep interest in occult sciences and legacy/inheritance gains. Focus on spiritual transformation.',
          ta: '8-ஆம் இடத்தில் குரு சஞ்சரிப்பது ஆன்மீகத் தேடல், பரம்பரைச் சொத்துக்கள் மற்றும் மறைமுக ஆதாயங்களைக் கொண்டுவரும்.'
        };
      case 9:
        return {
          en: 'Jupiter in the 9th house brings immense divine grace! Favorable for higher education, long journeys, meeting spiritual mentors, and father\'s support.',
          ta: '9-ஆம் இடத்தில் குரு சஞ்சரிப்பது பாக்கிய ஸ்தான பலன்களைத் தரும்! தந்தை மற்றும் குருமார்களின் ஆதரவு, ஆன்மீகப் பயணங்கள் கிட்டும்.'
        };
      case 10:
        return {
          en: 'Jupiter in the 10th house influences your career. Professional recognition, authority, and career advancement are highlighted.',
          ta: '10-ஆம் இடத்தில் குரு சஞ்சரிப்பது தொழில் மேன்மையையும், புதிய வேலை வாய்ப்புகளையும், அங்கீகாரத்தையும் தரும்.'
        };
      case 11:
        return {
          en: 'Jupiter in the 11th house is highly auspicious! Massive gains, professional success, expansion of network, and fulfillment of desires.',
          ta: '11-ஆம் இடத்தில் குரு சஞ்சரிப்பது அபார பண வரவு, ஆசைகள் நிறைவேறுதல் மற்றும் தொழில் லாபங்களைத் தரும்.'
        };
      case 12:
      default:
        return {
          en: 'Jupiter in the 12th house inspires spiritual travels, charity, and spending on noble causes. Focus on meditation.',
          ta: '12-ஆம் இடத்தில் குரு சஞ்சரிப்பது ஆன்மீகப் பயணங்கள், தர்ம காரியங்கள் மற்றும் நற்செலவுகளை ஊக்குவிக்கும்.'
        };
    }
  };

  // Rahu / Ketu Interpretations
  const getRahuInterpretation = (house: number) => {
    if ([3, 6, 11].includes(house)) {
      return {
        en: 'Rahu transiting your ' + house + ' house is highly beneficial. It drives ambition, brings material success, and grants courage to overcome professional challenges.',
        ta: 'ராகு பகவான் உங்கள் ' + house + '-ஆம் இடத்தில் சஞ்சரிப்பது சாதகமான பலன்களைத் தரும். பொருள் சேர்க்கை, தொழில் மேன்மை மற்றும் தைரியம் கிட்டும்.'
      };
    }
    return {
      en: 'Rahu in the ' + house + ' house encourages out-of-the-box thinking. Balance material ambitions with spiritual and ethical boundaries.',
      ta: 'ராகு பகவான் உங்கள் ' + house + '-ஆம் இடத்தில் சஞ்சரிப்பது மாற்று வழிகளில் சிந்திக்க வைக்கும். தேவையற்ற ஆசைகளைத் தவிர்ப்பது நல்லது.'
    };
  };

  const getKetuInterpretation = (house: number) => {
    if ([3, 6, 11].includes(house)) {
      return {
        en: 'Ketu in the ' + house + ' house acts as a protective shield. It helps dismantle obstacles, brings victory in disputes, and unlocks spiritual wisdom.',
        ta: 'கேது பகவான் உங்கள் ' + house + '-ஆம் இடத்தில் சஞ்சரிப்பது பாதுகாப்பான காலமாகும். தடைகள் விலகி, ஆன்மீக ஞானமும் வெற்றியும் கிட்டும்.'
      };
    }
    return {
      en: 'Ketu in the ' + house + ' house promotes detachment, introspective wisdom, and spiritual progress. Do not let passive thoughts affect work.',
      ta: 'கேது பகவான் உங்கள் ' + house + '-ஆம் இடத்தில் சஞ்சரிப்பதால் உலகியல் பற்று குறையும். தியானம் மற்றும் மன ஒருமைப்பாடு நன்மை தரும்.'
    };
  };

  // Populate transits record
  Object.entries(transitingPlanets).forEach(([planet, data]) => {
    const planetIdx = ZODIAC_SIGNS.indexOf(data.sign);
    const house = ((planetIdx - rasiIdx + 12) % 12) + 1;

    let interp = { en: '', ta: '' };
    if (planet === 'Saturn') {
      interp = getSaturnInterpretation(house);
    } else if (planet === 'Jupiter') {
      interp = getJupiterInterpretation(house);
    } else if (planet === 'Rahu') {
      interp = getRahuInterpretation(house);
    } else if (planet === 'Ketu') {
      interp = getKetuInterpretation(house);
    }

    transits[planet] = {
      sign: data.sign,
      sign_degree: data.degree,
      house,
      interpretation_en: interp.en,
      interpretation_ta: interp.ta
    };
  });

  // Calculate special Saturn transit indicators
  const saturnHouse = transits['Saturn'].house;
  const ezharaiActive = [12, 1, 2].includes(saturnHouse);
  let ezharaiPhase = 'None';
  let ezharaiPhaseTa = 'இல்லை';
  let ezharaiDesc = 'No Ezharai Sani active for your Moon sign.';
  let ezharaiDescTa = 'உங்கள் ராசிக்கு தற்போது ஏழரை சனி இல்லை.';

  if (saturnHouse === 12) {
    ezharaiPhase = 'First Phase (Viraya Sani)';
    ezharaiPhaseTa = 'முதல் கட்டம் (விரைய சனி)';
    ezharaiDesc = 'Saturn transits the 12th house relative to your Moon. Expenses may increase, but investing in useful assets will offset negative impacts.';
    ezharaiDescTa = 'சனி பகவான் உங்கள் ராசிக்கு 12-ஆம் இடத்தில் விரைய சனியாக சஞ்சரிக்கிறார். செலவுகள் அதிகரிக்கும், எனவே முதலீடுகளை முறையாகச் செய்ய வேண்டும்.';
  } else if (saturnHouse === 1) {
    ezharaiPhase = 'Second Phase (Jenma Sani)';
    ezharaiPhaseTa = 'இரண்டாம் கட்டம் (ஜென்ம சனி)';
    ezharaiDesc = 'Saturn transits directly over your birth Moon. Focus on mental fortitude, physical health, and avoid starting speculative new ventures.';
    ezharaiDescTa = 'சனி பகவான் உங்கள் ஜென்ம ராசியிலேயே சஞ்சரிக்கிறார். மன உறுதி, உடல் ஆரோக்கியம் மற்றும் தியானம் ஆகியவற்றில் கவனம் செலுத்துங்கள்.';
  } else if (saturnHouse === 2) {
    ezharaiPhase = 'Third Phase (Kudumba Sani)';
    ezharaiPhaseTa = 'மூன்றாம் கட்டம் (குடும்ப சனி)';
    ezharaiDesc = 'Saturn transits the 2nd house of family and speech. Guard your words in disputes and avoid entering large financial agreements without verification.';
    ezharaiDescTa = 'சனி பகவான் 2-ஆம் இடமான குடும்ப சனியாக சஞ்சரிக்கிறார். குடும்பத்தினரிடம் வீண் வாக்குவாதங்களைத் தவிர்த்து அமைதியைக் கடைப்பிடிக்கவும்.';
  }

  const guruHouse = transits['Jupiter'].house;
  const guruAuspicious = [2, 5, 7, 9, 11].includes(guruHouse);
  let guruDesc = 'Jupiter is transiting your ' + guruHouse + ' house. Expect steady, stable progress. This is a good time to focus on professional consolidation.';
  let guruDescTa = 'குரு பகவான் உங்கள் ' + guruHouse + '-ஆம் இடத்தில் சஞ்சரிக்கிறார். சீரான வளர்ச்சியைத் தரும் காலம். தொழில் சார்ந்த பணிகளில் கவனம் செலுத்தலாம்.';

  if (guruAuspicious) {
    guruDesc = 'Jupiter transit in your ' + guruHouse + ' house is exceptionally auspicious (Guru Balam active!). Expect financial luck, joy, and successful milestone events.';
    guruDescTa = 'குரு பகவான் ' + guruHouse + '-ஆம் இடத்தில் சஞ்சரிப்பது உன்னத சுப பலன்களைத் தரும்! பண வரவு, உறவுகள் பலப்படுதல், மற்றும் மங்கள காரியங்கள் கூடிவரும்.';
  }

  return {
    natal_moon_sign: rasi,
    transit_date: todayStr,
    transits,
    special_transits: {
      ezharai_sani: {
        active: ezharaiActive,
        phase: ezharaiPhase,
        phase_ta: ezharaiPhaseTa,
        desc: ezharaiDesc,
        desc_ta: ezharaiDescTa
      },
      ashtama_sani: {
        active: saturnHouse === 8,
        desc: saturnHouse === 8 ? 'Saturn is transiting your 8th house, causing Ashtama Sani. Use caution in physical travel, avoid loans, and focus on physical therapy.' : 'No Ashtama Sani active.',
        desc_ta: saturnHouse === 8 ? 'சனி பகவான் உங்கள் ராசிக்கு 8-ஆம் இடத்தில் அஷ்டம சனியாக சஞ்சரிக்கிறார். பயணங்களில் எச்சரிக்கை தேவை, தேவையற்ற கடன்களைத் தவிர்க்கவும்.' : 'அஷ்டம சனியின் தாக்கம் இல்லை.'
      },
      ardhastama_sani: {
        active: saturnHouse === 4,
        desc: saturnHouse === 4 ? 'Saturn is transiting your 4th house, causing Ardhastama Sani. Keep domestic affairs peaceable and take preventive care of your health.' : 'No Ardhastama Sani active.',
        desc_ta: saturnHouse === 4 ? 'சனி பகவான் 4-ஆம் இடத்தில் அர்த்தாஷ்டம சனியாக சஞ்சரிக்கிறார். குடும்ப அமைதியைப் பேணவும், ஆரோக்கியத்தில் அக்கறை காட்டவும்.' : 'அர்த்தாஷ்டம சனியின் தாக்கம் இல்லை.'
      },
      guru_transit: {
        house: guruHouse,
        auspicious: guruAuspicious,
        desc: guruDesc,
        desc_ta: guruDescTa
      }
    }
  };
};
