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
                    m.id === assistantId ? { ...m, content: assistantMessage } : m
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
    <div
      className="bg-sidebar/95 border-sidebar-border relative flex h-full flex-col
        border-r backdrop-blur-xl"
    >
      {/* Header */}
      <div className="border-sidebar-border/50 border-b p-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2">
            <Sparkles className="text-second h-5 w-5" />
            <h1 className="text-sidebar-foreground text-lg font-bold">Self-Lab</h1>
          </Link>
        </div>
        <p className="text-sidebar-foreground/60 mt-1 text-xs">AI Assistant</p>
      </div>

      {/* Suggested Prompts */}
      <div className="border-sidebar-border/50 border-b p-4">
        <p className="text-sidebar-foreground/50 mb-3 text-xs font-medium">TRY ASKING</p>
        <div className="space-y-2">
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedPrompt(prompt)}
              className="bg-sidebar-accent/60 hover:bg-sidebar-accent
                text-sidebar-accent-foreground w-full rounded-2xl p-3 text-left text-xs
                transition-all hover:scale-[1.02] active:scale-[0.98]"
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
              className={`flex
              ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-4 shadow-sm ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="mb-1.5 flex items-center gap-2">
                    <Sparkles className="text-second h-3.5 w-3.5" />
                    <span className="text-second text-xs font-medium">AI</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div
                className="bg-card text-card-foreground max-w-[85%] rounded-3xl p-4
                  shadow-sm"
              >
                <div className="flex items-center gap-1.5">
                  <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                  <div
                    className="bg-primary h-2 w-2 animate-pulse rounded-full
                      [animation-delay:0.2s]"
                  />
                  <div
                    className="bg-primary h-2 w-2 animate-pulse rounded-full
                      [animation-delay:0.4s]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div
        className="bg-sidebar/95 border-sidebar-border/50 sticky bottom-0 border-t p-4
          backdrop-blur-xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="flex w-full gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your thoughts..."
              className="bg-sidebar-accent/50 border-sidebar-border/50
                text-sidebar-foreground placeholder:text-sidebar-foreground/40 min-w-0
                flex-1 rounded-2xl"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="h-11 w-11 rounded-2xl"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
