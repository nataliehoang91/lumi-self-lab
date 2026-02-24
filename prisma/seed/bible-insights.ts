import type { PrismaClient } from "@prisma/client";

/**
 * Seed sample Bible insights (context, explanation, reflections).
 * Add more in DB manually or via import; AI-generated insights can use source "ai".
 */
export async function seedBibleInsights(prisma: PrismaClient) {
  const john = await prisma.bibleBook.findFirst({ where: { nameEn: "John" } });
  if (!john) return;

  const existing = await prisma.bibleInsight.findFirst({
    where: {
      bookId: john.id,
      chapterNumber: 3,
      verseNumber: null,
      language: "en",
      source: "db",
    },
  });

  const data = {
    context:
      "This conversation between Jesus and Nicodemus takes place early in Jesus' ministry and introduces the theme of spiritual rebirth.",
    explanation:
      'Jesus explains that being "born again" is a spiritual transformation through the Spirit, not a physical rebirth. John 3:16 reveals God\'s love and the gift of eternal life through belief in Jesus.',
    reflections: [
      'What does "being born again" mean to you personally?',
      "How does the image of the wind help you understand spiritual transformation?",
    ],
  };

  if (existing) {
    await prisma.bibleInsight.update({
      where: { id: existing.id },
      data,
    });
  } else {
    await prisma.bibleInsight.create({
      data: {
        source: "db",
        scope: "chapter",
        bookId: john.id,
        chapterNumber: 3,
        verseNumber: null,
        language: "en",
        ...data,
        status: "published",
      },
    });
  }
}
