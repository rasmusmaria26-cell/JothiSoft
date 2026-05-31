'use client'

import { motion } from 'framer-motion'
import { Bell, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'
import LanguageToggle from '@/components/LanguageToggle'
import ThemeToggle from '@/components/ThemeToggle'
import { useAuth } from '@/hooks/useAuth'


export function Header() {
  const { user, clearAuth } = useAuthStore()
  const { user: authUser } = useAuth()
  const role = authUser?.user_metadata?.role
  const isAdmin = authUser?.user_metadata?.is_admin === true || role === 'admin'
  const isRetailer = role === 'retailer'

  const displayInitial = user?.name 
    ? user.name.trim().charAt(0).toUpperCase() 
    : (user?.email ? 'U' : 'M')


  const handleLogout = async () => {
    await supabase.auth.signOut()
    clearAuth()
    window.location.href = '/login'
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center justify-between px-5 md:px-8 backdrop-blur-md border-b"
      style={{
        background: 'var(--bg-overlay)',
        borderColor: 'var(--bg-border)',
      }}
      initial={{ y: -52, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="flex items-center cursor-pointer"
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 400 }}
        onClick={() => window.location.href = '/'}
      >
        <img
          src="/logo.png"
          alt="JothiSoft Logo"
          className="h-[46px] w-auto object-contain filter drop-shadow-[0_0_10px_rgba(201,146,42,0.3)] scale-[1.6] origin-left"
        />
      </motion.div>

      <div className="flex items-center gap-3">
        {isAdmin && (
          <motion.button
            onClick={() => window.location.href = '/admin'}
            className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25 hover:bg-amber-500/20 transition-all shrink-0 flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⚙️ <span className="hidden xs:inline">Admin Panel</span>
          </motion.button>
        )}

        {isRetailer && (
          <motion.button
            onClick={() => window.location.href = '/retailer'}
            className="px-2.5 py-1 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 hover:bg-indigo-500/20 transition-all shrink-0 flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💼 <span className="hidden xs:inline">Partner Hub</span>
          </motion.button>
        )}

        <div className="flex items-center gap-2 mr-1">
          <LanguageToggle />
          <ThemeToggle />
        </div>


        <motion.button
          className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-secondary"
          whileHover={{ scale: 1.12, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        >
          <Bell size={16} />
        </motion.button>

        <motion.button
          onClick={handleLogout}
          className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-red-400 transition-colors"
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.9 }}
          title="வெளியேறு · Log Out"
        >
          <LogOut size={16} />
        </motion.button>

        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-deep to-[#7a4e10] flex items-center justify-center text-[12px] font-bold text-white cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          animate={{
            boxShadow: [
              '0 0 0px rgba(201,146,42,0)',
              '0 0 10px rgba(201,146,42,0.5)',
              '0 0 0px rgba(201,146,42,0)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {displayInitial}
        </motion.div>
      </div>
    </motion.header>
  )
}
