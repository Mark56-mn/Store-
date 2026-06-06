"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Reviews from "@/components/Reviews";

export default function PublicProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    params.then(({ id }) => {
      async function load() {
        const { data } = await supabase.from("products").select("*").eq("id", id).single();
        if (data) setProduct(data);
        setLoading(false);
      }
      load();
    });
  }, [params]);

  if (loading) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center">Product not found.</div>;
  }

  const handleBuyClick = () => {
    setShowModal(true);
  };

  const proceedToSelar = () => {
    window.location.href = product.selar_link;
  };

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
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
          <Link href="/admin/login" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 transition-all px-4 py-2 rounded-full cursor-pointer">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-100">Admin Mode</span>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 p-6 max-w-5xl mx-auto w-full pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-tr from-slate-900 to-slate-800 border border-white/10 rounded-[32px] overflow-hidden relative flex items-center justify-center p-2 backdrop-blur-2xl">
              <div className="w-full h-full rounded-[24px] overflow-hidden relative">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-600 absolute inset-0 flex items-center justify-center">No Image Available</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none"></div>
              </div>
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((img: string, i: number) => (
                  <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm p-1">
                    <div className="w-full h-full rounded-xl overflow-hidden relative">
                      <img src={img} alt={`${product.name} ${i+2}`} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            <div className="inline-block px-3 py-1 bg-violet-500/20 border border-violet-500/30 rounded-full text-violet-300 text-[10px] font-bold uppercase tracking-widest mb-4 w-fit">SKU: {product.id.slice(0,6).toUpperCase()}</div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-white">{product.name}</h1>
            <div className="prose prose-invert prose-slate mb-8 max-w-none">
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">{product.description}</p>
            </div>
            
            <div className="mt-auto pt-8 border-t border-white/10">
              <button 
                onClick={handleBuyClick}
                className="w-full py-4 bg-white text-slate-900 font-bold rounded-full hover:shadow-xl hover:shadow-white/10 transition-all text-lg tracking-tight"
              >
                Purchase via Selar
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <Reviews productId={product.id} />
      </main>

      <footer className="h-16 flex items-center justify-center bg-white/5 border-t border-white/5 mt-auto">
        <p className="text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>
          Secured by Selar & Supabase
          <span className="w-1.5 h-1.5 bg-violet-400 rounded-full"></span>
        </p>
      </footer>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-[340px] bg-slate-900 border border-white/20 shadow-2xl rounded-[32px] p-6 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3 mb-4 text-violet-400">
                <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <h4 className="font-bold">Selar Redirect</h4>
              </div>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                You will be redirected to our payment provider. If you don't have a Selar account, you will need to create one to complete your purchase.
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={proceedToSelar}
                  className="w-full px-4 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-neutral-200 transition-colors shadow-lg shadow-white/10"
                >
                  Continue to Payment
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-medium text-white hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
