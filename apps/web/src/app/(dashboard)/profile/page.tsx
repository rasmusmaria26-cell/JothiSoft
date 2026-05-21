'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Calendar, Clock, MapPin, Save, Trash2, Edit3, CheckCircle, AlertCircle } from 'lucide-react'
import { PlaceSearch } from '@/components/astro/PlaceSearch'
import { CityData } from '@/types/astro'
import api from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'

interface BirthProfile {
  id: string
  name: string
  dob: string
  tob: string
  lat: number
  lng: number
  place_name: string
}

export default function ProfilePage() {
  const { language } = useLanguage()
  const [profile, setProfile] = useState<BirthProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form Fields
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('')
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null)

  const labels = {
    ta: {
      title: 'ஜனன விவரங்கள்',
      subtitle: 'உங்கள் ஜாதகம் மற்றும் பஞ்சாங்கக் கணிப்புகளுக்கான ஜனன விவரங்களைச் சேமிக்கவும்',
      name: 'பெயர்',
      dob: 'பிறந்த தேதி',
      tob: 'பிறந்த நேரம்',
      place: 'பிறந்த இடம்',
      save: 'விவரங்களைச் சேமிக்கவும்',
      saving: 'சேமிக்கப்படுகிறது...',
      edit: 'விவரங்களைத் திருத்தவும்',
      delete: 'விவரங்களை நீக்கவும்',
      noProfile: 'சேமிக்கப்பட்ட ஜனன விவரங்கள் எதுவும் இல்லை. கீழே புதிய விவரங்களை உள்ளிடவும்.',
      successSave: 'ஜனன விவரங்கள் வெற்றிகரமாகச் சேமிக்கப்பட்டன!',
      successDelete: 'ஜனன விவரங்கள் வெற்றிகரமாக நீக்கப்பட்டன!',
      errorFetch: 'விவரங்களை ஏற்றுவதில் பிழை ஏற்பட்டது.',
      errorSave: 'விவரங்களைச் சேமிப்பதில் பிழை ஏற்பட்டது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
      errorDelete: 'விவரங்களை நீக்குவதில் பிழை ஏற்பட்டது.',
    },
    en: {
      title: 'Birth Profile Manager',
      subtitle: 'Save and manage your birth details for instant calculations across all astrology screens',
      name: 'Name',
      dob: 'Date of Birth',
      tob: 'Time of Birth',
      place: 'Birth Place',
      save: 'Save Birth Details',
      saving: 'Saving...',
      edit: 'Edit Details',
      delete: 'Delete Profile',
      noProfile: 'No saved birth profile found. Create one below to enable autofill features.',
      successSave: 'Birth details saved successfully!',
      successDelete: 'Birth profile deleted successfully!',
      errorFetch: 'Failed to retrieve birth profile.',
      errorSave: 'Failed to save birth profile. Please try again.',
      errorDelete: 'Failed to delete birth profile.',
    }
  }[language]

  // Load Profile
  const loadProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/profile/birth-profiles')
      if (res.success && res.data) {
        const p: BirthProfile = res.data
        setProfile(p)
        setName(p.name)
        setDob(p.dob)
        setTob(p.tob.slice(0, 5)) // Format HH:MM
        setSelectedCity({
          id: 0,
          name: p.place_name.split(',')[0],
          ascii_name: p.place_name.split(',')[0],
          state: p.place_name.split(',')[1]?.trim() || '',
          country: 'IN',
          latitude: p.lat,
          longitude: p.lng,
          utc_offset: 5.5
        })
      } else {
        setProfile(null)
      }
    } catch (err) {
      console.error(err)
      setError(labels.errorFetch)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  // Save Profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    if (!selectedCity) {
      setError(language === 'ta' ? 'பிறந்த இடத்தைத் தேர்ந்தெடுக்கவும்' : 'Please select a birth place')
      setSaving(false)
      return
    }

    try {
      const payload = {
        name,
        dob,
        tob: tob.length === 5 ? `${tob}:00` : tob, // Ensure HH:MM:SS format
        lat: selectedCity.latitude,
        lng: selectedCity.longitude,
        place_name: `${selectedCity.name}, ${selectedCity.state || selectedCity.country}`,
      }

      const res = await api.post('/profile/birth-profiles', payload)

      if (res.success && res.data) {
        setSuccess(labels.successSave)
        setProfile(res.data)
        setIsEditing(false)
      } else {
        throw new Error()
      }
    } catch (err) {
      console.error(err)
      setError(labels.errorSave)
    } finally {
      setSaving(false)
    }
  }

  // Delete Profile
  const handleDelete = async () => {
    if (!profile) return
    if (!confirm(language === 'ta' ? 'உங்கள் ஜனன விவரங்களை நீக்க விரும்புகிறீர்களா?' : 'Are you sure you want to delete your saved birth profile?')) return

    setError(null)
    setSuccess(null)
    try {
      const res = await api.delete(`/profile/birth-profiles/${profile.id}`)
      if (res.success) {
        setSuccess(labels.successDelete)
        setProfile(null)
        setName('')
        setDob('')
        setTob('')
        setSelectedCity(null)
        setIsEditing(true)
      } else {
        throw new Error()
      }
    } catch (err) {
      console.error(err)
      setError(labels.errorDelete)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-text-muted flex flex-col items-center justify-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: 'var(--gold-mid)' }} />
        {language === 'ta' ? 'விவரங்கள் ஏற்றப்படுகின்றன...' : 'Loading profile details...'}
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      {/* Page Header */}
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-4xl font-bold text-gold-bright flex items-center justify-center sm:justify-start gap-3">
          <User className="h-6 sm:h-8 w-6 sm:w-8" style={{ color: 'var(--cat-numerology)' }} />
          {labels.title}
        </h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
          {labels.subtitle}
        </p>
      </div>

      {/* Messaging */}
      {success && (
        <div className="p-4 mb-6 text-sm text-green-400 bg-green-950/30 border border-green-900/50 rounded-xl flex items-center gap-3 justify-center">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 mb-6 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-xl flex items-center gap-3 justify-center">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {profile && !isEditing ? (
        /* Saved Profile Display Card */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[var(--radius-lg)] border p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">{labels.name}</span>
              <p className="text-lg font-bold" style={{ color: 'var(--gold-bright)' }}>{profile.name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">{labels.place}</span>
              <p className="text-lg font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                <MapPin size={16} style={{ color: 'var(--gold-mid)' }} />
                {profile.place_name}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">{labels.dob}</span>
              <p className="text-lg font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                <Calendar size={16} style={{ color: 'var(--gold-mid)' }} />
                {profile.dob}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-text-muted font-semibold block uppercase tracking-wider">{labels.tob}</span>
              <p className="text-lg font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                <Clock size={16} style={{ color: 'var(--gold-mid)' }} />
                {profile.tob.slice(0, 5)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 border-t pt-6" style={{ borderColor: 'var(--bg-border)' }}>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 py-3 rounded-[var(--radius-md)] border font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/5"
              style={{ borderColor: 'var(--bg-border)', color: 'var(--text-primary)' }}
            >
              <Edit3 size={16} />
              {labels.edit}
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 rounded-[var(--radius-md)] border border-red-900/40 text-red-400 font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer hover:bg-red-950/20"
            >
              <Trash2 size={16} />
              {labels.delete}
            </button>
          </div>
        </motion.div>
      ) : (
        /* Create/Edit Profile Form */
        <motion.form
          onSubmit={handleSave}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[var(--radius-lg)] border p-6 sm:p-8 space-y-5 shadow-xl relative"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-border)' }}
        >
          {!profile && (
            <p className="text-xs text-center border-b pb-4 mb-2" style={{ color: 'var(--text-muted)', borderColor: 'var(--bg-border)' }}>
              {labels.noProfile}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {labels.name}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="எ.கா. இராமன்"
                required
                className="w-full bg-transparent px-3 py-2.5 text-sm rounded-[var(--radius-md)] border outline-none transition-all"
                style={{
                  background: 'var(--bg-elevated)',
                  borderColor: 'var(--bg-border)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Birth Place */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {labels.place}
              </label>
              <div className="relative z-50">
                <PlaceSearch
                  onSelect={setSelectedCity}
                  selectedCity={selectedCity}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {labels.dob}
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  required
                  className="w-full bg-transparent pl-10 pr-3 py-2.5 text-sm rounded-[var(--radius-md)] border outline-none transition-all"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--bg-border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>

            {/* Time of Birth */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary">
                {labels.tob}
              </label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input
                  type="time"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                  required
                  className="w-full bg-transparent pl-10 pr-3 py-2.5 text-sm rounded-[var(--radius-md)] border outline-none transition-all"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--bg-border)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 border-t pt-6 mt-4" style={{ borderColor: 'var(--bg-border)' }}>
            {profile && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 rounded-[var(--radius-md)] border font-semibold text-sm transition-all duration-150 cursor-pointer hover:bg-white/5"
                style={{ borderColor: 'var(--bg-border)', color: 'var(--text-muted)' }}
              >
                {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
              </button>
            )}
            <button
              type="submit"
              disabled={saving || !name || !dob || !tob || !selectedCity}
              className="flex-1 py-3 rounded-[var(--radius-md)] font-bold text-sm transition-all duration-150 disabled:opacity-50 hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              style={{ background: 'var(--gold-deep)', color: '#1a1209' }}
            >
              <Save size={16} />
              {saving ? labels.saving : labels.save}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  )
}
