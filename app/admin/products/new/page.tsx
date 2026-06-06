"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

import { ImageUploader } from "@/components/ImageUploader";

export default function NewProduct() {
  const [form, setForm] = useState({ name: "", description: "", selar_link: "", images: [] as string[] });
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from("products").insert([form]);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-3xl pb-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-white">Add Product</h1>
      <form onSubmit={handleSave} className="space-y-6 bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-[32px]">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Product Images</label>
          <ImageUploader images={form.images} setImages={img => setForm({...form, images: img})} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Product Name</label>
          <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
          <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={5} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Selar Link (Checkout URL)</label>
          <input required type="url" value={form.selar_link} onChange={e => setForm({...form, selar_link: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
        </div>
        <div className="pt-6 mt-6 border-t border-white/5">
          <button type="submit" disabled={saving} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-xl shadow-white/10">
            {saving ? "Saving..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
