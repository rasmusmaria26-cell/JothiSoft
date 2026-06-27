'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Printer, Loader2, Sparkles, AlertCircle, FileText, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { useBirthProfile } from '@/hooks/useBirthProfile'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import { CityData } from '@/types/astro'
import { JathagamReport2 } from '@/components/astro/jathagam2/JathagamReport2'
import { useJathagamData } from '@/hooks/useJathagamData'
import type { JathagamProfile, AstrologerDetails, JathagamPDFData } from '@/types/jathagam'

type Phase = 'form' | 'calculating' | 'assembling' | 'report' | 'error'

export default function JathagamPage() {
  const { language: globalLanguage } = useLanguage()
  const { data: birthProfile, isLoading: isProfileLoading } = useBirthProfile()

  // Form States
  const [name, setName] = useState('')
  const [gender, setGender] = useState<'Male' | 'Female'>('Male')
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)
  
  // Optional Fields
  const [fatherName, setFatherName] = useState('')
  const [motherName, setMotherName] = useState('')
  const [hometown, setHometown] = useState('')

  // Astrologer Details
  const [includeAstroDetails, setIncludeAstroDetails] = useState(false)
  const [astroName, setAstroName] = useState('')
  const [astroAddress, setAstroAddress] = useState('')
  const [astroPhone, setAstroPhone] = useState('')

  // Flow State
  const [phase, setPhase] = useState<Phase>('form')
  const [reportLanguage, setReportLanguage] = useState<'ta' | 'en'>('ta')
  const [formError, setFormError] = useState<string | null>(null)

  // Sync global language on mount
  useEffect(() => {
    if (globalLanguage === 'en' || globalLanguage === 'ta') {
      setReportLanguage(globalLanguage)
    }
  }, [globalLanguage])

  // Load astrologer details from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAstroName = localStorage.getItem('jathagam_astro_name')
      const savedAstroAddress = localStorage.getItem('jathagam_astro_address')
      const savedAstroPhone = localStorage.getItem('jathagam_astro_phone')
      const savedInclude = localStorage.getItem('jathagam_include_astro')

      if (savedAstroName) setAstroName(savedAstroName)
      if (savedAstroAddress) setAstroAddress(savedAstroAddress)
      if (savedAstroPhone) setAstroPhone(savedAstroPhone)
      if (savedInclude === 'true') setIncludeAstroDetails(true)
    }
  }, [])

  // Save astrologer details on submission
  const saveAstroDetails = (nameVal: string, addrVal: string, phoneVal: string, includeVal: boolean) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jathagam_astro_name', nameVal)
      localStorage.setItem('jathagam_astro_address', addrVal)
      localStorage.setItem('jathagam_astro_phone', phoneVal)
      localStorage.setItem('jathagam_include_astro', includeVal.toString())
    }
  }

  // Profile parameter package
  const profilePayload: JathagamProfile = {
    name,
    gender,
    dob,
    tob,
    place: selectedCity?.name || '',
    lat: selectedCity?.latitude || selectedCity?.lat || 0,
    lng: selectedCity?.longitude || selectedCity?.lng || 0,
    utcOffset: selectedCity?.utc_offset || 5.5,
    fatherName: fatherName || undefined,
    motherName: motherName || undefined,
    hometown: hometown || undefined,
  }

  const { assembleData, assembling: isApiLoading, assemblyError: apiError } = useJathagamData()
  const [reportData, setReportData] = useState<JathagamPDFData | null>(null)

  // Trigger calculations and sequential spinner phases
  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim()) {
      setFormError(reportLanguage === 'ta' ? 'பெயரை உள்ளிடவும்.' : 'Please enter a name.')
      return
    }
    if (!dob) {
      setFormError(reportLanguage === 'ta' ? 'பிறந்த தேதியை உள்ளிடவும்.' : 'Please enter a date of birth.')
      return
    }
    if (!tob) {
      setFormError(reportLanguage === 'ta' ? 'பிறந்த நேரத்தை உள்ளிடவும்.' : 'Please enter a time of birth.')
      return
    }
    if (!selectedCity) {
      setFormError(reportLanguage === 'ta' ? 'பிறந்த இடத்தைத் தேடி தேர்ந்தெடுக்கவும்.' : 'Please search and select a birth place.')
      return
    }

    // Save astrologer settings
    saveAstroDetails(astroName, astroAddress, astroPhone, includeAstroDetails)

    setPhase('calculating')

    // Phase 1: Vedic Math Calculations
    setTimeout(() => {
      setPhase('assembling')

      // Phase 2: PDF Page Assembling
      setTimeout(async () => {
        try {
          const res = await assembleData(
            profilePayload,
            {
              name: astroName,
              address: astroAddress,
              phone: astroPhone,
            },
            reportLanguage
          )
          setReportData(res)
          setPhase('report')
        } catch (err) {
          console.error(err)
          setPhase('error')
        }
      }, 2000)
    }, 2500)
  }

  // Effect to transit to report or error phase when query finishes
  useEffect(() => {
    if (phase === 'assembling' && !isApiLoading) {
      if (apiError) {
        setPhase('error')
      }
    }
  }, [isApiLoading, apiError, phase])

  // Re-fetch if reportLanguage changes while in report phase
  useEffect(() => {
    if (phase === 'report') {
      assembleData(
        profilePayload,
        {
          name: astroName,
          address: astroAddress,
          phone: astroPhone,
        },
        reportLanguage
      ).then(setReportData).catch(() => setPhase('error'))
    }
  }, [reportLanguage])

  // Auto-fill from saved profile
  const handleAutoFill = () => {
    if (!birthProfile) return
    setName(birthProfile.name)
    setGender(birthProfile.gender as 'Male' | 'Female')
    setDob(birthProfile.dob)
    setTob(birthProfile.tob)
    setSelectedCity({
      name: birthProfile.place_name,
      latitude: Number(birthProfile.lat),
      longitude: Number(birthProfile.lng),
      utc_offset: 5.5,
    } as any)
  }

  const handleReset = () => {
    setPhase('form')
    setFormError(null)
  }

  // Translation Dictionaries
  const isTa = reportLanguage === 'ta'
  const t = {
    title: isTa ? 'முழு ஜாதக அறிக்கை (PDF)' : 'Full Horoscope Report (PDF)',
    subtitle: isTa
      ? '20-பக்கங்கள் கொண்ட விரிவான அச்சிடக்கூடிய ஜாதக அறிக்கை'
      : 'Comprehensive 20-page printable horoscope report',
    formTitle: isTa ? 'பிறப்பு விவரங்கள்' : 'Birth Details',
    name: isTa ? 'முழு பெயர்' : 'Full Name',
    dob: isTa ? 'பிறந்த தேதி' : 'Date of Birth',
    tob: isTa ? 'பிறந்த நேரம்' : 'Time of Birth',
    place: isTa ? 'பிறந்த இடம்' : 'Birth Place',
    fatherName: isTa ? 'தந்தை பெயர் (விருப்பம்)' : "Father's Name (Optional)",
    motherName: isTa ? 'தாய் பெயர் (விருப்பம்)' : "Mother's Name (Optional)",
    hometown: isTa ? 'சொந்த ஊர் (விருப்பம்)' : 'Hometown (Optional)',
    includeAstro: isTa ? 'அறிக்கையில் ஜோதிடர் விவரங்களை சேர்க்கவும்' : 'Include Astrologer details on report',
    astroName: isTa ? 'ஜோதிடர் பெயர்' : 'Astrologer Name',
    astroAddress: isTa ? 'முகவரி / தொடர்புக்கு' : 'Contact Address',
    astroPhone: isTa ? 'தொலைபேசி எண்' : 'Phone Number',
    generate: isTa ? 'ஜாதகம் கணிக்குவிக்கவும்' : 'Generate Full Jathagam',
    back: isTa ? 'முகப்பிற்குச் செல்' : 'Back to Dashboard',
    autoFill: isTa ? 'சுயவிவரத்திலிருந்து நிரப்பவும்' : 'Auto-fill from Profile',
    calculatingText: isTa ? 'ஜாதக கணிதம் கணக்கிடப்படுகிறது...' : 'Calculating horoscope mathematics...',
    assemblingText: isTa ? 'அறிக்கை பக்கங்கள் உருவாக்கப்படுகிறது...' : 'Assembling report pages...',
    printReport: isTa ? 'அச்சிடு / PDF சேமி' : 'Print / Save PDF',
    backToForm: isTa ? 'மீண்டும் திருத்தவும்' : 'Edit Details',
    errorTitle: isTa ? 'கணிப்பதில் பிழை' : 'Calculation Error',
    errorDesc: isTa
      ? 'ஜாதகத்தை உருவாக்குவதில் பிழை ஏற்பட்டது. தயவுசெய்து உங்கள் இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.'
      : 'An error occurred while generating the horoscope. Please check your connection and try again.',
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative print:block print:max-w-none print:p-0 print:m-0">
      <AnimatePresence mode="wait">
        {phase === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col gap-6"
          >
            {/* Header */}
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-text-muted hover:text-gold-bright transition-colors mb-2 text-sm font-medium"
              >
                <ArrowLeft size={16} />
                {t.back}
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gold-bright tracking-tight">
                {t.title}
              </h1>
              <p className="text-text-secondary text-sm md:text-base max-w-2xl">
                {t.subtitle}
              </p>
            </div>

            {/* Profile Auto-fill Banner */}
            {birthProfile && (
              <div className="p-4 rounded-xl bg-gold-deep/5 border border-gold-mid/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2.5">
                  <Sparkles size={16} className="text-gold-mid shrink-0" />
                  <span className="text-xs sm:text-sm text-text-primary">
                    {isTa
                      ? `சேமிக்கப்பட்ட சுயவிவரம் கண்டறியப்பட்டது: ${birthProfile.name}`
                      : `Saved profile detected: ${birthProfile.name}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="text-xs bg-gold-mid hover:bg-gold-deep text-black font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <CheckCircle2 size={13} />
                  {t.autoFill}
                </button>
              </div>
            )}

            {/* Error Message */}
            {formError && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2.5">
                <AlertCircle size={18} />
                {formError}
              </div>
            )}

            {/* Form Card */}
            <div
              className="w-full p-5 sm:p-6 rounded-2xl border"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--bg-border)',
                boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <form onSubmit={handleCalculate} className="flex flex-col gap-6">
                <h3 className="text-base font-bold text-gold-bright tracking-wide select-none">
                  {t.formTitle}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.name}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                    />
                  </div>

                  {/* Gender Field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">
                      {isTa ? 'பாலினம்' : 'Gender'}
                    </label>
                    <div className="flex bg-bg-page border border-bg-border rounded-xl overflow-hidden p-1">
                      <button
                        type="button"
                        onClick={() => setGender('Male')}
                        className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${
                          gender === 'Male'
                            ? 'bg-gold-mid text-black shadow-sm font-bold'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {isTa ? 'ஆண்' : 'Male'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setGender('Female')}
                        className={`flex-1 py-2 text-center text-xs font-semibold rounded-lg transition-all ${
                          gender === 'Female'
                            ? 'bg-gold-mid text-black shadow-sm font-bold'
                            : 'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {isTa ? 'பெண்' : 'Female'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* DOB field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.dob}</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                    />
                  </div>

                  {/* TOB field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.tob}</label>
                    <input
                      type="time"
                      required
                      value={tob}
                      onChange={(e) => setTob(e.target.value)}
                      className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* PlaceSearch field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.place}</label>
                    <PlaceSearch onSelect={setSelectedCity} selectedCity={selectedCity} />
                  </div>

                  {/* Hometown field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.hometown}</label>
                    <input
                      type="text"
                      value={hometown}
                      onChange={(e) => setHometown(e.target.value)}
                      className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Father's Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.fatherName}</label>
                    <input
                      type="text"
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                    />
                  </div>

                  {/* Mother's Name field */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-text-primary ml-1">{t.motherName}</label>
                    <input
                      type="text"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className="w-full bg-bg-page border border-bg-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid transition-all"
                    />
                  </div>
                </div>

                {/* Astrologer Toggle */}
                <div className="border-t border-bg-border/60 pt-4 flex items-center justify-between">
                  <label className="text-sm font-medium text-text-primary flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeAstroDetails}
                      onChange={(e) => setIncludeAstroDetails(e.target.checked)}
                      className="w-4 h-4 text-gold-mid border-bg-border rounded focus:ring-gold-mid bg-bg-page"
                    />
                    {t.includeAstro}
                  </label>
                </div>

                {/* Astrologer Fields (conditional animation) */}
                {includeAstroDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-bg-border/40 pt-4"
                  >
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-primary">{t.astroName}</label>
                      <input
                        type="text"
                        value={astroName}
                        onChange={(e) => setAstroName(e.target.value)}
                        className="w-full bg-bg-page border border-bg-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-text-primary">{t.astroAddress}</label>
                      <input
                        type="text"
                        value={astroAddress}
                        onChange={(e) => setAstroAddress(e.target.value)}
                        className="w-full bg-bg-page border border-bg-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-primary">{t.astroPhone}</label>
                      <input
                        type="text"
                        value={astroPhone}
                        onChange={(e) => setAstroPhone(e.target.value)}
                        className="w-full bg-bg-page border border-bg-border rounded-xl px-3 py-2 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-gold-mid"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gold-mid hover:bg-gold-deep text-black font-bold py-3.5 px-6 rounded-xl transition-all shadow-md mt-4 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <FileText size={18} />
                  {t.generate}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Calculating Vedic Mathematics Loader */}
        {phase === 'calculating' && (
          <motion.div
            key="calculating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="relative flex items-center justify-center mb-6">
              <Loader2 className="w-16 h-16 animate-spin text-gold-mid" />
              <Sparkles className="w-6 h-6 absolute text-gold-bright animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-gold-bright tracking-tight mb-2">
              {isTa ? 'வேத ஜோதிட கணிதம்' : 'Vedic Astrological Mathematics'}
            </h2>
            <p className="text-text-secondary text-sm font-medium">
              {t.calculatingText}
            </p>
          </motion.div>
        )}

        {/* Assembling Pages Loader */}
        {phase === 'assembling' && (
          <motion.div
            key="assembling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="relative flex items-center justify-center mb-6">
              <Loader2 className="w-16 h-16 animate-spin text-gold-mid" />
              <FileText className="w-6 h-6 absolute text-gold-bright animate-bounce" />
            </div>
            <h2 className="text-xl font-bold text-gold-bright tracking-tight mb-2">
              {isTa ? 'பக்கங்கள் அசெம்பிள் செய்யப்படுகிறது' : 'Assembling PDF Pages'}
            </h2>
            <p className="text-text-secondary text-sm font-medium">
              {t.assemblingText}
            </p>
          </motion.div>
        )}

        {/* Error Phase */}
        {phase === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto"
          >
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-text-primary mb-2">
              {t.errorTitle}
            </h2>
            <p className="text-text-secondary text-sm mb-6 leading-relaxed">
              {apiError || t.errorDesc}
            </p>
            <button
              onClick={handleReset}
              className="bg-bg-card hover:bg-bg-hover text-text-primary border border-bg-border font-bold py-2.5 px-6 rounded-xl transition-all flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              {t.backToForm}
            </button>
          </motion.div>
        )}

        {/* Report View Phase */}
        {phase === 'report' && reportData && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col"
          >
            {/* Top controls bar (hidden on print) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print mb-6 p-4 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="bg-white dark:bg-zinc-850 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-zinc-700 font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <ArrowLeft size={15} />
                  {t.backToForm}
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-gold-mid hover:bg-gold-deep text-black font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm shadow-sm"
                >
                  <Printer size={15} />
                  {t.printReport}
                </button>
              </div>

              {/* Language Switcher inside control bar */}
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-850 border border-gray-300 dark:border-zinc-700 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setReportLanguage('ta')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    reportLanguage === 'ta'
                      ? 'bg-gold-mid text-black shadow-sm font-bold'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  தமிழ்
                </button>
                <button
                  onClick={() => setReportLanguage('en')}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    reportLanguage === 'en'
                      ? 'bg-gold-mid text-black shadow-sm font-bold'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Jathagam PDF pages */}
            <div id="jathagam-report-wrapper" className="flex justify-center w-full overflow-x-auto print:block print:w-full print:p-0 print:m-0 print:overflow-visible">
              <JathagamReport2
                data={{
                  profile: reportData.profile,
                  horoscope: reportData.horoscope,
                  dailyPanchangam: reportData.birthPanchangam,
                  luckyDetails: reportData.luckyDetails,
                  nakshatraMeta: reportData.nakshatraMeta,
                  astrologer: reportData.astrologer,
                  lagnapalanText: reportData.lagnapalanText,
                  nakshatrapalanText: reportData.nakshatrapalanText,
                  pathaSaram: reportData.pathaSaram,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
