-- AlterTable
ALTER TABLE "BibleChapter" ADD COLUMN     "subtitleSearchTerms" TEXT[] DEFAULT ARRAY[]::TEXT[];
