"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/client";

export default function Storefront() {
  const [settings, setSettings] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("store_settings").select("*").eq("id", 1).single();
      if (data) setSettings(data);
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-transparent">
      <Navbar />
      <main className="flex-1 p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        <section className="relative bg-gradient-to-br from-white/5 to-white/0 rounded-[32px] p-10 border border-white/10 overflow-hidden min-h-[400px] flex sm:flex-row flex-col items-center justify-between group">
          <div className="relative z-10 max-w-lg">
            <div className="inline-block px-3 py-1 bg-violet-500/20 border border-violet-500/30 rounded-full text-violet-300 text-[10px] font-bold uppercase tracking-widest mb-4">Spring Collection</div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight text-white"
            >
              {settings?.store_name ? settings.store_name.split(' ')[0] : 'Modern'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">{settings?.store_name ? settings.store_name.split(' ').slice(1).join(' ') : 'Elegance'}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-sm leading-relaxed mb-6 whitespace-pre-wrap"
            >
              {settings?.store_description || "Discover premium fashion pieces perfectly crafted for the modern individual. Elevate your everyday style."}
            </motion.p>
            <Link href="/products" className="inline-block px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:shadow-xl hover:shadow-white/10 transition-all">
              Browse Collection
            </Link>
          </div>

          <div className="absolute inset-y-0 right-0 w-1/2 -z-10 opacity-60">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="Fashion background" className="w-full h-full object-cover object-right [mask-image:linear-gradient(to_right,transparent,black_50%)]" />
          </div>
        </section>
        
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">Featured Fits</h2>
            <Link href="/products" className="text-sm font-medium hover:text-white text-slate-400 transition-colors">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/10 transition-all group flex flex-col h-full"
                whileHover={{ y: -5 }}
              >
                <div className="aspect-[4/3] bg-gradient-to-tr from-slate-900 to-slate-800 rounded-xl mb-4 overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
                   <img src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80&sig=${i}`} alt={`Fashion look ${i}`} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity mix-blend-overlay" />
                   <span className="absolute bottom-2 left-3 text-[10px] font-bold text-slate-300 z-20">STYLE-0{i}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1 text-white">Signature Look {i}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-1">High-quality garments curated to elevate your everyday style.</p>
                <Link href={`/product/${i}`} className="w-full inline-flex items-center justify-center py-2 bg-violet-600/20 border border-violet-500/30 rounded-lg text-violet-400 text-sm font-bold group-hover:bg-violet-600 group-hover:text-white transition-all">
                  View Look
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <footer className="py-12 bg-black/50 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex flex-col gap-2">
               <span className="text-lg font-semibold tracking-tight text-white mb-2 uppercase break-all">{settings?.store_name || "KOSMIC"}</span>
               <p className="text-slate-400 text-sm max-w-xs">{settings?.store_description || "Premium fashion."}</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Connect</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              {settings?.instagram_link && <a href={settings.instagram_link} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Instagram</a>}
              {settings?.tiktok_link && <a href={settings.tiktok_link} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TikTok</a>}
              {settings?.whatsapp_link && <a href={settings.whatsapp_link} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp</a>}
              {settings?.facebook_link && <a href={settings.facebook_link} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a>}
            </div>
          </div>
          <div>
             <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-widest">Contact</h4>
             <div className="flex flex-col gap-3 text-sm text-slate-400">
               {settings?.contact_email && <span>{settings.contact_email}</span>}
               {settings?.contact_phone && <span>{settings.contact_phone}</span>}
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
