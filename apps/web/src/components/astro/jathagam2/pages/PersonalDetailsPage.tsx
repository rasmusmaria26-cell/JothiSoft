import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED, PDF_BORDER } from '../shared/jathagam2.constants'
import type { JathagamProfile, AstrologerDetails } from '@/types/jathagam'

interface PersonalDetailsPageProps {
  profile: JathagamProfile
  astrologer: AstrologerDetails
}

const formatDOB = (dob?: string) => {
  if (!dob) return '—'
  const parts = dob.split('-')
  if (parts.length !== 3) return dob
  return `${parts[2]}/${parts[1]}/${parts[0]}`
}

const formatTOB = (tob?: string) => {
  if (!tob) return '—'
  const [hStr, mStr] = tob.split(':')
  const h = parseInt(hStr, 10)
  if (isNaN(h)) return tob
  const ampm = h >= 12 ? 'பி.ப' : 'மு.ப'
  const displayH = h % 12 === 0 ? 12 : h % 12
  const minPad = mStr.padStart(2, '0')
  return `${displayH}:${minPad} ${ampm}`
}

const formatCoords = (lat?: number, lng?: number) => {
  if (lat === undefined || lng === undefined) return '—'
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`
}

export function PersonalDetailsPage({ profile, astrologer }: PersonalDetailsPageProps) {
  const genderTa = profile.gender === 'Male' ? 'ஆண்' : profile.gender === 'Female' ? 'பெண்' : '—'

  return (
    <PageWrapper showU={false}>
      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '17px', lineHeight: '1.8', marginBottom: '10px' }}>
        <div>ஓம்ஸ்ரீவிநாயகர் சகாயம்</div>
        <div style={{ fontSize: '14px', fontWeight: 'normal', color: PDF_RED }}>ஸ்ரீதேவ்யை நம</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center', margin: '12px auto', border: `1.5px solid ${PDF_BORDER}`, padding: '10px', borderRadius: '8px', width: 'fit-content', backgroundColor: '#fffdf9' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '70px', height: '85px', border: `1.5px solid ${PDF_GREEN}`, backgroundColor: '#fff' }} />
          <span style={{ fontSize: '10px', color: PDF_GREEN, marginTop: '4px' }}>வலது கை ரேகை</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '90px', height: '110px', border: `2px solid ${PDF_GREEN}`, backgroundColor: '#fff' }} />
          <span style={{ fontSize: '11px', color: PDF_GREEN, fontWeight: 'bold', marginTop: '4px' }}>ஜாதகர் புகைப்படம்</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '70px', height: '85px', border: `1.5px solid ${PDF_GREEN}`, backgroundColor: '#fff' }} />
          <span style={{ fontSize: '10px', color: PDF_GREEN, marginTop: '4px' }}>இடது கை ரேகை</span>
        </div>
      </div>

      <div style={{ border: `1.5px solid ${PDF_GREEN}`, padding: '8px 20px', margin: '10px auto 15px', width: 'fit-content', textAlign: 'center', borderRadius: '4px' }}>
        <span style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '17px', letterSpacing: '0.5px' }}>ஜாதகர் அறிமுகம்</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '12px 0' }}>
        {[
          { label: 'பெயர் (Name)', value: profile.name },
          { label: 'பாலினம் (Gender)', value: genderTa },
          { label: 'பிறந்த ஆங்கில தேதி (D.O.B)', value: formatDOB(profile.dob) },
          { label: 'பிறந்த நேரம் (Birth Time)', value: formatTOB(profile.tob) },
          { label: 'பிறந்த இடம் (Place of Birth)', value: profile.place || '—' },
          { label: 'புவியியல் குறியீடு (Coordinates)', value: formatCoords(profile.lat, profile.lng) },
          { label: 'தகப்பனார் பெயர்', value: profile.fatherName || '—' },
          { label: 'தாயார் பெயர்', value: profile.motherName || '—' },
          { label: 'சொந்த ஊர் (Hometown)', value: profile.hometown || '—' },
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
            <span style={{ color: PDF_GREEN, fontWeight: 'bold', width: '220px', flexShrink: 0, fontSize: '15px' }}>
              {item.label}
            </span>
            <span style={{ color: PDF_GREEN, fontWeight: 'bold', marginRight: '6px' }}>:</span>
            <span style={{ color: PDF_RED, fontWeight: 'bold', borderBottom: '1px dotted #ccc', flex: 1, paddingBottom: '2px', fontSize: '15px' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: `1.5px solid ${PDF_GREEN}`, paddingTop: '12px', marginBottom: '4px' }}>
        <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' }}>ஜாதகம் எழுதியவர் & மென்பொருள் விபரம் :</div>
        {[
          { label: 'எழுதியவர்', value: astrologer.name || 'Jothisoft Mobile Apps & Software' },
          { label: 'முகவரி', value: astrologer.address || 'Jothisoft Mobile Apps & Software, தமிழ்நாடு, இந்தியா' },
          { label: 'அலைபேசி', value: astrologer.phone || '9659657770' },
        ].map((item, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <span style={{ color: PDF_GREEN, fontWeight: 'bold', width: '100px', flexShrink: 0, fontSize: '13px' }}>
              {item.label}
            </span>
            <span style={{ color: PDF_GREEN, fontWeight: 'bold', marginRight: '4px', fontSize: '13px' }}>:</span>
            <span style={{ color: PDF_RED, fontWeight: 'bold', borderBottom: '1px dotted #ccc', flex: 1, paddingBottom: '1px', fontSize: '13px', wordBreak: 'break-word' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </PageWrapper>
  )
}
