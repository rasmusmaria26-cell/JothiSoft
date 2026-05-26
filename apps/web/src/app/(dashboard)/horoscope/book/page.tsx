'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Loader2, Printer, FileDown } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import { BookChartReport } from '@/components/astro/BookChartReport'
import { CityData, HoroscopeResponse, DashaResponse } from '@/types/astro'
import api from '@/lib/api'

export default function BookChartPage() {
  const { language } = useLanguage()

  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const [reportLanguage, setReportLanguage] = useState<'ta' | 'en'>('ta')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [horoscope, setHoroscope] = useState<HoroscopeResponse | null>(null)
  const [dasa, setDasa] = useState<DashaResponse | null>(null)
  const [showReport, setShowReport] = useState(false)

  const t = language === 'ta' ? {
    title: 'புத்தக ஜாதகம்',
    subtitle: '4 பக்க விரிவான ஜாதக நூல் — அச்சிட தயார்',
    back: 'முகப்பிற்குச் செல்',
    formTitle: 'பிறப்பு விவரங்கள்',
    name: 'முழு பெயர்',
    namePlaceholder: 'எ.கா. காவியா',
    dob: 'பிறந்த தேதி',
    tob: 'பிறந்த நேரம்',
    place: 'பிறந்த இடம்',
    lang: 'அறிக்கை மொழி',
    generate: 'ஜாதக நூல் உருவாக்கு',
    generating: 'உருவாக்கப்படுகிறது...',
    error: 'ஜாதகத்தை உருவாக்குவதில் பிழை. மீண்டும் முயற்சிக்கவும்.',
    print: 'அச்சிடு / PDF சேமி',
    back2: 'மீண்டும் உருவாக்கு',
  } : {
    title: 'Book Horoscope',
    subtitle: '4-page comprehensive Jathagam booklet — ready to print',
    back: 'Back to Dashboard',
    formTitle: 'Birth Details',
    name: 'Full Name',
    namePlaceholder: 'e.g. Kavya',
    dob: 'Date of Birth',
    tob: 'Time of Birth',
    place: 'Birth Place',
    lang: 'Report Language',
    generate: 'Generate Book Chart',
    generating: 'Generating...',
    error: 'Error generating horoscope. Please try again.',
    print: 'Print / Save PDF',
    back2: 'Generate Another',
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCity) return
    setLoading(true)
    setError(null)

    try {
      const lat = selectedCity.latitude ?? selectedCity.lat ?? 13.08
      const lng = selectedCity.longitude ?? selectedCity.lng ?? 80.27
      const tz = selectedCity.utc_offset ?? 5.5

      // 1. Fetch horoscope via Express proxy
      const horoRes = await api.post('/horoscope/calculate', {
        date: dob,
        time: tob,
        lat,
        lng,
        utcOffset: tz,
        language: reportLanguage
      })

      if (!horoRes.success || !horoRes.data) throw new Error('Horoscope API Error')
      const horoData = horoRes.data

      // 2. Calculate Moon Longitude and fetch Dasha
      const moonPlanet = horoData.planets.find((p: any) => p.planet.toLowerCase() === 'moon')
      let dasaData: DashaResponse | null = null

      if (moonPlanet) {
        const moonSignIndex = [
          'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
          'Simha', 'Kanya', 'Thula', 'Vrischika',
          'Dhanus', 'Makara', 'Kumbha', 'Meena'
        ].indexOf(moonPlanet.sign)
        
        if (moonSignIndex !== -1) {
          const moonLongitude = (moonSignIndex * 30) + moonPlanet.sign_degree
          
          try {
            const dasaRes = await api.post('/horoscope/dasha', {
              birth_date: dob,
              moon_longitude: moonLongitude
            })
            // Depending on the backend response structure for dasha
            dasaData = dasaRes.success ? dasaRes.data : dasaRes
          } catch (e) {
            console.error('Dasha fetch failed', e)
          }
        }
      }

      setHoroscope(horoData)
      setDasa(dasaData)
      setShowReport(true)
    } catch (err) {
      console.error(err)
      setError(t.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative">
      <AnimatePresence mode="wait">
        {!showReport ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex flex-col gap-2">
              <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-gold-bright transition-colors mb-2 text-sm font-medium">
                <ArrowLeft size={16} />
                {t.back}
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gold-bright tracking-tight flex items-center gap-3">
                <BookOpen size={28} />
                {t.title}
              </h1>
              <p className="text-text-secondary text-sm md:text-base max-w-2xl">{t.subtitle}</p>
            </div>

            <div
              className="w-full p-5 sm:p-6 rounded-2xl border"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--bg-border)',
                boxShadow: '0 8px 32px -4px rgba(0,0,0,0.1)'
              }}
            >
              <form onSubmit={handleGenerate} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.name}</label>
                    <input
                      type="text" required value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.place}</label>
                    <PlaceSearch onSelect={setSelectedCity} />
                  </div>
                </div>

                {/* Language Toggle */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-primary ml-1">{t.lang}</label>
                  <div className="flex bg-bg-page border border-bg-border rounded-xl overflow-hidden p-1">
                    {(['ta', 'en'] as const).map(l => (
                      <button key={l} type="button" onClick={() => setReportLanguage(l)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${reportLanguage === l ? 'bg-gold-deep/20 text-gold-bright shadow-sm' : 'text-text-muted hover:text-white'}`}>
                        {l === 'ta' ? 'தமிழ் (Tamil)' : 'English'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.dob}</label>
                    <input type="date" required value={dob} onChange={e => setDob(e.target.value)}
                      className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.tob}</label>
                    <input type="time" required value={tob} onChange={e => setTob(e.target.value)}
                      className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all" />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={!selectedCity || loading}
                  className={`w-full py-4 mt-2 rounded-xl font-bold tracking-wide text-bg-page transition-all duration-300 flex items-center justify-center gap-2
                    ${(!selectedCity || loading) ? 'bg-gold-muted/50 cursor-not-allowed text-white/50' : 'bg-gradient-to-r from-gold-bright to-gold-deep hover:shadow-lg hover:shadow-gold-mid/20 hover:scale-[1.01]'}`}
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />{t.generating}</>
                  ) : (
                    <><FileDown className="w-5 h-5" />{t.generate}</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col w-full relative pb-20"
          >
            {/* Top action bar */}
            <div className="print:hidden w-full max-w-[210mm] mx-auto flex items-center justify-between mb-6 bg-[var(--bg-card)] border border-bg-border p-3 rounded-xl">
              <button onClick={() => { setShowReport(false); setHoroscope(null); setDasa(null) }}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors">
                <ArrowLeft size={16} />
                {t.back2}
              </button>
              <button onClick={() => window.print()}
                className="flex items-center gap-2 text-sm bg-gold-deep/20 text-gold-bright px-4 py-2 rounded-lg border border-gold-mid/30 hover:bg-gold-deep/30 transition-all">
                <Printer size={16} />
                {t.print}
              </button>
            </div>

            {/* The report */}
            <div className="w-full flex flex-col items-center gap-4">
              {horoscope && (
                <BookChartReport
                  data={horoscope}
                  dasa={dasa}
                  profile={{ name, dob, tob, place: selectedCity?.name || '' }}
                  language={reportLanguage}
                />
              )}
            </div>

            {/* Floating print button */}
            <button onClick={() => window.print()}
              className="print:hidden fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-gold-bright text-black p-4 rounded-full shadow-2xl hover:scale-105 transition-transform z-50 flex items-center gap-2 pr-6">
              <Printer size={20} className="ml-1" />
              <span className="font-bold tracking-tight">{t.print}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
