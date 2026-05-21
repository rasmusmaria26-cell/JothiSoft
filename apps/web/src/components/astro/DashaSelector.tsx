'use client'

import React from 'react'
import { Calendar } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { DashaPeriod } from '@/types/astro'

interface DashaSelectorProps {
  timeline: DashaPeriod[]
  activeLord: string
  selectedLord: string
  onSelectLord: (lord: string) => void
}

export const PLANET_TRANSLATIONS: Record<string, { en: string; ta: string }> = {
  Ketu: { en: 'Ketu', ta: 'கேது' },
  Venus: { en: 'Venus', ta: 'சுக்கிரன்' },
  Sun: { en: 'Sun', ta: 'சூரியன்' },
  Moon: { en: 'Moon', ta: 'சந்திரன்' },
  Mars: { en: 'Mars', ta: 'செவ்வாய்' },
  Rahu: { en: 'Rahu', ta: 'ராகு' },
  Jupiter: { en: 'Jupiter', ta: 'குரு' },
  Saturn: { en: 'Saturn', ta: 'சனி' },
  Mercury: { en: 'Mercury', ta: 'புதன்' },
}

export function DashaSelector({
  timeline,
  activeLord,
  selectedLord,
  onSelectLord,
}: DashaSelectorProps) {
  const { language } = useLanguage()

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
        year: 'numeric',
        month: 'short',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs uppercase tracking-wider font-bold text-gold-bright">
          {language === 'ta' ? 'விம்சோத்தரி மகா தசாக்கள்' : 'Vimshottari Mahadashas'}
        </h3>
        <span className="text-[10px] text-text-muted">
          {language === 'ta' ? 'தசாவைத் தேர்ந்தெடுத்து புக்திகளை ஆராயுங்கள்' : 'Select a Dasha to explore Bhuktis'}
        </span>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gold-deep/20 scrollbar-track-transparent pb-3 flex gap-4 pr-4 sm:pr-8">
        {timeline.map((dasa, index) => {
          const name = PLANET_TRANSLATIONS[dasa.dasha_lord]?.[language] || dasa.dasha_lord
          const isActive = dasa.dasha_lord.toLowerCase() === activeLord.toLowerCase()
          const isSelected = dasa.dasha_lord.toLowerCase() === selectedLord.toLowerCase()

          return (
            <button
              key={`${dasa.dasha_lord}-${index}`}
              onClick={() => onSelectLord(dasa.dasha_lord)}
              className="flex-shrink-0 flex flex-col items-start text-left p-4 rounded-xl border transition-all duration-300 w-44 hover:scale-[1.01]"
              style={{
                background: isSelected ? '#3a2b1c' : '#2e2115',
                borderColor: isSelected ? '#c9922a' : '#57412e',
                boxShadow: isSelected 
                  ? '0 0 15px rgba(201, 146, 42, 0.15)' 
                  : '0 0 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="w-full flex items-center justify-between mb-2">
                <span className={`text-base font-black tracking-tight ${isSelected ? 'text-gold-bright font-extrabold' : 'text-text-primary'}`}>
                  {name}
                </span>
                
                {isActive && (
                  <span className="text-[8px] bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                    {language === 'ta' ? 'நடப்பு' : 'Active'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-[10px] text-text-muted mt-1">
                <Calendar size={11} className="text-gold-mid/80" />
                <span>
                  {formatDate(dasa.start_date)} - {formatDate(dasa.end_date)}
                </span>
              </div>

              {dasa.years && (
                <span className="text-[10px] text-gold-mid/80 mt-2 font-medium bg-gold-mid/5 px-2 py-0.5 rounded border border-gold-mid/10">
                  {dasa.years} {language === 'ta' ? 'ஆண்டுகள்' : 'Years'}
                </span>
              )}
            </button>
          )
        })}
        {/* Trailing Spacer to prevent rightmost card clipping */}
        <div className="w-4 sm:w-8 flex-shrink-0" aria-hidden="true" />
      </div>
    </div>
  )
}
