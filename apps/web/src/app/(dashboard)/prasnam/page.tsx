'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, RefreshCw, Compass, Heart, Briefcase, 
  Activity, Search, Globe, Info, Sparkles, Navigation, Clock
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import api from '@/lib/api'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { CityData } from '@/types/astro'

const CATEGORIES = [
  { id: 'general', labelEn: 'General', labelTa: 'பொதுவானவை', descEn: 'All-round life questions', descTa: 'பொதுவான காரியங்கள்', icon: Compass, color: '#2e7d6b' },
  { id: 'marriage', labelEn: 'Marriage', labelTa: 'திருமணம்', descEn: 'Proposal, match, wedding', descTa: 'திருமண காரியங்கள்', icon: Heart, color: '#b0415e' },
  { id: 'career', labelEn: 'Career/Business', labelTa: 'தொழில் & வேலை', descEn: 'Jobs, promotions, ventures', descTa: 'உத்தியோகம் / தொழில்', icon: Briefcase, color: '#1e6fa8' },
  { id: 'health', labelEn: 'Health/Recovery', labelTa: 'உடல்நலம்', descEn: 'Recovery, vitality, chronic', descTa: 'உடல் ஆரோக்கியம்', icon: Activity, color: '#7b5ea7' },
  { id: 'lost_article', labelEn: 'Lost Item', labelTa: 'காணாமல் போனவை', descEn: 'Find missing items', descTa: 'தவறிய பொருட்கள்', icon: Search, color: '#a05c1a' },
  { id: 'travel', labelEn: 'Travel/Visa', labelTa: 'பயணம் & விசா', descEn: 'Visas, travels, relocations', descTa: 'பயணங்கள் / வெளிநாடு', icon: Globe, color: '#c9922a' },
]

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
  'Sun': 'சூ', 'Moon': 'சந்', 'Mars': 'செ', 'Mercury': 'பு', 
  'Jupiter': 'கு', 'Venus': 'சுக்', 'Saturn': 'சனி', 'Rahu': 'ரா', 'Ketu': 'கே'
}

const PLANET_MAP_EN: Record<string, string> = {
  'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me', 
  'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke'
}

const GRID_CELLS = [
  { sign: 'Meena', gridClass: 'col-start-1 row-start-1 rounded-tl-lg' },
  { sign: 'Mesha', gridClass: 'col-start-2 row-start-1' },
  { sign: 'Vrishabha', gridClass: 'col-start-3 row-start-1' },
  { sign: 'Mithuna', gridClass: 'col-start-4 row-start-1 rounded-tr-lg' },
  { sign: 'Kataka', gridClass: 'col-start-4 row-start-2' },
  { sign: 'Simha', gridClass: 'col-start-4 row-start-3' },
  { sign: 'Kanya', gridClass: 'col-start-4 row-start-4 rounded-br-lg' },
  { sign: 'Thula', gridClass: 'col-start-3 row-start-4' },
  { sign: 'Vrischika', gridClass: 'col-start-2 row-start-4' },
  { sign: 'Dhanus', gridClass: 'col-start-1 row-start-4 rounded-bl-lg' },
  { sign: 'Makara', gridClass: 'col-start-1 row-start-3' },
  { sign: 'Kumbha', gridClass: 'col-start-1 row-start-2' },
]

