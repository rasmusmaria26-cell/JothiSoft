'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Baby, Sparkles, Loader2, Heart, Search, Filter, HelpCircle, Check, Info } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import api from '@/lib/api'
import { useBirthProfile } from '@/hooks/useBirthProfile'
import { CuratedBabyNames, SYLLABLE_MAPPING, BabyNameItem } from '@/data/babyNames'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { HoroscopeResponse } from '@/types/astro'

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

export default function BabyNamesPage() {
  const { language } = useLanguage()
  const { data: birthProfile, isLoading: isProfileLoading } = useBirthProfile()

  const [selectedStar, setSelectedStar] = useState<string>('Ashwini')
  const [selectedPada, setSelectedPada] = useState<number>(1)
  const [loading, setLoading] = useState(false)
  const [detectedStar, setDetectedStar] = useState<string | null>(null)
  const [detectedPada, setDetectedPada] = useState<number | null>(null)

  // Filters & States
  const [genderFilter, setGenderFilter] = useState<'all' | 'boy' | 'girl' | 'unisex'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [shortlisted, setShortlisted] = useState<BabyNameItem[]>([])

  const isTa = language === 'ta'

  const t = {
    title: isTa ? 'குழந்தை பெயர்கள்' : 'Astrological Baby Names',
    subtitle: isTa 
      ? 'பிறந்த நட்சத்திர பாதத்தின் அடிப்படையிலான அதிர்ஷ்ட எழுத்துக்கள் மற்றும் நவீன பெயர்கள்' 
      : 'Vedic baby names starting with lucky phonetic syllables based on Janma Nakshatra Padas',
    back: isTa ? 'முகப்பிற்குச் செல்' : 'Back to Dashboard',
    loading: isTa ? 'பிறப்பு நட்சத்திரம் கண்டறியப்படுகிறது...' : 'Detecting birth star parameters...',
    selectStar: isTa ? 'பிறந்த நட்சத்திரம்' : 'Select Birth Star',
    selectPada: isTa ? 'நட்சத்திர பாதம்' : 'Select Pada (Quarter)',
    detectedAlert: isTa 
      ? 'உங்களின் கண்டறியப்பட்ட நட்சத்திரம்:' 
      : 'Astrological star detected from your profile:',
    padaLabel: isTa ? 'பாதம்' : 'Pada',
    luckyLetters: isTa ? 'அதிர்ஷ்ட ஆரம்ப எழுத்துக்கள் (Charan Aksharas):' : 'Auspicious Starting Syllables (Charan Aksharas):',
    filterAll: isTa ? 'அனைத்தும்' : 'All Names',
    filterBoy: isTa ? 'ஆண் குழந்தை' : 'Boy Names',
    filterGirl: isTa ? 'பெண் குழந்தை' : 'Girl Names',
    filterUnisex: isTa ? 'பொதுப் பெயர்கள்' : 'Unisex Names',
    shortlistTitle: isTa ? 'தேர்ந்தெடுக்கப்பட்ட பெயர்கள்' : 'Shortlisted Names',
    shortlistEmpty: isTa ? 'பெயர்களைத் தேர்ந்தெடுக்க இதயக் குறியீட்டை அழுத்தவும்.' : 'Click the heart icon on names to shortlist them.',
    searchPlaceholder: isTa ? 'பெயர்களைத் தேடுங்கள்...' : 'Search names...',
    meaningLabel: isTa ? 'பொருள்:' : 'Meaning:',
    noNames: isTa ? 'இந்தப் பொருத்தம் கொண்ட பெயர்கள் இன்னும் சேர்க்கப்படவில்லை. உங்கள் எழுத்தின் அடிப்படையில் வேறு பெயர்களைத் தேடுங்கள்.' : 'No curated names found for this exact phonetic. Try searching or expanding your criteria.',
  }

  // Auto-detect birth parameters if profile exists
  useEffect(() => {
    if (isProfileLoading || !birthProfile) return

    async function detectParams() {
      if (!birthProfile) return
      setLoading(true)
      try {
        const lat = Number(birthProfile.lat)
        const lng = Number(birthProfile.lng)

        const res = await api.post<any>('/horoscope/calculate', {
          date: birthProfile.dob,
          time: birthProfile.tob,
          lat,
          lng,
          utcOffset: 5.5
        })

        if (res?.success) {
          const data: HoroscopeResponse = res.data
          const moonPlanet = data.planets.find((p: any) => p.planet === 'Moon')
          if (moonPlanet?.nakshatra) {
            // Find key matching nakshatra
            const matchedKey = Object.keys(SYLLABLE_MAPPING).find(
              key => key.toLowerCase() === moonPlanet.nakshatra.toLowerCase() ||
                     key.toLowerCase().replace(/\s/g, '') === moonPlanet.nakshatra.toLowerCase().replace(/\s/g, '')
            )
            if (matchedKey) {
              setSelectedStar(matchedKey)
              setDetectedStar(matchedKey)
              
              if (moonPlanet.pada) {
                const padaNum = Number(moonPlanet.pada)
                if (padaNum >= 1 && padaNum <= 4) {
                  setSelectedPada(padaNum)
                  setDetectedPada(padaNum)
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to detect parameters:', err)
      } finally {
        setLoading(false)
      }
    }

    detectParams()
  }, [birthProfile, isProfileLoading])

  const padas = [1, 2, 3, 4]
  
  // Get active syllables for the chosen Star
  const activeSyllables = SYLLABLE_MAPPING[selectedStar] || []
  
  // Charan Akshara for the active selected Pada (pada is 1-indexed, array is 0-indexed)
  const currentSyllableString = activeSyllables[selectedPada - 1] || ''
  
  // Extract syllables: e.g. "Che / சே" -> English: "Che", Tamil: "சே"
  const [englishAkshara, tamilAkshara] = currentSyllableString.split(' / ')

  // Filter names based on active letter and filters
  const filteredNames = CuratedBabyNames.filter(name => {
    // Check start letter match
    const aksharaMatch = name.startingLetter.toLowerCase() === englishAkshara?.toLowerCase().trim()
    
    // Check gender filter
    const genderMatch = genderFilter === 'all' || name.gender === genderFilter
    
    // Check search query
    const searchMatch = searchQuery === '' || 
      name.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.nameTa.includes(searchQuery)

    return aksharaMatch && genderMatch && searchMatch
  })

  // Shortlist handler
  const toggleShortlist = (name: BabyNameItem) => {
    if (shortlisted.some(item => item.nameEn === name.nameEn)) {
      setShortlisted(shortlisted.filter(item => item.nameEn !== name.nameEn))
    } else {
      setShortlisted([...shortlisted, name])
    }
  }

  return (
    <ErrorBoundary label="Baby names suggestor failed to load.">
      <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-gold-bright transition-colors text-sm font-medium">
          <ArrowLeft size={16} />
          {t.back}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gold-bright tracking-tight flex items-center gap-3">
          <Baby className="text-gold-bright fill-gold-bright/10" size={28} />
          {t.title}
        </h1>
        <p className="text-text-secondary text-sm md:text-base max-w-2xl">{t.subtitle}</p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-gold-mid" />
          <p className="text-text-muted text-sm">{t.loading}</p>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Syllables & Shortlist */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div 
              className="p-5 rounded-2xl border flex flex-col gap-4"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--bg-border)',
              }}
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-primary">{t.selectStar}</label>
                <select
                  value={selectedStar}
                  onChange={(e) => setSelectedStar(e.target.value)}
                  className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all font-bold cursor-pointer"
                >
                  {Object.keys(SYLLABLE_MAPPING).map((star) => (
                    <option key={star} value={star} className="bg-[var(--bg-elevated)] text-[var(--text-primary)] font-bold">
                      {star}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-text-primary">{t.selectPada}</label>
                <div className="grid grid-cols-4 gap-2">
                  {padas.map((pada) => (
                    <button
                      key={pada}
                      type="button"
                      onClick={() => setSelectedPada(pada)}
                      className={`py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer
                        ${selectedPada === pada 
                          ? 'bg-gold-deep border-gold-mid text-white' 
                          : 'bg-[var(--bg-elevated)] border-[var(--bg-border)] text-text-secondary hover:text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                        }`}
                    >
                      {pada}
                    </button>
                  ))}
                </div>
              </div>

              {detectedStar && (
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gold-deep/5 border border-gold-mid/10 text-gold-bright text-xs mt-1">
                  <Sparkles size={15} className="shrink-0" />
                  <div>
                    <span className="text-text-muted">{t.detectedAlert} </span>
                    <strong className="underline decoration-gold-mid decoration-2">
                      {detectedStar} ({t.padaLabel} {detectedPada})
                    </strong>
                  </div>
                </div>
              )}
            </div>

            <div 
              className="p-5 rounded-2xl border flex flex-col gap-3 relative overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--bg-border)',
              }}
            >
              <h3 className="text-xs font-bold text-gold-bright uppercase tracking-wider flex items-center gap-1.5 border-b border-[var(--bg-border)] pb-2">
                <Sparkles size={14} />
                {t.luckyLetters}
              </h3>
              
              <div className="flex items-center justify-center gap-6 py-4">
                <div className="w-16 h-16 rounded-full bg-gold-deep/10 border border-gold-mid/45 flex items-center justify-center text-xl font-extrabold text-gold-bright shadow-lg shadow-gold-mid/5">
                  {englishAkshara}
                </div>
                <div className="w-16 h-16 rounded-full bg-gold-deep/10 border border-gold-mid/45 flex items-center justify-center text-xl font-extrabold text-gold-bright shadow-lg shadow-gold-mid/5">
                  {tamilAkshara}
                </div>
              </div>

              <div className="text-[10px] text-text-muted leading-relaxed text-center italic">
                {isTa 
                  ? `நட்சத்திரப் பாதம் ${selectedPada} க்கான வேத ஒலி அதிர்வு அலைகள்`
                  : `Vedic sound phonetic vibrations for Nakshatra pada ${selectedPada}`
                }
              </div>
            </div>

            <div 
              className="p-5 rounded-2xl border flex flex-col gap-3"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--bg-border)',
              }}
            >
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider flex items-center justify-between border-b border-[var(--bg-border)] pb-2">
                <span className="flex items-center gap-1.5">
                  <Heart className="text-red-400 fill-red-400" size={14} />
                  {t.shortlistTitle}
                </span>
                <span className="font-mono bg-[var(--bg-elevated)] px-2 py-0.5 rounded text-[10px] text-text-muted">
                  {shortlisted.length}
                </span>
              </h3>

              {shortlisted.length === 0 ? (
                <p className="text-xs text-text-disabled py-4 text-center">{t.shortlistEmpty}</p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                  {shortlisted.map((item) => (
                    <button
                      key={item.nameEn}
                      onClick={() => toggleShortlist(item)}
                      className="inline-flex items-center gap-1 bg-gold-deep/10 border border-gold-mid/20 hover:border-red-500/30 hover:bg-red-500/5 px-2.5 py-1 rounded-lg text-xs text-gold-bright hover:text-red-400 transition-all cursor-pointer font-bold"
                    >
                      {isTa ? item.nameTa : item.nameEn}
                      <span className="text-[9px] opacity-50 font-normal">({item.startingLetter})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Catalog Grid */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-4 top-3.5 text-text-muted" size={16} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] border border-bg-border rounded-xl pl-11 pr-4 py-3 text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all text-sm"
                />
              </div>

              {/* Gender Tab Headers */}
              <div className="flex bg-[var(--bg-card)] border border-bg-border p-1 rounded-xl w-full sm:w-auto shrink-0 select-none">
                {(['all', 'boy', 'girl', 'unisex'] as const).map((filter) => {
                  const isActive = genderFilter === filter
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setGenderFilter(filter)}
                      className={`
                        px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer text-center whitespace-nowrap
                        ${isActive 
                          ? 'bg-gold-deep text-white shadow-sm' 
                          : 'text-text-secondary hover:text-[var(--text-primary)]'
                        }
                      `}
                    >
                      {filter === 'all' && t.filterAll}
                      {filter === 'boy' && t.filterBoy}
                      {filter === 'girl' && t.filterGirl}
                      {filter === 'unisex' && t.filterUnisex}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Names Results Panel */}
            <AnimatePresence mode="wait">
              {filteredNames.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 rounded-2xl border border-white/5 bg-black/10 flex flex-col items-center justify-center text-center gap-3 py-16"
                >
                  <Info size={32} className="text-text-muted" />
                  <p className="text-sm text-text-secondary max-w-sm leading-relaxed">{t.noNames}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {filteredNames.map((name) => {
                    const isFav = shortlisted.some(item => item.nameEn === name.nameEn)
                    return (
                      <motion.div
                        key={name.nameEn}
                        variants={cardVariants}
                        className="p-5 rounded-2xl border flex flex-col justify-between gap-3 relative overflow-hidden transition-all duration-300 hover:border-gold-mid/30"
                        style={{
                          background: 'var(--bg-card)',
                          borderColor: isFav ? 'var(--gold-mid)' : 'var(--bg-border)',
                        }}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xl font-black text-[var(--text-primary)] tracking-wide">
                              {name.nameEn}
                            </span>
                            <span className="text-sm font-bold text-gold-bright">
                              {name.nameTa}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Gender Badge */}
                            <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase border
                              ${name.gender === 'boy' 
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                                : name.gender === 'girl'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}
                            >
                              {name.gender === 'boy' ? (isTa ? 'ஆண்' : 'Boy') : name.gender === 'girl' ? (isTa ? 'பெண்' : 'Girl') : (isTa ? 'பொது' : 'Unisex')}
                            </span>

                            {/* Shortlist Heart Button */}
                            <button
                              onClick={() => toggleShortlist(name)}
                              className={`p-2 rounded-lg border transition-all cursor-pointer
                                ${isFav 
                                  ? 'bg-red-500/10 border-red-500/35 text-red-400' 
                                  : 'bg-[var(--bg-elevated)] border-[var(--bg-border)] text-text-muted hover:text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                                }`}
                            >
                              <Heart className={isFav ? 'fill-red-400' : ''} size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Meaning */}
                        <div className="border-t border-[var(--bg-border)] pt-2 flex flex-col gap-0.5 text-xs text-text-secondary">
                          <span className="font-semibold text-text-muted">{t.meaningLabel}</span>
                          <p className="leading-relaxed">
                            {isTa ? name.meaningTa : name.meaningEn}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
      </div>
    </ErrorBoundary>
  )
}
