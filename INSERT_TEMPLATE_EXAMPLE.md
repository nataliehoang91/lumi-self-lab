# How to Insert Template Experiments

## Example: Morning Energy Tracking Template

```typescript
// Example using Prisma Client (you can run this in a seed script or API)

const morningEnergyTemplate = await prisma.experiment.create({
  data: {
    clerkUserId: "YOUR_CLERK_USER_ID", // Replace with actual user ID
    title: "Morning Energy Tracking",
    whyMatters: "I want to understand when I'm most productive in the morning to optimize my schedule",
    hypothesis: "I'm most productive in the first 2 hours after waking up",
    durationDays: 14,
    frequency: "daily",
    faithEnabled: false,
    scriptureNotes: null,
    status: "draft", // or "active" if you want it ready to use
    // Fields for tracking
    fields: {
      create: [
        // Field 1: Energy Level (Emoji Scale)
        {
          label: "Energy Level",
          type: "emoji",
          required: true,
          order: 0,
          emojiCount: 5, // 5-level emoji scale
          textType: null,
          minValue: null,
          maxValue: null,
          selectOptions: [],
        },
        // Field 2: Sleep Quality (Number Scale)
        {
          label: "Hours of Sleep",
          type: "number",
          required: true,
          order: 1,
          minValue: 4,
          maxValue: 10,
          textType: null,
          emojiCount: null,
          selectOptions: [],
        },
        // Field 3: Morning Routine (Select Dropdown)
        {
          label: "Morning Routine",
          type: "select",
          required: false,
          order: 2,
          selectOptions: [
            "Meditation",
            "Exercise",
            "Coffee only",
            "Full breakfast",
            "No routine",
          ],
          textType: null,
          minValue: null,
          maxValue: null,
          emojiCount: null,
        },
        // Field 4: Daily Reflection (Long Text)
        {
          label: "How did I feel this morning?",
          type: "text",
          required: false,
          order: 3,
          textType: "long", // long text area
          minValue: null,
          maxValue: null,
          emojiCount: null,
          selectOptions: [],
        },
      ],
    },
  },
});
```

## Field Type Reference

### 1. Text Field
```typescript
{
  label: "Daily Reflection",
  type: "text",
  required: false,
  order: 0,
  textType: "short", // or "long" for textarea
  minValue: null,
  maxValue: null,
  emojiCount: null,
  selectOptions: [],
}
```

### 2. Number Scale
```typescript
{
  label: "Focus Level",
  type: "number",
  required: true,
  order: 0,
  minValue: 1,
  maxValue: 10,
  textType: null,
  emojiCount: null,
  selectOptions: [],
}
```

### 3. Emoji Scale
```typescript
{
  label: "Mood",
  type: "emoji",
  required: true,
  order: 0,
  emojiCount: 5, // Must be 3, 5, or 7
  textType: null,
  minValue: null,
  maxValue: null,
  selectOptions: [],
}
```

### 4. Select Dropdown
```typescript
{
  label: "Activity Type",
  type: "select",
  required: false,
  order: 0,
  selectOptions: ["Option 1", "Option 2", "Option 3"],
  textType: null,
  minValue: null,
  maxValue: null,
  emojiCount: null,
}
```

### 5. Yes/No
```typescript
{
  label: "Did you complete your goal?",
  type: "yesno",
  required: true,
  order: 0,
  textType: null,
  minValue: null,
  maxValue: null,
  emojiCount: null,
  selectOptions: [],
}
```

## Multiple Templates Example

```typescript
const templates = [
  {
    title: "Morning Energy Tracking",
    whyMatters: "...",
    hypothesis: "...",
    durationDays: 14,
    frequency: "daily",
    status: "draft",
    fields: [
      { label: "Energy Level", type: "emoji", order: 0, emojiCount: 5, required: true },
      { label: "Hours of Sleep", type: "number", order: 1, minValue: 4, maxValue: 10, required: true },
    ],
  },
  {
    title: "Gratitude Practice",
    whyMatters: "...",
    hypothesis: "...",
    durationDays: 30,
    frequency: "daily",
    status: "draft",
    fields: [
      { label: "Three things I'm grateful for", type: "text", order: 0, textType: "long", required: true },
      { label: "Mood today", type: "emoji", order: 1, emojiCount: 5, required: true },
    ],
  },
];

// Insert all templates
for (const template of templates) {
  await prisma.experiment.create({
    data: {
      clerkUserId: "YOUR_USER_ID",
      ...template,
      fields: {
        create: template.fields.map((field) => ({
          ...field,
          textType: field.textType || null,
          minValue: field.minValue || null,
          maxValue: field.maxValue || null,
          emojiCount: field.emojiCount || null,
          selectOptions: field.selectOptions || [],
          required: field.required || false,
        })),
      },
    },
  });
}
```
