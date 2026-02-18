import type { PrismaClient } from "@prisma/client";

// 66 Protestant Bible books: EN, VI, ZH (CUV), order, chapter count
const BOOKS: {
  nameEn: string;
  nameVi: string;
  nameZh: string;
  order: number;
  chapterCount: number;
}[] = [
  { nameEn: "Genesis", nameVi: "Sáng thế ký", nameZh: "創世記", order: 1, chapterCount: 50 },
  { nameEn: "Exodus", nameVi: "Xuất Ê-díp-tô ký", nameZh: "出埃及記", order: 2, chapterCount: 40 },
  { nameEn: "Leviticus", nameVi: "Lê-vi ký", nameZh: "利未記", order: 3, chapterCount: 27 },
  { nameEn: "Numbers", nameVi: "Dân số ký", nameZh: "民數記", order: 4, chapterCount: 36 },
  { nameEn: "Deuteronomy", nameVi: "Phục truyền luật lệ ký", nameZh: "申命記", order: 5, chapterCount: 34 },
  { nameEn: "Joshua", nameVi: "Giô-suê", nameZh: "約書亞記", order: 6, chapterCount: 24 },
  { nameEn: "Judges", nameVi: "Các quan xét", nameZh: "士師記", order: 7, chapterCount: 21 },
  { nameEn: "Ruth", nameVi: "Ru-tơ", nameZh: "路得記", order: 8, chapterCount: 4 },
  { nameEn: "1 Samuel", nameVi: "1 Sa-mu-ên", nameZh: "撒母耳記上", order: 9, chapterCount: 31 },
  { nameEn: "2 Samuel", nameVi: "2 Sa-mu-ên", nameZh: "撒母耳記下", order: 10, chapterCount: 24 },
  { nameEn: "1 Kings", nameVi: "1 Các vua", nameZh: "列王紀上", order: 11, chapterCount: 22 },
  { nameEn: "2 Kings", nameVi: "2 Các vua", nameZh: "列王紀下", order: 12, chapterCount: 25 },
  { nameEn: "1 Chronicles", nameVi: "1 Sử ký", nameZh: "歷代志上", order: 13, chapterCount: 29 },
  { nameEn: "2 Chronicles", nameVi: "2 Sử ký", nameZh: "歷代志下", order: 14, chapterCount: 36 },
  { nameEn: "Ezra", nameVi: "E-xơ-ra", nameZh: "以斯拉記", order: 15, chapterCount: 10 },
  { nameEn: "Nehemiah", nameVi: "Nê-hê-mi", nameZh: "尼希米記", order: 16, chapterCount: 13 },
  { nameEn: "Esther", nameVi: "Ê-xơ-tê", nameZh: "以斯帖記", order: 17, chapterCount: 10 },
  { nameEn: "Job", nameVi: "Gióp", nameZh: "約伯記", order: 18, chapterCount: 42 },
  { nameEn: "Psalms", nameVi: "Thi thiên", nameZh: "詩篇", order: 19, chapterCount: 150 },
  { nameEn: "Proverbs", nameVi: "Châm ngôn", nameZh: "箴言", order: 20, chapterCount: 31 },
  { nameEn: "Ecclesiastes", nameVi: "Truyền đạo", nameZh: "傳道書", order: 21, chapterCount: 12 },
  { nameEn: "Song of Solomon", nameVi: "Nhã ca", nameZh: "雅歌", order: 22, chapterCount: 8 },
  { nameEn: "Isaiah", nameVi: "Ê-sai", nameZh: "以賽亞書", order: 23, chapterCount: 66 },
  { nameEn: "Jeremiah", nameVi: "Giê-rê-mi", nameZh: "耶利米書", order: 24, chapterCount: 52 },
  { nameEn: "Lamentations", nameVi: "Ai ca", nameZh: "耶利米哀歌", order: 25, chapterCount: 5 },
  { nameEn: "Ezekiel", nameVi: "Ê-xê-chi-ên", nameZh: "以西結書", order: 26, chapterCount: 48 },
  { nameEn: "Daniel", nameVi: "Đa-ni-ên", nameZh: "但以理書", order: 27, chapterCount: 12 },
  { nameEn: "Hosea", nameVi: "Ô-sê", nameZh: "何西阿書", order: 28, chapterCount: 14 },
  { nameEn: "Joel", nameVi: "Giô-ên", nameZh: "約珥書", order: 29, chapterCount: 3 },
  { nameEn: "Amos", nameVi: "A-mốt", nameZh: "阿摩司書", order: 30, chapterCount: 9 },
  { nameEn: "Obadiah", nameVi: "Áp-đia", nameZh: "俄巴底亞書", order: 31, chapterCount: 1 },
  { nameEn: "Jonah", nameVi: "Giô-na", nameZh: "約拿書", order: 32, chapterCount: 4 },
  { nameEn: "Micah", nameVi: "Mi-chê", nameZh: "彌迦書", order: 33, chapterCount: 7 },
  { nameEn: "Nahum", nameVi: "Na-hum", nameZh: "那鴻書", order: 34, chapterCount: 3 },
  { nameEn: "Habakkuk", nameVi: "Ha-ba-cúc", nameZh: "哈巴谷書", order: 35, chapterCount: 3 },
  { nameEn: "Zephaniah", nameVi: "Sô-phô-ni", nameZh: "西番雅書", order: 36, chapterCount: 3 },
  { nameEn: "Haggai", nameVi: "A-ghê", nameZh: "哈該書", order: 37, chapterCount: 2 },
  { nameEn: "Zechariah", nameVi: "Xa-cha-ri", nameZh: "撒迦利亞書", order: 38, chapterCount: 14 },
  { nameEn: "Malachi", nameVi: "Ma-la-chi", nameZh: "瑪拉基書", order: 39, chapterCount: 4 },
  { nameEn: "Matthew", nameVi: "Ma-thi-ơ", nameZh: "馬太福音", order: 40, chapterCount: 28 },
  { nameEn: "Mark", nameVi: "Mác", nameZh: "馬可福音", order: 41, chapterCount: 16 },
  { nameEn: "Luke", nameVi: "Lu-ca", nameZh: "路加福音", order: 42, chapterCount: 24 },
  { nameEn: "John", nameVi: "Giăng", nameZh: "約翰福音", order: 43, chapterCount: 21 },
  { nameEn: "Acts", nameVi: "Công vụ", nameZh: "使徒行傳", order: 44, chapterCount: 28 },
  { nameEn: "Romans", nameVi: "Rô-ma", nameZh: "羅馬書", order: 45, chapterCount: 16 },
  { nameEn: "1 Corinthians", nameVi: "1 Cô-rinh-tô", nameZh: "哥林多前書", order: 46, chapterCount: 16 },
  { nameEn: "2 Corinthians", nameVi: "2 Cô-rinh-tô", nameZh: "哥林多後書", order: 47, chapterCount: 13 },
  { nameEn: "Galatians", nameVi: "Ga-la-ti", nameZh: "加拉太書", order: 48, chapterCount: 6 },
  { nameEn: "Ephesians", nameVi: "Ê-phê-sô", nameZh: "以弗所書", order: 49, chapterCount: 6 },
  { nameEn: "Philippians", nameVi: "Phi-líp", nameZh: "腓立比書", order: 50, chapterCount: 4 },
  { nameEn: "Colossians", nameVi: "Cô-lô-se", nameZh: "歌羅西書", order: 51, chapterCount: 4 },
  { nameEn: "1 Thessalonians", nameVi: "1 Tê-sa-lô-ni-ca", nameZh: "帖撒羅尼迦前書", order: 52, chapterCount: 5 },
  { nameEn: "2 Thessalonians", nameVi: "2 Tê-sa-lô-ni-ca", nameZh: "帖撒羅尼迦後書", order: 53, chapterCount: 3 },
  { nameEn: "1 Timothy", nameVi: "1 Ti-mô-thê", nameZh: "提摩太前書", order: 54, chapterCount: 6 },
  { nameEn: "2 Timothy", nameVi: "2 Ti-mô-thê", nameZh: "提摩太後書", order: 55, chapterCount: 4 },
  { nameEn: "Titus", nameVi: "Tít", nameZh: "提多書", order: 56, chapterCount: 3 },
  { nameEn: "Philemon", nameVi: "Phi-lê-môn", nameZh: "腓利門書", order: 57, chapterCount: 1 },
  { nameEn: "Hebrews", nameVi: "Hê-bơ-rơ", nameZh: "希伯來書", order: 58, chapterCount: 13 },
  { nameEn: "James", nameVi: "Gia-cơ", nameZh: "雅各書", order: 59, chapterCount: 5 },
  { nameEn: "1 Peter", nameVi: "1 Phi-e-rơ", nameZh: "彼得前書", order: 60, chapterCount: 5 },
  { nameEn: "2 Peter", nameVi: "2 Phi-e-rơ", nameZh: "彼得後書", order: 61, chapterCount: 3 },
  { nameEn: "1 John", nameVi: "1 Giăng", nameZh: "約翰一書", order: 62, chapterCount: 5 },
  { nameEn: "2 John", nameVi: "2 Giăng", nameZh: "約翰二書", order: 63, chapterCount: 1 },
  { nameEn: "3 John", nameVi: "3 Giăng", nameZh: "約翰三書", order: 64, chapterCount: 1 },
  { nameEn: "Jude", nameVi: "Giu-đe", nameZh: "猶大書", order: 65, chapterCount: 1 },
  { nameEn: "Revelation", nameVi: "Khải huyền", nameZh: "啟示錄", order: 66, chapterCount: 22 },
];

export async function seedBibleBooks(prisma: PrismaClient) {
  const count = await prisma.bibleBook.count();
  if (count === 0) {
    await prisma.bibleBook.createMany({ data: BOOKS });
    console.log(`Seeded ${BOOKS.length} Bible books.`);
    return;
  }
  // Existing DB: ensure nameZh is set (e.g. after adding Chinese support)
  const books = await prisma.bibleBook.findMany({ orderBy: { order: "asc" } });
  for (let i = 0; i < books.length && i < BOOKS.length; i++) {
    if (books[i]!.nameZh !== BOOKS[i]!.nameZh) {
      await prisma.bibleBook.update({
        where: { id: books[i]!.id },
        data: { nameZh: BOOKS[i]!.nameZh },
      });
    }
  }
  console.log("BibleBook table already has data; nameZh synced.");
}
