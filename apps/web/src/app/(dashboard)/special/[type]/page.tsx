'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, AlertTriangle, RefreshCw, Clock, Sparkles, Calendar,
  CircleDot, Star, Flame, Sun, Gift, BookMarked, MapPin,
  CheckCircle2, Ban, Heart, Copy, Check, Info, Award
} from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import api from '@/lib/api'

// Define interfaces locally
export type SpecialDayType =
  | 'amavasai' | 'pournami' | 'sashti' | 'krithigai'
  | 'uthiram' | 'kantha_vrat' | 'tharpanam'
  | 'tamil_new_year' | 'jwalini' | 'pradosham';

export interface SpecialDay {
  type: SpecialDayType;
  name_en: string;
  name_ta: string;
  date: string;          // "2026-04-14"
  day_of_week: string;
  significance_en: string;
  significance_ta: string;
  deity_en?: string;
  deity_ta?: string;
  fasting?: boolean;
  fasting_rules_en?: string | null;
  fasting_rules_ta?: string | null;
  ritual_en?: string;
  ritual_ta?: string;
  avoid_en?: string;
  avoid_ta?: string;
  color_accent?: string;
  icon?: string;
  card_shape?: string;
  auspicious_time_en?: string;
  auspicious_time_ta?: string;
  offerings?: { en: string; ta: string }[];
  mantra?: { text_ta?: string; transliteration?: string; meaning_en?: string };
  key_temples?: { name: string; location: string; reason_en?: string }[];
}

// Map dynamic URL params to the backend API day types
const ROUTE_TO_API_TYPE: Record<string, SpecialDayType> = {
  amavasai: 'amavasai',
  tharpanam: 'tharpanam',
  pournami: 'pournami',
  sashti: 'sashti',
  kantha: 'kantha_vrat',
  krithigai: 'krithigai',
  uthiram: 'uthiram',
  newyear: 'tamil_new_year',
  pradosham: 'pradosham',
  jwalini: 'jwalini',
}

// Map types to fallback category icons if needed
const TYPE_ICONS: Record<SpecialDayType, React.ComponentType<any>> = {
  amavasai: CircleDot,
  tharpanam: CircleDot,
  pournami: CircleDot,
  sashti: Star,
  kantha_vrat: Flame,
  krithigai: Star,
  uthiram: Sun,
  tamil_new_year: Gift,
  pradosham: CircleDot,
  jwalini: Flame,
}

// Custom shape radii dynamically mapped based on card_shape or day type
const SHAPE_MAP: Record<string, string> = {
  pill: '999px', // fully rounded pill/oval
  'left-clip': '0px 24px 24px 0px', // left-clipped
  oval: '50% 50% 50% 50% / 60% 60% 40% 40%', // egg/half-moon
  sharp: '0px', // sharp rectangle
  shield: '12px 12px 50% 50%', // shield
  dome: '32px 32px 4px 4px', // dome
  diamond: '24px 4px 24px 4px', // diamond corner cuts
  starburst: '30% 70% 70% 30% / 30% 30% 70% 70%', // blob
  rounded: '16px', // smooth square
  leaf: '50% 0% 50% 0%', // leaf/ellipse
}

