'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, MapPin, Compass, AlertCircle, RefreshCw, Sun, Moon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'
import { useAuthStore } from '@/store/authStore'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import { CityData } from '@/types/astro'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { PanchangamSkeleton } from '@/components/astro/SkeletonCards'
import api from '@/lib/api'

// Interfaces for Panchangam response
interface PanchangamResponse {
  date: string
  paksha: string
  tithi: { name: string; index: number }
  nakshatra: { name: string; index: number; pada: number }
  yogam: { name: string; index: number }
  karanam: { name: string }
  rahu_kalam: { start: string; end: string }
  sun_longitude: number
  moon_longitude: number
}

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

export default function PanchangamPage() {
  const { language } = useLanguage()
  const { user } = useAuthStore()

  // Format today's date in YYYY-MM-DD local time format
  const getLocalDateString = (d: Date = new Date()) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // States
  const [selectedDate, setSelectedDate] = useState(getLocalDateString())
  const [selectedCity, setSelectedCity] = useState<CityData>(DEFAULT_CITY)
  const [panchangam, setPanchangam] = useState<PanchangamResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Dictionary definitions for Tamil translations
  const TITHIS_TA = [
    "பிரதமை (Pratipada)", "துவிதியை (Dvitiya)", "திருதியை (Tritiya)", "சதுர்த்தி (Chaturthi)", "பஞ்சமி (Panchami)",
    "சஷ்டி (Shashthi)", "சப்தமி (Saptami)", "அஷ்டமி (Ashtami)", "நவமி (Navami)", "தசமி (Dashami)",
    "ஏகாதசி (Ekadashi)", "துவாதசி (Dwadashi)", "திரயோதசி (Trayodashi)", "சதுர்தசி (Chaturdashi)", "பௌர்ணமி (Purnima)",
    "பிரதமை (Pratipada)", "துவிதியை (Dvitiya)", "திருதியை (Tritiya)", "சதுர்த்தி (Chaturthi)", "பஞ்சமி (Panchami)",
    "சஷ்டி (Shashthi)", "சப்தமி (Saptami)", "அஷ்டமி (Ashtami)", "நவமி (Navami)", "தசமி (Dashami)",
    "ஏகாதசி (Ekadashi)", "துவாதசி (Dwadashi)", "திரயோதசி (Trayodashi)", "சதுர்தசி (Chaturdashi)", "அமாவாசை (Amavasya)"
  ]

  const NAKSHATRAS_TA = [
    "அஸ்வினி (Aswini)", "பரணி (Bharani)", "கார்த்திகை (Krithika)", "ரோகிணி (Rohini)", "மிருகசீரிடம் (Mrigasira)",
    "திருவாதிரை (Arudra)", "புனர்பூசம் (Punarvasu)", "பூசம் (Pushya)", "ஆயில்யம் (Ashlesha)", "மகம் (Magha)",
    "பூரம் (Poorva Phalguni)", "உத்திரம் (Uttara Phalguni)", "அஸ்தம் (Hasta)", "சித்திரை (Chitra)", "சுவாதி (Swati)",
    "விசாகம் (Vishakha)", "அனுஷம் (Anuradha)", "கேட்டை (Jyeshtha)", "மூலம் (Moola)", "பூராடம் (Poorvashadha)",
    "உத்திராடம் (Uttarashadha)", "திருவோணம் (Shravana)", "அவிட்டம் (Dhanishta)", "சதயம் (Shatabhisha)", "பூரட்டாதி (Poorvabhadra)",
    "உத்திரட்டாதி (Uttarabhadra)", "ரேவதி (Revati)"
  ]

  const YOGAS_TA = [
    "விஷ்கம்பம் (Vishkambha)", "பிரீதி (Preeti)", "ஆயுஷ்மான் (Ayushman)", "சௌபாக்கியம் (Saubhagya)", "சோபனம் (Shobhana)",
    "அதிகண்டம் (Atiganda)", "சுகர்மா (Sukarma)", "திருதி (Dhriti)", "சூலம் (Shoola)", "கண்டம் (Ganda)",
    "விருத்தி (Vriddhi)", "துருவம் (Dhruva)", "வியாகாதம் (Vyaghata)", "ஹர்ஷணம் (Harshana)", "வஜிரம் (Vajra)",
    "சித்தி (Siddhi)", "வியதீபாதம் (Vyatipata)", "வரியான் (Variyana)", "பரிகம் (Parigha)", "சிவம் (Shiva)",
    "சித்தம் (Siddha)", "சாத்தியம் (Sadhya)", "சுபம் (Shubha)", "சுக்கிலம் (Shukla)", "பிரம்மா (Brahma)",
    "இந்திரம் (Indra)", "வைதிருதி (Vaidhriti)"
  ]

  const KARANAS_TA: Record<string, string> = {
    "Bava": "பவம் (Bava)", "Balava": "பாலவம் (Balava)", "Kaulava": "கௌலவம் (Kaulava)", "Taitila": "தைதிலம் (Taitila)",
    "Garaja": "கரசை (Garaja)", "Vanija": "வணிசை (Vanija)", "Vishti": "பத்திரை/விஷ்டி (Vishti)",
    "Shakuni": "சகுனி (Shakuni)", "Chatushpada": "சதுஷ்பாதம் (Chatushpada)", "Naga": "நாகவம் (Naga)", "Kimstughna": "கிம்ஸ்துக்கினம் (Kimstughna)"
  }

  const PAKSHA_TA: Record<string, string> = {
    "Shukla": "வளர்பிறை (Shukla)",
    "Krishna": "தேய்பிறை (Krishna)"
  }

  // English details dict
  const labels = {
    ta: {
      title: 'நாள்காட்டி & பஞ்சாங்கம்',
      subtitle: 'தினசரி பஞ்சாங்கம் - திதி, நட்சத்திரம், யோகம், கரணம் மற்றும் நல்ல நேரங்கள்',
      date: 'தேதி',
      place: 'இடம்',
      today: 'இன்று',
      yesterday: 'நேற்று',
      tomorrow: 'நாளை',
      calculate: 'கணிக்கவும்',
      calculating: 'கணிக்கப்படுகிறது...',
      tithi: 'திதி',
      nakshatra: 'நட்சத்திரம்',
      yogam: 'யோகம்',
      karanam: 'கரணம்',
      rahuKalam: 'ராகு காலம்',
      sunLong: 'சூரியன் பாகை',
      moonLong: 'சந்திரன் பாகை',
      paksha: 'பட்சம்',
      pada: 'பாதம்',
      errorFetch: 'பஞ்சாங்கம் கணிப்பதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
      loadingProfile: 'விவரங்கள் ஏற்றப்படுகின்றன...'
    },
    en: {
      title: 'Daily Panchangam',
      subtitle: 'Accurate Tithi, Nakshatra, Yogam, Karanam, and Muhurtham timings for any date and location',
      date: 'Date',
      place: 'Place',
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      calculate: 'Calculate',
      calculating: 'Calculating...',
      tithi: 'Tithi',
      nakshatra: 'Nakshatra',
      yogam: 'Yogam',
      karanam: 'Karanam',
      rahuKalam: 'Rahu Kalam',
      sunLong: 'Sun Longitude',
      moonLong: 'Moon Longitude',
      paksha: 'Paksha',
      pada: 'Pada',
      errorFetch: 'Failed to fetch Panchangam calculation. Please try again.',
      loadingProfile: 'Loading profile coordinates...'
    }
  }[language]

  // Load default user profile coordinates if available
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
            utc_offset: 5.5
          })
        }
      } catch (err) {
        console.error('Failed to load profile for Panchangam:', err)
      }
    }

    loadSavedProfile()
  }, [user])

  // Fetch panchangam calculations on date or location change
  useEffect(() => {
    let active = true

    async function fetchPanchangam() {
      setIsLoading(true)
      setError(null)
      try {
        const json = await api.post('/panchangam/daily', {
          date: selectedDate,
          lat: selectedCity.latitude,
          lng: selectedCity.longitude,
          utcOffset: selectedCity.utc_offset || 5.5,
          language: language || 'ta'
        })

        if (!json.success || !json.data) {
          throw new Error('Panchangam API failed')
        }

        if (active) {
          setPanchangam(json.data)
        }
      } catch (err) {
        console.error(err)
        if (active) {
          setError(labels.errorFetch)
        }
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    fetchPanchangam()

    return () => {
      active = false
    }
  }, [selectedDate, selectedCity, language, labels.errorFetch])

  // Helper date manipulators
  const changeDate = (days: number) => {
    const current = new Date(selectedDate)
    current.setDate(current.getDate() + days)
    setSelectedDate(getLocalDateString(current))
  }

  const navigateToToday = () => {
    setSelectedDate(getLocalDateString())
  }

  return (
    <ErrorBoundary label="Daily Panchangam failed to load.">
      <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-gold-bright flex items-center gap-2">
            <Compass className="h-5 sm:h-7 w-5 sm:w-7 text-gold-mid animate-spin-slow" style={{ color: 'var(--cat-panchangam)' }} />
            {labels.title}
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl leading-relaxed">
            {labels.subtitle}
          </p>
        </div>
      </div>

      {/* Inputs Configuration Bar */}
      <div 
        className="rounded-xl border p-4 mb-6 flex flex-col md:flex-row items-center gap-4 justify-between"
        style={{
          background: 'rgba(15, 15, 36, 0.45)',
          borderColor: 'rgba(201, 146, 42, 0.15)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Date Selector */}
          <div className="w-full sm:w-auto relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-56 bg-bg-elevated/45 border border-bg-border rounded-md pl-10 pr-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold-mid transition-colors"
              style={{ background: 'rgba(26, 18, 9, 0.45)' }}
            />
          </div>

          {/* Quick Shortcuts */}
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <button
              onClick={() => changeDate(-1)}
              className="px-3 py-2 rounded-md border border-bg-border text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
            >
              {labels.yesterday}
            </button>
            <button
              onClick={navigateToToday}
              className="px-3 py-2 rounded-md border border-gold-mid/30 text-xs font-bold text-gold-bright hover:bg-gold-deep/10 transition-colors cursor-pointer"
            >
              {labels.today}
            </button>
            <button
              onClick={() => changeDate(1)}
              className="px-3 py-2 rounded-md border border-bg-border text-xs text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
            >
              {labels.tomorrow}
            </button>
          </div>
        </div>

        {/* Location Override Search */}
        <div className="w-full md:w-80">
          <PlaceSearch
            onSelect={setSelectedCity}
            selectedCity={selectedCity}
          />
        </div>
      </div>

      {/* Main Results Dashboard */}
      <AnimatePresence mode="wait">
        {isLoading && !panchangam ? (
          <PanchangamSkeleton />
        ) : error ? (
          <div className="p-4 text-sm text-red-400 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-3 justify-center">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : panchangam ? (
          <motion.div
            key="panchangam-results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* The Five Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Tithi Card */}
              <div 
                className="rounded-xl border p-5 relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background: 'rgba(26, 18, 9, 0.45)',
                  borderColor: 'rgba(74, 56, 40, 0.6)'
                }}
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-gold-deep/5 to-transparent rounded-bl-full pointer-events-none" />
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                  {labels.tithi}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gold-bright">
                  {language === 'ta' 
                    ? (TITHIS_TA[panchangam.tithi.index - 1] || panchangam.tithi.name) 
                    : panchangam.tithi.name}
                </h3>
                <span className="text-[11px] block mt-1.5 font-medium text-text-secondary">
                  {labels.paksha}: {language === 'ta' ? (PAKSHA_TA[panchangam.paksha] || panchangam.paksha) : panchangam.paksha}
                </span>
              </div>

              {/* Nakshatra Card */}
              <div 
                className="rounded-xl border p-5 relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background: 'rgba(26, 18, 9, 0.45)',
                  borderColor: 'rgba(74, 56, 40, 0.6)'
                }}
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-gold-deep/5 to-transparent rounded-bl-full pointer-events-none" />
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                  {labels.nakshatra}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gold-bright">
                  {language === 'ta' 
                    ? (NAKSHATRAS_TA[panchangam.nakshatra.index - 1] || panchangam.nakshatra.name) 
                    : panchangam.nakshatra.name}
                </h3>
                <span className="text-[11px] block mt-1.5 font-medium text-text-secondary">
                  {labels.pada}: {panchangam.nakshatra.pada}
                </span>
              </div>

              {/* Yogam Card */}
              <div 
                className="rounded-xl border p-5 relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background: 'rgba(26, 18, 9, 0.45)',
                  borderColor: 'rgba(74, 56, 40, 0.6)'
                }}
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-gold-deep/5 to-transparent rounded-bl-full pointer-events-none" />
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                  {labels.yogam}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gold-bright">
                  {language === 'ta' 
                    ? (YOGAS_TA[panchangam.yogam.index - 1] || panchangam.yogam.name) 
                    : panchangam.yogam.name}
                </h3>
                <span className="text-[11px] block mt-1.5 font-medium text-text-muted">
                  Index: {panchangam.yogam.index}
                </span>
              </div>

              {/* Karanam Card */}
              <div 
                className="rounded-xl border p-5 relative overflow-hidden transition-all duration-200 hover:translate-y-[-2px]"
                style={{
                  background: 'rgba(26, 18, 9, 0.45)',
                  borderColor: 'rgba(74, 56, 40, 0.6)'
                }}
              >
                <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-br from-gold-deep/5 to-transparent rounded-bl-full pointer-events-none" />
                <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block mb-1">
                  {labels.karanam}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-gold-bright">
                  {language === 'ta' 
                    ? (KARANAS_TA[panchangam.karanam.name] || panchangam.karanam.name) 
                    : panchangam.karanam.name}
                </h3>
                <span className="text-[11px] block mt-1.5 font-medium text-text-muted">
                  Daily calculation
                </span>
              </div>

            </div>

            {/* Timings and Astronomical Coordinates Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Timing Slots Panel */}
              <div 
                className="lg:col-span-6 rounded-xl border p-5"
                style={{
                  background: 'rgba(15, 15, 36, 0.45)',
                  borderColor: 'rgba(201, 146, 42, 0.2)'
                }}
              >
                <h3 className="text-sm sm:text-base font-bold text-gold-bright mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--danger)' }} />
                  {labels.rahuKalam} (Rahu Kalam)
                </h3>
                <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-text-muted block">
                      {labels.rahuKalam}
                    </span>
                    <span className="text-lg font-bold text-red-400 mt-0.5 block">
                      {panchangam.rahu_kalam.start} - {panchangam.rahu_kalam.end}
                    </span>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-full">
                    <Sun className="h-6 w-6 text-red-400" />
                  </div>
                </div>
              </div>

              {/* Astro Positions Panel */}
              <div 
                className="lg:col-span-6 rounded-xl border p-5"
                style={{
                  background: 'rgba(15, 15, 36, 0.45)',
                  borderColor: 'rgba(201, 146, 42, 0.2)'
                }}
              >
                <h3 className="text-sm sm:text-base font-bold text-gold-bright mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Compass className="h-4.5 w-4.5 text-gold-mid" />
                  {language === 'ta' ? 'சூரிய / சந்திர நிலைகள்' : 'Astronomical Longitudes'}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/30 rounded-lg border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        {labels.sunLong}
                      </span>
                      <span className="text-base font-mono font-bold text-text-primary mt-1 block">
                        {panchangam.sun_longitude}°
                      </span>
                    </div>
                    <div className="p-2 bg-yellow-500/5 border border-yellow-500/10 rounded-full">
                      <Sun className="h-5 w-5 text-yellow-400" />
                    </div>
                  </div>

                  <div className="p-4 bg-black/30 rounded-lg border border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-muted block">
                        {labels.moonLong}
                      </span>
                      <span className="text-base font-mono font-bold text-text-primary mt-1 block">
                        {panchangam.moon_longitude}°
                      </span>
                    </div>
                    <div className="p-2 bg-blue-500/5 border border-blue-500/10 rounded-full">
                      <Moon className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      </div>
    </ErrorBoundary>
  )
}
