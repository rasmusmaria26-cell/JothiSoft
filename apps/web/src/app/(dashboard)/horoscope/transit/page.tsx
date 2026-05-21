'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Navigation, Sparkles, Loader2, Info, Compass, ShieldAlert, Heart, Calendar, HelpCircle, Activity } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useBirthProfile } from '@/hooks/useBirthProfile'
import { HoroscopeResponse } from '@/types/astro'
import api from '@/lib/api'

const RASI_LIST = [
  { id: 'Mesha', en: 'Aries', ta: 'மேஷம்' },
  { id: 'Rishabha', en: 'Taurus', ta: 'ரிஷபம்' },
  { id: 'Mithuna', en: 'Gemini', ta: 'மிதுனம்' },
  { id: 'Kataka', en: 'Cancer', ta: 'கடகம்' },
  { id: 'Simha', en: 'Leo', ta: 'சிம்மம்' },
  { id: 'Kanya', en: 'Virgo', ta: 'கன்னி' },
  { id: 'Thula', en: 'Libra', ta: 'துலாம்' },
  { id: 'Vrischika', en: 'Scorpio', ta: 'விருச்சிகம்' },
  { id: 'Dhanus', en: 'Sagittarius', ta: 'தனுசு' },
  { id: 'Makara', en: 'Capricorn', ta: 'மகரம்' },
  { id: 'Kumbha', en: 'Aquarius', ta: 'கும்பம்' },
  { id: 'Meena', en: 'Pisces', ta: 'மீனம்' }
]

interface TransitData {
  natal_moon_sign: string
  transit_date: string
  transits: Record<string, {
    sign: string
    sign_degree: number
    house: number
    interpretation_en: string
    interpretation_ta: string
  }>
  special_transits: {
    ezharai_sani: {
      active: boolean
      phase: string
      phase_ta: string
      desc: string
      desc_ta: string
    }
    ashtama_sani: {
      active: boolean
      desc: string
      desc_ta: string
    }
    ardhastama_sani: {
      active: boolean
      desc: string
      desc_ta: string
    }
    guru_transit: {
      house: number
      auspicious: boolean
      desc: string
      desc_ta: string
    }
  }
}

