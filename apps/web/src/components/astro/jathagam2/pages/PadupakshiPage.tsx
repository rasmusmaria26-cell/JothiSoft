import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_BLACK, NAKSHATRA_MAP_TA } from '../shared/jathagam2.constants'
import { Blank } from '../shared/Blank'
import type { NakshatraMeta } from '@/types/jathagam'

interface PadupakshiPageProps {
  nakshatraMeta: NakshatraMeta
  horoscope: any
}

export function PadupakshiPage({ nakshatraMeta, horoscope }: PadupakshiPageProps) {
  const meta = nakshatraMeta ?? { pakshi_ta: '—' }

  const moonPlanet = horoscope?.planets?.find((p: any) => p.planet === 'Moon')
  const moonNakshatra = moonPlanet?.nakshatra ?? ''
  const moonNakshatraTa = NAKSHATRA_MAP_TA[moonNakshatra] ?? moonNakshatra

  // Fields come from nakshatraMeta — use correct JSON key names
  const uyirPakshi = (nakshatraMeta as any)?.padupakshi_uyir_ta ?? meta.pakshi_ta ?? '—'
  const waxingDays = (nakshatraMeta as any)?.padupakshi_valar_ta ?? '—'
  const waningDays = (nakshatraMeta as any)?.padupakshi_thei_ta ?? '—'

  const infoRows = [
    { label: 'ஜென்ம நட்சத்திரம்', value: moonNakshatraTa || '—' },
    { label: 'இதன் உயிர் பக்ஷி', value: uyirPakshi },
    { label: 'வளர்பிறை', value: waxingDays },
    { label: 'தேய்பிறை', value: waningDays },
  ]

  return (
    <PageWrapper>
      <div style={{ border: `1px solid ${PDF_GREEN}`, padding: '6px 20px', margin: '12px auto 28px', width: 'fit-content', textAlign: 'center' }}>
        <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px' }}>ஸ்ரீ படுபக்ஷி பலன்</span>
      </div>

      {/* Info rows with Blank components */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
        {infoRows.map((row, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ color: PDF_GREEN, fontWeight: 'bold', width: '150px', flexShrink: 0, fontSize: '15px' }}>
              {row.label}
            </span>
            <Blank value={row.value} width="310px" textAlign="left" />
          </div>
        ))}
      </div>

      {/* Static advisory paragraph in green */}
      <div style={{ color: PDF_GREEN, fontSize: '15px', lineHeight: '2.0', textAlign: 'center', marginBottom: '28px', fontWeight: 'bold' }}>
        <div>இந்த நாட்களில் ஜாதகர் எண்ணெய் தேய்த்து ஸ்நானம்</div>
        <div>செய்தல், புதிய ஆடை ஆபரணங்கள் வாங்க, வரவு-</div>
        <div>செலவு, புதிய</div>
        <div>ஒப்பந்தங்கள், சுப காரியங்கள் செய்தல் ஆகாது.</div>
      </div>

      {/* Footer note */}
      <div style={{ color: PDF_GREEN, fontSize: '13px', lineHeight: '2.0', textAlign: 'center', marginTop: '16px', fontStyle: 'italic' }}>
        <div>* * இந்த நாட்கள் தவிர மற்றைய தினங்களில் சகல</div>
        <div>சுபகாரியங்களும் நடத்துதல் ஆகாது.</div>
      </div>

      <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '20px' }}>
        - சுபம் -
      </div>
    </PageWrapper>
  )
}
