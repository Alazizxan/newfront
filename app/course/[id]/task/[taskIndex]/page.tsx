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
        console.error("Kursni yuklashda xatolik:", error);
      }
    };

    fetchTask();
  }, []);

  useEffect(() => {
    const lines = code.split('\n');
    const lineCount = Math.max(lines.length, 15); // Optimal satrlar soni
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
      console.error("Kod yuborishda xatolik:", error);
      setFeedback("❌ Kodni yuborishda xatolik yuz berdi");
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
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mb-4"></div>
        <p>Yuklanmoqda...</p>
      </div>
    </div>
  );

  const nextTaskIndex = Number(params.taskIndex) + 1;
  const hasNextTask = nextTaskIndex < course.tasks.length;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Sarlavha */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold text-white">{task.title}</h1>
              <p className="text-gray-400">{course.title} - Vazifa {Number(params.taskIndex) + 1}</p>
            </div>
            <button
              onClick={() => router.push(`/course/${params.id}`)}
              className="text-gray-400 hover:text-white px-3 py-1 rounded border border-gray-700 text-sm"
            >
              Orqaga
            </button>
          </div>
        </div>

        {/* Vazifa tavsifi */}
        <div className="mb-6 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <h2 className="text-lg font-semibold mb-2 text-green-400">Vazifa:</h2>
          <p className="text-gray-300">{task.description}</p>
        </div>

        {/* Kod muharriri */}
        <div className="mb-6 rounded-lg overflow-hidden border border-gray-700">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              solution.js
            </div>
            <div className="text-xs text-gray-500">
              Satr: {cursorPosition.line}, Ustun: {cursorPosition.column}
            </div>
          </div>
          
          <div className="flex bg-gray-900">
            {/* Satr raqamlari */}
            <div className="w-10 bg-gray-800 text-right pr-2 py-2 text-gray-500 text-sm select-none">
              {lineNumbers.map((num) => (
                <div 
                  key={num} 
                  className={num === cursorPosition.line ? 'text-green-400 bg-gray-700' : ''}
                >
                  {num}
                </div>
              ))}
            </div>
            
            {/* Kod maydoni */}
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Yechimingizni shu yerga yozing\n\nfunction solution() {\n  // Kodni shu yerda yozing\n  \n}`}
              className={`flex-1 bg-gray-900 text-gray-300 p-2 font-mono text-sm focus:outline-none resize-none h-64 ${submitted ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={submitted}
              spellCheck={false}
              style={{
                caretColor: '#10b981',
                lineHeight: '1.5'
              }}
            />
          </div>
        </div>

        {/* Yuborish tugmasi */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-3 mb-6 rounded-lg font-medium ${loading ? 'bg-gray-700 text-gray-400' : 'bg-green-600 hover:bg-green-700 text-white'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Tekshirilmoqda...
              </span>
            ) : (
              "Yuborish"
            )}
          </button>
        )}

        {/* Natijalar */}
        {feedback && (
          <div className={`rounded-lg overflow-hidden mb-6 ${feedback.includes("✅") ? 'border border-green-500' : 'border border-red-500'}`}>
            <div className={`px-4 py-3 ${feedback.includes("✅") ? 'bg-green-900' : 'bg-red-900'} flex items-center`}>
              {feedback.includes("✅") ? (
                <>
                  <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="font-medium">Muvaffaqiyatli bajarildi!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span className="font-medium">Xatolik yuz berdi</span>
                </>
              )}
            </div>
            <div className="bg-gray-800 p-4">
              <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300">{feedback}</pre>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => router.push(`/course/${params.id}`)}
                  className="px-4 py-2 text-sm rounded border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white"
                >
                  Kursga qaytish
                </button>
                
                {!feedback.includes("✅") && (
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 text-sm rounded border border-yellow-600 hover:border-yellow-400 text-yellow-300 hover:text-yellow-200"
                  >
                    Qayta urinish
                  </button>
                )}
                
                {hasNextTask && feedback.includes("✅") && (
                  <button
                    onClick={() => router.push(`/course/${params.id}/task/${nextTaskIndex}`)}
                    className="px-4 py-2 text-sm rounded border border-green-600 hover:border-green-400 text-green-300 hover:text-green-200"
                  >
                    Keyingi vazifa
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