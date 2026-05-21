import { calculateHoroscope, PlanetData, HoroscopeChart } from './horoscope.service';

export interface PrasnamResponse {
  mode: 'aroodha_108' | 'clock';
  question_category: string;
  aroodha_number?: number;
  clock_time?: string;
  date: string;
  time: string;
  location: {
    lat: number;
    lng: number;
    city?: string;
  };
  udhaya_lagna: {
    sign: string;
    sign_ta: string;
    degree: number;
    nakshatra: string;
    pada: number;
  };
  aroodha_lagna: {
    sign: string;
    sign_ta: string;
  };
  chatra_lagna: {
    sign: string;
    sign_ta: string;
  };
  rasi_chart: HoroscopeChart;
  planets: PlanetData[];
  score: number;
  outcome_en: string;
  outcome_ta: string;
  prediction_en: string;
  prediction_ta: string;
  remedies_en: string[];
  remedies_ta: string[];
}

const ZODIAC_SIGNS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
  'Simha', 'Kanya', 'Thula', 'Vrischika',
  'Dhanus', 'Makara', 'Kumbha', 'Meena'
];

const ZODIAC_SIGNS_TA = [
  'மேஷம்', 'ரிஷபம்', 'மிதுனம்', 'கடகம்',
  'சிம்மம்', 'கன்னி', 'துலாம்', 'விருச்சிகம்',
  'தனுசு', 'மகரம்', 'கும்பம்', 'மீனம்'
];

