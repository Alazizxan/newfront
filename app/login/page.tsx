"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        setError(data.error || "Authentication failed");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card p-8 dark-theme-shadow-xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] flex items-center justify-center pulse-glow">
              <div className="text-3xl float-animation">🔐</div>
            </div>
            <h1 className="text-3xl font-mono font-bold text-gradient mb-3">
              Welcome Back
            </h1>
            <p className="text-[var(--text-secondary)] font-mono text-sm">
              Sign in to continue your coding journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-mono font-medium text-[var(--text-secondary)] mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="developer@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="terminal-input w-full focus-ring"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-mono font-medium text-[var(--text-secondary)] mb-3">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your secure password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="terminal-input w-full focus-ring"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] text-sm font-mono backdrop-blur">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--error)] animate-pulse"></div>
                  {error}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 rounded-lg font-mono font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spinner"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🚀</span>
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="text-[var(--accent-primary)] hover:text-[var(--accent-teal)] font-mono text-sm transition-colors duration-300 hover:underline"
              >
                Don't have an account? <span className="font-semibold">Create one</span>
              </button>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-[var(--text-muted)] font-mono text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full status-online"></div>
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-teal)] animate-pulse"></div>
              <span>Fast Access</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)] animate-pulse"></div>
              <span>24/7 Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}