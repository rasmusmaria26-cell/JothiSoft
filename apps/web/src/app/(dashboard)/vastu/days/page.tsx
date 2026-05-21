'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, ArrowLeft, Clock, Sparkles, CheckCircle2, AlertTriangle, Home, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import api from '@/lib/api'

interface VastuActivity {
  name_en: string
  name_ta: string
  start: string
  end: string
  auspicious: boolean
  highly_auspicious?: boolean
}

interface VastuWindow {
  start: string
  end: string
  label_en: string
  label_ta: string
}

interface VastuDay {
  id: number
  tamil_month: string
  tamil_month_ta: string
  tamil_date: string
  gregorian_date: string
  day_of_week: string
  day_of_week_ta: string
  waking_time: string
  waking_time_end: string
  activities: VastuActivity[]
  auspicious_window: VastuWindow
  highly_auspicious_window: VastuWindow
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
}

export default function VastuDaysPage() {
  const { language } = useLanguage()
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear)
  const [days, setDays] = useState<VastuDay[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  const labels = {
    ta: {
      title: 'வாஸ்து நாட்கள்',
      subtitle: 'ஆண்டு முழுவதும் கட்டுமான, பூமி பூஜை மற்றும் வீட்டு பிரவேசத்திற்கான சுப நேரங்கள்.',
      year: 'ஆண்டு',
      loading: 'வாஸ்து நாட்கள் ஏற்றப்படுகின்றன...',
      noData: 'இந்த ஆண்டிற்கான வாஸ்து நாட்கள் கிடைக்கவில்லை.',
      error: 'தரவு பெறுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.',
      auspicious: 'சுப நேரம்',
      highlyAuspicious: 'மிகவும் சுப நேரம்',
      activities: 'செயல்பாட்டு அட்டவணை',
      bhoomiPooja: 'பூமி பூஜை',
      viewActivities: 'அட்டவணை காண',
      hideActivities: 'மறை',
      good: 'சுபம்',
      notGood: 'அசுபம்',
    },
    en: {
      title: 'Vastu Days',
      subtitle: 'Year-round schedule of auspicious Vastu days for construction, Bhoomi Pooja, and Grihapravesam timings.',
      year: 'Year',
      loading: 'Loading Vastu days...',
      noData: 'No Vastu days available for this year.',
      error: 'Error loading data. Please try again.',
      auspicious: 'Auspicious Window',
      highlyAuspicious: 'Highly Auspicious',
      activities: 'Activity Schedule',
      bhoomiPooja: 'Bhoomi Pooja',
      viewActivities: 'View Schedule',
      hideActivities: 'Hide',
      good: 'Auspicious',
      notGood: 'Inauspicious',
    }
  }[language]

  useEffect(() => {
    fetchVastuDays()
  }, [year])

  const fetchVastuDays = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.get<{ success: boolean; data: VastuDay[] }>(`/vastu/days?year=${year}`)
      setDays(data.data || [])
    } catch (err: any) {
      setError(labels.error)
      setDays([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-IN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const isUpcoming = (dateStr: string) => new Date(dateStr) >= new Date()

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-1">
        <Link
          href="/vastu"
          className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-gold-bright transition-colors w-fit mb-2"
        >
          <ArrowLeft size={14} />
          {language === 'ta' ? 'வாஸ்து' : 'Vastu'}
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: 'rgba(201, 146, 42, 0.15)', border: '1px solid rgba(201, 146, 42, 0.3)' }}
          >
            <Calendar size={22} className="text-gold-bright" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-text-primary">{labels.title}</h1>
            <p className="text-[13px] text-text-muted mt-0.5 max-w-xl">{labels.subtitle}</p>
          </div>
        </div>
      </motion.div>

      {/* Year Selector */}
      <motion.div variants={item}>
        <div
          className="inline-flex items-center gap-3 p-3 rounded-xl"
          style={{ background: '#2e2115', border: '1px solid rgba(201, 146, 42, 0.3)' }}
        >
          <label className="text-[13px] font-semibold text-text-muted">{labels.year}:</label>
          <div className="flex items-center gap-1">
            {[currentYear - 1, currentYear, currentYear + 1].map(y => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${year === y
                    ? 'text-[#1a1209] shadow-md'
                    : 'text-text-secondary hover:text-text-primary'
                  }`}
                style={year === y ? { background: '#c9922a' } : {}}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="h-28 rounded-2xl animate-pulse"
                style={{ background: 'rgba(201, 146, 42, 0.08)' }}
              />
            ))}
            <p className="text-center text-[13px] text-text-muted">{labels.loading}</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 p-4 rounded-xl text-red-300 text-[14px]"
            style={{ background: 'rgba(255, 50, 50, 0.08)', border: '1px solid rgba(255, 50, 50, 0.2)' }}
          >
            <AlertTriangle size={16} />
            {error}
          </motion.div>
        ) : days.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-text-muted text-[14px]"
          >
            {labels.noData}
          </motion.div>
        ) : (
          <motion.div
            key="days"
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            {days.map((day) => {
              const upcoming = isUpcoming(day.gregorian_date)
              const isExpanded = expandedDay === day.id
              return (
                <motion.div key={day.id} variants={item}>
                  <div
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: '#2e2115',
                      border: upcoming
                        ? '1px solid rgba(201, 146, 42, 0.5)'
                        : '1px solid rgba(201, 146, 42, 0.2)',
                      boxShadow: upcoming ? '0 0 20px rgba(201, 146, 42, 0.08)' : 'none'
                    }}
                  >
                    {/* Day Header */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Date Badge */}
                          <div
                            className="flex flex-col items-center justify-center w-16 h-16 rounded-xl shrink-0"
                            style={{ background: upcoming ? 'rgba(201, 146, 42, 0.15)' : 'rgba(255,255,255,0.04)' }}
                          >
                            <span className="text-[11px] text-text-muted font-medium">
                              {new Date(day.gregorian_date).toLocaleString('en', { month: 'short' })}
                            </span>
                            <span className="text-[26px] font-black leading-tight" style={{ color: upcoming ? '#c9922a' : '#888' }}>
                              {new Date(day.gregorian_date).getDate()}
                            </span>
                            <span className="text-[10px] text-text-muted">
                              {new Date(day.gregorian_date).getFullYear()}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[16px] font-bold text-text-primary">
                                {language === 'ta' ? day.day_of_week_ta : day.day_of_week}
                              </span>
                              {upcoming && (
                                <span
                                  className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                                  style={{ background: 'rgba(201, 146, 42, 0.2)', color: '#c9922a' }}
                                >
                                  <Sparkles size={9} className="inline mr-1" />
                                  {language === 'ta' ? 'வரவிருக்கும்' : 'Upcoming'}
                                </span>
                              )}
                            </div>
                            <p className="text-[13px] text-text-muted">
                              {language === 'ta' ? day.tamil_date : `${day.tamil_month} · ${formatDate(day.gregorian_date)}`}
                            </p>

                            {/* Auspicious windows */}
                            <div className="flex flex-wrap gap-2 mt-1">
                              <div
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px]"
                                style={{ background: 'rgba(42, 172, 138, 0.12)', border: '1px solid rgba(42, 172, 138, 0.3)' }}
                              >
                                <Clock size={11} className="text-emerald-400" />
                                <span className="text-emerald-300 font-semibold">{labels.auspicious}:</span>
                                <span className="text-emerald-200">{day.auspicious_window.start} – {day.auspicious_window.end}</span>
                              </div>

                              {day.highly_auspicious_window && (
                                <div
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px]"
                                  style={{ background: 'rgba(201, 146, 42, 0.12)', border: '1px solid rgba(201, 146, 42, 0.4)' }}
                                >
                                  <Sparkles size={11} className="text-gold-bright" />
                                  <span className="text-gold-bright font-semibold">{labels.highlyAuspicious}:</span>
                                  <span className="text-gold-mid">{day.highly_auspicious_window.start} – {day.highly_auspicious_window.end}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Expand button */}
                        <button
                          onClick={() => setExpandedDay(isExpanded ? null : day.id)}
                          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors cursor-pointer"
                          style={{
                            background: isExpanded ? 'rgba(201, 146, 42, 0.2)' : 'rgba(255,255,255,0.05)',
                            color: isExpanded ? '#c9922a' : '#888',
                            border: '1px solid rgba(255,255,255,0.08)'
                          }}
                        >
                          {isExpanded ? (
                            <><ChevronUp size={13} /> {labels.hideActivities}</>
                          ) : (
                            <><ChevronDown size={13} /> {labels.viewActivities}</>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Activity Schedule */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div
                            className="px-5 pb-5"
                            style={{ borderTop: '1px solid rgba(201, 146, 42, 0.15)' }}
                          >
                            <p className="text-[12px] font-semibold text-text-muted mt-4 mb-3 uppercase tracking-wider">
                              {labels.activities}
                            </p>
                            <div className="flex flex-col gap-2">
                              {day.activities.map((act, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between p-3 rounded-xl"
                                  style={{
                                    background: act.highly_auspicious
                                      ? 'rgba(201, 146, 42, 0.12)'
                                      : act.auspicious
                                        ? 'rgba(42, 172, 138, 0.08)'
                                        : 'rgba(255,255,255,0.03)',
                                    border: act.highly_auspicious
                                      ? '1px solid rgba(201, 146, 42, 0.3)'
                                      : act.auspicious
                                        ? '1px solid rgba(42, 172, 138, 0.2)'
                                        : '1px solid rgba(255,255,255,0.06)'
                                  }}
                                >
                                  <div className="flex items-center gap-2.5">
                                    {act.highly_auspicious ? (
                                      <Sparkles size={14} className="text-gold-bright" />
                                    ) : act.auspicious ? (
                                      <CheckCircle2 size={14} className="text-emerald-400" />
                                    ) : (
                                      <div className="w-3.5 h-3.5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
                                    )}
                                    <span className={`text-[13px] font-medium ${act.highly_auspicious ? 'text-gold-bright' : act.auspicious ? 'text-emerald-300' : 'text-text-secondary'}`}>
                                      {language === 'ta' ? act.name_ta : act.name_en}
                                    </span>
                                  </div>
                                  <span className="text-[12px] text-text-muted font-mono">
                                    {act.start} – {act.end}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Auspicious note */}
                            {day.highly_auspicious_window && (
                              <div
                                className="mt-4 p-3 rounded-xl text-[12px] leading-relaxed"
                                style={{ background: 'rgba(201, 146, 42, 0.1)', border: '1px solid rgba(201, 146, 42, 0.25)' }}
                              >
                                <Sparkles size={13} className="text-gold-bright inline mr-1.5 mb-0.5" />
                                <span className="text-gold-mid">
                                  {language === 'ta'
                                    ? day.highly_auspicious_window.label_ta
                                    : day.highly_auspicious_window.label_en}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
