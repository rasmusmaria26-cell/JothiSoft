import * as Astronomy from 'astronomy-engine';
import {
  minutesToNazhigai,
  minutesToNextMoonBoundary,
  minutesToNextTithiBoundary,
  minutesToNextYogaBoundary,
  getSunriseAtLocation,
  NazhigaiTime,
} from '../lib/nazhigai';

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishtha', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

const NAKSHATRAS_TA = [
  'அஸ்வினி', 'பரணி', 'கிருத்திகை', 'ரோகிணி', 'மிருகசீரிடம்', 'திருவாதிரை',
  'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்',
  'அஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை',
  'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்',
  'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி',
];

const TITHIS = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi',
  'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi',
  'Trayodashi', 'Chaturdashi', 'Purnima', 'Pratipada', 'Dwitiya', 'Tritiya',
  'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami',
  'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
];

const TITHIS_TA = [
  'பிரதமை', 'துவிதியை', 'திரிதியை', 'சதுர்த்தி', 'பஞ்சமி', 'சஷ்டி',
  'சப்தமி', 'அஷ்டமி', 'நவமி', 'தசமி', 'ஏகாதசி', 'துவாதசி',
  'திரயோதசி', 'சதுர்த்தசி', 'பௌர்ணமி', 'பிரதமை', 'துவிதியை', 'திரிதியை',
  'சதுர்த்தி', 'பஞ்சமி', 'சஷ்டி', 'சப்தமி', 'அஷ்டமி', 'நவமி',
  'தசமி', 'ஏகாதசி', 'துவாதசி', 'திரயோதசி', 'சதுர்த்தசி', 'அமாவாசை',
];

const YOGAS = [
  'Vishkambha', 'Priti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Atiganda',
  'Sukarma', 'Dhriti', 'Shula', 'Ganda', 'Vriddhi', 'Dhruva', 'Vyaghata',
  'Harshana', 'Vajra', 'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
  'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma', 'Indra', 'Vaidhriti',
];

const YOGAS_TA = [
  'விஷ்கம்பம்', 'ப்ரீதி', 'ஆயுஷ்மான்', 'சௌபாக்கியம்', 'சோபனம்', 'அதிகண்டம்',
  'சுகர்மம்', 'திருதி', 'சூலம்', 'கண்டம்', 'விருத்தி', 'துருவம்', 'வியாகாதம்',
  'ஹர்ஷணம்', 'வஜ்ரம்', 'சித்தி', 'வியதிபாதம்', 'வரியான்', 'பரிகம்', 'சிவம்',
  'சித்தம்', 'சாத்தியம்', 'சுபம்', 'சுக்கிலம்', 'பிரம்மம்', 'இந்திரம்', 'வைதிருதி',
];

const KARANAS = [
  'Bava', 'Balava', 'Kaulava', 'Taitila', 'Gara', 'Vanija', 'Vishti',
  'Shakuni', 'Chatushpada', 'Naga', 'Kintughna',
];

const KARANAS_TA = [
  'பவம்', 'பாலவம்', 'கௌலவம்', 'சைதிலம்', 'கரசை', 'வணிசை', 'பத்திரை',
  'சகுனி', 'சதுஷ்பாதம்', 'நாகவம்', 'கிம்ஸ்துக்னம்',
];

/** Approximate Lahiri ayanamsa */
function lahiriAyanamsa(year: number): number {
  return 24.1 + (year - 2000) * (50.29 / 3600);
}

/**
 * Compute ending Nazhigai for an element given the minutes until its boundary
 * and the local sunrise reference.
 */
function endingNazhigai(
  birthDate: Date,
  minutesUntilEnd: number,
  sunrise: Date,
): NazhigaiTime {
  const endDate = new Date(birthDate.getTime() + minutesUntilEnd * 60_000);
  const elapsedFromSunrise = (endDate.getTime() - sunrise.getTime()) / 60_000;
  return minutesToNazhigai(Math.max(0, elapsedFromSunrise));
}

/**
 * Get Panchangam for a given date and birth location.
 * Now includes Nazhigai-format ending times for each element and Udhayadhi Nazhigai.
 *
 * @param date  - birth date (UTC)
 * @param lat   - birth latitude (decimal degrees)
 * @param lng   - birth longitude (decimal degrees)
 */
