import React from 'react'
import type { HoroscopeResponse } from '@/types/astro'
import { useLanguage } from '@/context/LanguageContext'
import { motion } from 'framer-motion'
import { Home, Compass, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react'
import vastuData from '../../../public/data/vastu-rasi.json'
import { SIGN_MAP_TA, SIGN_MAP_EN } from './jathagam2/shared/jathagam2.constants'

interface VastuTabProps {
  horoscope: HoroscopeResponse
}

interface VastuItem {
  sign: string
  sign_ta: string
  door_direction_en: string
  door_direction_ta: string
  kitchen_en: string
  kitchen_ta: string
  pooja_en: string
  pooja_ta: string
  bedroom_en: string
  bedroom_ta: string
  water_en: string
  water_ta: string
  avoid_en: string
  avoid_ta: string
  general_en: string
  general_ta: string
}

export function VastuTab({ horoscope }: VastuTabProps) {
  const { language } = useLanguage()
  const isTa = language === 'ta'

  const moonPlanet = horoscope.planets.find((p) => p.planet === 'Moon')
  const moonSign = moonPlanet?.sign ?? 'Aries'
  const lagnaSign = horoscope.lagna.sign

  const S_MAP = isTa ? SIGN_MAP_TA : SIGN_MAP_EN

  // Find Vastu data from json file
  const lagnaVastu = (vastuData.lagnam as VastuItem[]).find(
    (item) => item.sign.toLowerCase() === lagnaSign.toLowerCase()
  ) || vastuData.lagnam[0]

  const rasiVastu = (vastuData.lagnam as VastuItem[]).find(
    (item) => item.sign.toLowerCase() === moonSign.toLowerCase()
  ) || vastuData.lagnam[0]

  const t = {
    ta: {
      title: 'மனைஅடி சாஸ்திர வாஸ்து குறிப்புகள்',
      subtitle: 'ஜனன லக்னம் மற்றும் சந்திர ராசி அடிப்படையில் வாஸ்து பலன்கள்',
      lagnaHeading: `லக்னம் வழி வாஸ்து: ${S_MAP[lagnaSign] || lagnaSign} (முதன்மையானது)`,
      rasiHeading: `ராசி வழி வாஸ்து: ${S_MAP[moonSign] || moonSign} (துணையானது)`,
      param: 'அமைப்பு / திசை',
      lagnaVal: 'லக்னம் பரிந்துரை',
      rasiVal: 'ராசி பரிந்துரை',
      door: 'தலைவாசல் திசை',
      kitchen: 'சமையலறை மூலை',
      pooja: 'பூஜை அறை',
      bedroom: 'படுக்கையறை',
      water: 'நீர் நிலை (கிணறு/தொட்டி)',
      avoid: 'தவிர்க்க வேண்டியவை',
      generalTitle: 'விளக்கம் மற்றும் பொதுவான குறிப்புகள்',
      noteTitle: 'ஜோதிட வாஸ்து குறிப்பு:',
      noteText: 'மனை கட்டும் போது பிறப்பு லக்னத்திற்கான வாஸ்து விதிகளுக்கே முதலிடம் தரப்பட வேண்டும். வாசல், படுக்கையறை போன்ற முக்கிய அமைப்புகளை லக்னத்திற்கு உகந்த திசையிலும், பூஜை அறை, சமையலறை போன்ற துணை அமைப்புகளை ராசிக்கு உகந்த திசையிலும் அமைப்பது இன்னும் சிறப்பான சுபிட்சத்தை வழங்கும்.',
      descriptionTitle: 'லக்னம் மற்றும் ராசி வழி விளக்கங்கள்',
    },
    en: {
      title: 'Manaiadi Shastra & Vastu Guide',
      subtitle: 'Vastu guidelines based on Birth Lagna (Ascendant) & Moon Sign (Rasi)',
      lagnaHeading: `Lagna-Based Vastu: ${S_MAP[lagnaSign] || lagnaSign} (Primary)`,
      rasiHeading: `Rasi-Based Vastu: ${S_MAP[moonSign] || moonSign} (Secondary)`,
      param: 'Vastu Parameter',
      lagnaVal: 'Lagna Recommendation',
      rasiVal: 'Rasi Recommendation',
      door: 'Main Entrance Door',
      kitchen: 'Kitchen Location',
      pooja: 'Pooja Room',
      bedroom: 'Master Bedroom',
      water: 'Water Source / Sump',
      avoid: 'Avoid / Precautions',
      generalTitle: 'Interpretations & Custom Advice',
      noteTitle: 'Astrological Vastu Note:',
      noteText: 'When constructing a house, precedence must always be given to the Lagna-based rules. Placing primary structures (like the entrance and bedroom) according to the Lagna, and secondary elements (like kitchen and pooja room) according to the Rasi creates perfect spatial harmony and prosperity.',
      descriptionTitle: 'Lagna & Rasi Astrological Analysis',
    },
  }[language]

  // Table rows mapping
  const rows = [
    {
      label: t.door,
      lagna: isTa ? lagnaVastu.door_direction_ta : lagnaVastu.door_direction_en,
      rasi: isTa ? rasiVastu.door_direction_ta : rasiVastu.door_direction_en,
      icon: <Compass size={16} className="text-gold-mid" />,
    },
    {
      label: t.kitchen,
      lagna: isTa ? lagnaVastu.kitchen_ta : lagnaVastu.kitchen_en,
      rasi: isTa ? rasiVastu.kitchen_ta : rasiVastu.kitchen_en,
      icon: <Home size={16} className="text-orange-400" />,
    },
    {
      label: t.pooja,
      lagna: isTa ? lagnaVastu.pooja_ta : lagnaVastu.pooja_en,
      rasi: isTa ? rasiVastu.pooja_ta : rasiVastu.pooja_en,
      icon: <Home size={16} className="text-yellow-400" />,
    },
    {
      label: t.bedroom,
      lagna: isTa ? lagnaVastu.bedroom_ta : lagnaVastu.bedroom_en,
      rasi: isTa ? rasiVastu.bedroom_ta : rasiVastu.bedroom_en,
      icon: <Home size={16} className="text-blue-400" />,
    },
    {
      label: t.water,
      lagna: isTa ? lagnaVastu.water_ta : lagnaVastu.water_en,
      rasi: isTa ? rasiVastu.water_ta : rasiVastu.water_en,
      icon: <Home size={16} className="text-cyan-400" />,
    },
    {
      label: t.avoid,
      lagna: isTa ? lagnaVastu.avoid_ta : lagnaVastu.avoid_en,
      rasi: isTa ? rasiVastu.avoid_ta : rasiVastu.avoid_en,
      icon: <AlertTriangle size={16} className="text-red-400" />,
      isAlert: true,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {/* Vastu Grid Card */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 15, 36, 0.8), rgba(20, 20, 45, 0.6))',
          borderColor: 'rgba(42, 42, 74, 0.5)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="absolute top-4 left-4 w-12 h-12 bg-gold-mid/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gold-mid/10 rounded-xl border border-gold-mid/20">
              <Compass className="text-gold-bright animate-spin-slow" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide">{t.title}</h3>
              <p className="text-xs text-text-muted mt-0.5">{t.subtitle}</p>
            </div>
          </div>

          {/* Vastu Comparison Grid Table */}
          <div className="overflow-x-auto rounded-lg border border-white/5 bg-black/25">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-text-muted font-semibold">
                  <th className="py-3 px-4">{t.param}</th>
                  <th className="py-3 px-4 text-gold-bright">{t.lagnaHeading}</th>
                  <th className="py-3 px-4 text-text-primary">{t.rasiHeading}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-text-secondary flex items-center gap-2">
                      {row.icon}
                      {row.label}
                    </td>
                    <td
                      className={`py-3.5 px-4 font-medium ${
                        row.isAlert ? 'text-red-400 font-semibold' : 'text-gold-bright'
                      }`}
                    >
                      {row.lagna}
                    </td>
                    <td className={`py-3.5 px-4 ${row.isAlert ? 'text-red-400' : 'text-text-primary'}`}>
                      {row.rasi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Lagna & Rasi Narrative Explanations */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lagna details */}
        <div
          className="rounded-2xl border p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 20, 45, 0.7), rgba(25, 25, 55, 0.5))',
            borderColor: 'rgba(42, 42, 74, 0.5)'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-gold-bright" size={18} />
            <h4 className="font-bold text-gold-bright text-sm uppercase tracking-wider">
              {isTa ? 'லக்ன ரீதியான விளக்கம்' : 'Lagna-Based Guidance'}
            </h4>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {isTa ? lagnaVastu.general_ta : lagnaVastu.general_en}
          </p>
        </div>

        {/* Rasi details */}
        <div
          className="rounded-2xl border p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 20, 45, 0.7), rgba(25, 25, 55, 0.5))',
            borderColor: 'rgba(42, 42, 74, 0.5)'
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="text-cyan-400" size={18} />
            <h4 className="font-bold text-cyan-400 text-sm uppercase tracking-wider">
              {isTa ? 'ராசி ரீதியான விளக்கம்' : 'Rasi-Based Guidance'}
            </h4>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            {isTa ? rasiVastu.general_ta : rasiVastu.general_en}
          </p>
        </div>
      </motion.div>

      {/* Astro Vastu Warning / Callout Note */}
      <motion.div
        variants={item}
        className="rounded-2xl border p-5 relative overflow-hidden flex flex-col gap-2"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 20, 20, 0.4), rgba(40, 25, 25, 0.3))',
          borderColor: 'rgba(180, 50, 50, 0.25)'
        }}
      >
        <div className="flex items-center gap-2 text-amber-500">
          <AlertTriangle size={18} />
          <h4 className="font-extrabold text-sm uppercase tracking-wide">{t.noteTitle}</h4>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed italic">
          {t.noteText}
        </p>
      </motion.div>
    </motion.div>
  )
}
