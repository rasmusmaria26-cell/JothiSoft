'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { useToastStore, ToastItem } from '@/store/toastStore'

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          return (
            <ToastCard
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          )
        })}
      </AnimatePresence>
    </div>
  )
}

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: () => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      case 'error':
        return <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/20'
      case 'error':
        return 'border-rose-500/20'
      case 'warning':
        return 'border-amber-500/20'
      case 'info':
      default:
        return 'border-sky-500/20'
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-start gap-3 bg-neutral-900/90 backdrop-blur-md border ${getBorderColor()} p-4 rounded-xl shadow-2xl relative overflow-hidden`}
    >
      {/* Visual Accent/Glow */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-white/10 to-transparent" />
      
      {getIcon()}

      <div className="flex-1 text-sm text-neutral-200 pr-4 leading-normal font-sans">
        {toast.message}
      </div>

      <button
        onClick={onClose}
        className="text-neutral-500 hover:text-neutral-300 transition-colors p-0.5 rounded-lg hover:bg-white/5 absolute right-2.5 top-2.5"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
