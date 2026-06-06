-- Migration 0004: Add external videos and store settings

-- Create store settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id int PRIMARY KEY DEFAULT 1,
    logo_url text,
    store_name text,
    store_description text,
    contact_email text,
    contact_phone text,
    customer_service_email text,
    customer_service_phone text,
    whatsapp_link text,
    tiktok_link text,
    facebook_link text,
    instagram_link text,
    pwa_enabled boolean DEFAULT true,
    pwa_icon_url text,
    pwa_theme_color text DEFAULT '#0f1117',
    pwa_background_color text DEFAULT '#0f1117',
    updated_at timestamp with time zone DEFAULT now()
);

-- Seed initial store settings
INSERT INTO public.store_settings (id, store_name, store_description)
VALUES (1, 'Kosmic Style', 'Premium fashion pieces for the modern individual.')
ON CONFLICT (id) DO NOTHING;

-- Create external videos table
CREATE TABLE IF NOT EXISTS public.external_videos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    video_url text NOT NULL,
    thumbnail_url text,
    external_link text,
    is_active boolean DEFAULT true,
    sort_order int DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

-- Update products table to add videos array if not exists
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS videos text[] DEFAULT '{}'::text[];

-- Set up RLS for store_settings
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Store settings are viewable by everyone" ON public.store_settings
    FOR SELECT USING (true);
CREATE POLICY "Store settings are modifiable by admins" ON public.store_settings
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );

-- Set up RLS for external_videos
ALTER TABLE public.external_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "External videos are viewable by everyone" ON public.external_videos
    FOR SELECT USING (is_active = true);
CREATE POLICY "External videos are viewable by admins" ON public.external_videos
    FOR SELECT USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );
CREATE POLICY "External videos are modifiable by admins" ON public.external_videos
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    );
