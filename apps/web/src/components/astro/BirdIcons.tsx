import React from 'react'

interface BirdIconProps {
  className?: string
  color?: string
}

export function VultureIcon({ className = '', color = 'currentColor' }: BirdIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 4c-1.5-1.5-4.5-1.5-6 0-.5.5-.8 1.2-.8 2 0 1.5.5 3 1.5 4.5C9.5 11.5 10 13 10 15v3c0 1.1-.9 2-2 2H6" />
      <path d="M10 18h4c2.8 0 5-2.2 5-5v-1c0-2.8-2.2-5-5-5h-1" />
      <path d="M15 7l2-2 1 1" />
      <circle cx="12" cy="7" r="1" fill={color} />
    </svg>
  )
}

export function OwlIcon({ className = '', color = 'currentColor' }: BirdIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21a9 9 0 0 0 9-9v-4c0-3.3-2.7-6-6-6H9c-3.3 0-6 2.7-6 6v4a9 9 0 0 0 9 9z" />
      <circle cx="9" cy="11" r="2.5" fill={color} fillOpacity="0.2" />
      <circle cx="15" cy="11" r="2.5" fill={color} fillOpacity="0.2" />
      <circle cx="9" cy="11" r="1" fill={color} />
      <circle cx="15" cy="11" r="1" fill={color} />
      <path d="M12 14l-1.5-2h3z" fill={color} />
      <path d="M7 4l-2-2M17 4l2-2" />
    </svg>
  )
}

export function CrowIcon({ className = '', color = 'currentColor' }: BirdIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 11c-1.1 0-2.2-.6-3-1.5L14.5 7.5A4.5 4.5 0 0 0 11 6H8C5.8 6 4 7.8 4 10v4c0 3.3 2.7 6 6 6h4c2.8 0 5-2.2 5-5v-2" />
      <path d="M19 11l3-1-1-2-2 1" fill={color} />
      <circle cx="9" cy="10" r="1.5" fill={color} />
      <path d="M8 20l-1 2M14 20l1 2" />
    </svg>
  )
}

export function CockIcon({ className = '', color = 'currentColor' }: BirdIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3c-1.5 0-2 1.5-1 2.5C10 6 10 7 11.5 7h1c1.5 0 1.5-1 1-1.5C14 4.5 13.5 3 12 3z" fill={color} fillOpacity="0.3" />
      <path d="M14 8c1.5 1.5 3 4 3 6v1c0 2.8-2.2 5-5 5H9c-2.8 0-5-2.2-5-5v-1c0-2.2 1.5-4 3-5l4-3" />
      <circle cx="11" cy="11" r="1.5" fill={color} />
      <path d="M16 12c2.5 0 5 1 6 3-2 1-4 1-6 1" />
      <path d="M16 15c2 0 4 .5 5 2-1.5 1-3.5 1-5 1" />
      <path d="M8 20l-1 2M12 20l1 2" />
    </svg>
  )
}

export function PeacockIcon({ className = '', color = 'currentColor' }: BirdIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 7c-2 0-3 1.5-3 3v2c0 2 1.5 4 4 4s4-1.5 4-4v-2c0-1.5-1-3-3-3H12z" />
      <circle cx="12" cy="10" r="1" fill={color} />
      <path d="M12 7V4M10 7V4M14 7V4" />
      <circle cx="12" cy="3" r="1" fill={color} />
      <circle cx="10" cy="3" r="1" fill={color} />
      <circle cx="14" cy="3" r="1" fill={color} />
      <path d="M7 14c-2.5 1-4.5 3.5-5 6 1.5-1.5 4-2.5 6-3" />
      <path d="M17 14c2.5 1 4.5 3.5 5 6-1.5-1.5-4-2.5-6-3" />
      <path d="M12 16c0 3 2 6 2 6s-1.5-1-2-1-2 1-2 1 2-3 2-6" />
    </svg>
  )
}

export function getBirdIcon(birdName: string, className?: string, color?: string) {
  const props = { className, color }
  switch (birdName.toLowerCase()) {
    case 'vulture': return <VultureIcon {...props} />
    case 'owl': return <OwlIcon {...props} />
    case 'crow': return <CrowIcon {...props} />
    case 'cock': return <CockIcon {...props} />
    case 'peacock': return <PeacockIcon {...props} />
    default: return <CrowIcon {...props} />
  }
}
