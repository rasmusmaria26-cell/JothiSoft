'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, ArrowLeft, RefreshCw, Hash, Calendar, Clock, ChevronDown, ChevronUp, Info, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import api from '@/lib/api'
import ErrorBoundary from '@/components/common/ErrorBoundary'

interface NumerologyResponse {
  name: string
  dob: string
  name_number: { raw: number, number: number, name: string }
  life_path: { raw: number, number: number, dob: string }
  soul_urge: { raw: number, number: number }
  destiny: { raw: number, number: number }
}

export default function NumerologyPage() {
  const { language } = useLanguage()
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<NumerologyResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Widget state
  const [showAgeCalc, setShowAgeCalc] = useState(false)

  const labels = {
    ta: {
      title: "எண்கணிதம் (Numerology)",
      subtitle: "சால்டியன் (Chaldean) முறைப்படி உங்கள் பெயர் மற்றும் பிறந்த தேதிக்கான எண்கணித பலன்களை அறியலாம்.",
      name: "முழு பெயர் (ஆங்கிலம் அல்லது தமிழில்)",
      namePlaceholder: "எ.கா. கார்த்திக் / Karthik",
      dob: "பிறந்த தேதி",
      buttonCheck: "எண்கணிதம் கணக்கிடு",
      buttonReset: "புதிய கணக்கீடு",
      calculating: "கணக்கிடப்படுகிறது...",
      errorMessage: "பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
      resultsTitle: "எண்கணித முடிவுகள்",
      nameNumberTitle: "பெயர் எண்",
      nameNumberDesc: "உங்கள் பெயரின் ஒட்டுமொத்த சக்தி மற்றும் வெளிப்பாடு.",
      lifePathTitle: "பிறந்த தேதி எண் (Life Path)",
      lifePathDesc: "உங்கள் வாழ்க்கைப் பாதை மற்றும் விதி அமைப்புகள்.",
      soulUrgeTitle: "உள்மன எண் (Soul Urge)",
      soulUrgeDesc: "உயிரெழுத்துகளின் கூட்டுத்தொகை. உங்கள் உள்மன ஆசைகள்.",
      destinyTitle: "விதி எண் (Destiny / Personality)",
      destinyDesc: "மெய்யெழுத்துகளின் கூட்டுத்தொகை. மற்றவர்கள் உங்களை எப்படி பார்க்கிறார்கள்.",
      ageCalcTitle: "வயது கணக்கீடு (Age Calculator)",
      ageCalcDesc: "உங்கள் துல்லியமான வயது மற்றும் நாட்கள்.",
      ageYears: "ஆண்டுகள்",
      ageMonths: "மாதங்கள்",
      ageDays: "நாட்கள்",
      totalDays: "வாழ்ந்த மொத்த நாட்கள்",
      nextBday: "அடுத்த பிறந்தநாள்",
      daysLeft: "நாட்களில்",
    },
    en: {
      title: "Numerology",
      subtitle: "Discover your Chaldean Name Number, Life Path, Soul Urge, and Destiny numbers.",
      name: "Full Name (English or Tamil)",
      namePlaceholder: "e.g. Karthik",
      dob: "Date of Birth",
      buttonCheck: "Calculate Numerology",
      buttonReset: "Calculate Another",
      calculating: "Calculating...",
      errorMessage: "An error occurred. Please try again.",
      resultsTitle: "Numerology Results",
      nameNumberTitle: "Expression Number",
      nameNumberDesc: "The overall energy and expression of your name.",
      lifePathTitle: "Life Path Number",
      lifePathDesc: "Your core traits, life journey, and destiny path.",
      soulUrgeTitle: "Soul Urge Number",
      soulUrgeDesc: "The sum of vowels. Represents inner desires and heart.",
      destinyTitle: "Personality Number",
      destinyDesc: "The sum of consonants. How others perceive you.",
      ageCalcTitle: "Age Calculator Widget",
      ageCalcDesc: "Calculate your exact age and total days lived.",
      ageYears: "Years",
      ageMonths: "Months",
      ageDays: "Days",
      totalDays: "Total Days Lived",
      nextBday: "Next Birthday",
      daysLeft: "days left",
    }
  }[language]

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !dob) {
      setError(language === 'ta' ? 'பெயர் மற்றும் பிறந்த தேதியை உள்ளிடவும்.' : 'Please enter Name and Date of Birth.')
      return
    }

    setIsCalculating(true)
    setError(null)

    try {
      const response = await api.post('/numerology/calculate', { name, dob })
      if (!response) throw new Error('API failed')
      setResult(response as any)
    } catch (err) {
      console.error(err)
      setError(labels.errorMessage)
    } finally {
      setIsCalculating(false)
    }
  }

  // --- Age Calculation Utility ---
  const calculateAgeDetails = (dobString: string) => {
    if (!dobString) return null
    const birthDate = new Date(dobString)
    const today = new Date()
    
    if (isNaN(birthDate.getTime())) return null

    let years = today.getFullYear() - birthDate.getFullYear()
    let months = today.getMonth() - birthDate.getMonth()
    let days = today.getDate() - birthDate.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0)
      days += prevMonth.getDate()
    }
    
    if (months < 0) {
      years--
      months += 12
    }

    // Total days lived
    const totalDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24))

    // Next birthday countdown
    const nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())
    if (today.getTime() > nextBday.getTime()) {
      nextBday.setFullYear(today.getFullYear() + 1)
    }
    const daysToNextBday = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    return { years, months, days, totalDays, daysToNextBday }
  }

  const ageDetails = dob ? calculateAgeDetails(dob) : null

  return (
    <ErrorBoundary label="Numerology calculator failed to load.">
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
        <h1 className="text-[24px] font-semibold text-[#1e6fa8] dark:text-[#80c8ff] tracking-tight font-playfair flex items-center gap-2.5">
          <Hash className="text-[#1e6fa8] dark:text-[#80c8ff]" size={24} />
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
            {/* Input Form */}
            <form onSubmit={handleCalculate} className="bg-bg-card border border-bg-border rounded-xl p-5 md:p-6 shadow-xl flex flex-col gap-5 max-w-[600px] mx-auto w-full">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-text-secondary">{labels.name}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={labels.namePlaceholder}
                    className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3.5 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] text-text-secondary">{labels.dob}</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none [color-scheme:dark]"
                  />
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
                className="w-full h-12 bg-gold-mid hover:bg-gold-deep text-text-inverse font-semibold rounded-lg flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 text-[15px] mt-2"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    <span>{labels.calculating}</span>
                  </>
                ) : (
                  <>
                    <Calculator size={18} />
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
                <span className="text-[14px] text-text-muted">{result.name}</span>
                <span className="text-[16px] font-semibold text-text-primary font-mono">{result.dob}</span>
              </div>
              <button
                onClick={() => setResult(null)}
                className="bg-bg-page border border-gold-mid rounded-full px-5 py-2 text-[13px] text-text-primary hover:bg-[var(--bg-active)] font-semibold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw size={15} />
                {labels.buttonReset}
              </button>
            </div>

            {/* Numerology Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Name Number (Expression) */}
              <div className="bg-bg-card border border-[#c9922a]/40 rounded-xl p-5 shadow-xl flex items-start gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 rounded-full bg-gold-deep/20 border border-gold-deep flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(201,146,42,0.2)]">
                  <span className="text-[28px] font-bold text-gold-bright font-mono">{result.name_number.number}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[16px] font-semibold text-gold-bright">{labels.nameNumberTitle}</h3>
                  <span className="text-[12px] text-text-muted font-mono uppercase">Raw sum: {result.name_number.raw}</span>
                  <p className="text-[13px] text-text-secondary leading-relaxed mt-1">
                    {labels.nameNumberDesc}
                  </p>
                </div>
              </div>

              {/* Life Path Number */}
              <div className="bg-bg-card border border-[#1e6fa8]/40 rounded-xl p-5 shadow-xl flex items-start gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 rounded-full bg-[#1e6fa8]/20 border border-[#1e6fa8] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(30,111,168,0.2)]">
                  <span className="text-[28px] font-bold text-blue-600 dark:text-[#80c8ff] font-mono">{result.life_path.number}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[16px] font-semibold text-blue-600 dark:text-[#80c8ff]">{labels.lifePathTitle}</h3>
                  <span className="text-[12px] text-text-muted font-mono uppercase">Raw sum: {result.life_path.raw}</span>
                  <p className="text-[13px] text-text-secondary leading-relaxed mt-1">
                    {labels.lifePathDesc}
                  </p>
                </div>
              </div>

              {/* Soul Urge Number */}
              <div className="bg-bg-card border border-[#b0415e]/40 rounded-xl p-5 shadow-xl flex items-start gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 rounded-full bg-[#b0415e]/20 border border-[#b0415e] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(176,65,94,0.2)]">
                  <span className="text-[28px] font-bold text-rose-600 dark:text-[#ff90aa] font-mono">{result.soul_urge.number}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[16px] font-semibold text-rose-600 dark:text-[#ff90aa]">{labels.soulUrgeTitle}</h3>
                  <span className="text-[12px] text-text-muted font-mono uppercase">Raw sum: {result.soul_urge.raw}</span>
                  <p className="text-[13px] text-text-secondary leading-relaxed mt-1">
                    {labels.soulUrgeDesc}
                  </p>
                </div>
              </div>

              {/* Destiny Number */}
              <div className="bg-bg-card border border-[#4a7c59]/40 rounded-xl p-5 shadow-xl flex items-start gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 rounded-full bg-[#4a7c59]/20 border border-[#4a7c59] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(74,124,89,0.2)]">
                  <span className="text-[28px] font-bold text-emerald-600 dark:text-[#6ee7a0] font-mono">{result.destiny.number}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[16px] font-semibold text-emerald-600 dark:text-[#6ee7a0]">{labels.destinyTitle}</h3>
                  <span className="text-[12px] text-text-muted font-mono uppercase">Raw sum: {result.destiny.raw}</span>
                  <p className="text-[13px] text-text-secondary leading-relaxed mt-1">
                    {labels.destinyDesc}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Age Calculator Inline Utility (always visible if dob is present) */}
      <AnimatePresence>
        {dob && ageDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[var(--bg-card)] border border-[var(--bg-border)] rounded-xl mt-2 flex flex-col">
              <button 
                type="button"
                onClick={() => setShowAgeCalc(!showAgeCalc)}
                className="w-full flex items-center justify-between p-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-deep rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <Clock size={18} className="text-gold-bright" />
                  <span className="font-semibold text-text-primary text-[14px]">{labels.ageCalcTitle}</span>
                </div>
                {showAgeCalc ? <ChevronUp size={18} className="text-text-muted" /> : <ChevronDown size={18} className="text-text-muted" />}
              </button>
              
              <AnimatePresence>
                {showAgeCalc && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-bg-border/50"
                  >
                    <div className="p-5 flex flex-col gap-5 bg-bg-page/40">
                      
                      <div className="grid grid-cols-3 gap-3 md:gap-5">
                        <div className="bg-bg-card border border-bg-border rounded-lg p-3 md:p-4 flex flex-col items-center justify-center text-center">
                          <span className="text-[24px] md:text-[32px] font-bold text-gold-bright font-mono">{ageDetails.years}</span>
                          <span className="text-[11px] md:text-[13px] text-text-secondary mt-1">{labels.ageYears}</span>
                        </div>
                        <div className="bg-bg-card border border-bg-border rounded-lg p-3 md:p-4 flex flex-col items-center justify-center text-center">
                          <span className="text-[24px] md:text-[32px] font-bold text-gold-bright font-mono">{ageDetails.months}</span>
                          <span className="text-[11px] md:text-[13px] text-text-secondary mt-1">{labels.ageMonths}</span>
                        </div>
                        <div className="bg-bg-card border border-bg-border rounded-lg p-3 md:p-4 flex flex-col items-center justify-center text-center">
                          <span className="text-[24px] md:text-[32px] font-bold text-gold-bright font-mono">{ageDetails.days}</span>
                          <span className="text-[11px] md:text-[13px] text-text-secondary mt-1">{labels.ageDays}</span>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex items-center gap-3 bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3">
                          <Calendar size={20} className="text-blue-600 dark:text-[#80c8ff]" />
                          <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-wider text-blue-600 dark:text-[#80c8ff]/70 font-semibold">{labels.totalDays}</span>
                            <span className="text-[16px] font-bold text-blue-600 dark:text-[#80c8ff] font-mono">{ageDetails.totalDays.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex-1 flex items-center gap-3 bg-[#c9922a]/10 border border-[#c9922a]/30 rounded-lg p-3">
                          <HelpCircle size={20} className="text-gold-bright" />
                          <div className="flex flex-col">
                            <span className="text-[11px] uppercase tracking-wider text-gold-deep font-semibold">{labels.nextBday}</span>
                            <span className="text-[16px] font-bold text-gold-bright font-mono">{ageDetails.daysToNextBday} {labels.daysLeft}</span>
                          </div>
                        </div>
                      </div>
                      
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      </div>
    </ErrorBoundary>
  )
}
