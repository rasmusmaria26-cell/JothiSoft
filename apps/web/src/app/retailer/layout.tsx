'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function RetailerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { logout, user, loading } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-sm font-medium"
        style={{ background: 'var(--bg-page)', color: 'var(--gold-bright)' }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--gold-bright)' }} />
          <span>சரிபார்க்கப்படுகிறது... · Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-page)' }}>
      {/* Mobile Sidebar Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[var(--bg-border)]">
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-wider" style={{ color: 'var(--gold-bright)', fontFamily: "'Anek Tamil', sans-serif" }}>
                ஜோதிசாஃப்ட் Partner
              </span>
              <span className="text-[10px] uppercase font-semibold text-[var(--text-muted)] tracking-widest mt-0.5">
                Retailer Console
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 text-[#1a1209]"
              style={{
                background: 'var(--gold-bright)',
              }}
            >
              📊 &nbsp; Partner Dashboard
            </div>
          </nav>
        </div>

        {/* User profile / Logout */}
        <div className="p-4 border-t border-[var(--bg-border)] space-y-3" style={{ background: 'var(--bg-elevated)' }}>
          <div className="px-2">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Partner Account</p>
            <p className="text-sm font-bold truncate text-[var(--gold-bright)] mt-0.5">{user?.email || user?.phone || 'Retailer Partner'}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border border-[var(--bg-border)] hover:bg-[var(--bg-active)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              🔮 Go to Main App
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all text-red-400 hover:text-red-300 hover:bg-red-950/20 cursor-pointer"
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header
          className="h-16 border-b flex items-center justify-between px-4 md:px-8 shrink-0"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger button on mobile */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 rounded-lg border border-[var(--bg-border)] bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-active)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <h2 className="text-sm font-semibold text-[var(--text-secondary)] truncate max-w-[180px] sm:max-w-none">
              Retailer Partner Hub
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-muted)]">
            <span className="text-green-400">● Live Connection</span>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
