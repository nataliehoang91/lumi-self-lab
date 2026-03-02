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
    learnModule1Title: "What Is the Bible?",
    learnModule2Title: "Bible Origin & Canon",
    learnModule3Title: "Who Is Jesus?",
    learnModule4Title: "What Is Faith?",
    learnCtaTitle: "You have the foundation?",
    learnCtaSubtitle: "Now open Scripture and read for yourself.",
    learnOpenBible: "Open Bible",
    learnStructurePrevious: "Previous",
    learnStructureNext: "Next",
    learnStructureNextOrigin: "Next: Bible Origin",
    learnOriginTitle: "Bible Origin & Canon Formation",
    learnJesusTitle: "Who Is Jesus?",
    learnDeepDiveTitle: "Want to explore this more?",
    learnDeepDiveLabel: "Deep Dive",
    learnDeepDiveDescription:
      "Take a closer look at the history, context, and meaning behind what you've just read.",
    learnDeepDiveButton: "Go deeper",
    // LangPage (bible/[lang] landing)
    langPageHeroEyebrow: "A quiet place to know God",
    langPageHeroTitle1: "Know yourself.",
    langPageHeroTitle2: "Know Scripture.",
    langPageHeroSubtitle: "A calm space to learn and read the Bible.",
    langPageCtaStart: "Start Here",
    langPageCtaBible: "Open Bible",
    langPageVerseOfDay: "Verse of the Day",
    langPageReadInContext: "Read in context",
    langPageStatBooks: "Books",
    langPageStatChapters: "Chapters",
    langPageStatLanguages: "Languages",
    langPageStatStory: "Story",
    langPageJourneyTitle: "Your Journey",
    langPageJourneySubtitle: "From first questions to deeper faith.",
    langPageJ1Label: "Learn",
    langPageJ1Headline: "Start with the foundations.",
    langPageJ1Body: "Understand what the Bible is, who Jesus is, and what faith means.",
    langPageJ1Link1: "Bible Structure",
    langPageJ1Link2: "Bible Origin",
    langPageJ1Link3: "Who is Jesus?",
    langPageJ1Link4: "What is Faith?",
    langPageJ1Cta: "Start Learning",
    langPageJ2Label: "Read",
    langPageJ2Headline: "Read Scripture clearly.",
    langPageJ2Body: "Side-by-side translations and focused reading.",
    langPageJ2Link1: "Split View",
    langPageJ2Cta: "Open the Bible",
    langPageJ3Label: "Memorise",
    langPageJ3Headline: "Understand and memorise.",
    langPageJ3Body: "Flashcards and Glossary help you understand terms and memorise verses.",
    langPageJ3Link1: "Flashcards",
    langPageJ3Link2: "Glossary",
    langPageJ3Cta: "Open Flashcards",
    langPageNavLearn: "Learn",
    langPageNavRead: "Read",
    langPageNavFlashcards: "Flashcards",
    langPageNavGlossary: "Glossary",
    langPageBannerTitle: "Begin where you are.",
    langPageBannerParagraph: "Whether you are new or have read for years — there is always more to discover.",
    langPageBannerNew: "I am new here",
    langPageBannerBible: "Take me to the Bible",
    langPageFooterTagline: "A quiet place to know God.",
    langPageFooterCopyright: "Scripture for the soul.",
    langPageVerse1Text: "Your word is a lamp to my feet and a light to my path.",
    langPageVerse1Ref: "Psalm 119:105",
    langPageVerse2Text: "Trust in the Lord with all your heart.",
    langPageVerse2Ref: "Proverbs 3:5",
    langPageVerse3Text: "I can do all things through Christ who strengthens me.",
    langPageVerse3Ref: "Philippians 4:13",
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
    learnModule1Title: "Kinh thánh là gì?",
    learnModule2Title: "Nguồn gốc & Chính điển Kinh thánh",
    learnModule3Title: "Chúa Giê-xu là ai?",
    learnModule4Title: "Đức tin là gì?",
    learnCtaTitle: "Bạn đã có nền tảng?",
    learnCtaSubtitle: "Giờ hãy mở Kinh thánh và đọc cho chính mình.",
    learnOpenBible: "Mở Kinh thánh",
    learnStructurePrevious: "Trước",
    learnStructureNext: "Tiếp",
    learnStructureNextOrigin: "Tiếp: Nguồn gốc Kinh thánh",
    learnOriginTitle: "Nguồn gốc Kinh thánh & Hình thành Chính Điển",
    learnJesusTitle: "Chúa Giê-xu Là Ai?",
    learnDeepDiveTitle: "Muốn tìm hiểu sâu hơn?",
    learnDeepDiveLabel: "Tìm hiểu thêm",
    learnDeepDiveDescription:
      "Nếu bạn muốn hiểu rõ hơn về bối cảnh và ý nghĩa phía sau bài học này, bạn có thể tiếp tục đọc phần mở rộng.",
    learnDeepDiveButton: "Khám phá thêm",
    langPageHeroEyebrow: "Nơi bình yên để biết Chúa",
    langPageHeroTitle1: "Biết chính mình.",
    langPageHeroTitle2: "Biết Kinh thánh.",
    langPageHeroSubtitle: "Một không gian yên tĩnh để học và đọc Kinh thánh.",
    langPageCtaStart: "Bắt đầu tại đây",
    langPageCtaBible: "Mở Kinh thánh",
    langPageVerseOfDay: "Câu của ngày",
    langPageReadInContext: "Đọc trong bối cảnh",
    langPageStatBooks: "Sách",
    langPageStatChapters: "Chương",
    langPageStatLanguages: "Ngôn ngữ",
    langPageStatStory: "Câu chuyện",
    langPageJourneyTitle: "Hành trình của bạn",
    langPageJourneySubtitle: "Con đường từ câu hỏi đầu tiên đến đức tin sâu nhiệm.",
    langPageJ1Label: "Học",
    langPageJ1Headline: "Bắt đầu từ nền tảng.",
    langPageJ1Body: "Hiểu Kinh thánh là gì, Chúa Giê-xu là ai và đức tin nghĩa là gì.",
    langPageJ1Link1: "Cấu trúc Kinh thánh",
    langPageJ1Link2: "Nguồn gốc Kinh thánh",
    langPageJ1Link3: "Chúa Giê-xu là ai",
    langPageJ1Link4: "Đức tin là gì",
    langPageJ1Cta: "Bắt đầu học",
    langPageJ2Label: "Đọc",
    langPageJ2Headline: "Đọc Kinh thánh rõ ràng.",
    langPageJ2Body: "Xem song song các bản dịch và đọc tập trung.",
    langPageJ2Link1: "Xem đôi",
    langPageJ2Cta: "Mở Kinh thánh",
    langPageJ3Label: "Ghi nhớ",
    langPageJ3Headline: "Hiểu và ghi nhớ.",
    langPageJ3Body: "Flashcard và Glossary giúp bạn hiểu thuật ngữ và ghi nhớ câu Kinh thánh.",
    langPageJ3Link1: "Flashcard",
    langPageJ3Link2: "Glossary",
    langPageJ3Cta: "Mở Flashcard",
    langPageNavLearn: "Học",
    langPageNavRead: "Đọc",
    langPageNavFlashcards: "Flashcard",
    langPageNavGlossary: "Glossary",
    langPageBannerTitle: "Bắt đầu từ một bước nhỏ.",
    langPageBannerParagraph: "Dù bạn mới bắt đầu hay đã đọc nhiều năm, bạn có thể tiếp tục học và lớn lên từng ngày.",
    langPageBannerNew: "Tôi mới đến",
    langPageBannerBible: "Đưa tôi đến Kinh thánh",
    langPageFooterTagline: "Nơi bình yên để biết Chúa.",
    langPageFooterCopyright: "Kinh thánh cho tâm hồn.",
    langPageVerse1Text: "Lời Chúa là ngọn đèn cho chân tôi, ánh sáng cho đường lối tôi.",
    langPageVerse1Ref: "Thi thiên 119:105",
    langPageVerse2Text: "Hãy hết lòng tin cậy Đức Giê-hô-va.",
    langPageVerse2Ref: "Châm ngôn 3:5",
    langPageVerse3Text: "Tôi làm được mọi sự nhờ Đấng Christ ban thêm sức cho tôi.",
    langPageVerse3Ref: "Phi-líp 4:13",
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
    learnModule1Title: "What Is the Bible?",
    learnModule2Title: "Bible Origin & Canon",
    learnModule3Title: "Who Is Jesus?",
    learnModule4Title: "What Is Faith?",
    learnCtaTitle: "你已有根基。",
    learnCtaSubtitle: "現在打開聖經，親自閱讀。",
    learnOpenBible: "打開聖經",
    learnStructurePrevious: "上一課",
    learnStructureNext: "下一課",
    learnStructureNextOrigin: "下一課：聖經的來源",
    learnOriginTitle: "聖經的來源與正典形成",
    learnJesusTitle: "Who Is Jesus?",
    learnDeepDiveTitle: "Want to explore this more?",
    learnDeepDiveLabel: "Deep Dive",
    learnDeepDiveDescription:
      "Take a closer look at the history, context, and meaning behind what you've just read.",
    learnDeepDiveButton: "Go deeper",
    langPageHeroEyebrow: "A quiet place to know God",
    langPageHeroTitle1: "Know yourself.",
    langPageHeroTitle2: "Know Scripture.",
    langPageHeroSubtitle: "A calm space to learn and read the Bible.",
    langPageCtaStart: "Start Here",
    langPageCtaBible: "Open Bible",
    langPageVerseOfDay: "Verse of the Day",
    langPageReadInContext: "Read in context",
    langPageStatBooks: "Books",
    langPageStatChapters: "Chapters",
    langPageStatLanguages: "Languages",
    langPageStatStory: "Story",
    langPageJourneyTitle: "Your Journey",
    langPageJourneySubtitle: "From first questions to deeper faith.",
    langPageJ1Label: "Learn",
    langPageJ1Headline: "Start with the foundations.",
    langPageJ1Body: "Understand what the Bible is, who Jesus is, and what faith means.",
    langPageJ1Link1: "Bible Structure",
    langPageJ1Link2: "Bible Origin",
    langPageJ1Link3: "Who is Jesus?",
    langPageJ1Link4: "What is Faith?",
    langPageJ1Cta: "Start Learning",
    langPageJ2Label: "Read",
    langPageJ2Headline: "Read Scripture clearly.",
    langPageJ2Body: "Side-by-side translations and focused reading.",
    langPageJ2Link1: "Split View",
    langPageJ2Cta: "Open the Bible",
    langPageJ3Label: "Memorise",
    langPageJ3Headline: "Understand and memorise.",
    langPageJ3Body: "Flashcards and Glossary help you understand terms and memorise verses.",
    langPageJ3Link1: "Flashcards",
    langPageJ3Link2: "Glossary",
    langPageJ3Cta: "Open Flashcards",
    langPageNavLearn: "Learn",
    langPageNavRead: "Read",
    langPageNavFlashcards: "Flashcards",
    langPageNavGlossary: "Glossary",
    langPageBannerTitle: "Begin where you are.",
    langPageBannerParagraph: "Whether you are new or have read for years — there is always more to discover.",
    langPageBannerNew: "I am new here",
    langPageBannerBible: "Take me to the Bible",
    langPageFooterTagline: "A quiet place to know God.",
    langPageFooterCopyright: "Scripture for the soul.",
    langPageVerse1Text: "Your word is a lamp to my feet and a light to my path.",
    langPageVerse1Ref: "Psalm 119:105",
    langPageVerse2Text: "Trust in the Lord with all your heart.",
    langPageVerse2Ref: "Proverbs 3:5",
    langPageVerse3Text: "I can do all things through Christ who strengthens me.",
    langPageVerse3Ref: "Philippians 4:13",
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

const LOCALE_TO_LANGUAGE: Record<BibleLocale, BibleLanguage> = {
  en: "EN",
  vi: "VI",
  zh: "ZH",
};

/** Get intl by locale string (en | vi | zh). Useful for page-level components that receive lang from params. */
export function getBibleIntlByLocale(locale: BibleLocale): BibleIntl {
  const language = LOCALE_TO_LANGUAGE[locale] ?? "EN";
  return getBibleIntl(language);
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
