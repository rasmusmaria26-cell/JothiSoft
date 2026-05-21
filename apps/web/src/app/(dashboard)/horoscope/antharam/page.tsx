'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Compass, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useLanguage } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { DashaResponse } from '@/types/astro'
import { NoBirthProfile } from '@/components/astro/NoBirthProfile'
import { DashaTimelineExplorer } from '@/components/astro/DashaTimelineExplorer'
import api from '@/lib/api'

export default function AntharamExplorerPage() {
  const { user } = useAuthStore()
  const { language } = useLanguage()

  const [loadingProfile, setLoadingProfile] = useState(true)
  const [calculatingDasha, setCalculatingDasha] = useState(false)
  const [profileExists, setProfileExists] = useState(false)
  const [birthDate, setBirthDate] = useState('')
  const [dasaData, setDasaData] = useState<DashaResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const t = {
    ta: {
      title: 'ஹோரோஸ்கோப் 4.0 அந்தரம்',
      subtitle: 'அதிநவீன 3-ஆம் நிலை தசா புக்தி அந்தரம் ஆய்வாளர் மற்றும் வருங்கால விதி மைல்கல் கணக்கீட்டாளர்.',
      back: 'ஜாதக கணிப்பிற்குச் செல்',
      loadingProfile: 'சேமிக்கப்பட்ட விவரங்கள் ஏற்றப்படுகின்றன...',
      calculating: 'அதிநுண்ணிய தசா அந்தரங்கள் கணக்கிடப்படுகின்றன...',
      error: 'கணக்கீடுகளைப் பெறுவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
    },
    en: {
      title: 'Horoscope 4.0 Antharam',
      subtitle: 'Advanced 3rd-level Vimshottari Antharam explorer and high-precision destiny milestone calculator.',
      back: 'Back to Horoscope',
      loadingProfile: 'Loading birth profile...',
      calculating: 'Calculating precise dasha timeline...',
      error: 'Error calculating dasha timeline. Please try again.',
    }
  }[language]

  useEffect(() => {
    async function loadProfileAndCalculate() {
      if (!user) {
        setLoadingProfile(false)
        return
      }

      try {
        setLoadingProfile(true)
        setError(null)

        // 1. Fetch user's birth profile from Supabase
        const { data: profile, error: dbError } = await supabase
          .from('birth_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (dbError || !profile) {
          setProfileExists(false)
          setLoadingProfile(false)
          return
        }

        setProfileExists(true)
        setBirthDate(profile.dob)
        setLoadingProfile(false)
        setCalculatingDasha(true)

// ... in loadProfileAndCalculate
        const payload = {
          date: profile.dob,
          time: profile.tob,
          lat: Number(profile.lat),
          lng: Number(profile.lng),
          utcOffset: 5.5,
          language: language || 'ta'
        }

        const horoRes = await api.post('/horoscope/calculate', payload)
        
        if (!horoRes.success || !horoRes.data) {
          throw new Error('Horoscope calculation failed')
        }

        const horoData = horoRes.data
        const moonPlanet = horoData.planets.find((p: any) => p.planet.toLowerCase() === 'moon' || p.planet === 'சந்திரன்')
        let finalDasaData = null

        if (moonPlanet) {
          const moonSignIndex = [
            'Mesha', 'Vrishabha', 'Mithuna', 'Kataka',
            'Simha', 'Kanya', 'Thula', 'Vrischika',
            'Dhanus', 'Makara', 'Kumbha', 'Meena'
          ].indexOf(moonPlanet.sign)
          
          if (moonSignIndex !== -1) {
            const moonLongitude = (moonSignIndex * 30) + moonPlanet.sign_degree
            
            const dasaRes = await api.post('/horoscope/dasha', {
              birth_date: profile.dob,
              moon_longitude: moonLongitude
            })
            
            if (dasaRes.success) {
              finalDasaData = dasaRes.data
            } else if (dasaRes && dasaRes.major_dashas) {
              finalDasaData = dasaRes
            }
          }
        }

        if (!finalDasaData) {
          throw new Error('Dasha calculation failed')
        }

        setDasaData(finalDasaData)

      } catch (err) {
        console.error(err)
        setError(t.error)
      } finally {
        setLoadingProfile(false)
        setCalculatingDasha(false)
      }
    }

    loadProfileAndCalculate()
  }, [user, t.error])

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative">
      {/* Top Navigation */}
      <div className="flex flex-col gap-2">
        <Link 
          href="/horoscope" 
          className="inline-flex items-center gap-2 text-text-muted hover:text-gold-bright transition-colors mb-2 text-sm font-medium"
        >
          <ArrowLeft size={16} />
          {t.back}
        </Link>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gold-bright tracking-tight flex items-center gap-3">
          <Compass size={28} className="text-gold-bright" />
          {t.title}
        </h1>
        
        <p className="text-text-secondary text-sm md:text-base max-w-2xl">
          {t.subtitle}
        </p>
      </div>

      {/* Main loading or component container */}
      <div className="mt-2 w-full">
        {loadingProfile && (
          <div className="flex flex-col items-center justify-center p-20 gap-3 text-text-muted">
            <Loader2 className="h-10 w-10 animate-spin text-gold-bright" />
            <p className="text-sm font-medium animate-pulse">{t.loadingProfile}</p>
          </div>
        )}

        {!loadingProfile && calculatingDasha && (
          <div className="flex flex-col items-center justify-center p-20 gap-3 text-text-muted">
            <Loader2 className="h-10 w-10 animate-spin text-gold-bright" />
            <p className="text-sm font-medium animate-pulse">{t.calculating}</p>
          </div>
        )}

        {!loadingProfile && !calculatingDasha && error && (
          <div 
            className="p-5 rounded-2xl border text-center text-red-400 max-w-md mx-auto"
            style={{ background: '#2e2115', borderColor: '#ef4444' }}
          >
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {!loadingProfile && !calculatingDasha && !error && !profileExists && (
          <NoBirthProfile />
        )}

        {!loadingProfile && !calculatingDasha && !error && profileExists && dasaData && (
          <DashaTimelineExplorer dasaData={dasaData} birthDateStr={birthDate} />
        )}
      </div>
    </div>
  )
}
