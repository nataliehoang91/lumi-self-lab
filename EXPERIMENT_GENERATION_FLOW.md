# 🎯 Guided Experiment Generation Flow Design

## Problem Statement

Users don't know how to create experiments. They need AI guidance through a structured question flow to generate personalized experiments that auto-populate the form.

---

## 🎨 Flow Design Options

### **Option 1: "Need Help?" Button Flow** (Recommended)

```
Dashboard → "Don't know how to start?" Button → Guided Questions Modal → AI Generates → Auto-fill Form
```

**Flow:**
1. User lands on dashboard with empty form
2. Prominent button: **"Need Help? Let AI Find You"** or **"Not sure where to start?"**
3. Click opens a modal/sidebar with guided questions
4. User answers 5-7 structured questions
5. AI generates experiment based on answers
6. Auto-populates the experiment form
7. User can edit before starting

**Advantages:**
- ✅ Non-intrusive (optional)
- ✅ Clear entry point
- ✅ Separates AI guidance from general chat
- ✅ Structured questions = better AI output

---

### **Option 2: Progressive Discovery**

```
Dashboard → Start Typing in Chat → AI Detects Experiment Intent → Suggest Guided Flow → Questions → Generate
```

**Flow:**
1. User types in AI chat: "I want to track my emotions"
2. AI recognizes experiment creation intent
3. AI suggests: "I can help you create an experiment! Answer a few questions..."
4. Guide through structured questions
5. Generate and auto-fill form

**Advantages:**
- ✅ Natural conversation flow
- ✅ Flexible - can start from chat
- ❌ Harder to detect intent accurately
- ❌ Mixes general chat with experiment creation

---

### **Option 3: Separate "Create with AI" Mode**

```
Dashboard → Toggle "AI-Guided Mode" → Questions Step-by-Step → Generate → Auto-fill
```

**Flow:**
1. Dashboard has toggle: **"Create with AI"** vs **"Create Manually"**
2. When AI mode enabled, shows step-by-step questions
3. Each question appears one at a time
4. Progress bar shows completion
5. After all questions, AI generates
6. Auto-populates form with "Edit before starting" option

**Advantages:**
- ✅ Clear mode separation
- ✅ Progressive disclosure (less overwhelming)
- ✅ User can switch to manual at any time

---

## 🎯 Recommended: Option 1 with Enhancement

### **Enhanced Flow:**

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                                   │
│                                                              │
│  ┌─────────────────┐  ┌──────────────────────────────────┐ │
│  │  AI Chat Panel  │  │  Experiment Form                 │ │
│  │                 │  │  ┌────────────────────────────┐  │ │
│  │  [General chat] │  │  │ ⚠️ Form is empty          │  │ │
│  │                 │  │  │                            │  │ │
│  │  "What would    │  │  │ [🎯 Need Help? Let AI     │  │ │
│  │   you like to   │  │  │   Generate Your Experiment]│  │ │
│  │   explore?"     │  │  │                            │  │ │
│  │                 │  │  │ OR                         │  │ │
│  │                 │  │  │ [Create Manually]          │  │ │
│  └─────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    User clicks "Need Help?"
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Guided Questions Modal/Stepper                             │
│                                                              │
│  Progress: ●○○○○ (1/5)                                      │
│                                                              │
│  Question 1: What area of your life do you want to explore? │
│  ○ Relationships                                             │
│  ○ Work/Career                                               │
│  ○ Personal Growth                                           │
│  ○ Emotions/Feelings                                         │
│  ○ Health/Wellness                                           │
│  ○ Other: [text input]                                       │
│                                                              │
│  [Back]  [Next →]                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    User answers all 5-7 questions
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  AI Generating...                                            │
│                                                              │
│  "Creating your personalized experiment based on your        │
│   answers... This will take a few seconds."                 │
│                                                              │
│  [Loading spinner]                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  Auto-Populated Form                                         │
│                                                              │
│  ✅ Experiment Title: "My Morning Energy Patterns"          │
│  ✅ Why This Matters: "I want to understand..."             │
│  ✅ Hypothesis: "I believe I'm most productive..."          │
│  ✅ Duration: 14 days                                       │
│  ✅ Frequency: Daily                                        │
│  ✅ Fields: [Energy Level (emoji), Mood (text), ...]        │
│                                                              │
│  [✏️ Edit Details]  [✅ Use This]  [🔄 Generate Another]   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Suggested Questions (5-7 Questions)

