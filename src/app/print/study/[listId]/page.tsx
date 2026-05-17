import { notFound } from "next/navigation";
import { getBooks, getChapterContent } from "@/app/actions/bible/read";
import {
  getStudyListById,
  getPassagesForStudyList,
  getNotesForList,
  getHighlightsForList,
} from "@/app/actions/bible/study";

interface PrintPageProps {
  params: Promise<{ listId: string }>;
  searchParams: Promise<{ lang?: string; version?: string }>;
}

const HIGHLIGHT_BG: Record<string, string> = {
  yellow: "#fef08a",
  blue:   "#bfdbfe",
  pink:   "#fbcfe8",
  green:  "#bbf7d0",
};

export default async function StudyPrintPage({ params, searchParams }: PrintPageProps) {
  const { listId } = await params;
  const { lang = "en", version: versionParam } = await searchParams;
  const version = (versionParam ?? (lang === "vi" ? "vi" : "niv")) as "vi" | "niv" | "kjv";

  const [list, books, passages, notes, highlights] = await Promise.all([
    getStudyListById(listId),
    getBooks(),
    getPassagesForStudyList(listId),
    getNotesForList(listId),
    getHighlightsForList(listId),
  ]);

  if (!list) notFound();

  const chapterPassages = passages.filter((p) => p.verseStart === null);

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
    const oa = books.find((b) => b.id === a.bookId)?.order ?? 0;
    const ob = books.find((b) => b.id === b.bookId)?.order ?? 0;
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
        body, #print-root { font-family: Georgia, "Times New Roman", serif; font-size: 11.5pt; line-height: 1.75; color: #1a1a1a; background: #fff !important; background-image: none !important; }
        #print-root { padding: 20mm 18mm; max-width: 800px; margin: 0 auto; }
        h1.list-title { font-size: 20pt; font-weight: 700; margin-bottom: 3pt; }
        .list-desc { font-size: 10pt; color: #555; margin-bottom: 4pt; }
        .print-meta { font-size: 9pt; color: #999; border-bottom: 1pt solid #e0e0e0; padding-bottom: 10pt; margin-bottom: 16pt; }
        .book-title { font-size: 15pt; font-weight: 700; color: #7c3f1a; border-bottom: 1.5pt solid #e5c9b0; padding-bottom: 4pt; margin: 22pt 0 8pt; }
        .chapter-block { margin-bottom: 14pt; }
        .chapter-title { font-size: 10.5pt; font-weight: 600; color: #444; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2pt; }
        .section-title { font-size: 9.5pt; font-style: italic; color: #888; margin-bottom: 5pt; }
        .chapter-note { font-size: 9.5pt; color: #5a3a6a; font-style: italic; border-left: 2pt solid #c4a8d8; padding: 3pt 8pt; margin-bottom: 6pt; background: #f9f5fc; }
        .verse { display: flex; gap: 7pt; margin-bottom: 1.5pt; }
        .vnum { font-size: 8pt; font-weight: 700; color: #c06a40; min-width: 18pt; padding-top: 3pt; flex-shrink: 0; }
        .vtext { flex: 1; }
        .verse-note { font-size: 9.5pt; color: #5a3a6a; font-style: italic; border-left: 2pt solid #c4a8d8; padding: 2pt 8pt; margin: 1pt 0 4pt 25pt; background: #f9f5fc; }
        @media print {
          body, #print-root { background: white !important; background-image: none !important; }
          #print-controls { display: none !important; }
          .book-title { page-break-before: auto; }
          .chapter-block { page-break-inside: avoid; }
        }
      `}</style>

      {/* Print controls — hidden when printing */}
      <div id="print-controls" style={{ position: "fixed", top: 0, right: 0, left: 0, background: "#f5f5f5", borderBottom: "1px solid #ddd", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100 }}>
        <span style={{ fontSize: "13px", fontFamily: "system-ui, sans-serif", color: "#333", fontWeight: 600 }}>
          {list.title} — Print Preview
        </span>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => window.print()}
            style={{ fontFamily: "system-ui, sans-serif", fontSize: "13px", background: "#c2410c", color: "#fff", border: "none", borderRadius: "8px", padding: "6px 18px", cursor: "pointer", fontWeight: 600 }}
          >
            Print / Save as PDF
          </button>
          <button
            onClick={() => window.close()}
            style={{ fontFamily: "system-ui, sans-serif", fontSize: "13px", background: "#e5e7eb", color: "#333", border: "none", borderRadius: "8px", padding: "6px 14px", cursor: "pointer" }}
          >
            Close
          </button>
        </div>
      </div>

      <div id="print-root" style={{ paddingTop: "60px" }}>
        <h1 className="list-title">{list.title}</h1>
        {list.description && <p className="list-desc">{list.description}</p>}
        <p className="print-meta">Scripture Space · {printDate} · {version.toUpperCase()}</p>

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
