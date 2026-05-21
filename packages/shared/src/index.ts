// ── Plans ────────────────────────────────────────────────────────────────────
export type Plan = 'FREE' | 'PRO' | 'PREMIUM'

// ── User & Auth ───────────────────────────────────────────────────────────────
export interface UserProfile {
  id: string
  email: string
  phone?: string
  name: string | null
  plan: Plan
  planExpiry: string | null   // ISO datetime
  language: 'ta' | 'en'
  createdAt: string
}

// ── Birth Profile (one per user) ──────────────────────────────────────────────
export interface BirthProfile {
  id: string
  userId: string
  name: string
  dob: string         // ISO date: '1990-06-15'
  tob: string         // HH:MM in 24h: '06:30'
  lat: number
  lng: number
  placeName: string
  createdAt: string
}

// ── City (for autocomplete) ───────────────────────────────────────────────────
export interface City {
  id: number
  name: string
  state: string | null
  lat: number
  lng: number
  utcOffset: number   // always 5.5 for India
}

// ── Panchangam ────────────────────────────────────────────────────────────────
export interface PanchangamData {
  date: string          // ISO date
  tithi: string         // Tamil name
  tithiNum: number      // 1–30
  nakshatra: string     // Tamil name
  nakshatraNum: number  // 1–27
  yogam: string
  karanam: string
  rahuKalam: string     // e.g. '10:30–12:00'
  yamagandam: string
  gulikakalam: string
  sunrise: string       // HH:MM
  sunset: string        // HH:MM
  specialDay: string | null
}

// ── Horoscope ─────────────────────────────────────────────────────────────────
export type PlanetKey = 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn' | 'rahu' | 'ketu'

export interface PlanetPosition {
  house: number       // 1–12
  degree: number      // 0–360 absolute
  retrograde: boolean
  nakshatra: string
  nakshatraNum: number
}

export interface HoroscopeData {
  lagna: number                             // 1–12 (ascendant house)
  lagnaSign: string                         // Tamil rasi name
  planets: Record<PlanetKey, PlanetPosition>
  dashaLord: string
  bhuktaLord: string
  dashaEnd: string                          // ISO date
  birthNakshatra: string
  birthNakshatraNum: number
}

// ── Dasha ─────────────────────────────────────────────────────────────────────
export interface DashaPeriod {
  lord: string
  startDate: string
  endDate: string
  bhukti: BhuktiPeriod[]
}

export interface BhuktiPeriod {
  lord: string
  startDate: string
  endDate: string
}

// ── Matching ──────────────────────────────────────────────────────────────────
export interface PoruthamsResult {
  total: number
  maxScore: number
  verdict: 'excellent' | 'good' | 'average' | 'poor'
  details: PoruthamsDetail[]
}

export interface PoruthamsDetail {
  name: string        // e.g. 'Dinam', 'Ganam'
  score: number
  maxScore: number
  status: 'pass' | 'partial' | 'fail'
}

// ── Numerology ────────────────────────────────────────────────────────────────
export interface NumerologyResult {
  nameNumber: number
  lifePathNumber: number
  destinyNumber: number
  rulingPlanet: string
  prediction: string
  characterBreakdown: Array<{ char: string; value: number }>
}

// ── API Response wrapper ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  code?: string     // e.g. 'plan_required', 'not_found'
}

// ── Plan hierarchy helper (for frontend gating checks) ────────────────────────
export const PLAN_RANK: Record<Plan, number> = {
  FREE: 0,
  PRO: 1,
  PREMIUM: 2,
}

export function canAccess(userPlan: Plan, required: Plan): boolean {
  return PLAN_RANK[userPlan] >= PLAN_RANK[required]
}
