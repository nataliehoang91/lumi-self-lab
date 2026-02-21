import type { PrismaClient } from "@prisma/client";

const EXAMPLE_VERSES = [
  {
    book: "John",
    chapter: 3,
    verse: 16,
    titleEn: "John 3:16",
    titleVi: "Giăng 3:16",
    contentVIE1923:
      "Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con Một của Ngài, để ai tin Con ấy không bị hư mất mà được sự sống đời đời.",
    contentKJV:
      "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    contentNIV:
      "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
  },
  {
    book: "Psalm",
    chapter: 23,
    verse: 1,
    titleEn: "Psalm 23:1",
    titleVi: "Thi Thiên 23:1",
    contentVIE1923: "Đức Giê-hô-va là Đấng Chăn Ta, Ta chẳng thiếu thốn gì.",
    contentKJV: "The Lord is my shepherd; I shall not want.",
    contentNIV: "The Lord is my shepherd, I lack nothing.",
  },
  {
    book: "Philippians",
    chapter: 4,
    verse: 13,
    titleEn: "Philippians 4:13",
    titleVi: "Phi-líp 4:13",
    contentVIE1923: "Tôi có thể làm mọi sự nhờ Đấng ban sức mạnh cho tôi.",
    contentKJV: "I can do all things through Christ which strengtheneth me.",
    contentNIV: "I can do all this through him who gives me strength.",
  },
];

export async function seedFlashVerses(prisma: PrismaClient) {
  const count = await prisma.flashVerse.count();
  if (count > 0) {
    console.log("FlashVerse table already has data, skipping seed.");
    return;
  }
  const defaultSet = await prisma.flashCardSet.findFirst({ orderBy: { sortOrder: "asc" } });
  const data = EXAMPLE_VERSES.map((v) => ({
    ...v,
    flashCardSetId: defaultSet?.id ?? undefined,
  }));
  await prisma.flashVerse.createMany({ data });
  console.log(`Seeded ${EXAMPLE_VERSES.length} flash verses.`);
}
