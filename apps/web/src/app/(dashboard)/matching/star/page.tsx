'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ArrowLeft, RefreshCw, CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import api from '@/lib/api'

// List of the 27 Nakshatras in English (must match backend) and Tamil
const NAKSHATRAS = [
  { nameEn: "Ashwini", nameTa: "அஸ்வினி" },
  { nameEn: "Bharani", nameTa: "பரணி" },
  { nameEn: "Krittika", nameTa: "கார்த்திகை" },
  { nameEn: "Rohini", nameTa: "ரோகிணி" },
  { nameEn: "Mrigashira", nameTa: "மிருகசீரிஷம்" },
  { nameEn: "Ardra", nameTa: "திருவாதிரை" },
  { nameEn: "Punarvasu", nameTa: "புனர்பூசம்" },
  { nameEn: "Pushya", nameTa: "பூசம்" },
  { nameEn: "Ashlesha", nameTa: "ஆயில்யம்" },
  { nameEn: "Magha", nameTa: "மகம்" },
  { nameEn: "Purva Phalguni", nameTa: "பூரம்" },
  { nameEn: "Uttara Phalguni", nameTa: "உத்திரம்" },
  { nameEn: "Hasta", nameTa: "அஸ்தம்" },
  { nameEn: "Chitra", nameTa: "சித்திரை" },
  { nameEn: "Swati", nameTa: "சுவாதி" },
  { nameEn: "Vishakha", nameTa: "விசாகம்" },
  { nameEn: "Anuradha", nameTa: "அனுஷம்" },
  { nameEn: "Jyeshtha", nameTa: "கேட்டை" },
  { nameEn: "Mula", nameTa: "மூலம்" },
  { nameEn: "Purva Ashadha", nameTa: "பூராடம்" },
  { nameEn: "Uttara Ashadha", nameTa: "உத்திராடம்" },
  { nameEn: "Shravana", nameTa: "திருவோணம்" },
  { nameEn: "Dhanishtha", nameTa: "அவிட்டம்" },
  { nameEn: "Shatabhisha", nameTa: "சதயம்" },
  { nameEn: "Purva Bhadrapada", nameTa: "பூரட்டாதி" },
  { nameEn: "Uttara Bhadrapada", nameTa: "உத்திரட்டாதி" },
  { nameEn: "Revati", nameTa: "ரேவதி" }
]

