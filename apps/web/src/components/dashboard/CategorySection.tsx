'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { ModuleCard } from './ModuleCard'
import { useLanguage } from '@/context/LanguageContext'

interface Module {
  icon: LucideIcon
  labelTa: string
  labelEn: string
  sublabelTa?: string
  sublabelEn?: string
  badge?: 'NEW' | 'PRO' | 'PREMIUM' | 'FREE' | 'TOP'
  href: string
}

export interface CategorySectionProps {
  titleTa: string
  titleEn: string
  colorHex: string
  modules: Module[]
}

const cardContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045 },
  },
}

const cardItem = {
  hidden: { opacity: 0, y: 14, scale: 0.95 },
  show:   { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 280, damping: 22 } },
}

export function CategorySection({
  titleTa,
  titleEn,
  colorHex,
  modules,
}: CategorySectionProps) {
  const { language } = useLanguage()

  // Dynamically select the optimal grid column layout to guarantee flawless symmetry and perfect balance!
  const getGridColsClass = (count: number) => {
    switch (count) {
      case 3:
        return 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3'
      case 4:
        return 'grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4'
      case 5:
        return 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5'
      case 8:
        return 'grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4'
      case 10:
        return 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5'
      default:
        return 'grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-6'
    }
  }

  return (
    <motion.section
      className="mt-[20px] first:mt-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 200, damping: 24 }}
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-[8px] mb-[10px]"
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <div
          className="flex items-center gap-[6px] px-[10px] py-[4px] rounded-full"
          style={{
            background: `${colorHex}18`,
            border: `1px solid ${colorHex}35`,
          }}
        >
          <div
            className="w-[6px] h-[6px] rounded-full flex-shrink-0"
            style={{ background: colorHex }}
          />
          <span className="text-[12px] font-semibold" style={{ color: colorHex }}>
            {language === 'ta' ? titleTa : titleEn}
          </span>
          <span className="text-[10px]" style={{ color: `${colorHex}88` }}>
            {language === 'ta' ? titleEn : titleTa}
          </span>
        </div>
        <span className="text-[10px] ml-auto" style={{ color: 'var(--text-disabled)' }}>
          {modules.length}
        </span>
      </motion.div>

      {/* Grid — staggered cards */}
      <motion.div
        className={`grid gap-[10px] ${getGridColsClass(modules.length)}`}
        variants={cardContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-30px' }}
      >
        {modules.map((mod) => (
          <motion.div key={mod.href} variants={cardItem}>
            <ModuleCard {...mod} colorHex={colorHex} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}
