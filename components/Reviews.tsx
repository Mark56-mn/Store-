"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Star, User, Trash2 } from "lucide-react";

export default function Reviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [authMode, setAuthMode] = useState<"hidden" | "login" | "signup">("hidden");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    loadUser();
    loadReviews();
  }, [productId]);

  async function loadUser() {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user || null);
    if (session?.user) {
      // Check if admin
      const { data } = await supabase.from("admins").select("id").eq("user_id", session.user.id).single();
      if (data) setIsAdmin(true);
    }
  }

  async function loadReviews() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    
    if (data) setReviews(data);
    setLoading(false);
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSubmitting(true);
    
    let result;
    if (authMode === "signup") {
      result = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
    } else {
      result = await supabase.auth.signInWithPassword({
        email,
        password
      });
    }
    
    if (result.error) {
      setAuthError(result.error.message);
    } else {
      setUser(result.data.user);
      setAuthMode("hidden");
    }
    setSubmitting(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    
    const userName = user.user_metadata?.full_name || user.email.split("@")[0];
    
    const { error } = await supabase.from("reviews").insert([
      {
        product_id: productId,
        user_id: user.id,
        user_name: userName,
        rating,
        comment
      }
    ]);
    
    if (!error) {
      setComment("");
      setRating(5);
      loadReviews();
    } else {
      alert("Error submitting review: " + error.message);
    }
    setSubmitting(false);
  };

  const deleteReview = async (id: string) => {
    if (!isAdmin) return;
    if (!confirm("Delete this review?")) return;
    
    await supabase.from("reviews").delete().eq("id", id);
    loadReviews();
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  return (
    <div className="mt-16 pt-16 border-t border-white/10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex text-amber-400">
              {[1,2,3,4,5].map(star => (
                <Star key={star} className={`w-5 h-5 ${star <= Math.round(Number(avgRating)) ? "fill-amber-400" : "text-white/20"}`} />
              ))}
            </div>
            <span className="text-white font-bold">{avgRating} out of 5</span>
            <span className="text-slate-400 text-sm">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1">
          {user ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white">Write a review</h3>
                <button onClick={handleSignOut} className="text-xs text-slate-400 hover:text-white">Sign Out</button>
              </div>
              
              <form onSubmit={submitReview} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star} 
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 transition-colors ${star <= rating ? "text-amber-400" : "text-white/20 hover:text-white/50"}`}
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? "fill-amber-400" : ""}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Your Review</label>
                  <textarea 
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="What did you think of this product?"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-violet-500/50 transition-colors text-white text-sm resize-none"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-3 bg-white text-slate-900 font-bold rounded-xl hover:shadow-lg hover:shadow-white/10 transition-all text-sm disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Post Review"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              {authMode === "hidden" ? (
                <div className="text-center py-4">
                  <h3 className="font-bold text-white mb-2">Share Your Thoughts</h3>
                  <p className="text-sm text-slate-400 mb-6">Sign in to submit a review for this product.</p>
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="w-full py-3 bg-violet-600 border border-violet-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-violet-500/20 transition-all text-sm"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => setAuthMode("signup")}
                    className="w-full py-3 mt-3 bg-transparent text-slate-300 font-bold rounded-xl hover:bg-white/5 transition-all text-sm"
                  >
                    Create Account
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white">{authMode === "login" ? "Sign In" : "Sign Up"}</h3>
                    <button type="button" onClick={() => setAuthMode("hidden")} className="text-xs text-slate-400 hover:text-white">Cancel</button>
                  </div>
                  
                  {authError && <div className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg">{authError}</div>}
                  
                  {authMode === "signup" && (
                    <div>
                      <input 
                        required
                        type="text"
                        placeholder="Your Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/50 transition-colors text-white text-sm"
                      />
                    </div>
                  )}
                  <div>
                    <input 
                      required
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/50 transition-colors text-white text-sm"
                    />
                  </div>
                  <div>
                    <input 
                      required
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-500/50 transition-colors text-white text-sm"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-2.5 bg-white text-slate-900 font-bold rounded-xl transition-all text-sm disabled:opacity-50"
                  >
                    {submitting ? "Please wait..." : (authMode === "login" ? "Sign In" : "Sign Up")}
                  </button>
                  <div className="text-center mt-4">
                    <button 
                       type="button"
                       onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                       className="text-xs text-slate-400 hover:text-white"
                    >
                      {authMode === "login" ? "Need an account? Sign up" : "Already have an account? Sign in"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          {loading ? (
             <div className="animate-pulse space-y-4">
                {[1,2].map(i => <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>)}
             </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <Star className="w-8 h-8 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm group relative">
                  {isAdmin && (
                    <button 
                      onClick={() => deleteReview(review.id)}
                      className="absolute top-6 right-6 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Delete Review (Admin)"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-violet-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{review.user_name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-amber-400">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`w-3 h-3 ${star <= review.rating ? "fill-amber-400" : "text-white/20"}`} />
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