export const getLocalPanchangam = (date: Date, lat: number = 11.0, lng: number = 76.95) => {
  const time = Astronomy.MakeTime(date);

  const sunVec  = Astronomy.GeoVector(Astronomy.Body.Sun,  time, true);
  const moonVec = Astronomy.GeoVector(Astronomy.Body.Moon, time, true);

  const sunEcl  = Astronomy.Ecliptic(sunVec);
  const moonEcl = Astronomy.Ecliptic(moonVec);

  const year     = date.getUTCFullYear();
  const ayanamsa = lahiriAyanamsa(year);

  const sunSidereal  = (sunEcl.elon  - ayanamsa + 360) % 360;
  const moonSidereal = (moonEcl.elon - ayanamsa + 360) % 360;

  // --- Sunrise (for Nazhigai reference) ---
  const sunrise = getSunriseAtLocation(date, lat, lng);

  // ─── 1. Tithi ──────────────────────────────────────────────────────────────
  let diff = moonSidereal - sunSidereal;
  if (diff < 0) diff += 360;

  const tithiValue    = diff / 12;
  const tithiIndexRaw = Math.floor(tithiValue);
  const tithiIndex    = tithiIndexRaw % 30;
  const isKrishna     = tithiIndexRaw >= 15;
  const paksha        = isKrishna ? 'krishna'    : 'shukla';
  const pakshaTa      = isKrishna ? 'தேய்பிறை' : 'வளர்பிறை';

  // Degrees until next tithi boundary (12° multiple)
  const nextTithiBoundary = (Math.floor(tithiValue) + 1) * 12;
  const degToTithiEnd     = nextTithiBoundary - diff;
  const minsToTithiEnd    = minutesToNextTithiBoundary(degToTithiEnd);
  const tithiEndNaz       = endingNazhigai(date, minsToTithiEnd, sunrise);
  const tithiEndTime      = new Date(date.getTime() + minsToTithiEnd * 60_000);

  // ─── 2. Nakshatra ──────────────────────────────────────────────────────────
  const DEG_PER_NAK   = 360 / 27;
  const nakshatraIdx  = Math.floor(moonSidereal / DEG_PER_NAK) % 27;
  const nextNakBound  = (nakshatraIdx + 1) * DEG_PER_NAK;
  const degToNakEnd   = nextNakBound - moonSidereal;
  const minsToNakEnd  = minutesToNextMoonBoundary(degToNakEnd);
  const nakEndNaz     = endingNazhigai(date, minsToNakEnd, sunrise);
  const nakEndTime    = new Date(date.getTime() + minsToNakEnd * 60_000);

  // ─── 3. Yoga ───────────────────────────────────────────────────────────────
  const yogaCombined  = (moonSidereal + sunSidereal) % 360;
  const yogaIndex     = Math.floor(yogaCombined / DEG_PER_NAK) % 27;
  const nextYogaBound = (Math.floor(yogaCombined / DEG_PER_NAK) + 1) * DEG_PER_NAK;
  const degToYogaEnd  = nextYogaBound - yogaCombined;
  const minsToYogaEnd = minutesToNextYogaBoundary(degToYogaEnd);
  const yogaEndNaz    = endingNazhigai(date, minsToYogaEnd, sunrise);

  // ─── 4. Karana ─────────────────────────────────────────────────────────────
  const karanaValue = Math.floor(tithiValue * 2);
  let karanaIndex = 0;
  let karanaName   = '';
  let karanaNameTa = '';

  if (karanaValue === 0) {
    karanaName   = 'Kintughna';
    karanaNameTa = 'கிம்ஸ்துக்னம்';
    karanaIndex  = 11;
  } else if (karanaValue >= 57) {
    if      (karanaValue === 57) { karanaName = 'Shakuni';    karanaNameTa = 'சகுனி';       karanaIndex = 8; }
    else if (karanaValue === 58) { karanaName = 'Chatushpada'; karanaNameTa = 'சதுஷ்பாதம்'; karanaIndex = 9; }
    else                         { karanaName = 'Naga';        karanaNameTa = 'நாகவம்';      karanaIndex = 10; }
  } else {
    const movableIndex = (karanaValue - 1) % 7;
    karanaName   = KARANAS[movableIndex];
    karanaNameTa = KARANAS_TA[movableIndex];
    karanaIndex  = movableIndex + 1;
  }

  // Karana ends at half-tithi boundary (6° of moon-sun diff)
  const nextKaranaBound = (Math.floor(tithiValue * 2) + 1) * 6;
  const degToKaranaEnd  = nextKaranaBound - diff;
  const minsToKaranaEnd = minutesToNextTithiBoundary(Math.max(0, degToKaranaEnd));
  const karanaEndNaz    = endingNazhigai(date, minsToKaranaEnd, sunrise);

  // ─── Udhayadhi Nazhigai ────────────────────────────────────────────────────
  const udhayadhiMs      = date.getTime() - sunrise.getTime();
  const udhayadhiMinutes = udhayadhiMs / 60_000;
  const udhayadhi        = minutesToNazhigai(Math.max(0, udhayadhiMinutes));

  return {
    tithi: {
      index:           tithiIndex + 1,
      name:            TITHIS[tithiIndex],
      name_ta:         TITHIS_TA[tithiIndex],
      paksha,
      paksha_ta:       pakshaTa,
      ending_nazhigai: tithiEndNaz.nazhigai,
      ending_vinadi:   tithiEndNaz.vinadi,
      ending_time:     tithiEndTime.toISOString(),
    },
    nakshatra: {
      index:           nakshatraIdx + 1,
      name:            NAKSHATRAS[nakshatraIdx],
      name_ta:         NAKSHATRAS_TA[nakshatraIdx],
      ending_nazhigai: nakEndNaz.nazhigai,
      ending_vinadi:   nakEndNaz.vinadi,
      ending_time:     nakEndTime.toISOString(),
    },
    yoga: {
      index:           yogaIndex + 1,
      name:            YOGAS[yogaIndex],
      name_ta:         YOGAS_TA[yogaIndex],
      ending_nazhigai: yogaEndNaz.nazhigai,
      ending_vinadi:   yogaEndNaz.vinadi,
    },
    karana: {
      index:           karanaIndex,
      name:            karanaName,
      name_ta:         karanaNameTa,
      ending_nazhigai: karanaEndNaz.nazhigai,
      ending_vinadi:   karanaEndNaz.vinadi,
    },
    udhayadhi: {
      nazhigai:        udhayadhi.nazhigai,
      vinadi:          udhayadhi.vinadi,
    },
    sunrise_iso: sunrise.toISOString(),
  };
};
