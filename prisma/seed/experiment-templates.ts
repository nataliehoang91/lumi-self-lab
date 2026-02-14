/**
 * Phase T.1 + T.2 — System experiment templates (idempotent seed).
 * Run via: npx prisma db seed
 * Exactly 20 system-owned templates. Upsert by key; delete and recreate fields per template.
 * Export: seedExperimentTemplates(prisma) — caller provides PrismaClient.
 */

import type { PrismaClient } from "@prisma/client";

type FieldSeed = {
  label: string;
  type: "text" | "number" | "select" | "emoji" | "yesno";
  required?: boolean;
  textType?: "short" | "long";
  minValue?: number;
  maxValue?: number;
  emojiCount?: number;
  selectOptions?: string[];
};

type TemplateSeed = {
  key: string;
  title: string;
  description: string;
  durationDays: number;
  frequency: string;
  categories: string[];
  tags: string[];
  featured: boolean;
  difficulty: string | null;
  rating: number | null;
  usageCount: number | null;
  fields: FieldSeed[];
};

const TEMPLATES: TemplateSeed[] = [
  {
    key: "daily_energy",
    title: "Daily Energy Tracking",
    description: "Track your daily energy levels to understand patterns and optimise your routine.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Wellness & Health"],
    tags: ["Energy", "Morning Routine"],
    featured: true,
    difficulty: "Easy",
    rating: 4.8,
    usageCount: 2400,
    fields: [
      { label: "Overall energy level", type: "emoji", required: true, emojiCount: 5 },
      { label: "Energy score", type: "number", required: true, minValue: 1, maxValue: 10 },
      { label: "Notes", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "deep_work",
    title: "Deep Work Sessions",
    description: "Measure focus and productivity during deep work sessions.",
    durationDays: 21,
    frequency: "daily",
    categories: ["Focus & Productivity"],
    tags: ["Focus", "Productivity"],
    featured: true,
    difficulty: "Medium",
    rating: 4.9,
    usageCount: 1800,
    fields: [
      { label: "Focus quality", type: "number", required: true, minValue: 1, maxValue: 10 },
      {
        label: "Distractions today",
        type: "select",
        required: true,
        selectOptions: ["Social media", "Notifications", "People", "None"],
      },
      { label: "Reflection", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "gratitude",
    title: "Gratitude Practice",
    description: "Build a daily gratitude habit to improve wellbeing.",
    durationDays: 28,
    frequency: "daily",
    categories: ["Wellness & Health"],
    tags: ["Gratitude", "Mindfulness"],
    featured: true,
    difficulty: "Easy",
    rating: 4.7,
    usageCount: 3200,
    fields: [
      { label: "Gratitude mood", type: "emoji", required: true, emojiCount: 5 },
      { label: "Something I'm grateful for", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "mood_awareness",
    title: "Mood & Mental Health Awareness",
    description: "Track mood and emotional patterns to support mental wellbeing.",
    durationDays: 30,
    frequency: "daily",
    categories: ["Wellness & Health"],
    tags: ["Mood", "Mindfulness"],
    featured: true,
    difficulty: "Easy",
    rating: 4.7,
    usageCount: 3200,
    fields: [
      { label: "Overall mood", type: "emoji", required: true, emojiCount: 5 },
      { label: "Did you feel anxious today?", type: "yesno", required: true },
      { label: "What stood out emotionally?", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "habit_consistency",
    title: "Habit Consistency Tracker",
    description: "Build and track a habit with daily check-ins.",
    durationDays: 21,
    frequency: "daily",
    categories: ["Learning & Growth"],
    tags: ["Habits", "Consistency"],
    featured: true,
    difficulty: "Easy",
    rating: 4.6,
    usageCount: 1800,
    fields: [
      { label: "Did you complete the habit today?", type: "yesno", required: true },
      { label: "Effort level", type: "number", required: true, minValue: 1, maxValue: 10 },
      { label: "What helped or blocked you?", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "sleep_quality",
    title: "Sleep Quality Experiment",
    description: "Track sleep quality, hours and morning feeling over two weeks.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Wellness & Health"],
    tags: ["Sleep", "Wellness"],
    featured: false,
    difficulty: "Easy",
    rating: 4.5,
    usageCount: 1500,
    fields: [
      { label: "Sleep quality", type: "number", required: true, minValue: 1, maxValue: 10 },
      { label: "Hours slept", type: "number", required: true, minValue: 0, maxValue: 12 },
      { label: "Morning feeling", type: "emoji", required: true, emojiCount: 5 },
      { label: "Notes", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "focus_sprint",
    title: "Productivity Focus Sprint",
    description: "One-week sprint to track focus quality and distractions.",
    durationDays: 7,
    frequency: "daily",
    categories: ["Focus & Productivity"],
    tags: ["Focus", "Productivity"],
    featured: false,
    difficulty: "Medium",
    rating: 4.6,
    usageCount: 1200,
    fields: [
      { label: "Focus quality", type: "number", required: true, minValue: 1, maxValue: 10 },
      {
        label: "Main distraction",
        type: "select",
        required: true,
        selectOptions: ["Social media", "Notifications", "Meetings", "Fatigue", "None"],
      },
      { label: "What worked today?", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "hydration",
    title: "Hydration Tracker",
    description: "Monitor daily water intake and how it affects energy and focus.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Wellness & Health"],
    tags: ["Hydration", "Health"],
    featured: false,
    difficulty: "Easy",
    rating: 4.4,
    usageCount: 1100,
    fields: [
      { label: "Glasses of water", type: "number", required: true, minValue: 0, maxValue: 20 },
      { label: "How did hydration feel?", type: "emoji", required: true, emojiCount: 5 },
      { label: "Notes", type: "text", required: false, textType: "short" },
    ],
  },
  {
    key: "screen_time",
    title: "Screen Time Awareness",
    description: "Track screen time and its impact on mood and productivity.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Focus & Productivity"],
    tags: ["Screen time", "Digital wellbeing"],
    featured: false,
    difficulty: "Easy",
    rating: 4.3,
    usageCount: 900,
    fields: [
      {
        label: "Estimated screen hours",
        type: "number",
        required: true,
        minValue: 0,
        maxValue: 16,
      },
      { label: "How did it feel?", type: "emoji", required: true, emojiCount: 5 },
      {
        label: "Main use",
        type: "select",
        required: false,
        selectOptions: ["Work", "Social", "Entertainment", "Learning", "Mixed"],
      },
    ],
  },
  {
    key: "meditation",
    title: "Daily Meditation",
    description: "Build a meditation habit and notice effects on calm and clarity.",
    durationDays: 21,
    frequency: "daily",
    categories: ["Wellness & Health"],
    tags: ["Meditation", "Mindfulness"],
    featured: false,
    difficulty: "Easy",
    rating: 4.7,
    usageCount: 2100,
    fields: [
      { label: "Did you meditate today?", type: "yesno", required: true },
      { label: "Minutes", type: "number", required: false, minValue: 1, maxValue: 60 },
      { label: "Calm level after", type: "emoji", required: true, emojiCount: 5 },
      { label: "Reflection", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "exercise_consistency",
    title: "Exercise Consistency",
    description: "Track workout frequency and how it affects energy and mood.",
    durationDays: 21,
    frequency: "daily",
    categories: ["Wellness & Health"],
    tags: ["Exercise", "Fitness"],
    featured: false,
    difficulty: "Medium",
    rating: 4.6,
    usageCount: 1600,
    fields: [
      { label: "Did you exercise today?", type: "yesno", required: true },
      { label: "Intensity", type: "number", required: false, minValue: 1, maxValue: 10 },
      { label: "Post-workout energy", type: "emoji", required: true, emojiCount: 5 },
      { label: "Notes", type: "text", required: false, textType: "short" },
    ],
  },
  {
    key: "reading_habit",
    title: "Reading Habit Builder",
    description: "Build a consistent reading practice and track progress.",
    durationDays: 21,
    frequency: "daily",
    categories: ["Learning & Growth"],
    tags: ["Reading", "Habits"],
    featured: false,
    difficulty: "Easy",
    rating: 4.5,
    usageCount: 1400,
    fields: [
      { label: "Did you read today?", type: "yesno", required: true },
      { label: "Pages or minutes", type: "number", required: false, minValue: 0, maxValue: 500 },
      { label: "Enjoyment", type: "emoji", required: true, emojiCount: 5 },
      { label: "Reflection", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "learning_streak",
    title: "Learning Streak",
    description: "Track daily learning and retention.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Learning & Growth"],
    tags: ["Learning", "Skills"],
    featured: false,
    difficulty: "Medium",
    rating: 4.4,
    usageCount: 800,
    fields: [
      { label: "What did you learn?", type: "text", required: true, textType: "short" },
      { label: "Confidence level", type: "number", required: true, minValue: 1, maxValue: 10 },
      {
        label: "Topic",
        type: "select",
        required: false,
        selectOptions: ["Work", "Language", "Tech", "Other"],
      },
    ],
  },
  {
    key: "decision_journal",
    title: "Decision-Making Patterns",
    description: "Understand how you make choices under different conditions.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Learning & Growth"],
    tags: ["Self-Discovery", "Growth"],
    featured: false,
    difficulty: "Medium",
    rating: 4.5,
    usageCount: 1200,
    fields: [
      { label: "One notable decision today", type: "text", required: true, textType: "short" },
      { label: "Confidence in decision", type: "emoji", required: true, emojiCount: 5 },
      { label: "Outcome (if known)", type: "text", required: false, textType: "short" },
    ],
  },
  {
    key: "social_energy",
    title: "Social Energy Check",
    description: "Explore energy levels in different social situations.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Social & Relationships"],
    tags: ["Social", "Energy"],
    featured: false,
    difficulty: "Easy",
    rating: 4.4,
    usageCount: 950,
    fields: [
      { label: "Social energy level", type: "emoji", required: true, emojiCount: 5 },
      {
        label: "Main social context",
        type: "select",
        required: false,
        selectOptions: ["Alone", "1–2 people", "Small group", "Large group", "Online"],
      },
      { label: "Notes", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "creativity_blocks",
    title: "Creativity & Flow",
    description: "Track when you feel creative and what supports or blocks it.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Creativity"],
    tags: ["Creativity", "Flow"],
    featured: false,
    difficulty: "Medium",
    rating: 4.5,
    usageCount: 700,
    fields: [
      {
        label: "Creativity level today",
        type: "number",
        required: true,
        minValue: 1,
        maxValue: 10,
      },
      { label: "In flow?", type: "yesno", required: false },
      { label: "What helped or blocked?", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "stress_levels",
    title: "Stress Level Tracking",
    description: "Monitor stress and identify triggers and coping strategies.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Wellness & Health"],
    tags: ["Stress", "Wellbeing"],
    featured: false,
    difficulty: "Easy",
    rating: 4.6,
    usageCount: 1300,
    fields: [
      { label: "Stress level", type: "number", required: true, minValue: 1, maxValue: 10 },
      { label: "Overall feeling", type: "emoji", required: true, emojiCount: 5 },
      {
        label: "Main stressor",
        type: "select",
        required: false,
        selectOptions: ["Work", "Health", "Relationships", "Money", "Other", "None"],
      },
      { label: "What helped?", type: "text", required: false, textType: "short" },
    ],
  },
  {
    key: "nutrition_tracking",
    title: "Nutrition Awareness",
    description: "Track eating patterns and how they affect energy and mood.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Wellness & Health"],
    tags: ["Nutrition", "Health"],
    featured: false,
    difficulty: "Medium",
    rating: 4.3,
    usageCount: 1000,
    fields: [
      { label: "How did eating feel today?", type: "emoji", required: true, emojiCount: 5 },
      { label: "Meals logged", type: "number", required: false, minValue: 0, maxValue: 10 },
      { label: "Notes", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "morning_routine",
    title: "Morning Routine Experiment",
    description: "Test a morning routine and its impact on your day.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Focus & Productivity"],
    tags: ["Routine", "Morning"],
    featured: false,
    difficulty: "Easy",
    rating: 4.6,
    usageCount: 1700,
    fields: [
      { label: "Completed routine?", type: "yesno", required: true },
      { label: "Morning energy", type: "emoji", required: true, emojiCount: 5 },
      { label: "What made a difference?", type: "text", required: false, textType: "long" },
    ],
  },
  {
    key: "evening_reflection",
    title: "Evening Reflection",
    description: "End each day with a short reflection to improve self-awareness.",
    durationDays: 14,
    frequency: "daily",
    categories: ["Wellness & Health"],
    tags: ["Reflection", "Mindfulness"],
    featured: false,
    difficulty: "Easy",
    rating: 4.7,
    usageCount: 1900,
    fields: [
      { label: "Day rating", type: "number", required: true, minValue: 1, maxValue: 10 },
      { label: "One win today", type: "text", required: true, textType: "short" },
      { label: "One thing to improve", type: "text", required: false, textType: "short" },
    ],
  },
];

export async function seedExperimentTemplates(prisma: PrismaClient): Promise<void> {
  for (const t of TEMPLATES) {
    const template = await prisma.experimentTemplate.upsert({
      where: { key: t.key },
      create: {
        key: t.key,
        title: t.title,
        description: t.description,
        durationDays: t.durationDays,
        frequency: t.frequency,
        categories: t.categories,
        tags: t.tags,
        featured: t.featured,
        difficulty: t.difficulty ?? undefined,
        rating: t.rating ?? undefined,
        usageCount: t.usageCount ?? undefined,
      },
      update: {
        title: t.title,
        description: t.description,
        durationDays: t.durationDays,
        frequency: t.frequency,
        categories: t.categories,
        tags: t.tags,
        featured: t.featured,
        difficulty: t.difficulty ?? undefined,
        rating: t.rating ?? undefined,
        usageCount: t.usageCount ?? undefined,
      },
    });

    await prisma.experimentTemplateField.deleteMany({
      where: { templateId: template.id },
    });

    for (let i = 0; i < t.fields.length; i++) {
      const f = t.fields[i];
      await prisma.experimentTemplateField.create({
        data: {
          templateId: template.id,
          label: f.label,
          type: f.type,
          required: f.required ?? false,
          order: i,
          textType: f.textType ?? undefined,
          minValue: f.minValue ?? undefined,
          maxValue: f.maxValue ?? undefined,
          emojiCount: f.emojiCount ?? undefined,
          selectOptions: f.selectOptions ?? [],
        },
      });
    }
  }
}