// Mapping for Porutham Names (Tamil & English) and descriptions
const PORUTHAM_INFO: Record<string, { nameTa: string; nameEn: string; descTa: string; descEn: string }> = {
  dinam: {
    nameTa: "தினப் பொருத்தம்",
    nameEn: "Dinam",
    descTa: "ஆரோக்கியம் மற்றும் நீண்ட ஆயுள் தரும் பொருத்தம்.",
    descEn: "Good health, prosperity and longevity for the couple."
  },
  ganam: {
    nameTa: "கணப் பொருத்தம்",
    nameEn: "Ganam",
    descTa: "குண ஒற்றுமை மற்றும் மனப் பொருத்தம் குறிக்கிறது.",
    descEn: "Compatibility of temperament, character, and mental compatibility."
  },
  mahendram: {
    nameTa: "மகேந்திரப் பொருத்தம்",
    nameEn: "Mahendram",
    descTa: "சந்ததி விருத்தி (வாரிசு) மற்றும் செல்வ வளத்தைத் தரும்.",
    descEn: "Wealth, progeny, and descendants growth."
  },
  stree_dirgham: {
    nameTa: "ஸ்திரீதீர்க்கப் பொருத்தம்",
    nameEn: "Stree Dirgham",
    descTa: "பெண்ணின் மாங்கல்ய பலம் மற்றும் நல்வாழ்வை உறுதி செய்யும்.",
    descEn: "Well-being, wealth, and accumulation of resources for the bride."
  },
  yoni: {
    nameTa: "யோனிப் பொருத்தம்",
    nameEn: "Yoni",
    descTa: "தம்பதியினருக்கு இடையே உள்ள உடல் உறவு/தாம்பத்தியப் பொருத்தம்.",
    descEn: "Physical and sexual compatibility between the couple."
  },
  rasi: {
    nameTa: "ராசிப் பொருத்தம்",
    nameEn: "Rasi",
    descTa: "வம்ச விருத்தி மற்றும் குடும்ப ஒற்றுமையைக் குறிக்கிறது.",
    descEn: "Mental affinity, family union, and family growth."
  },
  rajju: {
    nameTa: "ரஜ்ஜுப் பொருத்தம் (நீக்கம் இல்லாமை)",
    nameEn: "Rajju (Eliminatory)",
    descTa: "மிக முக்கியமான மாங்கல்ய பலம். கணவனின் ஆயுள் மற்றும் பாதுகாப்பு.",
    descEn: "Most critical: Husband's longevity. Failure is a major dosha."
  },
  vedha: {
    nameTa: "வேதைப் பொருத்தம் (பாதிப்பு இல்லாமை)",
    nameEn: "Vedha (Eliminatory)",
    descTa: "தம்பதியினருக்கு இடையே பரஸ்பர சண்டைகள் மற்றும் தடைகள் இல்லாமை.",
    descEn: "Absence of mutual affliction, obstacles, and severe disputes."
  },
  vasya: {
    nameTa: "வசியப் பொருத்தம்",
    nameEn: "Vasya",
    descTa: "இருவருக்கும் இடையே இருக்கும் பரஸ்பர ஈர்ப்பு மற்றும் அன்பு.",
    descEn: "Mutual attraction, love, and emotional draw."
  },
  varna: {
    nameTa: "வர்ணப் பொருத்தம்",
    nameEn: "Varna",
    descTa: "இருவரின் சமூக மற்றும் மன ஒத்திசைவு நிலைகள்.",
    descEn: "Work compatibility, intellectual and social alignment."
  }
}

interface MatchResult {
  boy_star: string
  girl_star: string
  score_percent: number
  dosha_free: boolean
  verdict: string
  poruthams: {
    type: string
    passed: boolean
    weight: number
    score: number
  }[]
}

