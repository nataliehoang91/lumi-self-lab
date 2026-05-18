import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";

const FREE_LIMIT = 30;
const PRO_LIMIT = 300;

export interface VerseRef {
  bookName: string;
  chapter: number;
  verseNum: number;
  text: string;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { verses, question, lang } = (await req.json()) as {
    verses: VerseRef[];
    question: string;
    lang: "en" | "vi";
  };

  if (!verses?.length || !question?.trim()) {
    return new Response("Missing verses or question", { status: 400 });
  }

  // Check monthly limit
  const { getUserFeatureAccess } = await import("@/lib/feature-access");
  const features = await getUserFeatureAccess(userId);
  const isPro = features.bible_study_unlimited === true;
  const limit = isPro ? PRO_LIMIT : FREE_LIMIT;

  let user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) user = await prisma.user.create({ data: { clerkUserId: userId } });

  const now = new Date();
  const resetAt = user.aiMsgResetAt;
  const needsReset = !resetAt || resetAt.getFullYear() < now.getFullYear() || resetAt.getMonth() < now.getMonth();
  const currentCount = needsReset ? 0 : user.aiMsgCount;

  if (currentCount >= limit) {
    return new Response(
      JSON.stringify({ error: "limit_reached", used: currentCount, limit }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // Increment count before streaming
  await prisma.user.update({
    where: { clerkUserId: userId },
    data: {
      aiMsgCount: needsReset ? 1 : { increment: 1 },
      aiMsgResetAt: needsReset ? now : undefined,
    },
  });

  const isVi = lang === "vi";
  const verseBlock = verses
    .map((v) => `${v.bookName} ${v.chapter}:${v.verseNum} — "${v.text}"`)
    .join("\n");

  const systemPrompt = isVi
    ? `Bạn là một trợ lý Kinh Thánh uyên bác và tâm linh. Hãy trả lời câu hỏi về các câu Kinh Thánh được cung cấp một cách rõ ràng, sâu sắc và dễ hiểu. Không quá dài.`
    : `You are a knowledgeable and spiritually-grounded Bible assistant. Answer questions about the provided Bible verses clearly, insightfully, and concisely. Keep responses focused.`;

  const userPrompt = isVi
    ? `Các câu Kinh Thánh:\n${verseBlock}\n\nCâu hỏi: ${question}`
    : `Bible verses:\n${verseBlock}\n\nQuestion: ${question}`;

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
