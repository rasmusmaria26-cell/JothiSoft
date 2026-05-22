-- =============================================================================
-- JothiSoft — SQL Migration Update
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- =============================================================================

-- 1. Add trial_expires_at if not exists
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMPTZ 
DEFAULT NOW() + INTERVAL '24 hours';

-- 2. Add payment_note if not exists
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS payment_note TEXT;

-- 3. Add is_admin flag and email column to public.users if not exists
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS email TEXT;

-- 4. Create subscription_history table
CREATE TABLE IF NOT EXISTS public.subscription_history (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  activated_by  TEXT        NOT NULL,
  plan          TEXT        NOT NULL,
  starts_at     TIMESTAMPTZ NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  payment_note  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Update trigger to set trial_expires_at on new subscription
CREATE OR REPLACE FUNCTION public.handle_new_subscription()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan, trial_expires_at)
  VALUES (NEW.id, 'FREE', NOW() + INTERVAL '24 hours')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 6. Enable RLS and setup policies for subscription_history
ALTER TABLE public.subscription_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "history_service_only" ON public.subscription_history;
CREATE POLICY "history_service_only" ON public.subscription_history
  USING (false); -- only accessible via service role key (our backend API)
