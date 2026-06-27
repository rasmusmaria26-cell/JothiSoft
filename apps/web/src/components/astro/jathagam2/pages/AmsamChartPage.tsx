import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED, PDF_BORDER, SIGN_MAP_TA, PLANET_MAP_TA, PLANET_ABBR_TA, normalizeSign } from '../shared/jathagam2.constants'
import { Blank } from '../shared/Blank'
import type { JathagamProfile } from '@/types/jathagam'

interface AmsamChartPageProps {
  profile: JathagamProfile
  horoscope: any
}

const ZODIAC_SIGNS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
  'Simha', 'Kanya', 'Thula', 'Vrischika',
  'Dhanus', 'Makara', 'Kumbha', 'Meena'
]

export function AmsamChartPage({ profile, horoscope }: AmsamChartPageProps) {
  const dasha_balance = horoscope.dasha_balance ?? { lord: 'Sun', years: 0, months: 0, days: 0 }
  const lagnaSign = normalizeSign(horoscope.lagna?.sign ?? 'Mesha')
  const lagnaIndex = ZODIAC_SIGNS.indexOf(lagnaSign)

  const getPlanetsInSign = (sign: string) => {
    const normSign = normalizeSign(sign)
    const signIndex = ZODIAC_SIGNS.indexOf(normSign)
    const houseIndex = ((signIndex - lagnaIndex + 12) % 12) + 1
    const houseKey = `house_${houseIndex}`
    return horoscope.navamsam_chart?.[houseKey] || []
  }

  const formatDOB = (dob: string) => {
    if (!dob) return '—'
    const parts = dob.split('-')
    if (parts.length !== 3) return dob
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  const renderCell = (sign: string) => {
    const planets = getPlanetsInSign(sign)
    return (
      <td
        style={{
          border: `1.5px solid ${PDF_BORDER}`,
          width: '25%',
          height: '135px',
          verticalAlign: 'top',
          padding: '8px',
          boxSizing: 'border-box' as const,
        }}
      >
        <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>
          {SIGN_MAP_TA[normalizeSign(sign)]}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {planets.map((pName: string, i: number) => {
            const abbr = PLANET_ABBR_TA[pName] || pName
            return (
              <span key={i} style={{ color: PDF_RED, fontWeight: 'bold', fontSize: '15px', border: '1px solid rgba(139, 0, 0, 0.15)', padding: '2px 4px', borderRadius: '3px', backgroundColor: '#fffdf6' }}>
                {abbr}
              </span>
            )
          })}
        </div>
      </td>
    )
  }

  return (
    <PageWrapper showU={false}>
      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
        ஓம்ஸ்ரீநவக்கிரஹசகாயம்
      </div>

      <div style={{ fontSize: '16px', color: PDF_GREEN, marginBottom: '12px' }}>
        பிறந்த ஆங்கில தேதி <Blank value={formatDOB(profile.dob)} width="160px" />
      </div>

      <div style={{ fontSize: '16px', color: PDF_GREEN, marginBottom: '12px' }}>
        ஜெனன கால <Blank value={PLANET_MAP_TA[dasha_balance.lord] || dasha_balance.lord} width="120px" /> திசை நிலுவை
      </div>

      <div style={{ fontSize: '16px', color: PDF_GREEN, marginBottom: '24px' }}>
        வருஷம் <Blank value={dasha_balance.years} width="60px" /> மாதம் <Blank value={dasha_balance.months} width="60px" /> நாள் <Blank value={dasha_balance.days} width="60px" />
      </div>

      <div style={{ border: `1.5px solid ${PDF_GREEN}`, padding: '8px 24px', margin: '12px auto 28px', width: 'fit-content', textAlign: 'center', borderRadius: '4px' }}>
        <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' }}>அம்சம்</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: `2px solid ${PDF_BORDER}`, tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            {renderCell('Meena')}
            {renderCell('Mesha')}
            {renderCell('Vrishabha')}
            {renderCell('Mithuna')}
          </tr>
          <tr>
            {renderCell('Kumbha')}
            <td colSpan={2} rowSpan={2} style={{ border: `1.5px solid ${PDF_BORDER}`, textAlign: 'center', verticalAlign: 'middle', padding: '20px', backgroundColor: '#fffdf8' }}>
              <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px' }}>அம்சம் சக்கரம்</div>
            </td>
            {renderCell('Kataka')}
          </tr>
          <tr>
            {renderCell('Makara')}
            {renderCell('Simha')}
          </tr>
          <tr>
            {renderCell('Dhanus')}
            {renderCell('Vrischika')}
            {renderCell('Thula')}
            {renderCell('Kanya')}
          </tr>
        </tbody>
      </table>

      <div style={{ color: PDF_GREEN, fontSize: '14px', textAlign: 'center', marginTop: '24px', fontStyle: 'italic' }}>
        குறிப்பு: லக்னமும் கிரகங்களும் எழுதப்படும் இடம்
      </div>
    </PageWrapper>
  )
}
