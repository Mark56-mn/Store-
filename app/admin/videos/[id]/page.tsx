// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactPlayer from 'react-player';

export default function EditVideo({ params }: { params: Promise<{ id: string }> }) {
  const [form, setForm] = useState({ title: "", description: "", video_url: "", thumbnail_url: "", external_link: "", sort_order: 0, is_active: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    Promise.resolve(params).then((p) => {
        setId(p.id);
        load(p.id);
    });
  }, [params]);

  async function load(videoId: string) {
    const { data } = await supabase.from("external_videos").select("*").eq("id", videoId).single();
    if (data) setForm(data);
    setLoading(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if(!id) return;
    setSaving(true);
    const { error } = await supabase.from("external_videos").update(form).eq("id", id);
    if (!error) {
      router.push("/admin/videos");
    } else {
      alert("Error saving video");
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-slate-400">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/videos" className="p-2 hover:bg-white/10 rounded-full transition-colors"><ArrowLeft className="w-5 h-5 text-slate-400" /></Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Edit Video</h1>
          <p className="text-slate-400">Manage video properties</p>
        </div>
      </div>
      
      <form onSubmit={save} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-md">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Video URL (YouTube, TikTok, Vimeo, MP4)</label>
          <input required type="text" value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors" />
        </div>
        {form.video_url && (
            <div className="aspect-[9/16] w-64 bg-black/20 rounded-xl overflow-hidden pointer-events-none">
                {/* @ts-ignore */}
                <ReactPlayer url={form.video_url} width="100%" height="100%" playing={true} muted={true} loop={true} />
            </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Title</label>
            <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors text-white" />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={e => setForm({...form, sort_order: Number(e.target.value)})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors text-white" />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
          <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors text-white" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">External Link (Product destination)</label>
          <input required type="url" value={form.external_link} onChange={e => setForm({...form, external_link: e.target.value})} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors text-white" />
        </div>
        <div>
            <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-5 h-5 accent-violet-500" />
                <span className="text-sm font-semibold text-white">Active (visible on For You page)</span>
            </label>
        </div>
        <div className="pt-6 mt-6 border-t border-white/5">
          <button type="submit" disabled={saving} className="bg-white text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all shadow-xl shadow-white/10">
            {saving ? "Saving..." : "Update Video"}
          </button>
        </div>
      </form>
    </div>
  );
}
