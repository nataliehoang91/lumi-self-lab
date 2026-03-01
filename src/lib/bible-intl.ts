/**
 * Bible app UI strings (intl-style).
 * Only keys still used by components; page body copy lives on the pages.
 */

import React, { type ReactNode, type ReactElement } from "react";

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
    collection: "Collection",
    collectionName: "Collection {name}",
    selectCollection: "Select collection",
    navFontSmall: "Smaller text",
    navFontMedium: "Medium text",
    navFontLarge: "Larger text",
    readPageTitle: "Read",
    readVersion: "Version",
    readSynced: "Synced",
    readIndependent: "Independent",
    readChapterN: "Chapter {n}",
    readBook: "Book",
    readOldTestament: "Old Testament",
    readNewTestament: "New Testament",
    readOldShort: "Old",
    readNewShort: "New",
    readEmptyStateTitle: "Select a translation above",
    readEmptyStateSubtitle: "Choose one or two versions to compare.",
    readFocusMode: "Focus mode (expand)",
    readExitFocus: "Exit focus (minimize)",
    readInsights: "Insights",
    readInsightsLabel: "Insights",
    readInsightsTitle: "Chapter insights",
    readInsightsBetaBadge: "Beta",
    readInsightsLanguagesNote:
      "Insights are currently available in English and Vietnamese. More languages coming soon.",
    readInsightsFor: "{book} {n}",
    readInsightsClose: "Close",
    readInsightsContext: "Context",
    readInsightsExplanation: "Explanation",
    readInsightsReflection: "Reflection",
    readInsightsComingSoon: "Insights for this chapter are coming soon. Try John 3 for a preview.",
    readInsightsComingSoonTag: "Coming soon",
    readInsightsDismissHint: "Press",
    readInsightsDismissHintTail: "or tap the lightbulb again to close",
    readInsightsMinimize: "Minimize",
    learnStartHere: "Start Here",
    learnTitle: "Begin with the foundation.",
    learnSubtitle:
      "Before reading deeply, take a moment to understand what the Bible is, who {jesus} is, and what faith truly means.",
    learnModule1Title: "What Is the Bible?",
    learnModule1Desc:
      "Discover what the Bible is, how it is structured, who wrote it, and the redemptive story woven through every page.",
    learnModule2Title: "Bible Origin & Canon",
    learnModule2Desc:
      "Explore how Scripture was preserved across centuries, from ancient manuscripts to the Bible we hold today.",
    learnModule3Title: "Who Is Jesus?",
    learnModule3Desc:
      "Understand who {jesus} claimed to be — fully God, fully man — and why {his} life, death, and resurrection change everything.",
    learnModule4Title: "What Is Faith?",
    learnModule4Desc:
      "Learn what it means to trust God — grace, repentance, prayer, and beginning a real relationship with {him}.",
    learnMinRead: "{min} min read",
    learnVerse: "Your word is a lamp to my feet and a light to my path.",
    learnVerseRef: "PSALM 119:105",
    learnCtaTitle: "You have the foundation?",
    learnCtaSubtitle: "Now open Scripture and read for yourself.",
    learnOpenBible: "Open Bible",
    learnStructurePrevious: "Previous",
    learnStructureNext: "Next",
    learnStructureNextOrigin: "Next: Bible Origin",
    learnOriginTitle: "Bible Origin & Canon Formation",
    learnJesusTitle: "Who Is Jesus?",
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
    collection: "Bộ sưu tập",
    collectionName: "Bộ sưu tập {name}",
    selectCollection: "Chọn bộ sưu tập",
    navFontSmall: "Chữ nhỏ",
    navFontMedium: "Chữ vừa",
    navFontLarge: "Chữ lớn",
    readPageTitle: "Đọc",
    readVersion: "Bản dịch",
    readSynced: "Đồng bộ",
    readIndependent: "Độc lập",
    readChapterN: "Chương {n}",
    readBook: "Sách",
    readOldTestament: "Cựu Ước",
    readNewTestament: "Tân Ước",
    readOldShort: "Cựu",
    readNewShort: "Tân",
    readEmptyStateTitle: "Chọn bản dịch ở trên",
    readEmptyStateSubtitle: "Chọn một hoặc hai bản để so sánh.",
    readFocusMode: "Chế độ tập trung (mở rộng)",
    readExitFocus: "Thoát tập trung (thu nhỏ)",
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
    readInsightsComingSoon: "Khải thị cho chương này sẽ sớm có mặt. Hãy thử Giăng 3 để xem trước.",
    readInsightsComingSoonTag: "Sắp ra mắt",
    readInsightsDismissHint: "Nhấn",
    readInsightsDismissHintTail: "hoặc chạm lại biểu tượng bóng đèn để đóng",
    readInsightsMinimize: "Thu nhỏ",
    learnStartHere: "Bắt đầu tại đây",
    learnTitle: "Bắt đầu từ nền tảng.",
    learnSubtitle:
      "Trước khi đi sâu vào Kinh Thánh, hãy dành chút thời gian để hiểu Kinh Thánh là gì, {jesus} là ai, và đức tin thật sự có ý nghĩa gì.",
    learnModule1Title: "Kinh thánh là gì?",
    learnModule1Desc:
      "Tìm hiểu Kinh Thánh là gì, được cấu trúc như thế nào, ai là người viết và câu chuyện cứu chuộc xuyên suốt mọi trang sách.",
    learnModule2Title: "Nguồn gốc & Chính điển Kinh thánh",
    learnModule2Desc:
      "Khám phá hành trình bảo tồn Kinh Thánh qua nhiều thế kỷ — từ bản chép tay cổ đến quyển Kinh Thánh ngày nay.",
    learnModule3Title: "Chúa Jêsus là ai?",
    learnModule3Desc:
      "Hiểu về Đấng tự xưng là Con Đức Chúa Trời — vừa trọn vẹn là Đức Chúa Trời, vừa trọn vẹn là con người — và vì sao điều đó thay đổi mọi điều.",
    learnModule4Title: "Đức tin là gì?",
    learnModule4Desc:
      "Tìm hiểu ý nghĩa của việc tin cậy Đức Chúa Trời — ân điển, sự ăn năn, cầu nguyện và một mối quan hệ thật với {him}.",
    learnMinRead: "{min} phút đọc",
    learnVerse: "Lời Chúa là ngọn đèn cho chân tôi, Ánh sáng cho đường lối tôi.",
    learnVerseRef: "THI THIÊN 119:105",
    learnCtaTitle: "Bạn đã có nền tảng?",
    learnCtaSubtitle: "Giờ hãy mở Kinh thánh và đọc cho chính mình.",
    learnOpenBible: "Mở Kinh thánh",
    learnStructurePrevious: "Trước",
    learnStructureNext: "Tiếp",
    learnStructureNextOrigin: "Tiếp: Nguồn gốc Kinh thánh",
    learnOriginTitle: "Nguồn gốc Kinh thánh & Hình thành Chính Điển",
    learnJesusTitle: "Chúa Jêsus Là Ai?",
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
    collection: "收藏",
    collectionName: "收藏 {name}",
    selectCollection: "選擇收藏",
    navFontSmall: "較小字體",
    navFontMedium: "中等字體",
    navFontLarge: "較大字體",
    readPageTitle: "閱讀",
    readVersion: "譯本",
    readSynced: "已同步",
    readIndependent: "獨立",
    readChapterN: "第 {n} 章",
    readBook: "書卷",
    readOldTestament: "舊約",
    readNewTestament: "新約",
    readOldShort: "舊",
    readNewShort: "新",
    readEmptyStateTitle: "請在上方選擇譯本",
    readEmptyStateSubtitle: "選擇一或兩個譯本進行對照。",
    readFocusMode: "專注模式（展開）",
    readExitFocus: "退出專注（縮小）",
    readInsights: "靈修提示",
    readInsightsLabel: "靈修提示",
    readInsightsTitle: "本章靈修提示",
    readInsightsBetaBadge: "Beta",
    readInsightsLanguagesNote: "靈修提示目前優先提供英文與越南文章節，其他語言將陸續加入。",
    readInsightsFor: "{book} 第 {n} 章",
    readInsightsClose: "關閉",
    readInsightsContext: "背景",
    readInsightsExplanation: "解說",
    readInsightsReflection: "默想",
    readInsightsComingSoon: "本章的靈修提示即將推出。可以先試試約翰福音第 3 章。",
    readInsightsComingSoonTag: "即將推出",
    readInsightsDismissHint: "按下",
    readInsightsDismissHintTail: "或再次點擊燈泡圖示關閉",
    readInsightsMinimize: "最小化",
    learnStartHere: "Start Here",
    learnTitle: "Begin with the foundation.",
    learnSubtitle:
      "Before reading deeply, take a moment to understand what the Bible is, who {jesus} is, and what faith truly means.",
    learnModule1Title: "What Is the Bible?",
    learnModule1Desc:
      "Discover what the Bible is, how it is structured, who wrote it, and the redemptive story woven through every page.",
    learnModule2Title: "Bible Origin & Canon",
    learnModule2Desc:
      "Explore how Scripture was preserved across centuries, from ancient manuscripts to the Bible we hold today.",
    learnModule3Title: "Who Is Jesus?",
    learnModule3Desc:
      "Understand who {jesus} claimed to be — fully God, fully man — and why {his} life, death, and resurrection change everything.",
    learnModule4Title: "What Is Faith?",
    learnModule4Desc:
      "Learn what it means to trust God — grace, repentance, prayer, and beginning a real relationship with {him}.",
    learnMinRead: "{min} 分鐘閱讀",
    learnVerse: "你的話是我腳前的燈，是我路上的光。",
    learnVerseRef: "詩篇 119:105",
    learnCtaTitle: "你已有根基。",
    learnCtaSubtitle: "現在打開聖經，親自閱讀。",
    learnOpenBible: "打開聖經",
    learnStructurePrevious: "上一課",
    learnStructureNext: "下一課",
    learnStructureNextOrigin: "下一課：聖經的來源",
    learnOriginTitle: "聖經的來源與正典形成",
    learnJesusTitle: "Who Is Jesus?",
  },
};

