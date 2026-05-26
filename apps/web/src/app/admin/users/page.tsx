'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useAdminUsers } from '@/hooks/useAdminUsers'

export default function AdminUsersListPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('ALL')
  const limit = 10

  const { data, error, isLoading, mutate } = useAdminUsers({
    page,
    limit,
    search,
    filter,
  })

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1) // Reset to page 1 on new search query
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value)
    setPage(1) // Reset to page 1 on new filter selection
  }

  return (
    <div className="space-y-6">
      {/* Controls & Actions header */}
      <div
        className="p-4 sm:p-6 rounded-[var(--radius-lg)] border flex flex-col md:flex-row items-center gap-4 justify-between"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
      >
        <div className="relative w-full md:max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="பெயர் அல்லது அலைபேசி மூலம் தேடுங்கள்... · Search by name, phone or email..."
            className="w-full bg-[var(--bg-elevated)] px-4 py-2.5 pl-9 text-xs rounded-lg border border-[var(--bg-border)] outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-[var(--text-primary)] placeholder-[var(--text-muted)]/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 justify-between md:justify-end">
          <span className="text-xs text-[var(--text-muted)] font-semibold hidden md:inline">வடிகட்டி · Filter:</span>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="bg-[var(--bg-elevated)] text-xs px-4 py-2.5 rounded-lg border border-[var(--bg-border)] text-[var(--text-secondary)] outline-none focus:border-amber-500/50 min-w-[120px] sm:min-w-[140px] flex-1 sm:flex-initial"
          >
            <option value="ALL">All Accounts</option>
            <option value="PRO">PRO Members</option>
            <option value="TRIAL">Active Trials</option>
            <option value="EXPIRED">Expired Trials</option>
            <option value="ADMIN">Administrators</option>
            <option value="RETAILER_UPGRADED">Upgraded by Retailer</option>
            <option value="DIRECT_SIGNUP">Direct Signups</option>
          </select>

          <button
            onClick={() => mutate()}
            className="px-4 py-2.5 rounded-lg text-xs font-bold bg-[var(--bg-elevated)] border border-[var(--bg-border)] hover:bg-[var(--bg-active)] transition-colors text-[var(--text-secondary)] shrink-0"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Users table / Mobile list */}
      <div
        className="rounded-[var(--radius-lg)] border overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-[var(--text-secondary)]">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold-bright)' }} />
            <span className="text-xs">உறுப்பினர்கள் ஏற்றப்படுகிறது... · Loading registered users...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400 text-sm">
            ❌ Failed to fetch user profiles. Please try again.
          </div>
        ) : !data || data.users.length === 0 ? (
          <div className="p-16 text-center text-[var(--text-muted)] text-sm">
            🔍 No user accounts match your search query or filter.
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b text-[var(--text-muted)] font-bold uppercase tracking-wider bg-black/5" style={{ borderColor: 'var(--bg-border)' }}>
                    <th className="p-4 pl-6">Profile Details</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Registered Date</th>
                    <th className="p-4">Access Status</th>
                    <th className="p-4 pr-6 text-right">Management Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--bg-border)]">
                  {data.users.map((user) => (
                    <tr key={user.id} className="hover:bg-[var(--bg-active)] transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex flex-col gap-0.5">
                          <Link href={`/admin/users/${user.id}`} className="hover:underline font-bold text-[var(--text-primary)] flex items-center gap-2">
                            <span>{user.name || 'Anonymous User'}</span>
                            {user.upgradedBy && (
                              <span 
                                title={`Upgraded by retailer: ${user.upgradedBy.name} (${user.upgradedBy.email || user.upgradedBy.phone})`}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              >
                                🏷️ Upgraded by {user.upgradedBy.name}
                              </span>
                            )}
                          </Link>
                          <span className="text-[10px] font-normal text-[var(--text-muted)]">{user.email || 'No email registered'}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-medium text-[var(--text-secondary)]">
                        {user.phone}
                      </td>
                      <td className="p-4 text-[var(--text-muted)]">
                        {new Date(user.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide ${getStatusBadgeClass(user.calculatedStatus)}`}>
                          {user.calculatedStatus}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[var(--bg-elevated)] border border-[var(--bg-border)] hover:bg-[var(--bg-active)] transition-all duration-150 text-[var(--text-primary)]"
                        >
                          🔧 Manage & Activate
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-[var(--bg-border)]">
              {data.users.map((user) => (
                <div key={user.id} className="p-4 space-y-3 hover:bg-[var(--bg-active)] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <Link href={`/admin/users/${user.id}`} className="hover:underline font-bold text-[var(--text-primary)] flex flex-col gap-0.5">
                      <span className="text-sm">{user.name || 'Anonymous User'}</span>
                      <span className="text-[10px] font-normal text-[var(--text-muted)] truncate max-w-[200px]">{user.email || 'No email registered'}</span>
                    </Link>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wide shrink-0 ${getStatusBadgeClass(user.calculatedStatus)}`}>
                      {user.calculatedStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[var(--text-secondary)] font-medium bg-black/5 p-2.5 rounded-lg border border-[var(--bg-border)]/20">
                    <div className="space-y-0.5">
                      <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Phone</span>
                      <span className="font-mono text-[var(--text-primary)]">{user.phone}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Joined</span>
                      <span>
                        {new Date(user.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {user.upgradedBy && (
                    <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 bg-amber-500/5 px-2.5 py-1.5 rounded-lg border border-amber-500/10">
                      <span>🏷️ Upgraded by Retailer:</span>
                      <span className="font-bold text-amber-400">{user.upgradedBy.name}</span>
                    </div>
                  )}

                  <div>
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="w-full justify-center inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-[10px] font-bold bg-[var(--bg-elevated)] border border-[var(--bg-border)] hover:bg-[var(--bg-active)] transition-all duration-150 text-[var(--text-primary)]"
                    >
                      🔧 Manage & Activate
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {data.totalPages > 1 && (
              <div className="p-4 sm:p-5 border-t border-[var(--bg-border)] flex flex-col sm:flex-row gap-3 items-center justify-between text-xs text-[var(--text-secondary)] bg-black/5">
                <span>
                  Showing page <span className="text-[var(--text-primary)] font-bold">{page}</span> of{' '}
                  <span className="text-[var(--text-primary)] font-bold">{data.totalPages}</span> ({data.total} total)
                </span>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded bg-[var(--bg-elevated)] border border-[var(--bg-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--bg-active)] transition-colors font-bold"
                  >
                    ◀ Prev
                  </button>

                  <button
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    disabled={page === data.totalPages}
                    className="flex-1 sm:flex-initial px-3 py-1.5 rounded bg-[var(--bg-elevated)] border border-[var(--bg-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--bg-active)] transition-colors font-bold"
                  >
                    Next ▶
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
