import React from 'react'
import { HoroscopeResponse, DashaResponse } from '@/types/astro'
import { RasiChart } from '@/components/astro/RasiChart'
import { PageWrapper } from './jathagam2/shared/PageWrapper'
import { PDF_GREEN, PDF_RED, PDF_BLACK } from './jathagam2/shared/jathagam2.constants'

interface BookChartReportProps {
  data: HoroscopeResponse
  dasa: DashaResponse | null
  profile: {
    name: string
    dob: string
    tob: string
    place: string
    gender?: 'Male' | 'Female'
    fatherName?: string
    motherName?: string
  }
  language: 'ta' | 'en'
  astrologer?: {
    name?: string
    address?: string
    phone?: string
  }
}

const PLANET_MAP_TA: Record<string, string> = {
  'Lagna': 'லக்னம்', 'Sun': 'சூரியன்', 'Moon': 'சந்திரன்', 'Mars': 'செவ்வாய்',
  'Mercury': 'புதன்', 'Jupiter': 'குரு', 'Venus': 'சுக்கிரன்', 'Saturn': 'சனி',
  'Rahu': 'ராகு', 'Ketu': 'கேது'
}
const SIGN_MAP_TA: Record<string, string> = {
  'Mesha': 'மேஷம்', 'Vrishabha': 'ரிஷபம்', 'Rishabha': 'ரிஷபம்', 'Mithuna': 'மிதுனம்',
  'Kataka': 'கடகம்', 'Simha': 'சிம்மம்', 'Kanya': 'கன்னி', 'Thula': 'துலாம்',
  'Vrischika': 'விருச்சிகம்', 'Dhanus': 'தனுசு', 'Makara': 'மகரம்',
  'Kumbha': 'கும்பம்', 'Meena': 'மீனம்'
}
const SIGN_MAP_EN: Record<string, string> = {
  'Mesha': 'Aries', 'Vrishabha': 'Taurus', 'Rishabha': 'Taurus', 'Mithuna': 'Gemini',
  'Kataka': 'Cancer', 'Simha': 'Leo', 'Kanya': 'Virgo', 'Thula': 'Libra',
  'Vrischika': 'Scorpio', 'Dhanus': 'Sagittarius', 'Makara': 'Capricorn',
  'Kumbha': 'Aquarius', 'Meena': 'Pisces'
}
const NAKSHATRA_MAP_TA: Record<string, string> = {
  'Ashwini': 'அஸ்வினி', 'Bharani': 'பரணி', 'Krittika': 'கார்த்திகை', 'Rohini': 'ரோகிணி',
  'Mrigashira': 'மிருகசீரிடம்', 'Ardra': 'திருவாதிரை', 'Punarvasu': 'புனர்பூசம்',
  'Pushya': 'பூசம்', 'Ashlesha': 'ஆயில்யம்', 'Magha': 'மகம்',
  'Purva Phalguni': 'பூரம்', 'Uttara Phalguni': 'உத்திரம்', 'Hasta': 'அஸ்தம்',
  'Chitra': 'சித்திரை', 'Swati': 'சுவாதி', 'Vishakha': 'விசாகம்', 'Anuradha': 'அனுஷம்',
  'Jyeshtha': 'கேட்டை', 'Mula': 'மூலம்', 'Purva Ashadha': 'பூராடம்',
  'Uttara Ashadha': 'உத்திராடம்', 'Shravana': 'திருவோணம்', 'Dhanishta': 'அவிட்டம்',
  'Shatabhisha': 'சதயம்', 'Purva Bhadrapada': 'பூரட்டாதி',
  'Uttara Bhadrapada': 'உத்திரட்டாதி', 'Revati': 'ரேவதி'
}
const PLANET_MAP_EN: Record<string, string> = {
  'Lagna': 'Ascendant', 'Sun': 'Sun', 'Moon': 'Moon', 'Mars': 'Mars',
  'Mercury': 'Mercury', 'Jupiter': 'Jupiter', 'Venus': 'Venus', 'Saturn': 'Saturn',
  'Rahu': 'Rahu', 'Ketu': 'Ketu'
}

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch { return dateStr }
}

