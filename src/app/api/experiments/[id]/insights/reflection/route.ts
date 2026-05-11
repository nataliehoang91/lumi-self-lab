import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId, requireExperimentOwner } from "@/lib/permissions";
import { NextResponse } from "next/server";

export const maxDuration = 60;

const MAX_REFLECTIONS = 3;

/** GET — return all stored reflections + count (no Claude call) */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: experimentId } = await params;
    const owned = await requireExperimentOwner(experimentId, userId);
    if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const row = await prisma.experiment.findUnique({
      where: { id: experimentId },
      select: { aiReflections: true, aiReflectionCount: true },
    });

    const reflections = row?.aiReflections ?? [];
    // Always derive count from array length (source of truth)
    return NextResponse.json({
      reflections,
      count: reflections.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reflection" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pearsonCorrelation(xs: number[], ys: number[]): number | null {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return null;
  const ax = xs.slice(0, n);
  const ay = ys.slice(0, n);
  const meanX = ax.reduce((a, b) => a + b, 0) / n;
  const meanY = ay.reduce((a, b) => a + b, 0) / n;
  let num = 0, denomX = 0, denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = ax[i] - meanX;
    const dy = ay[i] - meanY;
    num += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denom = Math.sqrt(denomX * denomY);
  return denom === 0 ? null : num / denom;
}

function maxStreak(values: boolean[]): number {
  let best = 0, cur = 0;
  for (const v of values) {
    cur = v ? cur + 1 : 0;
    if (cur > best) best = cur;
  }
  return best;
}

function trendDirection(nums: number[]): "increasing" | "decreasing" | "stable" {
  if (nums.length < 2) return "stable";
  const half = Math.max(1, Math.floor(nums.length / 2));
  const firstAvg = nums.slice(0, half).reduce((a, b) => a + b, 0) / half;
  const lastAvg = nums.slice(-half).reduce((a, b) => a + b, 0) / half;
  const range = Math.max(...nums) - Math.min(...nums) || 1;
  const rel = (lastAvg - firstAvg) / range;
  if (rel > 0.08) return "increasing";
  if (rel < -0.08) return "decreasing";
  return "stable";
}

/** POST — generate a clinical-grade AI reflection via Prisma (no internal HTTP calls) */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: experimentId } = await params;
    const owned = await requireExperimentOwner(experimentId, userId);
    if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const row = await prisma.experiment.findUnique({
      where: { id: experimentId },
      select: {
        title: true,
        hypothesis: true,
        whyMatters: true,
        durationDays: true,
        aiReflections: true,
        aiReflectionCount: true,
        startedAt: true,
        completedAt: true,
        fields: { orderBy: { order: "asc" } },
        checkIns: {
          orderBy: { checkInDate: "asc" },
          include: { responses: { include: { field: true } } },
        },
      },
    });

    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Use array length as the authoritative count (handles schema migration)
    const currentCount = row.aiReflections.length;
    if (currentCount >= MAX_REFLECTIONS) {
      return NextResponse.json({ error: "limit_reached", count: currentCount }, { status: 429 });
    }

    // ---------------------------------------------------------------------------
    // Build rich per-field data
    // ---------------------------------------------------------------------------

    // Map: fieldId → ordered numeric values (one per check-in, null if missing)
    const fieldNumericSeries = new Map<string, (number | null)[]>();
    const fieldBoolSeries = new Map<string, (boolean | null)[]>();
    const fieldTextSeries = new Map<string, (string | null)[]>();

    for (const field of row.fields) {
      if (field.type === "number" || field.type === "emoji") {
        fieldNumericSeries.set(field.id, row.checkIns.map((c) => {
          const r = c.responses.find((r) => r.fieldId === field.id);
          return r?.responseNumber ?? null;
        }));
      }
      if (field.type === "yesno") {
        fieldBoolSeries.set(field.id, row.checkIns.map((c) => {
          const r = c.responses.find((r) => r.fieldId === field.id);
          return r?.responseBool ?? null;
        }));
      }
      if (field.type === "text") {
        fieldTextSeries.set(field.id, row.checkIns.map((c) => {
          const r = c.responses.find((r) => r.fieldId === field.id);
          return r?.responseText ?? null;
        }));
      }
    }

    // ---------------------------------------------------------------------------
    // Per-field stats blocks
    // ---------------------------------------------------------------------------

    const fieldBlocks: string[] = [];

    for (const field of row.fields) {
      const lines: string[] = [`### ${field.label} (${field.type})`];

      if (field.type === "number" || field.type === "emoji") {
        const series = (fieldNumericSeries.get(field.id) ?? []).filter((n): n is number => n !== null);
        if (series.length === 0) { lines.push("  No data recorded."); fieldBlocks.push(lines.join("\n")); continue; }

        const avg = series.reduce((a, b) => a + b, 0) / series.length;
        const min = Math.min(...series);
        const max = Math.max(...series);
        const stdDev = Math.sqrt(series.map(x => (x - avg) ** 2).reduce((a, b) => a + b, 0) / series.length);
        const trend = trendDirection(series);

        // Best/worst days
        const maxIdx = series.indexOf(max);
        const minIdx = series.indexOf(min);
        const dates = row.checkIns.map(c => c.checkInDate.toISOString().split("T")[0]);

        lines.push(`  Responses: ${series.length} of ${row.checkIns.length} check-ins`);
        lines.push(`  Average: ${avg.toFixed(2)}, Min: ${min}, Max: ${max}, Std dev: ${stdDev.toFixed(2)}`);
        lines.push(`  Trend: ${trend}`);
        if (dates[maxIdx]) lines.push(`  Best day: ${dates[maxIdx]} (value: ${max})`);
        if (dates[minIdx]) lines.push(`  Worst day: ${dates[minIdx]} (value: ${min})`);

        // Early vs late performance
        if (series.length >= 4) {
          const half = Math.floor(series.length / 2);
          const earlyAvg = series.slice(0, half).reduce((a, b) => a + b, 0) / half;
          const lateAvg = series.slice(-half).reduce((a, b) => a + b, 0) / half;
          lines.push(`  Early avg (first half): ${earlyAvg.toFixed(2)} → Late avg (second half): ${lateAvg.toFixed(2)}`);
        }

        // Consistency: what % of days were above the overall average
        const aboveAvg = series.filter(v => v >= avg).length;
        lines.push(`  Days at or above average: ${aboveAvg}/${series.length} (${Math.round(aboveAvg / series.length * 100)}%)`);
      }

      if (field.type === "yesno") {
        const series = (fieldBoolSeries.get(field.id) ?? []).filter((v): v is boolean => v !== null);
        if (series.length === 0) { lines.push("  No data recorded."); fieldBlocks.push(lines.join("\n")); continue; }

        const yesCount = series.filter(Boolean).length;
        const yesRate = Math.round(yesCount / series.length * 100);
        const streak = maxStreak(series);
        const trend = trendDirection(series.map(v => v ? 1 : 0));

        lines.push(`  Yes: ${yesCount}/${series.length} (${yesRate}%)`);
        lines.push(`  Longest yes-streak: ${streak} consecutive days`);
        lines.push(`  Trend: ${trend === "increasing" ? "yes rate improving" : trend === "decreasing" ? "yes rate declining" : "stable"}`);
      }

      if (field.type === "select") {
        const counts: Record<string, number> = {};
        for (const c of row.checkIns) {
          const r = c.responses.find((r) => r.fieldId === field.id);
          if (r?.selectedOption) counts[r.selectedOption] = (counts[r.selectedOption] ?? 0) + 1;
        }
        const sorted = Object.entries(counts).sort(([, a], [, b]) => b - a);
        lines.push(`  Distribution: ${sorted.map(([k, v]) => `"${k}" × ${v}`).join(", ")}`);
      }

      if (field.type === "text") {
        const texts = (fieldTextSeries.get(field.id) ?? []).filter((t): t is string => t !== null && t.trim() !== "");
        lines.push(`  ${texts.length} text responses recorded.`);
        // Include last 3 entries as qualitative context for Claude
        if (texts.length > 0) {
          lines.push(`  Recent entries (last ${Math.min(3, texts.length)}):`);
          texts.slice(-3).forEach((t, i) => lines.push(`    ${i + 1}. "${t.slice(0, 120)}${t.length > 120 ? "…" : ""}"`));
        }
      }

      fieldBlocks.push(lines.join("\n"));
    }

    // ---------------------------------------------------------------------------
    // Cross-field correlations (numeric fields only)
    // ---------------------------------------------------------------------------

    const numericFields = row.fields.filter(f => f.type === "number" || f.type === "emoji");
    const correlationLines: string[] = [];

    for (let i = 0; i < numericFields.length; i++) {
      for (let j = i + 1; j < numericFields.length; j++) {
        const fa = numericFields[i];
        const fb = numericFields[j];
        const sa = (fieldNumericSeries.get(fa.id) ?? []).filter((n): n is number => n !== null);
        const sb = (fieldNumericSeries.get(fb.id) ?? []).filter((n): n is number => n !== null);
        const r = pearsonCorrelation(sa, sb);
        if (r !== null && Math.abs(r) >= 0.4) {
          const strength = Math.abs(r) >= 0.7 ? "strong" : "moderate";
          const dir = r > 0 ? "positive" : "negative";
          correlationLines.push(
            `  "${fa.label}" ↔ "${fb.label}": ${strength} ${dir} correlation (r=${r.toFixed(2)})`
          );
        }
      }
    }

    // ---------------------------------------------------------------------------
    // Experiment metadata
    // ---------------------------------------------------------------------------

    const totalDays = row.durationDays;
    const checkInCount = row.checkIns.length;
    const completionRate = Math.round((checkInCount / totalDays) * 100);
    const daysCovered = row.checkIns.length > 0
      ? Math.floor((row.checkIns[checkInCount - 1].checkInDate.getTime() - row.checkIns[0].checkInDate.getTime()) / 86400000) + 1
      : 0;

    // ---------------------------------------------------------------------------
    // Build prompt
    // ---------------------------------------------------------------------------

    const systemPrompt = `You are a senior behavioral health coach and data analyst at a personal science platform. You analyse self-experiment records the way a clinical psychologist reviews a patient's progress notes — systematically, empathetically, and evidence-based.

Your analysis framework:
1. BEHAVIORAL OBSERVATIONS — what the data objectively shows (patterns, consistency, compliance)
2. HYPOTHESIS EVALUATION — directly assess whether the stated hypothesis is supported, partially supported, or refuted by the data
3. KEY PATTERNS & CORRELATIONS — notable relationships between variables, best/worst periods, what conditions predicted success
4. INSIGHTS — 2-3 non-obvious, specific insights grounded in the actual numbers
5. RECOMMENDATIONS — 2-3 concrete, actionable next steps based on what the data revealed

Tone: warm but evidence-based, like a trusted coach who respects the user's intelligence. Be specific — reference actual numbers and dates. Don't be generic. Don't use bullet lists for every section — write in natural paragraphs where appropriate.`;

    const userPrompt = `EXPERIMENT RECORD
=================
Title: ${row.title}
${row.whyMatters ? `Why it matters: ${row.whyMatters}` : ""}
${row.hypothesis ? `Stated hypothesis: "${row.hypothesis}"` : "No hypothesis stated."}
Planned duration: ${totalDays} days
Actual check-ins: ${checkInCount} (${completionRate}% completion rate, ${daysCovered} days covered)
${row.startedAt ? `Started: ${row.startedAt.toISOString().split("T")[0]}` : ""}
${row.completedAt ? `Ended: ${row.completedAt.toISOString().split("T")[0]}` : "Ended early."}

FIELD-BY-FIELD DATA
===================
${fieldBlocks.join("\n\n")}

${correlationLines.length > 0 ? `CROSS-FIELD CORRELATIONS\n========================\n${correlationLines.join("\n")}` : ""}

Please produce a structured analysis with the 5 sections described. Be specific to this person's data.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const block = message.content[0];
    const content = block.type === "text" ? block.text.trim() : "";

    const newCount = currentCount + 1;
    const updatedReflections = [...(row.aiReflections ?? []), content];
    await prisma.experiment.update({
      where: { id: experimentId },
      data: { aiReflections: updatedReflections, aiReflectionCount: newCount },
    });

    return NextResponse.json({ reflections: updatedReflections, count: newCount });
  } catch (error) {
    console.error("Error generating reflection:", error);
    return NextResponse.json({ error: "Failed to generate reflection" }, { status: 500 });
  }
}
