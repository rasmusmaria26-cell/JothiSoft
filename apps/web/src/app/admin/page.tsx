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
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/60">
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
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Total Registrations</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-white">{stats?.totalUsers ?? 0}</span>
            <span className="text-xs text-white/40">users</span>
          </div>
          <p className="text-[10px] text-white/40 border-t border-white/5 pt-2 mt-2">All time registrations</p>
        </div>

        {/* Active Trials */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border space-y-2 relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Active Trial (24h)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-amber-400">{stats?.activeTrials ?? 0}</span>
            <span className="text-xs text-amber-500/40">trials</span>
          </div>
          <p className="text-[10px] text-white/40 border-t border-white/5 pt-2 mt-2">First 24-hours access</p>
        </div>

        {/* Active PRO */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border space-y-2 relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--gold-mid)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl" />
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Active PRO (Paid)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight" style={{ color: 'var(--gold-bright)' }}>{stats?.activePros ?? 0}</span>
            <span className="text-xs" style={{ color: 'var(--gold-mid)' }}>members</span>
          </div>
          <p className="text-[10px] text-[var(--gold-mid)] border-t border-yellow-500/10 pt-2 mt-2">Manual offline activations</p>
        </div>

        {/* Expired */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border space-y-2 relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl" />
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Expired Trials/PRO</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-red-400">{stats?.expired ?? 0}</span>
            <span className="text-xs text-red-500/40">accounts</span>
          </div>
          <p className="text-[10px] text-white/40 border-t border-white/5 pt-2 mt-2">Awaiting subscription</p>
        </div>
      </div>

      {/* Expiring / Critical Actions List */}
      <div
        className="rounded-[var(--radius-lg)] border overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
      >
        <div className="p-6 border-b border-[var(--bg-border)] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">உடனடி கவனத்திற்கு: முடிவடையும் கணக்குகள்</h3>
            <p className="text-xs text-white/45 mt-0.5">Critical Attention: Trials or PRO plans expiring in the next 7 days</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400">
            {expiring.length} Accounts Need Action
          </span>
        </div>

        {expiring.length === 0 ? (
          <div className="p-12 text-center text-white/30 text-sm">
            🎉 No subscriptions or trials expiring in the next 7 days. Excellent!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-white/50 font-bold uppercase tracking-wider bg-black/10" style={{ borderColor: 'var(--bg-border)' }}>
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
                        <Link href={`/admin/users/${user.id}`} className="hover:underline font-bold text-white flex flex-col gap-0.5">
                          <span>{user.name || 'Anonymous User'}</span>
                          <span className="text-[10px] font-normal text-white/40">{user.email || 'No email registered'}</span>
                        </Link>
                      </td>
                      <td className="p-4 font-mono font-medium text-white/80">
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold border border-[var(--bg-border)] hover:bg-black/20 text-white/80 hover:text-white"
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
    </div>
  )
}
