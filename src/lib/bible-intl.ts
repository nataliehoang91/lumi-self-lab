/**
 * Bible app UI strings (intl-style).
 * Single source of truth for EN / VI / ZH; use message keys and interpolation.
 */

export type BibleLocale = "en" | "vi" | "zh";

/** App navbar language maps to locale. */
export type BibleLanguage = "EN" | "VI" | "ZH";

const LOCALE_MAP: Record<BibleLanguage, BibleLocale> = {
  EN: "en",
  VI: "vi",
  ZH: "zh",
};

/** Message bundles by locale. Use {param} for interpolation. */
const MESSAGES: Record<BibleLocale, Record<string, string>> = {
  en: {
    clickToReveal: "Click to reveal verse",
    verseOf: "Verse {current} of {total}",
    useArrowKeys: "Use arrow keys",
    keyboardHint: "← → to navigate • Space to flip",
    useArrowKeysVertical: "↑ ↓ to navigate • Space to flip",
    showing: "Showing {from}–{to} of {total}",
    loadMore: "Load more",
    backToTop: "Back to top",
    noVerses: "No verses yet.",
    couldNotLoad: "Could not load verses.",
    navAppTitle: "Scripture Memory",
    navLayoutVertical: "Vertical",
    navLayoutHorizontal: "Horizontal",
    navLayoutShowAll: "Show all cards",
    navFontSmall: "Smaller text",
    navFontMedium: "Medium text",
    navFontLarge: "Larger text",
    collection: "Collection",
    allVerses: "All verses",
    selectCollection: "Select collection",
    readPageTitle: "Read",
    readVersion: "Version",
    readCompare: "Compare:",
    readClearAll: "Clear all",
    readSynced: "Synced",
    readIndependent: "Independent",
    readChapterN: "Chapter {n}",
    readBook: "Book",
    readSelectTranslation: "Select a translation above",
    readChooseVersions: "Choose one or two versions to compare.",
    readNoContent: "No content available for this chapter.",
    readSelectAnother: "Select another book or chapter.",
    readFocusMode: "Focus mode (expand)",
    readExitFocus: "Exit focus (minimize)",
    readCopyVerse: "Copy verse",
    readBookmark: "Bookmark",
    readAddNote: "Add note",
    readOldTestament: "Old Testament",
    readNewTestament: "New Testament",
    readAll: "All",
  },
  vi: {
    clickToReveal: "Nhấp để xem câu kinh thánh",
    verseOf: "Câu {current} / {total}",
    useArrowKeys: "Sử dụng phím mũi tên",
    keyboardHint: "← → để điều hướng • Space để lật thẻ",
    useArrowKeysVertical: "↑ ↓ để điều hướng • Space để lật thẻ",
    showing: "Hiển thị {from}–{to} / {total}",
    loadMore: "Xem thêm",
    backToTop: "Về đầu trang",
    noVerses: "Chưa có câu nào.",
    couldNotLoad: "Không tải được danh sách câu.",
    navAppTitle: "Ghi nhớ Kinh thánh",
    navLayoutVertical: "Dọc",
    navLayoutHorizontal: "Ngang",
    navLayoutShowAll: "Xem tất cả thẻ",
    navFontSmall: "Chữ nhỏ",
    navFontMedium: "Chữ vừa",
    navFontLarge: "Chữ lớn",
    collection: "Bộ sưu tập",
    allVerses: "Tất cả câu",
    selectCollection: "Chọn bộ sưu tập",
    readPageTitle: "Đọc",
    readVersion: "Bản dịch",
    readCompare: "So sánh:",
    readClearAll: "Xóa hết",
    readSynced: "Đồng bộ",
    readIndependent: "Độc lập",
    readChapterN: "Chương {n}",
    readBook: "Sách",
    readSelectTranslation: "Chọn bản dịch ở trên",
    readChooseVersions: "Chọn một hoặc hai bản để so sánh.",
    readNoContent: "Không có nội dung cho chương này.",
    readSelectAnother: "Chọn sách hoặc chương khác.",
    readFocusMode: "Chế độ tập trung (mở rộng)",
    readExitFocus: "Thoát tập trung (thu nhỏ)",
    readCopyVerse: "Sao chép câu",
    readBookmark: "Đánh dấu",
    readAddNote: "Thêm ghi chú",
    readOldTestament: "Cựu Ước",
    readNewTestament: "Tân Ước",
    readAll: "Tất cả",
  },
  zh: {
    clickToReveal: "點擊顯示經文",
    verseOf: "第 {current} 節 / 共 {total} 節",
    useArrowKeys: "使用方向鍵",
    keyboardHint: "← → 導航 • 空格翻面",
    useArrowKeysVertical: "↑ ↓ 導航 • 空格翻面",
    showing: "顯示 {from}–{to} / 共 {total}",
    loadMore: "載入更多",
    backToTop: "回到頂部",
    noVerses: "尚無經文。",
    couldNotLoad: "無法載入經文。",
    navAppTitle: "經文記憶",
    navLayoutVertical: "垂直",
    navLayoutHorizontal: "水平",
    navLayoutShowAll: "顯示全部卡片",
    navFontSmall: "較小字體",
    navFontMedium: "中等字體",
    navFontLarge: "較大字體",
    collection: "收藏",
    allVerses: "全部經文",
    selectCollection: "選擇收藏",
    readPageTitle: "閱讀",
    readVersion: "譯本",
    readCompare: "對照：",
    readClearAll: "全部清除",
    readSynced: "已同步",
    readIndependent: "獨立",
    readChapterN: "第 {n} 章",
    readBook: "書卷",
    readSelectTranslation: "請在上方選擇譯本",
    readChooseVersions: "選擇一或兩個譯本進行對照。",
    readNoContent: "本章暫無內容。",
    readSelectAnother: "請選擇其他書卷或章節。",
    readFocusMode: "專注模式（展開）",
    readExitFocus: "退出專注（縮小）",
    readCopyVerse: "複製經文",
    readBookmark: "書籤",
    readAddNote: "添加筆記",
    readOldTestament: "舊約",
    readNewTestament: "新約",
    readAll: "全部",
  },
};

function interpolate(message: string, params?: Record<string, number | string>): string {
  if (!params) return message;
  return message.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] != null ? String(params[key]) : `{${key}}`
  );
}

export type BibleIntlParams = Record<string, number | string>;

export interface BibleIntl {
  /** Current locale (en | vi | zh). */
  locale: BibleLocale;
  /** Get message by key; optional params for interpolation (e.g. { current, total }). */
  t: (key: keyof (typeof MESSAGES)["en"], params?: BibleIntlParams) => string;
}

/**
 * Get intl helper for the Bible app. Use global language from context.
 */
export function getBibleIntl(language: BibleLanguage): BibleIntl {
  const locale = LOCALE_MAP[language];
  const messages = MESSAGES[locale] ?? MESSAGES.en;

  return {
    locale,
    t: (key, params) => interpolate(messages[key] ?? key, params),
  };
}

/** Map app Language to BCP 47 for Intl (e.g. number/date formatting). */
export function bibleLocaleToBCP47(language: BibleLanguage): string {
  const map: Record<BibleLanguage, string> = {
    EN: "en-US",
    VI: "vi-VN",
    ZH: "zh-CN",
  };
  return map[language] ?? "en-US";
}