// Existing JothiSoft color tokens mapped dynamically to day categories as fallbacks
const CATEGORY_CONFIG: Record<SpecialDayType, { color: string; bgTint: string; labelEn: string; labelTa: string; descEn: string; descTa: string }> = {
  amavasai: {
    color: '#7b5ea7', // cat-horoscope purple
    bgTint: 'rgba(123, 94, 167, 0.08)',
    labelEn: 'Amavasai',
    labelTa: 'அமாவாசை',
    descEn: 'New Moon day. Most auspicious for ancestral worship, prayers, and positive spiritual transitions.',
    descTa: 'அமாவாசை திருநாள். பித்ரு வழிபாட்டிற்கும், தியானத்திற்கும், மன அமைதிக்கும் உகந்த நாள்.'
  },
  tharpanam: {
    color: '#2e7d6b', // cat-panchangam teal
    bgTint: 'rgba(46, 125, 107, 0.08)',
    labelEn: 'Tharpanam',
    labelTa: 'தர்ப்பணம்',
    descEn: 'Offerings made to ancestors. Invokes peace, divine blessings, and clears ancestral debts.',
    descTa: 'பித்ருக்களுக்கு செய்யும் தர்பண முறை. முன்னோர்களின் ஆசி பெறவும், குடும்ப மேன்மைக்கும் உகந்தது.'
  },
  pournami: {
    color: '#f2c96a', // gold-bright
    bgTint: 'rgba(242, 201, 106, 0.08)',
    labelEn: 'Pournami',
    labelTa: 'பௌர்ணமி',
    descEn: 'Full Moon day. Charged with high cosmic energy, ideal for special prayers, fasts, and poojas.',
    descTa: 'பௌர்ணமி திருநாள். அம்பிகை வழிபாடு, விரதங்கள் மற்றும் இறைவழிபாட்டிற்கு உகந்த முழு நிலவு நாள்.'
  },
  sashti: {
    color: '#a05c1a', // cat-prasnam amber
    bgTint: 'rgba(160, 92, 26, 0.08)',
    labelEn: 'Sashti',
    labelTa: 'சஷ்டி',
    descEn: 'Sixth lunar day. Sacred to Lord Murugan, observed with fasting to remove obstacles and invoke courage.',
    descTa: 'முருகப் பெருமானுக்கு உகந்த சஷ்டி திதி. விரதமிருந்து வழிபட வேண்டிய முக்கிய சுப நாள்.'
  },
  kantha_vrat: {
    color: '#a05c1a',
    bgTint: 'rgba(160, 92, 26, 0.08)',
    labelEn: 'Kantha Vrat',
    labelTa: 'கந்த விரதம்',
    descEn: 'The supreme fast of Lord Murugan. Brings health, dispels fear, and ensures overall victory.',
    descTa: 'கந்த சஷ்டி விரதம். முருகனின் பேரருளைப் பெறவும், மனத் துணிவும், குடும்ப சுபிட்சமும் உண்டாக விரதமிருக்கும் நாள்.'
  },
  krithigai: {
    color: '#a05c1a',
    bgTint: 'rgba(160, 92, 26, 0.08)',
    labelEn: 'Krithigai',
    labelTa: 'கிருத்திகை',
    descEn: 'Star day dedicated to Karthikeya. Removes negative energies and brings fire-like focus.',
    descTa: 'கிருத்திகை நட்சத்திர நாள். முருகனுக்கு உகந்த நட்சத்திர விரதம். தோஷங்கள் நீங்கி வளம் பெற உகந்தது.'
  },
  uthiram: {
    color: '#f2c96a',
    bgTint: 'rgba(242, 201, 106, 0.08)',
    labelEn: 'Uthiram',
    labelTa: 'உத்திரம்',
    descEn: 'Panguni Uthiram. A sacred celestial marriage day, bringing divine union, peace, and harmony.',
    descTa: 'பங்குனி உத்திரம். தெய்வீக திருமணங்கள் நடைபெற்ற மங்கல நாள். குடும்ப ஒற்றுமைக்கு சிறந்தது.'
  },
  tamil_new_year: {
    color: '#c9922a', // gold-deep
    bgTint: 'rgba(201, 146, 42, 0.08)',
    labelEn: 'Tamil New Year',
    labelTa: 'தமிழ்ப் புத்தாண்டு',
    descEn: 'Beginning of the Tamil solar calendar. Perfect for starting new ventures and listening to Panchangam.',
    descTa: 'சித்திரை முதல் நாள் - தமிழ் புத்தாண்டு. புத்தாடை அணிந்து, பஞ்சாங்கம் வாசித்து புதிய நற்செயல்களைத் துவங்க உகந்தது.'
  },
  pradosham: {
    color: '#2e7d6b', // cat-panchangam teal
    bgTint: 'rgba(46, 125, 107, 0.08)',
    labelEn: 'Pradosham',
    labelTa: 'பிரதோஷம்',
    descEn: 'Sacred twilight window occurring twice a month, supreme for dissolving sins and obtaining Lord Shiva & Nandi blessings.',
    descTa: 'பிரதோஷ காலம். கர்ம வினைகளையும் தோஷங்களையும் போக்க சிவபெருமானுக்கும் நந்தி தேவருக்கும் விரதமிருந்து வழிபடும் சுப நாள்.'
  },
  jwalini: {
    color: '#b0415e', // cat-marriage rose
    bgTint: 'rgba(176, 65, 94, 0.08)',
    labelEn: 'Jwalini',
    labelTa: 'ஜுவாலினி',
    descEn: 'Devi Jwalini special tithi and fire invocation. Promotes inner power and burns spiritual blockages.',
    descTa: 'ஜுவாலினி தேவி வழிபாடு. ஞான அக்னி மூலம் தடைகளைத் தகர்த்து மனோபலம் பெருக வழிபட வேண்டிய நாள்.'
  }
};

