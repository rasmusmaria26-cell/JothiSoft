'use client'

import UpgradeModal from '@/components/UpgradeModal'

export default function UpgradePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6" style={{ background: 'var(--bg-page)' }}>
      <UpgradeModal />
    </main>
  )
}
