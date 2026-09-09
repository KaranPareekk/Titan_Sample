import React, { useState, useMemo } from 'react';
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
  User,
  Mail,
  ExternalLink,
  Upload,
  Globe,
  Github,
  Linkedin,
  Copy,
  Check,
  Newspaper,
  Terminal,
  Zap,
  Bot,
  Cloud,
} from 'lucide-react';
import { ModuleId, UserProgress, SavedProgram, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { TitanLogo } from '../common/TitanLogo';
import { UserProfileModal } from './UserProfileModal';

interface HomeDashboardProps {
  progress?: UserProgress;
  savedPrograms?: SavedProgram[];
  onNavigate: (module: ModuleId) => void;
}

const TECH_NEWS = [
  {
    id: 1,
    category: 'AI & SYSTEM ARCHITECTURE',
    title: 'Gemini 2.5 Flash Unveils Multimodal Real-Time Native Streaming Engine',
    source: 'Google DeepMind Blog',
    time: '2 hours ago',
    tag: 'NEW',
    tagColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
  },
  {
    id: 2,
    category: 'LINUX & KERNEL',
    title: 'Linux Kernel 6.14 Improves eBPF Memory Locality & Zero-Copy I/O Rings',
    source: 'Kernel.org Release Notes',
    time: '5 hours ago',
    tag: 'CORE',
    tagColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40',
  },
  {
    id: 3,
    category: 'DATABASE INTERNALS',
    title: 'B+ Tree Index Concurrency: Lock-Free Latch Protocols in Modern NVMe SSDs',
    source: 'SIGMOD Systems Review',
    time: '12 hours ago',
    tag: 'DBMS',
    tagColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
  },
  {
    id: 4,
    category: 'DISTRIBUTED SYSTEMS',
    title: 'Raft Consensus Protocol Optimization for Sub-Millisecond Multi-Region Quorums',
    source: 'ACM Queue Papers',
    time: '1 day ago',
    tag: 'PAPERS',
    tagColor: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
  },
];

const CLOUD_DEPLOY_TARGETS = [
  {
    name: 'Vercel',
    tagline: 'Instant Edge & Next/Vite Deploy',
    url: 'https://vercel.com/new',
    description: 'Deploy project to global edge network directly with automatic Git CI/CD.',
    color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-300',
    buttonText: 'Deploy on Vercel',
  },
  {
    name: 'GitHub',
    tagline: 'Create Repo & Push Source',
    url: 'https://github.com/new',
    description: 'Host codebase on GitHub, collaborate with contributors, and enable GitHub Actions.',
    color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-300',
    buttonText: 'Push to GitHub',
  },
  {
    name: 'Netlify',
    tagline: 'Drop & Instant Static Hosting',
    url: 'https://app.netlify.com/drop',
    description: 'Drag & drop distribution files or import Git repo for zero-config global hosting.',
    color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
    buttonText: 'Netlify Drop',
  },
  {
    name: 'Render',
    tagline: 'Fullstack Cloud Containers',
    url: 'https://render.com',
    description: 'Deploy Node backends, Docker images, and managed Postgres relational databases.',
    color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-300',
    buttonText: 'Deploy on Render',
  },
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  progress: passedProgress,
  savedPrograms: passedPrograms,
  onNavigate,
}) => {
  const progress = passedProgress || StorageService.getProgress();
  const savedPrograms = passedPrograms || StorageService.getPrograms();

  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Day activity calculations
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const past7Days = useMemo(() => {
    const days = [];
    const baseMinutes = Math.max(5, Math.floor(progress.totalTimeMinutes / 7));
    const completedCount = progress.completedLabs.length;
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = dayNames[d.getDay()];
      const isToday = i === 0;
      const factor = (7 - i) / 7;
      const minutes = isToday
        ? Math.round(baseMinutes * 1.3 + completedCount * 4)
        : Math.round(baseMinutes * (0.5 + factor * 0.9));
      const heightPercent = Math.min(100, Math.max(18, Math.round((minutes / Math.max(30, baseMinutes * 2)) * 85)));
      days.push({ dayName, minutes, heightPercent, isToday });
    }
    return days;
  }, [progress.totalTimeMinutes, progress.completedLabs.length]);

  const overallScore = Math.round(
    (Object.values(progress.topicMastery) as number[]).reduce((a: number, b: number) => a + b, 0) /
      Math.max(1, Object.keys(progress.topicMastery).length)
  );

  const dashoffset = 282.7 - (282.7 * overallScore) / 100;

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div
      id="home-command-center"
      className="h-full w-full p-4 lg:p-6 station-bg overflow-y-auto flex flex-col gap-6 text-slate-300 select-none font-sans"
    >
      {/* 1. FUTURISTIC HERO BANNER & PROFILE CARD */}
      <section className="bg-gradient-to-r from-[#0d1424] via-[#0b101c] to-[#07090e] border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Brand Logo & Mission Statement */}
        <div className="flex items-center gap-4 relative z-10 w-full lg:w-auto">
          <TitanLogo size={56} />
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="font-tech text-xl sm:text-2xl font-bold tracking-wider text-white">
                TITAN_OS
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-700/60 text-[10px] font-mono text-cyan-400 font-bold uppercase">
                ENGINEERING WORKSTATION
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono leading-relaxed max-w-xl">
              The high-performance operating environment for elite software engineers, systems architects, and technical problem solvers.
            </p>
          </div>
        </div>

        {/* User Identity & Profile Badge */}
        <div className="flex items-center gap-4 p-3.5 rounded-xl bg-[#07090e]/80 border border-slate-700/80 shadow-lg relative z-10 w-full lg:w-auto justify-between sm:justify-start">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-cyan-400 p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.4)] overflow-hidden">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#07090e] shadow-[0_0_6px_#10b981]" />
          </div>

          <div className="flex flex-col font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">{profile.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 border border-purple-800 text-purple-300 font-bold">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold">{profile.title || 'Senior Systems Engineer'}</span>
            <span className="text-[10px] text-slate-400 truncate max-w-[180px]">{profile.email}</span>

            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="mt-1 text-[10px] text-cyan-400 hover:text-cyan-300 underline text-left cursor-pointer"
            >
              Edit Profile & Links →
            </button>
          </div>
        </div>
      </section>

      {/* 2. 1-CLICK CLOUD DEPLOY & PROJECT UPLOAD HUB */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-200 font-tech">
              1-Click Cloud Deploy & Project Upload Hub
            </h2>
          </div>
          <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
            Direct upload & deploy links for Vercel, GitHub, Netlify & Render
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {CLOUD_DEPLOY_TARGETS.map((target, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl bg-gradient-to-br ${target.color} bg-[#0e1422] border flex flex-col justify-between gap-3 shadow-md hover:scale-[1.01] transition-transform`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-tech text-sm font-bold text-white tracking-wide">
                    {target.name}
                  </span>
                  <span className="text-[9px] font-mono uppercase text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">
                    CLOUD
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-cyan-300 block mb-1">
                  {target.tagline}
                </span>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {target.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                <a
                  href={target.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer w-full justify-center"
                >
                  <span>{target.buttonText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Quick CLI Deployment Helper */}
        <div className="p-3 bg-[#0a0f1d] border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-400">Git Clone:</span>
            <code className="bg-black/60 px-2 py-0.5 rounded text-cyan-300 border border-slate-800 truncate">
              git clone https://github.com/KaranPareekk/Titan_Sample.git
            </code>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => copyCommand('git clone https://github.com/KaranPareekk/Titan_Sample.git', 'clone')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] flex items-center gap-1 cursor-pointer"
            >
              {copiedCmd === 'clone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCmd === 'clone' ? 'Copied' : 'Copy Clone'}</span>
            </button>
            <a
              href="https://github.com/KaranPareekk/Titan_Sample"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-300 text-[11px] flex items-center gap-1"
            >
              <Github className="w-3 h-3" />
              <span>View Repo</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSTATION BODY: 2/3 Left (Analytics + Labs) & 1/3 Right (News + Socials + Terminal) */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 2/3 Main Workstation Area */}
        <div className="flex-1 lg:w-2/3 flex flex-col gap-6">
          {/* Top Analytics Bar (Mastery Circle + 7-Day Activity) */}
          <div className="flex flex-col sm:flex-row gap-6 min-h-[190px]">
            {/* Engineering Core Mastery Circle */}
            <div className="sm:w-1/3 bg-[#0F172A]/90 cyan-glow border border-[#1E293B] rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />

              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="transparent" stroke="#1e293b" strokeWidth="8" />
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
                type="button"
                onClick={() => onNavigate('assessment')}
                className="mt-1 text-[10px] terminal-font text-slate-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Verify Competency →
              </button>
            </div>

            {/* Learning Activity Histogram */}
            <div className="sm:w-2/3 bg-[#0F172A]/90 border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Learning & Code Activity
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
                {past7Days.map((day, dIdx) => (
                  <div key={dIdx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div
                      className={`w-full transition-all rounded-t ${
                        day.isToday
                          ? 'bg-cyan-500 group-hover:bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                          : day.heightPercent > 50
                          ? 'bg-cyan-500/50 group-hover:bg-cyan-500/70'
                          : 'bg-slate-800 group-hover:bg-slate-700'
                      }`}
                      style={{ height: `${day.heightPercent}%` }}
                      title={`${day.dayName}: ${day.minutes} min`}
                    />
                    <span
                      className={`text-[9px] terminal-font ${
                        day.isToday ? 'text-cyan-300 font-bold' : 'text-slate-500'
                      }`}
                    >
                      {day.dayName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2x2 Workstation Lab Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* DBMS Sandbox */}
            <div
              id="card-dbms-sandbox"
              onClick={() => onNavigate('dbms')}
              className="bg-[#0F172A]/90 border border-[#1E293B] rounded-xl p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">DBMS SQL Workbench</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight mb-3">
                  In-memory relational engine with interactive schema navigator, multi-table JOINs, and GROUP BY execution.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80">
                <span className="text-[9px] font-bold text-amber-400 uppercase terminal-font">
                  Mastery: {progress.topicMastery['Databases'] ?? 85}%
                </span>
                <span className="text-[9px] px-2 py-0.5 bg-amber-500/20 rounded text-amber-300 terminal-font font-bold">
                  LAUNCH SQL
                </span>
              </div>
            </div>

            {/* Polyglot IDE */}
            <div
              id="card-code-lab"
              onClick={() => onNavigate('codelab')}
              className="bg-[#0F172A]/90 border border-[#1E293B] rounded-xl p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">Polyglot IDE & Compilers</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight mb-3">
                  Full virtual file & folder explorer, file import/upload engine, and execution tracing for Python, Java, and JS.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80">
                <div className="flex gap-1.5">
                  <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">FILE IMPORT</span>
                  <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">EXPLORER</span>
                </div>
                <span className="text-[9px] terminal-font text-purple-400 font-bold">LAUNCH IDE</span>
              </div>
            </div>

            {/* Digital Logic Lab */}
            <div
              id="card-circuit-lab"
              onClick={() => onNavigate('circuits')}
              className="bg-[#0F172A]/90 border border-[#1E293B] rounded-xl p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">Digital Logic Lab</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight mb-3">
                  Design gate-level circuits, route pin connections, and observe live boolean signal propagation.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80">
                <span className="text-[9px] font-bold text-cyan-400 uppercase terminal-font">
                  Interactive Gates
                </span>
                <span className="text-[9px] px-2 py-0.5 bg-cyan-500/20 rounded text-cyan-300 terminal-font font-bold">
                  RESUME LAB
                </span>
              </div>
            </div>

            {/* Algorithms Lab */}
            <div
              id="card-algorithms-lab"
              onClick={() => onNavigate('dsa')}
              className="bg-[#0F172A]/90 border border-[#1E293B] rounded-xl p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <GitGraph className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-slate-200 group-hover:text-white">Algorithms & DSA Lab</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight mb-3">
                  Step-by-step visual execution of sorting, binary search, Dijkstra, and BFS/DFS graph traversals.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/80">
                <span className="text-[9px] font-bold text-emerald-400 uppercase terminal-font">
                  Mastery: {progress.topicMastery['Algorithms'] ?? 78}%
                </span>
                <span className="text-[9px] text-slate-400 font-mono">10 MODELS</span>
              </div>
            </div>
          </div>

          {/* Secondary Navigation Row: AI Copilot, Knowledge Base, Workspace */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => onNavigate('ai')}
              className="p-3 bg-[#0F172A]/80 border border-[#1E293B] hover:border-cyan-500/50 rounded-xl flex items-center justify-between group transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-tech font-semibold text-slate-200 group-hover:text-white">
                  AI Engineering Copilot
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('knowledge')}
              className="p-3 bg-[#0F172A]/80 border border-[#1E293B] hover:border-cyan-500/50 rounded-xl flex items-center justify-between group transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-tech font-semibold text-slate-200 group-hover:text-white">
                  Knowledge Base (Big-O & Latency)
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('workspace')}
              className="p-3 bg-[#0F172A]/80 border border-[#1E293B] hover:border-cyan-500/50 rounded-xl flex items-center justify-between group transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-tech font-semibold text-slate-200 group-hover:text-white">
                  My Workspace ({savedPrograms.length} items)
                </span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 transition-colors" />
            </button>
          </div>
        </div>

        {/* 1/3 Right Column: News Feed & Developer Profiles */}
        <div className="lg:w-1/3 flex flex-col gap-5">
          {/* TECH NEWS / ENGINEERING WIRE FEED */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl overflow-hidden flex flex-col shadow-xl">
            <div className="p-3 bg-[#162032] border-b border-[#1E293B] flex justify-between items-center select-none">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200 terminal-font flex items-center gap-1.5">
                <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
                Engineering Wire & News
              </span>
              <span className="text-[9px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                LIVE
              </span>
            </div>

            <div className="p-3 space-y-3 max-h-[320px] overflow-y-auto font-mono text-xs">
              {TECH_NEWS.map((news) => (
                <div
                  key={news.id}
                  className="p-2.5 rounded-lg bg-[#0a0f1d] border border-slate-800 hover:border-cyan-500/40 transition-colors flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {news.category}
                    </span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${news.tagColor}`}>
                      {news.tag}
                    </span>
                  </div>
                  <h5 className="font-semibold text-zinc-200 leading-snug text-[11px] hover:text-cyan-300 cursor-pointer">
                    {news.title}
                  </h5>
                  <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-1">
                    <span>{news.source}</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DEVELOPER PLATFORM CONNECT */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 flex flex-col gap-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-200 terminal-font flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                Developer Platforms
              </span>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="text-[10px] text-cyan-400 hover:underline cursor-pointer"
              >
                Configure
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <a
                href={profile.githubUrl || 'https://github.com/KaranPareekk'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0a0f1d] border border-slate-800 hover:border-slate-600 flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4 text-slate-400" />
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-slate-500">GitHub</span>
                  <span className="truncate text-[11px] font-semibold">
                    {profile.githubUrl ? profile.githubUrl.split('/').pop() : 'Profile'}
                  </span>
                </div>
              </a>

              <a
                href={profile.linkedinUrl || 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0a0f1d] border border-slate-800 hover:border-blue-500/50 flex items-center gap-2 text-slate-300 hover:text-blue-300 transition-colors"
              >
                <Linkedin className="w-4 h-4 text-blue-400" />
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-slate-500">LinkedIn</span>
                  <span className="truncate text-[11px] font-semibold">Connected</span>
                </div>
              </a>

              <a
                href={profile.leetcodeUrl || 'https://leetcode.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0a0f1d] border border-slate-800 hover:border-amber-500/50 flex items-center gap-2 text-slate-300 hover:text-amber-300 transition-colors"
              >
                <Code2 className="w-4 h-4 text-amber-400" />
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-slate-500">LeetCode</span>
                  <span className="truncate text-[11px] font-semibold">Rank Top 5%</span>
                </div>
              </a>

              <a
                href={profile.codeforcesUrl || 'https://codeforces.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0a0f1d] border border-slate-800 hover:border-red-500/50 flex items-center gap-2 text-slate-300 hover:text-red-300 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-red-400" />
                <div className="flex flex-col truncate">
                  <span className="text-[10px] text-slate-500">Codeforces</span>
                  <span className="truncate text-[11px] font-semibold">Candidate Master</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(up) => setProfile(up)}
      />
    </div>
  );
};
