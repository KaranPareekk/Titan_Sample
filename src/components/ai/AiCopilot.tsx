import React, { useState, useEffect, useRef, ReactNode } from "react";
import {
  Bot, Send, Trash2, Download, Key,
  Sparkles, Copy, Check, GraduationCap,
  Zap, AlertCircle, ExternalLink,
} from "lucide-react";
import { AiChatMessage } from "../../types";
import { StorageService } from "../../services/storage";

const WELCOME_ID = "msg-welcome";

const BEGINNER_CHIPS = [
  "What is a variable?",
  "How do loops work?",
  "Explain functions with examples",
  "What are common coding errors?",
];
const EXPERT_CHIPS = [
  "Analyze Big-O complexity",
  "Explain memory stack vs heap",
  "How does garbage collection work?",
];

function parseInline(text: string): ReactNode[] {
  const segments = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith("**") && seg.endsWith("**")) {
      return <strong key={i}>{seg.slice(2, -2)}</strong>;
    }
    if (seg.startsWith("`") && seg.endsWith("`")) {
      return (
        <code key={i} className="bg-zinc-800 px-1 rounded text-cyan-300 text-xs font-mono">
          {seg.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={i}>{seg}</React.Fragment>;
  });
}

function renderMarkdown(text: string): React.JSX.Element[] {
  const lines = text.split("\n");
  const out: React.JSX.Element[] = [];
  let inCode = false;
  let codeBuf: string[] = [];
  let codeLang = "";
  let listBuf: React.JSX.Element[] = [];

  function flushList() {
    if (listBuf.length > 0) {
      out.push(
        <ul key={"ul-" + out.length} className="list-disc pl-5 my-2 space-y-0.5">
          {listBuf}
        </ul>
      );
      listBuf = [];
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCode) {
        flushList();
        const lang = codeLang;
        const buf = codeBuf.slice();
        out.push(
          <pre key={"pre-" + out.length} className="bg-[#0c0e14] p-3 rounded-md overflow-x-auto my-2 border border-zinc-800/50 text-sm">
            {lang && <div className="text-[10px] text-zinc-500 mb-1 uppercase">{lang}</div>}
            <code className="text-zinc-300 font-mono text-xs leading-relaxed">{buf.join("\n")}</code>
          </pre>
        );
        inCode = false;
        codeBuf = [];
        codeLang = "";
      } else {
        flushList();
        inCode = true;
        codeLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCode) { codeBuf.push(line); continue; }

    if (line.trimStart().startsWith("- ") || line.trimStart().startsWith("* ")) {
      const txt = line.trimStart().slice(2);
      listBuf.push(<li key={"li-" + listBuf.length} className="text-sm text-zinc-300">{parseInline(txt)}</li>);
      continue;
    } else {
      flushList();
    }

    if (line.startsWith("### ")) {
      out.push(<p key={"h3-" + out.length} className="font-bold text-base text-white mt-3 mb-1">{parseInline(line.slice(4))}</p>);
    } else if (line.startsWith("## ")) {
      out.push(<p key={"h2-" + out.length} className="font-bold text-sm text-white mt-2 mb-1">{parseInline(line.slice(3))}</p>);
    } else if (line.startsWith("# ")) {
      out.push(<p key={"h1-" + out.length} className="font-bold text-white mt-2 mb-1">{parseInline(line.slice(2))}</p>);
    } else if (line.trim() === "") {
      out.push(<div key={"br-" + out.length} className="h-1.5" />);
    } else {
      out.push(
        <p key={"p-" + out.length} className="text-sm text-zinc-300 leading-relaxed">
          {parseInline(line)}
        </p>
      );
    }
  }

  flushList();
  if (inCode && codeBuf.length > 0) {
    out.push(
      <pre key="pre-end" className="bg-[#0c0e14] p-3 rounded-md overflow-x-auto my-2 border border-zinc-800/50">
        <code className="text-zinc-300 font-mono text-xs">{codeBuf.join("\n")}</code>
      </pre>
    );
  }
  return out;
}

