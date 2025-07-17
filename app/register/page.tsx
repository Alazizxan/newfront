"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.error || "❌ Registration failed");
      }
    } catch {
      setError("❌ Connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#1a1a2e]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Header glow effect */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#16213e] border border-cyan-500/30 flex items-center justify-center neon-glow">
              <span className="text-2xl">✨</span>
            </div>
            <h1 className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Join the Community
            </h1>
            <p className="text-zinc-400 font-mono text-sm mt-2">Create your developer account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-mono text-zinc-300 mb-2">Username</label>
                <input
                  type="text"
                  placeholder="developer_name"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="terminal-input w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-mono text-zinc-300 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="terminal-input w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-mono text-zinc-300 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="terminal-input w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-lg font-mono font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spinner-neon mr-2"></div>
                  Creating account...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Create Account
                </>
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-cyan-400 hover:text-cyan-300 font-mono text-sm transition-colors duration-200"
              >
                Already have an account? <span className="underline">Sign in</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}