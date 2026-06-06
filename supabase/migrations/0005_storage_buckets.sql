-- Migration 0005: Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('product-videos', 'product-videos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('store-logo', 'store-logo', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('pwa-icons', 'pwa-icons', true) ON CONFLICT DO NOTHING;

-- Image bucket policies
CREATE POLICY "Public Access for image bucket" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admin Upload for image bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Video bucket policies
CREATE POLICY "Public Access for video bucket" ON storage.objects FOR SELECT USING (bucket_id = 'product-videos');
CREATE POLICY "Admin Upload for video bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-videos' AND auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Logo bucket policies
CREATE POLICY "Public Access for logo bucket" ON storage.objects FOR SELECT USING (bucket_id = 'store-logo');
CREATE POLICY "Admin Upload for logo bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'store-logo' AND auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- PWA bucket policies
CREATE POLICY "Public Access for pwa bucket" ON storage.objects FOR SELECT USING (bucket_id = 'pwa-icons');
CREATE POLICY "Admin Upload for pwa bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pwa-icons' AND auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
