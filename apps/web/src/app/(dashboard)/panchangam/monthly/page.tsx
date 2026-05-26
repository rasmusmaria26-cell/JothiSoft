'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  Compass,
  AlertCircle,
  RefreshCw,
  Sun,
  Moon,
  X,
  LayoutGrid,
  List
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import api from '@/lib/api'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { useLanguage } from '@/context/LanguageContext'
import { useAuthStore } from '@/store/authStore'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import { CityData } from '@/types/astro'
import { MonthlyPanchangamDay, DetailedPanchangamResponse } from '@/types/monthly'

// Default Fallback: Chennai, Tamil Nadu
const DEFAULT_CITY: CityData = {
  id: 0,
  name: 'Chennai',
  ascii_name: 'Chennai',
  state: 'Tamil Nadu',
  country: 'IN',
  latitude: 13.0827,
  longitude: 80.2707,
  utc_offset: 5.5
}

// English / Tamil Months Map
const MONTHS_MAP = [
  { value: 1, en: 'January', ta: 'ஜனவரி' },
  { value: 2, en: 'February', ta: 'பிப்ரவரி' },
  { value: 3, en: 'March', ta: 'மார்ச்' },
  { value: 4, en: 'April', ta: 'ஏப்ரல்' },
  { value: 5, en: 'May', ta: 'மே' },
  { value: 6, en: 'June', ta: 'ஜூன்' },
  { value: 7, en: 'July', ta: 'ஜூலை' },
  { value: 8, en: 'August', ta: 'ஆகஸ்ட்' },
  { value: 9, en: 'September', ta: 'செப்டம்பர்' },
  { value: 10, en: 'October', ta: 'அக்டோபர்' },
  { value: 11, en: 'November', ta: 'நவம்பர்' },
  { value: 12, en: 'December', ta: 'டிசம்பர்' }
]

const WEEKDAY_HEADERS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  ta: ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி']
}