export const AiCopilot: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [inputKey, setInputKey] = useState<string>("");
  const [messages, setMessages] = useState<AiChatMessage[]>(() => {
    const saved = StorageService.getAiChats();
    if (saved && saved.length > 0) return saved;
    return [{
      id: WELCOME_ID,
      role: "assistant",
      content: "Hi! I am **Titan AI**, powered by Gemini. Ask me anything about programming, code review, debugging, algorithms, or career advice. I give real, dynamic answers every time.",
      timestamp: Date.now(),
    }];
  });
  const [input, setInput] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [tutorMode, setTutorMode] = useState<"beginner" | "expert">("beginner");
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("titan_gemini_api_key");
    if (stored) setApiKey(stored);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
    StorageService.saveAiChats(messages);
  }, [messages]);

  const saveKey = () => {
    const k = inputKey.trim();
    if (!k) return;
    localStorage.setItem("titan_gemini_api_key", k);
    setApiKey(k);
    setInputKey("");
    setError(null);
  };

  const clearKey = () => {
    localStorage.removeItem("titan_gemini_api_key");
    setApiKey("");
  };

  const clearChat = () => {
    const welcome: AiChatMessage = {
      id: WELCOME_ID,
      role: "assistant",
      content: "Chat cleared. What would you like to explore?",
      timestamp: Date.now(),
    };
    setMessages([welcome]);
    setError(null);
  };

  const exportChat = () => {
    const text = messages
      .map(m => "[" + new Date(m.timestamp).toLocaleTimeString() + "] " + (m.role === "user" ? "YOU" : "TITAN AI") + ":\n" + m.content)
      .join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "titan-chat-" + new Date().toISOString().slice(0, 10) + ".txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyMsg = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !apiKey || isGenerating) return;

    const userMsg: AiChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput("");
    setIsGenerating(true);
    setError(null);

    try {
      const sysText = tutorMode === "beginner"
        ? "You are a friendly, patient programming tutor for beginners. Use simple language, real-world analogies, and short code examples. Always format responses using Markdown with clear headings, bullet points, and code blocks."
        : "You are a senior software engineer. Provide deep technical analysis covering algorithms, complexity, systems architecture, and performance optimizations. Use Markdown formatting with code examples.";

      const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [
        { role: "user", parts: [{ text: sysText }] },
        { role: "model", parts: [{ text: "Understood. I will follow these instructions carefully." }] },
      ];

      const history = updatedMsgs.filter(m => m.id !== WELCOME_ID && m.id !== userMsg.id);
      for (const msg of history) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        });
      }
      contents.push({ role: "user", parts: [{ text: trimmed }] });

      const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.error?.message || "API returned HTTP " + resp.status);
      }

      const replyText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";

      const aiMsg: AiChatMessage = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: replyText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const chips = tutorMode === "beginner" ? BEGINNER_CHIPS : EXPERT_CHIPS;

  return (
    <div className="h-full flex flex-col bg-[#07090e] text-zinc-100 overflow-hidden">
      <header className="flex-shrink-0 h-12 border-b border-zinc-800/60 bg-[#0a0c10] flex items-center justify-between px-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Bot className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-zinc-200 truncate">Titan AI</span>
          {apiKey && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Gemini Live
            </span>
          )}
          <div className="flex bg-zinc-900 rounded p-0.5 border border-zinc-800 ml-2">
            <button
              type="button"
              onClick={() => setTutorMode("beginner")}
              className={tutorMode === "beginner"
                ? "px-2 py-0.5 text-xs rounded bg-zinc-800 text-cyan-300 flex items-center gap-1"
                : "px-2 py-0.5 text-xs rounded text-zinc-500 hover:text-zinc-300 flex items-center gap-1"}
            >
              <GraduationCap className="w-3 h-3" />
              <span className="hidden sm:inline">Beginner</span>
            </button>
            <button
              type="button"
              onClick={() => setTutorMode("expert")}
              className={tutorMode === "expert"
                ? "px-2 py-0.5 text-xs rounded bg-zinc-800 text-purple-400 flex items-center gap-1"
                : "px-2 py-0.5 text-xs rounded text-zinc-500 hover:text-zinc-300 flex items-center gap-1"}
            >
              <Zap className="w-3 h-3" />
              <span className="hidden sm:inline">Expert</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {apiKey && (
            <button type="button" onClick={clearKey} title="Remove API Key"
              className="p-1.5 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-800 transition-colors">
              <Key className="w-3.5 h-3.5" />
            </button>
          )}
          <button type="button" onClick={exportChat} title="Export Chat"
            className="p-1.5 text-zinc-500 hover:text-zinc-300 rounded hover:bg-zinc-800 transition-colors">
            <Download className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={clearChat} title="Clear Chat"
            className="p-1.5 text-zinc-500 hover:text-red-400 rounded hover:bg-zinc-800 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {!apiKey ? (
          <div className="h-full flex items-center justify-center">
            <div className="max-w-sm w-full bg-[#0c0e14] border border-zinc-800 rounded-xl p-6 shadow-2xl flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center">
                <Key className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-100 mb-1">Connect Gemini AI</h2>
                <p className="text-sm text-zinc-400">
                  Enter your free Gemini API key to get real AI responses. Your key is saved only in this browser.
                </p>
              </div>
              <div className="w-full space-y-2">
                <input
                  type="password"
                  value={inputKey}
                  onChange={e => setInputKey(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveKey()}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#07090e] border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-cyan-500/70"
                />
                <button
                  type="button"
                  onClick={saveKey}
                  disabled={!inputKey.trim()}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Connect
                </button>
              </div>
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer"
                className="text-xs text-cyan-400/80 hover:text-cyan-400 flex items-center gap-1 transition-colors">
                Get a free key at aistudio.google.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className={msg.role === "user"
                  ? "max-w-[80%] bg-cyan-900/30 border border-cyan-800/40 rounded-2xl rounded-tr-sm px-4 py-3"
                  : "max-w-[90%] bg-[#0d0f16] border border-zinc-800/50 rounded-2xl rounded-tl-sm px-4 py-3 w-full"}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium text-zinc-500">
                      {msg.role === "user" ? "You" : "Titan AI"}
                    </span>
                    <button type="button" onClick={() => copyMsg(msg.id, msg.content)}
                      title="Copy" className="text-zinc-600 hover:text-zinc-400 transition-colors ml-2">
                      {copiedId === msg.id
                        ? <Check className="w-3 h-3 text-emerald-400" />
                        : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  {msg.role === "user"
                    ? <p className="text-sm text-zinc-200 whitespace-pre-wrap">{msg.content}</p>
                    : <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>}
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-[#0d0f16] border border-zinc-800/50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-sm text-zinc-400">Thinking...</span>
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-start">
                <div className="bg-red-950/30 border border-red-900/50 rounded-xl px-4 py-3 flex items-start gap-2 max-w-[90%]">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-400 mb-1">API Error</p>
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </>
        )}
      </div>

      {apiKey && (
        <footer className="flex-shrink-0 border-t border-zinc-800/60 bg-[#0a0c10] p-3 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            {chips.map(chip => (
              <button key={chip} type="button" onClick={() => sendMessage(chip)} disabled={isGenerating}
                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-full text-xs text-zinc-400 hover:text-zinc-200 whitespace-nowrap transition-colors disabled:opacity-40">
                {chip}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Ask anything... (Enter to send, Shift+Enter for newline)"
              disabled={isGenerating}
              rows={1}
              className="flex-1 bg-[#07090e] border border-zinc-800 focus:border-cyan-600/50 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none resize-none max-h-32 min-h-[40px] transition-colors"
            />
            <button type="button" onClick={() => sendMessage(input)}
              disabled={!input.trim() || isGenerating}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2.5 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors self-end">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AiCopilot;
