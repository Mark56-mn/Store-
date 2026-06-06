import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const { data: settings } = await supabase.from("store_settings").select("*").eq("id", 1).single();

  const manifest = {
    name: settings?.store_name || "Kosmic Store",
    short_name: settings?.store_name || "Kosmic",
    description: settings?.store_description || "Premium Store",
    start_url: "/",
    display: "standalone",
    background_color: settings?.pwa_background_color || "#0f1117",
    theme_color: settings?.pwa_theme_color || "#0f1117",
    icons: settings?.pwa_icon_url ? [
      {
        src: settings.pwa_icon_url,
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: settings.pwa_icon_url,
        sizes: "512x512",
        type: "image/png"
      }
    ] : [
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png"
      }
    ]
  };

  return NextResponse.json(manifest);
}
