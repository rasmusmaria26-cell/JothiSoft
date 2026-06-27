import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED, DASA_ORDER, DASA_YEARS, PLANET_MAP_TA } from '../shared/jathagam2.constants'

// Defensive alias map — covers any API key variants
const PLANET_LABEL: Record<string, string> = {
  ...PLANET_MAP_TA,
  'Shani': 'சனி', 'Sani': 'சனி', 'Saturn': 'சனி',
  'Shukra': 'சுக்கிரன்', 'Sukra': 'சுக்கிரன்',
  'Guru': 'குரு', 'Brihaspati': 'குரு',
  'Mangala': 'செவ்வாய்', 'Angaraka': 'செவ்வாய்',
  'Budha': 'புதன்',
  'Surya': 'சூரியன்',
  'Chandra': 'சந்திரன்',
}

interface DashaPeriodsPageProps {
  horoscope: any
}

export function DashaPeriodsPage({ horoscope }: DashaPeriodsPageProps) {
  const dashaBalance = horoscope.dasha_balance ?? { lord: 'Sun', years: 0, months: 0, days: 0 }
  const birthLord = dashaBalance.lord ?? 'Sun'

  const startIndex = DASA_ORDER.indexOf(birthLord)
  const orderedDashas: string[] = []
  if (startIndex !== -1) {
    for (let i = 0; i < 9; i++) {
      orderedDashas.push(DASA_ORDER[(startIndex + i) % 9])
    }
  } else {
    // fallback if lord not in order
    orderedDashas.push(...DASA_ORDER)
  }

  return (
    <PageWrapper showU={false}>
      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', lineHeight: '1.8', marginBottom: '20px' }}>
        <div>ஓம்ஸ்ரீநவக்கிரஹசகாயம்</div>
        <div>ஜென்ம காலம் முதல்</div>
        <div>திசாபுத்திகள் விபரம்</div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: `1.5px solid ${PDF_GREEN}`, marginTop: '10px' }}>
        <thead>
          <tr style={{ borderBottom: `1.5px solid ${PDF_GREEN}` }}>
            <th
              rowSpan={2}
              style={{
                color: PDF_GREEN,
                fontWeight: 'bold',
                textDecoration: 'underline',
                textAlign: 'left',
                padding: '12px 16px',
                fontSize: '15px',
                borderRight: `1px solid ${PDF_GREEN}`,
                borderBottom: `1px solid ${PDF_GREEN}`,
                verticalAlign: 'middle'
              }}
            >
              திசைகள்
            </th>
            <th
              colSpan={5}
              style={{
                color: PDF_GREEN,
                fontWeight: 'bold',
                textDecoration: 'underline',
                textAlign: 'center',
                padding: '8px 12px',
                fontSize: '15px',
                borderBottom: `1px solid ${PDF_GREEN}`,
                verticalAlign: 'middle'
              }}
            >
              நிலுவை
            </th>
          </tr>
          <tr style={{ borderBottom: `1.5px solid ${PDF_GREEN}` }}>
            {['வரு.', 'மா.', 'நா.', 'நாழி.', 'விநாடி'].map((subHeader, idx) => (
              <th
                key={idx}
                style={{
                  color: PDF_GREEN,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  padding: '8px',
                  fontSize: '14px',
                  borderRight: idx < 4 ? `1px solid ${PDF_GREEN}` : undefined,
                  verticalAlign: 'middle'
                }}
              >
                {subHeader}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orderedDashas.map((lord, idx) => {
            const isBirthDasha = idx === 0
            const y = isBirthDasha ? dashaBalance.years : DASA_YEARS[lord]
            const m = isBirthDasha ? dashaBalance.months : 0
            const d = isBirthDasha ? dashaBalance.days : 0
            const naz = 0
            const vin = 0

            return (
              <tr key={idx} style={{ borderBottom: `1px solid ${PDF_GREEN}` }}>
                <td
                  style={{
                    color: PDF_GREEN,
                    fontWeight: 'bold',
                    padding: '12px 16px',
                    fontSize: '15px',
                    borderRight: `1px solid ${PDF_GREEN}`,
                    verticalAlign: 'middle'
                  }}
                >
                  {idx + 1}. {PLANET_LABEL[lord] || PLANET_MAP_TA[lord] || lord}
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', textAlign: 'center', padding: '12px 8px', fontSize: '15px', borderRight: `1px solid ${PDF_GREEN}`, verticalAlign: 'middle' }}>
                  {y}
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', textAlign: 'center', padding: '12px 8px', fontSize: '15px', borderRight: `1px solid ${PDF_GREEN}`, verticalAlign: 'middle' }}>
                  {m}
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', textAlign: 'center', padding: '12px 8px', fontSize: '15px', borderRight: `1px solid ${PDF_GREEN}`, verticalAlign: 'middle' }}>
                  {d}
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', textAlign: 'center', padding: '12px 8px', fontSize: '15px', borderRight: `1px solid ${PDF_GREEN}`, verticalAlign: 'middle' }}>
                  {naz}
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', textAlign: 'center', padding: '12px 8px', fontSize: '15px', verticalAlign: 'middle' }}>
                  {vin}
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
