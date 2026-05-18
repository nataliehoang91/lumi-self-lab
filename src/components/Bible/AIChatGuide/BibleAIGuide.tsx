"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, X, Send, BookOpen, Hash, GraduationCap, Map,
  ArrowRight, Search, Brain, BookMarked, Lightbulb, Trash2, Plus, LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

// ── Types ────────────────────────────────────────────────────────────────────

interface NavLink { label: string; href: string; type: "topic" | "book" | "learn" | "page" | "overview" }
interface Message { role: "user" | "assistant"; content: string; links?: NavLink[]; id: string }

interface Topic {
  id: string;
  label: string;
  messages: Message[];
}

const LINKS_MARKER = "\n\nLINKS:";
const USAGE_MARKER = "\n\nUSAGE:";
const TOPICS_KEY = "bible-ai-topics-v2";
const VERSION_PREF_KEY = "bible-ai-version-pref";
const MAX_MESSAGES = 100;
const MAX_TOPICS = 3;

type BibleVersionPref = "vi" | "niv" | "kjv";
const VERSION_LABELS: Record<BibleVersionPref, string> = { vi: "VI 1925", niv: "NIV", kjv: "KJV" };

// ── Static maps ──────────────────────────────────────────────────────────────

const LINK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  topic: Hash, book: BookOpen, learn: GraduationCap, page: Map, overview: BookMarked,
};

const LINK_COLORS: Record<string, string> = {
  topic:    "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/30 dark:border-violet-800/40 dark:text-violet-300",
  book:     "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300",
  learn:    "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-300",
  page:     "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/30 dark:border-blue-800/40 dark:text-blue-300",
  overview: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-800/40 dark:text-indigo-300",
};

// ── Thinking indicator ───────────────────────────────────────────────────────

const THINKING_EN = [
  { icon: Brain,      text: "Understanding your question…" },
  { icon: Search,     text: "Searching Bible topics…" },
  { icon: BookMarked, text: "Finding relevant passages…" },
  { icon: Lightbulb,  text: "Putting it together…" },
];
const THINKING_VI = [
  { icon: Brain,      text: "Đang hiểu câu hỏi của bạn…" },
  { icon: Search,     text: "Đang tìm kiếm chủ đề Kinh Thánh…" },
  { icon: BookMarked, text: "Đang tìm đoạn Kinh Thánh liên quan…" },
  { icon: Lightbulb,  text: "Đang tổng hợp câu trả lời…" },
];

function ThinkingIndicator({ isVi }: { isVi: boolean }) {
  const steps = isVi ? THINKING_VI : THINKING_EN;
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1800);
    return () => clearInterval(id);
  }, [steps.length]);
  const { icon: Icon, text } = steps[step]!;
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2.5 text-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-foreground">{text}</span>
            <span className="ml-0.5 inline-flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block h-1 w-1 rounded-full bg-primary/60"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Markdown / answer rendering ──────────────────────────────────────────────

type Token = string | { bold: string };

function parseTokens(raw: string): Token[] {
  let text = raw
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^---+$/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const tokens: Token[] = [];
  const boldRe = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = boldRe.exec(text)) !== null) {
    if (m.index > last) tokens.push(text.slice(last, m.index));
    tokens.push({ bold: m[1]! });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push(text.slice(last));
  return tokens;
}

function PopAnswer({ text, animate }: { text: string; animate: boolean }) {
  const tokens = parseTokens(text);
  const units: { word: string; bold: boolean }[] = [];
  for (const token of tokens) {
    if (typeof token === "string") {
      for (const w of token.split(/(\s+)/)) { if (w) units.push({ word: w, bold: false }); }
    } else {
      for (const w of token.bold.split(/(\s+)/)) { if (w) units.push({ word: w, bold: true }); }
    }
  }
  if (!animate) {
    return (
      <span>
        {units.map((u, i) => u.bold ? <strong key={i}>{u.word}</strong> : <span key={i}>{u.word}</span>)}
      </span>
    );
  }
  return (
    <span>
      {units.map((u, i) => {
        const Tag = u.bold ? "strong" : "span";
        return (
          <motion.span key={i} initial={{ opacity: 0, scale: 0.55, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 22, delay: i * 0.028 }}
            className="inline-block" style={{ marginRight: /^\s+$/.test(u.word) ? 0 : "0.22em" }}>
            <Tag>{u.word}</Tag>
          </motion.span>
        );
      })}
    </span>
  );
}

function NavCard({ link, index, animate }: { link: NavLink; index: number; animate: boolean }) {
  const Icon = LINK_ICONS[link.type] ?? Hash;
  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.85, y: 8 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 24, delay: animate ? 0.1 + index * 0.07 : 0 }}
    >
      <Link href={link.href} className={cn("flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]", LINK_COLORS[link.type])}>
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 truncate">{link.label}</span>
        <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
      </Link>
    </motion.div>
  );
}

