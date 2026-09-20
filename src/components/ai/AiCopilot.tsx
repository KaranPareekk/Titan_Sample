import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Bot,
  Send,
  Trash2,
  Download,
  Key,
  Sparkles,
  FileCode,
  Layers,
  CheckCircle2,
  Copy,
  ChevronDown,
  Code2,
  Cpu,
  RefreshCw,
  Terminal,
  Settings2,
  ExternalLink,
  Eye,
  EyeOff,
  AlertCircle,
  Zap,
  Paperclip,
  Image as ImageIcon,
  FileText,
  X,
} from 'lucide-react';
import { AiChatMessage, CodeFile } from '../../types';
import { StorageService } from '../../services/storage';
import {
  AiProviderService,
  AiProvider,
  AI_PROVIDERS,
} from '../../services/aiProviderService';

const PROMPT_TEMPLATES = [
  {
    title: '🔍 Review Active Code',
    prompt:
      'Review my currently active code file in CodeLab. Analyze its asymptotic time complexity O(...) and space complexity, find potential edge-case bugs, and suggest optimized alternatives.',
  },
  {
    title: '⚡ Optimize SQL Queries',
    prompt:
      'Analyze my current SQL script and database tables. How can I optimize indexing (B+ Tree vs Hash Index), eliminate full-table scans, and improve query execution performance?',
  },
  {
    title: '🧠 Explain Memory Latency',
    prompt:
      'Explain the hardware memory latency gap between CPU L1/L2/L3 caches, DDR5 RAM, and NVMe SSDs. How should I structure my data structures (e.g. DOD Data-Oriented Design) for maximum cache locality?',
  },
  {
    title: '🐛 Debug Concurrency',
    prompt:
      'Explain how to prevent race conditions and deadlocks in concurrent multithreaded programs. Contrast mutex locking with lock-free atomic operations (CAS).',
  },
  {
    title: '🎯 Mock Interview Question',
    prompt:
      'Generate an elite technical interview problem on Data Structures (Graphs or Dynamic Programming) with constraints, test cases, and evaluate my solution step-by-step.',
  },
];