export default function MonthlyPanchangamPage() {
  const { language } = useLanguage()
  const { user } = useAuthStore()
  const isTa = language === 'ta'

  // Current Date contexts
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1) // 1-12
  const [selectedCity, setSelectedCity] = useState<CityData>(DEFAULT_CITY)

  // Layout preference: grid vs list
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Loaded Monthly Data states
  const [daysData, setDaysData] = useState<MonthlyPanchangamDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cache: Key is 'year-month-lat-lng-tz_offset' -> MonthlyPanchangamDay[]
  const [cache, setCache] = useState<Record<string, MonthlyPanchangamDay[]>>({})

  // Day Selection state for bottom sheet
  const [activeDay, setActiveDay] = useState<MonthlyPanchangamDay | null>(null)
  const [detailedData, setDetailedData] = useState<DetailedPanchangamResponse | null>(null)
  const [isDetailLoading, setIsDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)

  // ── Translations dictionary ──────────────────────────────────────────────────
  const labels = {
    ta: {
      title: 'மாத பஞ்சாங்கம்',
      subtitle: 'தமிழ் மாத பஞ்சாங்கம் - திதி, நட்சத்திரம் மற்றும் நல்ல நேரங்கள்',
      place: 'இடம்',
      loading: 'பஞ்சாங்கம் கணிக்கப்படுகிறது...',
      errorFetch: 'மாதாந்திர பஞ்சாங்கம் கணிப்பதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
      detailedTitle: 'பஞ்சாங்கம் விவரங்கள்',
      detailedSubtitle: 'திதி, நட்சத்திரம் மற்றும் சூரிய / சந்திர பாகைகள்',
      sunrise: 'சூரிய உதயம்',
      sunset: 'சூரிய அஸ்தமனம்',
      rahuKalam: 'ராகு காலம்',
      yogam: 'யோகம்',
      karanam: 'கரணம்',
      sunLongitude: 'சூரியன் பாகை',
      moonLongitude: 'சந்திரன் பாகை',
      close: 'மூடுக',
      viewGrid: 'வடிவம்',
      viewList: 'பட்டியல்',
      monthSelect: 'மாதம்',
      yearSelect: 'வருடம்',
      amavasya: 'அமாவாசை',
      pournami: 'பௌர்ணமி',
      ekadashi: 'ஏகாதசி'
    },
    en: {
      title: 'Monthly Panchangam',
      subtitle: 'Complete monthly Vedic Panchangam grid with auspicious markers',
      place: 'Place',
      loading: 'Calculating monthly calendar...',
      errorFetch: 'Failed to fetch monthly Panchangam. Please try again.',
      detailedTitle: 'Panchangam Details',
      detailedSubtitle: 'Detailed tithi, nakshatra, and astronomical alignments',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      rahuKalam: 'Rahu Kalam',
      yogam: 'Yogam',
      karanam: 'Karanam',
      sunLongitude: 'Sun Longitude',
      moonLongitude: 'Moon Longitude',
      close: 'Close',
      viewGrid: 'Grid',
      viewList: 'List',
      monthSelect: 'Month',
      yearSelect: 'Year',
      amavasya: 'Amavasya',
      pournami: 'Pournami',
      ekadashi: 'Ekadashi'
    }
  }[language]

  // ── User coordinates sync ────────────────────────────────────────────────────
  useEffect(() => {
    async function loadSavedProfile() {
      if (!user) return
      try {
        const { data, error } = await supabase
          .from('birth_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (data && !error) {
          setSelectedCity({
            id: 0,
            name: data.place_name.split(',')[0],
            ascii_name: data.place_name.split(',')[0],
            state: data.place_name.split(',')[1]?.trim() || '',
            country: 'IN',
            latitude: Number(data.lat),
            longitude: Number(data.lng),
            utc_offset: Number(data.utc_offset || 5.5)
          })
        }
      } catch (err) {
        console.error('Failed to sync monthly coordinates:', err)
      }
    }

    loadSavedProfile()
  }, [user])

  // ── Fetch calculations ───────────────────────────────────────────────────────
  useEffect(() => {
    let active = true
    const lat = Number(selectedCity.latitude.toFixed(4))
    const lng = Number(selectedCity.longitude.toFixed(4))
    const offset = Number(selectedCity.utc_offset || 5.5)
    const cacheKey = `${year}-${month}-${lat}-${lng}-${offset}`

    // Check Cache first (TanStack staletime equivalent)
    if (cache[cacheKey]) {
      setDaysData(cache[cacheKey])
      setError(null)
      return
    }

    async function fetchMonthlyPanchangam() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await api.post<MonthlyPanchangamDay[]>('/panchangam/monthly', {
          year,
          month,
          lat,
          lng,
          utcOffset: offset,
          language: language
        })

        if (active) {
          setDaysData(data)
          // Store in local cache
          setCache(prev => ({ ...prev, [cacheKey]: data }))
        }
      } catch (err) {
        console.error('Monthly Panchangam fetch error:', err)
        if (active) {
          setError(labels.errorFetch)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    fetchMonthlyPanchangam()

    return () => {
      active = false
    }
  }, [year, month, selectedCity, cache])

  // ── Detailed Lazy Fetching on Tap ───────────────────────────────────────────
  const handleDayClick = async (day: MonthlyPanchangamDay) => {
    setActiveDay(day)
    setIsDetailLoading(true)
    setDetailedData(null)
    setDetailError(null)

    try {
      const data = await api.get<DetailedPanchangamResponse>(
        `/panchangam/detailed?date=${day.date}&lat=${selectedCity.latitude}&lng=${selectedCity.longitude}&tz_offset=${selectedCity.utc_offset || 5.5}&language=${language}`
      )
      setDetailedData(data)
    } catch (err) {
      console.error('Lazy loading daily detail error:', err)
      setDetailError(isTa ? 'விவரங்களை ஏற்றுவதில் பிழை ஏற்பட்டது.' : 'Failed to load astronomical coordinates.')
    } finally {
      setIsDetailLoading(false)
    }
  }

  // ── Month Navigation (Handling Year Boundaries - Issue 6) ───────────────────
  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear(y => y - 1)
    } else {
      setMonth(m => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear(y => y + 1)
    } else {
      setMonth(m => m + 1)
    }
  }

  const getPakshaStyles = (paksha: 'shukla' | 'krishna') => {
    if (paksha === 'shukla') {
      return {
        className: 'bg-emerald-100/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 font-bold',
        style: { color: 'var(--success)' }
      }
    }
    return {
      className: 'bg-amber-100/90 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/20 font-bold',
      style: { color: 'var(--warning)' }
    }
  }

  const getTithiSpecialStyles = (tithi: string) => {
    const l = tithi.toLowerCase()
    if (l === 'amavasya') {
      return {
        className: 'bg-red-100 dark:bg-red-950/45 border border-red-300 dark:border-red-500/40 shadow-sm font-bold',
        style: { color: 'var(--danger)' }
      }
    } else if (l === 'purnima') {
      return {
        className: 'bg-amber-100 dark:bg-yellow-950/45 border border-amber-300 dark:border-[#c9922a]/40 shadow-sm font-bold',
        style: { color: 'var(--warning)' }
      }
    } else if (l === 'ekadashi') {
      return {
        className: 'bg-emerald-100 dark:bg-emerald-950/45 border border-emerald-300 dark:border-emerald-400/40 shadow-sm font-bold',
        style: { color: 'var(--success)' }
      }
    }
    return null
  }

  const getDayLabel = (tithi: string) => {
    const l = tithi.toLowerCase()
    if (l === 'amavasya') return labels.amavasya
    if (l === 'purnima') return labels.pournami
    if (l === 'ekadashi') return labels.ekadashi
    return null
  }

  // ── Calendar Grid Math ──────────────────────────────────────────────────────
  const firstDayOffset = new Date(year, month - 1, 1).getDay() // 0 = Sunday
  const daysInMonth = new Date(year, month, 0).getDate()

  // Generate spacers for offset
  const gridSpacers = Array.from({ length: firstDayOffset }, (_, i) => i)

  return (
    <ErrorBoundary label="Monthly Panchangam failed to load.">
      <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6">
      
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gold-bright flex items-center gap-2">
            <CalendarDays className="h-5 sm:h-7 w-5 sm:w-7 text-gold-mid animate-pulse" style={{ color: 'var(--cat-panchangam)' }} />
            {labels.title}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl leading-relaxed">
            {labels.subtitle}
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex gap-2 self-start md:self-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'border-gold-mid bg-gold-deep/10 text-gold-bright font-bold'
                : 'border-bg-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <LayoutGrid size={14} />
            {labels.viewGrid}
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'border-gold-mid bg-gold-deep/10 text-gold-bright font-bold'
                : 'border-bg-border text-text-secondary hover:text-text-primary'
            }`}
          >
            <List size={14} />
            {labels.viewList}
          </button>
        </div>
      </div>

      {/* Date Navigation & Settings Bar */}
      <div
        className="rounded-xl border p-4 mb-6 flex flex-col lg:flex-row items-center gap-4 justify-between"
        style={{
          background: 'var(--bg-card)',
          borderColor: 'var(--bg-border)'
        }}
      >
        {/* Month / Year Toggles */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <button
            onClick={handlePrevMonth}
            className="p-2 border border-bg-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            {/* Month Select */}
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="bg-bg-elevated border border-bg-border rounded-lg px-3 py-1.5 text-xs sm:text-sm text-text-primary font-bold focus:outline-none focus:border-gold-mid transition-all"
              style={{ background: 'var(--bg-elevated)' }}
            >
              {MONTHS_MAP.map((m) => (
                <option key={m.value} value={m.value}>
                  {isTa ? m.ta : m.en}
                </option>
              ))}
            </select>

            {/* Year Select */}
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-bg-elevated border border-bg-border rounded-lg px-3 py-1.5 text-xs sm:text-sm text-text-primary font-bold focus:outline-none focus:border-gold-mid transition-all"
              style={{ background: 'var(--bg-elevated)' }}
            >
              {Array.from({ length: 16 }, (_, i) => 2020 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 border border-bg-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Location Override Search */}
        <div className="w-full lg:w-80">
          <PlaceSearch
            onSelect={setSelectedCity}
            selectedCity={selectedCity}
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <AnimatePresence mode="wait">
        {isLoading && daysData.length === 0 ? (
          <div className="py-24 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-gold-mid" style={{ color: 'var(--cat-panchangam)' }} />
            {labels.loading}
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-3 justify-center">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : (
          <motion.div
            key={`${year}-${month}-${viewMode}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {/* GRID VIEW (Desktop/Tablet) */}
            {viewMode === 'grid' && (
              <div className="hidden md:block rounded-xl border border-[var(--bg-border)] overflow-hidden">
                {/* Calendar Headers */}
                <div 
                  className="grid grid-cols-7 border-b text-center py-3 text-xs font-bold text-[var(--gold-deep)] tracking-wider uppercase"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--bg-border)'
                  }}
                >
                  {WEEKDAY_HEADERS[language].map((h) => (
                    <div key={h}>{h}</div>
                  ))}
                </div>

                {/* Grid Cells */}
                <div className="grid grid-cols-7 bg-[var(--bg-border)] gap-[1px]">
                  {/* Empty offsets */}
                  {gridSpacers.map((offset) => (
                    <div 
                      key={`spacer-${offset}`} 
                      className="min-h-[110px] p-2"
                      style={{ background: 'var(--bg-page)' }}
                    />
                  ))}

                  {/* Days */}
                  {daysData.map((day, idx) => {
                    const dateNum = idx + 1
                    const specialLabel = getDayLabel(day.tithi)

                    return (
                      <div
                        key={day.date}
                        onClick={() => handleDayClick(day)}
                        className="min-h-[120px] p-2.5 transition-all duration-200 hover:bg-[var(--bg-active)] hover:scale-[1.01] flex flex-col justify-between cursor-pointer relative border-b border-r"
                        style={{
                          background: 'var(--bg-card)',
                          borderColor: 'var(--bg-border)'
                        }}
                      >
                        {/* Day Card Header */}
                        <div className="flex items-center justify-between">
                          <span 
                            className={`text-xs px-2 py-0.5 rounded-full ${getPakshaStyles(day.paksha).className}`}
                            style={getPakshaStyles(day.paksha).style}
                          >
                            {isTa ? day.paksha_ta.split(' ')[0] : day.paksha.toUpperCase()}
                          </span>
                          <span className="text-sm font-mono font-bold text-[var(--text-primary)]">
                            {dateNum}
                          </span>
                        </div>

                        {/* Badges / Text summary */}
                        <div className="mt-3 flex flex-col gap-1.5">
                          {/* Tithi Badge */}
                          {(() => {
                            const special = getTithiSpecialStyles(day.tithi)
                            if (special) {
                              return (
                                <div 
                                  className={`text-[10px] sm:text-xs truncate rounded px-1.5 py-0.5 max-w-full ${special.className}`}
                                  style={special.style}
                                >
                                  {isTa ? day.tithi_ta : day.tithi}
                                </div>
                              )
                            }
                            return (
                              <div className="text-[10px] sm:text-xs font-bold truncate rounded px-1.5 py-0.5 max-w-full text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--bg-border)]">
                                {isTa ? day.tithi_ta : day.tithi}
                              </div>
                            )
                          })()}

                          {/* Nakshatra Badge */}
                          <div className="text-[10px] sm:text-xs text-[var(--text-secondary)] truncate bg-[var(--bg-active)] border border-[var(--bg-border)] rounded px-1.5 py-0.5 font-medium">
                            {isTa ? day.nakshatra_ta : day.nakshatra}
                          </div>
                        </div>

                        {/* Special marker visual indicator */}
                        {specialLabel && (
                          <div className="absolute bottom-2 right-2 h-2 w-2 rounded-full bg-gold-mid animate-pulse" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* LIST VIEW (Mobile/Fallbacks) */}
            {(viewMode === 'list' || typeof window !== 'undefined' && window.innerWidth < 768) && (
              <div className="md:hidden space-y-3">
                {daysData.map((day, idx) => {
                  const dateNum = idx + 1
                  const specialLabel = getDayLabel(day.tithi)

                  return (
                    <div
                      key={day.date}
                      onClick={() => handleDayClick(day)}
                      className="rounded-xl border p-3 flex items-center justify-between gap-3 active:scale-[0.98] transition-all cursor-pointer"
                      style={{
                        background: 'var(--bg-card)',
                        borderColor: 'var(--bg-border)'
                      }}
                    >
                      {/* Left side date indicator */}
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-10 w-10 rounded-lg flex flex-col items-center justify-center font-mono font-bold text-[var(--text-primary)]"
                          style={{ background: 'rgba(201, 146, 42, 0.1)' }}
                        >
                          <span className="text-base leading-none">{dateNum}</span>
                          <span className="text-[8px] uppercase tracking-wider text-text-muted mt-0.5">
                            {isTa ? day.day_of_week_ta.substring(0, 3) : day.day_of_week.substring(0, 3)}
                          </span>
                        </div>

                        <div>
                          {/* Tithi name and Nakshatra name list */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {(() => {
                              const special = getTithiSpecialStyles(day.tithi)
                              if (special) {
                                return (
                                  <span 
                                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded border ${special.className}`}
                                    style={special.style}
                                  >
                                    {isTa ? day.tithi_ta : day.tithi}
                                  </span>
                                )
                              }
                              return (
                                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded border text-[var(--text-primary)] bg-[var(--bg-elevated)] border-[var(--bg-border)]">
                                  {isTa ? day.tithi_ta : day.tithi}
                                </span>
                              )
                            })()}
                            <span className="text-[11px] text-[var(--text-secondary)] bg-[var(--bg-active)] px-1.5 py-0.5 rounded font-medium border border-[var(--bg-border)]">
                              {isTa ? day.nakshatra_ta : day.nakshatra}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1">
                            <span 
                              className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-full font-bold"
                              style={{
                                ...getPakshaStyles(day.paksha).style,
                                background: getPakshaStyles(day.paksha).className.includes('emerald') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                border: `1px solid ${getPakshaStyles(day.paksha).className.includes('emerald') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                              }}
                            >
                              {isTa ? day.paksha_ta : `${day.paksha} paksha`}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side indicators */}
                      <div className="flex items-center gap-2">
                        {specialLabel && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-gold-deep/20 border border-gold-mid/30 text-gold-bright">
                            {specialLabel}
                          </span>
                        )}
                        <ChevronRight size={14} className="text-text-muted" />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Premium Details Bottom Sheet Modal (Framer Motion) ───────────────── */}
      <AnimatePresence>
        {activeDay && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDay(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over sheet panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xl rounded-t-2xl border-t p-5 overflow-hidden shadow-2xl z-10"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--bg-border)'
              }}
            >
              {/* Top notch */}
              <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-4" />

              {/* Close Button */}
              <button
                onClick={() => setActiveDay(null)}
                className="absolute top-4 right-4 p-2 bg-white/5 border border-white/5 hover:bg-white/10 rounded-full text-text-secondary hover:text-text-primary transition-all cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Day Header details */}
              <div className="mb-6">
                <span 
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${getPakshaStyles(activeDay.paksha).className}`}
                  style={getPakshaStyles(activeDay.paksha).style}
                >
                  {isTa ? activeDay.paksha_ta : `${activeDay.paksha.toUpperCase()} PAKSHA`}
                </span>

                <h2 className="text-xl sm:text-2xl font-bold text-gold-bright mt-2">
                  {isTa ? activeDay.day_of_week_ta : activeDay.day_of_week}, {activeDay.date}
                </h2>
                <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
                  <MapPin size={12} className="text-gold-mid" />
                  {selectedCity.name}, {selectedCity.state} ({isTa ? 'நேரம்' : 'Offset'}: {selectedCity.utc_offset > 0 ? '+' : ''}{selectedCity.utc_offset} hrs)
                </p>
              </div>

              {/* Details Loading indicator */}
              <AnimatePresence mode="wait">
                {isDetailLoading ? (
                  <div className="py-12 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="h-6 w-6 animate-spin text-gold-mid" style={{ color: 'var(--cat-panchangam)' }} />
                    {isTa ? 'சூரிய/சந்திர நிலைகள் கணிக்கப்படுகின்றன...' : 'Resolving planetary alignments...'}
                  </div>
                ) : detailError ? (
                  <div className="p-3 text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{detailError}</span>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {/* Primary Timing Cards (Sunrise, Sunset, Rahu Kalam) */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl flex flex-col justify-between">
                        <span className="text-[9px] uppercase font-bold text-text-muted block">
                          {labels.sunrise}
                        </span>
                        <div className="flex items-center gap-1 text-gold-bright mt-1">
                          <Sun size={14} className="text-yellow-400" />
                          <span className="text-sm font-mono font-bold">{activeDay.sunrise}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl flex flex-col justify-between">
                        <span className="text-[9px] uppercase font-bold text-text-muted block">
                          {labels.sunset}
                        </span>
                        <div className="flex items-center gap-1 text-gold-bright mt-1">
                          <Moon size={14} className="text-blue-400" />
                          <span className="text-sm font-mono font-bold">{activeDay.sunset}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex flex-col justify-between">
                        <span className="text-[9px] uppercase font-bold text-red-400 block">
                          {labels.rahuKalam}
                        </span>
                        <div className="flex items-center gap-1 text-red-400 mt-1">
                          <Clock size={14} />
                          <span className="text-sm font-mono font-bold">
                            {activeDay.rahu_kalam.start} - {activeDay.rahu_kalam.end}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Tithi & Nakshatra indices */}
                    <div className="p-4 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-xl space-y-3">
                      <div className="flex justify-between border-b border-[var(--bg-border)] pb-2">
                        <span className="text-xs text-text-secondary">{isTa ? 'திதி' : 'Tithi'}</span>
                        <span className="text-xs font-bold text-gold-bright">
                          {isTa ? activeDay.tithi_ta : activeDay.tithi} (Index: {activeDay.tithi_index})
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-[var(--bg-border)] pb-2">
                        <span className="text-xs text-text-secondary">{isTa ? 'நட்சத்திரம்' : 'Nakshatra'}</span>
                        <span className="text-xs font-bold text-gold-bright">
                          {isTa ? activeDay.nakshatra_ta : activeDay.nakshatra} (Index: {activeDay.nakshatra_index})
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-[var(--bg-border)] pb-2">
                        <span className="text-xs text-text-secondary">{labels.yogam}</span>
                        <span className="text-xs font-bold text-text-primary">
                          {isTa ? activeDay.yogam_ta : activeDay.yogam}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-xs text-text-secondary">{labels.karanam}</span>
                        <span className="text-xs font-bold text-text-primary">
                          {isTa ? activeDay.karanam_ta : activeDay.karanam}
                        </span>
                      </div>
                    </div>

                    {/* Planetary Coordinates (Lazily loaded) */}
                    {detailedData && (
                      <div className="p-4 bg-[var(--bg-active)] border border-[var(--bg-border)] rounded-xl">
                        <h4 className="text-xs font-bold text-gold-bright mb-3 flex items-center gap-1.5">
                          <Compass size={13} className="text-gold-mid" />
                          {isTa ? 'சூரிய / சந்திர பாகை நிலைகள்' : 'Planetary Coordinates'}
                        </h4>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-2.5 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-lg flex items-center justify-between">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-text-muted block">
                                {labels.sunLongitude}
                              </span>
                              <span className="text-xs font-mono font-bold text-text-primary mt-0.5 block">
                                {detailedData.sun_longitude}°
                              </span>
                            </div>
                            <Sun size={16} className="text-yellow-400 opacity-60" />
                          </div>

                          <div className="p-2.5 bg-[var(--bg-elevated)] border border-[var(--bg-border)] rounded-lg flex items-center justify-between">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-text-muted block">
                                {labels.moonLongitude}
                              </span>
                              <span className="text-xs font-mono font-bold text-text-primary mt-0.5 block">
                                {detailedData.moon_longitude}°
                              </span>
                            </div>
                            <Moon size={16} className="text-blue-400 opacity-60" />
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Close Action footer */}
              <button
                onClick={() => setActiveDay(null)}
                className="mt-6 w-full py-2.5 bg-gold-deep border border-gold-mid/30 text-[#fff] text-xs font-bold tracking-wider rounded-lg hover:bg-gold-mid transition-all cursor-pointer text-center uppercase"
              >
                {labels.close}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}
