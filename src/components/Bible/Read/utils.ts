import { OT_ORDER_MAX, type TestamentFilter } from "./constants";
import type { BibleBook } from "./types";
import type { VersionId } from "./constants";

export function getOtBooks(books: BibleBook[]): BibleBook[] {
  return books.filter((b) => b.order <= OT_ORDER_MAX);
}

export function getNtBooks(books: BibleBook[]): BibleBook[] {
  return books.filter((b) => b.order > OT_ORDER_MAX);
}

export function getBookDisplayName(book: BibleBook | null, version: VersionId): string {
  if (!book) return "";
  if (version === "vi") return book.nameVi;
  if (version === "zh") return book.nameZh ?? book.nameEn;
  return book.nameEn;
}

export function getBookLabelForSelection(
  book: BibleBook,
  left: VersionId | null,
  right: VersionId | null
): string {
  const onlyLeft = left !== null && right === null;
  const onlyRight = left === null && right !== null;
  if (onlyLeft) return getBookDisplayName(book, left);
  if (onlyRight) return getBookDisplayName(book, right);
  if (left === null || right === null) return book.nameEn;

  const isEn = (v: VersionId) => v === "kjv" || v === "niv";
  const leftEn = isEn(left);
  const rightEn = isEn(right);
  if (leftEn && rightEn) return book.nameEn;
  if (left === "vi" && right === "zh") return `${book.nameVi} (${book.nameZh ?? book.nameEn})`;
  if (left === "zh" && right === "vi") return `${book.nameVi} (${book.nameZh ?? book.nameEn})`;
  if ((left === "vi" && rightEn) || (right === "vi" && leftEn))
    return `${book.nameVi} / ${book.nameEn}`;
  if ((left === "zh" && rightEn) || (right === "zh" && leftEn))
    return book.nameZh ? `${book.nameEn} (${book.nameZh})` : book.nameEn;
  return book.nameEn;
}

export function getFilteredBooks(
  books: BibleBook[],
  filter: TestamentFilter,
  otBooks: BibleBook[],
  ntBooks: BibleBook[]
): BibleBook[] {
  return filter === "ot" ? otBooks : ntBooks;
}
