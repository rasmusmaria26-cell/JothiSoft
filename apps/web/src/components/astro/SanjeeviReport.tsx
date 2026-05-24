import React from 'react'
import { HoroscopeResponse } from '@/types/astro'
import { RasiChart } from '@/components/astro/RasiChart'
import { Feather } from 'lucide-react'

interface SanjeeviReportProps {
  data: HoroscopeResponse
  profile: {
    name: string
    fatherName?: string
    motherName?: string
    dob: string
    tob: string
    place: string
    tithi?: string
    yoga?: string
    karana?: string
  }
  language: 'ta' | 'en'
}

const PLANET_MAP_TA: Record<string, string> = {
  'Lagna': 'லக்னம்', 'Sun': 'சூரியன்', 'Moon': 'சந்திரன்', 'Mars': 'செவ்வாய்',
  'Mercury': 'புதன்', 'Jupiter': 'குரு', 'Venus': 'சுக்கிரன்', 'Saturn': 'சனி',
  'Rahu': 'ராகு', 'Ketu': 'கேது'
}

const PLANET_MAP_EN: Record<string, string> = {
  'Lagna': 'Ascendant', 'Sun': 'Sun', 'Moon': 'Moon', 'Mars': 'Mars',
  'Mercury': 'Mercury', 'Jupiter': 'Jupiter', 'Venus': 'Venus', 'Saturn': 'Saturn',
  'Rahu': 'Rahu', 'Ketu': 'Ketu'
}

const SIGN_MAP_TA: Record<string, string> = {
  'Mesha': 'மேஷம்', 'Vrishabha': 'ரிஷபம்', 'Rishabha': 'ரிஷபம்', 'Mithuna': 'மிதுனம்', 'Kataka': 'கடகம்',
  'Simha': 'சிம்மம்', 'Kanya': 'கன்னி', 'Thula': 'துலாம்', 'Vrischika': 'விருச்சிகம்',
  'Dhanus': 'தனுசு', 'Makara': 'மகரம்', 'Kumbha': 'கும்பம்', 'Meena': 'மீனம்'
}

const SIGN_MAP_EN: Record<string, string> = {
  'Mesha': 'Aries (Mesha)', 'Vrishabha': 'Taurus (Vrishabha)', 'Rishabha': 'Taurus (Rishabha)', 'Mithuna': 'Gemini (Mithuna)', 'Kataka': 'Cancer (Kataka)',
  'Simha': 'Leo (Simha)', 'Kanya': 'Virgo (Kanya)', 'Thula': 'Libra (Thula)', 'Vrischika': 'Scorpio (Vrischika)',
  'Dhanus': 'Sagittarius (Dhanus)', 'Makara': 'Capricorn (Makara)', 'Kumbha': 'Aquarius (Kumbha)', 'Meena': 'Pisces (Meena)'
}

const NAKSHATRA_MAP_TA: Record<string, string> = {
  'Ashwini': 'அஸ்வினி', 'Bharani': 'பரணி', 'Krittika': 'கார்த்திகை', 'Rohini': 'ரோகிணி', 'Mrigashira': 'மிருகசீரிடம்',
  'Ardra': 'திருவாதிரை', 'Punarvasu': 'புனர்பூசம்', 'Pushya': 'பூசம்', 'Ashlesha': 'ஆயில்யம்', 'Magha': 'மகம்',
  'Purva Phalguni': 'பூரம்', 'Uttara Phalguni': 'உத்திரம்', 'Hasta': 'அஸ்தம்', 'Chitra': 'சித்திரை', 'Swati': 'சுவாதி',
  'Vishakha': 'விசாகம்', 'Anuradha': 'அனுஷம்', 'Jyeshtha': 'கேட்டை', 'Mula': 'மூலம்', 'Purva Ashadha': 'பூராடம்',
  'Uttara Ashadha': 'உத்திராடம்', 'Shravana': 'திருவோணம்', 'Dhanishta': 'அவிட்டம்', 'Shatabhisha': 'சதயம்',
  'Purva Bhadrapada': 'பூரட்டாதி', 'Uttara Bhadrapada': 'உத்திரட்டாதி', 'Revati': 'ரேவதி'
}

