"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { ImageUploader } from "@/components/ImageUploader";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [settings, setSettings] = useState({
    store_name: "",
    store_description: "",
    contact_email: "",
    contact_phone: "",
    customer_service_email: "",
    customer_service_phone: "",
    whatsapp_link: "",
    tiktok_link: "",
    facebook_link: "",
    instagram_link: "",
    logo_url: "",
    pwa_enabled: true,
    pwa_icon_url: "",
    pwa_theme_color: "#0f1117",
    pwa_background_color: "#0f1117"
  });

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.from("store_settings").select("*").eq("id", 1).single();
      if (data) setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setSettings(s => ({ ...s, [e.target.name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("store_settings")
      .upsert({ id: 1, ...settings, updated_at: new Date().toISOString() });

    if (error) {
      setMessage("Error saving settings.");
    } else {
      setMessage("Settings saved successfully.");
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8 text-white">Store Settings</h1>
      
      {message && (
        <div className={`p-4 rounded-lg mb-6 text-sm ${message.includes("Error") ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 bg-white/5 border border-white/10 backdrop-blur-sm p-6 rounded-[32px]">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">General</h2>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Store Logo</label>
            <ImageUploader 
              images={settings.logo_url ? [settings.logo_url] : []} 
              setImages={(imgs) => setSettings(s => ({ ...s, logo_url: imgs[0] || "" }))} 
              type="store-logo" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Store Name</label>
            <input name="store_name" value={settings.store_name || ""} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
            <textarea name="store_description" value={settings.store_description || ""} onChange={handleChange} rows={3} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5">
          <h2 className="text-xl font-semibold text-white">Contact & Support</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Contact Email</label>
              <input name="contact_email" value={settings.contact_email || ""} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Contact Phone</label>
              <input name="contact_phone" value={settings.contact_phone || ""} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/5">
          <h2 className="text-xl font-semibold text-white">Social Links</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">WhatsApp</label>
              <input name="whatsapp_link" value={settings.whatsapp_link || ""} onChange={handleChange} placeholder="https://wa.me/..." className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Instagram</label>
              <input name="instagram_link" value={settings.instagram_link || ""} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">TikTok</label>
              <input name="tiktok_link" value={settings.tiktok_link || ""} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Facebook</label>
              <input name="facebook_link" value={settings.facebook_link || ""} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h2 className="text-xl font-semibold text-white">PWA / App Settings</h2>
          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-6">
              <input type="checkbox" name="pwa_enabled" checked={settings.pwa_enabled} onChange={handleChange} className="w-5 h-5 accent-violet-500" />
              <span className="text-sm font-semibold text-white">Enable PWA Installation Prompt</span>
            </label>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">App Icon (PWA)</label>
            <ImageUploader 
              images={settings.pwa_icon_url ? [settings.pwa_icon_url] : []} 
              setImages={(imgs) => setSettings(s => ({ ...s, pwa_icon_url: imgs[0] || "" }))} 
              type="pwa-icons" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Theme Color</label>
              <input type="color" name="pwa_theme_color" value={settings.pwa_theme_color || "#0f1117"} onChange={handleChange} className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-2 py-1 focus:outline-none focus:border-violet-500/50 cursor-pointer" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Background Color</label>
              <input type="color" name="pwa_background_color" value={settings.pwa_background_color || "#0f1117"} onChange={handleChange} className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-2 py-1 focus:outline-none focus:border-violet-500/50 cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-white/5">
          <button type="submit" disabled={saving} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-xl shadow-white/10">
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
