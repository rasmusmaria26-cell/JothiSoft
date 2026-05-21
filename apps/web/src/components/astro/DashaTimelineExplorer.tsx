'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Compass, Sparkles, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { DashaResponse, DashaPeriod } from '@/types/astro'
import { DashaSelector } from './DashaSelector'
import { BhuktiTimeline } from './BhuktiTimeline'
import { AntharamGrid } from './AntharamGrid'
import { DestinyCalculator } from './DestinyCalculator'

interface DashaTimelineExplorerProps {
  dasaData: DashaResponse
  birthDateStr: string
}

export function DashaTimelineExplorer({ dasaData, birthDateStr }: DashaTimelineExplorerProps) {
  const { language } = useLanguage()

  // Extract current lords from active response
  const activeMahaLord = dasaData.current.dasha || ''
  const activeBhuktiLord = dasaData.current.bhukti || ''
  const activeAntharaLord = dasaData.current.anthara || ''

  // Selected states for exploration
  const [selectedMahaLord, setSelectedMahaLord] = useState(activeMahaLord)
  const [selectedBhuktiLord, setSelectedBhuktiLord] = useState(activeBhuktiLord)

  // Find the selected Mahadasha object
  const selectedMaha = dasaData.timeline.find(
    m => m.dasha_lord.toLowerCase() === selectedMahaLord.toLowerCase()
  )

  const bhuktis: DashaPeriod[] = (selectedMaha?.bhuktis || selectedMaha?.antaradasha || []) as DashaPeriod[]

  // Ensure selectedBhuktiLord is updated when Mahadasha selection changes
  useEffect(() => {
    if (selectedMahaLord.toLowerCase() === activeMahaLord.toLowerCase()) {
      setSelectedBhuktiLord(activeBhuktiLord)
    } else if (bhuktis.length > 0) {
      setSelectedBhuktiLord(bhuktis[0].dasha_lord)
    }
  }, [selectedMahaLord, activeMahaLord, activeBhuktiLord, bhuktis])

  // Find the selected Bhukti object
  const selectedBhukti = bhuktis.find(
    (b: DashaPeriod) => b.dasha_lord.toLowerCase() === selectedBhuktiLord.toLowerCase()
  )

  const antharams: DashaPeriod[] = (selectedBhukti?.antharams || selectedBhukti?.antharas || []) as DashaPeriod[]

  const isCurrentDasha = selectedMahaLord.toLowerCase() === activeMahaLord.toLowerCase()
  const isCurrentBhukti = isCurrentDasha && selectedBhuktiLord.toLowerCase() === activeBhuktiLord.toLowerCase()

  const t = {
    ta: {
      activeBanner: 'தற்போது உங்களுக்கு நடக்கும் தசா புக்தி அந்தரம்',
      explorerTitle: 'விம்சோத்தரி காலவரிசை ஆய்வாளர்',
      explorerDesc: 'ஒவ்வொரு தசா புக்திக்குள்ளும் இருக்கும் 3-ஆம் நிலை அதிநுண்ணிய "அந்தரம்" காலங்களைக் கண்டறியுங்கள்.',
      activeLabel: 'தற்போது செயலில்:',
      noAntharams: 'இந்த புக்திக்கு அந்தரங்கள் கிடைக்கவில்லை.',
    },
    en: {
      activeBanner: 'Your Current Active Vimshottari Period',
      explorerTitle: 'Vimshottari Timeline Explorer',
      explorerDesc: 'Deep dive into 3rd-level precise "Antharam" periods nested inside each Mahadasha & Bhukti.',
      activeLabel: 'Currently Active:',
      noAntharams: 'No Antharam periods available for this Bhukti.',
    }
  }[language]

  return (
    <div className="w-full flex flex-col gap-6 md:gap-8">
      {/* Premium Active Period Banner */}
      <div 
        className="p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden"
        style={{
          background: '#2e2115',
          borderColor: '#c9922a',
          boxShadow: '0 0 25px rgba(201, 146, 42, 0.12)'
        }}
      >
        <div className="absolute right-0 top-0 opacity-10 text-gold-bright pointer-events-none transform translate-x-4 -translate-y-4">
          <Compass size={140} />
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-full bg-gold-mid/10 border border-gold-mid/30 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-gold-bright animate-spin-slow" />
          </div>
          
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">
              {t.activeBanner}
            </span>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mt-1 font-black text-sm sm:text-base">
              <span className="text-gold-bright">{activeMahaLord}</span>
              <span className="text-text-muted text-xs font-normal">/</span>
              <span className="text-text-primary">{activeBhuktiLord}</span>
              <span className="text-text-muted text-xs font-normal">/</span>
              <span className="text-gold-mid font-medium">{activeAntharaLord}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-end text-center sm:text-right z-10 bg-black/20 p-3 rounded-xl border border-white/5">
          <span className="text-[10px] text-text-muted">{language === 'ta' ? 'முடிவுறும் தேதி:' : 'Ends on:'}</span>
          <span className="text-xs sm:text-sm font-bold text-text-primary font-mono mt-0.5">
            {new Date(dasaData.current.ends_at).toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Selector & Explorer Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-6"
      >
        <DashaSelector
          timeline={dasaData.timeline}
          activeLord={activeMahaLord}
          selectedLord={selectedMahaLord}
          onSelectLord={setSelectedMahaLord}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bhukti selection timeline (LHS) */}
          <div className="lg:col-span-1">
            <BhuktiTimeline
              bhuktis={bhuktis}
              activeBhuktiLord={activeBhuktiLord}
              isCurrentDasha={isCurrentDasha}
              selectedBhuktiLord={selectedBhuktiLord}
              onSelectBhukti={setSelectedBhuktiLord}
            />
          </div>

          {/* Antharam grid details (RHS) */}
          <div className="lg:col-span-2">
            {antharams.length > 0 ? (
              <AntharamGrid
                antharams={antharams}
                activeAntharaLord={activeAntharaLord}
                isCurrentBhukti={isCurrentBhukti}
                bhuktiLord={selectedBhuktiLord}
              />
            ) : (
              <div className="p-8 border border-dashed border-bg-border rounded-2xl flex flex-col items-center justify-center text-center bg-black/10">
                <AlertCircle className="h-8 w-8 text-text-muted mb-2" />
                <p className="text-xs text-text-muted">{t.noAntharams}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Destiny Date Calculator */}
      <DestinyCalculator
        timeline={dasaData.timeline}
        birthDateStr={birthDateStr}
      />
    </div>
  )
}
