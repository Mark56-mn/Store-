-- Initial database schema for Kosmic Store

-- Extension required for uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: profiles
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role text DEFAULT 'customer'::text CHECK (role IN ('customer', 'admin')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: store_settings
CREATE TABLE public.store_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  store_name text DEFAULT 'My Store',
  store_description text DEFAULT 'Welcome to our store',
  logo_url text,
  contact_email text,
  contact_phone text,
  customer_service_email text,
  customer_service_phone text,
  whatsapp_link text,
  tiktok_link text,
  facebook_link text,
  instagram_link text,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert original row to ensure we always have id=1
INSERT INTO public.store_settings (id, store_name, store_description) VALUES (1, 'Kosmic Store', 'The new standard in digital commerce.');

-- Table: products
CREATE TABLE public.products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  description text,
  images text[] DEFAULT '{}'::text[],
  videos text[] DEFAULT '{}'::text[],
  selar_link text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-videos', 'product-videos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('store-logo', 'store-logo', true) ON CONFLICT DO NOTHING;

-- RLS Setup

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Admin Check Function
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Store Settings Policies
CREATE POLICY "Store settings are viewable by everyone." ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Store settings can be updated by admins." ON public.store_settings FOR UPDATE USING (is_admin());
CREATE POLICY "Store settings can be inserted by admins." ON public.store_settings FOR INSERT WITH CHECK (is_admin());

-- Products Policies
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Products can be modified by admins." ON public.products FOR ALL USING (is_admin());

-- Storage Policies
-- Viewable by anyone, upload/modify by admin
CREATE POLICY "Public buckets are viewable by everyone" ON storage.objects FOR SELECT USING ( bucket_id IN ('product-images','product-videos','store-logo') );
CREATE POLICY "Admins can upload to buckets" ON storage.objects FOR INSERT WITH CHECK ( bucket_id IN ('product-images','product-videos','store-logo') AND public.is_admin() );
CREATE POLICY "Admins can update buckets" ON storage.objects FOR UPDATE USING ( bucket_id IN ('product-images','product-videos','store-logo') AND public.is_admin() );
CREATE POLICY "Admins can delete buckets" ON storage.objects FOR DELETE USING ( bucket_id IN ('product-images','product-videos','store-logo') AND public.is_admin() );

-- Profile Trigger (On Auth User Create)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
