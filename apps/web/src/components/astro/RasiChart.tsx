'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { HoroscopeChart, PlanetData } from '@/types/astro'

interface RasiChartProps {
  chart: HoroscopeChart
  planets: PlanetData[]
  title: string // e.g. "ராசி / Rasi (D1)" or "நவாம்சம் / Navamsam (D9)"
  lagnaSign: string
  isPrint?: boolean
  language?: 'ta' | 'en'
  titleClassName?: string
}

const ZODIAC_SIGNS = [
  'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
  'Simha', 'Kanya', 'Thula', 'Vrischika',
  'Dhanus', 'Makara', 'Kumbha', 'Meena'
]

const SIGN_MAP_TA: Record<string, string> = {
  'Mesha': 'மேஷம்', 'Vrishabha': 'ரிஷபம்', 'Mithuna': 'மிதுனம்', 'Kataka': 'கடகம்',
  'Simha': 'சிம்மம்', 'Kanya': 'கன்னி', 'Thula': 'துலாம்', 'Vrischika': 'விருச்சிகம்',
  'Dhanus': 'தனுசு', 'Makara': 'மகரம்', 'Kumbha': 'கும்பம்', 'Meena': 'மீனம்'
}

const PLANET_MAP_TA: Record<string, string> = {
  'Lagna': 'ல',
  'Sun': 'சூ',
  'Moon': 'சந்',
  'Mars': 'செ',
  'Mercury': 'பு',
  'Jupiter': 'கு',
  'Venus': 'சுக்',
  'Saturn': 'சனி',
  'Rahu': 'ரா',
  'Ketu': 'கே'
}

const PLANET_MAP_EN: Record<string, string> = {
  'Lagna': 'Asc',
  'Sun': 'Su',
  'Moon': 'Mo',
  'Mars': 'Ma',
  'Mercury': 'Me',
  'Jupiter': 'Ju',
  'Venus': 'Ve',
  'Saturn': 'Sa',
  'Rahu': 'Ra',
  'Ketu': 'Ke'
}

// 4x4 Grid layout mapping. Inner 4 cells are row 1-2, col 1-2 (0-indexed).
// Grid position coordinates mapping to Zodiac Sign (Meena starts top-left, clockwise)
const GRID_CELLS = [
  { index: 0, sign: 'Meena', gridClass: 'col-start-1 row-start-1' },
  { index: 1, sign: 'Mesha', gridClass: 'col-start-2 row-start-1' },
  { index: 2, sign: 'Vrishabha', gridClass: 'col-start-3 row-start-1' },
  { index: 3, sign: 'Mithuna', gridClass: 'col-start-4 row-start-1' },
  { index: 7, sign: 'Kataka', gridClass: 'col-start-4 row-start-2' },
  { index: 11, sign: 'Simha', gridClass: 'col-start-4 row-start-3' },
  { index: 15, sign: 'Kanya', gridClass: 'col-start-4 row-start-4' },
  { index: 14, sign: 'Thula', gridClass: 'col-start-3 row-start-4' },
  { index: 13, sign: 'Vrischika', gridClass: 'col-start-2 row-start-4' },
  { index: 12, sign: 'Dhanus', gridClass: 'col-start-1 row-start-4' },
  { index: 8, sign: 'Makara', gridClass: 'col-start-1 row-start-3' },
  { index: 4, sign: 'Kumbha', gridClass: 'col-start-1 row-start-2' },
]

