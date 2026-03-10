import type { PrismaClient } from "@prisma/client";

const OVERVIEWS: {
  nameEn: string;
  language: "en" | "vi";
  author: string | null;
  date: string | null;
  audience: string | null;
  themes: string[];
  christConnection: string | null;
  keyVerses: { ref: string; text: string }[];
  outline: { chapter: string; title: string }[];
}[] = [
  // Genesis EN
  {
    nameEn: "Genesis",
    language: "en",
    author: "Moses",
    date: "1440–1400 BC",
    audience: "The nation of Israel",
    themes: [
      "Creation",
      "Fall",
      "Covenant",
      "God's sovereignty",
      "Human failure and divine grace",
    ],
    christConnection:
      'Jesus is the promised "seed" of the woman who will crush the serpent (3:15), the true Abraham who brings blessing to all nations, and the greater Joseph who saves his people through suffering.',
    keyVerses: [
      { ref: "1:1", text: "In the beginning God created the heavens and the earth." },
      {
        ref: "3:15",
        text: "I will put enmity between you and the woman, and between your offspring and hers.",
      },
      { ref: "12:3", text: "...and all peoples on earth will be blessed through you." },
      { ref: "50:20", text: "You intended to harm me, but God intended it for good." },
    ],
    outline: [
      { chapter: "1–2", title: "Creation" },
      { chapter: "3–5", title: "The Fall and its consequences" },
      { chapter: "6–9", title: "Noah and the flood" },
      { chapter: "10–11", title: "The nations and Babel" },
      { chapter: "12–25", title: "Abraham: the covenant begins" },
      { chapter: "25–28", title: "Isaac and Jacob" },
      { chapter: "29–36", title: "Jacob and his sons" },
      { chapter: "37–50", title: "Joseph in Egypt" },
    ],
  },
  // John EN
  {
    nameEn: "John",
    language: "en",
    author: "John the Apostle",
    date: "c. 85–90 AD",
    audience: "All who would believe",
    themes: [
      "Jesus as the Word of God",
      "Life and light",
      "Belief",
      'The "I Am" statements',
      "Love",
    ],
    christConnection:
      "John's Gospel is the most explicit — Jesus is the eternal Word made flesh, the Lamb of God, the resurrection and the life. Every chapter presents a new dimension of who Jesus is.",
    keyVerses: [
      {
        ref: "1:1",
        text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
      },
      { ref: "3:16", text: "For God so loved the world that he gave his one and only Son..." },
      { ref: "10:10", text: "I have come that they may have life, and have it to the full." },
      { ref: "14:6", text: "I am the way and the truth and the life." },
    ],
    outline: [
      { chapter: "1", title: "The Word becomes flesh" },
      { chapter: "2–4", title: "Early signs and conversations" },
      { chapter: "5–10", title: "Conflict with religious leaders" },
      { chapter: "11–12", title: "Raising Lazarus; triumphal entry" },
      { chapter: "13–17", title: "The upper room discourse" },
      { chapter: "18–19", title: "Trial and crucifixion" },
      { chapter: "20–21", title: "Resurrection and restoration" },
    ],
  },
];

export async function seedBookOverviews(prisma: PrismaClient) {
  const books = await prisma.bibleBook.findMany({
    select: { id: true, nameEn: true },
  });
  const byName = new Map(books.map((b) => [b.nameEn, b.id]));

  for (const row of OVERVIEWS) {
    const bookId = byName.get(row.nameEn);
    if (!bookId) {
      console.warn(`[BookOverview] No book found for nameEn: ${row.nameEn}, skipping.`);
      continue;
    }
    await prisma.bibleBookOverview.upsert({
      where: {
        bookId_language: { bookId, language: row.language },
      },
      create: {
        bookId,
        language: row.language,
        author: row.author,
        date: row.date,
        audience: row.audience,
        themes: row.themes,
        christConnection: row.christConnection,
        keyVerses: row.keyVerses,
        outline: row.outline,
      },
      update: {
        author: row.author,
        date: row.date,
        audience: row.audience,
        themes: row.themes,
        christConnection: row.christConnection,
        keyVerses: row.keyVerses,
        outline: row.outline,
      },
    });
  }
  console.log(`Seeded ${OVERVIEWS.length} book overview(s).`);
}
