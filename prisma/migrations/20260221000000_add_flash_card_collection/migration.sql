-- CreateTable
CREATE TABLE "FlashCardCollection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlashCardCollection_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FlashCardCollection_sortOrder_idx" ON "FlashCardCollection"("sortOrder");

-- AlterTable: add collectionId to FlashVerse
ALTER TABLE "FlashVerse" ADD COLUMN "collectionId" TEXT;

CREATE INDEX "FlashVerse_collectionId_idx" ON "FlashVerse"("collectionId");

-- AddForeignKey
ALTER TABLE "FlashVerse" ADD CONSTRAINT "FlashVerse_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "FlashCardCollection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
