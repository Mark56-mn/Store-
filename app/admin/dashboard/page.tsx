"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, loading: true });

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();
      const { count } = await supabase.from("products").select("*", { count: "exact", head: true });
      setStats({ products: count || 0, loading: false });
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-neutral-400 mt-1">Welcome to your store dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all">
          <h3 className="text-sm font-medium text-slate-400">Total Products</h3>
          <p className="text-3xl font-bold mt-2 text-white">
            {stats.loading ? "-" : stats.products}
          </p>
        </div>
      </div>
    </div>
  );
}
