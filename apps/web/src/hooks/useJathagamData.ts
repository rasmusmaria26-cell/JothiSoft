'use client'
import { useState } from 'react'
import api from '@/lib/api'
import type { HoroscopeResponse } from '@/types/astro'
import type { JathagamProfile, AstrologerDetails, JathagamPDFData, PathaRow, LuckyDetails, BirthPanchangamData, NakshatraMeta } from '@/types/jathagam'
import { normalizeSign, NAKSHATRA_MAP_TA } from '@/components/astro/jathagam2/shared/jathagam2.constants'

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

      // Calculate dynamic Patha Saram
      const getPlanetPada = (planetKey: string) => {
        let pData = horoscope.planets?.find((p: any) => p.planet.toLowerCase() === planetKey.toLowerCase())
        if (!pData && planetKey === 'Maanthi') {
          pData = horoscope.planets?.find((p: any) => p.planet.toLowerCase() === 'mandhi' || p.planet.toLowerCase() === 'gulika')
        }
        return pData?.pada ?? null
      }

      const getPlanetNakshatra = (planetKey: string) => {
        let pData = horoscope.planets?.find((p: any) => p.planet.toLowerCase() === planetKey.toLowerCase())
        if (!pData && planetKey === 'Maanthi') {
          pData = horoscope.planets?.find((p: any) => p.planet.toLowerCase() === 'mandhi' || p.planet.toLowerCase() === 'gulika')
        }
        return pData?.nakshatra ?? null
      }

      const lagnaNakName = horoscope.lagna?.nakshatra ?? ''
      const lagnaLong = horoscope.lagna?.longitude ?? 0
      const lagnaPada = Math.floor((lagnaLong % 13.333333) / 3.333333) + 1

      const pathaSaramPlanets = [
        { key: 'Lagna', name_ta: 'லக்கினம்', karagar_ta: 'உயிர்' },
        { key: 'Sun', name_ta: 'சூரியன்', karagar_ta: 'பிதுர்' },
        { key: 'Moon', name_ta: 'சந்திரன்', karagar_ta: 'மாதுர்' },
        { key: 'Mars', name_ta: 'செவ்வாய்', karagar_ta: 'சகோதரர்' },
        { key: 'Mercury', name_ta: 'புதன்', karagar_ta: 'மாமன்' },
        { key: 'Jupiter', name_ta: 'குரு', karagar_ta: 'புத்திரர்' },
        { key: 'Venus', name_ta: 'சுக்கிரன்', karagar_ta: 'களத்திரர்' },
        { key: 'Saturn', name_ta: 'சனி', karagar_ta: 'ஆயுள்' },
        { key: 'Rahu', name_ta: 'ராகு', karagar_ta: '(ஞானம்)' },
        { key: 'Ketu', name_ta: 'கேது', karagar_ta: 'வித்தை' },
        { key: 'Maanthi', name_ta: 'மாந்தி', karagar_ta: 'திரவியம்' }
      ]

      const pathaSaram: PathaRow[] = pathaSaramPlanets.map((p, idx) => {
        let nakshatra_ta = '—'
        let padam = '—'

        if (p.key === 'Lagna') {
          const lagnaNakTamil = NAKSHATRA_MAP_TA[lagnaNakName] || lagnaNakName || '—'
          nakshatra_ta = lagnaNakName ? `${lagnaNakTamil} - ${lagnaPada}` : '—'
          padam = '-'
        } else {
          const nakName = getPlanetNakshatra(p.key)
          const nakTamil = nakName ? (NAKSHATRA_MAP_TA[nakName] || nakName) : '—'
          nakshatra_ta = nakTamil
          
          const pPada = getPlanetPada(p.key)
          padam = pPada !== null && pPada !== undefined ? String(pPada) : '—'
        }

        return {
          no: idx + 1,
          nakshatra_ta,
          padam,
          karagam_ta: p.karagar_ta,
          kiragam_ta: p.name_ta
        }
      })
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
