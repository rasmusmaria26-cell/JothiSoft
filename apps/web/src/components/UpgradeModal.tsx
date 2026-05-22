'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function UpgradeModal() {
  const { user } = useAuth()
  const router = useRouter()

  // Format activation message for WhatsApp
  const phone = user?.phone || ''
  const email = user?.email || ''
  const name = user?.user_metadata?.name || ''
  const userId = user?.id || ''

  const messageText = `வணக்கம் JothiSoft, நான் PRO சந்தாவை செயல்படுத்த விரும்புகிறேன். 
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
        <h4 className="text-center font-bold text-lg" style={{ color: 'var(--gold-bright)' }}>
          PRO மாதாந்திர சந்தா · PRO Monthly Subscription
        </h4>

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

        {/* Price Tag */}
        <div
          className="text-center py-4 rounded-[var(--radius-md)] border font-bold text-2xl flex flex-col items-center justify-center"
          style={{ background: 'var(--bg-elevated)', borderColor: 'var(--bg-border)', color: 'var(--gold-bright)' }}
        >
          <span>₹299 / மாதம்</span>
          <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>₹299 / Month</span>
        </div>

        {/* Step-by-Step Offline Payment */}
        <div className="bg-slate-950/40 p-4 rounded-xl border border-[var(--bg-border)] space-y-3">
          <h5 className="font-bold text-sm text-center tracking-wide" style={{ color: 'var(--gold-bright)' }}>
            செலுத்தும் வழிமுறை · Offline Payment Steps
          </h5>
          <ol className="list-decimal list-inside space-y-2 text-xs text-white/80 pl-1">
            <li>
              <span className="font-medium text-white">GPay / PhonePe / Paytm</span> மூலம் <span className="font-bold text-[var(--gold-bright)]">9943485055</span> எண்ணிற்கு <span className="font-bold text-[var(--gold-bright)]">₹299</span> செலுத்தவும்.
              <p className="text-white/40 ml-4 mt-0.5">Pay ₹299 to 9943485055 via GPay / PhonePe / Paytm.</p>
            </li>
            <li>
              பணம் செலுத்திய ரசீதை <span className="font-medium text-white">WhatsApp</span> மூலம் அனுப்பி உங்கள் கணக்கை செயல்படுத்தக் கூறவும்.
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
