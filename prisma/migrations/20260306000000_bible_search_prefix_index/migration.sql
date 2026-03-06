-- Prefix search index for BibleBookSearchKey (startsWith / LIKE 'key%')
CREATE INDEX bible_search_prefix ON "BibleBookSearchKey"(lang, key text_pattern_ops);
