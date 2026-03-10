import { PrismaClient } from "@prisma/client";

const OVERVIEWS: {
  nameEn: string;
  language: "en" | "vi";
  author: string | null;
  date: string | null;
  audience: string | null;
  themes: string[];
  /** Stored in christConnection column for now, rendered as the main summary block. */
  bookSummary: string | null;
  keyVerses: { ref: string; text: string; chapter?: number; verse?: number }[];
  outline: { chapter: string; title: string }[];
}[] = [
  // Exodus EN (from user content)
  {
    nameEn: "Exodus",
    language: "en",
    author: "Moses",
    date: "c. 1440–1400 BC",
    audience: "The nation of Israel",
    themes: [
      "Divine Deliverance",
      "God's Covenant",
      "Law Giving",
      "God's Presence",
      "Worship",
    ],
    outline: [
      {
        chapter: "1–6",
        title:
          "The Israelites become enslaved in Egypt, and God raises up Moses to confront Pharaoh and lead His people out of bondage.",
      },
      {
        chapter: "7–11",
        title:
          "God sends a series of plagues upon Egypt to demonstrate His power and compel Pharaoh to release the Israelites.",
      },
      {
        chapter: "12–13",
        title:
          "The institution of the Passover and the Israelites' departure from Egypt as God delivers them from slavery.",
      },
      {
        chapter: "14–18",
        title:
          "God leads Israel through the Red Sea, defeats the Egyptian army, and provides guidance and provision in the wilderness.",
      },
      {
        chapter: "19–24",
        title:
          "At Mount Sinai God establishes His covenant with Israel and gives the Ten Commandments and foundational laws.",
      },
      {
        chapter: "25–31",
        title:
          "God gives detailed instructions for the tabernacle, priesthood, and sacred objects that will represent His dwelling among His people.",
      },
      {
        chapter: "32–34",
        title:
          "Israel sins by worshiping the golden calf, Moses intercedes for the people, and God renews His covenant with them.",
      },
      {
        chapter: "35–40",
        title:
          "The Israelites build the tabernacle according to God's instructions, and the glory of the Lord fills it.",
      },
    ],
    keyVerses: [
      {
        ref: "3:14",
        chapter: 3,
        verse: 14,
        text: "God said to Moses, 'I AM WHO I AM. This is what you are to say to the Israelites: I AM has sent me to you.'",
      },
      {
        ref: "12:13",
        chapter: 12,
        verse: 13,
        text: "The blood will be a sign for you on the houses where you are, and when I see the blood, I will pass over you.",
      },
      {
        ref: "19:5",
        chapter: 19,
        verse: 5,
        text: "Now if you obey me fully and keep my covenant, then out of all nations you will be my treasured possession.",
      },
      {
        ref: "40:34",
        chapter: 40,
        verse: 34,
        text: "Then the cloud covered the tent of meeting, and the glory of the Lord filled the tabernacle.",
      },
    ],
    bookSummary:
      "Exodus tells the story of how God delivered the Israelites from slavery in Egypt and formed them into His covenant people. Through Moses, God confronts Pharaoh, sends plagues upon Egypt, and leads Israel out through the Red Sea. At Mount Sinai, God establishes His covenant with the nation and gives the law, including the Ten Commandments. The book also describes the construction of the tabernacle, symbolizing God's presence dwelling among His people. Exodus reveals God's power, holiness, faithfulness, and desire to live among those whom He redeems.",
  },
  // Exodus VI (from user content)
  {
    nameEn: "Exodus",
    language: "vi",
    author: "Môi-se",
    date: "khoảng 1440–1400 TCN",
    audience: "Dân tộc Y-sơ-ra-ên",
    themes: ["Giải Cứu", "Giao Ước", "Luật Pháp", "Sự Hiện Diện", "Thờ Phượng"],
    outline: [
      {
        chapter: "1–6",
        title:
          "Dân Y-sơ-ra-ên bị áp bức tại Ai Cập và Đức Chúa Trời kêu gọi Môi-se để giải cứu dân Ngài khỏi ách nô lệ.",
      },
      {
        chapter: "7–11",
        title:
          "Đức Chúa Trời giáng các tai vạ trên Ai Cập để bày tỏ quyền năng Ngài và buộc Pha-ra-ôn phải thả dân Y-sơ-ra-ên.",
      },
      {
        chapter: "12–13",
        title:
          "Lễ Vượt Qua được thiết lập và dân Y-sơ-ra-ên rời khỏi Ai Cập dưới sự giải cứu của Đức Chúa Trời.",
      },
      {
        chapter: "14–18",
        title:
          "Đức Chúa Trời dẫn dân Y-sơ-ra-ên qua Biển Đỏ, đánh bại quân Ai Cập và chăm sóc họ trong đồng vắng.",
      },
      {
        chapter: "19–24",
        title:
          "Tại núi Si-nai, Đức Chúa Trời lập giao ước với dân Y-sơ-ra-ên và ban Mười Điều Răn cùng các luật lệ căn bản.",
      },
      {
        chapter: "25–31",
        title:
          "Đức Chúa Trời ban chỉ dẫn về việc xây dựng Đền Tạm, chức tế lễ và các vật thánh để Ngài ngự giữa dân sự.",
      },
      {
        chapter: "32–34",
        title:
          "Dân Y-sơ-ra-ên phạm tội thờ bò con vàng; Môi-se cầu thay cho dân và Đức Chúa Trời lập lại giao ước.",
      },
      {
        chapter: "35–40",
        title:
          "Dân sự xây dựng Đền Tạm theo mạng lệnh của Đức Chúa Trời và vinh quang của Đức Giê-hô-va đầy dẫy nơi đó.",
      },
    ],
    keyVerses: [
      {
        ref: "3:14",
        chapter: 3,
        verse: 14,
        text: "Đức Chúa Trời phán cùng Môi-se rằng: TA LÀ ĐẤNG TỰ HỮU HẰNG HỮU.",
      },
      {
        ref: "12:13",
        chapter: 12,
        verse: 13,
        text: "Huyết đó dùng làm dấu hiệu nơi các nhà các ngươi ở; khi ta thấy huyết đó thì sẽ vượt qua.",
      },
      {
        ref: "19:5",
        chapter: 19,
        verse: 5,
        text: "Vậy bây giờ, nếu các ngươi thật vâng lời ta và giữ giao ước ta, thì trong muôn dân các ngươi sẽ thuộc riêng về ta.",
      },
      {
        ref: "40:34",
        chapter: 40,
        verse: 34,
        text: "Bấy giờ đám mây bao phủ hội mạc, và sự vinh hiển của Đức Giê-hô-va đầy dẫy đền tạm.",
      },
    ],
    bookSummary:
      "Sách Xuất Ê-díp-tô Ký thuật lại cách Đức Chúa Trời giải cứu dân Y-sơ-ra-ên khỏi ách nô lệ tại Ai Cập và lập họ thành dân giao ước của Ngài. Qua Môi-se, Đức Chúa Trời đối đầu với Pha-ra-ôn, giáng các tai vạ trên Ai Cập và dẫn dân sự ra khỏi xứ bằng quyền năng lớn lao. Tại núi Si-nai, Đức Chúa Trời ban luật pháp và lập giao ước với dân Ngài. Sách cũng mô tả việc xây dựng Đền Tạm, nơi tượng trưng cho sự hiện diện của Đức Chúa Trời ở giữa dân sự. Xuất Ê-díp-tô Ký bày tỏ quyền năng, sự thánh khiết và sự thành tín của Đức Chúa Trời đối với dân mà Ngài đã cứu chuộc.",
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
        christConnection: row.bookSummary,
        keyVerses: row.keyVerses,
        outline: row.outline,
      },
      update: {
        author: row.author,
        date: row.date,
        audience: row.audience,
        themes: row.themes,
        christConnection: row.bookSummary,
        keyVerses: row.keyVerses,
        outline: row.outline,
      },
    });
  }
  console.log(`Seeded ${OVERVIEWS.length} Exodus overview(s).`);
}
async function main() {
  const prisma = new PrismaClient();
  try {
    await seedBookOverviews(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

// Run when executed via `npx tsx prisma/seed/book-overview/exodus.ts`
void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
