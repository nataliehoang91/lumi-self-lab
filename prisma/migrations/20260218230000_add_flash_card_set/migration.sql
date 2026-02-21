-- CreateTable
CREATE TABLE "FlashCardSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FlashCardSet_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FlashCardSet_sortOrder_idx" ON "FlashCardSet"("sortOrder");

-- AlterTable: add flashCardSetId to FlashVerse
ALTER TABLE "FlashVerse" ADD COLUMN "flashCardSetId" TEXT;

CREATE INDEX "FlashVerse_flashCardSetId_idx" ON "FlashVerse"("flashCardSetId");

-- AddForeignKey
ALTER TABLE "FlashVerse" ADD CONSTRAINT "FlashVerse_flashCardSetId_fkey" FOREIGN KEY ("flashCardSetId") REFERENCES "FlashCardSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
