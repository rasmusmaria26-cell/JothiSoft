'use client'

import { usePathname, useRouter } from 'next/navigation'
import { MagneticDock } from '@/components/ui/magnetic-dock'
import {
  LayoutDashboard,
  Star,
  Calendar,
  Heart,
  Hash,
  Sparkles,
  Home,
  Settings,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'முகப்பு',       icon: <LayoutDashboard size={20} />, href: '/' },
  { id: 'horoscope',  label: 'ஜாதகம்',        icon: <Star size={20} />,            href: '/horoscope' },
  { id: 'panchangam', label: 'பஞ்சாங்கம்',    icon: <Calendar size={20} />,        href: '/panchangam' },
  { id: 'matching',   label: 'பொருத்தம்',     icon: <Heart size={20} />,           href: '/matching' },
  { id: 'numerology', label: 'எண்கணிதம்',     icon: <Hash size={20} />,            href: '/numerology' },
  { id: 'special',    label: 'விசேஷ நாட்கள்', icon: <Sparkles size={20} />,        href: '/special' },
  { id: 'vastu',      label: 'வாஸ்து',        icon: <Home size={20} />,            href: '/vastu' },
  { id: 'settings',   label: 'அமைப்புகள்',    icon: <Settings size={20} />,        href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const items = NAV_ITEMS.map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon,
    isActive:
      item.href === '/'
        ? pathname === '/'
        : pathname.startsWith(item.href),
    onClick: () => router.push(item.href),
  }))

  return (
    <aside
      className="hidden md:flex fixed left-3 z-40"
      style={{ top: '52px', height: 'calc(100vh - 52px)' }}
    >
      <div className="flex items-center h-full">
        <MagneticDock
          items={items}
          position="left"
          variant="glass"
          iconSize={40}
          maxScale={1.55}
          magneticDistance={130}
          showLabels={true}
        />
      </div>
    </aside>
  )
}
