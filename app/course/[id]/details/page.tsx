"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function CourseDetailsPage() {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

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

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center pulse-glow">
          <div className="w-12 h-12 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full spinner"></div>
        </div>
        <h2 className="text-2xl font-mono font-bold text-gradient mb-4">
          Loading Course
        </h2>
        <div className="w-64 h-2 mx-auto progress-bar">
          <div className="progress-fill w-full h-full"></div>
        </div>
      </div>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--error)]/40 flex items-center justify-center mb-8 dark-theme-shadow-lg">
          <span className="text-4xl">❌</span>
        </div>
        <h2 className="text-2xl font-mono font-bold text-[var(--error)] mb-4">Course Not Found</h2>
        <p className="text-[var(--text-secondary)] font-mono mb-8">The requested course doesn't exist</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="btn-primary px-6 py-3 rounded-lg font-mono hover-lift"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="container-responsive py-6 lg:py-8">
        {/* Course Header */}
        <div className="card p-6 lg:p-8 mb-8 dark-theme-shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-4 lg:gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] flex items-center justify-center dark-theme-shadow hover-glow transition-all duration-300">
                  <div className="text-3xl lg:text-4xl float-animation">📖</div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="mb-4">
                  <h1 className="text-3xl lg:text-4xl font-mono font-bold text-gradient leading-tight mb-3">
                    {course.title}
                  </h1>
                  {course.premium && (
                    <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[var(--warning)]/20 to-[var(--warning)]/10 border border-[var(--warning)]/40 rounded-lg backdrop-blur">
                      <div className="w-2 h-2 rounded-full status-premium mr-2"></div>
                      <span className="font-mono font-bold text-[var(--warning)] text-sm">Premium Course</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-[var(--bg-tertiary)]/40 border border-[var(--accent-primary)]/20 rounded-lg">
                  <p className="text-[var(--text-primary)] font-mono text-sm lg:text-base leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:flex-shrink-0">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full lg:w-auto btn-secondary px-6 py-3 rounded-lg font-mono font-bold text-sm hover-lift flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Course Options */}
        <div className="mb-8">
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-[var(--bg-secondary)] border border-[var(--accent-primary)]/30 flex items-center justify-center mr-6 dark-theme-shadow">
              <span className="text-3xl lg:text-4xl">🎯</span>
            </div>
            <div>
              <h2 className="text-2xl lg:text-3xl font-mono font-bold text-gradient">
                Choose Your Learning Path
              </h2>
              <p className="text-[var(--text-secondary)] font-mono text-sm lg:text-base mt-2">
                Start with hands-on tasks or watch comprehensive video lessons
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tasks Card */}
            <div
              onClick={() => router.push(`/course/${course._id}/`)}
              className="card card-hover p-8 cursor-pointer gpu-layer transition-all duration-300 border-[var(--accent-primary)]/30 hover:border-[var(--accent-primary)]/60 dark-theme-shadow-lg group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-20 h-20 rounded-2xl bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/40 flex items-center justify-center dark-theme-shadow transition-all duration-300 group-hover:scale-110">
                  <span className="text-4xl">📝</span>
                </div>
                
                <div className="p-4 rounded-xl bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] transition-all duration-300 group-hover:translate-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-mono font-bold text-[var(--accent-primary)] mb-4">
                Practice Tasks
              </h3>
              
              <p className="text-[var(--text-primary)] font-mono text-sm lg:text-base leading-relaxed mb-8">
                Complete interactive coding challenges that build upon each other. Perfect for hands-on learners who want to dive straight into coding.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse"></div>
                  <span className="text-[var(--text-primary)] font-mono text-xs lg:text-sm">Interactive</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[var(--warning)] animate-pulse"></div>
                  <span className="text-[var(--text-primary)] font-mono text-xs lg:text-sm">Hands-on</span>
                </div>
              </div>
            </div>

            {/* Video Lessons Card */}
            <div
              onClick={() => router.push(`/course/${course._id}/lessons`)}
              className="card card-hover p-8 cursor-pointer gpu-layer transition-all duration-300 border-[var(--accent-teal)]/30 hover:border-[var(--accent-teal)]/60 dark-theme-shadow-lg group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-20 h-20 rounded-2xl bg-[var(--accent-teal)]/20 border border-[var(--accent-teal)]/40 flex items-center justify-center dark-theme-shadow transition-all duration-300 group-hover:scale-110">
                  <span className="text-4xl">🎥</span>
                </div>
                
                <div className="p-4 rounded-xl bg-[var(--accent-teal)]/20 text-[var(--accent-teal)] transition-all duration-300 group-hover:translate-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl lg:text-3xl font-mono font-bold text-[var(--accent-teal)] mb-4">
                Video Lessons
              </h3>
              
              <p className="text-[var(--text-primary)] font-mono text-sm lg:text-base leading-relaxed mb-8">
                Watch comprehensive video tutorials from expert instructors. Learn concepts step-by-step with detailed explanations and examples.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></div>
                  <span className="text-[var(--text-primary)] font-mono text-xs lg:text-sm">HD Quality</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-[var(--accent-purple)] animate-pulse"></div>
                  <span className="text-[var(--text-primary)] font-mono text-xs lg:text-sm">Expert-led</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 hover-lift transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[var(--accent-primary)]">Difficulty</h3>
                <p className="text-lg font-mono font-bold">Beginner</p>
              </div>
            </div>
          </div>

          <div className="card p-6 hover-lift transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30 flex items-center justify-center">
                <span className="text-xl">⏱️</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[var(--accent-teal)]">Duration</h3>
                <p className="text-lg font-mono font-bold">2-4 hours</p>
              </div>
            </div>
          </div>

          <div className="card p-6 hover-lift transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/30 flex items-center justify-center">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <h3 className="font-mono font-semibold text-[var(--accent-purple)]">Certificate</h3>
                <p className="text-lg font-mono font-bold">Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}