export default function StarMatchingPage() {
  const { language } = useLanguage()
  const [boyStar, setBoyStar] = useState(NAKSHATRAS[0].nameEn)
  const [girlStar, setGirlStar] = useState(NAKSHATRAS[1].nameEn)
  const [isCalculating, setIsCalculating] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const labels = {
    ta: {
      title: "நட்சத்திர பொருத்தம்",
      subtitle: "மணமகன் மற்றும் மணமகளின் நட்சத்திரங்களின் அடிப்படையில் 10 பொருத்தங்களை சரிபார்க்கவும்",
      boyTitle: "மணமகன் நட்சத்திரம் (Boy's Star)",
      girlTitle: "மணமகள் நட்சத்திரம் (Girl's Star)",
      buttonCheck: "பொருத்தம் காண்க",
      buttonReset: "மீண்டும் சரிபார்க்க",
      verdictLabel: "முடிவு:",
      scoreLabel: "பொருத்த சதவீதம்",
      tableTitle: "10 பொருத்தங்களின் விரிவான விவரங்கள்",
      colName: "பொருத்தம்",
      colStatus: "நிலை",
      colScore: "மதிப்பெண்",
      colWeight: "பங்கு (Weight)",
      doshaWarningTitle: "முக்கிய தோஷ எச்சரிக்கை!",
      doshaWarningDesc: "ரஜ்ஜு அல்லது வேதை பொருத்தம் அமையாத பட்சத்தில் திருமண பொருத்தம் உகந்ததாக கருதப்பட மாட்டாது.",
      errorMessage: "கணிப்புகளைப் பெறுவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
    },
    en: {
      title: "Star Matching",
      subtitle: "Evaluate 10-porutham compatibility between the bride and groom's birth stars",
      boyTitle: "Groom's Star (Boy's Star)",
      girlTitle: "Bride's Star (Girl's Star)",
      buttonCheck: "Check Compatibility",
      buttonReset: "Check Another",
      verdictLabel: "Verdict:",
      scoreLabel: "Match Score",
      tableTitle: "10 Poruthams Detailed Status",
      colName: "Porutham",
      colStatus: "Status",
      colScore: "Score",
      colWeight: "Weight",
      doshaWarningTitle: "Critical Dosha Warning!",
      doshaWarningDesc: "If Rajju or Vedha matches fail, the overall compatibility is highly compromised.",
      errorMessage: "Error calculating matching. Please try again."
    }
  }[language]

  const handleCheckMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCalculating(true)
    setError(null)

    try {
      const response = await api.post('/matching/star', {
        boy_star: boyStar,
        girl_star: girlStar
      })

      if (!response) {
        throw new Error('Matching API failed')
      }

      setResult(response as any)
    } catch (err) {
      console.error(err)
      setError(labels.errorMessage)
    } finally {
      setIsCalculating(false)
    }
  }

  // Verdict translation dictionary
  const VERDICT_TRANSLATION: Record<string, { ta: string; en: string; color: string }> = {
    'Excellent': { ta: 'உத்தமம் (Excellent)', en: 'Excellent', color: 'text-[#6ee7a0] bg-[#2d7a4f]/20 border-[#2d7a4f]' },
    'Good': { ta: 'நன்று (Good)', en: 'Good', color: 'text-[#80c8ff] bg-[#1e6fa8]/20 border-[#1e6fa8]' },
    'Average': { ta: 'மத்திமம் (Average)', en: 'Average', color: 'text-[#f2c96a] bg-[#c9922a]/20 border-[#c9922a]' },
    'Not Recommended': { ta: 'பொருந்தாது (Not Recommended)', en: 'Not Recommended', color: 'text-[#ff9090] bg-[#c0392b]/20 border-[#c0392b]' }
  }

  const currentVerdict = result ? (VERDICT_TRANSLATION[result.verdict] || { ta: result.verdict, en: result.verdict, color: 'text-[#d4b896] border-[#4a3828] bg-[#2e2115]' }) : null

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-6">
      {/* Header back link */}
      <div className="flex items-center justify-between">
        <Link 
          href="/"
          className="flex items-center gap-2 text-text-secondary hover:text-gold-bright transition-colors text-[14px]"
        >
          <ArrowLeft size={16} />
          {language === 'ta' ? 'முகப்புப்பக்கம்' : 'Back to Dashboard'}
        </Link>
        <span className="text-[11px] font-mono text-text-muted">VERSION 4.0</span>
      </div>

      {/* Main Intro */}
      <div className="flex flex-col gap-1.5 border-b border-bg-border pb-4">
        <h1 className="text-[24px] font-semibold text-gold-bright tracking-tight font-playfair flex items-center gap-2.5">
          <Heart className="text-[#b0415e] fill-[#b0415e] animate-pulse" size={24} />
          {labels.title}
        </h1>
        <p className="text-[14px] text-text-secondary leading-relaxed max-w-[800px]">
          {labels.subtitle}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Input Selection Card */}
            <div className="md:col-span-2 bg-bg-card border border-bg-border rounded-xl p-5 md:p-6 shadow-xl">
              <form onSubmit={handleCheckMatch} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Groom Nakshatra select */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-text-secondary">
                      {labels.boyTitle}
                    </label>
                    <select
                      value={boyStar}
                      onChange={(e) => setBoyStar(e.target.value)}
                      className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none"
                    >
                      {NAKSHATRAS.map((nak) => (
                        <option key={`boy-${nak.nameEn}`} value={nak.nameEn}>
                          {language === 'ta' ? `${nak.nameTa} (${nak.nameEn})` : `${nak.nameEn} (${nak.nameTa})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bride Nakshatra select */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-text-secondary">
                      {labels.girlTitle}
                    </label>
                    <select
                      value={girlStar}
                      onChange={(e) => setGirlStar(e.target.value)}
                      className="w-full h-11 bg-bg-page border border-bg-border rounded-lg text-text-primary px-3 text-[14px] focus:border-gold-deep focus:ring-2 focus:ring-gold-deep/20 outline-none"
                    >
                      {NAKSHATRAS.map((nak) => (
                        <option key={`girl-${nak.nameEn}`} value={nak.nameEn}>
                          {language === 'ta' ? `${nak.nameTa} (${nak.nameEn})` : `${nak.nameEn} (${nak.nameTa})`}
                        </option>
                      ))}
                    </select>
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
                  className="w-full h-11 bg-gold-deep hover:bg-gold-mid text-text-inverse font-semibold rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 text-[15px]"
                >
                  {isCalculating ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      {language === 'ta' ? 'பொருத்தம் கணிக்கப்படுகிறது...' : 'Calculating Compatibility...'}
                    </>
                  ) : (
                    <>
                      <Heart size={18} />
                      {labels.buttonCheck}
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Cultural / Information sidebar card */}
            <div className="bg-[#241a0f] border border-bg-border rounded-xl p-5 flex flex-col gap-4">
              <h3 className="text-[16px] font-semibold text-gold-bright font-playfair italic flex items-center gap-1.5">
                <HelpCircle size={18} className="text-gold-bright" />
                {language === 'ta' ? 'அறிந்து கொள்க!' : 'Did You Know?'}
              </h3>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                {language === 'ta' 
                  ? "நட்சத்திர பொருத்தம் என்பது திருமணம் செய்யும் தம்பதிகளின் மன மற்றும் உடல் ரீதியான பொருத்தம், ஆயுள், சந்ததிவிருத்தி ஆகியவற்றை ஆராயும் எளிய பாரம்பரிய வழிமுறையாகும். இதில் ரஜ்ஜு பொருத்தம் கணவனின் ஆயுளுக்கும், வேதை பொருத்தம் தடையில்லா வாழ்க்கைகும் முக்கியமானது."
                  : "Nakshatra Porutham is the traditional analysis of 10 aspects of compatibility including emotional connection, health, and family longevity. Among them, Rajju represents the groom's longevity, and Vedha ensures a life free of obstacles."}
              </p>
              <div className="p-3 bg-gold-subtle rounded-lg border border-gold-deep/20 text-[12px] text-gold-bright flex flex-col gap-1.5">
                <span className="font-semibold">{language === 'ta' ? 'குறிப்பு:' : 'Note:'}</span>
                <span>
                  {language === 'ta' 
                    ? "நட்சத்திர பொருத்தம் மத்திமமாக இருந்தாலும் ஜாதகத்தில் உள்ள கிரக அமைப்புகளின் கூட்டு பலன் நல்ல பொருத்தங்களை தரக்கூடும்."
                    : "Even if Star Matching is average, strong planetary alignments in both horoscopes can resolve overall compatibility."}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="match-result"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            {/* Top Score Summary Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-bg-card border border-bg-border rounded-xl p-5 md:p-6 shadow-xl">
              {/* Circular Gauge */}
              <div className="flex flex-col items-center justify-center p-3 border-b md:border-b-0 md:border-r border-bg-border">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="stroke-bg-page"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="stroke-gold-deep transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 54}
                      strokeDashoffset={2 * Math.PI * 54 * (1 - result.score_percent / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[26px] font-bold text-text-primary font-mono">{result.score_percent}%</span>
                    <span className="text-[9px] uppercase tracking-wider text-text-muted">{labels.scoreLabel}</span>
                  </div>
                </div>
              </div>

              {/* Verdict details */}
              <div className="md:col-span-2 flex flex-col justify-center gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-[14px] text-text-secondary">{labels.verdictLabel}</span>
                  <span className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border ${currentVerdict?.color}`}>
                    {language === 'ta' ? currentVerdict?.ta : currentVerdict?.en}
                  </span>
                </div>

                <div className="text-[13px] text-text-secondary leading-relaxed">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-primary">{language === 'ta' ? 'மணமகன்:' : 'Groom:'}</span>
                    <span className="text-gold-bright">
                      {language === 'ta' 
                        ? NAKSHATRAS.find(n => n.nameEn === result.boy_star)?.nameTa 
                        : result.boy_star}
                    </span>
                    <span className="text-text-muted font-mono">({result.boy_star})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{language === 'ta' ? 'மணமகள்:' : 'Bride:'}</span>
                    <span className="text-gold-bright">
                      {language === 'ta' 
                        ? NAKSHATRAS.find(n => n.nameEn === result.girl_star)?.nameTa 
                        : result.girl_star}
                    </span>
                    <span className="text-text-muted font-mono">({result.girl_star})</span>
                  </div>
                </div>

                {/* Dosha warning if not free */}
                {!result.dosha_free && (
                  <div className="mt-1 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-[12px] flex items-start gap-2.5">
                    <AlertTriangle className="shrink-0 mt-0.5" size={15} />
                    <div>
                      <h4 className="font-bold mb-0.5">{labels.doshaWarningTitle}</h4>
                      <p className="text-[11px] leading-relaxed text-text-secondary">{labels.doshaWarningDesc}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 10-Porutham Table */}
            <div className="bg-bg-card border border-bg-border rounded-xl p-5 md:p-6 shadow-xl">
              <h3 className="text-[16px] font-semibold text-gold-bright font-playfair italic mb-4">
                {labels.tableTitle}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[14px]">
                  <thead>
                    <tr className="bg-[#2e2115] border-b border-bg-border text-text-muted text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3 rounded-l-lg">{labels.colName}</th>
                      <th className="py-2.5 px-3 text-center">{labels.colStatus}</th>
                      <th className="py-2.5 px-3 text-center">{labels.colScore}</th>
                      <th className="py-2.5 px-3 text-center">{labels.colWeight}</th>
                      <th className="py-2.5 px-3 rounded-r-lg">{language === 'ta' ? 'பலன்கள்' : 'Details'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bg-border/60">
                    {result.poruthams.map((p) => {
                      const info = PORUTHAM_INFO[p.type] || {
                        nameTa: p.type,
                        nameEn: p.type,
                        descTa: '-',
                        descEn: '-'
                      }

                      return (
                        <tr key={p.type} className="hover:bg-bg-active/20 transition-colors">
                          <td className="py-3 px-3 font-medium text-text-primary">
                            <div>{info.nameTa}</div>
                            <div className="text-[11px] text-text-muted font-mono uppercase">{info.nameEn}</div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center justify-center">
                              {p.passed ? (
                                <CheckCircle2 className="text-[#6ee7a0]" size={18} />
                              ) : (
                                <XCircle className="text-[#ff9090]" size={18} />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-semibold text-gold-bright">
                            {p.score}
                          </td>
                          <td className="py-3 px-3 text-center font-mono text-text-muted">
                            {p.weight}
                          </td>
                          <td className="py-3 px-3 text-[12px] text-text-secondary leading-normal max-w-[300px]">
                            {language === 'ta' ? info.descTa : info.descEn}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Reset check button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setResult(null)}
                  className="bg-transparent text-gold-bright hover:bg-gold-subtle border border-gold-deep rounded-full px-5 py-2 text-[13px] font-semibold flex items-center gap-1.5 transition-all active:scale-[0.98]"
                >
                  <RefreshCw size={15} />
                  {labels.buttonReset}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
