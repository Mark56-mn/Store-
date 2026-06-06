-- Migration 0003: Add variations (sizes and colors) to products

ALTER TABLE public.products
ADD COLUMN sizes text[] DEFAULT '{}'::text[],
ADD COLUMN colors text[] DEFAULT '{}'::text[];
