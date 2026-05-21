'use client'

import { useRazorpay } from '@/hooks/useRazorpay'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const PLANS = [
  {
    id: 'PRO_MONTHLY',
    label_en: 'PRO Monthly',
    label_ta: 'மாதாந்திர PRO',
    price: '₹199 / month',
    price_ta: '₹199 / மாதம்',
    features: [
      { en: 'Detailed Horoscope & birth charts', ta: 'விரிவான ஜாதக கட்டம்' },
      { en: 'KP astrology system & cusps', ta: 'KP ஜோதிட கிரக நிலைகள்' },
      { en: 'Advanced Chart & Mangal matching', ta: 'மேம்பட்ட ஜாதக பொருத்தம்' },
      { en: 'Full Monthly Tamil Panchangam', ta: 'மாதாந்திர பஞ்சாங்கம்' },
      { en: 'Chaldean Numerology calculator', ta: 'சாங்கிய எண் கணிதம்' },
      { en: 'Vastu Auspicious Days & Manaiyadi', ta: 'வாஸ்து நாட்கள் & மனையடி சாஸ்திரம்' },
    ],
  },
]

export default function UpgradeModal() {
  const { user } = useAuth()
  const { status, error, startCheckout } = useRazorpay()
  const router = useRouter()

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        router.push('/panchangam')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [status, router])

  return (
    <section
      className="w-full max-w-md space-y-6 rounded-[var(--radius-lg)] border p-8 shadow-2xl relative overflow-hidden transition-all duration-300"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--gold-mid)',
        boxShadow: '0 10px 30px -10px rgba(184, 134, 11, 0.25)',
      }}
    >
      {/* Decorative Gold Light Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-extrabold" style={{ color: 'var(--gold-bright)', fontFamily: "'Anek Tamil', sans-serif" }}>
          ஜோதிசாஃப்ட் PRO
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Unlock the full power of Vedic and Tamil Astrology
        </p>
      </div>

      {PLANS.map((plan) => (
        <div key={plan.id} className="space-y-6">
          <ul className="space-y-3">
            {plan.features.map((f, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm transition-all duration-150">
                <span className="text-base select-none mt-0.5" style={{ color: 'var(--gold-bright)' }}>✦</span>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{f.ta}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{f.en}</p>
                </div>
              </li>
            ))}
          </ul>

          <div
            className="text-center py-4 rounded-[var(--radius-md)] border font-bold text-2xl flex flex-col items-center justify-center"
            style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)', color: 'var(--gold-bright)' }}
          >
            <span>{plan.price_ta}</span>
            <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>{plan.price}</span>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => startCheckout(plan.id, user?.phone ?? undefined)}
              disabled={status === 'creating' || status === 'verifying' || status === 'open'}
              className="w-full py-3 rounded-[var(--radius-md)] font-bold text-base transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98]"
              style={{ background: 'var(--gold-deep)', color: '#1a1209' }}
            >
              {status === 'creating' && 'ஆர்டர் செய்யப்படுகிறது... · Creating order...'}
              {status === 'verifying' && 'சரிபார்க்கப்படுகிறது... · Verifying payment...'}
              {status === 'success' && '✓ செயல்படுத்தப்பட்டது! · Activated!'}
              {(status === 'idle' || status === 'open' || status === 'error') && 'PRO சந்தாவைப் பெறுங்கள் · Upgrade Now'}
            </button>

            {error && (
              <p className="text-center text-sm font-medium text-red-400 p-2 rounded bg-red-950/30 border border-red-900/50">
                {error}
              </p>
            )}

            {status === 'success' && (
              <p className="text-center text-sm font-medium text-green-400 p-2 rounded bg-green-950/30 border border-green-900/50">
                PRO activated successfully! Redirecting...
              </p>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
