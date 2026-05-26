'use client'

import { useEffect, useState } from 'react'
import { retailerApi, RetailerCustomer } from '@/lib/retailer'
import { useToastStore } from '@/store/toastStore'

export default function RetailerDashboard() {
  const [customers, setCustomers] = useState<RetailerCustomer[]>([])
  const [loading, setLoading] = useState(true)
  
  // Search and Upgrade states
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [searchedUser, setSearchedUser] = useState<any | null>(null)
  const [durationDays, setDurationDays] = useState('30')
  const [upgrading, setUpgrading] = useState(false)

  const { addToast } = useToastStore()

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const data = await retailerApi.getCustomers()
      setCustomers(data || [])
    } catch (err: any) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const handleSearchCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      addToast('தேடல் புலத்தை நிரப்பவும் · Please enter email or mobile number', 'warning')
      return
    }

    try {
      setSearching(true)
      setSearchedUser(null)
      const res = await retailerApi.searchCustomer(searchQuery.trim())
      if (res.success && res.user) {
        setSearchedUser(res.user)
        addToast('வாடிக்கையாளர் கணக்கு கண்டறியப்பட்டது! · Customer account found!', 'success')
      } else {
        addToast('பயனர் கணக்கு கண்டறியப்படவில்லை · Account not found', 'warning')
      }
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.message || 'தேடலில் பிழை · Search failed'
      addToast(msg, 'error')
    } finally {
      setSearching(false)
    }
  }

  const handleUpgradeCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchedUser) return

    try {
      setUpgrading(true)
      const res = await retailerApi.upgradeCustomer(searchedUser.id, parseInt(durationDays))
      if (res.success) {
        addToast('பிரீமியம் கணக்கு வெற்றிகரமாக செயல்படுத்தப்பட்டது! · Subscription successfully activated!', 'success')
        setSearchedUser(null)
        setSearchQuery('')
        loadCustomers()
      } else {
        addToast('புதுப்பிப்பு தோல்வியடைந்தது · Upgrade failed', 'error')
      }
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.message || 'செயல்பாட்டில் பிழை · Upgrade activation failed'
      addToast(msg, 'error')
    } finally {
      setUpgrading(false)
    }
  }

  // Stats calculation
  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => {
    if (!c.expires_at) return true
    return new Date(c.expires_at) > new Date()
  }).length
  const expiredCustomers = totalCustomers - activeCustomers

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div
        className="p-8 rounded-[var(--radius-lg)] border relative overflow-hidden flex flex-col gap-2"
        style={{
          background: 'linear-gradient(135deg, var(--gold-tint) 0%, var(--bg-card) 100%)',
          borderColor: 'var(--bg-border)',
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <h1
          className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
          style={{ fontFamily: "'Anek Tamil', sans-serif" }}
        >
          வணக்கம், சில்லறை விற்பனையாளர் கூட்டாளி!
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Welcome to the JothiSoft Retailer Console. Here you can directly register, activate, and manage your customers&apos; premium PRO subscription accounts.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Customers */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border relative overflow-hidden space-y-2"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Total Registered Customers</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-[var(--gold-bright)]">{totalCustomers}</span>
            <span className="text-xs text-[var(--text-muted)]/70">accounts</span>
          </div>
        </div>

        {/* Active Accounts */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border relative overflow-hidden space-y-2"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Active PRO Plan</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-emerald-500">{activeCustomers}</span>
            <span className="text-xs text-emerald-500/70">accounts</span>
          </div>
        </div>

        {/* Expired Accounts */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border relative overflow-hidden space-y-2"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Expired Accounts</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-red-500">{expiredCustomers}</span>
            <span className="text-xs text-red-500/70">accounts</span>
          </div>
        </div>
      </div>

      {/* 2-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Customer List (2/3 width) */}
        <div
          className="lg:col-span-2 rounded-[var(--radius-lg)] border overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="p-6 border-b border-[var(--bg-border)] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">உங்களது வாடிக்கையாளர்கள்</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Your registered customers list with active subscription statuses</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[var(--gold-bright)]">
              {customers.length} Accounts
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[var(--text-muted)] text-sm flex flex-col items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold-bright)' }} />
              <span>▼ பதிவிறக்கப்படுகிறது... · Fetching accounts...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-muted)] text-sm leading-relaxed">
              💼 You haven&apos;t registered any customers yet. Use the registration form to sign up and activate your first customer!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-[var(--text-muted)] font-bold uppercase tracking-wider bg-[var(--bg-active)]/30" style={{ borderColor: 'var(--bg-border)' }}>
                    <th className="p-4 pl-6">Name / Details</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Plan Status</th>
                    <th className="p-4">Expiration Date</th>
                    <th className="p-4 pr-6 text-right">Quick Contact Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--bg-border)]">
                  {customers.map((c) => {
                    const isExpired = c.expires_at ? new Date(c.expires_at) < new Date() : false
                    const statusClass = isExpired
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'

                    const formattedExpiry = c.expires_at
                      ? new Date(c.expires_at).toLocaleDateString('ta-IN', { year: 'numeric', month: 'short', day: 'numeric' }) + ' · ' + new Date(c.expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : 'No Expiry'

                    const whatsappMsg = `வணக்கம் ${c.name || ''}, JothiSoft ஜோதிட தளத்தில் உங்களது பிரீமியம் கணக்கு வெற்றிகரமாக இயக்கப்பட்டுள்ளது. நீங்கள் தாராளமாக கணக்கில் உள்நுழைந்து பயன் பெறலாம்.`
                    const whatsappUrl = `https://wa.me/${c.phone.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMsg)}`

                    return (
                      <tr key={c.id} className="hover:bg-[var(--bg-active)] transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-[var(--text-primary)] flex flex-col gap-0.5">
                            <span>{c.name || 'Anonymous Customer'}</span>
                            <span className="text-[10px] font-normal text-[var(--text-muted)]">{c.email || 'No email registered'}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-medium text-[var(--text-secondary)]">
                          {c.phone}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${statusClass}`}>
                            {isExpired ? 'EXPIRED' : 'ACTIVE PRO'}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-[var(--text-secondary)]">
                          {formattedExpiry}
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20"
                          >
                            💬 WhatsApp Alert
                          </a>

                          <a
                            href={`tel:${c.phone}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                          >
                            📞 Call Customer
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Customer Search & Upgrade Panel (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Search Card */}
          <div
            className="p-6 rounded-[var(--radius-lg)] border space-y-4 h-fit"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
          >
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                🔍 பயனர் கணக்கு தேடல்
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Search by email or phone to upgrade a client</p>
            </div>

            <form onSubmit={handleSearchCustomer} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">தொலைபேசி எண் · Phone Number</label>
                <input
                  type="tel"
                  required
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="+91 9876543210"
                  inputMode="tel"
                  className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-[var(--gold-mid)] focus:ring-1 focus:ring-[var(--gold-mid)]/30 text-[var(--text-primary)] placeholder-[var(--text-muted)]/50"
                />
                <p className="text-[10px] text-[var(--text-muted)]/60">மின்னஞ்சல் முகவரியாலும் தேட முடியும் · Email also accepted</p>
              </div>


              <button
                type="submit"
                disabled={searching}
                className="w-full py-2.5 rounded font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: 'var(--gold-bright)', color: '#1a1209' }}
              >
                {searching ? 'தேடப்படுகிறது... · Searching...' : 'Search Customer'}
              </button>
            </form>
          </div>

          {/* Upgrade Activation Card */}
          {searchedUser && (
            <div
              className="p-6 rounded-[var(--radius-lg)] border space-y-4 h-fit animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
            >
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                  ⚡ பிரீமியம் செயல்படுத்தல்
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Activate / Extend premium PRO plan</p>
              </div>

              <div className="p-4 rounded border border-[var(--bg-border)] bg-[var(--bg-elevated)] space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Name:</span>
                  <span className="font-bold text-[var(--text-primary)]">{searchedUser.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Email:</span>
                  <span className="font-mono text-[var(--text-secondary)]">{searchedUser.email || 'None'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-muted)]">Mobile:</span>
                  <span className="font-mono text-[var(--text-secondary)]">{searchedUser.phone || 'None'}</span>
                </div>
                <div className="flex justify-between items-center border-t border-[var(--bg-border)] pt-2 mt-2">
                  <span className="text-[var(--text-muted)]">Current Plan:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-[var(--gold-bright)]">
                    {searchedUser.plan}
                  </span>
                </div>
              </div>

              <form onSubmit={handleUpgradeCustomer} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Plan Duration</label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-[var(--gold-mid)] focus:ring-1 focus:ring-[var(--gold-mid)]/30 text-[var(--text-primary)]"
                  >
                    <option value="30" className="bg-[var(--bg-elevated)] text-[var(--text-primary)]">30 Days (1 Month PRO)</option>
                    <option value="365" className="bg-[var(--bg-elevated)] text-[var(--text-primary)]">365 Days (1 Year PRO)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={upgrading}
                  className="w-full py-2.5 rounded font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ background: 'var(--gold-deep)', color: 'var(--text-inverse)' }}
                >
                  {upgrading ? 'புதுப்பிக்கப்படுகிறது... · Upgrading...' : 'Activate Premium PRO'}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
