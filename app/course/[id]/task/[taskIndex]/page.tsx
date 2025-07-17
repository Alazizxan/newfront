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
    const lineCount = Math.max(lines.length, 15);
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
      setFeedback("❌ Error submitting code");
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
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-[#1a1a2e] border border-cyan-500/30 flex items-center justify-center pulse-neon">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full spinner-neon"></div>
        </div>
        <p className="font-mono text-zinc-400">Loading task...</p>
      </div>
    </div>
  );

  const nextTaskIndex = Number(params.taskIndex) + 1;
  const hasNextTask = nextTaskIndex < course.tasks.length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-zinc-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 p-6 rounded-2xl bg-[#1a1a2e]/80 backdrop-blur-xl border border-cyan-500/20 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-mono font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {task.title}
              </h1>
              <p className="text-zinc-400 font-mono text-sm mt-1">
                {course.title} • Task {Number(params.taskIndex) + 1}
              </p>
            </div>
            <button
              onClick={() => router.push(`/course/${params.id}`)}
              className="px-4 py-2 bg-[#16213e] border border-zinc-600/30 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-lg font-mono text-sm transition-all duration-200"
            >
              ← Back
            </button>
          </div>

          <div className="p-4 bg-[#16213e]/60 border border-blue-400/20 rounded-lg">
            <h2 className="text-lg font-mono font-semibold mb-2 text-blue-400">Task Description:</h2>
            <p className="text-zinc-300 font-mono leading-relaxed">{task.description}</p>
          </div>
        </div>

        {/* Code Editor */}
        <div className="mb-6 rounded-2xl overflow-hidden border border-cyan-500/20 shadow-lg">
          <div className="bg-[#1a1a2e] px-6 py-3 border-b border-cyan-500/20 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <span className="text-zinc-400 font-mono text-sm">solution.js</span>
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              Line: {cursorPosition.line}, Col: {cursorPosition.column}
            </div>
          </div>
          
          <div className="flex bg-[#0f0f1a]">
            {/* Line Numbers */}
            <div className="w-12 bg-[#1a1a2e] text-right pr-3 py-4 text-zinc-500 text-sm font-mono select-none border-r border-cyan-500/10">
              {lineNumbers.map((num) => (
                <div 
                  key={num} 
                  className={`leading-6 ${num === cursorPosition.line ? 'text-cyan-400 bg-cyan-400/10' : ''}`}
                >
                  {num}
                </div>
              ))}
            </div>
            
            {/* Code Area */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Write your solution here\n\nfunction solution() {\n  // Your code goes here\n  \n}`}
              className={`flex-1 bg-[#0f0f1a] text-zinc-300 p-4 font-mono text-sm focus:outline-none resize-none h-80 leading-6 ${submitted ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={submitted}
              spellCheck={false}
              style={{
                caretColor: '#00d4ff',
                tabSize: 2
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full py-4 mb-6 rounded-xl font-mono font-bold text-white transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full spinner-neon mr-2"></div>
                Running tests...
              </>
            ) : (
              <>
                <span className="mr-2">🚀</span>
                Submit Solution
              </>
            )}
          </button>
        )}

        {/* Results */}
        {feedback && (
          <div className={`rounded-2xl overflow-hidden mb-6 border ${feedback.includes("✅") ? 'border-emerald-500/30' : 'border-red-500/30'} shadow-lg`}>
            <div className={`px-6 py-4 ${feedback.includes("✅") ? 'bg-emerald-500/10' : 'bg-red-500/10'} flex items-center`}>
              {feedback.includes("✅") ? (
                <>
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">Success!</span>
                </>
              ) : (
                <>
                  <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <span className="font-mono font-bold text-red-400">Test Failed</span>
                </>
              )}
            </div>
            
            <div className="bg-[#1a1a2e]/80 p-6">
              <pre className="whitespace-pre-wrap text-sm font-mono text-zinc-300 leading-relaxed">{feedback}</pre>
              
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => router.push(`/course/${params.id}`)}
                  className="px-4 py-2 text-sm rounded-lg border border-zinc-600/30 hover:border-zinc-500 text-zinc-300 hover:text-white font-mono transition-all duration-200"
                >
                  ← Back to Course
                </button>
                
                {!feedback.includes("✅") && (
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 text-sm rounded-lg border border-yellow-500/30 hover:border-yellow-400 text-yellow-300 hover:text-yellow-200 font-mono transition-all duration-200"
                  >
                    🔄 Try Again
                  </button>
                )}
                
                {hasNextTask && feedback.includes("✅") && (
                  <button
                    onClick={() => router.push(`/course/${params.id}/task/${nextTaskIndex}`)}
                    className="px-4 py-2 text-sm rounded-lg border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 font-mono transition-all duration-200"
                  >
                    Next Task →
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