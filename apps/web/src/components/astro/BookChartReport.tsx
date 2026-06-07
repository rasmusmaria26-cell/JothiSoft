import React from 'react'
import { HoroscopeResponse, DashaResponse } from '@/types/astro'
import { RasiChart } from '@/components/astro/RasiChart'

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

const PAGE = "relative bg-white text-black w-[210mm] h-[297mm] mx-auto overflow-hidden print:shadow-none shadow-2xl flex flex-col justify-between"
const DIVIDER = "w-full border-t border-gray-300"

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
    <div className="flex flex-col gap-2 px-10 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{pageTitle}</h3>
          <p className="text-[10px] text-gray-500 font-sans">{profile.name} · {profile.dob}</p>
        </div>
        <p className="text-sm font-black tracking-widest text-gray-900">
          JOTHI<span style={{ color: '#c9922a' }}>SOFT</span>
        </p>
      </div>
      <div className={DIVIDER} />
    </div>
  )

  const renderFooter = (pageNum: number) => (
    <div className="px-10 pb-8 flex flex-col gap-2">
      <div className={DIVIDER} />
      <div className="flex justify-between items-center text-[10px] text-gray-400 font-sans">
        <span>{isTa ? 'ஜோதிசாஃப்ட் ஜோதிட அறிக்கை' : 'JothiSoft Astrological Systems'}</span>
        <span>{isTa ? 'பக்கம்' : 'Page'} {pageNum}</span>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
          .page-break { page-break-before: always; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════
          PAGE 1: COVER
      ══════════════════════════════════════════════ */}
      <div className={PAGE} style={{ fontFamily: "'Georgia', serif" }}>
        <div className="w-full h-3 bg-gray-900" />
        <div className="w-full h-1" style={{ background: '#c9922a' }} />

        <div className="flex flex-col items-center justify-center flex-grow px-12 gap-6 text-center my-auto">
          {/* App brand */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-500 font-sans">Powered by</p>
            <h1 className="text-3xl font-black tracking-widest text-gray-900">
              JOTHI<span style={{ color: '#c9922a' }}>SOFT</span>
            </h1>
          </div>

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-400 text-lg">✦</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Report type */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs tracking-[0.5em] uppercase text-gray-500 font-sans">
              {isTa ? 'புத்தக ஜாதகம்' : 'Book Horoscope'}
            </p>
            <h2 className="text-4xl font-bold text-gray-900 leading-tight">
              {isTa ? 'ஜாதகம்' : 'Jathagam'}
            </h2>
            <p className="text-xs text-gray-500 font-sans">
              {isTa ? 'விம்சோத்தரி தசா நாடி' : 'Vimshottari Dasa System'}
            </p>
          </div>

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 w-full max-w-xs">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-400 text-lg">✦</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Subject name */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-500 font-sans">
              {isTa ? 'பெயர்' : 'Prepared For'}
            </p>
            <p className="text-3xl font-bold text-gray-900 tracking-wide">
              {profile.name}
            </p>
          </div>

          {/* Birth details block */}
          <div className="w-full max-w-lg border border-gray-300 rounded-xl overflow-hidden bg-gray-50 text-[11px] text-left">
            <div className="grid grid-cols-2 divide-x divide-gray-300 border-b border-gray-300">
              <div className="p-2.5 flex flex-col gap-1">
                <div className="flex justify-between border-b border-gray-200/60 pb-1">
                  <span className="text-gray-500">{isTa ? 'பெயர்:' : 'Name:'}</span>
                  <span className="font-bold text-gray-900 truncate max-w-[140px]">{profile.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-1">
                  <span className="text-gray-500">{isTa ? 'தந்தை:' : 'Father:'}</span>
                  <span className="font-bold text-gray-900 truncate max-w-[140px]">{profile.fatherName || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isTa ? 'தாய்:' : 'Mother:'}</span>
                  <span className="font-bold text-gray-900 truncate max-w-[140px]">{profile.motherName || '—'}</span>
                </div>
              </div>
              <div className="p-2.5 flex flex-col gap-1">
                <div className="flex justify-between border-b border-gray-200/60 pb-1">
                  <span className="text-gray-500">{isTa ? 'தேதி:' : 'Date:'}</span>
                  <span className="font-bold text-gray-900 font-mono">{profile.dob}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 pb-1">
                  <span className="text-gray-500">{isTa ? 'நேரம்:' : 'Time:'}</span>
                  <span className="font-bold text-gray-900 font-mono">{profile.tob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isTa ? 'பாலினம்:' : 'Gender:'}</span>
                  <span className="font-bold text-gray-900">
                    {profile.gender ? (profile.gender === 'Male' ? (isTa ? 'ஆண்' : 'Male') : (isTa ? 'பெண்' : 'Female')) : '—'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 divide-x divide-gray-300">
              <div className="p-2.5 flex flex-col gap-1">
                <div className="flex justify-between border-b border-gray-200/60 pb-1">
                  <span className="text-gray-500">{isTa ? 'இடம்:' : 'Place:'}</span>
                  <span className="font-bold text-gray-900 truncate max-w-[140px]">{profile.place}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isTa ? 'லக்னம்:' : 'Lagna:'}</span>
                  <span className="font-bold text-gold-deep">{S[lagnaSign] || lagnaSign}</span>
                </div>
              </div>
              <div className="p-2.5 flex flex-col gap-1">
                <div className="flex justify-between border-b border-gray-200/60 pb-1">
                  <span className="text-gray-500">{isTa ? 'ராசி:' : 'Rasi:'}</span>
                  <span className="font-bold text-gray-900">{S[moonSign] || moonSign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isTa ? 'நட்சத்திரம்:' : 'Star:'}</span>
                  <span className="font-bold text-gray-900">{N[moonNakshatra] || moonNakshatra} {moonPada ? `(${moonPada})` : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Astrologer Details card */}
          {astrologer?.name && (
            <div className="p-3 border border-dashed border-gray-300 rounded-xl bg-gray-50/50 w-full max-w-lg text-center flex flex-col gap-0.5">
              <p className="text-[9px] uppercase tracking-wider text-gray-400 font-sans font-bold">
                {isTa ? 'ஜோதிடர் விவரங்கள்' : 'Astrologer Details'}
              </p>
              <p className="text-xs font-black text-gray-900">{astrologer.name}</p>
              {astrologer.address && <p className="text-[10px] text-gray-600 font-sans leading-tight">{astrologer.address}</p>}
              {astrologer.phone && <p className="text-[10px] text-gray-600 font-sans leading-tight font-bold">{isTa ? 'தொலைபேசி:' : 'Phone:'} {astrologer.phone}</p>}
            </div>
          )}

          {/* Generated on */}
          <p className="text-[10px] text-gray-400 font-sans">
            {isTa ? 'உருவாக்கப்பட்டது:' : 'Generated on:'} {generatedDate}
          </p>
        </div>

        <div className="w-full h-1" style={{ background: '#c9922a' }} />
        <div className="w-full h-3 bg-gray-900" />
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 2: NATAL CHARTS (D1 & D9)
      ══════════════════════════════════════════════ */}
      <div className={`${PAGE} page-break`} style={{ fontFamily: "'Georgia', serif" }}>
        {renderHeader(isTa ? 'கட்ட ஜாதகம்' : 'Natal Charts', 2)}

        <div className="flex-grow px-10 py-6 flex flex-col justify-around">
          {/* Charts side by side */}
          <div className="grid grid-cols-2 gap-8 justify-items-center">
            <div className="flex flex-col items-center gap-2 w-full max-w-[280px]">
              <RasiChart
                chart={data.rasi_chart}
                planets={data.planets}
                title={isTa ? 'ராசி கட்டம் (D1)' : 'Rasi Chart (D1)'}
                lagnaSign={data.lagna.sign}
                isPrint={true}
                language={language}
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
              <div key={label} className="border border-gray-200 rounded-lg p-3 text-center bg-gray-50">
                <p className="text-[9px] uppercase tracking-wider text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {renderFooter(2)}
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 3: PLANET POSITIONS & PANCHANGAM
      ══════════════════════════════════════════════ */}
      <div className={`${PAGE} page-break`} style={{ fontFamily: "'Georgia', serif" }}>
        {renderHeader(isTa ? 'கிரக நிலைகள் & பஞ்சாங்கம்' : 'Planetary Positions & Panchangam', 3)}

        <div className="flex-grow px-10 py-6 flex flex-col justify-around gap-6">
          {/* Planetary positions table */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              {isTa ? 'கிரக அமைப்புகள்' : 'Planetary Degrees'}
            </h4>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white text-left text-[9px] uppercase tracking-wider">
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
                  <tr key={idx} className={`border-b border-gray-200 ${planet.planet === 'Lagna' ? 'bg-amber-50 font-bold' : idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-1.5 px-3 font-bold text-gray-900">{P[planet.planet] || planet.planet}</td>
                    <td className="py-1.5 px-3 text-gray-800">{S[planet.sign] || planet.sign}</td>
                    <td className="py-1.5 px-3 text-center font-mono text-gray-700">{planet.sign_degree.toFixed(2)}°</td>
                    <td className="py-1.5 px-3 text-center font-bold" style={{ color: '#c9922a' }}>{planet.house}</td>
                    <td className="py-1.5 px-3 text-gray-700">{N[planet.nakshatra] || planet.nakshatra}</td>
                    <td className="py-1.5 px-3 text-center text-gray-600">{planet.pada || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Panchangam details box */}
          {data.panchangam && (
            <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                {isTa ? 'பிறப்பு பஞ்சாங்கம்' : 'Birth Panchangam'}
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1 border-r border-gray-200">
                  <span className="text-[9px] uppercase tracking-wider text-gray-500">{isTa ? 'திதி' : 'Tithi'}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {isTa ? data.panchangam.tithi.name_ta : data.panchangam.tithi.name}
                  </span>
                </div>
                <div className="flex flex-col gap-1 border-r border-gray-200">
                  <span className="text-[9px] uppercase tracking-wider text-gray-500">{isTa ? 'யோகம்' : 'Yoga'}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {isTa ? data.panchangam.yoga.name_ta : data.panchangam.yoga.name}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-wider text-gray-500">{isTa ? 'கரணம்' : 'Karana'}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {isTa ? data.panchangam.karana.name_ta : data.panchangam.karana.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {renderFooter(3)}
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 4: DIVISIONAL CHARTS PART 1 (D2-D16)
      ══════════════════════════════════════════════ */}
      <div className={`${PAGE} page-break`} style={{ fontFamily: "'Georgia', serif" }}>
        {renderHeader(isTa ? 'வர்க்கக் சக்கரங்கள் (பகுதி 1)' : 'Divisional Charts (Part 1)', 4)}

        <div className="flex-grow px-10 py-4 flex flex-col justify-around">
          {data.divisional_charts ? (
            <div className="grid grid-cols-2 gap-x-16 gap-y-1.5 justify-items-center justify-center">
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
                      titleClassName="text-[10px] font-bold mb-1 text-center text-gray-900 leading-tight min-h-[28px] flex items-center justify-center"
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              {isTa ? 'வர்க்கக் சக்கரங்கள் இல்லை' : 'Divisional charts not computed'}
            </p>
          )}
        </div>

        {renderFooter(4)}
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 5: DIVISIONAL CHARTS PART 2 (D20-D60)
      ══════════════════════════════════════════════ */}
      <div className={`${PAGE} page-break`} style={{ fontFamily: "'Georgia', serif" }}>
        {renderHeader(isTa ? 'வர்க்கக் சக்கரங்கள் (பகுதி 2)' : 'Divisional Charts (Part 2)', 5)}

        <div className="flex-grow px-10 py-4 flex flex-col justify-around">
          {data.divisional_charts ? (
            <div className="grid grid-cols-2 gap-x-16 gap-y-1.5 justify-items-center justify-center">
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
                      titleClassName="text-[10px] font-bold mb-1 text-center text-gray-900 leading-tight min-h-[28px] flex items-center justify-center"
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">
              {isTa ? 'வர்க்கக் சக்கரங்கள் இல்லை' : 'Divisional charts not computed'}
            </p>
          )}
        </div>

        {renderFooter(5)}
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 6: DOSHA ANALYSIS
      ══════════════════════════════════════════════ */}
      <div className={`${PAGE} page-break`} style={{ fontFamily: "'Georgia', serif" }}>
        {renderHeader(isTa ? 'ஜாதக தோஷ ஆய்வுகள்' : 'Dosha Analysis', 6)}

        <div className="flex-grow px-10 py-6 flex flex-col justify-around gap-6">
          {data.dosha_analysis ? (
            <>
              {/* Sevvai Dosham Card */}
              <div className="border border-gray-300 rounded-xl p-5 bg-gray-50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-gray-900">
                    {isTa ? 'செவ்வாய் தோஷ விவரம் (Sevvai Dosham / Manglik)' : 'Mars Dosha Analysis (Sevvai Dosham)'}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                    data.dosha_analysis.sevvai_dosham.severity === 'None'
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : data.dosha_analysis.sevvai_dosham.severity === 'Low'
                      ? 'bg-amber-100 text-amber-700 border-amber-300'
                      : 'bg-red-100 text-red-700 border-red-300'
                  }`}>
                    {data.dosha_analysis.sevvai_dosham.severity === 'None' ? (isTa ? 'தோஷம் இல்லை' : 'No Dosha') : (isTa ? 'தோஷம் உள்ளது' : 'Dosha Present')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-sans">
                  {isTa ? data.dosha_analysis.sevvai_dosham.description_ta : data.dosha_analysis.sevvai_dosham.description_en}
                </p>
                {data.dosha_analysis.sevvai_dosham.has_dosha && (
                  <div className="mt-2 text-xs">
                    <span className="font-bold text-gray-800">{isTa ? 'பரிந்துரைக்கப்பட்ட பரிகாரங்கள்:' : 'Suggested Remedies:'}</span>
                    <ul className="list-disc list-inside mt-1.5 text-gray-600 space-y-1 font-sans">
                      {(isTa ? data.dosha_analysis.sevvai_dosham.remedies_ta : data.dosha_analysis.sevvai_dosham.remedies_en).map((rem, idx) => (
                        <li key={idx}>{rem}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Rahu Ketu Dosham Card */}
              <div className="border border-gray-300 rounded-xl p-5 bg-gray-50 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-gray-900">
                    {isTa ? 'ராகு கேது சர்ப்ப தோஷம் (Rahu-Ketu / Sarpa Dosha)' : 'Rahu-Ketu Dosha Analysis (Sarpa Dosha)'}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                    data.dosha_analysis.rahu_ketu_dosham.severity === 'None'
                      ? 'bg-green-100 text-green-700 border-green-300'
                      : 'bg-red-100 text-red-700 border-red-300'
                  }`}>
                    {data.dosha_analysis.rahu_ketu_dosham.severity === 'None' ? (isTa ? 'தோஷம் இல்லை' : 'No Dosha') : (isTa ? 'தோஷம் உள்ளது' : 'Dosha Present')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-sans">
                  {isTa ? data.dosha_analysis.rahu_ketu_dosham.description_ta : data.dosha_analysis.rahu_ketu_dosham.description_en}
                </p>
                {data.dosha_analysis.rahu_ketu_dosham.has_dosha && (
                  <div className="mt-2 text-xs">
                    <span className="font-bold text-gray-800">{isTa ? 'பரிந்துரைக்கப்பட்ட பரிகாரங்கள்:' : 'Suggested Remedies:'}</span>
                    <ul className="list-disc list-inside mt-1.5 text-gray-600 space-y-1 font-sans">
                      {(isTa ? data.dosha_analysis.rahu_ketu_dosham.remedies_ta : data.dosha_analysis.rahu_ketu_dosham.remedies_en).map((rem, idx) => (
                        <li key={idx}>{rem}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-center text-sm text-gray-500">
              {isTa ? 'தோஷ விவரங்கள் இல்லை' : 'Dosha analysis data not available'}
            </p>
          )}
        </div>

        {renderFooter(6)}
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 7: DASHA-BHUKTI TIMELINES
      ══════════════════════════════════════════════ */}
      <div className={`${PAGE} page-break`} style={{ fontFamily: "'Georgia', serif" }}>
        {renderHeader(isTa ? 'விம்சோத்தரி தசா கால அட்டவணை' : 'Dasa-Bhukti Timelines', 7)}

        <div className="flex-grow px-10 py-6 flex flex-col justify-around gap-6">
          {/* Main Mahadasha Timeline */}
          {dasa && (
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                {isTa ? 'மகா தசா காலங்கள் (Mahadasha Cycles)' : 'Mahadasha Timeline'}
              </h4>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-[9px] uppercase tracking-wider text-gray-600 border-y border-gray-300">
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
                      <tr key={i} className={`border-b border-gray-200 ${isActive ? 'bg-amber-50 font-bold' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-1.5 px-3 font-bold text-gray-900">{P[d.dasha_lord] || d.dasha_lord}</td>
                        <td className="py-1.5 px-3 text-gray-700 font-mono">{formatDate(d.start_date)}</td>
                        <td className="py-1.5 px-3 text-gray-700 font-mono">{formatDate(d.end_date)}</td>
                        <td className="py-1.5 px-3">
                          {isActive && (
                            <span className="text-[8px] bg-green-100 text-green-700 border border-green-300 px-1.5 py-0.5 rounded font-bold uppercase font-sans">
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
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                {isTa ? `${P[dasa.current.dasha] || dasa.current.dasha} தசையில் உள்ள புத்தி காலங்கள்` : `Bhukti Timeline for ${dasa.current.dasha} Dasa`}
              </h4>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-[9px] uppercase tracking-wider text-gray-600 border-y border-gray-300">
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
                      <tr key={i} className={`border-b border-gray-200 ${isActive ? 'bg-green-50 font-bold' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="py-1.5 px-3 font-bold text-gray-900">
                          {P[dasa.current.dasha] || dasa.current.dasha} - {P[b.dasha_lord] || b.dasha_lord}
                        </td>
                        <td className="py-1.5 px-3 text-gray-700 font-mono">{formatDate(b.start_date)}</td>
                        <td className="py-1.5 px-3 text-gray-700 font-mono">{formatDate(b.end_date)}</td>
                        <td className="py-1.5 px-3">
                          {isActive && (
                            <span className="text-[8px] bg-green-100 text-green-700 border border-green-300 px-1.5 py-0.5 rounded font-bold uppercase font-sans">
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
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 8: PREDICTIONS & DASHA INTERPRETATION
      ══════════════════════════════════════════════ */}
      <div className={`${PAGE} page-break`} style={{ fontFamily: "'Georgia', serif" }}>
        {renderHeader(isTa ? 'ஜாதக பலன்கள் & தசா பலன்கள்' : 'General & Dasa Predictions', 8)}

        <div className="flex-grow px-10 py-4 flex flex-col justify-around gap-4 overflow-hidden">
          {/* General Predictions summaries */}
          <div className="flex flex-col gap-3">
            {[
              { label: isTa ? 'லக்ன பலன்' : 'Lagna Prediction', text: isTa ? data.predictions.lagna.description_ta : data.predictions.lagna.description_en },
              { label: isTa ? 'இராசி பலன்' : 'Rasi Prediction', text: isTa ? data.predictions.rasi.description_ta : data.predictions.rasi.description_en }
            ].map(({ label, text }, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                <h5 className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">{label}</h5>
                <p className="text-xs text-gray-700 leading-relaxed font-sans line-clamp-3">{text}</p>
              </div>
            ))}
          </div>

          {/* Dasha Predictions */}
          {data.dasha_prediction && (
            <div className="border border-gray-300 rounded-xl p-4 bg-amber-50/50 flex flex-col gap-2">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                {isTa ? 'தற்போதைய தசை-புத்தி பலன்கள்' : 'Current Dasa-Bhukti Interpretations'}
              </h4>
              <div className="text-xs text-gray-800 leading-relaxed font-sans space-y-2">
                <div>
                  <strong className="text-gray-900 block mb-0.5">
                    {isTa ? `${data.dasha_prediction.mahadasha_lord} தசை பலன்கள்:` : `${data.dasha_prediction.mahadasha_lord} Dasa Results:`}
                  </strong>
                  <p className="text-gray-700">
                    {isTa ? data.dasha_prediction.mahadasha_prediction_ta : data.dasha_prediction.mahadasha_prediction_en}
                  </p>
                </div>
                <div>
                  <strong className="text-gray-900 block mb-0.5">
                    {isTa ? `${data.dasha_prediction.bhukti_lord} புத்தி பலன்கள்:` : `${data.dasha_prediction.bhukti_lord} Bhukti Results:`}
                  </strong>
                  <p className="text-gray-700">
                    {isTa ? data.dasha_prediction.bhukti_prediction_ta : data.dasha_prediction.bhukti_prediction_en}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer note */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-[9px] text-gray-400 text-center leading-relaxed font-sans">
              {isTa
                ? 'இந்த ஜாதக அறிக்கை JothiSoft மூலம் கணித முறைப்படி தயாரிக்கப்பட்டது. இது ஒரு வழிகாட்டியே தவிர இறுதி முடிவல்ல.'
                : 'This computer-generated report is based on mathematical coordinates. Astrological advice is for guidance and spiritual reference only.'}
            </p>
          </div>
        </div>

        {renderFooter(8)}
      </div>
    </>
  )
}