function interpolate(message: string, params?: Record<string, number | string>): string {
  if (!params) return message;
  return message.replace(/\{(\w+)\}/g, (_, key) =>
    params[key] != null ? String(params[key]) : `{${key}}`
  );
}

export type BibleIntlParams = Record<string, number | string>;

type BibleIntlRichParams = Record<string, ReactNode>;

function interpolateRich(message: string, params?: BibleIntlRichParams): ReactNode {
  if (!params) return message;

  const parts: ReactNode[] = [];
  const regex = /\{(\w+)\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = regex.exec(message)) !== null) {
    const key = match[1];
    const start = match.index;

    if (start > lastIndex) {
      parts.push(message.slice(lastIndex, start));
    }

    const raw = params[key];
    let value: ReactNode;

    if (raw == null) {
      value = `{${key}}`;
    } else if (React.isValidElement(raw)) {
      value = React.cloneElement(raw as ReactElement, { key: index });
    } else {
      value = raw;
    }

    parts.push(value);
    lastIndex = regex.lastIndex;
    index += 1;
  }

  if (lastIndex < message.length) {
    parts.push(message.slice(lastIndex));
  }

  return parts.length === 1 ? parts[0] : parts;
}

export interface BibleIntl {
  /** Current locale (en | vi | zh). */
  locale: BibleLocale;
  /** Get message by key; optional params for interpolation (e.g. { current, total }). */
  t: (key: keyof (typeof MESSAGES)["en"], params?: BibleIntlParams) => string;
  /** Rich version that can return React nodes with placeholders replaced by components. */
  rich: (key: keyof (typeof MESSAGES)["en"], params?: BibleIntlRichParams) => ReactNode;
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
    rich: (key, params) => interpolateRich(messages[key] ?? key, params),
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