const STARTERS_EN = [
  "What does the Bible say about anxiety?",
  "Where should I start reading?",
  "Topics related to relationships?",
  "Tell me about faith",
];
const STARTERS_VI = [
  "Kinh Thánh nói gì về lo lắng?",
  "Tôi nên bắt đầu đọc từ đâu?",
  "Chủ đề về các mối quan hệ?",
  "Cho tôi biết về đức tin",
];

function uid() { return Math.random().toString(36).slice(2); }

function newTopic(): Topic {
  return { id: uid(), label: "", messages: [] };
}

function topicLabel(t: Topic, isVi: boolean) {
  const first = t.messages.find((m) => m.role === "user");
  if (first) return first.content.slice(0, 28) + (first.content.length > 28 ? "…" : "");
  return isVi ? "Cuộc trò chuyện mới" : "New conversation";
}

function loadTopics(): Topic[] {
  try {
    const raw = localStorage.getItem(TOPICS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Topic[]) : [];
    return parsed.length > 0 ? parsed : [newTopic()];
  } catch { return [newTopic()]; }
}

function saveTopics(topics: Topic[]) {
  try { localStorage.setItem(TOPICS_KEY, JSON.stringify(topics)); } catch { /* ignore */ }
}

// ── Main component ────────────────────────────────────────────────────────────

