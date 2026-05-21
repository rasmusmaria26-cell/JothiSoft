'use client'

import React from 'react';
import { Home, Compass, Calendar, Heart, Hash } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/',           icon: Home,     label: 'முகப்பு' },
  { href: '/horoscope',  icon: Compass,  label: 'ஜாதகம்' },
  { href: '/panchangam', icon: Calendar, label: 'பஞ்சாங்கம்' },
  { href: '/matching',   icon: Heart,    label: 'பொருத்தம்' },
  { href: '/numerology', icon: Hash,     label: 'எண்கள்' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 w-full border-t z-50 flex items-center justify-around h-16"
      style={{
        background: 'rgba(8, 8, 24, 0.92)',
        backdropFilter: 'blur(16px)',
        borderColor: 'rgba(42, 42, 74, 0.8)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center w-full h-full transition-colors relative"
            style={{ color: isActive ? 'var(--gold-bright)' : 'var(--text-muted)' }}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-[10px] leading-none">{label}</span>
            {isActive && (
              <span
                className="absolute bottom-[6px] w-[4px] h-[4px] rounded-full"
                style={{ background: 'var(--gold-bright)' }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  );
}
