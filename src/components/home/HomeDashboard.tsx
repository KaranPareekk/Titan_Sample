import React, { useState, useMemo } from 'react';
import {
  Code2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Newspaper,
  Terminal,
  Cloud,
  Rocket,
  Globe,
  Award,
  Play,
  TrendingUp,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, VercelIcon, RenderIcon, GitKrakenIcon } from '../common/BrandIcons';
import { ModuleId, UserProgress, SavedProgram, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { CloudinaryService } from '../../services/cloudinary';
import { CloudinaryImage } from '../common/CloudinaryImage';
import { TitanLogo } from '../common/TitanLogo';
import { UserProfileModal } from './UserProfileModal';

interface HomeDashboardProps {
  progress?: UserProgress;
  savedPrograms?: SavedProgram[];
  onNavigate: (module: ModuleId) => void;
  onOpenCloudinary?: () => void;
}

interface NewsItem {
  id: number;
  category: string;
  categoryKey: 'all' | 'ai' | 'systems' | 'hardware' | 'cloud' | 'dbms';
  title: string;
  summary: string;
  source: string;
  time: string;
  tag: string;
  tagColor: string;
  imageUrl: string;
  articleUrl: string;
}

const TECH_NEWS: NewsItem[] = [
  {
    id: 1,
    category: 'AI & Systems',
    categoryKey: 'ai',
    title: 'Gemini 2.5 Flash Unveils Multimodal Native Streaming Architecture',
    summary: 'Sub-100ms real-time bidirectional audio, video, and reasoning engine deployed across edge infrastructure.',
    source: 'Google DeepMind',
    time: '2h ago',
    tag: 'NEW',
    tagColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
    articleUrl: 'https://deepmind.google/technologies/gemini/',
  },
  {
    id: 2,
    category: 'Linux Kernel',
    categoryKey: 'systems',
    title: 'Linux 6.14 Enhances eBPF Memory Locality & Zero-Copy I/O Rings',
    summary: 'Kernel optimizations unlock 40% higher network throughput and ultra-low latency memory mappings for servers.',
    source: 'Kernel.org',
    time: '4h ago',
    tag: 'CORE',
    tagColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=600&q=80',
    articleUrl: 'https://kernelnewbies.org/LinuxChanges',
  },
  {
    id: 3,
    category: 'Silicon & Hardware',
    categoryKey: 'hardware',
    title: 'Next-Gen 2nm GAAFET Nodes Enter Pilot Production for High-Density AI Chips',
    summary: 'Gate-All-Around nanosheet transistor architecture cuts switching energy by 30% while boosting clock headroom.',
    source: 'IEEE Spectrum',
    time: '6h ago',
    tag: 'CHIPS',
    tagColor: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    articleUrl: 'https://spectrum.ieee.org/semiconductors',
  },
  {
    id: 4,
    category: 'Distributed Systems',
    categoryKey: 'cloud',
    title: 'Raft Consensus Protocol Optimization for Sub-Millisecond Multi-Region Quorums',
    summary: 'Novel pipelined commit protocols mitigate cross-continental round-trips in globally partitioned databases.',
    source: 'ACM Queue',
    time: '9h ago',
    tag: 'PAPERS',
    tagColor: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    articleUrl: 'https://queue.acm.org/',
  },
  {
    id: 5,
    category: 'DBMS Internals',
    categoryKey: 'dbms',
    title: 'Lock-Free B+ Trees Achieve 12M Transactions/sec on PCIe Gen5 NVMe Drives',
    summary: 'Hardware-assisted latch-free index operations remove thread contention in high-concurrency OLTP workloads.',
    source: 'SIGMOD Review',
    time: '14h ago',
    tag: 'STORAGE',
    tagColor: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
    articleUrl: 'https://sigmod.org/',
  },
  {
    id: 6,
    category: 'Quantum Computing',
    categoryKey: 'hardware',
    title: 'Topological Qubits Demonstrate Fault-Tolerant Error Correction Thresholds',
    summary: 'Majorana zero-mode physical qubits show suppressed environmental decoherence in cryogenic benchmarking tests.',
    source: 'Ars Technica',
    time: '1d ago',
    tag: 'RESEARCH',
    tagColor: 'text-rose-400 border-rose-500/30 bg-rose-950/40',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    articleUrl: 'https://arstechnica.com/science/',
  },
];

const NEWS_CATEGORIES = [
  { key: 'all', label: 'All News' },
  { key: 'ai', label: 'AI & Systems' },
  { key: 'systems', label: 'Kernel' },
  { key: 'hardware', label: 'Hardware' },
  { key: 'cloud', label: 'Distributed' },
  { key: 'dbms', label: 'DBMS' },
] as const;

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  progress: passedProgress,
  savedPrograms: passedPrograms,
  onNavigate,
  onOpenCloudinary,
}) => {
  const progress = passedProgress || StorageService.getProgress();
  const savedPrograms = passedPrograms || StorageService.getPrograms();

  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const overallScore = Math.round(
    (Object.values(progress.topicMastery) as number[]).reduce((a: number, b: number) => a + b, 0) /
      Math.max(1, Object.keys(progress.topicMastery).length)
  );

  const copyCommand = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filteredNews = useMemo(() => {
    if (activeCategory === 'all') return TECH_NEWS;
    return TECH_NEWS.filter((item) => item.categoryKey === activeCategory);
  }, [activeCategory]);

  return (
    <div
      id="home-command-center"
      className="h-full w-full p-4 lg:p-6 station-bg overflow-y-auto flex flex-col gap-6 text-zinc-100 select-none font-sans"
    >
      {/* 1. TOP WORKSTATION BAR */}
      <header className="rounded-2xl border border-purple-900/40 bg-gradient-to-r from-[#190d2e] via-[#140a26] to-[#0c0717] p-4 sm:p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Status */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <TitanLogo size={42} />
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-white">
              TITAN_OS
            </h1>
            <span className="px-2 py-0.5 rounded bg-pink-950/70 border border-pink-500/40 text-[10px] text-pink-300 font-bold tracking-wider">
              v2.5
            </span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE
            </span>
          </div>
        </div>

        {/* Workstation Actions: Cloudinary In-App Dock, Git Clone & Profile */}
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-start md:justify-end">
          {/* Cloudinary Integration inside Titan OS Bar */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                if (onOpenCloudinary) onOpenCloudinary();
              }}
              className="px-2.5 py-1 rounded-l-lg bg-white/[0.05] border border-white/[0.1] hover:border-pink-500/50 flex items-center gap-1.5 text-purple-200 hover:text-pink-300 transition-all group cursor-pointer"
              title="Open In-App Cloudinary Media & Visual Asset Dock"
            >
              <Cloud className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold">Cloudinary</span>
              <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-pink-950/80 border border-pink-700/60 text-pink-300 font-bold">
                {CloudinaryService.isConfigured() ? 'DOCK' : 'SETUP'}
              </span>
            </button>
            <a
              href={CloudinaryService.getConsoleUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-r-lg bg-white/[0.03] border-y border-r border-white/[0.1] hover:border-pink-500/50 text-purple-300/70 hover:text-pink-300 transition-colors cursor-pointer"
              title="Open Cloudinary Console in new tab"
            >
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="h-4 w-px bg-purple-900/40 hidden sm:block" />

          {/* Quick Git Clone */}
          <button
            type="button"
            onClick={() => copyCommand('git clone https://github.com/KaranPareekk/Titan_Sample.git', 'clone')}
            className="px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-purple-900/40 text-[10px] text-purple-200 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Copy git clone command"
          >
            <Terminal className="w-3 h-3 text-emerald-400" />
            <span>{copiedCmd === 'clone' ? 'Copied!' : 'git clone'}</span>
            {copiedCmd === 'clone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-purple-400/60" />}
          </button>

          {/* Compact Profile Chip */}
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg bg-white/[0.04] border border-purple-900/50 hover:border-pink-500/50 cursor-pointer transition-all"
            title="Edit Profile Settings"
          >
            <CloudinaryImage
              src={profile.avatarUrl}
              alt={profile.name}
              transform={{ width: 48, height: 48, crop: 'thumb', gravity: 'face' }}
              className="w-6 h-6 rounded-full border border-pink-400/60"
            />
            <span className="text-xs font-medium text-purple-100 truncate max-w-[90px]">{profile.name}</span>
          </div>
        </div>
      </header>

      {/* 2. UNIFIED DEVELOPER HUB (Centralized place for all developer-platform links) */}
      <section className="glass-panel rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border border-purple-900/30 bg-[#120a22]/60">
        <div className="flex items-center gap-2 text-purple-200">
          <Globe className="w-3.5 h-3.5 text-pink-400" />
          <span className="font-bold tracking-wide">Developer Hub:</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* GitHub */}
          <a
            href={profile.githubUrl || 'https://github.com/KaranPareekk'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-purple-900/40 hover:border-purple-400 flex items-center gap-1.5 text-purple-200 hover:text-white transition-all"
          >
            <GithubIcon className="w-3 h-3 text-purple-300" />
            <span className="text-[11px] font-medium">GitHub</span>
          </a>

          {/* Vercel */}
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-purple-900/40 hover:border-white flex items-center gap-1.5 text-purple-200 hover:text-white transition-all"
          >
            <VercelIcon className="w-3 h-3 text-white" />
            <span className="text-[11px] font-medium">Vercel</span>
          </a>

          {/* Render */}
          <a
            href="https://render.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-purple-900/40 hover:border-amber-400 flex items-center gap-1.5 text-purple-200 hover:text-amber-300 transition-all"
          >
            <RenderIcon className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-medium">Render</span>
          </a>

          {/* GitKraken */}
          <a
            href="https://www.gitkraken.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-purple-900/40 hover:border-teal-400 flex items-center gap-1.5 text-purple-200 hover:text-teal-300 transition-all"
          >
            <GitKrakenIcon className="w-3 h-3 text-teal-400" />
            <span className="text-[11px] font-medium">GitKraken</span>
          </a>

          {/* Netlify */}
          <a
            href="https://app.netlify.com/drop"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-purple-900/40 hover:border-emerald-400 flex items-center gap-1.5 text-purple-200 hover:text-emerald-300 transition-all"
          >
            <Rocket className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px] font-medium">Netlify</span>
          </a>

          {/* LinkedIn */}
          <a
            href={profile.linkedinUrl || 'https://linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-purple-900/40 hover:border-blue-400 flex items-center gap-1.5 text-purple-200 hover:text-blue-300 transition-all"
          >
            <LinkedinIcon className="w-3 h-3 text-blue-400" />
            <span className="text-[11px] font-medium">LinkedIn</span>
          </a>

          {/* LeetCode */}
          <a
            href={profile.leetcodeUrl || 'https://leetcode.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-purple-900/40 hover:border-amber-500/50 flex items-center gap-1.5 text-purple-200 hover:text-amber-300 transition-all"
          >
            <Code2 className="w-3 h-3 text-amber-400" />
            <span className="text-[11px] font-medium">LeetCode</span>
          </a>

          <button
            type="button"
            onClick={() => setIsProfileModalOpen(true)}
            className="text-[10px] text-pink-400 hover:underline cursor-pointer ml-1 font-semibold"
          >
            Configure
          </button>
        </div>
      </section>

      {/* 3. STREAMLINED METRICS & ARENA ACTION STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Practice Arena CTA (Distinct Purple/Violet Theme, language names removed) */}
        <div
          onClick={() => onNavigate('assessment')}
          className="col-span-2 sm:col-span-1 rounded-xl p-3.5 bg-gradient-to-br from-purple-950/70 via-purple-900/30 to-[#160829] border border-purple-500/40 hover:border-pink-500/60 cursor-pointer transition-all flex flex-col justify-between group shadow-[0_4px_20px_rgba(168,85,247,0.15)]"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider text-pink-400 font-bold flex items-center gap-1">
              <Play className="w-3 h-3 fill-pink-400" />
              Practice Arena
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 font-bold">
              6 LANGUAGES
            </span>
          </div>
          <div className="my-2">
            <h3 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors">
              Coding Challenges & Judge
            </h3>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-purple-900/50 text-xs font-bold text-pink-400">
            <span>Solve & Run Tests</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Engineering Mastery */}
        <div className="rounded-xl p-3.5 glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
              Overall Mastery
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-tech text-2xl font-bold text-white">{overallScore}%</span>
            <span className="text-[10px] font-mono text-emerald-400">Verified Skills</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>

        {/* Practice Time */}
        <div className="rounded-xl p-3.5 glass-panel flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
              Total Practice
            </span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-tech text-2xl font-bold text-white">{progress.totalTimeMinutes}m</span>
            <span className="text-[10px] font-mono text-zinc-400">Time Logged</span>
          </div>
          <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (progress.totalTimeMinutes / 120) * 100)}%` }}
            />
          </div>
        </div>

        {/* Certificate Credential */}
        <div
          onClick={() => onNavigate('assessment')}
          className="rounded-xl p-3.5 glass-panel hover:border-amber-500/40 cursor-pointer transition-all flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Credentials
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              CERTIFICATE
            </span>
          </div>
          <div className="my-2">
            <span className="font-tech text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Titanium Seal
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs font-bold text-amber-400">
            <span>View Credential</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* 3. GOOGLE NEWS-STYLE 3-COLUMN TECH NEWS GRID */}
      <section className="flex flex-col gap-4">
        {/* Section Header & Category Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-cyan-400" />
            <h2 className="font-tech text-base sm:text-lg font-bold text-white tracking-tight">
              Tech Dispatch & Industry News
            </h2>
            <span className="text-[9px] font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 font-bold">
              LIVE FEED
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {NEWS_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column News Card Grid (Google News Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNews.map((news) => (
            <a
              key={news.id}
              href={news.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl overflow-hidden glass-card flex flex-col justify-between group hover:border-cyan-500/40 cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(6,182,212,0.15)] transition-all"
            >
              <div>
                {/* Thumbnail Image (Aspect 16:9, clean and proportionate) */}
                <div className="relative w-full h-40 overflow-hidden bg-zinc-900">
                  <img
                    src={news.imageUrl}
                    alt={news.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1424] via-transparent to-transparent opacity-80" />
                  
                  {/* Category Pill Overlaid */}
                  <span className="absolute top-3 left-3 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-cyan-300 uppercase tracking-wider">
                    {news.category}
                  </span>

                  <span className={`absolute top-3 right-3 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border backdrop-blur-md ${news.tagColor}`}>
                    {news.tag}
                  </span>
                </div>

                {/* Article Content */}
                <div className="p-4 flex flex-col gap-2">
                  {/* Publisher & Timestamp */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="font-semibold text-zinc-300">{news.source}</span>
                    <span>{news.time}</span>
                  </div>

                  {/* Headline */}
                  <h3 className="font-semibold text-sm sm:text-base text-zinc-100 group-hover:text-cyan-300 transition-colors leading-snug line-clamp-2">
                    {news.title}
                  </h3>

                  {/* Summary Snippet */}
                  <p className="text-xs text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    {news.summary}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-cyan-400 group-hover:underline flex items-center gap-1">
                  Read full article
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 4. WORKSTATION STATUS FOOTER */}
      <footer className="glass-panel rounded-xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>TITAN_OS Workstation • All Systems Nominal</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Lat: 1.2ms</span>
          <span>RAM: 34.2MB</span>
          <span className="text-cyan-400">Cloudinary Media Engine Active</span>
        </div>
      </footer>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(up) => setProfile(up)}
      />
    </div>
  );
};
