import type { HoroscopeResponse } from '@/types/astro'

export interface JathagamProfile {
  name: string
  fatherName?: string
  motherName?: string
  hometown?: string
  gender: 'Male' | 'Female'
  dob: string           // "YYYY-MM-DD"
  tob: string           // "HH:mm"
  place: string         // display name
  lat: number
  lng: number
  utcOffset: number
}

export interface AstrologerDetails {
  name?: string
  address?: string
  phone?: string
}

export interface PathaRow {
  no: number
  nakshatra_ta: string
  padam: string
  karagam_ta: string
  kiragam_ta: string
}

export interface LuckyDetails {
  day_ta: string
  color_ta: string
  stone_ta: string
  deity_ta: string
  number: number
  vastu_direction_ta?: string
}

export interface BirthPanchangamData {
  sunrise?: string
  nakshatra?: Array<{ name: string; name_ta: string; end_nazhikai?: number; end_vinadi?: number }>
  tithi?: Array<{ name: string; name_ta: string; end_nazhikai?: number; end_vinadi?: number; paksha?: string }>
  yoga?: Array<{ name: string; name_ta: string; end_nazhikai?: number; end_vinadi?: number }>
  karana?: Array<{ name: string; name_ta: string; end_nazhikai?: number; end_vinadi?: number }>
  ritu?: string
  paksha?: string
  tamil_year?: string
  tamil_month?: string
}

export interface NakshatraMeta {
  mirugam_ta: string
  pakshi_ta: string
  maram_ta: string
  ganam_ta: string
  rajju_ta: string
  nadi_ta: string
  udumaga_param_nazhikai: number
  udumaga_param_vinadi: number
  padam_nazhikai: number
  padam_vinadi: number
  padupakshi_uyir_ta: string
  padupakshi_valar_ta: string
  padupakshi_thei_ta: string
}

export interface JathagamPDFData {
  profile: JathagamProfile
  astrologer: AstrologerDetails
  horoscope: HoroscopeResponse
  pathaSaram: PathaRow[]
  lagnapalanText: string
  nakshatrapalanText: string
  luckyDetails: LuckyDetails
  nakshatraMeta: NakshatraMeta
  birthPanchangam: BirthPanchangamData
  language: 'ta' | 'en'
}
