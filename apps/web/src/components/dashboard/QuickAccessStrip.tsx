'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useLanguage } from '@/context/LanguageContext'
import { translations } from '@/i18n/translations'
import api from '@/lib/api'

interface TodayPanchang {
  date: string;
  tithi: {
    index: number;
    name_en: string;
    name_ta: string;
    paksha: string;
    paksha_ta: string;
  };
  nakshatra: {
    index: number;
    name_en: string;
    name_ta: string;
  };
  special_day: {
    id: string;
    name_en: string;
    name_ta: string;
    color_accent?: string;
    icon?: string;
  } | null;
}

const QUICK_LINKS = [
  { labelTa: 'விரதங்கள்',       labelEn: 'Fasts',          href: '/special',            colorHex: '#4a7c59' },
  { labelTa: 'பஞ்சாங்கம்',      labelEn: 'Panchangam',     href: '/panchangam',         colorHex: '#2e7d6b' },
  { labelTa: 'KP ஜோதிடம்',     labelEn: 'KP Astro',       href: '/horoscope/antharam', colorHex: '#7b5ea7' },
  { labelTa: 'வாஸ்து',          labelEn: 'Vastu',          href: '/vastu/days',         colorHex: '#1e6fa8' },
  { labelTa: 'பொருத்தம்',       labelEn: 'Matching',       href: '/matching/star',      colorHex: '#b0415e' },
  { labelTa: 'நட்சத்திர பலன்', labelEn: 'Star Reading',   href: '/horoscope/star',     colorHex: '#7b5ea7' },
  { labelTa: 'பிரஸ்னம்',        labelEn: 'Prasnam',        href: '/prasnam',            colorHex: '#a05c1a' },
  { labelTa: 'குழந்தை பெயர்',  labelEn: 'Baby Names',     href: '/baby-names',         colorHex: '#c9922a' },
]

const chipItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300 } },
}

export function QuickAccessStrip() {
  const { language } = useLanguage()
  const t = translations[language]

  const [todayData, setTodayData] = useState<{
    tithiTa: string;
    tithiEn: string;
    href: string;
    color: string;
    icon?: string;
  }>({
    tithiTa: 'பஞ்சமி',
    tithiEn: 'Panchami',
    href: '/panchangam',
    color: '#c9922a'
  });

  useEffect(() => {
    let active = true;
    const fetchTodayPanchang = async () => {
      try {
        const res = await api.get('/special-days/today');
        if (res.success && res.data && active) {
          const data = res.data as TodayPanchang;
          const isSpecial = !!data.special_day;
          
          let href = '/panchangam';
          let color = '#c9922a';
          let tithiTa = data.tithi.name_ta;
          let tithiEn = data.tithi.name_en;
          let icon = '';

          if (isSpecial && data.special_day) {
            const sp = data.special_day;
            const apiToRoute: Record<string, string> = {
              amavasai: 'amavasai',
              tharpanam: 'tharpanam',
              pournami: 'pournami',
              sashti: 'sashti',
              kantha_vrat: 'kantha',
              krithigai: 'krithigai',
              uthiram: 'uthiram',
              tamil_new_year: 'newyear',
              pradosham: 'pradosham',
              jwalini: 'jwalini'
            };
            href = `/special/${apiToRoute[sp.id] || sp.id}`;
            color = sp.color_accent || '#a05c1a';
            tithiTa = sp.name_ta;
            tithiEn = sp.name_en;
            icon = sp.icon || '🦚';
          }

          setTodayData({
            tithiTa,
            tithiEn,
            href,
            color,
            icon
          });
        }
      } catch (err) {
        console.error('Failed to fetch today\'s panchangam/special days:', err);
      }
    };

    fetchTodayPanchang();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      className="rounded-[var(--radius-md)] py-[10px] relative overflow-hidden"
      style={{
        background: 'rgba(15, 15, 36, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(42, 42, 74, 0.6)',
      }}
    >
      {/* Left/Right Fade Masks for the Marquee */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0f0f24] to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0f0f24] to-transparent pointer-events-none z-10" />

      {/* Standard non-motion div for the CSS marquee scrolling animation to prevent conflicts with Framer Motion transforms */}
      <div className="flex gap-[10px] w-max animate-marquee pl-[10px]">
        {/* We duplicate the links 4 times to create a seamless infinite scrolling loop without gaps */}
        {[...Array(4)].map((_, arrayIndex) => (
          <React.Fragment key={`marquee-set-${arrayIndex}`}>
            {/* TODAY context chip */}
            <motion.div 
              variants={chipItem} 
              whileHover={{ scale: 1.06, y: -1 }} 
              whileTap={{ scale: 0.94 }} 
              className="relative group"
            >
              {/* Hover Glow */}
              <div 
                className="absolute inset-0 z-0 blur-[12px] opacity-0 transition-opacity duration-300 group-hover:opacity-50 pointer-events-none rounded-full" 
                style={{ background: todayData.color }} 
              />
              
              <Link
                href={todayData.href}
                className="relative z-10 text-xs px-[14px] py-[7px] sm:py-[6px] rounded-full whitespace-nowrap flex-shrink-0 flex items-center gap-[6px] transition-colors duration-150"
                style={{
                  background: `${todayData.color}22`,
                  border: `1px solid ${todayData.color}60`,
                  color: todayData.color,
                  animation: 'todayPulse 2.5s ease-in-out infinite',
                }}
              >
                <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: todayData.color }} />
                {t.today}: {language === 'ta' ? todayData.tithiTa : todayData.tithiEn} {todayData.icon}
              </Link>
            </motion.div>

            {/* Static links */}
            {QUICK_LINKS.map((link) => (
              <motion.div 
                key={link.href + arrayIndex} 
                variants={chipItem} 
                whileHover={{ scale: 1.06, y: -1 }} 
                whileTap={{ scale: 0.94 }} 
                className="relative group"
              >
                {/* Hover Glow */}
                <div 
                  className="absolute inset-0 z-0 blur-[12px] opacity-0 transition-opacity duration-300 group-hover:opacity-50 pointer-events-none rounded-full" 
                  style={{ background: link.colorHex }} 
                />

                <Link
                  href={link.href}
                  className="relative z-10 text-xs px-[14px] py-[7px] sm:py-[6px] rounded-full whitespace-nowrap flex-shrink-0 transition-colors duration-150"
                  style={{
                    background: `${link.colorHex}14`,
                    border: `1px solid ${link.colorHex}30`,
                    color: link.colorHex,
                  }}
                >
                  {language === 'ta' ? link.labelTa : link.labelEn}
                </Link>
              </motion.div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
