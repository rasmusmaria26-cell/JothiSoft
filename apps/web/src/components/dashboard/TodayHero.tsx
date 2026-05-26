import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useSWR from 'swr'
import { useLanguage } from '@/context/LanguageContext'
import { translations } from '@/i18n/translations'
import { useBirthProfile } from '@/hooks/useBirthProfile'

const WEEKDAY_DETAILS: Record<number, { color: string; colorTa: string; colorEn: string; number: string; directionTa: string; directionEn: string }> = {
  0: { color: '#e2e8f0', colorTa: 'வெள்ளி/வெள்ளை', colorEn: 'Silver/White', number: '2', directionTa: 'வடக்கு', directionEn: 'North' },
  1: { color: '#ef4444', colorTa: 'சிகப்பு', colorEn: 'Red', number: '9', directionTa: 'தெற்கு', directionEn: 'South' },
  2: { color: '#22c55e', colorTa: 'பச்சை', colorEn: 'Green', number: '5', directionTa: 'வடகிழக்கு', directionEn: 'North-East' },
  3: { color: '#eab308', colorTa: 'மஞ்சள்', colorEn: 'Yellow', number: '3', directionTa: 'வடக்கு', directionEn: 'North' },
  4: { color: '#fae8ff', colorTa: 'வெள்ளை/கிரீம்', colorEn: 'White/Cream', number: '6', directionTa: 'கிழக்கு', directionEn: 'East' },
  5: { color: '#3b82f6', colorTa: 'நீலம்/கருப்பு', colorEn: 'Blue/Black', number: '8', directionTa: 'மேற்கு', directionEn: 'West' },
  6: { color: '#f97316', colorTa: 'தங்கம்/சிவப்பு', colorEn: 'Orange/Red', number: '1', directionTa: 'கிழக்கு', directionEn: 'East' }
};

const TAMIL_MAPS = {
  tithi: {
    "Pratipada": "பிரதமை", "Dvitiya": "துவிதியை", "Tritiya": "திருதியை", "Chaturthi": "சதுர்த்தி", "Panchami": "பஞ்சமி",
    "Shashthi": "சஷ்டி", "Saptami": "சப்தமி", "Ashtami": "அஷ்டமி", "Navami": "நவமி", "Dashami": "தசமி",
    "Ekadashi": "ஏகாதசி", "Dwadashi": "துவாதசி", "Trayodashi": "திரயோதசி", "Chaturdashi": "சதுர்தசி",
    "Purnima": "பௌர்ணமி", "Amavasya": "அமாவாசை"
  } as Record<string, string>,
  nakshatra: {
    "Ashwini": "அஸ்வினி", "Bharani": "பரணி", "Krittika": "கார்த்திகை", "Rohini": "ரோகிணி", "Mrigashira": "மிருகசீரிடம்",
    "Ardra": "திருவாதிரை", "Punarvasu": "புனர்பூசம்", "Pushya": "பூசம்", "Ashlesha": "ஆயில்யம்", "Magha": "மகம்",
    "Purva Phalguni": "பூரம்", "Uttara Phalguni": "உத்திரம்", "Hasta": "அஸ்தம்", "Chitra": "சித்திரை", "Swati": "சுவாதி",
    "Vishakha": "விசாகம்", "Anuradha": "அனுஷம்", "Jyeshtha": "கேட்டை", "Mula": "மூலம்", "Purva Ashadha": "பூராடம்",
    "Uttara Ashadha": "உத்திராடம்", "Shravana": "திருவோணம்", "Dhanishta": "அவிட்டம்", "Shatabhisha": "சதயம்",
    "Purva Bhadrapada": "பூரட்டாதி", "Uttara Bhadrapada": "உத்திரட்டாதி", "Revati": "ரேவதி"
  } as Record<string, string>,
  yogam: {
    "Vishkambha": "விஷ்கம்பம்", "Preeti": "பிரீதி", "Ayushman": "ஆயுஷ்மான்", "Saubhagya": "சௌபாக்கியம்", "Shobhana": "சோபனம்",
    "Atiganda": "அதிகண்டம்", "Sukarma": "சுகர்மம்", "Dhriti": "திருதி", "Shoola": "சூலம்", "Ganda": "கண்டம்",
    "Vriddhi": "விருத்தி", "Dhruva": "துருவம்", "Vyaghata": "வியாகாதம்", "Harshana": "ஹர்ஷணம்", "Vajra": "வஜிரம்",
    "Siddhi": "சித்தி", "Vyatipata": "வியாதிபாதம்", "Variyana": "வரியான்", "Parigha": "பரிகம்", "Shiva": "சிவம்",
    "Siddha": "சித்தம்", "Sadhya": "சாத்தியம்", "Shubha": "சுபம்", "Shukla": "சுக்கிலம்", "Brahma": "பிரம்மம்",
    "Indra": "ஐந்திரம்", "Vaidhriti": "வைதிருதி"
  } as Record<string, string>,
  karanam: {
    "Bava": "பவம்", "Balava": "பாலவம்", "Kaulava": "கௌலவம்", "Taitila": "தைதிலை", "Garaja": "கரசை",
    "Vanija": "வணிசை", "Vishti": "விஷ்டி", "Shakuni": "சகுனி", "Chatushpada": "சதுஷ்பாதம்", "Naga": "நாகவம்",
    "Kimstughna": "கிம்ஸ்துக்கினம்"
  } as Record<string, string>,
  paksha: {
    "Shukla": "வளர்பிறை · Shukla",
    "Krishna": "தேய்பிறை · Krishna"
  } as Record<string, string>
};

