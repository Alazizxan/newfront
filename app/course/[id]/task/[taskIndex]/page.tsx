"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function TaskPage() {
  const [course, setCourse] = useState<any>(null);
  const [task, setTask] = useState<any>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [lineNumbers, setLineNumbers] = useState<number[]>([1]);
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 });
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/course/list");
        const data = await res.json();
        const foundCourse = data.find((c: any) => c._id === params.id);

        if (!foundCourse) return router.push("/dashboard");

        setCourse(foundCourse);
        setTask(foundCourse.tasks[Number(params.taskIndex)]);
      } catch (error) {
        console.error("Error loading course:", error);
      }
    };

    fetchTask();
  }, []);

  useEffect(() => {
    const lines = code.split('\n');
    const lineCount = Math.max(lines.length, 20);
    setLineNumbers(Array.from({ length: lineCount }, (_, i) => i + 1));
    
    const lastLine = lines.length;
    const lastColumn = lines[lines.length - 1]?.length || 0;
    setCursorPosition({ line: lastLine, column: lastColumn + 1 });
  }, [code]);

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/course/submit/${params.id}/${params.taskIndex}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await res.json();
      setFeedback(data.feedback);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting code:", error);
      setFeedback("❌ Error submitting code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setSubmitted(false);
    setFeedback("");
    setCode("");
  };

  if (!task) return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] flex items-center justify-center pulse-glow">
          <div className="w-10 h-10 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full spinner"></div>
        </div>
        <p className="font-mono text-[var(--text-secondary)]">Loading task...</p>
      </div>
    </div>
  );

  const nextTaskIndex = Number(params.taskIndex) + 1;
  const hasNextTask = nextTaskIndex < course.tasks.length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="container-responsive py-6">
        {/* Header */}
        <div className="card p-6 lg:p-8 mb-8 dark-theme-shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4 lg:gap-6">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-secondary)] flex items-center justify-center hover-glow transition-all duration-300">
                <span className="text-2xl lg:text-3xl">🎯</span>
              </div>
              
              <div>
                <h1 className="text-2xl lg:text-3xl font-mono font-bold text-gradient mb-2">
                  {task.title}
                </h1>
                <div className="flex items-center gap-4 text-sm font-mono text-[var(--text-secondary)]">
                  <span>{course.title}</span>
                  <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]"></div>
                  <span>Task {Number(params.taskIndex) + 1}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push(`/course/${params.id}`)}
              className="btn-secondary px-6 py-3 rounded-lg font-mono text-sm hover-lift flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Course
            </button>
          </div>

          <div className="mt-6 p-6 bg-[var(--bg-tertiary)] border border-[var(--accent-primary)]/20 rounded-lg">
            <h2 className="text-lg font-mono font-semibold mb-4 text-[var(--accent-primary)] flex items-center gap-2">
              <span>📋</span>
              Task Description
            </h2>
            <p className="text-[var(--text-primary)] font-mono leading-relaxed">{task.description}</p>
          </div>
        </div>

        {/* Code Editor */}
        <div className="code-editor mb-8">
          <div className="code-editor-header">
            <div className="flex items-center gap-4">
              <div className="code-editor-dots">
                <div className="code-editor-dot bg-[var(--error)]"></div>
                <div className="code-editor-dot bg-[var(--warning)]"></div>
                <div className="code-editor-dot bg-[var(--success)]"></div>
              </div>
              <span className="text-[var(--text-secondary)] font-mono text-sm">solution.js</span>
            </div>
            <div className="text-xs text-[var(--text-muted)] font-mono">
              Line: {cursorPosition.line}, Column: {cursorPosition.column}
            </div>
          </div>
          
          <div className="code-editor-content">
            <div className="code-line-numbers">
              {lineNumbers.map((num) => (
                <div 
                  key={num} 
                  className={`transition-colors duration-200 ${
                    num === cursorPosition.line ? 'text-[var(--accent-primary)] bg-[var(--accent-primary)]/10' : ''
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
            
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Write your solution here\n// Example:\n\nfunction solution() {\n  // Your code goes here\n  \n  return result;\n}`}
              className={`code-textarea ${submitted ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={submitted}
              spellCheck={false}
            />
          </div>
        </div>

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            className="btn-primary w-full py-4 mb-8 rounded-lg font-mono font-bold text-white transition-all duration-300 dark-theme-shadow hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spinner"></div>
                <span>Running tests...</span>
              </>
            ) : (
              <>
                <span className="text-lg">🚀</span>
                <span>Submit Solution</span>
              </>
            )}
          </button>
        )}

        {/* Results */}
        {feedback && (
          <div className={`card mb-8 overflow-hidden ${
            feedback.includes("✅") 
              ? 'border-[var(--success)]/30 bg-gradient-to-br from-[var(--success)]/5 to-transparent' 
              : 'border-[var(--error)]/30 bg-gradient-to-br from-[var(--error)]/5 to-transparent'
          }`}>
            <div className={`px-6 py-4 border-b ${
              feedback.includes("✅") 
                ? 'bg-[var(--success)]/10 border-[var(--success)]/20' 
                : 'bg-[var(--error)]/10 border-[var(--error)]/20'
            } flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${
                feedback.includes("✅")
                  ? 'bg-[var(--success)]/20 border-[var(--success)]/40'
                  : 'bg-[var(--error)]/20 border-[var(--error)]/40'
              }`}>
                {feedback.includes("✅") ? (
                  <svg className="w-6 h-6 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-[var(--error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              
              <div>
                <h3 className={`font-mono font-bold text-lg ${
                  feedback.includes("✅") ? 'text-[var(--success)]' : 'text-[var(--error)]'
                }`}>
                  {feedback.includes("✅") ? 'Success!' : 'Test Failed'}
                </h3>
                <p className="text-[var(--text-secondary)] font-mono text-sm">
                  {feedback.includes("✅") ? 'All tests passed successfully' : 'Some tests did not pass'}
                </p>
              </div>
            </div>
            
            <div className="p-6">
              <pre className="whitespace-pre-wrap text-sm font-mono text-[var(--text-primary)] leading-relaxed bg-[var(--bg-primary)] p-4 rounded-lg border border-[var(--border-primary)]">
                {feedback}
              </pre>
              
              <div className="flex flex-wrap gap-4 mt-6">
                <button
                  onClick={() => router.push(`/course/${params.id}`)}
                  className="btn-secondary px-4 py-2 rounded-lg font-mono text-sm hover-lift flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Course
                </button>
                
                {!feedback.includes("✅") && (
                  <button
                    onClick={handleRetry}
                    className="btn-ghost px-4 py-2 rounded-lg font-mono text-sm hover-lift flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again
                  </button>
                )}
                
                {hasNextTask && feedback.includes("✅") && (
                  <button
                    onClick={() => router.push(`/course/${params.id}/task/${nextTaskIndex}`)}
                    className="btn-primary px-4 py-2 rounded-lg font-mono text-sm hover-lift flex items-center gap-2"
                  >
                    <span>Next Task</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}