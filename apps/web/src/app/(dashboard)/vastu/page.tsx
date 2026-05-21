'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Calendar, Ruler, ArrowRight, Sparkles, Shield } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } }
}

export default function VastuPage() {
  const { language } = useLanguage()

  const labels = {
    ta: {
      title: 'வாஸ்து',
      subtitle: 'வாஸ்து சாஸ்திரம் என்பது இந்திய பாரம்பரிய கட்டடக்கலை அறிவியல். உங்கள் வீடு மற்றும் கட்டுமானம் சுப நேரம் மற்றும் சுப அளவில் அமையட்டும்.',
      daysTitle: 'வாஸ்து நாட்கள்',
      daysDesc: 'ஆண்டு முழுவதும் கட்டுமான, பூமி பூஜை மற்றும் வீட்டு பிரவேசத்திற்கான சுப நேரங்கள் கொண்ட வாஸ்து நாட்கள்.',
      houseTitle: 'மனையடி சாஸ்திரம்',
      houseDesc: 'உங்கள் வீட்டின் நீளம் மற்றும் அகலம் சுபமான அளவிலா என சரிபார்க்க மனையடி சாஸ்திர கணக்கீடு.',
      explore: 'ஆராயுங்கள்',
      fact1: 'பூமி பூஜை முகூர்த்தம்',
      fact2: '8 அங்குல சக்கரம்',
      fact3: 'சுப-அசுப அறிவிப்பு'
    },
    en: {
      title: 'Vastu Shastra',
      subtitle: 'Vastu Shastra is the ancient Indian science of architecture and spatial alignment. Ensure your home and construction align with auspicious timings and dimensions.',
      daysTitle: 'Vastu Days',
      daysDesc: 'Year-round schedule of auspicious Vastu days for construction, Bhoomi Pooja, and Grihapravesam timings.',
      houseTitle: 'Manaiyadi Shastram',
      houseDesc: 'Check if your house length and width are auspicious dimensions per the classical 8-angulam cycle of Manaiyadi Shastram.',
      explore: 'Explore',
      fact1: 'Bhoomi Pooja Muhurtham',
      fact2: '8-Angulam Cycle',
      fact3: 'Auspicious/Inauspicious Alert'
    }
  }[language]

  const cards = [
    {
      href: '/vastu/days',
      icon: Calendar,
      title: labels.daysTitle,
      desc: labels.daysDesc,
      gradient: 'from-amber-900/40 to-yellow-900/20',
      accent: '#c9922a',
      features: [labels.fact1],
    },
    {
      href: '/vastu/house',
      icon: Ruler,
      title: labels.houseTitle,
      desc: labels.houseDesc,
      gradient: 'from-emerald-900/40 to-teal-900/20',
      accent: '#2aac8a',
      features: [labels.fact2, labels.fact3],
    }
  ]

  return (
    <motion.div
      className="flex flex-col gap-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{ background: 'rgba(201, 146, 42, 0.15)', border: '1px solid rgba(201, 146, 42, 0.3)' }}
          >
            <Home size={22} className="text-gold-bright" />
          </div>
          <div>
            <h1 className="text-[22px] font-bold text-text-primary">{labels.title}</h1>
            <p className="text-[13px] text-text-muted mt-0.5 max-w-xl">{labels.subtitle}</p>
          </div>
        </div>
      </motion.div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div key={idx} variants={item}>
              <Link href={card.href}>
                <div
                  className={`group relative flex flex-col gap-4 p-6 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br ${card.gradient}`}
                  style={{
                    border: `1px solid ${card.accent}40`,
                    boxShadow: `0 0 28px ${card.accent}10`,
                  }}
                >
                  {/* Glow on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ boxShadow: `0 0 40px ${card.accent}20` }}
                  />

                  <div className="flex items-start justify-between">
                    <div
                      className="p-3 rounded-xl"
                      style={{ background: `${card.accent}20`, border: `1px solid ${card.accent}30` }}
                    >
                      <Icon size={24} style={{ color: card.accent }} />
                    </div>
                    <ArrowRight
                      size={18}
                      className="text-text-muted group-hover:translate-x-1 transition-transform duration-200"
                      style={{ color: card.accent }}
                    />
                  </div>

                  <div>
                    <h2 className="text-[17px] font-bold text-text-primary mb-1.5">{card.title}</h2>
                    <p className="text-[13px] text-text-secondary leading-relaxed">{card.desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-1">
                    {card.features.map((f, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: `${card.accent}20`, color: card.accent, border: `1px solid ${card.accent}30` }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <div
                    className="flex items-center gap-1.5 text-[13px] font-semibold"
                    style={{ color: card.accent }}
                  >
                    <Sparkles size={14} />
                    {labels.explore} →
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* About Vastu */}
      <motion.div
        variants={item}
        className="p-5 rounded-xl flex items-start gap-4"
        style={{ background: 'rgba(201, 146, 42, 0.06)', border: '1px solid rgba(201, 146, 42, 0.2)' }}
      >
        <Shield size={20} className="text-gold-deep mt-0.5 shrink-0" />
        <p className="text-[13px] text-text-secondary leading-relaxed">
          {language === 'ta'
            ? 'வாஸ்து சாஸ்திரம் 5000 ஆண்டுகள் பழைமையான இந்திய கட்டடக்கலை அறிவியல். இது வீடு, கட்டிடம் மற்றும் நகர அமைப்பில் பஞ்சபூதங்களின் சக்திகளை சமப்படுத்துவதை நோக்கமாகக் கொண்டுள்ளது. சரியான அளவு மற்றும் சரியான நேரம் சுப பலன்களை தரும்.'
            : 'Vastu Shastra is a 5,000-year-old Indian science of architecture and spatial energy alignment. It aims to balance the five elements (Pancha Bhutas) in homes, buildings, and urban layouts. Correct dimensions and auspicious timings ensure positive outcomes for the dwelling and its inhabitants.'}
        </p>
      </motion.div>
    </motion.div>
  )
}
