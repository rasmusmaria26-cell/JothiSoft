'use client'

import React from 'react'

export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-neutral-800/40 via-neutral-700/25 to-neutral-800/40 rounded ${className}`} 
      style={{ backgroundSize: '200% 100%' }}
    />
  )
}

export function PanchangamSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Date navigation block skeleton */}
      <div className="flex items-center justify-between border border-gold-deep/10 bg-bg-card/30 p-4 rounded-xl">
        <Shimmer className="h-9 w-24 sm:w-28" />
        <Shimmer className="h-6 w-32 sm:w-48" />
        <Shimmer className="h-9 w-24 sm:w-28" />
      </div>

      {/* Main Grid: Panchangam factors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="border border-gold-deep/10 bg-[#0f0f24]/30 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <Shimmer className="h-4 w-16" />
              <Shimmer className="h-6 w-6 rounded-full" />
            </div>
            <Shimmer className="h-8 w-28" />
            <Shimmer className="h-3.5 w-full" />
          </div>
        ))}
      </div>

      {/* Sun / Moon timing bar */}
      <div className="border border-gold-deep/10 bg-bg-card/20 rounded-xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Shimmer className="h-3 w-20" />
            <Shimmer className="h-6 w-32" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function HoroscopeSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl mx-auto">
      {/* Left Input Form Skeleton (already visible or loaded, but good to have) */}
      <div className="lg:col-span-4 border border-gold-deep/15 bg-bg-card/20 p-5 rounded-xl space-y-4">
        <Shimmer className="h-6 w-32" />
        <div className="space-y-3">
          <Shimmer className="h-10 w-full" />
          <div className="grid grid-cols-2 gap-3">
            <Shimmer className="h-10 w-full" />
            <Shimmer className="h-10 w-full" />
          </div>
          <Shimmer className="h-10 w-full" />
        </div>
        <Shimmer className="h-11 w-full rounded-lg" />
      </div>

      {/* Right Content Skeleton (Chart + Info) */}
      <div className="lg:col-span-8 space-y-6">
        <div className="border border-gold-deep/10 bg-bg-card/25 p-6 rounded-xl flex flex-col md:flex-row items-center gap-8 justify-around">
          {/* Astro Chart outline */}
          <div className="relative w-72 h-72 border-2 border-gold-deep/15 bg-bg-card/10 flex items-center justify-center rounded-lg p-2 overflow-hidden">
            {/* Draw diagonal guidelines with shimmer */}
            <div className="absolute inset-0 border-t border-b border-gold-deep/5 rotate-45 scale-150" />
            <div className="absolute inset-0 border-t border-b border-gold-deep/5 -rotate-45 scale-150" />
            <div className="absolute inset-0 border-l border-r border-gold-deep/5" />
            <div className="absolute inset-x-0 top-1/2 border-t border-gold-deep/5 -translate-y-1/2" />
            <Shimmer className="w-16 h-16 rounded-full" />
          </div>

          {/* Quick Stats list */}
          <div className="flex-1 w-full space-y-4">
            <Shimmer className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white/5 p-3 rounded-lg space-y-2">
                  <Shimmer className="h-3 w-16" />
                  <Shimmer className="h-5 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MatchingSkeleton() {
  return (
    <div className="space-y-6 w-full max-w-[1100px] mx-auto">
      {/* Side-by-side Groom & Bride outline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-card border border-bg-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-bg-border pb-3">
            <Shimmer className="h-5 w-5 rounded-full" />
            <Shimmer className="h-5 w-32" />
          </div>
          <div className="space-y-3">
            <Shimmer className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-3">
              <Shimmer className="h-10 w-full" />
              <Shimmer className="h-10 w-full" />
            </div>
          </div>
        </div>

        <div className="bg-bg-card border border-bg-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-bg-border pb-3">
            <Shimmer className="h-5 w-5 rounded-full" />
            <Shimmer className="h-5 w-32" />
          </div>
          <div className="space-y-3">
            <Shimmer className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-3">
              <Shimmer className="h-10 w-full" />
              <Shimmer className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Matching Score ring shimmer */}
      <div className="border border-gold-deep/10 bg-bg-card/20 rounded-xl p-8 flex flex-col items-center justify-center gap-4">
        <Shimmer className="h-32 w-32 rounded-full" />
        <Shimmer className="h-5 w-48" />
        <Shimmer className="h-4 w-72" />
      </div>
    </div>
  )
}
