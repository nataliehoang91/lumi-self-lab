-- AlterTable
ALTER TABLE "BibleBook" ADD COLUMN "slugEn" TEXT;

-- CreateTable
CREATE TABLE "BibleBookOverview" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "author" TEXT,
    "date" TEXT,
    "audience" TEXT,
    "themes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "christConnection" TEXT,
    "keyVerses" JSONB,
    "outline" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleBookOverview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BibleBook_slugEn_key" ON "BibleBook"("slugEn");

-- CreateIndex
CREATE INDEX "BibleBook_slugEn_idx" ON "BibleBook"("slugEn");

-- CreateIndex
CREATE UNIQUE INDEX "BibleBookOverview_bookId_language_key" ON "BibleBookOverview"("bookId", "language");

-- CreateIndex
CREATE INDEX "BibleBookOverview_bookId_idx" ON "BibleBookOverview"("bookId");

-- CreateIndex
CREATE INDEX "BibleBookOverview_language_idx" ON "BibleBookOverview"("language");

-- AddForeignKey
ALTER TABLE "BibleBookOverview" ADD CONSTRAINT "BibleBookOverview_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BibleBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
