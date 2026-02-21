# Refetch fallback when content is still null

If you run the chapter refetch and **content is still null** for a book/chapter (e.g. bookId `cmlrtnd75004a8sfv40olpyoo`, chapter 7), the current sources (thiagobodruk/bible, aruljohn/Bible-niv) may be missing or bad data. Use an alternative API to fill that chapter.

## 1. Run refetch (primary sources)

**Override whole chapter** (overwrite all verses for this language; verse numbers unchanged):

```bash
npx tsx prisma/seed/refetch-chapter-by-lang.ts --bookId=cmlrtnd75004a8sfv40olpyoo --chapter=7 --lang=vie --override
```

Without `--override`: only fills rows where that language is null.

## 2. Check for remaining nulls

Run the SQL in `scripts/check-bible-verse-content-null.sql` **section 9** (bookId `cmlrtnd75004a8sfv40olpyoo`, chapter 7). If any rows still show `NULL` for a language, continue to step 3.

## 3. Use a fallback API (Judges ch.7 = bookId `cmlrtnd75004a8sfv40olpyoo`, chapter 7)

Judges 7 has **25 verses** (standard KJV). If the primary source (thiagobodruk) only has 24, use fetch.bible – it has 25.

- **fetch.bible (KJV – 25 verses):**
  ```bash
  npx tsx prisma/seed/refetch-chapter-fetch-bible.ts --bookId=cmlrtnd75004a8sfv40olpyoo --chapter=7 --lang=kjv --override
  ```
- **fetch.bible (Vietnamese – default `vie_kt` = Vietnamese Bible 1925):**
  ```bash
  npx tsx prisma/seed/refetch-chapter-fetch-bible.ts --bookId=cmlrtnd75004a8sfv40olpyoo --chapter=7 --lang=vie --override
  ```
  Other Vietnamese: `FETCH_BIBLE_VIE_ID=vie_bib` for Open Vietnamese Contemporary.  
  **Note:** Chapter indexing was fixed (fetch.bible uses contents[1]=ch1, contents[7]=ch7; we now use the correct index).
- **API.Bible** – Requires an API key; check their catalog for Vietnamese.
- **Gratis Bible** – [gratis.bible](https://gratis.bible) has Vietnamese (e.g. vietnvb); no simple JSON API; use for manual copy or a custom scraper if needed.

The script `prisma/seed/refetch-chapter-fetch-bible.ts` uses fetch.bible only. It updates only rows where the selected language column is null (same fill-once behavior as the main refetch).
