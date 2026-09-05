import React, { useState, useMemo } from 'react';
import {
  Play,
  Save,
  RotateCcw,
  Trash2,
  Clock,
  FolderOpen,
  Terminal,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Hash,
} from 'lucide-react';
import { SavedProgram } from '../../types';
import { StorageService } from '../../services/storage';
import { runJavaScript, runPython, runJava, ExecutionResult } from './codeRuntime';

const DEFAULT_TEMPLATES = {
  python: `# Python 3.12 Educational Workstation
# STDIN input() consumption demonstration

n = int(input())
nums = []
for i in range(n):
    val = int(input())
    nums.append(val)

print("Original array:", nums)
nums.reverse()
print("Reversed array:", nums)
print("Sum of elements:", sum(nums))
`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("=== TITAN JAVA RUNTIME ===");
        
        String name = scanner.nextLine();
        int age = scanner.nextInt();
        double gpa = scanner.nextDouble();
        
        System.out.println("Student: " + name);
        System.out.println("Age: " + age);
        System.out.println("GPA: " + gpa);
        
        if (gpa >= 3.5) {
            System.out.println("Status: DEAN'S LIST HONORS");
        } else {
            System.out.println("Status: GOOD STANDING");
        }
    }
}
`,
  javascript: `// TITAN JavaScript Educational Sandbox
const limit = parseInt(TITAN.input());
console.log("Generating Fibonacci numbers up to limit:", limit);

const fib = [0, 1];
for (let i = 2; i <= limit; i++) {
  fib.push(fib[i - 1] + fib[i - 2]);
}

