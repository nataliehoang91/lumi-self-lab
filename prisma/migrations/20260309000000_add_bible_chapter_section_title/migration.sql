-- AlterTable: add optional sectionTitle to BibleChapter (chapter/section heading only; does not touch verse content).
ALTER TABLE "BibleChapter" ADD COLUMN "sectionTitle" TEXT;
