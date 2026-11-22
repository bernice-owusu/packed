-- =========================================================================
-- PACKED BY DOLYN GHANA — SUPABASE CLOUD DATABASE SCHEMA
-- Run this in your Supabase Project Dashboard -> SQL Editor -> Run
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
    numeric_price NUMERIC NOT NULL,
    original_price TEXT,
    rating NUMERIC DEFAULT 5.0,
    review_count INTEGER DEFAULT 0,
    badges TEXT[] DEFAULT '{}',
    image TEXT NOT NULL,
    description TEXT,
    sku TEXT,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_count INTEGER DEFAULT 50,
    sizes TEXT[] DEFAULT '{}',
    varieties TEXT[] DEFAULT '{}',
    wholesale_box_quantity INTEGER,
    wholesale_box_price TEXT,
    ingredients TEXT
);

-- 3. Row Level Security (RLS) Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public clients to insert orders (guest checkout)
CREATE POLICY "Public insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Allow public / authorized reads of orders
CREATE POLICY "Public select orders" ON public.orders
    FOR SELECT USING (true);

-- Allow updates to order status (e.g. from Admin Portal)
CREATE POLICY "Public update orders" ON public.orders
    FOR UPDATE USING (true);

-- Allow public reads of product catalog
CREATE POLICY "Public read products" ON public.products
    FOR SELECT USING (true);

-- Allow updates to products
CREATE POLICY "Public manage products" ON public.products
    FOR ALL USING (true);

-- 4. Enable Supabase Realtime for instant multi-device order alerts
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
