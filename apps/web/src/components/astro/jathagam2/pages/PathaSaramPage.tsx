import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED, PDF_BORDER, NAKSHATRA_MAP_TA } from '../shared/jathagam2.constants'
import type { PathaRow } from '@/types/jathagam'

interface PathaSaramPageProps {
  pathaSaram: PathaRow[]
}

const translateNakshatraWithPada = (text: string): string => {
  if (!text) return '—'
  const parts = text.trim().split(' ')
  if (parts.length > 0) {
    const englishName = parts[0]
    const tamilName = NAKSHATRA_MAP_TA[englishName] || englishName
    if (parts.length > 1) {
      return `${tamilName} ${parts[1]}`
    }
    return tamilName
  }
  return text
}

export function PathaSaramPage({ pathaSaram = [] }: PathaSaramPageProps) {
  // Guarantee ascending order by row number regardless of JSON array order
  const sortedRows = [...pathaSaram].sort((a, b) => (a.no ?? 0) - (b.no ?? 0))

  return (
    <PageWrapper showU={false}>
      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px', marginBottom: '24px' }}>
        ஜனன கால பாத சாரம்
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${PDF_BORDER}` }}>
            {['எண்', 'நட்சத்திரம்', 'பாதம்', 'காரகர்', 'கிரகம்'].map((header, idx) => (
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
          {sortedRows.map((row, idx) => {
            return (
              <tr key={idx} style={{ borderBottom: `1px solid ${PDF_BORDER}` }}>
                <td style={{ color: PDF_GREEN, fontWeight: 'bold', verticalAlign: 'middle', padding: '12px 6px', fontSize: '15px', border: `1px solid ${PDF_BORDER}` }}>
                  {row.no}.
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', verticalAlign: 'middle', padding: '12px 6px', fontSize: '15px', border: `1px solid ${PDF_BORDER}`, textAlign: 'center' }}>
                  {translateNakshatraWithPada(row.nakshatra_ta)}
                </td>
                <td style={{ color: '#1a1a1a', verticalAlign: 'middle', padding: '12px 6px', fontSize: '15px', border: `1px solid ${PDF_BORDER}`, textAlign: 'center' }}>
                  {row.padam}
                </td>
                <td style={{ color: '#1a1a1a', verticalAlign: 'middle', padding: '12px 6px', fontSize: '15px', border: `1px solid ${PDF_BORDER}`, textAlign: 'center' }}>
                  {row.karagam_ta}
                </td>
                <td style={{ color: PDF_RED, fontWeight: 'bold', verticalAlign: 'middle', padding: '12px 6px', fontSize: '15px', border: `1px solid ${PDF_BORDER}`, textAlign: 'center' }}>
                  {row.kiragam_ta}
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
