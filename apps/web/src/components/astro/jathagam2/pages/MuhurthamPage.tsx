import React from 'react'
import { PageWrapper } from '../shared/PageWrapper'
import { PDF_GREEN, PDF_RED, WEEKDAY_TA, NAKSHATRA_MAP_TA } from '../shared/jathagam2.constants'
import { getCalendarYears } from '@/utils/calendarYears'
import { Blank } from '../shared/Blank'
import type { JathagamProfile } from '@/types/jathagam'
import type { HoroscopeResponse } from '@/types/astro'

interface MuhurthamPageProps {
  profile: JathagamProfile
  horoscope: HoroscopeResponse
}

// Ordered English keys matching API output — used for next-element calculations
const NAKSHATRAS_EN = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha',
  'Purva Bhadrapada','Uttara Bhadrapada','Revati'
]

const TITHIS_TA = [
  'பிரதமை', 'துவிதியை', 'திருதியை', 'சதுர்த்தி', 'பஞ்சமி',
  'சஷ்டி', 'சப்தமி', 'அஷ்டமி', 'நவமி', 'தசமி',
  'ஏகாதசி', 'துவாதசி', 'திரயோதசி', 'சதுர்தசி', 'பௌர்ணமி',
  'பிரதமை', 'துவிதியை', 'திருதியை', 'சதுர்த்தி', 'பஞ்சமி',
  'சஷ்டி', 'சப்தமி', 'அஷ்டமி', 'நவமி', 'தசமி',
  'ஏகாதசி', 'துவாதசி', 'திரயோதசி', 'சதுர்தசி', 'அமாவாசை'
]

// Karana: 7 movable (repeating) + 4 fixed
const KARANAS_EN = ['Bava','Balava','Kaulava','Taitila','Garaja','Vanija','Vishti']
const KARANAS_FIXED_EN = ['Shakuni','Chatushpada','Naga','Kimstughna']
const KARANA_MAP_TA: Record<string,string> = {
  'Bava':'பவம்','Balava':'பாலவம்','Kaulava':'கௌலவம்','Taitila':'தைதிலை',
  'Garaja':'கரசை','Vanija':'வணிசை','Vishti':'விஷ்டி',
  'Shakuni':'சகுனி','Chatushpada':'சதுஷ்பாதம்','Naga':'நாகவம்','Kimstughna':'கிம்ஸ்துக்கினம்'
}

const YOGAS_EN = [
  'Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarman','Dhriti','Shula','Ganda',
  'Vriddhi','Dhruva','Vyaghata','Harshana','Vajra','Siddhi','Vyatipata','Variyan','Parigha','Shiva',
  'Siddha','Sadhya','Shubha','Shukla','Brahma','Indra','Vaidhriti'
]
const YOGA_MAP_TA: Record<string,string> = {
  'Vishkambha':'விஷ்கம்பம்','Priti':'பிரீதி','Ayushman':'ஆயுஷ்மான்','Saubhagya':'சௌபாக்கியம்',
  'Shobhana':'சோபனம்','Atiganda':'அதிகண்டம்','Sukarman':'சுகர்மம்','Dhriti':'திருதி',
  'Shula':'சூலம்','Ganda':'கண்டம்','Vriddhi':'விருத்தி','Dhruva':'துருவம்',
  'Vyaghata':'வியாகாதம்','Harshana':'ஹர்ஷணம்','Vajra':'வஜிரம்','Siddhi':'சித்தி',
  'Vyatipata':'வியாதிபாதம்','Variyan':'வரியான்','Parigha':'பரிகம்','Shiva':'சிவம்',
  'Siddha':'சித்தம்','Sadhya':'சாத்தியம்','Shubha':'சுபம்','Shukla':'சுக்கிலம்',
  'Brahma':'பிரம்மம்','Indra':'ஐந்திரம்','Vaidhriti':'வைதிருதி'
}

