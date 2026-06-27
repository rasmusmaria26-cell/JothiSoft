import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, SIGN_MAP_TA, NAKSHATRA_MAP_TA, normalizeSign } from '../shared/jathagam2.constants'
import { Blank } from '../shared/Blank'
import type { JathagamProfile, LuckyDetails } from '@/types/jathagam'

interface VastuPageProps {
  profile: JathagamProfile
  horoscope: any
  luckyDetails: LuckyDetails
}

export function VastuPage({ profile, horoscope, luckyDetails }: VastuPageProps) {
  const moonPlanet = horoscope.planets?.find((p: any) => p.planet === 'Moon')
  const moonNakshatra = moonPlanet?.nakshatra ?? 'Ashwini'
  const moonPada = moonPlanet?.pada ?? 1
  const moonSign = normalizeSign(moonPlanet?.sign ?? 'Mesha')
  const lagnaSign = normalizeSign(horoscope.lagna?.sign ?? 'Mesha')

  const formatDOB = (dob: string) => {
    if (!dob) return '—'
    const parts = dob.split('-')
    if (parts.length !== 3) return dob
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  }

  // Extract the direction word from the vastu text so it can be shown as a Blank (red overlay)
  const renderVastuDirection = () => {
    const text = luckyDetails.vastu_direction_ta || ''
    const directions = [
      'தென்கிழக்கு', 'தென்மேற்கு', 'வடமேற்கு', 'வடகிழக்கு',
      'கிழக்கு', 'தெற்கு', 'மேற்கு', 'வடக்கு',
    ]
    for (const dir of directions) {
      if (text.includes(dir)) {
        const idx = text.indexOf(dir)
        const before = text.slice(0, idx)
        const after = text.slice(idx + dir.length)
        return (
          <>
            {before}
            <Blank value={dir} width="115px" />
            {after}
          </>
        )
      }
    }
    return <>{text}</>
  }

  const topRows = [
    { label: 'இராசி', value: SIGN_MAP_TA[moonSign] ?? '—' },
    { label: 'நட்சத்திரம்', value: `${NAKSHATRA_MAP_TA[moonNakshatra] ?? moonNakshatra} - ${moonPada}` },
    { label: 'லக்கனம்', value: SIGN_MAP_TA[lagnaSign] ?? '—' },
  ]

  const bottomRows = [
    { label: 'பிறந்த தேதி', value: formatDOB(profile.dob) },
    { label: 'அதிர்ஷ்ட நாள்', value: luckyDetails.day_ta ?? '—' },
    { label: 'அதிர்ஷ்ட நிறம்', value: luckyDetails.color_ta ?? '—' },
    { label: 'அதிர்ஷ்ட கல்', value: luckyDetails.stone_ta ?? '—' },
    { label: 'வணங்கவேண்டிய தெய்வம்', value: luckyDetails.deity_ta ?? '—' },
  ]

  return (
    <PageWrapper>
      {/* Page title */}
      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '18px', lineHeight: '2.0', marginBottom: '32px' }}>
        <div>ஜாதகர் அர்ச்சனை செய்ய</div>
        <div>பேப்பரில் பலன் பார்க்க</div>
      </div>

      {/* Rasi / Nakshatra / Lagna rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
        {topRows.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ color: PDF_GREEN, fontWeight: 'bold', width: '130px', flexShrink: 0, fontSize: '15px' }}>
              {item.label}
            </span>
            <Blank value={item.value} width="340px" textAlign="left" />
          </div>
        ))}
      </div>

      {/* Vastu direction paragraph — direction word highlighted in red on a fixed blank */}
      <div style={{ color: PDF_GREEN, fontSize: '15px', lineHeight: '2.0', textAlign: 'justify', textJustify: 'inter-word', marginTop: '16px', marginBottom: '32px' }}>
        {renderVastuDirection()}
      </div>

      {/* Lucky detail rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
        {bottomRows.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
            <span style={{ color: PDF_GREEN, fontWeight: 'bold', width: '190px', flexShrink: 0, fontSize: '15px' }}>
              {item.label}
            </span>
            <Blank value={item.value} width="280px" textAlign="left" />
          </div>
        ))}
      </div>

      <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '20px' }}>
        - சுபம் -
      </div>
    </PageWrapper>
  )
}
