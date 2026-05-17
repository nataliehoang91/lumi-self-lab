import { NextRequest } from "next/server";
import { anthropic } from "@/lib/anthropic";

export interface VerseRef {
  bookName: string;
  chapter: number;
  verseNum: number;
  text: string;
}

export async function POST(req: NextRequest) {
  const { verses, question, lang } = (await req.json()) as {
    verses: VerseRef[];
    question: string;
    lang: "en" | "vi";
  };

  if (!verses?.length || !question?.trim()) {
    return new Response("Missing verses or question", { status: 400 });
  }

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
