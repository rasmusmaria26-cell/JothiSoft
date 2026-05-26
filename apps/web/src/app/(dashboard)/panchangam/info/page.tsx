'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Info, HelpCircle, Compass, AlignCenter, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import {
  VARA_DATA,
  TITHI_DATA,
  NAKSHATRA_SUMMARY,
  YOGAM_DATA,
  KARANAM_DATA,
  VaraInfo,
  TithiInfo,
  NakshatraSummary,
  YogamInfo,
  KaranamInfo
} from '@/content/panchangam-info'

type AngamType = 'vara' | 'tithi' | 'nakshatra' | 'yogam' | 'karanam'

export default function PanchangamInfoPage() {
  const { language } = useLanguage()
  const isTa = language === 'ta'

  // Persistent Tab State completely separate from language toggle (Rule 5)
  const [activeAngam, setActiveAngam] = useState<AngamType>('vara')

  // Font loading state / mock loader to prevent flash of unstyled text (Rule 6)
  const [isFontReady, setIsFontReady] = useState(false)

  useEffect(() => {
    // Simulate short font load check for Anek Tamil loading
    const timer = setTimeout(() => {
      setIsFontReady(true)
    }, 450)
    return () => clearTimeout(timer)
  }, [])

  // Translations
  const labels = {
    ta: {
      title: 'பஞ்சாங்கம் விளக்கம்',
      subtitle: 'பஞ்சாங்கத்தின் ஐந்து அங்கங்கள், அறிவியல் கணக்கீடுகள் மற்றும் அவற்றின் முக்கியத்துவம்.',
      scienceTitle: 'கணக்கீட்டின் பின்னால் உள்ள அறிவியல்',
      scienceDesc: 'பஞ்சாங்கத்தின் அனைத்து அங்கங்களும் சூரியன் மற்றும் சந்திரனின் துல்லியமான வானியல் பாகைகளை அடிப்படையாகக் கொண்டு கணக்கிடப்படுகின்றன.',
      limbVara: 'வாரம் (Weekday)',
      limbTithi: 'திதி (Lunar Day)',
      limbNakshatra: 'நட்சத்திரம் (Star)',
      limbYogam: 'யோகம் (Luni-Solar)',
      limbKaranam: 'கரணம் (Half-Tithi)',
      detailsTitle: 'விளக்கங்கள்',
      ruler: 'அதிபதி',
      element: 'பூதம்',
      advice: 'வாழ்க்கை வழிகாட்டி',
      meaning: 'பலன்கள் / முக்கியத்துவம்',
      formulaLabel: 'கணக்கீட்டு முறை',
      back: 'மீண்டும் செல்க'
    },
    en: {
      title: 'Panchangam Info',
      subtitle: 'Understand the five limbs of Panchangam, the science behind calculations, and their significance.',
      scienceTitle: 'The Science Behind Calculations',
      scienceDesc: 'All limbs of the Panchangam are mathematically derived from the precise astronomical longitudes of the Sun and the Moon.',
      limbVara: 'Vara (Weekday)',
      limbTithi: 'Tithi (Lunar Day)',
      limbNakshatra: 'Nakshatra (Star)',
      limbYogam: 'Yogam (Luni-Solar)',
      limbKaranam: 'Karanam (Half-Tithi)',
      detailsTitle: 'Detailed Meanings',
      ruler: 'Ruling Deity',
      element: 'Element',
      advice: 'Lifestyle Advice',
      meaning: 'Auspicious Meaning',
      formulaLabel: 'Calculation Formula',
      back: 'Go Back'
    }
  }[language]

  // Formula mappings for HTML display (Rule 2)
  const FORMULAS = {
    vara: {
      label: isTa ? 'வாரக் கணக்கீடு' : 'Weekday Calculation',
      formula: isTa
        ? 'ஞாயிறு முதல் சனி வரை உள்ள கிழமைகள், வாரத்தின் 7 கிரகங்களின் ஆதிக்கத்தை குறிக்கும்.'
        : 'Based on the terrestrial solar rotation day, ruled sequentially by the 7 major planets.'
    },
    tithi: {
      label: isTa ? 'திதிக் கணக்கீடு' : 'Tithi Calculation',
      formula: 'θ = ⌊ (λMoon − λSun) mod 360 ÷ 12 ⌋ + 1'
    },
    nakshatra: {
      label: isTa ? 'நட்சத்திரக் கணக்கீடு' : 'Nakshatra Calculation',
      formula: 'θ = ⌊ λMoon ÷ (13° 20\') ⌋ + 1'
    },
    yogam: {
      label: isTa ? 'யோகக் கணக்கீடு' : 'Yogam Calculation',
      formula: 'θ = ⌊ (λSun + λMoon) mod 360 ÷ (13° 20\') ⌋ + 1'
    },
    karanam: {
      label: isTa ? 'கரணக் கணக்கீடு' : 'Karanam Calculation',
      formula: 'θ = ⌊ (λMoon − λSun) mod 360 ÷ 6 ⌋'
    }
  }

  // Limb info configurations
  const LIMBS_INFO = [
    { type: 'vara', label: labels.limbVara, descTa: 'நாளின் ஆற்றல் மற்றும் ஆரோக்கியத்தை தீர்மானிக்கும்.', descEn: 'Determines daily energy and physical vitality.' },
    { type: 'tithi', label: labels.limbTithi, descTa: 'மனநிலை, உறவுகள் மற்றும் உணர்ச்சிகளை ஆளும்.', descEn: 'Governs emotional state and relationship harmony.' },
    { type: 'nakshatra', label: labels.limbNakshatra, descTa: 'பிறவி குணம், தனித்திறன் மற்றும் விதியை குறிக்கும்.', descEn: 'Represents native traits, personality, and life path.' },
    { type: 'yogam', label: labels.limbYogam, descTa: 'அதிர்ஷ்டம், குணநலன் மற்றும் யோகங்களை வெளிப்படுத்தும்.', descEn: 'Influences personal character, fortune, and overall luck.' },
    { type: 'karanam', label: labels.limbKaranam, descTa: 'செயல் திறன், தொழில் மற்றும் உழைப்பை உணர்த்தும்.', descEn: 'Represents action, work execution, and career efforts.' }
  ] as const

  return (
    <div 
      className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6"
      style={{
        fontFamily: isTa ? "'Anek Tamil', sans-serif" : 'inherit'
      }}
    >
      {/* Page Title Header */}
      <div className="mb-8">
        <h1 
          className="text-2xl sm:text-4xl font-bold tracking-tight text-[var(--gold-bright)] flex items-center gap-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-[var(--gold-mid)]" />
          {labels.title}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-2 max-w-3xl leading-relaxed">
          {labels.subtitle}
        </p>
      </div>

      {/* Five limbs selector grid (Rule 6 - Font loading / content skeletons) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <AnimatePresence mode="wait">
          {!isFontReady ? (
            // Show 5 grey skeleton loader cards (Rule 6)
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="w-full h-[140px] animate-pulse rounded-[14px]"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--bg-border)'
                  }}
                />
              ))}
            </>
          ) : (
            // Show the actual premium limbs grid cards (Rule 1 - Strict Design System cards)
            <>
              {LIMBS_INFO.map((limb) => {
                const isActive = activeAngam === limb.type
                return (
                  <motion.div
                    key={limb.type}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setActiveAngam(limb.type)}
                    className="cursor-pointer transition-all duration-200 border"
                    style={{
                      background: isActive ? 'var(--bg-active)' : 'var(--bg-card)', // Design system token rule
                      borderColor: 'var(--bg-border)',
                      borderRadius: '14px',
                      boxShadow: '0 0 24px rgba(201, 146, 42, 0.04)',
                      padding: '20px',
                      minHeight: '140px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transform: isActive ? 'scale(1.02)' : 'none'
                    }}
                  >
                    <div>
                      <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1.5 flex items-center justify-between">
                        {limb.label}
                        <ArrowRight size={14} className={isActive ? 'text-[var(--gold-mid)]' : 'text-[var(--text-muted)]'} />
                      </h3>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {isTa ? limb.descTa : limb.descEn}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold">
                        Limb {limb.type === 'vara' ? '1' : limb.type === 'tithi' ? '2' : limb.type === 'nakshatra' ? '3' : limb.type === 'yogam' ? '4' : '5'}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Tab content display - Details and Astronomy math */}
      {isFontReady && (
        <motion.div
          key={activeAngam}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column: Astronomy Scientific Formula (Rule 2 - HTML styled formulas) */}
          <div
            className="lg:col-span-1 border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--bg-border)',
              borderRadius: '14px',
              boxShadow: '0 0 24px rgba(201, 146, 42, 0.04)',
              padding: '20px'
            }}
          >
            <h2 className="text-sm font-bold text-[var(--gold-bright)] mb-4 flex items-center gap-2">
              <Compass size={16} />
              {labels.scienceTitle}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mb-6 leading-relaxed">
              {labels.scienceDesc}
            </p>

            {/* Formula Block display (Rule 2 style) */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider block">
                {labels.formulaLabel}
              </span>
              
              <div 
                className="formula-block"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '0.5px solid var(--bg-border)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontFamily: 'monospace',
                  color: 'var(--gold-bright)',
                  fontSize: '14px',
                  overflowX: 'auto'
                }}
              >
                <span 
                  className="formula-label font-bold block mb-1 text-[var(--text-muted)]"
                  style={{ fontSize: '12px' }}
                >
                  {activeAngam.toUpperCase()}
                </span>
                <span className="formula-text font-mono leading-relaxed block text-[var(--text-primary)]">
                  {FORMULAS[activeAngam].formula}
                </span>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                {FORMULAS[activeAngam].label}
              </p>
            </div>
          </div>

          {/* Right Column: Full limb details listing from static content library (Rule 4) */}
          <div
            className="lg:col-span-2 overflow-hidden border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--bg-border)',
              borderRadius: '14px',
              boxShadow: '0 0 24px rgba(201, 146, 42, 0.04)',
              padding: '20px'
            }}
          >
            <h2 className="text-sm font-bold text-[var(--gold-bright)] mb-4 flex items-center gap-2">
              <AlignCenter size={16} />
              {labels.detailsTitle} ({activeAngam.toUpperCase()})
            </h2>

            {/* Scrolling list for elements of the limb */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              
              {/* VARA (7 Days) */}
              {activeAngam === 'vara' && (
                <>
                  {Object.entries(VARA_DATA).map(([key, item]) => (
                    <div 
                      key={key} 
                      className="p-3.5 rounded-lg border transition-all"
                      style={{
                        background: 'var(--bg-elevated)',
                        borderColor: 'var(--bg-border)'
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {isTa ? item.nameTa : item.nameEn}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap text-[10px] sm:text-xs">
                          <span className="bg-[var(--bg-page)] text-[var(--gold-deep)] px-2 py-0.5 rounded border border-[var(--bg-border)] font-bold">
                            {labels.ruler}: {isTa ? item.rulerTa : item.ruler}
                          </span>
                          <span className="bg-[var(--bg-page)] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--bg-border)]">
                            {labels.element}: {isTa ? item.elementTa : item.element}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                        <strong className="text-[var(--gold-mid)] mr-1">{labels.advice}:</strong>
                        {isTa ? item.adviceTa : item.adviceEn}
                      </p>
                    </div>
                  ))}
                </>
              )}

              {/* TITHI (30 Tithis) */}
              {activeAngam === 'tithi' && (
                <>
                  {Object.entries(TITHI_DATA).map(([key, item]) => (
                    <div 
                      key={key} 
                      className="p-3.5 rounded-lg border transition-all"
                      style={{
                        background: 'var(--bg-elevated)',
                        borderColor: 'var(--bg-border)'
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {item.index}. {isTa ? item.nameTa : item.nameEn}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap text-[10px] sm:text-xs">
                          <span className="bg-[var(--bg-page)] text-[var(--gold-deep)] px-2 py-0.5 rounded border border-[var(--bg-border)] font-bold">
                            {labels.ruler}: {isTa ? item.rulerTa : item.ruler}
                          </span>
                          <span className="bg-[var(--bg-page)] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--bg-border)]">
                            {labels.element}: {isTa ? item.elementTa : item.element}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                        <strong className="text-[var(--gold-mid)] mr-1">{labels.meaning}:</strong>
                        {isTa ? item.meaningTa : item.meaningEn}
                      </p>
                    </div>
                  ))}
                </>
              )}

              {/* NAKSHATRA (27 Nakshatras summaries - 2 sentences) */}
              {activeAngam === 'nakshatra' && (
                <>
                  {Object.entries(NAKSHATRA_SUMMARY).map(([key, item]) => (
                    <div 
                      key={key} 
                      className="p-3.5 rounded-lg border transition-all"
                      style={{
                        background: 'var(--bg-elevated)',
                        borderColor: 'var(--bg-border)'
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {item.index}. {isTa ? item.nameTa : item.nameEn}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap text-[10px] sm:text-xs">
                          <span className="bg-[var(--bg-page)] text-[var(--gold-deep)] px-2 py-0.5 rounded border border-[var(--bg-border)] font-bold">
                            {labels.ruler}: {isTa ? item.rulerTa : item.ruler}
                          </span>
                          <span className="bg-[var(--bg-page)] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--bg-border)]">
                            {labels.element}: {isTa ? item.elementTa : item.element}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                        <strong className="text-[var(--gold-mid)] mr-1">{labels.meaning}:</strong>
                        {isTa ? item.summaryTa : item.summaryEn}
                      </p>
                    </div>
                  ))}
                </>
              )}

              {/* YOGAM (27 Yogas) */}
              {activeAngam === 'yogam' && (
                <>
                  {Object.entries(YOGAM_DATA).map(([key, item]) => (
                    <div 
                      key={key} 
                      className="p-3.5 rounded-lg border transition-all"
                      style={{
                        background: 'var(--bg-elevated)',
                        borderColor: 'var(--bg-border)'
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {item.index}. {isTa ? item.nameTa : item.nameEn}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap text-[10px] sm:text-xs">
                          <span className="bg-[var(--bg-page)] text-[var(--gold-deep)] px-2 py-0.5 rounded border border-[var(--bg-border)] font-bold">
                            {labels.ruler}: {isTa ? item.rulerTa : item.ruler}
                          </span>
                          <span className="bg-[var(--bg-page)] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--bg-border)]">
                            {labels.element}: {isTa ? item.elementTa : item.element}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                        <strong className="text-[var(--gold-mid)] mr-1">{labels.meaning}:</strong>
                        {isTa ? item.meaningTa : item.meaningEn}
                      </p>
                    </div>
                  ))}
                </>
              )}

              {/* KARANAM (11 Karanas) */}
              {activeAngam === 'karanam' && (
                <>
                  {Object.entries(KARANAM_DATA).map(([key, item]) => (
                    <div 
                      key={key} 
                      className="p-3.5 rounded-lg border transition-all"
                      style={{
                        background: 'var(--bg-elevated)',
                        borderColor: 'var(--bg-border)'
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                        <span className="text-sm font-bold text-[var(--text-primary)]">
                          {item.index}. {isTa ? item.nameTa : item.nameEn}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap text-[10px] sm:text-xs">
                          <span className="bg-[var(--bg-page)] text-[var(--gold-mid)] px-2 py-0.5 rounded border border-[var(--bg-border)] uppercase font-bold text-[9px]">
                            {item.type}
                          </span>
                          <span className="bg-[var(--bg-page)] text-[var(--gold-deep)] px-2 py-0.5 rounded border border-[var(--bg-border)] font-bold">
                            {labels.ruler}: {isTa ? item.rulerTa : item.ruler}
                          </span>
                          <span className="bg-[var(--bg-page)] text-[var(--text-secondary)] px-2 py-0.5 rounded border border-[var(--bg-border)]">
                            {labels.element}: {isTa ? item.elementTa : item.element}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
                        <strong className="text-[var(--gold-mid)] mr-1">{labels.meaning}:</strong>
                        {isTa ? item.meaningTa : item.meaningEn}
                      </p>
                    </div>
                  ))}
                </>
              )}

            </div>
          </div>
        </motion.div>
      )}

      {/* Styled custom CSS for custom-scrollbar and lists layout */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--bg-page);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--bg-border);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--gold-mid);
        }
      `}</style>
    </div>
  )
}
