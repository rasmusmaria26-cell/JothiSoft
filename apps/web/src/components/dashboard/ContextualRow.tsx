'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { CalendarDays, Star } from 'lucide-react'

// MOCK — in production, derive from today's panchangam API
const CONTEXTUAL_ITEMS = [
  {
    icon: CalendarDays,
    label: 'மாத பஞ்சாங்கம்',
    reason: 'சஷ்டி இன்று — விரத நாள்',
    href: '/panchangam/monthly',
    colorHex: '#2e7d6b',
  },
  {
    icon: Star,
    label: 'ஜாதகம்',
    reason: 'அதிகம் பயன்படுத்தப்படுகிறது',
    href: '/horoscope',
    colorHex: '#7b5ea7',
  },
]

const cardVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const cardItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300 } },
}

export function ContextualRow() {
  return (
    <div>
      {/* Section label */}
      <motion.div
        className="flex items-center gap-[6px] mb-[7px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div
          className="w-[3px] h-[11px] flex-shrink-0"
          style={{ background: 'var(--gold-deep)', borderRadius: '1px' }}
        />
        <span className="text-[9px] font-semibold tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}>
          இன்று தேவைப்படலாம்
        </span>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 xs:grid-cols-2 gap-[6px]"
        initial="hidden"
        animate="show"
        variants={cardVariants}
      >
        {CONTEXTUAL_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.href}
              variants={cardItem}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              <Link
                href={item.href}
                className="flex items-center gap-[9px] rounded-[var(--radius-md)] px-[10px] py-[12px] sm:py-[9px]"
                style={{
                  background: 'rgba(15, 15, 36, 0.75)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${item.colorHex}28`,
                }}
              >
                <div
                  className="w-[32px] h-[32px] rounded-[7px] flex items-center justify-center flex-shrink-0"
                  style={{ background: `${item.colorHex}22`, color: item.colorHex }}
                >
                  <Icon size={13} />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-text-secondary leading-tight">
                    {item.label}
                  </p>
                  <p className="text-[10px] sm:text-[9px] italic mt-[1px]" style={{ color: 'var(--text-muted)' }}>
                    {item.reason}
                  </p>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
