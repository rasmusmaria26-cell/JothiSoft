'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Ruler, ArrowLeft, CheckCircle2, XCircle, Sparkles, AlertTriangle, RefreshCw, Info } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import api from '@/lib/api'

interface ManaiyadiResult {
  remainder: number
  quality: string
  label_en: string
  label_ta: string
  auspicious: boolean
}

const QUALITY_DETAILS: Record<string, { descEn: string; descTa: string; color: string; glow: string; bg: string }> = {
  Dhana:   { descEn: 'Wealth & Prosperity — excellent for the main structure.',   descTa: 'தனம் மற்றும் செழிப்பு — கட்டுமானத்திற்கு சிறந்தது.',   color: '#f4c532', glow: 'rgba(244, 197, 50, 0.25)', bg: 'rgba(244, 197, 50, 0.10)' },
  Dhanya:  { descEn: 'Abundance of Food — auspicious for household prosperity.',  descTa: 'தான்ய வளம் — குடும்ப செழிப்பிற்கு சுபம்.',                color: '#4ade80', glow: 'rgba(74, 222, 128, 0.25)', bg: 'rgba(74, 222, 128, 0.10)' },
  Jaya:    { descEn: 'Victory & Success — brings triumph to the inhabitants.',    descTa: 'ஜெயம் — குடியிருப்போருக்கு வெற்றி தரும்.',              color: '#60a5fa', glow: 'rgba(96, 165, 250, 0.25)', bg: 'rgba(96, 165, 250, 0.10)' },
  Nasha:   { descEn: 'Destruction — avoid this dimension for main structures.',   descTa: 'நாசம் — கட்டுமானத்திற்கு உகந்ததல்ல.',                   color: '#f87171', glow: 'rgba(248, 113, 113, 0.25)', bg: 'rgba(248, 113, 113, 0.10)' },
  Shubha:  { descEn: 'Auspicious — highly favorable for all construction.',       descTa: 'சுபம் — அனைத்து கட்டுமானங்களுக்கும் சிறந்தது.',         color: '#2aac8a', glow: 'rgba(42, 172, 138, 0.25)', bg: 'rgba(42, 172, 138, 0.10)' },
  Papa:    { descEn: 'Inauspicious — bring negative energy to the inhabitants.',  descTa: 'பாபம் — குடியிருப்போருக்கு தீய பலன் தரும்.',            color: '#f97316', glow: 'rgba(249, 115, 22, 0.25)',  bg: 'rgba(249, 115, 22, 0.10)'  },
  Mrutyu:  { descEn: 'Death — strongly inauspicious, must be avoided.',          descTa: 'மிருத்யு — மிகவும் அசுபம், தவிர்க்கவும்.',              color: '#e11d48', glow: 'rgba(225, 29, 72, 0.25)',  bg: 'rgba(225, 29, 72, 0.10)'   },
  Agni:    { descEn: 'Fire & Loss — risk of accidents and financial loss.',        descTa: 'அக்னி — விபத்து மற்றும் நஷ்டம் ஏற்படலாம்.',            color: '#fb923c', glow: 'rgba(251, 146, 60, 0.25)', bg: 'rgba(251, 146, 60, 0.10)'  },
}

const REMAINDER_ORDER = ['Dhana', 'Dhanya', 'Jaya', 'Nasha', 'Shubha', 'Papa', 'Mrutyu', 'Agni']

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
}

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
}

