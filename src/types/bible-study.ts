export interface BibleStudyList {
  id: string;
  clerkUserId: string;
  title: string;
  description: string | null;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  isPublic: boolean;
  publicSlug: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BibleStudyListWithCount extends BibleStudyList {
  passageCount: number;
  studiedCount: number;
}

export interface BibleStudyPassage {
  id: string;
  listId: string;
  bookId: string;
  chapter: number;
  verseStart: number | null;
  verseEnd: number | null;
  isStudied: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BibleStudyNote {
  id: string;
  listId: string;
  bookId: string;
  chapter: number;
  verseNumber: number | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type HighlightColor = "yellow" | "blue" | "pink" | "green";

export interface BibleStudyHighlight {
  id: string;
  listId: string;
  bookId: string;
  chapter: number;
  verseNumber: number;
  color: HighlightColor;
  createdAt: Date;
}
