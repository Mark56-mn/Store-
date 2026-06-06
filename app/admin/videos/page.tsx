"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function Videos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    const { data } = await supabase.from("external_videos").select("*").order("sort_order", { ascending: true });
    setVideos(data || []);
    setLoading(false);
  }

  async function deleteVideo(id: string) {
    if (confirm("Are you sure?")) {
      await supabase.from("external_videos").delete().eq("id", id);
      loadVideos();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">External Videos</h1>
          <p className="text-slate-400">Manage 'For You' video feed.</p>
        </div>
        <Link href="/admin/videos/new" className="bg-white text-slate-900 px-4 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Video
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-slate-300 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold border-b border-white/10">Video</th>
              <th className="px-6 py-4 font-bold border-b border-white/10">Title</th>
              <th className="px-6 py-4 font-bold border-b border-white/10 hidden md:table-cell">Sort Order</th>
              <th className="px-6 py-4 font-bold border-b border-white/10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : videos.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No videos found. Add your first video.</td></tr>
            ) : (
              videos.map(video => (
                <tr key={video.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-16 h-16 rounded-xl bg-black/20 overflow-hidden flex items-center justify-center relative">
                      {video.thumbnail_url ? (
                        <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-slate-500">Vid</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-sm">{video.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{video.is_active ? 'Active' : 'Hidden'}</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-slate-400">{video.sort_order}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/videos/${video.id}`} className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-lg">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => deleteVideo(video.id)} className="text-red-400 hover:text-red-300 bg-red-500/10 p-2 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
