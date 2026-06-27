import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED, PDF_BORDER, SIGN_MAP_TA, NAKSHATRA_MAP_TA, normalizeSign } from '../shared/jathagam2.constants'

interface PlanetaryPositionsPageProps {
  horoscope: any
}

const ZODIAC_SIGNS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
  'Simha', 'Kanya', 'Thula', 'Vrischika',
  'Dhanus', 'Makara', 'Kumbha', 'Meena'
]

const PLANETS_ORDER = [
  { key: 'Sun', name_ta: 'சூரியன்' },
  { key: 'Moon', name_ta: 'சந்திரன்' },
  { key: 'Mars', name_ta: 'செவ்வாய்' },
  { key: 'Mercury', name_ta: 'புதன்' },
  { key: 'Jupiter', name_ta: 'குரு' },
  { key: 'Venus', name_ta: 'சுக்கிரன்' },
  { key: 'Saturn', name_ta: 'சனி' },
  { key: 'Rahu', name_ta: 'ராகு' },
  { key: 'Ketu', name_ta: 'கேது' },
  { key: 'Maanthi', name_ta: 'மாந்தி' }
]

export function PlanetaryPositionsPage({ horoscope }: PlanetaryPositionsPageProps) {
  const getPlanetSignFromD9 = (planetKey: string) => {
    const d9 = horoscope.divisional_charts?.D9
    if (!d9 || !d9.chart || !d9.lagna_sign) {
      // fallback to navamsam_chart if divisional_charts is missing
      const fallbackD9 = horoscope.navamsam_chart
      if (!fallbackD9) return '—'
      const lagnaSign = normalizeSign(horoscope.lagna?.navamsa_sign || horoscope.lagna?.sign || 'Mesha')
      const lagnaIndex = ZODIAC_SIGNS.indexOf(lagnaSign)
      if (lagnaIndex === -1) return '—'

      for (let houseNum = 1; houseNum <= 12; houseNum++) {
        const houseKey = `house_${houseNum}`
        const residing = fallbackD9[houseKey] || []
        if (residing.some((p: string) => p.toLowerCase() === planetKey.toLowerCase() || (planetKey === 'Maanthi' && p.toLowerCase() === 'mandhi') || (planetKey === 'Maanthi' && p.toLowerCase() === 'gulika'))) {
          const signIndex = (lagnaIndex + houseNum - 1) % 12
          return ZODIAC_SIGNS[signIndex]
        }
      }
      return '—'
    }

    const lagnaSign = normalizeSign(d9.lagna_sign)
    const lagnaIndex = ZODIAC_SIGNS.indexOf(lagnaSign)
    if (lagnaIndex === -1) return '—'

    for (let houseNum = 1; houseNum <= 12; houseNum++) {
      const houseKey = `house_${houseNum}`
      const residing = d9.chart[houseKey] || []
      if (residing.some((p: string) => p.toLowerCase() === planetKey.toLowerCase() || (planetKey === 'Maanthi' && p.toLowerCase() === 'mandhi') || (planetKey === 'Maanthi' && p.toLowerCase() === 'gulika'))) {
        const signIndex = (lagnaIndex + houseNum - 1) % 12
        return ZODIAC_SIGNS[signIndex]
      }
    }
    return '—'
  }

  const findPlanetData = (planetKey: string) => {
    let pData = horoscope.planets?.find((p: any) => p.planet.toLowerCase() === planetKey.toLowerCase())
    if (!pData && planetKey === 'Maanthi') {
      pData = horoscope.planets?.find((p: any) => p.planet.toLowerCase() === 'mandhi' || p.planet.toLowerCase() === 'gulika')
    }
    return pData
  }

  return (
    <PageWrapper>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr style={{ borderBottom: `2.5px solid ${PDF_BORDER}` }}>
            {['கிரகம்', 'இராசி', 'அம்சம்', 'நட்சத்திரம்', 'பாதம்'].map((header, idx) => (
              <th
                key={idx}
                style={{
                  color: PDF_GREEN,
                  fontWeight: 'bold',
                  textDecoration: 'underline',
                  textAlign: idx === 0 ? 'left' : 'center',
                  verticalAlign: 'middle',
                  padding: '12px 6px',
                  fontSize: '15px',
                  border: `1px solid ${PDF_BORDER}`,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLANETS_ORDER.map((item, idx) => {
            const pData = findPlanetData(item.key)
            const rasiSign = pData?.sign ? SIGN_MAP_TA[normalizeSign(pData.sign)] : '—'
            const d9SignKey = getPlanetSignFromD9(item.key)
            const amsamSign = d9SignKey !== '—' ? SIGN_MAP_TA[normalizeSign(d9SignKey)] : '—'
            const nakshatra = pData?.nakshatra ? NAKSHATRA_MAP_TA[pData.nakshatra] : '—'
            const pada = pData?.pada ?? '—'

            return (
              <tr key={idx} style={{ borderBottom: `1px solid ${PDF_BORDER}` }}>
                <td style={{ color: PDF_GREEN, fontWeight: 'bold', verticalAlign: 'middle', padding: '14px 6px', fontSize: '15px', border: `1px solid ${PDF_BORDER}` }}>
                  {item.name_ta}
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', verticalAlign: 'middle', padding: '14px 6px', fontSize: '15px', border: `1px solid ${PDF_BORDER}`, textAlign: 'center' }}>
                  {rasiSign}
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', verticalAlign: 'middle', padding: '14px 6px', fontSize: '15px', border: `1px solid ${PDF_BORDER}`, textAlign: 'center' }}>
                  {amsamSign}
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', verticalAlign: 'middle', padding: '14px 6px', fontSize: '15px', border: `1px solid ${PDF_BORDER}`, textAlign: 'center' }}>
                  {nakshatra}
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', verticalAlign: 'middle', padding: '14px 6px', fontSize: '15px', border: `1px solid ${PDF_BORDER}`, textAlign: 'center' }}>
                  {pada}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '20px' }}>
        - சுபம் -
      </div>
    </PageWrapper>
  )
}
