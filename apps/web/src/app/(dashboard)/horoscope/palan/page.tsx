'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Loader2, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useBirthProfile } from '@/hooks/useBirthProfile'
import { PredictionsTab } from '@/components/astro/PredictionsTab'
import { HoroscopeResponse } from '@/types/astro'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import { CityData } from '@/types/astro'
import api from '@/lib/api'

export default function PalanPage() {
  const { language } = useLanguage()
  const { data: birthProfile, isLoading: isProfileLoading } = useBirthProfile()

  const [horoscope, setHoroscope] = useState<HoroscopeResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // For manual entry when no profile
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)

  const t = language === 'ta' ? {
    title: 'ஜாதக பலன்கள்',
    subtitle: 'உங்கள் ஜாதகத்தின் அடிப்படையில் லக்னம், ராசி மற்றும் நட்சத்திர பலன்கள்',
    back: 'முகப்பிற்குச் செல்',
    loading: 'பலன்கள் தயாரிக்கப்படுகின்றன...',
    loadingProfile: 'விவரங்கள் ஏற்றப்படுகின்றன...',
    error: 'பலன்களைப் பெறுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.',
    noProfile: 'சேமிக்கப்பட்ட ஜாதகம் இல்லை. கீழே விவரங்களை உள்ளிடவும்.',
    dob: 'பிறந்த தேதி',
    tob: 'பிறந்த நேரம்',
    place: 'பிறந்த இடம்',
    generate: 'பலன்கள் காண',
  } : {
    title: 'Horoscope Predictions',
    subtitle: 'Lagna, Moon Sign and Birth Star predictions based on your horoscope',
    back: 'Back to Dashboard',
    loading: 'Generating your predictions...',
    loadingProfile: 'Loading your profile...',
    error: 'Error fetching predictions. Please try again.',
    noProfile: 'No saved birth profile found. Please enter your details below.',
    dob: 'Date of Birth',
    tob: 'Time of Birth',
    place: 'Birth Place',
    generate: 'Get Predictions',
  }

  const fetchHoroscope = async (year: number, month: number, day: number, hour: number, minute: number, lat: number, lng: number) => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
        lat,
        lng,
        utcOffset: 5.5,
        language
      }
      const horoRes = await api.post('/horoscope/calculate', payload)
      if (!horoRes.success || !horoRes.data) throw new Error('API Error')
      setHoroscope(horoRes.data)
    } catch (err) {
      console.error(err)
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-fetch if birth profile is available
  useEffect(() => {
    if (isProfileLoading || !birthProfile) return
    const [year, month, day] = birthProfile.dob.split('-').map(Number)
    const [hour, minute] = birthProfile.tob.split(':').map(Number)
    fetchHoroscope(year, month, day, hour, minute, Number(birthProfile.lat), Number(birthProfile.lng))
  }, [birthProfile, isProfileLoading])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCity) {
      setError(language === 'ta' ? 'பிறந்த இடத்தைத் தேடி பட்டியலிலிருந்து தேர்ந்தெடுக்கவும்.' : 'Please search and select a birth place from the suggestions.')
      return
    }
    if (!dob || !tob) return
    const [year, month, day] = dob.split('-').map(Number)
    const [hour, minute] = tob.split(':').map(Number)
    fetchHoroscope(year, month, day, hour, minute, selectedCity.latitude || selectedCity.lat!, selectedCity.longitude || selectedCity.lng!)
  }

  const showManualForm = !isProfileLoading && !birthProfile && !horoscope

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-gold-bright transition-colors text-sm font-medium">
          <ArrowLeft size={16} />
          {t.back}
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gold-bright tracking-tight flex items-center gap-3">
          <Sparkles className="text-gold-bright" size={28} />
          {t.title}
        </h1>
        <p className="text-text-secondary text-sm md:text-base max-w-2xl">{t.subtitle}</p>
      </div>

      <AnimatePresence mode="wait">
        {/* Loading state */}
        {(isProfileLoading || loading) && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-4 py-24 text-center"
          >
            <Loader2 className="w-10 h-10 animate-spin text-gold-mid" />
            <p className="text-text-muted text-sm">{isProfileLoading ? t.loadingProfile : t.loading}</p>
          </motion.div>
        )}

        {/* Error state */}
        {!loading && error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}

        {/* Manual form if no profile */}
        {showManualForm && !loading && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 sm:p-6 rounded-2xl border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--bg-border)',
            }}
          >
            <p className="text-text-muted text-sm mb-4">{t.noProfile}</p>
            <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary ml-1">{t.dob}</label>
                  <input type="date" required value={dob} onChange={e => setDob(e.target.value)}
                    className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-text-primary ml-1">{t.tob}</label>
                  <input type="time" required value={tob} onChange={e => setTob(e.target.value)}
                    className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-text-primary ml-1">{t.place}</label>
                <PlaceSearch onSelect={setSelectedCity} selectedCity={selectedCity} />
              </div>
              <button type="submit"
                className="w-full py-3 mt-1 rounded-xl font-bold bg-gradient-to-r from-gold-bright to-gold-deep text-bg-page hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {t.generate}
              </button>
            </form>
          </motion.div>
        )}

        {/* Predictions results */}
        {!loading && !error && horoscope?.predictions && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PredictionsTab predictions={horoscope.predictions} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
