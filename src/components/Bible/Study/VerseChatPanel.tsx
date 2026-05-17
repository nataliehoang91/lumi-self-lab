"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerseRef } from "@/app/api/bible/verse-chat/route";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  verses?: VerseRef[];
  streaming?: boolean;
}

interface VerseChatPanelProps {
  selectedVerses: VerseRef[];
  lang: "en" | "vi";
  onClose: () => void;
  onClearSelection: () => void;
}

const T = {
  en: {
    title: "Ask AI",
    placeholder: "Ask anything about these verses…",
    send: "Send",
    thinking: "Thinking…",
    clear: "Clear selection",
    selected: (n: number) => n === 1 ? "1 verse selected" : `${n} verses selected`,
    hint: "Ask a question about the selected verse(s)",
    powered: "Powered by Claude",
  },
  vi: {
    title: "Hỏi AI",
    placeholder: "Hỏi bất cứ điều gì về những câu này…",
    send: "Gửi",
    thinking: "Đang suy nghĩ…",
    clear: "Bỏ chọn",
    selected: (n: number) => `${n} câu được chọn`,
    hint: "Đặt câu hỏi về các câu Kinh Thánh đã chọn",
    powered: "Được hỗ trợ bởi Claude",
  },
} as const;

export function VerseChatPanel({ selectedVerses, lang, onClose, onClearSelection }: VerseChatPanelProps) {
  const t = T[lang] ?? T.en;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when new content arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const sendMessage = async () => {
    const q = input.trim();
    if (!q || loading || selectedVerses.length === 0) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: q,
      verses: [...selectedVerses],
    };
    const aiMsgId = `ai-${Date.now()}`;
    const aiMsg: ChatMessage = { id: aiMsgId, role: "ai", content: "", streaming: true };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/bible/verse-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verses: selectedVerses, question: q, lang }),
      });

      if (!res.ok || !res.body) throw new Error("Failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => m.id === aiMsgId ? { ...m, content: accumulated } : m)
        );
      }

      setMessages((prev) =>
        prev.map((m) => m.id === aiMsgId ? { ...m, streaming: false } : m)
      );
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === aiMsgId
            ? { ...m, content: lang === "vi" ? "Đã xảy ra lỗi. Vui lòng thử lại." : "Something went wrong. Please try again.", streaming: false }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.aside
      className="flex shrink-0 flex-col lg:w-80 xl:w-96"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 340, damping: 30 }}
    >
      <div className="sticky top-20 flex max-h-[calc(100vh-6rem)] flex-col rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{t.title}</p>
              <p className="text-[10px] text-muted-foreground">{t.selected(selectedVerses.length)}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground rounded-lg p-1.5 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Selected verses */}
        <div className="border-b border-border/50 bg-primary/3 px-3 py-2">
          <div className="flex flex-wrap gap-1.5">
            {selectedVerses.map((v) => (
              <motion.span
                key={`${v.bookName}-${v.chapter}-${v.verseNum}`}
                layoutId={`verse-chip-${v.bookName}-${v.chapter}-${v.verseNum}`}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                initial={{ opacity: 0, scale: 0.8, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {v.bookName} {v.chapter}:{v.verseNum}
              </motion.span>
            ))}
          </div>
          <button type="button" onClick={onClearSelection} className="mt-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-colors">
            {t.clear}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 min-h-0">
          {messages.length === 0 && (
            <motion.div
              className="flex flex-col items-center gap-2 py-8 text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Bot className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">{t.hint}</p>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              >
                {msg.role === "user" ? (
                  <div className="flex flex-col items-end gap-1.5">
                    {/* Verse references used in this message */}
                    {msg.verses && msg.verses.length > 0 && (
                      <div className="flex flex-wrap justify-end gap-1">
                        {msg.verses.map((v) => (
                          <motion.span
                            key={`${v.bookName}-${v.chapter}-${v.verseNum}`}
                            layoutId={`verse-chip-${v.bookName}-${v.chapter}-${v.verseNum}`}
                            className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                          >
                            {v.bookName} {v.chapter}:{v.verseNum}
                          </motion.span>
                        ))}
                      </div>
                    )}
                    {/* Verse text preview */}
                    {msg.verses && msg.verses.length > 0 && (
                      <div className="max-w-[90%] rounded-xl rounded-tr-sm bg-muted/60 px-3 py-1.5">
                        <p className="text-[11px] italic leading-relaxed text-muted-foreground">
                          "{msg.verses.map(v => v.text).join(" … ")}"
                        </p>
                      </div>
                    )}
                    <div className="max-w-[90%] rounded-xl rounded-tr-sm bg-primary px-3 py-2">
                      <p className="text-xs text-primary-foreground">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-xs leading-relaxed text-foreground whitespace-pre-wrap",
                        msg.streaming && "after:inline-block after:ml-0.5 after:h-3 after:w-0.5 after:animate-pulse after:bg-primary after:content-['']"
                      )}>
                        {msg.content || (msg.streaming && <span className="text-muted-foreground">{t.thinking}</span>)}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              rows={1}
              disabled={loading}
              className="flex-1 resize-none bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50 max-h-24 overflow-y-auto"
              style={{ fieldSizing: "content" } as React.CSSProperties}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-muted-foreground/60">{t.powered}</p>
        </div>
      </div>
    </motion.aside>
  );
}
