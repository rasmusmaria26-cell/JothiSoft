'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'
import { useLanguage } from '@/context/LanguageContext'

interface ModuleCardProps {
  icon: LucideIcon
  labelTa: string
  labelEn: string
  sublabelTa?: string
  sublabelEn?: string
  badge?: 'NEW' | 'PRO' | 'PREMIUM' | 'FREE' | 'TOP'
  colorHex: string
  href: string
}

const BADGE_STYLES: Record<string, string> = {
  NEW:     'bg-[rgba(46,125,107,0.2)] text-[#5dcaa5]',
  TOP:     'bg-[rgba(46,125,107,0.2)] text-[#5dcaa5]',
  PRO:     'bg-[rgba(123,94,167,0.2)] text-[#afa9ec]',
  PREMIUM: 'bg-[rgba(201,146,42,0.2)] text-[#f2c96a]',
  FREE:    'bg-[rgba(74,56,40,0.4)] text-[#8a7060]',
}

export function ModuleCard({
  icon: Icon,
  labelTa,
  labelEn,
  sublabelTa,
  sublabelEn,
  badge,
  colorHex,
  href,
}: ModuleCardProps) {
  const { language } = useLanguage()

  return (
    <motion.div
      className="relative group h-full"
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 340, damping: 22 }}
    >
      {/* Ambient background hover glow */}
      <div 
        className="absolute inset-0 z-0 blur-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-40 pointer-events-none rounded-[var(--radius-md)]"
        style={{ background: colorHex }}
      />

      <Link
        href={href}
        className="relative z-10 flex flex-col items-center gap-[8px] rounded-[var(--radius-md)] py-[16px] px-[8px] overflow-hidden min-h-[100px] sm:min-h-0 h-full"
        style={{
          background: 'rgba(15, 15, 36, 0.75)',
          backdropFilter: 'blur(12px)',
          border: `1px solid rgba(255,255,255,0.07)`,
        }}
      >
        {/* Bottom color glow on hover (desktop only) */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-[var(--radius-md)] hidden sm:block"
          style={{ background: colorHex }}
          initial={{ scaleX: 0, opacity: 0 }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        />

        {badge && (
          <span
            className={clsx(
              'absolute top-[6px] right-[6px] text-[9px] font-bold px-[6px] py-[2px] rounded-full z-10',
              BADGE_STYLES[badge]
            )}
          >
            {badge}
          </span>
        )}

        {/* Icon */}
        <motion.div
          className="w-[44px] h-[44px] sm:w-[56px] sm:h-[56px] rounded-full flex items-center justify-center"
          style={{
            background: `${colorHex}1e`,
            color: colorHex,
            outline: `1px solid ${colorHex}38`,
            outlineOffset: '2px',
          }}
          whileHover={{ rotate: [0, -8, 8, -4, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon size={22} className="sm:hidden" />
          <Icon size={26} className="hidden sm:block" />
        </motion.div>

        <p className="text-xs sm:text-sm font-medium text-center leading-tight mt-[4px] w-full min-w-0 break-words line-clamp-2 px-1"
          style={{ color: 'var(--text-secondary)' }}>
          {language === 'ta' ? labelTa : labelEn}
        </p>
        {(sublabelTa || sublabelEn) && (
          <p className="text-[10px] text-center hidden sm:block"
            style={{ color: 'var(--text-disabled)' }}>
            {language === 'ta' ? sublabelTa : sublabelEn}
          </p>
        )}
      </Link>
    </motion.div>
  )
}
