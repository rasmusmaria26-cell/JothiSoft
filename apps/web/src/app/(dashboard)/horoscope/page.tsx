'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, User, Sparkles, AlertCircle, RefreshCw, Save, Compass } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'
import { useAuthStore } from '@/store/authStore'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import { RasiChart } from '@/components/astro/RasiChart'
import { DasaTable } from '@/components/astro/DasaTable'
import { PredictionsTab } from '@/components/astro/PredictionsTab'
import { CityData, HoroscopeResponse, DashaResponse, PlanetData } from '@/types/astro'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { HoroscopeSkeleton } from '@/components/astro/SkeletonCards'
import api from '@/lib/api'

export default function HoroscopePage() {
  const { language } = useLanguage()
  const { user } = useAuthStore()

  // Form states
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const [saveToProfile, setSaveToProfile] = useState(false)

  // Loading and result states
  const [isCalculating, setIsCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [horoscope, setHoroscope] = useState<HoroscopeResponse | null>(null)
  const [dasa, setDasa] = useState<DashaResponse | null>(null)
  const [activeTab, setActiveTab] = useState<'charts' | 'planets' | 'dasa' | 'predictions'>('charts')
  const [isSavedProfileLoading, setIsSavedProfileLoading] = useState(false)

  // Labels dictionary
  const labels = {
    ta: {
      title: 'ஜாதக கணிப்பு',
      subtitle: 'உங்கள் பிறந்த விவரங்களின் அடிப்படையில் துல்லியமான ராசி, நவாம்சம் மற்றும் தசா புக்தி கணிப்புகள்',
      formTitle: 'பிறப்பு விவரங்கள்',
      name: 'முழு பெயர்',
      namePlaceholder: 'எ.கா. காவியா',
      dob: 'பிறந்த தேதி',
      tob: 'பிறந்த நேரம்',
      place: 'பிறந்த இடம்',
      saveProfile: 'எனது கணக்கில் இந்த விவரங்களை சேமிக்கவும்',
      calculate: 'ஜாதகம் கணிக்கவும்',
      calculating: 'கணிக்கப்படுகிறது...',
      resultsTitle: 'ஜாதக கணிப்பு முடிவுகள்',
      tabCharts: 'ராசி & நவாம்சம்',
      tabPlanets: 'கிரக நிலைகள்',
      tabDasa: 'தசா புக்தி',
      tabPredictions: 'பலன்கள்',
      recalculate: 'புதிய கணிப்பு',
      loadingProfile: 'சேமிக்கப்பட்ட விவரங்கள் ஏற்றப்படுகின்றன...',
      errorFetch: 'கணிப்புகளைப் பெறுவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
      planetName: 'கிரகம்',
      planetDegree: 'பாகை',
      planetSign: 'இராசி',
      planetHouse: 'வீடு',
      planetNakshatra: 'நட்சத்திரம்',
      planetPada: 'பாதம்',
      lagna: 'லக்னம்',
      activeDasa: 'நடப்பு தசை'
    },
    en: {
      title: 'Horoscope Generator',
      subtitle: 'Highly accurate Rasi, Navamsam, and Vimshottari Dasa calculations based on your birth coordinates',
      formTitle: 'Birth Details',
      name: 'Full Name',
      namePlaceholder: 'e.g. Kavya',
      dob: 'Date of Birth',
      tob: 'Time of Birth',
      place: 'Birth Place',
      saveProfile: 'Save these details to my default profile',
      calculate: 'Generate Horoscope',
      calculating: 'Calculating...',
      resultsTitle: 'Horoscope Report',
      tabCharts: 'Rasi & Navamsam',
      tabPlanets: 'Planets Strength',
      tabDasa: 'Dasa & Bhukti',
      tabPredictions: 'Predictions',
      recalculate: 'Reset Details',
      loadingProfile: 'Loading saved profile...',
      errorFetch: 'Error fetching horoscope calculation. Please try again.',
      planetName: 'Planet',
      planetDegree: 'Degree',
      planetSign: 'Zodiac Sign',
      planetHouse: 'House',
      planetNakshatra: 'Star',
      planetPada: 'Pada',
      lagna: 'Lagna',
      activeDasa: 'Active Dasa'
    }
  }[language]

  // Tamil planet name dictionary for table rendering
  const PLANET_NAME_TA: Record<string, string> = {
    'Lagna': 'லக்னம்',
    'Sun': 'சூரியன் (Sun)',
    'Moon': 'சந்திரன் (Moon)',
    'Mars': 'செவ்வாய் (Mars)',
    'Mercury': 'புதன் (Mercury)',
    'Jupiter': 'குரு (Jupiter)',
    'Venus': 'சுக்கிரன் (Venus)',
    'Saturn': 'சனி (Saturn)',
    'Rahu': 'ராகு (Rahu)',
    'Ketu': 'கேது (Ketu)'
  }

  const SIGN_MAP_TA: Record<string, string> = {
    'Mesha': 'மேஷம்', 'Vrishabha': 'ரிஷபம்', 'Mithuna': 'மிதுனம்', 'Kataka': 'கடகம்',
    'Simha': 'சிம்மம்', 'Kanya': 'கன்னி', 'Thula': 'துலாம்', 'Vrischika': 'விருச்சிகம்',
    'Dhanus': 'தனுசு', 'Makara': 'மகரம்', 'Kumbha': 'கும்பம்', 'Meena': 'மீனம்'
  }

  // Load saved birth profile on mount
  useEffect(() => {
    async function loadSavedProfile() {
      if (!user) return
      setIsSavedProfileLoading(true)
      try {
        const { data, error } = await supabase
          .from('birth_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (data && !error) {
          setName(data.name)
          setDob(data.dob)
          // Convert "HH:MM:SS" -> "HH:MM" for input type time
          setTob(data.tob.slice(0, 5))
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
        console.error('Failed to load birth profile:', err)
      } finally {
        setIsSavedProfileLoading(false)
      }
    }

    loadSavedProfile()
  }, [user])

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dob || !tob || !selectedCity) {
      setError(language === 'ta' ? 'அனைத்து விவரங்களையும் பூர்த்தி செய்யவும்.' : 'Please enter all details.')
      return
    }

    setIsCalculating(true)
    setError(null)

    try {
      const lat = selectedCity.lat !== undefined ? selectedCity.lat : selectedCity.latitude
      const lng = selectedCity.lng !== undefined ? selectedCity.lng : selectedCity.longitude

      // 1. Calculate full horoscope (Lagna, Rasi/Navamsam, Planet Positions) via Express proxy
      const horoRes = await api.post('/horoscope/calculate', {
        date: dob,
        time: tob,
        lat,
        lng,
        utcOffset: selectedCity.utc_offset || 5.5,
        language: language || 'ta'
      })

      if (!horoRes.success || !horoRes.data) {
        throw new Error('Horoscope calculation failed')
      }

      const horoData: HoroscopeResponse = horoRes.data

      // Find Moon's longitude to calculate dasa timeline
      const moonPlanet = horoData.planets.find(p => p.planet.toLowerCase() === 'moon')
      let dasaData: DashaResponse | null = null

      if (moonPlanet) {
        const moonSignIndex = [
          'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
          'Simha', 'Kanya', 'Thula', 'Vrischika',
          'Dhanus', 'Makara', 'Kumbha', 'Meena'
        ].indexOf(moonPlanet.sign)
        const moonLongitude = (moonSignIndex * 30) + moonPlanet.sign_degree

        // 2. Fetch dasa timeline based on Moon longitude via Express proxy
        const dasaRes = await api.post('/horoscope/dasha', {
          birth_date: dob,
          moon_longitude: moonLongitude
        })

        if (dasaRes && dasaRes.timeline) {
          dasaData = dasaRes as any
        }
      }

      setHoroscope(horoData)
      setDasa(dasaData)

      // 3. Optionally upsert user's profile if checkbox is checked
      if (saveToProfile && user) {
        await api.post('/profile/birth-profiles', {
          name: name.trim() || 'My Profile',
          dob: dob,
          tob: `${tob}:00`,
          lat,
          lng,
          place_name: `${selectedCity.name}, ${selectedCity.state || selectedCity.country}`,
        })
      }

    } catch (err) {
      console.error(err)
      setError(labels.errorFetch)
    } finally {
      setIsCalculating(false)
    }
  }

  const handleReset = () => {
    setHoroscope(null)
    setDasa(null)
    setError(null)
  }

  return (
    <ErrorBoundary label="Horoscope failed to load.">
      <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-3xl font-bold text-gold-bright flex items-center gap-2">
          <Sparkles className="h-5 sm:h-7 w-5 sm:w-7 text-gold-mid animate-pulse" />
          {labels.title}
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-2xl leading-relaxed">
          {labels.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Birth Input Form */}
        <div className="lg:col-span-4 w-full">
          <div 
            className="rounded-xl border p-5 relative overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--bg-border)'
            }}
          >
            <h2 className="text-sm sm:text-base font-bold text-gold-bright mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
              <Calendar className="h-4.5 w-4.5" />
              {labels.formTitle}
            </h2>

            {isSavedProfileLoading ? (
              <div className="py-8 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin text-gold-mid" />
                {labels.loadingProfile}
              </div>
            ) : (
              <form onSubmit={handleCalculate} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-secondary uppercase tracking-wider">
                    {labels.name}
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={labels.namePlaceholder}
                      className="w-full bg-bg-elevated/45 border border-bg-border rounded-md pl-10 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-gold-mid transition-colors"
                      style={{ background: 'var(--bg-elevated)' }}
                    />
                  </div>
                </div>

                {/* DOB & TOB Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-text-secondary uppercase tracking-wider">
                      {labels.dob}
                    </label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-bg-elevated/45 border border-bg-border rounded-md pl-10 pr-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold-mid transition-colors"
                        style={{ background: 'var(--bg-elevated)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-text-secondary uppercase tracking-wider">
                      {labels.tob}
                    </label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      <input
                        type="time"
                        required
                        value={tob}
                        onChange={(e) => setTob(e.target.value)}
                        className="w-full bg-bg-elevated/45 border border-bg-border rounded-md pl-10 pr-3 py-2 text-sm text-text-primary focus:outline-none focus:border-gold-mid transition-colors"
                        style={{ background: 'var(--bg-elevated)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Birthplace Autocomplete */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-secondary uppercase tracking-wider">
                    {labels.place}
                  </label>
                  <PlaceSearch
                    onSelect={setSelectedCity}
                    selectedCity={selectedCity}
                  />
                </div>

                {/* Save to Profile (only if logged in) */}
                {user && (
                  <label className="flex items-center gap-2 text-xs text-text-secondary select-none cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={saveToProfile}
                      onChange={(e) => setSaveToProfile(e.target.checked)}
                      className="rounded border-bg-border text-gold-mid focus:ring-0 bg-transparent h-4 w-4"
                    />
                    <span className="flex items-center gap-1.5">
                      <Save className="h-3.5 w-3.5 text-text-muted" />
                      {labels.saveProfile}
                    </span>
                  </label>
                )}

                {error && (
                  <div className="p-3 text-xs text-red-400 bg-red-500/5 border border-red-500/10 rounded flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isCalculating || !dob || !tob || !selectedCity}
                  className="w-full py-2.5 rounded-md font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, var(--gold-deep) 0%, #7a4e10 100%)',
                  }}
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      {labels.calculating}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {labels.calculate}
                    </>
                  )}
                </button>

                {horoscope && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-2 border border-bg-border hover:border-text-muted rounded-md text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    {labels.recalculate}
                  </button>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Calculations Report Display */}
        <div className="lg:col-span-8 w-full">
          <AnimatePresence mode="wait">
            {isCalculating ? (
              <HoroscopeSkeleton />
            ) : !horoscope ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="rounded-xl border p-12 text-center flex flex-col items-center justify-center gap-4"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--bg-border)',
                  minHeight: '400px'
                }}
              >
                <div className="p-4 rounded-full bg-gold-deep/5 border border-gold-mid/10">
                  <Sparkles className="h-10 w-10 text-gold-mid animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gold-bright">
                    {language === 'ta' ? 'கணிப்பு முடிவுகள் இங்கே தோன்றும்' : 'Awaiting Calculation'}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-muted mt-1.5 max-w-sm mx-auto leading-relaxed">
                    {language === 'ta' 
                      ? 'உங்கள் விவரங்களை இடதுபுறம் உள்ள படிவத்தில் பூர்த்தி செய்து கணிக்கவும்.'
                      : 'Fill in your birth details in the form to generate your astrological natal report.'}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="rounded-xl border p-4 sm:p-6"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--bg-border)'
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 mb-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gold-bright flex items-center gap-2">
                      {name ? `${name} - ` : ''} {labels.resultsTitle}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-text-muted mt-0.5">
                      {dob} · {tob} · {selectedCity?.name}
                    </p>
                  </div>

                  {/* Tabs Selector */}
                  <div className="flex bg-[var(--bg-elevated)] border border-bg-border p-1 rounded-lg self-start">
                    {[
                      { id: 'charts', label: labels.tabCharts },
                      { id: 'planets', label: labels.tabPlanets },
                      { id: 'dasa', label: labels.tabDasa },
                      { id: 'predictions', label: labels.tabPredictions }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`
                          px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer
                          ${activeTab === tab.id 
                            ? 'bg-gold-deep text-white font-bold shadow-sm' 
                            : 'text-text-secondary hover:text-text-primary'
                          }
                        `}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Contents */}
                <div>
                  {activeTab === 'charts' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-2">
                      <RasiChart
                        chart={horoscope.rasi_chart}
                        planets={horoscope.planets}
                        title={language === 'ta' ? 'இராசி கட்டம் (D1)' : 'Rasi Chart (D1)'}
                        lagnaSign={horoscope.lagna.sign}
                      />
                      <RasiChart
                        chart={horoscope.navamsam_chart}
                        planets={horoscope.planets}
                        title={language === 'ta' ? 'நவாம்ச கட்டம் (D9)' : 'Navamsam Chart (D9)'}
                        lagnaSign={horoscope.planets.find(p => p.planet === 'Lagna')?.sign || horoscope.lagna.sign}
                      />
                    </div>
                  )}

                  {activeTab === 'planets' && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-bg-border text-text-muted uppercase font-semibold text-[10px] tracking-wider">
                            <th className="py-3 px-4">{labels.planetName}</th>
                            <th className="py-3 px-4">{labels.planetDegree}</th>
                            <th className="py-3 px-4">{labels.planetSign}</th>
                            <th className="py-3 px-4">{labels.planetHouse}</th>
                            <th className="py-3 px-4">{labels.planetNakshatra}</th>
                            <th className="py-3 px-4">{labels.planetPada}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {horoscope.planets.map((p, idx) => {
                            const isLagnaRow = p.planet === 'Lagna'
                            return (
                              <tr 
                                key={idx} 
                                className={`
                                  hover:bg-white/5 transition-colors
                                  ${isLagnaRow ? 'text-gold-bright font-semibold bg-gold-deep/5' : 'text-text-secondary'}
                                `}
                              >
                                <td className="py-3.5 px-4 font-medium text-text-primary">
                                  {language === 'ta' ? (PLANET_NAME_TA[p.planet] || p.planet) : p.planet}
                                </td>
                                <td className="py-3.5 px-4 font-mono">
                                  {p.sign_degree.toFixed(2)}°
                                </td>
                                <td className="py-3.5 px-4">
                                  {language === 'ta' ? (SIGN_MAP_TA[p.sign] || p.sign) : p.sign}
                                </td>
                                <td className="py-3.5 px-4 font-mono font-semibold text-gold-mid">
                                  {p.house}
                                </td>
                                <td className="py-3.5 px-4">
                                  {p.nakshatra}
                                </td>
                                <td className="py-3.5 px-4 font-mono font-medium text-text-muted">
                                  {p.pada || '-'}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {activeTab === 'dasa' && (
                    <div className="py-2">
                      {dasa ? (
                        <div className="flex flex-col gap-4">
                          <Link 
                            href="/horoscope/antharam"
                            className="p-4 rounded-xl border border-gold-mid/30 hover:border-gold-bright transition-all duration-300 flex items-center justify-between gap-4 group"
                            style={{
                              background: 'linear-gradient(135deg, var(--gold-tint) 0%, var(--gold-subtle) 100%)',
                              boxShadow: '0 0 15px var(--gold-tint)'
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gold-mid/10 flex items-center justify-center border border-gold-mid/20">
                                <Compass size={18} className="text-gold-bright animate-spin-slow" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[11px] uppercase tracking-wider font-extrabold text-gold-bright">
                                  {language === 'ta' ? 'புதிய தசா காலவரிசை ஆய்வாளர் 4.0' : 'NEW HOROSCOPE 4.0 EXPLORER'}
                                </span>
                                <span className="text-xs text-text-secondary mt-0.5 group-hover:text-white transition-colors">
                                  {language === 'ta' 
                                    ? '3-ஆம் நிலை அதிநுண்ணிய "அந்தரம்" காலங்கள் & வருங்கால விதி கணக்கீட்டாளரை ஆராயுங்கள்.' 
                                    : 'Deep dive into 3rd-level precise Antharam periods & Future Destiny Calculator.'}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-bold text-gold-bright group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              {language === 'ta' ? 'ஆராய்க' : 'Explore'} ➔
                            </span>
                          </Link>

                          <DasaTable
                            timeline={dasa.timeline}
                            currentDasaLord={dasa.current.dasha}
                            currentBhuktiLord={dasa.current.bhukti}
                          />
                        </div>
                      ) : (
                        <div className="p-8 text-center text-xs text-text-muted">
                          {language === 'ta' ? 'தசா புத்தி கணிப்புகளைப் பெற முடியவில்லை' : 'Unable to calculate Dasa timeline'}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'predictions' && horoscope.predictions && (
                    <div className="py-2">
                      <PredictionsTab predictions={horoscope.predictions} />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </ErrorBoundary>
  )
}
