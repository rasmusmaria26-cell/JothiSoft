'use client'

import React, { useState, useEffect, useRef } from 'react'
import useSWR from 'swr'
import { MapPin, Search, Loader2 } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { CityData } from '@/types/astro'

interface PlaceSearchProps {
  onSelect: (city: CityData) => void
  selectedCity?: CityData | null
  error?: string
}

export function PlaceSearch({ onSelect, selectedCity, error }: PlaceSearchProps) {
  const { language } = useLanguage()
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Sync initial query with selectedCity
  useEffect(() => {
    if (selectedCity) {
      setQuery(selectedCity.name)
    } else {
      setQuery('')
    }
  }, [selectedCity])

  // Debounce query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [query])

  // Fetch cities via SWR — calls the Express backend cities endpoint
  let apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
  if (!apiBase.endsWith('/api')) {
    apiBase = `${apiBase}/api`
  }
  const shouldFetch = debouncedQuery.trim().length >= 1
  const { data: cities, error: fetchError, isLoading } = useSWR<CityData[]>(
    shouldFetch ? `cities:${debouncedQuery}` : null,
    async () => {
      const res = await fetch(`${apiBase}/cities?q=${encodeURIComponent(debouncedQuery.trim())}`)
      if (!res.ok) throw new Error('Failed to fetch cities')
      return res.json()
    }
  )

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        // If query doesn't match selected city, reset it
        if (selectedCity) {
          setQuery(selectedCity.name)
        } else if (!query) {
          setQuery('')
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [selectedCity, query])

  const handleSelect = (city: CityData) => {
    setQuery(city.name)
    setIsOpen(false)
    onSelect(city)
  }

  const placeholderText = language === 'ta' 
    ? 'பிறந்த ஊரைத் தேடவும்... (எ.கா. Chennai)' 
    : 'Search birth place... (e.g. Chennai)'

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholderText}
          className={`
            w-full pl-9 pr-4 py-2 bg-bg-elevated/45 rounded-md border text-sm
            text-text-primary placeholder:text-text-muted focus:outline-none transition-all duration-200
            ${error ? 'border-red-500/50 focus:border-red-500' : 'border-bg-border focus:border-gold-mid'}
          `}
          style={{
            background: 'rgba(26, 18, 9, 0.45)',
          }}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-muted">
          <Search className="h-4 w-4" />
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && shouldFetch && (
        <div 
          className="absolute z-[100] mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-bg-border shadow-lg"
          style={{
            background: 'rgba(15, 15, 36, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {isLoading && !cities && (
            <div className="p-3 text-xs text-text-muted flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-gold-mid" />
              {language === 'ta' ? 'தேடுகிறது...' : 'Searching...'}
            </div>
          )}

          {cities && cities.length === 0 && (
            <div className="p-3 text-xs text-text-muted">
              {language === 'ta' ? 'பொருத்தமான ஊர் இல்லை' : 'No places found'}
            </div>
          )}

          {cities && cities.length > 0 && (
            <ul className="py-1">
              {cities.map((city) => (
                <li key={city.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(city)}
                    className="w-full text-left px-4 py-2 text-xs sm:text-sm hover:bg-gold-deep/15 text-text-secondary hover:text-gold-bright transition-colors duration-150 flex items-center justify-between"
                  >
                    <span>{city.name}</span>
                    <span className="text-[10px] text-text-muted">
                      {city.state ? `${city.state}, ` : ''}{city.country}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
