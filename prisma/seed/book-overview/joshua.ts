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
    nameEn: "Joshua",
    language: "en",
    author: "Joshua",
    authorOccupation: "Military leader and successor of Moses",
    date: "c. 1400–1370 BC",
    audience: "The nation of Israel",
    themes: [
      "Promised Land",
      "Divine Victory",
      "Covenant Faithfulness",
      "Obedience",
      "God's Guidance",
    ],
    outline: [
      {
        chapter: "1–5",
        title:
          "Joshua becomes Israel’s leader after Moses and prepares the people to enter the Promised Land by crossing the Jordan River.",
      },
      {
        chapter: "6–8",
        title:
          "Israel begins the conquest of Canaan with the fall of Jericho and the victory at Ai, demonstrating God’s power in battle.",
      },
      {
        chapter: "9–12",
        title:
          "Various battles are fought as Israel defeats several Canaanite kings and secures control over large portions of the land.",
      },
      {
        chapter: "13–19",
        title:
          "The land of Canaan is divided among the twelve tribes of Israel according to God's instructions.",
      },
      {
        chapter: "20–22",
        title:
          "Cities of refuge are established and the Levites receive their cities throughout the tribes of Israel.",
      },
      {
        chapter: "23–24",
        title:
          "Joshua gives his final instructions to Israel, urging them to remain faithful to the Lord and renew their covenant with God.",
      },
    ],
    keyVerses: [
      {
        ref: "1:9",
        chapter: 1,
        verse: 9,
        text:
          "Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
      },
      {
        ref: "21:45",
        chapter: 21,
        verse: 45,
        text:
          "Not one of all the Lord’s good promises to Israel failed; every one was fulfilled.",
      },
      {
        ref: "23:14",
        chapter: 23,
        verse: 14,
        text:
          "Not one of the good promises the Lord your God gave you has failed.",
      },
      {
        ref: "24:15",
        chapter: 24,
        verse: 15,
        text: "But as for me and my household, we will serve the Lord.",
      },
    ],
    bookSummary:
      "The book of Joshua records Israel’s entrance into the Promised Land after the death of Moses. Under Joshua’s leadership, the Israelites cross the Jordan River and begin the conquest of Canaan. Through many battles, God gives victory to His people and fulfills His promise to give them the land. The book also describes how the land was divided among the tribes of Israel. Joshua concludes by reminding the people of God's faithfulness and calling them to remain faithful to the covenant with the Lord.",
  },
  {
    nameEn: "Joshua",
    language: "vi",
    author: "Giô-suê",
    authorOccupation: "Lãnh đạo quân sự và người kế nhiệm Môi-se",
    date: "khoảng 1400–1370 TCN",
    audience: "Dân tộc Y-sơ-ra-ên",
    themes: ["Đất Hứa", "Chiến Thắng Chúa", "Giao Ước", "Vâng Lời", "Sự Dẫn Dắt"],
    outline: [
      {
        chapter: "1–5",
        title:
          "Sau khi Môi-se qua đời, Giô-suê trở thành lãnh đạo của Y-sơ-ra-ên và dẫn dân sự vượt sông Giô-đanh để tiến vào đất hứa.",
      },
      {
        chapter: "6–8",
        title:
          "Dân Y-sơ-ra-ên bắt đầu chinh phục xứ Ca-na-an với chiến thắng tại thành Giê-ri-cô và A-hi nhờ quyền năng của Đức Chúa Trời.",
      },
      {
        chapter: "9–12",
        title:
          "Nhiều vua Ca-na-an bị đánh bại khi Đức Chúa Trời ban chiến thắng cho dân Y-sơ-ra-ên trong các trận chiến.",
      },
      {
        chapter: "13–19",
        title:
          "Đất Ca-na-an được chia cho mười hai chi phái Y-sơ-ra-ên theo sự chỉ dẫn của Đức Chúa Trời.",
      },
      {
        chapter: "20–22",
        title:
          "Các thành ẩn náu được thiết lập và người Lê-vi nhận các thành của họ trong các chi phái của Y-sơ-ra-ên.",
      },
      {
        chapter: "23–24",
        title:
          "Giô-suê nói những lời cuối cùng với dân sự, nhắc họ trung tín với Đức Chúa Trời và lập lại giao ước với Ngài.",
      },
    ],
    keyVerses: [
      {
        ref: "1:9",
        chapter: 1,
        verse: 9,
        text:
          "Ta há chẳng đã dặn ngươi sao? Hãy mạnh mẽ và can đảm; chớ sợ hãi, chớ kinh khủng, vì Giê-hô-va Đức Chúa Trời ngươi ở cùng ngươi trong mọi nơi ngươi đi.",
      },
      {
        ref: "21:45",
        chapter: 21,
        verse: 45,
        text:
          "Trong các lời lành mà Đức Giê-hô-va đã hứa cùng nhà Y-sơ-ra-ên, chẳng có lời nào là không ứng nghiệm.",
      },
      {
        ref: "23:14",
        chapter: 23,
        verse: 14,
        text:
          "Chẳng có một lời nào trong các lời tốt đẹp mà Giê-hô-va Đức Chúa Trời các ngươi đã phán cùng các ngươi là không ứng nghiệm.",
      },
      {
        ref: "24:15",
        chapter: 24,
        verse: 15,
        text: "Còn ta và nhà ta sẽ phục sự Đức Giê-hô-va.",
      },
    ],
    bookSummary:
      "Sách Giô-suê ghi lại việc dân Y-sơ-ra-ên tiến vào và chinh phục đất hứa sau khi Môi-se qua đời. Dưới sự lãnh đạo của Giô-suê, dân sự vượt qua sông Giô-đanh và bắt đầu chiếm lấy xứ Ca-na-an. Qua nhiều trận chiến, Đức Chúa Trời ban chiến thắng và thực hiện lời hứa ban đất cho dân Ngài. Sách cũng mô tả việc phân chia đất cho các chi phái Y-sơ-ra-ên. Cuối sách, Giô-suê nhắc nhở dân sự về sự thành tín của Đức Chúa Trời và kêu gọi họ trung tín với giao ước của Ngài.",
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
  console.log(`Seeded ${OVERVIEWS.length} Joshua overview(s).`);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await seedBookOverviews(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

// Run when executed via `npx tsx prisma/seed/book-overview/joshua.ts`
void main().catch((err) => {
  console.error(err);
  process.exit(1);
});

