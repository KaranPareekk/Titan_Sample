import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  MessageSquare,
  Share2,
  Cpu,
  Code2,
  Database,
  Cloud,
  ExternalLink,
  Send,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ModuleId } from '../../types';

export interface SocialNotification {
  id: string;
  sender: {
    name: string;
    role: string;
    avatar: string;
    isOnline: boolean;
    platform: 'whatsapp' | 'slack' | 'system' | 'github';
  };
  type: 'dm' | 'circuit_share' | 'code_review' | 'system';
  message: string;
  timestamp: string;
  isUnread: boolean;
  targetModule?: ModuleId;
  actionLabel?: string;
  codeSnippet?: string;
}

const INITIAL_NOTIFICATIONS: SocialNotification[] = [
  {
    id: 'notif_1',
    sender: {
      name: 'Sarah Chen',
      role: 'Lead Silicon Architect',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      isOnline: true,
      platform: 'whatsapp',
    },
    type: 'circuit_share',
    message: 'Hey! Pushed the 2:1 Multiplexer and Full Adder blueprints to the Digital Logic Lab. Take a look at the gate propagation!',
    timestamp: '2m ago',
    isUnread: true,
    targetModule: 'circuits',
    actionLabel: 'Open Digital Logic Lab',
  },
  {
    id: 'notif_2',
    sender: {
      name: 'Alex Rivera',
      role: 'Kernel & Systems Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      isOnline: true,
      platform: 'slack',
    },
    type: 'code_review',
    message: 'Left review on your Binary Search: converted comparison loops into 10x faster branchless cycles in DSA Lab.',
    timestamp: '15m ago',
    isUnread: true,
    targetModule: 'dsa',
    actionLabel: 'View in DSA Lab',
    codeSnippet: 'int mid = low + ((high - low) >> 1);',
  },
  {
    id: 'notif_3',
    sender: {
      name: 'Cloudinary Media Bot',
      role: 'Asset Transformation CDN',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80',
      isOnline: false,
      platform: 'system',
    },
    type: 'system',
    message: 'Auto-saved 3 architectural snapshots to Cloudinary Engineering Vault. WebP transformations ready.',
    timestamp: '42m ago',
    isUnread: true,
    targetModule: 'home',
    actionLabel: 'Open Cloudinary Dock',
  },
  {
    id: 'notif_4',
    sender: {
      name: 'Elena Rostova',
      role: 'Distributed DB Lead',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      isOnline: false,
      platform: 'whatsapp',
    },
    type: 'dm',
    message: 'Great query optimization in SQL Workbench! Latency dropped under 1ms on 12M rows.',
    timestamp: '2h ago',
    isUnread: false,
    targetModule: 'dbms',
    actionLabel: 'Inspect SQL Workbench',
  },
];

