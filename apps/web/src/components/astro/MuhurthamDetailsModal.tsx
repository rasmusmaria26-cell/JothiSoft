'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'
import { MuhurthamDay } from '@/types/muhurtham'

interface MuhurthamDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  day: MuhurthamDay | null
  language: 'ta' | 'en'
  categoryName: string
}

export function MuhurthamDetailsModal({ isOpen, onClose, day, language, categoryName }: MuhurthamDetailsModalProps) {
  if (!day) return null
  const isTa = language === 'ta'

  // Format date nicely
  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString(isTa ? 'ta-IN' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return isoStr
    }
  }

  // Get status color definitions
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'highly_auspicious':
        return {
          bg: 'bg-green-500/10 border-green-500/30 text-green-400',
          text: isTa ? 'மிகவும் சுபமான நாள்' : 'Highly Auspicious Day',
          ring: 'text-green-500',
        }
      case 'auspicious':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          text: isTa ? 'சுபமான நாள்' : 'Auspicious Day',
          ring: 'text-emerald-500',
        }
      case 'average':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          text: isTa ? 'சாதாரண நாள்' : 'Average / Neutral Day',
          ring: 'text-amber-500',
        }
      default:
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          text: isTa ? 'தவிர்க்கவும்' : 'Inauspicious / Avoid',
          ring: 'text-red-500',
        }
    }
  }

  const statusStyle = getStatusStyle(day.status)

  // Astro helpers
  const WEEKDAYS_TA = ['திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி', 'ஞாயிறு']
  const WEEKDAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const weekdayName = isTa ? WEEKDAYS_TA[day.weekday] : WEEKDAYS_EN[day.weekday]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#1a1209]/80 backdrop-blur-sm"
          />

          {/* Slider Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-lg h-full bg-[#241a0f] border-l border-[#4a3828] shadow-2xl overflow-hidden font-sans"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#4a3828] bg-[#2e2115]">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#f2c96a]" />
                <div>
                  <h3 className="text-lg font-bold text-[#f5e6c8] leading-tight">
                    {isTa ? 'சுப முகூர்த்த விவரங்கள்' : 'Muhurtham Detailed Analytics'}
                  </h3>
                  <p className="text-xs text-[#d4b896] mt-0.5">{formatDate(day.date)}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#8a7060] hover:text-[#f2c96a] hover:bg-[#3d2d1c] rounded-lg transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable contents */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
              {/* Event specific rating circle */}
              <div className="relative p-5 border border-[#4a3828] rounded-xl bg-[#2e2115] overflow-hidden">
                <div className="flex items-center gap-5">
                  {/* Score percentage circle */}
                  <div className="relative flex items-center justify-center w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="34"
                        className="stroke-[#3d2d1c]"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="40"
                        cy="40"
                        r="34"
                        className={statusStyle.ring}
                        strokeWidth="5"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 34}
                        initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                        animate={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - day.event_score / 100) }}
                        transition={{ duration: 1 }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-[#f5e6c8] font-mono">{day.event_score}%</span>
                      <span className="text-[9px] uppercase tracking-wider text-[#8a7060]">
                        {isTa ? 'பொருத்தம்' : 'Match'}
                      </span>
                    </div>
                  </div>

                  {/* Recommendation description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#f2c96a]">
                        {categoryName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-pill border ${statusStyle.bg}`}>
                        {statusStyle.text}
                      </span>
                    </div>
                    <p className="text-sm text-[#f5e6c8] font-medium leading-relaxed">
                      {isTa ? day.description_ta : day.description_en}
                    </p>
                  </div>
                </div>
              </div>

              {/* Core timing windows: Rahu Kalam, Yama Gandam, Kulikai */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#f2c96a] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#c9922a]" />
                  {isTa ? 'இன்றைய அசுப & சுப காலங்கள்' : 'Auspicious & Inauspicious Timings'}
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {/* Rahu Kalam */}
                  <div className="p-3 bg-[#241a0f] border border-[#4a3828] rounded-xl flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-red-400 mb-1.5">
                      {isTa ? 'ராகு காலம்' : 'Rahu Kalam'}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#f5e6c8] bg-red-950/40 border border-red-900/30 px-2 py-1 rounded">
                      {day.rahu_kalam.start} - {day.rahu_kalam.end}
                    </span>
                  </div>

                  {/* Yama Gandam */}
                  <div className="p-3 bg-[#241a0f] border border-[#4a3828] rounded-xl flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500 mb-1.5">
                      {isTa ? 'எமகண்டம்' : 'Yama Gandam'}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#f5e6c8] bg-amber-950/40 border border-amber-900/30 px-2 py-1 rounded">
                      {day.yama_gandam.start} - {day.yama_gandam.end}
                    </span>
                  </div>

                  {/* Kulikai */}
                  <div className="p-3 bg-[#241a0f] border border-[#4a3828] rounded-xl flex flex-col items-center text-center">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 mb-1.5">
                      {isTa ? 'குளிகை' : 'Kulikai'}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#f5e6c8] bg-emerald-950/40 border border-emerald-900/30 px-2 py-1 rounded">
                      {day.kulikai.start} - {day.kulikai.end}
                    </span>
                  </div>
                </div>
              </div>

              {/* Astrological suitability checklist */}
              <div className="p-5 bg-[#241a0f] border border-[#4a3828] rounded-xl">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#f2c96a] mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#f2c96a]" />
                  {isTa ? 'ஜோதிட பொருத்தம் சரிபார்ப்பு' : 'Astrological Criteria Checklist'}
                </h4>
                <div className="space-y-3.5">
                  {/* Weekday check */}
                  <div className="flex items-start justify-between border-b border-[#3d2d1c] pb-3 last:border-none last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-[#f5e6c8]">{isTa ? 'கிழமை' : 'Weekday (Vara)'}</p>
                      <p className="text-xs text-[#8a7060] mt-0.5">
                        {isTa ? `கிழமை: ${weekdayName}` : `Day: ${weekdayName}`}
                      </p>
                    </div>
                    {day.weekday === 1 && categoryName !== (isTa ? 'நிலம் / சொத்து' : 'Property / Land') ? (
                      <span className="text-xs font-bold text-red-400 bg-red-950/30 border border-red-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {isTa ? 'செவ்வாய்' : 'Tuesday'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isTa ? 'சுபம்' : 'Good'}
                      </span>
                    )}
                  </div>

                  {/* Tithi check */}
                  <div className="flex items-start justify-between border-b border-[#3d2d1c] pb-3 last:border-none last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-[#f5e6c8]">{isTa ? 'திதி' : 'Lunar Day (Tithi)'}</p>
                      <p className="text-xs text-[#8a7060] mt-0.5">
                        {isTa ? `திதி: ${day.tithi} (${day.paksha})` : `Tithi: ${day.tithi} (${day.paksha} Paksha)`}
                      </p>
                    </div>
                    {[4, 9, 14, 19, 24, 29].includes(day.tithi_index) ? (
                      <span className="text-xs font-bold text-red-400 bg-red-950/30 border border-red-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {isTa ? 'ரிக்தா திதி' : 'Rikta Tithi'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isTa ? 'நன்று' : 'Auspicious'}
                      </span>
                    )}
                  </div>

                  {/* Nakshatra check */}
                  <div className="flex items-start justify-between border-b border-[#3d2d1c] pb-3 last:border-none last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-[#f5e6c8]">{isTa ? 'நட்சத்திரம்' : 'Birth Star (Nakshatra)'}</p>
                      <p className="text-xs text-[#8a7060] mt-0.5">
                        {isTa ? `நட்சத்திரம்: ${day.nakshatra} (பாதம் ${day.nakshatra_pada})` : `Nakshatra: ${day.nakshatra} (Pada ${day.nakshatra_pada})`}
                      </p>
                    </div>
                    {[2, 6, 9, 18].includes(day.nakshatra_index) ? (
                      <span className="text-xs font-bold text-red-400 bg-red-950/30 border border-red-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {isTa ? 'தவிர்க்கவும்' : 'Avoid'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isTa ? 'சுபம்' : 'Good'}
                      </span>
                    )}
                  </div>

                  {/* Yogam check */}
                  <div className="flex items-start justify-between border-b border-[#3d2d1c] pb-3 last:border-none last:pb-0">
                    <div>
                      <p className="text-sm font-bold text-[#f5e6c8]">{isTa ? 'யோகம்' : 'Yogam'}</p>
                      <p className="text-xs text-[#8a7060] mt-0.5">
                        {isTa ? `யோகம்: ${day.yogam}` : `Yogam: ${day.yogam}`}
                      </p>
                    </div>
                    {["Atiganda", "Vyaghata", "Vyatipata", "Vaidhriti", "Ganda", "Shoola"].includes(day.yogam) ? (
                      <span className="text-xs font-bold text-red-400 bg-red-950/30 border border-red-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {isTa ? 'அசுபம்' : 'Inauspicious'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isTa ? 'சுப யோகம்' : 'Subha Yogam'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Gowri Panchangam Daytime Split Grid */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#f2c96a] flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#c9922a]" />
                  {isTa ? 'பகல் கௌரி பஞ்சாங்கம் (நல்ல நேரம்)' : 'Daytime Gowri Panchangam Slots'}
                </h4>
                <div className="border border-[#4a3828] rounded-xl overflow-hidden divide-y divide-[#4a3828]">
                  {day.gowri_slots.map((slot, index) => {
                    const isGood = slot.status === 'excellent' || slot.status === 'good'
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3.5 text-xs transition-all ${
                          isGood ? 'bg-[#2e2115]/20' : 'bg-transparent'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#f5e6c8] text-sm">
                            {isTa ? slot.name_ta.split(' ')[0] : slot.name_en.split(' ')[0]}
                          </span>
                          <span className="text-[11px] text-[#8a7060] font-mono mt-0.5">
                            {slot.start} - {slot.end}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-pill border ${
                            slot.status === 'excellent'
                              ? 'bg-green-950/30 border-green-900/40 text-green-400'
                              : slot.status === 'good'
                              ? 'bg-emerald-950/30 border-emerald-900/40 text-emerald-400'
                              : 'bg-red-950/30 border-red-900/40 text-red-400'
                          }`}
                        >
                          {slot.status === 'excellent'
                            ? (isTa ? 'மிகவும் நன்று' : 'Excellent')
                            : slot.status === 'good'
                            ? (isTa ? 'நன்று' : 'Auspicious')
                            : (isTa ? 'தவிர்க்கவும்' : 'Avoid')}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
