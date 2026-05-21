'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ArrowLeft, RefreshCw, CheckCircle2, XCircle, AlertTriangle, Users, Sparkles, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import { RasiChart } from '@/components/astro/RasiChart'
import { CityData, HoroscopeResponse } from '@/types/astro'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { MatchingSkeleton } from '@/components/astro/SkeletonCards'
import api from '@/lib/api'

interface MatchingResponse {
  papasamyam: {
    boy_score: number
    girl_score: number
    difference: number
    compatible: boolean
  }
  mangal_dosha: {
    boy_has_dosha: boolean
    girl_has_dosha: boolean
    compatible: boolean
  }
  overall_compatible: boolean
}

export default function HoroscopeMatchingPage() {
  const { language } = useLanguage()
  const { user } = useAuthStore()

  // Boy state
  const [boyName, setBoyName] = useState('')
  const [boyDob, setBoyDob] = useState('')
  const [boyTob, setBoyTob] = useState('')
  const [boyCity, setBoyCity] = useState<CityData | null>(null)

  // Girl state
  const [girlName, setGirlName] = useState('')
  const [girlDob, setGirlDob] = useState('')
  const [girlTob, setGirlTob] = useState('')
  const [girlCity, setGirlCity] = useState<CityData | null>(null)

  // System states
  const [isSavedProfileLoading, setIsSavedProfileLoading] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [calcStep, setCalcStep] = useState(0) // 0: Idle, 1: Boy Chart, 2: Girl Chart, 3: Compatibility analysis
  const [error, setError] = useState<string | null>(null)

  // Results
  const [boyHoro, setBoyHoro] = useState<HoroscopeResponse | null>(null)
  const [girlHoro, setGirlHoro] = useState<HoroscopeResponse | null>(null)
  const [matchResult, setMatchResult] = useState<MatchingResponse | null>(null)

  const labels = {
    ta: {
      title: "ஜாதக பொருத்தம்",
      subtitle: "மணமகன் மற்றும் மணமகளின் ஜாதகங்களை ஒப்பிட்டு பாவஸாமியம் மற்றும் செவ்வாய் தோஷப் பொருத்தத்தை ஆராயுங்கள்",
      boySection: "மணமகன் விவரங்கள் (Groom's Details)",
      girlSection: "மணமகள் விவரங்கள் (Bride's Details)",
      name: "பெயர்",
      nameBoyPlaceholder: "எ.கா. கார்த்திக்",
      nameGirlPlaceholder: "எ.கா. காவியா",
      dob: "பிறந்த தேதி",
      tob: "பிறந்த நேரம்",
      place: "பிறந்த இடம்",
      useMyDetails: "எனது விவரங்களைப் பயன்படுத்து",
      buttonCheck: "ஜாதக பொருத்தம் காண்க",
      buttonReset: "புதிய பொருத்தம்",
      loadingStep1: "மணமகனின் ஜாதகத்தை கணிக்கிறது...",
      loadingStep2: "மணமகளின் ஜாதகத்தை கணிக்கிறது...",
      loadingStep3: "பாவஸாமியம் மற்றும் செவ்வாய் தோஷத்தை ஒப்பிடுகிறது...",
      resultTitle: "ஜாதக பொருத்த முடிவுகள்",
      verdictLabel: "பொருத்த முடிவு:",
      compatible: "பொருத்தம் உண்டு (Compatible)",
      notCompatible: "பொருத்தம் பொருந்தாது (Incompatible / Dosha)",
      chartsTitle: "ராசி கட்டங்கள் (D1 Rasi Charts)",
      papasamyamTitle: "பாவஸாமியம் கணிப்பு (Papasamyam)",
      papasamyamDesc: "சூரியன், செவ்வாய், சனி, ராகு, கேது போன்ற பாப கிரகங்கள் 1, 2, 4, 7, 8, 12 ஆகிய இடங்களில் இருக்கும் அமைப்பை ஒப்பிடுவது பாவஸாமியம் ஆகும். இருவரின் பாப புள்ளிகளின் வித்தியாசம் 1 அல்லது அதற்கு குறைவாக இருத்தல் நன்று.",
      mangalTitle: "செவ்வாய் தோஷம் (Mangal Dosha)",
      mangalDesc: "இருவருக்கும் செவ்வாய் தோஷம் இருக்க வேண்டும், அல்லது இருவருக்கும் தோஷம் இல்லாமல் இருக்க வேண்டும். ஒருவருக்கு மட்டும் தோஷம் இருப்பது உகந்தது அல்ல.",
      hasDosha: "தோஷம் உண்டு",
      noDosha: "தோஷம் இல்லை",
      boyScore: "மணமகன் பாப புள்ளிகள்",
      girlScore: "மணமகள் பாப புள்ளிகள்",
      difference: "புள்ளிகளின் வித்தியாசம்",
      compatibleStatus: "பொருத்தம்",
      incompatibleStatus: "தோஷ விலக்கு",
      passed: "பொருந்தும்",
      failed: "பொருந்தாது",
      errorMessage: "ஜாதகக் கணிப்பு செய்வதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
    },
    en: {
      title: "Horoscope Matching",
      subtitle: "Compare both birth charts to analyze Papasamyam points and Mangal Dosha (Sevvai Dosham) alignment",
      boySection: "Groom's Details (Boy's Details)",
      girlSection: "Bride's Details (Girl's Details)",
      name: "Full Name",
      nameBoyPlaceholder: "e.g. Karthik",
      nameGirlPlaceholder: "e.g. Kavya",
      dob: "Date of Birth",
      tob: "Time of Birth",
      place: "Birth Place",
      useMyDetails: "Use My Details",
      buttonCheck: "Compare Horoscopes",
      buttonReset: "Compare Another",
      loadingStep1: "Casting groom's birth chart...",
      loadingStep2: "Casting bride's birth chart...",
      loadingStep3: "Analyzing Papasamyam & Mangal Dosha compatibility...",
      resultTitle: "Horoscope Match Results",
      verdictLabel: "Verdict:",
      compatible: "Compatible",
      notCompatible: "Incompatible / Dosha Present",
      chartsTitle: "D1 Rasi Charts Comparison",
      papasamyamTitle: "Papasamyam Analysis",
      papasamyamDesc: "Papasamyam counts malefic influence points (Sun, Mars, Saturn, Rahu, Ketu in houses 1, 2, 4, 7, 8, 12). For compatibility, the difference in points between both partners should be 1 or less.",
      mangalTitle: "Mangal Dosha Analysis (Sevvai Dosham)",
      mangalDesc: "Either both partners must have Mangal Dosha, or both must be free from it. An unequal match (only one partner having it) causes dosha affliction.",
      hasDosha: "Dosha Present",
      noDosha: "No Dosha",
      boyScore: "Groom Malefic Points",
      girlScore: "Bride Malefic Points",
      difference: "Point Difference",
      compatibleStatus: "Status",
      incompatibleStatus: "Affliction status",
      passed: "Compatible",
      failed: "Incompatible",
      errorMessage: "Error calculating horoscope match. Please try again."
    }
  }[language]

  // Pre-load current user profile if available
  const loadProfile = async (target: 'boy' | 'girl') => {
    if (!user) return
    setIsSavedProfileLoading(true)
    try {
      const { data, error } = await supabase
        .from('birth_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data && !error) {
        const targetCity: CityData = {
          id: 0,
          name: data.place_name.split(',')[0],
          ascii_name: data.place_name.split(',')[0],
          state: data.place_name.split(',')[1]?.trim() || '',
          country: 'IN',
          latitude: Number(data.lat),
          longitude: Number(data.lng),
          utc_offset: 5.5
        }

        if (target === 'boy') {
          setBoyName(data.name)
          setBoyDob(data.dob)
          setBoyTob(data.tob.slice(0, 5))
          setBoyCity(targetCity)
        } else {
          setGirlName(data.name)
          setGirlDob(data.dob)
          setGirlTob(data.tob.slice(0, 5))
          setGirlCity(targetCity)
        }
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
    } finally {
      setIsSavedProfileLoading(false)
    }
  }

  const handleMatchCalculation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!boyDob || !boyTob || !boyCity || !girlDob || !girlTob || !girlCity) {
      setError(language === 'ta' ? 'அனைத்து விவரங்களையும் பூர்த்தி செய்யவும்.' : 'Please fill all details.')
      return
    }

    setIsCalculating(true)
    setError(null)

    try {
      const boyLat = boyCity.lat !== undefined ? boyCity.lat : boyCity.latitude
      const boyLng = boyCity.lng !== undefined ? boyCity.lng : boyCity.longitude

      // Step 1: Calculate Boy's Horoscope via Express proxy
      setCalcStep(1)
      const boyRes = await api.post('/horoscope/calculate', {
        date: boyDob,
        time: boyTob,
        lat: boyLat,
        lng: boyLng,
        utcOffset: boyCity.utc_offset || 5.5,
        language: language || 'ta'
      })
      if (!boyRes.success || !boyRes.data) throw new Error('Failed groom calculations')
      const boyData: HoroscopeResponse = boyRes.data
      setBoyHoro(boyData)

      const girlLat = girlCity.lat !== undefined ? girlCity.lat : girlCity.latitude
      const girlLng = girlCity.lng !== undefined ? girlCity.lng : girlCity.longitude

      // Step 2: Calculate Girl's Horoscope via Express proxy
      setCalcStep(2)
      const girlRes = await api.post('/horoscope/calculate', {
        date: girlDob,
        time: girlTob,
        lat: girlLat,
        lng: girlLng,
        utcOffset: girlCity.utc_offset || 5.5,
        language: language || 'ta'
      })
      if (!girlRes.success || !girlRes.data) throw new Error('Failed bride calculations')
      const girlData: HoroscopeResponse = girlRes.data
      setGirlHoro(girlData)

      // Step 3: Match Horoscopes via Express proxy
      setCalcStep(3)
      const matchRes = await api.post('/matching/calculate', {
        boy_horoscope: boyData,
        girl_horoscope: girlData
      })
      if (!matchRes) throw new Error('Failed matching comparison')
      const matchingData: MatchingResponse = matchRes as any
      setMatchResult(matchingData)

    } catch (err) {
      console.error(err)
      setError(labels.errorMessage)
    } finally {
      setIsCalculating(false)
      setCalcStep(0)
    }
  }

  return (
    <ErrorBoundary label="Kundali matching failed to load.">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-6">
      {/* Header back link */}
      <div className="flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center gap-2 text-text-secondary hover:text-gold-bright transition-colors text-[14px]"
        >
          <ArrowLeft size={16} />
          {language === 'ta' ? 'முகப்புப்பக்கம்' : 'Back to Dashboard'}
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/matching/detailed"
            className="text-xs font-bold bg-gold-deep/20 hover:bg-gold-deep/35 border border-gold-deep text-gold-bright px-3 py-1 rounded transition-all flex items-center gap-1.5"
          >
            <Sparkles size={12} className="text-gold-bright" />
            {language === 'ta' ? 'விரிவான பொருத்தம் (Deep Match) ✦' : 'Deep Match Portal ✦'}
          </Link>
          <span className="text-[11px] font-mono text-text-muted">VERSION 4.0</span>
        </div>
      </div>

      {/* Main Intro */}
      <div className="flex flex-col gap-1.5 border-b border-bg-border pb-4">
        <h1 className="text-[24px] font-semibold text-gold-bright tracking-tight font-playfair flex items-center gap-2.5">
          <Heart className="text-[#b0415e] fill-[#b0415e]" size={24} />
          {labels.title}
        </h1>
        <p className="text-[14px] text-text-secondary leading-relaxed max-w-[850px]">
          {labels.subtitle}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isCalculating ? (
          <MatchingSkeleton />
        ) : !matchResult ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <form onSubmit={handleMatchCalculation} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Groom Details Card */}
                <div className="bg-bg-card border border-bg-border rounded-xl p-5 md:p-6 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-bg-border pb-2.5">
                    <h2 className="text-[15px] font-bold text-gold-bright flex items-center gap-2">
                      <Users size={16} className="text-gold-bright" />
                      {labels.boySection}
                    </h2>
                    {user && (
                      <button
                        type="button"
                        onClick={() => loadProfile('boy')}
                        className="text-[11px] text-gold-bright hover:underline"
                        disabled={isSavedProfileLoading}
                      >
                        {labels.useMyDetails}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] text-text-secondary">{labels.name}</label>
                      <input
                        type="text"
                        value={boyName}
                        onChange={(e) => setBoyName(e.target.value)}
                        placeholder={labels.nameBoyPlaceholder}
                        className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3.5 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none"
                      />
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-text-secondary">{labels.dob}</label>
                        <input
                          type="date"
                          value={boyDob}
                          onChange={(e) => setBoyDob(e.target.value)}
                          className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none [color-scheme:dark]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-text-secondary">{labels.tob}</label>
                        <input
                          type="time"
                          value={boyTob}
                          onChange={(e) => setBoyTob(e.target.value)}
                          className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Birth Place */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] text-text-secondary">{labels.place}</label>
                      <PlaceSearch 
                        onSelect={setBoyCity} 
                        selectedCity={boyCity}
                      />
                    </div>
                  </div>
                </div>

                {/* Bride Details Card */}
                <div className="bg-bg-card border border-bg-border rounded-xl p-5 md:p-6 shadow-xl flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-bg-border pb-2.5">
                    <h2 className="text-[15px] font-bold text-gold-bright flex items-center gap-2">
                      <Users size={16} className="text-gold-bright" />
                      {labels.girlSection}
                    </h2>
                    {user && (
                      <button
                        type="button"
                        onClick={() => loadProfile('girl')}
                        className="text-[11px] text-gold-bright hover:underline"
                        disabled={isSavedProfileLoading}
                      >
                        {labels.useMyDetails}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] text-text-secondary">{labels.name}</label>
                      <input
                        type="text"
                        value={girlName}
                        onChange={(e) => setGirlName(e.target.value)}
                        placeholder={labels.nameGirlPlaceholder}
                        className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3.5 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none"
                      />
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-text-secondary">{labels.dob}</label>
                        <input
                          type="date"
                          value={girlDob}
                          onChange={(e) => setGirlDob(e.target.value)}
                          className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none [color-scheme:dark]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] text-text-secondary">{labels.tob}</label>
                        <input
                          type="time"
                          value={girlTob}
                          onChange={(e) => setGirlTob(e.target.value)}
                          className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Birth Place */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] text-text-secondary">{labels.place}</label>
                      <PlaceSearch 
                        onSelect={setGirlCity} 
                        selectedCity={girlCity}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {error && (
                <div className="p-3.5 rounded-lg bg-danger/10 border border-danger text-danger text-[13px] flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full h-12 bg-gold-deep hover:bg-gold-mid text-text-inverse font-semibold rounded-lg flex items-center justify-center gap-2.5 transition-all active:scale-[0.99] disabled:opacity-50 text-[15px]"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="animate-spin" size={18} />
                    <span>
                      {calcStep === 1 && labels.loadingStep1}
                      {calcStep === 2 && labels.loadingStep2}
                      {calcStep === 3 && labels.loadingStep3}
                    </span>
                  </>
                ) : (
                  <>
                    <Heart size={18} />
                    {labels.buttonCheck}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="match-results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            {/* Verdict summary banner */}
            <div 
              className={`
                border rounded-xl p-5 md:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4
                ${matchResult.overall_compatible 
                  ? 'bg-[#2d7a4f]/20 border-[#2d7a4f] text-[#6ee7a0]' 
                  : 'bg-[#c0392b]/20 border-[#c0392b] text-[#ff9090]'
                }
              `}
            >
              <div className="flex items-center gap-3.5 text-center md:text-left flex-col md:flex-row">
                <div className="p-3 rounded-full bg-white/10">
                  {matchResult.overall_compatible ? (
                    <CheckCircle2 size={32} />
                  ) : (
                    <XCircle size={32} />
                  )}
                </div>
                <div>
                  <span className="text-[12px] uppercase tracking-wider text-text-muted">{labels.verdictLabel}</span>
                  <h2 className="text-[20px] font-bold">
                    {matchResult.overall_compatible ? labels.compatible : labels.notCompatible}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => {
                  setMatchResult(null)
                  setBoyHoro(null)
                  setGirlHoro(null)
                }}
                className="bg-bg-page border border-bg-border rounded-full px-5 py-2 text-[13px] text-gold-bright hover:bg-gold-subtle font-semibold flex items-center gap-1.5 transition-all"
              >
                <RefreshCw size={15} />
                {labels.buttonReset}
              </button>
            </div>

            {/* Side-by-side Rasi Charts */}
            {boyHoro && girlHoro && (
              <div className="bg-bg-card border border-bg-border rounded-xl p-5 md:p-6 shadow-xl flex flex-col gap-5">
                <h3 className="text-[16px] font-semibold text-gold-bright font-playfair italic flex items-center gap-2 border-b border-bg-border pb-2">
                  <Sparkles size={18} className="text-gold-bright" />
                  {labels.chartsTitle}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
                  <RasiChart
                    chart={boyHoro.rasi_chart}
                    planets={boyHoro.planets}
                    title={`${language === 'ta' ? 'மணமகன்' : 'Groom'}: ${boyName || 'Boy'}`}
                    lagnaSign={boyHoro.lagna.sign}
                  />
                  <RasiChart
                    chart={girlHoro.rasi_chart}
                    planets={girlHoro.planets}
                    title={`${language === 'ta' ? 'மணமகள்' : 'Bride'}: ${girlName || 'Girl'}`}
                    lagnaSign={girlHoro.lagna.sign}
                  />
                </div>
              </div>
            )}

            {/* Details Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Papasamyam Point comparison */}
              <div className="bg-bg-card border border-bg-border rounded-xl p-5 md:p-6 shadow-xl flex flex-col gap-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-gold-bright font-playfair italic mb-1.5">
                    {labels.papasamyamTitle}
                  </h3>
                  <p className="text-[12px] text-text-secondary leading-relaxed">
                    {labels.papasamyamDesc}
                  </p>
                </div>

                <div className="bg-[#1a1209] rounded-xl border border-bg-border/60 overflow-hidden divide-y divide-bg-border/50 text-[14px]">
                  <div className="flex justify-between items-center p-3.5">
                    <span className="text-text-secondary">{labels.boyScore}</span>
                    <span className="font-bold text-gold-bright font-mono text-[16px]">{matchResult.papasamyam.boy_score}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5">
                    <span className="text-text-secondary">{labels.girlScore}</span>
                    <span className="font-bold text-gold-bright font-mono text-[16px]">{matchResult.papasamyam.girl_score}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-bg-active/20">
                    <span className="text-text-secondary font-semibold">{labels.difference}</span>
                    <span className="font-bold text-gold-bright font-mono text-[16px]">{matchResult.papasamyam.difference}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5">
                    <span className="text-text-secondary font-semibold">{labels.compatibleStatus}</span>
                    <span className={`font-bold flex items-center gap-1.5 ${matchResult.papasamyam.compatible ? 'text-[#6ee7a0]' : 'text-[#ff9090]'}`}>
                      {matchResult.papasamyam.compatible ? (
                        <>
                          <CheckCircle2 size={16} />
                          {labels.passed}
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
                          {labels.failed}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mangal Dosha comparison */}
              <div className="bg-bg-card border border-bg-border rounded-xl p-5 md:p-6 shadow-xl flex flex-col gap-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-gold-bright font-playfair italic mb-1.5">
                    {labels.mangalTitle}
                  </h3>
                  <p className="text-[12px] text-text-secondary leading-relaxed">
                    {labels.mangalDesc}
                  </p>
                </div>

                <div className="bg-[#1a1209] rounded-xl border border-bg-border/60 overflow-hidden divide-y divide-bg-border/50 text-[14px]">
                  <div className="flex justify-between items-center p-3.5">
                    <span className="text-text-secondary">{language === 'ta' ? 'மணமகன் செவ்வாய் தோஷம்' : 'Groom Mangal Dosha'}</span>
                    <span className={`font-semibold ${matchResult.mangal_dosha.boy_has_dosha ? 'text-gold-bright' : 'text-text-muted'}`}>
                      {matchResult.mangal_dosha.boy_has_dosha ? labels.hasDosha : labels.noDosha}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5">
                    <span className="text-text-secondary">{language === 'ta' ? 'மணமகள் செவ்வாய் தோஷம்' : 'Bride Mangal Dosha'}</span>
                    <span className={`font-semibold ${matchResult.mangal_dosha.girl_has_dosha ? 'text-gold-bright' : 'text-text-muted'}`}>
                      {matchResult.mangal_dosha.girl_has_dosha ? labels.hasDosha : labels.noDosha}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5">
                    <span className="text-text-secondary font-semibold">{labels.incompatibleStatus}</span>
                    <span className={`font-bold flex items-center gap-1.5 ${matchResult.mangal_dosha.compatible ? 'text-[#6ee7a0]' : 'text-[#ff9090]'}`}>
                      {matchResult.mangal_dosha.compatible ? (
                        <>
                          <CheckCircle2 size={16} />
                          {labels.passed}
                        </>
                      ) : (
                        <>
                          <XCircle size={16} />
                          {labels.failed}
                        </>
                      )}
                    </span>
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
