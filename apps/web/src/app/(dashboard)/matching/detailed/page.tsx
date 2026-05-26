'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, ArrowLeft, RefreshCw, CheckCircle2, XCircle, 
  AlertTriangle, Users, Sparkles, MapPin, Lock, Unlock, HelpCircle, Printer
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import { RasiChart } from '@/components/astro/RasiChart'
import { CityData, HoroscopeChart, PlanetData, LagnaData } from '@/types/astro'

// Mapping for Porutham Names (Tamil & English) and descriptions
const PORUTHAM_INFO: Record<string, { nameTa: string; nameEn: string; descTa: string; descEn: string }> = {
  dinam: { nameTa: "தினப் பொருத்தம்", nameEn: "Dinam", descTa: "ஆரோக்கியம் மற்றும் நீண்ட ஆயுள் தரும் பொருத்தம்.", descEn: "Good health, prosperity and longevity for the couple." },
  ganam: { nameTa: "கணப் பொருத்தம்", nameEn: "Ganam", descTa: "குண ஒற்றுமை மற்றும் மனப் பொருத்தம் குறிக்கிறது.", descEn: "Compatibility of temperament, character, and mental compatibility." },
  mahendram: { nameTa: "மகேந்திரப் பொருத்தம்", nameEn: "Mahendram", descTa: "சந்ததி விருத்தி (வாரிசு) மற்றும் செல்வ வளத்தைத் தரும்.", descEn: "Wealth, progeny, and descendants growth." },
  stree_dirgham: { nameTa: "ஸ்திரீதீர்க்கப் பொருத்தம்", nameEn: "Stree Dirgham", descTa: "பெண்ணின் மாங்கல்ய பலம் மற்றும் நல்வாழ்வை உறுதி செய்யும்.", descEn: "Well-being, wealth, and accumulation of resources for the bride." },
  yoni: { nameTa: "யோனிப் பொருத்தம்", nameEn: "Yoni", descTa: "தம்பதியினருக்கு இடையே உள்ள உடல் உறவு/தாம்பத்தியப் பொருத்தம்.", descEn: "Physical and sexual compatibility between the couple." },
  rasi: { nameTa: "ராசிப் பொருத்தம்", nameEn: "Rasi", descTa: "வம்ச விருத்தி மற்றும் குடும்ப ஒற்றுமையைக் குறிக்கிறது.", descEn: "Mental affinity, family union, and family growth." },
  rajju: { nameTa: "ரஜ்ஜுப் பொருத்தம் (நீக்கம் இல்லாமை)", nameEn: "Rajju (Eliminatory)", descTa: "மிக முக்கியமான மாங்கல்ய பலம். கணவனின் ஆயுள் மற்றும் பாதுகாப்பு.", descEn: "Most critical: Husband's longevity. Failure is a major dosha." },
  vedha: { nameTa: "வேதைப் பொருத்தம் (பாதிப்பு இல்லாமை)", nameEn: "Vedha (Eliminatory)", descTa: "தம்பதியினருக்கு இடையே பரஸ்பர சண்டைகள் மற்றும் தடைகள் இல்லாமை.", descEn: "Absence of mutual affliction, obstacles, and severe disputes." },
  vasya: { nameTa: "வசியப் பொருத்தம்", nameEn: "Vasya", descTa: "இருவருக்கும் இடையே இருக்கும் பரஸ்பர ஈர்ப்பு மற்றும் அன்பு.", descEn: "Mutual attraction, love, and emotional draw." },
  varna: { nameTa: "வர்ணப் பொருத்தம்", nameEn: "Varna", descTa: "இருவரின் சமூக மற்றும் மன ஒத்திசைவு நிலைகள்.", descEn: "Work compatibility, intellectual and social alignment." }
}

interface StarMatchResponse {
  poruthams: Array<{
    type: string
    passed: boolean
    weight: number
    score: number
  }>
  dosha_free: boolean
  score_percent: number
  verdict: string
}

interface HoroMatchResponse {
  papasamyam: {
    boy_score: number
    girl_score: number
    difference: number
    compatible: boolean
  }
  mangal_dosha: {
    boy_has_dosha: boolean
    girl_has_dosha: boolean
    compatible: boolean
  }
  overall_compatible: boolean
}

interface BasicMatchResult {
  boy_star: string
  boy_star_ta: string
  girl_star: string
  girl_star_ta: string
  star_result: StarMatchResponse
  horo_result: HoroMatchResponse
  overview_score: number
  dasa_sandhi_precheck_severity: 'none' | 'mild' | 'moderate' | 'severe'
  boy_chart: HoroscopeChart
  girl_chart: HoroscopeChart
  boy_planets: PlanetData[]
  girl_planets: PlanetData[]
  boy_lagna: LagnaData
  girl_lagna: LagnaData
}

interface DasaSandhiClash {
  boy_age: number
  girl_age: number
  boy_planet: string
  girl_planet: string
  clash_date: string
  severity: 'severe' | 'moderate' | 'mild'
  gap_months: number
  advice_en: string
  advice_ta: string
}

interface DasaSandhiResponse {
  clashes: DasaSandhiClash[]
  summary_severity: 'none' | 'mild' | 'moderate' | 'severe'
}

