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
        className="p-6 rounded-[var(--radius-lg)] border flex flex-col sm:flex-row items-center gap-4 justify-between"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
      >
        <div className="relative w-full sm:max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="பெயர் அல்லது அலைபேசி மூலம் தேடுங்கள்... · Search by name, phone or email..."
            className="w-full bg-slate-950/60 px-4 py-2.5 pl-9 text-xs rounded-lg border border-white/10 outline-none transition-all duration-300 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 text-white placeholder-white/30"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
          <span className="text-xs text-white/40 font-semibold hidden md:inline">வடிகட்டி · Filter:</span>
          <select
            value={filter}
            onChange={handleFilterChange}
            className="bg-slate-950/60 text-xs px-4 py-2.5 rounded-lg border border-white/10 text-white/80 outline-none focus:border-amber-500/50 min-w-[140px]"
          >
            <option value="ALL">All Accounts</option>
            <option value="PRO">PRO Members</option>
            <option value="TRIAL">Active Trials</option>
            <option value="EXPIRED">Expired Trials</option>
            <option value="ADMIN">Administrators</option>
          </select>

          <button
            onClick={() => mutate()}
            className="px-4 py-2.5 rounded-lg text-xs font-bold bg-[var(--bg-elevated)] border border-[var(--bg-border)] hover:bg-[var(--bg-active)] transition-colors text-white/80"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Users table */}
      <div
        className="rounded-[var(--radius-lg)] border overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-white/60">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold-bright)' }} />
            <span className="text-xs">உறுப்பினர்கள் ஏற்றப்படுகிறது... · Loading registered users...</span>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400 text-sm">
            ❌ Failed to fetch user profiles. Please try again.
          </div>
        ) : !data || data.users.length === 0 ? (
          <div className="p-16 text-center text-white/30 text-sm">
            🔍 No user accounts match your search query or filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b text-white/50 font-bold uppercase tracking-wider bg-black/10" style={{ borderColor: 'var(--bg-border)' }}>
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
                      <Link href={`/admin/users/${user.id}`} className="hover:underline font-bold text-white flex flex-col gap-0.5">
                        <span>{user.name || 'Anonymous User'}</span>
                        <span className="text-[10px] font-normal text-white/40">{user.email || 'No email registered'}</span>
                      </Link>
                    </td>
                    <td className="p-4 font-mono font-medium text-white/80">
                      {user.phone}
                    </td>
                    <td className="p-4 text-white/60">
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold bg-[var(--bg-elevated)] border border-[var(--bg-border)] hover:bg-[var(--bg-active)] transition-all duration-150 text-white/95"
                      >
                        🔧 Manage & Activate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {data.totalPages > 1 && (
              <div className="p-5 border-t border-[var(--bg-border)] flex items-center justify-between text-xs text-white/60 bg-black/5">
                <span>
                  Showing page <span className="text-white font-bold">{page}</span> of{' '}
                  <span className="text-white font-bold">{data.totalPages}</span> ({data.total} total)
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded bg-[var(--bg-elevated)] border border-[var(--bg-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--bg-active)] transition-colors font-bold"
                  >
                    ◀ Prev
                  </button>

                  <button
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    disabled={page === data.totalPages}
                    className="px-3 py-1.5 rounded bg-[var(--bg-elevated)] border border-[var(--bg-border)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--bg-active)] transition-colors font-bold"
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
