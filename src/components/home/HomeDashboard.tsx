import React from 'react';
import {
  GitGraph,
  Layers,
  Cpu,
  Code2,
  Database,
  GraduationCap,
  Sparkles,
  FileCode,
  FolderGit2,
  Bookmark,
  ArrowRight,
} from 'lucide-react';
import { ModuleId, UserProgress, SavedProgram } from '../../types';
import { StorageService } from '../../services/storage';

interface HomeDashboardProps {
  progress?: UserProgress;
  savedPrograms?: SavedProgram[];
  onNavigate: (module: ModuleId) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  progress: passedProgress,
  savedPrograms: passedPrograms,
  onNavigate,
}) => {
  const progress = passedProgress || StorageService.getProgress();
  const savedPrograms = passedPrograms || StorageService.getPrograms();

  const overallScore = Math.round(
    (Object.values(progress.topicMastery) as number[]).reduce((a: number, b: number) => a + b, 0) /
      Math.max(1, Object.keys(progress.topicMastery).length)
  );

  const dashoffset = 282.7 - (282.7 * overallScore) / 100;

  return (
    <div
      id="home-command-center"
      className="h-full w-full p-4 lg:p-6 station-bg overflow-y-auto flex flex-col lg:flex-row gap-6 text-slate-300 select-none"
    >
      {/* 2/3 Main Workstation Area */}
      <div className="flex-1 lg:w-2/3 flex flex-col gap-6">
        {/* Top Analytics Bar (Mastery Circle + 7-Day Activity) */}
        <div className="flex flex-col sm:flex-row gap-6 min-h-[190px]">
          {/* Engineering Core Mastery Circle */}
          <div className="sm:w-1/3 bg-[#0F172A]/90 cyan-glow border border-[#1E293B] rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
            
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#06b6d4"
                  strokeWidth="8"
                  strokeDasharray="282.7"
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white font-tech">{overallScore}%</span>
                <span className="text-[8px] uppercase tracking-tighter opacity-60 font-mono">Total Mastery</span>
              </div>
            </div>

            <div className="mt-2 text-xs font-bold text-cyan-400 font-tech uppercase tracking-wider">
              ENGINEERING CORE
            </div>

            <button
              onClick={() => onNavigate('assessment')}
              className="mt-1 text-[10px] terminal-font text-slate-400 hover:text-cyan-300 underline"
            >
              Verify Competency →
            </button>
          </div>

          {/* Learning Activity Histogram */}
          <div className="sm:w-2/3 bg-[#0F172A]/90 border border-[#1E293B] rounded-lg p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Learning Activity
                </h3>
                <span className="text-[10px] terminal-font text-slate-500">
                  Total Lab Time: <strong className="text-cyan-400">{progress.totalTimeMinutes} min</strong> • Completed Labs: <strong className="text-white">{progress.completedLabs.length}</strong>
                </span>
              </div>
              <span className="text-[10px] terminal-font text-cyan-500 border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-950/40">
                LAST 7 DAYS
              </span>
            </div>

            <div className="flex items-end justify-between h-24 gap-2 pt-2 border-b border-[#1E293B] pb-2">
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-slate-800 group-hover:bg-slate-700 transition-all rounded-t h-12" />
                <span className="text-[9px] terminal-font text-slate-500">MON</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-slate-800 group-hover:bg-slate-700 transition-all rounded-t h-16" />
                <span className="text-[9px] terminal-font text-slate-500">TUE</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-cyan-500/40 group-hover:bg-cyan-500/60 transition-all rounded-t h-20" />
                <span className="text-[9px] terminal-font text-cyan-400">WED</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-cyan-500 group-hover:bg-cyan-400 transition-all rounded-t h-24 shadow-[0_0_10px_rgba(6,182,212,0.4)]" />
                <span className="text-[9px] terminal-font text-cyan-300 font-bold">THU</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-cyan-500/50 group-hover:bg-cyan-500/70 transition-all rounded-t h-14" />
                <span className="text-[9px] terminal-font text-cyan-400">FRI</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-slate-800 group-hover:bg-slate-700 transition-all rounded-t h-10" />
                <span className="text-[9px] terminal-font text-slate-500">SAT</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-slate-700 group-hover:bg-slate-600 transition-all rounded-t h-8" />
                <span className="text-[9px] terminal-font text-slate-500">SUN</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2x2 Workstation Lab Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {/* DBMS Sandbox */}
          <div
            id="card-dbms-sandbox"
            onClick={() => onNavigate('dbms')}
            className="bg-[#0F172A]/90 border border-[#1E293B] rounded-lg p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Database className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">DBMS Sandbox</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mb-3">
                Interact with relational models and execute complex SQL chains with schemas and multi-table queries.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80">
              <span className="text-[9px] font-bold text-blue-400 uppercase terminal-font">
                Mastery: {progress.topicMastery['Databases'] || 92}%
              </span>
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${progress.topicMastery['Databases'] || 92}%` }}
                />
              </div>
            </div>
          </div>

          {/* Digital Logic Lab */}
          <div
            id="card-circuit-lab"
            onClick={() => onNavigate('circuits')}
            className="bg-[#0F172A]/90 border border-[#1E293B] rounded-lg p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Cpu className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">Digital Logic Lab</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mb-3">
                Design gate-level circuits, route pin connections, and observe live signal propagation and truth tables.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80">
              <span className="text-[9px] font-bold text-cyan-400 uppercase terminal-font">
                Complex Circuits
              </span>
              <span className="text-[9px] px-2 py-0.5 bg-cyan-500/20 rounded text-cyan-300 terminal-font font-bold">
                RESUME LAB
              </span>
            </div>
          </div>

          {/* Polyglot IDE */}
          <div
            id="card-code-lab"
            onClick={() => onNavigate('codelab')}
            className="bg-[#0F172A]/90 border border-[#1E293B] rounded-lg p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Code2 className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">Polyglot IDE</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mb-3">
                Full educational runtime support for Python, Java, and JS with STDIN prompts and live execution tracing.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80">
              <div className="flex gap-1.5">
                <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">PYTHON</span>
                <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">JAVA</span>
                <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">JS</span>
              </div>
              <span className="text-[9px] terminal-font text-purple-400 font-bold">STDIN PRIMED</span>
            </div>
          </div>

          {/* Algorithms Lab */}
          <div
            id="card-algorithms-lab"
            onClick={() => onNavigate('dsa')}
            className="bg-[#0F172A]/90 border border-[#1E293B] rounded-lg p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <GitGraph className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">Algorithms Lab</h4>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight mb-3">
                Step-by-step visual execution of sorting, searching, binary trees, Dijkstra, and BFS/DFS graph traversals.
              </p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80">
              <div className="flex items-center gap-2 flex-1 mr-3">
                <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${progress.topicMastery['Algorithms'] || 78}%` }}
                  />
                </div>
                <span className="text-[9px] terminal-font text-amber-400 font-bold">
                  {progress.topicMastery['Algorithms'] || 78}%
                </span>
              </div>
              <span className="text-[9px] text-slate-500 font-mono">10 MODELS</span>
            </div>
          </div>
        </div>

        {/* Secondary Navigation Row: Memory Lab, Knowledge, Study */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onNavigate('memory')}
            className="p-3 bg-[#0F172A]/70 border border-[#1E293B] hover:border-cyan-500/40 rounded-lg flex items-center justify-between group transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-tech font-semibold text-slate-200 group-hover:text-white">
                Memory & Hardware
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('study')}
            className="p-3 bg-[#0F172A]/70 border border-[#1E293B] hover:border-cyan-500/40 rounded-lg flex items-center justify-between group transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-tech font-semibold text-slate-200 group-hover:text-white">
                Engineering Study Deck
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </button>

          <button
            onClick={() => onNavigate('workspace')}
            className="p-3 bg-[#0F172A]/70 border border-[#1E293B] hover:border-cyan-500/40 rounded-lg flex items-center justify-between group transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-tech font-semibold text-slate-200 group-hover:text-white">
                My Workspace ({savedPrograms.length})
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* 1/3 Right Column (Active Terminal + Quick Actions) */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        {/* Active Terminal Panel */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg overflow-hidden flex flex-col flex-1 shadow-xl min-h-[260px]">
          <div className="p-3 bg-[#1E293B] flex justify-between items-center select-none">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-200 terminal-font">
              Active Terminal
            </span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500/70" />
              <div className="w-2 h-2 rounded-full bg-amber-500/70" />
              <div className="w-2 h-2 rounded-full bg-green-500/70" />
            </div>
          </div>

          <div className="flex-1 p-4 terminal-font text-[10px] space-y-2.5 overflow-y-auto opacity-90 text-slate-300">
            <p className="text-cyan-400">[TITAN] System initialized successfully.</p>
            <p className="text-slate-500">&gt; loading module: logic_gate_sim... OK</p>
            <p className="text-slate-500">&gt; loading module: sql_v3_engine... OK</p>
            <p className="text-green-400">[SUCCESS] All workstation modules online.</p>
            <p className="text-slate-500">&gt; current_user: student_ENG_09</p>
            <p className="text-white">&gt; Saved programs: {savedPrograms.length} item(s)</p>
            
            {savedPrograms.length > 0 && (
              <p className="text-cyan-300">
                &gt; Last file: {savedPrograms[0].title} ({savedPrograms[0].language})
              </p>
            )}

            <div className="border-l-2 border-cyan-500 pl-2 bg-cyan-500/5 py-1.5 rounded-r">
              <p className="text-cyan-300 font-bold">RECO-SYSTEM:</p>
              <p className="text-slate-400">Assessment 'Graph Theory' is available. Estimated duration: 15min.</p>
            </div>

            <p className="text-cyan-400 animate-pulse font-bold">_</p>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-lg p-4 flex flex-col shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 terminal-font">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onNavigate('codelab')}
              className="control-btn rounded-lg p-3 flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold terminal-font text-slate-200 group-hover:text-cyan-400">
                NEW PROJECT
              </span>
            </button>

            <button
              onClick={() => onNavigate('workspace')}
              className="control-btn rounded-lg p-3 flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold terminal-font text-slate-200 group-hover:text-cyan-400">
                WORKSPACE
              </span>
            </button>

            <button
              onClick={() => onNavigate('assessment')}
              className="control-btn rounded-lg p-3 flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold terminal-font text-slate-200 group-hover:text-cyan-400">
                CERTIFY
              </span>
            </button>

            <button
              onClick={() => onNavigate('knowledge')}
              className="control-btn rounded-lg p-3 flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-bold terminal-font text-slate-200 group-hover:text-cyan-400">
                HANDBOOK
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
