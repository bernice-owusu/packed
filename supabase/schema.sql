-- =========================================================================
-- PACKED BY DOLYN GHANA — SUPABASE CLOUD DATABASE SCHEMA
-- Run this in your Supabase Project Dashboard -> SQL Editor -> Run
-- Safe to run multiple times (idempotent).
-- =========================================================================

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL DEFAULT NOW()::text,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_region TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_type TEXT NOT NULL,
    preferred_delivery_date TEXT,
    preferred_delivery_time TEXT,
    delivery_fee NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL,
    payment_ref TEXT,
    momo_number TEXT,
    payment_status TEXT NOT NULL DEFAULT 'Paid',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'New',
    custom_notes TEXT,
    tracking_number TEXT NOT NULL
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    numeric_price NUMERIC NOT NULL DEFAULT 0,
    original_price TEXT,
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    badges TEXT[] DEFAULT '{}',
    image TEXT NOT NULL,
    description TEXT,
    sku TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    is_pre_order BOOLEAN DEFAULT FALSE,
    stock_count INTEGER DEFAULT 50,
    sizes TEXT[] DEFAULT '{}',
    varieties TEXT[] DEFAULT '{}',
    is_customizable BOOLEAN DEFAULT FALSE,
    customization_options TEXT[] DEFAULT '{}',
    is_drug_or_healthcare BOOLEAN DEFAULT FALSE,
    dosage_or_usage TEXT,
    ingredients TEXT
);

-- Add any newer product columns to databases created before this update
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_pre_order BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_customizable BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS customization_options TEXT[] DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_drug_or_healthcare BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS dosage_or_usage TEXT;

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    count TEXT NOT NULL DEFAULT '0 Products',
    icon TEXT NOT NULL DEFAULT 'Package',
    description TEXT
);

-- 4. Coupons / Promo Codes Table
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    discount_percent NUMERIC NOT NULL DEFAULT 0,
    min_spend NUMERIC,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    description TEXT,
    usage_count INTEGER NOT NULL DEFAULT 0
);

-- 5. Media / Picture Library Table
CREATE TABLE IF NOT EXISTS public.media (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    uploaded_at TEXT NOT NULL DEFAULT NOW()::text,
    is_custom BOOLEAN DEFAULT FALSE,
    size TEXT
);

-- 6. Editable Website Content (hero slides, promo banners, about & contact)
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TEXT NOT NULL DEFAULT NOW()::text
);

-- =========================================================================
-- 7. Row Level Security (RLS) Policies
-- =========================================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Orders: guest checkout inserts, public reads, admin status updates
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public select orders" ON public.orders;
CREATE POLICY "Public select orders" ON public.orders
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public update orders" ON public.orders;
CREATE POLICY "Public update orders" ON public.orders
    FOR UPDATE USING (true);

-- Products
DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products" ON public.products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public manage products" ON public.products;
CREATE POLICY "Public manage products" ON public.products
    FOR ALL USING (true) WITH CHECK (true);

-- Categories
DROP POLICY IF EXISTS "Public manage categories" ON public.categories;
CREATE POLICY "Public manage categories" ON public.categories
    FOR ALL USING (true) WITH CHECK (true);

-- Coupons
DROP POLICY IF EXISTS "Public manage coupons" ON public.coupons;
CREATE POLICY "Public manage coupons" ON public.coupons
    FOR ALL USING (true) WITH CHECK (true);

-- Media library
DROP POLICY IF EXISTS "Public manage media" ON public.media;
CREATE POLICY "Public manage media" ON public.media
    FOR ALL USING (true) WITH CHECK (true);

-- Editable website content
DROP POLICY IF EXISTS "Public manage site content" ON public.site_content;
CREATE POLICY "Public manage site content" ON public.site_content
    FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================
-- 8. Enable Supabase Realtime for instant multi-device sync
-- =========================================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.coupons;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.media;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_content;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
