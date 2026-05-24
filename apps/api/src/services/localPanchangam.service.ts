import * as Astronomy from 'astronomy-engine';

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const NAKSHATRAS_TA = [
  'அஸ்வினி', 'பரணி', 'கிருத்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை',
  'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்',
  'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை',
  'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்',
  'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி'
];

const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
  'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
  'Trayodashi', 'Chaturdashi', 'Purnima', 'Pratipada', 'Dwitiya', 'Tritiya',
  'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami',
  'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya'
];

const TITHIS_TA = [
  'பிரதமை', 'துவிதியை', 'திரிதியை', 'சதுர்த்தி', 'பஞ்சமி', 'சஷ்டி',
  'சப்தமி', 'அஷ்டமி', 'நவமி', 'தசமி', 'ஏகாதசி', 'துவாதசி',
  'திரயோதசி', 'சதுர்த்தசி', 'பௌர்ணமி', 'பிரதமை', 'துவிதியை', 'திரிதியை',
  'சதுர்த்தி', 'பஞ்சமி', 'சஷ்டி', 'சப்தமி', 'அஷ்டமி', 'நவமி',
  'தசமி', 'ஏகாதசி', 'துவாதசி', 'திரயோதசி', 'சதுர்த்தசி', 'அமாவாசை'
];

const YOGAS = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
  'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata',
  'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti'
];

const YOGAS_TA = [
  'விஷ்கம்பம்', 'ப்ரீதி', 'ஆயுஷ்மான்', 'சௌபாக்கியம்', 'சோபனம்', 'அதிகண்டம்',
  'சுகர்மம்', 'திருதி', 'சூலம்', 'கண்டம்', 'விருத்தி', 'துருவம்', 'வியாகாதம்',
  'ஹர்ஷணம்', 'வஜ்ரம்', 'சித்தி', 'வியதிபாதம்', 'வரியான்', 'பரிகம்', 'சிவம்',
  'சித்தம்', 'சாத்தியம்', 'சுபம்', 'சுக்கிலம்', 'பிரம்மம்', 'இந்திரம்', 'வைதிருதி'
];

const KARANAS = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
  'Shakuni', 'Chatushpada', 'Naga', 'Kintughna'
];

const KARANAS_TA = [
  'பவம்', 'பாலவம்', 'கௌலவம்', 'சைதிலம்', 'கரசை', 'வணிசை', 'பத்திரை',
  'சகுனி', 'சதுஷ்பாதம்', 'நாகவம்', 'கிம்ஸ்துக்னம்'
];

/**
 * Get approximate Sidereal longitudes for Sun and Moon for a given time
 */
export const getLocalPanchangam = (date: Date) => {
  const time = Astronomy.MakeTime(date);
  
  const sunVec = Astronomy.GeoVector(Astronomy.Body.Sun, time, true);
  const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, time, true);
  
  const sunEcl = Astronomy.Ecliptic(sunVec);
  const moonEcl = Astronomy.Ecliptic(moonVec);
  
  // Approximate Lahiri Ayanamsa
  const year = date.getUTCFullYear();
  const ayanamsa = 24.1 + (year - 2000) * (50.29 / 3600);
  
  const sunSidereal = (sunEcl.elon - ayanamsa + 360) % 360;
  const moonSidereal = (moonEcl.elon - ayanamsa + 360) % 360;
  
  // 1. Calculate Tithi
  let diff = moonSidereal - sunSidereal;
  if (diff < 0) diff += 360;
  
  const tithiValue = diff / 12;
  const tithiIndexRaw = Math.floor(tithiValue);
  const tithiIndex = tithiIndexRaw % 30;
  const isKrishna = tithiIndexRaw >= 15;
  const paksha = isKrishna ? 'krishna' : 'shukla';
  const pakshaTa = isKrishna ? 'தேய்பிறை' : 'வளர்பிறை';
  
  // 2. Calculate Nakshatra
  const nakshatraValue = moonSidereal / (360 / 27);
  const nakshatraIndex = Math.floor(nakshatraValue) % 27;
  
  // 3. Calculate Yoga
  const yogaValue = (moonSidereal + sunSidereal) / (360 / 27);
  const yogaIndex = Math.floor(yogaValue) % 27;

  // 4. Calculate Karana
  const karanaValue = Math.floor(tithiValue * 2);
  let karanaIndex = 0;
  let karanaName = '';
  let karanaNameTa = '';

  if (karanaValue === 0) {
    karanaName = 'Kintughna';
    karanaNameTa = 'கிம்ஸ்துக்னம்';
    karanaIndex = 11;
  } else if (karanaValue >= 57) {
    if (karanaValue === 57) {
      karanaName = 'Shakuni';
      karanaNameTa = 'சகுனி';
      karanaIndex = 8;
    } else if (karanaValue === 58) {
      karanaName = 'Chatushpada';
      karanaNameTa = 'சதுஷ்பாதம்';
      karanaIndex = 9;
    } else {
      karanaName = 'Naga';
      karanaNameTa = 'நாகவம்';
      karanaIndex = 10;
    }
  } else {
    const movableIndex = (karanaValue - 1) % 7;
    karanaName = KARANAS[movableIndex];
    karanaNameTa = KARANAS_TA[movableIndex];
    karanaIndex = movableIndex + 1;
  }

  return {
    tithi: {
      index: tithiIndex + 1, // 1-indexed for some APIs
      name: TITHIS[tithiIndex],
      name_ta: TITHIS_TA[tithiIndex],
      paksha,
      paksha_ta: pakshaTa
    },
    nakshatra: {
      index: nakshatraIndex + 1,
      name: NAKSHATRAS[nakshatraIndex],
      name_ta: NAKSHATRAS_TA[nakshatraIndex]
    },
    yoga: {
      index: yogaIndex + 1,
      name: YOGAS[yogaIndex],
      name_ta: YOGAS_TA[yogaIndex]
    },
    karana: {
      index: karanaIndex,
      name: karanaName,
      name_ta: karanaNameTa
    }
  };
};
