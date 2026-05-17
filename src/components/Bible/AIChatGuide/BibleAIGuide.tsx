"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, X, Send, BookOpen, Hash, GraduationCap, Map,
  ArrowRight, Search, Brain, BookMarked, Lightbulb, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────

interface NavLink { label: string; href: string; type: "topic" | "book" | "learn" | "page" }
interface Message { role: "user" | "assistant"; content: string; links?: NavLink[]; id: string }

const LINKS_MARKER = "\n\nLINKS:";
const STORAGE_KEY = "bible-ai-chat";
const MAX_MESSAGES = 100; // 50 exchanges

// ── Static maps ──────────────────────────────────────────────────────────────

const LINK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  topic: Hash, book: BookOpen, learn: GraduationCap, page: Map,
};

const LINK_COLORS: Record<string, string> = {
  topic: "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/30 dark:border-violet-800/40 dark:text-violet-300",
  book:  "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300",
  learn: "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-300",
  page:  "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/30 dark:border-blue-800/40 dark:text-blue-300",
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
      <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2.5 text-xs">
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

// ── Markdown cleanup ─────────────────────────────────────────────────────────

/** Token: plain string or {bold: string} */
type Token = string | { bold: string };

function parseTokens(raw: string): Token[] {
  // Strip headers, separators, inline links
  let text = raw
    .replace(/^#{1,6}\s+/gm, "")      // ### headings
    .replace(/^---+$/gm, "")          // horizontal rules
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) → text
    .replace(/\n{3,}/g, "\n\n")       // collapse excess newlines
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

// ── Animated answer — words pop in one by one ────────────────────────────────

function PopAnswer({ text, animate }: { text: string; animate: boolean }) {
  const tokens = parseTokens(text);

  // Flatten to animatable word units, preserving bold metadata
  const units: { word: string; bold: boolean }[] = [];
  for (const token of tokens) {
    if (typeof token === "string") {
      for (const w of token.split(/(\s+)/)) {
        if (w) units.push({ word: w, bold: false });
      }
    } else {
      for (const w of token.bold.split(/(\s+)/)) {
        if (w) units.push({ word: w, bold: true });
      }
    }
  }

  if (!animate) {
    return (
      <span>
        {units.map((u, i) =>
          u.bold ? <strong key={i}>{u.word}</strong> : <span key={i}>{u.word}</span>
        )}
      </span>
    );
  }

  return (
    <span>
      {units.map((u, i) => {
        const Tag = u.bold ? "strong" : "span";
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.55, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 22, delay: i * 0.028 }}
            className="inline-block"
            style={{ marginRight: /^\s+$/.test(u.word) ? 0 : "0.22em" }}
          >
            <Tag>{u.word}</Tag>
          </motion.span>
        );
      })}
    </span>
  );
}

// ── Nav link card — staggered pop ────────────────────────────────────────────

function NavCard({
  link, index, animate,
}: {
  link: NavLink; index: number; animate: boolean;
}) {
  const Icon = LINK_ICONS[link.type] ?? Hash;
  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.85, y: 8 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 24, delay: animate ? 0.1 + index * 0.07 : 0 }}
    >
      <Link
        href={link.href}
        className={cn(
          "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-all hover:scale-[1.02] active:scale-[0.98]",
          LINK_COLORS[link.type]
        )}
      >
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 truncate">{link.label}</span>
        <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
      </Link>
    </motion.div>
  );
}

// ── Starters ─────────────────────────────────────────────────────────────────

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

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2);
}

function loadHistory(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch { return []; }
}

function saveHistory(msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-MAX_MESSAGES)));
  } catch { /* ignore */ }
}

// ── Main component ────────────────────────────────────────────────────────────

