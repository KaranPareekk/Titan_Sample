import React, { useState, useEffect } from 'react';
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Zap,
  Cloud,
  Bell,
} from 'lucide-react';
import { ModuleId, SystemSettings, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { TitanLogo } from './TitanLogo';
import { UserProfileModal } from '../home/UserProfileModal';
import { NotificationDrawer } from './NotificationDrawer';

interface HeaderBarProps {
  currentModule: ModuleId;
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  systemUptimeSec?: number;
  isCloudinaryOpen?: boolean;
  onToggleCloudinary?: () => void;
  onNavigate?: (module: ModuleId) => void;
}

const MODULE_TITLES: Record<ModuleId, { title: string; subtitle: string }> = {
  home: { title: 'DASHBOARD', subtitle: 'Workstation Home' },
  dsa: { title: 'ALGORITHMS', subtitle: 'DSA Visual Execution' },
  memory: { title: 'MEMORY', subtitle: 'Hardware Addressing' },
  circuits: { title: 'DIGITAL LOGIC', subtitle: 'Gate Simulation' },
  codelab: { title: 'POLYGLOT IDE', subtitle: 'Virtual Workspace' },
  dbms: { title: 'SQL WORKBENCH', subtitle: 'Relational Engine' },
  ai: { title: 'AI COPILOT', subtitle: 'Intelligent Assistant' },
  study: { title: 'AI COPILOT', subtitle: 'Technical Tutor' },
  assessment: { title: 'EVALUATION', subtitle: 'Coding Arena & Judge' },
  workspace: { title: 'MY WORKSPACE', subtitle: 'Saved Programs' },
};

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentModule,
  settings,
  onUpdateSettings,
  systemUptimeSec = 0,
  isCloudinaryOpen = false,
  onToggleCloudinary,
  onNavigate,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);

  const formatUptime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const moduleInfo = MODULE_TITLES[currentModule] || { title: 'TITAN_OS', subtitle: 'Online' };

  return (
    <>
      <header
        id="titan-header-bar"
        className="h-14 bg-[#120a22] border-b border-purple-900/40 flex items-center justify-between px-3 sm:px-5 z-30 shrink-0 select-none"
      >
        {/* Brand & Module Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          <TitanLogo size={32} />
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold tracking-wider text-pink-400 uppercase">
              TITAN_OS
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-purple-200 bg-purple-950/60 border border-purple-800/60 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              {moduleInfo.title}
            </span>
          </div>
        </div>

        {/* System Gauges, Quick Controls & User Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-white/[0.04] rounded-lg border border-white/[0.08]">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono text-zinc-300">
              UPTIME: {formatUptime(systemUptimeSec)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="btn-toggle-sound"
              onClick={() => onUpdateSettings({ soundFx: !settings.soundFx })}
              title={settings.soundFx ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
              className="p-2 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              {settings.soundFx ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              id="btn-toggle-theme"
              onClick={() => onUpdateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              title={`Toggle Theme (Current: ${settings.theme})`}
              className="p-2 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              id="btn-toggle-focus-mode"
              onClick={() => onUpdateSettings({ focusMode: !settings.focusMode })}
              title={settings.focusMode ? 'Exit Focus Mode - Press Esc' : 'Enter Focus Mode'}
              className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                settings.focusMode
                  ? 'bg-cyan-500 text-black border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-white/[0.05] text-zinc-300 border border-white/[0.1] hover:border-cyan-500/50 hover:text-cyan-300'
              }`}
            >
              {settings.focusMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span className="hidden xs:inline sm:inline text-[10px] font-tech">FOCUS</span>
            </button>

            {/* In-App Cloudinary Dock Toggle Button */}
            {onToggleCloudinary && (
              <button
                id="btn-toggle-cloudinary-dock"
                type="button"
                onClick={onToggleCloudinary}
                title="Toggle In-App Cloudinary Media & Transformation Dock"
                className={`px-2.5 py-1 text-[11px] rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCloudinaryOpen
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-white/[0.05] text-zinc-300 border border-white/[0.1] hover:border-cyan-500/50 hover:text-cyan-300'
                }`}
              >
                <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline text-[10px] font-mono">CLOUDINARY</span>
              </button>
            )}

            {/* Collaborative Notification Bell Button */}
            <button
              id="btn-toggle-notifications"
              type="button"
              onClick={() => setIsNotifDrawerOpen(!isNotifDrawerOpen)}
              title="Open Collaborative Inbox & Coworker Pings"
              className="relative p-2 rounded-lg text-zinc-400 hover:text-cyan-300 hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
            </button>

            {/* Circular Profile Avatar Badge Button */}
            <button
              id="btn-user-profile"
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              title={`Engineer Profile: ${profile.name}`}
              className="ml-1 sm:ml-2 flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-white/[0.08] border border-white/[0.12] hover:border-cyan-400/80 transition-all cursor-pointer group"
            >
              <div className="relative">
                <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-400 group-hover:shadow-[0_0_10px_#06b6d4]">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border-2 border-[#090d16]" />
              </div>

              <span className="text-xs font-sans text-zinc-200 font-semibold hidden md:inline group-hover:text-cyan-300">
                {profile.name.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(up) => setProfile(up)}
      />

      {/* Collaborative Team & Social Notification Center */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        onNavigate={onNavigate}
        onToggleCloudinary={onToggleCloudinary}
        soundEnabled={settings.soundFx}
      />
    </>
  );
};
