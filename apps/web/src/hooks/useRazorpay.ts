'use client'

import { useState } from 'react'
import api from '@/lib/api'
import { supabase } from '@/lib/supabase'

type CheckoutStatus = 'idle' | 'creating' | 'open' | 'verifying' | 'success' | 'error'

export const useRazorpay = () => {
  const [status, setStatus] = useState<CheckoutStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const startCheckout = async (plan: string, userPhone?: string) => {
    setError(null)
    setStatus('creating')

    let orderData: { id: string; amount: number; currency: string }
    try {
      // plan should be mapped to the actual plan ID in subscription config (e.g. 'PRO')
      const planId = plan === 'PRO_MONTHLY' || plan === 'PRO' ? 'PRO' : plan
      const json = await api.post('/subscription/create-order', { planId })

      if (!json.success || !json.data) {
        throw new Error(json.message ?? 'Order creation failed')
      }
      orderData = json.data
    } catch (e: any) {
      setStatus('error')
      setError(e.message || 'Failed to create payment order')
      return
    }

    setStatus('open')
    try {
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.id,
        name: 'JothiSoft PRO',
        description: 'Monthly PRO Subscription',
        prefill: { contact: userPhone },
        theme: { color: '#B8860B' }, // gold

        handler: async (response) => {
          setStatus('verifying')
          try {
            const vJson = await api.post('/subscription/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })

            if (!vJson.success) {
              throw new Error(vJson.message ?? 'Verification failed')
            }

            // Immediately refresh local Supabase session to fetch updated user_metadata
            try {
              await supabase.auth.refreshSession()
            } catch (sessErr) {
              console.error('Failed to auto-refresh session:', sessErr)
            }

            setStatus('success')
          } catch (err: any) {
            setStatus('error')
            setError(err.message || 'Payment verification failed')
          }
        },

        modal: {
          ondismiss: () => setStatus('idle'),
        },
      })

      rzp.open()
    } catch (err: any) {
      setStatus('error')
      setError(err.message || 'Failed to initialize Razorpay SDK')
    }
  }

  return { status, error, startCheckout }
}