export function SanjeeviReport({ data, profile, language }: SanjeeviReportProps) {
  const moonNakshatra = data.planets.find(p => p.planet === 'Moon')?.nakshatra || 'Unknown'
  const moonPada = data.planets.find(p => p.planet === 'Moon')?.pada || 1
  const moonSign = data.planets.find(p => p.planet === 'Moon')?.sign || 'Unknown'
  
  const isTa = language === 'ta'
  const P_MAP = isTa ? PLANET_MAP_TA : PLANET_MAP_EN
  const S_MAP = isTa ? SIGN_MAP_TA : SIGN_MAP_EN
  const N_MAP = isTa ? NAKSHATRA_MAP_TA : {}

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 8mm 10mm; size: A4; }
          /* Hide everything else on the page to prevent dashboard/parent padding gaps */
          body * {
            visibility: hidden;
          }
          #sanjeevi-print-report,
          #sanjeevi-print-report * {
            visibility: visible;
          }
          /* Pin directly to the top-left of the page to eliminate any wrapper spacing */
          #sanjeevi-print-report {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
            margin: 0 !important; 
            padding: 0 !important; 
          }
        }
      `}</style>
      <div id="sanjeevi-print-report" className="w-full bg-white text-black p-4 md:p-6 font-playfair relative print:p-0 print:m-0 shadow-2xl print:shadow-none max-w-[210mm] mx-auto border border-gray-200 print:border-none">
        
        {/* Centered Watermark - High-End Aesthetic, Guaranteed 1 Page */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none flex flex-col items-center select-none z-0">
          <Feather size={160} className="text-gray-900" />
          <span className="text-5xl font-bold font-mono tracking-widest mt-3 text-gray-900">JOTHISOFT</span>
        </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-900 pb-1.5 mb-2">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight uppercase text-gray-900">{isTa ? 'சஞ்சீவி ஜாதகம்' : 'Sanjeevi Report'}</h1>
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-widest font-mono">{isTa ? 'துல்லியமான வேத ஜாதகம்' : 'Detailed Vedic Horoscope'}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <h2 className="text-xl font-extrabold text-gold-deep">JOTHI<span className="text-gray-900">SOFT</span></h2>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{isTa ? 'டிஜிட்டல் அறிக்கை' : 'Generated digitally'}</p>
          </div>
        </div>

        {/* Basic Details Table */}
        <table className="w-full border-collapse mb-2 text-[13px]">
          <tbody>
            <tr>
              <td className="border border-gray-300 py-0.5 px-2.5 w-1/2 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'பெயர்' : 'Name'}:</span> {profile.name}
              </td>
              <td className="border border-gray-300 py-0.5 px-2.5 w-1/2 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'ராசி' : 'Rasi'}:</span> {S_MAP[moonSign] || moonSign}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-0.5 px-2.5 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'தந்தை பெயர்' : "Father's Name"}:</span> {profile.fatherName || '—'}
              </td>
              <td className="border border-gray-300 py-0.5 px-2.5 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}:</span> {N_MAP[moonNakshatra] || moonNakshatra} ({moonPada})
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-0.5 px-2.5 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'தாய் பெயர்' : "Mother's Name"}:</span> {profile.motherName || '—'}
              </td>
              <td className="border border-gray-300 py-0.5 px-2.5 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'லக்னம்' : 'Lagna'}:</span> {S_MAP[data.lagna.sign] || data.lagna.sign}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-0.5 px-2.5 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'பிறந்த தேதி' : 'Date of Birth'}:</span> {profile.dob}
              </td>
              <td className="border border-gray-300 py-0.5 px-2.5 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'திதி' : 'Tithi'}:</span> {profile.tithi || '—'}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-0.5 px-2.5 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'பிறந்த நேரம்' : 'Time of Birth'}:</span> {profile.tob}
              </td>
              <td className="border border-gray-300 py-0.5 px-2.5 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'யோகம்' : 'Yoga'}:</span> {profile.yoga || '—'}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 py-0.5 px-2.5 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'பிறந்த இடம்' : 'Birth Place'}:</span> {profile.place}
              </td>
              <td className="border border-gray-300 py-0.5 px-2.5 align-top">
                <span className="font-bold text-gray-900">{isTa ? 'கரணம்' : 'Karana'}:</span> {profile.karana || '—'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Dasha Balance at Birth & Current Running Dasha Boxes */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Left box — ஜனன கால திசா இருப்பு */}
          <div className="border border-gray-300 rounded-lg bg-gray-50 py-1.5 px-2.5 flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
              {isTa ? 'ஜனன கால திசா இருப்பு' : 'Dasha Balance at Birth'}
            </span>
            <span className="text-xs font-bold text-gray-900">
              {data.dasha_balance
                ? `${data.dasha_balance.years} ${isTa ? 'வருடம்' : 'Yrs'}, ${data.dasha_balance.months} ${isTa ? 'மாதம்' : 'Mos'}, ${data.dasha_balance.days} ${isTa ? 'நாள்' : 'Days'}`
                : '—'}
            </span>
            <span className="text-[11px] text-gray-700">
              <span className="font-bold">{isTa ? 'ஜனன கால திசா' : 'Birth Dasha'}:</span>{' '}
              {data.dasha_balance
                ? (P_MAP[data.dasha_balance.lord] || data.dasha_balance.lord)
                : '—'}
            </span>
            <span className="text-[11px] text-gray-700 font-mono">
              <span className="font-bold font-sans">{isTa ? 'லக்ன புள்ளி' : 'Lagna Point'}:</span>{' '}
              {data.dasha_balance ? `${data.dasha_balance.lagna_degree.toFixed(2)}°` : '—'}
            </span>
          </div>

          {/* Right box — நடப்பு தசா / புக்தி */}
          <div className="border border-gray-300 border-l-4 border-l-gray-900 rounded-lg bg-gray-50 py-1.5 px-2.5 flex flex-col gap-0.5">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold">
              {isTa ? 'நடப்பு தசா / புக்தி' : 'Current Dasha / Bhukti'}
            </span>
            <span className="text-xs font-bold text-gray-900">
              {data.current_dasha
                ? `${P_MAP[data.current_dasha.mahadasha] || data.current_dasha.mahadasha} ${isTa ? 'தசா' : 'Dasha'} / ${P_MAP[data.current_dasha.antardasha] || data.current_dasha.antardasha} ${isTa ? 'புக்தி' : 'Bhukti'}`
                : '—'}
            </span>
            <span className="text-[11px] text-gray-700">
              <span className="font-bold">{isTa ? 'புக்தி முடிவு தேதி' : 'Bhukti Ends'}:</span>{' '}
              <span className="font-mono">
                {data.current_dasha?.antardasha_end || '—'}
              </span>
            </span>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-2 mb-1.5 print:mb-1">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[215px] print:max-w-[190px]">
              <RasiChart
                chart={data.rasi_chart}
                planets={data.planets}
                title={isTa ? "ராசி (D1)" : "Rasi (D1)"}
                lagnaSign={data.lagna.sign}
                isPrint={true}
                language={language}
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[215px] print:max-w-[190px]">
              <RasiChart
                chart={data.navamsam_chart}
                planets={data.planets}
                title={isTa ? "நவாம்சம் (D9)" : "Navamsam (D9)"}
                lagnaSign={data.lagna.sign}
                isPrint={true}
                language={language}
              />
            </div>
          </div>
        </div>

        {/* Planetary Positions Table */}
        <div className="w-full">
          <h3 className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-1 border-b border-gray-300 pb-0.5">
            {isTa ? 'கிரக நிலைகள்' : 'Planetary Positions'}
          </h3>
          <table className="w-full text-[11px] print:text-[10.5px] border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left border-y border-gray-300 text-[9px] uppercase tracking-wider text-gray-700">
                <th className="py-0.5 px-2 print:py-[2px]">{isTa ? 'கிரகம்' : 'Planet'}</th>
                <th className="py-0.5 px-2 print:py-[2px]">{isTa ? 'ராசி' : 'Zodiac Sign'}</th>
                <th className="py-0.5 px-2 print:py-[2px] text-center">{isTa ? 'பாகை' : 'Degree'}</th>
                <th className="py-0.5 px-2 print:py-[2px] text-center">{isTa ? 'வீடு' : 'House'}</th>
                <th className="py-0.5 px-2 print:py-[2px] text-right">{isTa ? 'நட்சத்திரம்' : 'Star (Pada)'}</th>
              </tr>
            </thead>
            <tbody>
              {data.planets.map((planet, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-0.5 px-2 print:py-[2px] font-bold text-gray-900">
                    {P_MAP[planet.planet] || planet.planet}
                  </td>
                  <td className="py-0.5 px-2 print:py-[2px] text-gray-800">
                    {S_MAP[planet.sign] || planet.sign}
                  </td>
                  <td className="py-0.5 px-2 print:py-[2px] text-center font-mono text-gray-700">
                    {planet.sign_degree.toFixed(2)}°
                  </td>
                  <td className="py-0.5 px-2 print:py-[2px] text-center text-gray-800 font-bold">
                    {planet.house}
                  </td>
                  <td className="py-0.5 px-2 print:py-[2px] text-right text-gray-700">
                    {N_MAP[planet.nakshatra] || planet.nakshatra} {planet.pada ? `(${planet.pada})` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
    </>
  )
}
