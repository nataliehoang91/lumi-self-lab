import type { PrismaClient } from "@prisma/client";

const EXAMPLE_VERSES = [
  {
    book: "John",
    chapter: 3,
    verse: 16,
    content:
      "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.",
    version: "KJV",
    language: "en",
  },
  {
    book: "Psalm",
    chapter: 23,
    verse: 1,
    content: "The Lord is my shepherd; I shall not want.",
    version: "KJV",
    language: "en",
  },
  {
    book: "Proverbs",
    chapter: 3,
    verse: 5,
    content: "Trust in the Lord with all thine heart; and lean not unto thine own understanding.",
    version: "KJV",
    language: "en",
  },
  {
    book: "John",
    chapter: 1,
    verse: 1,
    content: "In the beginning was the Word, and the Word was with God, and the Word was God.",
    version: "NIV",
    language: "en",
  },
  {
    book: "Philippians",
    chapter: 4,
    verse: 13,
    content: "I can do all this through him who gives me strength.",
    version: "NIV",
    language: "en",
  },
];

export async function seedFlashVerses(prisma: PrismaClient) {
  const count = await prisma.flashVerse.count();
  if (count > 0) {
    console.log("FlashVerse table already has data, skipping seed.");
    return;
  }
  await prisma.flashVerse.createMany({ data: EXAMPLE_VERSES });
  console.log(`Seeded ${EXAMPLE_VERSES.length} flash verses.`);
}
