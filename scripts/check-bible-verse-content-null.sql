-- Check BibleVerseContent for any null content columns.
-- Table: "BibleVerseContent" (Prisma default naming)
-- Columns: contentVIE1923, contentKJV, contentNIV, contentZH (all nullable).

-- 1) Count rows where at least one content column is null
SELECT COUNT(*) AS rows_with_any_null_content
FROM "BibleVerseContent"
WHERE "contentVIE1923" IS NULL
   OR "contentKJV" IS NULL
   OR "contentNIV" IS NULL
   OR "contentZH" IS NULL;

-- 2) List rows with any null content (bookId, chapter, verse, which columns are null)
SELECT
  "bookId",
  "chapter",
  "verse",
  CASE WHEN "contentVIE1923" IS NULL THEN 'NULL' ELSE 'ok' END AS vie,
  CASE WHEN "contentKJV" IS NULL THEN 'NULL' ELSE 'ok' END AS kjv,
  CASE WHEN "contentNIV" IS NULL THEN 'NULL' ELSE 'ok' END AS niv,
  CASE WHEN "contentZH" IS NULL THEN 'NULL' ELSE 'ok' END AS zh
FROM "BibleVerseContent"
WHERE "contentVIE1923" IS NULL
   OR "contentKJV" IS NULL
   OR "contentNIV" IS NULL
   OR "contentZH" IS NULL
ORDER BY "bookId", "chapter", "verse"
LIMIT 500;

-- 3) Count per column (how many rows have null in each)
SELECT
  COUNT(*) FILTER (WHERE "contentVIE1923" IS NULL) AS null_vie,
  COUNT(*) FILTER (WHERE "contentKJV" IS NULL)     AS null_kjv,
  COUNT(*) FILTER (WHERE "contentNIV" IS NULL)     AS null_niv,
  COUNT(*) FILTER (WHERE "contentZH" IS NULL)      AS null_zh
FROM "BibleVerseContent";

-- 4) For book cmlrtnd7500448sfva4etjuoy, chapter 16 only: rows with any null content
SELECT
  "bookId",
  "chapter",
  "verse",
  CASE WHEN "contentVIE1923" IS NULL THEN 'NULL' ELSE 'ok' END AS vie,
  CASE WHEN "contentKJV" IS NULL THEN 'NULL' ELSE 'ok' END AS kjv,
  CASE WHEN "contentNIV" IS NULL THEN 'NULL' ELSE 'ok' END AS niv,
  CASE WHEN "contentZH" IS NULL THEN 'NULL' ELSE 'ok' END AS zh
FROM "BibleVerseContent"
WHERE "bookId" = 'cmlrtnd7500448sfva4etjuoy'
  AND "chapter" = 16
  AND ("contentVIE1923" IS NULL OR "contentKJV" IS NULL OR "contentNIV" IS NULL OR "contentZH" IS NULL)
ORDER BY "verse";

-- 5) Full list: all verses in book cmlrtnd7500448sfva4etjuoy, chapter 16 (every verse in that chapter)
SELECT
  "bookId",
  "chapter",
  "verse",
  "contentVIE1923",
  CASE WHEN "contentVIE1923" IS NULL THEN 'NULL' ELSE 'ok' END AS vie,
  CASE WHEN "contentKJV" IS NULL THEN 'NULL' ELSE 'ok' END AS kjv,
  CASE WHEN "contentNIV" IS NULL THEN 'NULL' ELSE 'ok' END AS niv,
  CASE WHEN "contentZH" IS NULL THEN 'NULL' ELSE 'ok' END AS zh
FROM "BibleVerseContent"
WHERE "bookId" = 'cmlrtnd7500448sfva4etjuoy'
  AND "chapter" = 16
ORDER BY "verse";

-- 6) VIE only: book cmlrtnd7500448sfva4etjuoy, chapter 16 (verse + Vietnamese content)
SELECT "verse", "contentVIE1923" AS vie
FROM "BibleVerseContent"
WHERE "bookId" = 'cmlrtnd7500448sfva4etjuoy'
  AND "chapter" = 16
ORDER BY "verse";

-- 7) SHIFT VIE down by one verse (row 15→16, 14→15, … 1→2, then verse 1 = NULL).
--    Run inside a transaction; commit only if result looks correct.
-- BEGIN;
UPDATE "BibleVerseContent" b
SET "contentVIE1923" = prev."contentVIE1923"
FROM "BibleVerseContent" prev
WHERE b."bookId" = prev."bookId"
  AND b."chapter" = prev."chapter"
  AND b."verse" = prev."verse" + 1
  AND b."bookId" = 'cmlrtnd7500448sfva4etjuoy'
  AND b."chapter" = 16;

UPDATE "BibleVerseContent"
SET "contentVIE1923" = NULL
WHERE "bookId" = 'cmlrtnd7500448sfva4etjuoy'
  AND "chapter" = 16
  AND "verse" = 1;
-- COMMIT;

-- 8) REVERSE the shift (undo): shift VIE *up* by one (verse 2→1, 3→2, …).
--    Use this if you ran 7) by mistake. Book/chapter below = the one you shifted.
--    After this: verse 1 gets back content from verse 2, verse 2 from verse 3, …
--    The *last* verse row keeps its current content (original last verse was lost when you shifted).
-- BEGIN;
UPDATE "BibleVerseContent" b
SET "contentVIE1923" = next_row."contentVIE1923"
FROM "BibleVerseContent" next_row
WHERE b."bookId" = next_row."bookId"
  AND b."chapter" = next_row."chapter"
  AND b."verse" + 1 = next_row."verse"
  AND b."bookId" = 'cmlrtnd75004a8sfv40olpyoo'
  AND b."chapter" = 5;
-- COMMIT;

-- 9) Check nulls AFTER refetch: bookId cmlrtnd75004a8sfv40olpyoo, chapter 7
--    If any row still has null content for a language, the current source may be missing data;
--    consider using an alternative API (see scripts/refetch-fallback-api.md).
SELECT
  "bookId",
  "chapter",
  "verse",
  CASE WHEN "contentVIE1923" IS NULL THEN 'NULL' ELSE 'ok' END AS vie,
  CASE WHEN "contentKJV" IS NULL THEN 'NULL' ELSE 'ok' END AS kjv,
  CASE WHEN "contentNIV" IS NULL THEN 'NULL' ELSE 'ok' END AS niv,
  CASE WHEN "contentZH" IS NULL THEN 'NULL' ELSE 'ok' END AS zh
FROM "BibleVerseContent"
WHERE "bookId" = 'cmlrtnd75004a8sfv40olpyoo'
  AND "chapter" = 7
  AND ("contentVIE1923" IS NULL OR "contentKJV" IS NULL OR "contentNIV" IS NULL OR "contentZH" IS NULL)
ORDER BY "verse";
