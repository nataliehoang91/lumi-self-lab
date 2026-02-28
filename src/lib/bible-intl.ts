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
    readOldShort: "Old",
    readNewShort: "New",
    readAll: "All",
    // Insights
    readInsights: "Insights",
    readInsightsLabel: "Insights",
    readInsightsTitle: "Chapter insights",
    readInsightsBetaBadge: "Beta",
    readInsightsLanguagesNote:
      "Insights are currently available in English and Vietnamese. More languages coming soon.",
    readInsightsComingSoonTag: "Coming soon",
    readInsightsFor: "{book} {n}",
    readInsightsClose: "Close",
    readInsightsContext: "Context",
    readInsightsExplanation: "Explanation",
    readInsightsReflection: "Reflection",
    readInsightsComingSoon: "Insights for this chapter are coming soon. Try John 3 for a preview.",
    readInsightsDismissHint: "Press",
    readInsightsDismissHintTail: "or tap the lightbulb again to close",
    readInsightsMinimize: "Minimize",
    // Sample John 3 content (can be localized later)
    readInsightJohn3Context:
      "This conversation between Jesus and Nicodemus takes place early in Jesus' ministry and introduces the theme of spiritual rebirth.",
    readInsightJohn3Explanation:
      'Jesus explains that being "born again" is a spiritual transformation through the Spirit, not a physical rebirth. John 3:16 reveals God’s love and the gift of eternal life through belief in Jesus.',
    readInsightJohn3Reflection1: 'What does "being born again" mean to you personally?',
    readInsightJohn3Reflection2:
      "How does the image of the wind help you understand spiritual transformation?",
    // Learn
    learnStartHere: "Start Here",
    learnTitle: "Begin with the foundation.",
    learnSubtitle:
      "Before reading deeply, take a moment to understand what the Bible is, who Jesus is, and what faith truly means.",
    learnModule1Title: "What Is the Bible?",
    learnModule1Desc:
      "Discover what the Bible is, how it is structured, who wrote it, and the redemptive story woven through every page.",
    learnModule2Title: "Bible Origin & Canon",
    learnModule2Desc:
      "Explore how Scripture was preserved across centuries, from ancient manuscripts to the Bible we hold today.",
    learnModule3Title: "Who Is Jesus?",
    learnModule3Desc:
      "Understand who Jesus claimed to be — fully God, fully man — and why his life, death, and resurrection change everything.",
    learnModule4Title: "What Is Faith?",
    learnModule4Desc:
      "Learn what it means to trust God — grace, repentance, prayer, and beginning a real relationship with Him.",
    learnMinRead: "{min} min read",
    learnVerse: "Your word is a lamp to my feet and a light to my path.",
    learnVerseRef: "PSALM 119:105",
    learnCtaTitle: "You have the foundation.",
    learnCtaSubtitle: "Now open Scripture and read for yourself.",
    learnOpenBible: "Open Bible",
    learnStructureAllLessons: "All lessons",
    learnStructureNextOrigin: "Next: Bible Origin",
    learnStructModuleNum: "01 / 04",
    learnStructIntro1: "The Bible is not just a single book — it is a collection of ",
    learnStructIntro66: "66 writings",
    learnStructIntro2: " shaped across ",
    learnStructIntro1500: "1,500 years",
    learnStructIntro3: " by around ",
    learnStructIntro40: "40 different authors",
    learnStructIntro4:
      ". Yet through all its diversity, it tells one unified story: God's relentless pursuit to redeem humanity through Jesus Christ.",
    learnStructStatBooks: "Books total",
    learnStructStatOT: "Old Testament",
    learnStructStatNT: "New Testament",
    learnStructStatAuthors: "Human authors",
    learnStructOTTitle: "Old Testament",
    learnStructOTIntro:
      "It tells the story of creation, human rebellion, and God's unfolding promise — working through Israel to prepare the way for a coming Saviour.",
    learnStructOTLaw: "Law",
    learnStructOTLawDesc:
      "Genesis through Deuteronomy — creation, the fall, and God's covenant with Israel.",
    learnStructOTHistory: "History",
    learnStructOTHistoryDesc:
      "Joshua through Esther — Israel's story in the Promised Land, kings, exile, and return.",
    learnStructOTPoetry: "Poetry & Wisdom",
    learnStructOTPoetryDesc:
      "Job through Song of Solomon — reflection on suffering, praise, wisdom, and love.",
    learnStructOTProphets: "Prophets",
    learnStructOTProphetsDesc:
      "Isaiah through Malachi — God's messengers calling Israel back, pointing forward to Christ.",
    learnStructNTTitle: "New Testament",
    learnStructNTIntro:
      "It begins with the life of Jesus, follows the birth of the early church, and closes with a vision of how history ultimately finds its fulfillment in Christ.",
    learnStructNTGospels: "Gospels",
    learnStructNTGospelsDesc:
      "Matthew, Mark, Luke, John — four accounts of Jesus's life, ministry, death, and resurrection.",
    learnStructNTHistory: "History",
    learnStructNTHistoryDesc:
      "Acts — the story of the early church spreading from Jerusalem to the ends of the earth.",
    learnStructNTLetters: "Letters",
    learnStructNTLettersDesc:
      "Romans through Jude — Paul and others writing to churches and individuals about faith and life.",
    learnStructNTProphecy: "Prophecy",
    learnStructNTProphecyDesc:
      "Revelation — a vision of the end of history and the victory of Christ.",
    learnStructCentralTitle: "Central Theme",
    learnStructCentralBody:
      "Though written across centuries by many voices, the Bible tells one grand story: God creates a good world. Humanity turns away. God begins a patient rescue plan through Israel. That plan reaches its climax in Jesus Christ — whose death and resurrection open the way for restoration and renewed life with God.",
    learnStructGlossaryTitle: "Quick Glossary",
    learnStructGlossCovenant: "Covenant",
    learnStructGlossCovenantDef:
      "A sacred agreement or promise between God and his people, central to both Old and New Testaments.",
    learnStructGlossGospel: "Gospel",
    learnStructGlossGospelDef:
      'Literally "good news" — referring to the message of Jesus Christ\'s life, death, and resurrection.',
    learnStructGlossProphet: "Prophet",
    learnStructGlossProphetDef:
      "A person called by God to speak his message to the people, often calling people back to faithfulness and, at times, revealing what God would do in the future.",
    learnStructGlossGrace: "Grace",
    learnStructGlossGraceDef:
      "God's unmerited favour — his love and mercy given freely, not earned by human effort.",
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
    readOldShort: "Cựu",
    readNewShort: "Tân",
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
    readInsightsComingSoon: "Khải thị cho chương này sẽ sớm có mặt. Hãy thử Giăng 3 để xem trước.",
    readInsightsComingSoonTag: "Sắp ra mắt",
    readInsightsDismissHint: "Nhấn",
    readInsightsDismissHintTail: "hoặc chạm lại biểu tượng bóng đèn để đóng",
    readInsightsMinimize: "Thu nhỏ",
    readInsightJohn3Context:
      "Cuộc đối thoại giữa Chúa Jêsus và Ni-cô-đem diễn ra đầu chức vụ của Ngài, mở ra chủ đề quan trọng về sự tái sinh thuộc linh.",
    readInsightJohn3Explanation:
      'Chúa Jêsus giải thích rằng "sinh lại" là sự biến đổi thuộc linh bởi Thánh Linh, không phải là sự sinh ra thể xác lần thứ hai. Giăng 3:16 bày tỏ tình yêu của Đức Chúa Trời và món quà sự sống đời đời cho người tin Con Ngài.',
    readInsightJohn3Reflection1: '"Được sinh lại" có ý nghĩa gì với chính bạn?',
    readInsightJohn3Reflection2:
      "Hình ảnh ngọn gió giúp bạn hiểu thế nào về sự biến đổi thuộc linh?",
    // Learn (Vietnamese – replace with your translations)
    learnStartHere: "Bắt đầu tại đây",
    learnTitle: "Bắt đầu từ nền tảng.",
    learnSubtitle:
      "Trước khi đi sâu vào Kinh Thánh, hãy dành chút thời gian để hiểu Kinh Thánh là gì, Chúa Jêsus là ai, và đức tin thật sự có ý nghĩa gì.",
    learnModule1Title: "Kinh thánh là gì?",
    learnModule1Desc:
      "Tìm hiểu Kinh Thánh là gì, được cấu trúc như thế nào, ai là người viết và câu chuyện cứu chuộc xuyên suốt mọi trang sách.",
    learnModule2Title: "Nguồn gốc & Canon Kinh thánh",
    learnModule2Desc:
      "Khám phá hành trình bảo tồn Kinh Thánh qua nhiều thế kỷ — từ bản chép tay cổ đến quyển Kinh Thánh ngày nay.",
    learnModule3Title: "Chúa Jêsus là ai?",
    learnModule3Desc:
      "Hiểu về Đấng tự xưng là Con Đức Chúa Trời — vừa trọn vẹn là Đức Chúa Trời, vừa trọn vẹn là con người — và vì sao điều đó thay đổi mọi điều.",
    learnModule4Title: "Đức tin là gì?",
    learnModule4Desc:
      "Tìm hiểu ý nghĩa của việc tin cậy Đức Chúa Trời — ân điển, sự ăn năn, cầu nguyện và một mối quan hệ thật với Ngài.",
    learnMinRead: "{min} phút đọc",
    learnVerse: "Lời Chúa là ngọn đèn cho chân tôi, Ánh sáng cho đường lối tôi.",
    learnVerseRef: "THI THIÊN 119:105",
    learnCtaTitle: "Bạn đã có nền tảng.",
    learnCtaSubtitle: "Giờ hãy mở Kinh thánh và đọc cho chính mình.",
    learnOpenBible: "Mở Kinh thánh",
    learnStructureAllLessons: "Tất cả bài",
    learnStructureNextOrigin: "Tiếp: Nguồn gốc Kinh thánh",
    learnStructModuleNum: "01 / 04",
    learnStructIntro1: "Kinh Thánh không chỉ là một quyển sách — đó là một tuyển tập gồm ",
    learnStructIntro66: "66 sách",
    learnStructIntro2: " được viết trong suốt khoảng ",
    learnStructIntro1500: "1.500 năm",
    learnStructIntro3: " bởi gần ",
    learnStructIntro40: "40 tác giả khác nhau",
    learnStructIntro4:
      ". Dù được hình thành qua nhiều thế kỷ và bối cảnh khác nhau, toàn bộ Kinh Thánh cùng kể một câu chuyện duy nhất: kế hoạch cứu chuộc của Đức Chúa Trời dành cho nhân loại, được hoàn tất trong Đức Chúa Jêsus Christ.",
    learnStructStatBooks: "Sách tổng cộng",
    learnStructStatOT: "Cựu Ước",
    learnStructStatNT: "Tân Ước",
    learnStructStatAuthors: "Tác giả loài người",
    learnStructOTTitle: "Cựu Ước",
    learnStructOTIntro:
      "Được viết chủ yếu bằng tiếng Hê-bơ-rơ (và một phần tiếng A-ram), Cựu Ước ghi lại từ sự sáng tạo vũ trụ cho đến thời kỳ ngay trước khi Chúa Jêsus giáng sinh. Đây là câu chuyện về Đức Chúa Trời, về dân Y-sơ-ra-ên, và về lời hứa lâu dài về một Đấng Cứu Thế sẽ đến.",
    learnStructOTLaw: "Luật pháp",
    learnStructOTLawDesc:
      "Sáng thế ký đến Phục truyền — sáng thế, sự sa ngã và giao ước của Đức Chúa Trời với Y-sơ-ra-ên.",
    learnStructOTHistory: "Lịch sử",
    learnStructOTHistoryDesc:
      "Giô-sué đến Ê-xơ-tê — câu chuyện Y-sơ-ra-ên trong Đất Hứa, các vua, lưu đày và trở về.",
    learnStructOTPoetry: "Thi ca & Khôn ngoan",
    learnStructOTPoetryDesc:
      "Gióp đến Nhã Ca — suy ngẫm về đau khổ, ca ngợi, khôn ngoan và tình yêu.",
    learnStructOTProphets: "Tiên tri",
    learnStructOTProphetsDesc:
      "Ê-sai đến Ma-la-chi — sứ giả của Đức Chúa Trời kêu gọi Y-sơ-ra-ên trở lại, chỉ về Đấng Christ.",
    learnStructNTTitle: "Tân Ước",
    learnStructNTIntro:
      "Được viết bằng tiếng Hy Lạp, Tân Ước mở đầu bằng bốn sách Phúc Âm kể về cuộc đời, chức vụ, sự chết và sự sống lại của Chúa Jêsus. Sau đó là câu chuyện về Hội Thánh đầu tiên lan rộng ra khắp thế giới, và kết thúc bằng khải tượng về sự hoàn tất của lịch sử trong Đấng Christ.",
    learnStructNTGospels: "Phúc âm",
    learnStructNTGospelsDesc:
      "Ma-thi-ơ, Mác, Lu-ca, Giăng — bốn tường thuật về cuộc đời, chức vụ, sự chết và sống lại của Chúa Jêsus.",
    learnStructNTHistory: "Lịch sử",
    learnStructNTHistoryDesc:
      "Công vụ — câu chuyện Hội thánh đầu tiên lan ra từ Giê-ru-sa-lem đến tận cùng trái đất.",
    learnStructNTLetters: "Thư tín",
    learnStructNTLettersDesc:
      "Rô-ma đến Giu-đe — Phao-lô và những người khác viết cho các Hội thánh và cá nhân về đức tin và đời sống.",
    learnStructNTProphecy: "Khải tượng",
    learnStructNTProphecyDesc:
      "Khải huyền — khải tượng về sự kết thúc lịch sử và sự chiến thắng của Đấng Christ.",
    learnStructCentralTitle: "Chủ đề trung tâm",
    learnStructCentralBody:
      "Dù được viết bởi nhiều con người khác nhau qua nhiều thế kỷ, Kinh Thánh chỉ kể một đại câu chuyện: Đức Chúa Trời tạo dựng một thế giới tốt lành. Con người chọn sự phản nghịch. Đức Chúa Trời bắt đầu một kế hoạch giải cứu lâu dài qua dân Y-sơ-ra-ên. Kế hoạch đó đạt đến đỉnh điểm trong Đức Chúa Jêsus Christ — Đấng đã chết và sống lại, mở ra con đường để con người được hòa giải và phục hồi mối tương giao với Đức Chúa Trời.",
    learnStructGlossaryTitle: "Từ vựng nhanh",
    learnStructGlossCovenant: "Giao ước",
    learnStructGlossCovenantDef:
      "Một sự cam kết thiêng liêng giữa Đức Chúa Trời và con người. Giao ước là nền tảng xuyên suốt cả Cựu Ước lẫn Tân Ước.",
    learnStructGlossGospel: "Phúc âm",
    learnStructGlossGospelDef:
      'Nghĩa là "Tin Lành" hay "tin vui" — nói về cuộc đời, sự chết và sự sống lại của Chúa Jêsus vì nhân loại.',
    learnStructGlossProphet: "Tiên tri",
    learnStructGlossProphetDef:
      "Người được Đức Chúa Trời kêu gọi để truyền đạt sứ điệp của Ngài, kêu gọi dân sự ăn năn và sống trung tín.",
    learnStructGlossGrace: "Ân điển",
    learnStructGlossGraceDef:
      "Tình yêu và lòng thương xót mà Đức Chúa Trời ban cho con người cách nhưng không — không phải do công trạng, mà bởi lòng nhân từ của Ngài.",
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
    readOldShort: "舊",
    readNewShort: "新",
    readAll: "全部",
    // Insights
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
    readInsightJohn3Context:
      "這段對話發生在耶穌事工初期，祂與尼哥底母談論「重生」，開啟了重要的屬靈主題。",
    readInsightJohn3Explanation:
      "耶穌說明「重生」不是肉身再生，而是聖靈帶來的內在更新。約翰福音 3:16 顯明神愛世人，並藉著信靠獨生子賜下永生。",
    readInsightJohn3Reflection1: "「重生」對你個人意味著什麼？",
    readInsightJohn3Reflection2: "風的比喻如何幫助你理解屬靈的改變？",
    // Learn
    learnStartHere: "Start Here",
    learnTitle: "Begin with the foundation.",
    learnSubtitle:
      "Before reading deeply, take a moment to understand what the Bible is, who Jesus is, and what faith truly means.",
    learnModule1Title: "What Is the Bible?",
    learnModule1Desc:
      "Discover what the Bible is, how it is structured, who wrote it, and the redemptive story woven through every page.",
    learnModule2Title: "Bible Origin & Canon",
    learnModule2Desc:
      "Explore how Scripture was preserved across centuries, from ancient manuscripts to the Bible we hold today.",
    learnModule3Title: "Who Is Jesus?",
    learnModule3Desc:
      "Understand who Jesus claimed to be — fully God, fully man — and why his life, death, and resurrection change everything.",
    learnModule4Title: "What Is Faith?",
    learnModule4Desc:
      "Learn what it means to trust God — grace, repentance, prayer, and beginning a real relationship with Him.",
    learnMinRead: "{min} 分鐘閱讀",
    learnVerse: "你的話是我腳前的燈，是我路上的光。",
    learnVerseRef: "詩篇 119:105",
    learnCtaTitle: "你已有根基。",
    learnCtaSubtitle: "現在打開聖經，親自閱讀。",
    learnOpenBible: "打開聖經",
    learnStructureAllLessons: "所有課程",
    learnStructureNextOrigin: "下一課：聖經的來源",
    learnStructModuleNum: "01 / 04",
    learnStructIntro1: "聖經不只是一本書——它是在",
    learnStructIntro66: "六十六卷書",
    learnStructIntro2: "、約",
    learnStructIntro1500: "一千五百年",
    learnStructIntro3: "間、由約",
    learnStructIntro40: "四十位不同作者",
    learnStructIntro4: "寫成的合集。儘管內容多元，它述說一個統一的故事：神透過耶穌基督鍥而不捨地救贖人類。",
    learnStructStatBooks: "書卷總數",
    learnStructStatOT: "舊約",
    learnStructStatNT: "新約",
    learnStructStatAuthors: "人類作者",
    learnStructOTTitle: "舊約",
    learnStructOTIntro: "述說創造、人類悖逆，以及神逐步展開的應許——藉著以色列預備將要來的救主。",
    learnStructOTLaw: "律法書",
    learnStructOTLawDesc: "創世記至申命記——創造、墮落，以及神與以色列所立之約。",
    learnStructOTHistory: "歷史書",
    learnStructOTHistoryDesc: "約書亞記至以斯帖記——以色列在應許之地的歷史、列王、被擄與歸回。",
    learnStructOTPoetry: "詩歌與智慧書",
    learnStructOTPoetryDesc: "約伯記至雅歌——對苦難、讚美、智慧與愛的反思。",
    learnStructOTProphets: "先知書",
    learnStructOTProphetsDesc: "以賽亞書至瑪拉基書——神的使者呼召以色列歸回，並指向基督。",
    learnStructNTTitle: "新約",
    learnStructNTIntro:
      "以耶穌的生平開始，記述早期教會的誕生，並以歷史在基督裡終極實現的異象作結。",
    learnStructNTGospels: "福音書",
    learnStructNTGospelsDesc: "馬太、馬可、路加、約翰——四卷對耶穌生平、事奉、受死與復活的記述。",
    learnStructNTHistory: "歷史書",
    learnStructNTHistoryDesc: "使徒行傳——早期教會從耶路撒冷傳到地極的故事。",
    learnStructNTLetters: "書信",
    learnStructNTLettersDesc: "羅馬書至猶大書——保羅等人寫給教會與個人的信仰與生活教導。",
    learnStructNTProphecy: "預言",
    learnStructNTProphecyDesc: "啟示錄——歷史終結與基督得勝的異象。",
    learnStructCentralTitle: "中心主題",
    learnStructCentralBody:
      "聖經雖由許多人在不同世紀寫成，卻述說一個宏大的故事：神創造美好的世界，人類背離，神透過以色列展開耐心的救贖計劃，這計劃在耶穌基督裡達到高潮——祂的死與復活開通了與神恢復、得新生命的道路。",
    learnStructGlossaryTitle: "簡要詞彙",
    learnStructGlossCovenant: "約",
    learnStructGlossCovenantDef: "神與祂子民之間神聖的協定或應許，是舊約與新約的核心。",
    learnStructGlossGospel: "福音",
    learnStructGlossGospelDef: "字意為「好消息」——指耶穌基督生平、受死與復活的信息。",
    learnStructGlossProphet: "先知",
    learnStructGlossProphetDef:
      "蒙神呼召向百姓傳講祂信息的人，常呼籲人回轉忠心，有時揭示神在未來要做的事。",
    learnStructGlossGrace: "恩典",
    learnStructGlossGraceDef: "神白白的恩惠——祂無條件賜下的愛與憐憫，非人靠己力可賺取。",
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
