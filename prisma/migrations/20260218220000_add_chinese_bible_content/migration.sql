-- Add Chinese (CUV) support: BibleBook.nameZh, BibleVerseContent.contentZH, FlashVerse.titleZh + contentZH
ALTER TABLE "BibleBook" ADD COLUMN IF NOT EXISTS "nameZh" TEXT;

ALTER TABLE "BibleVerseContent" ADD COLUMN IF NOT EXISTS "contentZH" TEXT;

ALTER TABLE "FlashVerse" ADD COLUMN IF NOT EXISTS "titleZh" TEXT;
ALTER TABLE "FlashVerse" ADD COLUMN IF NOT EXISTS "contentZH" TEXT;