### **Question Set A: Foundation**

1. **What area of your life do you want to explore?**
   - Relationships
   - Work/Career
   - Personal Growth
   - Emotions/Feelings
   - Health/Wellness
   - Other (text)

2. **What specific situation or pattern are you curious about?**
   - Open text input
   - Examples: "When I feel stressed", "My morning routine", "How I communicate with my partner"

3. **What do you hope to learn or change?**
   - Open text input
   - Examples: "Better understand my triggers", "Improve my sleep", "Feel more confident"

4. **How long would you like to track this?**
   - 7 days (1 week)
   - 14 days (2 weeks)
   - 21 days (3 weeks)
   - 30 days (1 month)
   - Custom (number input)

5. **How often can you check in?**
   - Daily
   - Every 2 days
   - Weekly

### **Question Set B: Deeper Understanding (Optional - 2 more questions)**

6. **What do you think might be influencing this?** (Optional)
   - Multiple choice or tags
   - Sleep, Stress, Diet, Exercise, Relationships, Work, Environment, Other

7. **Would you like to include spiritual reflection?** (Optional)
   - Yes / No
   - If yes, ask about scriptures or spiritual practices

---

## 🔧 Technical Implementation

### **1. New Components Needed**

```
src/components/
├── ExperimentGeneration/
│   ├── GuidedQuestionsModal.tsx      # Modal with step-by-step questions
│   ├── QuestionStepper.tsx           # Progress indicator + navigation
│   ├── QuestionSet.tsx               # Individual question components
│   └── ExperimentPreview.tsx         # Show generated experiment before filling
```

### **2. API Endpoint**

```
POST /api/experiments/generate
Body: {
  answers: {
    areaOfLife: string,
    specificSituation: string,
    hopeToLearn: string,
    duration: number,
    frequency: string,
    influences?: string[],
    faithEnabled?: boolean
  }
}
Response: {
  experiment: {
    title: string,
    whyMatters: string,
    hypothesis: string,
    durationDays: number,
    frequency: string,
    fields: CustomField[],
    faithEnabled?: boolean,
    scriptureNotes?: string
  }
}
```

### **3. Integration Points**

**ExperimentFormPanel.tsx:**
- Add "Need Help?" button at top when form is empty
- Add state to track if using AI-generated content
- Add function to populate form from AI response

**AI Chat:**
- Keep as general conversation (not focused on experiment building)
- Can suggest "Try the guided questions if you want to create an experiment"

---

## 🎨 UI/UX Considerations

### **Button Placement**

**Option A: Above Form (When Empty)**
```
┌──────────────────────────────────────┐
│  New Experiment                      │
│  Design your reflection              │
│                                      │
│  ┌────────────────────────────────┐ │
│  │ 🎯 Need Help?                  │ │
│  │ Let AI generate your experiment│ │
│  │ [Get Started →]                │ │
│  └────────────────────────────────┘ │
│                                      │
│  [Browse Templates]                  │
│                                      │
│  Experiment Basics:                  │
│  [Form fields...]                    │
└──────────────────────────────────────┘
```

**Option B: Side Button (Always Visible)**
```
┌─────────────────┐ ┌──────────────────────┐
│  AI Chat        │ │ New Experiment       │
│                 │ │ [Create Manually]    │
│                 │ │                      │
│                 │ │ ┌──────────────────┐ │
│                 │ │ │ 🎯 AI-Guided?    │ │ ← Small button
│                 │ │ └──────────────────┘ │
│                 │ │                      │
│                 │ │ Form...              │
└─────────────────┘ └──────────────────────┘
```