console.log("Fibonacci Sequence:", fib);
console.log("Golden Ratio approx:", (fib[limit] / fib[limit - 1]).toFixed(6));
`,
};

const DEFAULT_STDINS = {
  python: `5\n12\n45\n67\n89\n100`,
  java: `Alex Mercer\n21\n3.85`,
  javascript: `10`,
};

export const CodeLab: React.FC = () => {
  const [language, setLanguage] = useState<'javascript' | 'python' | 'java'>('python');
  const [code, setCode] = useState<string>(DEFAULT_TEMPLATES.python);
  const [stdin, setStdin] = useState<string>(DEFAULT_STDINS.python);
  const [programTitle, setProgramTitle] = useState<string>('Array Reversal & Input Reader');

  const [activeExecutedLine, setActiveExecutedLine] = useState<number | null>(null);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [showLoadModal, setShowLoadModal] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Saved programs from local storage
  const [savedPrograms, setSavedPrograms] = useState<SavedProgram[]>(() =>
    StorageService.getPrograms()
  );

  // Language switch handler
  const handleLanguageChange = (newLang: 'javascript' | 'python' | 'java') => {
    setLanguage(newLang);
    setCode(DEFAULT_TEMPLATES[newLang]);
    setStdin(DEFAULT_STDINS[newLang]);
    setExecutionResult(null);
    setActiveExecutedLine(null);
    if (newLang === 'python') setProgramTitle('Python STDIN Reader');
    else if (newLang === 'java') setProgramTitle('Java Scanner Runtime');
    else setProgramTitle('JavaScript Generator');
  };

  // Run Code
  const handleRunCode = () => {
    setIsRunning(true);
    setActiveExecutedLine(null);

    setTimeout(() => {
      let result: ExecutionResult;
      if (language === 'python') {
        result = runPython(code, stdin);
      } else if (language === 'java') {
        result = runJava(code, stdin);
      } else {
        result = runJavaScript(code, stdin);
      }

      setExecutionResult(result);
      if (result.executedLines.length > 0) {
        setActiveExecutedLine(result.executedLines[result.executedLines.length - 1]);
      }
      setIsRunning(false);
    }, 150);
  };

  // Save Program
  const handleSaveProgram = () => {
    const newProg: SavedProgram = {
      id: `prog_${Date.now()}`,
      title: programTitle || `${language.toUpperCase()} Program`,
      language,
      code,
      stdin,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    StorageService.saveProgram(newProg);
    setSavedPrograms(StorageService.getPrograms());
    setSaveStatus('SAVED TO STORAGE');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  // Load Program
  const handleLoadProgram = (prog: SavedProgram) => {
    setLanguage(prog.language);
    setCode(prog.code);
    setStdin(prog.stdin);
    setProgramTitle(prog.title);
    setShowLoadModal(false);
    setExecutionResult(null);
  };

  // Code Stats
  const charCount = code.length;
  const lineCount = useMemo(() => code.split('\n').length, [code]);

  return (
    <div
      id="codelab-root"
      className="h-full w-full flex flex-col bg-[#07090e] text-zinc-100 select-none overflow-hidden"
    >
      {/* Top IDE Toolbar */}
      <div
        id="codelab-toolbar"
        className="h-14 bg-[#0c1017] border-b border-zinc-800 px-4 flex flex-wrap items-center justify-between gap-3 shrink-0"
      >
        {/* Left: Program title & Language selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <input
              id="input-program-title"
              type="text"
              value={programTitle}
              onChange={(e) => setProgramTitle(e.target.value)}
              className="bg-transparent text-xs font-mono text-zinc-100 focus:outline-none w-48 font-semibold"
              placeholder="Program Title..."
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
            {(['python', 'java', 'javascript'] as const).map((lang) => (
              <button
                key={lang}
                id={`btn-lang-${lang}`}
                onClick={() => handleLanguageChange(lang)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition-all ${
                  language === lang
                    ? 'bg-cyan-500 text-black shadow-[0_0_8px_#06b6d4]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Actions: RUN, SAVE, LOAD, RESET */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {saveStatus && (
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveStatus}
            </span>
          )}

          <button
            id="btn-run-code"
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.4)] disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'EXECUTING...' : 'RUN PROGRAM'}</span>
          </button>

          <button
            id="btn-save-code"
            onClick={handleSaveProgram}
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>SAVE</span>
          </button>

          <button
            id="btn-load-code"
            onClick={() => setShowLoadModal(true)}
            className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-semibold flex items-center gap-1"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>LOAD</span>
          </button>

          <button
            id="btn-reset-code"
            onClick={() => {
              setCode(DEFAULT_TEMPLATES[language]);
              setStdin(DEFAULT_STDINS[language]);
              setExecutionResult(null);
            }}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-zinc-700"
            title="Reset Template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split: Code Editor (Left) & Runtime Terminal with STDIN (Right) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left: Code Editor (7 cols) */}
        <div
          id="codelab-editor-pane"
          className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-800 bg-[#090d14] overflow-hidden"
        >
          {/* Editor Header Bar */}
          <div className="h-8 bg-[#0b0f17] border-b border-zinc-800 px-4 flex items-center justify-between text-[11px] font-mono text-zinc-400 shrink-0">
            <span>SOURCE EDITOR // {language.toUpperCase()}</span>
            <div className="flex items-center gap-3">
              <span>{lineCount} LINES</span>
              <span>{charCount} CHARS</span>
            </div>
          </div>

          {/* Textarea Code Editor with line gutter */}
          <div className="flex-1 flex overflow-hidden font-mono text-xs">
            {/* Line numbers column */}
            <div className="w-10 bg-[#07090e] border-r border-zinc-800/80 py-3 text-right pr-2 text-zinc-400 select-none overflow-hidden shrink-0">
              {Array.from({ length: lineCount }).map((_, i) => {
                const lineNum = i + 1;
                const isExecuted = activeExecutedLine === lineNum;
                return (
                  <div
                    key={i}
                    className={`leading-relaxed ${isExecuted ? 'text-cyan-400 font-bold bg-cyan-950/60' : ''}`}
                  >
                    {lineNum}
                  </div>
                );
              })}
            </div>

            {/* Editable code area */}
            <textarea
              id="editor-code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent text-zinc-200 font-mono text-xs leading-relaxed focus:outline-none resize-none overflow-auto whitespace-pre"
            />
          </div>
        </div>

        {/* Right: Runtime Terminal & STDIN Area (5 cols) */}
        <div
          id="codelab-terminal-pane"
          className="lg:col-span-5 flex flex-col bg-[#080b11] overflow-hidden"
        >
          {/* STDIN Input Buffer Header & Area */}
          <div className="border-b border-zinc-800 p-3 bg-[#0a0e16] flex flex-col shrink-0">
            <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
              <span className="text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" />
                STDIN / PROGRAM INPUT BUFFER
              </span>
              <span className="text-zinc-400">Consumed by input() & Scanner</span>
            </div>
            <textarea
              id="stdin-input-textarea"
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              rows={4}
              placeholder="Enter values separated by spaces or newlines..."
              className="w-full bg-[#05070a] border border-zinc-800 rounded p-2 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none resize-none"
            />
          </div>

          {/* Terminal Output Header */}
          <div className="h-8 bg-[#0b0f17] border-b border-zinc-800 px-3 flex items-center justify-between text-[11px] font-mono text-zinc-400 shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>RUNTIME TERMINAL (STDOUT / STDERR)</span>
            </div>
            <div className="flex items-center gap-3">
              {executionResult && (
                <span className="flex items-center gap-1 text-zinc-300">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  {executionResult.executionTimeMs} ms
                </span>
              )}
              <button
                id="btn-clear-terminal"
                onClick={() => setExecutionResult(null)}
                className="text-zinc-400 hover:text-white"
                title="Clear Terminal Output"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Terminal Output Window */}
          <div className="flex-1 bg-[#05070a] p-4 font-mono text-xs overflow-y-auto flex flex-col gap-1 select-text">
            {!executionResult ? (
              <div className="text-zinc-400 italic">
                Ready. Click RUN PROGRAM to compile and execute in browser runtime.
              </div>
            ) : (
              <>
                {executionResult.stdout.map((line, idx) => (
                  <div key={idx} className="text-zinc-200 leading-relaxed font-mono">
                    {line}
                  </div>
                ))}

                {executionResult.stderr.map((err, idx) => (
                  <div key={idx} className="text-red-400 font-bold leading-relaxed flex items-start gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>{err}</span>
                  </div>
                ))}

                <div className="mt-4 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
                  <span>Process finished with exit code {executionResult.success ? 0 : 1}</span>
                  <span>Execution Time: {executionResult.executionTimeMs} ms</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Load Program Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#0d1117] border border-cyan-500/40 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <span className="font-tech text-sm font-bold text-cyan-400">
                SAVED PROGRAMS REPOSITORY
              </span>
              <button
                onClick={() => setShowLoadModal(false)}
                className="text-zinc-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {savedPrograms.length === 0 ? (
                <div className="text-zinc-400 text-xs font-mono p-4 text-center">
                  No saved programs found.
                </div>
              ) : (
                savedPrograms.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-200 font-mono">
                        {prog.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono uppercase">
                        {prog.language} • {prog.code.split('\n').length} lines • {new Date(prog.updatedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleLoadProgram(prog)}
                        className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => {
                          StorageService.deleteProgram(prog.id);
                          setSavedPrograms(StorageService.getPrograms());
                        }}
                        className="p-1 rounded text-zinc-400 hover:text-red-400"
                        title="Delete Program"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
