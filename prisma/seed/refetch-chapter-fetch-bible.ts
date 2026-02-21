/**
 * Fallback refetch: fill one chapter from fetch.bible when primary refetch leaves nulls.
 * Only updates rows where the selected language column is null.
 *
 * Usage (Vietnamese – set translation ID from https://v1.fetch.bible/bibles/manifest.json):
 *   FETCH_BIBLE_VIE_ID=vi_xxx npx tsx prisma/seed/refetch-chapter-fetch-bible.ts --bookId=ID --chapter=7 --lang=vie
 *
 * Usage (KJV – built-in id):
 *   npx tsx prisma/seed/refetch-chapter-fetch-bible.ts --bookId=ID --chapter=7 --lang=kjv
 *
 * Options:
 *   --bookId   Required. BibleBook id.
 *   --chapter  Required. Chapter number.
 *   --lang     Required. vie | kjv (for vie, set FETCH_BIBLE_VIE_ID in env).
 *   --override Optional. Overwrite entire chapter for this lang (default: only fill nulls).
 */
import { PrismaClient } from "@prisma/client";
import { VERSE_COUNTS } from "./verse-counts-kjv";

const FETCH_BIBLE_BASE = "https://v1.fetch.bible/bibles";
const KJV_ID = "eng_kjv";
/** Vietnamese: Vietnamese Bible 1925 (traditional). Use FETCH_BIBLE_VIE_ID to override (e.g. vie_bib = Contemporary). */
const DEFAULT_VIE_ID = "vie_kt";

// USX book codes (lowercase) in Bible order 1..66
const NAME_EN_TO_USX: Record<string, string> = {
  Genesis: "gen",
  Exodus: "exo",
  Leviticus: "lev",
  Numbers: "num",
  Deuteronomy: "deu",
  Joshua: "jos",
  Judges: "jdg",
  Ruth: "rut",
  "1 Samuel": "1sa",
  "2 Samuel": "2sa",
  "1 Kings": "1ki",
  "2 Kings": "2ki",
  "1 Chronicles": "1ch",
  "2 Chronicles": "2ch",
  Ezra: "ezr",
  Nehemiah: "neh",
  Esther: "est",
  Job: "job",
  Psalms: "psa",
  Proverbs: "pro",
  Ecclesiastes: "ecc",
  "Song of Solomon": "sng",
  Isaiah: "isa",
  Jeremiah: "jer",
  Lamentations: "lam",
  Ezekiel: "ezk",
  Daniel: "dan",
  Hosea: "hos",
  Joel: "jol",
  Amos: "amo",
  Obadiah: "oba",
  Jonah: "jon",
  Micah: "mic",
  Nahum: "nam",
  Habakkuk: "hab",
  Zephaniah: "zep",
  Haggai: "hag",
  Zechariah: "zec",
  Malachi: "mal",
  Matthew: "mat",
  Mark: "mrk",
  Luke: "luk",
  John: "jhn",
  Acts: "act",
  Romans: "rom",
  "1 Corinthians": "1co",
  "2 Corinthians": "2co",
  Galatians: "gal",
  Ephesians: "eph",
  Philippians: "php",
  Colossians: "col",
  "1 Thessalonians": "1th",
  "2 Thessalonians": "2th",
  "1 Timothy": "1ti",
  "2 Timothy": "2ti",
  Titus: "tit",
  Philemon: "phm",
  Hebrews: "heb",
  James: "jas",
  "1 Peter": "1pe",
  "2 Peter": "2pe",
  "1 John": "1jn",
  "2 John": "2jn",
  "3 John": "3jn",
  Jude: "jud",
  Revelation: "rev",
};

function parseArgs(): {
  bookId: string;
  chapter: number;
  lang: "vie" | "kjv";
  override: boolean;
} {
  const args = process.argv.slice(2);
  let bookId = "";
  let chapter = 0;
  let lang: "vie" | "kjv" | undefined;
  let override = false;
  for (const a of args) {
    if (a.startsWith("--bookId=")) bookId = a.slice("--bookId=".length).trim();
    else if (a.startsWith("--chapter=")) chapter = parseInt(a.slice("--chapter=".length), 10);
    else if (a.startsWith("--lang=")) lang = a.slice("--lang=".length).trim().toLowerCase() as "vie" | "kjv";
    else if (a === "--override") override = true;
  }
  if (!bookId || !Number.isFinite(chapter) || chapter < 1 || !lang) {
    console.error(
      "Usage: FETCH_BIBLE_VIE_ID=vi_xxx npx tsx prisma/seed/refetch-chapter-fetch-bible.ts --bookId=ID --chapter=N --lang=vie|kjv [--override]"
    );
    process.exit(1);
  }
  if (!["vie", "kjv"].includes(lang)) {
    console.error("--lang must be vie or kjv for this script.");
    process.exit(1);
  }
  return { bookId, chapter, lang, override };
}

