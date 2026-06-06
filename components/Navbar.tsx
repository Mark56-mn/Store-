"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        
        if (currentUser) {
          const { data } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single();
          setIsAdmin(data?.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Initial check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        const { data } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single();
        setIsAdmin(data?.role === 'admin');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-8 bg-white/5 backdrop-blur-md border-b border-white/10">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
          <span className="text-xl font-bold text-white">S</span>
        </div>
        <span className="text-lg font-semibold tracking-tight text-white">KOSMIC<span className="text-violet-400">STYLE</span></span>
      </Link>
      <nav className="flex items-center gap-6">
        <div className="flex gap-4 text-sm font-medium text-slate-400 hidden sm:flex items-center">
          <Link href="/" className="hover:text-white transition-colors">Storefront</Link>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
        </div>
        <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
        {user ? (
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link href="/admin/dashboard" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-all px-4 py-2 rounded-full cursor-pointer">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-100 hidden sm:inline">Admin</span>
              </Link>
            )}
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 text-slate-300">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                   <UserIcon className="w-4 h-4" />
                 </div>
                 <span className="text-sm font-medium hidden sm:block">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
               </div>
               <button onClick={handleSignOut} className="text-slate-400 hover:text-white transition-colors" title="Sign out">
                 <LogOut className="w-4 h-4" />
               </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             <Link href="/admin/login" className="text-sm font-medium text-white hover:text-violet-400 transition-colors">
               Sign In
             </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
