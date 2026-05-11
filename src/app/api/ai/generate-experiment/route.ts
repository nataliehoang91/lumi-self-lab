import { anthropic } from "@/lib/anthropic";
import { getAuthenticatedUserId } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answers } = body as { answers: string[] };

    if (!Array.isArray(answers) || answers.length < 5) {
      return NextResponse.json({ error: "5 answers are required" }, { status: 400 });
    }

    const prompt = `You are a personal experiment designer. Based on the user's answers to guided questions, generate a self-experiment configuration.

User answers:
1. What are they curious about: ${answers[0]}
2. Pattern they want to understand: ${answers[1]}
3. What they hope to learn or change: ${answers[2]}
4. How often they want to check in: ${answers[3]}
5. How long they want to run the experiment: ${answers[4]}

Return ONLY valid JSON (no markdown, no code blocks) matching this exact schema:
{
  "title": "string (concise, specific experiment title)",
  "hypothesis": "string (1-2 sentences about what they expect to discover)",
  "whyMatters": "string (1-2 sentences about personal significance)",
  "durationDays": number (7, 14, 21, or 30 based on answer 5),
  "frequency": "daily" | "every-2-days" | "weekly",
  "fields": [
    {
      "label": "string",
      "type": "emoji" | "number" | "select" | "yesno" | "text",
      "required": true,
      "emojiCount": 5,
      "minValue": 1,
      "maxValue": 10,
      "selectOptions": ["option1", "option2"],
      "textType": "short" | "long"
    }
  ]
}

Generate 3-5 fields appropriate to the experiment. Only include field properties relevant to the type (e.g., emojiCount only for emoji type, selectOptions only for select type, minValue/maxValue only for number type, textType only for text type). Return ONLY the JSON object.`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== "text") {
      return NextResponse.json({ error: "Unexpected AI response" }, { status: 500 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(block.text.trim());
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 400 });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error generating experiment:", error);
    return NextResponse.json({ error: "Failed to generate experiment" }, { status: 500 });
  }
}
