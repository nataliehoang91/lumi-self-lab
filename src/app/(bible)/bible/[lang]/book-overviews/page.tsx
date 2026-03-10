import type { Metadata } from "next";
import { getBooksWithSlug } from "@/app/actions/bible/book-overview";
import { BookOverviewsPageContent } from "@/components/Bible/BookOverviews/BookOverviewsPageContent";

export const metadata: Metadata = {
  title: "Book Overviews",
  description:
    "Table of contents: the 66 books of the Bible. Explore each book with overviews, themes, key verses, and connections to Christ.",
};

const OT_ORDER_MAX = 39; // order 1–39 = Old Testament, 40–66 = New Testament

type Params = Promise<{ lang: string }>;

export default async function BookOverviewsPage({ params }: { params: Params }) {
  const { lang } = await params;
  const segment = lang?.toLowerCase() ?? "en";
  const books = await getBooksWithSlug();
  const withSlug = books.filter(
    (b): b is typeof b & { slugEn: string } => b.slugEn != null
  );

  const otBooks = withSlug.filter((b) => b.order <= OT_ORDER_MAX);
  const ntBooks = withSlug.filter((b) => b.order > OT_ORDER_MAX);
  const totalChapters = withSlug.reduce((sum, b) => sum + b.chapterCount, 0);

  return (
    <BookOverviewsPageContent
      segment={segment}
      otBooks={otBooks}
      ntBooks={ntBooks}
      totalChapters={totalChapters}
    />
  );
}
