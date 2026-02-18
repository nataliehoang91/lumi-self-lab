-- CreateTable
CREATE TABLE "FlashVerse" (
    "id" TEXT NOT NULL,
    "book" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "verse" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlashVerse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FlashVerse_book_chapter_verse_idx" ON "FlashVerse"("book", "chapter", "verse");

-- CreateIndex
CREATE INDEX "FlashVerse_version_idx" ON "FlashVerse"("version");

-- CreateIndex
CREATE INDEX "FlashVerse_language_idx" ON "FlashVerse"("language");
