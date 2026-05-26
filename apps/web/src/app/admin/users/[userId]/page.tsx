'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { adminApi, AdminUserDetail } from '@/lib/admin'
import { useToastStore } from '@/store/toastStore'
import { useAuth } from '@/hooks/useAuth'

export default function AdminUserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user: currentAdmin } = useAuth()
  const { addToast } = useToastStore()
  const userId = params.userId as string

  const [user, setUser] = useState<AdminUserDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState(false)
  const [roleToggling, setRoleToggling] = useState(false)
  const [updatingRole, setUpdatingRole] = useState(false)
  const [paymentNote, setPaymentNote] = useState('')
  const [duration, setDuration] = useState<'30_DAYS' | 'LIFETIME'>('30_DAYS')

  const handleUpdateRole = async (newRole: 'admin' | 'retailer' | 'customer') => {
    if (user?.id === currentAdmin?.id) {
      addToast('தங்களை தாங்களே மாற்றி அமைக்க முடியாது · You cannot modify your own role.', 'warning')
      return
    }

    try {
      setUpdatingRole(true)
      await adminApi.updateUserRole(userId, newRole)
      addToast('பயனர் பங்கு புதுப்பிக்கப்பட்டது · User role updated successfully!', 'success')
      await loadUserDetail()
    } catch (err: any) {
      addToast(err.message || 'Failed to update user role', 'error')
    } finally {
      setUpdatingRole(false)
    }
  }

  const loadUserDetail = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getUserDetail(userId)
      setUser(data)
    } catch (err: any) {
      addToast(err.message || 'Failed to load user details', 'error')
      router.push('/admin/users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      loadUserDetail()
    }
  }, [userId])

  const handleActivatePro = async () => {
    try {
      setActivating(true)
      const res = await adminApi.activateUser(userId, paymentNote.trim() || undefined, duration)
      const isLifetime = duration === 'LIFETIME'
      const validityMsg = isLifetime 
        ? 'PRO Activated successfully for Lifetime!' 
        : `PRO Activated successfully! Valid until ${new Date(res.expires_at).toLocaleDateString()}`
      addToast(validityMsg, 'success')
      setPaymentNote('')
      await loadUserDetail() // refresh page details
    } catch (err: any) {
      addToast(err.message || 'Failed to activate PRO', 'error')
    } finally {
      setActivating(false)
    }
  }

  const handleToggleAdmin = async () => {
    if (user?.id === currentAdmin?.id) {
      addToast('தங்களை தாங்களே நீக்கிக் கொள்ள முடியாது · You cannot demote yourself from administrative role.', 'warning')
      return
    }

    try {
      setRoleToggling(true)
      const res = await adminApi.toggleAdminRole(userId)
      addToast(res.is_admin ? 'பயனர் நிர்வாகியாக மாற்றப்பட்டார் · User promoted to Admin successfully!' : 'பயனர் நிர்வாகி பதவியிலிருந்து நீக்கப்பட்டார் · Admin status removed successfully!', 'success')
      await loadUserDetail()
    } catch (err: any) {
      addToast(err.message || 'Role modification failed', 'error')
    } finally {
      setRoleToggling(false)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PRO':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      case 'TRIAL':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
      case 'EXPIRED':
        return 'bg-red-500/10 text-red-400 border border-red-500/20'
      case 'ADMIN':
        return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
      default:
        return 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--text-secondary)]">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold-bright)' }} />
        <span className="text-xs">உறுப்பினர் விவரங்கள் ஏற்றப்படுகிறது... · Loading user details...</span>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.push('/admin/users')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[var(--bg-elevated)] border border-[var(--bg-border)] hover:bg-[var(--bg-active)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          ◀ back to users list
        </button>
      </div>

      {/* Grid of Profile Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Detail Panel */}
        <div
          className="md:col-span-2 p-6 rounded-[var(--radius-lg)] border space-y-6"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="flex items-start justify-between border-b border-[var(--bg-border)] pb-4">
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-3">
                {user.name || 'Anonymous User'}
                {user.role === 'admin' || user.is_admin ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">ADMIN</span>
                ) : user.role === 'retailer' ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400">RETAILER</span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400">CUSTOMER</span>
                )}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">{user.email || 'No email registered'}</p>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${getStatusBadgeClass(user.calculatedStatus)}`}>
              {user.calculatedStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1">
              <span className="text-[var(--text-muted)] font-semibold block uppercase tracking-wider">Mobile Number</span>
              <span className="font-mono text-sm text-[var(--text-secondary)]">{user.phone}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-muted)] font-semibold block uppercase tracking-wider">Registration Date</span>
              <span className="text-sm text-[var(--text-secondary)]">{new Date(user.created_at).toLocaleString()}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-muted)] font-semibold block uppercase tracking-wider">Preferred Language</span>
              <span className="text-sm uppercase font-bold text-[var(--text-secondary)]">{user.language === 'ta' ? 'தமிழ் (Tamil)' : 'English'}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-muted)] font-semibold block uppercase tracking-wider">Trial Expiration</span>
              <span className="text-sm text-[var(--text-secondary)]">
                {user.subscription?.trial_expires_at
                  ? new Date(user.subscription.trial_expires_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-muted)] font-semibold block uppercase tracking-wider">PRO Plan Expiration</span>
              <span className="text-sm text-[var(--text-secondary)]">
                {user.subscription?.expires_at
                  ? new Date(user.subscription.expires_at).getFullYear() === 2099
                    ? '✨ Lifetime / வாழ்நாள்'
                    : new Date(user.subscription.expires_at).toLocaleString()
                  : 'N/A'}
              </span>
            </div>

            {user.subscription?.payment_note && (
              <div className="space-y-1 sm:col-span-2 bg-black/10 p-3 rounded-lg border border-[var(--bg-border)]">
                <span className="text-[var(--gold-bright)] font-semibold block uppercase tracking-wider">Active Payment Note</span>
                <span className="text-xs text-[var(--text-secondary)]">{user.subscription.payment_note}</span>
              </div>
            )}
          </div>
        </div>

        {/* Administration Actions Panel */}
        <div
          className="p-6 rounded-[var(--radius-lg)] border flex flex-col justify-between"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-[var(--text-primary)] border-b border-[var(--bg-border)] pb-3">Admin Actions</h4>

            {/* Manual Activation Box */}
            <div className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Plan Duration</label>
                <div className="flex rounded-md border border-[var(--bg-border)] overflow-hidden bg-[var(--bg-elevated)] p-0.5">
                  {(['30_DAYS', 'LIFETIME'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all duration-150 cursor-pointer ${
                        duration === d
                          ? 'bg-[var(--gold-deep)] text-[#1a1209]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-active)]'
                      }`}
                    >
                      {d === '30_DAYS' ? '30 Days' : '⭐ Lifetime'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">User System Role</label>
                <select
                  value={user.role || (user.is_admin ? 'admin' : 'customer')}
                  disabled={updatingRole}
                  onChange={(e) => handleUpdateRole(e.target.value as 'admin' | 'retailer' | 'customer')}
                  className="w-full bg-[var(--bg-elevated)] px-3 py-2 text-xs rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-[var(--text-primary)] cursor-pointer"
                >
                  <option value="customer" className="bg-[var(--bg-page)] text-[var(--text-primary)]">👤 Customer / பயனர்</option>
                  <option value="retailer" className="bg-[var(--bg-page)] text-[var(--text-primary)]">💼 Retailer / சில்லறை விற்பனையாளர்</option>
                  <option value="admin" className="bg-[var(--bg-page)] text-[var(--text-primary)]">🔑 Admin / நிர்வாகி</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Payment Reference / Note</label>
                <input
                  type="text"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  placeholder="e.g. GPay Ref: 489270, Cash Paid"
                  className="w-full bg-[var(--bg-elevated)] px-3 py-2 text-xs rounded border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-[var(--text-primary)] placeholder-[var(--text-muted)]/50"
                />
              </div>

              <button
                onClick={handleActivatePro}
                disabled={activating}
                className="w-full py-2.5 rounded text-xs font-bold transition-all duration-150 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ background: 'var(--gold-deep)', color: '#1a1209' }}
              >
                {activating
                  ? 'செயல்படுத்தப்படுகிறது... · Activating...'
                  : duration === 'LIFETIME'
                  ? 'Manual Lifetime Activation'
                  : 'Manual PRO Activation (30 Days)'}
              </button>
            </div>

            {/* Role promotion Box */}
            <div className="border-t border-[var(--bg-border)] pt-5 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">Admin Privileges</span>
                <span className="text-[10px] text-[var(--text-muted)] block">Granting admin rights allows managing other subscriptions.</span>
              </div>

              <button
                onClick={handleToggleAdmin}
                disabled={roleToggling}
                className={`w-full py-2.5 rounded text-xs font-bold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border cursor-pointer ${
                  user.is_admin
                    ? 'border-red-900/50 bg-red-950/10 text-red-400 hover:bg-red-950/30'
                    : 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/25'
                }`}
              >
                {roleToggling ? 'புதுப்பிக்கப்படுகிறது... · Updating...' : user.is_admin ? 'Demote Admin Status' : 'Promote to Administrator'}
              </button>
            </div>
          </div>

          <div className="text-[10px] text-[var(--text-muted)] text-center mt-6">
            Actions are cryptographically signed & logged.
          </div>
        </div>
      </div>

      {/* Manual Subscription Activation History Audit Log */}
      <div
        className="rounded-[var(--radius-lg)] border overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
      >
        <div className="p-6 border-b border-[var(--bg-border)]">
          <h3 className="text-base font-bold text-[var(--text-primary)]">செயல்பாட்டு வரலாறு · Manual Activation History Audit Log</h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Cryptographic logs of all manual subscription updates performed by system administrators</p>
        </div>

        {user.history.length === 0 ? (
          <div className="p-12 text-center text-[var(--text-muted)] text-xs">
            📄 No manual activations have been performed for this user profile yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-[var(--text-muted)] font-bold uppercase tracking-wider bg-black/5" style={{ borderColor: 'var(--bg-border)' }}>
                  <th className="p-4 pl-6">Activated By</th>
                  <th className="p-4">Plan / Validity</th>
                  <th className="p-4">Starts At</th>
                  <th className="p-4">Expires At</th>
                  <th className="p-4">Action Date</th>
                  <th className="p-4 pr-6">Payment Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bg-border)]">
                {user.history.map((log) => (
                  <tr key={log.id} className="hover:bg-[var(--bg-active)] transition-colors">
                    <td className="p-4 pl-6 font-mono font-medium text-amber-500">
                      {log.activated_by}
                    </td>
                    <td className="p-4 font-bold text-[var(--text-primary)]">
                      {log.plan}
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">
                      {new Date(log.starts_at).toLocaleString()}
                    </td>
                    <td className="p-4 text-[var(--text-muted)] font-semibold">
                      {new Date(log.expires_at).getFullYear() === 2099
                        ? '✨ Lifetime / வாழ்நாள்'
                        : new Date(log.expires_at).toLocaleString()}
                    </td>
                    <td className="p-4 text-[var(--text-muted)]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-4 pr-6 text-[var(--text-secondary)] italic">
                      {log.payment_note || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
