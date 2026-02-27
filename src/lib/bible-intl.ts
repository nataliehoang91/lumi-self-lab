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
    collectionName: "Collection {name}",
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
    readEmptyStateTitle: "Select a translation above",
    readEmptyStateSubtitle: "Choose one or two versions to compare.",
    readFocusMode: "Focus mode (expand)",
    readExitFocus: "Exit focus (minimize)",
    readCopyVerse: "Copy verse",
    readBookmark: "Bookmark",
    readAddNote: "Add note",
    readOldTestament: "Old Testament",
    readNewTestament: "New Testament",
    readAll: "All",
    // Insights
    readInsights: "Insights",
    readInsightsLabel: "Insights",
    readInsightsTitle: "Chapter insights",
    readInsightsBetaBadge: "Beta",
    readInsightsLanguagesNote: "Insights are currently available in English and Vietnamese. More languages coming soon.",
    readInsightsComingSoonTag: "Coming soon",
    readInsightsFor: "{book} {n}",
    readInsightsClose: "Close",
    readInsightsContext: "Context",
    readInsightsExplanation: "Explanation",
    readInsightsReflection: "Reflection",
    readInsightsComingSoon:
      "Insights for this chapter are coming soon. Try John 3 for a preview.",
    readInsightsDismissHint: "Press",
    readInsightsDismissHintTail: "or tap the lightbulb again to close",
    readInsightsMinimize: "Minimize",
    // Sample John 3 content (can be localized later)
    readInsightJohn3Context:
      "This conversation between Jesus and Nicodemus takes place early in Jesus' ministry and introduces the theme of spiritual rebirth.",
    readInsightJohn3Explanation:
      'Jesus explains that being "born again" is a spiritual transformation through the Spirit, not a physical rebirth. John 3:16 reveals God’s love and the gift of eternal life through belief in Jesus.',
    readInsightJohn3Reflection1:
      'What does "being born again" mean to you personally?',
    readInsightJohn3Reflection2:
      "How does the image of the wind help you understand spiritual transformation?",
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
    collectionName: "Bộ sưu tập {name}",
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
    readEmptyStateTitle: "Chọn bản dịch ở trên",
    readEmptyStateSubtitle: "Chọn một hoặc hai bản để so sánh.",
    readFocusMode: "Chế độ tập trung (mở rộng)",
    readExitFocus: "Thoát tập trung (thu nhỏ)",
    readCopyVerse: "Sao chép câu",
    readBookmark: "Đánh dấu",
    readAddNote: "Thêm ghi chú",
    readOldTestament: "Cựu Ước",
    readNewTestament: "Tân Ước",
    readAll: "Tất cả",
    // Insights
    readInsights: "Khải thị",
    readInsightsLabel: "Khải thị",
    readInsightsTitle: "Khải thị cho chương",
    readInsightsBetaBadge: "Beta",
    readInsightsLanguagesNote:
      "Khải thị hiện chỉ có cho tiếng Anh và tiếng Việt. Các ngôn ngữ khác sẽ được thêm sau.",
    readInsightsFor: "{book} {n}",
    readInsightsClose: "Đóng",
    readInsightsContext: "Bối cảnh",
    readInsightsExplanation: "Giải thích",
    readInsightsReflection: "Suy ngẫm",
    readInsightsComingSoon:
      "Khải thị cho chương này sẽ sớm có mặt. Hãy thử Giăng 3 để xem trước.",
    readInsightsComingSoonTag: "Sắp ra mắt",
    readInsightsDismissHint: "Nhấn",
    readInsightsDismissHintTail: "hoặc chạm lại biểu tượng bóng đèn để đóng",
    readInsightsMinimize: "Thu nhỏ",
    readInsightJohn3Context:
      "Cuộc đối thoại giữa Chúa Jêsus và Ni-cô-đem diễn ra đầu chức vụ của Ngài, mở ra chủ đề quan trọng về sự tái sinh thuộc linh.",
    readInsightJohn3Explanation:
      "Chúa Jêsus giải thích rằng \"sinh lại\" là sự biến đổi thuộc linh bởi Thánh Linh, không phải là sự sinh ra thể xác lần thứ hai. Giăng 3:16 bày tỏ tình yêu của Đức Chúa Trời và món quà sự sống đời đời cho người tin Con Ngài.",
    readInsightJohn3Reflection1:
      "\"Được sinh lại\" có ý nghĩa gì với chính bạn?",
    readInsightJohn3Reflection2:
      "Hình ảnh ngọn gió giúp bạn hiểu thế nào về sự biến đổi thuộc linh?",
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
    collectionName: "收藏 {name}",
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
    readEmptyStateTitle: "請在上方選擇譯本",
    readEmptyStateSubtitle: "選擇一或兩個譯本進行對照。",
    readFocusMode: "專注模式（展開）",
    readExitFocus: "退出專注（縮小）",
    readCopyVerse: "複製經文",
    readBookmark: "書籤",
    readAddNote: "添加筆記",
    readOldTestament: "舊約",
    readNewTestament: "新約",
    readAll: "全部",
    // Insights
    readInsights: "靈修提示",
    readInsightsLabel: "靈修提示",
    readInsightsTitle: "本章靈修提示",
    readInsightsBetaBadge: "Beta",
    readInsightsLanguagesNote:
      "靈修提示目前優先提供英文與越南文章節，其他語言將陸續加入。",
    readInsightsFor: "{book} 第 {n} 章",
    readInsightsClose: "關閉",
    readInsightsContext: "背景",
    readInsightsExplanation: "解說",
    readInsightsReflection: "默想",
    readInsightsComingSoon:
      "本章的靈修提示即將推出。可以先試試約翰福音第 3 章。",
    readInsightsComingSoonTag: "即將推出",
    readInsightsDismissHint: "按下",
    readInsightsDismissHintTail: "或再次點擊燈泡圖示關閉",
    readInsightsMinimize: "最小化",
    readInsightJohn3Context:
      "這段對話發生在耶穌事工初期，祂與尼哥底母談論「重生」，開啟了重要的屬靈主題。",
    readInsightJohn3Explanation:
      "耶穌說明「重生」不是肉身再生，而是聖靈帶來的內在更新。約翰福音 3:16 顯明神愛世人，並藉著信靠獨生子賜下永生。",
    readInsightJohn3Reflection1: "「重生」對你個人意味著什麼？",
    readInsightJohn3Reflection2: "風的比喻如何幫助你理解屬靈的改變？",
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
