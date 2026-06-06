# Kosmic Store

A modern storefront and admin dashboard built with Next.js, Tailwind CSS, Framer Motion, and Supabase.

## Features

- **Public Storefront:** Browse products with a modern, glassmorphic UI.
- **Admin Dashboard:** Manage products and store settings securely behind role-based access.
- **Supabase Integration:** Storage, Database (PostgreSQL), and Authentication provided by Supabase.
- **Image Uploader:** Drag-and-drop integrated uploader via Supabase Storage.

## Setup Instructions

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Supabase Project**
   Create a new project in your Supabase dashboard.

3. **Database Migration**
   Execute the migration SQL file located in `supabase/migrations/0001_initial.sql` in your Supabase SQL Editor.

4. **Environment Variables**
   Rename `.env.example` to `.env.local` or configure your hosting environment with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   APP_URL="http://localhost:3000"
   ```

5. **Seed Admin User**
   Once your project is running with the environment variables set, call the seed API:
   `POST /api/auth/seed-admin`
   This will create a default administrator:
   - Email: `admin@example.com`
   - Password: `admin123`
   
   *(You can also use the Supabase Auth UI or SQL Editor to manually set the `role` field in the `/public.profiles` table.)*

6. **Run the app**
   ```bash
   npm run dev
   ```

## Deployment
This project is Next.js (App Router) ready for Vercel. 
Ensure you provide the Supabase environment variables in Vercel before deploying.
