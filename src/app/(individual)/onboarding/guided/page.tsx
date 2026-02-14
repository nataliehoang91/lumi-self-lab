"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IndividualContainer } from "@/components/GeneralComponents/individual-container";
import { Sparkles, ArrowRight, ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const guidedQuestions = [
  {
    id: 1,
    question: "What's something about yourself you've been curious about lately?",
    placeholder: "e.g., Why do I feel more creative at night? What triggers my stress?",
    hint: "There's no wrong answer. Just share what's on your mind.",
  },
  {
    id: 2,
    question: "Is there a pattern in your life you'd like to understand better?",
    placeholder: "e.g., My energy levels throughout the day, my mood after meetings...",
    hint: "Patterns help us see what's usually invisible.",
  },
  {
    id: 3,
    question: "What do you hope to learn or change through this experiment?",
    placeholder: "e.g., I want to find out if morning exercise improves my focus...",
    hint: "Your hypothesis doesn't need to be perfect.",
  },
  {
    id: 4,
    question: "How often would you like to check in with yourself?",
    placeholder: "e.g., Daily, a few times a week, only on workdays...",
    hint: "Consistency matters more than frequency.",
  },
  {
    id: 5,
    question: "How long do you want to run this experiment?",
    placeholder: "e.g., One week to start, two weeks, a full month...",
    hint: "We recommend at least 7 days to see meaningful patterns.",
  },
];

export default function GuidedOnboardingPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [isGenerating, setIsGenerating] = useState(false);

  const progress = ((currentQuestion + 1) / guidedQuestions.length) * 100;
  const question = guidedQuestions[currentQuestion];
  const canContinue = answers[currentQuestion].trim().length > 0;

  const handleNext = () => {
    if (currentQuestion < guidedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI processing
    setTimeout(() => {
      router.push("/onboarding/preview");
    }, 2000);
  };

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  if (isGenerating) {
    return (
      <IndividualContainer className="flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-violet/20 mb-6 animate-pulse">
            <Sparkles className="w-10 h-10 text-primary animate-float" />
          </div>
          <h2 className="text-2xl font-medium text-foreground mb-2">Creating your experiment...</h2>
          <p className="text-muted-foreground">Our AI is designing something just for you</p>
        </div>
      </IndividualContainer>
    );
  }

  return (
    <IndividualContainer>
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <span>
              Question {currentQuestion + 1} of {guidedQuestions.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-violet rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className="bg-card rounded-3xl p-8 md:p-10 shadow-xl shadow-black/5 border border-border/50">
          {/* AI badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet/10 text-violet text-sm mb-6">
            <MessageCircle className="w-4 h-4" />
            <span>AI Guide</span>
          </div>

          {/* Question */}
          <h2 className="text-2xl md:text-3xl font-medium text-foreground mb-4 text-balance">
            {question.question}
          </h2>

          <p className="text-muted-foreground mb-8">{question.hint}</p>

          {/* Answer input */}
          <Textarea
            value={answers[currentQuestion]}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={question.placeholder}
            className="min-h-[140px] text-lg rounded-2xl border-2 border-border/50 focus:border-primary/50 bg-muted/30 resize-none"
          />

          {/* Answered questions dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {guidedQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${
                    index === currentQuestion
                      ? "bg-primary w-8"
                      : answers[index].trim()
                        ? "bg-violet"
                        : "bg-muted-foreground/30"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="gap-2 rounded-2xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canContinue}
            className="gap-2 rounded-2xl bg-primary hover:bg-violet text-primary-foreground px-6"
          >
            {currentQuestion === guidedQuestions.length - 1 ? (
              <>
                Generate Experiment
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </IndividualContainer>
  );
}
