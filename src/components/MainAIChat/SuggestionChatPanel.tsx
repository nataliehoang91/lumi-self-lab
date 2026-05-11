"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExperimentDraft, DraftField } from "@/app/(individual)/experiments/create/page";

type Message = { id: string; role: "user" | "assistant"; content: string };

const SUGGESTIONS: Array<{
  icon: string;
  label: string;
  description: string;
  draft: ExperimentDraft;
}> = [
  {
    icon: "⚡",
    label: "Track my energy levels",
    description: "Observe daily energy patterns",
    draft: {
      title: "Daily Energy Tracker",
      whyMatters: "Understanding when I have the most energy helps me schedule deep work and rest more intentionally.",
      hypothesis: "I believe my energy peaks in the morning and dips after lunch, and that sleep quality directly affects my peak hours.",
      duration: "14",
      frequency: "daily",
      fields: [
        { id: "f1", label: "Morning energy (1–10)", type: "number", required: true, minValue: 1, maxValue: 10 },
        { id: "f2", label: "Afternoon energy (1–10)", type: "number", required: true, minValue: 1, maxValue: 10 },
        { id: "f3", label: "Overall mood today", type: "emoji", required: false, emojiCount: 5 },
        { id: "f4", label: "What drained your energy?", type: "text", required: false, textType: "short" },
      ],
    },
  },
  {
    icon: "🧠",
    label: "Journal emotional triggers",
    description: "Spot patterns in your reactions",
    draft: {
      title: "Emotional Trigger Journal",
      whyMatters: "Becoming aware of what triggers strong reactions allows me to respond rather than react.",
      hypothesis: "I think certain situations (like conflict or uncertainty) consistently trigger anxiety, and I can learn to catch them earlier.",
      duration: "21",
      frequency: "daily",
      fields: [
        { id: "f1", label: "Did you feel triggered today?", type: "yesno", required: true },
        { id: "f2", label: "Emotional intensity (1–10)", type: "number", required: true, minValue: 1, maxValue: 10 },
        { id: "f3", label: "What happened?", type: "text", required: false, textType: "short" },
        { id: "f4", label: "How did you respond?", type: "text", required: false, textType: "long" },
      ],
    },
  },
  {
    icon: "🌙",
    label: "Monitor my sleep quality",
    description: "Link sleep to mood and focus",
    draft: {
      title: "Sleep Quality Monitor",
      whyMatters: "Better sleep directly impacts my focus, mood, and productivity the next day.",
      hypothesis: "Going to bed before midnight and avoiding screens 1 hour before bed will improve my sleep quality score.",
      duration: "14",
      frequency: "daily",
      fields: [
        { id: "f1", label: "Sleep quality", type: "emoji", required: true, emojiCount: 5 },
        { id: "f2", label: "Hours slept", type: "number", required: true, minValue: 0, maxValue: 12 },
        { id: "f3", label: "Screens off before bed?", type: "yesno", required: false },
        { id: "f4", label: "How did you feel waking up?", type: "text", required: false, textType: "short" },
      ],
    },
  },
  {
    icon: "🎯",
    label: "Build a focus habit",
    description: "Track deep work sessions",
    draft: {
      title: "Deep Focus Habit Builder",
      whyMatters: "Consistent deep work practice is the key difference between feeling busy and making real progress.",
      hypothesis: "Doing one 90-minute focus block each morning before checking email will double my meaningful output.",
      duration: "30",
      frequency: "daily",
      fields: [
        { id: "f1", label: "Focus session completed?", type: "yesno", required: true },
        { id: "f2", label: "Session length (minutes)", type: "number", required: true, minValue: 0, maxValue: 240 },
        { id: "f3", label: "Distraction level (1–10)", type: "number", required: false, minValue: 1, maxValue: 10 },
        { id: "f4", label: "What did you accomplish?", type: "text", required: false, textType: "short" },
      ],
    },
  },
];

export function SuggestionChatPanel({
  onSelectSuggestion,
}: {
  onSelectSuggestion: (draft: ExperimentDraft) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Pick a starting point below, or describe your own experiment idea and I'll help you shape it.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onSelectSuggestion(SUGGESTIONS[index].draft);

    // Add a chat message confirming the selection
    const s = SUGGESTIONS[index];
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: s.label,
      },
      {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: `Great choice! I've filled in the form on the right with a starting template for "${s.draft.title}". Feel free to customise any field — it's your experiment.`,
      },
    ]);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error();

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      const assistantId = `a-${Date.now()}`;
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value).split("\n")) {
          if (line.startsWith("0:")) {
            try {
              const chunk = JSON.parse(line.slice(2));
              if (chunk) {
                assistant += chunk;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, content: assistant } : m))
                );
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: `err-${Date.now()}`, role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-sidebar/95 border-sidebar-border flex h-full flex-col border-r backdrop-blur-xl">
      {/* Header */}
      <div className="border-sidebar-border/50 border-b p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="text-primary h-5 w-5" />
          <h1 className="text-sidebar-foreground text-lg font-bold">Self-Lab AI</h1>
        </div>
        <p className="text-sidebar-foreground/60 mt-0.5 text-xs">Your experiment design companion</p>
      </div>

      {/* Suggestion Cards */}
      <div className="border-sidebar-border/50 border-b p-4">
        <p className="text-sidebar-foreground/50 mb-3 text-[10px] font-semibold uppercase tracking-widest">
          Quick Start
        </p>
        <div className="space-y-2">
          {SUGGESTIONS.map((s, i) => {
            const isSelected = selectedIndex === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                className={cn(
                  "group relative w-full overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300",
                  isSelected
                    ? "border-primary/40 bg-primary/8 scale-[0.98]"
                    : "border-sidebar-border/40 bg-sidebar-accent/40 hover:border-primary/30 hover:bg-sidebar-accent hover:scale-[1.01]"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sidebar-foreground text-xs font-semibold leading-tight">{s.label}</p>
                    <p className="text-sidebar-foreground/50 mt-0.5 text-[10px]">{s.description}</p>
                  </div>
                  {isSelected ? (
                    <div className="bg-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                      <Check className="text-primary-foreground h-3 w-3" />
                    </div>
                  ) : (
                    <div className="border-sidebar-border/40 text-sidebar-foreground/30 group-hover:text-primary group-hover:border-primary/30 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-colors">
                      →
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[85%] rounded-3xl px-4 py-3 shadow-sm",
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground"
              )}
            >
              {m.role === "assistant" && (
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="text-primary h-3 w-3" />
                  <span className="text-primary text-[10px] font-semibold">AI</span>
                </div>
              )}
              <p className="text-sm leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card flex gap-1 rounded-3xl px-4 py-3 shadow-sm">
              {[0, 150, 300].map((d) => (
                <div
                  key={d}
                  className="bg-primary h-1.5 w-1.5 animate-bounce rounded-full"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="bg-sidebar/95 border-sidebar-border/50 border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <div className="flex w-full gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your own idea..."
              className="bg-sidebar-accent/50 border-sidebar-border/50 text-sidebar-foreground placeholder:text-sidebar-foreground/40 min-w-0 flex-1 rounded-2xl border px-3 py-2 text-sm outline-none focus:border-primary/40"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-opacity disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
