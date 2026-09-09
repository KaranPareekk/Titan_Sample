import React, { useState, useMemo } from 'react';
import {
  Code2,
  Bot,
  Sparkles,
  ExternalLink,
  Trophy,
  FileCode2,
  CheckSquare,
  Newspaper,
  Quote,
  TrendingUp,
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

// --- Static Data ---

const TECH_NEWS = [
  {
    id: 1,
    title: 'Google DeepMind releases Gemini 2.5 with native code execution',
    source: 'TechCrunch',
    time: '2h ago',
    url: 'https://techcrunch.com',
    tag: 'AI',
    tagColor: 'text-purple-400 bg-purple-950/60 border-purple-800',
  },
  {
    id: 2,
    title: 'TypeScript 5.6 ships with new narrowing improvements',
    source: 'The Verge',
    time: '4h ago',
    url: 'https://devblogs.microsoft.com/typescript/',
    tag: 'Web',
    tagColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800',
  },
  {
    id: 3,
    title: 'Linux kernel 6.11 merges new memory folios optimizations',
    source: 'Phoronix',
    time: '6h ago',
    url: 'https://phoronix.com',
    tag: 'Systems',
    tagColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800',
  },
  {
    id: 4,
    title: 'LeetCode adds AI-powered hint system for premium users',
    source: 'LeetCode Blog',
    time: '8h ago',
    url: 'https://leetcode.com',
    tag: 'DSA',
    tagColor: 'text-amber-400 bg-amber-950/60 border-amber-800',
  },
  {
    id: 5,
    title: 'Rust 1.81 lands with new error handling ergonomics',
    source: 'This Week in Rust',
    time: '12h ago',
    url: 'https://this-week-in-rust.org',
    tag: 'Languages',
    tagColor: 'text-rose-400 bg-rose-950/60 border-rose-800',
  },
];

const QUOTES = [
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Code is like humor. When you have to explain it, it is bad.', author: 'Cory House' },
  { text: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.', author: 'Martin Fowler' },
  { text: 'Programs must be written for people to read, and only incidentally for machines to execute.', author: 'Harold Abelson' },
  { text: 'The best error message is the one that never shows up.', author: 'Thomas Fuchs' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
];

const DEV_LINKS = [
  { name: 'LinkedIn', url: 'https://linkedin.com', hoverColor: 'hover:border-blue-500/60', iconBg: 'bg-blue-950/60', iconText: 'in', iconColor: 'text-blue-400', labelHover: 'group-hover:text-blue-400' },
  { name: 'LeetCode', url: 'https://leetcode.com', hoverColor: 'hover:border-amber-500/60', iconBg: 'bg-amber-950/60', iconText: 'LC', iconColor: 'text-amber-400', labelHover: 'group-hover:text-amber-400' },
  { name: 'CodeChef', url: 'https://codechef.com', hoverColor: 'hover:border-orange-500/60', iconBg: 'bg-orange-950/60', iconText: 'CC', iconColor: 'text-orange-400', labelHover: 'group-hover:text-orange-400' },
  { name: 'GitHub', url: 'https://github.com', hoverColor: 'hover:border-slate-400/60', iconBg: 'bg-slate-700/60', iconText: 'GH', iconColor: 'text-slate-300', labelHover: 'group-hover:text-slate-200' },
  { name: 'Codeforces', url: 'https://codeforces.com', hoverColor: 'hover:border-red-500/60', iconBg: 'bg-red-950/60', iconText: 'CF', iconColor: 'text-red-400', labelHover: 'group-hover:text-red-400' },
  { name: 'GeeksforGeeks', url: 'https://geeksforgeeks.org', hoverColor: 'hover:border-green-500/60', iconBg: 'bg-green-950/60', iconText: 'GG', iconColor: 'text-green-400', labelHover: 'group-hover:text-green-400' },
  { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', hoverColor: 'hover:border-cyan-500/60', iconBg: 'bg-cyan-950/60', iconText: 'MDN', iconColor: 'text-cyan-400', labelHover: 'group-hover:text-cyan-400' },
  { name: 'Stack Overflow', url: 'https://stackoverflow.com', hoverColor: 'hover:border-yellow-500/60', iconBg: 'bg-yellow-950/60', iconText: 'SO', iconColor: 'text-yellow-400', labelHover: 'group-hover:text-yellow-400' },
];

// --- Component ---

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

  const progress = useMemo(() => StorageService.getProgress(), []);
  const programs = useMemo(() => StorageService.getPrograms(), []);

  const quote = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    return QUOTES[dayOfYear % QUOTES.length];
  }, []);

  const stats = [
    { label: 'Problems Solved', value: progress.assessmentsPassed, icon: <CheckSquare className="w-4 h-4" />, color: 'text-emerald-400' },
    { label: 'Labs Completed', value: progress.completedLabs.length, icon: <Trophy className="w-4 h-4" />, color: 'text-amber-400' },
    { label: 'Programs Written', value: programs.length, icon: <FileCode2 className="w-4 h-4" />, color: 'text-cyan-400' },
    { label: 'Time (min)', value: progress.totalTimeMinutes, icon: <TrendingUp className="w-4 h-4" />, color: 'text-purple-400' },
  ];

  return (
    <div className="h-full w-full p-4 sm:p-6 station-bg overflow-y-auto flex flex-col gap-5 max-w-6xl mx-auto text-slate-200 font-sans">

      {/* HEADER */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TitanLogo size={36} />
          <div>
            <h1 className="font-tech text-xl font-bold tracking-wider text-white">TITAN_OS</h1>
            <p className="text-[11px] text-slate-500 font-mono">Your coding companion</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsProfileModalOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-400/60 shrink-0">
            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-mono text-white hidden sm:block">{profile.name}</span>
        </button>
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">

        {/* LEFT: Tech News */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">Tech News</span>
          </div>
          <div className="flex flex-col gap-2">
            {TECH_NEWS.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900 transition-all group"
              >
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <p className="text-sm text-slate-200 group-hover:text-white transition-colors leading-snug">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">{item.source}</span>
                    <span className="text-[11px] text-slate-600 font-mono">{item.time}</span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 shrink-0 mt-1 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">

          {/* Quote of the Day */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">Quote of the Day</span>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-950/30 to-slate-900/60 border border-purple-900/40">
              <p className="text-sm text-slate-300 italic leading-relaxed">"{quote.text}"</p>
              <p className="text-[11px] text-purple-400 font-mono mt-2">— {quote.author}</p>
            </div>
          </div>

          {/* Quick Access */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">Quick Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 transition-all ${link.hoverColor} group`}
                >
                  <div className={`w-7 h-7 rounded-md ${link.iconBg} flex items-center justify-center shrink-0`}>
                    <span className={`text-[10px] font-bold font-mono ${link.iconColor}`}>{link.iconText}</span>
                  </div>
                  <span className={`text-xs font-mono text-slate-400 transition-colors truncate ${link.labelHover}`}>
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold">Your Progress</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className={`${stat.color} flex items-center gap-1.5`}>
                    {stat.icon}
                    <span className="text-[10px] font-mono text-slate-500 leading-tight">{stat.label}</span>
                  </div>
                  <span className={`text-2xl font-tech font-bold ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-mono text-slate-500 mr-1">Jump to:</span>
        {[
          { id: 'codelab' as ModuleId, label: 'Code Editor', icon: <Code2 className="w-3.5 h-3.5" />, cls: 'hover:border-cyan-500/50 hover:text-cyan-300' },
          { id: 'ai' as ModuleId, label: 'AI Tutor', icon: <Bot className="w-3.5 h-3.5" />, cls: 'hover:border-purple-500/50 hover:text-purple-300' },
          { id: 'assessment' as ModuleId, label: 'Practice', icon: <Sparkles className="w-3.5 h-3.5" />, cls: 'hover:border-amber-500/50 hover:text-amber-300' },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 transition-colors cursor-pointer ${item.cls}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      {/* USER PROFILE MODAL */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(newProf) => {
          setProfile(newProf);
        }}
      />
    </div>
  );
};
