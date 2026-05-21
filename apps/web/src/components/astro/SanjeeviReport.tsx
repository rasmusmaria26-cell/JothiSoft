import React from 'react'
import { HoroscopeResponse } from '@/types/astro'
import { RasiChart } from '@/components/astro/RasiChart'
import { Hash, MapPin, Calendar, Clock, Feather } from 'lucide-react'

interface SanjeeviReportProps {
  data: HoroscopeResponse
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
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; }
        }
      `}</style>
      <div className="w-full h-[296mm] bg-white text-black p-6 md:p-8 font-playfair relative print:p-6 print:m-0 overflow-hidden shadow-2xl print:shadow-none max-w-[210mm] mx-auto border border-gray-200 print:border-none">
        
        {/* Watermark */}
      <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none flex flex-col items-start select-none z-0">
        <Feather size={120} className="text-gray-900" />
        <span className="text-4xl font-bold font-mono tracking-widest mt-2 text-gray-900">JOTHISOFT</span>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-gray-900 pb-3 mb-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight uppercase text-gray-900">{isTa ? 'சஞ்சீவி ஜாதகம்' : 'Sanjeevi Report'}</h1>
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-widest font-mono">{isTa ? 'துல்லியமான வேத ஜாதகம்' : 'Detailed Vedic Horoscope'}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <h2 className="text-xl font-extrabold text-gold-deep">JOTHI<span className="text-gray-900">SOFT</span></h2>
            <p className="text-[10px] text-gray-500 font-mono mt-0.5">{isTa ? 'டிஜிட்டல் அறிக்கை' : 'Generated digitally'}</p>
          </div>
        </div>

        {/* Basic Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="border border-gray-300 p-3 rounded-lg bg-gray-50 flex items-start gap-3">
            <Hash size={18} className="text-gray-500 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{isTa ? 'பெயர்' : 'Name'}</span>
              <span className="text-base font-bold text-gray-900">{profile.name}</span>
            </div>
          </div>
          <div className="border border-gray-300 p-3 rounded-lg bg-gray-50 flex items-start gap-3">
            <Calendar size={18} className="text-gray-500 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{isTa ? 'தேதி & நேரம்' : 'Date & Time'}</span>
              <span className="text-base font-bold text-gray-900 font-mono">{profile.dob} • {profile.tob}</span>
            </div>
          </div>
          <div className="border border-gray-300 p-3 rounded-lg bg-gray-50 flex items-start gap-3">
            <MapPin size={18} className="text-gray-500 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{isTa ? 'பிறந்த இடம்' : 'Birth Place'}</span>
              <span className="text-base font-bold text-gray-900">{profile.place}</span>
            </div>
          </div>
          <div className="border border-gray-300 p-3 rounded-lg bg-gray-50 flex flex-col justify-center">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">{isTa ? 'ராசி' : 'Rasi'}</span>
            </div>
            <div className="flex justify-between items-center font-bold text-gray-900 text-sm">
              <span>{N_MAP[moonNakshatra] || moonNakshatra} ({moonPada})</span>
              <span>{S_MAP[moonSign] || moonSign}</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[280px]">
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
            <div className="w-full max-w-[280px]">
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
          <h3 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-2 border-b border-gray-300 pb-1">
            {isTa ? 'கிரக நிலைகள்' : 'Planetary Positions'}
          </h3>
          <table className="w-full text-[13px] border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left border-y border-gray-300 text-[10px] uppercase tracking-wider text-gray-700">
                <th className="py-1 px-2">{isTa ? 'கிரகம்' : 'Planet'}</th>
                <th className="py-1 px-2">{isTa ? 'ராசி' : 'Zodiac Sign'}</th>
                <th className="py-1 px-2 text-center">{isTa ? 'பாகை' : 'Degree'}</th>
                <th className="py-1 px-2 text-center">{isTa ? 'வீடு' : 'House'}</th>
                <th className="py-1 px-2 text-right">{isTa ? 'நட்சத்திரம்' : 'Star (Pada)'}</th>
              </tr>
            </thead>
            <tbody>
              {data.planets.map((planet, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-1 px-2 font-bold text-gray-900">
                    {P_MAP[planet.planet] || planet.planet}
                  </td>
                  <td className="py-1 px-2 text-gray-800">
                    {S_MAP[planet.sign] || planet.sign}
                  </td>
                  <td className="py-1 px-2 text-center font-mono text-gray-700">
                    {planet.sign_degree.toFixed(2)}°
                  </td>
                  <td className="py-1 px-2 text-center text-gray-800 font-bold">
                    {planet.house}
                  </td>
                  <td className="py-1 px-2 text-right text-gray-700">
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
