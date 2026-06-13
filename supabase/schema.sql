-- ============================================================
-- Univers du Zen — Schéma Supabase
-- Coller dans : Supabase > SQL Editor > New query > Run
-- ============================================================

-- ----------------------------------------------------------------
-- TABLE : orders
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  reference         TEXT,
  email             TEXT        NOT NULL,
  status            TEXT        NOT NULL DEFAULT 'pending_payment',
  items             JSONB       NOT NULL DEFAULT '[]',
  shipping_address  JSONB       NOT NULL DEFAULT '{}',
  country_code      TEXT,
  locale            TEXT,
  payment_method    TEXT,
  subtotal_eur      NUMERIC(10,2),
  shipping_eur      NUMERIC(10,2) DEFAULT 0,
  vat_rate          NUMERIC(6,4),
  vat_amount_eur    NUMERIC(10,2),
  total_eur         NUMERIC(10,2),
  mollie_payment_id TEXT,
  supplier_order_id TEXT,
  tracking_number   TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Index de performance
CREATE INDEX IF NOT EXISTS orders_email_idx      ON public.orders (email);
CREATE INDEX IF NOT EXISTS orders_status_idx     ON public.orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);

-- ----------------------------------------------------------------
-- RLS (Row Level Security)
-- ----------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Un utilisateur connecté peut lire ses propres commandes (par email)
CREATE POLICY "users_read_own_orders"
  ON public.orders
  FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

-- Note : le Service Role (SUPABASE_SERVICE_ROLE_KEY) bypass RLS
-- automatiquement — pas de policy nécessaire pour les routes API.

-- ----------------------------------------------------------------
-- Trigger updated_at
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ----------------------------------------------------------------
-- Variables d'environnement nécessaires (.env.local)
-- ----------------------------------------------------------------
-- NEXT_PUBLIC_SUPABASE_URL        = https://xxxx.supabase.co
-- NEXT_PUBLIC_SUPABASE_ANON_KEY   = eyJ...
-- SUPABASE_SERVICE_ROLE_KEY       = eyJ...  (secret, jamais exposé côté client)
-- NEXT_PUBLIC_SITE_URL            = http://localhost:3000 (prod: https://universduzen.com)
-- ADMIN_EMAIL                     = boutiqueambiancejapon@gmail.com
-- MOLLIE_API_KEY                  = test_xxxx ou live_xxxx
-- RETINA_API_TOKEN                = votre token Aiku
-- RETINA_API_BASE                 = https://app.aiku.io/app/re-api