export function MuhurthamPage({ profile, horoscope }: MuhurthamPageProps) {
  const cal = getCalendarYears(profile.dob, horoscope)
  const dateObj = new Date(profile.dob)
  const weekday = WEEKDAY_TA[dateObj.getDay()]

  const panch = horoscope.panchangam

  // Time formatting
  const [hh, mm] = profile.tob.split(':').map(Number)
  const isNight = hh >= 18 || hh < 6
  const dayOrNightStr = isNight ? 'இரவு' : (hh >= 12 ? 'பகல்' : 'காலை')

  const formattedHours = hh % 12 || 12

  // Strip trailing ", <number>" suffix that PlaceSearch appends (e.g. "Ramanathapuram, 25" → "Ramanathapuram")
  const cleanPlace = (profile.place || '—').replace(/,\s*\d+$/, '').trim()

  // Udhayadhi Nazhigai
  const udhayadhiNaz = panch?.udhayadhi?.nazhigai ?? Math.floor((hh * 60 + mm) / 24)
  const udhayadhiVin = panch?.udhayadhi?.vinadi ?? Math.round(((hh * 60 + mm) % 24) * (60 / 24))

  // Sunrise formatter
  const formatSunrise = (isoStr?: string) => {
    if (!isoStr) return '06:00 AM'
    try {
      const date = new Date(isoStr)
      const localTime = new Date(date.getTime() + profile.utcOffset * 3600 * 1000)
      const hours = localTime.getUTCHours()
      const minutes = localTime.getUTCMinutes()
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const displayHours = hours % 12 || 12
      return `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`
    } catch {
      return '06:00 AM'
    }
  }

  // Next Elements
  const getNextTithi = () => {
    const currTithiTa = panch?.tithi?.name_ta
    if (!currTithiTa) return '—'
    const tithiIndex = TITHIS_TA.indexOf(currTithiTa)
    if (tithiIndex === -1) return '—'
    if (currTithiTa === 'சதுர்தசி') {
      return panch?.tithi?.paksha === 'krishna' ? 'அமாவாசை' : 'பௌர்ணமி'
    }
    if (currTithiTa === 'பௌர்ணமி') return 'பிரதமை (தேய்பிறை)'
    if (currTithiTa === 'அமாவாசை') return 'பிரதமை (வளர்பிறை)'
    return TITHIS_TA[(tithiIndex + 1) % 30]
  }

  const getNextNakshatra = () => {
    // Use English name for reliable index lookup — avoids Tamil spelling mismatches
    const currNakEn = (panch?.nakshatra as any)?.name ?? ''
    const currIdx = NAKSHATRAS_EN.indexOf(currNakEn)
    if (currIdx === -1) return '—'
    const nextEn = NAKSHATRAS_EN[(currIdx + 1) % 27]
    return NAKSHATRA_MAP_TA[nextEn] ?? nextEn
  }

  const getNextYoga = () => {
    const currYogaEn = (panch?.yoga as any)?.name ?? ''
    const currIdx = YOGAS_EN.indexOf(currYogaEn)
    if (currIdx === -1) {
      // Fallback: try Tamil name match
      const currYogaTa = panch?.yoga?.name_ta ?? ''
      const taIdx = Object.values(YOGA_MAP_TA).indexOf(currYogaTa)
      if (taIdx === -1) return '—'
      const nextEn = YOGAS_EN[(taIdx + 1) % 27]
      return YOGA_MAP_TA[nextEn] ?? nextEn
    }
    const nextEn = YOGAS_EN[(currIdx + 1) % 27]
    return YOGA_MAP_TA[nextEn] ?? nextEn
  }

  const getNextKarana = () => {
    const currKaranaEn = (panch?.karana as any)?.name ?? ''
    const movableIdx = KARANAS_EN.indexOf(currKaranaEn)
    if (movableIdx !== -1) {
      const nextEn = KARANAS_EN[(movableIdx + 1) % 7]
      return KARANA_MAP_TA[nextEn] ?? nextEn
    }
    const fixedIdx = KARANAS_FIXED_EN.indexOf(currKaranaEn)
    if (fixedIdx !== -1) {
      const nextEn = KARANAS_FIXED_EN[(fixedIdx + 1) % 4]
      return KARANA_MAP_TA[nextEn] ?? nextEn
    }
    return '—'
  }

  return (
    <PageWrapper showU={false}>
      <div style={{ textAlign: 'center', color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px', marginBottom: '24px' }}>
        ஓம்ஸ்ரீநவக்கிரஹசகாயம்
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '15px', lineHeight: '2.0', color: PDF_GREEN, textAlign: 'justify', textJustify: 'inter-word' }}>
        <div style={{ pageBreakInside: 'avoid', textAlign: 'justify', textJustify: 'inter-word' }}>
          நிகழும் <Blank value={cal.tamilYear} width="100px" /> வருஷம் <Blank value={cal.tamilMonth} width="100px" /> மாதம் <Blank value={cal.tamilDate} width="50px" /> ம்
          தேதி <Blank value={weekday} width="80px" /> கிழமை அன்று <Blank value={cal.ayanam} width="120px" /> காலமாகிய <Blank value={cal.ritu} width="80px" /> ரிது <Blank value={panch?.tithi?.paksha_ta || 'வளர்பிறை'} width="80px" /> <Blank value={panch?.tithi?.name_ta || '—'} width="100px" /> திதி நாழிகை <Blank value={panch?.tithi?.ending_nazhigai ?? '—'} width="50px" /> வினாடி <Blank value={panch?.tithi?.ending_vinadi ?? '—'} width="50px" /> க்கு மேல் <Blank value={getNextTithi()} width="100px" /> திதியும்
        </div>

        <div style={{ pageBreakInside: 'avoid', textAlign: 'justify', textJustify: 'inter-word' }}>
          ஜெனன நாள் அன்று <Blank value={panch?.nakshatra?.name_ta || '—'} width="110px" /> நக்ஷத்திரம் நாழிகை <Blank value={panch?.nakshatra?.ending_nazhigai ?? '—'} width="50px" /> வினாடி <Blank value={panch?.nakshatra?.ending_vinadi ?? '—'} width="50px" /> க்கு மேல் <Blank value={getNextNakshatra()} width="110px" /> நக்ஷத்திரமும்
        </div>

        <div style={{ pageBreakInside: 'avoid', textAlign: 'justify', textJustify: 'inter-word' }}>
          நாமயோகம் நாழிகை <Blank value={panch?.yoga?.ending_nazhigai ?? '—'} width="50px" /> வினாடி <Blank value={panch?.yoga?.ending_vinadi ?? '—'} width="50px" /> க்கு மேல் <Blank value={getNextYoga()} width="110px" /> யோகமும் <Blank value={panch?.karana?.name_ta || '—'} width="110px" /> கரணம் நாழிகை <Blank value={panch?.karana?.ending_nazhigai ?? '—'} width="50px" /> வினாடி <Blank value={panch?.karana?.ending_vinadi ?? '—'} width="50px" /> க்கு மேல் <Blank value={getNextKarana()} width="110px" /> கரணமும்
        </div>

        <div style={{ pageBreakInside: 'avoid', textAlign: 'justify', textJustify: 'inter-word' }}>
          தியாஜ்ஜியம் நாழிகை <Blank value="—" width="50px" /> வினாடி <Blank value="—" width="50px" />
        </div>

        <div style={{ pageBreakInside: 'avoid', textAlign: 'justify', textJustify: 'inter-word' }}>
          அகஸ் நாழிகை <Blank value="—" width="50px" /> வினாடி <Blank value="—" width="50px" /> யும்
        </div>

        <div style={{ pageBreakInside: 'avoid', color: PDF_GREEN, fontWeight: 'bold', textAlign: 'justify', textJustify: 'inter-word' }}>
          யோகமும் கூடிய சுபயோக சுபதினத்தில்
        </div>

        <div style={{ pageBreakInside: 'avoid', color: PDF_GREEN, fontWeight: 'bold', textAlign: 'justify', textJustify: 'inter-word' }}>
          அன்று காலை கதிர் உதயாதி முதல் {dayOrNightStr}
        </div>

        <div style={{ pageBreakInside: 'avoid', borderTop: `1.5px solid ${PDF_GREEN}`, paddingTop: '20px', marginTop: '10px', textAlign: 'justify', textJustify: 'inter-word' }}>
          {dayOrNightStr} மணி <Blank value={formattedHours} width="50px" /> நிமிஷம் <Blank value={mm} width="50px" /> க்கு நாழிகை <Blank value={udhayadhiNaz} width="50px" /> வினாடி <Blank value={udhayadhiVin} width="50px" /> க்கு வட்டம் <Blank value={cleanPlace} width="160px" /> கிராமம் உயர்திரு. <Blank value={profile.fatherName || '—'} width="160px" /> அவர்கள் மனைவி <Blank value={profile.motherName || '—'} width="160px" /> க்கு புத்திரன்/புத்திரி <Blank value={profile.name} width="200px" /> சுப ஜெனனம்.
        </div>

        <div style={{ pageBreakInside: 'avoid', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
          <div style={{ fontSize: '15px' }}>
            சூரியன் / உதயம் <Blank value={formatSunrise(panch?.sunrise_iso)} width="110px" />
          </div>
          <div style={{ color: PDF_GREEN, fontWeight: 'bold', fontSize: '15px' }}>
            - சுபம் -
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
