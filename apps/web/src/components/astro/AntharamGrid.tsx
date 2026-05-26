'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Layers, Clock, Eye, EyeOff } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { DashaPeriod } from '@/types/astro'
import { PLANET_TRANSLATIONS } from './DashaSelector'

interface AntharamGridProps {
  antharams: DashaPeriod[]
  activeAntharaLord: string
  isCurrentBhukti: boolean
  bhuktiLord: string
}

export function AntharamGrid({
  antharams,
  activeAntharaLord,
  isCurrentBhukti,
  bhuktiLord,
}: AntharamGridProps) {
  const { language } = useLanguage()
  const [showAll, setShowAll] = useState(false)

  // Reset showAll when bhukti changes to avoid confusion
  useEffect(() => {
    setShowAll(false)
  }, [bhuktiLord])

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  const getDurationDays = (start: string, end: string) => {
    try {
      const diffTime = Math.abs(new Date(end).getTime() - new Date(start).getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays
    } catch {
      return 0
    }
  }

  const activeAntharaIndex = antharams.findIndex(
    a => a.dasha_lord.toLowerCase() === activeAntharaLord.toLowerCase()
  )

  const activeAnthara = activeAntharaIndex !== -1 ? antharams[activeAntharaIndex] : null

  // If this is the currently active Bhukti and we are hiding other antharams:
  const shouldFilter = isCurrentBhukti && !showAll && activeAnthara

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="px-1 flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-xs uppercase tracking-wider font-bold text-gold-bright">
            {language === 'ta' ? 'அந்தர காலங்கள் (மூன்றாம் நிலை)' : 'Antharam Periods (Level 3)'}
          </h3>
          <p className="text-[10px] text-text-muted">
            {PLANET_TRANSLATIONS[bhuktiLord]?.[language] || bhuktiLord} {language === 'ta' ? 'புக்தியின் கீழ் அந்தர நாதர்கள்' : `sub-sub lords under ${bhuktiLord} Bhukti`}
          </p>
        </div>

        {isCurrentBhukti && activeAnthara && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1.5 text-xs text-gold-bright hover:text-white border border-gold-mid/30 hover:border-gold-bright px-3 py-1.5 rounded-lg bg-gold-mid/5 transition-all duration-200"
          >
            {showAll ? <EyeOff size={13} /> : <Eye size={13} />}
            <span>
              {showAll 
                ? (language === 'ta' ? 'நடப்பு மட்டும் காட்டு' : 'Show Active Only') 
                : (language === 'ta' ? 'அனைத்து அந்தரங்களையும் காட்டு' : 'Show All Antarams')}
            </span>
          </button>
        )}
      </div>

      {shouldFilter ? (
        /* Focused Active Antharam view */
        <div 
          className="p-5 rounded-2xl border transition-all duration-300 max-w-lg"
          style={{
            background: 'var(--bg-active)',
            borderColor: 'var(--gold-mid)',
            boxShadow: '0 0 25px rgba(201, 146, 42, 0.18)'
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-gold-bright/70 font-semibold mb-1">
                {language === 'ta' ? 'தற்போது நடக்கும் அந்தரம்' : 'Currently Active Antharam'}
              </span>
              <h4 className="text-lg font-black text-gold-bright">
                {PLANET_TRANSLATIONS[activeAnthara.dasha_lord]?.[language] || activeAnthara.dasha_lord}
              </h4>
            </div>

            <span className="text-[9px] bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black px-2.5 py-1 rounded-md tracking-wider uppercase shadow-sm">
              {language === 'ta' ? 'செயலில் உள்ளது' : 'Active Period'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gold-mid/10 pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-text-muted flex items-center gap-1">
                <Calendar size={11} className="text-gold-mid" />
                {language === 'ta' ? 'காலகட்டம்' : 'Timeline'}
              </span>
              <span className="text-xs text-text-primary font-medium">
                {formatDate(activeAnthara.start_date)} - {formatDate(activeAnthara.end_date)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-text-muted flex items-center gap-1">
                <Clock size={11} className="text-gold-mid" />
                {language === 'ta' ? 'மொத்த நாட்கள்' : 'Total Duration'}
              </span>
              <span className="text-xs text-text-primary font-medium">
                {getDurationDays(activeAnthara.start_date, activeAnthara.end_date)} {language === 'ta' ? 'நாட்கள்' : 'Days'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowAll(true)}
            className="w-full mt-5 py-2.5 rounded-xl border border-dashed border-gold-mid/30 hover:border-gold-bright/60 text-gold-bright/80 hover:text-gold-bright text-xs font-semibold bg-white/5 transition-all text-center"
          >
            {language === 'ta' ? '✦ இதர 8 அந்தரங்களை விரிவுபடுத்து' : '✦ Expand other 8 Antharam sub-sub periods'}
          </button>
        </div>
      ) : (
        /* Full Grid view */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {antharams.map((anthara, index) => {
            const name = PLANET_TRANSLATIONS[anthara.dasha_lord]?.[language] || anthara.dasha_lord
            const isActive = isCurrentBhukti && anthara.dasha_lord.toLowerCase() === activeAntharaLord.toLowerCase()
            const duration = getDurationDays(anthara.start_date, anthara.end_date)

            return (
              <div
                key={`${anthara.dasha_lord}-${index}`}
                className="p-4 rounded-xl border flex flex-col gap-2 transition-all duration-200"
                style={{
                  background: isActive ? 'var(--bg-active)' : 'var(--bg-card)',
                  borderColor: isActive ? 'var(--gold-mid)' : 'var(--bg-border)',
                  boxShadow: isActive 
                    ? '0 0 15px rgba(201, 146, 42, 0.15)' 
                    : '0 0 10px rgba(0, 0, 0, 0.03)'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-bold ${isActive ? 'text-gold-bright' : 'text-text-primary'}`}>
                    {name}
                  </span>

                  {isActive && (
                    <span className="text-[7px] bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">
                      {language === 'ta' ? 'நடப்பு' : 'Active'}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex items-center gap-1 text-[10px] text-text-muted">
                    <Calendar size={10} className="text-gold-mid/80" />
                    <span>
                      {formatDate(anthara.start_date)} - {formatDate(anthara.end_date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-text-muted">
                    <Clock size={10} className="text-gold-mid/80" />
                    <span>
                      {duration} {language === 'ta' ? 'நாட்கள்' : 'Days'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
