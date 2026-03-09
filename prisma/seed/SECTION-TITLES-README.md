# Section titles (chapter headings) for KJV, NIV, and Vietnamese

We store section titles in the DB and show them in the read view. VI uses `sectionTitle`; KJV uses `sectionTitleKJV` (fallback: `sectionTitle`); NIV uses `sectionTitleNIV` (fallback: `sectionTitle`).

## Fetch all at once (NIV, Vietnamese, KJV from API.bible)

With `API_BIBLE_KEY` in `.env`, you can fetch section titles for all three versions in one run:

```bash
npm run db:seed-section-titles-all
```

This discovers NIV, Vietnamese, and KJV Bible IDs from API.bible, then fetches sections for all 66 books and updates `sectionTitle` (VI), `sectionTitleKJV`, and `sectionTitleNIV`. If a Bible has no sections (e.g. some KJV editions return 404), that column is skipped. Optional: `--delay=800` (ms between books, default 600).

## 1. Edit the data file

Edit **`section-titles-kjv.json`** in this folder. Each line is one chapter. Use any of:

- **sectionTitle** – Fallback / VI. If this is the only one you set, the loader writes it to all three columns so KJV and NIV show it too.
- **sectionTitleKJV** – Shown when the user reads in KJV.
- **sectionTitleNIV** – Shown when the user reads in NIV.

Example (all versions get the same heading):

```json
{ "bookNameEn": "Genesis", "chapterNumber": 1, "sectionTitle": "The creation of heaven and earth" }
```

Example (different heading for NIV):

```json
{ "bookNameEn": "Matthew", "chapterNumber": 12, "sectionTitle": "Lord of the Sabbath", "sectionTitleKJV": "Lord of the Sabbath", "sectionTitleNIV": "Jesus Is Lord of the Sabbath" }
```

- **bookNameEn** – Must match exactly: `Genesis`, `Exodus`, `1 Samuel`, `Matthew`, `1 Corinthians`, etc. (see `bible-books.ts` for the full list).
- **chapterNumber** – 1-based chapter number.

## 2. Where to find headings online

- **1611 KJV with headings** – e.g. [basicchristian.org 1611 KJV with Headings](https://www.basicchristian.org/1611-KJV-Bible_with_Headings.pdf) (PDF). You can type or copy headings from there.
- **Printed KJV** – Many editions have chapter summaries or section headings at the top of each chapter.
- **Study Bibles** – Public-domain study Bibles (e.g. Scofield) often have section titles; use only the heading text, not commentary.

## 3. Load into the database

From the project root:

```bash
npx tsx prisma/seed/load-section-titles-from-file.ts
```

Or with a custom file path:

```bash
npx tsx prisma/seed/load-section-titles-from-file.ts path/to/my-headings.json
```

The script updates `BibleChapter.sectionTitle` only; it does not change any verse content.
