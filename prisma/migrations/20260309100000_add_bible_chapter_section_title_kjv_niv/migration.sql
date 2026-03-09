-- AlterTable: add version-specific section titles for KJV and NIV (optional; fallback remains sectionTitle).
ALTER TABLE "BibleChapter" ADD COLUMN "sectionTitleKJV" TEXT;
ALTER TABLE "BibleChapter" ADD COLUMN "sectionTitleNIV" TEXT;
