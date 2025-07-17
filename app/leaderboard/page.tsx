"use client";

import { useEffect, useState } from "react";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/leaderboard");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center pulse-glow">
            <div className="w-10 h-10 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full spinner"></div>
          </div>
          <p className="font-mono text-[var(--text-secondary)]">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="container-responsive py-8">
        {/* Header */}
        <div className="card p-8 mb-8 dark-theme-shadow-lg">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] flex items-center justify-center hover-glow transition-all duration-300">
              <span className="text-3xl float-animation">🏆</span>
            </div>
            <div>
              <h1 className="text-3xl font-mono font-bold text-gradient mb-2">Leaderboard</h1>
              <p className="text-[var(--text-secondary)] font-mono">Top performers in our coding community</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="card dark-theme-shadow-lg">
          <div className="p-6 border-b border-[var(--border-primary)]">
            <h2 className="text-xl font-mono font-semibold text-[var(--accent-primary)] flex items-center gap-2">
              <span>🎯</span>
              Top Coders
            </h2>
          </div>
          
          <div className="divide-y divide-[var(--border-primary)]">
            {users.map((user, idx) => {
              const isTop3 = idx < 3;
              const rankColors = ['text-[var(--warning)]', 'text-[var(--text-secondary)]', 'text-[var(--accent-teal)]'];
              const rankIcons = ['🥇', '🥈', '🥉'];
              
              return (
                <div
                  key={user._id}
                  className={`p-6 hover:bg-[var(--bg-tertiary)]/30 transition-all duration-300 ${
                    isTop3 ? 'bg-gradient-to-r from-transparent to-[var(--accent-primary)]/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg border flex items-center justify-center font-mono font-bold text-lg transition-all duration-300 ${
                        isTop3 
                          ? `bg-${rankColors[idx]}/10 border-${rankColors[idx]}/30 ${rankColors[idx]}` 
                          : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)]'
                      }`}>
                        {isTop3 ? rankIcons[idx] : `#${idx + 1}`}
                      </div>
                      
                      <div>
                        <h3 className={`font-mono font-semibold text-lg ${
                          isTop3 ? rankColors[idx] : 'text-[var(--text-primary)]'
                        }`}>
                          {user.username}
                        </h3>
                        <p className="text-[var(--text-muted)] font-mono text-sm">
                          Level {user.level}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full status-online"></div>
                        <span className="font-mono font-bold text-[var(--success)] text-lg">
                          {user.points}
                        </span>
                        <span className="font-mono text-[var(--text-secondary)] text-sm">points</span>
                      </div>
                      
                      {isTop3 && (
                        <div className="flex items-center gap-1 justify-end">
                          <div className="w-1 h-1 rounded-full bg-[var(--accent-primary)] animate-pulse"></div>
                          <span className="text-[var(--accent-primary)] font-mono text-xs">Top Performer</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {users.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center mb-6 float-animation">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-xl font-mono font-semibold text-[var(--text-secondary)] mb-3">
                No rankings yet
              </h3>
              <p className="text-[var(--text-muted)] font-mono text-sm max-w-md mx-auto">
                Start completing courses to appear on the leaderboard!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}