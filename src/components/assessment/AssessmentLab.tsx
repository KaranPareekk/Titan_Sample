import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Award,
  Zap,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { StorageService } from '../../services/storage';

interface Question {
  id: number;
  category: 'DSA' | 'Memory' | 'DBMS' | 'Circuits';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'DSA',
    prompt: 'What is the worst-case time complexity of QuickSort when a naive pivot selection is used on an already sorted array?',
    options: ['O(n log n)', 'O(n²)', 'O(log n)', 'O(n)'],
    correctIndex: 1,
    explanation: 'When the pivot does not partition the array evenly, the recursion depth becomes n, leading to n * (n-1) / 2 comparisons, or O(n²).',
  },
  {
    id: 2,
    category: 'Memory',
    prompt: 'In a 64-bit operating system architecture, what is the size of a standard pointer?',
    options: ['4 bytes (32 bits)', '8 bytes (64 bits)', '16 bytes (128 bits)', '2 bytes (16 bits)'],
    correctIndex: 1,
    explanation: 'A 64-bit virtual memory address space requires 64-bit (8-byte) pointers to address memory.',
  },
  {
    id: 3,
    category: 'Circuits',
    prompt: 'Which logic gate produces HIGH (1) if and only if an ODD number of inputs are HIGH (1)?',
    options: ['NAND Gate', 'NOR Gate', 'XOR Gate', 'AND Gate'],
    correctIndex: 2,
    explanation: 'The XOR (Exclusive OR) gate outputs 1 when the inputs differ, acting as an odd-parity detector.',
  },
  {
    id: 4,
    category: 'DBMS',
    prompt: 'In SQL, which clause is specifically used to filter groups created by the GROUP BY clause?',
    options: ['WHERE', 'HAVING', 'FILTER', 'ORDER BY'],
    correctIndex: 1,
    explanation: 'WHERE filters individual rows before grouping, while HAVING filters aggregate groups after GROUP BY.',
  },
  {
    id: 5,
    category: 'DSA',
    prompt: 'Which graph traversal algorithm uses a First-In-First-Out (FIFO) Queue to explore nodes level-by-level?',
    options: ['Depth-First Search (DFS)', 'Breadth-First Search (BFS)', 'Bellman-Ford', 'Kruskal Algorithm'],
    correctIndex: 1,
    explanation: 'BFS uses a FIFO queue to discover neighbors uniformly before moving deeper.',
  },
  {
    id: 6,
    category: 'Memory',
    prompt: 'What condition occurs when dynamic memory allocated on the heap is never freed after all pointers to it are lost?',
    options: ['Stack Overflow', 'Memory Leak', 'Segmentation Fault', 'Dangling Pointer'],
    correctIndex: 1,
    explanation: 'A memory leak happens when allocated heap memory remains reserved because the program lost all references to deallocate it.',
  },
];