export function BibleAIGuide({ lang }: { lang: string }) {
  const isVi = lang === "vi";
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newestId, setNewestId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentTopics, setRecentTopics] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load persisted chat + recent topics on mount
  useEffect(() => {
    setMessages(loadHistory());
    try {
      const raw = localStorage.getItem("bible-recent-topics");
      if (raw) setRecentTopics(JSON.parse(raw) as string[]);
    } catch { /* ignore */ }
  }, []);

  // Persist whenever messages change
  useEffect(() => {
    if (messages.length > 0) saveHistory(messages);
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setNewestId(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text, id: uid() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/bible/ai-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang, history, recentTopics }),
      });
      if (!res.body) throw new Error("No body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
      }

      const linksIdx = buffer.lastIndexOf(LINKS_MARKER);
      const textPart = linksIdx >= 0 ? buffer.slice(0, linksIdx) : buffer;
      let links: NavLink[] = [];
      if (linksIdx >= 0) {
        try { links = JSON.parse(buffer.slice(linksIdx + LINKS_MARKER.length)) as NavLink[]; }
        catch { /* ignore */ }
      }

      const id = uid();
      setNewestId(id);
      setMessages((prev) => [...prev, { role: "assistant", content: textPart, links, id }]);
    } catch {
      const id = uid();
      setNewestId(id);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          id,
          content: isVi ? "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại." : "Sorry, something went wrong. Please try again.",
          links: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, lang, recentTopics, isVi]);

  const starters = isVi ? STARTERS_VI : STARTERS_EN;
  const atLimit = messages.length >= MAX_MESSAGES;

  return (
    <>
      {/* ── Floating button — hidden when panel is open ── */}
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
            {messages.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">
                {Math.ceil(messages.length / 2)}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Sliding panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed right-0 top-14 bottom-0 z-40 flex w-[480px] flex-col border-l border-border bg-background/95 shadow-2xl backdrop-blur-sm"
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
                    {messages.length > 0
                      ? `${Math.ceil(messages.length / 2)}/${MAX_MESSAGES / 2} ${isVi ? "câu hỏi" : "questions"}`
                      : isVi ? "Hỏi bất cứ điều gì" : "Ask anything"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearChat}
                    title={isVi ? "Xóa lịch sử" : "Clear history"}
                    className="text-muted-foreground hover:text-destructive rounded-lg p-1.5 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  title={isVi ? "Đóng" : "Close"}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <p className="text-[11px] text-center text-muted-foreground">
                    {isVi
                      ? "Hỏi tôi về chủ đề, sách Kinh Thánh, hoặc cách điều hướng"
                      : "Ask me about topics, Bible books, or how to navigate"}
                  </p>
                  <div className="space-y-2">
                    {starters.map((s, i) => (
                      <motion.button
                        key={s}
                        type="button"
                        onClick={() => void send(s)}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 25 }}
                        whileHover={{ x: 3 }}
                        className="w-full text-left rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors"
                      >
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
                      <motion.div
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 28 }}
                        className={cn("flex flex-col gap-1", msg.role === "user" ? "items-end" : "items-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted text-foreground rounded-tl-sm"
                          )}
                        >
                          {msg.role === "assistant"
                            ? <PopAnswer text={msg.content} animate={isNew} />
                            : msg.content}
                        </div>

                        {/* Nav link cards */}
                        {msg.links && msg.links.length > 0 && (
                          <div className="mt-1 w-full space-y-1.5">
                            {msg.links.map((link, j) => (
                              <NavCard key={j} link={link} index={j} animate={isNew} />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}

              {loading && <ThinkingIndicator isVi={isVi} />}

              {/* Limit notice */}
              {atLimit && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-2 text-center text-[10px] text-muted-foreground"
                >
                  {isVi
                    ? "Đã đạt giới hạn 50 câu hỏi. Xóa lịch sử để bắt đầu lại."
                    : "50-question limit reached. Clear history to start fresh."}
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3">
              <div className={cn(
                "flex items-center gap-2 rounded-xl border bg-muted/40 pl-3 pr-1.5 py-1.5 transition-colors focus-within:border-primary/40",
                atLimit ? "opacity-50 pointer-events-none" : "border-border"
              )}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); }
                  }}
                  placeholder={isVi ? "Hỏi gì đó..." : "Ask something..."}
                  className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                  disabled={loading || atLimit}
                />
                <motion.button
                  type="button"
                  onClick={() => void send(input)}
                  disabled={!input.trim() || loading || atLimit}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
                >
                  <Send className="h-3 w-3" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
