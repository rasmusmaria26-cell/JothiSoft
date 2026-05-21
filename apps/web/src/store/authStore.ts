import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Plan, UserProfile } from '@jothisoft/shared'

interface AuthState {
  user: UserProfile | null
  isLoading: boolean
  plan: Plan
  // Actions
  setUser: (user: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      plan: 'FREE',

      setUser: (user) =>
        set({
          user,
          plan: user?.plan ?? 'FREE',
          isLoading: false,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      clearAuth: () =>
        set({
          user: null,
          plan: 'FREE',
          isLoading: false,
        }),
    }),
    {
      name: 'jothisoft-auth',
      partialize: (state) => ({ user: state.user, plan: state.plan }),
    }
  )
)
