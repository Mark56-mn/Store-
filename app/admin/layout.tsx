"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Package, Settings, LayoutDashboard, MessageSquare } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const nav = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-transparent flex relative">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 backdrop-blur-md flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-600 rounded-md flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-xs font-bold text-white">S</span>
            </div>
            KOSMIC ADMIN
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors font-medium",
                  active 
                    ? "bg-violet-600/20 border border-violet-500/30 text-violet-400" 
                    : "text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 flex items-center px-8 border-b border-white/10 bg-white/5 backdrop-blur-md shrink-0">
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white hidden md:block">
              View Storefront &rarr;
            </Link>
          </div>
        </header>
        <div className="p-8 overflow-auto flex-1">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
