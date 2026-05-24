'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  // Active link helper
  const isActive = (path: string) => {
    if (path === '/admin') return pathname === '/admin'
    return pathname.startsWith(path)
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
    <div className="flex min-h-screen text-white relative overflow-hidden" style={{ background: 'var(--bg-page)' }}>
      {/* Mobile Sidebar Backdrop Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r flex flex-col justify-between shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[var(--bg-border)] flex items-center justify-between">
            <Link href="/admin" className="flex flex-col" onClick={() => setSidebarOpen(false)}>
              <span className="font-extrabold text-lg tracking-wider" style={{ color: 'var(--gold-bright)', fontFamily: "'Anek Tamil', sans-serif" }}>
                ஜோதிசாஃப்ட் Admin
              </span>
              <span className="text-[10px] uppercase font-semibold text-white/50 tracking-widest mt-0.5">
                Control Panel
              </span>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-[var(--bg-active)] md:hidden cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                isActive('/admin')
                  ? 'text-[#1a1209]'
                  : 'text-white/70 hover:text-white hover:bg-[var(--bg-active)]'
              }`}
              style={{
                background: isActive('/admin') ? 'var(--gold-bright)' : 'transparent',
              }}
            >
              📊 &nbsp; Dashboard Metrics
            </Link>

            <Link
              href="/admin/users"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                isActive('/admin/users')
                  ? 'text-[#1a1209]'
                  : 'text-white/70 hover:text-white hover:bg-[var(--bg-active)]'
              }`}
              style={{
                background: isActive('/admin/users') ? 'var(--gold-bright)' : 'transparent',
              }}
            >
              👥 &nbsp; User Management
            </Link>
          </nav>
        </div>

        {/* User profile / Logout */}
        <div className="p-4 border-t border-[var(--bg-border)] space-y-3" style={{ background: 'var(--bg-elevated)' }}>
          <div className="px-2">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-bold truncate text-[var(--gold-bright)] mt-0.5">{user?.email || user?.phone || 'Administrator'}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/panchangam"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border border-[var(--bg-border)] hover:bg-[var(--bg-active)] transition-colors text-white/80 hover:text-white"
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
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-white/70 hover:text-white hover:bg-[var(--bg-active)] md:hidden cursor-pointer"
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <h2 className="text-sm font-semibold text-white/60 truncate max-w-[180px] sm:max-w-none">
              {pathname === '/admin' && 'System Analytics & Overview'}
              {pathname.startsWith('/admin/users') && 'Registered Astrology Users'}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-white/40">
            <span className="hidden sm:inline">Server status: <span className="text-green-400">● Online</span></span>
            <span className="sm:hidden text-green-400">● Online</span>
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
