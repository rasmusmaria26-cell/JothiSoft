import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED, PDF_BLACK, NAKSHATRA_MAP_TA } from '../shared/jathagam2.constants'

interface NakshatrapalanPageProps {
  horoscope: any
  nakshatrapalanText: string
}

export function NakshatrapalanPage({ horoscope, nakshatrapalanText }: NakshatrapalanPageProps) {
  const moonPlanet = horoscope.planets?.find((p: any) => p.planet === 'Moon')
  const moonNakshatra = moonPlanet?.nakshatra ?? 'Ashwini'

  const formattedText = nakshatrapalanText && nakshatrapalanText.trim() !== ''
    ? nakshatrapalanText
    : 'விரைவில் பலன்கள் இணைக்கப்படும்.'

  const isPlaceholder = formattedText === 'விரைவில் பலன்கள் இணைக்கப்படும்.'

  return (
    <PageWrapper showU={false}>
      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', marginBottom: '20px' }}>
        ஓம்ஸ்ரீநவக்கிரஹசகாயம்
      </div>

      <div style={{ border: `1px solid ${PDF_GREEN}`, padding: '6px 20px', margin: '12px auto 24px', width: 'fit-content', textAlign: 'center' }}>
        <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px' }}>நக்ஷத்திர பலன்</span>
      </div>

      <div style={{ fontSize: '15px', color: PDF_GREEN, marginBottom: '24px', display: 'flex', gap: '8px' }}>
        <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>ஜென்ம நக்ஷத்திரம்</span>
        <span style={{ color: PDF_RED, fontWeight: 'bold', textDecoration: 'underline' }}>{NAKSHATRA_MAP_TA[moonNakshatra]}</span>
      </div>

      <div style={{
        color: PDF_BLACK,
        fontSize: '15px',
        lineHeight: '2.0',
        textAlign: 'justify',
        textJustify: 'inter-word',
        marginBottom: '24px',
        fontStyle: isPlaceholder ? 'italic' : 'normal',
        whiteSpace: 'pre-line'
      }}>
        {formattedText}
      </div>

      <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '20px' }}>
        - சுபம் -
      </div>
    </PageWrapper>
  )
}
