export interface BibleStudyList {
  id: string;
  clerkUserId: string;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BibleStudyListWithCount extends BibleStudyList {
  passageCount: number;
}

export interface BibleStudyPassage {
  id: string;
  listId: string;
  bookId: string;
  chapter: number;
  verseStart: number | null;
  verseEnd: number | null;
  createdAt: Date;
  updatedAt: Date;
}