**Option C: Banner/Warning (When Empty)**
```
┌──────────────────────────────────────┐
│  ⚠️ Not sure how to start?           │
│  Answer 5 questions and AI will      │
│  generate your experiment for you.   │
│  [Let AI Help You →]                 │
└──────────────────────────────────────┘
```

### **Question Flow UI**

**Stepper Component:**
```
Progress: ●●●○○ (3/5)

┌──────────────────────────────────────┐
│  Question 3 of 5                     │
│                                      │
│  What do you hope to learn or        │
│  change through this experiment?     │
│                                      │
│  [Text area...]                      │
│                                      │
│  [← Back]              [Next →]      │
└──────────────────────────────────────┘
```

---

## 🤖 AI Prompt Engineering

### **System Prompt for Generation**

```typescript
const generateExperimentPrompt = `
You are an expert at designing self-reflection experiments. Based on the user's answers, generate a complete experiment that includes:

1. **Title**: Clear, specific title (e.g., "My Morning Energy Patterns")
2. **Why This Matters**: 2-3 sentences explaining the user's motivation
3. **Hypothesis**: The user's theory about what they might discover
4. **Duration**: Use the duration specified by user
5. **Frequency**: Use the frequency specified by user
6. **Fields**: Suggest 3-5 relevant tracking fields:
   - For emotions: emoji scales (3, 5, or 7 levels)
   - For patterns: text (short or long)
   - For behaviors: yes/no or number scales
   - For tracking: select dropdowns with relevant options

Guidelines:
- Make fields specific and actionable
- Include diverse field types (not all the same)
- Order fields logically (general → specific)
- Ensure fields will reveal insights about the user's question

User's answers:
${JSON.stringify(answers)}

Generate a JSON response matching the CreateExperimentRequest schema.
`;
```

---

## 🚀 Implementation Phases

### **Phase 1: Basic Flow**
- [ ] Add "Need Help?" button to empty form
- [ ] Create guided questions modal
- [ ] Create question components
- [ ] Create API endpoint `/api/experiments/generate`
- [ ] Auto-populate form from AI response

### **Phase 2: Enhancement**
- [ ] Add progress indicator
- [ ] Save generated experiments as templates
- [ ] Allow editing before starting
- [ ] "Generate Another" option

### **Phase 3: Advanced**
- [ ] Adaptive questions (show different questions based on answers)
- [ ] Preview before generating
- [ ] Save question answers for future experiments
- [ ] Analytics on which questions lead to better experiments

---

## 💡 Alternative: Template + AI Customization

### **Hybrid Approach:**

1. User clicks "Need Help?"
2. Show **5-10 pre-made templates** (AI-generated, high-quality)
3. User selects a template that feels relevant
4. AI asks **2-3 customization questions** based on template
5. AI customizes the template
6. Auto-populates form

**Advantages:**
- ✅ Faster (fewer questions)
- ✅ Better quality (pre-vetted templates)
- ✅ Still personalized (AI customizes)
- ✅ User can see examples before committing

---

## 📊 Decision Matrix

| Feature | Option 1 (Guided Q's) | Option 2 (Chat Intent) | Option 3 (AI Mode) | Template + AI |
|---------|----------------------|----------------------|-------------------|---------------|
| Ease of use | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Quality of output | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Implementation | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Flexibility | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation: Start with Option 1 (Guided Questions), can evolve to Template + AI**

---

## 🎯 Next Steps

1. **Choose flow** (I recommend Option 1)
2. **Finalize questions** (5-7 questions)
3. **Design UI mockup** (button placement, modal design)
4. **Build API endpoint** for generation
5. **Implement components** (modal, stepper, questions)
6. **Test with users** and iterate

---

What do you think? Should we proceed with Option 1 (Guided Questions), or would you prefer the Template + AI hybrid approach?
