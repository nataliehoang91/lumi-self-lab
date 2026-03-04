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
      <div className="flex h-screen flex-col md:flex-row">
        {/* Chat Sidebar - Hidden on mobile unless toggled */}
        <aside
          className={`${showChat ? "flex" : "hidden"} bg-sidebar/95 border-sidebar-border
            w-full flex-col border-r backdrop-blur-xl md:flex md:w-96`}
        >
          <div className="border-sidebar-border/50 border-b p-5">
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center gap-2">
                <Sparkles className="text-second h-5 w-5" />
                <h1 className="text-sidebar-foreground text-lg font-bold">Self-Lab</h1>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowChat(false)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sidebar-foreground/60 mt-1 text-xs">AI Assistant</p>
          </div>

          <div className="border-sidebar-border/50 border-b p-4">
            <p className="text-sidebar-foreground/50 mb-3 text-xs font-medium">
              TRY ASKING
            </p>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="bg-sidebar-accent/60 hover:bg-sidebar-accent
                    text-sidebar-accent-foreground w-full rounded-2xl p-3 text-left
                    text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          <form onSubmit={handleSubmit} className="border-sidebar-border/50 border-t p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your thoughts..."
                className="bg-sidebar-accent/50 border-sidebar-border/50
                  text-sidebar-foreground placeholder:text-sidebar-foreground/40 flex-1
                  rounded-2xl"
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
        </aside>

        {/* Main Content - Experiment Form */}
        <main
          className={`${showChat ? "hidden" : "flex"} flex-1 flex-col overflow-auto
            md:flex`}
        >
          <div className="container mx-auto max-w-2xl px-4 py-6 md:px-8 md:py-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-foreground text-2xl font-bold md:text-3xl">
                  New Experiment
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Design your reflection
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="rounded-2xl bg-transparent md:hidden"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-5">
              <Card
                className="bg-card/95 border-border/50 rounded-3xl p-5 shadow-sm
                  backdrop-blur-sm md:p-6"
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="mb-2 block text-sm font-medium">
                      Experiment Title
                    </Label>
                    <Input
                      id="title"
                      value={experimentTitle}
                      onChange={(e) => setExperimentTitle(e.target.value)}
                      placeholder="e.g., My Morning Energy Patterns"
                      className="border-border/50 rounded-2xl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="why" className="mb-2 block text-sm font-medium">
                      Why This Matters
                    </Label>
                    <Textarea
                      id="why"
                      value={whyMatters}
                      onChange={(e) => setWhyMatters(e.target.value)}
                      placeholder="What draws you to explore this?"
                      className="border-border/50 min-h-24 resize-none rounded-2xl"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="hypothesis"
                      className="mb-2 block text-sm font-medium"
                    >
                      Your Hypothesis
                    </Label>
                    <Textarea
                      id="hypothesis"
                      value={hypothesis}
                      onChange={(e) => setHypothesis(e.target.value)}
                      placeholder="What patterns might you discover?"
                      className="border-border/50 min-h-24 resize-none rounded-2xl"
                    />
                  </div>
                </div>
              </Card>

              <Card
                className="bg-card/95 border-border/50 rounded-3xl p-5 shadow-sm
                  backdrop-blur-sm md:p-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration" className="mb-2 block text-sm font-medium">
                      Duration (days)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="7"
                      className="border-border/50 rounded-2xl"
                      min="1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="frequency" className="mb-2 block text-sm font-medium">
                      Check-in
                    </Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger
                        id="frequency"
                        className="border-border/50 rounded-2xl"
                      >
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

              <Card
                className="from-second/10 to-accent/10 border-second/20 rounded-3xl
                  bg-gradient-to-br p-5 shadow-sm backdrop-blur-sm md:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="bg-second/20 flex h-10 w-10 items-center justify-center
                        rounded-2xl"
                    >
                      <BookOpen className="text-second h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-foreground text-base font-semibold">
                        Faith Lens
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        Optional spiritual reflection
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={faithLensEnabled}
                    onCheckedChange={setFaithLensEnabled}
                  />
                </div>

                {faithLensEnabled && (
                  <div className="border-second/10 space-y-4 border-t pt-3">
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Use Biblical wisdom as a guide if you wish. This is optional and
                      personal.
                    </p>
                    <div>
                      <Label
                        htmlFor="scriptures"
                        className="mb-2 block text-sm font-medium"
                      >
                        Scripture Reference
                      </Label>
                      <Textarea
                        id="scriptures"
                        value={scriptures}
                        onChange={(e) => setScriptures(e.target.value)}
                        placeholder="e.g., Proverbs 3:5-6"
                        className="border-border/50 bg-card/50 min-h-20 resize-none
                          rounded-2xl"
                      />
                    </div>
                  </div>
                )}
              </Card>

              <Button
                size="lg"
                onClick={handleStartExperiment}
                className="w-full rounded-2xl py-6 text-base shadow-lg transition-all
                  hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
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
