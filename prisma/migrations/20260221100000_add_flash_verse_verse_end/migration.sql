-- AlterTable: add optional verseEnd to FlashVerse for range cards (e.g. Luke 1:21-22)
ALTER TABLE "FlashVerse" ADD COLUMN IF NOT EXISTS "verseEnd" INTEGER;
