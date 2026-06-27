'use client'
import { useState } from 'react'
import api from '@/lib/api'
import type { HoroscopeResponse } from '@/types/astro'
import type { JathagamProfile, AstrologerDetails, JathagamPDFData, PathaRow, LuckyDetails, BirthPanchangamData, NakshatraMeta } from '@/types/jathagam'
import { normalizeSign } from '@/components/astro/jathagam2/shared/jathagam2.constants'

export function useJathagamData() {
  const [assembling, setAssembling]       = useState(false)
  const [assemblyError, setAssemblyError] = useState<string | null>(null)

  const assembleData = async (
    profile: JathagamProfile,
    astrologer: AstrologerDetails,
    language: 'ta' | 'en'
  ): Promise<JathagamPDFData> => {
    setAssembling(true)
    setAssemblyError(null)

    try {
      // Fire both API calls + all static JSON in parallel
      const [
        horoRes,
        panchangamRes,
        pathaSaramRaw,
        lagnapalanRaw,
        nakshatrapalanRaw,
        luckyRaw,
        nakshatraMetaRaw,
      ] = await Promise.all([
        api.post<{ success: boolean; data: HoroscopeResponse }>('/horoscope/calculate', {
          date: profile.dob, time: profile.tob,
          lat: profile.lat, lng: profile.lng,
          utcOffset: profile.utcOffset, language,
        }),
        api.post<{ success: boolean; data: BirthPanchangamData }>('/panchangam/daily', {
          date: profile.dob,
          lat: profile.lat, lng: profile.lng,
          utcOffset: profile.utcOffset, language: 'ta',
        }).catch(() => ({ success: false, data: {} as BirthPanchangamData })),
        fetch('/data/path-saram.json').then(r => r.json()),
        fetch('/data/lagna-palan.json').then(r => r.json()),
        fetch('/data/nakshatra-palan.json').then(r => r.json()),
        fetch('/data/lucky-details.json').then(r => r.json()),
        fetch('/data/nakshatra-meta.json').then(r => r.json()),
      ])

      if (!horoRes.success || !horoRes.data) throw new Error('Horoscope calculation failed')

      const horoscope   = horoRes.data
      const moonPlanet  = horoscope.planets.find(p => p.planet === 'Moon')
      const moonNakshatra = moonPlanet?.nakshatra ?? 'Ashwini'
      const lagnaSign   = normalizeSign(horoscope.lagna.sign ?? 'Mesha')

      const pathaSaram: PathaRow[]    = pathaSaramRaw[moonNakshatra] ?? []
      const lagnaEntry                = lagnapalanRaw[lagnaSign]
      // PDF body text is always Tamil — 'ta' key — regardless of UI language
      const lagnapalanText: string    = lagnaEntry?.ta ?? 'விரைவில் பலன்கள் இணைக்கப்படும்.'
      const nakshEntry                = nakshatrapalanRaw[moonNakshatra]
      const nakshatrapalanText: string = nakshEntry?.ta ?? 'விரைவில் பலன்கள் இணைக்கப்படும்.'
      const luckyDetails: LuckyDetails = luckyRaw[lagnaSign] ?? { day_ta:'—', color_ta:'—', stone_ta:'—', deity_ta:'—', number:0 }
      const nakshatraMeta: NakshatraMeta = nakshatraMetaRaw[moonNakshatra] ?? {
        mirugam_ta:'—', pakshi_ta:'—', maram_ta:'—', ganam_ta:'—',
        rajju_ta:'—', nadi_ta:'—', udumaga_param_nazhikai:60, udumaga_param_vinadi:0,
        padam_nazhikai:15, padam_vinadi:0,
        padupakshi_uyir_ta:'—', padupakshi_valar_ta:'—', padupakshi_thei_ta:'—'
      }

      const birthPanchangam: BirthPanchangamData = panchangamRes.data ?? {}

      setAssembling(false)
      return {
        profile, astrologer, horoscope, language,
        pathaSaram, lagnapalanText, nakshatrapalanText,
        luckyDetails, nakshatraMeta, birthPanchangam,
      }
    } catch (err: any) {
      const msg = 'ஜாதகம் தரவு ஏற்றுவதில் பிழை · ' + (err.message ?? 'Error')
      setAssemblyError(msg)
      setAssembling(false)
      throw new Error(msg)
    }
  }

  return { assembleData, assembling, assemblyError }
}