export function BibleAIGuide({ lang }: { lang: string }) {
  const isVi = lang === "vi";
  const { isSignedIn, isLoaded } = useUser();
  const defaultVersion: BibleVersionPref = isVi ? "vi" : "niv";
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string>("");
  const [newestId, setNewestId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [prefVersion, setPrefVersion] = useState<BibleVersionPref>(defaultVersion);
  const [showVersionPicker, setShowVersionPicker] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);
  const [aiLimitReached, setAiLimitReached] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load topics on mount
  useEffect(() => {
    const loaded = loadTopics();
    setTopics(loaded);
    setActiveTopicId(loaded[0]!.id);
    try {
      const v = localStorage.getItem(VERSION_PREF_KEY) as BibleVersionPref | null;
      if (v && (v === "vi" || v === "niv" || v === "kjv")) setPrefVersion(v);
    } catch { /* ignore */ }
  }, []);

  // Fetch usage on mount (when signed in)
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/bible/ai-guide")
      .then((r) => r.json())
      .then((data: { used: number; limit: number }) => {
        setUsage(data);
        if (data.used >= data.limit) setAiLimitReached(true);
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn]);

  // Persist whenever topics change
  useEffect(() => {
    if (topics.length > 0) saveTopics(topics);
  }, [topics]);

  // Listen for global open event (from study reader or other surfaces)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ initialMessage?: string }>).detail;
      setOpen(true);
      if (detail?.initialMessage) {
        // Create a new topic for this context if current active has messages
        setTopics((prev) => {
          const active = prev.find((t) => t.id === activeTopicId);
          if (active && active.messages.length > 0 && prev.length < MAX_TOPICS) {
            const newT = newTopic();
            const next = [...prev, newT];
            setActiveTopicId(newT.id);
            return next;
          }
          return prev;
        });
        setTimeout(() => setInput(detail.initialMessage!), 50);
      }
    };
    window.addEventListener("bible-ai-open", handler);
    return () => window.removeEventListener("bible-ai-open", handler);
  }, [activeTopicId]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [topics, loading, activeTopicId]);

  const activeTopic = topics.find((t) => t.id === activeTopicId) ?? topics[0];
  const messages = activeTopic?.messages ?? [];
  const totalMessages = topics.reduce((s, t) => s + t.messages.filter((m) => m.role === "user").length, 0);

  const setVersion = (v: BibleVersionPref) => {
    setPrefVersion(v);
    setShowVersionPicker(false);
    try { localStorage.setItem(VERSION_PREF_KEY, v); } catch { /* ignore */ }
  };

  const updateActiveMessages = useCallback((updater: (prev: Message[]) => Message[]) => {
    setTopics((prev) => prev.map((t) =>
      t.id === activeTopicId ? { ...t, messages: updater(t.messages) } : t
    ));
  }, [activeTopicId]);

  const clearActiveTopic = useCallback(() => {
    updateActiveMessages(() => []);
    setNewestId(null);
  }, [updateActiveMessages]);

  const addTopic = () => {
    if (topics.length >= MAX_TOPICS) return;
    const t = newTopic();
    setTopics((prev) => [...prev, t]);
    setActiveTopicId(t.id);
  };

  const closeTopic = (id: string) => {
    setTopics((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        const fresh = newTopic();
        setActiveTopicId(fresh.id);
        return [fresh];
      }
      if (id === activeTopicId) {
        setActiveTopicId(next[next.length - 1]!.id);
      }
      return next;
    });
  };

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text, id: uid() };
    updateActiveMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const currentMessages = activeTopic?.messages ?? [];
    try {
      const history = currentMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/bible/ai-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang, history, recentTopics: [], preferredVersion: prefVersion }),
      });
      if (res.status === 429) {
        const data = await res.json() as { used: number; limit: number };
        setUsage({ used: data.used, limit: data.limit });
        setAiLimitReached(true);
        updateActiveMessages((prev) => prev.slice(0, -1)); // remove optimistic user msg
        setInput(text);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
      }
      // Parse USAGE
      const usageIdx = buffer.lastIndexOf(USAGE_MARKER);
      if (usageIdx >= 0) {
        try { setUsage(JSON.parse(buffer.slice(usageIdx + USAGE_MARKER.length)) as { used: number; limit: number }); } catch { /* ignore */ }
        buffer = buffer.slice(0, usageIdx);
      }
      // Parse LINKS
      const linksIdx = buffer.lastIndexOf(LINKS_MARKER);
      const textPart = linksIdx >= 0 ? buffer.slice(0, linksIdx) : buffer;
      let links: NavLink[] = [];
      if (linksIdx >= 0) {
        try { links = JSON.parse(buffer.slice(linksIdx + LINKS_MARKER.length)) as NavLink[]; } catch { /* ignore */ }
      }
      const id = uid();
      setNewestId(id);
      updateActiveMessages((prev) => [...prev, { role: "assistant", content: textPart, links, id }]);
    } catch {
      const id = uid();
      setNewestId(id);
      updateActiveMessages((prev) => [...prev, {
        role: "assistant", id,
        content: isVi ? "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại." : "Sorry, something went wrong. Please try again.",
        links: [],
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, activeTopic, lang, prefVersion, isVi, updateActiveMessages]);

  const starters = isVi ? STARTERS_VI : STARTERS_EN;
  const atLimit = messages.length >= MAX_MESSAGES || aiLimitReached;

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg hover:bg-primary/90"
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">{isVi ? "Hỏi AI" : "Ask AI"}</span>
            {totalMessages > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">
                {totalMessages}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sliding panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed right-0 top-14 bottom-0 z-40 flex w-full flex-col border-l border-border bg-background/95 shadow-2xl backdrop-blur-sm sm:w-[480px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {isVi ? "Hướng dẫn Kinh Thánh" : "Bible Guide"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {isVi ? "Hỏi bất cứ điều gì" : "Ask anything"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Version badge */}
                <div className="relative">
                  <button type="button" onClick={() => setShowVersionPicker((v) => !v)}
                    className="rounded-full border border-primary/30 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/15">
                    {VERSION_LABELS[prefVersion]}
                  </button>
                  <AnimatePresence>
                    {showVersionPicker && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.15 }}
                        className="absolute right-0 top-7 z-50 flex flex-col gap-1 rounded-xl border border-border bg-background p-1.5 shadow-lg"
                      >
                        {(["vi", "niv", "kjv"] as BibleVersionPref[]).map((v) => (
                          <button key={v} type="button" onClick={() => setVersion(v)}
                            className={cn("rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors",
                              prefVersion === v ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted")}>
                            {VERSION_LABELS[v]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {messages.length > 0 && (
                  <button type="button" onClick={clearActiveTopic} title={isVi ? "Xóa cuộc trò chuyện" : "Clear conversation"}
                    className="text-muted-foreground hover:text-destructive rounded-lg p-1.5 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button type="button" onClick={() => setOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Auth gate */}
            {isLoaded && !isSignedIn && (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {isVi ? "Đăng nhập để hỏi AI" : "Sign in to use Bible Guide"}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground max-w-[260px]">
                    {isVi
                      ? "Tạo tài khoản miễn phí để đặt câu hỏi về Kinh Thánh và lưu lịch sử trò chuyện."
                      : "Create a free account to ask questions about Scripture and save your conversation history."}
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 w-full max-w-[220px]">
                  <Link href={`/sign-in?redirect_url=/bible/${lang}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                    <LogIn className="h-4 w-4" />
                    {isVi ? "Đăng nhập" : "Sign in"}
                  </Link>
                  <Link href={`/sign-up?redirect_url=/bible/${lang}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                    {isVi ? "Tạo tài khoản miễn phí" : "Create free account"}
                  </Link>
                </div>
              </div>
            )}

            {/* Chat UI — only when signed in */}
            {(!isLoaded || isSignedIn) && <>
              {/* Topic tabs */}
              <div className="flex items-center gap-1 border-b border-border px-3 pt-2 pb-0 overflow-x-auto">
                {topics.map((t) => {
                  const isActive = t.id === activeTopicId;
                  return (
                    <div key={t.id}
                      className={cn("group flex shrink-0 items-center gap-1 rounded-t-lg border-b-2 px-3 py-1.5 transition-colors cursor-pointer",
                        isActive ? "border-primary text-foreground bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50")}
                      onClick={() => setActiveTopicId(t.id)}
                    >
                      <span className="max-w-[120px] truncate text-xs font-medium">
                        {topicLabel(t, isVi)}
                      </span>
                      {topics.length > 1 && (
                        <button type="button"
                          onClick={(e) => { e.stopPropagation(); closeTopic(t.id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
                {topics.length < MAX_TOPICS && (
                  <button type="button" onClick={addTopic} title={isVi ? "Thêm chủ đề" : "New topic"}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mb-1">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
                {messages.length === 0 ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                      <p className="text-xs font-semibold text-foreground mb-2">
                        {isVi ? "Bản dịch ưa thích của bạn?" : "Your preferred Bible version?"}
                      </p>
                      <div className="flex gap-2">
                        {(["vi", "niv", "kjv"] as BibleVersionPref[]).map((v) => (
                          <button key={v} type="button" onClick={() => setVersion(v)}
                            className={cn("flex-1 rounded-lg border py-1.5 text-xs font-semibold transition-colors",
                              prefVersion === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
                            {VERSION_LABELS[v]}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        {isVi ? "Bạn có thể đổi bất cứ lúc nào ở góc trên." : "You can change this anytime from the top."}
                      </p>
                    </div>
                    <p className="text-[11px] text-center text-muted-foreground">
                      {isVi ? "Hỏi tôi về chủ đề, sách Kinh Thánh, hoặc cách điều hướng" : "Ask me about topics, Bible books, or how to navigate"}
                    </p>
                    <div className="space-y-2">
                      {starters.map((s, i) => (
                        <motion.button key={s} type="button" onClick={() => void send(s)}
                          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 25 }}
                          whileHover={{ x: 3 }}
                          className="w-full text-left rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors">
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                      const isNew = msg.id === newestId;
                      return (
                        <motion.div key={msg.id} layout
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                          className={cn("flex flex-col gap-1", msg.role === "user" ? "items-end" : "items-start")}
                        >
                          <div className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                            msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm")}>
                            {msg.role === "assistant" ? <PopAnswer text={msg.content} animate={isNew} /> : msg.content}
                          </div>
                          {msg.links && msg.links.length > 0 && (
                            <div className="mt-1 w-full space-y-1.5">
                              {msg.links.map((link, j) => <NavCard key={j} link={link} index={j} animate={isNew} />)}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
                {loading && <ThinkingIndicator isVi={isVi} />}
                {atLimit && !loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-2 text-center text-[10px] text-muted-foreground">
                    {isVi ? "Đã đạt giới hạn. Xóa cuộc trò chuyện để tiếp tục." : "Limit reached. Clear conversation to continue."}
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-border p-3 space-y-2">
                {aiLimitReached ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/80 dark:border-amber-800/40 dark:bg-amber-950/20 px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      {isVi ? `Đã dùng hết ${usage?.limit ?? 30} tin nhắn miễn phí tháng này` : `You've used all ${usage?.limit ?? 30} free messages this month`}
                    </p>
                    <p className="mt-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                      {isVi ? "Nâng cấp để tiếp tục hoặc chờ đến tháng sau" : "Upgrade to continue or wait until next month"}
                    </p>
                    <Link href="/pricing" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                      {isVi ? "Nâng cấp" : "Upgrade"}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div className={cn("flex items-center gap-2 rounded-xl border bg-muted/40 pl-3 pr-1.5 py-1.5 transition-colors focus-within:border-primary/40",
                    atLimit ? "opacity-50 pointer-events-none" : "border-border")}>
                    <input ref={inputRef} type="text" value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); } }}
                      placeholder={isVi ? "Hỏi gì đó..." : "Ask something..."}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      disabled={loading || atLimit} />
                    <motion.button type="button" onClick={() => void send(input)}
                      disabled={!input.trim() || loading || atLimit} whileTap={{ scale: 0.9 }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40">
                      <Send className="h-3 w-3" />
                    </motion.button>
                  </div>
                )}
                {!aiLimitReached && (
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary/50 transition-all"
                        style={{ width: usage ? `${Math.min(100, (usage.used / usage.limit) * 100)}%` : "0%" }} />
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {usage ? `${usage.used}/${usage.limit}` : `0/30`} {isVi ? "tin nhắn" : "msgs"}
                    </span>
                  </div>
                )}
              </div>
            </>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
