'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, Heart, Home, Briefcase, Car, Map, Sparkles, ChevronLeft, ChevronRight, Info, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { MuhurthamDay } from '@/types/muhurtham'
import { MuhurthamDetailsModal } from '@/components/astro/MuhurthamDetailsModal'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import api from '@/lib/api'

const CATEGORIES = [
  { id: 'general', name_en: 'General', name_ta: 'பொது சுப நாட்கள்', icon: Sparkles, color: 'text-[#f2c96a] border-[#c9922a]/40 bg-[#c9922a]/10' },
  { id: 'marriage', name_en: 'Marriage', name_ta: 'திருமணம்', icon: Heart, color: 'text-[#b0415e] border-[#b0415e]/40 bg-[#b0415e]/10' },
  { id: 'grahapravesham', name_en: 'Housewarming', name_ta: 'கிரகப்பிரவேசம்', icon: Home, color: 'text-[#2e7d6b] border-[#2e7d6b]/40 bg-[#2e7d6b]/10' },
  { id: 'business', name_en: 'Business Opening', name_ta: 'வியாபாரம் / தொழில்', icon: Briefcase, color: 'text-[#1e6fa8] border-[#1e6fa8]/40 bg-[#1e6fa8]/10' },
  { id: 'vehicle', name_en: 'Vehicle Purchase', name_ta: 'வாகனம் வாங்க', icon: Car, color: 'text-[#a05c1a] border-[#a05c1a]/40 bg-[#a05c1a]/10' },
  { id: 'property', name_en: 'Property Registration', name_ta: 'நிலம் / சொத்து', icon: Map, color: 'text-[#4a7c59] border-[#4a7c59]/40 bg-[#4a7c59]/10' },
]

