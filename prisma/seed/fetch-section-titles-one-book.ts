/**
 * Fetch section (chapter) titles for one book and update BibleChapter.sectionTitle only.
 * Does not touch any verse content or other columns.
 *
 * Before first run: apply migration that adds sectionTitle:
 *   npx prisma migrate deploy
 * (or run migration 20260309000000_add_bible_chapter_section_title)
 *
 * Usage (Matthew only – test without API key, uses static titles):
 *   npx tsx prisma/seed/fetch-section-titles-one-book.ts --book=Matthew
 *
 * Usage (with API.bible – set API_BIBLE_KEY, then run for one book):
 *   API_BIBLE_KEY=your_key npx tsx prisma/seed/fetch-section-titles-one-book.ts --book=Matthew
 *
 * Options:
 *   --book  Required. English book name (e.g. Matthew, Genesis).
 */
import { PrismaClient } from "@prisma/client";

const API_BIBLE_BASE = "https://api.scripture.api.bible/v1";

// API.bible book IDs (OSIS-style) for our nameEn
const NAME_EN_TO_API_BIBLE_BOOK_ID: Record<string, string> = {
  Genesis: "GEN",
  Exodus: "EXO",
  Leviticus: "LEV",
  Numbers: "NUM",
  Deuteronomy: "DEU",
  Joshua: "JOS",
  Judges: "JDG",
  Ruth: "RUT",
  "1 Samuel": "1SA",
  "2 Samuel": "2SA",
  "1 Kings": "1KI",
  "2 Kings": "2KI",
  "1 Chronicles": "1CH",
  "2 Chronicles": "2CH",
  Ezra: "EZR",
  Nehemiah: "NEH",
  Esther: "EST",
  Job: "JOB",
  Psalms: "PSA",
  Proverbs: "PRO",
  Ecclesiastes: "ECC",
  "Song of Solomon": "SNG",
  Isaiah: "ISA",
  Jeremiah: "JER",
  Lamentations: "LAM",
  Ezekiel: "EZK",
  Daniel: "DAN",
  Hosea: "HOS",
  Joel: "JOL",
  Amos: "AMO",
  Obadiah: "OBA",
  Jonah: "JON",
  Micah: "MIC",
  Nahum: "NAH",
  Habakkuk: "HAB",
  Zephaniah: "ZEP",
  Haggai: "HAG",
  Zechariah: "ZEC",
  Malachi: "MAL",
  Matthew: "MAT",
  Mark: "MRK",
  Luke: "LUK",
  John: "JHN",
  Acts: "ACT",
  Romans: "ROM",
  "1 Corinthians": "1CO",
  "2 Corinthians": "2CO",
  Galatians: "GAL",
  Ephesians: "EPH",
  Philippians: "PHP",
  Colossians: "COL",
  "1 Thessalonians": "1TH",
  "2 Thessalonians": "2TH",
  "1 Timothy": "1TI",
  "2 Timothy": "2TI",
  Titus: "TIT",
  Philemon: "PHM",
  Hebrews: "HEB",
  James: "JAS",
  "1 Peter": "1PE",
  "2 Peter": "2PE",
  "1 John": "1JN",
  "2 John": "2JN",
  "3 John": "3JN",
  Jude: "JUD",
  Revelation: "REV",
};

// Fallback: static section titles for Matthew (so we can test without API key). Only used when API_BIBLE_KEY is not set.
const MATTHEW_SECTION_TITLES: Record<number, string> = {
  1: "The Genealogy and Birth of Jesus Christ",
  2: "The Visit of the Wise Men",
  3: "John the Baptist Prepares the Way",
  4: "The Temptation of Jesus",
  5: "The Sermon on the Mount",
  6: "Teaching on Prayer and Treasures",
  7: "Judging Others and the Narrow Gate",
  8: "Jesus Heals and Calms the Storm",
  9: "Jesus Calls Matthew and Heals",
  10: "Jesus Sends Out the Twelve",
  11: "Jesus and John the Baptist",
  12: "Lord of the Sabbath",
  13: "The Parables of the Kingdom",
  14: "John Beheaded; Jesus Feeds the Five Thousand",
  15: "What Defiles a Person",
  16: "Peter’s Confession; Jesus Foretells His Death",
  17: "The Transfiguration",
  18: "Who Is the Greatest?",
  19: "Teaching on Marriage and Riches",
  20: "Laborers in the Vineyard; Jesus Foretells His Death",
  21: "The Triumphal Entry",
  22: "The Parable of the Wedding Feast",
  23: "Seven Woes to the Scribes and Pharisees",
  24: "The Olivet Discourse",
  25: "The Parable of the Ten Virgins and the Talents",
  26: "The Plot; the Last Supper; Gethsemane",
  27: "Jesus Delivered to Pilate; Crucified",
  28: "The Resurrection",
};