export async function calculatePrasnam(
  category: string,
  mode: 'aroodha_108' | 'clock',
  date: string,
  time: string,
  lat: number,
  lng: number,
  utcOffset: number,
  aroodhaNumber?: number,
  clockHour?: number,
  clockMinute?: number,
  language: string = 'ta'
): Promise<PrasnamResponse> {
  // 1. Calculate astronomical planet transits at the moment of query
  const astroData = await calculateHoroscope(date, time, lat, lng, utcOffset, 'en');

  // 2. Extract Udhaya Lagna (Ascendant)
  let lagnaNode = astroData.planets.find(p => p.planet === 'Lagna') || {
    sign: astroData.lagna.sign,
    sign_degree: astroData.lagna.longitude % 30,
    nakshatra: astroData.lagna.nakshatra,
    pada: 1,
    planet: 'Lagna',
    house: 1
  };

  const udhayaIndex = ZODIAC_SIGNS.indexOf(lagnaNode.sign);
  let udhayaLagna = {
    sign: lagnaNode.sign,
    sign_ta: ZODIAC_SIGNS_TA[udhayaIndex],
    degree: lagnaNode.sign_degree,
    nakshatra: lagnaNode.nakshatra,
    pada: lagnaNode.pada || 1
  };

  // 3. Derive Aroodha and Udhaya based on calculation mode
  let aroodhaIndex = 0;
  
  if (mode === 'clock' && clockHour !== undefined && clockMinute !== undefined) {
    // Clock Prasnam Rules:
    // Hour hand (1 to 12) maps to Aroodha Lagna: 1=Mesha, 2=Vrishabha, ..., 12=Meena
    aroodhaIndex = (clockHour - 1) % 12;

    // Minute hand maps to Udhaya Lagna in 5-minute segments: 0-5 mins = Mesha, etc.
    const clockUdhayaIndex = Math.floor(clockMinute / 5) % 12;
    udhayaLagna = {
      sign: ZODIAC_SIGNS[clockUdhayaIndex],
      sign_ta: ZODIAC_SIGNS_TA[clockUdhayaIndex],
      degree: (clockMinute % 5) * 6, // 1 minute = 6 degrees inside the 30-degree zodiac sign
      nakshatra: 'Ashwini', // default mock nakshatra for clock calculations
      pada: 1
    };
  } else {
    // Default: Tamboola Aroodha 108 Grid
    const num = aroodhaNumber || 1;
    aroodhaIndex = Math.floor((num - 1) / 9) % 12;
  }

  const aroodhaLagna = {
    sign: ZODIAC_SIGNS[aroodhaIndex],
    sign_ta: ZODIAC_SIGNS_TA[aroodhaIndex]
  };

  // 4. Derive Chatra Lagna
  const sunNode = astroData.planets.find(p => p.planet === 'Sun');
  const sunIndex = sunNode ? ZODIAC_SIGNS.indexOf(sunNode.sign) : 0;
  const currentUdhayaIndex = ZODIAC_SIGNS.indexOf(udhayaLagna.sign);
  const d = (sunIndex - currentUdhayaIndex + 12) % 12;
  const chatraIndex = (aroodhaIndex + d) % 12;
  const chatraLagna = {
    sign: ZODIAC_SIGNS[chatraIndex],
    sign_ta: ZODIAC_SIGNS_TA[chatraIndex]
  };

  // 5. Construct custom Rasi Chart with markers (உ, ஆ, ச)
  const rasi_chart: HoroscopeChart = {};
  for (let i = 1; i <= 12; i++) {
    rasi_chart[`house_${i}`] = [];
  }

  // Populate planetary transits relative to Udhaya Lagna
  astroData.planets.forEach((p) => {
    if (p.planet === 'Lagna') return;
    const signIdx = ZODIAC_SIGNS.indexOf(p.sign);
    const houseIndex = ((signIdx - currentUdhayaIndex + 12) % 12) + 1;
    rasi_chart[`house_${houseIndex}`].push(p.planet);
  });

  // Inject markers
  const uHouse = 1;
  const aHouse = ((aroodhaIndex - currentUdhayaIndex + 12) % 12) + 1;
  const cHouse = ((chatraIndex - currentUdhayaIndex + 12) % 12) + 1;

  rasi_chart[`house_${uHouse}`].unshift('உ (Udhaya)');
  rasi_chart[`house_${aHouse}`].push('ஆ (Aroodha)');
  rasi_chart[`house_${cHouse}`].push('ச (Chatra)');

  // 6. Compute score (Aroodha-Udhaya relationship)
  const houseDistance = ((currentUdhayaIndex - aroodhaIndex + 12) % 12) + 1;
  let score = 60;
  let outcome_en = 'Neutral / Favorable with moderate effort';
  let outcome_ta = 'முயற்சியால் வெற்றி பெறலாம்';

  switch (houseDistance) {
    case 1:
      score = 90;
      outcome_en = 'Highly Favorable (Atma Balam)';
      outcome_ta = 'மிகவும் சாதகமானது (ஆத்ம பலம்)';
      break;
    case 5:
    case 9:
      score = 95;
      outcome_en = 'Excellent & Auspicious (Daiva Balam)';
      outcome_ta = 'அதிர்ஷ்டமும் தெய்வ அனுகூலமும் நிறைந்தது';
      break;
    case 10:
    case 11: // Incorporate 11th Labhastana as high success in clock/pot prasnams
      score = 88;
      outcome_en = 'Favorable / Subha Labha Success';
      outcome_ta = 'காரிய சித்தியும் தடையற்ற லாபமும் உண்டாகும்';
      break;
    case 4:
    case 7:
      score = 75;
      outcome_en = 'Positive with moderate coordination';
      outcome_ta = 'நம்பிக்கையான சுப பலன்கள் கூடி வரும்';
      break;
    case 6:
      score = 40;
      outcome_en = 'Obstacles and Conflicts (Shatru Dosham)';
      outcome_ta = 'சவால்களும் எதிர்ப்புகளும் நிறைந்த காலம்';
      break;
    case 8:
      score = 25;
      outcome_en = 'Severe Obstacles and Delays (Ashtama Balam)';
      outcome_ta = 'காரிய தாமதம் மற்றும் மன உளைச்சல் ஏற்படலாம்';
      break;
    case 12:
      score = 30;
      outcome_en = 'Loss of Energy or Resources';
      outcome_ta = 'தேவையற்ற விரயங்கள் மற்றும் அலைச்சல்கள்';
      break;
    default:
      score = 60;
      outcome_en = 'Moderate / Neutral Outcome';
      outcome_ta = 'சாதாரண சுப பலன்கள் கிடைக்கும்';
  }

  // 7. Category predictions
  let prediction_en = '';
  let prediction_ta = '';
  let remedies_en: string[] = [];
  let remedies_ta: string[] = [];

  const isPositive = score >= 75;
  const isModerate = score >= 50 && score < 75;

  if (category === 'marriage') {
    if (isPositive) {
      prediction_en = 'The marriage proposal will succeed beautifully. Rasi alignments indicate strong harmony between partners and support from family elders. An auspicious date for union can be fixed soon.';
      prediction_ta = 'திருமண முயற்சி வெற்றிகரமாக கைகூடும். வரன் மிகவும் பொருத்தமாகவும், குடும்பத்தினரின் பேராதரவோடும் அமையும். விரையில் கெட்டிமேள சத்தம் கேட்கும்.';
      remedies_en = ['Perform milk abhishekam to Goddess Durga on Fridays', 'Donate sweets to young children'];
      remedies_ta = ['வெள்ளிக்கிழமைகளில் துர்கை அம்மனுக்கு பால் அபிஷேகம் செய்யவும்', 'சிறு குழந்தைகளுக்கு இனிப்புகள் வழங்கவும்'];
    } else if (isModerate) {
      prediction_en = 'Marriage plans will succeed but require patience. Keep negotiations clear to prevent small misunderstandings. Consulting an elder will resolve any friction.';
      prediction_ta = 'திருமண காரியங்கள் கைகூடும் ஆனால் பொறுமை தேவை. எதையும் வெளிப்படையாகப் பேசுவது நலம். பெரியோர்களின் தலையீடு குழப்பங்களை தீர்க்கும்.';
      remedies_en = ['Chant Lalitha Sahasranamam', 'Light a ghee lamp in a local temple'];
      remedies_ta = ['லலிதா சகஸ்ரநாமம் பாராயணம் செய்யவும்', 'அருகிலுள்ள கோவிலில் நெய் தீபம் ஏற்றவும்'];
    } else {
      prediction_en = 'Delays or friction in wedding preparations are indicated. Astrological transits suggest conflicting planetary aspects. Postpone major marriage discussions for a few weeks.';
      prediction_ta = 'மண வாழ்வில் சிறுசிறு குழப்பங்கள் அல்லது காரிய தடைகள் ஏற்படலாம். அவசர முடிவுகளைத் தவிர்த்து, கிரக நிலைகள் சீராகும் வரை பொறுமை காக்கவும்.';
      remedies_en = ['Perform Rahu-Ketu pariharam puja', 'Feed street animals on Saturdays'];
      remedies_ta = ['ராகு கேது நிவர்த்தி பூஜை செய்யவும்', 'சனிக்கிழமைகளில் விலங்குகளுக்கு உணவு வழங்கவும்'];
    }
  } else if (category === 'career') {
    if (isPositive) {
      prediction_en = 'Superb career progress and professional achievements! New job offers, promotions, or lucrative business partnerships are highly favored. Superiors will recognize your worth.';
      prediction_ta = 'உத்தியோகத்தில் அபார முன்னேற்றம் மற்றும் தொழில் வளம் பெருகும். புதிய வேலைவாய்ப்புகள் மற்றும் பதவி உயர்வு கிடைக்கப் பெறுவீர்கள். மேலதிகாரிகள் உங்களைப் பாராட்டுவர்.';
      remedies_en = ['Chant Aditya Hrudaya Stotram', 'Donate green clothes on Wednesdays'];
      remedies_ta = ['ஆதித்ய ஹிருதய ஸ்தோத்திரம் ஜபிக்கவும்', 'புதன்கிழமைகளில் பச்சை நிற ஆடைகள் தானம் செய்யவும்'];
    } else if (isModerate) {
      prediction_en = 'Steady growth is predicted. Professional tasks will complete smoothly, but rewards might experience minor delays. Continue your efforts without loss of enthusiasm.';
      prediction_ta = 'வேலையில் சீரான முன்னேற்றம் காணப்படும். உழைப்பு வீண் போகாது, ஆனால் அதற்கான நற்பெயர் கிடைக்கச் சில நாட்கள் காத்திருக்க வேண்டும்.';
      remedies_en = ['Light sesame oil lamp for Saturn on Saturdays', 'Chant Hanuman Chalisa'];
      remedies_ta = ['சனிக்கிழமைகளில் எள் தீபம் ஏற்றி வழிபடவும்', 'ஹனுமான் சாலீசா ஜபிக்கவும்'];
    } else {
      prediction_en = 'Professional disputes or high stress might cause concern. Keep communication strictly professional and avoid speculative financial investments.';
      prediction_ta = 'தொழிலில் போட்டிகளும் மறைமுக எதிர்ப்புகளும் அதிகரிக்கும். தேவையற்ற சச்சரவுகளைத் தவிர்த்து, உங்களது வழக்கமான பணிகளில் மட்டும் கவனம் செலுத்தவும்.';
      remedies_en = ['Offer archana to Lord Ganesha on Sankatahara Chaturthi', 'Feed the poor'];
      remedies_ta = ['சங்கடஹர சதுர்த்தியன்று விநாயகருக்கு அர்ச்சனை செய்யவும்', 'ஏழைகளுக்கு அன்னதானம் வழங்கவும்'];
    }
  } else if (category === 'health') {
    if (isPositive) {
      prediction_en = 'Excellent recuperative power! Ailments will clear out swiftly under active treatment. Vitality and mental peace are on a sharp uptrend.';
      prediction_ta = 'உடல் ஆரோக்கியம் மிகச் சிறப்பாக மேம்படும். மருத்துவ சிகிச்சைகள் நல்ல பலனைத் தரும். மன அமைதியும் புத்துணர்ச்சியும் தடையின்றி கிட்டும்.';
      remedies_en = ['Chant Maha Mrityunjaya Mantra 11 times daily', 'Donate medicines to a charitable dispensary'];
      remedies_ta = ['தினமும் மிருத்யுஞ்சய மந்திரம் ஜபிக்கவும்', 'ஏழைகளின் மருத்துவச் செலவிற்கு உதவவும்'];
    } else if (isModerate) {
      prediction_en = 'Health remains generally stable. Maintain a regular diet and sound sleep cycles. Regular mild exercise or yoga will prevent stress-induced symptoms.';
      prediction_ta = 'ஆரோக்கியம் திருப்திகரமாக இருக்கும். முறையான உடற்பயிற்சியும் தூக்கமும் அவசியம். சிறு உபாதைகளையும் உடனுக்குடன் கவனிப்பது நல்லது.';
      remedies_en = ['Pray to Lord Dhanvantari on Thursdays', 'Feed birds with grains'];
      remedies_ta = ['தன்வந்திரி பகவானை வியாழக்கிழமைகளில் வழிபடவும்', 'பறவைகளுக்கு தானியங்கள் வைக்கவும்'];
    } else {
      prediction_en = 'Vulnerabilities to fatigue, low immunity, or joint pains are indicated. Prioritize nutrition and rest. Do not ignore symptoms; consult a specialist promptly.';
      prediction_ta = 'உடல் சோர்வு மற்றும் பிணிகளால் மனக்கவலை ஏற்படலாம். ஆரோக்கியத்தில் அலட்சியம் காட்டாமல் தகுந்த மருத்துவரை நாடவும்.';
      remedies_en = ['Sponsor a community prayer or homam', 'Feed black crows mixed cooked rice and sesame'];
      remedies_ta = ['சிவபெருமானுக்கு ருத்ராபிஷேகம் செய்விக்கவும்', 'சனிக்கிழமை காகத்திற்கு எள் சாதம் வைக்கவும்'];
    }
  } else if (category === 'lost_article') {
    if (isPositive) {
      prediction_en = 'Excellent indications for recovery! The article is safely located nearby. Check corners facing the direction of the Chatra Lagna. It will be found within days.';
      prediction_ta = 'காணாமல் போன பொருள் நிச்சயம் மீண்டும் கிடைக்கும். அது பத்திரமாக அருகிலேயே உள்ளது. சத்ர லக்ன திசையில் தேடினால் எளிதில் கண்டறியலாம்.';
      remedies_en = ['Pray to Kartikeya', 'Donate milk at a temple'];
      remedies_ta = ['முருகப் பெருமானுக்கு நெய் தீபம் ஏற்றவும்', 'கோவிலில் பால் தானம் வழங்கவும்'];
    } else if (isModerate) {
      prediction_en = 'Recovery is possible but demands intense search. Seek the help of a family member. Keep looking patiently in drawers and high-up shelves.';
      prediction_ta = 'பொருள் கிடைப்பதற்கு வாய்ப்புகள் உள்ளன ஆனால் தீவிரத் தேடுதல் தேவை. குடும்ப உறுப்பினர்களுடன் இணைந்து பொறுமையாகத் தேடவும்.';
      remedies_en = ['Chant Ganesha Stotram', 'Donate salt'];
      remedies_ta = ['விநாயகர் துதி ஜபிக்கவும்', 'உப்பு தானம் செய்யவும்'];
    } else {
      prediction_en = 'Low chances of recovering the missing article. It may have drifted far away or been misplaced in public transit. Focus on safeguarding other valuables.';
      prediction_ta = 'காணாமல் போன பொருள் திரும்பக் கிடைப்பது அரிது. எதிலும் விழிப்புடன் செயல்பட்டு மற்ற பொருட்களைப் பாதுகாத்துக் கொள்ளவும்.';
      remedies_en = ['Perform Kalabhairava puja on Ashtami', 'Feed stray animals'];
      remedies_ta = ['அஷ்டமி திதியில் பைரவருக்கு செவ்வரளி மாலை சாற்றி வழிபடவும்', 'விலங்குகளுக்கு உணவளிக்கவும்'];
    }
  } else if (category === 'travel') {
    if (isPositive) {
      prediction_en = 'Your travel aspirations are highly favored! Foreign visas, educational travels, or leisure journeys will be extremely successful and bring immense joy.';
      prediction_ta = 'பயணங்கள் மிகவும் அனுகூலமாக அமையும். வெளிநாட்டு விசா அனுமதிகள் தடையின்றி கிடைக்கும். பயணங்கள் மூலம் நன்மைகளும் லாபமும் உண்டாகும்.';
      remedies_en = ['Chant Hanuman Chalisa', 'Feed traveler monkeys or donate fruits'];
      remedies_ta = ['ஹனுமான் சாலீசா ஜபித்து பயணத்தைத் துவங்கவும்', 'முதியவர்களுக்கு பழங்களை தானம் செய்யவும்'];
    } else if (isModerate) {
      prediction_en = 'Travel plans will go through but expect minor administrative delays. Verify documents, tickets, and bookings carefully to ensure a peaceful journey.';
      prediction_ta = 'பயணங்கள் கைகூடும் ஆனால் சிறுசிறு ஆவணத் தாமதங்கள் வந்து நீங்கும். பயணத்திற்கு முன் அனைத்து விபரங்களையும் இருமுறை சரிபார்ப்பது உசிதம்.';
      remedies_en = ['Chant Margabandhu Stotram', 'Donate water to thirsty travelers'];
      remedies_ta = ['மார்க்கபந்து ஸ்தோத்திரம் ஜபிக்கவும்', 'கோடை காலத்தில் நீர் மோர் பந்தல் அமைக்க உதவவும்'];
    } else {
      prediction_en = 'Travel might lead to unexpected expenses, fatigue, or minor disputes. Postpone non-essential long journeys. If travel is mandatory, stay alert against theft.';
      prediction_ta = 'இப்போது மேற்கொள்ளும் பயணங்களால் அலைச்சலும் தேவையற்ற செலவுகளும் ஏற்படும். தவிர்க்க முடியாத பயணங்களில் மிகுந்த எச்சரிக்கையுடன் செயல்படவும்.';
      remedies_en = ['Chant Durga Stotram', 'Feed street dogs'];
      remedies_ta = ['துர்கை அம்மனுக்கு எலுமிச்சை தீபம் ஏற்றி வழிபடவும்', 'நாய்களுக்கு பிஸ்கட் அல்லது சோறு வழங்கவும்'];
    }
  } else {
    // General questions
    if (isPositive) {
      prediction_en = 'The query yields highly positive results. Your focus is aligned with divine luck. Take step-by-step actions and victory will be yours.';
      prediction_ta = 'நீங்கள் நினைத்த காரியம் மிகச் சிறப்பாக வெற்றி பெறும். கிரகங்களும் காலமும் உங்களுக்கு சாதகமாக இருப்பதால் தைரியமாக முயற்சிகளைத் தொடங்கலாம்.';
      remedies_en = ['Chant "Om Namah Shivaya" 108 times', 'Feed the hungry'];
      remedies_ta = ['"ஓம் நமசிவாய" மந்திரத்தை 108 முறை ஜபிக்கவும்', 'ஏழைகளுக்கு உணவு வழங்கவும்'];
    } else if (isModerate) {
      prediction_en = 'Good results will unfold steadily. Keep away from pessimistic thoughts and focus on consistent work. Remedies will help smooth any minor bumps.';
      prediction_ta = 'நினைத்த காரியங்கள் தடையின்றி நடக்கும் ஆனால் விடாமுயற்சி தேவை. நேர்மறை எண்ணங்களுடன் உழைத்தால் வெற்றி நிச்சயம்.';
      remedies_en = ['Light a ghee lamp in a temple on Thursdays', 'Feed cows'];
      remedies_ta = ['வியாழக்கிழமை குரு தட்சிணாமூர்த்திக்கு நெய் தீபம் ஏற்றவும்', 'பசுமாட்டிற்கு பழம் அல்லது புல் தரவும்'];
    } else {
      prediction_en = 'Friction or delays might cloud the current path. Postpone major launches or agreements. Seek the blessings of your spiritual guru/elders before taking decisions.';
      prediction_ta = 'இப்போது காலம் சாதகமாக இல்லை. புதிய முயற்சிகளைத் தள்ளிப்போடுவது நல்லது. குலதெய்வ வழிபாடும் எளிய பரிகாரங்களும் மன அமைதி தரும்.';
      remedies_en = ['Worship Goddess Durga', 'Feed the needy on Saturdays'];
      remedies_ta = ['துர்கை வழிபாடு செய்யவும்', 'ஏழைகளுக்கு மளிகைப் பொருட்கள் வாங்கித் தரவும்'];
    }
  }

  return {
    mode,
    question_category: category,
    aroodha_number: mode === 'aroodha_108' ? aroodhaNumber : undefined,
    clock_time: mode === 'clock' ? `${String(clockHour).padStart(2, '0')}:${String(clockMinute).padStart(2, '0')}` : undefined,
    date,
    time,
    location: {
      lat,
      lng
    },
    udhaya_lagna: udhayaLagna,
    aroodha_lagna: aroodhaLagna,
    chatra_lagna: chatraLagna,
    rasi_chart,
    planets: astroData.planets,
    score,
    outcome_en,
    outcome_ta,
    prediction_en,
    prediction_ta,
    remedies_en,
    remedies_ta
  };
}
