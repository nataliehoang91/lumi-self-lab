import { PrismaClient } from "@prisma/client";

const OVERVIEWS: {
  nameEn: string;
  language: "en" | "vi";
  author: string | null;
  authorOccupation?: string | null;
  date: string | null;
  audience: string | null;
  themes: string[];
  /** Stored in christConnection column for now, rendered as the main summary block. */
  bookSummary: string | null;
  keyVerses: { ref: string; text: string; chapter?: number; verse?: number }[];
  outline: { chapter: string; title: string }[];
}[] = [
  {
    nameEn: "Deuteronomy",
    language: "en",
    author: "Moses",
    authorOccupation: "The Prophet and Leader of Israel",
    date: "c. 1406 BC",
    audience: "The new generation of Israelites preparing to enter the Promised Land",
    themes: [
      "Covenant Renewal",
      "God's Law",
      "Obedience",
      "God's Faithfulness",
      "Promised Land",
    ],
    outline: [
      {
        chapter: "1–4",
        title:
          "Moses reviews Israel's journey from Mount Sinai and reminds the people of God's guidance and their past failures.",
      },
      {
        chapter: "5–11",
        title:
          "Moses repeats the Ten Commandments and calls Israel to love and obey the Lord with all their heart.",
      },
      {
        chapter: "12–16",
        title:
          "Laws concerning worship, sacrifices, and major religious festivals are given to guide Israel's life in the promised land.",
      },
      {
        chapter: "17–20",
        title:
          "Instructions are provided for leadership, justice, kingship, priests, prophets, and conduct in warfare.",
      },
      {
        chapter: "21–26",
        title:
          "Various laws regulating daily life, justice, family relationships, and social responsibility among the people.",
      },
      {
        chapter: "27–30",
        title:
          "Blessings for obedience and curses for disobedience are declared as Israel renews its covenant with God.",
      },
      {
        chapter: "31–34",
        title:
          "Moses appoints Joshua as his successor, delivers his final words to Israel, and dies before the nation enters the promised land.",
      },
    ],
    keyVerses: [
      {
        ref: "6:4-5",
        chapter: 6,
        verse: 4,
        text: "Hear, O Israel: The Lord our God, the Lord is one. Love the Lord your God with all your heart and with all your soul and with all your strength.",
      },
      {
        ref: "8:3",
        chapter: 8,
        verse: 3,
        text: "Man does not live on bread alone but on every word that comes from the mouth of the Lord.",
      },
      {
        ref: "30:19",
        chapter: 30,
        verse: 19,
        text: "This day I call the heavens and the earth as witnesses against you that I have set before you life and death, blessings and curses. Now choose life.",
      },
      {
        ref: "31:6",
        chapter: 31,
        verse: 6,
        text: "Be strong and courageous. Do not be afraid or terrified because of them, for the Lord your God goes with you.",
      },
    ],
    bookSummary:
      "Deuteronomy records Moses' final speeches to the people of Israel before they enter the Promised Land. Moses reviews their history, restates God's law, and urges the people to remain faithful to the covenant. The book emphasizes love for God, obedience to His commandments, and the consequences of faithfulness or disobedience. Deuteronomy prepares the new generation of Israelites to live as God's people in the land He promised to their ancestors. It concludes with Moses appointing Joshua as leader and reminding the people that true life and blessing come from following the Lord.",
  },
  {
    nameEn: "Deuteronomy",
    language: "vi",
    author: "Môi-se",
    authorOccupation: "Lãnh đạo và Nhà Tiên Tri của Dân Y-sơ-ra-ên",
    date: "khoảng 1406 TCN",
    audience: "Thế hệ mới của dân Y-sơ-ra-ên chuẩn bị vào đất hứa",
    themes: ["Lập Lại Giao Ước", "Luật Pháp", "Vâng Lời", "Sự Thành Tín", "Đất Hứa"],
    outline: [
      {
        chapter: "1–4",
        title:
          "Môi-se nhắc lại hành trình của dân Y-sơ-ra-ên từ núi Si-nai và nhắc nhở họ về sự dẫn dắt của Đức Chúa Trời cùng những thất bại trong quá khứ.",
      },
      {
        chapter: "5–11",
        title:
          "Môi-se nhắc lại Mười Điều Răn và kêu gọi dân sự hết lòng yêu kính và vâng phục Đức Giê-hô-va.",
      },
      {
        chapter: "12–16",
        title:
          "Những luật lệ liên quan đến sự thờ phượng, của lễ và các kỳ lễ trọng được ban ra để hướng dẫn đời sống của dân sự trong đất hứa.",
      },
      {
        chapter: "17–20",
        title:
          "Các luật lệ về lãnh đạo, công lý, vua, thầy tế lễ, tiên tri và những nguyên tắc trong chiến tranh.",
      },
      {
        chapter: "21–26",
        title:
          "Các luật lệ khác nhau điều chỉnh đời sống hằng ngày, các mối quan hệ gia đình, xã hội và trách nhiệm của dân sự.",
      },
      {
        chapter: "27–30",
        title:
          "Những lời chúc phước cho sự vâng lời và những lời rủa sả cho sự không vâng phục khi dân sự lập lại giao ước với Đức Chúa Trời.",
      },
      {
        chapter: "31–34",
        title:
          "Môi-se chỉ định Giô-suê làm người lãnh đạo kế tiếp, nói những lời cuối cùng với dân sự và qua đời trước khi họ vào đất hứa.",
      },
    ],
    keyVerses: [
      {
        ref: "6:4-5",
        chapter: 6,
        verse: 4,
        text: "Hỡi Y-sơ-ra-ên! hãy nghe: Giê-hô-va Đức Chúa Trời chúng ta là Giê-hô-va có một không hai. Ngươi phải hết lòng, hết linh hồn, hết sức kính mến Giê-hô-va Đức Chúa Trời ngươi.",
      },
      {
        ref: "8:3",
        chapter: 8,
        verse: 3,
        text: "Loài người sống chẳng phải chỉ nhờ bánh mà thôi, nhưng nhờ mọi lời bởi miệng Đức Giê-hô-va mà ra.",
      },
      {
        ref: "30:19",
        chapter: 30,
        verse: 19,
        text: "Ta bắt trời và đất làm chứng nghịch cùng các ngươi ngày nay rằng ta đã đặt trước mặt ngươi sự sống và sự chết, phước lành và sự rủa sả; vậy hãy chọn sự sống.",
      },
      {
        ref: "31:6",
        chapter: 31,
        verse: 6,
        text: "Hãy vững lòng bền chí, chớ sợ hãi, chớ kinh khủng vì chúng nó; vì Giê-hô-va Đức Chúa Trời ngươi đi cùng ngươi.",
      },
    ],
    bookSummary:
      "Sách Phục Truyền Luật Lệ Ký ghi lại những lời giảng cuối cùng của Môi-se cho dân Y-sơ-ra-ên trước khi họ vào đất hứa. Môi-se nhắc lại lịch sử của dân sự, lập lại luật pháp của Đức Chúa Trời và kêu gọi họ trung tín với giao ước. Sách nhấn mạnh sự yêu kính Đức Chúa Trời, sự vâng phục luật pháp của Ngài và hậu quả của việc vâng lời hay không vâng lời. Phục Truyền Luật Lệ Ký chuẩn bị cho thế hệ mới bước vào đất hứa và sống như dân thuộc riêng về Đức Chúa Trời.",
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
        authorOccupation: row.authorOccupation ?? null,
        date: row.date,
        audience: row.audience,
        themes: row.themes,
        christConnection: row.bookSummary,
        keyVerses: row.keyVerses,
        outline: row.outline,
      },
      update: {
        author: row.author,
        authorOccupation: row.authorOccupation ?? null,
        date: row.date,
        audience: row.audience,
        themes: row.themes,
        christConnection: row.bookSummary,
        keyVerses: row.keyVerses,
        outline: row.outline,
      },
    });
  }
  console.log(`Seeded ${OVERVIEWS.length} Deuteronomy overview(s).`);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedBookOverviews(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

// Run when executed via `npx tsx prisma/seed/book-overview/deuteronomy.ts`
void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
