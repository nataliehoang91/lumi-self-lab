/**
 * Phase 2A.3 — AI Reflection (READ-ONLY inputs, ephemeral AI output)
 *
 * Input: summaries + trends (fetched from existing insights APIs).
 * Output: ephemeral reflection text. No storage, no schema changes.
 * Ownership: requireExperimentOwner(experimentId, userId).
 */

import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 30;

const reflectionResponseSchema = z.object({
  reflection: z.string(),
});

function getOrigin(request: Request): string {
  try {
    return new URL(request.url).origin;
  } catch {
    return process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3005";
  }
}

/**
 * POST /api/experiments/[id]/insights/reflection
 *
 * Fetches summary + trends for the experiment (same ownership as 2A.1/2A.2),
 * sends them to OpenAI, returns ephemeral reflection text. No persistence.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: experimentId } = await params;

    const experiment = await requireExperimentOwner(experimentId, userId);
    if (!experiment) {
      return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "AI reflection is not configured" },
        { status: 503 }
      );
    }

    const origin = getOrigin(request);
    const cookie = request.headers.get("cookie") ?? "";

    const [summaryRes, trendsRes] = await Promise.all([
      fetch(`${origin}/api/experiments/${experimentId}/insights/summary`, {
        headers: { cookie },
      }),
      fetch(`${origin}/api/experiments/${experimentId}/insights/trends`, {
        headers: { cookie },
      }),
    ]);

    if (!summaryRes.ok) {
      if (summaryRes.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (summaryRes.status === 404) {
        return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Failed to load insights summary" },
        { status: 502 }
      );
    }

    if (!trendsRes.ok) {
      if (trendsRes.status === 401) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (trendsRes.status === 404) {
        return NextResponse.json({ error: "Experiment not found" }, { status: 404 });
      }
      return NextResponse.json(
        { error: "Failed to load insights trends" },
        { status: 502 }
      );
    }

    const summary = await summaryRes.json();
    const trends = await trendsRes.json();

    const systemPrompt = `You are a gentle, non-judgmental reflection assistant for Self-Lab, a personal experiment and check-in app. Your role is to write a short, empathetic reflection based on the user's experiment insights (summary and trends). Guidelines:
- Be warm and supportive; never prescriptive or diagnostic.
- Highlight 1–3 patterns or observations from the data.
- Keep the reflection concise (2–4 short paragraphs).
- Do not invent numbers or facts; only refer to the provided summary and trends.
- Use a calm, introspective tone.`;

    const userPrompt = `Experiment: "${experiment.title}"

Summary (per-field aggregates):
${JSON.stringify(summary, null, 2)}

Trends (per-field over time):
${JSON.stringify(trends, null, 2)}

Write a short reflection for the user based on these insights.`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: false,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI reflection error:", openaiRes.status, errText);
      return NextResponse.json(
        { error: "Failed to generate reflection" },
        { status: 502 }
      );
    }

    const data = await openaiRes.json();
    const content =
      data.choices?.[0]?.message?.content?.trim() ??
      "";

    const parsed = reflectionResponseSchema.safeParse({ reflection: content });
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid reflection response" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed.data);
  } catch (error) {
    console.error("Error generating reflection:", error);
    return NextResponse.json(
      { error: "Failed to generate reflection" },
      { status: 500 }
    );
  }
}
