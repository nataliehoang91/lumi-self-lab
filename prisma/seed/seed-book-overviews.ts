import type { PrismaClient } from "@prisma/client";

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
  // Genesis EN (from user content)
  {
    nameEn: "Genesis",
    language: "en",
    author: "Moses",
    authorOccupation: "prophet and leader of Israel",
    date: "c. 1440–1400 BC",
    audience: "The nation of Israel",
    themes: [
      "Creation",
      "Human Fall",
      "Covenant Promise",
      "Divine Providence",
      "God’s Sovereignty",
    ],
    bookSummary:
      "Genesis records the beginning of the world, humanity, and God’s covenant relationship with His people. It describes God’s creation of the heavens and the earth, the entrance of sin through the fall of humanity, and the spread of evil throughout the early generations. The book then focuses on God's covenant with Abraham and his descendants, revealing His plan to bless all nations through them. Through the lives of Abraham, Isaac, Jacob, and Joseph, Genesis demonstrates God's faithfulness, sovereignty, and providence in guiding history and preserving His people according to His promises.",
    outline: [
      {
        chapter: "1–2",
        title:
          "God creates the heavens, the earth, and all living things, culminating in the creation of humanity in His image and the establishment of the Sabbath.",
      },
      {
        chapter: "3–5",
        title:
          "The fall of humanity through Adam and Eve's disobedience introduces sin and death into the world, followed by the early generations of humankind.",
      },
      {
        chapter: "6–9",
        title:
          "God judges the wickedness of humanity through the flood, preserves Noah and his family, and establishes a covenant after the waters recede.",
      },
      {
        chapter: "10–11",
        title:
          "The spread of nations after the flood and the account of the tower of Babel, where human pride leads to the confusion of languages.",
      },
      {
        chapter: "12–25",
        title:
          "God calls Abraham and establishes His covenant with him, promising land, descendants, and blessing for all nations.",
      },
      {
        chapter: "25–28",
        title:
          "The story of Isaac and the continuation of God's covenant promises through the next generation.",
      },
      {
        chapter: "29–36",
        title:
          "Jacob's life, struggles, and encounters with God, leading to the formation of the twelve tribes of Israel.",
      },
      {
        chapter: "37–50",
        title:
          "Joseph is sold into slavery, rises to power in Egypt, and God uses his suffering to preserve his family during famine.",
      },
    ],
    keyVerses: [
      {
        ref: "1:1",
        chapter: 1,
        verse: 1,
        text: "In the beginning God created the heavens and the earth.",
      },
      {
        ref: "3:15",
        chapter: 3,
        verse: 15,
        text: "And I will put enmity between you and the woman, and between your offspring and hers; he will crush your head, and you will strike his heel.",
      },
      {
        ref: "12:3",
        chapter: 12,
        verse: 3,
        text: "I will bless those who bless you, and whoever curses you I will curse; and all peoples on earth will be blessed through you.",
      },
      {
        ref: "50:20",
        chapter: 50,
        verse: 20,
        text: "You intended to harm me, but God intended it for good to accomplish what is now being done, the saving of many lives.",
      },
    ],
  },
  // Genesis VI (from user content)
  {
    nameEn: "Genesis",
    language: "vi",
    author: "Môi-se",
    authorOccupation: "lãnh đạo và nhà tiên tri của dân Y-sơ-ra-ên",
    date: "khoảng 1440–1400 TCN",
    audience: "Dân tộc Y-sơ-ra-ên",
    themes: ["Sáng Tạo", "Sa Ngã", "Giao Ước", "Tể Trị Chúa", "Quan Phòng Chúa"],
    bookSummary:
      "Sách Sáng Thế Ký thuật lại sự khởi đầu của thế giới, của loài người và của mối quan hệ giao ước giữa Đức Chúa Trời với dân Ngài. Sách trình bày sự sáng tạo trời đất, sự sa ngã của loài người vào tội lỗi và sự lan rộng của tội lỗi trong các thế hệ đầu tiên. Sau đó, sách tập trung vào giao ước của Đức Chúa Trời với Áp-ra-ham và dòng dõi ông, qua đó bày tỏ kế hoạch của Ngài để ban phước cho mọi dân tộc. Qua các câu chuyện về Áp-ra-ham, Y-sác, Gia-cốp và Giô-sép, Sáng Thế Ký cho thấy sự thành tín, quyền tể trị và sự quan phòng của Đức Chúa Trời trong việc dẫn dắt lịch sử và gìn giữ dân Ngài.",
    outline: [
      {
        chapter: "1–2",
        title:
          "Đức Chúa Trời dựng nên trời đất, muôn vật và loài người theo hình ảnh Ngài, rồi thiết lập ngày Sa-bát làm ngày nghỉ thánh.",
      },
      {
        chapter: "3–5",
        title:
          "A-đam và Ê-va phạm tội khiến tội lỗi và sự chết vào thế gian; các thế hệ đầu tiên của loài người được ghi lại.",
      },
      {
        chapter: "6–9",
        title:
          "Đức Chúa Trời đoán phạt thế gian gian ác bằng cơn đại hồng thủy, nhưng cứu Nô-ê và gia đình ông, rồi lập giao ước với họ.",
      },
      {
        chapter: "10–11",
        title:
          "Các dân tộc được phân tán sau cơn nước lụt và câu chuyện tháp Ba-bên khiến ngôn ngữ loài người bị phân chia.",
      },
      {
        chapter: "12–25",
        title:
          "Đức Chúa Trời kêu gọi Áp-ra-ham và lập giao ước với ông, hứa ban đất, dòng dõi và phước lành cho muôn dân.",
      },
      {
        chapter: "25–28",
        title:
          "Câu chuyện về Y-sác và sự tiếp nối lời hứa giao ước của Đức Chúa Trời cho thế hệ kế tiếp.",
      },
      {
        chapter: "29–36",
        title:
          "Cuộc đời Gia-cốp với nhiều thử thách và sự gặp gỡ Đức Chúa Trời, dẫn đến sự hình thành mười hai chi phái Y-sơ-ra-ên.",
      },
      {
        chapter: "37–50",
        title:
          "Giô-sép bị bán làm nô lệ, nhưng Đức Chúa Trời dùng những hoạn nạn của ông để cứu gia đình mình và nhiều người khỏi nạn đói.",
      },
    ],
    keyVerses: [
      {
        ref: "1:1",
        chapter: 1,
        verse: 1,
        text: "Ban đầu Đức Chúa Trời dựng nên trời đất.",
      },
      {
        ref: "3:15",
        chapter: 3,
        verse: 15,
        text: "Ta sẽ đặt sự thù nghịch giữa mi và người nữ, giữa dòng dõi mi và dòng dõi người; dòng dõi ấy sẽ giày đạp đầu mi, còn mi sẽ cắn gót chân người.",
      },
      {
        ref: "12:3",
        chapter: 12,
        verse: 3,
        text: "Ta sẽ ban phước cho những người chúc phước ngươi, rủa sả kẻ nào rủa sả ngươi; và các chi tộc nơi thế gian sẽ nhờ ngươi mà được phước.",
      },
      {
        ref: "50:20",
        chapter: 50,
        verse: 20,
        text: "Các anh toan hại tôi, nhưng Đức Chúa Trời lại toan làm điều ích cho tôi, để thực hiện điều đang xảy ra hôm nay là cứu sống nhiều người.",
      },
    ],
  },
  // John EN
  {
    nameEn: "John",
    language: "en",
    author: "John the Apostle",
    authorOccupation: "apostle and eyewitness of Jesus",
    date: "c. 85–90 AD",
    audience: "All who would believe",
    themes: [
      "Jesus as the Word of God",
      "Life and light",
      "Belief",
      'The "I Am" statements',
      "Love",
    ],
    bookSummary:
      "John's Gospel presents Jesus as the eternal Word made flesh, the Lamb of God who takes away the sin of the world, and the resurrection and the life. Through signs, teaching, and personal encounters, John shows that true life is found by believing in Him.",
    keyVerses: [
      {
        ref: "1:1",
        chapter: 1,
        verse: 1,
        text: "In the beginning was the Word, and the Word was with God, and the Word was God.",
      },
      {
        ref: "3:16",
        chapter: 3,
        verse: 16,
        text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
      },
      {
        ref: "10:10",
        chapter: 10,
        verse: 10,
        text: "I have come that they may have life, and have it to the full.",
      },
      {
        ref: "14:6",
        chapter: 14,
        verse: 6,
        text: "I am the way and the truth and the life. No one comes to the Father except through me.",
      },
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
  console.log(`Seeded ${OVERVIEWS.length} book overview(s).`);
}
