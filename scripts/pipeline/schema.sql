-- ============================================
-- Univers du Zen — Supabase Schema
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PRODUITS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku             TEXT UNIQUE NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  name_fr         TEXT NOT NULL,
  name_nl         TEXT,
  description_fr  TEXT,
  description_nl  TEXT,
  meta_desc_fr    TEXT,
  meta_desc_nl    TEXT,
  category        TEXT NOT NULL,
  subcategory     TEXT,
  images          TEXT[] DEFAULT '{}',
  wholesale_gbp   NUMERIC(10,4) NOT NULL,
  retail_eur      NUMERIC(10,2) NOT NULL,
  compare_at_eur  NUMERIC(10,2),
  stock_status    TEXT DEFAULT 'Normal' CHECK (stock_status IN ('Normal','Low','VeryLow','OutOfStock')),
  stock_qty       INTEGER DEFAULT 0,
  country_origin  TEXT,
  is_vegan        BOOLEAN DEFAULT FALSE,
  is_organic      BOOLEAN DEFAULT FALSE,
  is_cruelty_free BOOLEAN DEFAULT TRUE,
  cpnp_number     TEXT,
  tags            TEXT[] DEFAULT '{}',
  is_best_seller  BOOLEAN DEFAULT FALSE,
  is_published    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLIENTS
-- ============================================
CREATE TABLE IF NOT EXISTS customers (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT NOT NULL,
  first_name      TEXT,
  last_name       TEXT,
  phone           TEXT,
  loyalty_points  INTEGER DEFAULT 0,
  loyalty_tier    TEXT DEFAULT 'Cercle Jade' CHECK (loyalty_tier IN ('Cercle Jade','Cercle Bambou','Cercle Lotus','Cercle Or')),
  locale          TEXT DEFAULT 'fr-BE',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger création client après inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO customers (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- ADRESSES
-- ============================================
CREATE TABLE IF NOT EXISTS addresses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id   UUID REFERENCES customers(id) ON DELETE CASCADE,
  label         TEXT DEFAULT 'Domicile',
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  line1         TEXT NOT NULL,
  line2         TEXT,
  city          TEXT NOT NULL,
  postal_code   TEXT NOT NULL,
  country_code  TEXT NOT NULL DEFAULT 'BE',
  phone         TEXT,
  is_default    BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMANDES
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference           TEXT UNIQUE NOT NULL,
  customer_id         UUID REFERENCES customers(id),
  customer_email      TEXT NOT NULL,
  shipping_address    JSONB NOT NULL,
  billing_address     JSONB,
  country_code        TEXT NOT NULL,
  subtotal_eur        NUMERIC(10,2) NOT NULL,
  vat_rate            NUMERIC(5,4) NOT NULL,
  vat_amount_eur      NUMERIC(10,2) NOT NULL,
  shipping_eur        NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_eur           NUMERIC(10,2) NOT NULL,
  mollie_payment_id   TEXT,
  mollie_status       TEXT,
  aw_order_id         TEXT,
  status              TEXT DEFAULT 'pending_payment'
                        CHECK (status IN ('pending_payment','paid','processing','shipped','delivered','cancelled','refunded')),
  is_cross_border     BOOLEAN DEFAULT FALSE,
  notes               TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Référence auto : UDZ-YYYYMMDD-XXXX
CREATE OR REPLACE FUNCTION generate_order_reference()
RETURNS TEXT AS $$
DECLARE
  seq INT;
BEGIN
  SELECT COUNT(*) + 1 INTO seq FROM orders
  WHERE DATE(created_at) = CURRENT_DATE;
  RETURN 'UDZ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(seq::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- LIGNES DE COMMANDE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID REFERENCES products(id),
  sku             TEXT NOT NULL,
  name_fr         TEXT NOT NULL,
  quantity        INTEGER NOT NULL,
  unit_price_eur  NUMERIC(10,2) NOT NULL,
  total_eur       NUMERIC(10,2) NOT NULL
);

-- ============================================
-- WISHLIST
-- ============================================
CREATE TABLE IF NOT EXISTS wishlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- ============================================
-- TVA / OSS
-- ============================================
CREATE TABLE IF NOT EXISTS vat_transactions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id          UUID REFERENCES orders(id),
  country_code      TEXT NOT NULL,
  quarter           TEXT NOT NULL, -- ex: '2026-Q2'
  amount_excl_vat   NUMERIC(10,2) NOT NULL,
  vat_rate          NUMERIC(5,4) NOT NULL,
  vat_amount        NUMERIC(10,2) NOT NULL,
  is_cross_border   BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Vue OSS par trimestre et pays
CREATE OR REPLACE VIEW oss_quarterly_report AS
SELECT
  quarter,
  country_code,
  COUNT(*)                            AS order_count,
  SUM(amount_excl_vat)               AS total_excl_vat,
  SUM(vat_amount)                    AS total_vat,
  SUM(amount_excl_vat + vat_amount)  AS total_incl_vat,
  MAX(vat_rate)                       AS vat_rate,
  is_cross_border
FROM vat_transactions
GROUP BY quarter, country_code, is_cross_border
ORDER BY quarter DESC, country_code;

-- Vue seuil OSS cross-border par année
CREATE OR REPLACE VIEW oss_threshold_tracker AS
SELECT
  EXTRACT(YEAR FROM created_at)::TEXT AS year,
  SUM(amount_excl_vat)                AS total_cross_border_excl_vat,
  10000 - SUM(amount_excl_vat)        AS remaining_to_threshold
FROM vat_transactions
WHERE is_cross_border = TRUE
GROUP BY EXTRACT(YEAR FROM created_at)
ORDER BY year DESC;

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE customers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders       ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists    ENABLE ROW LEVEL SECURITY;

-- Clients : lecture/modification de son propre profil
CREATE POLICY "customers_own" ON customers
  FOR ALL USING (auth.uid() = id);

-- Adresses : son propre
CREATE POLICY "addresses_own" ON addresses
  FOR ALL USING (auth.uid() = customer_id);

-- Commandes : ses propres commandes
CREATE POLICY "orders_own" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

-- Order items : via ses commandes
CREATE POLICY "order_items_own" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
      AND o.customer_id = auth.uid()
    )
  );

-- Wishlists : les siennes
CREATE POLICY "wishlists_own" ON wishlists
  FOR ALL USING (auth.uid() = customer_id);

-- Produits : lecture publique
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_published = TRUE);
