'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Calendar, Star } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { DashaPeriod } from '@/types/astro'

interface DasaTableProps {
  timeline: DashaPeriod[]
  currentDasaLord?: string
  currentBhuktiLord?: string
}

const PLANET_MAP_TA: Record<string, string> = {
  'Sun': 'சூரியன்',
  'Moon': 'சந்திரன்',
  'Mars': 'செவ்வாய்',
  'Mercury': 'புதன்',
  'Jupiter': 'குரு',
  'Venus': 'சுக்கிரன்',
  'Saturn': 'சனி',
  'Rahu': 'ராகு',
  'Ketu': 'கேது'
}

export function DasaTable({ timeline, currentDasaLord, currentBhuktiLord }: DasaTableProps) {
  const { language } = useLanguage()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const getPlanetName = (lord: string): string => {
    if (language === 'ta') {
      return PLANET_MAP_TA[lord] || lord
    }
    return lord
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between border-b border-bg-border pb-2">
        <h3 className="text-sm font-semibold text-gold-bright uppercase tracking-wider">
          {language === 'ta' ? 'விம்சோத்தரி தசா புத்தி காலங்கள்' : 'Vimshottari Dasa Timeline'}
        </h3>
        {currentDasaLord && (
          <span className="text-[10px] sm:text-xs text-text-muted flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {language === 'ta' ? 'நடப்பு தசை:' : 'Active Dasa:'}{' '}
            <strong className="text-gold-bright">
              {getPlanetName(currentDasaLord)} - {currentBhuktiLord ? getPlanetName(currentBhuktiLord) : ''}
            </strong>
          </span>
        )}
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {timeline.map((dasa, index) => {
          const isActive = currentDasaLord?.toLowerCase() === dasa.dasha_lord.toLowerCase()
          const isExpanded = expandedIndex === index

          return (
            <div
              key={`${dasa.dasha_lord}-${index}`}
              className={`
                rounded-lg border transition-all duration-200 overflow-hidden
                ${isActive 
                  ? 'border-gold-mid bg-gold-deep/5 shadow-md shadow-gold-deep/5' 
                  : 'border-bg-border/60 bg-bg-card/45 hover:border-bg-border'
                }
              `}
            >
              {/* Header Card */}
              <button
                type="button"
                onClick={() => toggleExpand(index)}
                className="w-full flex items-center justify-between p-3.5 text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md ${isActive ? 'bg-gold-mid/20 text-gold-bright' : 'bg-white/5 text-text-muted'}`}>
                    <Star className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-text-primary flex items-center gap-2">
                      <span>{getPlanetName(dasa.dasha_lord)} {language === 'ta' ? 'தசை' : 'Dasa'}</span>
                      {isActive && (
                        <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {language === 'ta' ? 'நடப்பு' : 'Active'}
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-text-muted mt-0.5 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {formatDate(dasa.start_date)} - {formatDate(dasa.end_date)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {dasa.bhuktis && dasa.bhuktis.length > 0 && (
                    <span className="text-[10px] text-text-muted bg-white/5 px-2 py-0.5 rounded">
                      {dasa.bhuktis.length} {language === 'ta' ? 'புக்திகள்' : 'Bhuktis'}
                    </span>
                  )}
                  <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Collapsable Bhukti list */}
              <AnimatePresence initial={false}>
                {isExpanded && dasa.bhuktis && dasa.bhuktis.length > 0 && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-bg-border/60 bg-black/20"
                  >
                    <div className="p-3 pl-12 space-y-2">
                      <div className="grid grid-cols-2 text-[10px] text-text-muted font-semibold pb-1.5 border-b border-white/5">
                        <span>{language === 'ta' ? 'புக்தி நாதன்' : 'Bhukti Lord'}</span>
                        <span>{language === 'ta' ? 'காலகட்டம்' : 'Period'}</span>
                      </div>
                      {dasa.bhuktis.map((bhukti, bIndex) => {
                        const isBhuktiActive = isActive && currentBhuktiLord?.toLowerCase() === bhukti.dasha_lord.toLowerCase()

                        return (
                          <div
                            key={`${bhukti.dasha_lord}-${bIndex}`}
                            className={`
                              grid grid-cols-2 text-xs py-1.5 rounded transition-colors
                              ${isBhuktiActive 
                                ? 'text-gold-bright font-semibold bg-gold-mid/10 px-2 -mx-2' 
                                : 'text-text-secondary hover:text-text-primary'
                              }
                            `}
                          >
                            <span className="flex items-center gap-1.5">
                              {isBhuktiActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-gold-bright"></span>
                              )}
                              {getPlanetName(bhukti.dasha_lord)}
                            </span>
                            <span className="text-[11px] text-text-muted">
                              {formatDate(bhukti.start_date)} - {formatDate(bhukti.end_date)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
