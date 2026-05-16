/**
 * Seeds BibleBookOverview for all books missing VI data using Claude.
 * Run: npx tsx prisma/seed/seed-book-overviews-ai-vi.ts
 *
 * - ONLY inserts for books with no existing VI overview (safe to re-run)
 * - Uses upsert so existing data is never clobbered
 * - Production-safe: reads DATABASE_URL from .env
 */

import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface GeneratedOverview {
  author: string | null;
  authorOccupation: string | null;
  date: string;
  audience: string;
  themes: string[];
  bookSummary: string;
  outline: { chapter: string; title: string }[];
  keyVerses: { ref: string; text: string; chapter: number; verse: number }[];
}

async function generateOverviewVi(
  bookNameEn: string,
  bookNameVi: string,
  chapterCount: number
): Promise<GeneratedOverview> {
  const prompt = `Bạn là một học giả Kinh Thánh. Hãy tạo dữ liệu tổng quan chính xác và súc tích cho sách Kinh Thánh "${bookNameVi}" (tiếng Anh: ${bookNameEn}, ${chapterCount} chương) bằng tiếng Việt.

Sử dụng tên riêng theo phong cách Kinh Thánh tiếng Việt (VD: Môi-se, Đa-vít, Ê-sai, Gia-cốp, v.v.).
Câu Kinh Thánh dùng bản dịch tiếng Việt (VD: Kinh Thánh 2011 hoặc Bản dịch Truyền thống).

Chỉ trả về JSON hợp lệ theo đúng schema sau — không có markdown, không giải thích:
{
  "author": string hoặc null (tác giả con người; null nếu không rõ),
  "authorOccupation": string hoặc null (VD: "Nhà tiên tri", "Vua", "Sứ đồ"),
  "date": string (VD: "khoảng 1010–970 TCN" hoặc "khoảng 60 CN"),
  "audience": string (đối tượng nguyên bản, VD: "Dân tộc Y-sơ-ra-ên"),
  "themes": string[] (4–6 chủ đề chính, ngắn gọn, VD: "Giao ước", "Cứu chuộc"),
  "bookSummary": string (2–3 câu tóm tắt nội dung và ý nghĩa thần học của sách),
  "outline": [{ "chapter": string (VD: "1–3" hoặc "1"), "title": string (một câu mô tả phân đoạn đó) }] (6–8 phần bao phủ toàn bộ sách),
  "keyVerses": [{ "ref": string (VD: "1:1"), "text": string (bản dịch tiếng Việt chính xác), "chapter": number, "verse": number }] (3–4 câu nổi tiếng nhất)
}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (message.content[0] as { type: string; text: string }).text.trim();
  const json = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(json) as GeneratedOverview;
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const allBooks = await prisma.bibleBook.findMany({
    orderBy: { order: "asc" },
    select: { id: true, nameEn: true, nameVi: true, order: true, chapterCount: true },
  });

  const existing = await prisma.bibleBookOverview.findMany({
    where: { language: "vi" },
    select: { bookId: true },
  });
  const existingIds = new Set(existing.map((o) => o.bookId));

  const missing = allBooks.filter((b) => !existingIds.has(b.id));
  console.log(`Found ${missing.length} books missing VI overview. Generating...`);

  let success = 0;
  let failed = 0;

  for (const book of missing) {
    process.stdout.write(`  [${book.order}/66] ${book.nameEn} (${book.nameVi})... `);
    try {
      let data: GeneratedOverview | null = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          data = await generateOverviewVi(book.nameEn, book.nameVi, book.chapterCount);
          break;
        } catch (parseErr) {
          if (attempt < 3) {
            await sleep(1000);
          } else {
            throw parseErr;
          }
        }
      }
      if (!data) throw new Error("Failed after 3 attempts");

      await prisma.bibleBookOverview.upsert({
        where: { bookId_language: { bookId: book.id, language: "vi" } },
        create: {
          bookId: book.id,
          language: "vi",
          author: data.author,
          authorOccupation: data.authorOccupation,
          date: data.date,
          audience: data.audience,
          themes: data.themes,
          christConnection: data.bookSummary,
          keyVerses: data.keyVerses,
          outline: data.outline,
        },
        update: {
          author: data.author,
          authorOccupation: data.authorOccupation,
          date: data.date,
          audience: data.audience,
          themes: data.themes,
          christConnection: data.bookSummary,
          keyVerses: data.keyVerses,
          outline: data.outline,
        },
      });

      console.log("✓");
      success++;
    } catch (err) {
      console.log(`✗ ERROR: ${(err as Error).message}`);
      failed++;
    }

    await sleep(500);
  }

  console.log(`\nDone. ${success} seeded, ${failed} failed.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
