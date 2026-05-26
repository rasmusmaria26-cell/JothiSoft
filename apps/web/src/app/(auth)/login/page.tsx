'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
    if (!apiUrl.endsWith('/api')) {
      apiUrl = `${apiUrl}/api`
    }

    try {
      if (isRegister) {
        // Registration: name, phone, email, and password are all required
        const cleanPhone = phone.trim().replace(/\s+/g, '')
        const cleanEmail = email.trim().toLowerCase()

        if (!name.trim() || !cleanPhone || !cleanEmail || !password) {
          throw new Error('அனைத்து புலங்களையும் நிரப்பவும் · Please fill in all fields')
        }

        const body = { email: cleanEmail, password, name, phone: cleanPhone, language: 'ta' }

        const res = await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        const result = await res.json()

        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Registration failed')
        }

        setSuccess('பதிவு வெற்றிகரமாக முடிந்தது! இப்போது உள்நுழையவும். · Registered successfully! Please log in.')
        setIsRegister(false)
        setPhone('')
        setEmail('')
        setName('')
        setLoading(false)
      } else {
        // Login: phone number OR email
        const input = phone.trim() || email.trim().toLowerCase()
        if (!input) {
          throw new Error('தொலைபேசி எண் அல்லது மின்னஞ்சல் உள்ளிடவும் · Please enter your phone number or email')
        }

        const res = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emailOrPhone: input, password }),
        })

        const result = await res.json()

        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Invalid credentials')
        }

        const { access_token, refresh_token, is_admin, role } = result.data

        const { error: sessionError } = await supabase.auth.setSession({ access_token, refresh_token })
        if (sessionError) throw new Error(sessionError.message)

        if (role === 'admin' || is_admin) {
          window.location.href = '/admin'
        } else if (role === 'retailer') {
          window.location.href = '/retailer'
        } else {
          window.location.href = '/'
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  const handleTabSwitch = (register: boolean) => {
    setIsRegister(register)
    setError(null)
    setSuccess(null)
    setPhone('')
    setEmail('')
    setName('')
    setPassword('')
  }

  const isSubmitDisabled =
    loading ||
    password.length < 6 ||
    (isRegister ? !phone.trim() || !name.trim() || !email.trim() : !phone.trim())

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#03020c]">

      {/* ── COSMIC BACKDROP ───────────────────────────────────────────────── */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px] -top-40 -left-40 opacity-20 pointer-events-none animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(184,146,74,0.4) 0%, rgba(0,0,0,0) 70%)', animationDuration: '8s' }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px] -bottom-30 -right-20 opacity-25 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(82,62,191,0.3) 0%, rgba(0,0,0,0) 70%)' }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,146,42,0.35) 0%, rgba(0,0,0,0) 75%)' }}
      />
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* ── MAIN CARD ─────────────────────────────────────────────────────── */}
      <div className="w-full max-w-md z-10 relative">

        {/* Rotating zodiac ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] -z-10 pointer-events-none opacity-20 select-none hidden md:block">
          <svg className="w-full h-full animate-[spin_120s_linear_infinite]" viewBox="0 0 200 200" fill="none" stroke="url(#gold-gradient)" strokeWidth="0.25">
            <defs>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4af37" />
                <stop offset="50%" stopColor="#b8860b" />
                <stop offset="100%" stopColor="#aa7c11" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="95" />
            <circle cx="100" cy="100" r="78" strokeDasharray="1, 3" />
            <circle cx="100" cy="100" r="65" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12
              return (
                <line key={i} x1="100" y1="100"
                  x2={100 + 95 * Math.cos((angle * Math.PI) / 180)}
                  y2={100 + 95 * Math.sin((angle * Math.PI) / 180)}
                />
              )
            })}
          </svg>
        </div>

        <div
          className="w-full rounded-[var(--radius-lg)] p-8 border backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden group transition-all duration-300"
          style={{ background: 'rgba(9, 8, 20, 0.65)', borderColor: 'rgba(212, 175, 55, 0.15)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent" />

          {/* Logo */}
          <div className="text-center mb-8 flex flex-col items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-[#7a4e10] rounded-full blur-md opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <img src="/logo.png" alt="JothiSoft Logo" className="w-28 h-28 relative object-contain filter drop-shadow-[0_0_18px_rgba(218,165,32,0.45)] animate-pulse" style={{ animationDuration: '4s' }} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold mb-1 tracking-wide bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent" style={{ fontFamily: "'Anek Tamil', sans-serif" }}>
                ஜோதிசாஃப்ட்
              </h1>
              <p className="text-xs uppercase tracking-[0.2em] font-medium text-amber-500/75">JothiSoft · Cosmic Astrology Portal</p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b mb-6 p-0.5 rounded-lg bg-black/40 border-white/5">
            {[
              { label: 'உள்நுழைவு · Login', value: false },
              { label: 'பதிவு · Register', value: true },
            ].map((tab) => (
              <button
                key={String(tab.value)}
                type="button"
                onClick={() => handleTabSwitch(tab.value)}
                className="flex-1 py-2 text-sm font-semibold transition-all duration-300 rounded-md outline-none"
                style={{
                  background: isRegister === tab.value ? 'rgba(212, 175, 55, 0.08)' : 'transparent',
                  color: isRegister === tab.value ? '#fcd34d' : '#9ca3af',
                  border: isRegister === tab.value ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid transparent',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isRegister ? (
              /* Unified Login Identifier Box (Phone or Email) */
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-amber-500/80">
                  தொலைபேசி எண் அல்லது மின்னஞ்சல் · Phone Number or Email
                </label>
                <div className="relative group">
                  <input
                    id="identifier-input"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder=""
                    required
                    className="w-full bg-slate-950/60 px-4 py-3 pl-10 text-sm rounded-lg border border-white/10 outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-white placeholder-white/30"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none group-focus-within:text-amber-500/70 transition-colors">👤</span>
                </div>
              </div>
            ) : (
              <>
                {/* Full Name — register only */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-500/80">
                    பெயர் · Full Name
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=""
                      required={isRegister}
                      className="w-full bg-slate-950/60 px-4 py-3 pl-10 text-sm rounded-lg border border-white/10 outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-white placeholder-white/30"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-base pointer-events-none group-focus-within:text-amber-500/70 transition-colors">✦</span>
                  </div>
                </div>

                {/* Phone — register only */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-500/80">
                    தொலைபேசி எண் · Phone Number <span className="text-amber-400 normal-case font-normal">(தேவை · Required)</span>
                  </label>
                  <div className="relative group">
                    <input
                      id="phone-input"
                      type="tel"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder=""
                      required={isRegister}
                      className="w-full bg-slate-950/60 px-4 py-3 pl-10 text-sm rounded-lg border border-white/10 outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-white placeholder-white/30"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none group-focus-within:text-amber-500/70 transition-colors">📞</span>
                  </div>
                  <p className="text-[10px] text-white/30 pl-1">இந்த எண்ணைக் கொண்டு உள்நுழைவீர்கள் · You will use this number to log in</p>
                </div>

                {/* Email — register only */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-amber-500/80">
                    மின்னஞ்சல் · Email <span className="text-amber-400 normal-case font-normal">(தேவை · Required)</span>
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      required={isRegister}
                      className="w-full bg-slate-950/60 px-4 py-3 pl-10 text-sm rounded-lg border border-white/10 outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-white placeholder-white/30"
                    />
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm pointer-events-none group-focus-within:text-amber-500/50 transition-colors">✉</span>
                  </div>
                </div>
              </>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-500/80">
                கடவுச்சொல் · Password
              </label>
              <div className="relative group">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  minLength={6}
                  required
                  className="w-full bg-slate-950/60 px-4 py-3 pl-10 text-sm rounded-lg border border-white/10 outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-white placeholder-white/30"
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm pointer-events-none group-focus-within:text-amber-500/70 transition-colors">🔑</span>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-500/30 text-xs font-medium text-red-400 leading-relaxed">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs font-medium text-emerald-400 leading-relaxed">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full py-3.5 mt-2 rounded-lg font-bold text-sm relative overflow-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.01] active:scale-[0.98] select-none"
              style={{ background: 'linear-gradient(135deg, #fcd34d 0%, #d4af37 50%, #b8860b 100%)', color: '#120d02' }}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmerSweep_3s_infinite]" />
              <span className="relative z-10 uppercase tracking-wider">
                {loading
                  ? 'செயலாக்குகிறது... · Processing...'
                  : isRegister
                  ? 'பதிவு செய் · Register Account'
                  : 'உள்நுழை · Sign In'}
              </span>
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-white/30 mt-6 select-none uppercase tracking-widest">
          © {new Date().getFullYear()} JothiSoft. All cosmic rights reserved.
        </p>
      </div>
    </div>
  )
}
