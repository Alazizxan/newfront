"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CourseDetailsPage() {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/api/course/${params.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error("Course not found");
        }

        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("❌ Error loading course:", err);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, []);

  const codeParticles = [
    { left: 8, top: 15, char: '📝', delay: 0.3, duration: 4.2 },
    { left: 20, top: 75, char: '🎥', delay: 1.2, duration: 5.1 },
    { left: 80, top: 35, char: '📖', delay: 0.8, duration: 3.7 },
    { left: 30, top: 55, char: '🚀', delay: 1.9, duration: 4.6 },
    { left: 70, top: 25, char: '⭐', delay: 0.5, duration: 4.3 },
    { left: 90, top: 85, char: '💡', delay: 2.2, duration: 3.9 },
    { left: 50, top: 90, char: '🎯', delay: 1.6, duration: 5.3 },
    { left: 75, top: 65, char: '🔥', delay: 1.0, duration: 4.8 },
    { left: 40, top: 45, char: '⚡', delay: 1.4, duration: 3.4 },
    { left: 60, top: 20, char: '🌟', delay: 0.7, duration: 4.9 },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 p-4 flex items-center justify-center relative overflow-hidden">
      {isClient && (
        <div className="absolute inset-0 opacity-20">
          {codeParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute text-cyan-400 font-mono text-lg animate-bounce"
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
        <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-[#1a1a2e] border border-cyan-500/30 flex items-center justify-center pulse-neon">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full spinner-neon"></div>
        </div>
        <h2 className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
          Loading Course...
        </h2>
        <div className="w-64 h-2 mx-auto bg-[#1a1a2e] border border-cyan-500/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-xl bg-[#1a1a2e]/60 border border-red-400/40 flex items-center justify-center mb-6 shadow-lg">
          <span className="text-4xl">❌</span>
        </div>
        <h2 className="text-2xl font-mono font-bold text-red-400 mb-4">Course Not Found</h2>
        <p className="text-zinc-400 font-mono mb-6">The requested course doesn't exist</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-[#1a1a2e] border border-cyan-400/30 hover:border-cyan-400 text-cyan-400 rounded-xl font-mono transition-all duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

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
                {['📝', '🎥', '📖', '🚀', '⭐', '💡', '🎯', '🔥', '⚡', '🌟', '✨', '💻'][i]}
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

      <div className="relative z-10 p-4 lg:p-8 max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="mb-8 p-6 lg:p-8 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-transparent to-purple-400/5"></div>
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-start gap-4 lg:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-[#16213e] border border-cyan-500/30 flex items-center justify-center shadow-lg neon-glow">
                    <div className="text-2xl lg:text-3xl">📖</div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="mb-3">
                    <h1 className="text-2xl lg:text-4xl font-mono font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
                      {course.title}
                    </h1>
                    {course.premium && (
                      <div className="inline-flex items-center mt-2 px-4 py-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/40 rounded-xl backdrop-blur-sm">
                        <span className="text-yellow-400 text-lg mr-2">⭐</span>
                        <span className="font-mono font-bold text-yellow-400 text-sm">Premium Course</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-zinc-300 font-mono text-sm lg:text-base leading-relaxed bg-[#16213e]/40 border border-blue-400/20 rounded-lg p-4">
                    {course.description}
                  </p>
                </div>
              </div>
              
              <div className="lg:flex-shrink-0">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full lg:w-auto px-6 py-3 rounded-xl bg-[#16213e]/60 border border-red-400/40 hover:border-red-400 text-red-400 hover:text-red-300 font-mono font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Options */}
        <div className="mb-8">
          <div className="flex items-center mb-6 lg:mb-8">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-[#1a1a2e] border border-blue-400/30 flex items-center justify-center mr-4 shadow-lg">
              <span className="text-2xl lg:text-3xl">🎯</span>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-mono font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Choose Your Path
              </h2>
              <p className="text-zinc-400 font-mono text-sm lg:text-base mt-1">
                Start with tasks or watch video lessons
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Tasks Card */}
            <div
              onClick={() => router.push(`/course/${course._id}/`)}
              className="group relative p-6 lg:p-8 rounded-2xl backdrop-blur-xl border bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-400/30 hover:border-cyan-400/60 shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 cursor-pointer card-hover overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 transition-opacity duration-300 group-hover:opacity-75"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center shadow-lg">
                    <span className="text-3xl lg:text-4xl">📝</span>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-cyan-400/20 text-cyan-400 transition-transform group-hover:translate-x-2 duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-mono font-bold text-cyan-400 mb-4">
                  Practice Tasks
                </h3>
                
                <p className="text-zinc-300 font-mono text-sm lg:text-base leading-relaxed mb-6">
                  Complete all course tasks to improve your coding skills. Each task builds upon the previous one.
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-400/10 border border-cyan-400/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span className="text-zinc-300 font-mono text-xs lg:text-sm">Interactive</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-400/10 border border-blue-400/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
                    <span className="text-zinc-300 font-mono text-xs lg:text-sm">Hands-on</span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>

            {/* Video Lessons Card */}
            <div
              onClick={() => router.push(`/course/${course._id}/lessons`)}
              className="group relative p-6 lg:p-8 rounded-2xl backdrop-blur-xl border bg-gradient-to-br from-emerald-500/10 to-green-600/10 border-emerald-400/30 hover:border-emerald-400/60 shadow-lg hover:shadow-emerald-400/20 transition-all duration-300 cursor-pointer card-hover overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-green-400/5 transition-opacity duration-300 group-hover:opacity-75"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center shadow-lg">
                    <span className="text-3xl lg:text-4xl">🎥</span>
                  </div>
                  
                  <div className="p-3 rounded-xl bg-emerald-400/20 text-emerald-400 transition-transform group-hover:translate-x-2 duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-mono font-bold text-emerald-400 mb-4">
                  Video Lessons
                </h3>
                
                <p className="text-zinc-300 font-mono text-sm lg:text-base leading-relaxed mb-6">
                  Watch all video lessons to learn from professional instructors step by step.
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-400/10 border border-emerald-400/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    <span className="text-zinc-300 font-mono text-xs lg:text-sm">HD Quality</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-400/10 border border-green-400/30 rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
                    <span className="text-zinc-300 font-mono text-xs lg:text-sm">Step by Step</span>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
       
      <style jsx>{`
        @keyframes float-down {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
}