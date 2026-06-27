import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED } from '../shared/jathagam2.constants'
import { getCalendarYears } from '@/utils/calendarYears'
import { Blank } from '../shared/Blank'
import type { JathagamProfile } from '@/types/jathagam'
import type { HoroscopeResponse } from '@/types/astro'

const ENGLISH_MONTHS_TA = [
  '',
  'ஜனவரி',
  'பிப்ரவரி',
  'மார்ச்',
  'ஏப்ரல்',
  'மே',
  'ஜூன்',
  'ஜூலை',
  'ஆகஸ்ட்',
  'செப்டம்பர்',
  'அக்டோபர்',
  'நவம்பர்',
  'டிசம்பர்'
]

interface DinasuthiPageProps {
  profile: JathagamProfile
  horoscope: HoroscopeResponse
}

export function DinasuthiPage({ profile, horoscope }: DinasuthiPageProps) {
  const cal = getCalendarYears(profile.dob, horoscope)
  const englishMonthTa = ENGLISH_MONTHS_TA[cal.month] || cal.month.toString()

  return (
    <PageWrapper showU={false}>
      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }}>
        ஓம்ஸ்ரீநவக்கிரஹதேவாய நம
      </div>

      <div style={{ border: `1.5px solid ${PDF_GREEN}`, padding: '10px 28px', margin: '24px auto 36px', width: 'fit-content', textAlign: 'center', borderRadius: '4px' }}>
        <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' }}>தினசுத்திப் படலம்</span>
      </div>

      <div style={{ textAlign: 'center', color: PDF_GREEN, fontSize: '16px', lineHeight: '2.2', fontStyle: 'italic', marginBottom: '32px' }}>
        <div>ஜெனனி ஜென்ம சௌக்கியானாம் வர்தனி குல ஸம்பதாம்</div>
        <div>பதவீம் பூர்வ புண்ணியானாம் லிக்கியதே ஜென்ம பத்திரிகா</div>
      </div>

      <div style={{ textAlign: 'center', color: PDF_GREEN, fontSize: '16px', lineHeight: '2.2', marginBottom: '36px' }}>
        <div>சுபஸ்ரீ நிகழும் <Blank value={cal.tamilYear} width="120px" /> வருஷம் <Blank value={cal.ayanam} width="140px" /> புண்ணிய காலம்</div>
        <div>நாகலோகம் பொருத்திய கலிக்குள் விளங்கா நின்ற <Blank value={cal.ritu} width="100px" /> ரிது</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', margin: '28px 0' }}>
        {[
          { label: 'வீரசாலிய வாகனம் சகாப்தம் வருஷம்', value: cal.virasaliya },
          { label: 'கலியுகாதி வருஷம்', value: cal.kali },
          { label: 'ஹிஜிரி வருஷம்', value: cal.hijri },
          { label: 'கொல்லம் ஆண்டு', value: cal.kollam },
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>
              {item.label}
            </span>
            <span style={{ borderBottom: '1.5px dotted #666', flex: 1, margin: '0 8px' }} />
            <span style={{
              display: 'inline-block',
              position: 'relative',
              width: '120px',
              borderBottom: '1.5px dotted #666',
              textAlign: 'center',
              height: '24px',
              flexShrink: 0
            }}>
              <span style={{
                position: 'absolute',
                bottom: '2px',
                left: 0,
                right: 0,
                color: PDF_RED,
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {item.value}
              </span>
            </span>
          </div>
        ))}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginTop: '20px', flexWrap: 'wrap' }}>
          <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px' }}>ஆங்கில வருஷம்</span>
          <Blank value={cal.year} width="80px" />
          <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px' }}>மாதம்</span>
          <Blank value={englishMonthTa} width="100px" />
          <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px' }}>இஃது</span>
          <Blank value={cal.day} width="60px" />
          <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px' }}>ந் தேதி</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', marginTop: '10px', flexWrap: 'wrap' }}>
          <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px' }}>தமிழ் வருடம்</span>
          <Blank value={cal.tamilYear} width="120px" />
          <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px' }}>மாதம்</span>
          <Blank value={cal.tamilMonth} width="100px" />
          <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px' }}>இஃது</span>
          <Blank value={cal.tamilDate} width="60px" />
          <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px' }}>ந் தேதி</span>
        </div>
      </div>

      <div style={{ textAlign: 'right', color: PDF_GREEN, fontWeight: 'bold', fontSize: '16px', marginTop: 'auto', paddingTop: '20px' }}>
        சுபமஸ்து
      </div>
    </PageWrapper>
  )
}