type FetchBibleBookJson = {
  book: string;
  contents: (string | unknown[])[][];
};

/** Extract plain text from fetch.bible verse: can be string or array like [text, {note}, " "] */
function extractVerseText(t: string | unknown[] | undefined): string {
  if (t == null) return "";
  if (typeof t === "string") return t.trim();
  if (!Array.isArray(t)) return "";
  const first = t.find((x) => typeof x === "string");
  return typeof first === "string" ? first.trim() : "";
}

async function main() {
  const { bookId, chapter, lang, override } = parseArgs();
  const prisma = new PrismaClient();
  if (override) console.log("Override mode: overwriting entire chapter for this language.");

  const book = await prisma.bibleBook.findUnique({ where: { id: bookId } });
  if (!book) {
    console.error(`Book not found: ${bookId}`);
    process.exit(1);
  }

  const usxCode = NAME_EN_TO_USX[book.nameEn];
  if (!usxCode) {
    console.error(`No USX code for: ${book.nameEn}`);
    process.exit(1);
  }

  const translationId = lang === "kjv" ? KJV_ID : (process.env.FETCH_BIBLE_VIE_ID || DEFAULT_VIE_ID);

  const url = `${FETCH_BIBLE_BASE}/${translationId}/txt/${usxCode}.json`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed to fetch ${url}: ${res.status}`);
    process.exit(1);
  }
  const data = (await res.json()) as FetchBibleBookJson;
  const chapters = data?.contents;
  // fetch.bible: contents[0] is empty, contents[1]=ch1, contents[2]=ch2, ... so contents[chapter]=chapter N
  if (!Array.isArray(chapters) || !chapters[chapter]) {
    console.error(`No chapter ${chapter} in fetched book.`);
    process.exit(1);
  }
  // each chapter is [ [], verse1, verse2, ... ] (index 0 empty, verse N at index N)
  // verse can be string or array [text, {note}, ...]
  const chapterArr = chapters[chapter];
  const versesFromSource: string[] = [];
  for (let i = 1; i < chapterArr.length; i++) {
    versesFromSource.push(extractVerseText(chapterArr[i] as string | unknown[]));
  }
  // Cap to canonical verse count (KJV standard) so we don't write 40 verses into a 25-verse chapter
  const bookOrder = book.order;
  const canonicalCount = VERSE_COUNTS[bookOrder - 1]?.[chapter - 1] ?? versesFromSource.length;
  const versesInChapter =
    versesFromSource.length > canonicalCount
      ? versesFromSource.slice(0, canonicalCount)
      : versesFromSource;
  if (versesFromSource.length > canonicalCount) {
    console.log(
      `Source had ${versesFromSource.length} verses; using first ${canonicalCount} (canonical count for ${book.nameEn} ${chapter}).`
    );
  }
  console.log(
    `Source: ${versesInChapter.length} verses in chapter, ${versesInChapter.filter((t) => t.length > 0).length} non-empty.`
  );

  const col = lang === "vie" ? "contentVIE1923" : "contentKJV";
  let updated = 0;
  for (let v = 0; v < versesInChapter.length; v++) {
    const verseNum = v + 1;
    const text = versesInChapter[v] ?? "";
    if (!text) continue;

    const existing = await prisma.bibleVerseContent.findUnique({
      where: {
        bookId_chapter_verse: { bookId, chapter, verse: verseNum },
      },
      select: { [col]: true } as { contentVIE1923: string | null } | { contentKJV: string | null },
    });
    const current = existing ? (existing as Record<string, string | null>)[col] : null;
    if (!override && current != null && current.trim() !== "") continue;

    await prisma.bibleVerseContent.upsert({
      where: {
        bookId_chapter_verse: { bookId, chapter, verse: verseNum },
      },
      create: {
        bookId,
        chapter,
        verse: verseNum,
        ...(lang === "vie" ? { contentVIE1923: text } : { contentKJV: text }),
      },
      update: lang === "vie" ? { contentVIE1923: text } : { contentKJV: text },
    });
    updated++;
    console.log(`  verse ${verseNum}: ${override ? "overwritten" : "filled"}`);
  }

  console.log(`Done. ${updated} verses updated (${lang}, ${book.nameEn} ch.${chapter}, fetch.bible).`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
