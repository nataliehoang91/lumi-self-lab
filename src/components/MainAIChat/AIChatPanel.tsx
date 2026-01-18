"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send } from "lucide-react";
import Link from "next/link";

const SUGGESTED_PROMPTS = [
  "I want to explore my emotional triggers",
  "I'm curious about my decision-making",
  "Help me understand my energy patterns",
];

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function AiChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm here to support your self-reflection journey. What part of yourself would you like to explore today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      const assistantId = Date.now().toString() + "-assistant";
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: "assistant",
          content: "",
        },
      ]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:")) {
            const jsonStr = line.slice(2);
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed) {
                assistantMessage += parsed;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: assistantMessage }
                      : m
                  )
                );
              }
            } catch (e) {
              // Ignore parsing errors for partial JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border relative">
      {/* Header */}
      <div className="p-5 border-b border-sidebar-border/50">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h1 className="text-lg font-bold text-sidebar-foreground">
              Self-Lab
            </h1>
          </Link>
        </div>
        <p className="text-xs text-sidebar-foreground/60 mt-1">AI Assistant</p>
      </div>

      {/* Suggested Prompts */}
      <div className="p-4 border-b border-sidebar-border/50">
        <p className="text-xs font-medium text-sidebar-foreground/50 mb-3">
          TRY ASKING
        </p>
        <div className="space-y-2">
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedPrompt(prompt)}
              className="w-full text-left text-xs p-3 rounded-2xl bg-sidebar-accent/60 hover:bg-sidebar-accent text-sidebar-accent-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-4 shadow-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs font-medium text-secondary">
                      AI
                    </span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-3xl p-4 bg-card text-card-foreground shadow-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="sticky bottom-0 bg-sidebar/95 backdrop-blur-xl border-t border-sidebar-border/50 p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 w-full">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your thoughts..."
              className="flex-1 min-w-0 bg-sidebar-accent/50 border-sidebar-border/50 rounded-2xl text-sidebar-foreground placeholder:text-sidebar-foreground/40"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="rounded-2xl w-11 h-11"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
