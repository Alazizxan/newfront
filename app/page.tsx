"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

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
        console.error("❌ Dashboard xatosi:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const codeParticles = [
    { left: 5, top: 10, char: '{}', delay: 0.2, duration: 4 },
    { left: 15, top: 70, char: '<>', delay: 1.1, duration: 5 },
    { left: 85, top: 30, char: '()', delay: 0.7, duration: 3.5 },
    { left: 25, top: 50, char: '[]', delay: 1.8, duration: 4.5 },
    { left: 65, top: 20, char: '&&', delay: 0.4, duration: 4.2 },
    { left: 95, top: 80, char: '||', delay: 2.1, duration: 3.8 },
    { left: 45, top: 90, char: '++', delay: 1.5, duration: 5.2 },
    { left: 75, top: 60, char: '==', delay: 0.9, duration: 4.7 },
    { left: 35, top: 40, char: '!=', delay: 1.3, duration: 3.3 },
    { left: 55, top: 15, char: '=>', delay: 0.6, duration: 4.8 },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 flex items-center justify-center relative overflow-hidden">
      {isClient && (
        <div className="absolute inset-0 opacity-20">
          {codeParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute text-cyan-400 font-mono text-xs animate-bounce"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              {particle.char}
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center relative z-10">
        <div className="relative mb-8">
          <div className="w-20 h-20 mx-auto rounded-xl bg-[#1a1a2e] border border-cyan-500/30 shadow-lg flex items-center justify-center backdrop-blur-sm pulse-neon">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full spinner-neon"></div>
              <div className="absolute inset-2 w-6 h-6 border-2 border-purple-400 border-b-transparent rounded-full spinner-neon" style={{ animationDirection: 'reverse' }}></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Initializing Dashboard...
          </h2>
          <div className="w-64 h-2 mx-auto bg-[#1a1a2e] border border-cyan-500/30 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
          </div>
          <div className="text-sm text-zinc-400 font-mono space-y-1">
            <p className="animate-pulse">Loading user profile...</p>
            <p className="animate-pulse" style={{ animationDelay: '0.5s' }}>Fetching courses...</p>
            <p className="animate-pulse" style={{ animationDelay: '1s' }}>Preparing workspace...</p>
          </div>
        </div>
      </div>
    </div>
  );

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

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 relative overflow-hidden">
      {/* Background Effects */}
      {isClient && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-10">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute text-cyan-400/30 font-mono text-xs"
                style={{
                  left: `${(i + 1) * 8}%`,
                  top: '0%',
                  animation: `float-down ${5 + (i % 2)}s linear infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                {['{}', '<>', '()', '[]', '&&', '||', '++', '==', '!=', '=>', '<=', '>='][i]}
              </div>
            ))}
          </div>
          
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>
      )}

      <div className="relative z-10 p-4 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 p-6 lg:p-8 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-2xl relative overflow-hidden card-hover">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-purple-400/5"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-[#16213e] border border-cyan-500/30 flex items-center justify-center shadow-lg neon-glow">
                    <div className="text-2xl lg:text-3xl">⚡</div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-3">
                    <h1 className="text-2xl lg:text-4xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                      Welcome, {user.username}
                    </h1>
                    {user.premium && (
                      <div className="inline-flex items-center mt-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/40 rounded-lg backdrop-blur-sm">
                        <span className="text-yellow-400 text-lg mr-2">⭐</span>
                        <span className="font-mono font-bold text-yellow-400 text-sm">Premium</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3 bg-[#16213e]/60 border border-emerald-400/30 px-4 py-2 rounded-lg">
                      <div className="w-8 h-8 rounded bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center">
                        <span className="text-emerald-400 text-sm">🏆</span>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400 font-mono">Points</div>
                        <div className="font-mono font-bold text-emerald-400">{user.points}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-[#16213e]/60 border border-purple-400/30 px-4 py-2 rounded-lg">
                      <div className="w-8 h-8 rounded bg-purple-400/20 border border-purple-400/40 flex items-center justify-center">
                        <span className="text-purple-400 text-sm">📊</span>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-400 font-mono">Level</div>
                        <div className="font-mono font-bold text-purple-400">{user.level}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {!user.premium && (
                <div className="lg:flex-shrink-0">
                  <button
                    onClick={handlePremiumUpgrade}
                    className="btn-primary w-full lg:w-auto px-6 py-3 rounded-xl text-white font-mono font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center"
                  >
                    <span className="text-lg mr-2">⭐</span>
                    <span className="relative z-10">Upgrade Premium</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-[#1a1a2e] border border-blue-400/30 flex items-center justify-center mr-4 shadow-lg">
              <span className="text-2xl lg:text-3xl">📚</span>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-mono font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Available Courses
              </h2>
              <p className="text-zinc-400 font-mono text-sm lg:text-base mt-1">
                Choose your learning path
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course)}
                className={`group relative p-6 rounded-2xl backdrop-blur-xl border cursor-pointer card-hover shadow-lg overflow-hidden gpu-accelerated ${
                  course.premium 
                    ? 'bg-[#1a1a2e]/80 border-yellow-400/30 hover:border-yellow-400/60'
                    : 'bg-[#1a1a2e]/80 border-cyan-400/30 hover:border-cyan-400/60'
                }`}
              >
                <div className={`absolute inset-0 ${
                  course.premium 
                    ? 'bg-gradient-to-br from-yellow-400/5 to-orange-400/5'
                    : 'bg-gradient-to-br from-cyan-400/5 to-blue-400/5'
                } transition-opacity duration-300 group-hover:opacity-75`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shadow-md ${
                      course.premium 
                        ? 'bg-yellow-400/20 border-yellow-400/40'
                        : 'bg-cyan-400/20 border-cyan-400/40'
                    }`}>
                      <span className="text-xl">📖</span>
                    </div>
                    
                    {course.premium && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-yellow-400/20 border border-yellow-400/40 rounded-lg backdrop-blur-sm">
                        <span className="text-yellow-400 text-sm">⭐</span>
                        <span className="text-yellow-400 font-mono font-bold text-xs">Premium</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-mono font-bold mb-3 ${
                    course.premium ? 'text-yellow-400' : 'text-cyan-400'
                  }`}>
                    {course.title}
                  </h3>
                  
                  <p className="text-zinc-300 font-mono text-sm leading-relaxed mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg ${
                      course.premium 
                        ? 'bg-yellow-400/10 border-yellow-400/30'
                        : 'bg-cyan-400/10 border-cyan-400/30'
                    }`}>
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-zinc-300 font-mono text-xs">
                        {course.level}
                      </span>
                    </div>
                    
                    <div className={`p-2 rounded-lg transition-transform group-hover:translate-x-1 duration-300 ${
                      course.premium 
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : 'bg-cyan-400/20 text-cyan-400'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            ))}
          </div>
          
          {courses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto rounded-2xl bg-[#1a1a2e]/60 border border-cyan-400/30 flex items-center justify-center mb-6">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-mono font-bold text-zinc-400 mb-2">
                No courses available
              </h3>
              <p className="text-zinc-500 font-mono text-sm">
                New courses coming soon!
              </p>
            </div>
          )}
        </div>
      </div>
       
      <style jsx>{`
        @keyframes float-down {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
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