const ACTIVE_COWORKERS = [
  { name: 'Sarah C.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', status: 'In Circuits' },
  { name: 'Alex R.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', status: 'In DSA Lab' },
  { name: 'Marcus V.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80', status: 'In CodeLab' },
  { name: 'Elena R.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', status: 'Reviewing SQL' },
  { name: 'TITAN AI', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80', status: 'Copilot Active' },
];

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (module: ModuleId) => void;
  onToggleCloudinary?: () => void;
  soundEnabled?: boolean;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onToggleCloudinary,
  soundEnabled = true,
}) => {
  const [notifications, setNotifications] = useState<SocialNotification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread' | 'shares'>('all');
  const [replyText, setReplyText] = useState<{ [id: string]: string }>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleNotificationClick = (notif: SocialNotification) => {
    // Mark this one read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isUnread: false } : n))
    );

    if (notif.actionLabel?.includes('Cloudinary') && onToggleCloudinary) {
      onToggleCloudinary();
      onClose();
      return;
    }

    if (notif.targetModule && onNavigate) {
      onNavigate(notif.targetModule);
      onClose();
    }
  };

  const handleSendReply = (notifId: string) => {
    const text = (replyText[notifId] || '').trim();
    if (!text) return;

    setReplyText((prev) => ({ ...prev, [notifId]: '' }));
    setActiveReplyId(null);
    alert(`Reply sent to ${notifId}: "${text}"`);
  };

  const handleSimulatePing = () => {
    const newNotif: SocialNotification = {
      id: `notif_${Date.now()}`,
      sender: {
        name: 'Marcus Vance',
        role: 'Senior Polyglot Dev',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        isOnline: true,
        platform: 'whatsapp',
      },
      type: 'dm',
      message: 'Just sent you a quick test snippet for the Raft quorum logic in CodeLab!',
      timestamp: 'Just now',
      isUnread: true,
      targetModule: 'codelab',
      actionLabel: 'Open CodeLab',
    };

    setNotifications((prev) => [newNotif, ...prev]);

    if (soundEnabled && typeof AudioContext !== 'undefined') {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        osc.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.08); // E6
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } catch (e) {
        // AudioContext ignored
      }
    }
  };

  const filteredNotifs = notifications.filter((n) => {
    if (filter === 'unread') return n.isUnread;
    if (filter === 'shares') return n.type === 'circuit_share' || n.type === 'code_review';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div
        className="w-full max-w-md h-full bg-[#0a0f1d] border-l border-white/[0.1] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header (Instagram / WhatsApp Direct Style) */}
        <div className="p-4 bg-[#0d1424] border-b border-white/[0.08] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-tech text-sm font-bold text-white flex items-center gap-2">
                  <span>Collaborative Inbox</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-black font-mono text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400">
                  Coworker Messages & Shared Blueprints
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleSimulatePing}
                title="Simulate incoming coworker message"
                className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-cyan-400 border border-white/[0.08] text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>+ Ping</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.08] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Collaborators Story Row */}
          <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
            {ACTIVE_COWORKERS.map((coworker, i) => (
              <div key={i} className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer">
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-cyan-500 via-purple-500 to-emerald-400">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-900 border-2 border-[#0a0f1d]">
                    <img src={coworker.avatar} alt={coworker.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0a0f1d]" />
                </div>
                <span className="text-[9px] font-mono text-zinc-300 truncate max-w-[50px]">
                  {coworker.name}
                </span>
              </div>
            ))}
          </div>

          {/* Filter Tabs & Mark Read */}
          <div className="flex items-center justify-between pt-1 border-t border-white/[0.05] text-[11px] font-mono">
            <div className="flex items-center gap-1">
              {(['all', 'unread', 'shares'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilter(tab)}
                  className={`px-2 py-0.5 rounded-md capitalize transition-colors cursor-pointer ${
                    filter === tab
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3 h-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>
        </div>

        {/* 2. Notification List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs font-mono">No notifications in this filter</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border transition-all ${
                  notif.isUnread
                    ? 'bg-gradient-to-r from-cyan-950/40 to-[#0d1424] border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={notif.sender.avatar}
                      alt={notif.sender.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                    {notif.sender.isOnline && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#0a0f1d]" />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-tech text-xs font-bold text-white truncate">
                        {notif.sender.name}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-cyan-400/80 block mb-1">
                      {notif.sender.role}
                    </span>

                    <p className="text-xs text-zinc-300 leading-relaxed font-sans mb-2">
                      {notif.message}
                    </p>

                    {/* Code Snippet Highlight (if any) */}
                    {notif.codeSnippet && (
                      <div className="px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 font-mono text-[11px] text-emerald-300 mb-2 truncate">
                        {notif.codeSnippet}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {notif.actionLabel && (
                        <button
                          type="button"
                          onClick={() => handleNotificationClick(notif)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <span>{notif.actionLabel}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setActiveReplyId(activeReplyId === notif.id ? null : notif.id)
                        }
                        className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-white text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-2.5 h-2.5" />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Inline Quick Reply Box (WhatsApp / Instagram Direct Style) */}
                    {activeReplyId === notif.id && (
                      <div className="mt-2 flex items-center gap-1.5 pt-2 border-t border-white/[0.06]">
                        <input
                          type="text"
                          value={replyText[notif.id] || ''}
                          onChange={(e) =>
                            setReplyText({ ...replyText, [notif.id]: e.target.value })
                          }
                          placeholder={`Reply to ${notif.sender.name.split(' ')[0]}...`}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendReply(notif.id);
                          }}
                          className="flex-1 bg-black/60 border border-white/10 focus:border-cyan-400 rounded-lg px-2.5 py-1 text-xs text-white placeholder-zinc-500 focus:outline-none font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => handleSendReply(notif.id)}
                          className="p-1.5 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 3. Drawer Footer */}
        <div className="p-3 bg-[#0d1424] border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Team Workspace Online</span>
          </div>
          <span className="text-[10px] text-zinc-500">TITAN OS Social P2P</span>
        </div>
      </div>
    </div>
  );
};
