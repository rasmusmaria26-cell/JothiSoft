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
  }
  language: 'ta' | 'en'
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

// ── Shared page style ─────────────────────────────────────────────────────────
const PAGE = "relative bg-white text-black w-[210mm] min-h-[297mm] mx-auto overflow-hidden print:shadow-none shadow-2xl"
const DIVIDER = "w-full border-t-2 border-gray-900"

export function BookChartReport({ data, dasa, profile, language }: BookChartReportProps) {
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
        {/* Decorative top band */}
        <div className="w-full h-3 bg-gray-900" />

        {/* Gold accent stripe */}
        <div className="w-full h-1" style={{ background: '#c9922a' }} />

        <div className="flex flex-col items-center justify-center h-[255mm] px-12 gap-6 text-center">
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
            <h2 className="text-5xl font-bold text-gray-900 leading-tight">
              {isTa ? 'ஜாதகம்' : 'Jathagam'}
            </h2>
            <p className="text-sm text-gray-500 font-sans">
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
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs tracking-[0.4em] uppercase text-gray-500 font-sans">
              {isTa ? 'பெயர்' : 'Prepared For'}
            </p>
            <p className="text-4xl font-bold text-gray-900 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
              {profile.name}
            </p>
          </div>

          {/* Birth details block */}
          <div className="mt-2 w-full max-w-sm border border-gray-300 rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 text-center divide-x divide-gray-300">
              <div className="p-3 flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider text-gray-500">{isTa ? 'தேதி' : 'Date'}</span>
                <span className="text-sm font-bold text-gray-900 font-mono">{profile.dob}</span>
              </div>
              <div className="p-3 flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider text-gray-500">{isTa ? 'நேரம்' : 'Time'}</span>
                <span className="text-sm font-bold text-gray-900 font-mono">{profile.tob}</span>
              </div>
              <div className="p-3 flex flex-col gap-1">
                <span className="text-[9px] uppercase tracking-wider text-gray-500">{isTa ? 'இடம்' : 'Place'}</span>
                <span className="text-sm font-bold text-gray-900">{profile.place}</span>
              </div>
            </div>
            <div className="border-t border-gray-300 p-3 flex justify-center gap-6 text-xs text-gray-600">
              <span>
                <strong>{isTa ? 'ராசி:' : 'Rasi:'}</strong> {S[moonSign] || moonSign}
              </span>
              <span>
                <strong>{isTa ? 'நட்சத்திரம்:' : 'Star:'}</strong> {N[moonNakshatra] || moonNakshatra} {moonPada ? `(${moonPada})` : ''}
              </span>
              <span>
                <strong>{isTa ? 'லக்னம்:' : 'Lagna:'}</strong> {S[lagnaSign] || lagnaSign}
              </span>
            </div>
          </div>

          {/* Generated on */}
          <p className="text-xs text-gray-400 font-sans mt-auto">
            {isTa ? 'உருவாக்கப்பட்டது:' : 'Generated on:'} {generatedDate}
          </p>
        </div>

        {/* Bottom band */}
        <div className="w-full h-1" style={{ background: '#c9922a' }} />
        <div className="w-full h-3 bg-gray-900" />
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 2: CHARTS
      ══════════════════════════════════════════════ */}
      <div className={`${PAGE} page-break`} style={{ fontFamily: "'Georgia', serif" }}>
        <div className="w-full h-1 bg-gray-900" />
        <div className="px-10 py-8 flex flex-col gap-6 h-full">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{isTa ? 'கட்ட ஜாதகம்' : 'Natal Charts'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{profile.name} · {profile.dob}</p>
            </div>
            <p className="text-sm font-black tracking-widest text-gray-900">
              JOTHI<span style={{ color: '#c9922a' }}>SOFT</span>
            </p>
          </div>
          <div className={DIVIDER} />

          {/* Charts side by side */}
          <div className="grid grid-cols-2 gap-8 justify-items-center">
            <div className="flex flex-col items-center gap-2 w-full max-w-[300px] print:max-w-[260px]">
              <RasiChart
                chart={data.rasi_chart}
                planets={data.planets}
                title={isTa ? 'ராசி கட்டம் (D1)' : 'Rasi Chart (D1)'}
                lagnaSign={data.lagna.sign}
                isPrint={true}
                language={language}
              />
            </div>
            <div className="flex flex-col items-center gap-2 w-full max-w-[300px] print:max-w-[260px]">
              <RasiChart
                chart={data.navamsam_chart}
                planets={data.planets}
                title={isTa ? 'நவாம்சம் கட்டம் (D9)' : 'Navamsam Chart (D9)'}
                lagnaSign={data.lagna.sign}
                isPrint={true}
                language={language}
              />
            </div>
          </div>

          {/* Key highlights below charts */}
          <div className="grid grid-cols-4 gap-3 mt-2">
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
        <div className="absolute bottom-0 w-full h-1 bg-gray-900" />
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 3: PLANETS + DASA
      ══════════════════════════════════════════════ */}
      <div className={`${PAGE} page-break`} style={{ fontFamily: "'Georgia', serif" }}>
        <div className="w-full h-1 bg-gray-900" />
        <div className="px-10 py-8 flex flex-col gap-5">
          {/* Page header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{isTa ? 'கிரக நிலைகள் & தசா' : 'Planets & Dasa'}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{profile.name} · {profile.dob}</p>
            </div>
            <p className="text-sm font-black tracking-widest text-gray-900">
              JOTHI<span style={{ color: '#c9922a' }}>SOFT</span>
            </p>
          </div>
          <div className={DIVIDER} />

          {/* Planetary positions table */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
              {isTa ? 'கிரக நிலைகள்' : 'Planetary Positions'}
            </h4>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white text-left text-[10px] uppercase tracking-wider">
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
                    <td className="py-2 px-3 font-bold text-gray-900">{P[planet.planet] || planet.planet}</td>
                    <td className="py-2 px-3 text-gray-800">{S[planet.sign] || planet.sign}</td>
                    <td className="py-2 px-3 text-center font-mono text-gray-700">{planet.sign_degree.toFixed(2)}°</td>
                    <td className="py-2 px-3 text-center font-bold" style={{ color: '#c9922a' }}>{planet.house}</td>
                    <td className="py-2 px-3 text-gray-700">{N[planet.nakshatra] || planet.nakshatra}</td>
                    <td className="py-2 px-3 text-center text-gray-600">{planet.pada || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dasa timeline table */}
          {dasa && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  {isTa ? 'விம்சோத்தரி தசா காலங்கள்' : 'Vimshottari Dasa Timeline'}
                </h4>
                <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded font-bold">
                  {isTa ? 'நடப்பு:' : 'Active:'} {P[dasa.current.dasha] || dasa.current.dasha} – {P[dasa.current.bhukti] || dasa.current.bhukti}
                </span>
              </div>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left text-[10px] uppercase tracking-wider text-gray-600 border-y border-gray-300">
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
                            <span className="text-[9px] bg-green-100 text-green-700 border border-green-300 px-1.5 py-0.5 rounded font-bold uppercase">
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
        <div className="absolute bottom-0 w-full h-1 bg-gray-900" />
      </div>

      {/* ══════════════════════════════════════════════
          PAGE 4: PREDICTIONS
      ══════════════════════════════════════════════ */}
      {data.predictions && (
        <div className={`${PAGE} page-break`} style={{ fontFamily: "'Georgia', serif" }}>
          <div className="w-full h-1 bg-gray-900" />
          <div className="px-10 py-8 flex flex-col gap-6">
            {/* Page header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{isTa ? 'ஜாதக பலன்கள்' : 'Astrological Predictions'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{profile.name} · {profile.dob}</p>
              </div>
              <p className="text-sm font-black tracking-widest text-gray-900">
                JOTHI<span style={{ color: '#c9922a' }}>SOFT</span>
              </p>
            </div>
            <div className={DIVIDER} />

            {/* Three prediction blocks */}
            {[
              { data: data.predictions.lagna, icon: '☀️' },
              { data: data.predictions.rasi, icon: '🌙' },
              { data: data.predictions.nakshatra, icon: '⭐' },
            ].map(({ data: pred, icon }, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200">
                  <span className="text-xl">{icon}</span>
                  <h4 className="text-sm font-bold text-gray-900">
                    {isTa ? pred.title_ta : pred.title_en}
                  </h4>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {isTa ? pred.description_ta : pred.description_en}
                  </p>
                </div>
              </div>
            ))}

            {/* Footer note */}
            <div className="mt-auto pt-4 border-t border-gray-200">
              <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                {isTa
                  ? 'இந்த ஜாதக அறிக்கை JothiSoft மூலம் கணினி முறையில் தயாரிக்கப்பட்டது. இது தெய்வீக ஞான வழிகாட்டுதலுக்காக மட்டுமே.'
                  : 'This horoscope report was computationally generated by JothiSoft using classical Vedic astrology principles. For guidance purposes only.'}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 w-full h-1 bg-gray-900" />
        </div>
      )}
    </>
  )
}
