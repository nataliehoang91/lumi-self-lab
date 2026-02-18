-- CreateTable
CREATE TABLE "BibleBook" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameVi" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "chapterCount" INTEGER NOT NULL,

    CONSTRAINT "BibleBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BibleBook_order_key" ON "BibleBook"("order");

-- CreateIndex
CREATE INDEX "BibleBook_order_idx" ON "BibleBook"("order");

-- AlterTable: add bookId to FlashVerse
ALTER TABLE "FlashVerse" ADD COLUMN "bookId" TEXT;

-- CreateIndex
CREATE INDEX "FlashVerse_bookId_idx" ON "FlashVerse"("bookId");

-- AddForeignKey
ALTER TABLE "FlashVerse" ADD CONSTRAINT "FlashVerse_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BibleBook"("id") ON DELETE SET NULL ON UPDATE CASCADE;