export const AssessmentLab: React.FC = () => {
  const [mode, setMode] = useState<'practice' | 'timed'>('practice');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3 minutes in timed mode
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Timer in timed mode
  useEffect(() => {
    if (mode === 'timed' && isTimerRunning && !isSubmitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsSubmitted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, isTimerRunning, isSubmitted, timeLeft]);

  const handleSelectOption = (optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIdx,
    }));
  };

  const handleStartExam = (newMode: 'practice' | 'timed') => {
    setMode(newMode);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setTimeLeft(180);
    setIsTimerRunning(newMode === 'timed');
  };

  const calculateScore = () => {
    let score = 0;
    QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setIsTimerRunning(false);

    // Save assessment record to storage
    const finalScore = calculateScore();
    const pct = Math.round((finalScore / QUESTIONS.length) * 100);
    StorageService.saveAssessment({
      score: finalScore,
      totalQuestions: QUESTIONS.length,
      mode,
      completedAt: Date.now(),
    });
  };

  const currentQ = QUESTIONS[currentIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const finalScore = calculateScore();

  return (
    <div
      id="assessment-lab-root"
      className="h-full w-full flex flex-col bg-[#07090e] text-zinc-100 select-none overflow-hidden"
    >
      {/* Top Header */}
      <div
        id="assessment-toolbar"
        className="h-14 bg-[#0c1017] border-b border-zinc-800 px-4 flex flex-wrap items-center justify-between gap-3 shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-tech text-xs font-bold text-zinc-200">
              TITAN ENGINEERING ASSESSMENT & CERTIFICATION
            </span>
            <span className="block text-[10px] font-mono text-zinc-400">
              Interactive Examination Engine • DSA, Memory, DBMS, and Logic
            </span>
          </div>
        </div>

        {/* Mode & Timer Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => handleStartExam('practice')}
              className={`px-3 py-1 rounded transition-all font-semibold ${
                mode === 'practice'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_#06b6d4]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              PRACTICE MODE
            </button>
            <button
              onClick={() => handleStartExam('timed')}
              className={`px-3 py-1 rounded transition-all font-semibold ${
                mode === 'timed'
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_#06b6d4]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              TIMED EXAM (3 MIN)
            </button>
          </div>

          {mode === 'timed' && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-cyan-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-tech font-bold text-xs shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all"
            >
              SUBMIT EXAM
            </button>
          ) : (
            <button
              onClick={() => handleStartExam(mode)}
              className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-tech font-bold text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RETAKE</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Split: Question Navigator + Active Question Panel */}
      <div className="flex-1 overflow-hidden p-4 md:p-6 flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto w-full">
        {/* Left: Questions List / Score summary */}
        <div className="w-full lg:w-64 flex flex-col gap-3 shrink-0 font-mono">
          <div className="bg-[#0c1017] border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 shadow-lg">
            <span className="text-xs text-zinc-400 font-bold">QUESTION PALETTE</span>

            <div className="grid grid-cols-3 gap-2">
              {QUESTIONS.map((q, idx) => {
                const isCurrent = currentIndex === idx;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isCorrect = isSubmitted && selectedAnswers[idx] === q.correctIndex;
                const isWrong = isSubmitted && isAnswered && selectedAnswers[idx] !== q.correctIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                          : isWrong
                          ? 'bg-red-950 border-red-500 text-red-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                        : isCurrent
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_#06b6d4]'
                        : isAnswered
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                    }`}
                  >
                    Q{idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 flex justify-between">
              <span>ANSWERED</span>
              <span className="text-cyan-400 font-bold">
                {answeredCount} / {QUESTIONS.length}
              </span>
            </div>
          </div>

          {/* Results Card if submitted */}
          {isSubmitted && (
            <div className="bg-[#0c1017] border border-cyan-500/40 rounded-xl p-4 flex flex-col gap-2 shadow-2xl">
              <div className="flex items-center gap-2 text-cyan-400 font-tech font-bold text-xs">
                <Award className="w-4 h-4" />
                <span>EXAM RESULTS</span>
              </div>
              <div className="text-2xl font-bold font-tech text-white">
                {finalScore} / {QUESTIONS.length} ({Math.round((finalScore / QUESTIONS.length) * 100)}%)
              </div>
              <span className="text-[10px] text-zinc-400">
                {finalScore >= 5 ? 'Status: CERTIFIED ADVANCED' : 'Status: NEEDS PRACTICE'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Active Question & Choices */}
        <div className="flex-1 bg-[#0c1017] border border-zinc-800 rounded-xl p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4 font-mono text-xs">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-cyan-400 font-bold">
                {currentQ.category}
              </span>
              <span className="text-zinc-400">
                Question {currentIndex + 1} of {QUESTIONS.length}
              </span>
            </div>

            {/* Prompt */}
            <h2 className="text-base md:text-lg font-tech font-semibold text-zinc-100 leading-snug mb-6">
              {currentQ.prompt}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-2.5 font-mono text-xs">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[currentIndex] === optIdx;
                const isCorrect = isSubmitted && optIdx === currentQ.correctIndex;
                const isWrong = isSubmitted && isSelected && !isCorrect;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                          : isWrong
                          ? 'bg-red-950/60 border-red-500 text-red-200'
                          : 'bg-zinc-900/50 border-zinc-800 text-zinc-400'
                        : isSelected
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                        : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-400">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    {isSubmitted && isWrong && <XCircle className="w-4 h-4 text-red-400" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submission */}
            {isSubmitted && (
              <div className="mt-6 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 font-mono text-xs text-zinc-300">
                <span className="text-cyan-400 font-bold block mb-1">ENGINEERING EXPLANATION:</span>
                {currentQ.explanation}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-zinc-800 mt-6 font-mono text-xs">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 disabled:opacity-40"
            >
              Previous
            </button>

            {currentIndex < QUESTIONS.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : !isSubmitted ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-tech font-bold"
              >
                Submit Exam
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
