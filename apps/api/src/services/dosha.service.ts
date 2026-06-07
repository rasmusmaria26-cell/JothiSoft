import { PlanetData } from './horoscope.service';

const ZODIAC_SIGNS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
  'Simha', 'Kanya', 'Thula', 'Vrischika',
  'Dhanus', 'Makara', 'Kumbha', 'Meena'
];

export interface DoshaDetail {
  has_dosha: boolean;
  status_en: string;
  status_ta: string;
  severity: 'None' | 'Low' | 'Medium' | 'High';
  description_en: string;
  description_ta: string;
  cancellation_rules_en?: string[];
  cancellation_rules_ta?: string[];
  remedies_en: string[];
  remedies_ta: string[];
}

export interface DoshaAnalysisResponse {
  sevvai_dosham: DoshaDetail;
  rahu_ketu_dosham: DoshaDetail;
}

// Helper to find the house number of a target planet relative to a reference planet
function getRelativeHouse(planets: PlanetData[], targetName: string, refName: string): number {
  const target = planets.find(p => p.planet.toLowerCase() === targetName.toLowerCase());
  const ref = planets.find(p => p.planet.toLowerCase() === refName.toLowerCase());
  if (!target || !ref) return 1;

  const targetSignIdx = ZODIAC_SIGNS.indexOf(target.sign);
  const refSignIdx = ZODIAC_SIGNS.indexOf(ref.sign);

  return ((targetSignIdx - refSignIdx + 12) % 12) + 1;
}