export function TodayHero() {
  const { language } = useLanguage()
  const t = translations[language]
  
  const { data: birthProfile, isLoading: isProfileLoading } = useBirthProfile()
  
  const [coords, setCoords] = useState({ lat: 13.0827, lng: 80.2707 })
  const [profileName, setProfileName] = useState<string | null>(null)

  useEffect(() => {
    if (isProfileLoading) return

    if (birthProfile) {
      setCoords({ lat: Number(birthProfile.lat), lng: Number(birthProfile.lng) })
      setProfileName(birthProfile.place_name)
    } else {
      // Fallback to browser location
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          setProfileName(language === 'ta' ? 'உள்ளூர்' : 'Local')
        },
        () => {
          setCoords({ lat: 13.0827, lng: 80.2707 })
          setProfileName(language === 'ta' ? 'சென்னை' : 'Chennai')
        }
      )
    }
  }, [birthProfile, isProfileLoading, language])

  const today = new Date()
  const dateStr = today.toISOString().split('T')[0]
  
  const { data, isLoading } = useSWR(
    `/api/calc/panchangam?date=${dateStr}&lat=${coords.lat}&lng=${coords.lng}`,
    async (url) => {
      const baseUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}${url}`)
      if (!res.ok) throw new Error('API failed')
      return res.json()
    }
  )

  const weekday = today.getDay() // Sun=0, Sat=6
  const normalizedDay = weekday === 0 ? 6 : weekday - 1 // Mon=0, Sun=6
  const lucky = WEEKDAY_DETAILS[normalizedDay] || WEEKDAY_DETAILS[0]

  const dateTaStr = today.toLocaleDateString('ta-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const dateEnStr = today.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

  if (isLoading || !data) {
    return (
      <div
        className="relative overflow-hidden rounded-[var(--radius-lg)] border p-4 animate-pulse flex flex-col gap-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--bg-border)',
        }}
      >
        <div className="h-6 w-1/3 bg-white/10 rounded" />
        <div className="h-14 w-full bg-white/10 rounded-[10px]" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 bg-white/10 rounded" />
          <div className="h-12 bg-white/10 rounded" />
          <div className="h-12 bg-white/10 rounded" />
        </div>
        <div className="h-8 w-full bg-white/10 rounded" />
      </div>
    )
  }

  // Translate variables
  const pakshaName = TAMIL_MAPS.paksha[data.paksha] || data.paksha
  const tithiRaw = data.tithi?.name || ''
  const tithiName = language === 'ta' ? (TAMIL_MAPS.tithi[tithiRaw] || tithiRaw) : tithiRaw
  
  const starRaw = data.nakshatra?.name || ''
  const starName = language === 'ta' ? (TAMIL_MAPS.nakshatra[starRaw] || starRaw) : starRaw
  const pada = data.nakshatra?.pada || 1

  const yogamRaw = data.yogam?.name || ''
  const yogamName = language === 'ta' ? (TAMIL_MAPS.yogam[yogamRaw] || yogamRaw) : yogamRaw

  const karanamRaw = data.karanam?.name || ''
  const karanamName = language === 'ta' ? (TAMIL_MAPS.karanam[karanamRaw] || karanamRaw) : karanamRaw

  const isAuspicious = true // default high quality astrological signifier

  return (
    <motion.div
      className="relative overflow-hidden rounded-[var(--radius-lg)] border p-3 sm:p-4"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24, delay: 0.05 }}
      style={{
        background: 'linear-gradient(135deg, var(--gold-tint), var(--gold-subtle))',
        backgroundColor: 'var(--bg-card)',
        backdropFilter: 'blur(20px)',
        borderColor: 'var(--bg-border)',
      }}
    >
      {/* Ambient glow top-right — floating */}
      <motion.div
        className="absolute top-0 right-0 pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '160px',
          height: '160px',
          background: 'radial-gradient(circle at top right, rgba(123,94,167,0.22), transparent 70%)',
        }}
      />

      {/* Date & Location Header */}
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div>
          <span className="text-[11px] font-semibold tracking-wider" style={{ color: 'var(--text-muted)' }}>
            {language === 'ta' ? dateTaStr : dateEnStr}
          </span>
          <p className="text-[10px] text-gold-bright mt-0.5 font-medium">
            📍 {profileName} ({coords.lat.toFixed(2)}°, {coords.lng.toFixed(2)}°)
          </p>
        </div>
        <div className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-text-muted">
          {pakshaName}
        </div>
      </div>

      {/* Panchangam data grid — Tithi is hero */}
      <div className="relative z-10 mb-3">
        {/* Tithi hero row */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="rounded-[10px] px-[12px] py-[8px] mb-[6px] flex items-center justify-between"
          style={{
            background: 'rgba(201,146,42,0.10)',
            border: '1px solid rgba(201,146,42,0.25)',
          }}
        >
          <div>
            <p className="text-[10px] mb-[2px]" style={{ color: 'var(--text-muted)' }}>{t.tithi}</p>
            <p className="text-[18px] font-bold" style={{ color: 'var(--gold-bright)' }}>
              {tithiName}
            </p>
          </div>
          {isAuspicious && (
            <div
              className="flex items-center gap-[5px] px-[8px] py-[3px] rounded-full text-[10px] font-medium"
              style={{
                background: 'rgba(46,125,107,0.15)',
                border: '1px solid rgba(46,125,107,0.3)',
                color: '#5dcaa5',
              }}
            >
              <span className="w-[5px] h-[5px] rounded-full" style={{ background: '#5dcaa5' }} />
              {t.auspiciousDay}
            </div>
          )}
        </motion.div>

        {/* Secondary 3-col grid — staggered */}
        <div className="grid grid-cols-3 gap-[5px]">
          {[
            { key: t.nakshatra, val: `${starName} (${pada})` },
            { key: t.yogam,      val: yogamName },
            { key: t.karanam,    val: karanamName },
          ].map(({ key, val }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.06, type: 'spring', stiffness: 300 }}
              className="rounded-[8px] px-[10px] py-[7px]"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--bg-border)',
              }}
            >
              <p className="text-[9px] sm:text-[10px] mb-[2px]" style={{ color: 'var(--text-muted)' }}>{key}</p>
              <p className="text-[12px] sm:text-[13px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{val}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lucky strip — slides up */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 280 }}
        className="flex items-center gap-[6px] rounded-[8px] px-[10px] py-[7px] mb-3 relative z-10"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--bg-border)',
        }}
      >
        <span className="text-[9px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-muted)' }}>
          {t.today}
        </span>
        <div className="flex items-center gap-[5px] flex-1 flex-wrap">
          {/* Lucky color */}
          <div
            className="flex items-center gap-[5px] px-[8px] py-[3px] rounded-full text-[10px]"
            style={{
              background: `${lucky.color}18`,
              border: `1px solid ${lucky.color}40`,
              color: lucky.color === '#e2e8f0' ? 'var(--text-primary)' : lucky.color,
            }}
          >
            <span
              className="w-[8px] h-[8px] rounded-full flex-shrink-0"
              style={{ background: lucky.color }}
            />
            {language === 'ta' ? lucky.colorTa : lucky.colorEn}
          </div>
          {/* Lucky number */}
          <div
            className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full text-[10px]"
            style={{
              background: 'rgba(201,146,42,0.12)',
              border: '1px solid rgba(201,146,42,0.3)',
              color: 'var(--gold-bright)',
            }}
          >
            #{lucky.number}
          </div>
          {/* Lucky direction */}
          <div
            className="flex items-center gap-[4px] px-[8px] py-[3px] rounded-full text-[10px]"
            style={{
              background: 'rgba(30,111,168,0.12)',
              border: '1px solid rgba(30,111,168,0.3)',
              color: '#60b4f0',
            }}
          >
            {language === 'ta' ? lucky.directionTa : lucky.directionEn}
          </div>
        </div>
      </motion.div>

      {/* Rahu kalam + full link */}
      <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
        <div
          className="flex items-center gap-[5px] px-[8px] py-[3px] rounded-[6px] text-[10px]"
          style={{
            background: 'rgba(224,80,80,0.10)',
            border: '1px solid rgba(224,80,80,0.22)',
            color: '#e08080',
          }}
        >
          <span className="w-[4px] h-[4px] rounded-full flex-shrink-0" style={{ background: '#e05050' }} />
          {t.rahuKalam}: {data.rahu_kalam?.start} – {data.rahu_kalam?.end}
        </div>
      </div>
    </motion.div>
  )
}
