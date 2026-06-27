export const PDF_GREEN  = '#6b1426'
export const PDF_RED    = '#b8860b'
export const PDF_BORDER = '#6b1426'
export const PDF_BLACK  = '#2c3e50'

export const PLANET_MAP_TA: Record<string, string> = {
  'Lagna': 'லக்னம்', 'Sun': 'சூரியன்', 'Moon': 'சந்திரன்', 'Mars': 'செவ்வாய்',
  'Mercury': 'புதன்', 'Jupiter': 'குரு', 'Venus': 'சுக்கிரன்', 'Saturn': 'சனி',
  'Rahu': 'ராகு', 'Ketu': 'கேது', 'Maanthi': 'மாந்தி'
}

export const PLANET_MAP_EN: Record<string, string> = {
  'Lagna': 'Ascendant', 'Sun': 'Sun', 'Moon': 'Moon', 'Mars': 'Mars',
  'Mercury': 'Mercury', 'Jupiter': 'Jupiter', 'Venus': 'Venus', 'Saturn': 'Saturn',
  'Rahu': 'Rahu', 'Ketu': 'Ketu', 'Maanthi': 'Gulika'
}

export const SIGN_MAP_TA: Record<string, string> = {
  'Mesha': 'மேஷம்', 'Vrishabha': 'ரிஷபம்', 'Rishabha': 'ரிஷபம்',
  'Mithuna': 'மிதுனம்', 'Kataka': 'கடகம்', 'Simha': 'சிம்மம்',
  'Kanya': 'கன்னி', 'Thula': 'துலாம்', 'Vrischika': 'விருச்சிகம்',
  'Dhanus': 'தனுசு', 'Makara': 'மகரம்', 'Kumbha': 'கும்பம்', 'Meena': 'மீனம்'
}

export const SIGN_MAP_EN: Record<string, string> = {
  'Mesha': 'Aries', 'Vrishabha': 'Taurus', 'Rishabha': 'Taurus',
  'Mithuna': 'Gemini', 'Kataka': 'Cancer', 'Simha': 'Leo',
  'Kanya': 'Virgo', 'Thula': 'Libra', 'Vrischika': 'Scorpio',
  'Dhanus': 'Sagittarius', 'Makara': 'Capricorn', 'Kumbha': 'Aquarius', 'Meena': 'Pisces'
}

export const NAKSHATRA_MAP_TA: Record<string, string> = {
  'Ashwini': 'அஸ்வினி', 'Bharani': 'பரணி', 'Krittika': 'கார்த்திகை',
  'Rohini': 'ரோகிணி', 'Mrigashira': 'மிருகசீரிடம்', 'Ardra': 'திருவாதிரை',
  'Punarvasu': 'புனர்பூசம்', 'Pushya': 'பூசம்', 'Ashlesha': 'ஆயில்யம்',
  'Magha': 'மகம்', 'Purva Phalguni': 'பூரம்', 'Uttara Phalguni': 'உத்திரம்',
  'Hasta': 'அஸ்தம்', 'Chitra': 'சித்திரை', 'Swati': 'சுவாதி',
  'Vishakha': 'விசாகம்', 'Anuradha': 'அனுஷம்', 'Jyeshtha': 'கேட்டை',
  'Mula': 'மூலம்', 'Purva Ashadha': 'பூராடம்', 'Uttara Ashadha': 'உத்திராடம்',
  'Shravana': 'திருவோணம்', 'Dhanishta': 'அவிட்டம்', 'Shatabhisha': 'சதயம்',
  'Purva Bhadrapada': 'பூரட்டாதி', 'Uttara Bhadrapada': 'உத்திரட்டாதி', 'Revati': 'ரேவதி'
}

export const PLANET_ABBR_TA: Record<string, string> = {
  'Lagna': 'ல', 'Sun': 'சூ', 'Moon': 'சந்', 'Mars': 'செ',
  'Mercury': 'பு', 'Jupiter': 'கு', 'Venus': 'சு', 'Saturn': 'சனி',
  'Rahu': 'ரா', 'Ketu': 'கே', 'Maanthi': 'குளி'
}

export const WEEKDAY_TA = ['ஞாயிறு','திங்கள்','செவ்வாய்','புதன்','வியாழன்','வெள்ளி','சனி']

export const DASA_ORDER = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury']
export const DASA_YEARS: Record<string, number> = {
  Ketu:7, Venus:20, Sun:6, Moon:10, Mars:7, Rahu:18, Jupiter:16, Saturn:19, Mercury:17
}

export const normalizeSign = (s: string) => s === 'Rishabha' ? 'Vrishabha' : s
