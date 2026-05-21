'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

export default function OTPPage() {
  const router = useRouter()
  const { setUser } = useAuthStore()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const stored = sessionStorage.getItem('otp_phone')
    if (!stored) { router.replace('/login'); return }
    setPhone(stored)
    inputRefs.current[0]?.focus()
  }, [router])

  const handleDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = otp.join('')
    if (token.length !== 6) return
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    })

    if (error || !data.session) {
      setError('தவறான OTP. மீண்டும் முயற்சிக்கவும். · Invalid OTP.')
      setLoading(false)
      return
    }

    // Fetch user profile from public.users via join
    const { data: profile } = await supabase
      .from('users')
      .select('*, subscriptions(plan, expires_at)')
      .eq('id', data.user!.id)
      .single()

    setUser({
      id: data.user!.id,
      phone: data.user!.phone ?? phone,
      name: profile?.name ?? null,
      plan: profile?.subscriptions?.plan ?? 'FREE',
      planExpiry: profile?.subscriptions?.expires_at ?? null,
      language: profile?.language ?? 'ta',
      createdAt: profile?.created_at ?? new Date().toISOString(),
    })

    sessionStorage.removeItem('otp_phone')
    router.replace('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
      <div
        className="w-full max-w-sm mx-4 rounded-[var(--radius-lg)] p-8 border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
      >
        <div className="text-center mb-6 flex flex-col items-center gap-3">
          <img
            src="/logo.png"
            alt="JothiSoft Logo"
            className="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_rgba(201,146,42,0.25)] animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <div>
            <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              OTP சரிபார்ப்பு
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {phone} க்கு அனுப்பப்பட்டது
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          {/* 6-digit OTP input */}
          <div className="flex gap-2 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-13 text-center text-xl font-bold rounded-[var(--radius-md)] border outline-none transition-all"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: digit ? 'var(--gold-mid)' : 'var(--bg-border)',
                  color: 'var(--text-primary)',
                }}
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || otp.join('').length !== 6}
            className="w-full py-3 rounded-[var(--radius-md)] font-semibold text-base transition-all disabled:opacity-50"
            style={{ background: 'var(--gold-deep)', color: '#1a1209' }}
          >
            {loading ? 'சரிபார்க்கிறோம்...' : 'உறுதிப்படுத்து · Verify'}
          </button>

          <button
            type="button"
            onClick={() => router.replace('/login')}
            className="w-full text-sm text-center"
            style={{ color: 'var(--text-muted)' }}
          >
            ← மாற்று · Change number
          </button>
        </form>
      </div>
    </div>
  )
}
