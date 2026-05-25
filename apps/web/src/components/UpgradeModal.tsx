'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function UpgradeModal() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'LIFETIME'>('MONTHLY')

  // Format activation message for WhatsApp
  const phone = user?.phone || ''
  const email = user?.email || ''
  const name = user?.user_metadata?.name || ''
  const userId = user?.id || ''

  const messageText = selectedPlan === 'LIFETIME'
    ? `வணக்கம் JothiSoft, நான் PRO வாழ்நாள் சந்தாவை (₹2,999) செயல்படுத்த விரும்புகிறேன். 
ID: ${userId}
Name: ${name}
Phone: ${phone}
Email: ${email}`
    : `வணக்கம் JothiSoft, நான் PRO மாதாந்திர சந்தாவை (₹299) செயல்படுத்த விரும்புகிறேன். 
ID: ${userId}
Name: ${name}
Phone: ${phone}
Email: ${email}`;

  const encodedMessage = encodeURIComponent(messageText);
  const whatsappUrl = `https://wa.me/919943485055?text=${encodedMessage}`; // Client's WhatsApp support link

  return (
    <section
      className="w-full max-w-lg space-y-6 rounded-[var(--radius-lg)] border p-8 shadow-2xl relative overflow-hidden transition-all duration-300"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--gold-mid)',
        boxShadow: '0 10px 40px -10px rgba(184, 134, 11, 0.3)',
      }}
    >
      {/* Decorative Gold Light Effect */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="space-y-3 text-center border-b border-[var(--bg-border)] pb-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-yellow-500/10 text-[var(--gold-bright)] text-2xl font-bold mb-1">
          ✦
        </div>
        <h2 className="text-3xl font-extrabold tracking-wide" style={{ color: 'var(--gold-bright)', fontFamily: "'Anek Tamil', sans-serif" }}>
          சோதனை காலம் முடிந்தது!
        </h2>
        <h3 className="text-xl font-bold opacity-90" style={{ color: 'var(--text-primary)' }}>
          Trial Has Expired!
        </h3>
        <p className="text-sm px-4" style={{ color: 'var(--text-secondary)' }}>
          தொடர்ந்து PRO அம்சங்களைப் பயன்படுத்த எங்களைத் தொடர்பு கொண்டு செயல்படுத்தவும்.
          <br />
          <span className="text-xs opacity-75 block mt-1">To continue using premium features, please contact us for manual activation.</span>
        </p>
      </div>

      <div className="space-y-5 py-2">
        <h4 className="text-center font-semibold text-xs tracking-wider uppercase opacity-85" style={{ color: 'var(--text-secondary)' }}>
          சந்தா திட்டத்தை தேர்ந்தெடுக்கவும் · Choose Your Plan
        </h4>

        {/* Pricing Cards Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Monthly Card */}
          <button
            type="button"
            onClick={() => setSelectedPlan('MONTHLY')}
            className={`text-left p-4 rounded-[var(--radius-md)] border relative transition-all duration-300 active:scale-[0.98] cursor-pointer flex flex-col justify-between h-28 overflow-hidden group ${
              selectedPlan === 'MONTHLY'
                ? 'border-[var(--gold-bright)] shadow-[0_0_15px_rgba(212,175,55,0.15)] bg-yellow-500/5'
                : 'border-[var(--bg-border)] bg-[var(--bg-elevated)] opacity-60 hover:opacity-100 hover:border-white/20'
            }`}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider group-hover:text-[var(--gold-bright)] transition-colors" style={{ color: selectedPlan === 'MONTHLY' ? 'var(--gold-bright)' : 'var(--text-muted)' }}>
                Monthly · மாதாந்திர
              </p>
              <h5 className="text-base font-bold mt-1 text-white">PRO Monthly</h5>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xl font-extrabold text-[var(--gold-bright)]">₹299</span>
              <span className="text-[10px] opacity-50 text-white">/ month</span>
            </div>
          </button>

          {/* Lifetime Card */}
          <button
            type="button"
            onClick={() => setSelectedPlan('LIFETIME')}
            className={`text-left p-4 rounded-[var(--radius-md)] border relative transition-all duration-300 active:scale-[0.98] cursor-pointer flex flex-col justify-between h-28 overflow-hidden group ${
              selectedPlan === 'LIFETIME'
                ? 'border-[var(--gold-bright)] shadow-[0_0_15px_rgba(212,175,55,0.25)] bg-yellow-500/10'
                : 'border-[var(--bg-border)] bg-[var(--bg-elevated)] opacity-60 hover:opacity-100 hover:border-white/20'
            }`}
          >
            {/* Golden Best Value badge */}
            <span className="absolute top-1.5 right-2 text-[8px] bg-gradient-to-r from-amber-500 to-yellow-400 text-black px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide shadow-md z-10">
              Best Value · சிறந்த தேர்வு
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider group-hover:text-[var(--gold-bright)] transition-colors" style={{ color: selectedPlan === 'LIFETIME' ? 'var(--gold-bright)' : 'var(--text-muted)' }}>
                Lifetime · வாழ்நாள்
              </p>
              <h5 className="text-base font-bold mt-1 text-white">PRO Lifetime</h5>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-xl font-extrabold text-[var(--gold-bright)]">₹2,999</span>
              <span className="text-[10px] opacity-50 text-white">one-time</span>
            </div>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex gap-2 items-start bg-black/20 p-2.5 rounded-lg border border-[var(--bg-border)]">
            <span style={{ color: 'var(--gold-bright)' }}>✦</span>
            <div>
              <p className="font-semibold text-white">முழு பஞ்சாங்கம்</p>
              <p className="text-white/50">Full Tamil Panchangam</p>
            </div>
          </div>
          <div className="flex gap-2 items-start bg-black/20 p-2.5 rounded-lg border border-[var(--bg-border)]">
            <span style={{ color: 'var(--gold-bright)' }}>✦</span>
            <div>
              <p className="font-semibold text-white">விரிவான ஜாதகம்</p>
              <p className="text-white/50">Horoscope & Birth Charts</p>
            </div>
          </div>
          <div className="flex gap-2 items-start bg-black/20 p-2.5 rounded-lg border border-[var(--bg-border)]">
            <span style={{ color: 'var(--gold-bright)' }}>✦</span>
            <div>
              <p className="font-semibold text-white">மேம்பட்ட பொருத்தம்</p>
              <p className="text-white/50">Chart & Mangal Matching</p>
            </div>
          </div>
          <div className="flex gap-2 items-start bg-black/20 p-2.5 rounded-lg border border-[var(--bg-border)]">
            <span style={{ color: 'var(--gold-bright)' }}>✦</span>
            <div>
              <p className="font-semibold text-white">வாஸ்து & மனையடி</p>
              <p className="text-white/50">Vastu Days & Manaiyadi</p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Offline Payment */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-[var(--bg-border)] space-y-3">
          <h5 className="font-bold text-sm text-center tracking-wide" style={{ color: 'var(--gold-bright)' }}>
            செலுத்தும் வழிமுறை · Offline Payment Steps
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-xs text-white/80 pl-1">
            <li>
              <span className="font-medium text-white">GPay / PhonePe / Paytm</span> மூலம் <span className="font-bold text-[var(--gold-bright)]">9943485055</span> எண்ணிற்கு <span className="font-bold text-[var(--gold-bright)]">{selectedPlan === 'LIFETIME' ? '₹2,999' : '₹299'}</span> செலுத்தவும்.
              <p className="text-white/40 ml-4 mt-0.5">Pay {selectedPlan === 'LIFETIME' ? '₹2,999' : '₹299'} to 9943485055 via GPay / PhonePe / Paytm.</p>
            </li>
            <li>
              பணம் செலுத்திய ರசீதை <span className="font-medium text-white">WhatsApp</span> மூலம் அனுப்பி உங்கள் கணக்கை செயல்படுத்தக் கூறவும்.
              <p className="text-white/40 ml-4 mt-0.5">Send the payment receipt on WhatsApp to request manual activation.</p>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-[var(--radius-md)] font-bold text-base transition-all duration-150 hover:brightness-110 active:scale-[0.98] cursor-pointer"
            style={{ background: '#25D366', color: '#ffffff' }}
          >
            💬 WhatsApp மூலம் செயல்படுத்தவும்
          </a>

          <a
            href="tel:+919943485055"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-[var(--radius-md)] font-bold text-base transition-all duration-150 hover:bg-white/10 active:scale-[0.98] border cursor-pointer"
            style={{ borderColor: 'var(--bg-border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}
          >
            📞 எங்களை அழைக்கவும் · Call Support
          </a>

          <button
            onClick={() => router.push('/')}
            className="w-full text-center text-xs opacity-60 hover:opacity-100 transition-opacity underline cursor-pointer"
            style={{ color: 'var(--text-secondary)' }}
          >
            முகப்பு பக்கத்திற்கு செல்லவும் · Go back to Home
          </button>
        </div>
      </div>
    </section>
  )
}
