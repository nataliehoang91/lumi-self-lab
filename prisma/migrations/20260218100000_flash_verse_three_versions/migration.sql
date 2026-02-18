-- Add title and 3-version content columns
ALTER TABLE "FlashVerse" ADD COLUMN "titleEn" TEXT;
ALTER TABLE "FlashVerse" ADD COLUMN "titleVi" TEXT;
ALTER TABLE "FlashVerse" ADD COLUMN "contentVIE1923" TEXT;
ALTER TABLE "FlashVerse" ADD COLUMN "contentKJV" TEXT;
ALTER TABLE "FlashVerse" ADD COLUMN "contentNIV" TEXT;

-- Make legacy columns nullable
ALTER TABLE "FlashVerse" ALTER COLUMN "content" DROP NOT NULL;
ALTER TABLE "FlashVerse" ALTER COLUMN "version" DROP NOT NULL;
ALTER TABLE "FlashVerse" ALTER COLUMN "language" DROP NOT NULL;
