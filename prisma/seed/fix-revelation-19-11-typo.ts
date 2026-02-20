/**
 * One-off fix: correct Vietnamese (contentVIE1923) for Revelation 19:11 in FlashVerse.
 *
 * Usage:
 *   1. Set the corrected text and run (replace with your corrected Vietnamese):
 *      CORRECTED_VI="Your corrected Vietnamese text here" npx tsx prisma/seed/fix-revelation-19-11-typo.ts
 *
 *   2. Or do a single find/replace (e.g. fix one wrong word):
 *      FIX_TYPO_FROM="wrongword" FIX_TYPO_TO="rightword" npx tsx prisma/seed/fix-revelation-19-11-typo.ts
 *
 *   3. Or edit CORRECTED_VI below and run: npx tsx prisma/seed/fix-revelation-19-11-typo.ts
 *
 * Alternative: use Admin UI → Bible → Flashcard list → find Revelation 19:11 → Edit → fix "Content (Vietnamese)" → Save.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BOOK = "Revelation";
const CHAPTER = 19;
const VERSE = 11;

async function main() {
  const fromEnv = process.env.CORRECTED_VI?.trim();
  const fixFrom = process.env.FIX_TYPO_FROM?.trim();
  const fixTo = process.env.FIX_TYPO_TO ?? "";

  const row = await prisma.flashVerse.findFirst({
    where: { book: BOOK, chapter: CHAPTER, verse: VERSE },
  });

  if (!row) {
    console.log(`No FlashVerse found for ${BOOK} ${CHAPTER}:${VERSE}. Add it via Admin first.`);
    return;
  }

  const current = row.contentVIE1923 ?? "";
  console.log("Current Vietnamese content:");
  console.log(current || "(empty)");
  console.log("");

  let newContent: string;

  if (fromEnv) {
    newContent = fromEnv;
    console.log("Using CORRECTED_VI from environment.");
  } else if (fixFrom) {
    if (!current.includes(fixFrom)) {
      console.log(`FIX_TYPO_FROM "${fixFrom}" not found in current text. Aborting.`);
      return;
    }
    newContent = current.replace(fixFrom, fixTo);
    console.log(`Replacing "${fixFrom}" → "${fixTo}".`);
  } else {
    console.log("Set CORRECTED_VI='...' or FIX_TYPO_FROM + FIX_TYPO_TO to apply a fix.");
    return;
  }

  if (newContent === current) {
    console.log("No change; skipping update.");
    return;
  }

  await prisma.flashVerse.update({
    where: { id: row.id },
    data: {
      contentVIE1923: newContent,
      content: newContent || row.content,
    },
  });
  console.log("Updated FlashVerse: Revelation 19:11 Vietnamese.");

  // Also fix BibleVerseContent if it exists (so Admin "Add verse" gets correct text)
  const book = await prisma.bibleBook.findFirst({ where: { nameEn: BOOK } });
  if (book) {
    const contentRow = await prisma.bibleVerseContent.findUnique({
      where: {
        bookId_chapter_verse: { bookId: book.id, chapter: CHAPTER, verse: VERSE },
      },
    });
    if (contentRow) {
      await prisma.bibleVerseContent.update({
        where: {
          bookId_chapter_verse: { bookId: book.id, chapter: CHAPTER, verse: VERSE },
        },
        data: { contentVIE1923: newContent },
      });
      console.log("Updated BibleVerseContent: Revelation 19:11 Vietnamese.");
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
