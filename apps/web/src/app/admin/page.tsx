'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApi, AdminStats, AdminUserDetail } from '@/lib/admin'
import { useToastStore } from '@/store/toastStore'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [expiring, setExpiring] = useState<(AdminUserDetail & { daysLeft: number })[]>([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToastStore()

  // activeTab for dual forms
  const [activeTab, setActiveTab] = useState<'retailer' | 'customer'>('retailer')

  // Retailer form state
  const [retailerName, setRetailerName] = useState('')
  const [retailerPhone, setRetailerPhone] = useState('')
  const [retailerPassword, setRetailerPassword] = useState('')
  const [creatingRetailer, setCreatingRetailer] = useState(false)

  // Customer form state
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerPassword, setCustomerPassword] = useState('')
  const [activatePro, setActivatePro] = useState(false)
  const [customerDuration, setCustomerDuration] = useState<'30_DAYS' | '1_YEAR'>('30_DAYS')
  const [customerPaymentNote, setCustomerPaymentNote] = useState('')
  const [creatingCustomer, setCreatingCustomer] = useState(false)

  const handleCreateRetailer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!retailerName || !retailerPhone || !retailerPassword) {
      addToast('அனைத்து துறைகளும் கட்டாயமாகும் · All fields are required', 'warning')
      return
    }

    if (retailerPassword.length < 8 || !/\d/.test(retailerPassword)) {
      addToast('கடவுச்சொல் குறைந்தது 8 எழுத்துக்கள் இருக்க வேண்டும் மற்றும் ஒரு எண் இருக்க வேண்டும் · Password must be at least 8 characters long and contain at least one number', 'warning')
      return
    }

    try {
      setCreatingRetailer(true)
      await adminApi.createRetailer({
        name: retailerName,
        phone: retailerPhone,
        password: retailerPassword,
      })
      addToast('புதிய சில்லறை விற்பனையாளர் வெற்றிகரமாக சேர்க்கப்பட்டார் · Retailer account created successfully!', 'success')
      setRetailerName('')
      setRetailerPhone('')
      setRetailerPassword('')
      loadDashboardData()
    } catch (err: any) {
      addToast(err.message || 'Retailer creation failed', 'error')
    } finally {
      setCreatingRetailer(false)
    }
  }

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName || !customerPhone || !customerPassword) {
      addToast('அனைத்து துறைகளும் கட்டாயமாகும் · All fields are required', 'warning')
      return
    }

    if (customerPassword.length < 8 || !/\d/.test(customerPassword)) {
      addToast('கடவுச்சொல் குறைந்தது 8 எழுத்துக்கள் இருக்க வேண்டும் மற்றும் ஒரு எண் இருக்க வேண்டும் · Password must be at least 8 characters long and contain at least one number', 'warning')
      return
    }

    try {
      setCreatingCustomer(true)
      await adminApi.createCustomer({
        name: customerName,
        phone: customerPhone,
        password: customerPassword,
        activateProImmediately: activatePro,
        duration: activatePro ? customerDuration : undefined,
        paymentNote: activatePro ? customerPaymentNote || undefined : undefined,
      })
      addToast('புதிய வாடிக்கையாளர் வெற்றிகரமாக சேர்க்கப்பட்டார் · Customer account created successfully!', 'success')
      setCustomerName('')
      setCustomerPhone('')
      setCustomerPassword('')
      setActivatePro(false)
      setCustomerDuration('30_DAYS')
      setCustomerPaymentNote('')
      loadDashboardData()
    } catch (err: any) {
      addToast(err.message || 'Customer creation failed', 'error')
    } finally {
      setCreatingCustomer(false)
    }
  }

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, expiringData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getExpiringUsers(),
      ])
      setStats(statsData)
      setExpiring(expiringData)
    } catch (err: any) {
      addToast(err.message || 'Failed to load dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PRO':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      case 'TRIAL':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
      case 'EXPIRED':
        return 'bg-red-500/10 text-red-400 border border-red-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--text-secondary)]">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold-bright)' }} />
        <span className="text-sm font-medium">டேஷ்போர்டு ஏற்றப்படுகிறது... · Loading dashboard data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border space-y-2 relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Total Registrations</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">{stats?.totalUsers ?? 0}</span>
            <span className="text-xs text-[var(--text-muted)]">users</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] border-t border-[var(--bg-border)]/20 pt-2 mt-2">All time registrations</p>
        </div>

        {/* Active Trials */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border space-y-2 relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Active Trial (24h)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-amber-400">{stats?.activeTrials ?? 0}</span>
            <span className="text-xs text-amber-500/40">trials</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] border-t border-[var(--bg-border)]/20 pt-2 mt-2">First 24-hours access</p>
        </div>

        {/* Active PRO */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border space-y-2 relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--gold-mid)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl" />
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Active PRO (Paid)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--gold-bright)' }}>{stats?.activePros ?? 0}</span>
            <span className="text-xs" style={{ color: 'var(--gold-mid)' }}>members</span>
          </div>
          <p className="text-[10px] text-[var(--gold-mid)] border-t border-[var(--bg-border)]/20 pt-2 mt-2">Manual offline activations</p>
        </div>

        {/* Expired */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border space-y-2 relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
          <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Expired Trials/PRO</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-red-400">{stats?.expired ?? 0}</span>
            <span className="text-xs text-red-500/40">accounts</span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] border-t border-[var(--bg-border)]/20 pt-2 mt-2">Awaiting subscription</p>
        </div>
      </div>

      {/* 2-column grid layout for Expiring list and Retailer Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Expiring / Critical Actions List (2/3 width) */}
        <div
          className="lg:col-span-2 rounded-[var(--radius-lg)] border overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="p-6 border-b border-[var(--bg-border)] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">உடனடி கவனத்திற்கு: முடிவடையும் கணக்குகள்</h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Critical Attention: Trials or PRO plans expiring in the next 7 days</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
              {expiring.length} Accounts Need Action
            </span>
          </div>

          {expiring.length === 0 ? (
            <div className="p-12 text-center text-[var(--text-muted)] text-sm">
              🎉 No subscriptions or trials expiring in the next 7 days. Excellent!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-[var(--text-muted)] font-bold uppercase tracking-wider bg-black/5" style={{ borderColor: 'var(--bg-border)' }}>
                    <th className="p-4 pl-6">Name / Details</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Current Plan</th>
                    <th className="p-4">Expires In</th>
                    <th className="p-4 pr-6 text-right">Quick Contact Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--bg-border)]">
                  {expiring.map((user) => {
                    const whatsappMsg = `வணக்கம் ${user.name || ''}, JothiSoft ஜோதிட தளத்தில் உங்களது சோதனை/சந்தா காலம் ${user.daysLeft} நாளில் முடிவடைகிறது. PRO சந்தாவைத் தொடர ₹299 செலுத்தி உங்களது கணக்கை நீட்டிக்கலாம்.`
                    const whatsappUrl = `https://wa.me/${user.phone.replace(/\+/g, '')}?text=${encodeURIComponent(whatsappMsg)}`

                    return (
                      <tr key={user.id} className="hover:bg-[var(--bg-active)] transition-colors">
                        <td className="p-4 pl-6">
                          <Link href={`/admin/users/${user.id}`} className="hover:underline font-bold text-[var(--text-primary)] flex flex-col gap-0.5">
                            <span>{user.name || 'Anonymous User'}</span>
                            <span className="text-[10px] font-normal text-[var(--text-muted)]">{user.email || 'No email registered'}</span>
                          </Link>
                        </td>
                        <td className="p-4 font-mono font-medium text-[var(--text-secondary)]">
                          {user.phone}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadgeClass(user.calculatedStatus)}`}>
                            {user.calculatedStatus}
                          </span>
                        </td>
                        <td className="p-4 font-semibold">
                          {user.daysLeft === 0 ? (
                            <span className="text-red-400">Expires Today</span>
                          ) : (
                            <span className="text-amber-400">{user.daysLeft} days left</span>
                          )}
                        </td>
                        <td className="p-4 pr-6 text-right space-x-2">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-[var(--bg-border)] hover:bg-black/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          >
                            👁 Details
                          </Link>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20"
                          >
                            💬 WhatsApp Alert
                          </a>

                          <a
                            href={`tel:${user.phone}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20"
                          >
                            📞 Call Support
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

        {/* Creation Card (1/3 width) - Tabbed UI */}
        <div
          className="lg:col-span-1 p-6 rounded-[var(--radius-lg)] border space-y-4 h-fit"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          {/* Tab headers */}
          <div className="flex border-b border-[var(--bg-border)] pb-2 gap-4">
            <button
              onClick={() => setActiveTab('retailer')}
              className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'retailer'
                  ? 'border-[var(--gold-bright)] text-[var(--gold-bright)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              💼 சில்லறை விற்பனையாளர் (Retailer)
            </button>
            <button
              onClick={() => setActiveTab('customer')}
              className={`pb-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'customer'
                  ? 'border-[var(--gold-bright)] text-[var(--gold-bright)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              👤 வாடிக்கையாளர் (Customer)
            </button>
          </div>

          {activeTab === 'retailer' ? (
            <form onSubmit={handleCreateRetailer} className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-[var(--text-primary)] mb-1">
                  சில்லறை விற்பனையாளர் பதிவு
                </h4>
                <p className="text-[10px] text-[var(--text-muted)]">Register a new Retailer partner account</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Partner Name</label>
                <input
                  type="text"
                  required
                  value={retailerName}
                  onChange={(e) => setRetailerName(e.target.value)}
                  placeholder="e.g. Anbu Astrologer"
                  className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-[var(--text-primary)] placeholder-[var(--text-muted)]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={retailerPhone}
                  onChange={(e) => setRetailerPhone(e.target.value)}
                  placeholder="e.g. +919876543210"
                  className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-[var(--text-primary)] placeholder-[var(--text-muted)]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Password (Required)</label>
                <input
                  type="password"
                  required
                  value={retailerPassword}
                  onChange={(e) => setRetailerPassword(e.target.value)}
                  placeholder="Min 8 characters, at least 1 number"
                  className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-[var(--text-primary)] placeholder-[var(--text-muted)]/50"
                />
              </div>

              <button
                type="submit"
                disabled={creatingRetailer}
                className="w-full py-2.5 rounded font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
                style={{ background: 'var(--gold-deep)', color: '#1a1209' }}
              >
                {creatingRetailer ? 'உருவாக்கப்படுகிறது... · Creating...' : 'Register Retailer Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-[var(--text-primary)] mb-1">
                  வாடிக்கையாளர் பதிவு
                </h4>
                <p className="text-[10px] text-[var(--text-muted)]">Create a new customer account directly</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Kumar Swamy"
                  className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-[var(--text-primary)] placeholder-[var(--text-muted)]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Mobile Number (Required)</label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. +919876543211"
                  className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-[var(--text-primary)] placeholder-[var(--text-muted)]/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Password (Required)</label>
                <input
                  type="password"
                  required
                  value={customerPassword}
                  onChange={(e) => setCustomerPassword(e.target.value)}
                  placeholder="Min 8 characters, at least 1 number"
                  className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-[var(--text-primary)] placeholder-[var(--text-muted)]/50"
                />
              </div>

              {/* Activate PRO Option */}
              <div className="flex items-center gap-2 p-2 rounded bg-amber-500/5 border border-amber-500/10 mt-2">
                <input
                  type="checkbox"
                  id="activatePro"
                  checked={activatePro}
                  onChange={(e) => setActivatePro(e.target.checked)}
                  className="w-4 h-4 accent-[var(--gold-bright)] cursor-pointer"
                />
                <label htmlFor="activatePro" className="font-bold text-[var(--text-primary)] cursor-pointer select-none">
                  உடனடியாக PRO திட்டத்தை செயல்படுத்துக · Activate PRO immediately
                </label>
              </div>

              {/* Conditional PRO Settings */}
              {activatePro && (
                <div className="space-y-3 p-3 rounded border border-[var(--bg-border)] bg-black/10 transition-all duration-300">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">PRO Duration</label>
                    <select
                      value={customerDuration}
                      onChange={(e: any) => setCustomerDuration(e.target.value)}
                      className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none text-[var(--text-primary)]"
                    >
                      <option value="30_DAYS">மாதாந்திர திட்டம் · Monthly (30 Days)</option>
                      <option value="1_YEAR">வருடாந்திர திட்டம் · Yearly (1 Year)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Payment Note / Reference (Optional)</label>
                    <input
                      type="text"
                      value={customerPaymentNote}
                      onChange={(e) => setCustomerPaymentNote(e.target.value)}
                      placeholder="e.g. Paid cash, GPay ref #1234"
                      className="w-full bg-[var(--bg-elevated)] px-3 py-2 rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-[var(--text-primary)] placeholder-[var(--text-muted)]/50"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={creatingCustomer}
                className="w-full py-2.5 rounded font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
                style={{ background: 'var(--gold-deep)', color: '#1a1209' }}
              >
                {creatingCustomer ? 'உருவாக்கப்படுகிறது... · Creating...' : 'Create Customer Account'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
