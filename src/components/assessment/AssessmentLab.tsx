import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Send,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Clock,
  Terminal,
  Search,
  Code2,
  Copy,
  Check,
} from 'lucide-react';
import {
  CodingLanguage,
  ProblemDifficulty,
  CODING_PROBLEMS,
  LANGUAGE_METADATA,
  executeCodingChallenge,
} from './codingProblems';
import { CertificateModal } from './CertificateModal';
import { StorageService } from '../../services/storage';
import { UserProfile } from '../../types';

export const AssessmentLab: React.FC = () => {
  const [profile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [selectedLanguage, setSelectedLanguage] = useState<CodingLanguage>('python');
  const [selectedProblemId, setSelectedProblemId] = useState<string>(CODING_PROBLEMS[0]?.id || 'prob-1');
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | ProblemDifficulty>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Arrays');
  const allCategories = ['Arrays', 'Strings', 'Searching', 'Sorting', 'Trees', 'Graphs', 'Dynamic Programming'];
  
  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(() => {
    try {
      const rawStored = localStorage.getItem('titan_solved_coding_problems');
      return rawStored ? JSON.parse(rawStored) : ['prob-1'];
    } catch {
      return ['prob-1'];
    }
  });

  const selectedProblem = useMemo(() => {
    return CODING_PROBLEMS.find((p) => p.id === selectedProblemId) || CODING_PROBLEMS[0];
  }, [selectedProblemId]);

  const [userCode, setUserCode] = useState<string>('');
  const [customStdin, setCustomStdin] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tests' | 'stdin' | 'output'>('tests');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);

  const [lastVerdict, setLastVerdict] = useState<{
    verdict: 'ACCEPTED' | 'WRONG_ANSWER' | 'RUNTIME_ERROR' | null;
    stdout: string;
    stderr: string;
    executionTimeMs: number;
    testCasesPassed?: number;
    totalTestCases?: number;
  }>({
    verdict: null,
    stdout: '',
    stderr: '',
    executionTimeMs: 0,
  });

  useEffect(() => {
    if (!selectedProblem) return;
    const starter = selectedProblem.starterCode[selectedLanguage] || LANGUAGE_METADATA[selectedLanguage].defaultCode;
    setUserCode(starter);
    if (selectedProblem.testCases && selectedProblem.testCases.length > 0) {
      setCustomStdin(selectedProblem.testCases[0].input);
    }
    setLastVerdict({ verdict: null, stdout: '', stderr: '', executionTimeMs: 0 });
  }, [selectedProblemId, selectedLanguage]);

  const filteredProblems = useMemo(() => {
    return CODING_PROBLEMS.filter((prob) => {
      const matchDiff = difficultyFilter === 'All' || prob.difficulty === difficultyFilter;
      const matchSearch =
        prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prob.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDiff && matchSearch;
    });
  }, [difficultyFilter, searchQuery]);

  const categoryProblems = useMemo(() => {
    if (!selectedCategory) return [];
    return filteredProblems.filter((p) => p.category === selectedCategory);
  }, [filteredProblems, selectedCategory]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newVal = val.substring(0, start) + '    ' + val.substring(end);
      setUserCode(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleRunSample = async () => {
    if (!selectedProblem || isRunning || isSubmitting) return;
    setIsRunning(true);
    setActiveTab('output');

    const sample = selectedProblem.testCases[0];
    const stdinToUse = customStdin.trim() ? customStdin : sample?.input || '';
    const expectedOut = sample?.expectedOutput;

    try {
      const res = await executeCodingChallenge(selectedLanguage, userCode, stdinToUse, expectedOut);
      setLastVerdict({
        verdict: res.verdict,
        stdout: res.stdout,
        stderr: res.stderr,
        executionTimeMs: res.executionTimeMs,
      });
    } catch (err: any) {
      setLastVerdict({
        verdict: 'RUNTIME_ERROR',
        stdout: '',
        stderr: err.message || 'Execution error',
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedProblem || isRunning || isSubmitting) return;
    setIsSubmitting(true);
    setActiveTab('output');

    let allPassed = true;
    let failedVerdict: 'WRONG_ANSWER' | 'RUNTIME_ERROR' = 'WRONG_ANSWER';
    let lastOut = '';
    let lastErr = '';
    let totalTime = 0;
    let passedCount = 0;

    const testCases = selectedProblem.testCases;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      try {
        const res = await executeCodingChallenge(selectedLanguage, userCode, tc.input, tc.expectedOutput);
        totalTime += res.executionTimeMs;
        if (res.isCorrect) {
          passedCount++;
        } else {
          allPassed = false;
          failedVerdict = res.verdict === 'RUNTIME_ERROR' ? 'RUNTIME_ERROR' : 'WRONG_ANSWER';
          lastOut = res.stdout;
          lastErr = res.stderr || `Test case ${i + 1} failed.\nInput:\n${tc.input}\nExpected:\n${tc.expectedOutput}\nGot:\n${res.stdout}`;
          break;
        }
      } catch (err: any) {
        allPassed = false;
        failedVerdict = 'RUNTIME_ERROR';
        lastErr = err.message || 'Compilation or runtime error';
        break;
      }
    }

    if (allPassed) {
      setLastVerdict({
        verdict: 'ACCEPTED',
        stdout: `All ${testCases.length} test cases passed successfully!\nAverage runtime: ${(totalTime / testCases.length).toFixed(1)}ms`,
        stderr: '',
        executionTimeMs: totalTime,
        testCasesPassed: testCases.length,
        totalTestCases: testCases.length,
      });

      if (!solvedProblemIds.includes(selectedProblem.id)) {
        const updated = [...solvedProblemIds, selectedProblem.id];
        setSolvedProblemIds(updated);
        try {
          localStorage.setItem('titan_solved_coding_problems', JSON.stringify(updated));
          const curProg = StorageService.getProgress();
          curProg.completedLabs = Array.from(new Set([...curProg.completedLabs, 'code_' + selectedProblem.id]));
          curProg.totalTimeMinutes += 5;
          StorageService.saveProgress(curProg);
        } catch (e) {
          // ignore
        }
      }
    } else {
      setLastVerdict({
        verdict: failedVerdict,
        stdout: lastOut,
        stderr: lastErr,
        executionTimeMs: totalTime,
        testCasesPassed: passedCount,
        totalTestCases: testCases.length,
      });
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    if (!selectedProblem) return;
    const starter = selectedProblem.starterCode[selectedLanguage] || LANGUAGE_METADATA[selectedLanguage].defaultCode;
    setUserCode(starter);
    setLastVerdict({ verdict: null, stdout: '', stderr: '', executionTimeMs: 0 });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const languages: CodingLanguage[] = ['python', 'javascript', 'java', 'cpp', 'go', 'kotlin'];

  return (
    <div className="h-full w-full flex flex-col bg-[#07090e] text-zinc-100 select-none overflow-hidden font-sans">
      {/* Top Bar */}
      <header className="px-4 py-2.5 bg-[#0a0f1d] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-tech text-sm font-bold tracking-wide text-white uppercase flex items-center gap-2">
                Coding Arena
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold">
                  JUDGE V2
                </span>
              </h1>
            </div>
          </div>

          <div className="h-4 w-px bg-white/[0.1] hidden sm:block" />

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-400">
            <span className="text-zinc-500">Solved:</span>
            <span className="text-emerald-400 font-bold">
              {solvedProblemIds.length} / {CODING_PROBLEMS.length}
            </span>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-1 bg-[#06080e] p-1 rounded-lg border border-white/[0.08] overflow-x-auto">
          {languages.map((lang) => {
            const meta = LANGUAGE_METADATA[lang];
            const isSelected = selectedLanguage === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                <span>{meta.name}</span>
                <span className="text-[9px] opacity-60">.{meta.ext}</span>
              </button>
            );
          })}
        </div>

        {/* Claim Certificate Action */}
        <button
          type="button"
          onClick={() => setIsCertModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-amber-600/10 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Claim Certificate</span>
        </button>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Pane: Problem Spec */}
        <div className="w-full lg:w-[420px] xl:w-[460px] bg-[#090e1a] border-r border-white/[0.08] flex flex-col shrink-0 overflow-hidden">
          {/* Search and Filters */}
          <div className="p-3 bg-[#0d1424] border-b border-white/[0.08] flex flex-col gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#06080e] border border-white/[0.1] rounded-lg text-xs font-sans text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-2 py-0.5 rounded text-[10px] cursor-pointer transition-colors ${
                    difficultyFilter === diff
                      ? 'bg-white/[0.12] text-white font-bold border border-white/[0.2]'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Two-Level Problem Selector Navigation */}
          {/* Level 1: Horizontal scrollable categories */}
          <div className="px-3 py-2 bg-[#090d18] border-b border-purple-900/40 overflow-x-auto flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
              TOPIC:
            </span>
            {allCategories.map((cat) => {
              const isCatActive = selectedCategory === cat;
              const catTotal = CODING_PROBLEMS.filter((p) => p.category === cat).length;
              const catSolved = CODING_PROBLEMS.filter(
                (p) => p.category === cat && solvedProblemIds.includes(p.id)
              ).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    if (selectedCategory === cat) {
                      setSelectedCategory(null); // Click collapses Level 2!
                    } else {
                      setSelectedCategory(cat);
                      const first = CODING_PROBLEMS.find((p) => p.category === cat);
                      if (first && (!selectedProblem || selectedProblem.category !== cat)) {
                        setSelectedProblemId(first.id);
                      }
                    }
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                    isCatActive
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-400/80 font-bold shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                      : 'bg-white/[0.03] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:bg-white/[0.06]'
                  }`}
                  title={`${cat} (${catSolved}/${catTotal} solved) - Click to ${isCatActive ? 'collapse' : 'expand'}`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-sans ${
                      isCatActive
                        ? 'bg-purple-500/40 text-purple-100'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {catSolved}/{catTotal}
                  </span>
                  <span className="text-[9px] opacity-70">
                    {isCatActive ? '▾' : '▸'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Level 2: Horizontal scrollable individual problems under selected category */}
          {selectedCategory && (
            <div className="px-3 py-2 bg-[#060a14] border-b border-white/[0.08] overflow-x-auto flex items-center gap-1.5 shrink-0 transition-all duration-200">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase shrink-0 mr-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                {selectedCategory}:
              </span>
              {categoryProblems.length === 0 ? (
                <span className="text-[11px] font-mono text-zinc-500 italic">No matching challenges</span>
              ) : (
                categoryProblems.map((prob) => {
                  const isSelected = prob.id === selectedProblemId;
                  const isSolved = solvedProblemIds.includes(prob.id);
                  return (
                    <button
                      key={prob.id}
                      type="button"
                      onClick={() => setSelectedProblemId(prob.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap flex items-center gap-1.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-500/25 text-purple-100 border border-purple-400 font-bold shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                          : 'bg-white/[0.02] text-zinc-400 hover:text-zinc-200 border border-white/[0.04]'
                      }`}
                    >
                      {isSolved ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            prob.difficulty === 'Easy'
                              ? 'bg-emerald-400'
                              : prob.difficulty === 'Medium'
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                      )}
                      <span>{prob.title}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}

          {/* Problem Spec Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  {selectedProblem.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      selectedProblem.difficulty === 'Easy'
                        ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
                        : selectedProblem.difficulty === 'Medium'
                        ? 'text-amber-400 border-amber-500/30 bg-amber-950/40'
                        : 'text-rose-400 border-rose-500/30 bg-rose-950/40'
                    }`}
                  >
                    {selectedProblem.difficulty}
                  </span>
                  {solvedProblemIds.includes(selectedProblem.id) && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Solved
                    </span>
                  )}
                </div>
              </div>
              <h2 className="font-tech text-lg font-bold text-white tracking-tight">
                {selectedProblem.title}
              </h2>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-zinc-300 leading-relaxed whitespace-pre-line font-sans">
              {selectedProblem.description}
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                  Input Format
                </span>
                <p className="font-mono text-zinc-300 whitespace-pre-line text-[11px]">
                  {selectedProblem.inputFormat}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1">
                  Output Format
                </span>
                <p className="font-mono text-zinc-300 whitespace-pre-line text-[11px]">
                  {selectedProblem.outputFormat}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block mb-1.5">
                Constraints
              </span>
              <ul className="list-disc list-inside space-y-1 font-mono text-zinc-300 text-[11px]">
                {selectedProblem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            {selectedProblem.testCases.length > 0 && (
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                  Sample 1
                </span>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block">Sample Input:</span>
                  <pre className="p-2 rounded bg-black/60 border border-white/[0.06] font-mono text-cyan-300 text-[11px] overflow-x-auto mt-0.5">
                    {selectedProblem.testCases[0].input}
                  </pre>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 block">Sample Output:</span>
                  <pre className="p-2 rounded bg-black/60 border border-white/[0.06] font-mono text-emerald-300 text-[11px] overflow-x-auto mt-0.5">
                    {selectedProblem.testCases[0].expectedOutput}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Code Editor & Console */}
        <div className="flex-1 flex flex-col bg-[#07090e] overflow-hidden">
          {/* Header Bar */}
          <div className="px-4 py-2 bg-[#0a0f1c] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-bold">{LANGUAGE_METADATA[selectedLanguage].name}</span>
              <span className="text-zinc-500 text-[10px]">({LANGUAGE_METADATA[selectedLanguage].version})</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset to starter solution"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative overflow-hidden bg-[#07090e]">
            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="w-full h-full p-4 font-mono text-[13px] leading-relaxed text-zinc-100 bg-transparent resize-none focus:outline-none focus:ring-0 selection:bg-cyan-500/30"
              style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                tabSize: 4,
              }}
            />
          </div>

          {/* Bottom Execution Console Drawer */}
          <div className="h-[230px] border-t border-white/[0.08] bg-[#090d18] flex flex-col shrink-0">
            <div className="px-4 py-2 bg-[#0c1222] border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab('tests')}
                  className={`px-2.5 py-1 rounded-md cursor-pointer transition-all ${
                    activeTab === 'tests'
                      ? 'bg-white/[0.1] text-white font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Test Cases ({selectedProblem.testCases.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('stdin')}
                  className={`px-2.5 py-1 rounded-md cursor-pointer transition-all ${
                    activeTab === 'stdin'
                      ? 'bg-white/[0.1] text-white font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Custom STDIN
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('output')}
                  className={`px-2.5 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1.5 ${
                    activeTab === 'output'
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Terminal className="w-3 h-3" />
                  <span>Verdict & Output</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleRunSample}
                  disabled={isRunning || isSubmitting}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-mono font-semibold text-zinc-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all"
                >
                  <Play className="w-3 h-3 fill-zinc-200" />
                  <span>{isRunning ? 'Running...' : 'Run Sample'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isRunning || isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs">
              {activeTab === 'tests' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProblem.testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06] flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span className="font-bold uppercase">Test Case #{idx + 1}</span>
                        {tc.isSample && (
                          <span className="text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-1 rounded">
                            SAMPLE
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500">STDIN:</span>
                        <pre className="text-zinc-300 text-[11px] truncate">{tc.input}</pre>
                      </div>
                      <div>
                        <span className="text-[9px] text-zinc-500">Expected:</span>
                        <pre className="text-emerald-400 text-[11px] truncate">{tc.expectedOutput}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'stdin' && (
                <div className="h-full flex flex-col gap-1.5">
                  <span className="text-[10px] text-zinc-400">Custom Standard Input:</span>
                  <textarea
                    value={customStdin}
                    onChange={(e) => setCustomStdin(e.target.value)}
                    placeholder="Enter input data to pass to stdin..."
                    className="flex-1 p-2.5 rounded-lg bg-black/50 border border-white/[0.08] font-mono text-xs text-cyan-300 resize-none focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              )}

              {activeTab === 'output' && (
                <div className="space-y-2">
                  {lastVerdict.verdict ? (
                    <div>
                      <div
                        className={`p-3 rounded-lg border flex items-center justify-between ${
                          lastVerdict.verdict === 'ACCEPTED'
                            ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                            : lastVerdict.verdict === 'WRONG_ANSWER'
                            ? 'bg-rose-950/50 border-rose-500/40 text-rose-300'
                            : 'bg-amber-950/50 border-amber-500/40 text-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {lastVerdict.verdict === 'ACCEPTED' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          ) : lastVerdict.verdict === 'WRONG_ANSWER' ? (
                            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                          )}
                          <div>
                            <span className="font-tech font-bold text-sm tracking-wider">
                              {lastVerdict.verdict === 'ACCEPTED'
                                ? 'ACCEPTED'
                                : lastVerdict.verdict === 'WRONG_ANSWER'
                                ? 'WRONG ANSWER'
                                : 'RUNTIME / COMPILATION ERROR'}
                            </span>
                            {lastVerdict.testCasesPassed !== undefined && (
                              <span className="text-xs ml-2 opacity-80">
                                ({lastVerdict.testCasesPassed} / {lastVerdict.totalTestCases} Testcases Passed)
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{lastVerdict.executionTimeMs} ms</span>
                        </div>
                      </div>

                      {lastVerdict.stdout && (
                        <div className="mt-2">
                          <span className="text-[10px] text-zinc-500 block mb-0.5">Program Output (stdout):</span>
                          <pre className="p-2.5 rounded-lg bg-black/60 border border-white/[0.08] text-emerald-300 whitespace-pre-wrap">
                            {lastVerdict.stdout}
                          </pre>
                        </div>
                      )}

                      {lastVerdict.stderr && (
                        <div className="mt-2">
                          <span className="text-[10px] text-rose-400 block mb-0.5">Traceback / Errors:</span>
                          <pre className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30 text-rose-300 whitespace-pre-wrap">
                            {lastVerdict.stderr}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-500 py-6">
                      <Terminal className="w-8 h-8 opacity-30 mb-2" />
                      <p>Run sample tests or submit solution to view execution output.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        language={selectedLanguage}
        solvedCount={solvedProblemIds.length}
        totalCount={CODING_PROBLEMS.length}
        profile={profile}
      />
    </div>
  );
};