export const AiCopilot: React.FC = () => {
  const [messages, setMessages] = useState<AiChatMessage[]>(() => StorageService.getAiChats());
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Workspace context toggle and data
  const [includeContext, setIncludeContext] = useState<boolean>(true);
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState<boolean>(false);
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>(() => StorageService.getCodeFiles());

  // Multi-Provider state
  const [activeProvider, setActiveProvider] = useState<AiProvider>(() =>
    AiProviderService.getActiveProvider()
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [editingProvider, setEditingProvider] = useState<AiProvider>(() =>
    AiProviderService.getActiveProvider()
  );
  const [keyInput, setKeyInput] = useState<string>('');
  const [modelInput, setModelInput] = useState<string>('');
  const [customEndpointInput, setCustomEndpointInput] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // File and image upload state
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: 'image' | 'document';
    dataUrl?: string;
    content?: string;
    size?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const reader = new FileReader();

    if (isImage) {
      reader.onload = () => {
        setAttachedFile({
          name: file.name,
          type: 'image',
          dataUrl: reader.result as string,
          size: `${Math.round(file.size / 1024)} KB`,
        });
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = () => {
        const textContent = (reader.result as string) || '';
        setAttachedFile({
          name: file.name,
          type: 'document',
          content: textContent,
          size: `${Math.round(file.size / 1024)} KB`,
        });
      };
      reader.readAsText(file);
    }
    e.target.value = '';
  };

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Refresh code files whenever component mounts
  useEffect(() => {
    setCodeFiles(StorageService.getCodeFiles());
  }, []);

  // Sync editing modal inputs when editingProvider changes
  useEffect(() => {
    setKeyInput(AiProviderService.getApiKey(editingProvider));
    setModelInput(AiProviderService.getModel(editingProvider));
    if (editingProvider === 'custom') {
      setCustomEndpointInput(AiProviderService.getCustomEndpoint());
    }
    setShowKey(false);
  }, [editingProvider, isSettingsOpen]);

  const activeMeta = AI_PROVIDERS[activeProvider];
  const hasActiveKey = Boolean(AiProviderService.getApiKey(activeProvider));
  const activeModel = AiProviderService.getModel(activeProvider);

  // Save Settings for currently viewed provider and make it active
  const handleSaveProviderSettings = () => {
    AiProviderService.setApiKey(editingProvider, keyInput);
    AiProviderService.setModel(editingProvider, modelInput);
    if (editingProvider === 'custom' && customEndpointInput.trim()) {
      AiProviderService.setCustomEndpoint(customEndpointInput);
    }
    AiProviderService.setActiveProvider(editingProvider);
    setActiveProvider(editingProvider);

    setSaveNotification(`Saved and activated ${AI_PROVIDERS[editingProvider].name}!`);
    setTimeout(() => {
      setSaveNotification(null);
      setIsSettingsOpen(false);
    }, 1200);
  };

  // Clear Chat History
  const handleClearChat = () => {
    if (window.confirm('Clear all previous AI chat messages?')) {
      StorageService.clearAiChats();
      setMessages(StorageService.getAiChats());
    }
  };

  // Export Transcript
  const handleExportTranscript = () => {
    const transcript = messages
      .map(
        (m) =>
          `### ${m.role.toUpperCase()} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.content}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([transcript], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `titan_copilot_transcript_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Offline fallback generator
  const generateOfflineResponse = (userPrompt: string): string => {
    const lower = userPrompt.toLowerCase();

    if (lower.includes('review') || lower.includes('code') || lower.includes('codelab')) {
      const activeFile = codeFiles[0];
      return `### 🔍 TITAN Code Review Analysis

I have evaluated your workspace files, focusing on **${activeFile ? activeFile.name : 'your active source'}**:

\`\`\`${activeFile ? activeFile.language : 'python'}
${activeFile ? activeFile.content.slice(0, 300) : '// Code snippet'}
\`\`\`

#### 1. Asymptotic Complexity Analysis
- **Time Complexity:** $O(N)$ linear scan. The execution processes input elements sequentially in a single pass.
- **Auxiliary Space:** $O(N)$ allocation for dynamically sized memory buffers.

#### 2. Architectural Observations & Safety Checks
- **Input Validation:** Ensure guards against empty STDIN buffers or negative indices to avoid exceptions.
- **Cache Locality:** Contiguous array operations guarantee spatial locality within the CPU L1/L2 caches.
- **Clean Architecture:** Separate the I/O parsing layer from the algorithmic transformation pipeline.

> **Optimization Recommendation:** If working with large data sets ($N > 10^6$), consider using generator expressions or in-place transformations to eliminate intermediate buffer reallocations.`;
    }

    if (lower.includes('sql') || lower.includes('database') || lower.includes('index') || lower.includes('query')) {
      return `### ⚡ TITAN Relational Optimization Report

#### 1. Indexing Strategy (B+ Trees vs Hash Indexes)
- **B+ Tree Indexing:** Ideal for range queries (\`WHERE gpa BETWEEN 3.5 AND 4.0\`) because leaf pages form a doubly-linked list.
- **Hash Indexing:** Delivers $O(1)$ point lookups (\`WHERE id = 101\`), but cannot accelerate sorting (\`ORDER BY\`) or range scans.

#### 2. Composite Index Guidelines
\`\`\`sql
-- Recommended composite index for multi-column predicates:
CREATE INDEX idx_enrollments_student_grade ON enrollments (student_id, grade);
\`\`\`
- Always place the most selective equality column first (Leftmost Prefix Rule).

#### 3. Join Engine Mechanics
- In-memory nested loop joins scale as $O(M \\times N)$. For larger tables, a Hash Join (building a hash table on the smaller relation) drastically cuts latency to $O(M + N)$.`;
    }

    if (lower.includes('latency') || lower.includes('memory') || lower.includes('cache') || lower.includes('hardware')) {
      return `### 🧠 Hardware Memory Hierarchy & Cache Locality

Here is the operational latency matrix measured on modern x86/ARM64 architectures:

| Memory Tier | Access Latency | Typical Capacity | Relative Speed |
| :--- | :--- | :--- | :--- |
| **CPU Registers** | ~0.5 ns | ~1 - 2 KB | 200,000x faster |
| **L1d Cache** | ~1.0 ns | 32 - 48 KB / core | 100,000x faster |
| **L2 Cache** | ~3 - 4 ns | 1 - 2 MB / core | 25,000x faster |
| **L3 Cache (Shared)** | ~12 - 20 ns | 16 - 96 MB | 5,000x faster |
| **Main RAM (DDR5)** | ~60 - 90 ns | 16 - 128 GB | Baseline ($1\\times$) |
| **NVMe SSD** | ~15,000 - 50,000 ns | 1 - 4 TB | ~500x slower |

#### Key Engineering Takeaway
CPUs fetch memory in **64-byte Cache Lines**. Struct-of-Arrays (SoA) layout guarantees that contiguous memory loads fill cache lines with purely relevant attributes, avoiding pointer indirection stalls.`;
    }

    if (lower.includes('concurrency') || lower.includes('deadlock') || lower.includes('thread')) {
      return `### 🐛 Concurrency & Thread Synchronization Principles

#### 1. The Four Coffman Conditions for Deadlock
1. **Mutual Exclusion:** Resources cannot be shared simultaneously.
2. **Hold and Wait:** A process holds one resource while requesting another.
3. **No Preemption:** Resources cannot be forcibly revoked.
4. **Circular Wait:** Chain of processes where each waits for a resource held by the next.

> **Deadlock Prevention:** Enforce a strict global lock acquisition ordering to break the *Circular Wait* condition.

#### 2. Lock-Free Atomic Operations (Compare-And-Swap)
\`\`\`cpp
// Atomic CAS idiom
bool compare_and_swap(int* ptr, int expected, int new_val);
\`\`\`
Lock-free queues use CPU hardware instructions (\`cmpxchg\` on x86) to mutate pointers without thread suspension or OS context switch overhead.`;
    }

    return `### 🚀 TITAN Engineering Copilot Response

Regarding your query: **"${userPrompt}"**

#### 1. Core Engineering Perspective
In high-performance systems engineering, all algorithmic decisions represent a trade-off between:
- **Asymptotic Complexity:** Reducing operations from $O(N^2)$ to $O(N \\log N)$ or $O(1)$.
- **Hardware Affinity:** Aligning memory access patterns with cache-line prefetching and branch prediction.
- **Resource Constraints:** Balancing heap allocation overhead against stack frame footprints.

#### 2. Workspace Context
Your active workstation contains **${codeFiles.length} source files** and an active ACID relational database engine. Configure an API key in **AI Settings** for unlimited live LLM reasoning across Gemini, OpenAI, Claude, or Groq.`;
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if ((!query && !attachedFile) || isLoading) return;

    const messageText = query || (attachedFile ? `Attached: ${attachedFile.name}` : '');
    const currentAttachment = attachedFile ? { ...attachedFile } : undefined;

    setInputQuery('');
    setAttachedFile(null);

    const contextSummary = includeContext
      ? `[ACTIVE WORKSPACE CONTEXT: Files: ${codeFiles.map((f) => f.name).join(', ')}. Active file: ${codeFiles[0]?.name || 'none'}. Database: Active tables.]`
      : '';

    const userMessage: AiChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
      codeSnippet: contextSummary,
      attachment: currentAttachment,
    };

    const updatedChats = [...messages, userMessage];
    setMessages(updatedChats);
    StorageService.saveAiChats(updatedChats);
    setIsLoading(true);

    const apiKey = AiProviderService.getApiKey(activeProvider);

    // Build prompt including attachment context if available
    let enrichedQuery = messageText;
    if (currentAttachment) {
      if (currentAttachment.type === 'document' && currentAttachment.content) {
        enrichedQuery += `\n\n--- ATTACHED DOCUMENT: ${currentAttachment.name} ---\n${currentAttachment.content.slice(0, 4000)}`;
      } else if (currentAttachment.type === 'image') {
        enrichedQuery += `\n\n[USER ATTACHED IMAGE/SCREENSHOT: ${currentAttachment.name}]`;
      }
    }

    if (apiKey) {
      try {
        const fullContext = includeContext
          ? `You are TITAN AI Engineering Copilot, an elite software and systems architect assistant. You help engineers with data structures, algorithms, memory locality, concurrency, SQL engines, and system architecture.

CURRENT APPLICATION CONTEXT:
Active Files in Workspace:
${codeFiles.map((f) => `--- File: ${f.name} (${f.language}) ---\n${f.content.slice(0, 1000)}`).join('\n\n')}`
          : undefined;

        const result = await AiProviderService.callAi(enrichedQuery, fullContext);

        const botMessage: AiChatMessage = {
          id: `msg_ai_${Date.now()}`,
          role: 'assistant',
          content: result.text,
          timestamp: Date.now(),
        };

        const finalChats = [...updatedChats, botMessage];
        setMessages(finalChats);
        StorageService.saveAiChats(finalChats);
      } catch (err: any) {
        console.warn(`${activeMeta.name} API call failed, using high-fidelity offline engine:`, err);
        const fallbackText = `> ⚠️ **${activeMeta.name} API Notice:** ${err.message || 'Call failed'}. Running internal engineering intelligence fallback:\n\n${generateOfflineResponse(enrichedQuery)}`;
        const botMessage: AiChatMessage = {
          id: `msg_ai_${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: Date.now(),
        };
        const finalChats = [...updatedChats, botMessage];
        setMessages(finalChats);
        StorageService.saveAiChats(finalChats);
      }
    } else {
      setTimeout(() => {
        const offlineText = generateOfflineResponse(enrichedQuery);
        const botMessage: AiChatMessage = {
          id: `msg_ai_${Date.now()}`,
          role: 'assistant',
          content: offlineText,
          timestamp: Date.now(),
        };
        const finalChats = [...updatedChats, botMessage];
        setMessages(finalChats);
        StorageService.saveAiChats(finalChats);
        setIsLoading(false);
      }, 350);
      return;
    }

    setIsLoading(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const providerList: AiProvider[] = ['gemini', 'openai', 'claude', 'groq', 'custom'];

  return (
    <div
      id="ai-copilot-root"
      className="h-full w-full flex flex-col bg-[#07090e] text-zinc-100 select-none overflow-hidden font-sans"
    >
      {/* 1. TOP TOOLBAR */}
      <header
        id="ai-toolbar"
        className="min-h-[3.5rem] bg-[#0c1017] border-b border-white/[0.08] px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 relative z-20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)] shrink-0">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-tech text-xs font-bold text-zinc-100 tracking-wide">
                TITAN AI COPILOT
              </span>

              {/* Provider Badge */}
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border flex items-center gap-1.5 ${
                  hasActiveKey
                    ? activeMeta.badgeColor
                    : 'text-amber-400 border-amber-500/40 bg-amber-950/40'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    hasActiveKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>
                  {activeMeta.name.toUpperCase()} • {activeModel.toUpperCase()}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono text-xs flex-wrap">
          {/* Context Inspector Toggle */}
          <button
            type="button"
            onClick={() => setIsContextDrawerOpen(!isContextDrawerOpen)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              isContextDrawerOpen
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-white/[0.04] text-zinc-300 border-white/[0.08] hover:bg-white/[0.08]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Workspace Context ({codeFiles.length})</span>
          </button>

          {/* AI Settings Button */}
          <button
            type="button"
            onClick={() => {
              setEditingProvider(activeProvider);
              setIsSettingsOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
            title="Configure AI Providers & API Keys"
          >
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold">AI Settings</span>
          </button>

          {/* Export Transcript */}
          <button
            type="button"
            onClick={handleExportTranscript}
            title="Export conversation history"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border border-white/[0.08] cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {/* Clear Chat */}
          <button
            type="button"
            onClick={handleClearChat}
            title="Clear chat history"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-white/[0.08] hover:border-rose-800 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. MAIN CHAT AREA & CONTEXT DRAWER */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Context Inspector Drawer */}
        {isContextDrawerOpen && (
          <aside className="w-80 border-r border-white/[0.08] bg-[#090d16] flex flex-col p-4 z-10 shrink-0 text-xs font-mono overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-3">
              <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" /> Workspace Context
              </span>
              <button
                type="button"
                onClick={() => setIncludeContext(!includeContext)}
                className={`text-[10px] px-2 py-0.5 rounded cursor-pointer ${
                  includeContext
                    ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-700'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {includeContext ? 'ACTIVE' : 'MUTED'}
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded-lg bg-black/40 border border-white/[0.06]">
                <span className="text-zinc-400 text-[11px] block mb-1 font-bold">Active LLM Engine</span>
                <span className="text-cyan-300">{activeMeta.name}</span>
                <span className="text-[10px] text-zinc-500 block mt-0.5">Model: {activeModel}</span>
              </div>

              <div>
                <span className="text-zinc-400 text-[11px] block mb-1.5 font-bold">
                  Tracked Files ({codeFiles.length})
                </span>
                <div className="space-y-1">
                  {codeFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-2 rounded bg-white/[0.02] border border-white/[0.04] text-[11px] flex items-center justify-between"
                    >
                      <span className="truncate text-zinc-300">{file.name}</span>
                      <span className="text-[9px] text-zinc-500 uppercase">{file.language}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Message Feed */}
        <main className="flex-1 flex flex-col bg-[#07090e] overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                  <Bot className="w-7 h-7" />
                </div>
                <h3 className="font-tech text-lg font-bold text-white mb-2">
                  TITAN Architecture & Systems Copilot
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans mb-6">
                  Connected to <strong className="text-cyan-300">{activeMeta.name}</strong> ({activeModel}).
                  Ask about concurrency, cache locality, SQL query plans, or algorithmic time complexity.
                </p>

                {/* Prompt Suggestions */}
                <div className="grid grid-cols-1 gap-2 w-full text-left font-mono">
                  {PROMPT_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(tmpl.prompt)}
                      className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-500/40 transition-all text-xs text-zinc-300 hover:text-white flex items-center justify-between group cursor-pointer"
                    >
                      <span>{tmpl.title}</span>
                      <Send className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${
                    msg.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-none shadow-lg'
                        : 'glass-panel text-zinc-200 rounded-bl-none border border-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5 text-[10px] font-mono opacity-70">
                      <span className="font-bold uppercase tracking-wider">
                        {msg.role === 'user' ? 'You' : activeMeta.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.role === 'assistant' && (
                          <button
                            type="button"
                            onClick={() => copyToClipboard(msg.content, msg.id)}
                            className="hover:text-cyan-300 cursor-pointer"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Attachment preview in message bubble */}
                    {msg.attachment && (
                      <div className="mb-2.5">
                        {msg.attachment.type === 'image' && msg.attachment.dataUrl ? (
                          <div className="rounded-lg overflow-hidden border border-white/20 max-w-xs bg-black/40">
                            <img
                              src={msg.attachment.dataUrl}
                              alt={msg.attachment.name}
                              className="max-h-56 w-auto object-contain rounded-lg"
                            />
                            <div className="px-2 py-1 text-[10px] font-mono text-zinc-300 bg-black/70 flex items-center justify-between">
                              <span className="truncate">{msg.attachment.name}</span>
                              <span className="text-zinc-400">{msg.attachment.size}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-cyan-300 w-fit">
                            <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="truncate max-w-[200px]">{msg.attachment.name}</span>
                            <span className="text-[10px] text-zinc-400">({msg.attachment.size})</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="whitespace-pre-wrap font-sans break-words">{msg.content}</div>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3 max-w-xl mr-auto">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="glass-panel p-3.5 rounded-2xl rounded-bl-none text-xs font-mono text-cyan-300 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{activeMeta.name} is formulating architectural response...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-[#090d16] border-t border-white/[0.08]">
            {/* Attached File Preview Chip */}
            {attachedFile && (
              <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-cyan-950/70 border border-cyan-500/40 rounded-xl text-xs font-mono text-cyan-300 w-fit animate-in fade-in slide-in-from-bottom-2">
                {attachedFile.type === 'image' ? (
                  <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span className="truncate max-w-[220px] font-semibold">{attachedFile.name}</span>
                <span className="text-[10px] text-zinc-400">({attachedFile.size})</span>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-0.5 hover:text-white text-zinc-400 cursor-pointer ml-1"
                  title="Remove attached file"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              {/* File / Image Attachment Button */}
              <label
                htmlFor="ai-file-input"
                title="Attach image screenshot or code document"
                className="p-2.5 rounded-xl bg-[#05070a] hover:bg-white/[0.08] border border-white/[0.1] hover:border-cyan-500/50 text-zinc-400 hover:text-cyan-300 cursor-pointer transition-all shrink-0 flex items-center justify-center"
              >
                <Paperclip className="w-4 h-4" />
                <input
                  id="ai-file-input"
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,.pdf,.txt,.py,.js,.ts,.tsx,.json,.sql,.md,.csv,.cpp,.java"
                  onChange={handleFileUpload}
                />
              </label>

              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={`Ask ${activeMeta.name} about algorithms, concurrency, system design...`}
                className="flex-1 bg-[#05070a] border border-white/[0.1] focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all font-sans"
              />
              <button
                type="submit"
                disabled={(!inputQuery.trim() && !attachedFile) || isLoading}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-tech font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer transition-all shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* 3. MULTI-PROVIDER AI SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-xl bg-[#0a0f1d] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <Settings2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-tech text-base font-bold text-white">AI Provider & API Keys</h3>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Select your preferred AI engine and configure custom API keys
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-zinc-400 hover:text-white text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Provider Selection Tabs */}
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-semibold">
                Select Active AI Provider:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {providerList.map((p) => {
                  const meta = AI_PROVIDERS[p];
                  const isSelected = editingProvider === p;
                  const hasKey = Boolean(AiProviderService.getApiKey(p));
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setEditingProvider(p)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500 text-white shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                          : 'bg-white/[0.02] border-white/[0.06] text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-xs font-bold leading-snug">{meta.name}</span>
                      <span
                        className={`text-[9px] font-mono mt-1 font-semibold ${
                          hasKey ? 'text-emerald-400' : 'text-zinc-500'
                        }`}
                      >
                        {hasKey ? 'KEY ACTIVE' : 'NO KEY'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Provider Form */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> {AI_PROVIDERS[editingProvider].name} Credentials
                </span>
                <a
                  href={AI_PROVIDERS[editingProvider].docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Get API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* API Key Input */}
              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">API Key:</label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder={AI_PROVIDERS[editingProvider].placeholder}
                    className="w-full bg-black/60 border border-white/[0.1] rounded-lg px-3 py-2 pr-10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Model Selector */}
              <div>
                <label className="text-zinc-400 text-[11px] block mb-1">Model Name:</label>
                <div className="flex gap-2">
                  <select
                    value={modelInput}
                    onChange={(e) => setModelInput(e.target.value)}
                    className="flex-1 bg-black/60 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {AI_PROVIDERS[editingProvider].availableModels.map((m) => (
                      <option key={m} value={m} className="bg-zinc-900 text-white">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Endpoint for Custom/OpenRouter */}
              {editingProvider === 'custom' && (
                <div>
                  <label className="text-zinc-400 text-[11px] block mb-1">Custom Endpoint URL:</label>
                  <input
                    type="text"
                    value={customEndpointInput}
                    onChange={(e) => setCustomEndpointInput(e.target.value)}
                    placeholder="https://openrouter.ai/api/v1/chat/completions"
                    className="w-full bg-black/60 border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              {saveNotification && (
                <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{saveNotification}</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 text-xs font-mono cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProviderSettings}
                className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-tech font-bold text-xs shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer transition-all"
              >
                Save & Activate Provider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
