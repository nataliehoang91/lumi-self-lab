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
  targetDate: Date | null;
  dailyGoalChapters: number | null;
  lastStudiedAt: Date | null;
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
  studiedAt: Date | null;
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

export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudiedDate: Date | null;
  totalDaysStudied: number;
}

export interface ChecklistBook {
  bookId: string;
  bookNameEn: string;
  bookNameVi: string;
  bookOrder: number;
  passages: {
    id: string;
    chapter: number;
    isStudied: boolean;
    studiedAt: Date | null;
  }[];
}

export interface ContinueTodayItem {
  listId: string;
  listTitle: string;
  bookId: string;
  bookNameEn: string;
  bookNameVi: string;
  chapter: number;
}
