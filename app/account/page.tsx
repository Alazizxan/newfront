"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
        router.push("/login");
      }
    };

    fetchUser();
  }, []);

  if (!user) return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center pulse-glow">
          <div className="w-10 h-10 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full spinner"></div>
        </div>
        <p className="font-mono text-[var(--text-secondary)]">Loading account...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="card p-8 mb-8 dark-theme-shadow-lg">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] flex items-center justify-center hover-glow transition-all duration-300">
              <span className="text-3xl">👤</span>
            </div>
            <div>
              <h1 className="text-3xl font-mono font-bold text-gradient mb-2">Account Settings</h1>
              <p className="text-[var(--text-secondary)] font-mono">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card p-6">
            <h2 className="text-xl font-mono font-semibold text-[var(--accent-primary)] mb-6 flex items-center gap-2">
              <span>📧</span>
              Profile Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[var(--border-primary)]">
                <span className="font-mono text-[var(--text-secondary)]">Email:</span>
                <span className="font-mono font-semibold">{user.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[var(--border-primary)]">
                <span className="font-mono text-[var(--text-secondary)]">Username:</span>
                <span className="font-mono font-semibold">{user.username}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-mono text-[var(--text-secondary)]">Member Since:</span>
                <span className="font-mono font-semibold">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-xl font-mono font-semibold text-[var(--accent-teal)] mb-6 flex items-center gap-2">
              <span>📊</span>
              Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-[var(--border-primary)]">
                <span className="font-mono text-[var(--text-secondary)]">Points:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full status-online"></div>
                  <span className="font-mono font-bold text-[var(--success)] text-lg">{user.points}</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-[var(--border-primary)]">
                <span className="font-mono text-[var(--text-secondary)]">Level:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)] animate-pulse"></div>
                  <span className="font-mono font-bold text-[var(--accent-purple)] text-lg">{user.level}</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-mono text-[var(--text-secondary)]">Status:</span>
                <div className="flex items-center gap-2">
                  {user.premium ? (
                    <>
                      <div className="w-2 h-2 rounded-full status-premium"></div>
                      <span className="font-mono font-semibold text-[var(--warning)]">Premium</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></div>
                      <span className="font-mono font-semibold text-[var(--accent-primary)]">Free</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-mono font-semibold text-[var(--accent-purple)] mb-6 flex items-center gap-2">
            <span>📈</span>
            Learning Progress
          </h2>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-mono text-[var(--text-secondary)]">Overall Progress</span>
              <span className="font-mono font-semibold">{Math.round((user.points / 1000) * 100)}%</span>
            </div>
            <div className="progress-bar h-3">
              <div className="progress-fill" style={{ width: `${(user.points / 1000) * 100}%` }}></div>
            </div>
          </div>
          <p className="text-[var(--text-muted)] font-mono text-sm">
            Keep learning to unlock new achievements and reach the next level!
          </p>
        </div>

        {/* Actions */}
        <div className="card p-6">
          <h2 className="text-xl font-mono font-semibold text-[var(--error)] mb-6 flex items-center gap-2">
            <span>⚙️</span>
            Account Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary px-6 py-3 rounded-lg font-mono hover-lift flex items-center gap-2"
            >
              <span>🏠</span>
              Back to Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="btn-ghost px-6 py-3 rounded-lg font-mono hover-lift flex items-center gap-2 border-[var(--error)]/30 text-[var(--error)] hover:border-[var(--error)] hover:text-[var(--error)]"
            >
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}