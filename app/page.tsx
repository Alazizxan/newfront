"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const userRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        const courseRes = await fetch("http://localhost:5000/api/course/list");
        const courseData = await courseRes.json();
        setCourses(courseData);
      } catch (err) {
        console.error("❌ Dashboard error:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handlePremiumUpgrade = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/user/premium/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Premium activated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Premium upgrade error:", error);
      alert("❌ Error occurred. Please try again.");
    }
  };

  const handleCourseClick = (course: any) => {
    if (course.premium && !user.premium) {
      alert("⛔ This course requires Premium membership!");
      return;
    }
    router.push(`/course/${course._id}/details`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center pulse-glow">
            <div className="w-10 h-10 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full spinner"></div>
          </div>
          <h2 className="text-xl font-mono font-semibold text-gradient mb-3">
            Initializing Dashboard
          </h2>
          <div className="w-64 h-2 mx-auto progress-bar">
            <div className="progress-fill w-full h-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="container-responsive py-6 lg:py-8">
        {/* Header Section */}
        <div className="card p-6 lg:p-8 mb-8 dark-theme-shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] flex items-center justify-center hover-glow transition-all duration-300">
                <div className="text-2xl lg:text-3xl float-animation">⚡</div>
              </div>
              
              <div>
                <h1 className="text-2xl lg:text-3xl font-mono font-bold text-gradient mb-2">
                  Welcome back, {user.username}
                </h1>
                <p className="text-[var(--text-secondary)] font-mono text-sm lg:text-base">
                  Ready to level up your coding skills?
                </p>
                {user.premium && (
                  <div className="inline-flex items-center mt-3 px-4 py-2 bg-gradient-to-r from-[var(--warning)]/20 to-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-lg backdrop-blur">
                    <div className="w-2 h-2 rounded-full status-premium mr-2"></div>
                    <span className="font-mono font-medium text-[var(--warning)] text-sm">Premium Member</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg hover-lift transition-all duration-300">
                  <div className="w-2 h-2 rounded-full status-online"></div>
                  <span className="font-mono text-sm text-[var(--text-secondary)]">Points:</span>
                  <span className="font-mono font-bold text-[var(--success)] text-lg">{user.points}</span>
                </div>
                
                <div className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg hover-lift transition-all duration-300">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)] animate-pulse"></div>
                  <span className="font-mono text-sm text-[var(--text-secondary)]">Level:</span>
                  <span className="font-mono font-bold text-[var(--accent-purple)] text-lg">{user.level}</span>
                </div>
              </div>
              
              {!user.premium && (
                <button
                  onClick={handlePremiumUpgrade}
                  className="btn-primary px-6 py-3 rounded-lg font-mono text-sm font-semibold hover-lift flex items-center justify-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                  Upgrade to Premium
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 hover-lift transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[var(--accent-primary)]">Courses</h3>
                <p className="text-2xl font-mono font-bold">{courses.length}</p>
              </div>
            </div>
            <div className="text-sm text-[var(--text-secondary)] font-mono">Available to learn</div>
          </div>

          <div className="card p-6 hover-lift transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30 flex items-center justify-center">
                <span className="text-xl">🎯</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[var(--accent-teal)]">Progress</h3>
                <p className="text-2xl font-mono font-bold">{Math.round((user.points / 1000) * 100)}%</p>
              </div>
            </div>
            <div className="progress-bar h-2">
              <div className="progress-fill" style={{ width: `${(user.points / 1000) * 100}%` }}></div>
            </div>
          </div>

          <div className="card p-6 hover-lift transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[var(--accent-purple)]">Rank</h3>
                <p className="text-2xl font-mono font-bold">#{user.level}</p>
              </div>
            </div>
            <div className="text-sm text-[var(--text-secondary)] font-mono">Global ranking</div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center">
              <span className="text-2xl">💻</span>
            </div>
            <div>
              <h2 className="text-2xl font-mono font-bold text-gradient">
                Available Courses
              </h2>
              <p className="text-[var(--text-secondary)] font-mono text-sm">
                Choose your learning path and start coding
              </p>
            </div>
          </div>
          
          <div className="grid-responsive">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course)}
                className={`card card-hover p-6 cursor-pointer gpu-layer transition-all duration-300 ${
                  course.premium ? 'card-premium' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-300 ${
                    course.premium 
                      ? 'bg-[var(--warning)]/10 border-[var(--warning)]/30 hover:bg-[var(--warning)]/20'
                      : 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 hover:bg-[var(--accent-primary)]/20'
                  }`}>
                    <span className="text-2xl">📖</span>
                  </div>
                  
                  {course.premium && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--warning)]/10 border border-[var(--warning)]/30 rounded-lg backdrop-blur">
                      <div className="w-2 h-2 rounded-full status-premium"></div>
                      <span className="text-[var(--warning)] font-mono font-medium text-xs">Premium</span>
                    </div>
                  )}
                </div>
                
                <h3 className={`text-xl font-mono font-bold mb-3 transition-colors duration-300 ${
                  course.premium ? 'text-[var(--warning)]' : 'text-[var(--accent-primary)]'
                }`}>
                  {course.title}
                </h3>
                
                <p className="text-[var(--text-secondary)] font-mono text-sm leading-relaxed mb-6 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg transition-all duration-300 ${
                    course.premium 
                      ? 'bg-[var(--warning)]/5 border-[var(--warning)]/20 hover:border-[var(--warning)]/40'
                      : 'bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/20 hover:border-[var(--accent-primary)]/40'
                  }`}>
                    <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
                    <span className="text-[var(--text-secondary)] font-mono text-xs">
                      {course.level || 'Beginner'}
                    </span>
                  </div>
                  
                  <div className={`p-2 rounded-lg transition-all duration-300 hover:translate-x-1 ${
                    course.premium 
                      ? 'bg-[var(--warning)]/10 text-[var(--warning)] hover:bg-[var(--warning)]/20'
                      : 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/20'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {courses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center mb-6 float-animation">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-mono font-semibold text-[var(--text-secondary)] mb-3">
                No courses available yet
              </h3>
              <p className="text-[var(--text-muted)] font-mono text-sm max-w-md mx-auto">
                New courses are being prepared. Check back soon for exciting learning opportunities!
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card p-6 dark-theme-shadow">
          <h3 className="text-lg font-mono font-semibold text-gradient mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push("/account")}
              className="btn-secondary px-4 py-2 rounded-lg font-mono text-sm hover-lift flex items-center gap-2"
            >
              <span>👤</span>
              Account Settings
            </button>
            <button
              onClick={() => router.push("/leaderboard")}
              className="btn-secondary px-4 py-2 rounded-lg font-mono text-sm hover-lift flex items-center gap-2"
            >
              <span>🏆</span>
              Leaderboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/login");
              }}
              className="btn-ghost px-4 py-2 rounded-lg font-mono text-sm hover-lift flex items-center gap-2"
            >
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}