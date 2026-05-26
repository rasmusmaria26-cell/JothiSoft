'use client'

import React from 'react'
import Link from 'next/link'
import { Calendar, UserPlus, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function NoBirthProfile() {
  const { language } = useLanguage()

  const t = {
    ta: {
      title: 'பிறப்பு ஜாதகம் தேவை',
      subtitle: 'ஹோரோஸ்கோப் 4.0 விம்சோத்தரி அந்தரம் கணிப்புகளைக் காண உங்கள் பிறந்த விவரங்கள் மற்றும் இருப்பிடக் குறியீடுகள் தேவை.',
      description: 'முதலில் உங்கள் பிறப்பு விவரங்களை உள்ளிட்டு ஜாதகத்தை உருவாக்குங்கள். அது தானாகவே உங்கள் சுயவிவரத்தில் சேமிக்கப்படும்.',
      cta: 'பிறப்பு விவரங்களை உள்ளிடுக',
    },
    en: {
      title: 'Birth Profile Required',
      subtitle: 'To view your highly precise Horoscope 4.0 Vimshottari Antharam timeline, your birth coordinates are required.',
      description: 'Please generate your horoscope first with your precise birth details. It will be automatically saved to your profile.',
      cta: 'Enter Birth Details',
    }
  }[language]

  return (
    <div 
      className="max-w-xl mx-auto my-12 p-8 rounded-2xl border text-center transition-all duration-300"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--bg-border)',
        boxShadow: '0 0 25px rgba(201, 146, 42, 0.12)'
      }}
    >
      <div className="mx-auto w-16 h-16 rounded-full bg-gold-mid/10 border border-gold-mid/30 flex items-center justify-center mb-6">
        <Calendar className="h-8 w-8 text-gold-bright animate-pulse" />
      </div>

      <h2 className="text-2xl font-bold text-gold-bright tracking-tight mb-3">
        {t.title}
      </h2>
      
      <p className="text-text-secondary text-sm leading-relaxed mb-4">
        {t.subtitle}
      </p>

      <p className="text-text-muted text-xs leading-relaxed mb-8 max-w-sm mx-auto">
        {t.description}
      </p>

      <Link
        href="/horoscope"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-bright to-gold-deep text-black font-bold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-gold-mid/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        <UserPlus size={18} />
        <span>{t.cta}</span>
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}
