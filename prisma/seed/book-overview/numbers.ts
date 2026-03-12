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
    nameEn: "Numbers",
    language: "en",
    author: "Moses",
    authorOccupation: "prophet and leader of Israel",
    date: "c. 1440–1400 BC",
    audience: "The nation of Israel",
    themes: [
      "Wilderness Journey",
      "Human Rebellion",
      "Divine Judgment",
      "God's Faithfulness",
      "Promised Land",
    ],
    outline: [
      {
        chapter: "1–4",
        title:
          "God commands Moses to take a census of the Israelites and organizes the tribes for their journey through the wilderness.",
      },
      {
        chapter: "5–10",
        title:
          "Laws concerning purity, offerings, and worship are given, and preparations are made for Israel to depart from Mount Sinai.",
      },
      {
        chapter: "11–14",
        title:
          "The people complain against God, the spies explore the land of Canaan, and Israel rebels in unbelief, resulting in God's judgment.",
      },
      {
        chapter: "15–19",
        title:
          "Additional laws and regulations are given, including instructions concerning offerings and purification rituals.",
      },
      {
        chapter: "20–21",
        title:
          "Events during the wilderness journey, including the death of Miriam and Aaron, Israel's struggles, and God's provision.",
      },
      {
        chapter: "22–24",
        title:
          "Balak king of Moab summons Balaam to curse Israel, but God turns the curse into blessings over His people.",
      },
      {
        chapter: "25–31",
        title:
          "Israel falls into sin with the Moabites, followed by judgment and renewed preparation for entering the promised land.",
      },
      {
        chapter: "32–36",
        title:
          "The tribes prepare to settle in the land east of the Jordan and final instructions are given before Israel enters Canaan.",
      },
    ],
    keyVerses: [
      {
        ref: "6:24-26",
        chapter: 6,
        verse: 24,
        text: "The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you; the Lord turn his face toward you and give you peace.",
      },
      {
        ref: "14:18",
        chapter: 14,
        verse: 18,
        text: "The Lord is slow to anger, abounding in love and forgiving sin and rebellion.",
      },
      {
        ref: "23:19",
        chapter: 23,
        verse: 19,
        text: "God is not human, that he should lie, not a human being, that he should change his mind.",
      },
      {
        ref: "24:17",
        chapter: 24,
        verse: 17,
        text: "A star will come out of Jacob; a scepter will rise out of Israel.",
      },
    ],
    bookSummary:
      "Numbers records Israel's journey through the wilderness after leaving Mount Sinai on the way to the promised land. The book describes how God organized the nation, guided them through the desert, and provided for their needs. However, it also reveals repeated rebellion and unbelief among the people, which led to God's judgment and caused an entire generation to wander in the wilderness for forty years. Despite Israel's failures, the book demonstrates God's faithfulness to His covenant promises and His continuing plan to bring His people into the land He had promised to their ancestors.",
  },
  {
    nameEn: "Numbers",
    language: "vi",
    author: "Môi-se",
    authorOccupation: "lãnh đạo và nhà tiên tri của dân Y-sơ-ra-ên",
    date: "khoảng 1440–1400 TCN",
    audience: "Dân tộc Y-sơ-ra-ên",
    themes: [
      "Hành Trình Đồng Vắng",
      "Sự Nổi Loạn",
      "Sự Đoán Phạt",
      "Sự Thành Tín",
      "Đất Hứa",
    ],
    outline: [
      {
        chapter: "1–4",
        title:
          "Đức Chúa Trời truyền cho Môi-se kiểm tra dân số của Y-sơ-ra-ên và sắp xếp các chi phái để chuẩn bị cho hành trình trong đồng vắng.",
      },
      {
        chapter: "5–10",
        title:
          "Các luật lệ về sự thanh sạch, của lễ và sự thờ phượng được ban hành khi dân Y-sơ-ra-ên chuẩn bị rời núi Si-nai.",
      },
      {
        chapter: "11–14",
        title:
          "Dân sự than trách Đức Chúa Trời; các thám tử do thám đất Ca-na-an; dân Y-sơ-ra-ên nổi loạn vì không tin và bị Đức Chúa Trời đoán phạt.",
      },
      {
        chapter: "15–19",
        title:
          "Đức Chúa Trời ban thêm các luật lệ về của lễ và nghi thức thanh tẩy cho dân sự.",
      },
      {
        chapter: "20–21",
        title:
          "Những sự kiện xảy ra trong hành trình đồng vắng, bao gồm cái chết của Mi-ri-am và A-rôn cùng sự chăm sóc của Đức Chúa Trời dành cho dân Ngài.",
      },
      {
        chapter: "22–24",
        title:
          "Ba-lác vua Mô-áp mời Ba-la-am đến rủa sả dân Y-sơ-ra-ên, nhưng Đức Chúa Trời khiến lời rủa sả trở thành lời chúc phước.",
      },
      {
        chapter: "25–31",
        title:
          "Dân Y-sơ-ra-ên phạm tội với người Mô-áp, sau đó Đức Chúa Trời đoán phạt và chuẩn bị dân sự cho việc tiến vào đất hứa.",
      },
      {
        chapter: "32–36",
        title:
          "Các chi phái chuẩn bị định cư ở phía đông sông Giô-đanh và những lời chỉ dẫn cuối cùng trước khi dân Y-sơ-ra-ên vào đất Ca-na-an.",
      },
    ],
    keyVerses: [
      {
        ref: "6:24-26",
        chapter: 6,
        verse: 24,
        text: "Nguyện Đức Giê-hô-va ban phước cho ngươi và gìn giữ ngươi; Nguyện Đức Giê-hô-va chiếu sáng mặt Ngài trên ngươi và làm ơn cho ngươi; Nguyện Đức Giê-hô-va đoái xem ngươi và ban bình an cho ngươi.",
      },
      {
        ref: "14:18",
        chapter: 14,
        verse: 18,
        text: "Đức Giê-hô-va chậm giận và giàu sự nhân từ, tha thứ sự gian ác và sự vi phạm.",
      },
      {
        ref: "23:19",
        chapter: 23,
        verse: 19,
        text: "Đức Chúa Trời chẳng phải là người để nói dối, cũng chẳng phải con loài người để hối cải.",
      },
      {
        ref: "24:17",
        chapter: 24,
        verse: 17,
        text: "Một ngôi sao sẽ ra từ Gia-cốp, một cây phủ việt sẽ dấy lên từ Y-sơ-ra-ên.",
      },
    ],
    bookSummary:
      "Sách Dân Số Ký thuật lại hành trình của dân Y-sơ-ra-ên trong đồng vắng sau khi rời núi Si-nai trên đường đến đất hứa. Đức Chúa Trời tổ chức dân sự, dẫn dắt họ qua sa mạc và cung cấp mọi nhu cầu cho họ. Tuy nhiên, sách cũng ghi lại nhiều lần dân sự nổi loạn và không tin cậy Đức Chúa Trời, khiến cả một thế hệ phải lang thang trong đồng vắng bốn mươi năm. Mặc dù dân sự nhiều lần thất bại, Đức Chúa Trời vẫn giữ sự thành tín đối với giao ước của Ngài và tiếp tục thực hiện kế hoạch dẫn dân Ngài vào đất mà Ngài đã hứa ban cho tổ phụ họ.",
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
  console.log(`Seeded ${OVERVIEWS.length} Numbers overview(s).`);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedBookOverviews(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

// Run when executed via `npx tsx prisma/seed/book-overview/numbers.ts`
void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