const MONTHS_TA = [
  'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
  'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்'
];

const MONTHS_EN = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const WEEKDAYS_TA: Record<string, string> = {
  'Sunday': 'ஞாயிறு',
  'Monday': 'திங்கள்',
  'Tuesday': 'செவ்வாய்',
  'Wednesday': 'புதன்',
  'Thursday': 'வியாழன்',
  'Friday': 'வெள்ளி',
  'Saturday': 'சனி'
};

export default function SpecialDayDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const isTa = language === 'ta'

  const routeType = params.type as string
  const apiType = ROUTE_TO_API_TYPE[routeType]

  const [year, setYear] = useState<number>(2026)
  const [days, setDays] = useState<SpecialDay[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [is503, setIs503] = useState<boolean>(false)
  const [copiedMantra, setCopiedMantra] = useState<boolean>(false)

  useEffect(() => {
    if (!apiType) {
      setError(isTa ? 'தவறான பக்கம்' : 'Invalid Type')
      setLoading(false)
      return
    }
    fetchSpecialDays()
  }, [apiType, year])

  const fetchSpecialDays = async () => {
    try {
      setLoading(true)
      setError(null)
      setIs503(false)
      const res = await api.get<{ success: boolean; data: SpecialDay[] }>(
        `/special-days/${apiType}?year=${year}`
      )
      if (res.success) {
        const fetchedDays = res.data || []
        setDays(fetchedDays)

        // Find first upcoming or today's occurrence to default-select
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const upcomingIdx = fetchedDays.findIndex((d) => new Date(d.date) >= today)
        setSelectedIndex(upcomingIdx !== -1 ? upcomingIdx : 0)
      } else {
        throw new Error('Failed to fetch data')
      }
    } catch (err: any) {
      const isStillComputing = err.status === 503 ||
        err.message?.includes('computed') ||
        err.message?.includes('unavailable') ||
        err.message?.includes('SERVICE_UNAVAILABLE');
      if (isStillComputing) {
        setIs503(true)
        setError(isTa
          ? 'இந்த ஆண்டிற்கான நாட்கள் தற்போது கணக்கிடப்படுகின்றன. தயவுசெய்து சிறிது நேரம் காத்திருந்து மீண்டும் முயற்சிக்கவும்.'
          : 'Special days are currently being computed for this year. Please wait 30 seconds and retry.'
        )
      } else {
        setError(isTa ? 'தரவுகளைப் பெறுவதில் தோல்வி.' : 'Failed to retrieve special days.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Fallback config setting
  const fallbackConfig = CATEGORY_CONFIG[apiType] || {
    color: '#c9922a',
    bgTint: 'rgba(201, 146, 42, 0.08)',
    labelEn: 'Special Day',
    labelTa: 'விசேஷ நாள்',
    descEn: 'Sacred event schedule.',
    descTa: 'ஆன்மீக திருநாள் கால அட்டவணை.'
  }

  // Derive dynamic config attributes if the days list is populated
  const selectedDay = days[selectedIndex] || days[0];
  const dynamicColor = selectedDay?.color_accent || fallbackConfig.color;
  const dynamicIcon = selectedDay?.icon || '✨';
  const dynamicShape = selectedDay?.card_shape || 'rounded';
  const resolvedShape = SHAPE_MAP[dynamicShape] || SHAPE_MAP['rounded'];

  const isFuture = (dateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(dateStr) >= today
  }

  const formatDateBox = (dateStr: string) => {
    const dateObj = new Date(dateStr)
    const day = dateObj.getDate()
    const monthIndex = dateObj.getMonth()
    const month = isTa ? MONTHS_TA[monthIndex] : MONTHS_EN[monthIndex]
    return { day, month }
  }

  const formatSelectedDateStr = (dateStr: string, weekday: string) => {
    const dateObj = new Date(dateStr)
    const day = dateObj.getDate()
    const monthIndex = dateObj.getMonth()
    const month = isTa ? MONTHS_TA[monthIndex] : MONTHS_EN[monthIndex]
    const formattedWeekday = isTa ? (WEEKDAYS_TA[weekday] || weekday) : weekday
    return isTa
      ? `${year} ${month} ${day} (${formattedWeekday})`
      : `${month} ${day}, ${year} (${formattedWeekday})`
  }

  const handleCopyMantra = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMantra(true);
    setTimeout(() => setCopiedMantra(false), 2000);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-[14px]"
        >
          <ArrowLeft className="w-4 h-4" />
          {isTa ? 'பின்செல்ல' : 'Back'}
        </button>

        {/* Year Toggle Option */}
        <div className="flex items-center bg-stone-900/60 border border-stone-850 rounded-lg p-0.5 z-10">
          {[2025, 2026, 2027].map((y) => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`px-3 py-1 text-[13px] font-medium rounded-md transition-all ${year === y
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-400 hover:text-stone-200'
                }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-64 bg-stone-900/30 animate-pulse rounded-lg border border-stone-850" />
            <div className="h-40 bg-stone-900/30 animate-pulse rounded-lg border border-stone-850" />
          </div>
          <div className="lg:col-span-5 space-y-3">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-20 bg-stone-900/30 animate-pulse rounded-lg border border-stone-850"
              />
            ))}
          </div>
        </div>
      ) : is503 ? (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-8 text-center space-y-4 max-w-md mx-auto">
          <Clock className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
          <h2 className="text-[16px] font-semibold text-amber-400">
            {isTa ? 'நாட்கள் கணக்கிடப்படுகிறது...' : 'Computing Calendar...'}
          </h2>
          <p className="text-stone-400 text-[13px] leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchSpecialDays}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium py-2 rounded-lg text-[13px] inline-flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {isTa ? 'மீண்டும் முயற்சிக்கவும்' : 'Retry Calculation'}
          </button>
        </div>
      ) : error ? (
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-red-200 text-[14px]">{error}</p>
          <button
            onClick={fetchSpecialDays}
            className="text-[13px] text-red-400 underline inline-flex items-center gap-1 hover:text-red-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {isTa ? 'மீண்டும் முயல்க' : 'Retry'}
          </button>
        </div>
      ) : days.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-stone-850 rounded-lg bg-stone-900/10">
          <Calendar className="w-10 h-10 text-stone-600 mx-auto mb-2" />
          <p className="text-stone-400 text-[14px]">
            {isTa ? 'இந்த ஆண்டிற்குள் நிகழ்வுகள் எதுவும் இல்லை' : 'No records found for this year'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* LEFT COLUMN: Cultural Details & Sacred Info */}
          <div className="lg:col-span-7 space-y-6">

            {/* Main Aesthetic Banner Card */}
            <div
              className="bg-stone-900/30 p-6 rounded-xl border border-stone-850 relative overflow-hidden transition-all duration-300"
              style={{
                borderColor: `${dynamicColor}25`,
                background: `radial-gradient(circle at top right, ${dynamicColor}12, transparent 65%)`
              }}
            >
              <div className="flex items-start gap-4">
                {/* Dynamically Shaped Emoji / Icon container */}
                <div
                  className="w-16 h-16 flex items-center justify-center text-3xl select-none bg-stone-950/80 border shrink-0 shadow-lg"
                  style={{
                    borderRadius: resolvedShape,
                    borderColor: `${dynamicColor}45`,
                    boxShadow: `0 0 15px ${dynamicColor}20`
                  }}
                >
                  {dynamicIcon}
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {isTa ? selectedDay.name_ta : selectedDay.name_en}
                  </h1>

                  {/* Deity Display */}
                  {selectedDay.deity_en && (
                    <div className="flex items-center gap-1.5 text-stone-300 text-[13px]">
                      <Sparkles className="w-3.5 h-3.5" style={{ color: dynamicColor }} />
                      <span className="font-semibold text-stone-400">
                        {isTa ? 'வழிபடும் தெய்வம்:' : 'Deity:'}
                      </span>
                      <span className="text-white font-medium">
                        {isTa ? selectedDay.deity_ta : selectedDay.deity_en}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Occurrence Interactive Details */}
              <div className="mt-4 p-3 bg-stone-950/60 border border-stone-850/80 rounded-lg flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: dynamicColor }} />
                  <div className="text-[12.5px]">
                    <span className="text-stone-400">
                      {isTa ? 'தேர்ந்தெடுக்கப்பட்ட நாள்:' : 'Active Date:'}{' '}
                    </span>
                    <span className="text-white font-semibold">
                      {formatSelectedDateStr(selectedDay.date, selectedDay.day_of_week)}
                    </span>
                  </div>
                </div>

                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold select-none tracking-wide ${isFuture(selectedDay.date)
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-stone-850 border border-stone-800 text-stone-500'
                  }`}>
                  {isFuture(selectedDay.date)
                    ? (isTa ? 'வரவிருப்பது' : 'Upcoming')
                    : (isTa ? 'முடிந்தது' : 'Past')
                  }
                </span>
              </div>

              {/* Significance Box */}
              <div className="mt-5 pt-4 border-t border-stone-850/60">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-1.5">
                  {isTa ? 'முக்கியத்துவம் & தத்துவம்' : 'Significance & Mythology'}
                </h4>
                <p className="text-stone-300 text-[13.5px] leading-relaxed italic">
                  "{isTa ? selectedDay.significance_ta : selectedDay.significance_en}"
                </p>
              </div>
            </div>

            {/* Fasting & Auspicious Timings sub-grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Fasting Card */}
              <div className="bg-stone-900/30 p-5 rounded-lg border border-stone-850 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-[14.5px] flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-rose-400" />
                    {isTa ? 'விரதம் & உணவு' : 'Fasting Status'}
                  </h3>

                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${selectedDay.fasting
                      ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                      : 'bg-stone-800 text-stone-400'
                    }`}>
                    {selectedDay.fasting
                      ? (isTa ? 'உபவாசம் உண்டு' : 'Fasting Required')
                      : (isTa ? 'உபவாசம் இல்லை' : 'No Fasting')
                    }
                  </span>
                </div>

                {selectedDay.fasting_rules_en ? (
                  <p className="text-stone-400 text-[12.5px] leading-relaxed">
                    {isTa ? selectedDay.fasting_rules_ta : selectedDay.fasting_rules_en}
                  </p>
                ) : (
                  <p className="text-stone-500 text-[12.5px]">
                    {isTa
                      ? 'இந்த நாளில் சிறப்பு விரதக் கட்டுப்பாடுகள் எதுவும் குறிக்கப்படவில்லை.'
                      : 'No specific dietary restrictions listed for this day.'
                    }
                  </p>
                )}
              </div>

              {/* Auspicious Time Card */}
              <div className="bg-stone-900/30 p-5 rounded-lg border border-stone-850 space-y-3">
                <h3 className="font-semibold text-white text-[14.5px] flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {isTa ? 'சுப முகூர்த்த நேரம்' : 'Auspicious Time'}
                </h3>

                {selectedDay.auspicious_time_en ? (
                  <p className="text-stone-400 text-[12.5px] leading-relaxed">
                    {isTa ? selectedDay.auspicious_time_ta : selectedDay.auspicious_time_en}
                  </p>
                ) : (
                  <p className="text-stone-500 text-[12.5px]">
                    {isTa
                      ? 'பஞ்சாங்கத்தின்படி நாள் முழுவதும் பூஜைகளுக்கு உகந்தது.'
                      : 'All hours generally auspicious for worship ceremonies.'
                    }
                  </p>
                )}
              </div>

            </div>

            {/* Prasadam & Offerings */}
            {selectedDay.offerings && selectedDay.offerings.length > 0 && (
              <div className="bg-stone-900/30 p-5 rounded-lg border border-stone-850 space-y-3">
                <h3 className="font-semibold text-white text-[14.5px] flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-400" />
                  {isTa ? 'நிவேதனப் பொருட்கள் (படையல்)' : 'Prasadam & Offerings'}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {selectedDay.offerings.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-stone-950/80 border border-stone-800/80 text-stone-300 text-[12px] px-3 py-1 rounded-md flex items-center gap-1.5 hover:border-stone-750 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {isTa ? item.ta : item.en}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Mantra Card */}
            {selectedDay.mantra && selectedDay.mantra.text_ta && (
              <div
                className="bg-stone-950/40 p-5 rounded-lg border relative overflow-hidden transition-all duration-300 group hover:bg-stone-950/60"
                style={{ borderColor: `${dynamicColor}20`, borderLeftWidth: '4px', borderLeftColor: dynamicColor }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-[14px] flex items-center gap-1.5 text-stone-200 uppercase tracking-wider">
                      <Flame className="w-4 h-4 text-amber-500" />
                      {isTa ? 'மூல மந்திரம் / பாராயணம்' : 'Sacred Chant / Mantra'}
                    </h3>

                    <p className="text-xl font-bold text-white mt-3 select-all leading-normal tracking-wide">
                      {selectedDay.mantra.text_ta}
                    </p>

                    {selectedDay.mantra.transliteration && (
                      <p className="text-stone-400 text-[13px] mt-2 italic font-mono">
                        {selectedDay.mantra.transliteration}
                      </p>
                    )}

                    {selectedDay.mantra.meaning_en && !isTa && (
                      <p className="text-stone-500 text-[12px] mt-2 border-t border-stone-900 pt-2 leading-relaxed">
                        <span className="font-medium text-stone-400">Meaning:</span> {selectedDay.mantra.meaning_en}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopyMantra(selectedDay.mantra?.text_ta || '')}
                    className="p-2 rounded bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-colors active:scale-90"
                    title={isTa ? 'மந்திரத்தை பிரதி செய்' : 'Copy Mantra'}
                  >
                    {copiedMantra ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Recommended Rituals & Practices & Avoid list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Recommended Rituals */}
              {selectedDay.ritual_en && (
                <div className="bg-stone-900/30 p-5 rounded-lg border border-stone-850 space-y-3">
                  <h3 className="font-semibold text-[14.5px] text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {isTa ? 'பரிந்துரைக்கப்பட்ட வழிபாடுகள்' : 'Key Rituals & Practices'}
                  </h3>
                  <p className="text-stone-400 text-[12.5px] leading-relaxed">
                    {isTa ? selectedDay.ritual_ta : selectedDay.ritual_en}
                  </p>
                </div>
              )}

              {/* Avoid Instructions */}
              {selectedDay.avoid_en && (
                <div className="bg-stone-900/30 p-5 rounded-lg border border-stone-850 space-y-3">
                  <h3 className="font-semibold text-[14.5px] text-white flex items-center gap-2">
                    <Ban className="w-4 h-4 text-rose-400" />
                    {isTa ? 'தவிர்க்க வேண்டியவை' : 'Refrain From'}
                  </h3>
                  <p className="text-stone-400 text-[12.5px] leading-relaxed">
                    {isTa ? selectedDay.avoid_ta : selectedDay.avoid_en}
                  </p>
                </div>
              )}

            </div>

            {/* Key Pilgrimage Temples */}
            {selectedDay.key_temples && selectedDay.key_temples.length > 0 && (
              <div className="bg-stone-900/30 p-5 rounded-lg border border-stone-850 space-y-4">
                <h3 className="font-semibold text-white text-[14.5px] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400 animate-pulse" />
                  {isTa ? 'வழிபாட்டுக்கு உகந்த முக்கிய ஸ்தலங்கள்' : 'Key Pilgrimage Temples'}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {selectedDay.key_temples.map((temple, idx) => (
                    <div
                      key={idx}
                      className="bg-stone-950/80 p-4 rounded-lg border border-stone-850/80 hover:border-stone-800 transition-colors space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white text-[13.5px]">
                          {temple.name}
                        </h4>
                        <span className="text-[11px] text-stone-500 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-stone-600" />
                          {temple.location}
                        </span>
                      </div>

                      {temple.reason_en && (
                        <p className="text-stone-400 text-[12px] leading-relaxed">
                          {temple.reason_en}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN: Chronological Timeline Occurrence Calendar */}
          <div className="lg:col-span-5 space-y-4">

            <div className="bg-stone-900/20 p-4 rounded-lg border border-stone-850">
              <h2 className="font-semibold text-white text-[14px] flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-stone-400" />
                {isTa ? `${year} ஆம் ஆண்டின் நாட்காட்டி` : `${year} Occurrence Calendar`}
                <span className="ml-auto text-[11px] bg-stone-800 text-stone-400 px-2 py-0.5 rounded-full font-mono">
                  {days.length}
                </span>
              </h2>

              <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1 custom-scrollbar">
                {days.map((item, index) => {
                  const isUpcoming = isFuture(item.date)
                  const isSelected = selectedIndex === index
                  const { day, month } = formatDateBox(item.date)
                  const formattedWeekday = isTa
                    ? (WEEKDAYS_TA[item.day_of_week] || item.day_of_week)
                    : item.day_of_week

                  return (
                    <div
                      key={item.date + index}
                      onClick={() => setSelectedIndex(index)}
                      className={`transition-all duration-200 border rounded-lg p-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-900/40 active:scale-95 animate-fade-up ${isSelected
                          ? 'bg-stone-900/60 shadow-md scale-[1.01]'
                          : 'bg-stone-900/10 border-stone-850/60'
                        }`}
                      style={{
                        animationDelay: `${index * 20}ms`,
                        animationFillMode: 'backwards',
                        borderColor: isSelected ? dynamicColor : 'rgba(44, 40, 36, 0.4)',
                        boxShadow: isSelected ? `0 0 12px ${dynamicColor}20` : 'none'
                      }}
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Unique Category Shapes applied strictly to the Date Box */}
                        <div
                          className="bg-stone-950 border text-center flex flex-col items-center justify-center p-2 h-14 w-16 select-none shrink-0 transition-all duration-300"
                          style={{
                            borderRadius: resolvedShape,
                            borderColor: isSelected ? dynamicColor : `${dynamicColor}22`,
                            boxShadow: (isUpcoming || isSelected) ? `0 0 10px ${dynamicColor}15` : 'none'
                          }}
                        >
                          <span
                            className="block text-[9px] uppercase font-extrabold tracking-wider"
                            style={{ color: dynamicColor }}
                          >
                            {month}
                          </span>
                          <span className="block text-lg font-bold text-white leading-none mt-0.5">
                            {day}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-semibold text-white text-[14px]">
                            {isTa ? item.name_ta : item.name_en}
                          </h3>
                          <p className="text-stone-400 text-[12px] mt-0.5 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-stone-500" />
                            {formattedWeekday}
                          </p>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div className="flex items-center gap-2">
                        {isUpcoming && (
                          <span
                            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-medium select-none"
                          >
                            {isTa ? 'வரவிருப்பது' : 'Upcoming'}
                          </span>
                        )}
                        {isSelected && (
                          <span
                            className="w-2 h-2 rounded-full shrink-0 animate-ping"
                            style={{ backgroundColor: dynamicColor }}
                          />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  )
}
