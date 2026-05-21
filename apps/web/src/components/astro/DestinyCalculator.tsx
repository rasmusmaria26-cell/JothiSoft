'use client'

import React, { useState } from 'react'
import { Calendar, Search, Milestone, Compass, Sparkles } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { DashaPeriod } from '@/types/astro'
import { PLANET_TRANSLATIONS } from './DashaSelector'

interface DestinyCalculatorProps {
  timeline: DashaPeriod[]
  birthDateStr: string
}

export function DestinyCalculator({ timeline, birthDateStr }: DestinyCalculatorProps) {
  const { language } = useLanguage()
  const [selectedDate, setSelectedDate] = useState('')
  const [result, setResult] = useState<{
    maha: string
    bhukti: string
    anthara: string
    start: string
    end: string
  } | null>(null)

  const t = {
    ta: {
      title: 'வருங்கால விதி கணக்கீட்டாளர்',
      subtitle: 'உங்களின் எதிர்கால முக்கிய மைல்கல் தேதிகளில் என்ன தசா, புக்தி, அந்தரம் நடக்கும் என்பதை உடனே கண்டறியுங்கள்.',
      label: 'எதிர்கால தேதியைத் தேர்ந்தெடுக்கவும்',
      calculate: 'விதியைக் கணக்கிடு',
      quickTitle: 'விரைவு மைல்கற்கள்',
      nextYear: 'அடுத்த வருடம்',
      age30: '30 வயது மைல்கல்',
      age45: '45 வயது மைல்கல்',
      age60: '60 வயது மைல்கல்',
      resultTitle: 'தேர்ந்தெடுக்கப்பட்ட தேதியின் விதி சுழற்சி',
      noResult: 'தேர்ந்தெடுக்கப்பட்ட தேதிக்கான தசா விவரங்கள் கிடைக்கவில்லை. 120 வருட வரம்பிற்குள் உள்ள தேதியைத் தேர்ந்தெடுக்கவும்.',
      activePeriod: 'நடக்கும் காலகட்டம்',
    },
    en: {
      title: 'Future Destiny Calculator',
      subtitle: 'Instantly uncover the active Mahadasha, Bhukti, and Antharam for any future milestone date in your life.',
      label: 'Select a Future Date',
      calculate: 'Calculate Destiny',
      quickTitle: 'Quick Milestones',
      nextYear: 'Next Year',
      age30: 'Age 30 Milestone',
      age45: 'Age 45 Milestone',
      age60: 'Age 60 Milestone',
      resultTitle: 'Destiny Cycle on Selected Date',
      noResult: 'No Dasa timeline details available for this date. Please pick a date within the 120-year range.',
      activePeriod: 'Active Period',
    }
  }[language]

  const calculateDestinyForDate = (dateStr: string) => {
    if (!dateStr) return
    const targetDate = new Date(dateStr)

    // 1. Find Mahadasha
    const maha = timeline.find(
      m => new Date(m.start_date) <= targetDate && targetDate < new Date(m.end_date)
    )

    if (!maha) {
      setResult(null)
      return
    }

    // 2. Find Bhukti
    const bhukti = maha.bhuktis?.find(
      (b: DashaPeriod) => new Date(b.start_date) <= targetDate && targetDate < new Date(b.end_date)
    )

    // 3. Find Antharam
    const anthara = bhukti?.antharams?.find(
      (a: DashaPeriod) => new Date(a.start_date) <= targetDate && targetDate < new Date(a.end_date)
    )

    setResult({
      maha: maha.dasha_lord,
      bhukti: bhukti?.dasha_lord || '',
      anthara: anthara?.dasha_lord || '',
      start: anthara?.start_date || bhukti?.start_date || maha.start_date,
      end: anthara?.end_date || bhukti?.end_date || maha.end_date,
    })
  }

  const handleQuickMilestone = (type: 'next_year' | 'age_30' | 'age_45' | 'age_60') => {
    if (!birthDateStr) return
    const birth = new Date(birthDateStr)
    let target = new Date()

    if (type === 'next_year') {
      target.setFullYear(target.getFullYear() + 1)
    } else if (type === 'age_30') {
      target = new Date(birth)
      target.setFullYear(birth.getFullYear() + 30)
    } else if (type === 'age_45') {
      target = new Date(birth)
      target.setFullYear(birth.getFullYear() + 45)
    } else if (type === 'age_60') {
      target = new Date(birth)
      target.setFullYear(birth.getFullYear() + 60)
    }

    const year = target.getFullYear()
    const month = String(target.getMonth() + 1).padStart(2, '0')
    const day = String(target.getDate()).padStart(2, '0')
    const formatted = `${year}-${month}-${day}`
    
    setSelectedDate(formatted)
    calculateDestinyForDate(formatted)
  }

  const formatDateLabel = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div 
      className="p-6 rounded-2xl border transition-all duration-300 flex flex-col gap-6"
      style={{
        background: '#2e2115',
        borderColor: '#c9922a',
        boxShadow: '0 0 25px rgba(201, 146, 42, 0.08)'
      }}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-bold text-gold-bright tracking-tight flex items-center gap-2">
          <Milestone className="h-5 w-5 text-gold-bright" />
          {t.title}
        </h3>
        <p className="text-xs text-text-secondary leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Date Inputs & Milestones */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-primary ml-1">
              {t.label}
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="flex-1 bg-bg-page border border-bg-border rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
              />
              <button
                onClick={() => calculateDestinyForDate(selectedDate)}
                className="bg-gold-deep text-black font-bold px-4 rounded-xl hover:bg-gold-bright transition-colors flex items-center justify-center"
              >
                <Search size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted ml-1">
              {t.quickTitle}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickMilestone('next_year')}
                className="text-left px-3 py-2 border border-bg-border hover:border-gold-mid bg-black/10 rounded-lg text-[11px] text-text-secondary hover:text-white transition-colors"
              >
                ✦ {t.nextYear}
              </button>
              <button
                onClick={() => handleQuickMilestone('age_30')}
                className="text-left px-3 py-2 border border-bg-border hover:border-gold-mid bg-black/10 rounded-lg text-[11px] text-text-secondary hover:text-white transition-colors"
              >
                ✦ {t.age30}
              </button>
              <button
                onClick={() => handleQuickMilestone('age_45')}
                className="text-left px-3 py-2 border border-bg-border hover:border-gold-mid bg-black/10 rounded-lg text-[11px] text-text-secondary hover:text-white transition-colors"
              >
                ✦ {t.age45}
              </button>
              <button
                onClick={() => handleQuickMilestone('age_60')}
                className="text-left px-3 py-2 border border-bg-border hover:border-gold-mid bg-black/10 rounded-lg text-[11px] text-text-secondary hover:text-white transition-colors"
              >
                ✦ {t.age60}
              </button>
            </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="flex-1 flex flex-col justify-center h-full min-h-[160px]">
          {result ? (
            <div 
              className="p-5 rounded-xl border border-gold-mid/30 bg-gold-mid/5 flex flex-col gap-3 relative overflow-hidden"
              style={{
                boxShadow: 'inset 0 0 20px rgba(201, 146, 42, 0.05)'
              }}
            >
              <div className="absolute -right-8 -bottom-8 opacity-5 text-gold-bright pointer-events-none">
                <Compass size={120} />
              </div>

              <span className="text-[9px] uppercase tracking-wider text-gold-bright font-black flex items-center gap-1.5">
                <Sparkles size={10} className="text-gold-bright animate-pulse" />
                {t.resultTitle}
              </span>

              <div className="flex flex-col gap-1.5 mt-1 z-10">
                <div className="flex flex-wrap items-center gap-1.5 text-sm sm:text-base font-black">
                  <span className="text-gold-bright">
                    {PLANET_TRANSLATIONS[result.maha]?.[language] || result.maha}
                  </span>
                  <span className="text-text-muted text-xs">/</span>
                  <span className="text-text-primary">
                    {PLANET_TRANSLATIONS[result.bhukti]?.[language] || result.bhukti}
                  </span>
                  {result.anthara && (
                    <>
                      <span className="text-text-muted text-xs">/</span>
                      <span className="text-gold-mid font-medium">
                        {PLANET_TRANSLATIONS[result.anthara]?.[language] || result.anthara}
                      </span>
                    </>
                  )}
                </div>

                <div className="text-[10px] text-text-muted flex flex-col gap-0.5 mt-2 bg-black/20 p-2 rounded-lg border border-white/5">
                  <span className="text-gold-mid/80 font-bold">{t.activePeriod}:</span>
                  <span className="text-text-secondary font-mono">
                    {formatDateLabel(result.start)} - {formatDateLabel(result.end)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 border border-dashed border-bg-border rounded-xl bg-black/10 min-h-[160px]">
              <Compass className="h-8 w-8 text-text-muted/60 mb-2" />
              <p className="text-xs text-text-muted max-w-[240px]">
                {selectedDate 
                  ? t.noResult 
                  : (language === 'ta' 
                      ? 'மைல்கல் தேதியை உள்ளிட்டு எதிர்கால தசா விவரங்களை உடனே கணக்கிடுங்கள்.' 
                      : 'Enter a future date or select a milestone to see your active planetary cycles.')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
