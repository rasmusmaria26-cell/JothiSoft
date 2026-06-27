import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED, PLANET_MAP_TA } from '../shared/jathagam2.constants'
import { Blank } from '../shared/Blank'

interface UdumakaPageProps {
  horoscope: any
}

export function UdumakaPage({ horoscope }: UdumakaPageProps) {
  const timeline = horoscope.dasha_timeline ?? []

  const parseDate = (dStr: string) => {
    if (!dStr) return null
    const parts = dStr.split('-')
    if (parts.length === 3) {
      const p0 = parseInt(parts[0])
      const p1 = parseInt(parts[1])
      const p2 = parseInt(parts[2])
      if (parts[0].length === 4) {
        return new Date(p0, p1 - 1, p2)
      } else {
        return new Date(p2, p1 - 1, p0)
      }
    }
    const d = new Date(dStr)
    return isNaN(d.getTime()) ? null : d
  }

  const calculateDuration = (startStr: string, endStr: string) => {
    const start = parseDate(startStr)
    const end = parseDate(endStr)
    if (!start || !end) return { years: 0, months: 0, days: 0 }

    let years = end.getFullYear() - start.getFullYear()
    let months = end.getMonth() - start.getMonth()
    let days = end.getDate() - start.getDate()

    if (days < 0) {
      months -= 1
      const lastDayOfMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate()
      days += lastDayOfMonth
    }
    if (months < 0) {
      years -= 1
      months += 12
    }

    return {
      years: Math.max(0, years),
      months: Math.max(0, months),
      days: Math.max(0, days)
    }
  }

  // Collect the required rows:
  const selectedTimeline: any[] = []
  if (timeline.length > 0) {
    // 1. First bhukti
    selectedTimeline.push(timeline[0])

    const firstLord = timeline[0].dasha_lord
    const firstDashaBhuktis = timeline.filter((item: any) => item.dasha_lord === firstLord)
    if (firstDashaBhuktis.length > 1) {
      // 2. Last bhukti of first dasha
      selectedTimeline.push(firstDashaBhuktis[firstDashaBhuktis.length - 1])
    }

    // 3. First bhukti of next 7 dashas
    const uniqueLords: string[] = []
    timeline.forEach((item: any) => {
      if (!uniqueLords.includes(item.dasha_lord)) {
        uniqueLords.push(item.dasha_lord)
      }
    })

    const otherLords = uniqueLords.filter(lord => lord !== firstLord).slice(0, 7)
    otherLords.forEach(lord => {
      const firstBhukti = timeline.find((item: any) => item.dasha_lord === lord)
      if (firstBhukti) {
        selectedTimeline.push(firstBhukti)
      }
    })
  }

  return (
    <PageWrapper>
      <div style={{ border: `1.5px solid ${PDF_GREEN}`, padding: '10px 28px', margin: '24px auto 36px', width: 'fit-content', textAlign: 'center', borderRadius: '4px' }}>
        <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' }}>உடுமகாதசா புக்தி விபரம்</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', border: `2px solid ${PDF_GREEN}`, marginTop: '24px' }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${PDF_GREEN}`, backgroundColor: 'rgba(107, 20, 38, 0.03)' }}>
            {['திசை புக்தி', 'வருஷம்', 'மாதம்', 'நாள்'].map((header, idx) => (
              <th
                key={idx}
                style={{
                  color: PDF_GREEN,
                  fontWeight: 'bold',
                  textAlign: idx === 0 ? 'left' : 'center',
                  verticalAlign: 'middle',
                  padding: '18px 16px',
                  fontSize: '16px',
                  borderRight: idx < 3 ? `1.5px solid ${PDF_GREEN}` : undefined,
                  borderBottom: `2px solid ${PDF_GREEN}`,
                }}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {selectedTimeline.map((item, idx) => {
            const dur = calculateDuration(item.start_date, item.end_date)
            const dLord = PLANET_MAP_TA[item.dasha_lord] || item.dasha_lord
            const bLord = PLANET_MAP_TA[item.bhukti_lord] || item.bhukti_lord

            return (
              <tr key={idx} style={{ borderBottom: `1.5px solid ${PDF_GREEN}`, backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(184, 134, 11, 0.02)' }}>
                <td
                  style={{
                    color: PDF_GREEN,
                    fontWeight: 'bold',
                    verticalAlign: 'middle',
                    padding: '14px 16px',
                    fontSize: '16px',
                    borderRight: `1.5px solid ${PDF_GREEN}`,
                  }}
                >
                  {dLord} - {bLord}
                </td>
                {/* Use Blank for numeric values so dotted line stays fixed */}
                <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '14px 8px', borderRight: `1.5px solid ${PDF_GREEN}` }}>
                  <Blank value={dur.years} width="60px" />
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '14px 8px', borderRight: `1.5px solid ${PDF_GREEN}` }}>
                  <Blank value={dur.months} width="60px" />
                </td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '14px 8px' }}>
                  <Blank value={dur.days} width="60px" />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '32px' }}>
        - சுபம் -
      </div>
    </PageWrapper>
  )
}
