'use client'

import React from 'react'
import { Calendar, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { DashaPeriod } from '@/types/astro'
import { PLANET_TRANSLATIONS } from './DashaSelector'

interface BhuktiTimelineProps {
  bhuktis: DashaPeriod[]
  activeBhuktiLord: string
  isCurrentDasha: boolean
  selectedBhuktiLord: string
  onSelectBhukti: (lord: string) => void
}

export function BhuktiTimeline({
  bhuktis,
  activeBhuktiLord,
  isCurrentDasha,
  selectedBhuktiLord,
  onSelectBhukti,
}: BhuktiTimelineProps) {
  const { language } = useLanguage()

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

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="px-1 flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-wider font-bold text-gold-bright">
          {language === 'ta' ? 'புக்தி காலங்கள் (இரண்டாம் நிலை)' : 'Bhukti Periods (Level 2)'}
        </h3>
        <span className="text-[10px] text-text-muted">
          {language === 'ta' ? 'அந்தரங்களைக் காண புக்தியைத் தேர்ந்தெடுக்கவும்' : 'Select a Bhukti to view sub-sub periods'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {bhuktis.map((bhukti, index) => {
          const name = PLANET_TRANSLATIONS[bhukti.dasha_lord]?.[language] || bhukti.dasha_lord
          const isActive = isCurrentDasha && bhukti.dasha_lord.toLowerCase() === activeBhuktiLord.toLowerCase()
          const isSelected = bhukti.dasha_lord.toLowerCase() === selectedBhuktiLord.toLowerCase()

          return (
            <button
              key={`${bhukti.dasha_lord}-${index}`}
              onClick={() => onSelectBhukti(bhukti.dasha_lord)}
              className="flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-200 hover:scale-[1.01]"
              style={{
                background: isSelected ? '#3a2b1c' : '#2e2115',
                borderColor: isSelected ? '#c9922a' : '#4f3a28',
                boxShadow: isSelected 
                  ? '0 0 15px rgba(201, 146, 42, 0.12)' 
                  : '0 0 10px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold ${isSelected ? 'text-gold-bright' : 'text-text-primary'}`}>
                    {name}
                  </span>
                  
                  {isActive && (
                    <span className="text-[7px] bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 font-extrabold px-1 py-0.5 rounded tracking-wide uppercase">
                      {language === 'ta' ? 'நடப்பு' : 'Active'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-text-muted">
                  <Calendar size={10} className="text-gold-mid/80" />
                  <span>
                    {formatDate(bhukti.start_date)} - {formatDate(bhukti.end_date)}
                  </span>
                </div>
              </div>

              <ChevronRight 
                size={14} 
                className={`transition-all duration-300 ${isSelected ? 'text-gold-bright translate-x-0.5' : 'text-text-muted'}`} 
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
