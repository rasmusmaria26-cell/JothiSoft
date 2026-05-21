'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TodayHero }        from '@/components/dashboard/TodayHero'
import { QuickAccessStrip } from '@/components/dashboard/QuickAccessStrip'
import { ContextualRow }    from '@/components/dashboard/ContextualRow'
import { CategorySection }  from '@/components/dashboard/CategorySection'
import { categoryData }     from '@/mock/dashboard'
import { UserInfoCard }     from '@/components/dashboard/UserInfoCard'
import { BirthProfileModal } from '@/components/dashboard/BirthProfileModal'
import { useBirthProfile } from '@/hooks/useBirthProfile'

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } },
}

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const { data: birthProfile, isLoading } = useBirthProfile()

  useEffect(() => {
    // If loading is complete and no birth profile exists, show onboarding modal
    if (!isLoading && birthProfile === null) {
      setShowOnboarding(true)
    }
  }, [birthProfile, isLoading])

  return (
    <>
      <motion.div
        className="flex flex-col gap-[10px] w-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <UserInfoCard />
        </motion.div>

        <motion.div variants={item}>
          {/* <TodayHero /> */}
        </motion.div>

        <motion.div variants={item}>
          <QuickAccessStrip />
        </motion.div>

        <motion.div variants={item}>
          <ContextualRow />
        </motion.div>

        <motion.div className="flex flex-col gap-[14px]" variants={item}>
          {categoryData.map((cat, i) => (
            <motion.div
              key={cat.titleEn}
              variants={item}
              custom={i}
            >
              <CategorySection {...cat} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <BirthProfileModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSuccess={() => {
          setShowOnboarding(false)
          // Clean dynamic cache reload
          window.location.reload()
        }}
      />
    </>
  )
}

