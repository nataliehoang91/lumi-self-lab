import { notFound } from "next/navigation";
import { getBooks, getChapterContent } from "@/app/actions/bible/read";
import {
  getStudyListById,
  getPassagesForStudyList,
  getNotesForList,
  getHighlightsForList,
} from "@/app/actions/bible/study";
import { PrintControls } from "../PrintControls";

interface PrintPageProps {
  params: Promise<{ listId: string }>;
  searchParams: Promise<{ lang?: string; version?: string; chapters?: string }>;
}

const HIGHLIGHT_BG: Record<string, string> = {
  yellow: "#fef08a",
  blue:   "#bfdbfe",
  pink:   "#fbcfe8",
  green:  "#bbf7d0",
};

export default async function StudyPrintPage({ params, searchParams }: PrintPageProps) {
  const { listId } = await params;
  const { lang = "en", version: versionParam, chapters: chaptersParam } = await searchParams;
  const version = (versionParam ?? (lang === "vi" ? "vi" : "niv")) as "vi" | "niv" | "kjv";
  // chapters param: "bookId:chapter,bookId:chapter,..."
  const selectedChapters = chaptersParam
    ? new Set(chaptersParam.split(",").map((s: string) => s.trim()).filter(Boolean))
    : null;

  const [list, books, passages, notes, highlights] = await Promise.all([
    getStudyListById(listId),
    getBooks(),
    getPassagesForStudyList(listId),
    getNotesForList(listId),
    getHighlightsForList(listId),
  ]);

  if (!list) notFound();

  const allChapterPassages = passages.filter((p) => p.verseStart === null);
  const chapterPassages = selectedChapters
    ? allChapterPassages.filter((p) => selectedChapters.has(`${p.bookId}:${p.chapter}`))
    : allChapterPassages;

  const chapterContents = await Promise.all(
    chapterPassages.map((p) => getChapterContent(p.bookId, p.chapter, version))
  );

  const hlIndex: Record<string, string> = {};
  for (const h of highlights) hlIndex[`${h.bookId}:${h.chapter}:${h.verseNumber}`] = h.color;

  const noteIndex: Record<string, string> = {};
  for (const n of notes) noteIndex[`${n.bookId}:${n.chapter}:${n.verseNumber ?? ""}`] = n.content;

  type GroupItem = { bookId: string; bookName: string; chapter: number; content: NonNullable<typeof chapterContents[0]> };
  const items: GroupItem[] = [];
  chapterPassages.forEach((p, i) => {
    const content = chapterContents[i];
    if (!content) return;
    const book = books.find((b) => b.id === p.bookId);
    if (!book) return;
    items.push({
      bookId: p.bookId,
      bookName: lang === "vi" ? (book.nameVi ?? book.nameEn) : book.nameEn,
      chapter: p.chapter,
      content,
    });
  });
  items.sort((a, b) => {
    const oa = books.find((bk) => bk.id === a.bookId)?.order ?? 0;
    const ob = books.find((bk) => bk.id === b.bookId)?.order ?? 0;
    return oa !== ob ? oa - ob : a.chapter - b.chapter;
  });

  const bookGroups: { bookName: string; bookId: string; chapters: GroupItem[] }[] = [];
  for (const item of items) {
    const last = bookGroups[bookGroups.length - 1];
    if (last && last.bookId === item.bookId) last.chapters.push(item);
    else bookGroups.push({ bookName: item.bookName, bookId: item.bookId, chapters: [item] });
  }

  const printDate = new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Georgia, "Times New Roman", serif; font-size: 11.5pt; line-height: 1.75; color: #1a1a1a; background: #fff !important; }
        #print-root { padding: 0 18mm 0; max-width: 820px; margin: 0 auto; }

        /* Cover block */
        .cover { padding: 24pt 0 16pt; border-bottom: 1.5pt solid #e0d5cc; margin-bottom: 18pt; }
        h1.list-title { font-size: 22pt; font-weight: 700; color: #1a1a1a; margin-bottom: 3pt; }
        .list-desc { font-size: 10.5pt; color: #666; margin-bottom: 6pt; }
        .cover-meta { font-size: 9pt; color: #aaa; letter-spacing: 0.04em; }

        /* Book / chapter */
        .book-title { font-size: 15pt; font-weight: 700; color: #7c3f1a; border-bottom: 1.5pt solid #e5c9b0; padding-bottom: 4pt; margin: 22pt 0 8pt; }
        .chapter-block { margin-bottom: 14pt; }
        .chapter-title { font-size: 10.5pt; font-weight: 600; color: #444; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2pt; }
        .section-title { font-size: 9.5pt; font-style: italic; color: #888; margin-bottom: 5pt; }
        .chapter-note { font-size: 9.5pt; color: #5a3a6a; font-style: italic; border-left: 2pt solid #c4a8d8; padding: 3pt 8pt; margin-bottom: 6pt; background: #f9f5fc; }
        .verse { display: flex; gap: 7pt; margin-bottom: 1.5pt; }
        .vnum { font-size: 8pt; font-weight: 700; color: #c06a40; min-width: 18pt; padding-top: 3pt; flex-shrink: 0; }
        .vtext { flex: 1; }
        .verse-note { font-size: 9.5pt; color: #5a3a6a; font-style: italic; border-left: 2pt solid #c4a8d8; padding: 2pt 8pt; margin: 1pt 0 4pt 25pt; background: #f9f5fc; }

        /* Running header — repeats on every printed page */
        .running-header {
          display: none;
          position: fixed; top: 0; left: 0; right: 0;
          height: 36pt;
          align-items: center; justify-content: space-between;
          padding: 0 18mm;
          border-bottom: 0.75pt solid #e0d5cc;
          background: #fff;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 8pt; color: #999;
        }
        .running-header .brand { display: flex; align-items: center; gap: 5pt; }
        .running-header .brand-mark { width: 14pt; height: 14pt; background: #f97316; border-radius: 4pt; display: flex; align-items: center; justify-content: center; }
        .running-header .brand-name { font-weight: 700; color: #555; font-size: 8.5pt; }
        .running-header .list-name { font-weight: 600; color: #333; font-size: 8.5pt; max-width: 200pt; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .running-header .ver-badge { background: #fef3e8; color: #c2410c; border: 0.5pt solid #fed7aa; border-radius: 3pt; padding: 0.5pt 4pt; font-size: 7.5pt; font-weight: 700; }

        /* Running footer — repeats on every printed page */
        .running-footer {
          display: none;
          position: fixed; bottom: 0; left: 0; right: 0;
          height: 28pt;
          align-items: center; justify-content: space-between;
          padding: 0 18mm;
          border-top: 0.75pt solid #e0d5cc;
          background: #fff;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 7.5pt; color: #bbb;
        }

        @page { size: A4; margin: 0; }
        @media print {
          body { background: white !important; }
          #print-controls { display: none !important; }
          #print-root { padding-top: 48pt; padding-bottom: 36pt; }
          .running-header { display: flex !important; }
          .running-footer { display: flex !important; }
          .book-title { page-break-before: auto; }
          .chapter-block { page-break-inside: avoid; }
        }
      `}</style>

      {/* Running header — fixed, repeats on every print page */}
      <div className="running-header">
        <div className="brand">
          <div className="brand-mark">
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
              <path d="M5 1L6.5 4H9.5L7 6L8 9L5 7L2 9L3 6L0.5 4H3.5L5 1Z" fill="white" />
            </svg>
          </div>
          <span className="brand-name">SelfWithin</span>
          <span style={{ color: "#ddd" }}>·</span>
          <span style={{ color: "#aaa", fontSize: "7.5pt" }}>Scripture·Space</span>
        </div>
        <span className="list-name">{list.title}</span>
        <span className="ver-badge">{version.toUpperCase()}</span>
      </div>

      {/* Running footer — fixed, repeats on every print page */}
      <div className="running-footer">
        <span>selfwithin.space · {lang === "vi" ? "Khám phá nội tâm của bạn" : "Explore your inner life"} · {lang === "vi" ? "Được tạo bởi" : "Powered by"} Claude</span>
        <span>{printDate}</span>
      </div>

      <PrintControls title={list.title} />

      <div id="print-root" style={{ paddingTop: "60px" }}>
        <div className="cover">
          <h1 className="list-title">{list.title}</h1>
          {list.description && <p className="list-desc">{list.description}</p>}
          <p className="cover-meta">Scripture·Space · {printDate} · {version.toUpperCase()} · {chapterPassages.length} {lang === "vi" ? "chương" : "chapters"}</p>
        </div>

        {bookGroups.map((group) => (
          <div key={group.bookId}>
            <div className="book-title">{group.bookName}</div>
            {group.chapters.map(({ bookId, chapter, content }) => {
              const chapterNote = noteIndex[`${bookId}:${chapter}:`];
              return (
                <div key={`${bookId}:${chapter}`} className="chapter-block">
                  <div className="chapter-title">
                    {lang === "vi" ? `Chương ${chapter}` : `Chapter ${chapter}`}
                  </div>
                  {content.sectionTitle?.trim() && (
                    <div className="section-title">{content.sectionTitle.trim()}</div>
                  )}
                  {chapterNote && (
                    <div className="chapter-note" dangerouslySetInnerHTML={{ __html: chapterNote }} />
                  )}
                  {content.verses.map((v) => {
                    const hl = hlIndex[`${bookId}:${chapter}:${v.number}`];
                    const vNote = noteIndex[`${bookId}:${chapter}:${v.number}`];
                    return (
                      <div key={v.number}>
                        <div
                          className="verse"
                          style={hl ? { background: HIGHLIGHT_BG[hl] ?? "transparent", borderRadius: "3px", padding: "1px 4px", margin: "0 -4px" } : undefined}
                        >
                          <span className="vnum">{v.number}</span>
                          <span className="vtext">{v.text}</span>
                        </div>
                        {vNote && (
                          <div className="verse-note" dangerouslySetInnerHTML={{ __html: vNote }} />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}

        {bookGroups.length === 0 && (
          <p style={{ color: "#888", fontStyle: "italic", marginTop: "40px", textAlign: "center" }}>
            No chapters selected in this study list.
          </p>
        )}
      </div>
    </>
  );
}