export function RasiChart({ chart, planets, title, lagnaSign, isPrint = false, language: propLanguage, titleClassName }: RasiChartProps) {
  const { language: contextLanguage } = useLanguage()
  const language = propLanguage || contextLanguage
  const lagnaIndex = ZODIAC_SIGNS.indexOf(lagnaSign)

  // Find planets residing in a specific zodiac sign
  const getPlanetsInSign = (sign: string): { name: string; isLagna: boolean; fullData?: PlanetData }[] => {
    const signIndex = ZODIAC_SIGNS.indexOf(sign)
    // House index is 1-based relative to Lagna
    const houseIndex = ((signIndex - lagnaIndex + 12) % 12) + 1
    const houseKey = `house_${houseIndex}`
    const residingPlanetNames = chart[houseKey] || []

    return residingPlanetNames.map((pName) => {
      const isLagna = pName.toLowerCase() === 'lagna'
      const fullData = planets.find((p) => p.planet.toLowerCase() === pName.toLowerCase())
      return { name: pName, isLagna, fullData }
    })
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[440px] mx-auto p-1">
      {/* Chart Title */}
      <h3 className={titleClassName || `text-sm font-semibold mb-3 tracking-wider uppercase ${isPrint ? 'text-gray-900' : 'text-gold-deep dark:text-gold-bright'}`}>
        {title}
      </h3>

      {/* Grid Container */}
      <div 
        className={`grid w-full aspect-square border rounded-lg relative ${isPrint ? 'bg-transparent border-gray-400' : ''}`}
        style={{
          display: 'grid',
          gridTemplateColumns: '25% 25% 25% 25%',
          gridTemplateRows: '25% 25% 25% 25%',
          aspectRatio: '1 / 1',
          ...(!isPrint ? {
            background: 'var(--bg-elevated)',
            borderColor: 'var(--bg-border)',
          } : {})
        }}
      >
        {/* Merged Center Area (Row 2-3, Col 2-3) */}
        <div 
          className={`col-start-2 col-span-2 row-start-2 row-span-2 flex flex-col justify-center items-center text-center z-10 border border-dashed ${isPrint ? 'bg-transparent border-gray-400 p-1' : 'p-2'}`}
          style={!isPrint ? {
            background: 'var(--bg-card)',
            borderColor: 'var(--bg-border)',
          } : {}}
        >
          <span className={`text-[10px] tracking-widest uppercase ${isPrint ? 'text-gray-600' : 'text-text-muted'}`}>
            {language === 'ta' ? 'லக்னம்' : 'Ascendant'}
          </span>
          <span className={`text-xs font-bold mt-0.5 ${isPrint ? 'text-black' : 'text-gold-deep dark:text-gold-bright'}`}>
            {language === 'ta' ? SIGN_MAP_TA[lagnaSign] : lagnaSign}
          </span>
          <span className={`text-[9px] mt-1 leading-tight ${isPrint ? 'text-gray-600' : 'text-text-muted'}`}>
            {planets.find(p => p.planet === 'Lagna')?.sign_degree?.toFixed(2)}°
          </span>
        </div>

        {/* Outer Zodiac Sign Cells */}
        {GRID_CELLS.map((cell) => {
          const signPlanets = getPlanetsInSign(cell.sign)
          const signName = language === 'ta' ? SIGN_MAP_TA[cell.sign] : cell.sign

          const isTopLeft = cell.sign === 'Meena'
          const isTopRight = cell.sign === 'Mithuna'
          const isBottomLeft = cell.sign === 'Dhanus'
          const isBottomRight = cell.sign === 'Kanya'

          return (
            <motion.div
              key={cell.sign}
              className={`
                ${cell.gridClass} flex flex-col relative group cursor-default select-none
                ${isTopLeft ? 'rounded-tl-lg' : ''} ${isTopRight ? 'rounded-tr-lg' : ''}
                ${isBottomLeft ? 'rounded-bl-lg' : ''} ${isBottomRight ? 'rounded-br-lg' : ''}
                ${isPrint ? 'border border-gray-400 bg-transparent p-0.5' : 'border border-bg-border/60 p-1 transition-colors duration-150 hover:bg-[var(--gold-tint)]'}
              `}
              style={!isPrint ? {
                borderColor: 'var(--bg-border)',
              } : {}}
              whileHover={!isPrint ? { scale: 1.01 } : {}}
            >
              {/* Sign label (top-left) */}
              <span className={`text-[8px] sm:text-[9px] font-medium ${isPrint ? 'text-gray-500' : 'text-text-muted'}`}>
                {signName}
              </span>

              {/* Planets Content */}
              <div className={`flex-1 flex flex-wrap items-center justify-center ${isPrint ? 'gap-0.5 p-0' : 'gap-1.5 p-1'}`}>
                {signPlanets.map((planet, idx) => {
                  const abbr = language === 'ta' 
                    ? (PLANET_MAP_TA[planet.name] || planet.name)
                    : (PLANET_MAP_EN[planet.name] || planet.name)

                  return (
                    <span
                      key={`${planet.name}-${idx}`}
                      className={`
                        inline-flex items-center justify-center font-bold rounded
                        ${isPrint 
                          ? 'text-[8.5px] px-1 py-0' 
                          : 'text-[10px] sm:text-[11px] px-1.5 py-0.5'
                        }
                        ${planet.isLagna 
                          ? (isPrint 
                              ? 'border border-gray-600 text-black font-extrabold' 
                              : 'bg-[var(--gold-tint)] border border-[var(--gold-mid)] text-gold-deep dark:text-gold-bright shadow-sm shadow-gold-deep/10'
                            )
                          : (isPrint 
                              ? 'text-gray-900' 
                              : 'bg-bg-page border border-bg-border text-text-primary shadow-sm'
                            )
                        }
                      `}
                    >
                      {abbr}
                    </span>
                  )
                })}
              </div>

              {/* Tooltip on hover for good visibility of planet coordinates */}
              {!isPrint && signPlanets.length > 0 && (
                <div 
                  className="
                    hidden group-hover:block absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 
                    p-2 rounded border shadow-xl w-48 text-[10px] leading-relaxed pointer-events-none
                  "
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--bg-border)',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                  }}
                >
                  <p className="font-semibold text-gold-deep dark:text-gold-bright border-b border-bg-border/40 pb-1 mb-1">
                    {signName} ({language === 'ta' ? 'கோள்கள்' : 'Planets'})
                  </p>
                  {signPlanets.map((p, idx) => (
                    <div key={`${p.name}-${idx}`} className="flex justify-between text-text-secondary">
                      <span className="font-medium text-text-primary">{p.name}</span>
                      <span>
                        {p.fullData?.sign_degree?.toFixed(2)}° · {p.fullData?.nakshatra}
                        {p.fullData?.pada ? ` (${p.fullData.pada})` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
