-- ============================================================
-- JothiSoft — Supabase Security Hardening Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- Fixes ALL advisories flagged by Supabase Security Advisor:
--
--  1. Revoke EXECUTE on SECURITY DEFINER trigger functions from
--     anon + authenticated roles (they are trigger-only, not RPC endpoints)
--  2. Fix mutable search_path on all SECURITY DEFINER functions
--  3. Move pg_trgm extension from public → extensions schema
--     (recreates indexes that depend on it)
-- ============================================================


-- ────────────────────────────────────────────────────────────────────────────
-- 1. REVOKE EXECUTE on trigger-only SECURITY DEFINER functions
--    These are fired by triggers and must NOT be callable via RPC.
-- ────────────────────────────────────────────────────────────────────────────

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_subscription() FROM anon, authenticated;


-- ────────────────────────────────────────────────────────────────────────────
-- 2. is_admin(): revoke public RPC access + fix search_path
--    This helper is used by RLS policies and should not be a public endpoint.
-- ────────────────────────────────────────────────────────────────────────────

REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;

-- Recreate is_admin() with a pinned search_path to prevent search_path injection
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  RETURN (
    SELECT is_admin
    FROM public.users
    WHERE id = auth.uid()
  );
END;
$$;

-- Keep execute restricted to postgres (service role) only
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, authenticated;


-- ────────────────────────────────────────────────────────────────────────────
-- 3. Fix mutable search_path on handle_new_user()
--    Recreate with SET search_path to prevent search_path hijacking attacks.
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.users (id, phone)
  VALUES (NEW.id, NEW.phone)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure still not callable via RPC
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;


-- ────────────────────────────────────────────────────────────────────────────
-- 4. Fix mutable search_path on handle_new_subscription()
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan)
  VALUES (NEW.id, 'FREE')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Ensure still not callable via RPC
REVOKE EXECUTE ON FUNCTION public.handle_new_subscription() FROM anon, authenticated;


-- ────────────────────────────────────────────────────────────────────────────
-- 5. Fix mutable search_path on search_cities()
--    This is a public-read function so we keep EXECUTE for anon/authenticated
--    but pin the search_path to prevent injection.
--    Note: search_cities uses LANGUAGE sql so we switch to SECURITY INVOKER
--    (it only SELECTs from public.cities which has a public-read RLS policy).
-- ────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.search_cities(query TEXT, result_limit INT DEFAULT 8)
RETURNS TABLE (id INT, name TEXT, state TEXT, lat NUMERIC, lng NUMERIC, utc_offset NUMERIC)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public, extensions, pg_catalog
AS $$
  SELECT id, name, state, lat, lng, utc_offset
  FROM public.cities
  WHERE
    name ILIKE '%' || query || '%'
    OR ascii_name ILIKE '%' || query || '%'
    OR similarity(name, query) > 0.2
  ORDER BY
    similarity(name, query) DESC,
    population DESC
  LIMIT result_limit;
$$;


-- ────────────────────────────────────────────────────────────────────────────
-- 6. Move pg_trgm from public schema to extensions schema
--
--    Supabase projects have a dedicated `extensions` schema for this purpose.
--    We must:
--      a) Drop the GIN indexes that depend on pg_trgm operators
--      b) Drop the extension from public
--      c) Install it in the extensions schema
--      d) Recreate the GIN indexes (they will use the operator from extensions)
--
--    NOTE: The `extensions` schema is always in the search_path on Supabase,
--    so gin_trgm_ops and similarity() remain available everywhere.
-- ────────────────────────────────────────────────────────────────────────────

-- a) Drop dependent GIN indexes first (they use gin_trgm_ops from pg_trgm)
DROP INDEX IF EXISTS public.cities_name_trgm_idx;
DROP INDEX IF EXISTS public.cities_ascii_trgm_idx;

-- b) Drop the extension from public schema
DROP EXTENSION IF EXISTS pg_trgm;

-- c) Install pg_trgm in the extensions schema (Supabase best practice)
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

-- d) Recreate the GIN indexes (they now resolve gin_trgm_ops via extensions schema)
CREATE INDEX IF NOT EXISTS cities_name_trgm_idx
  ON public.cities USING GIN (name extensions.gin_trgm_ops);

CREATE INDEX IF NOT EXISTS cities_ascii_trgm_idx
  ON public.cities USING GIN (ascii_name extensions.gin_trgm_ops);


-- ────────────────────────────────────────────────────────────────────────────
-- VERIFICATION QUERIES (optional — run these after applying the migration)
-- ────────────────────────────────────────────────────────────────────────────

/*
-- Check that EXECUTE is no longer granted to anon/authenticated on trigger funcs:
SELECT grantee, routine_name, privilege_type
FROM information_schema.routine_privileges
WHERE routine_schema = 'public'
  AND routine_name IN ('handle_new_user', 'handle_new_subscription', 'is_admin')
  AND grantee IN ('anon', 'authenticated');
-- Expected: 0 rows

-- Check that pg_trgm is now in extensions schema (not public):
SELECT extname, extnamespace::regnamespace
FROM pg_extension
WHERE extname = 'pg_trgm';
-- Expected: pg_trgm | extensions

-- Check search_path is pinned on all our functions:
SELECT proname, proconfig
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('handle_new_user', 'handle_new_subscription', 'is_admin', 'search_cities');
-- Expected: proconfig includes search_path setting for each
*/
