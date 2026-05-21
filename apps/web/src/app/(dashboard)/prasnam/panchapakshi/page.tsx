'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RefreshCw, Feather, Clock, Search, Info } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import api from '@/lib/api'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { getBirdIcon } from '@/components/astro/BirdIcons'
import { CityData } from '@/types/astro'

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
  "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishtha", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
]

const NAKSHATRAS_TA = [
  "அஸ்வினி", "பரணி", "கிருத்திகை", "ரோகிணி", "மிருகசீரிடம்", "திருவாதிரை", "புனர்பூசம்",
  "பூசம்", "ஆயில்யம்", "மகம்", "பூரம்", "உத்திரம்", "அஸ்தம்",
  "சித்திரை", "சுவாதி", "விசாகம்", "அனுஷம்", "கேட்டை", "மூலம்", "பூராடம்",
  "உத்திராடம்", "திருவோணம்", "அவிட்டம்", "சதயம்", "பூரட்டாதி",
  "உத்திரட்டாதி", "ரேவதி"
]

interface PanchapakshiResponse {
  birth_nakshatra: string
  birth_bird: string
  query_time: string
  is_daytime: boolean
  time_slot: number
  current_activity: string
  interpretation: string
}

export default function PanchapakshiPage() {
  const { language } = useLanguage()
  const [nakshatra, setNakshatra] = useState('')
  const [city, setCity] = useState<CityData | null>(null)
  
  // Create an initial state for local datetime so it hydrates correctly.
  const [queryDate, setQueryDate] = useState('')
  const [queryTime, setQueryTime] = useState('')

  useEffect(() => {
    const now = new Date()
    setQueryDate(now.toISOString().split('T')[0])
    setQueryTime(now.toTimeString().slice(0, 5))
  }, [])

  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<PanchapakshiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const labels = {
    ta: {
      title: "பஞ்சபட்சி (Pancha Pakshi)",
      subtitle: "சரியான நேரத்தை அறிய சித்தர்கள் அருளிய ஐந்து பறவை ஆரூடம். உங்கள் பறவையின் தற்போதைய செயல்பாட்டை அறியவும்.",
      nakshatra: "பிறந்த நட்சத்திரம்",
      nakPlaceholder: "நட்சத்திரத்தை தேர்ந்தெடுக்கவும்",
      place: "தற்போதைய ஊர்",
      date: "தேதி",
      time: "நேரம்",
      buttonCheck: "ஆரூடம் கணி",
      buttonReset: "புதிய கணிப்பு",
      calculating: "கணிக்கப்படுகிறது...",
      errorMessage: "பிழை ஏற்பட்டது. தயவுசெய்து நட்சத்திரம் மற்றும் ஊரை தேர்வு செய்யவும்.",
      birdLabel: "உங்கள் பறவை:",
      activityLabel: "தற்போதைய செயல்:",
      timeSlotLabel: "கால அளவு (Time Slot)",
      dayNightLabel: (isDay: boolean) => isDay ? "பகல் (Daytime)" : "இரவு (Nighttime)",
    },
    en: {
      title: "Pancha Pakshi Oracle",
      subtitle: "The ancient Siddha biorhythm of five birds. Discover your ruling bird and its current activity state.",
      nakshatra: "Birth Nakshatra",
      nakPlaceholder: "Select your Nakshatra",
      place: "Current Location",
      date: "Date",
      time: "Time",
      buttonCheck: "Consult Oracle",
      buttonReset: "New Consultation",
      calculating: "Consulting...",
      errorMessage: "An error occurred. Please select both Nakshatra and Location.",
      birdLabel: "Your Bird:",
      activityLabel: "Current Activity:",
      timeSlotLabel: "Time Slot",
      dayNightLabel: (isDay: boolean) => isDay ? "Daytime" : "Nighttime",
    }
  }[language]

  // Translate birds
  const getBirdTranslation = (bird: string) => {
    if (language === 'en') return bird
    const map: Record<string, string> = {
      'Vulture': 'வல்லூறு',
      'Owl': 'ஆந்தை',
      'Crow': 'காகம்',
      'Cock': 'கோழி',
      'Peacock': 'மயில்'
    }
    return map[bird] || bird
  }

  // Translate activities
  const getActivityTranslation = (activity: string) => {
    if (language === 'en') return activity
    const map: Record<string, string> = {
      'Ruling': 'அரசு (Ruling)',
      'Eating': 'ஊண் (Eating)',
      'Walking': 'நடை (Walking)',
      'Sleeping': 'துயில் (Sleeping)',
      'Dying': 'சாவு (Dying)'
    }
    return map[activity] || activity
  }

  const getActivityColor = (activity: string) => {
    switch (activity.toLowerCase()) {
      case 'ruling': return 'text-[#6ee7a0] border-[#4a7c59] bg-[#4a7c59]/20 shadow-[0_0_15px_rgba(74,124,89,0.2)]'
      case 'eating': return 'text-[#80c8ff] border-[#1e6fa8] bg-[#1e6fa8]/20 shadow-[0_0_15px_rgba(30,111,168,0.2)]'
      case 'walking': return 'text-gold-bright border-gold-deep bg-gold-deep/20 shadow-[0_0_15px_rgba(201,146,42,0.2)]'
      case 'sleeping': return 'text-[#ff90aa] border-[#b0415e] bg-[#b0415e]/20 shadow-[0_0_15px_rgba(176,65,94,0.2)]'
      case 'dying': return 'text-text-muted border-bg-border bg-bg-page shadow-none opacity-80'
      default: return 'text-gold-bright border-gold-deep bg-gold-deep/20'
    }
  }

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nakshatra || !city) {
      setError(labels.errorMessage)
      return
    }

    setIsCalculating(true)
    setError(null)

    try {
      // Determine lat/lng from city object gracefully
      const lat = (city as any).lat || (city as any).latitude
      const lng = (city as any).lng || (city as any).longitude

      // Construct ISO datetime string
      let isoString = ''
      if (queryDate && queryTime) {
        // Build local datetime and convert to ISO string
        const d = new Date(`${queryDate}T${queryTime}:00`)
        isoString = d.toISOString()
      }

      const payload = {
        birth_nakshatra: nakshatra,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        query_datetime: isoString || undefined
      }

      const response = await api.post('/prasnam/panchapakshi', payload)
      if (!response) throw new Error('API failed')
      
      setResult(response as any)
    } catch (err) {
      console.error(err)
      setError(labels.errorMessage)
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <ErrorBoundary label="Panchapakshi biorhythms failed to load.">
      <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
      {/* Header back link */}
      <div className="flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center gap-2 text-text-secondary hover:text-gold-bright transition-colors text-[14px]"
        >
          <ArrowLeft size={16} />
          {language === 'ta' ? 'முகப்புப்பக்கம்' : 'Back to Dashboard'}
        </Link>
        <span className="text-[11px] font-mono text-text-muted">VERSION 4.0</span>
      </div>

      {/* Main Intro */}
      <div className="flex flex-col gap-1.5 border-b border-bg-border pb-4">
        <h1 className="text-[24px] font-semibold text-[#80c8ff] tracking-tight font-playfair flex items-center gap-2.5">
          <Feather className="text-[#1e6fa8]" size={24} />
          {labels.title}
        </h1>
        <p className="text-[14px] text-text-secondary leading-relaxed max-w-[800px]">
          {labels.subtitle}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            <form onSubmit={handleCalculate} className="bg-bg-card border border-bg-border rounded-xl p-5 md:p-6 shadow-xl flex flex-col gap-5 max-w-[600px] mx-auto w-full">
              
              <div className="flex flex-col gap-4">
                {/* Nakshatra Select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-text-secondary">{labels.nakshatra}</label>
                  <select
                    value={nakshatra}
                    onChange={(e) => setNakshatra(e.target.value)}
                    className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none appearance-none"
                  >
                    <option value="" disabled>{labels.nakPlaceholder}</option>
                    {NAKSHATRAS.map((star, idx) => (
                      <option key={star} value={star}>
                        {language === 'ta' ? NAKSHATRAS_TA[idx] : star}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Place Search */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-text-secondary">{labels.place}</label>
                  <PlaceSearch 
                    onSelect={(c) => setCity(c)} 
                    selectedCity={city}
                  />
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-text-secondary">{labels.date}</label>
                    <input
                      type="date"
                      value={queryDate}
                      onChange={(e) => setQueryDate(e.target.value)}
                      className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none [color-scheme:dark]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] text-text-secondary">{labels.time}</label>
                    <input
                      type="time"
                      value={queryTime}
                      onChange={(e) => setQueryTime(e.target.value)}
                      className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger text-danger text-[13px] flex items-center gap-2">
                  <Info size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full h-12 bg-[#1e6fa8] hover:bg-[#155b8a] text-text-inverse font-semibold rounded-lg flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 text-[15px] mt-2"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    <span>{labels.calculating}</span>
                  </>
                ) : (
                  <>
                    <Feather size={18} />
                    {labels.buttonCheck}
                  </>
                )}
              </button>

            </form>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            {/* Header / Reset */}
            <div className="flex items-center justify-between bg-bg-card border border-bg-border rounded-xl p-5 shadow-xl">
              <div className="flex flex-col gap-1">
                <span className="text-[14px] text-[#80c8ff] font-medium">{language === 'ta' ? NAKSHATRAS_TA[NAKSHATRAS.indexOf(result.birth_nakshatra)] : result.birth_nakshatra} Nakshatra</span>
                <span className="text-[15px] text-text-secondary font-mono">{city?.name}</span>
              </div>
              <button
                onClick={() => setResult(null)}
                className="bg-bg-page border border-[#1e6fa8] rounded-full px-5 py-2 text-[13px] text-[#80c8ff] hover:bg-[#1e6fa8]/20 font-semibold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw size={15} />
                {labels.buttonReset}
              </button>
            </div>

            {/* Oracle Verdict Card */}
            <div className="bg-[#241a0f] border border-gold-deep rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(201,146,42,0.1)] relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-deep/10 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="p-8 flex flex-col items-center text-center gap-6 relative z-10">
                {/* Bird Identity */}
                <div className="flex flex-col items-center gap-3">
                  <span className="uppercase tracking-widest text-gold-deep font-bold text-[12px]">{labels.birdLabel}</span>
                  <div className="w-24 h-24 rounded-full bg-bg-page border border-bg-border flex items-center justify-center mb-1">
                    {getBirdIcon(result.birth_bird, "w-14 h-14", "#c9922a")}
                  </div>
                  <h2 className="text-[32px] font-playfair font-bold text-gold-bright">
                    {getBirdTranslation(result.birth_bird)}
                  </h2>
                </div>

                <div className="w-16 h-[1px] bg-gold-deep/40" />

                {/* Current Activity Status */}
                <div className="flex flex-col items-center gap-3 w-full">
                  <span className="uppercase tracking-widest text-text-muted font-bold text-[12px]">{labels.activityLabel}</span>
                  
                  <div className={`px-6 py-2.5 rounded-full border border-b-2 flex items-center gap-2 ${getActivityColor(result.current_activity)}`}>
                    <span className="font-semibold text-[18px] tracking-wide">
                      {getActivityTranslation(result.current_activity)}
                    </span>
                  </div>
                </div>

                <p className="text-[15px] leading-relaxed text-text-secondary max-w-[600px] mt-2">
                  {result.interpretation}
                </p>

              </div>
              
              {/* Footer Meta */}
              <div className="bg-bg-card/50 border-t border-bg-border px-6 py-4 flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock size={16} />
                  <span className="font-mono">
                    {new Date(result.query_time).toLocaleString(language === 'ta' ? 'ta-IN' : 'en-IN', {
                      hour: '2-digit', minute: '2-digit', hour12: true
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-medium text-text-muted">
                  <span>{labels.dayNightLabel(result.is_daytime)}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-bg-border inline-block" />
                  <span>{labels.timeSlotLabel}: {result.time_slot} / 5</span>
                </div>
              </div>

            </div>

            {/* Additional informational slots could be added below if needed */}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}