export default function PrasnamChartPage() {
  const { language } = useLanguage()
  const [prasnamMode, setPrasnamMode] = useState<'aroodha_108' | 'clock'>('clock') // Default to Clock/Katara mode as requested
  const [category, setCategory] = useState('general')
  const [aroodhaNumber, setAroodhaNumber] = useState<number | null>(null)
  
  // Clock specific states
  const [clockHour, setClockHour] = useState(5)
  const [clockMinute, setClockMinute] = useState(25)

  const [city, setCity] = useState<CityData | null>(null)
  const [queryDate, setQueryDate] = useState('')
  const [queryTime, setQueryTime] = useState('')
  
  const [isSpinning, setIsSpinning] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const now = new Date()
    setQueryDate(now.toISOString().split('T')[0])
    setQueryTime(now.toTimeString().slice(0, 5))

    // Set clock inputs matching current time
    let hr = now.getHours() % 12
    if (hr === 0) hr = 12
    setClockHour(hr)
    setClockMinute(now.getMinutes())
  }, [])

  const syncClockWithSystem = () => {
    const now = new Date()
    let hr = now.getHours() % 12
    if (hr === 0) hr = 12
    setClockHour(hr)
    setClockMinute(now.getMinutes())
    setQueryTime(now.toTimeString().slice(0, 5))
  }

  const labels = {
    ta: {
      title: "பிரஸ்னம் ஜாதகம் (Horary & Clock Prasnam)",
      subtitle: "சித்தர்கள் அருளிய ஆருட சோதிட முறை. ஆருட 108 எண் கட்டங்கள் அல்லது கடிகார பிரஸ்னம் (கடார பிரஸ்னம்) முட்களைக் கொண்டு துல்லியமாக பலன் அறியலாம்.",
      tabTamboola: "108 தாம்பூல ஆருடம்",
      tabClock: "கடார பிரஸ்னம் (கடிகாரம்)",
      category: "கேள்வியின் வகை (Category)",
      aroodha: "ஆருட எண் தேர்வு (1 - 108)",
      aroodhaDesc: "கீழே உள்ள கட்டங்களில் ஒரு எண்ணை மட்டும் தேர்வு செய்யவும் அல்லது தானாக தேர்வு செய்ய 'ஆருட சக்கரம் சுழற்று' என்பதை அழுத்தவும்.",
      clockTitle: "கடிகார முட்களை அமைக்கவும்",
      clockDesc: "மணி முள் ஆருட லக்னத்தையும் (ஆ), நிமிட முள் உதய லக்னத்தையும் (உ) குறிக்கும். உங்களது கேள்வி நேரத்திற்கு ஏற்ப கடிகாரத்தை மாற்றவும்.",
      place: "கேள்வி கேட்கும் இடம்",
      date: "தேதி",
      time: "நேரம்",
      btnCalculate: "பிரஸ்னம் கணி",
      btnSpin: "ஆருட சக்கரம் சுழற்று",
      btnReset: "புதிய பிரஸ்னம்",
      calculating: "ஜாதகம் கணிக்கப்படுகிறது...",
      errorForm: "தயவுசெய்து ஆருட விபரங்கள் மற்றும் ஊரை தேர்வு செய்யவும்.",
      udhayaLagna: "உதய லக்னம் (உ)",
      aroodhaLagna: "ஆருட லக்னம் (ஆ)",
      chatraLagna: "சத்ர லக்னம் (ச)",
      outcomeLabel: "முடிவு:",
      scoreLabel: "அனுகூலம்",
      verdictLabel: "ஆருட பலன் விவரம்",
      remediesLabel: "பரிஹாரங்கள் / வழிகாட்டுதல்கள்",
      detailsLabel: "பிரஸ்ன விபரங்கள்",
    },
    en: {
      title: "Prasnam Chart (Horary)",
      subtitle: "Traditional horary astrology of Siddhas. Cast with the sacred Tamboola 108 grid or using the mystical Kadigara/Katara Clock Prasnam method.",
      tabTamboola: "Tamboola 108 Aroodha",
      tabClock: "Katara Clock Prasnam",
      category: "Question Category",
      aroodha: "Mystical Aroodha Number (1 - 108)",
      aroodhaDesc: "Select a single square from the grid below, or click 'Spin Mystical Wheel' for a divine random selection.",
      clockTitle: "Position Clock Hands",
      clockDesc: "The Hour hand signifies Aroodha Lagna ( ஆ ) while the Minute hand signifies Udhaya Lagna ( உ ). Adjust coordinates dynamically.",
      place: "Query Place/Location",
      date: "Date",
      time: "Time",
      btnCalculate: "Cast Prasnam Chart",
      btnSpin: "Spin Mystical Wheel",
      btnReset: "New Horary Query",
      calculating: "Casting Chart...",
      errorForm: "Please select an Aroodha, a category, and your location.",
      udhayaLagna: "Udhaya Lagna (Ascendant)",
      aroodhaLagna: "Aroodha Lagna (Query Sign)",
      chatraLagna: "Chatra Lagna (Shadow Sign)",
      outcomeLabel: "Horary Outcome:",
      scoreLabel: "Favorability",
      verdictLabel: "Astrological Verdict",
      remediesLabel: "Auspicious Remedies (Pariharams)",
      detailsLabel: "Prasnam Details",
    }
  }[language]

  const handleRandomSpin = () => {
    setIsSpinning(true)
    let currentNumber = 1
    const interval = setInterval(() => {
      currentNumber = Math.floor(Math.random() * 108) + 1
      setAroodhaNumber(currentNumber)
    }, 45)

    setTimeout(() => {
      clearInterval(interval)
      const finalNum = Math.floor(Math.random() * 108) + 1
      setAroodhaNumber(finalNum)
      setIsSpinning(false)
    }, 1800)
  }

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (prasnamMode === 'aroodha_108' && !aroodhaNumber) {
      setError(labels.errorForm)
      return
    }
    if (!city) {
      setError(labels.errorForm)
      return
    }

    setIsCalculating(true)
    setError(null)

    try {
      const lat = (city as any).lat || (city as any).latitude
      const lng = (city as any).lng || (city as any).longitude
      const timezone = (city as any).timezone || 'Asia/Kolkata'

      // Calculate UTC offset
      let utcOffset = 5.5
      try {
        const formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: timezone,
          timeZoneName: 'longOffset'
        })
        const parts = formatter.formatToParts(new Date())
        const offsetPart = parts.find(p => p.type === 'timeZoneName')
        if (offsetPart) {
          const match = offsetPart.value.match(/GMT([-+]\d+):?(\d+)?/)
          if (match) {
            const hours = parseInt(match[1], 10)
            const minutes = match[2] ? parseInt(match[2], 10) / 60 : 0
            utcOffset = hours + (hours >= 0 ? minutes : -minutes)
          }
        }
      } catch (e) {
        console.error(e)
      }

      const payload = {
        question_category: category,
        mode: prasnamMode,
        aroodha_number: prasnamMode === 'aroodha_108' ? aroodhaNumber : undefined,
        clock_hour: prasnamMode === 'clock' ? clockHour : undefined,
        clock_minute: prasnamMode === 'clock' ? clockMinute : undefined,
        date: queryDate,
        time: queryTime,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        utcOffset,
        language
      }

      const response = await api.post('/prasnam/calculate', payload)
      if (!response || !response.success) {
        throw new Error(response?.message || 'Calculation failed')
      }
      setResult(response.data)
    } catch (err: any) {
      console.error(err)
      setError(err?.message || labels.errorForm)
    } finally {
      setIsCalculating(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#6ee7a0] stroke-[#2e7d6b]'
    if (score >= 60) return 'text-gold-bright stroke-gold-deep'
    return 'text-[#ff90aa] stroke-[#b0415e]'
  }

  // Analog Clock angles calculation
  const hourAngle = (clockHour * 30) + (clockMinute * 0.5)
  const minuteAngle = clockMinute * 6

  // Clock numbers mapping to Zodiac labels
  const CLOCK_ZODIAC_LABELS = [
    { hour: 12, label: 'Meena', labelTa: 'மீனம்', angle: 0 },
    { hour: 1, label: 'Mesha', labelTa: 'மேஷம்', angle: 30 },
    { hour: 2, label: 'Vrishabha', labelTa: 'ரிஷபம்', angle: 60 },
    { hour: 3, label: 'Mithuna', labelTa: 'மிதுனம்', angle: 90 },
    { hour: 4, label: 'Kataka', labelTa: 'கடகம்', angle: 120 },
    { hour: 5, label: 'Simha', labelTa: 'சிம்மம்', angle: 150 },
    { hour: 6, label: 'Kanya', labelTa: 'கன்னி', angle: 180 },
    { hour: 7, label: 'Thula', labelTa: 'துலாம்', angle: 210 },
    { hour: 8, label: 'Vrischika', labelTa: 'விருச்சிகம்', angle: 240 },
    { hour: 9, label: 'Dhanus', labelTa: 'தனுசு', angle: 270 },
    { hour: 10, label: 'Makara', labelTa: 'மகரம்', angle: 300 },
    { hour: 11, label: 'Kumbha', labelTa: 'கும்பம்', angle: 330 },
  ]

  return (
    <ErrorBoundary label="Prasnam calculations failed to load.">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
        
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-2 text-text-secondary hover:text-gold-bright transition-colors text-[14px]"
          >
            <ArrowLeft size={16} />
            {language === 'ta' ? 'முகப்புப்பக்கம்' : 'Back to Dashboard'}
          </Link>
          <span className="text-[11px] font-mono text-text-muted">VERSION 4.2</span>
        </div>

        {/* Intro */}
        <div className="flex flex-col gap-1.5 border-b border-bg-border pb-4">
          <h1 className="text-[24px] font-semibold text-[#80c8ff] tracking-tight font-playfair flex items-center gap-2.5">
            <Sparkles className="text-gold-bright animate-pulse" size={24} />
            {labels.title}
          </h1>
          <p className="text-[14px] text-text-secondary leading-relaxed max-w-[900px]">
            {labels.subtitle}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        {!result && (
          <div className="flex bg-bg-card border border-bg-border rounded-lg p-1 max-w-md">
            <button
              onClick={() => { setPrasnamMode('clock'); setError(null); }}
              className={`flex-1 py-2 text-[13px] font-semibold rounded transition-all flex items-center justify-center gap-1.5 ${
                prasnamMode === 'clock' 
                  ? 'bg-gold-deep text-text-inverse shadow' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Clock size={15} />
              {labels.tabClock}
            </button>
            <button
              onClick={() => { setPrasnamMode('aroodha_108'); setError(null); }}
              className={`flex-1 py-2 text-[13px] font-semibold rounded transition-all flex items-center justify-center gap-1.5 ${
                prasnamMode === 'aroodha_108' 
                  ? 'bg-gold-deep text-text-inverse shadow' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Sparkles size={15} />
              {labels.tabTamboola}
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Left Side: Category and Location */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div className="bg-bg-card border border-bg-border rounded-xl p-5 shadow-xl flex flex-col gap-4">
                  <h2 className="text-[15px] font-semibold text-[#80c8ff] tracking-wide flex items-center gap-2">
                    <Compass size={18} />
                    {labels.category}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => {
                      const CatIcon = cat.icon
                      const isSelected = category === cat.id
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all gap-1.5 h-24 ${
                            isSelected 
                              ? `bg-bg-page border-2 shadow-lg`
                              : `bg-bg-page/40 border-bg-border/60 hover:bg-bg-page`
                          }`}
                          style={isSelected ? { borderColor: cat.color, boxShadow: `0 0 12px ${cat.color}15` } : {}}
                        >
                          <CatIcon 
                            size={20} 
                            style={{ color: isSelected ? cat.color : 'rgba(255,255,255,0.40)' }}
                          />
                          <span className={`text-[12px] font-medium leading-tight ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                            {language === 'ta' ? cat.labelTa : cat.labelEn}
                          </span>
                          <span className="text-[10px] text-text-muted leading-tight hidden sm:block">
                            {language === 'ta' ? cat.descTa : cat.descEn}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="bg-bg-card border border-bg-border rounded-xl p-5 shadow-xl flex flex-col gap-4">
                  <h2 className="text-[15px] font-semibold text-[#80c8ff] tracking-wide flex items-center gap-2">
                    <Navigation size={18} />
                    {labels.place}
                  </h2>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <PlaceSearch onSelect={(c) => setCity(c)} selectedCity={city} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[12px] text-text-secondary">{labels.date}</label>
                        <input
                          type="date"
                          value={queryDate}
                          onChange={(e) => setQueryDate(e.target.value)}
                          className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] outline-none focus:border-gold-deep [color-scheme:dark]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[12px] text-text-secondary">{labels.time}</label>
                        <input
                          type="time"
                          value={queryTime}
                          onChange={(e) => {
                            setQueryTime(e.target.value)
                            if (prasnamMode === 'clock') {
                              const [h, m] = e.target.value.split(':').map(Number)
                              let mappedH = h % 12
                              if (mappedH === 0) mappedH = 12
                              setClockHour(mappedH)
                              setClockMinute(m)
                            }
                          }}
                          className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] outline-none focus:border-gold-deep [color-scheme:dark]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Mode-Specific Inputs */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <AnimatePresence mode="wait">
                  {prasnamMode === 'clock' ? (
                    /* Clock Mode Form Card */
                    <motion.div
                      key="clock-card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-bg-card border border-bg-border rounded-xl p-5 shadow-xl flex flex-col gap-4 h-full justify-between"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h2 className="text-[15px] font-semibold text-[#80c8ff] tracking-wide flex items-center gap-2">
                            <Clock size={18} className="text-gold-bright" />
                            {labels.clockTitle}
                          </h2>
                          <button
                            onClick={syncClockWithSystem}
                            className="text-[11px] bg-white/5 border border-white/10 text-gold-bright hover:bg-white/10 px-2 py-0.5 rounded flex items-center gap-1 transition-all"
                          >
                            <RefreshCw size={10} />
                            {language === 'ta' ? 'இப்போதைய நேரம்' : 'Sync Clock'}
                          </button>
                        </div>
                        <p className="text-[12px] text-text-secondary leading-relaxed">
                          {labels.clockDesc}
                        </p>
                      </div>

                      {/* Interactive SVG Analog Clock mapping zodiac boundaries */}
                      <div className="flex justify-center items-center py-4 relative">
                        <div className="w-[200px] h-[200px] rounded-full border-4 border-gold-mid/40 relative shadow-inner bg-[#0a0a1a] flex items-center justify-center">
                          {/* Inner gold circular ring */}
                          <div className="w-[185px] h-[185px] rounded-full border border-dashed border-gold-deep/20 absolute" />
                          
                          {/* Pivot point */}
                          <div className="w-3.5 h-3.5 rounded-full bg-gold-bright z-30 absolute shadow-md shadow-black" />

                          {/* Clock Hands */}
                          <div 
                            className="w-1.5 h-14 bg-gold-bright rounded absolute origin-bottom bottom-1/2 z-20 shadow-md shadow-black/40"
                            style={{ transform: `rotate(${hourAngle}deg)` }}
                          />
                          <div 
                            className="w-1 h-20 bg-text-muted rounded absolute origin-bottom bottom-1/2 z-10"
                            style={{ transform: `rotate(${minuteAngle}deg)` }}
                          />

                          {/* Clock numbers mapping directly to Zodiac signs */}
                          {CLOCK_ZODIAC_LABELS.map((item) => {
                            const x = Math.sin((item.angle * Math.PI) / 180) * 75
                            const y = -Math.cos((item.angle * Math.PI) / 180) * 75
                            return (
                              <div
                                key={item.hour}
                                className="absolute flex flex-col items-center justify-center text-center leading-none"
                                style={{ transform: `translate(${x}px, ${y}px)` }}
                              >
                                <span className="text-[9px] font-bold text-text-primary font-mono">{item.hour}</span>
                                <span className="text-[7px] text-gold-bright/60 mt-0.5 scale-[0.85] leading-none">
                                  {language === 'ta' ? item.labelTa : item.label}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Manual sliders for precise hands positioning */}
                      <div className="flex flex-col gap-3.5 bg-bg-page/40 p-4 border border-bg-border rounded-lg">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[12px]">
                            <span className="text-text-secondary">{language === 'ta' ? 'மணி முள் (ஆருடம்)' : 'Hour Hand (Aroodha)'}</span>
                            <span className="font-bold text-gold-bright">{clockHour} o&apos;clock ({language === 'ta' ? SIGN_MAP_TA[ZODIAC_SIGNS[(clockHour - 1) % 12]] : ZODIAC_SIGNS[(clockHour - 1) % 12]})</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="12"
                            step="1"
                            value={clockHour}
                            onChange={(e) => {
                              const hr = parseInt(e.target.value, 10)
                              setClockHour(hr)
                              // update time payload
                              const updatedTime = `${String(hr).padStart(2, '0')}:${String(clockMinute).padStart(2, '0')}`
                              setQueryTime(updatedTime)
                            }}
                            className="w-full accent-gold-mid bg-bg-page h-1.5 rounded-lg outline-none cursor-pointer"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[12px]">
                            <span className="text-text-secondary">{language === 'ta' ? 'நிமிட முள் (உதயம்)' : 'Minute Hand (Udhaya)'}</span>
                            <span className="font-bold text-[#80c8ff]">{clockMinute} mins ({language === 'ta' ? SIGN_MAP_TA[ZODIAC_SIGNS[Math.floor(clockMinute / 5) % 12]] : ZODIAC_SIGNS[Math.floor(clockMinute / 5) % 12]})</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="59"
                            step="1"
                            value={clockMinute}
                            onChange={(e) => {
                              const mn = parseInt(e.target.value, 10)
                              setClockMinute(mn)
                              const updatedTime = `${String(clockHour).padStart(2, '0')}:${String(mn).padStart(2, '0')}`
                              setQueryTime(updatedTime)
                            }}
                            className="w-full accent-gold-mid bg-bg-page h-1.5 rounded-lg outline-none cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        {error && (
                          <div className="p-3 rounded-lg bg-danger/10 border border-danger text-danger text-[13px] flex items-center gap-2">
                            <Info size={16} className="shrink-0" />
                            <span>{error}</span>
                          </div>
                        )}

                        <button
                          onClick={handleCalculate}
                          disabled={isCalculating || !city}
                          className="w-full h-12 bg-[#1e6fa8] hover:bg-[#155b8a] disabled:opacity-50 text-text-inverse font-bold rounded-lg flex items-center justify-center gap-2 transition-all text-[15px]"
                        >
                          {isCalculating ? (
                            <>
                              <RefreshCw className="animate-spin" size={18} />
                              <span>{labels.calculating}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={18} />
                              {labels.btnCalculate}
                            </>
                          )}
                        </button>
                      </div>

                    </motion.div>
                  ) : (
                    /* Tamboola 108 Mode Card */
                    <motion.div
                      key="tamboola-card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-bg-card border border-bg-border rounded-xl p-5 shadow-xl flex flex-col gap-4 h-full justify-between"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <h2 className="text-[15px] font-semibold text-[#80c8ff] tracking-wide flex items-center gap-2">
                            <Sparkles size={18} className="text-gold-bright" />
                            {labels.aroodha}
                          </h2>
                          {aroodhaNumber && (
                            <span className="text-[14px] font-bold text-gold-bright bg-gold-deep/20 border border-gold-deep/40 px-2.5 py-0.5 rounded">
                              NO. {aroodhaNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-text-secondary leading-relaxed">
                          {labels.aroodhaDesc}
                        </p>
                      </div>

                      {/* Dense 1-108 Grid */}
                      <div className="grid grid-cols-9 gap-1 max-h-[300px] overflow-y-auto pr-1 my-3 bg-bg-page/40 p-2.5 border border-bg-border rounded-lg">
                        {Array.from({ length: 108 }, (_, i) => i + 1).map((num) => {
                          const isSelected = aroodhaNumber === num
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => !isSpinning && setAroodhaNumber(num)}
                              disabled={isSpinning}
                              className={`aspect-square text-[10px] font-semibold flex items-center justify-center border transition-all rounded ${
                                isSelected 
                                  ? 'bg-gold-deep text-text-inverse border-gold-bright shadow-md scale-105 z-10' 
                                  : 'bg-bg-card/80 border-bg-border/60 hover:border-gold-deep text-text-secondary hover:text-gold-bright'
                              }`}
                            >
                              {num}
                            </button>
                          )
                        })}
                      </div>

                      <div className="flex flex-col gap-3">
                        <button
                          type="button"
                          onClick={handleRandomSpin}
                          disabled={isSpinning || isCalculating}
                          className="w-full h-11 bg-bg-page border border-gold-deep/50 hover:bg-gold-deep/15 text-gold-bright font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                          <RefreshCw className={isSpinning ? 'animate-spin' : ''} size={16} />
                          {labels.btnSpin}
                        </button>

                        {error && (
                          <div className="p-3 rounded-lg bg-danger/10 border border-danger text-danger text-[13px] flex items-center gap-2">
                            <Info size={16} className="shrink-0" />
                            <span>{error}</span>
                          </div>
                        )}

                        <button
                          onClick={handleCalculate}
                          disabled={isCalculating || isSpinning || !aroodhaNumber || !city}
                          className="w-full h-12 bg-[#1e6fa8] hover:bg-[#155b8a] disabled:opacity-50 text-text-inverse font-bold rounded-lg flex items-center justify-center gap-2 transition-all text-[15px]"
                        >
                          {isCalculating ? (
                            <>
                              <RefreshCw className="animate-spin" size={18} />
                              <span>{labels.calculating}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles size={18} />
                              {labels.btnCalculate}
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            /* Results View */
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6"
            >
              {/* Reset Header */}
              <div className="col-span-12 flex items-center justify-between bg-bg-card border border-bg-border rounded-xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-text-secondary font-mono">{city?.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-bg-border inline-block" />
                  <span className="text-[13px] text-text-secondary font-mono">
                    {result.mode === 'clock' 
                      ? `${language === 'ta' ? 'கடார நேரம்:' : 'Katara Time:'} ${result.clock_time}`
                      : `NO. ${result.aroodha_number}`
                    }
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-bg-border inline-block" />
                  <span className="text-[13px] font-bold text-gold-bright uppercase tracking-wider">
                    {CATEGORIES.find(c => c.id === result.question_category)?.labelEn}
                  </span>
                </div>
                <button
                  onClick={() => setResult(null)}
                  className="bg-bg-page border border-[#1e6fa8] rounded-full px-5 py-2 text-[13px] text-[#80c8ff] hover:bg-[#1e6fa8]/20 font-semibold flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw size={15} />
                  {labels.btnReset}
                </button>
              </div>

              {/* Rasi Chart Display */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                <div className="bg-bg-card border border-bg-border rounded-2xl p-5 shadow-xl flex flex-col justify-center items-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-48 h-48 bg-gold-deep/5 rounded-full blur-[80px]" />
                  
                  {/* Custom South Indian Square Rasi Chart with markers */}
                  <h3 className="text-sm font-semibold text-gold-bright mb-4 tracking-wider uppercase flex items-center gap-1.5">
                    <Sparkles size={16} />
                    {language === 'ta' ? 'பிரஸ்னம் சக்கரம்' : 'Prasnam Rasi Chart'}
                  </h3>

                  <div className="grid grid-cols-4 grid-rows-4 w-full aspect-square border border-bg-border rounded-lg relative bg-[#080818]/65">
                    {/* Merged Center Area */}
                    <div className="col-start-2 col-span-2 row-start-2 row-span-2 flex flex-col justify-center items-center text-center p-2 z-10 border border-dashed border-gold-deep/20 bg-[#0f0f24]/90">
                      <span className="text-[9px] tracking-wider uppercase text-text-muted">
                        {language === 'ta' ? 'உதய ராசி' : 'Udhaya Rasi'}
                      </span>
                      <span className="text-xs font-bold text-gold-bright mt-0.5">
                        {result.udhaya_lagna.sign_ta}
                      </span>
                      <span className="text-[9px] text-[#80c8ff] font-mono mt-0.5">
                        {result.udhaya_lagna.degree.toFixed(2)}°
                      </span>
                    </div>

                    {/* Outer cells */}
                    {GRID_CELLS.map((cell) => {
                      const isUdhaya = cell.sign === result.udhaya_lagna.sign
                      const isAroodha = cell.sign === result.aroodha_lagna.sign
                      const isChatra = cell.sign === result.chatra_lagna.sign

                      // Filter planets residing here
                      const residingPlanets = result.planets.filter((p: any) => p.sign === cell.sign && p.planet !== 'Lagna')

                      return (
                        <div
                          key={cell.sign}
                          className={`${cell.gridClass} border border-bg-border/40 p-1 flex flex-col relative bg-transparent hover:bg-white/5 transition-colors`}
                        >
                          <span className="text-[8px] text-text-muted">
                            {language === 'ta' ? SIGN_MAP_TA[cell.sign] : cell.sign}
                          </span>

                          <div className="flex-1 flex flex-wrap items-center justify-center gap-1 p-0.5">
                            {/* Special Markers */}
                            {isUdhaya && (
                              <span className="bg-[#2e7d6b]/20 border border-[#2e7d6b]/50 text-[#6ee7a0] font-extrabold text-[10px] px-1 rounded shadow-sm shadow-[#2e7d6b]/20">
                                உ
                              </span>
                            )}
                            {isAroodha && (
                              <span className="bg-gold-deep/20 border border-gold-mid/50 text-gold-bright font-extrabold text-[10px] px-1 rounded shadow-sm shadow-gold-deep/20">
                                ஆ
                              </span>
                            )}
                            {isChatra && (
                              <span className="bg-[#b0415e]/20 border border-[#b0415e]/50 text-[#ff90aa] font-extrabold text-[10px] px-1 rounded shadow-sm shadow-[#b0415e]/20">
                                ச
                              </span>
                            )}

                            {/* Standard Planets */}
                            {residingPlanets.map((p: any) => {
                              const label = language === 'ta' ? PLANET_MAP_TA[p.planet] : PLANET_MAP_EN[p.planet]
                              return (
                                <span
                                  key={p.planet}
                                  className="text-[10px] text-text-secondary bg-white/5 border border-white/10 px-1 rounded font-medium"
                                >
                                  {label || p.planet}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Mini Legend */}
                  <div className="grid grid-cols-3 gap-4 w-full mt-4 border-t border-bg-border pt-3.5 text-[11px] justify-center text-center">
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="bg-[#2e7d6b]/20 border border-[#2e7d6b]/50 text-[#6ee7a0] font-bold px-1.5 py-0.5 rounded">உ</span>
                      <span className="text-text-secondary">{language === 'ta' ? 'உதயம்' : 'Udhaya'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="bg-gold-deep/20 border border-gold-mid/50 text-gold-bright font-bold px-1.5 py-0.5 rounded">ஆ</span>
                      <span className="text-text-secondary">{language === 'ta' ? 'ஆருடம்' : 'Aroodha'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-center">
                      <span className="bg-[#b0415e]/20 border border-[#b0415e]/50 text-[#ff90aa] font-bold px-1.5 py-0.5 rounded">ச</span>
                      <span className="text-text-secondary">{language === 'ta' ? 'சத்ரம்' : 'Chatra'}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Astrological Verdict Details */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Big Verdict Overview */}
                <div className="bg-bg-card border border-bg-border rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center gap-6">
                  {/* Favorability Score Ring */}
                  <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        className="stroke-bg-border/60 fill-none"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="56"
                        cy="56"
                        r="48"
                        className={`fill-none ${getScoreColor(result.score)}`}
                        strokeWidth="8"
                        strokeDasharray={301.6}
                        initial={{ strokeDashoffset: 301.6 }}
                        animate={{ strokeDashoffset: 301.6 - (301.6 * result.score) / 100 }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-[20px] font-bold font-mono tracking-tighter text-text-primary">
                        {result.score}%
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-text-muted leading-none">
                        {labels.scoreLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-center sm:text-left">
                    <span className="text-[12px] uppercase tracking-widest text-text-muted font-bold">
                      {labels.outcomeLabel}
                    </span>
                    <h2 className="text-[20px] font-bold text-gold-bright tracking-tight leading-tight">
                      {language === 'ta' ? result.outcome_ta : result.outcome_en}
                    </h2>
                    <p className="text-[14px] text-text-secondary leading-relaxed mt-1">
                      {language === 'ta' ? result.prediction_ta : result.prediction_en}
                    </p>
                  </div>
                </div>

                {/* Remedies & Directions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Remedies */}
                  <div className="bg-bg-card border border-bg-border rounded-xl p-5 shadow-xl flex flex-col gap-3">
                    <h3 className="text-[14px] font-semibold text-[#80c8ff] tracking-wider uppercase border-b border-bg-border pb-2 flex items-center gap-1.5">
                      <Sparkles size={15} className="text-gold-bright" />
                      {labels.remediesLabel}
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {(language === 'ta' ? result.remedies_ta : result.remedies_en).map((rem: string, idx: number) => (
                        <li key={idx} className="text-[13px] text-text-secondary flex items-start gap-2 leading-relaxed">
                          <span className="text-gold-bright shrink-0 mt-0.5">✦</span>
                          <span>{rem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Calculations breakdown details */}
                  <div className="bg-bg-card border border-bg-border rounded-xl p-5 shadow-xl flex flex-col gap-3">
                    <h3 className="text-[14px] font-semibold text-[#80c8ff] tracking-wider uppercase border-b border-bg-border pb-2 flex items-center gap-1.5">
                      <Info size={15} />
                      {labels.detailsLabel}
                    </h3>
                    <div className="flex flex-col gap-2.5 text-[13px]">
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-text-muted">{labels.udhayaLagna}</span>
                        <span className="font-semibold text-text-primary">{language === 'ta' ? result.udhaya_lagna.sign_ta : result.udhaya_lagna.sign}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-text-muted">{labels.aroodhaLagna}</span>
                        <span className="font-semibold text-text-primary">{language === 'ta' ? result.aroodha_lagna.sign_ta : result.aroodha_lagna.sign}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-1.5">
                        <span className="text-text-muted">{labels.chatraLagna}</span>
                        <span className="font-semibold text-text-primary">{language === 'ta' ? result.chatra_lagna.sign_ta : result.chatra_lagna.sign}</span>
                      </div>
                      <div className="flex justify-between pb-0.5">
                        <span className="text-text-muted">{language === 'ta' ? 'கேள்வி நேரம்' : 'Query Timestamp'}</span>
                        <span className="font-mono text-text-secondary">
                          {new Date(`${result.date}T${result.time}`).toLocaleString(language === 'ta' ? 'ta-IN' : 'en-IN', {
                            hour: '2-digit', minute: '2-digit', hour12: true
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </ErrorBoundary>
  )
}