export default function TransitPalanPage() {
  const { language } = useLanguage()
  const { data: birthProfile, isLoading: isProfileLoading } = useBirthProfile()

  const [selectedRasi, setSelectedRasi] = useState<string>('Mesha')
  const [loading, setLoading] = useState(false)
  const [detectedRasi, setDetectedRasi] = useState<string | null>(null)
  const [transitData, setTransitData] = useState<TransitData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isTa = language === 'ta'

  const t = {
    title: isTa ? 'கோச்சார பலன்கள்' : 'Transit Palan',
    subtitle: isTa 
      ? 'இன்றைய கிரக சஞ்சாரங்களின் அடிப்படையில் உங்களின் தற்போதைய நட்சத்திர பலன்கள்' 
      : 'Live planetary transits and their impact calculated relative to your birth Moon sign',
    back: isTa ? 'முகப்பிற்குச் செல்' : 'Back to Dashboard',
    loading: isTa ? 'கோச்சார நிலைகள் கணக்கிடப்படுகின்றன...' : 'Calculating live transit states...',
    selectRasi: isTa ? 'ராசியைத் தேர்ந்தெடுக்கவும்' : 'Select your Rasi (Moon Sign)',
    detectedAlert: isTa 
      ? 'உங்கள் ஜாதக விவரங்களின்படி கண்டறியப்பட்ட ராசி:' 
      : 'Moon sign detected from your birth profile:',
    currentDate: isTa ? 'இன்றைய தேதி' : 'Current Date',
    planetHeader: isTa ? 'கிரக பெயர்ச்சி பலன்கள்' : 'Planetary Transits',
    specialHeader: isTa ? 'விசேஷ சனி & குரு பலன்கள்' : 'Special Saturn & Jupiter Transits',
    houseSuffix: isTa ? 'ஆம் இடம்' : 'House',
    transitIn: isTa ? 'தற்போது சஞ்சரிக்கும் ராசி:' : 'Transiting in:',
    ezharaiTitle: isTa ? 'ஏழரை சனி நிலை' : '7.5 Saturn (Ezharai Sani)',
    guruTitle: isTa ? 'குரு பெயர்ச்சி பலன்' : 'Jupiter Transit (Guru)',
    ashtamaTitle: isTa ? 'அஷ்டம சனி' : 'Ashtama Sani',
    ardhaTitle: isTa ? 'அர்த்தாஷ்டம சனி' : 'Ardhastama Sani',
    activeBadge: isTa ? 'நடைபெறுகிறது' : 'Active',
    inactiveBadge: isTa ? 'தாக்கம் இல்லை' : 'Inactive',
    auspiciousBadge: isTa ? 'உன்னத காலம்' : 'Auspicious',
    neutralBadge: isTa ? 'சாதாரண பலன்' : 'Neutral',
  }

  // Auto-detect birth rasi if profile exists
  useEffect(() => {
    if (isProfileLoading || !birthProfile) return

    async function detectRasi() {
      if (!birthProfile) return
      try {
        const [year, month, day] = birthProfile.dob.split('-').map(Number)
        const [hour, minute] = birthProfile.tob.split(':').map(Number)
        const lat = Number(birthProfile.lat)
        const lng = Number(birthProfile.lng)

        const payload = {
          date: birthProfile.dob,
          time: birthProfile.tob,
          lat,
          lng,
          utcOffset: 5.5,
          language: language || 'ta'
        }

        const res = await api.post('/horoscope/calculate', payload)

        if (res.success && res.data) {
          const data: HoroscopeResponse = res.data
          const moonPlanet = data.planets.find((p: any) => p.planet === 'Moon' || p.planet === 'சந்திரன்')
          if (moonPlanet?.sign) {
            const matchedRasi = RASI_LIST.find(
              r => r.id.toLowerCase() === moonPlanet.sign.toLowerCase() ||
                   r.en.toLowerCase() === moonPlanet.sign.toLowerCase()
            )
            if (matchedRasi) {
              setSelectedRasi(matchedRasi.id)
              setDetectedRasi(matchedRasi.id)
            }
          }
        }
      } catch (err) {
        console.error('Failed to detect birth Rasi:', err)
      }
    }

    detectRasi()
  }, [birthProfile, isProfileLoading])

  // Fetch transit data whenever selectedRasi changes
  useEffect(() => {
    async function fetchTransit() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.get(`/horoscope/transit?rasi=${selectedRasi}`)
        if (!res.success || !res.data) throw new Error('Failed to fetch transit data')
        setTransitData(res.data)
      } catch (err) {
        console.error(err)
        setError(isTa ? 'கோச்சார விவரங்களைப் பெறுவதில் பிழை' : 'Error retrieving live transit details')
      } finally {
        setLoading(false)
      }
    }

    fetchTransit()
  }, [selectedRasi, isTa])

  const currentRasiObj = RASI_LIST.find(r => r.id === selectedRasi)

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 20 } }
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-gold-bright transition-colors text-sm font-medium">
          <ArrowLeft size={16} />
          {t.back}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gold-bright tracking-tight flex items-center gap-3">
          <Navigation className="text-gold-bright rotate-45" size={28} />
          {t.title}
        </h1>
        <p className="text-text-secondary text-sm md:text-base max-w-2xl">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Selector Box */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div 
            className="p-5 rounded-2xl border backdrop-blur-sm flex flex-col gap-4"
            style={{
              background: 'rgba(15, 15, 36, 0.65)',
              borderColor: 'rgba(42, 42, 74, 0.5)',
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-text-primary">{t.selectRasi}</label>
              <select
                value={selectedRasi}
                onChange={(e) => setSelectedRasi(e.target.value)}
                className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all font-bold cursor-pointer"
              >
                {RASI_LIST.map((rasi) => (
                  <option key={rasi.id} value={rasi.id} className="bg-bg-page text-white font-bold">
                    {isTa ? rasi.ta : rasi.en} ({isTa ? rasi.en : rasi.ta})
                  </option>
                ))}
              </select>
            </div>

            {detectedRasi && (
              <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-gold-deep/5 border border-gold-mid/20 text-gold-bright text-xs">
                <Sparkles size={16} className="shrink-0" />
                <div>
                  <span className="text-text-muted">{t.detectedAlert} </span>
                  <strong className="underline decoration-gold-mid decoration-2">
                    {isTa 
                      ? RASI_LIST.find(r => r.id === detectedRasi)?.ta 
                      : RASI_LIST.find(r => r.id === detectedRasi)?.en}
                  </strong>
                </div>
              </div>
            )}

            {transitData && (
              <div className="border-t border-white/5 pt-3 flex justify-between items-center text-xs text-text-muted">
                <span>{t.currentDate}:</span>
                <span className="font-mono font-bold text-white flex items-center gap-1.5">
                  <Calendar size={13} className="text-gold-mid" />
                  {transitData.transit_date}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Calculations & Interpretations */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {loading && (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-gold-mid" />
              <p className="text-text-muted text-sm">{t.loading}</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {!loading && transitData && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-6"
            >
              {/* Special Transits Section */}
              <div className="flex flex-col gap-4">
                <h2 className="text-base font-bold text-gold-bright uppercase tracking-wider flex items-center gap-2">
                  <Sparkles size={16} />
                  {t.specialHeader}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ezharai Sani Card */}
                  <motion.div 
                    variants={cardVariants}
                    className="p-5 rounded-2xl border relative overflow-hidden flex flex-col gap-3"
                    style={{
                      background: 'rgba(15, 15, 36, 0.45)',
                      borderColor: 'rgba(201, 146, 42, 0.2)',
                    }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-white text-sm">{t.ezharaiTitle}</h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase 
                        ${transitData.special_transits.ezharai_sani.active 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {transitData.special_transits.ezharai_sani.active ? t.activeBadge : t.inactiveBadge}
                      </span>
                    </div>
                    {transitData.special_transits.ezharai_sani.active && (
                      <span className="text-xs text-gold-bright font-bold">
                        {isTa ? transitData.special_transits.ezharai_sani.phase_ta : transitData.special_transits.ezharai_sani.phase}
                      </span>
                    )}
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-1">
                      {isTa ? transitData.special_transits.ezharai_sani.desc_ta : transitData.special_transits.ezharai_sani.desc}
                    </p>
                  </motion.div>

                  {/* Guru Transit Card */}
                  <motion.div 
                    variants={cardVariants}
                    className="p-5 rounded-2xl border relative overflow-hidden flex flex-col gap-3"
                    style={{
                      background: 'rgba(15, 15, 36, 0.45)',
                      borderColor: 'rgba(201, 146, 42, 0.2)',
                    }}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-white text-sm">{t.guruTitle}</h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide uppercase 
                        ${transitData.special_transits.guru_transit.auspicious 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}
                      >
                        {transitData.special_transits.guru_transit.auspicious ? t.auspiciousBadge : t.neutralBadge}
                      </span>
                    </div>
                    <span className="text-xs text-gold-bright font-bold">
                      {transitData.special_transits.guru_transit.house} {t.houseSuffix}
                    </span>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed mt-1">
                      {isTa ? transitData.special_transits.guru_transit.desc_ta : transitData.special_transits.guru_transit.desc}
                    </p>
                  </motion.div>

                  {/* Ashtama / Ardhastama Sani Card if active */}
                  {(transitData.special_transits.ashtama_sani.active || transitData.special_transits.ardhastama_sani.active) && (
                    <motion.div 
                      variants={cardVariants}
                      className="md:col-span-2 p-5 rounded-2xl border bg-red-500/5 border-red-500/20 flex gap-3.5 items-start"
                    >
                      <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={20} />
                      <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-bold text-red-400">
                          {transitData.special_transits.ashtama_sani.active ? t.ashtamaTitle : t.ardhaTitle} {t.activeBadge}
                        </h4>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                          {isTa 
                            ? (transitData.special_transits.ashtama_sani.active ? transitData.special_transits.ashtama_sani.desc_ta : transitData.special_transits.ardhastama_sani.desc_ta)
                            : (transitData.special_transits.ashtama_sani.active ? transitData.special_transits.ashtama_sani.desc : transitData.special_transits.ardhastama_sani.desc)
                          }
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* General Planet Transit Section */}
              <div className="flex flex-col gap-4">
                <h2 className="text-base font-bold text-gold-bright uppercase tracking-wider flex items-center gap-2">
                  <Activity size={16} />
                  {t.planetHeader}
                </h2>

                <div className="flex flex-col gap-4">
                  {Object.entries(transitData.transits).map(([planet, details]) => {
                    const rasiLabel = RASI_LIST.find(r => r.id === details.sign)
                    return (
                      <motion.div
                        key={planet}
                        variants={cardVariants}
                        className="p-5 sm:p-6 rounded-2xl border flex flex-col gap-3 relative overflow-hidden"
                        style={{
                          background: 'rgba(15, 15, 36, 0.35)',
                          borderColor: 'rgba(255,255,255,0.05)',
                        }}
                      >
                        {/* Title Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-gold-mid shrink-0" />
                            <h3 className="font-bold text-white text-base">
                              {isTa 
                                ? (planet === 'Saturn' ? 'சனி பகவான்' : planet === 'Jupiter' ? 'குரு பகவான்' : planet === 'Rahu' ? 'ராகு பகவான்' : 'கேது பகவான்') 
                                : planet}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-text-muted">{t.transitIn}</span>
                            <span className="font-bold text-gold-bright">
                              {rasiLabel ? (isTa ? rasiLabel.ta : rasiLabel.en) : details.sign}
                            </span>
                            <span className="text-text-disabled">|</span>
                            <span className="font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/5">
                              {details.sign_degree}°
                            </span>
                            <span className="text-text-disabled">|</span>
                            <span className="font-bold text-white bg-gold-deep/20 px-2 py-0.5 rounded border border-gold-mid/20">
                              {details.house} {t.houseSuffix}
                            </span>
                          </div>
                        </div>

                        {/* Narrative Content */}
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed text-justify mt-1">
                          {isTa ? details.interpretation_ta : details.interpretation_en}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