export default function ManaiyadiPage() {
  const { language } = useLanguage()

  const [feet, setFeet] = useState('')
  const [inches, setInches] = useState('')
  const [result, setResult] = useState<ManaiyadiResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dimension, setDimension] = useState<'length' | 'width'>('length')

  const labels = {
    ta: {
      title: 'மனையடி சாஸ்திரம்',
      subtitle: 'உங்கள் வீட்டின் அளவீடுகளை 8-அங்குல மனையடி சாஸ்திர சக்கரத்தின் படி சரிபார்க்கவும்.',
      dimension: 'அளவீடு வகை',
      length: 'நீளம்',
      width: 'அகலம்',
      feet: 'அடி (Feet)',
      inches: 'இஞ்சி (Inches)',
      check: 'கணக்கிடவும்',
      checking: 'கணக்கிடப்படுகிறது...',
      reset: 'மீண்டும் கணக்கிட',
      resultTitle: 'மனையடி பலன்',
      angulam: 'அங்குலம்',
      remainder: 'மீதம்',
      howTitle: '8-அங்குல சக்கரம் என்றால் என்ன?',
      howDesc: 'மனையடி சாஸ்திரத்தில், ஒரு அடி = 12 அங்குலம் என கணக்கிடப்படுகிறது. மொத்த அளவீடை 8 ஆல் வகுத்து வரும் மீதம் சுப அல்லது அசுப பலனை நிர்ணயிக்கிறது.',
      missingFields: 'தயவுசெய்து அடி மற்றும் இஞ்சி மதிப்புகளை நிரப்பவும்.',
      error: 'கணக்கிடுவதில் பிழை. மீண்டும் முயற்சிக்கவும்.',
      auspicious: 'சுபம்',
      inauspicious: 'அசுபம்',
    },
    en: {
      title: 'Manaiyadi Shastram',
      subtitle: 'Verify your house dimensions against the classical 8-angulam cycle of Manaiyadi Shastram.',
      dimension: 'Dimension',
      length: 'Length',
      width: 'Width',
      feet: 'Feet',
      inches: 'Inches',
      check: 'Check Dimension',
      checking: 'Checking...',
      reset: 'Check Another',
      resultTitle: 'Manaiyadi Result',
      angulam: 'Angulams',
      remainder: 'Remainder',
      howTitle: 'What is the 8-Angulam Cycle?',
      howDesc: 'In Manaiyadi Shastram, 1 foot = 12 angulams. The total measurement is divided by 8, and the remainder determines whether the dimension is auspicious or inauspicious.',
      missingFields: 'Please enter both feet and inches values.',
      error: 'Error checking dimensions. Please try again.',
      auspicious: 'Auspicious',
      inauspicious: 'Inauspicious',
    }
  }[language]

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    const feetNum = parseFloat(feet)
    const inchesNum = parseFloat(inches)

    if (isNaN(feetNum) || isNaN(inchesNum)) {
      setError(labels.missingFields)
      return
    }

    setError(null)
    setIsLoading(true)
    setResult(null)

    try {
      const data = await api.post<{ success: boolean; data: ManaiyadiResult }>('/vastu/manaiyadi', {
        feet: feetNum,
        inches: inchesNum
      })
      setResult(data.data)
    } catch (err: any) {
      setError(labels.error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setFeet('')
    setInches('')
    setError(null)
  }

  const totalAngulams = !isNaN(parseFloat(feet)) && !isNaN(parseFloat(inches))
    ? (parseFloat(feet) * 12) + parseFloat(inches)
    : null

  const qualityDetail = result ? QUALITY_DETAILS[result.quality] : null

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={itemVariant} className="flex flex-col gap-1">
        <Link
          href="/vastu"
          className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-gold-bright transition-colors w-fit mb-2"
        >
          <ArrowLeft size={14} />
          {language === 'ta' ? 'வாஸ்து' : 'Vastu'}
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: 'rgba(42, 172, 138, 0.15)', border: '1px solid rgba(42, 172, 138, 0.3)' }}
          >
            <Ruler size={22} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-text-primary">{labels.title}</h1>
            <p className="text-[13px] text-text-muted mt-0.5 max-w-xl">{labels.subtitle}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Calculator */}
        <motion.div variants={itemVariant}>
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-5 p-6 rounded-2xl"
                style={{ background: '#2e2115', border: '1px solid rgba(42, 172, 138, 0.35)' }}
              >
                {/* Dimension Type Toggle */}
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] font-semibold text-text-muted uppercase tracking-wider">
                    {labels.dimension}
                  </label>
                  <div className="flex gap-2">
                    {(['length', 'width'] as const).map(d => (
                      <button
                        key={d}
                        onClick={() => setDimension(d)}
                        className="flex-1 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
                        style={
                          dimension === d
                            ? { background: 'rgba(42, 172, 138, 0.2)', color: '#2aac8a', border: '1px solid rgba(42, 172, 138, 0.4)' }
                            : { background: 'rgba(255,255,255,0.04)', color: '#666', border: '1px solid rgba(255,255,255,0.08)' }
                        }
                      >
                        {d === 'length' ? labels.length : labels.width}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleCheck} className="flex flex-col gap-4">
                  {/* Feet & Inches */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-text-muted">{labels.feet} *</label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 30"
                        value={feet}
                        onChange={e => setFeet(e.target.value)}
                        className="bg-bg-page border border-bg-border rounded-lg px-3 py-2.5 text-[14px] text-text-primary focus:outline-none focus:border-emerald-600 transition-colors"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-text-muted">{labels.inches} *</label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        step="1"
                        placeholder="e.g. 6"
                        value={inches}
                        onChange={e => setInches(e.target.value)}
                        className="bg-bg-page border border-bg-border rounded-lg px-3 py-2.5 text-[14px] text-text-primary focus:outline-none focus:border-emerald-600 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  {/* Live Angulam Preview */}
                  {totalAngulams !== null && (
                    <div
                      className="px-4 py-3 rounded-xl text-[13px]"
                      style={{ background: 'rgba(42, 172, 138, 0.08)', border: '1px solid rgba(42, 172, 138, 0.2)' }}
                    >
                      <span className="text-text-muted">{labels.angulam}: </span>
                      <span className="font-bold text-emerald-300">
                        {totalAngulams} angulams
                      </span>
                      <span className="text-text-muted mx-2">·</span>
                      <span className="text-text-muted">{labels.remainder}: </span>
                      <span className="font-bold text-gold-bright">
                        {totalAngulams % 8} → {REMAINDER_ORDER[totalAngulams % 8]}
                      </span>
                    </div>
                  )}

                  {error && (
                    <div
                      className="flex items-center gap-2 p-3 rounded-lg text-[13px] text-red-300"
                      style={{ background: 'rgba(255, 50, 50, 0.08)', border: '1px solid rgba(255, 50, 50, 0.2)' }}
                    >
                      <AlertTriangle size={14} />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    style={{ background: 'rgba(42, 172, 138, 0.85)', color: '#fff' }}
                  >
                    {isLoading ? (
                      <><RefreshCw size={18} className="animate-spin" /> {labels.checking}</>
                    ) : (
                      <><Ruler size={18} /> {labels.check}</>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="flex flex-col gap-5 p-6 rounded-2xl"
                style={{
                  background: '#2e2115',
                  border: `1px solid ${qualityDetail?.color}40`,
                  boxShadow: `0 0 40px ${qualityDetail?.glow}`
                }}
              >
                {/* Result Badge */}
                <div className="flex flex-col items-center gap-4 py-4">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: qualityDetail?.bg, border: `2px solid ${qualityDetail?.color}60` }}
                  >
                    {result.auspicious ? (
                      <CheckCircle2 size={40} style={{ color: qualityDetail?.color }} />
                    ) : (
                      <XCircle size={40} style={{ color: qualityDetail?.color }} />
                    )}
                  </div>

                  <div className="text-center">
                    <div
                      className="text-[28px] font-black mb-1"
                      style={{ color: qualityDetail?.color }}
                    >
                      {language === 'ta' ? result.label_ta : result.label_en}
                    </div>
                    <div
                      className="px-4 py-1 rounded-full text-[12px] font-bold inline-block"
                      style={{
                        background: qualityDetail?.bg,
                        color: qualityDetail?.color,
                        border: `1px solid ${qualityDetail?.color}40`
                      }}
                    >
                      {result.auspicious ? (
                        <><Sparkles size={11} className="inline mr-1" />{labels.auspicious}</>
                      ) : (
                        <>{labels.inauspicious}</>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: labels.feet, value: `${feet} ft` },
                    { label: labels.inches, value: `${inches} in` },
                    { label: labels.remainder, value: result.remainder },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <span className="text-[11px] text-text-muted">{stat.label}</span>
                      <span className="text-[18px] font-black text-text-primary">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {qualityDetail && (
                  <div
                    className="p-3 rounded-xl text-[13px] leading-relaxed"
                    style={{ background: qualityDetail.bg, border: `1px solid ${qualityDetail.color}30` }}
                  >
                    <span style={{ color: qualityDetail.color }}>
                      {language === 'ta' ? qualityDetail.descTa : qualityDetail.descEn}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="w-full py-2.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                  style={{ background: 'rgba(255,255,255,0.06)', color: '#aaa', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <RefreshCw size={15} />
                  {labels.reset}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right: Reference Chart */}
        <motion.div variants={itemVariant} className="flex flex-col gap-4">
          {/* Info card */}
          <div
            className="p-4 rounded-xl text-[13px] leading-relaxed flex items-start gap-3"
            style={{ background: 'rgba(201, 146, 42, 0.07)', border: '1px solid rgba(201, 146, 42, 0.2)' }}
          >
            <Info size={16} className="text-gold-deep mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-gold-mid mb-1">{labels.howTitle}</p>
              <p className="text-text-secondary">{labels.howDesc}</p>
            </div>
          </div>

          {/* 8-Remainder Cycle Table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div
              className="px-4 py-3"
              style={{ background: 'rgba(201, 146, 42, 0.1)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-[13px] font-bold text-gold-bright">
                {language === 'ta' ? '8-அங்குல சக்கர அட்டவணை' : '8-Angulam Cycle Reference Chart'}
              </p>
            </div>
            <div className="flex flex-col">
              {REMAINDER_ORDER.map((quality, rem) => {
                const detail = QUALITY_DETAILS[quality]
                const isAuspicious = ['Dhana', 'Dhanya', 'Jaya', 'Shubha'].includes(quality)
                return (
                  <div
                    key={rem}
                    className="flex items-center justify-between px-4 py-3"
                    style={{
                      background: result?.quality === quality ? detail.bg : (rem % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'),
                      borderBottom: rem < 7 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      borderLeft: result?.quality === quality ? `3px solid ${detail.color}` : '3px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black"
                        style={{ background: detail.bg, color: detail.color, border: `1px solid ${detail.color}40` }}
                      >
                        {rem}
                      </span>
                      <div>
                        <p className="text-[13px] font-bold" style={{ color: detail.color }}>{quality}</p>
                        <p className="text-[11px] text-text-muted">
                          {language === 'ta' ? detail.descTa.split('—')[0] : detail.descEn.split('—')[0]}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        background: isAuspicious ? 'rgba(42, 172, 138, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                        color: isAuspicious ? '#2aac8a' : '#f87171'
                      }}
                    >
                      {isAuspicious
                        ? (language === 'ta' ? 'சுபம்' : 'Auspicious')
                        : (language === 'ta' ? 'அசுபம்' : 'Inauspicious')
                      }
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
