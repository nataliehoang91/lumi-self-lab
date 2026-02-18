-- CreateTable
CREATE TABLE "BibleChapter" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL,
    "verseCount" INTEGER NOT NULL,

    CONSTRAINT "BibleChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BibleVerseContent" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "verse" INTEGER NOT NULL,
    "contentVIE1923" TEXT,
    "contentKJV" TEXT,
    "contentNIV" TEXT,

    CONSTRAINT "BibleVerseContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BibleChapter_bookId_chapterNumber_key" ON "BibleChapter"("bookId", "chapterNumber");

-- CreateIndex
CREATE INDEX "BibleChapter_bookId_idx" ON "BibleChapter"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "BibleVerseContent_bookId_chapter_verse_key" ON "BibleVerseContent"("bookId", "chapter", "verse");

-- CreateIndex
CREATE INDEX "BibleVerseContent_bookId_idx" ON "BibleVerseContent"("bookId");

-- AddForeignKey
ALTER TABLE "BibleChapter" ADD CONSTRAINT "BibleChapter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BibleBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BibleVerseContent" ADD CONSTRAINT "BibleVerseContent_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BibleBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
