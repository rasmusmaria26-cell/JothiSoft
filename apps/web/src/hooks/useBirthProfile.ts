import useSWR from 'swr'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type BirthProfile = Database['public']['Tables']['birth_profiles']['Row']

export function useBirthProfile() {
  return useSWR<BirthProfile | null>('user_birth_profile', async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null

    const { data, error } = await supabase
      .from('birth_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle()
    
    if (error) {
      console.error('Error fetching birth profile:', error)
      return null
    }

    return data || null
  }, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 3600000 // Cache for 1 hour
  })
}
