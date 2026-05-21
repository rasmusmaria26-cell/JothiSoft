import React from 'react'
import { motion } from 'framer-motion'
import { PredictionData } from '@/types/astro'
import { useLanguage } from '@/context/LanguageContext'
import { Sparkles, Moon, Star } from 'lucide-react'

interface PredictionsTabProps {
  predictions: PredictionData
}

export function PredictionsTab({ predictions }: PredictionsTabProps) {
  const { language } = useLanguage()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 250, damping: 22 } }
  }

  const sections = [
    {
      key: 'lagna',
      icon: <Sparkles className="text-gold-bright" size={24} />,
      data: predictions.lagna
    },
    {
      key: 'rasi',
      icon: <Moon className="text-blue-400" size={24} />,
      data: predictions.rasi
    },
    {
      key: 'nakshatra',
      icon: <Star className="text-amber-400" size={24} />,
      data: predictions.nakshatra
    }
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-6"
    >
      {sections.map(({ key, icon, data }) => (
        <motion.div 
          key={key} 
          variants={item}
          className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(15, 15, 36, 0.8), rgba(20, 20, 45, 0.6))',
            borderColor: 'rgba(42, 42, 74, 0.5)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Subtle glowing orb behind icon */}
          <div className="absolute top-4 left-4 w-12 h-12 bg-gold-mid/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                {icon}
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide">
                {language === 'ta' ? data.title_ta : data.title_en}
              </h3>
            </div>
            
            <p className="text-text-secondary leading-relaxed sm:text-lg">
              {language === 'ta' ? data.description_ta : data.description_en}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
