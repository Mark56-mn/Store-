// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import ReactPlayer from 'react-player';
import { ExternalLink } from "lucide-react";

export default function ForYou() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("external_videos").select("*").eq("is_active", true).order("sort_order", { ascending: true });
      setVideos(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden bg-transparent">
      <Navbar />
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full pt-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-white text-center">Your Style</h1>
        <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">Discover the latest trends and styles curated just for you. Get the look directly from our partners.</p>
        
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <div className="w-8 h-8 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center p-20 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
            <p className="text-slate-400">Check back later for curated styles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, i) => (
              <motion.div 
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col group"
              >
                <div className="aspect-[9/16] bg-black/50 relative overflow-hidden">
                    {/* @ts-ignore */}
                    <ReactPlayer 
                        url={video.video_url} 
                        width="100%" 
                        height="100%" 
                        playing={true} 
                        muted={true} 
                        loop={true} 
                        playsinline={true}
                        light={video.thumbnail_url || false}
                    />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">{video.description}</p>
                  <a 
                    href={video.external_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-violet-500/20"
                  >
                    Get this product <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