export default function DeepMatchPage() {
  const { language } = useLanguage()
  const { user, plan, setUser } = useAuthStore()

  // Boy birth details state
  const [boyName, setBoyName] = useState('')
  const [boyDob, setBoyDob] = useState('')
  const [boyTob, setBoyTob] = useState('')
  const [boyCity, setBoyCity] = useState<CityData | null>(null)

  // Girl birth details state
  const [girlName, setGirlName] = useState('')
  const [girlDob, setGirlDob] = useState('')
  const [girlTob, setGirlTob] = useState('')
  const [girlCity, setGirlCity] = useState<CityData | null>(null)

  // Calculation state machines
  const [isCalculating, setIsCalculating] = useState(false)
  const [calcStep, setCalcStep] = useState(0) // 0: Idle, 1: Boy Horo, 2: Girl Horo, 3: Match Matrix, 4: Dasa pre-check
  const [error, setError] = useState<string | null>(null)

  // Result state
  const [basicResult, setBasicResult] = useState<BasicMatchResult | null>(null)
  
  // Dasa Sandhi background tab-loader state
  const [activeTab, setActiveTab] = useState<'overview' | 'porutham' | 'dosha' | 'dasa'>('overview')
  const [dasaLoading, setDasaLoading] = useState(false)
  const [dasaResult, setDasaResult] = useState<DasaSandhiResponse | null>(null)

  // Labels dictionary (classical Tamil & premium English)
  const labels = {
    ta: {
      title: "விரிவான பொருத்தம் (Deep Match)",
      subtitle: "மணமகன் மற்றும் மணமகளின் ஜாதகங்களை ஆராய்ந்து 10-பொருத்தம், பாபஸாமியம், செவ்வாய் தோஷம் மற்றும் 120 வருட தசா சந்தி கணிப்புகளை வழங்கும் பிரீமியம் பொருத்த எஞ்சின்.",
      boySection: "மணமகன் விவரங்கள் (Groom's Details)",
      girlSection: "மணமகள் விவரங்கள் (Bride's Details)",
      name: "பெயர்",
      placeholderBoy: "எ.கா. கார்த்திக்",
      placeholderGirl: "எ.கா. காவியா",
      dob: "பிறந்த தேதி",
      tob: "பிறந்த நேரம்",
      place: "பிறந்த இடம்",
      btnCalculate: "ஆழமான பொருத்தம் கணக்கிடுக",
      btnReset: "புதிய பொருத்தம் காண்க",
      step1: "மணமகனின் ஜாதகக் கணிதம் செய்கிறது...",
      step2: "மணமகளின் ஜாதகக் கணிதம் செய்கிறது...",
      step3: "10-பொருத்தம் மற்றும் பாப புள்ளிகளை கணிக்கிறது...",
      step4: "தசா சந்தி காலவரிசையை ஒப்பிடுகிறது...",
      overview: "பொதுவான பொருத்தம் (Overview)",
      porutham: "10 பொருத்தங்கள் (Star Kootas)",
      dosha: "பாபஸாமியம் & செவ்வாய் (Dosha Check)",
      dasa: "தசா சந்தி (Dasa Sandhi Junctions)",
      compatibilityIndex: "பொருத்த குறியீடு (Compatibility Index)",
      groom: "மணமகன் (Groom)",
      bride: "மணமகள் (Bride)",
      nakshatra: "நட்சத்திரம்",
      verdictLabel: "பொருத்த முடிவு:",
      excellentMatch: "உன்னதமான பொருத்தம் - Excellent Compatibility",
      moderateMatch: "மத்திம பொருத்தம் - Moderate Compatibility",
      poorMatch: "பொருத்தம் குறைவு - Attention Recommended",
      starScore: "நட்சத்திரப் பொருத்தம்",
      maleficDiff: "பாப புள்ளி வித்தியாசம்",
      difference: "புள்ளிகளின் வித்தியாசம்",
      compatibleStatus: "பொருத்த நிலை",
      sevvaiAlignment: "செவ்வாய் தோஷப் பொருத்தம்",
      dasaAlignment: "தசா சந்தி தோஷப் பொருத்தம்",
      proFeatureTitle: "தசா சந்தி தோஷம் (Vimshottari Dasa Sandhi Check)",
      proFeatureDesc: "உயர்தர தசா சந்தி கணிப்பு என்பது 120 வருட தசா மாற்றங்களை ஆராய்ந்து இருவருக்கும் 24 மாத இடைவெளிக்குள் தசா परिवर्तन (transition) ஏற்படுகிறதா என கணிப்பதாகும். இதை அறிய PRO கணக்கிற்கு மேம்படுத்தவும்.",
      btnUpgrade: "PRO கணக்கிற்கு மேம்படுத்துக (₹499)",
      upgradeSuccess: "உங்கள் கணக்கு PRO ஆக மாற்றப்பட்டது! தசா சந்தி திறக்கப்பட்டது.",
      papasamyamSummary: "இருவரின் பாப கிரகப் புள்ளிகளின் வித்தியாசம் 1 அல்லது அதற்கு குறைவாக இருப்பதே உகந்தது.",
      mangalSummary: "இருவருக்கும் தோஷம் இருக்க வேண்டும் அல்லது இருவருக்கும் சுத்த ஜாதகமாக இருத்தல் வேண்டும்.",
      gapLabel: "கால இடைவெளி:",
      adviceLabel: "பரிகாரம் / ஆலோசனை:",
      noClashMsg: "இருவருக்கும் 24 மாத காலத்திற்குள் எவ்வித தசா சந்தி தோஷமும் இல்லை. மிகவும் நன்று!",
      dasaSeverity: "தசா சந்தி பாதிப்பு நிலை:",
      severe: "தீவிர தசா சந்தி தோஷம்",
      moderate: "மத்திய தசா சந்தி தோஷம்",
      mild: "குறைந்த தசா சந்தி தோஷம்",
      none: "தோஷங்கள் ஏதுமில்லை",
      passed: "பொருந்தும்",
      failed: "பொருந்தாது",
      yes: "உண்டு",
      no: "இல்லை",
      chartTitle: "ராசி கட்டம் (D1 Chart)",
      missingFields: "விவரங்களை முழுமையாக நிரப்பவும்.",
      generalError: "கணிப்பில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்."
    },
    en: {
      title: "Deep Match (விரிவான பொருத்தம்)",
      subtitle: "A premium, astrologically rigorous compatibility dashboard mapping 10-Poruthams, Papasamyam point differences, Mangal Dosha alignments, and a 120-year Vimshottari Dasa Sandhi scan.",
      boySection: "Groom's Details (Boy's Details)",
      girlSection: "Bride's Details (Girl's Details)",
      name: "Name",
      placeholderBoy: "e.g. Karthik",
      placeholderGirl: "e.g. Kavya",
      dob: "Date of Birth",
      tob: "Time of Birth",
      place: "Birth Place",
      btnCalculate: "Run Deep Match Scan",
      btnReset: "Compare Another",
      step1: "Casting groom's precision chart...",
      step2: "Casting bride's precision chart...",
      step3: "Analyzing 10-Porutham & malefic indices...",
      step4: "Computing Dasa Sandhi timelines...",
      overview: "Overview",
      porutham: "10 Poruthams",
      dosha: "Dosha & Papasamyam",
      dasa: "Dasa Sandhi",
      compatibilityIndex: "Compatibility Index",
      groom: "Groom (Boy)",
      bride: "Bride (Girl)",
      nakshatra: "Nakshatra",
      verdictLabel: "Verdict:",
      excellentMatch: "Excellent Compatibility",
      moderateMatch: "Moderate Compatibility",
      poorMatch: "Attention / Low Compatibility",
      starScore: "Nakshatra Match Score",
      maleficDiff: "Papasamyam Diff",
      difference: "Point Difference",
      compatibleStatus: "Compatible Status",
      sevvaiAlignment: "Mangal Dosha Alignment",
      dasaAlignment: "Dasa Sandhi Alignment",
      proFeatureTitle: "Vimshottari Dasa Sandhi Scan",
      proFeatureDesc: "Dasa Sandhi scans 120 years of Vimshottari Mahadashas. A severe junction clash happens when both partners transition into new planetary periods within a 2-year window. Unlock this with PRO.",
      btnUpgrade: "Upgrade to PRO for ₹499",
      upgradeSuccess: "Upgrade successful! Dasa Sandhi matching is now fully unlocked.",
      papasamyamSummary: "Papasamyam compares malefic points (Sun, Mars, Sat, Rahu, Ketu in houses 1,2,4,7,8,12). Point difference <= 1 is compatible.",
      mangalSummary: "Either both partners must have Mangal Dosha, or both must be clean. An unequal match is incompatible.",
      gapLabel: "Overlap Gap:",
      adviceLabel: "Remedial Advice:",
      noClashMsg: "No major Dasa Sandhi overlaps detected within 24 months. Highly auspicious timeline alignment!",
      dasaSeverity: "Dasa Sandhi Severity:",
      severe: "Severe Clash",
      moderate: "Moderate Clash",
      mild: "Mild Clash",
      none: "No Clashes",
      passed: "Passed",
      failed: "Failed",
      yes: "Yes",
      no: "No",
      chartTitle: "D1 Rasi Chart",
      missingFields: "Please fill all details correctly.",
      generalError: "Error running calculations. Please try again."
    }
  }[language]

  // Exact card styling requested by user
  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid var(--bg-border)',
    borderRadius: '14px',
    boxShadow: '0 0 24px rgba(201, 146, 42, 0.06)',
    padding: '20px'
  }

  // Pre-load default values for faster testing
  useEffect(() => {
    // Standard mock details to let users see calculations instantly
    setBoyName('Karthik')
    setBoyDob('1995-05-10')
    setBoyTob('12:00')
    setBoyCity({
      id: 1, name: 'Chennai', ascii_name: 'Chennai', state: 'Tamil Nadu', country: 'IN',
      latitude: 13.0827, longitude: 80.2707, utc_offset: 5.5
    })

    setGirlName('Kavya')
    setGirlDob('1996-08-20')
    setGirlTob('14:30')
    setGirlCity({
      id: 2, name: 'Chennai', ascii_name: 'Chennai', state: 'Tamil Nadu', country: 'IN',
      latitude: 13.0827, longitude: 80.2707, utc_offset: 5.5
    })
  }, [])

  // Background Dasa Sandhi fetch immediately on result load for PRO users (enables instant complete printing!)
  useEffect(() => {
    if (plan === 'PRO' && basicResult && !dasaResult && !dasaLoading) {
      fetchDasaSandhi()
    }
  }, [plan, basicResult])

  const handleDetailedMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!boyDob || !boyCity || !girlDob || !girlCity) {
      setError(labels.missingFields)
      return
    }

    setError(null)
    setIsCalculating(true)
    setBasicResult(null)
    setDasaResult(null)
    setActiveTab('overview')

    try {
      // Step 1: groom calculations
      setCalcStep(1)
      const boyYear = parseInt(boyDob.split('-')[0])
      const boyMonth = parseInt(boyDob.split('-')[1])
      const boyDay = parseInt(boyDob.split('-')[2])
      const boyHour = parseInt(boyTob.split(':')[0]) || 12
      const boyMinute = parseInt(boyTob.split(':')[1]) || 0

      // Step 2: bride calculations
      setCalcStep(2)
      const girlYear = parseInt(girlDob.split('-')[0])
      const girlMonth = parseInt(girlDob.split('-')[1])
      const girlDay = parseInt(girlDob.split('-')[2])
      const girlHour = parseInt(girlTob.split(':')[0]) || 12
      const girlMinute = parseInt(girlTob.split(':')[1]) || 0

      // Step 3 & 4: Star Match & Compatibility scoring basic endpoint
      setCalcStep(3)
      const res = await api.post('/matching/detailed/basic', {
        boy: {
          date: boyDob,
          time: boyTob,
          lat: boyCity.latitude ?? boyCity.lat,
          lng: boyCity.longitude ?? boyCity.lng,
          utcOffset: boyCity.utc_offset
        },
        girl: {
          date: girlDob,
          time: girlTob,
          lat: girlCity.latitude ?? girlCity.lat,
          lng: girlCity.longitude ?? girlCity.lng,
          utcOffset: girlCity.utc_offset
        },
        language
      })

      const data: BasicMatchResult = res
      setBasicResult(data)

    } catch (err) {
      console.error(err)
      setError(labels.generalError)
    } finally {
      setIsCalculating(false)
      setCalcStep(0)
    }
  }

  const fetchDasaSandhi = async () => {
    if (!boyDob || !boyCity || !girlDob || !girlCity || !basicResult) return
    setDasaLoading(true)
    setError(null)

    try {
      const boyMoon = basicResult.boy_planets.find(p => p.planet === 'Moon') || basicResult.boy_lagna
      const girlMoon = basicResult.girl_planets.find(p => p.planet === 'Moon') || basicResult.girl_lagna
      
      const getLong = (p: PlanetData | LagnaData) => {
        if ('longitude' in p) return p.longitude;
        const signIdx = ['Mesha', 'Vrishabha', 'Mithuna', 'Kataka', 'Simha', 'Kanya', 'Thula', 'Vrischika', 'Dhanus', 'Makara', 'Kumbha', 'Meena'].indexOf(p.sign);
        return (signIdx * 30) + p.sign_degree;
      }

      const res = await api.post('/matching/detailed/dasa-sandhi', {
        boyDobStr: boyDob,
        boyMoonLongitude: getLong(boyMoon),
        girlDobStr: girlDob,
        girlMoonLongitude: getLong(girlMoon)
      })

      const data: DasaSandhiResponse = res
      setDasaResult(data)

    } catch (err) {
      console.error(err)
      setError(labels.generalError)
    } finally {
      setDasaLoading(false)
    }
  }

  const handleUpgrade = () => {
    // Instantly upgrade tier state in frontend store for local testing
    setUser({
      id: user?.id || 'mock-id',
      plan: 'PRO'
    } as any)
    useAuthStore.setState({ plan: 'PRO' })
  }

  return (
    <>
      <div className="max-w-[1100px] mx-auto flex flex-col gap-6 px-4 py-6 print:hidden">
      {/* Header back link */}
      <div className="flex items-center justify-between">
        <Link 
          href="/matching"
          className="flex items-center gap-2 text-text-secondary hover:text-gold-bright transition-colors text-[14px]"
        >
          <ArrowLeft size={16} />
          {language === 'ta' ? 'பொருத்தம் முகப்பு' : 'Back to Matching'}
        </Link>
        <span className="text-[11px] font-mono text-text-muted">PREMIUM PORTAL</span>
      </div>

      {/* Main Intro */}
      <div className="flex flex-col gap-1.5 border-b border-bg-border pb-4">
        <h1 className="text-[26px] font-semibold text-gold-bright tracking-tight font-playfair flex items-center gap-2.5">
          <Sparkles className="text-gold-deep" size={26} />
          {labels.title}
        </h1>
        <p className="text-[14px] text-text-secondary leading-relaxed max-w-[850px]">
          {labels.subtitle}
        </p>
      </div>

      {error && (
        <div className="bg-[var(--cat-marriage)]/10 border border-[var(--cat-marriage)] text-[var(--cat-marriage)] rounded-lg p-3 text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!basicResult ? (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            <form onSubmit={handleDetailedMatch} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Groom Details Card */}
                <div style={cardStyle} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-bg-border pb-2.5">
                    <h2 className="text-[15px] font-bold text-gold-bright flex items-center gap-2">
                      <Users size={18} className="text-gold-deep" />
                      {labels.boySection}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-text-muted">{labels.name}</label>
                    <input 
                      type="text"
                      className="bg-bg-page border border-bg-border rounded px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-gold-deep"
                      placeholder={labels.placeholderBoy}
                      value={boyName}
                      onChange={(e) => setBoyName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-semibold text-text-muted">{labels.dob} *</label>
                      <input 
                        type="date"
                        className="bg-bg-page border border-bg-border rounded px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-gold-deep"
                        value={boyDob}
                        onChange={(e) => setBoyDob(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-semibold text-text-muted">{labels.tob}</label>
                      <input 
                        type="time"
                        className="bg-bg-page border border-bg-border rounded px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-gold-deep"
                        value={boyTob}
                        onChange={(e) => setBoyTob(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-text-muted">{labels.place} *</label>
                    <PlaceSearch 
                      onSelect={(place) => setBoyCity(place)} 
                      selectedCity={boyCity}
                    />
                  </div>
                </div>

                {/* Bride Details Card */}
                <div style={cardStyle} className="flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-bg-border pb-2.5">
                    <h2 className="text-[15px] font-bold text-gold-bright flex items-center gap-2">
                      <Users size={18} className="text-gold-deep" />
                      {labels.girlSection}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-text-muted">{labels.name}</label>
                    <input 
                      type="text"
                      className="bg-bg-page border border-bg-border rounded px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-gold-deep"
                      placeholder={labels.placeholderGirl}
                      value={girlName}
                      onChange={(e) => setGirlName(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-semibold text-text-muted">{labels.dob} *</label>
                      <input 
                        type="date"
                        className="bg-bg-page border border-bg-border rounded px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-gold-deep"
                        value={girlDob}
                        onChange={(e) => setGirlDob(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-semibold text-text-muted">{labels.tob}</label>
                      <input 
                        type="time"
                        className="bg-bg-page border border-bg-border rounded px-3 py-2 text-[14px] text-text-primary focus:outline-none focus:border-gold-deep"
                        value={girlTob}
                        onChange={(e) => setGirlTob(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-semibold text-text-muted">{labels.place} *</label>
                    <PlaceSearch 
                      onSelect={(place) => setGirlCity(place)} 
                      selectedCity={girlCity}
                    />
                  </div>
                </div>

              </div>

              <button
                type="submit"
                disabled={isCalculating}
                className="w-full bg-gold-deep hover:bg-gold-mid text-[#1a1209] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg disabled:opacity-50 text-[15px]"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    {calcStep === 1 && labels.step1}
                    {calcStep === 2 && labels.step2}
                    {calcStep === 3 && labels.step3}
                    {calcStep === 4 && labels.step4}
                  </>
                ) : (
                  <>
                    <Heart size={20} />
                    {labels.btnCalculate}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="results-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6 relative"
          >
            {/* Top Premium Actions Bar (Hidden on Print) */}
            <div className="print:hidden w-full flex items-center justify-between gap-4 p-3 bg-[var(--bg-card)] border border-bg-border rounded-xl">
              <button 
                onClick={() => setBasicResult(null)}
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-gold-bright transition-colors bg-transparent border-0 cursor-pointer py-1.5 px-3 font-semibold"
              >
                <ArrowLeft size={16} />
                {language === 'ta' ? 'புதிய பொருத்தம் (New Match)' : 'New Match'}
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 text-sm bg-gold-deep/20 text-gold-bright px-4 py-2 rounded-lg border border-gold-deep/30 hover:bg-gold-deep/30 transition-all font-bold cursor-pointer hover:shadow-[0_0_12px_rgba(201,146,42,0.15)]"
              >
                <Printer size={18} />
                {language === 'ta' ? 'பிரிண்ட் செய்க (Print)' : 'Print Report'}
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center border-b border-bg-border pb-1 overflow-x-auto gap-4 scrollbar-thin">
              <div className="flex items-center gap-2">
                {(['overview', 'porutham', 'dosha', 'dasa'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                      activeTab === tab 
                        ? 'border-gold-bright text-gold-bright' 
                        : 'border-transparent text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {labels[tab]}
                  </button>
                ))}
              </div>
            </div>

            {/* Floating Mobile Print Button (Hidden on Print) */}
            <button
              onClick={() => window.print()}
              className="print:hidden fixed bottom-6 right-6 md:hidden bg-gold-bright hover:bg-gold-bright/90 text-black border border-gold-deep/30 p-5 rounded-full shadow-2xl hover:scale-105 transition-transform z-50 flex items-center justify-center cursor-pointer"
              style={{ boxShadow: '0 8px 32px rgba(201,146,42,0.3)' }}
              title={language === 'ta' ? 'அச்சிடு (Print)' : 'Print'}
            >
              <Printer size={26} className="text-black" />
            </button>


            {/* Tab Contents */}
            <div className="flex flex-col gap-6">
              
              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="flex flex-col gap-6">
                  
                  {/* Gauge Card */}
                  <div style={cardStyle} className="flex flex-col md:flex-row items-center gap-8 justify-around">
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="rgba(201, 146, 42, 0.1)"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#c9922a"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="251.2"
                          strokeDashoffset={251.2 - (251.2 * basicResult.overview_score) / 100}
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-[36px] font-bold text-text-primary font-mono">{basicResult.overview_score}%</span>
                        <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">MATCH SCALE</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 max-w-[450px] text-center md:text-left">
                      <span className="text-[12px] font-bold text-text-muted tracking-wide uppercase">{labels.verdictLabel}</span>
                      <h3 className={`text-[20px] font-bold ${
                        basicResult.overview_score >= 75 ? 'text-green-400' : basicResult.overview_score >= 55 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {basicResult.overview_score >= 75 
                          ? labels.excellentMatch 
                          : basicResult.overview_score >= 55 
                            ? labels.moderateMatch 
                            : labels.poorMatch
                        }
                      </h3>
                      <p className="text-[14px] text-text-secondary leading-relaxed">
                        {language === 'ta'
                          ? `உள்ளீடு செய்யப்பட்ட ஜாதகக் கணிப்புகளின்படி, நட்சத்திர பொருத்தம், பாபஸாமியம் மற்றும் தசா சந்தி தோஷப் புள்ளிகளை ஒப்பிடும் போது இந்த இணைக்கான மொத்தப் பொருத்தம் ${basicResult.overview_score}% ஆகும்.`
                          : `Based on astronomical alignments, Nakshatra Kootas, Papasamyam scores, and Dasa timeline junction checks, this match yields a unified score of ${basicResult.overview_score}%.`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Groom & Bride Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div style={cardStyle} className="flex flex-col gap-3">
                      <h4 className="text-[15px] font-bold text-gold-bright border-b border-bg-border pb-1.5 flex items-center justify-between">
                        <span>{labels.groom}</span>
                        <span className="text-[12px] text-text-muted font-mono">{boyName || 'Groom'}</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-text-muted">{labels.nakshatra}:</span>
                        <span className="text-text-primary font-semibold">{language === 'ta' ? basicResult.boy_star_ta : basicResult.boy_star}</span>
                        <span className="text-text-muted">{language === 'ta' ? 'இராசி:' : 'Moon Sign:'}</span>
                        <span className="text-text-primary font-semibold">{basicResult.boy_lagna.sign}</span>
                        <span className="text-text-muted">{language === 'ta' ? 'லக்னம்:' : 'Lagna Sign:'}</span>
                        <span className="text-text-primary font-semibold">{basicResult.boy_lagna.sign}</span>
                      </div>
                    </div>

                    <div style={cardStyle} className="flex flex-col gap-3">
                      <h4 className="text-[15px] font-bold text-gold-bright border-b border-bg-border pb-1.5 flex items-center justify-between">
                        <span>{labels.bride}</span>
                        <span className="text-[12px] text-text-muted font-mono">{girlName || 'Bride'}</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-text-muted">{labels.nakshatra}:</span>
                        <span className="text-text-primary font-semibold">{language === 'ta' ? basicResult.girl_star_ta : basicResult.girl_star}</span>
                        <span className="text-text-muted">{language === 'ta' ? 'இராசி:' : 'Moon Sign:'}</span>
                        <span className="text-text-primary font-semibold">{basicResult.girl_lagna.sign}</span>
                        <span className="text-text-muted">{language === 'ta' ? 'லக்னம்:' : 'Lagna Sign:'}</span>
                        <span className="text-text-primary font-semibold">{basicResult.girl_lagna.sign}</span>
                      </div>
                    </div>
                  </div>

                  {/* Responsive D1 Rasi Charts Side-by-Side (Stacked on Mobile) */}
                  <div className="flex flex-col gap-3">
                    <h3 className="text-[16px] font-bold text-gold-bright flex items-center gap-2">
                      <Sparkles size={16} className="text-gold-deep" />
                      {language === 'ta' ? 'ஜாதக கட்டங்கள் (Rasi Charts)' : 'D1 Rasi Charts'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <RasiChart
                        chart={basicResult.boy_chart}
                        planets={basicResult.boy_planets}
                        title={`${labels.groom} ${labels.chartTitle}`}
                        lagnaSign={basicResult.boy_lagna.sign}
                        language={language}
                      />
                      <RasiChart
                        chart={basicResult.girl_chart}
                        planets={basicResult.girl_planets}
                        title={`${labels.bride} ${labels.chartTitle}`}
                        lagnaSign={basicResult.girl_lagna.sign}
                        language={language}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: 10 Poruthams */}
              {activeTab === 'porutham' && (
                <div style={cardStyle} className="flex flex-col gap-6">
                  <div className="flex items-center justify-between border-b border-bg-border pb-3">
                    <h3 className="text-[16px] font-bold text-gold-bright">
                      {language === 'ta' ? '10 நட்சத்திர பொருத்தங்களின் விவரங்கள்' : '10 Nakshatra Kootas Compatibility Details'}
                    </h3>
                    <span className="bg-gold-deep/20 border border-gold-deep text-gold-bright text-xs font-bold px-2.5 py-1 rounded">
                      {basicResult.star_result.score_percent}% Compatibility
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-bg-border text-text-muted font-bold">
                          <th className="py-2.5">{language === 'ta' ? 'பொருத்தம்' : 'Porutham'}</th>
                          <th className="py-2.5 text-center">{language === 'ta' ? 'நிலை' : 'Status'}</th>
                          <th className="py-2.5 text-center">{language === 'ta' ? 'புள்ளிகள்' : 'Points'}</th>
                          <th className="py-2.5">{language === 'ta' ? 'விவரம்' : 'Astro Significance'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-bg-border">
                        {basicResult.star_result.poruthams.map((p) => {
                          const info = PORUTHAM_INFO[p.type] || {
                            nameTa: p.type,
                            nameEn: p.type,
                            descTa: '-',
                            descEn: '-'
                          }
                          return (
                            <tr key={p.type} className="hover:bg-bg-page/20 transition-colors">
                              <td className="py-3 font-semibold text-text-primary">
                                <div>{language === 'ta' ? info.nameTa : info.nameEn}</div>
                                {language === 'ta' && <div className="text-[11px] text-text-muted font-mono uppercase">{info.nameEn}</div>}
                              </td>
                              <td className="py-3 text-center">
                                {p.passed ? (
                                  <span className="bg-[var(--cat-panchangam)]/15 text-[var(--cat-panchangam)] border border-[var(--cat-panchangam)]/35 text-[11px] px-2 py-0.5 rounded font-bold">
                                    {labels.passed}
                                  </span>
                                ) : (
                                  <span className="bg-[var(--cat-marriage)]/15 text-[var(--cat-marriage)] border border-[var(--cat-marriage)]/35 text-[11px] px-2 py-0.5 rounded font-bold">
                                    {labels.failed}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 text-center font-mono font-bold text-text-primary">
                                {p.score} / {p.weight}
                              </td>
                              <td className="py-3 text-[13px] text-text-secondary leading-relaxed max-w-[350px]">
                                {language === 'ta' ? info.descTa : info.descEn}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Dosha & Papasamyam */}
              {activeTab === 'dosha' && (
                <div className="flex flex-col gap-6">
                  
                  {/* Papasamyam Points */}
                  <div style={cardStyle} className="flex flex-col gap-4">
                    <h3 className="text-[16px] font-bold text-gold-bright border-b border-bg-border pb-2">
                      {labels.maleficDiff} (Papasamyam)
                    </h3>
                    <p className="text-[13px] text-text-secondary leading-relaxed mb-2">
                      {labels.papasamyamSummary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                      <div className="bg-bg-page/50 border border-bg-border rounded-xl p-4 flex flex-col gap-1">
                        <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">{labels.groom}</span>
                        <span className="text-[28px] font-bold text-text-primary font-mono">{basicResult.horo_result.papasamyam.boy_score}</span>
                        <span className="text-[11px] text-text-secondary">Points</span>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">{labels.difference}</span>
                        <div className="text-[24px] font-bold text-gold-bright font-mono">{basicResult.horo_result.papasamyam.difference}</div>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          basicResult.horo_result.papasamyam.compatible
                            ? 'bg-[var(--cat-panchangam)]/15 border border-[var(--cat-panchangam)]/35 text-[var(--cat-panchangam)]'
                            : 'bg-[var(--cat-marriage)]/15 border border-[var(--cat-marriage)]/35 text-[var(--cat-marriage)]'
                        }`}>
                          {basicResult.horo_result.papasamyam.compatible ? labels.passed : labels.failed}
                        </span>
                      </div>

                      <div className="bg-bg-page/50 border border-bg-border rounded-xl p-4 flex flex-col gap-1">
                        <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">{labels.bride}</span>
                        <span className="text-[28px] font-bold text-text-primary font-mono">{basicResult.horo_result.papasamyam.girl_score}</span>
                        <span className="text-[11px] text-text-secondary">Points</span>
                      </div>
                    </div>
                  </div>

                  {/* Mangal Dosha */}
                  <div style={cardStyle} className="flex flex-col gap-4">
                    <h3 className="text-[16px] font-bold text-gold-bright border-b border-bg-border pb-2">
                      {labels.sevvaiAlignment} (Mangal Dosha)
                    </h3>
                    <p className="text-[13px] text-text-secondary leading-relaxed mb-2">
                      {labels.mangalSummary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center">
                      <div className="bg-bg-page/50 border border-bg-border rounded-xl p-4 flex flex-col gap-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">{labels.groom}</span>
                        <span className={`text-[16px] font-bold ${basicResult.horo_result.mangal_dosha.boy_has_dosha ? 'text-[var(--cat-marriage)]' : 'text-[var(--cat-panchangam)]'}`}>
                          {basicResult.horo_result.mangal_dosha.boy_has_dosha ? labels.yes : labels.no}
                        </span>
                        <span className="text-[11px] text-text-muted">Sevvai Dosham</span>
                      </div>

                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">{labels.compatibleStatus}</span>
                        <span className={`text-[14px] font-bold px-3 py-1 rounded-full ${
                          basicResult.horo_result.mangal_dosha.compatible
                            ? 'bg-[var(--cat-panchangam)]/15 border border-[var(--cat-panchangam)]/35 text-[var(--cat-panchangam)]'
                            : 'bg-[var(--cat-marriage)]/15 border border-[var(--cat-marriage)]/35 text-[var(--cat-marriage)]'
                        }`}>
                          {basicResult.horo_result.mangal_dosha.compatible ? labels.passed : labels.failed}
                        </span>
                      </div>

                      <div className="bg-bg-page/50 border border-bg-border rounded-xl p-4 flex flex-col gap-1.5">
                        <span className="text-[11px] uppercase tracking-wider text-text-muted font-bold">{labels.bride}</span>
                        <span className={`text-[16px] font-bold ${basicResult.horo_result.mangal_dosha.girl_has_dosha ? 'text-[var(--cat-marriage)]' : 'text-[var(--cat-panchangam)]'}`}>
                          {basicResult.horo_result.mangal_dosha.girl_has_dosha ? labels.yes : labels.no}
                        </span>
                        <span className="text-[11px] text-text-muted">Sevvai Dosham</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 4: Dasa Sandhi (Premium billing gated PRO feature!) */}
              {activeTab === 'dasa' && (
                <div>
                  {plan !== 'PRO' ? (
                    /* Lock Screen Option B Gateway */
                    <div style={cardStyle} className="relative overflow-hidden flex flex-col items-center text-center py-10 px-6 gap-5">
                      
                      {/* Blurred mock data backdrop representation */}
                      <div className="absolute inset-0 bg-cover opacity-10 filter blur-sm select-none pointer-events-none flex flex-col gap-2 p-4 text-[9px] font-mono">
                        <p>Dasa Sandhi scanning timelines... boy: Jupiter to Saturn age 24.5</p>
                        <p>girl: Mercury to Ketu age 23.9 gap: 7.2 months (moderate clash)</p>
                      </div>

                      <div className="w-14 h-14 bg-gold-deep/10 border border-gold-deep/30 rounded-full flex items-center justify-center text-gold-bright shadow-lg">
                        <Lock size={28} />
                      </div>

                      <div className="flex flex-col gap-1.5 max-w-[600px] z-10">
                        <h3 className="text-[18px] font-bold text-gold-bright">
                          {labels.proFeatureTitle}
                        </h3>
                        <p className="text-[13px] text-text-secondary leading-relaxed">
                          {labels.proFeatureDesc}
                        </p>
                      </div>

                      <button
                        onClick={handleUpgrade}
                        className="bg-gold-deep hover:bg-gold-mid text-[#1a1209] font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer shadow-lg z-10 text-[14px]"
                      >
                        <Unlock size={16} />
                        {labels.btnUpgrade}
                      </button>
                    </div>
                  ) : (
                    /* Unlocked Dasa Sandhi matching list */
                    <div style={cardStyle} className="flex flex-col gap-6 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-bg-border pb-3">
                        <h3 className="text-[16px] font-bold text-gold-bright flex items-center gap-2">
                          <Unlock size={18} className="text-[var(--cat-panchangam)]" />
                          {language === 'ta' ? 'தசா சந்தி காலப் பொருத்தம்' : 'Vimshottari Dasa Sandhi Timeline Analysis'}
                        </h3>
                        <span className="text-[11px] bg-[var(--cat-panchangam)]/15 border border-[var(--cat-panchangam)]/35 text-[var(--cat-panchangam)] px-2 py-0.5 rounded font-bold uppercase">
                          PRO UNLOCKED
                        </span>
                      </div>

                      {dasaLoading ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-2">
                          <RefreshCw className="animate-spin text-gold-bright" size={24} />
                          <p className="text-[13px] text-text-muted">{language === 'ta' ? 'காலவரிசைகளை கணிக்கிறது...' : 'Scanning Mahadasha timelines...'}</p>
                        </div>
                      ) : dasaResult ? (
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col md:flex-row items-center justify-between bg-bg-page/50 border border-bg-border rounded-lg p-4 gap-4">
                            <span className="text-[14px] text-text-secondary">{labels.dasaSeverity}</span>
                            <span className={`text-sm font-bold px-3 py-1 rounded-full uppercase ${
                              dasaResult.summary_severity === 'severe' 
                                ? 'bg-[var(--cat-marriage)]/15 border border-[var(--cat-marriage)] text-[var(--cat-marriage)]' 
                                : dasaResult.summary_severity === 'moderate'
                                  ? 'bg-[var(--cat-prasnam)]/15 border border-[var(--cat-prasnam)] text-[var(--cat-prasnam)]'
                                  : dasaResult.summary_severity === 'mild'
                                    ? 'bg-[var(--gold-tint)] border border-[var(--gold-mid)]/40 text-[var(--gold-deep)] dark:text-[var(--gold-bright)]'
                                    : 'bg-[var(--cat-panchangam)]/15 border border-[var(--cat-panchangam)] text-[var(--cat-panchangam)]'
                            }`}>
                              {labels[dasaResult.summary_severity]}
                            </span>
                          </div>

                          {dasaResult.clashes.length === 0 ? (
                            <div className="bg-[var(--cat-panchangam)]/10 border border-[var(--cat-panchangam)]/40 rounded-lg p-5 flex flex-col items-center text-center gap-2">
                              <CheckCircle2 className="text-[var(--cat-panchangam)]" size={32} />
                              <p className="text-[14px] text-[var(--text-primary)] leading-relaxed font-semibold">
                                {labels.noClashMsg}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-4">
                              {dasaResult.clashes.map((clash, idx) => (
                                <div key={idx} className="bg-bg-page/40 border border-bg-border rounded-xl p-4 md:p-5 flex flex-col gap-3">
                                  <div className="flex items-center justify-between border-b border-bg-border/60 pb-2">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                                      clash.severity === 'severe' 
                                        ? 'bg-[var(--cat-marriage)]/15 border border-[var(--cat-marriage)] text-[var(--cat-marriage)]'
                                        : clash.severity === 'moderate'
                                          ? 'bg-[var(--cat-prasnam)]/15 border border-[var(--cat-prasnam)] text-[var(--cat-prasnam)]'
                                          : 'bg-[var(--gold-tint)] border border-[var(--gold-mid)]/40 text-[var(--gold-deep)] dark:text-[var(--gold-bright)]'
                                    }`}>
                                      {labels[clash.severity]}
                                    </span>
                                    <span className="text-xs text-text-muted font-mono">
                                      {labels.gapLabel} {clash.gap_months} Months
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-1.5">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[11px] text-text-muted uppercase font-bold">{labels.groom}</span>
                                      <span className="text-text-primary font-bold">{clash.boy_planet}</span>
                                      <span className="text-xs text-text-secondary">Age: {clash.boy_age} years</span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-[11px] text-text-muted uppercase font-bold">{labels.bride}</span>
                                      <span className="text-text-primary font-bold">{clash.girl_planet}</span>
                                      <span className="text-xs text-text-secondary">Age: {clash.girl_age} years</span>
                                    </div>
                                  </div>

                                  <div className="bg-bg-page/60 rounded p-3 text-[13px] text-text-secondary leading-relaxed border-l-2 border-[var(--gold-deep)] flex flex-col gap-1 mt-2">
                                    <span className="text-[10px] uppercase font-bold text-text-muted">{labels.adviceLabel}</span>
                                    <p>{language === 'ta' ? clash.advice_ta : clash.advice_en}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              {/* Reset button to check another compatibility */}
              <button
                onClick={() => setBasicResult(null)}
                className="bg-bg-card hover:bg-bg-active text-text-primary border border-bg-border font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer self-start text-[14px]"
              >
                <RefreshCw size={16} />
                {labels.btnReset}
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

      {/* Printable Report View (Visible only during print) */}
      {basicResult && (
        <div className="hidden print:block text-black bg-white min-h-screen p-6 font-sans">
          {/* Header */}
          <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {language === 'ta' ? 'ஜோதிசாஃப்ட் | ஜாதகப் பொருத்த அறிக்கை' : 'JothiSoft | Horoscope Compatibility Report'}
            </h1>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">
              {language === 'ta' ? 'விளக்கமான திருமணப் பொருத்த கணிப்பு' : 'Detailed Marriage Compatibility Analysis'}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Generated on {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Unified Overview Cards */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2">
                {labels.groom} ({boyName || 'Groom'})
              </h3>
              <div className="grid grid-cols-2 gap-y-1 text-xs">
                <span className="text-gray-500">{labels.nakshatra}:</span>
                <span className="font-bold text-gray-900">{language === 'ta' ? basicResult.boy_star_ta : basicResult.boy_star}</span>
                <span className="text-gray-500">{language === 'ta' ? 'பிறந்த தேதி:' : 'DOB:'}</span>
                <span className="font-bold text-gray-900">{boyDob}</span>
                <span className="text-gray-500">{language === 'ta' ? 'இராசி:' : 'Moon Sign:'}</span>
                <span className="font-bold text-gray-900">{basicResult.boy_lagna.sign}</span>
                <span className="text-gray-500">{language === 'ta' ? 'லக்னம்:' : 'Lagna Sign:'}</span>
                <span className="font-bold text-gray-900">{basicResult.boy_lagna.sign}</span>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-1 mb-2">
                {labels.bride} ({girlName || 'Bride'})
              </h3>
              <div className="grid grid-cols-2 gap-y-1 text-xs">
                <span className="text-gray-500">{labels.nakshatra}:</span>
                <span className="font-bold text-gray-900">{language === 'ta' ? basicResult.girl_star_ta : basicResult.girl_star}</span>
                <span className="text-gray-500">{language === 'ta' ? 'பிறந்த தேதி:' : 'DOB:'}</span>
                <span className="font-bold text-gray-900">{girlDob}</span>
                <span className="text-gray-500">{language === 'ta' ? 'இராசி:' : 'Moon Sign:'}</span>
                <span className="font-bold text-gray-900">{basicResult.girl_lagna.sign}</span>
                <span className="text-gray-500">{language === 'ta' ? 'லக்னம்:' : 'Lagna Sign:'}</span>
                <span className="font-bold text-gray-900">{basicResult.girl_lagna.sign}</span>
              </div>
            </div>
          </div>

          {/* Verdict & Score */}
          <div className="border border-gray-300 rounded-lg p-4 text-center mb-6 bg-gray-50">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{labels.compatibilityIndex}</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">{basicResult.overview_score}%</h2>
            <h3 className="text-sm font-bold text-gray-800 mt-1.5">
              {basicResult.overview_score >= 75 
                ? labels.excellentMatch 
                : basicResult.overview_score >= 55 
                  ? labels.moderateMatch 
                  : labels.poorMatch
              }
            </h3>
          </div>

          {/* Rasi Charts Side-by-Side */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <RasiChart
                chart={basicResult.boy_chart}
                planets={basicResult.boy_planets}
                title={`${labels.groom} ${labels.chartTitle}`}
                lagnaSign={basicResult.boy_lagna.sign}
                isPrint={true}
                language={language}
              />
            </div>
            <div className="flex flex-col items-center">
              <RasiChart
                chart={basicResult.girl_chart}
                planets={basicResult.girl_planets}
                title={`${labels.bride} ${labels.chartTitle}`}
                lagnaSign={basicResult.girl_lagna.sign}
                isPrint={true}
                language={language}
              />
            </div>
          </div>

          {/* 10 Poruthams Table */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-300 pb-2 mb-3">
              {language === 'ta' ? '10 நட்சத்திர பொருத்தங்களின் விவரங்கள்' : '10 Nakshatra Kootas Compatibility Details'}
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-bold border-b border-gray-300">
                  <th className="p-2 border border-gray-300">{language === 'ta' ? 'பொருத்தம்' : 'Porutham'}</th>
                  <th className="p-2 border border-gray-300 text-center">{language === 'ta' ? 'நிலை' : 'Status'}</th>
                  <th className="p-2 border border-gray-300 text-center">{language === 'ta' ? 'புள்ளிகள்' : 'Points'}</th>
                  <th className="p-2 border border-gray-300">{language === 'ta' ? 'விவரம்' : 'Significance'}</th>
                </tr>
              </thead>
              <tbody>
                {basicResult.star_result.poruthams.map((p) => {
                  const info = PORUTHAM_INFO[p.type] || { nameTa: p.type, nameEn: p.type, descTa: '-', descEn: '-' }
                  return (
                    <tr key={p.type} className="border-b border-gray-300">
                      <td className="p-2 border border-gray-300 font-semibold">
                        {language === 'ta' ? info.nameTa : info.nameEn}
                      </td>
                      <td className="p-2 border border-gray-300 text-center font-bold">
                        <span className={p.passed ? 'text-green-700' : 'text-red-700'}>
                          {p.passed ? (language === 'ta' ? 'பொருந்தும்' : 'Passed') : (language === 'ta' ? 'பொருந்தாது' : 'Failed')}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-300 text-center font-bold font-mono">
                        {p.score} / {p.weight}
                      </td>
                      <td className="p-2 border border-gray-300 text-gray-600">
                        {language === 'ta' ? info.descTa : info.descEn}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Dosha Check */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                {labels.maleficDiff} (Papasamyam)
              </h3>
              <div className="grid grid-cols-2 gap-y-1 text-xs">
                <span className="text-gray-500">{labels.groom}:</span>
                <span className="font-bold text-gray-900">{basicResult.horo_result.papasamyam.boy_score}</span>
                <span className="text-gray-500">{labels.bride}:</span>
                <span className="font-bold text-gray-900">{basicResult.horo_result.papasamyam.girl_score}</span>
                <span className="text-gray-500">{labels.difference}:</span>
                <span className="font-bold text-gray-900">{basicResult.horo_result.papasamyam.difference}</span>
                <span className="text-gray-500">{labels.compatibleStatus}:</span>
                <span className={`font-bold ${basicResult.horo_result.papasamyam.compatible ? 'text-green-700' : 'text-red-700'}`}>
                  {basicResult.horo_result.papasamyam.compatible ? (language === 'ta' ? 'பொருந்தும்' : 'Compatible') : (language === 'ta' ? 'பொருந்தாது' : 'Incompatible')}
                </span>
              </div>
            </div>

            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                {labels.sevvaiAlignment} (Mangal Dosha)
              </h3>
              <div className="grid grid-cols-2 gap-y-1 text-xs">
                <span className="text-gray-500">{labels.groom}:</span>
                <span className="font-bold text-gray-900">{basicResult.horo_result.mangal_dosha.boy_has_dosha ? (language === 'ta' ? 'உண்டு' : 'Yes') : (language === 'ta' ? 'இல்லை' : 'No')}</span>
                <span className="text-gray-500">{labels.bride}:</span>
                <span className="font-bold text-gray-900">{basicResult.horo_result.mangal_dosha.girl_has_dosha ? (language === 'ta' ? 'உண்டு' : 'Yes') : (language === 'ta' ? 'இல்லை' : 'No')}</span>
                <span className="text-gray-500">{labels.compatibleStatus}:</span>
                <span className={`font-bold ${basicResult.horo_result.mangal_dosha.compatible ? 'text-green-700' : 'text-red-700'}`}>
                  {basicResult.horo_result.mangal_dosha.compatible ? (language === 'ta' ? 'பொருந்தும்' : 'Compatible') : (language === 'ta' ? 'பொருந்தாது' : 'Incompatible')}
                </span>
              </div>
            </div>
          </div>

          {/* Dasa Sandhi timeline */}
          {plan === 'PRO' && dasaResult && (
            <div className="border border-gray-300 rounded-lg p-4">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
                {language === 'ta' ? 'தசா சந்தி காலப் பொருத்தம்' : 'Vimshottari Dasa Sandhi Timeline'}
              </h3>
              <div className="text-xs mb-3">
                <span className="text-gray-500">{labels.dasaSeverity} </span>
                <span className="font-bold uppercase text-gray-900">{labels[dasaResult.summary_severity]}</span>
              </div>
              {dasaResult.clashes.length === 0 ? (
                <p className="text-xs text-green-700 font-semibold">{labels.noClashMsg}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {dasaResult.clashes.map((clash, idx) => (
                    <div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50">
                      <div className="flex justify-between font-bold text-xs text-gray-800 mb-1">
                        <span>{labels[clash.severity]}</span>
                        <span>{labels.gapLabel} {clash.gap_months} M</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] mb-1.5">
                        <div>
                          <span className="text-gray-500">{labels.groom}:</span> <span className="font-bold">{clash.boy_planet}</span> (Age: {clash.boy_age})
                        </div>
                        <div>
                          <span className="text-gray-500">{labels.bride}:</span> <span className="font-bold">{clash.girl_planet}</span> (Age: {clash.girl_age})
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-600 italic">
                        <strong>{labels.adviceLabel}</strong> {language === 'ta' ? clash.advice_ta : clash.advice_en}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
