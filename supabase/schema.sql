-- ============================================================
-- JothiSoft — Supabase Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- ── Users (extends Supabase auth.users) ──────────────────────────────────────
CREATE TABLE public.users (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone       TEXT        UNIQUE NOT NULL,
  name        TEXT,
  language    TEXT        NOT NULL DEFAULT 'ta' CHECK (language IN ('ta', 'en')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create user row on signup via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.users (id, phone)
  VALUES (NEW.id, NEW.phone)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── Subscriptions ─────────────────────────────────────────────────────────────
CREATE TABLE public.subscriptions (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan                 TEXT        NOT NULL DEFAULT 'FREE'
                                   CHECK (plan IN ('FREE', 'PRO', 'PREMIUM')),
  starts_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at           TIMESTAMPTZ,                       -- NULL = FREE (never expires)
  razorpay_order_id    TEXT,
  razorpay_payment_id  TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)                                         -- one active subscription per user
);

-- Auto-create FREE subscription on user creation
CREATE OR REPLACE FUNCTION public.handle_new_subscription()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, plan)
  VALUES (NEW.id, 'FREE')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_user_created_subscription
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_subscription();


-- ── Birth Profile (one per user) ──────────────────────────────────────────────
CREATE TABLE public.birth_profiles (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  dob         DATE        NOT NULL,
  tob         TIME        NOT NULL,
  lat         NUMERIC(9,6) NOT NULL,
  lng         NUMERIC(9,6) NOT NULL,
  place_name  TEXT        NOT NULL,
  gender      TEXT        NOT NULL DEFAULT 'Male' CHECK (gender IN ('Male', 'Female')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)                                         -- one profile per user
);


-- ── Indian Cities (for location autocomplete) ─────────────────────────────────
CREATE TABLE public.cities (
  id          SERIAL      PRIMARY KEY,
  name        TEXT        NOT NULL,
  ascii_name  TEXT,                                       -- English ASCII version
  state       TEXT,
  lat         NUMERIC(9,6) NOT NULL,
  lng         NUMERIC(9,6) NOT NULL,
  utc_offset  NUMERIC(4,2) NOT NULL DEFAULT 5.50,        -- IST always
  population  INTEGER     DEFAULT 0
);

-- pg_trgm index for fuzzy search
CREATE INDEX cities_name_trgm_idx   ON public.cities USING GIN (name gin_trgm_ops);
CREATE INDEX cities_ascii_trgm_idx  ON public.cities USING GIN (ascii_name gin_trgm_ops);
CREATE INDEX cities_population_idx  ON public.cities (population DESC);

-- Stored function for fuzzy city search (called by FastAPI route)
CREATE OR REPLACE FUNCTION public.search_cities(query TEXT, result_limit INT DEFAULT 8)
RETURNS TABLE (id INT, name TEXT, state TEXT, lat NUMERIC, lng NUMERIC, utc_offset NUMERIC)
LANGUAGE sql STABLE AS $$
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


