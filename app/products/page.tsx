"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PublicProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-transparent">
      <header className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-8 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <Link href="/" className="text-lg font-semibold tracking-tight text-white">KOSMIC<span className="text-violet-400">STORE</span></Link>
        </div>
        <nav className="flex items-center gap-6">
          <div className="flex gap-4 text-sm font-medium text-slate-400 hidden sm:flex">
            <Link href="/" className="hover:text-white transition-colors">Storefront</Link>
            <Link href="/products" className="text-white">Products</Link>
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
          <Link href="/admin/login" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-all px-4 py-2 rounded-full cursor-pointer">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-100">Admin Mode</span>
          </Link>
        </nav>
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-4xl font-bold tracking-tight mb-12 text-white">All Products</h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse bg-white/5 border border-white/10 rounded-2xl h-80 backdrop-blur-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <motion.div 
                key={p.id} 
                className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all group flex flex-col h-full"
                whileHover={{ y: -5 }}
              >
                <div className="aspect-[4/3] bg-gradient-to-tr from-slate-900 to-slate-800 rounded-xl mb-4 overflow-hidden relative">
                   {p.images && p.images.length > 0 ? (
                     <img src={p.images[0]} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs font-medium">No Image</div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>
                   <span className="absolute bottom-2 left-3 text-[10px] font-bold text-slate-300">SKU: {p.id.slice(0,6).toUpperCase()}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1 text-white">{p.name}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-2">{p.description}</p>
                <Link href={`/product/${p.id}`} className="w-full inline-flex items-center justify-center py-2 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-400 text-sm font-bold group-hover:bg-violet-600 group-hover:text-white transition-all">
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <footer className="h-16 flex items-center justify-center bg-white/5 border-t border-white/5 mt-auto">
        <p className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>
          Secured by Selar & Supabase
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>
        </p>
      </footer>
    </div>
  );
}
