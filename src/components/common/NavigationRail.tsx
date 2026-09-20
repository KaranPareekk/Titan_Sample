import React from 'react';
import {
  LayoutDashboard,
  GitGraph,
  Layers,
  Cpu,
  Code2,
  Database,
  GraduationCap,
  FolderGit2,
  Bot,
} from 'lucide-react';
import { ModuleId } from '../../types';

interface NavigationRailProps {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  isCollapsed?: boolean;
}

interface NavItem {
  id: ModuleId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard, tag: 'HOME' },
  { id: 'dsa', label: 'Algorithms & DSA', icon: GitGraph, tag: 'DSA' },
  { id: 'memory', label: 'Memory Visualizer', icon: Layers, tag: 'MEM' },
  { id: 'circuits', label: 'Digital Logic', icon: Cpu, tag: 'CIRCUIT' },
  { id: 'codelab', label: 'Polyglot IDE', icon: Code2, tag: 'IDE' },
  { id: 'dbms', label: 'SQL Workbench', icon: Database, tag: 'SQL' },
  { id: 'ai', label: 'AI Copilot', icon: Bot, tag: 'AI' },
  { id: 'assessment', label: 'Skills Assessment', icon: GraduationCap, tag: 'EVAL' },
  { id: 'workspace', label: 'My Workspace', icon: FolderGit2, tag: 'REPO' },
];

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeModule,
  onSelectModule,
}) => {
  return (
    <aside
      id="titan-nav-rail"
      aria-label="Titan OS Workstation Navigation"
      className="w-16 bg-[#100820] border-r border-purple-900/40 flex flex-col items-center py-3 shrink-0 z-20 select-none justify-between overflow-y-auto overflow-x-hidden"
    >
      <div className="w-full flex flex-col items-center gap-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeModule === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectModule(item.id)}
              title={`${item.label} (${item.tag})`}
              className={`group relative w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-pink-500/20 text-pink-200 border border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.3)]'
                  : 'text-purple-300/60 hover:text-white hover:bg-purple-900/30 border border-transparent'
              }`}
            >
              {isActive && (
                <div className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-pink-500 rounded-r shadow-[0_0_8px_#ec4899]" />
              )}
              <Icon
                className={`w-4 h-4 transition-transform duration-150 ${
                  isActive ? 'scale-110 text-pink-400' : 'group-hover:scale-110 group-hover:text-pink-300'
                }`}
              />
              <span
                className={`text-[8.5px] tracking-wider mt-1 leading-none font-bold ${
                  isActive ? 'text-pink-200' : 'text-purple-300/60 group-hover:text-purple-200'
                }`}
              >
                {item.tag}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full px-2 pt-2 border-t border-purple-900/40 flex flex-col items-center">
        <div className="text-[9px] text-purple-400/60 text-center leading-tight">
          OS
          <span className="block text-pink-400 font-bold">v2.5</span>
        </div>
      </div>
    </aside>
  );
};
