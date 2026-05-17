import { notFound } from "next/navigation";
import { getBooks, getChapterContent } from "@/app/actions/bible/read";
import {
  getStudyListById,
  getPassagesForStudyList,
  getNotesForList,
  getHighlightsForList,
} from "@/app/actions/bible/study";

interface PrintPageProps {
  params: Promise<{ lang: string; listId: string }>;
}

const HIGHLIGHT_STYLES: Record<string, string> = {
  yellow: "background:#fef08a",
  blue:   "background:#bfdbfe",
  pink:   "background:#fbcfe8",
  green:  "background:#bbf7d0",
};

export default async function StudyPrintPage({ params }: PrintPageProps) {
  const { lang, listId } = await params;

  const [list, books, passages, notes, highlights] = await Promise.all([
    getStudyListById(listId),
    getBooks(),
    getPassagesForStudyList(listId),
    getNotesForList(listId),
    getHighlightsForList(listId),
  ]);

  if (!list) notFound();

  const chapterPassages = passages.filter((p) => p.verseStart === null);
  const version = lang === "vi" ? "vi" : "niv";

  const chapterContents = await Promise.all(
    chapterPassages.map((p) => getChapterContent(p.bookId, p.chapter, version))
  );

  const highlightIndex: Record<string, string> = {};
  for (const h of highlights) {
    highlightIndex[`${h.bookId}:${h.chapter}:${h.verseNumber}`] = h.color;
  }
  const noteIndex: Record<string, string> = {};
  for (const n of notes) {
    noteIndex[`${n.bookId}:${n.chapter}:${n.verseNumber ?? ""}`] = n.content;
  }

  // Group by book
  type GroupedChapter = { bookId: string; bookName: string; chapter: number; content: NonNullable<Awaited<ReturnType<typeof getChapterContent>>> };
  const groups: GroupedChapter[] = [];
  chapterPassages.forEach((p, i) => {
    const content = chapterContents[i];
    if (!content) return;
    const book = books.find((b) => b.id === p.bookId);
    if (!book) return;
    const bookName = lang === "vi" ? (book.nameVi ?? book.nameEn) : book.nameEn;
    groups.push({ bookId: p.bookId, bookName, chapter: p.chapter, content });
  });
  groups.sort((a, b) => {
    const ba = books.find((b) => b.id === a.bookId)!;
    const bb = books.find((b) => b.id === b.bookId)!;
    return ba.order !== bb.order ? ba.order - bb.order : a.chapter - b.chapter;
  });

  // Group consecutive same-book chapters
  const bookSections: { bookName: string; chapters: typeof groups }[] = [];
  for (const g of groups) {
    const last = bookSections[bookSections.length - 1];
    if (last && last.bookName === g.bookName) last.chapters.push(g);
    else bookSections.push({ bookName: g.bookName, chapters: [g] });
  }

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <title>{list.title} — Scripture Space</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: Georgia, serif; font-size: 11pt; line-height: 1.7; color: #1a1a1a; background: #fff; padding: 12mm 14mm; }
          h1 { font-size: 18pt; font-weight: 700; margin-bottom: 4pt; }
          .meta { font-size: 9pt; color: #666; margin-bottom: 20pt; }
          .book-title { font-size: 14pt; font-weight: 700; margin: 20pt 0 6pt; color: #7c3f1a; border-bottom: 1.5pt solid #e5c9b0; padding-bottom: 4pt; }
          .chapter-title { font-size: 11pt; font-weight: 600; margin: 14pt 0 4pt; color: #444; letter-spacing: 0.05em; text-transform: uppercase; }
          .section-title { font-size: 9pt; font-style: italic; color: #888; margin-bottom: 6pt; }
          .verse { display: flex; gap: 8pt; margin-bottom: 2pt; }
          .vnum { font-size: 8pt; font-weight: 700; color: #b06040; min-width: 18pt; padding-top: 2pt; }
          .vtext { flex: 1; }
          .note { font-size: 9pt; color: #5a3a6a; font-style: italic; margin: 2pt 0 4pt 26pt; padding: 3pt 6pt; border-left: 2pt solid #c4a8d8; }
          @media print {
            body { padding: 0; }
            .book-title { page-break-before: auto; }
            .chapter { page-break-inside: avoid; }
          }
        `}</style>
      </head>
      <body>
        <h1>{list.title}</h1>
        {list.description && <p className="meta">{list.description}</p>}
        <p style={{ fontSize: "9pt", color: "#999", marginBottom: "20pt" }}>
          Scripture Space · {new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        {bookSections.map((section) => (
          <div key={section.bookName}>
            <div className="book-title">{section.bookName}</div>
            {section.chapters.map(({ bookId, chapter, content }) => {
              const chapterNote = noteIndex[`${bookId}:${chapter}:`];
              return (
                <div key={`${bookId}:${chapter}`} className="chapter">
                  <div className="chapter-title">{lang === "vi" ? `Chương ${chapter}` : `Chapter ${chapter}`}</div>
                  {content.sectionTitle?.trim() && (
                    <div className="section-title">{content.sectionTitle.trim()}</div>
                  )}
                  {chapterNote && (
                    <div className="note" dangerouslySetInnerHTML={{ __html: chapterNote.startsWith("<") ? chapterNote : chapterNote }} />
                  )}
                  <div style={{ marginBottom: "10pt" }}>
                    {content.verses.map((v) => {
                      const hl = highlightIndex[`${bookId}:${chapter}:${v.number}`];
                      const vNote = noteIndex[`${bookId}:${chapter}:${v.number}`];
                      return (
                        <div key={v.number}>
                          <div
                            className="verse"
                            style={hl ? { borderRadius: "3pt", padding: "1pt 3pt", ...(HIGHLIGHT_STYLES[hl] ? { background: HIGHLIGHT_STYLES[hl].replace("background:", "") } : {}) } : undefined}
                          >
                            <span className="vnum">{v.number}</span>
                            <span className="vtext">{v.text}</span>
                          </div>
                          {vNote && (
                            <div className="note" dangerouslySetInnerHTML={{ __html: vNote.startsWith("<") ? vNote : vNote }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </body>
    </html>
  );
}