export function BookChartReport({ data, dasa, profile, language, astrologer }: BookChartReportProps) {
  const isTa = language === 'ta'
  const P = isTa ? PLANET_MAP_TA : PLANET_MAP_EN
  const S = isTa ? SIGN_MAP_TA : SIGN_MAP_EN
  const N = isTa ? NAKSHATRA_MAP_TA : ({} as Record<string, string>)

  const moon = data.planets.find(p => p.planet === 'Moon')
  const lagna = data.planets.find(p => p.planet === 'Lagna')
  const moonNakshatra = moon?.nakshatra || ''
  const moonSign = moon?.sign || ''
  const moonPada = moon?.pada || ''
  const lagnaSign = lagna?.sign || data.lagna.sign

  const generatedDate = new Date().toLocaleDateString(isTa ? 'ta-IN' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  // Find active dasha object in timeline for rendering sub-bhuktis
  const activeDashaObj = dasa?.timeline.find(
    d => d.dasha_lord.toLowerCase() === dasa.current.dasha.toLowerCase()
  )

  const renderHeader = (pageTitle: string, pageNum: number) => (
    <div className="flex flex-col gap-1 w-full" style={{ marginBottom: '10px' }}>
      <div className="flex items-center justify-between">
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: PDF_GREEN }}>{pageTitle}</h3>
          <p style={{ fontSize: '10px', color: PDF_BLACK, fontFamily: 'sans-serif' }}>{profile.name} · {profile.dob}</p>
        </div>
        <p style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '0.1em', color: PDF_GREEN }}>
          JOTHI<span style={{ color: PDF_RED }}>SOFT</span>
        </p>
      </div>
      <div style={{ borderTop: `1.5px solid ${PDF_RED}`, width: '100%', marginTop: '4px' }} />
    </div>
  )

  const renderFooter = (pageNum: number) => (
    <div className="w-full flex flex-col gap-1 mt-auto" style={{ paddingTop: '10px' }}>
      <div style={{ borderTop: `1.5px solid ${PDF_RED}`, width: '100%', marginBottom: '4px' }} />
      <div className="flex justify-between items-center text-[10px] font-sans" style={{ color: PDF_BLACK }}>
        <span>{isTa ? 'ஜோதிசாஃப்ட் ஜோதிட அறிக்கை' : 'JothiSoft Astrological Systems'}</span>
        <span>{isTa ? 'பக்கம்' : 'Page'} {pageNum}</span>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; size: A4 portrait; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
          .jathagam-page {
            page-break-after: always !important;
            page-break-inside: avoid !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            width: 210mm !important;
            height: 297mm !important;
            box-sizing: border-box;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
          }
        }
        @media screen {
          .jathagam-page {
            margin-bottom: 2rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
          }
        }
      `}</style>

      {/* ══════════════════════════════════════════════
          PAGE 1: COVER
      ══════════════════════════════════════════════ */}
      <PageWrapper showU={false}>
        <div className="flex flex-col items-center justify-center flex-grow gap-6 text-center my-auto" style={{ fontFamily: "'Georgia', serif" }}>
          {/* App brand */}
          <div className="flex flex-col items-center gap-1">
            <p style={{ fontSize: '10px', letterSpacing: '0.4em', textTransform: 'uppercase', color: PDF_BLACK, fontFamily: 'sans-serif' }}>
              {isTa ? 'வழங்குபவர்' : 'Powered by'}
            </p>
            <h1 style={{ fontSize: '30px', fontWeight: '900', letterSpacing: '0.1em', color: PDF_GREEN }}>
              JOTHI<span style={{ color: PDF_RED }}>SOFT</span>
            </h1>
          </div>

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <div style={{ flex: 1, height: '1.5px', backgroundColor: PDF_RED }} />
            <span style={{ color: PDF_GREEN, fontSize: '18px' }}>✦</span>
            <div style={{ flex: 1, height: '1.5px', backgroundColor: PDF_RED }} />
          </div>

          {/* Report type */}
          <div className="flex flex-col items-center gap-2">
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: PDF_BLACK, fontFamily: 'sans-serif' }}>
              {isTa ? 'புத்தக ஜாதகம்' : 'Book Horoscope'}
            </p>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: PDF_GREEN }}>
              {isTa ? 'ஜாதகம்' : 'Jathagam'}
            </h2>
            <p style={{ fontSize: '12px', color: PDF_BLACK, fontFamily: 'sans-serif' }}>
              {isTa ? 'விம்சோத்தரி தசா நாடி' : 'Vimshottari Dasa System'}
            </p>
          </div>

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <div style={{ flex: 1, height: '1.5px', backgroundColor: PDF_RED }} />
            <span style={{ color: PDF_GREEN, fontSize: '18px' }}>✦</span>
            <div style={{ flex: 1, height: '1.5px', backgroundColor: PDF_RED }} />
          </div>

          {/* Subject name */}
          <div className="flex flex-col items-center gap-1">
            <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: PDF_BLACK, fontFamily: 'sans-serif' }}>
              {isTa ? 'பெயர்' : 'Prepared For'}
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: PDF_GREEN }}>
              {profile.name}
            </p>
          </div>

          {/* Birth details block */}
          <div style={{ width: '100%', maxWidth: '480px', border: `1.5px solid ${PDF_GREEN}`, borderRadius: '12px', overflow: 'hidden', backgroundColor: '#fffdf9', fontSize: '12px', textAlign: 'left' }}>
            <div className="grid grid-cols-2 divide-x border-b" style={{ borderColor: PDF_GREEN }}>
              <div className="p-2.5 flex flex-col gap-1">
                <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(107, 20, 38, 0.15)' }}>
                  <span style={{ color: PDF_BLACK }}>{isTa ? 'பெயர்:' : 'Name:'}</span>
                  <span style={{ fontWeight: 'bold', color: PDF_GREEN }} className="truncate max-w-[140px]">{profile.name}</span>
                </div>
                <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(107, 20, 38, 0.15)' }}>
                  <span style={{ color: PDF_BLACK }}>{isTa ? 'தந்தை:' : 'Father:'}</span>
                  <span style={{ fontWeight: 'bold', color: PDF_GREEN }} className="truncate max-w-[140px]">{profile.fatherName || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: PDF_BLACK }}>{isTa ? 'தாய்:' : 'Mother:'}</span>
                  <span style={{ fontWeight: 'bold', color: PDF_GREEN }} className="truncate max-w-[140px]">{profile.motherName || '—'}</span>
                </div>
              </div>
              <div className="p-2.5 flex flex-col gap-1">
                <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(107, 20, 38, 0.15)' }}>
                  <span style={{ color: PDF_BLACK }}>{isTa ? 'தேதி:' : 'Date:'}</span>
                  <span style={{ fontWeight: 'bold', color: PDF_GREEN }} className="font-mono">{profile.dob}</span>
                </div>
                <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(107, 20, 38, 0.15)' }}>
                  <span style={{ color: PDF_BLACK }}>{isTa ? 'நேரம்:' : 'Time:'}</span>
                  <span style={{ fontWeight: 'bold', color: PDF_GREEN }} className="font-mono">{profile.tob}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: PDF_BLACK }}>{isTa ? 'பாலினம்:' : 'Gender:'}</span>
                  <span style={{ fontWeight: 'bold', color: PDF_GREEN }}>
                    {profile.gender ? (profile.gender === 'Male' ? (isTa ? 'ஆண்' : 'Male') : (isTa ? 'பெண்' : 'Female')) : '—'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 divide-x">
              <div className="p-2.5 flex flex-col gap-1">
                <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(107, 20, 38, 0.15)' }}>
                  <span style={{ color: PDF_BLACK }}>{isTa ? 'இடம்:' : 'Place:'}</span>
                  <span style={{ fontWeight: 'bold', color: PDF_GREEN }} className="truncate max-w-[140px]">{profile.place}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: PDF_BLACK }}>{isTa ? 'லக்னம்:' : 'Lagna:'}</span>
                  <span style={{ fontWeight: 'bold', color: PDF_RED }}>{S[lagnaSign] || lagnaSign}</span>
                </div>
              </div>
              <div className="p-2.5 flex flex-col gap-1">
                <div className="flex justify-between border-b pb-1" style={{ borderColor: 'rgba(107, 20, 38, 0.15)' }}>
                  <span style={{ color: PDF_BLACK }}>{isTa ? 'ராசி:' : 'Rasi:'}</span>
                  <span style={{ fontWeight: 'bold', color: PDF_GREEN }}>{S[moonSign] || moonSign}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: PDF_BLACK }}>{isTa ? 'நட்சத்திரம்:' : 'Star:'}</span>
                  <span style={{ fontWeight: 'bold', color: PDF_GREEN }}>{N[moonNakshatra] || moonNakshatra} {moonPada ? `(${moonPada})` : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Astrologer Details card */}
          {astrologer?.name && (
            <div style={{ border: `1.5px dashed ${PDF_GREEN}`, borderRadius: '12px', padding: '12px', backgroundColor: '#fffdf9', width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '2px' }} className="text-center">
              <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: PDF_BLACK, fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                {isTa ? 'ஜோதிடர் விவரங்கள்' : 'Astrologer Details'}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: PDF_GREEN }}>{astrologer.name}</p>
              {astrologer.address && <p style={{ fontSize: '11px', color: PDF_BLACK, fontFamily: 'sans-serif', lineHeight: '1.2' }}>{astrologer.address}</p>}
              {astrologer.phone && <p style={{ fontSize: '11px', color: PDF_BLACK, fontFamily: 'sans-serif', fontWeight: 'bold', lineHeight: '1.2' }}>{isTa ? 'தொலைபேசி:' : 'Phone:'} {astrologer.phone}</p>}
            </div>
          )}

          {/* Generated on */}
          <p style={{ fontSize: '10px', color: PDF_BLACK, fontFamily: 'sans-serif' }}>
            {isTa ? 'உருவாக்கப்பட்டது:' : 'Generated on:'} {generatedDate}
          </p>
        </div>
      </PageWrapper>

      {/* ══════════════════════════════════════════════
          PAGE 2: NATAL CHARTS (D1 & D9)
      ══════════════════════════════════════════════ */}
      <PageWrapper showU={true}>
        {renderHeader(isTa ? 'கட்ட ஜாதகம்' : 'Natal Charts', 2)}

        <div className="flex-grow py-6 flex flex-col justify-around">
          {/* Charts side by side */}
          <div className="grid grid-cols-2 gap-8 justify-items-center items-center">
            <div className="flex flex-col items-center gap-2 w-full max-w-[280px]">
              <RasiChart
                chart={data.rasi_chart}
                planets={data.planets}
                title={isTa ? 'ராசி கட்டம் (D1)' : 'Rasi Chart (D1)'}
                lagnaSign={data.lagna.sign}
                isPrint={true}
                language={language}
                size="medium"
              />
            </div>
            <div className="flex flex-col items-center gap-2 w-full max-w-[280px]">
              <RasiChart
                chart={data.navamsam_chart}
                planets={data.planets}
                title={isTa ? 'நவாம்சம் கட்டம் (D9)' : 'Navamsam Chart (D9)'}
                lagnaSign={data.lagna.navamsa_sign || data.lagna.sign}
                isPrint={true}
                language={language}
                size="medium"
              />
            </div>
          </div>

          {/* Key highlights below charts */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: isTa ? 'லக்னம்' : 'Ascendant', value: S[lagnaSign] || lagnaSign },
              { label: isTa ? 'ராசி' : 'Moon Sign', value: S[moonSign] || moonSign },
              { label: isTa ? 'நட்சத்திரம்' : 'Birth Star', value: `${N[moonNakshatra] || moonNakshatra} (${moonPada})` },
              { label: isTa ? 'நடப்பு தசை' : 'Current Dasa', value: dasa ? `${P[dasa.current.dasha] || dasa.current.dasha}` : '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ border: `1.5px solid ${PDF_RED}`, borderRadius: '8px', padding: '10px', textAlign: 'center', backgroundColor: '#fffdf9' }}>
                <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: PDF_BLACK, marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '14px', fontWeight: 'bold', color: PDF_GREEN }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {renderFooter(2)}
      </PageWrapper>

      {/* ══════════════════════════════════════════════
          PAGE 3: PLANET POSITIONS & PANCHANGAM
      ══════════════════════════════════════════════ */}
      <PageWrapper showU={true}>
        {renderHeader(isTa ? 'கிரக நிலைகள் & பஞ்சாங்கம்' : 'Planetary Positions & Panchangam', 3)}

        <div className="flex-grow py-4 flex flex-col justify-around gap-4">
          {/* Planetary positions table */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: PDF_GREEN, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {isTa ? 'கிரக அமைப்புகள்' : 'Planetary Degrees'}
            </h4>
            <table className="w-full text-xs border-collapse" style={{ border: `1.5px solid ${PDF_GREEN}` }}>
              <thead>
                <tr style={{ backgroundColor: PDF_GREEN, color: 'white', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }} className="text-left">
                  <th className="py-2 px-3">{isTa ? 'கிரகம்' : 'Planet'}</th>
                  <th className="py-2 px-3">{isTa ? 'ராசி' : 'Sign'}</th>
                  <th className="py-2 px-3 text-center">{isTa ? 'பாகை' : 'Degree'}</th>
                  <th className="py-2 px-3 text-center">{isTa ? 'வீடு' : 'House'}</th>
                  <th className="py-2 px-3">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</th>
                  <th className="py-2 px-3 text-center">{isTa ? 'பாதம்' : 'Pada'}</th>
                </tr>
              </thead>
              <tbody>
                {data.planets.map((planet, idx) => (
                  <tr key={idx} style={{ borderBottom: `1px solid rgba(107, 20, 38, 0.15)` }} className={planet.planet === 'Lagna' ? 'font-bold' : ''}>
                    <td className="py-1.5 px-3 font-bold" style={{ color: PDF_GREEN }}>{P[planet.planet] || planet.planet}</td>
                    <td className="py-1.5 px-3" style={{ color: PDF_BLACK }}>{S[planet.sign] || planet.sign}</td>
                    <td className="py-1.5 px-3 text-center font-mono" style={{ color: PDF_BLACK }}>{planet.sign_degree.toFixed(2)}°</td>
                    <td className="py-1.5 px-3 text-center font-bold" style={{ color: PDF_RED }}>{planet.house}</td>
                    <td className="py-1.5 px-3" style={{ color: PDF_BLACK }}>{N[planet.nakshatra] || planet.nakshatra}</td>
                    <td className="py-1.5 px-3 text-center" style={{ color: PDF_BLACK }}>{planet.pada || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Panchangam details box */}
          {data.panchangam && (
            <div style={{ border: `1.5px solid ${PDF_GREEN}`, borderRadius: '12px', padding: '16px', backgroundColor: '#fffdf9' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: PDF_GREEN, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                {isTa ? 'பிறப்பு பஞ்சாங்கம்' : 'Birth Panchangam'}
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 border-r" style={{ borderColor: 'rgba(107, 20, 38, 0.15)' }}>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', color: PDF_BLACK }}>{isTa ? 'திதி' : 'Tithi'}</span>
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: PDF_RED }}>
                    {isTa ? data.panchangam.tithi.name_ta : data.panchangam.tithi.name}
                  </span>
                </div>
                <div className="flex flex-col gap-1 border-r" style={{ borderColor: 'rgba(107, 20, 38, 0.15)' }}>
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', color: PDF_BLACK }}>{isTa ? 'யோகம்' : 'Yoga'}</span>
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: PDF_RED }}>
                    {isTa ? data.panchangam.yoga.name_ta : data.panchangam.yoga.name}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', color: PDF_BLACK }}>{isTa ? 'கரணம்' : 'Karana'}</span>
                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: PDF_RED }}>
                    {isTa ? data.panchangam.karana.name_ta : data.panchangam.karana.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {renderFooter(3)}
      </PageWrapper>

      {/* ══════════════════════════════════════════════
          PAGE 4: DIVISIONAL CHARTS PART 1 (D2-D16)
      ══════════════════════════════════════════════ */}
      <PageWrapper showU={true}>
        {renderHeader(isTa ? 'வர்க்கக் சக்கரங்கள் (பகுதி 1)' : 'Divisional Charts (Part 1)', 4)}

        <div className="flex-grow py-4 flex flex-col justify-around">
          {data.divisional_charts ? (
            <div className="grid grid-cols-2 gap-x-16 gap-y-1.5 justify-items-center justify-center items-center">
              {['D2', 'D3', 'D4', 'D6', 'D7', 'D10', 'D12', 'D16'].map((div) => {
                const divData = data.divisional_charts?.[div]
                if (!divData) return null
                const divNameMap: Record<string, { en: string; ta: string }> = {
                  D2: { en: 'D2 Hora (Wealth & Assets)', ta: 'D2 ஹோரா (தனம் & சொத்து)' },
                  D3: { en: 'D3 Drekkana (Siblings & Courage)', ta: 'D3 திரேக்காணம் (சகோதரம் & வீரியம்)' },
                  D4: { en: 'D4 Chaturthamsa (Properties)', ta: 'D4 சதுர்த்தாம்சம் (நிலம் & சொத்து)' },
                  D6: { en: 'D6 Shasthamsa (Health & Enemies)', ta: 'D6 சாஸ்தாம்சம் (நோய் & எதிரிகள்)' },
                  D7: { en: 'D7 Saptamsa (Children & Progeny)', ta: 'D7 சப்தாம்சம் (புத்திர பாக்கியம்)' },
                  D10: { en: 'D10 Dasamsa (Career & Status)', ta: 'D10 தசாம்சம் (தொழில் & கீர்த்தி)' },
                  D12: { en: 'D12 Dwadasamsa (Parents)', ta: 'D12 துவாதசாம்சம் (பெற்றோர் & பித்ருக்கள்)' },
                  D16: { en: 'D16 Shodasamsa (Vehicles & Luxury)', ta: 'D16 சோடசாம்சம் (வாகனம் & சுகம்)' }
                }
                const title = isTa ? divNameMap[div].ta : divNameMap[div].en
                return (
                  <div key={div} className="w-full max-w-[145px] flex flex-col items-center">
                    <RasiChart
                      chart={divData.chart}
                      planets={data.planets}
                      title={title}
                      lagnaSign={divData.lagna_sign}
                      isPrint={true}
                      language={language}
                      titleClassName="text-[10px] font-bold mb-1 text-center leading-tight min-h-[28px] flex items-center justify-center text-[#6b1426]"
                      size="small"
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-sm" style={{ color: PDF_BLACK }}>
              {isTa ? 'வர்க்கக் சக்கரங்கள் இல்லை' : 'Divisional charts not computed'}
            </p>
          )}
        </div>

        {renderFooter(4)}
      </PageWrapper>

      {/* ══════════════════════════════════════════════
          PAGE 5: DIVISIONAL CHARTS PART 2 (D20-D60)
      ══════════════════════════════════════════════ */}
      <PageWrapper showU={true}>
        {renderHeader(isTa ? 'வர்க்கக் சக்கரங்கள் (பகுதி 2)' : 'Divisional Charts (Part 2)', 5)}

        <div className="flex-grow py-4 flex flex-col justify-around">
          {data.divisional_charts ? (
            <div className="grid grid-cols-2 gap-x-16 gap-y-1.5 justify-items-center justify-center items-center">
              {['D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'].map((div) => {
                const divData = data.divisional_charts?.[div]
                if (!divData) return null
                const divNameMap: Record<string, { en: string; ta: string }> = {
                  D20: { en: 'D20 Vimsamsa (Spiritual Progress)', ta: 'D20 விம்சாம்சம் (ஆன்மீகம்)' },
                  D24: { en: 'D24 Chaturvimsamsa (Education)', ta: 'D24 சதுர்விம்சாம்சம் (கல்வி)' },
                  D27: { en: 'D27 Saptavimsamsa (Vitality & Health)', ta: 'D27 சப்தவிம்சாம்சம் (பலம் & வீரியம்)' },
                  D30: { en: 'D30 Trimsamsa (Evils & Obstacles)', ta: 'D30 திரிம்சாம்சம் (அரிஷ்டம் & தடைகள்)' },
                  D40: { en: 'D40 Khavedamsa (Auspiciousness)', ta: 'D40 கவேடாம்சம் (சுப பலன்கள்)' },
                  D45: { en: 'D45 Akshavedamsa (Character & Ethics)', ta: 'D45 அக்ஷவேடாம்சம் (குணநலன்கள்)' },
                  D60: { en: 'D60 Shastiamsa (Karma & Destiny)', ta: 'D60 சஷ்டியாம்சம் (கர்ம வினைகள்)' }
                }
                const title = isTa ? divNameMap[div].ta : divNameMap[div].en
                return (
                  <div key={div} className="w-full max-w-[145px] flex flex-col items-center">
                    <RasiChart
                      chart={divData.chart}
                      planets={data.planets}
                      title={title}
                      lagnaSign={divData.lagna_sign}
                      isPrint={true}
                      language={language}
                      titleClassName="text-[10px] font-bold mb-1 text-center leading-tight min-h-[28px] flex items-center justify-center text-[#6b1426]"
                      size="small"
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-sm" style={{ color: PDF_BLACK }}>
              {isTa ? 'வர்க்கக் சக்கரங்கள் இல்லை' : 'Divisional charts not computed'}
            </p>
          )}
        </div>

        {renderFooter(5)}
      </PageWrapper>

      {/* ══════════════════════════════════════════════
          PAGE 6: DOSHA ANALYSIS
      ══════════════════════════════════════════════ */}
      <PageWrapper showU={true}>
        {renderHeader(isTa ? 'ஜாதக தோஷ ஆய்வுகள்' : 'Dosha Analysis', 6)}

        <div className="flex-grow py-6 flex flex-col justify-around gap-6">
          {data.dosha_analysis ? (
            <>
              {/* Sevvai Dosham Card */}
              <div style={{ border: `1.5px solid ${PDF_GREEN}`, borderRadius: '12px', padding: '20px', backgroundColor: '#fffdf9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex items-center justify-between">
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: PDF_GREEN }}>
                    {isTa ? 'செவ்வாய் தோஷ விவரம் (Sevvai Dosham / Manglik)' : 'Mars Dosha Analysis (Sevvai Dosham)'}
                  </h4>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    border: '1px solid',
                    ...(data.dosha_analysis.sevvai_dosham.severity === 'None'
                      ? { backgroundColor: '#e6f4ea', color: '#137333', borderColor: '#c2e7cd' }
                      : { backgroundColor: '#fce8e6', color: '#c5221f', borderColor: '#fad2cf' }
                    )
                  }}>
                    {data.dosha_analysis.sevvai_dosham.severity === 'None' ? (isTa ? 'தோஷம் இல்லை' : 'No Dosha') : (isTa ? 'தோஷம் உள்ளது' : 'Dosha Present')}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: PDF_BLACK, lineHeight: '1.4', fontFamily: 'sans-serif' }}>
                  {isTa ? data.dosha_analysis.sevvai_dosham.description_ta : data.dosha_analysis.sevvai_dosham.description_en}
                </p>
                {data.dosha_analysis.sevvai_dosham.has_dosha && (
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ fontWeight: 'bold', color: PDF_GREEN }}>{isTa ? 'பரிந்துரைக்கப்பட்ட பரிகாரங்கள்:' : 'Suggested Remedies:'}</span>
                    <ul className="list-disc list-inside mt-1.5 space-y-1 font-sans" style={{ color: PDF_BLACK }}>
                      {(isTa ? data.dosha_analysis.sevvai_dosham.remedies_ta : data.dosha_analysis.sevvai_dosham.remedies_en).map((rem, idx) => (
                        <li key={idx}>{rem}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Rahu Ketu Dosham Card */}
              <div style={{ border: `1.5px solid ${PDF_GREEN}`, borderRadius: '12px', padding: '20px', backgroundColor: '#fffdf9', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="flex items-center justify-between">
                  <h4 style={{ fontSize: '15px', fontWeight: 'bold', color: PDF_GREEN }}>
                    {isTa ? 'ராகு கேது சர்ப்ப தோஷம் (Rahu-Ketu / Sarpa Dosha)' : 'Rahu-Ketu Dosha Analysis (Sarpa Dosha)'}
                  </h4>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    border: '1px solid',
                    ...(data.dosha_analysis.rahu_ketu_dosham.severity === 'None'
                      ? { backgroundColor: '#e6f4ea', color: '#137333', borderColor: '#c2e7cd' }
                      : { backgroundColor: '#fce8e6', color: '#c5221f', borderColor: '#fad2cf' }
                    )
                  }}>
                    {data.dosha_analysis.rahu_ketu_dosham.severity === 'None' ? (isTa ? 'தோஷம் இல்லை' : 'No Dosha') : (isTa ? 'தோஷம் உள்ளது' : 'Dosha Present')}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: PDF_BLACK, lineHeight: '1.4', fontFamily: 'sans-serif' }}>
                  {isTa ? data.dosha_analysis.rahu_ketu_dosham.description_ta : data.dosha_analysis.rahu_ketu_dosham.description_en}
                </p>
                {data.dosha_analysis.rahu_ketu_dosham.has_dosha && (
                  <div style={{ fontSize: '12px' }}>
                    <span style={{ fontWeight: 'bold', color: PDF_GREEN }}>{isTa ? 'பரிந்துரைக்கப்பட்ட பரிகாரங்கள்:' : 'Suggested Remedies:'}</span>
                    <ul className="list-disc list-inside mt-1.5 space-y-1 font-sans" style={{ color: PDF_BLACK }}>
                      {(isTa ? data.dosha_analysis.rahu_ketu_dosham.remedies_ta : data.dosha_analysis.rahu_ketu_dosham.remedies_en).map((rem, idx) => (
                        <li key={idx}>{rem}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-sm" style={{ color: PDF_BLACK }}>
              {isTa ? 'தோஷ விவரங்கள் இல்லை' : 'Dosha analysis data not available'}
            </p>
          )}
        </div>

        {renderFooter(6)}
      </PageWrapper>

      {/* ══════════════════════════════════════════════
          PAGE 7: DASHA-BHUKTI TIMELINES
      ══════════════════════════════════════════════ */}
      <PageWrapper showU={true}>
        {renderHeader(isTa ? 'விம்சோத்தரி தசா கால அட்டவணை' : 'Dasa-Bhukti Timelines', 7)}

        <div className="flex-grow py-6 flex flex-col justify-around gap-6">
          {/* Main Mahadasha Timeline */}
          {dasa && (
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: PDF_GREEN, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                {isTa ? 'மகா தசா காலங்கள் (Mahadasha Cycles)' : 'Mahadasha Timeline'}
              </h4>
              <table className="w-full text-xs border-collapse" style={{ border: `1.5px solid ${PDF_GREEN}` }}>
                <thead>
                  <tr style={{ backgroundColor: PDF_GREEN, color: 'white', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }} className="text-left">
                    <th className="py-2 px-3">{isTa ? 'தசை நாதன்' : 'Dasa Lord'}</th>
                    <th className="py-2 px-3">{isTa ? 'தொடக்கம்' : 'Start'}</th>
                    <th className="py-2 px-3">{isTa ? 'முடிவு' : 'End'}</th>
                    <th className="py-2 px-3">{isTa ? 'நிலை' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {dasa.timeline.map((d, i) => {
                    const isActive = dasa.current.dasha.toLowerCase() === d.dasha_lord.toLowerCase()
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid rgba(107, 20, 38, 0.15)` }} className={isActive ? 'font-bold' : ''}>
                        <td className="py-1.5 px-3 font-bold" style={{ color: PDF_GREEN }}>{P[d.dasha_lord] || d.dasha_lord}</td>
                        <td className="py-1.5 px-3 font-mono" style={{ color: PDF_BLACK }}>{formatDate(d.start_date)}</td>
                        <td className="py-1.5 px-3 font-mono" style={{ color: PDF_BLACK }}>{formatDate(d.end_date)}</td>
                        <td className="py-1.5 px-3">
                          {isActive && (
                            <span style={{ fontSize: '8px', backgroundColor: '#e6f4ea', color: '#137333', border: '1px solid #c2e7cd', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                              {isTa ? 'நடப்பு' : 'Active'}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Sub-Bhukti Timeline for active Mahadasha */}
          {dasa && activeDashaObj && activeDashaObj.bhuktis && (
            <div>
              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: PDF_GREEN, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                {isTa ? `${P[dasa.current.dasha] || dasa.current.dasha} தசையில் உள்ள புத்தி காலங்கள்` : `Bhukti Timeline for ${dasa.current.dasha} Dasa`}
              </h4>
              <table className="w-full text-xs border-collapse" style={{ border: `1.5px solid ${PDF_GREEN}` }}>
                <thead>
                  <tr style={{ backgroundColor: PDF_GREEN, color: 'white', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.05em' }} className="text-left">
                    <th className="py-2 px-3">{isTa ? 'புத்தி நாதன்' : 'Bhukti Lord'}</th>
                    <th className="py-2 px-3">{isTa ? 'தொடக்கம்' : 'Start'}</th>
                    <th className="py-2 px-3">{isTa ? 'முடிவு' : 'End'}</th>
                    <th className="py-2 px-3">{isTa ? 'நிலை' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {activeDashaObj.bhuktis.map((b, i) => {
                    const isActive = dasa.current.bhukti.toLowerCase() === b.dasha_lord.toLowerCase()
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid rgba(107, 20, 38, 0.15)` }} className={isActive ? 'font-bold' : ''}>
                        <td className="py-1.5 px-3 font-bold" style={{ color: PDF_GREEN }}>
                          {P[dasa.current.dasha] || dasa.current.dasha} - {P[b.dasha_lord] || b.dasha_lord}
                        </td>
                        <td className="py-1.5 px-3 font-mono" style={{ color: PDF_BLACK }}>{formatDate(b.start_date)}</td>
                        <td className="py-1.5 px-3 font-mono" style={{ color: PDF_BLACK }}>{formatDate(b.end_date)}</td>
                        <td className="py-1.5 px-3">
                          {isActive && (
                            <span style={{ fontSize: '8px', backgroundColor: '#e6f4ea', color: '#137333', border: '1px solid #c2e7cd', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
                              {isTa ? 'நடப்பு' : 'Active'}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {renderFooter(7)}
      </PageWrapper>

      {/* ══════════════════════════════════════════════
          PAGE 8: PREDICTIONS & DASHA INTERPRETATION
      ══════════════════════════════════════════════ */}
      <PageWrapper showU={true}>
        {renderHeader(isTa ? 'ஜாதக பலன்கள் & தசா பலன்கள்' : 'General & Dasa Predictions', 8)}

        <div className="flex-grow py-4 flex flex-col justify-around gap-4 overflow-hidden">
          {/* General Predictions summaries */}
          <div className="flex flex-col gap-3">
            {[
              { label: isTa ? 'லக்ன பலன்' : 'Lagna Prediction', text: isTa ? data.predictions.lagna.description_ta : data.predictions.lagna.description_en },
              { label: isTa ? 'இராசி பலன்' : 'Rasi Prediction', text: isTa ? data.predictions.rasi.description_ta : data.predictions.rasi.description_en }
            ].map(({ label, text }, idx) => (
              <div key={idx} style={{ border: `1.5px solid ${PDF_GREEN}`, borderRadius: '12px', padding: '12px', backgroundColor: '#fffdf9' }}>
                <h5 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: PDF_BLACK, fontWeight: 'bold', marginBottom: '4px' }}>{label}</h5>
                <p style={{ fontSize: '12px', color: PDF_BLACK, fontFamily: 'sans-serif', lineHeight: '1.4' }} className="line-clamp-3">{text}</p>
              </div>
            ))}
          </div>

          {/* Dasha Predictions */}
          {data.dasha_prediction && (
            <div style={{ border: `1.5px solid ${PDF_GREEN}`, borderRadius: '12px', padding: '16px', backgroundColor: '#fffdf9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: PDF_GREEN, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {isTa ? 'தற்போதைய தசை-புத்தி பலன்கள்' : 'Current Dasa-Bhukti Interpretations'}
              </h4>
              <div style={{ fontSize: '12px', color: PDF_BLACK, fontFamily: 'sans-serif', lineHeight: '1.4' }} className="space-y-2">
                <div>
                  <strong style={{ color: PDF_GREEN, display: 'block', marginBottom: '2px' }}>
                    {isTa ? `${data.dasha_prediction.mahadasha_lord} தசை பலன்கள்:` : `${data.dasha_prediction.mahadasha_lord} Dasa Results:`}
                  </strong>
                  <p style={{ color: PDF_BLACK }}>
                    {isTa ? data.dasha_prediction.mahadasha_prediction_ta : data.dasha_prediction.mahadasha_prediction_en}
                  </p>
                </div>
                <div>
                  <strong style={{ color: PDF_GREEN, display: 'block', marginBottom: '2px' }}>
                    {isTa ? `${data.dasha_prediction.bhukti_lord} புத்தி பலன்கள்:` : `${data.dasha_prediction.bhukti_lord} Bhukti Results:`}
                  </strong>
                  <p style={{ color: PDF_BLACK }}>
                    {isTa ? data.dasha_prediction.bhukti_prediction_ta : data.dasha_prediction.bhukti_prediction_en}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer note */}
          <div className="pt-2" style={{ borderTop: `1px solid ${PDF_RED}` }}>
            <p style={{ fontSize: '9px', color: PDF_BLACK, textAlign: 'center', lineHeight: '1.4', fontFamily: 'sans-serif' }}>
              {isTa
                ? 'இந்த ஜாதக அறிக்கை JothiSoft மூலம் கணித முறைப்படி தயாரிக்கப்பட்டது. இது ஒரு வழிகாட்டியே தவிர இறுதி முடிவல்ல.'
                : 'This computer-generated report is based on mathematical coordinates. Astrological advice is for guidance and spiritual reference only.'}
            </p>
          </div>
        </div>

        {renderFooter(8)}
      </PageWrapper>
    </>
  )
}