export function calculateDoshaAnalysis(planets: PlanetData[]): DoshaAnalysisResponse {
  // 1. SEVVAI DOSHAM (Mars / Mangal Dosha)
  // Check Mars from Lagna, Moon, and Venus
  const mars = planets.find(p => p.planet === 'Mars');
  const lagna = planets.find(p => p.planet === 'Lagna');
  const moon = planets.find(p => p.planet === 'Moon');
  const venus = planets.find(p => p.planet === 'Venus');
  const jupiter = planets.find(p => p.planet === 'Jupiter');

  let hasSevvaiDosha = false;
  let sevvaiSeverity: 'None' | 'Low' | 'Medium' | 'High' = 'None';
  const sevvaiReasonsEn: string[] = [];
  const sevvaiReasonsTa: string[] = [];
  const sevvaiCancellationsEn: string[] = [];
  const sevvaiCancellationsTa: string[] = [];

  if (mars && lagna) {
    const houseFromLagna = getRelativeHouse(planets, 'Mars', 'Lagna');
    const houseFromMoon = getRelativeHouse(planets, 'Mars', 'Moon');
    const houseFromVenus = getRelativeHouse(planets, 'Mars', 'Venus');

    const doshaHouses = [1, 2, 4, 7, 8, 12];

    const inLagna = doshaHouses.includes(houseFromLagna);
    const inMoon = doshaHouses.includes(houseFromMoon);
    const inVenus = doshaHouses.includes(houseFromVenus);

    if (inLagna || inMoon || inVenus) {
      hasSevvaiDosha = true;
      if (inLagna) {
        sevvaiSeverity = 'High';
        sevvaiReasonsEn.push(`Mars is in the ${houseFromLagna} house from Lagna (Ascendant).`);
        sevvaiReasonsTa.push(`லக்னத்திற்கு ${houseFromLagna}-ஆம் இடத்தில் செவ்வாய் அமைந்துள்ளது.`);
      } else if (inMoon) {
        sevvaiSeverity = 'Medium';
        sevvaiReasonsEn.push(`Mars is in the ${houseFromMoon} house from Moon (Chandra Lagna).`);
        sevvaiReasonsTa.push(`சந்திரனுக்கு ${houseFromMoon}-ஆம் இடத்தில் செவ்வாய் அமைந்துள்ளது.`);
      } else {
        sevvaiSeverity = 'Low';
        sevvaiReasonsEn.push(`Mars is in the ${houseFromVenus} house from Venus.`);
        sevvaiReasonsTa.push(`சுக்கிரனுக்கு ${houseFromVenus}-ஆம் இடத்தில் செவ்வாய் அமைந்துள்ளது.`);
      }

      // Check for cancellations (Nivarthi)
      // Rule 1: Mars in own signs (Aries, Scorpio) or exaltation (Capricorn)
      if (['Mesha', 'Vrischika'].includes(mars.sign)) {
        sevvaiCancellationsEn.push("Mars is in its own sign, which significantly reduces the intensity.");
        sevvaiCancellationsTa.push("செவ்வாய் தனது சொந்த ஆட்சியாட்சி வீடுகளான மேஷம்/விருச்சிகத்தில் அமைந்துள்ளதால் தோஷ நிவர்த்தி ஆகிறது.");
      }
      if (mars.sign === 'Makara') {
        sevvaiCancellationsEn.push("Mars is exalted in Capricorn, which neutralizes the negative impact.");
        sevvaiCancellationsTa.push("செவ்வாய் தனது உச்ச வீடான மகரத்தில் அமைந்துள்ளதால் தோஷ நிவர்த்தி பெறுகிறது.");
      }
      // Rule 2: Guru conjunct or aspecting Mars
      if (jupiter) {
        const jupiterHouseFromMars = getRelativeHouse(planets, 'Jupiter', 'Mars');
        const aspectedByGuru = [1, 5, 7, 9].includes(jupiterHouseFromMars); // Guru aspects 1st (conjunction), 5th, 7th, 9th from its position
        if (aspectedByGuru) {
          sevvaiCancellationsEn.push("Benefic Jupiter (Guru) aspect or conjunction neutralizes the Sevvai Dosham (Guru Mangala Yoga).");
          sevvaiCancellationsTa.push("சுப கிரகமான குரு பகவானின் பார்வை அல்லது சேர்க்கை செவ்வாய்க்கு இருப்பதால் தோஷ நிவர்த்தி அடைகிறது.");
        }
      }
      // Rule 3: Mars in Taurus, Libra, Cancer (debilitated but reduces severity in some rules)
      if (['Vrishabha', 'Thula'].includes(mars.sign)) {
        sevvaiCancellationsEn.push("Mars is in Taurus or Libra (Venus signs), which acts as a cancellation.");
        sevvaiCancellationsTa.push("செவ்வாய் ரிஷபம் அல்லது துலாம் (சுக்கிர வீடுகள்) ஆகிய இடங்களில் இருப்பதால் தோஷ நிவர்த்தி பெறுகிறது.");
      }
    }
  }

  // Final status for Mars Dosha
  let sevvaiStatusEn = 'No Sevvai Dosham detected.';
  let sevvaiStatusTa = 'செவ்வாய் தோஷம் இல்லை.';
  let sevvaiDescEn = 'Mars is placed in a favorable position in your birth chart, meaning you have a balanced energy and no Sevvai Dosha defects.';
  let sevvaiDescTa = 'உங்கள் ஜாதகத்தில் செவ்வாய் சாதகமான நிலையில் உள்ளது. எனவே உங்களுக்கு செவ்வாய் தோஷ பாதிப்புகள் எதுவும் இல்லை.';
  let sevvaiRemediesEn: string[] = [];
  let sevvaiRemediesTa: string[] = [];

  if (hasSevvaiDosha) {
    const hasCancellations = sevvaiCancellationsEn.length > 0;
    if (hasCancellations) {
      sevvaiStatusEn = 'Sevvai Dosham Present (Cancelled / Low Impact)';
      sevvaiStatusTa = 'செவ்வாய் தோஷம் உள்ளது (நிவர்த்தி அடைந்துள்ளது)';
      sevvaiSeverity = 'Low';
      sevvaiDescEn = `Your chart shows Mars in a dosha house, but it meets classical exemption rules: ${sevvaiCancellationsEn.join(' ')}`;
      sevvaiDescTa = `உங்கள் ஜாதகத்தில் செவ்வாய் தோஷ வீடுகளில் இருந்தாலும், அது பின்வரும் விதிவிலக்குகளின்படி நிவர்த்தி அடைகிறது: ${sevvaiCancellationsTa.join(' ')}`;
    } else {
      sevvaiStatusEn = `Sevvai Dosham Detected (${sevvaiSeverity} Severity)`;
      sevvaiStatusTa = `செவ்வாய் தோஷம் உள்ளது (${sevvaiSeverity === 'High' ? 'அதி தீவிர' : 'மிதமான'} தோஷம்)`;
      sevvaiDescEn = `Mars is placed in a dosha-inflicting house: ${sevvaiReasonsEn.join(' ')} This may cause delays in marriage or administrative obstacles unless matched with a partner who also has Mars Dosha.`;
      sevvaiDescTa = `செவ்வாய் தோஷத்தை உண்டாக்கும் இடத்தில் அமர்ந்துள்ளது: ${sevvaiReasonsTa.join(' ')} இதனால் திருமணத்தில் தாமதம் அல்லது காரியத் தடைகள் ஏற்பட வாய்ப்புள்ளது. இதே தோஷமுள்ள வரனைத் தேர்ந்தெடுப்பது நல்லது.`;
    }

    // Remedies
    sevvaiRemediesEn = [
      'Worship Lord Murugan on Tuesdays by lighting a ghee lamp.',
      'Chant Kandha Sashti Kavasam or Subramanya Bhujangam daily.',
      'Donate red lentils (Masoor Dal) or red clothes to the needy on Tuesdays.',
      'Visit a temple of Lord Vaidyanatheswara (Vaitheeswaran Koil) if possible.'
    ];
    sevvaiRemediesTa = [
      'செவ்வாய்க்கிழமைகளில் முருகப்பெருமானுக்கு நெய் தீபம் ஏற்றி வழிபடவும்.',
      'தினமும் கந்த சஷ்டி கவசம் அல்லது சுப்பிரமணிய புஜங்கம் பாராயணம் செய்யவும்.',
      'செவ்வாய்க்கிழமைகளில் துவரம்பருப்பு அல்லது சிவப்பு நிற ஆடைகளை ஏழைகளுக்கு தானம் செய்யவும்.',
      'வைத்தீஸ்வரன் கோவிலுக்குச் சென்று செவ்வாய் பகவானுக்கு அர்ச்சனை செய்து வரவும்.'
    ];
  }

  const sevvaiDoshaDetail: DoshaDetail = {
    has_dosha: hasSevvaiDosha,
    status_en: sevvaiStatusEn,
    status_ta: sevvaiStatusTa,
    severity: sevvaiSeverity,
    description_en: sevvaiDescEn,
    description_ta: sevvaiDescTa,
    cancellation_rules_en: sevvaiCancellationsEn,
    cancellation_rules_ta: sevvaiCancellationsTa,
    remedies_en: sevvaiRemediesEn,
    remedies_ta: sevvaiRemediesTa
  };


  // 2. RAHU-KETU DOSHAM (Sarpa / Naga Dosham)
  // Check Rahu and Ketu from Lagna
  const rahu = planets.find(p => p.planet === 'Rahu');
  const ketu = planets.find(p => p.planet === 'Ketu');

  let hasRahuKetuDosha = false;
  let rahuKetuSeverity: 'None' | 'Low' | 'Medium' | 'High' = 'None';
  const rahuKetuReasonsEn: string[] = [];
  const rahuKetuReasonsTa: string[] = [];

  if (lagna) {
    const doshaHousesMajor = [1, 2, 7, 8];
    const doshaHousesMinor = [5, 12];

    const rahuHouse = rahu ? getRelativeHouse(planets, 'Rahu', 'Lagna') : 0;
    const ketuHouse = ketu ? getRelativeHouse(planets, 'Ketu', 'Lagna') : 0;

    const rahuInMajor = doshaHousesMajor.includes(rahuHouse);
    const ketuInMajor = doshaHousesMajor.includes(ketuHouse);
    const rahuInMinor = doshaHousesMinor.includes(rahuHouse);
    const ketuInMinor = doshaHousesMinor.includes(ketuHouse);

    if (rahuInMajor || ketuInMajor) {
      hasRahuKetuDosha = true;
      rahuKetuSeverity = 'High';
      if (rahuInMajor) {
        rahuKetuReasonsEn.push(`Rahu is placed in the ${rahuHouse} house from Lagna.`);
        rahuKetuReasonsTa.push(`லக்னத்திற்கு ${rahuHouse}-ஆம் இடத்தில் ராகு பகவான் அமைந்துள்ளார்.`);
      }
      if (ketuInMajor) {
        rahuKetuReasonsEn.push(`Ketu is placed in the ${ketuHouse} house from Lagna.`);
        rahuKetuReasonsTa.push(`லக்னத்திற்கு ${ketuHouse}-ஆம் இடத்தில் கேது பகவான் அமைந்துள்ளார்.`);
      }
    } else if (rahuInMinor || ketuInMinor) {
      hasRahuKetuDosha = true;
      rahuKetuSeverity = 'Medium';
      if (rahuInMinor) {
        rahuKetuReasonsEn.push(`Rahu is in the ${rahuHouse} house (minor dosha).`);
        rahuKetuReasonsTa.push(`லக்னத்திற்கு ${rahuHouse}-ஆம் இடத்தில் ராகு அமைந்துள்ளார் (மிதமான தோஷம்).`);
      }
      if (ketuInMinor) {
        rahuKetuReasonsEn.push(`Ketu is in the ${ketuHouse} house (minor dosha).`);
        rahuKetuReasonsTa.push(`லக்னத்திற்கு ${ketuHouse}-ஆம் இடத்தில் கேது அமைந்துள்ளார் (மிதமான தோஷம்).`);
      }
    }
  }

  // Final status for Rahu-Ketu Dosha
  let rahuKetuStatusEn = 'No Rahu-Ketu Dosham (Sarpa/Naga Dosha) detected.';
  let rahuKetuStatusTa = 'ராகு கேது தோஷம் (சர்ப்ப தோஷம்) இல்லை.';
  let rahuKetuDescEn = 'Rahu and Ketu are positioned favorably. You do not have any major Sarpa or Naga Dosha obstacles.';
  let rahuKetuDescTa = 'ராகு மற்றும் கேது கிரகங்கள் சாதகமான நிலையில் உள்ளன. இதனால் சர்ப்ப தோஷ பாதிப்புகள் எதுவும் இல்லை.';
  let rahuKetuRemediesEn: string[] = [];
  let rahuKetuRemediesTa: string[] = [];

  if (hasRahuKetuDosha) {
    rahuKetuStatusEn = `Rahu-Ketu Dosham Detected (${rahuKetuSeverity} Severity)`;
    rahuKetuStatusTa = `ராகு கேது தோஷம் (சர்ப்ப தோஷம்) உள்ளது (${rahuKetuSeverity === 'High' ? 'அதி தீவிர' : 'மிதமான'} தோஷம்)`;
    rahuKetuDescEn = `Rahu-Ketu placement in key houses: ${rahuKetuReasonsEn.join(' ')} This is classically referred to as Sarpa Dosham. It can cause delays in settlements, emotional swings, or health/family concerns.`;
    rahuKetuDescTa = `ராகு கேதுவின் நிலைகள்: ${rahuKetuReasonsTa.join(' ')} இது ஜாதகத்தில் சர்ப்ப தோஷத்தை குறிக்கிறது. இதனால் திருமணத் தடைகள், மன உளைச்சல், அல்லது உடல் உபாதைகள் வரக்கூடும்.`;

    rahuKetuRemediesEn = [
      'Worship Goddess Durga or Nagaraja on Tuesdays/Fridays during Rahu Kalam.',
      'Offer milk abhishekam to snake idols (Naga devatha) at a local temple.',
      'Chant Rahu and Ketu Moola mantras 108 times on Saturdays/Sundays.',
      'Perform Rahu-Ketu pariharam puja at Sri Kalahasti or Thirunageswaram if possible.'
    ];
    rahuKetuRemediesTa = [
      'செவ்வாய் மற்றும் வெள்ளிக்கிழமை ராகு காலத்தில் துர்க்கை அம்மனுக்கு விளக்கேற்றி வழிபடவும்.',
      'அருகிலுள்ள கோவிலில் நாக தேவதைகளுக்கு பால் அபிஷேகம் செய்து வழிபடவும்.',
      'சனிக்கிழமை மற்றும் ஞாயிற்றுக்கிழமைகளில் ராகு-கேது மூல மந்திரங்களை 108 முறை ஜபிக்கவும்.',
      'முடிந்தபோது ஸ்ரீகாளஹஸ்தி அல்லது திருநாகேஸ்வரம் சென்று சர்ப்ப தோஷ நிவர்த்தி பூஜை செய்யவும்.'
    ];
  }

  const rahuKetuDoshaDetail: DoshaDetail = {
    has_dosha: hasRahuKetuDosha,
    status_en: rahuKetuStatusEn,
    status_ta: rahuKetuStatusTa,
    severity: rahuKetuSeverity,
    description_en: rahuKetuDescEn,
    description_ta: rahuKetuDescTa,
    remedies_en: rahuKetuRemediesEn,
    remedies_ta: rahuKetuRemediesTa
  };

  return {
    sevvai_dosham: sevvaiDoshaDetail,
    rahu_ketu_dosham: rahuKetuDoshaDetail
  };
}
