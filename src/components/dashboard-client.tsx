"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Send, BookOpen, ChevronLeft, MessageCircle } from "lucide-react";
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

export function DashboardClient() {
  const [experimentTitle, setExperimentTitle] = useState("");
  const [whyMatters, setWhyMatters] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [duration, setDuration] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [faithLensEnabled, setFaithLensEnabled] = useState(false);
  const [scriptures, setScriptures] = useState("");
  const [showChat, setShowChat] = useState(false);

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
                  prev.map((m) => (m.id === assistantId ? { ...m, content: assistantMessage } : m))
                );
              }
            } catch (e) {
              // Ignore parsing errors for partial JSON
            }
          }
        }
      }
    } catch (error) {
      console.error("[v0] Chat error:", error);
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

  const handleStartExperiment = () => {
    // TODO: Implement start experiment functionality
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      const event = new Event("submit", { bubbles: true, cancelable: true });
      document.querySelector("form")?.dispatchEvent(event);
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col md:flex-row h-screen">
        {/* Chat Sidebar - Hidden on mobile unless toggled */}
        <aside
          className={`${
            showChat ? "flex" : "hidden"
          } md:flex w-full md:w-96 bg-sidebar/95 backdrop-blur-xl border-r border-sidebar-border flex-col`}
        >
          <div className="p-5 border-b border-sidebar-border/50">
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-second" />
                <h1 className="text-lg font-bold text-sidebar-foreground">Self-Lab</h1>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowChat(false)}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-sidebar-foreground/60 mt-1">AI Assistant</p>
          </div>

          <div className="p-4 border-b border-sidebar-border/50">
            <p className="text-xs font-medium text-sidebar-foreground/50 mb-3">TRY ASKING</p>
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
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
                        <Sparkles className="w-3.5 h-3.5 text-second" />
                        <span className="text-xs font-medium text-second">AI</span>
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
          <form onSubmit={handleSubmit} className="p-4 border-t border-sidebar-border/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your thoughts..."
                className="flex-1 bg-sidebar-accent/50 border-sidebar-border/50 rounded-2xl text-sidebar-foreground placeholder:text-sidebar-foreground/40"
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
        </aside>

        {/* Main Content - Experiment Form */}
        <main className={`${showChat ? "hidden" : "flex"} md:flex flex-1 flex-col overflow-auto`}>
          <div className="container mx-auto px-4 md:px-8 py-6 md:py-8 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">New Experiment</h2>
                <p className="text-sm text-muted-foreground mt-1">Design your reflection</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden rounded-2xl bg-transparent"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-5">
              <Card className="p-5 md:p-6 bg-card/95 backdrop-blur-sm border-border/50 rounded-3xl shadow-sm">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                      Experiment Title
                    </Label>
                    <Input
                      id="title"
                      value={experimentTitle}
                      onChange={(e) => setExperimentTitle(e.target.value)}
                      placeholder="e.g., My Morning Energy Patterns"
                      className="rounded-2xl border-border/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="why" className="text-sm font-medium mb-2 block">
                      Why This Matters
                    </Label>
                    <Textarea
                      id="why"
                      value={whyMatters}
                      onChange={(e) => setWhyMatters(e.target.value)}
                      placeholder="What draws you to explore this?"
                      className="rounded-2xl min-h-24 resize-none border-border/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hypothesis" className="text-sm font-medium mb-2 block">
                      Your Hypothesis
                    </Label>
                    <Textarea
                      id="hypothesis"
                      value={hypothesis}
                      onChange={(e) => setHypothesis(e.target.value)}
                      placeholder="What patterns might you discover?"
                      className="rounded-2xl min-h-24 resize-none border-border/50"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-5 md:p-6 bg-card/95 backdrop-blur-sm border-border/50 rounded-3xl shadow-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration" className="text-sm font-medium mb-2 block">
                      Duration (days)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="7"
                      className="rounded-2xl border-border/50"
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="frequency" className="text-sm font-medium mb-2 block">
                      Check-in
                    </Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger id="frequency" className="rounded-2xl border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="every-2-days">Every 2 Days</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="p-5 md:p-6 bg-gradient-to-br from-second/10 to-accent/10 backdrop-blur-sm border-second/20 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-second/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-second" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">Faith Lens</h3>
                      <p className="text-xs text-muted-foreground">Optional spiritual reflection</p>
                    </div>
                  </div>
                  <Switch checked={faithLensEnabled} onCheckedChange={setFaithLensEnabled} />
                </div>

                {faithLensEnabled && (
                  <div className="space-y-4 pt-3 border-t border-second/10">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Use Biblical wisdom as a guide if you wish. This is optional and personal.
                    </p>
                    <div>
                      <Label htmlFor="scriptures" className="text-sm font-medium mb-2 block">
                        Scripture Reference
                      </Label>
                      <Textarea
                        id="scriptures"
                        value={scriptures}
                        onChange={(e) => setScriptures(e.target.value)}
                        placeholder="e.g., Proverbs 3:5-6"
                        className="rounded-2xl min-h-20 resize-none border-border/50 bg-card/50"
                      />
                    </div>
                  </div>
                )}
              </Card>

              <Button
                size="lg"
                onClick={handleStartExperiment}
                className="w-full text-base py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Experiment
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
