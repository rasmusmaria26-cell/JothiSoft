import { HoroscopeChart, PlanetData } from './horoscope.service';

const ZODIAC_SIGNS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
  'Simha', 'Kanya', 'Thula', 'Vrischika',
  'Dhanus', 'Makara', 'Kumbha', 'Meena'
];

export interface DivisionalChartResult {
  chart: HoroscopeChart;
  lagna_sign: string;
}

// Calculates the sign index (0-11) for a given longitude in a divisional chart
export function calculateDivisionalSign(
  planetName: string,
  longitude: number,
  division: number
): number {
  const normLong = longitude % 360;
  const baseSign = Math.floor(normLong / 30) % 12;
  const signDegree = normLong % 30;

  switch (division) {
    case 1: // D1: Rasi
      return baseSign;

    case 2: { // D2: Hora
      // Divided into 2 parts of 15 degrees each.
      // Odd signs: 1st half to Sun (Leo = 4), 2nd half to Moon (Cancer = 3).
      // Even signs: 1st half to Moon (Cancer = 3), 2nd half to Sun (Leo = 4).
      const isOddSign = baseSign % 2 !== 0; // 0-indexed: 0=Mesha (odd), 1=Vrishabha (even)
      const firstHalf = signDegree < 15;
      if (!isOddSign) { // Odd sign (Mesha=0, Mithuna=2, Simha=4, Thula=6, Dhanus=8, Kumbha=10)
        return firstHalf ? 4 : 3;
      } else { // Even sign (Vrishabha=1, Kataka=3, Kanya=5, Vrischika=7, Makara=9, Meena=11)
        return firstHalf ? 3 : 4;
      }
    }

    case 3: { // D3: Drekkana
      // Divided into 3 parts of 10 degrees each.
      // 1st part goes to same sign.
      // 2nd part goes to 5th sign.
      // 3rd part goes to 9th sign.
      const part = Math.floor(signDegree / 10);
      return (baseSign + part * 4) % 12;
    }

    case 4: { // D4: Chaturthamsa
      // Divided into 4 parts of 7.5 degrees each.
      // Rulers: 1st, 4th, 7th, 10th signs.
      const part = Math.floor(signDegree / 7.5);
      return (baseSign + part * 3) % 12;
    }

    case 6: { // D6: Shasthamsa
      // Divided into 6 parts of 5 degrees each.
      // Odd signs: start from the sign itself.
      // Even signs: start from the 7th sign from it.
      const part = Math.floor(signDegree / 5);
      const startSign = baseSign % 2 === 0 ? baseSign : (baseSign + 6) % 12;
      return (startSign + part) % 12;
    }

    case 7: { // D7: Saptamsa
      // Divided into 7 parts of 4.2857 degrees.
      // Odd signs: count starts from the sign itself.
      // Even signs: count starts from the 7th sign from it.
      const part = Math.floor(signDegree / (30 / 7));
      const startSign = baseSign % 2 === 0 ? baseSign : (baseSign + 6) % 12; // 0=Mesha (odd base)
      return (startSign + part) % 12;
    }

    case 9: { // D9: Navamsa
      // Divided into 9 parts of 3.3333 degrees.
      // Formula: total divisions (0-107) modulo 12 starting from Aries.
      return Math.floor(normLong / (30 / 9)) % 12;
    }

    case 10: { // D10: Dasamsa
      // Divided into 10 parts of 3 degrees each.
      // Odd signs: start counting from base sign.
      // Even signs: start counting from 9th sign from it.
      const part = Math.floor(signDegree / 3);
      const startSign = baseSign % 2 === 0 ? baseSign : (baseSign + 8) % 12;
      return (startSign + part) % 12;
    }

    case 12: { // D12: Dwadasamsa
      // Divided into 12 parts of 2.5 degrees each.
      // Start counting from the sign itself.
      const part = Math.floor(signDegree / 2.5);
      return (baseSign + part) % 12;
    }

    case 16: { // D16: Shodasamsa
      // Divided into 16 parts of 1.875 degrees each.
      // Movable signs (0, 3, 6, 9): start from Aries (0).
      // Fixed signs (1, 4, 7, 10): start from Leo (4).
      // Dual signs (2, 5, 8, 11): start from Sagittarius (8).
      const part = Math.floor(signDegree / 1.875);
      const signType = baseSign % 3; // 0 = Movable, 1 = Fixed, 2 = Dual
      const startSign = signType === 0 ? 0 : (signType === 1 ? 4 : 8);
      return (startSign + part) % 12;
    }

    case 20: { // D20: Vimsamsa
      // Divided into 20 parts of 1.5 degrees each.
      // Movable signs: start from Aries (0).
      // Fixed signs: start from Sagittarius (8).
      // Dual signs: start from Leo (4).
      const part = Math.floor(signDegree / 1.5);
      const signType = baseSign % 3;
      const startSign = signType === 0 ? 0 : (signType === 1 ? 8 : 4);
      return (startSign + part) % 12;
    }

    case 24: { // D24: Chaturvimsamsa / Siddhamsa
      // Divided into 24 parts of 1.25 degrees each.
      // Odd signs: start from Leo (4).
      // Even signs: start from Cancer (3).
      const part = Math.floor(signDegree / 1.25);
      const startSign = baseSign % 2 === 0 ? 4 : 3;
      return (startSign + part) % 12;
    }

    case 27: { // D27: Saptavimsamsa / Nakshatramsa
      // Divided into 27 parts of 1.1111 degrees each.
      // Fire signs (0, 4, 8): start from Aries (0).
      // Earth signs (1, 5, 9): start from Cancer (3).
      // Air signs (2, 6, 10): start from Libra (6).
      // Water signs (3, 7, 11): start from Capricorn (9).
      const part = Math.floor(signDegree / (30 / 27));
      const element = baseSign % 4; // 0=Fire, 1=Earth, 2=Air, 3=Water
      const startSign = element * 3;
      return (startSign + part) % 12;
    }

    case 30: { // D30: Trimsamsa
      // Trimsamsa has special planetary lords.
      // Odd signs:
      // 0-5: Mars (Aries = 0)
      // 5-10: Saturn (Aquarius = 10)
      // 10-18: Jupiter (Sagittarius = 8)
      // 18-25: Mercury (Gemini = 2)
      // 25-30: Venus (Libra = 6)
      // Even signs:
      // 0-5: Venus (Taurus = 1)
      // 5-12: Mercury (Virgo = 5)
      // 12-20: Jupiter (Pisces = 11)
      // 20-25: Saturn (Capricorn = 9)
      // 25-30: Mars (Scorpio = 7)
      const isOdd = baseSign % 2 === 0; // 0=Mesha (odd)
      if (isOdd) {
        if (signDegree < 5) return 0; // Aries (Mars)
        if (signDegree < 10) return 10; // Aquarius (Saturn)
        if (signDegree < 18) return 8; // Sagittarius (Jupiter)
        if (signDegree < 25) return 2; // Gemini (Mercury)
        return 6; // Libra (Venus)
      } else {
        if (signDegree < 5) return 1; // Taurus (Venus)
        if (signDegree < 12) return 5; // Virgo (Mercury)
        if (signDegree < 20) return 11; // Pisces (Jupiter)
        if (signDegree < 25) return 9; // Capricorn (Saturn)
        return 7; // Scorpio (Mars)
      }
    }

    case 40: { // D40: Khavedamsa
      // Divided into 40 parts of 0.75 degrees each.
      // Odd signs: start from Aries (0).
      // Even signs: start from Libra (6).
      const part = Math.floor(signDegree / 0.75);
      const startSign = baseSign % 2 === 0 ? 0 : 6;
      return (startSign + part) % 12;
    }

    case 45: { // D45: Akshavedamsa
      // Divided into 45 parts of 0.6667 degrees each.
      // Movable signs: start from Aries (0).
      // Fixed signs: start from Leo (4).
      // Dual signs: start from Sagittarius (8).
      const part = Math.floor(signDegree / (30 / 45));
      const signType = baseSign % 3;
      const startSign = signType === 0 ? 0 : (signType === 1 ? 4 : 8);
      return (startSign + part) % 12;
    }

    case 60: { // D60: Shastiamsa
      // Divided into 60 parts of 0.5 degrees each.
      // Start counting from the sign itself.
      const part = Math.floor(signDegree / 0.5);
      return (baseSign + part) % 12;
    }

    default:
      return baseSign;
  }
}

// Builds a 12-house chart mapping relative to the divisional Lagna sign
export function buildDivisionalChart(
  planets: PlanetData[],
  lagnaLong: number,
  division: number
): DivisionalChartResult {
  const lagnaDivSignIndex = calculateDivisionalSign('Lagna', lagnaLong, division);
  const lagnaSignName = ZODIAC_SIGNS[lagnaDivSignIndex];

  const chart: HoroscopeChart = {};
  for (let i = 1; i <= 12; i++) {
    chart[`house_${i}`] = [];
  }

  planets.forEach((p) => {
    const pIndex = ZODIAC_SIGNS.indexOf(p.sign);
    const pLong = (pIndex * 30) + p.sign_degree;
    const pDivSignIndex = calculateDivisionalSign(p.planet, pLong, division);
    
    // Calculate 1-based house position relative to divisional Lagna
    const houseIndex = ((pDivSignIndex - lagnaDivSignIndex + 12) % 12) + 1;
    chart[`house_${houseIndex}`].push(p.planet);
  });

  // Inject Lagna itself into house 1 of the divisional chart
  chart['house_1'].unshift('Lagna');

  return {
    chart,
    lagna_sign: lagnaSignName
  };
}
