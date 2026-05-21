'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Star, Sparkles, Loader2, Info, Compass, ShieldAlert, Heart, Briefcase, Landmark } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useBirthProfile } from '@/hooks/useBirthProfile'
import { NAKSHATRA_DATA, NakshatraInfo } from '@/data/nakshatraData'
import { HoroscopeResponse } from '@/types/astro'
import api from '@/lib/api'

export default function StarReadingsPage() {
  const { language } = useLanguage()
  const { data: birthProfile, isLoading: isProfileLoading } = useBirthProfile()

  const [selectedStar, setSelectedStar] = useState<string>('Ashwini')
  const [loading, setLoading] = useState(false)
  const [detectedStar, setDetectedStar] = useState<string | null>(null)

  const isTa = language === 'ta'

  const t = {
    title: isTa ? 'நட்சத்திர பலன்கள்' : 'Star Readings',
    subtitle: isTa ? 'உங்கள் பிறப்பு நட்சத்திரத்தின் அடிப்படையிலான விரிவான குணங்கள் மற்றும் பலன்கள்' : 'Detailed traits and predictions based on your Janma Nakshatra',
    back: isTa ? 'முகப்பிற்குச் செல்' : 'Back to Dashboard',
    loading: isTa ? 'நட்சத்திர விவரங்கள் அறியப்படுகின்றன...' : 'Detecting your birth star...',
    selectStar: isTa ? 'நட்சத்திரத்தைத் தேர்ந்தெடுக்கவும்' : 'Select a Birth Star',
    detectedAlert: isTa 
      ? 'உங்கள் ஜாதக விவரங்களின்படி கண்டறியப்பட்ட நட்சத்திரம்:' 
      : 'Birth star detected from your profile:',
    rulingPlanet: isTa ? 'ஆளும் கிரகம்' : 'Ruling Planet',
    deity: isTa ? 'அதிபதி தெய்வம்' : 'Deity',
    symbol: isTa ? 'சின்னம்' : 'Symbol',
    luckyNumber: isTa ? 'அதிர்ஷ்ட எண்' : 'Lucky Number',
    luckyColor: isTa ? 'அதிர்ஷ்ட வண்ணம்' : 'Lucky Color',
    luckyDay: isTa ? 'அதிர்ஷ்ட நாள்' : 'Lucky Day',
    gemstone: isTa ? 'அதிர்ஷ்டக் கல்' : 'Lucky Gemstone',
    tabs: {
      personality: isTa ? 'குணநலன்கள்' : 'Personality',
      career: isTa ? 'தொழில் & வேலை' : 'Career & Business',
      love: isTa ? 'காதல் & குடும்பம்' : 'Love & Marriage',
      finance: isTa ? 'பொருளாதாரம்' : 'Wealth & Finance',
      health: isTa ? 'உடல்நலம்' : 'Health & Wellbeing'
    }
  }

  // Auto-detect birth star if profile exists
  useEffect(() => {
    if (isProfileLoading || !birthProfile) return

    async function detectStar() {
      if (!birthProfile) return
      setLoading(true)
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
          if (moonPlanet?.nakshatra) {
            // Find key that matches or is close
            const matchedKey = Object.keys(NAKSHATRA_DATA).find(
              key => key.toLowerCase() === moonPlanet.nakshatra.toLowerCase() ||
                     key.toLowerCase().replace(/\s/g, '') === moonPlanet.nakshatra.toLowerCase().replace(/\s/g, '')
            )
            if (matchedKey) {
              setSelectedStar(matchedKey)
              setDetectedStar(matchedKey)
            }
          }
        }
      } catch (err) {
        console.error('Failed to detect star:', err)
      } finally {
        setLoading(false)
      }
    }

    detectStar()
  }, [birthProfile, isProfileLoading])

  const starInfo: NakshatraInfo = NAKSHATRA_DATA[selectedStar] || NAKSHATRA_DATA['Ashwini']

  const [activeTab, setActiveTab] = useState<'personality' | 'career' | 'love' | 'finance' | 'health'>('personality')

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const itemVariants = {
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
          <Star className="text-gold-bright fill-gold-bright/10" size={28} />
          {t.title}
        </h1>
        <p className="text-text-secondary text-sm md:text-base max-w-2xl">{t.subtitle}</p>
      </div>

      {/* Loading state for detection */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-gold-mid" />
          <p className="text-text-muted text-sm">{t.loading}</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Star Selector & Basic Info */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Star Selector Box */}
            <div 
              className="p-5 rounded-2xl border backdrop-blur-sm flex flex-col gap-4"
              style={{
                background: 'rgba(15, 15, 36, 0.65)',
                borderColor: 'rgba(42, 42, 74, 0.5)',
              }}
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-primary">{t.selectStar}</label>
                <select
                  value={selectedStar}
                  onChange={(e) => setSelectedStar(e.target.value)}
                  className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all font-bold cursor-pointer"
                >
                  {Object.keys(NAKSHATRA_DATA).map((key) => (
                    <option key={key} value={key} className="bg-bg-page text-white font-bold">
                      {isTa ? NAKSHATRA_DATA[key].nameTa : NAKSHATRA_DATA[key].nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detected Star Badge */}
              {detectedStar && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-gold-deep/5 border border-gold-mid/20 text-gold-bright text-xs">
                  <Sparkles size={16} className="shrink-0" />
                  <div>
                    <span className="text-text-muted">{t.detectedAlert} </span>
                    <strong className="underline decoration-gold-mid decoration-2">
                      {isTa ? NAKSHATRA_DATA[detectedStar].nameTa : NAKSHATRA_DATA[detectedStar].nameEn}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Lucky Parameters & Key Stats Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4"
            >
              {/* Technical Astro Stats Card */}
              <motion.div 
                variants={itemVariants}
                className="p-5 rounded-2xl border flex flex-col gap-3 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 15, 36, 0.8), rgba(20, 20, 45, 0.6))',
                  borderColor: 'rgba(42, 42, 74, 0.5)',
                }}
              >
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-gold-mid/5 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-xs font-bold text-gold-bright uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                  <Compass size={14} />
                  {isTa ? 'ஜோதிட அளவுருக்கள்' : 'Astrological Parameters'}
                </h3>
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">{t.rulingPlanet}</span>
                    <span className="font-bold text-white">{isTa ? starInfo.rulingPlanetTa : starInfo.rulingPlanet}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">{t.deity}</span>
                    <span className="font-bold text-white">{isTa ? starInfo.deityTa : starInfo.deity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">{t.symbol}</span>
                    <span className="font-bold text-white">{isTa ? starInfo.symbolTa : starInfo.symbol}</span>
                  </div>
                </div>
              </motion.div>

              {/* Lucky Indicators Card */}
              <motion.div 
                variants={itemVariants}
                className="p-5 rounded-2xl border flex flex-col gap-3 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 15, 36, 0.8), rgba(20, 20, 45, 0.6))',
                  borderColor: 'rgba(42, 42, 74, 0.5)',
                }}
              >
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-xs font-bold text-gold-bright uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2">
                  <Sparkles size={14} />
                  {isTa ? 'அதிர்ஷ்ட காரணிகள்' : 'Auspicious Factors'}
                </h3>
                <div className="flex flex-col gap-2.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">{t.luckyNumber}</span>
                    <span className="font-mono font-bold text-white">{starInfo.luckyNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">{t.luckyColor}</span>
                    <span className="font-bold text-white">{isTa ? starInfo.luckyColorTa : starInfo.luckyColor}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">{t.luckyDay}</span>
                    <span className="font-bold text-white">{isTa ? starInfo.luckyDayTa : starInfo.luckyDay}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">{t.gemstone}</span>
                    <span className="font-bold text-white">{isTa ? starInfo.gemstoneTa : starInfo.gemstone}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: Dynamic Predictions Tabs */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Elegant Tab Headers Selector */}
            <div className="flex bg-black/40 border border-bg-border p-1 rounded-xl w-full overflow-x-auto select-none no-scrollbar">
              {(['personality', 'career', 'love', 'finance', 'health'] as const).map((tab) => {
                const isActive = activeTab === tab
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`
                      flex-1 min-w-[90px] py-3 rounded-lg text-xs font-bold transition-all cursor-pointer text-center whitespace-nowrap
                      ${isActive 
                        ? 'bg-gold-deep text-white shadow-sm' 
                        : 'text-text-secondary hover:text-white'
                      }
                    `}
                  >
                    {t.tabs[tab]}
                  </button>
                )
              })}
            </div>

            {/* Tab Contents Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="p-6 sm:p-8 rounded-2xl border min-h-[300px] flex flex-col gap-6 relative overflow-hidden"
                style={{
                  background: 'rgba(15, 15, 36, 0.45)',
                  borderColor: 'rgba(201, 146, 42, 0.25)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <div className="absolute top-6 right-6 w-32 h-32 bg-gold-mid/5 rounded-full blur-3xl pointer-events-none" />

                {/* Section Header */}
                <div className="flex items-center gap-3.5 border-b border-white/5 pb-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-gold-bright">
                    {activeTab === 'personality' && <Info size={22} />}
                    {activeTab === 'career' && <Briefcase size={22} />}
                    {activeTab === 'love' && <Heart size={22} />}
                    {activeTab === 'finance' && <Landmark size={22} />}
                    {activeTab === 'health' && <ShieldAlert size={22} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-wide">
                      {t.tabs[activeTab]} – {isTa ? starInfo.nameTa : starInfo.nameEn}
                    </h3>
                    <p className="text-xs text-text-muted mt-0.5">
                      {isTa ? 'வேத ஜோதிடக் கணிப்புகள்' : 'Classical Vedic astrology insights'}
                    </p>
                  </div>
                </div>

                {/* Detailed Narrative Text */}
                <p className="text-text-secondary leading-relaxed sm:text-lg text-justify">
                  {isTa ? starInfo[activeTab].ta : starInfo[activeTab].en}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}
