'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Calendar, Clock, User, Check, Search, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/context/LanguageContext'

interface CitySuggestion {
  id: number
  name: string
  state: string
  lat: number
  lng: number
  utc_offset: number
}

interface BirthProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function BirthProfileModal({ isOpen, onClose, onSuccess }: BirthProfileModalProps) {
  const { language } = useLanguage()

  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  
  const [cityInput, setCityInput] = useState('')
  const [selectedCity, setSelectedCity] = useState<CitySuggestion | null>(null)
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const [isSaving, setIsSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Labels based on language
  const labels = {
    ta: {
      title: 'உங்கள் பிறப்பு விவரங்கள்',
      subtitle: 'துல்லியமான ஜோதிட மற்றும் பஞ்சாங்க கணிப்புகளுக்காக',
      name: 'முழு பெயர்',
      namePlaceholder: 'எ.கா. காவியா',
      dob: 'பிறந்த தேதி',
      tob: 'பிறந்த நேரம்',
      place: 'பிறந்த ஊர் (Fuzzy Search)',
      placePlaceholder: 'எ.கா. Chennai அல்லது Coimbatore',
      saving: 'சேமிக்கப்படுகிறது...',
      save: 'விவரங்களைச் சேமி',
      error: 'பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.',
      validation: 'அனைத்து விவரங்களையும் சரியாக நிரப்பவும்.',
      noCities: 'நகரங்கள் எதுவும் காணப்படவில்லை'
    },
    en: {
      title: 'Your Birth Profile',
      subtitle: 'For highly accurate astrological & Panchangam calculations',
      name: 'Full Name',
      namePlaceholder: 'e.g. Kavya',
      dob: 'Date of Birth',
      tob: 'Time of Birth',
      place: 'Birth Place (Fuzzy Search)',
      placePlaceholder: 'e.g. Chennai or Coimbatore',
      saving: 'Saving details...',
      save: 'Save Profile Details',
      error: 'An error occurred. Please try again.',
      validation: 'Please fill in all fields correctly.',
      noCities: 'No cities found'
    }
  }[language]

  // City fuzzy search lookup
  useEffect(() => {
    if (cityInput.trim().length < 2 || selectedCity?.name === cityInput) {
      setSuggestions([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true)
      try {
        let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
        if (!apiUrl.endsWith('/api')) {
          apiUrl = `${apiUrl}/api`
        }
        const response = await fetch(`${apiUrl}/cities?q=${encodeURIComponent(cityInput)}&limit=6`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data)
          setShowSuggestions(true)
        }
      } catch (err) {
        console.error('City search failed', err)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [cityInput, selectedCity])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!name.trim() || !dob || !tob || !selectedCity) {
      setErrorMsg(labels.validation)
      return
    }

    setIsSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setErrorMsg('User not authenticated')
        setIsSaving(false)
        return
      }

      const birthProfileData = {
        user_id: session.user.id,
        name: name.trim(),
        dob: dob,
        tob: tob,
        lat: selectedCity.lat,
        lng: selectedCity.lng,
        place_name: `${selectedCity.name}, ${selectedCity.state}`,
      }

      const { error } = await supabase
        .from('birth_profiles')
        .upsert(birthProfileData, { onConflict: 'user_id' })

      if (error) {
        console.error('Supabase save error:', error)
        throw new Error(error.message)
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err)
      setErrorMsg(errMsg || labels.error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              // Prevent closing on backdrop click if it's forced onboarding
            }}
          />

          {/* Modal Card */}
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border p-6 md:p-8"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            style={{
              background: 'rgba(12, 12, 28, 0.95)',
              borderColor: 'rgba(201,146,42,0.3)',
              boxShadow: '0 0 30px rgba(201,146,42,0.15)',
            }}
          >
            {/* Ambient Star Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-radial-gradient(circle, rgba(201,146,42,0.15), transparent 75%) pointer-events-none" />
            
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gold-bright font-display tracking-wide">
                {labels.title} ✨
              </h2>
              <p className="text-xs text-text-muted mt-1">
                {labels.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-text-secondary uppercase tracking-wider">
                  {labels.name}
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={labels.namePlaceholder}
                    className="w-full bg-bg-elevated border border-bg-border rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none transition-colors focus:border-gold-deep"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* DOB & TOB Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* DOB */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-secondary uppercase tracking-wider">
                    {labels.dob}
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-bg-elevated border border-bg-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none transition-colors focus:border-gold-deep"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>

                {/* TOB */}
                <div>
                  <label className="block text-xs font-semibold mb-1 text-text-secondary uppercase tracking-wider">
                    {labels.tob}
                  </label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <input
                      type="time"
                      required
                      value={tob}
                      onChange={(e) => setTob(e.target.value)}
                      className="w-full bg-bg-elevated border border-bg-border rounded-lg pl-10 pr-3 py-2.5 text-sm outline-none transition-colors focus:border-gold-deep"
                      style={{ color: 'var(--text-primary)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Place / City fuzzy search */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-semibold mb-1 text-text-secondary uppercase tracking-wider">
                  {labels.place}
                </label>
                <div className="relative">
                  {selectedCity ? (
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-bright" />
                  ) : (
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  )}
                  
                  <input
                    type="text"
                    required
                    value={cityInput}
                    onChange={(e) => {
                      setCityInput(e.target.value)
                      if (selectedCity && e.target.value !== selectedCity.name) {
                        setSelectedCity(null)
                      }
                    }}
                    placeholder={labels.placePlaceholder}
                    className="w-full bg-bg-elevated border border-bg-border rounded-lg pl-10 pr-10 py-2.5 text-sm outline-none transition-colors focus:border-gold-deep"
                    style={{
                      color: selectedCity ? 'var(--gold-bright)' : 'var(--text-primary)',
                      borderColor: selectedCity ? 'rgba(201,146,42,0.6)' : 'var(--bg-border)'
                    }}
                  />
                  {isSearching && (
                    <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-bright animate-spin" />
                  )}
                </div>

                {/* Autocomplete Dropdown List */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      className="absolute left-0 right-0 z-30 mt-1 max-h-48 overflow-y-auto rounded-lg border bg-bg-card p-1 shadow-lg backdrop-blur-md"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{ borderColor: 'rgba(201,146,42,0.3)' }}
                    >
                      {suggestions.map((city) => (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => {
                            setSelectedCity(city)
                            setCityInput(`${city.name}, ${city.state}`)
                            setShowSuggestions(false)
                          }}
                          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs hover:bg-white/5 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-text-primary">{city.name}</span>
                            <span className="text-[10px] text-text-muted">{city.state}</span>
                          </div>
                          <span className="text-[9px] bg-gold-deep/10 text-gold-bright px-1.5 py-0.5 rounded border border-gold-deep/20 font-sans">
                            {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 text-center font-medium bg-red-500/5 border border-red-500/10 p-2 rounded">
                  {errorMsg}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving || !name || !dob || !tob || !selectedCity}
                className="w-full py-3 mt-2 rounded-lg font-bold text-sm transition-all duration-150 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold-deep/10"
                style={{
                  background: 'linear-gradient(135deg, var(--gold-deep) 0%, #7a4e10 100%)',
                  color: '#ffffff',
                }}
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {labels.saving}
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    {labels.save}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
