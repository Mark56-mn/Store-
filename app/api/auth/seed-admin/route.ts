import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const email = "admin@example.com";
    const password = "admin123";

    // Create user in auth schema
    const { data: user, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message.includes("User already registered")) {
         return NextResponse.json({ message: "Admin user already exists." });
      }
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (user.user) {
      // Create or update role to admin in profiles
      // The trigger might have inserted them as 'customer', we need to update it
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .update({ role: "admin" })
        .eq("id", user.user.id);

      if (profileError) {
         // fallback to insert if trigger failed
         await supabaseAdmin.from("profiles").upsert({ id: user.user.id, role: "admin" });
      }
    }

    return NextResponse.json({ message: "Admin user created successfully.", email, password });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