export default function MuhurthamPage() {
  const { language } = useLanguage()
  const isTa = language === 'ta'

  // Date selection state (defaulting to current calendar month)
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [activeCategory, setActiveCategory] = useState('general')
  const [isLoading, setIsLoading] = useState(false)
  const [days, setDays] = useState<MuhurthamDay[]>([])
  const [error, setError] = useState<string | null>(null)

  // Details Modal state
  const [selectedDay, setSelectedDay] = useState<MuhurthamDay | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch Muhurtham days
  useEffect(() => {
    async function fetchMuhurtham() {
      setIsLoading(true)
      setError(null)
      try {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1 // 1-indexed

        const data = await api.post<MuhurthamDay[]>('/panchangam/muhurtham', {
          year,
          month,
          category: activeCategory,
          lat: 13.0827, // Chennai default
          lng: 80.2707,
        })

        setDays(data)
      } catch (err) {
        console.error(err)
        setError(isTa ? 'சுப முகூர்த்த நாட்களைக் கணக்கிட முடியவில்லை.' : 'Failed to retrieve auspicious timings.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMuhurtham()
  }, [currentDate, activeCategory, isTa])

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const next = new Date(prev)
      next.setMonth(prev.getMonth() - 1)
      return next
    })
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const next = new Date(prev)
      next.setMonth(prev.getMonth() + 1)
      return next
    })
  }

  const monthYearLabel = currentDate.toLocaleDateString(isTa ? 'ta-IN' : 'en-US', {
    month: 'long',
    year: 'numeric',
  })

  const labels = {
    ta: {
      title: 'சுப முகூர்த்தம் கண்டறிதல்',
      subtitle: 'தினசரி பஞ்சாங்க கிரக நிலைகள் மற்றும் கௌரி நல்ல நேரத்தைக் கொண்டு ஒவ்வொரு காரியத்திற்கும் உகந்த நாட்களை அறியலாம்.',
      back: 'முகப்புப்பக்கம்',
      categoryHeading: 'முகூர்த்த வகை தேர்ந்தெடுக்கவும்:',
      loading: 'சுப முகூர்த்த நேரங்கள் கணக்கிடப்படுகிறது...',
      chennaiNote: 'கணக்கீடுகள் அனைத்தும் சென்னை நேரப்படி துல்லியமாக செய்யப்பட்டுள்ளது.',
      rating: 'சுப யோகம்',
      viewDetails: 'முழு விவரங்கள் அறிய கார்டை கிளிக் செய்யவும்.',
      noDays: 'இந்த மாதத்தில் முகூர்த்தங்கள் எதுவும் இல்லை.',
    },
    en: {
      title: 'Muhurtham Finder',
      subtitle: 'Identify highly auspicious daily windows and Gowri Nalla Neram intervals customized for your life events.',
      back: 'Back to Dashboard',
      categoryHeading: 'Select Event Category:',
      loading: 'Calculating Muhurtham ratings...',
      chennaiNote: 'All astronomical calculations are resolved for Chennai timezone/coordinates.',
      rating: 'Auspiciousness',
      viewDetails: 'Click any day card to view detailed Gowri and Yama Gandam breakdown.',
      noDays: 'No auspicious windows calculated for this month.',
    },
  }[language]

  // Get active category name
  const activeCatObj = CATEGORIES.find(c => c.id === activeCategory)
  const activeCategoryLabel = isTa ? activeCatObj?.name_ta : activeCatObj?.name_en

  // Get weekday name
  const getWeekdayShort = (dayNum: number) => {
    const WEEKDAYS_TA = ['திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி', 'ஞாயிறு']
    const WEEKDAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return isTa ? WEEKDAYS_TA[dayNum] : WEEKDAYS_EN[dayNum]
  }

  // Get card border/shadow styles
  const getCardStyle = (status: string) => {
    switch (status) {
      case 'highly_auspicious':
        return 'border-green-500/40 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] bg-green-950/5'
      case 'auspicious':
        return 'border-emerald-500/30 hover:border-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.12)] bg-emerald-950/5'
      case 'average':
        return 'border-[#4a3828] hover:border-[#c9922a]/50 hover:shadow-[0_0_15px_rgba(201,146,42,0.1)]'
      default:
        return 'border-red-950/40 opacity-70 hover:opacity-100 hover:border-red-900/50 bg-red-950/5'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400'
    if (score >= 55) return 'text-emerald-400'
    if (score >= 35) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <ErrorBoundary label="Muhurtham checker failed to load.">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-6 font-sans">
      {/* Header link */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#d4b896] hover:text-[#f2c96a] transition-all text-sm"
        >
          <ArrowLeft size={16} />
          {labels.back}
        </Link>
        <span className="text-[11px] font-mono text-[#8a7060]">VERSION 4.0</span>
      </div>

      {/* Hero Intro */}
      <div className="flex flex-col gap-2 border-b border-[#4a3828] pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-[#f2c96a] tracking-tight font-display flex items-center gap-2.5">
          <Clock className="text-[#f2c96a] w-7 h-7" />
          {labels.title}
        </h1>
        <p className="text-sm text-[#d4b896] leading-relaxed max-w-[800px]">
          {labels.subtitle}
        </p>
      </div>

      {/* Category selector strip */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#8a7060]">
          {labels.categoryHeading}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isSelected = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 hover:-translate-y-0.5 ${
                  isSelected
                    ? `${cat.color} border-[#c9922a] ring-2 ring-[#c9922a]/20 scale-[1.02] shadow-lg`
                    : 'bg-[#241a0f] border-[#4a3828] text-[#8a7060] hover:text-[#f5e6c8] hover:border-[#8a7060]/50'
                }`}
              >
                <Icon className="w-6 h-6 mb-2 shrink-0" />
                <span className="text-[12px] font-bold leading-tight">
                  {isTa ? cat.name_ta : cat.name_en}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chennai location alert */}
      <div className="flex items-center gap-2 bg-[#2e2115] border border-[#4a3828] p-3.5 rounded-xl text-xs text-[#d4b896]">
        <Info className="w-4.5 h-4.5 text-[#f2c96a] shrink-0" />
        <span>{labels.chennaiNote}</span>
      </div>

      {/* Month Navigation Control strip */}
      <div className="flex items-center justify-between bg-[#241a0f] border border-[#4a3828] p-4 rounded-xl shadow-lg">
        <button
          onClick={handlePrevMonth}
          className="p-2 border border-[#4a3828] bg-[#1a1209] rounded-lg text-[#d4b896] hover:text-[#f2c96a] hover:border-[#8a7060] transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-[#f5e6c8] tracking-wide uppercase">
          {monthYearLabel}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 border border-[#4a3828] bg-[#1a1209] rounded-lg text-[#d4b896] hover:text-[#f2c96a] hover:border-[#8a7060] transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Grid Section */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-3"
          >
            <div className="w-10 h-10 border-4 border-[#c9922a] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#8a7060]">{labels.loading}</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        ) : days.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-[#8a7060] text-sm"
          >
            {labels.noDays}
          </motion.div>
        ) : (
          <motion.div
            key="calendar-grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center justify-between text-xs text-[#8a7060] px-1">
              <span>{labels.viewDetails}</span>
              <span className="font-semibold uppercase text-[#f2c96a]">
                {activeCategoryLabel}
              </span>
            </div>

            {/* Grid of days */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {days.map(dayObj => {
                const dateObj = new Date(dayObj.date)
                const dateNum = dateObj.getDate()
                const weekdayShort = getWeekdayShort(dayObj.weekday)
                const cardStyle = getCardStyle(dayObj.status)
                const scoreColor = getScoreColor(dayObj.event_score)

                return (
                  <motion.div
                    key={dayObj.date}
                    onClick={() => {
                      setSelectedDay(dayObj)
                      setIsModalOpen(true)
                    }}
                    className={`relative p-4 rounded-xl border bg-[#241a0f] cursor-pointer transition-all duration-200 hover:-translate-y-1 ${cardStyle}`}
                    whileHover={{ scale: 1.01 }}
                  >
                    {/* Header: Date and Weekday */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black text-[#f5e6c8] font-mono leading-none">
                          {dateNum}
                        </span>
                        <span className="text-[11px] font-bold text-[#8a7060] mt-1.5 uppercase">
                          {weekdayShort}
                        </span>
                      </div>

                      {/* Auspicious Rating Circle indicator */}
                      <div className="relative flex items-center justify-center w-12 h-12 shrink-0">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="19"
                            className="stroke-[#2e2115]"
                            strokeWidth="3.5"
                            fill="transparent"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="19"
                            className={scoreColor.replace('text-', 'stroke-')}
                            strokeWidth="3.5"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 19}
                            strokeDashoffset={2 * Math.PI * 19 * (1 - dayObj.event_score / 100)}
                          />
                        </svg>
                        <span className={`absolute text-[11px] font-black font-mono ${scoreColor}`}>
                          {dayObj.event_score}%
                        </span>
                      </div>
                    </div>

                    {/* Tithi & Nakshatra Summary */}
                    <div className="space-y-1 mt-4">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8a7060]">{isTa ? 'திதி:' : 'Tithi:'}</span>
                        <span className="font-bold text-[#d4b896] truncate max-w-[100px]" title={dayObj.tithi}>
                          {dayObj.tithi}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#8a7060]">{isTa ? 'நட்சத்திரம்:' : 'Star:'}</span>
                        <span className="font-bold text-[#d4b896] truncate max-w-[100px]" title={dayObj.nakshatra}>
                          {dayObj.nakshatra}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed analytics slideover drawer */}
      <MuhurthamDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        day={selectedDay}
        language={language}
        categoryName={activeCategoryLabel || ''}
      />
      </div>
    </ErrorBoundary>
  )
}
