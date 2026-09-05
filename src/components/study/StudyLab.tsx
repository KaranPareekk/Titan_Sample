import React, { useState } from 'react';
import {
  Sparkles,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Bookmark,
  Layers,
} from 'lucide-react';

interface Flashcard {
  id: number;
  topic: string;
  question: string;
  answer: string;
  keyTakeaway: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    topic: 'System Architecture',
    question: 'Why does CPU cache locality drastically improve program performance?',
    answer: 'Modern CPUs read memory in blocks called Cache Lines (typically 64 bytes). Sequential memory access (spatial locality) and reusing recently accessed variables (temporal locality) allow data to stay in fast L1/L2 caches rather than stalling the CPU pipeline with high-latency RAM fetches.',
    keyTakeaway: 'Always prefer contiguous array layouts over scattered pointer-chasing structures in performance-critical inner loops.',
  },
  {
    id: 2,
    topic: 'Data Structures',
    question: 'Why is QuickSort preferred over MergeSort for in-memory primitive sorting in many systems?',
    answer: 'QuickSort is an in-place sort requiring only O(log n) auxiliary stack space, offering superior cache locality. MergeSort requires O(n) auxiliary allocation for merging arrays, incurring memory allocation overhead.',
    keyTakeaway: 'MergeSort is preferred when stability is required or for external sorting with sequential streaming.',
  },
  {
    id: 3,
    topic: 'Database Engineering',
    question: 'What is the fundamental difference between Clustered and Non-Clustered Indexes?',
    answer: 'A Clustered Index determines the physical order of data rows on disk (a table can have only ONE). A Non-Clustered Index is a separate B-Tree structure containing pointers to the actual data rows.',
    keyTakeaway: 'Primary keys default to clustered indexes to accelerate range queries on sequential IDs.',
  },
  {
    id: 4,
    topic: 'Digital Circuits',
    question: 'How does a Half Adder differ from a Full Adder?',
    answer: 'A Half Adder adds two single-bit binary inputs (A, B) and produces Sum (XOR) and Carry (AND). A Full Adder adds three inputs (A, B, and Carry-In), allowing multiple adders to be chained together into ripple-carry or carry-lookahead arithmetic units.',
    keyTakeaway: 'A Full Adder can be constructed from two Half Adders and one OR gate.',
  },
];

export const StudyLab: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);

  const card = FLASHCARDS[currentIndex];
  const isMastered = masteredIds.includes(card.id);

  const toggleMastered = () => {
    if (isMastered) {
      setMasteredIds(masteredIds.filter((id) => id !== card.id));
    } else {
      setMasteredIds([...masteredIds, card.id]);
    }
  };

  return (
    <div
      id="study-lab-root"
      className="h-full w-full flex flex-col bg-[#07090e] text-zinc-100 select-none overflow-hidden"
    >
      <div
        id="study-toolbar"
        className="h-14 bg-[#0c1017] border-b border-zinc-800 px-4 flex items-center justify-between shrink-0"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-tech text-xs font-bold text-zinc-200">
              TITAN ENGINEERING STUDY DECK
            </span>
            <span className="block text-[10px] font-mono text-zinc-400">
              Active Recall & System Architecture Concept Verification
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-zinc-400">
            Mastered: <strong className="text-cyan-400">{masteredIds.length}</strong> / {FLASHCARDS.length}
          </span>
        </div>
      </div>

      {/* Main Flashcard Arena */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-xl flex flex-col gap-4">
          {/* Card Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-[260px] p-8 rounded-2xl bg-[#0d1117] border border-cyan-500/30 hover:border-cyan-500/60 shadow-2xl flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.01]"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800 text-xs font-mono text-cyan-400">
                <span>{card.topic.toUpperCase()}</span>
                <span>{isFlipped ? 'ANSWER // BACK' : 'QUESTION // FRONT'}</span>
              </div>

              <div className="mt-6">
                {!isFlipped ? (
                  <h3 className="text-lg font-tech font-bold text-zinc-100 leading-snug">
                    {card.question}
                  </h3>
                ) : (
                  <div className="flex flex-col gap-3 font-mono text-xs text-zinc-200 leading-relaxed">
                    <p>{card.answer}</p>
                    <div className="mt-2 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300">
                      <strong>Key Insight:</strong> {card.keyTakeaway}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-zinc-400 font-mono text-xs">
              <span className="flex items-center gap-1 text-[11px]">
                <RotateCw className="w-3.5 h-3.5" />
                Click card to flip
              </span>
              <span>
                Card {currentIndex + 1} of {FLASHCARDS.length}
              </span>
            </div>
          </div>

          {/* Card Actions */}
          <div className="flex items-center justify-between font-mono text-xs">
            <button
              disabled={currentIndex === 0}
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex((prev) => prev - 1);
              }}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={toggleMastered}
              className={`px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                isMastered
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{isMastered ? 'Mastered' : 'Mark as Mastered'}</span>
            </button>

            <button
              disabled={currentIndex === FLASHCARDS.length - 1}
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex((prev) => prev + 1);
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold flex items-center gap-1 disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
