import React from 'react';
import {
  Terminal,
  Cpu,
  Activity,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ModuleId, SystemSettings } from '../../types';

interface HeaderBarProps {
  currentModule: ModuleId;
  settings: SystemSettings;
  onUpdateSettings: (s: Partial<SystemSettings>) => void;
  systemUptimeSec: number;
}

const MODULE_TITLES: Record<ModuleId, { title: string; subtitle: string }> = {
  home: { title: 'COMMAND CENTER', subtitle: 'Workstation Telemetry & Active Units' },
  dsa: { title: 'ALGORITHM & DS LAB', subtitle: 'Step-by-Step Interactive Visualizer' },
  memory: { title: 'MEMORY & HARDWARE LAB', subtitle: 'Typed Arrays, Pointer Geometry & Stacks' },
  circuits: { title: 'DIGITAL LOGIC WORKBENCH', subtitle: 'Schematic Gate Playground & Signals' },
  codelab: { title: 'TITAN CODE LAB', subtitle: 'JS / Python / Java Educational IDE & STDIN' },
  dbms: { title: 'SQL QUERY WORKBENCH', subtitle: 'In-Memory Relational Engine & Multi-SQL' },
  study: { title: 'STUDY LAB', subtitle: 'Interactive Model Flashcards & Mechanics' },
  knowledge: { title: 'ENGINEERING REPOSITORY', subtitle: 'CS Foundations & Live Handbooks' },
  assessment: { title: 'ASSESSMENT TERMINAL', subtitle: 'Domain Testing, Review & Weak Topic Radar' },
  games: { title: 'ENGINEERING RETRO LAB', subtitle: 'Terminal Snake & Logic Tic-Tac-Toe' },
  workspace: { title: 'MY WORKSPACE', subtitle: 'Saved Programs, Notebooks & System Diagnostics' },
};

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentModule,
  settings,
  onUpdateSettings,
  systemUptimeSec,
}) => {
  const formatUptime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const moduleInfo = MODULE_TITLES[currentModule] || { title: 'TITAN_OS', subtitle: 'Online' };

  return (
    <header
      id="titan-header-bar"
      className="h-14 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between px-4 z-30 shrink-0 select-none"
    >
      {/* Brand & Module Status */}
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center text-[#07090E] font-bold text-xl shadow-[0_0_15px_rgba(6,182,212,0.3)]">
          T
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-widest text-cyan-500 uppercase font-mono">
              Titan_OS v1.0.4
            </span>
            <span className="hidden sm:inline-block text-[10px] terminal-font text-slate-400 border-l border-slate-700 pl-2">
              {moduleInfo.title}
            </span>
          </div>
          <span className="text-[10px] terminal-font opacity-60 text-slate-400 hidden sm:block">
            SYS_STATUS: OPTIMAL // CORE_SYNC: ACTIVE
          </span>
        </div>
      </div>

      {/* System Gauges & Quick Controls */}
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-black/30 rounded border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] terminal-font text-slate-300">
            UPTIME: {formatUptime(systemUptimeSec)}
          </span>
        </div>

        <div className="flex items-center gap-2 border-l border-slate-700/80 pl-4 sm:pl-6">
          <button
            id="btn-toggle-sound"
            onClick={() => onUpdateSettings({ soundFx: !settings.soundFx })}
            title={settings.soundFx ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
            className="p-1.5 rounded text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {settings.soundFx ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            id="btn-toggle-theme"
            onClick={() => onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            title={`Toggle Theme (Current: ${settings.theme})`}
            className="p-1.5 rounded text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            id="btn-toggle-focus-mode"
            onClick={() => onUpdateSettings({ focusMode: !settings.focusMode })}
            title={settings.focusMode ? 'Exit Focus Mode (Show Rail)' : 'Enter Focus Mode (Hide Rail)'}
            className={`ml-1 px-3 py-1 text-[10px] rounded font-bold uppercase transition-all flex items-center gap-1.5 ${
              settings.focusMode
                ? 'bg-cyan-500 text-black border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-600/20'
            }`}
          >
            {settings.focusMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            <span>FOCUS MODE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
