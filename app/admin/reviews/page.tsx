"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Star, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadReviews();
  }, []);

  async function loadReviews() {
    // We join with products to show which product it belongs to
    const { data } = await supabase
      .from("reviews")
      .select("*, products(name, id)")
      .order("created_at", { ascending: false });
    
    if (data) setReviews(data);
    setLoading(false);
  }

  async function deleteReview(id: string) {
    if (!confirm("Are you sure you want to delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    loadReviews();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Review Moderation</h1>
      </div>

      <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/20 border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Author</th>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Review</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading reviews...</td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No reviews found.</td>
              </tr>
            ) : reviews.map((r) => (
              <tr key={r.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{r.user_name}</td>
                <td className="px-6 py-4">
                   <Link href={`/product/${r.products.id}`} target="_blank" className="text-slate-400 hover:text-violet-400 flex items-center gap-1 group">
                     <span className="truncate max-w-[150px]">{r.products.name}</span>
                     <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </Link>
                </td>
                <td className="px-6 py-4">
                  <div className="flex text-amber-400">
                    {[1,2,3,4,5].map(star => (
                       <Star key={star} className={`w-3 h-3 ${star <= r.rating ? "fill-amber-400" : "text-white/10"}`} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 max-w-xs truncate">{r.comment}</td>
                <td className="px-6 py-4 text-slate-400">{new Date(r.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => deleteReview(r.id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg hover:bg-red-500/20" title="Delete Review">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
