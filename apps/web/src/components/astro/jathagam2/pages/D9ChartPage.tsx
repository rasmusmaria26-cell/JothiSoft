import React from 'react'
import type { JathagamProfile } from '@/types/jathagam'
import type { HoroscopeResponse } from '@/types/astro'
import { RasiChart } from '@/components/astro/RasiChart'

interface D9ChartPageProps {
  horoscope: HoroscopeResponse
  profile: JathagamProfile
  language: 'ta' | 'en'
}

export function D9ChartPage({ horoscope, profile, language }: D9ChartPageProps) {
  const isTa = language === 'ta'
  const lagnaSign = horoscope.lagna.navamsa_sign || horoscope.lagna.sign

  return (
    <div className="page-print-container jathagam-2-wrapper flex-1 flex flex-col justify-between">
      <div className="inner-border flex flex-col justify-between py-8 px-6">
        
        {/* Header Invocation */}
        <div className="text-center text-[var(--sripathi-static-framework)] font-bold text-sm mb-4">
          ஒம் ஸ்ரீ நவக்கிரஹ சகாயம்
        </div>

        {/* Client Metadata Info */}
        <div className="space-y-3 text-sm text-[var(--sripathi-narrative-text)] border-b border-[var(--sripathi-dynamic-data)]/20 pb-4 mb-4">
          <div className="flex items-end">
            <span className="text-[var(--sripathi-static-framework)] font-bold whitespace-nowrap">
              {isTa ? 'திரு / திருமதி' : 'Mr. / Mrs.'} :
            </span>
            <span className="border-b border-dotted border-gray-400 flex-1 ml-3 text-[var(--sripathi-dynamic-data)] font-bold pl-2 pb-0.5">
              {profile.name}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center text-[var(--sripathi-static-framework)] font-extrabold text-lg tracking-wider mb-2">
          {isTa ? 'அம்சம் சக்கரம் (D9)' : 'Navamsa Chart (D9)'}
        </div>

        {/* Chart Component Area */}
        <div className="flex-1 flex flex-col justify-center items-center my-auto p-4 border border-[var(--sripathi-dynamic-data)]/10 rounded-2xl bg-[#fffdfb]">
          <RasiChart
            chart={horoscope.navamsam_chart}
            planets={horoscope.planets}
            title={isTa ? 'நவாம்ச சக்கரம்' : 'Navamsa Chart'}
            lagnaSign={lagnaSign}
            isPrint={true}
            language={language}
            titleClassName="text-sm font-extrabold text-[var(--sripathi-static-framework)] mb-4 tracking-widest"
          />
        </div>

        {/* Note */}
        <div className="text-center text-[var(--sripathi-static-framework)] font-medium text-[11px] mt-4 opacity-75 italic">
          {isTa ? 'குறிப்பு: நவாம்ச கட்ட கிரகங்கள்' : 'Note: Placements of Navamsa Planets'}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-[var(--sripathi-static-framework)] font-bold tracking-wider opacity-60 mt-2">
          பக்கம் 5
        </div>

      </div>
    </div>
  )
}
