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
  {
    nameEn: "Leviticus",
    language: "vi",
    author: "Môi-se",
    date: "khoảng 1440–1400 TCN",
    audience: "Dân tộc Y-sơ-ra-ên",
    themes: [
      "Sự Thánh Khiết",
      "Của Lễ",
      "Chức Tế Lễ",
      "Chuộc Tội",
      "Thờ Phượng",
    ],
    outline: [
      {
        chapter: "1–7",
        title:
          "Đức Chúa Trời thiết lập các loại của lễ khác nhau như của lễ thiêu, của lễ chay, của lễ thù ân, của lễ chuộc tội và của lễ chuộc lỗi để chuộc tội cho dân sự.",
      },
      {
        chapter: "8–10",
        title:
          "A-rôn và các con trai được phong chức tế lễ; Na-đáp và A-bi-hu bị đoán phạt vì dâng lửa lạ trước mặt Đức Giê-hô-va.",
      },
      {
        chapter: "11–15",
        title:
          "Các luật lệ về sự tinh sạch và ô uế, bao gồm các loài vật thanh sạch và không thanh sạch, bệnh tật và các nghi thức thanh tẩy.",
      },
      {
        chapter: "16",
        title:
          "Ngày Chuộc Tội được thiết lập là ngày lễ trọng đại hằng năm để chuộc tội cho toàn dân Y-sơ-ra-ên.",
      },
      {
        chapter: "17–20",
        title:
          "Đức Chúa Trời truyền dạy dân Y-sơ-ra-ên phải sống thánh khiết, tránh các tập tục tội lỗi và các sự thờ lạy tà thần của các dân ngoại.",
      },
      {
        chapter: "21–22",
        title:
          "Các luật lệ đặc biệt dành cho các thầy tế lễ và những quy định về các của lễ được dâng lên Đức Chúa Trời.",
      },
      {
        chapter: "23–25",
        title:
          "Các kỳ lễ trọng như Lễ Vượt Qua, Lễ Ngũ Tuần và Ngày Chuộc Tội được thiết lập, cùng với năm Sa-bát và năm Hân Hỉ.",
      },
      {
        chapter: "26–27",
        title:
          "Đức Chúa Trời hứa ban phước cho sự vâng lời và cảnh cáo sự đoán phạt khi dân sự không vâng phục; kết thúc bằng luật lệ về lời khấn và vật dâng hiến.",
      },
    ],
    keyVerses: [
      {
        ref: "11:45",
        chapter: 11,
        verse: 45,
        text: "Vì ta là Đức Giê-hô-va, đã đem các ngươi ra khỏi xứ Ê-díp-tô, đặng làm Đức Chúa Trời các ngươi; vậy nên hãy nên thánh, vì ta là thánh.",
      },
      {
        ref: "17:11",
        chapter: 17,
        verse: 11,
        text: "Vì sanh mạng của xác thịt ở trong huyết; ta đã cho các ngươi huyết đó nơi bàn thờ đặng làm lễ chuộc tội cho linh hồn mình.",
      },
      {
        ref: "19:2",
        chapter: 19,
        verse: 2,
        text: "Hãy nên thánh, vì ta Giê-hô-va Đức Chúa Trời các ngươi là thánh.",
      },
      {
        ref: "20:26",
        chapter: 20,
        verse: 26,
        text: "Các ngươi hãy nên thánh cho ta, vì ta là Giê-hô-va, là thánh; ta đã biệt các ngươi riêng ra khỏi các dân để các ngươi thuộc về ta.",
      },
    ],
    bookSummary:
      "Sách Lê-vi Ký giải thích cách dân Y-sơ-ra-ên phải sống thánh khiết trước mặt Đức Chúa Trời. Qua hệ thống của lễ, chức tế lễ và các luật lệ về sự thanh sạch, Đức Chúa Trời dạy dân sự cách đến gần Ngài và duy trì mối thông công với Ngài. Sách nhấn mạnh sự thánh khiết của Đức Chúa Trời và sự cần thiết của lễ chuộc tội cho tội lỗi của con người. Đồng thời, sách cũng thiết lập các kỳ lễ và những nguyên tắc sống thánh khiết cho dân sự của Đức Chúa Trời.",
  },
  {
    nameEn: "Leviticus",
    language: "en",
    author: "Moses",
    date: "c. 1440–1400 BC",
    audience: "The nation of Israel",
    themes: ["Holiness", "Sacrifices", "Priesthood", "Atonement", "Worship"],
    outline: [
      {
        chapter: "1–7",
        title:
          "God establishes various sacrificial offerings, including burnt offerings, grain offerings, peace offerings, sin offerings, and guilt offerings for the atonement of sin.",
      },
      {
        chapter: "8–10",
        title:
          "The consecration of Aaron and his sons as priests, followed by the judgment of Nadab and Abihu for offering unauthorized fire before the Lord.",
      },
      {
        chapter: "11–15",
        title:
          "Laws concerning ceremonial cleanliness, including clean and unclean animals, disease, and purification practices among the people.",
      },
      {
        chapter: "16",
        title:
          "The Day of Atonement is instituted as the central annual ceremony for the cleansing of the people’s sins before God.",
      },
      {
        chapter: "17–20",
        title:
          "God commands Israel to live holy lives, including laws about worship, morality, justice, and separation from pagan practices.",
      },
      {
        chapter: "21–22",
        title:
          "Special regulations for priests and offerings to maintain holiness in those who serve in the tabernacle.",
      },
      {
        chapter: "23–25",
        title:
          "God establishes sacred festivals such as Passover, the Feast of Weeks, and the Day of Atonement, along with the Sabbath year and the Year of Jubilee.",
      },
      {
        chapter: "26–27",
        title:
          "God promises blessings for obedience and warnings for disobedience, concluding with laws concerning vows and dedicated offerings.",
      },
    ],
    keyVerses: [
      {
        ref: "11:45",
        chapter: 11,
        verse: 45,
        text: "I am the Lord who brought you up out of Egypt to be your God; therefore be holy, because I am holy.",
      },
      {
        ref: "17:11",
        chapter: 17,
        verse: 11,
        text: "For the life of a creature is in the blood, and I have given it to you to make atonement for yourselves on the altar.",
      },
      {
        ref: "19:2",
        chapter: 19,
        verse: 2,
        text: "Be holy because I, the Lord your God, am holy.",
      },
      {
        ref: "20:26",
        chapter: 20,
        verse: 26,
        text: "You are to be holy to me because I, the Lord, am holy, and I have set you apart from the nations to be my own.",
      },
    ],
    bookSummary:
      "Leviticus explains how the people of Israel were to live as a holy nation before God. Through a system of sacrifices, priestly duties, and laws regarding purity and worship, God taught His people how to approach Him and maintain fellowship with Him. The book emphasizes God's holiness and the need for atonement for sin. It also establishes the priesthood and sacred festivals that shaped Israel’s religious life. Leviticus shows that God's people must be set apart and live according to His standards because He Himself is holy.",
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
      console.warn(
        `[BookOverview] No book found for nameEn: ${row.nameEn}, skipping.`,
      );
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
  console.log(`Seeded ${OVERVIEWS.length} Leviticus overview(s).`);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedBookOverviews(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

// Run when executed via `npx tsx prisma/seed/book-overview/leviticus.ts`
void main().catch((err) => {
  console.error(err);
  process.exit(1);
});

