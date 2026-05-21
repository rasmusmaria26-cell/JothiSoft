'use client'

import { useEffect } from 'react'
import { AstroBackground } from '@/components/layout/AstroBackground'
import { Header } from '@/components/layout/Header'
import { LanguageProvider } from '@/context/LanguageContext'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setUser, clearAuth, setLoading } = useAuthStore()

  useEffect(() => {
    async function syncAuth() {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          clearAuth()
          return
        }

        // Fetch profile
        const { data: profile } = await supabase
          .from('users')
          .select('*, subscriptions(plan, expires_at)')
          .eq('id', session.user.id)
          .single()

        // Call Express sync-meta endpoint to keep edge metadata updated
        import('@/lib/api').then(({ default: api }) => {
          api.get('/auth/sync-meta').catch(metaErr => {
            console.error('Failed to sync metadata with backend:', metaErr);
          });
        });

        setUser({
          id: session.user.id,
          phone: session.user.phone ?? profile?.phone ?? '',
          name: profile?.name ?? null,
          plan: profile?.subscriptions?.plan ?? 'FREE',
          planExpiry: profile?.subscriptions?.expires_at ?? null,
          language: profile?.language ?? 'ta',
          createdAt: profile?.created_at ?? new Date().toISOString(),
        })
      } catch (err) {
        console.error('Failed to sync auth session:', err)
        useAuthStore.setState({ isLoading: false })
      }
    }
    syncAuth()
  }, [setUser, clearAuth, setLoading])

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-bg-page print:bg-white">
        <div className="print:hidden">
          <AstroBackground />
        </div>
        <div className="print:hidden">
          <Header />
        </div>
        <div className="flex pt-[52px]">
          <main className="
            flex-1
            min-w-0
            min-h-[calc(100vh-52px)]
            px-3 sm:px-5 md:px-8
            py-4 sm:py-6
            pb-8
            relative z-10
            max-w-none
            print:p-0 print:m-0 print:min-h-0
          ">
            {children}
          </main>
        </div>
      </div>
    </LanguageProvider>
  )
}