function parseArgs(): { bookName: string } {
  const args = process.argv.slice(2);
  let bookName = "";
  for (const a of args) {
    if (a.startsWith("--book=")) bookName = a.slice("--book=".length).trim();
  }
  if (!bookName) {
    console.error("Usage: npx tsx prisma/seed/fetch-section-titles-one-book.ts --book=Matthew");
    process.exit(1);
  }
  return { bookName };
}

async function fetchSectionsFromApi(
  apiKey: string,
  bibleId: string,
  bookId: string
): Promise<{ chapterNumber: number; title: string }[]> {
  const url = `${API_BIBLE_BASE}/bibles/${bibleId}/books/${bookId}/sections?include-chapter-numbers=true&include-verse-spans=true`;
  const res = await fetch(url, {
    headers: { "api-key": apiKey },
  });
  if (!res.ok) {
    throw new Error(`API.bible sections failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as {
    data?: Array<{ id: string; title?: string; [k: string]: unknown }>;
  };
  const data = json.data ?? [];
  const out: { chapterNumber: number; title: string }[] = [];
  for (let i = 0; i < data.length; i++) {
    const section = data[i];
    const title = (section.title ?? "").trim();
    if (!title) continue;
    const idParts = section.id.split(".");
    const chNum = idParts.length >= 2 ? parseInt(idParts[1], 10) : i + 1;
    if (chNum >= 1) out.push({ chapterNumber: chNum, title });
  }
  return out;
}

async function main() {
  const { bookName } = parseArgs();
  const prisma = new PrismaClient();

  const book = await prisma.bibleBook.findFirst({
    where: { nameEn: bookName },
    select: { id: true, nameEn: true, chapterCount: true },
  });
  if (!book) {
    console.error(`Book not found: ${bookName}`);
    process.exit(1);
  }

  const apiKey = process.env.API_BIBLE_KEY?.trim();
  let sectionTitlesByChapter: Map<number, string> = new Map();

  if (apiKey) {
    const bibleId = process.env.API_BIBLE_VERSION_ID?.trim() ?? "9879dbb7cfe39e4d-01";
    const apiBookId = NAME_EN_TO_API_BIBLE_BOOK_ID[book.nameEn];
    if (!apiBookId) {
      console.error(`No API.bible book ID for: ${book.nameEn}`);
      process.exit(1);
    }
    console.log(`Fetching sections from API.bible for ${book.nameEn}...`);
    try {
      const sections = await fetchSectionsFromApi(apiKey, bibleId, apiBookId);
      for (const s of sections) {
        sectionTitlesByChapter.set(s.chapterNumber, s.title);
      }
      console.log(`Got ${sections.length} section(s).`);
    } catch (e) {
      console.error("API.bible error:", e);
      process.exit(1);
    }
  } else {
    if (book.nameEn !== "Matthew") {
      console.error("Without API_BIBLE_KEY only --book=Matthew is supported (static titles). Set API_BIBLE_KEY for other books.");
      process.exit(1);
    }
    console.log("No API_BIBLE_KEY; using static section titles for Matthew only.");
    sectionTitlesByChapter = new Map(
      Object.entries(MATTHEW_SECTION_TITLES).map(([ch, title]) => [parseInt(ch, 10), title])
    );
  }

  const chapters = await prisma.bibleChapter.findMany({
    where: { bookId: book.id },
    orderBy: { chapterNumber: "asc" },
    select: { id: true, chapterNumber: true },
  });

  let updated = 0;
  for (const ch of chapters) {
    const title = sectionTitlesByChapter.get(ch.chapterNumber);
    if (title) {
      await prisma.bibleChapter.update({
        where: { id: ch.id },
        data: { sectionTitle: title },
      });
      updated++;
    }
  }

  console.log(`Updated sectionTitle for ${updated} chapter(s) in ${book.nameEn}. No verse content was changed.`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
