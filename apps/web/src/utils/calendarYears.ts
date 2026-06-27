export const TAMIL_YEARS = [
  'பிரபவ', 'விபவ', 'சுக்ல', 'பிரமோதூத', 'பிரசோத்பத்தி', 'ஆங்கீரச', 'ஸ்ரீமுக', 'பவ', 'யுவ', 'தாது',
  'ஈஸ்வர', 'வெகுதானிய', 'பிரமாதி', 'விக்கிரம', 'விஷு', 'சித்திரபானு', 'சுபானு', 'தாரண', 'பார்த்திப', 'வியய',
  'சர்வசித்து', 'சர்வதாரி', 'விரோதி', 'விக்ருதி', 'கர', 'நந்தன', 'விஜய', 'ஜய', 'மன்மத', 'துன்முகி',
  'ஹேவிளம்பி', 'விளம்பி', 'விகாரி', 'சார்வரி', 'பிலவ', 'சுபகிருது', 'சோபகிருது', 'குரோதி', 'விசுவாசு', 'பராபவ',
  'பிலவங்க', 'கீலக', 'சௌமிய', 'சாதாரண', 'விரோதிகிருது', 'பரிதாபி', 'பிரமாதீச', 'ஆனந்த', 'ராட்சஸ', 'நள',
  'பிங்கள', 'காளயுக்தி', 'சித்தார்த்தி', 'ரௌத்திரி', 'துன்மதி', 'துந்துபி', 'ருத்ரோத்காரி', 'ரக்தாட்சி', 'குரோதன', 'அட்சய'
]

const TAMIL_MONTHS_MAP: Record<string, string> = {
  'Mesha': 'சித்திரை',
  'Vrishabha': 'வைகாசி',
  'Rishabha': 'வைகாசி',
  'Mithuna': 'ஆனி',
  'Kataka': 'ஆடி',
  'Simha': 'ஆவணி',
  'Kanya': 'புரட்டாசி',
  'Thula': 'ஐப்பசி',
  'Vrischika': 'கார்த்திகை',
  'Dhanus': 'மார்கழி',
  'Makara': 'தை',
  'Kumbha': 'மாசி',
  'Meena': 'பங்குனி'
}

const signDegrees: Record<string, number> = {
  'Mesha': 0, 'Vrishabha': 30, 'Rishabha': 30, 'Mithuna': 60, 'Kataka': 90,
  'Simha': 120, 'Kanya': 150, 'Thula': 180, 'Vrischika': 210,
  'Dhanus': 240, 'Makara': 270, 'Kumbha': 300, 'Meena': 330
}

export const getCalendarYears = (dob: string, horoscope?: any) => {
  const [y, m, d] = dob.split('-').map(Number)
  const kali      = y + 3101
  const saka      = m <= 3 ? y - 78 : y - 77
  const virasaliya = saka
  const hijri     = Math.floor((y - 622) * 1.0307)
  const kollam    = m <= 8 ? y - 825 : y - 824

  // Get Sun's longitude if horoscope is available
  const sunPlanet = horoscope?.planets?.find((p: any) => p.planet === 'Sun')
  const sunSign = sunPlanet?.sign ?? 'Mesha'
  const sunDegree = sunPlanet?.sign_degree ?? 0
  const sunLongitude = (signDegrees[sunSign] + sunDegree) % 360

  // Tamil Year index calculation
  let tamilYearIndex = y - 1987
  // If before April 14th (approx Sun entering Aries), use previous year's cycle
  if (m < 4 || (m === 4 && d < 14)) {
    tamilYearIndex -= 1
  }
  const tamilYear = TAMIL_YEARS[(tamilYearIndex + 60) % 60]

  // Uttarayana / Dakshinayana based on Sun longitude
  const isUttarayana = sunLongitude >= 270 || sunLongitude < 90
  const ayanam = isUttarayana ? 'உத்தராயண' : 'தக்ஷிணாயண'

  // Vedic Ritu
  let ritu = 'சரத்'
  if (sunLongitude >= 0 && sunLongitude < 60) ritu = 'வசந்த'
  else if (sunLongitude >= 60 && sunLongitude < 120) ritu = 'கிரீஷ்ம'
  else if (sunLongitude >= 120 && sunLongitude < 180) ritu = 'வர்ஷ'
  else if (sunLongitude >= 180 && sunLongitude < 240) ritu = 'சரத்'
  else if (sunLongitude >= 240 && sunLongitude < 300) ritu = 'ஹேமந்த'
  else ritu = 'சிசிர'

  // Tamil month name based on Sun's sign
  const tamilMonth = TAMIL_MONTHS_MAP[sunSign] || 'சித்திரை'

  // Tamil date = days elapsed in current sun sign (1-indexed)
  const tamilDate = Math.floor(sunDegree) + 1

  return {
    kali,
    saka,
    virasaliya,
    hijri,
    kollam,
    year: y,
    month: m,
    day: d,
    tamilYear,
    ayanam,
    ritu,
    tamilMonth,
    tamilDate
  }
}

// Deprecated old versions for backwards compatibility
export const getAyanam = (month: number): string =>
  month >= 4 && month <= 9 ? 'உத்தராயணம்' : 'தக்ஷிணாயணம்'

export const getTamilMonthName = (month: number): string => {
  const TAMIL_MONTHS = [
    'தை','மாசி','பங்குனி','சித்திரை','வைகாசி','ஆனி',
    'ஆடி','ஆவணி','புரட்டாசி','ஐப்பசி','கார்த்திகை','மார்கழி'
  ]
  return TAMIL_MONTHS[(month + 8) % 12]
}
