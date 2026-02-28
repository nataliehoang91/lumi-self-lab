-- CreateTable
CREATE TABLE "BibleStudyPassage" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "verseStart" INTEGER,
    "verseEnd" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleStudyPassage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BibleStudyPassage_listId_idx" ON "BibleStudyPassage"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "BibleStudyPassage_listId_bookId_chapter_verseStart_verseEnd_key" ON "BibleStudyPassage"("listId", "bookId", "chapter", "verseStart", "verseEnd");

-- AddForeignKey
ALTER TABLE "BibleStudyPassage" ADD CONSTRAINT "BibleStudyPassage_listId_fkey" FOREIGN KEY ("listId") REFERENCES "BibleStudyList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
