import React from 'react'
import type { HoroscopeResponse } from '@/types/astro'
import { PLANET_MAP_TA, PLANET_MAP_EN } from '../shared/jathagam2.constants'

interface DasaTimelinePageProps {
  horoscope: HoroscopeResponse
  language: 'ta' | 'en'
}

const VIMSHOTTARI_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury']
const MAHADASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17
}

export function DasaTimelinePage({ horoscope, language }: DasaTimelinePageProps) {
  const isTa = language === 'ta'
  const P_MAP = isTa ? PLANET_MAP_TA : PLANET_MAP_EN

  const timeline = (horoscope as any).dasha_timeline || []
  const currentDasha = horoscope.current_dasha

  // Find current bhukti from timeline
  let currentBhuktiItem = timeline.find((item: any) => 
    item.dasha_lord === currentDasha?.mahadasha && 
    item.bhukti_lord === currentDasha?.antardasha
  )

  // Fallback to first timeline item if current not found
  if (!currentBhuktiItem && timeline.length > 0) {
    currentBhuktiItem = timeline[0]
  }

  // Generate Antharams dynamically
  const antharams: Array<{ lord: string; start: string; end: string }> = []

  if (currentBhuktiItem) {
    const parseDate = (dStr: string) => {
      // Expecting DD-MM-YYYY
      const parts = dStr.split('-')
      if (parts.length === 3) {
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
      }
      return new Date(dStr)
    }

    const formatDate = (date: Date) => {
      const dd = String(date.getDate()).padStart(2, '0')
      const mm = String(date.getMonth() + 1).padStart(2, '0')
      const yyyy = date.getFullYear()
      return `${dd}-${mm}-${yyyy}`
    }

    const start = parseDate(currentBhuktiItem.start_date)
    const end = parseDate(currentBhuktiItem.end_date)
    const totalMs = end.getTime() - start.getTime()

    // Vimshottari order starting from the Bhukti Lord
    const startIndex = VIMSHOTTARI_ORDER.indexOf(currentBhuktiItem.bhukti_lord)
    const orderedPlanets: string[] = []
    for (let i = 0; i < 9; i++) {
      orderedPlanets.push(VIMSHOTTARI_ORDER[(startIndex + i) % 9])
    }

    let currentStartMs = start.getTime()
    orderedPlanets.forEach((planet) => {
      const share = MAHADASHA_YEARS[planet] / 120
      const durationMs = totalMs * share
      const currentEndMs = currentStartMs + durationMs

      antharams.push({
        lord: planet,
        start: formatDate(new Date(currentStartMs)),
        end: formatDate(new Date(currentEndMs))
      })

      currentStartMs = currentEndMs
    })
  }

  const dashaLordLabel = currentBhuktiItem ? (P_MAP[currentBhuktiItem.dasha_lord] || currentBhuktiItem.dasha_lord) : '—'
  const bhuktiLordLabel = currentBhuktiItem ? (P_MAP[currentBhuktiItem.bhukti_lord] || currentBhuktiItem.bhukti_lord) : '—'

  return (
    <div className="page-print-container jathagam-2-wrapper flex-1 flex flex-col justify-between">
      <div className="inner-border flex flex-col justify-between py-8 px-6">
        
        <div className="text-center text-[var(--sripathi-static-framework)] font-bold text-sm mb-4">
          ஒம் ஸ்ரீ நவக்கிரஹ சகாயம்
        </div>

        <div className="text-center text-[var(--sripathi-static-framework)] font-extrabold text-lg tracking-wider mb-4">
          {isTa ? 'நடப்பு தசா புக்தி அந்தரங்கள்' : 'Current Dasa Bhukti Antharams'}
        </div>

        <div className="flex-1 flex flex-col justify-between my-auto gap-6">
          <div className="border border-[var(--sripathi-dynamic-data)]/30 rounded-xl p-4 bg-[#fffdf6] text-xs space-y-2">
            <h4 className="text-[var(--sripathi-static-framework)] font-extrabold text-sm border-b border-[var(--sripathi-dynamic-data)]/20 pb-2">
              {isTa ? 'நடப்பு திசா / புக்தி' : 'Active Dasa & Bhukti'}
            </h4>
            <div className="flex justify-between font-bold">
              <span>{isTa ? 'திசாநாதன்' : 'Dasa Lord'}: <span className="text-[var(--sripathi-dynamic-data)]">{dashaLordLabel}</span></span>
              <span>{isTa ? 'புக்திநாதன்' : 'Bhukti Lord'}: <span className="text-[var(--sripathi-dynamic-data)]">{bhuktiLordLabel}</span></span>
            </div>
            {currentBhuktiItem && (
              <div className="text-[11px] text-[var(--sripathi-narrative-text)]">
                {isTa ? 'புக்தி காலம்' : 'Bhukti Duration'}: {currentBhuktiItem.start_date} {isTa ? 'முதல்' : 'to'} {currentBhuktiItem.end_date}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-[var(--sripathi-static-framework)] font-extrabold text-xs mb-3 uppercase tracking-wider">
              {isTa ? 'அந்தரநாதன் அட்டவணை' : 'Antharam Lord Schedule'}
            </h4>
            <table className="w-full border-collapse border border-[var(--sripathi-dynamic-data)]/30 text-xs">
              <thead>
                <tr className="bg-[var(--sripathi-static-framework)] text-white">
                  <th className="border border-[var(--sripathi-dynamic-data)]/30 p-2 text-left">{isTa ? 'அந்தரநாதன்' : 'Anthara Lord'}</th>
                  <th className="border border-[var(--sripathi-dynamic-data)]/30 p-2 text-center">{isTa ? 'ஆரம்பம்' : 'Start Date'}</th>
                  <th className="border border-[var(--sripathi-dynamic-data)]/30 p-2 text-center">{isTa ? 'முடிவு' : 'End Date'}</th>
                </tr>
              </thead>
              <tbody>
                {antharams.map((a, idx) => {
                  const lordName = P_MAP[a.lord] || a.lord
                  return (
                    <tr key={idx} className="text-[11px]">
                      <td className="border border-[var(--sripathi-dynamic-data)]/30 p-2 font-bold text-[var(--sripathi-static-framework)]">
                        {lordName} {isTa ? 'அந்தரம்' : 'Antharam'}
                      </td>
                      <td className="border border-[var(--sripathi-dynamic-data)]/30 p-2 text-center">{a.start}</td>
                      <td className="border border-[var(--sripathi-dynamic-data)]/30 p-2 text-center">{a.end}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-xs text-[var(--sripathi-static-framework)] font-bold tracking-wider opacity-60">
          பக்கம் 13
        </div>
      </div>
    </div>
  )
}
