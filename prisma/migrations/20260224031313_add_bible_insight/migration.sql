-- DropIndex
DROP INDEX "FlashVerse_language_idx";

-- CreateTable
CREATE TABLE "BibleInsight" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "chapterNumber" INTEGER,
    "verseNumber" INTEGER,
    "language" TEXT NOT NULL,
    "context" TEXT,
    "explanation" TEXT,
    "reflections" JSONB,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BibleInsight_bookId_chapterNumber_verseNumber_language_idx" ON "BibleInsight"("bookId", "chapterNumber", "verseNumber", "language");

-- CreateIndex
CREATE UNIQUE INDEX "BibleInsight_bookId_chapterNumber_verseNumber_language_sour_key" ON "BibleInsight"("bookId", "chapterNumber", "verseNumber", "language", "source");

-- AddForeignKey
ALTER TABLE "BibleInsight" ADD CONSTRAINT "BibleInsight_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BibleBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