-- ── Panchangam Cache ──────────────────────────────────────────────────────────
CREATE TABLE public.panchangam_cache (
  cache_key   TEXT        PRIMARY KEY,   -- '{date}:{lat2dp}:{lng2dp}'
  data        JSONB       NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── Horoscope Cache ───────────────────────────────────────────────────────────
CREATE TABLE public.horoscope_cache (
  profile_id    UUID        PRIMARY KEY REFERENCES public.birth_profiles(id) ON DELETE CASCADE,
  data          JSONB       NOT NULL,
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── Content (prediction texts, nakshatra descriptions) ────────────────────────
CREATE TABLE public.content (
  id      UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  key     TEXT  NOT NULL,        -- e.g. 'nakshatra_ashwini', 'special_amavasai'
  lang    TEXT  NOT NULL CHECK (lang IN ('ta', 'en')),
  title   TEXT  NOT NULL,
  body    TEXT  NOT NULL,
  UNIQUE(key, lang)
);


-- ── Baby Names ────────────────────────────────────────────────────────────────
CREATE TABLE public.baby_names (
  id        SERIAL  PRIMARY KEY,
  name      TEXT    NOT NULL,
  nakshatra TEXT    NOT NULL,
  rasi      TEXT    NOT NULL,
  gender    TEXT    NOT NULL CHECK (gender IN ('M', 'F', 'U')),
  meaning   TEXT,
  syllable  TEXT
);

CREATE INDEX baby_names_nakshatra_idx ON public.baby_names (nakshatra);
CREATE INDEX baby_names_gender_idx    ON public.baby_names (gender);


-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.users             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.birth_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horoscope_cache   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panchangam_cache  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baby_names        ENABLE ROW LEVEL SECURITY;

-- Users: own row only
CREATE POLICY "users_own_row" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Subscriptions: own row only
CREATE POLICY "subscriptions_own_row" ON public.subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- Birth profiles: own row only
CREATE POLICY "birth_profiles_own_row" ON public.birth_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Horoscope cache: own profile only
CREATE POLICY "horoscope_cache_own" ON public.horoscope_cache
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM public.birth_profiles WHERE id = profile_id)
  );

-- Panchangam cache: any authenticated user can read (not sensitive)
CREATE POLICY "panchangam_cache_auth_read" ON public.panchangam_cache
  FOR SELECT USING (auth.role() = 'authenticated');

-- Cities, content, baby_names: public read (no personal data)
CREATE POLICY "cities_public_read"     ON public.cities      FOR SELECT USING (true);
CREATE POLICY "content_public_read"    ON public.content      FOR SELECT USING (true);
CREATE POLICY "baby_names_public_read" ON public.baby_names   FOR SELECT USING (true);


-- ── Nakshatra Porutham Matrix ─────────────────────────────────────────────────
-- Stores all 27×27 = 729 compatibility rows for the 10 porutham types.
-- Seeded once; can be updated via Supabase Dashboard without code changes.
CREATE TABLE public.nakshatra_porutham_matrix (
  id              SERIAL   PRIMARY KEY,
  boy_star_index  SMALLINT NOT NULL CHECK (boy_star_index BETWEEN 0 AND 26),
  girl_star_index SMALLINT NOT NULL CHECK (girl_star_index BETWEEN 0 AND 26),
  boy_star_name   TEXT     NOT NULL,
  girl_star_name  TEXT     NOT NULL,
  -- 10 Poruthams (TRUE = compatible, FALSE = incompatible)
  dinam           BOOLEAN  NOT NULL DEFAULT false,
  ganam           BOOLEAN  NOT NULL DEFAULT false,
  mahendram       BOOLEAN  NOT NULL DEFAULT false,
  stree_dirgham   BOOLEAN  NOT NULL DEFAULT false,
  yoni            BOOLEAN  NOT NULL DEFAULT false,
  rasi            BOOLEAN  NOT NULL DEFAULT false,
  rajju           BOOLEAN  NOT NULL DEFAULT false,
  vedha           BOOLEAN  NOT NULL DEFAULT false,
  vasya           BOOLEAN  NOT NULL DEFAULT false,
  varna           BOOLEAN  NOT NULL DEFAULT false,
  UNIQUE(boy_star_index, girl_star_index)
);

-- Public read (no personal data), service-role only write
ALTER TABLE public.nakshatra_porutham_matrix ENABLE ROW LEVEL SECURITY;
CREATE POLICY "porutham_public_read" ON public.nakshatra_porutham_matrix
  FOR SELECT USING (true);

-- Indexes for fast pair lookup
CREATE INDEX porutham_boy_idx  ON public.nakshatra_porutham_matrix (boy_star_index);
CREATE INDEX porutham_girl_idx ON public.nakshatra_porutham_matrix (girl_star_index);

-- ── SEED: Nakshatra names reference (for validation) ─────────────────────────
-- The actual 729-row seed is in: supabase/seeds/nakshatra_porutham.sql
-- Run it AFTER this schema: psql ... -f supabase/seeds/nakshatra_porutham.sql
-- Or paste it directly in the Supabase SQL Editor.

