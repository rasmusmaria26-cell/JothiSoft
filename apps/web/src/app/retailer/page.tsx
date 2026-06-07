'use client'

import { useEffect, useState } from 'react'
import { retailerApi, RetailerCustomer } from '@/lib/retailer'
import { useToastStore } from '@/store/toastStore'

const cleanEmailDisplay = (email: string | null) => {
  if (!email) return 'No email registered'
  if (email.toLowerCase().endsWith('@jothisoft.phone')) return 'No email registered'
  return email
}

export default function RetailerDashboard() {
  const [customers, setCustomers] = useState<RetailerCustomer[]>([])
  const [loading, setLoading] = useState(true)
  
  // Search and available customers states
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [availableCustomers, setAvailableCustomers] = useState<any[]>([])
  const [availablePage, setAvailablePage] = useState(1)
  const [availableTotalPages, setAvailableTotalPages] = useState(1)
  const [availableTotalCount, setAvailableTotalCount] = useState(0)
  const [availableLoading, setAvailableLoading] = useState(true)

  // Activation modal states
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)
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

  const loadAvailableCustomers = async (pageVal = availablePage, searchVal = debouncedSearch) => {
    try {
      setAvailableLoading(true)
      const res = await retailerApi.getAvailableCustomers({
        page: pageVal,
        search: searchVal,
        limit: 10
      })
      if (res.success) {
        setAvailableCustomers(res.customers || [])
        setAvailableTotalPages(res.totalPages || 1)
        setAvailableTotalCount(res.totalCount || 0)
        setAvailablePage(res.page || 1)
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      setAvailableLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setAvailablePage(1)
    }, 400)
    return () => clearTimeout(handler)
  }, [searchQuery])

  // Refetch available list when page or debounced search changes
  useEffect(() => {
    loadAvailableCustomers(availablePage, debouncedSearch)
  }, [availablePage, debouncedSearch])

  const handleUpgradeCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer) return

    try {
      setUpgrading(true)
      const res = await retailerApi.upgradeCustomer(selectedCustomer.id, parseInt(durationDays))
      if (res.success) {
        addToast('பிரீமியம் கணக்கு வெற்றிகரமாக செயல்படுத்தப்பட்டது! · Subscription successfully activated!', 'success')
        setSelectedCustomer(null)
        loadCustomers()
        loadAvailableCustomers(availablePage, debouncedSearch)
      } else {
        addToast('செயல்பாட்டில் பிழை · Activation failed', 'error')
      }
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.message || 'செயல்பாட்டில் பிழை · Activation failed'
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

      {/* Workspace Stack */}
      <div className="space-y-8">
        
        {/* Available Customers for Activation */}
        <div
          className="rounded-[var(--radius-lg)] border overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="p-6 border-b border-[var(--bg-border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">கிடைக்கக்கூடிய வாடிக்கையாளர்கள்</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Available unapproved customers - select to activate premium PRO subscription
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[var(--gold-bright)] self-start md:self-auto">
              {availableTotalCount} Users Available
            </span>
          </div>

          {/* Search/Filter Bar */}
          <div className="p-4 border-b border-[var(--bg-border)] bg-[var(--bg-active)]/20">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="பெயர் அல்லது தொலைபேசி எண் மூலம் தேடுக... · Filter available customers by name or phone..."
                className="w-full bg-[var(--bg-elevated)] pl-4 pr-3 py-2 rounded border border-[var(--bg-border)] outline-none text-xs text-[var(--text-primary)] transition-all duration-300 focus:border-amber-500/50 placeholder-[var(--text-muted)]/50"
              />
            </div>
          </div>

          {availableLoading ? (
            <div className="p-12 text-center text-[var(--text-muted)] text-sm flex flex-col items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold-bright)' }} />
              <span>பதிவிறக்கப்படுகிறது... · Fetching available list...</span>
            </div>
          ) : availableCustomers.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-muted)] text-sm flex flex-col items-center gap-2">
              <span className="text-2xl">💼</span>
              <span className="font-bold text-base">தற்போது கிடைக்கக்கூடிய வாடிக்கையாளர்கள் யாரும் இல்லை</span>
              <span className="text-xs">No unapproved customers available at this time.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-[var(--text-muted)] font-bold uppercase tracking-wider bg-[var(--bg-active)]/30" style={{ borderColor: 'var(--bg-border)' }}>
                    <th className="p-4 pl-6">Name / Details</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Registration Date</th>
                    <th className="p-4">Current Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--bg-border)]">
                  {availableCustomers.map((c) => {
                    const formattedRegDate = new Date(c.created_at).toLocaleDateString('ta-IN', { year: 'numeric', month: 'short', day: 'numeric' }) + ' · ' + new Date(c.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                    const statusClass = c.calculatedStatus === 'TRIAL'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400';

                    return (
                      <tr key={c.id} className="hover:bg-[var(--bg-active)] transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-[var(--text-primary)] flex flex-col gap-0.5">
                            <span>{c.name || 'Anonymous Customer'}</span>
                            <span className="text-[10px] font-normal text-[var(--text-muted)]">{cleanEmailDisplay(c.email)}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-medium text-[var(--text-secondary)]">
                          {c.phone || 'No phone'}
                        </td>
                        <td className="p-4 font-semibold text-[var(--text-secondary)]">
                          {formattedRegDate}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${statusClass}`}>
                            {c.calculatedStatus}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <button
                            onClick={() => {
                              setSelectedCustomer(c);
                              setDurationDays('30');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
                            style={{ background: 'var(--gold-deep)', color: '#1a1209' }}
                          >
                            ⚡ Activate PRO
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {availableTotalPages > 1 && (
            <div className="p-4 border-t border-[var(--bg-border)] flex items-center justify-between text-xs bg-[var(--bg-active)]/10">
              <span className="text-[var(--text-muted)]">
                Showing Page {availablePage} of {availableTotalPages} ({availableTotalCount} total users)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={availablePage <= 1}
                  onClick={() => setAvailablePage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded bg-[var(--bg-elevated)] border border-[var(--bg-border)] disabled:opacity-50 font-bold transition-colors hover:bg-[var(--bg-active)]"
                >
                  முந்தையது · Prev
                </button>
                <button
                  disabled={availablePage >= availableTotalPages}
                  onClick={() => setAvailablePage(prev => Math.min(availableTotalPages, prev + 1))}
                  className="px-3 py-1.5 rounded bg-[var(--bg-elevated)] border border-[var(--bg-border)] disabled:opacity-50 font-bold transition-colors hover:bg-[var(--bg-active)]"
                >
                  அடுத்தது · Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Retailer's Registered Customers */}
        <div
          className="rounded-[var(--radius-lg)] border overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="p-6 border-b border-[var(--bg-border)] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">உங்களது வாடிக்கையாளர்கள்</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Your registered customers list with active subscription statuses</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              {customers.length} Active Accounts
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-[var(--text-muted)] text-sm flex flex-col items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold-bright)' }} />
              <span>பதிவிறக்கப்படுகிறது... · Fetching accounts...</span>
            </div>
          ) : customers.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-muted)] text-sm leading-relaxed">
              💼 You haven&apos;t registered or activated any customers yet. Select a customer from the available list above to activate their account!
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
                    const isExpired = c.expires_at ? new Date(c.expires_at) < new Date() : false;
                    const statusClass = isExpired
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';

                    const formattedExpiry = c.expires_at
                      ? new Date(c.expires_at).toLocaleDateString('ta-IN', { year: 'numeric', month: 'short', day: 'numeric' }) + ' · ' + new Date(c.expires_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                      : 'No Expiry';

                    const whatsappMsg = `வணக்கம் ${c.name || ''}, JothiSoft ஜோதிட தளத்தில் உங்களது பிரீமியம் கணக்கு வெற்றிகரமாக இயக்கப்பட்டுள்ளது. நீங்கள் தாராளமாக கணக்கில் உள்நுழைந்து பயன் பெறலாம்.`;
                    const cleanPhone = c.phone || '';
                    const whatsappUrl = `https://wa.me/${cleanPhone.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMsg)}`;

                    return (
                      <tr key={c.id} className="hover:bg-[var(--bg-active)] transition-colors">
                        <td className="p-4 pl-6">
                          <div className="font-bold text-[var(--text-primary)] flex flex-col gap-0.5">
                            <span>{c.name || 'Anonymous Customer'}</span>
                            <span className="text-[10px] font-normal text-[var(--text-muted)]">{cleanEmailDisplay(c.email)}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono font-medium text-[var(--text-secondary)]">
                          {c.phone || 'No phone'}
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
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 animate-pulse"
                          >
                            💬 WhatsApp Alert
                          </a>

                          <a
                            href={`tel:${cleanPhone}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                          >
                            📞 Call Customer
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Activation Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--bg-border)] rounded-[var(--radius-lg)] p-6 w-full max-w-md space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                ⚡ பிரீமியம் செயல்படுத்தல் · Premium Activation
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Activate or extend the premium PRO plan for this customer.
              </p>
            </div>

            <div className="p-4 rounded border border-[var(--bg-border)] bg-[var(--bg-elevated)] space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">பெயர் · Name:</span>
                <span className="font-bold text-[var(--text-primary)]">{selectedCustomer.name || 'Anonymous Customer'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">தொலைபேசி · Mobile:</span>
                <span className="font-mono text-[var(--text-secondary)]">{selectedCustomer.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-muted)]">மின்னஞ்சல் · Email:</span>
                <span className="font-mono text-[var(--text-secondary)]">{cleanEmailDisplay(selectedCustomer.email)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-[var(--bg-border)] pt-2.5 mt-2.5">
                <span className="text-[var(--text-muted)]">தற்போதைய நிலை · Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-[var(--gold-bright)]">
                  {selectedCustomer.calculatedStatus}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpgradeCustomer} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  திட்டத்தின் காலம் · Plan Duration
                </label>
                <select
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none text-[var(--text-primary)]"
                >
                  <option value="30">மாதாந்திர திட்டம் · Monthly (30 Days)</option>
                  <option value="365">வருடாந்திர திட்டம் · Yearly (365 Days)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 rounded font-bold bg-[var(--bg-elevated)] border border-[var(--bg-border)] text-[var(--text-primary)] hover:brightness-110 active:scale-[0.98]"
                >
                  ரத்து செய் · Cancel
                </button>
                <button
                  type="submit"
                  disabled={upgrading}
                  className="px-4 py-2 rounded font-bold hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                  style={{ background: 'var(--gold-deep)', color: '#1a1209' }}
                >
                  {upgrading ? 'செயல்படுத்தப்படுகிறது... · Activating...' : 'செயல்படுத்து · Confirm Activation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
