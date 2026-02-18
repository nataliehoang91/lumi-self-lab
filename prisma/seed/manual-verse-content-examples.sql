-- Example: insert verse content so admin can select Book → Chapter → Verse and click Save.
-- Run after migrations and BibleBook seed. Uses book order (1–66) to resolve bookId.
-- John = 43, Psalms = 19, Philippians = 50, Genesis = 1.

INSERT INTO "BibleVerseContent" ("id", "bookId", "chapter", "verse", "contentVIE1923", "contentKJV", "contentNIV")
SELECT
  gen_random_uuid()::text,
  b.id,
  v.chapter,
  v.verse,
  v.content_vi,
  v.content_kjv,
  v.content_niv
FROM (VALUES
  (43, 3, 16,
   'Vì Đức Chúa Trời yêu thương thế gian, đến nỗi đã ban Con Một của Ngài, để ai tin Con ấy không bị hư mất mà được sự sống đời đời.',
   'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
   'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'),
  (19, 23, 1,
   'Đức Giê-hô-va là Đấng Chăn Ta, Ta chẳng thiếu thốn gì.',
   'The Lord is my shepherd; I shall not want.',
   'The Lord is my shepherd, I lack nothing.'),
  (50, 4, 13,
   'Tôi có thể làm mọi sự nhờ Đấng ban sức mạnh cho tôi.',
   'I can do all things through Christ which strengtheneth me.',
   'I can do all this through him who gives me strength.'),
  (1, 1, 1,
   'Ban đầu Đức Chúa Trời dựng nên trời và đất.',
   'In the beginning God created the heaven and the earth.',
   'In the beginning God created the heavens and the earth.'),
  (43, 1, 1,
   'Ban đầu có Ngôi Lời, Ngôi Lời ở cùng Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời.',
   'In the beginning was the Word, and the Word was with God, and the Word was God.',
   'In the beginning was the Word, and the Word was with God, and the Word was God.')
) AS v(book_order, chapter, verse, content_vi, content_kjv, content_niv)
JOIN "BibleBook" b ON b."order" = v.book_order
ON CONFLICT ("bookId", "chapter", "verse") DO UPDATE SET
  "contentVIE1923" = EXCLUDED."contentVIE1923",
  "contentKJV" = EXCLUDED."contentKJV",
  "contentNIV" = EXCLUDED."contentNIV";
