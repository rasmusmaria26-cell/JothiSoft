'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import { CityData, HoroscopeResponse } from '@/types/astro'
import { SanjeeviReport } from '@/components/astro/SanjeeviReport'
import { Printer, ArrowLeft, Loader2, FileDown } from 'lucide-react'
import api from '@/lib/api'

export default function HoroscopePdfPage() {
  const { language } = useLanguage()

  // Form State
  const [name, setName] = useState('')
  const [fatherName, setFatherName] = useState('')
  const [motherName, setMotherName] = useState('')
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  const [gender, setGender] = useState<'Male' | 'Female'>('Male')

  // Astrologer Details
  const [astroName, setAstroName] = useState('')
  const [astroAddress, setAstroAddress] = useState('')
  const [astroPhone, setAstroPhone] = useState('')

  // API & View State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [horoscopeData, setHoroscopeData] = useState<HoroscopeResponse | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [reportLanguage, setReportLanguage] = useState<'ta' | 'en'>('ta')

  const t = {
    ta: {
      title: 'ஜாதகம் PDF (சஞ்சீவி)',
      subtitle: 'ஒற்றைப் பக்க அச்சுக்கு உகந்த ஜாதக அறிக்கை',
      formTitle: 'பிறப்பு விவரங்கள்',
      name: 'முழு பெயர்',
      namePlaceholder: '',
      fatherName: 'தந்தை பெயர்',
      fatherPlaceholder: '',
      motherName: 'தாய் பெயர்',
      motherPlaceholder: '',
      dob: 'பிறந்த தேதி',
      tob: 'பிறந்த நேரம்',
      place: 'பிறந்த இடம்',
      calculate: 'PDF உருவாக்கு',
      calculating: 'உருவாக்கப்படுகிறது...',
      errorFetch: 'ஜாதகத்தை உருவாக்குவதில் பிழை.',
      print: 'அச்சிடு / PDF சேமி',
      back: 'மீண்டும் உருவாக்கு',
      backToDashboard: 'முகப்பிற்குச் செல்',
      astroSectionTitle: 'ஜோதிடர் விவரங்கள் (விருப்பம்)',
      astroSectionDesc: 'அறிக்கையின் மேல் இடது பகுதியில் அச்சிட உங்கள் விவரங்களை உள்ளிடவும்.',
      astroName: 'ஜோதிடர் பெயர்',
      astroNamePlaceholder: '',
      astroAddress: 'முகவரி',
      astroAddressPlaceholder: '',
      astroPhone: 'தொலைபேசி எண்',
      astroPhonePlaceholder: '',
      gender: 'பாலினம்',
      male: 'ஆண்',
      female: 'பெண்'
    },
    en: {
      title: 'Horoscope PDF (Sanjeevi)',
      subtitle: 'Single-page print-optimized Sanjeevi report',
      formTitle: 'Birth Details',
      name: 'Full Name',
      namePlaceholder: '',
      fatherName: "Father's Name",
      fatherPlaceholder: '',
      motherName: "Mother's Name",
      motherPlaceholder: '',
      dob: 'Date of Birth',
      tob: 'Time of Birth',
      place: 'Birth Place',
      calculate: 'Generate PDF',
      calculating: 'Generating...',
      errorFetch: 'Error generating horoscope report.',
      print: 'Print / Save PDF',
      back: 'Generate Another',
      backToDashboard: 'Back to Dashboard',
      astroSectionTitle: 'Astrologer Details (Optional)',
      astroSectionDesc: 'Enter your business details to show them on the top-left of the printed report.',
      astroName: 'Astrologer Name',
      astroNamePlaceholder: '',
      astroAddress: 'Address',
      astroAddressPlaceholder: '',
      astroPhone: 'Phone Number',
      astroPhonePlaceholder: '',
      gender: 'Gender',
      male: 'Male',
      female: 'Female'
    }
  }[language]

  // Debugging utility / mock data generation could go here if needed.

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCity) {
      setError(language === 'ta' ? 'பிறந்த இடத்தைத் தேடி பட்டியலிலிருந்து தேர்ந்தெடுக்கவும்.' : 'Please search and select a birth place from the suggestions.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [year, month, day] = dob.split('-').map(Number)
      const [hours, minutes] = tob.split(':').map(Number)
      
      const payload = {
        date: dob,
        time: tob,
        lat: selectedCity.latitude || selectedCity.lat,
        lng: selectedCity.longitude || selectedCity.lng,
        utcOffset: selectedCity.utc_offset || 5.5,
        language: reportLanguage
      }

      // 1. Calculate full horoscope via Express proxy
      const horoRes = await api.post('/horoscope/calculate', payload)

      if (!horoRes.success || !horoRes.data) {
        throw new Error('Horoscope calculation failed')
      }

      const data = horoRes.data
      setHoroscopeData(data)
      setShowReport(true)
    } catch (err) {
      console.error(err)
      setError(t.errorFetch)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleReset = () => {
    setShowReport(false)
    setHoroscopeData(null)
  }


  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 relative">
      <AnimatePresence mode="wait">
        {!showReport ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex flex-col gap-2">
              <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-gold-bright transition-colors mb-2 text-sm font-medium">
                <ArrowLeft size={16} />
                {t.backToDashboard}
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gold-bright tracking-tight">
                {t.title}
              </h1>
              <p className="text-text-secondary text-sm md:text-base max-w-2xl">
                {t.subtitle}
              </p>
            </div>

            <div 
              className="w-full p-5 sm:p-6 rounded-2xl border"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--bg-border)',
                boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.1)'
              }}
            >
              <form onSubmit={handleGenerate} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: Birth Details */}
                  <div className="lg:col-span-2 flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-primary ml-1">
                          {t.name}
                        </label>
                        <input 
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.namePlaceholder}
                          className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-primary ml-1">
                          {t.place}
                        </label>
                        <PlaceSearch onSelect={setSelectedCity} selectedCity={selectedCity} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-primary ml-1">
                          {t.fatherName}
                        </label>
                        <input 
                          type="text"
                          value={fatherName}
                          onChange={(e) => setFatherName(e.target.value)}
                          placeholder={t.fatherPlaceholder}
                          className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-primary ml-1">
                          {t.motherName}
                        </label>
                        <input 
                          type="text"
                          value={motherName}
                          onChange={(e) => setMotherName(e.target.value)}
                          placeholder={t.motherPlaceholder}
                          className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                        />
                      </div>
                    </div>

                    {/* Language and Gender Toggle Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                      {/* Language Toggle */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-primary ml-1">
                          {language === 'ta' ? 'அறிக்கை மொழி' : 'Report Language'}
                        </label>
                        <div className="flex bg-bg-page border border-bg-border rounded-xl overflow-hidden p-1">
                          <button
                            type="button"
                            onClick={() => setReportLanguage('ta')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${reportLanguage === 'ta' ? 'bg-gold-deep/20 text-gold-bright shadow-sm' : 'text-text-muted hover:text-white'}`}
                          >
                            தமிழ் (Tamil)
                          </button>
                          <button
                            type="button"
                            onClick={() => setReportLanguage('en')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${reportLanguage === 'en' ? 'bg-gold-deep/20 text-gold-bright shadow-sm' : 'text-text-muted hover:text-white'}`}
                          >
                            English
                          </button>
                        </div>
                      </div>

                      {/* Gender Toggle */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-primary ml-1">
                          {t.gender}
                        </label>
                        <div className="flex bg-bg-page border border-bg-border rounded-xl overflow-hidden p-1">
                          <button
                            type="button"
                            onClick={() => setGender('Male')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${gender === 'Male' ? 'bg-gold-deep/20 text-gold-bright shadow-sm' : 'text-text-muted hover:text-white'}`}
                          >
                            {t.male}
                          </button>
                          <button
                            type="button"
                            onClick={() => setGender('Female')}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${gender === 'Female' ? 'bg-gold-deep/20 text-gold-bright shadow-sm' : 'text-text-muted hover:text-white'}`}
                          >
                            {t.female}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-primary ml-1">
                          {t.dob}
                        </label>
                        <input 
                          type="date"
                          required
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-text-primary ml-1">
                          {t.tob}
                        </label>
                        <input 
                          type="time"
                          required
                          value={tob}
                          onChange={(e) => setTob(e.target.value)}
                          className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Astrologer Details card */}
                  <div className="lg:col-span-1 border border-bg-border rounded-2xl p-4 sm:p-5 bg-bg-page/30 flex flex-col gap-4 self-start shadow-inner">
                    <div className="flex flex-col gap-1 border-b border-bg-border pb-3">
                      <h3 className="font-bold text-gold-bright text-base tracking-tight">{t.astroSectionTitle}</h3>
                      <p className="text-text-secondary text-xs leading-relaxed">{t.astroSectionDesc}</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-primary ml-1">{t.astroName}</label>
                      <input 
                        type="text"
                        value={astroName}
                        onChange={(e) => setAstroName(e.target.value)}
                        placeholder={t.astroNamePlaceholder}
                        className="w-full bg-bg-page border border-bg-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-primary ml-1">{t.astroAddress}</label>
                      <textarea
                        value={astroAddress}
                        onChange={(e) => setAstroAddress(e.target.value)}
                        placeholder={t.astroAddressPlaceholder}
                        rows={2}
                        className="w-full bg-bg-page border border-bg-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all resize-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-primary ml-1">{t.astroPhone}</label>
                      <input 
                        type="text"
                        value={astroPhone}
                        onChange={(e) => setAstroPhone(e.target.value)}
                        placeholder={t.astroPhonePlaceholder}
                        className="w-full bg-bg-page border border-bg-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-3 mt-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    w-full py-4 mt-2 rounded-xl font-bold tracking-wide text-bg-page
                    transition-all duration-300 flex items-center justify-center gap-2
                    ${loading
                      ? 'bg-gold-muted/50 cursor-not-allowed text-white/50 opacity-60'
                      : 'bg-gradient-to-r from-gold-bright to-gold-deep hover:shadow-lg hover:shadow-gold-mid/20 hover:scale-[1.01]'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t.calculating}
                    </>
                  ) : (
                    <>
                      <FileDown className="w-5 h-5" />
                      {t.calculate}
                    </>
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
            {/* Top Action Bar (Hidden on Print) */}
            <div className="print:hidden w-full max-w-[210mm] mx-auto flex items-center justify-between mb-6 bg-[var(--bg-card)] border border-bg-border p-3 rounded-xl">
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors"
              >
                <ArrowLeft size={16} />
                {t.back}
              </button>
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 text-sm bg-gold-deep/20 text-gold-bright px-4 py-2 rounded-lg border border-gold-mid/30 hover:bg-gold-deep/30 transition-all"
              >
                <Printer size={16} />
                {t.print}
              </button>
            </div>

            {/* Print Container Wrapper */}
            <div className="w-full flex justify-center">
              {horoscopeData && (
                <SanjeeviReport 
                  data={horoscopeData} 
                  profile={{ 
                    name, 
                    gender,
                    dob, 
                    tob, 
                    place: selectedCity?.name || 'Unknown',
                    fatherName: fatherName || undefined,
                    motherName: motherName || undefined,
                    tithi: reportLanguage === 'ta' 
                      ? horoscopeData.panchangam?.tithi.name_ta 
                      : horoscopeData.panchangam?.tithi.name,
                    yoga: reportLanguage === 'ta' 
                      ? horoscopeData.panchangam?.yoga.name_ta 
                      : horoscopeData.panchangam?.yoga.name,
                    karana: reportLanguage === 'ta' 
                      ? horoscopeData.panchangam?.karana.name_ta 
                      : horoscopeData.panchangam?.karana.name
                  }} 
                  language={reportLanguage}
                  astrologer={{
                    name: astroName || undefined,
                    address: astroAddress || undefined,
                    phone: astroPhone || undefined
                  }}
                />
              )}
            </div>

            {/* Floating Print Button for mobile convenience (Hidden on Print) */}
            <button
              onClick={handlePrint}
              className="print:hidden fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-gold-bright text-black p-4 rounded-full shadow-2xl hover:scale-105 transition-transform z-50 flex items-center gap-2 pr-6"
            >
              <Printer size={20} className="ml-1" />
              <span className="font-bold tracking-tight">{t.print}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
