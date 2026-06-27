import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, NAKSHATRA_MAP_TA, SIGN_MAP_TA, normalizeSign } from '../shared/jathagam2.constants'
import { Blank } from '../shared/Blank'
import type { NakshatraMeta } from '@/types/jathagam'

interface KurippuPageProps {
  nakshatraMeta: NakshatraMeta
  horoscope: any
}

export function KurippuPage({ nakshatraMeta, horoscope }: KurippuPageProps) {
  const meta = nakshatraMeta ?? {
    ganam_ta: '—',
    nadi_ta: '—',
    rajju_ta: '—',
    pakshi_ta: '—',
    maram_ta: '—',
    mirugam_ta: '—',
  }

  const moonPlanet = horoscope?.planets?.find((p: any) => p.planet === 'Moon')
  const moonNakshatra = moonPlanet?.nakshatra ?? ''
  const moonNakshatraTa = NAKSHATRA_MAP_TA[moonNakshatra] ?? moonNakshatra
  const lagnaSign = normalizeSign(horoscope?.lagna?.sign ?? '')
  const lagnaSignTa = SIGN_MAP_TA[lagnaSign] ?? lagnaSign

  // Moon sign (rasi) from moon planet
  const moonSign = moonPlanet?.sign ?? ''
  const moonSignTa = SIGN_MAP_TA[normalizeSign(moonSign)] ?? moonSign

  const rows = [
    { label: 'லக்னம்', value: lagnaSignTa },
    { label: 'இராசி', value: moonSignTa || '—' },
    { label: 'நட்சத்திரம்', value: moonNakshatraTa ? `${moonNakshatraTa} - பாதம் ${moonPlanet?.pada ?? ''}` : '—' },
    { label: 'மிருகம்', value: meta.mirugam_ta },
    { label: 'பக்ஷி', value: meta.pakshi_ta },
    { label: 'மரம்', value: meta.maram_ta },
    { label: 'கணம்', value: meta.ganam_ta },
    { label: 'ரஜ்ஜு', value: meta.rajju_ta },
    { label: 'நாடி', value: meta.nadi_ta },
  ]

  return (
    <PageWrapper showU={false}>
      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>
        ஓம் ஸ்ரீ நவக்கிரஹ சகாயம்
      </div>

      <div style={{ border: `1px solid ${PDF_GREEN}`, padding: '6px 20px', margin: '12px auto 28px', width: 'fit-content', textAlign: 'center' }}>
        <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px' }}>குறிப்பு</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {rows.map((row, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ color: PDF_GREEN, fontWeight: 'bold', width: '110px', flexShrink: 0, fontSize: '15px' }}>
              {row.label}
            </span>
            <Blank value={row.value || '—'} width="340px" textAlign="left" />
          </div>
        ))}
      </div>

      <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '20px' }}>
        - சுபம் -
      </div>
    </PageWrapper>
  )
}
