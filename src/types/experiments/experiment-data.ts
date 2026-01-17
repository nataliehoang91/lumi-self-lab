// Mock data for experiments
const MOCK_EXPERIMENTS = [
  {
    id: "1",
    title: "My Morning Energy Patterns",
    status: "active" as const,
    duration: 14,
    frequency: "daily" as const,
    daysCompleted: 7,
    startDate: "2026-01-03",
    hypothesis: "I'm most productive in the first 2 hours after waking up",
    whyMatters:
      "I've noticed inconsistency in my morning productivity and want to understand what truly affects my energy levels. This matters because mornings set the tone for my entire day.",
    faithLensEnabled: true,
    scriptures:
      "Proverbs 16:3 - Commit to the Lord whatever you do, and he will establish your plans",
    spiritualReflection:
      "I want to see how dedicating my mornings to purposeful work aligns with trusting God with my day. Can I find peace in productivity?",
    checkIns: [
      {
        date: "2026-01-10",
        day: 7,
        notes:
          "Woke up at 6:30am. Felt energized after coffee. Completed 3 deep work tasks before 9am. Energy dipped around 10am.",
      },
      {
        date: "2026-01-09",
        day: 6,
        notes:
          "Rough morning. Woke at 7am. Only managed 1 focused task. Distracted by emails early on.",
      },
      {
        date: "2026-01-08",
        day: 5,
        notes:
          "Best morning yet! Woke at 6am, meditated for 10min, then dove into work. Peak productivity until 10:30am.",
      },
    ],
  },
  {
    id: "2",
    title: "Understanding My Social Confidence",
    status: "active" as const,
    duration: 21,
    frequency: "daily" as const,
    daysCompleted: 3,
    startDate: "2026-01-08",
    hypothesis:
      "I feel more confident in one-on-one conversations than group settings",
    whyMatters:
      "I want to understand what makes me feel confident in social situations so I can build stronger connections.",
    faithLensEnabled: false,
    scriptures: "",
    spiritualReflection: "",
    checkIns: [
      {
        date: "2026-01-10",
        day: 3,
        notes: "Had a great one-on-one coffee chat. Felt relaxed and engaged.",
      },
      {
        date: "2026-01-09",
        day: 2,
        notes:
          "Team meeting today - noticed I was quieter in the group setting.",
      },
      {
        date: "2026-01-08",
        day: 1,
        notes:
          "Starting this experiment to track my social confidence patterns.",
      },
    ],
  },
  {
    id: "3",
    title: "Am I Trustworthy?",
    status: "draft" as const,
    duration: 10,
    frequency: "daily" as const,
    daysCompleted: 0,
    startDate: "",
    hypothesis:
      "I keep my commitments most of the time, but struggle with spontaneous promises",
    whyMatters:
      "I want to build trust with others and understand my patterns around commitment.",
    faithLensEnabled: false,
    scriptures: "",
    spiritualReflection: "",
    checkIns: [],
  },
  {
    id: "4",
    title: "My Decision-Making Under Pressure",
    status: "completed" as const,
    duration: 14,
    frequency: "daily" as const,
    daysCompleted: 14,
    startDate: "2025-12-20",
    hypothesis:
      "I make better decisions when I take time to reflect rather than rushing",
    whyMatters:
      "Understanding my decision-making process will help me make choices I feel good about long-term.",
    faithLensEnabled: true,
    scriptures: "James 1:5 - If any of you lacks wisdom, you should ask God",
    spiritualReflection:
      "I want to seek God's wisdom in my decision-making process.",
    checkIns: [
      {
        date: "2026-01-03",
        day: 14,
        notes:
          "Final day - confirmed that slowing down leads to better choices for me.",
      },
    ],
  },
];

export type Experiment = (typeof MOCK_EXPERIMENTS)[0];

export async function getExperimentById(
  id: string
): Promise<Experiment | null> {
  // Simulate async database call
  await new Promise((resolve) => setTimeout(resolve, 100));

  const experiment = MOCK_EXPERIMENTS.find((exp) => exp.id === id);
  return experiment || null;
}

export async function getAllExperiments(): Promise<Experiment[]> {
  // Simulate async database call
  await new Promise((resolve) => setTimeout(resolve, 100));

  return MOCK_EXPERIMENTS;
}
