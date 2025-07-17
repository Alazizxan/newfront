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
        setError(data.error || "Registration failed");
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
              <div className="text-3xl float-animation">✨</div>
            </div>
            <h1 className="text-3xl font-mono font-bold text-gradient mb-3">
              Join the Community
            </h1>
            <p className="text-[var(--text-secondary)] font-mono text-sm">
              Create your developer account and start learning
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-mono font-medium text-[var(--text-secondary)] mb-3">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="your_username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="terminal-input w-full focus-ring"
                  required
                />
              </div>
              
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
                  placeholder="Create a secure password"
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🚀</span>
                  <span>Create Account</span>
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="text-[var(--accent-primary)] hover:text-[var(--accent-teal)] font-mono text-sm transition-colors duration-300 hover:underline"
              >
                Already have an account? <span className="font-semibold">Sign in</span>
              </button>
            </div>
          </form>
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center hover-glow transition-all duration-300">
              <span className="text-lg">📚</span>
            </div>
            <p className="text-[var(--text-muted)] font-mono text-xs">Interactive Courses</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center hover-glow transition-all duration-300">
              <span className="text-lg">🎯</span>
            </div>
            <p className="text-[var(--text-muted)] font-mono text-xs">Real Projects</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center hover-glow transition-all duration-300">
              <span className="text-lg">🏆</span>
            </div>
            <p className="text-[var(--text-muted)] font-mono text-xs">Achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
}