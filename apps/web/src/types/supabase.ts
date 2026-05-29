export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      birth_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          dob: string // 'YYYY-MM-DD'
          tob: string // 'HH:MM'
          place_name: string
          lat: string
          lng: string
          gender: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          dob: string
          tob: string
          place_name: string
          lat: string
          lng: string
          gender?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          dob?: string
          tob?: string
          place_name?: string
          lat?: string
          lng?: string
          gender?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
