"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Copy, Edit, Plus, Trash } from "lucide-react";

export default function ProductsList() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    await supabase.from("products").delete().eq("id", id);
    load();
  }

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Products</h1>
        <Link href="/admin/products/new" className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center hover:bg-slate-200 shadow-xl shadow-white/10 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-black/20 border-b border-white/10 text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Selar Link</th>
              <th className="px-6 py-4 font-medium">Created</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
            <tbody className="divide-y divide-white/5">
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No products found.</td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                <td className="px-6 py-4 text-slate-400"><a href={p.selar_link} target="_blank" rel="noreferrer" className="hover:text-blue-400 truncate max-w-xs block">{p.selar_link}</a></td>
                <td className="px-6 py-4 text-slate-400">{new Date(p.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link href={`/admin/products/${p.id}`} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 rounded-lg hover:bg-red-500/20">
                      <Trash className="w-4 h-4" />
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
