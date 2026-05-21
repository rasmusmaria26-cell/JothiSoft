'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    // Format as E.164 for India (+91)
    const formattedPhone = '+91' + phone.replace(/\D/g, '').slice(-10)
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    if (!apiUrl.endsWith('/api')) {
      apiUrl = `${apiUrl}/api`
    }

    try {
      if (isRegister) {
        // Registration Flow with two-step OTP verification
        const body: any = { phone: formattedPhone, password, name, language: 'ta' }
        if (otpSent) {
          body.otp = otp
        }

        const res = await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        const result = await res.json()

        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Registration failed')
        }

        if (result.otp_sent) {
          setOtpSent(true)
          setSuccess('உறுதிப்படுத்தல் குறியீடு அனுப்பப்பட்டது! உங்கள் தொலைபேசியை சரிபார்க்கவும். · Verification OTP sent! Please check your phone.')
          setLoading(false)
        } else {
          setSuccess('பதிவு வெற்றிகரமாக முடிந்தது! உள்நுழையவும். · Registered successfully! Please log in.')
          setIsRegister(false)
          setOtpSent(false)
          setOtp('')
          setLoading(false)
        }
      } else {
        // Login Flow
        const res = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formattedPhone, password }),
        })

        const result = await res.json()

        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Invalid credentials')
        }

        const { access_token, refresh_token } = result.data
        
        // Hydrate Supabase browser session
        const { error: sessionError } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        if (sessionError) {
          throw new Error(sessionError.message)
        }

        router.push('/')
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg-page)' }}>
      <div
        className="w-full max-w-md rounded-[var(--radius-lg)] p-8 border shadow-xl transition-all duration-300"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
      >
        {/* Logo */}
        <div className="text-center mb-6 flex flex-col items-center gap-3">
          <img
            src="/logo.png"
            alt="JothiSoft Logo"
            className="w-16 h-16 object-contain filter drop-shadow-[0_0_12px_rgba(201,146,42,0.3)] animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--gold-bright)', fontFamily: "'Anek Tamil', sans-serif" }}>
              ஜோதிசாஃப்ட்
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>JothiSoft · Tamil Astrology Portal</p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b mb-6" style={{ borderColor: 'var(--bg-border)' }}>
          <button
            type="button"
            className="flex-1 pb-3 text-sm font-semibold transition-all duration-150 border-b-2 outline-none"
            style={{
              borderColor: !isRegister ? 'var(--gold-mid)' : 'transparent',
              color: !isRegister ? 'var(--gold-bright)' : 'var(--text-muted)',
            }}
            onClick={() => {
              setIsRegister(false)
              setOtpSent(false)
              setOtp('')
              setError(null)
              setSuccess(null)
            }}
          >
            உள்நுழைவு · Login
          </button>
          <button
            type="button"
            className="flex-1 pb-3 text-sm font-semibold transition-all duration-150 border-b-2 outline-none"
            style={{
              borderColor: isRegister ? 'var(--gold-mid)' : 'transparent',
              color: isRegister ? 'var(--gold-bright)' : 'var(--text-muted)',
            }}
            onClick={() => {
              setIsRegister(true)
              setOtpSent(false)
              setOtp('')
              setError(null)
              setSuccess(null)
            }}
          >
            பதிவு · Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
                பெயர் · Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="எ.கா. இராமன்"
                required
                readOnly={otpSent}
                className="w-full bg-transparent px-3 py-3 text-base rounded-[var(--radius-md)] border outline-none transition-all disabled:opacity-60"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--bg-border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          )}

          <div>
            <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
              கைபேசி எண் · Phone Number
            </label>
            <div className="flex rounded-[var(--radius-md)] overflow-hidden border" style={{ borderColor: 'var(--bg-border)' }}>
              <span
                className="flex items-center px-3 text-sm font-medium select-none"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', borderRight: '1px solid var(--bg-border)' }}
              >
                🇮🇳 +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="98765 43210"
                maxLength={10}
                required
                readOnly={otpSent}
                className="flex-1 bg-transparent px-3 py-3 text-base outline-none disabled:opacity-60"
                style={{ color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
              கடவுச்சொல் · Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
              readOnly={otpSent}
              className="w-full bg-transparent px-3 py-3 text-base rounded-[var(--radius-md)] border outline-none transition-all disabled:opacity-60"
              style={{
                background: 'var(--bg-elevated)',
                borderColor: 'var(--bg-border)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* OTP Code Verification Input */}
          {isRegister && otpSent && (
            <div className="animate-in fade-in duration-300">
              <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--gold-bright)' }}>
                அங்கீகார குறியீடு · Enter 6-Digit OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                required
                className="w-full bg-transparent px-3 py-3 text-center tracking-[0.5em] text-lg font-bold rounded-[var(--radius-md)] border border-amber-500/50 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                style={{
                  background: 'rgba(201,146,42,0.05)',
                  color: 'var(--text-primary)',
                }}
              />
              <div className="text-right mt-2">
                <button
                  type="button"
                  onClick={async () => {
                    setError(null)
                    setSuccess(null)
                    setLoading(true)
                    const formattedPhone = '+91' + phone.replace(/\D/g, '').slice(-10)
                    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
                    if (!apiUrl.endsWith('/api')) {
                      apiUrl = `${apiUrl}/api`
                    }
                    try {
                      const res = await fetch(`${apiUrl}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: formattedPhone, password, name, language: 'ta' }),
                      })
                      const result = await res.json()
                      if (!res.ok || !result.success) throw new Error(result.message || 'Resend failed')
                      setSuccess('குறியீடு மீண்டும் அனுப்பப்பட்டது! (OTP Simulator: கன்சோலில் பார்க்கவும்) · Code resent successfully!')
                    } catch (err: any) {
                      setError(err.message)
                    } finally {
                      setLoading(false)
                    }
                  }}
                  className="text-xs hover:underline"
                  style={{ color: 'var(--gold-mid)' }}
                >
                  மீண்டும் குறியீடு அனுப்பு · Resend OTP
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded bg-red-950/50 border border-red-900 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded bg-green-950/50 border border-green-900 text-sm text-green-400">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || phone.replace(/\D/g, '').length !== 10 || password.length < 6 || (isRegister && !name) || (isRegister && otpSent && otp.length !== 6)}
            className="w-full py-3 rounded-[var(--radius-md)] font-bold text-base transition-all duration-150 disabled:opacity-50 hover:brightness-110 active:scale-[0.98]"
            style={{ background: 'var(--gold-deep)', color: '#1a1209' }}
          >
            {loading
              ? 'செயலாக்குகிறது... · Processing...'
              : isRegister
              ? otpSent
                ? 'பதிவை உறுதிசெய் · Confirm Registration'
                : 'அங்கீகார குறியீடு அனுப்பு · Send OTP Code'
              : 'உள்நுழை · Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
