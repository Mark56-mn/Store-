"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Package, Settings, LayoutDashboard, MessageSquare, Menu, X, Video } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
    { name: "External Videos", href: "/admin/videos", icon: Video },
    { name: "Reviews", href: "/admin/reviews", icon: MessageSquare },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-transparent flex relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "w-64 border-r border-white/10 bg-[#0f1117] md:bg-white/5 backdrop-blur-md flex flex-col z-50 fixed md:static inset-y-0 left-0 transform transition-transform duration-200 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <span className="font-bold tracking-tight text-white flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-blue-600 rounded-md flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-xs font-bold text-white">S</span>
            </div>
            KOSMIC ADMIN
          </span>
          <button 
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <header className="h-16 flex items-center px-4 md:px-8 border-b border-white/10 bg-white/5 backdrop-blur-md shrink-0">
          <button 
            className="md:hidden text-slate-400 hover:text-white mr-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/" className="text-sm font-medium text-slate-400 hover:text-white">
              View Storefront &rarr;
            </Link>
          </div>
        </header>
        <div className="p-4 md:p-8 overflow-auto flex-1">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
