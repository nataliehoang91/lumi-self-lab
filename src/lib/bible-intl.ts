/**
 * Bible app UI strings (intl-style).
 * Single source of truth for EN / VI / ZH; use message keys and interpolation.
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
    learnStructureAllLessons: "All lessons",
    learnStructurePrevious: "Previous",
    learnStructureNext: "Next",
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
    learnStructStatAuthors: "Authors",
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
    // Bible Origin (02 / 04)
    learnOriginModuleNum: "02 / 04",
    learnOriginTitle: "Bible Origin & Canon Formation",
    learnOriginIntro:
      "How did 66 books, written by more than 40 authors across 1,500 years and three continents, come to be recognised as a single authoritative text? The story spans ancient Israel, the early church, manuscript transmission, and archaeological discoveries that continue to shape our understanding today.",

    learnOriginSummary: "Summary",
    learnOriginDeepDive: "Deep Dive",

    learnOriginOriginalLanguages: "Original Languages",

    learnOriginLangHebrew: "Hebrew",
    learnOriginLangHebrewNote:
      "The primary language of the Old Testament — the language of Israel's law, poetry, and prophecy.",

    learnOriginLangGreek: "Greek",
    learnOriginLangGreekNote:
      "Koine Greek — the common language of the Roman Empire and the original language of the New Testament.",

    learnOriginLangAramaic: "Aramaic",
    learnOriginLangAramaicNote:
      "A related Semitic language used in parts of Daniel and Ezra, and widely spoken in the time of Jesus.",

    learnOriginTimeline: "Manuscript Timeline",
    learnOriginMapTitle: "Biblical Manuscript Map",
    learnOriginMapBody:
      "A few of the key locations where Scripture was written, copied, translated, and preserved.",
    learnOriginLocJerusalem: "Jerusalem",
    learnOriginLocJerusalemDesc:
      "The spiritual centre of ancient Israel and the site of the Temple, where the Law was read and preserved.",
    learnOriginLocQumran: "Qumran",
    learnOriginLocQumranDesc:
      "Desert community near the Dead Sea where the Dead Sea Scrolls were discovered in 1947, confirming the reliability of Old Testament manuscripts.",
    learnOriginLocAlexandria: "Alexandria",
    learnOriginLocAlexandriaDesc:
      "A major centre of learning in the ancient world, where Jewish scholars produced the Greek translation of the Old Testament (the Septuagint).",
    learnOriginLocRome: "Rome",
    learnOriginLocRomeDesc:
      "Capital of the Roman Empire, where early Christian communities formed and key Latin translations like the Vulgate were produced.",
    learnOriginLocAntioch: "Antioch",
    learnOriginLocAntiochDesc:
      "One of the first major Gentile churches; a launching point for Paul’s missionary journeys and the spread of the New Testament.",
    learnOriginLocSinai: "Mount Sinai",
    learnOriginLocSinaiDesc:
      "The traditional site where Moses received the Law — the beginning of Israel’s written Scriptures.",

    learnOriginT1Year: "~1400 BC",
    learnOriginT1Event: "Earliest Old Testament Books Written (Pentateuch)",
    learnOriginT1Desc:
      "The Pentateuch laid the foundation of Israel’s faith — including the Law, the primeval history, and the covenant between God and His people.",

    learnOriginT2Year: "~450 BC",
    learnOriginT2Event: "Old Testament Canon Largely Established",
    learnOriginT2Desc:
      "The Law and the Prophets were firmly established in Jewish worship and community life, forming the core of the Hebrew canon.",

    learnOriginT3Year: "~250 BC",
    learnOriginT3Event: "The Septuagint Produced in Alexandria",
    learnOriginT3Desc:
      "The first Greek translation of the Old Testament made the Scriptures accessible to the Hellenistic world and was widely used in the early Church.",

    learnOriginT4Year: "50–95 AD",
    learnOriginT4Event: "New Testament Books Written",
    learnOriginT4Desc:
      "The Gospels and apostolic letters were copied and circulated among churches throughout the Roman Empire, gradually being recognised as carrying spiritual authority.",

    learnOriginT5Year: "367 AD",
    learnOriginT5Event: "Athanasius Lists the 27 New Testament Books",
    learnOriginT5Desc:
      "For the first time, the full list of the 27 New Testament books was clearly recorded, reflecting the writings already widely used in the Church.",

    learnOriginT6Year: "~400 AD",
    learnOriginT6Event: "Jerome Completes the Vulgate",
    learnOriginT6Desc:
      "The Latin translation became the standard Bible of Western Christianity for over a millennium.",

    learnOriginT7Year: "1947",
    learnOriginT7Event: "Discovery of the Dead Sea Scrolls",
    learnOriginT7Desc:
      "Manuscripts dating as early as the third century BC demonstrated the remarkable preservation of the Old Testament text across many centuries of transmission.",

    learnOriginReliableTitle: "Why Is the Bible Considered Reliable?",

    learnOriginReliableP1:
      "The New Testament is supported by more manuscript evidence than any other work of ancient literature — over 5,800 Greek manuscripts and more than 25,000 in total across ancient languages. The time gap between the original writings and our earliest surviving copies is comparatively short, often within a few generations.",

    learnOriginReliableP2:
      "The discovery of the Dead Sea Scrolls demonstrated that the Hebrew Scriptures had been preserved with extraordinary consistency over centuries of careful copying. Jewish scribal tradition was highly meticulous, contributing to the stability of the biblical text over time.",

    learnOriginFAQTitle: "Common Questions",

    learnOriginFAQ1Q: "Why do Protestant and Catholic Bibles differ in length?",

    learnOriginFAQ1A:
      "Catholic Bibles include seven additional books often called the Deuterocanonical books, written during the intertestamental period. Protestant Reformers followed the traditional Hebrew canon, which did not include these writings — resulting in 66 books in most Protestant Bibles and 73 in Catholic editions.",

    learnOriginFAQ2Q: "What are the Dead Sea Scrolls and why do they matter?",

    learnOriginFAQ2A:
      "Discovered in 1947 near the Dead Sea, the scrolls contain some of the oldest known manuscripts of the Hebrew Bible, dating as early as the third century BC. When compared with later medieval manuscripts, the text shows remarkable consistency, providing strong evidence for careful transmission over time.",

    learnOriginFAQ3Q: "What languages was the Bible originally written in?",

    learnOriginFAQ3A:
      "The Old Testament was written primarily in Hebrew, with portions in Aramaic. The New Testament was written in Koine Greek, the widely spoken language of the eastern Roman Empire in the first century.",

    learnOriginFAQ4Q: "How was the New Testament canon recognised?",

    learnOriginFAQ4A:
      "Early Christian communities evaluated writings based on apostolic connection, consistency with established teaching, and widespread usage in churches. By the fourth century, the 27 books of the New Testament were broadly recognised across the Christian world. Church councils later affirmed what had already become widely accepted.",
    // Who Is Jesus (03 / 04)
    learnJesusModuleNum: "03 / 04",
    learnJesusTitle: "Who Is Jesus?",
    learnJesusIntro1: "For over two thousand years, people have debated who {jesus} really was. ",
    learnJesusIntro1Quote:
      "A teacher? A prophet? A revolutionary? A myth? A Son of God? Or someone who is far greater than we can imagine?",
    learnJesusIntro2:
      "{jesus} of Nazareth is the central figure of the entire Bible — not just the New Testament. Everything in the Old Testament points toward {him}; everything after {him} flows from {him}.",
    learnJesusFullyTitle: "Fully God. Fully Man.",
    learnJesusHumanTitle: "Fully Human",
    learnJesusHumanBody:
      "{jesus} was born, grew up in an ordinary family, felt hunger and exhaustion, experienced sorrow, and ultimately faced death. {he} entered the human condition fully — not from a distance, but from within.",
    learnJesusHumanRef: "John 11:35 · Hebrews 4:15",
    learnJesusDivineTitle: "Fully Divine",
    learnJesusDivineBody:
      "Yet {he} also forgave sins, commanded the wind and waves, received worship, and rose from the dead. The New Testament presents {him} not merely as a messenger of God, but as God incarnate.",
    learnJesusDivineRef: "John 1:1 · Colossians 2:9",
    // What Is Faith (04 / 04)
    learnFaithModuleNum: "04 / 04",
    learnJesusCrossTitle: "The Cross & Resurrection",
    learnJesusCrossP1:
      "Around 30 AD, {jesus} was crucified under the Roman governor Pontius Pilate. Christians believe this was not a tragic accident of history, but the center of God's redemptive plan. On the cross, {he} willingly bore the weight of human sin — opening the way for forgiveness and reconciliation with God.",
    learnJesusCrossP2:
      "Three days later, {he} rose bodily from the dead. This resurrection was proclaimed from the earliest days of the church, supported by eyewitness testimony and multiple independent accounts. For Christians, it is not a symbol, but the decisive turning point of history.",
    learnJesusCrossRef: "1 Corinthians 15:3–8",
    learnJesusProphecyTitle: "Fulfilment of Prophecy",
    learnJesusProphecyIntro:
      "Long before {jesus} was born, the Hebrew Scriptures spoke of a coming Messiah — describing his birthplace, his suffering, and even the manner of his death. Christians believe these promises converged in {him}. Here are six examples.",
    learnJesusP1Prophecy: "Born in Bethlehem",
    learnJesusP1Ref: "Micah 5:2",
    learnJesusP1Fulfilled: "Matthew 2:1",
    learnJesusP2Prophecy: "Born of a virgin",
    learnJesusP2Ref: "Isaiah 7:14",
    learnJesusP2Fulfilled: "Luke 1:27",
    learnJesusP3Prophecy: "Entered Jerusalem on a donkey",
    learnJesusP3Ref: "Zechariah 9:9",
    learnJesusP3Fulfilled: "Mark 11:7",
    learnJesusP4Prophecy: "Betrayed for 30 pieces of silver",
    learnJesusP4Ref: "Zechariah 11:12",
    learnJesusP4Fulfilled: "Matthew 26:15",
    learnJesusP5Prophecy: "Crucified, hands and feet pierced",
    learnJesusP5Ref: "Psalm 22:16",
    learnJesusP5Fulfilled: "Luke 24:39",
    learnJesusP6Prophecy: "Rose from the dead",
    learnJesusP6Ref: "Psalm 16:10",
    learnJesusP6Fulfilled: "Acts 2:31",
    learnJesusWhyTitle: "Why Does Jesus Matter Today?",
    learnJesusWhyP1:
      'If {jesus} truly rose from the dead, then {his} life cannot be reduced to a moral example or an inspiring story. {he} claimed to be "the way, the truth, and the life" (John 14:6) — not simply offering advice, but inviting people into reconciliation with God.',
    learnJesusWhyP2:
      "For Christians, faith in {jesus} is not merely belief in a doctrine, but trust in a living person — one who offers forgiveness, purpose, and eternal hope.",
    learnJesusReadGospels: "Read the Gospels",
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
    learnStructureAllLessons: "Tất cả bài",
    learnStructurePrevious: "Trước",
    learnStructureNext: "Tiếp",
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
    learnStructStatAuthors: "Tác giả",
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
    learnOriginModuleNum: "02 / 04",
    learnOriginTitle: "Nguồn gốc Kinh thánh & Hình thành Chính Điển",
    learnOriginIntro:
      "Làm thế nào 66 sách, được viết bởi hàng chục tác giả qua 1.500 năm, được công nhận là một văn bản có thẩm quyền? Câu trả lời trải dài từ bản thảo cổ đại, tranh luận trong Hội thánh sơ khai, đến các khám phá khảo cổ.",
    learnOriginSummary: "Tóm tắt",
    learnOriginDeepDive: "Đào sâu",
    learnOriginOriginalLanguages: "Ngôn ngữ gốc",
    learnOriginLangHebrew: "Hê-bơ-rơ",
    learnOriginLangHebrewNote: "Phần lớn Cựu Ước",
    learnOriginLangGreek: "Hy Lạp",
    learnOriginLangGreekNote: "Toàn bộ Tân Ước",
    learnOriginLangAramaic: "A-ram",
    learnOriginLangAramaicNote: "Một số đoạn trong Đa-ni-ên & E-xơ-ra",
    learnOriginTimeline: "Dòng thời gian bản thảo",
    learnOriginMapTitle: "Bản đồ bản thảo Kinh thánh",
    learnOriginMapBody:
      "Một vài địa điểm trọng yếu nơi Kinh thánh được viết, sao chép, dịch và được gìn giữ qua nhiều thế kỷ.",
    learnOriginLocJerusalem: "Giê-ru-sa-lem",
    learnOriginLocJerusalemDesc:
      "Trung tâm thuộc linh của dân Y-sơ-ra-ên xưa, nơi Đền thờ được xây dựng và Lời Chúa được đọc công khai.",
    learnOriginLocQumran: "Qumran",
    learnOriginLocQumranDesc:
      "Vùng gần Biển Chết, nơi Cuộn Sách Biển Chết được phát hiện năm 1947, xác nhận độ chính xác của bản thảo Cựu Ước.",
    learnOriginLocAlexandria: "A-léc-xan-ri-a",
    learnOriginLocAlexandriaDesc:
      "Thành phố cảng lớn với cộng đồng Do Thái đông đảo, nơi bản dịch Hy Lạp của Cựu Ước (Bản Bảy Mươi) được hình thành.",
    learnOriginLocRome: "Rô-ma",
    learnOriginLocRomeDesc:
      "Thủ đô Đế quốc La Mã, nơi Hội thánh sơ khai được gây dựng và bản dịch Latin Vulgate có ảnh hưởng sâu rộng.",
    learnOriginLocAntioch: "An-ti-ốt",
    learnOriginLocAntiochDesc:
      'Nơi các môn đồ lần đầu tiên được gọi là "Cơ Đốc nhân" và là điểm xuất phát của nhiều chuyến hành trình truyền giáo của Phao-lô.',
    learnOriginLocSinai: "Núi Si-na-i",
    learnOriginLocSinaiDesc:
      "Nơi Môi-se nhận Luật pháp theo tường thuật Kinh Thánh — điểm khởi đầu quan trọng của văn bản Kinh Thánh.",
    learnOriginT1Year: "~1400 TCN",
    learnOriginT1Event: "Các sách Cựu Ước sớm nhất được viết (Ngũ Kinh)",
    learnOriginT1Desc:
      "Ngũ Kinh đặt nền tảng cho đức tin Israel — bao gồm luật pháp, lịch sử khởi nguyên và giao ước giữa Đức Chúa Trời với dân Ngài.",
    learnOriginT2Year: "~450 TCN",
    learnOriginT2Event: "Canon Cựu Ước cơ bản hoàn chỉnh",
    learnOriginT2Desc:
      "Luật pháp và các sách Tiên tri được xác lập vững chắc trong đời sống thờ phượng Do Thái, hình thành cốt lõi của chính điển Hê-bơ-rơ.",
    learnOriginT3Year: "~250 TCN",
    learnOriginT3Event: "Bản Bảy Mươi ra đời tại Alexandria",
    learnOriginT3Desc:
      "Bản dịch Hy Lạp đầu tiên của Cựu Ước giúp Kinh Thánh tiếp cận thế giới Hy Lạp hóa và được sử dụng rộng rãi trong Hội Thánh đầu tiên.",
    learnOriginT4Year: "50–95 SCN",
    learnOriginT4Event: "Các sách Tân Ước được viết",
    learnOriginT4Desc:
      "Các thư tín và sách Tin Lành được sao chép, lưu hành giữa các Hội Thánh khắp Đế quốc La Mã, dần được xem là có thẩm quyền thuộc linh.",
    learnOriginT5Year: "367 SCN",
    learnOriginT5Event: "Athanasius liệt kê 27 sách Tân Ước",
    learnOriginT5Desc:
      "Lần đầu tiên danh sách 27 sách Tân Ước được ghi lại rõ ràng, phản ánh những bản văn đã được sử dụng rộng rãi trong Hội Thánh.",
    learnOriginT6Year: "400 SCN",
    learnOriginT6Event: "Jerome hoàn thành Vulgate",
    learnOriginT6Desc:
      "Bản dịch Kinh Thánh sang tiếng Latin này trở thành bản văn chuẩn tại Tây phương suốt hơn một thiên niên kỷ.",
    learnOriginT7Year: "1947",
    learnOriginT7Event: "Cuộn Sách Biển Chết được phát hiện",
    learnOriginT7Desc:
      "Các bản thảo cổ từ thế kỷ thứ ba TCN cho thấy văn bản Cựu Ước được bảo tồn với độ chính xác đáng kinh ngạc qua nhiều thế kỷ.",
    learnOriginReliableTitle: "Tại sao Kinh thánh được xem là đáng tin?",
    learnOriginReliableP1:
      "Tân Ước có nhiều bằng chứng bản thảo hơn bất kỳ tài liệu cổ đại nào — hơn 5.800 bản thảo Hy Lạp, so với chưa đến 650 bản cho Iliad của Homer. Khoảng cách thời gian giữa bản gốc và bản thảo còn lại sớm nhất cũng rất ngắn (vài thập kỷ, không phải thế kỷ).",
    learnOriginReliableP2:
      "Cuộn Sách Biển Chết xác nhận văn bản Cựu Ước được bảo tồn với độ chính xác phi thường qua hơn một ngàn năm sao chép. Truyền thống kinh sư trong Do Thái giáo rất tỉ mỉ — một lỗi trên một trang có thể khiến phải hủy toàn bộ cuộn.",
    learnOriginFAQTitle: "Câu hỏi thường gặp",
    learnOriginFAQ1Q: "Tại sao Kinh thánh Tin Lành và Công giáo khác nhau về độ dài?",
    learnOriginFAQ1A:
      "Kinh thánh Công giáo gồm thêm 7 sách gọi là Deuterocanonical (hoặc Apocrypha), viết giữa thời Cựu Ước và Tân Ước. Các nhà Cải chính Tin Lành theo canon Hê-bơ-rơ, loại trừ các sách này, nên hầu hết Kinh thánh Tin Lành có 66 sách còn Kinh thánh Công giáo có 73.",
    learnOriginFAQ2Q: "Cuộn Sách Biển Chết là gì và tại sao quan trọng?",
    learnOriginFAQ2A:
      "Được phát hiện năm 1947 gần Biển Chết, các cuộn là bản thảo Hê-bơ-rơ cổ nhất — một số từ khoảng 200 TCN. So với bản thảo sau này, văn bản được bảo tồn đáng kinh ngạc, cung cấp bằng chứng mạnh mẽ cho sự truyền tải chính xác của Kinh thánh qua nhiều thế kỷ.",
    learnOriginFAQ3Q: "Kinh thánh ban đầu được viết bằng ngôn ngữ nào?",
    learnOriginFAQ3A:
      "Cựu Ước chủ yếu viết bằng tiếng Hê-bơ-rơ, một phần nhỏ bằng tiếng A-ram. Tân Ước viết bằng tiếng Hy Lạp Koine — ngôn ngữ phổ thông của thế giới Địa Trung Hải thế kỷ nhất.",
    learnOriginFAQ4Q: "Canon Tân Ước được quyết định như thế nào?",
    learnOriginFAQ4A:
      "Hội thánh sơ khai kiểm tra các tác phẩm theo ba tiêu chí: tác giả sứ đồ (viết bởi sứ đồ hoặc người gần gũi), nhất quán với giáo lý đã được thiết lập, và được sử dụng rộng rãi trong các Hội thánh. Đến thế kỷ 4, 27 sách Tân Ước đã được công nhận rộng rãi.",
    learnJesusModuleNum: "03 / 04",
    learnJesusTitle: "Chúa Jêsus Là Ai?",
    learnJesusIntro1:
      "Trong suốt hơn hai nghìn năm, con người vẫn tranh luận về thân vị của {jesus}. ",
    learnJesusIntro1Quote:
      "Ngài là một thầy giáo? Một nhà tiên tri? Một nhà cách mạng? Một huyền thoại? Con Đức Chúa Trời? Hay là Đấng vượt xa mọi tưởng tượng của chúng ta?",
    learnJesusIntro2:
      "{jesus} người Na-xa-rét là nhân vật trung tâm của toàn bộ Kinh Thánh — không chỉ riêng Tân Ước. Mọi điều trong Cựu Ước đều hướng về {him}; và mọi điều sau {him} đều xuất phát từ {him}.",
    learnJesusFullyTitle: "Trọn Vẹn Là Đức Chúa Trời. Trọn Vẹn Là Con Người.",
    learnJesusHumanTitle: "Hoàn Toàn Là Con Người",
    learnJesusHumanBody:
      "{jesus} được sinh ra, lớn lên trong một gia đình bình thường, biết đói, biết mệt, từng buồn khóc và cuối cùng đối diện với sự chết. {he} bước vào thân phận con người cách trọn vẹn — không từ xa, nhưng từ bên trong.",
    learnJesusHumanRef: "Giăng 11:35 · Hê-bơ-rơ 4:15",
    learnJesusDivineTitle: "Hoàn Toàn Là Đức Chúa Trời",
    learnJesusDivineBody:
      "Tuy nhiên, {he} cũng tha tội, khiến gió và biển phải vâng lời, nhận sự thờ phượng, và sống lại từ cõi chết. Tân Ước không chỉ trình bày {him} như một sứ giả của Đức Chúa Trời, nhưng là Đức Chúa Trời nhập thể.",
    learnJesusDivineRef: "Giăng 1:1 · Cô-lô-se 2:9",
    // Đức tin là gì? (04 / 04)
    learnFaithModuleNum: "04 / 04",
    learnJesusCrossTitle: "Thập Tự Giá & Sự Phục Sinh",
    learnJesusCrossP1:
      "Khoảng năm 30 sau Công Nguyên, {jesus} bị đóng đinh dưới thời tổng đốc La Mã Bôn-xơ Phi-lát. Người tin Chúa tin rằng đây không phải là một tai nạn lịch sử, nhưng là trung tâm của kế hoạch cứu chuộc của Đức Chúa Trời. Trên thập tự giá, {he} tự nguyện gánh lấy tội lỗi nhân loại — mở đường cho sự tha thứ và sự hòa giải với Đức Chúa Trời.",
    learnJesusCrossP2:
      "Ba ngày sau, {he} sống lại cách thân thể. Sự phục sinh này được công bố ngay từ những ngày đầu của Hội Thánh, được xác nhận bởi nhiều nhân chứng và nhiều nguồn tường thuật độc lập. Đối với người tin Chúa, đây không chỉ là biểu tượng, mà là bước ngoặt quyết định của lịch sử.",
    learnJesusCrossRef: "I Cô-rinh-tô 15:3–8",
    learnJesusProphecyTitle: "Sự Ứng Nghiệm Lời Tiên Tri",
    learnJesusProphecyIntro:
      "Từ nhiều thế kỷ trước khi {jesus} ra đời, Kinh Thánh đã nói về một Đấng Mê-si sẽ đến — mô tả nơi sinh, sự chịu khổ, và thậm chí cách {he} chịu chết. Người tin Chúa tin rằng những lời hứa ấy đã được ứng nghiệm nơi {him}. Dưới đây là sáu ví dụ tiêu biểu.",
    learnJesusP1Prophecy: "Sinh tại Bết-lê-hem",
    learnJesusP1Ref: "Mi-chê 5:2",
    learnJesusP1Fulfilled: "Ma-thi-ơ 2:1",
    learnJesusP2Prophecy: "Sinh bởi nữ đồng trinh",
    learnJesusP2Ref: "Ê-sai 7:14",
    learnJesusP2Fulfilled: "Lu-ca 1:27",
    learnJesusP3Prophecy: "Vào Giê-ru-sa-lem trên lưng lừa",
    learnJesusP3Ref: "Xa-cha-ri 9:9",
    learnJesusP3Fulfilled: "Mác 11:7",
    learnJesusP4Prophecy: "Bị phản bội với 30 miếng bạc",
    learnJesusP4Ref: "Xa-cha-ri 11:12",
    learnJesusP4Fulfilled: "Ma-thi-ơ 26:15",
    learnJesusP5Prophecy: "Bị đóng đinh, tay chân bị đâm",
    learnJesusP5Ref: "Thi Thiên 22:16",
    learnJesusP5Fulfilled: "Lu-ca 24:39",
    learnJesusP6Prophecy: "Sống lại từ cõi chết",
    learnJesusP6Ref: "Thi Thiên 16:10",
    learnJesusP6Fulfilled: "Công Vụ 2:31",
    learnJesusWhyTitle: "Vì Sao Chúa Jêsus Vẫn Quan Trọng Ngày Nay?",
    learnJesusWhyP1:
      'Nếu {jesus} thật sự đã sống lại từ cõi chết, thì cuộc đời {him} không thể chỉ được xem như một tấm gương đạo đức hay một câu chuyện truyền cảm hứng. {he} tự xưng là "đường đi, lẽ thật và sự sống" (Giăng 14:6) — không chỉ đưa ra lời khuyên, mà mời gọi con người bước vào mối tương giao với Đức Chúa Trời.',
    learnJesusWhyP2:
      "Đối với người tin Chúa, đức tin nơi {him} không chỉ là chấp nhận một giáo lý, mà là đặt lòng tin nơi một Đấng đang sống — Đấng ban sự tha thứ, mục đích sống và hy vọng đời đời.",
    learnJesusReadGospels: "Đọc Phúc Âm",
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
    learnStructureAllLessons: "所有課程",
    learnStructurePrevious: "上一課",
    learnStructureNext: "下一課",
    learnStructureNextOrigin: "下一課：聖經的來源",
    learnStructModuleNum: "01 / 04",
    learnStructIntro1: "聖經不只是一本書——它是在",
    learnStructIntro66: "六十六卷書",
    learnStructIntro2: "、約",
    learnStructIntro1500: "一千五百年",
    learnStructIntro3: "間、由約",
    learnStructIntro40: "四十位不同作者",
    learnStructIntro4:
      "寫成的合集。儘管內容多元，它述說一個統一的故事：神透過耶穌基督鍥而不捨地救贖人類。",
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
    // 信心是什麼？(04 / 04)
    learnFaithModuleNum: "04 / 04",
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
    learnOriginModuleNum: "02 / 04",
    learnOriginTitle: "聖經的來源與正典形成",
    learnOriginIntro:
      "六十六卷書由數十人在一千五百年間寫成，如何被承認為一部具權威的經卷？答案涉及古代抄本、早期教會辯論與考古發現。",
    learnOriginSummary: "摘要",
    learnOriginDeepDive: "深入",
    learnOriginOriginalLanguages: "原文語言",
    learnOriginLangHebrew: "希伯來文",
    learnOriginLangHebrewNote: "舊約大部分",
    learnOriginLangGreek: "希臘文",
    learnOriginLangGreekNote: "新約全部",
    learnOriginLangAramaic: "亞蘭文",
    learnOriginLangAramaicNote: "但以理書、以斯拉記部分",
    learnOriginTimeline: "抄本時間線",
    learnOriginT1Year: "公元前 1400",
    learnOriginT1Event: "舊約最早經卷寫成（律法書／摩西五經）",
    learnOriginT2Year: "公元前 450",
    learnOriginT2Event: "舊約正典大致完成",
    learnOriginT3Year: "公元前 250",
    learnOriginT3Event: "七十士譯本（舊約希臘譯本）於亞歷山大完成",
    learnOriginT4Year: "公元 50–95",
    learnOriginT4Event: "新約各書由使徒與早期門徒寫成",
    learnOriginT5Year: "公元 367",
    learnOriginT5Event: "亞他那修列出 27 卷新約書目——與今相同",
    learnOriginT6Year: "公元 400",
    learnOriginT6Event: "耶柔米完成武加大譯本（拉丁文聖經）",
    learnOriginT7Year: "1947",
    learnOriginT7Event: "死海古卷於昆蘭發現——證實舊約抄本準確性",
    learnOriginReliableTitle: "為何聖經被視為可靠？",
    learnOriginReliableP1:
      "新約擁有比任何古代文獻更多的抄本證據——超過 5,800 份希臘文抄本，相較於荷馬《伊利亞特》的不到 650 份。原典與現存最早抄本之間的時間差也極短（數十年而非數百年）。",
    learnOriginReliableP2:
      "死海古卷證實舊約經文在逾千年的抄寫中保存得極為準確。猶太教的抄經傳統極為嚴謹——一頁有一處錯誤就可能要銷毀整卷。",
    learnOriginFAQTitle: "常見問題",
    learnOriginFAQ1Q: "為何新教與天主教聖經篇幅不同？",
    learnOriginFAQ1A:
      "天主教聖經多出 7 卷次經（或稱旁經），寫於舊約與新約之間。早期新教改革者依希伯來正典，不納入這些書卷，故多數新教聖經為 66 卷，天主教聖經為 73 卷。",
    learnOriginFAQ2Q: "死海古卷是什麼？為何重要？",
    learnOriginFAQ2A:
      "1947 年於死海附近發現的古卷，是現存最古老的希伯來聖經抄本——部分可溯至公元前 200 年。與後世抄本對照，經文保存極為完整，為聖經在歷代傳抄中的準確性提供有力證據。",
    learnOriginFAQ3Q: "聖經原本用什麼語言寫成？",
    learnOriginFAQ3A:
      "舊約主要用希伯來文，少部分用亞蘭文。新約用通用希臘文（Koine）寫成——即一世紀地中海世界的日常用語。",
    learnOriginFAQ4Q: "新約正典如何確定？",
    learnOriginFAQ4A:
      "早期教會以三項標準檢驗著作：使徒作者（由使徒或親近者所寫）、與既有教義一致、在教會中廣泛使用。至四世紀，新約 27 卷已獲普遍認可。",
    learnJesusModuleNum: "03 / 04",
    learnJesusTitle: "Who Is Jesus?",
    learnJesusIntro1: "For over two thousand years, people have debated who {jesus} really was. ",
    learnJesusIntro1Quote:
      "A teacher? A prophet? A revolutionary? A myth? A Son of God? A Messiah? A saviour? Or someone who is far greater than we can imagine?",
    learnJesusIntro2:
      "{jesus} of Nazareth is the central figure of the entire Bible — not just the New Testament. Everything in the Old Testament points toward him; everything after him flows from him.",
    learnJesusFullyTitle: "Fully God. Fully Man.",
    learnJesusHumanTitle: "Fully Human",
    learnJesusHumanBody:
      "Jesus was born, grew up in an ordinary family, felt hunger and exhaustion, experienced sorrow, and ultimately faced death. He entered the human condition fully — not from a distance, but from within.",
    learnJesusHumanRef: "John 11:35 · Hebrews 4:15",
    learnJesusDivineTitle: "Fully Divine",
    learnJesusDivineBody:
      "Yet he also forgave sins, commanded the wind and waves, received worship, and rose from the dead. The New Testament presents him not merely as a messenger of God, but as God incarnate.",
    learnJesusDivineRef: "John 1:1 · Colossians 2:9",
    learnJesusCrossTitle: "The Cross & Resurrection",
    learnJesusCrossP1:
      "Around 30 AD, Jesus was crucified under the Roman governor Pontius Pilate. Christians believe this was not a tragic accident of history, but the center of God's redemptive plan. On the cross, he willingly bore the weight of human sin — opening the way for forgiveness and reconciliation with God.",
    learnJesusCrossP2:
      "Three days later, he rose bodily from the dead. This resurrection was proclaimed from the earliest days of the church, supported by eyewitness testimony and multiple independent accounts. For Christians, it is not a symbol, but the decisive turning point of history.",
    learnJesusCrossRef: "1 Corinthians 15:3–8",
    learnJesusProphecyTitle: "Fulfilment of Prophecy",
    learnJesusProphecyIntro:
      "Long before Jesus was born, the Hebrew Scriptures spoke of a coming Messiah — describing his birthplace, his suffering, and even the manner of his death. Christians believe these promises converged in him. Here are six examples.",
    learnJesusP1Prophecy: "Born in Bethlehem",
    learnJesusP1Ref: "Micah 5:2",
    learnJesusP1Fulfilled: "Matthew 2:1",
    learnJesusP2Prophecy: "Born of a virgin",
    learnJesusP2Ref: "Isaiah 7:14",
    learnJesusP2Fulfilled: "Luke 1:27",
    learnJesusP3Prophecy: "Entered Jerusalem on a donkey",
    learnJesusP3Ref: "Zechariah 9:9",
    learnJesusP3Fulfilled: "Mark 11:7",
    learnJesusP4Prophecy: "Betrayed for 30 pieces of silver",
    learnJesusP4Ref: "Zechariah 11:12",
    learnJesusP4Fulfilled: "Matthew 26:15",
    learnJesusP5Prophecy: "Crucified, hands and feet pierced",
    learnJesusP5Ref: "Psalm 22:16",
    learnJesusP5Fulfilled: "Luke 24:39",
    learnJesusP6Prophecy: "Rose from the dead",
    learnJesusP6Ref: "Psalm 16:10",
    learnJesusP6Fulfilled: "Acts 2:31",
    learnJesusWhyTitle: "Why Does Jesus Matter Today?",
    learnJesusWhyP1:
      'If Jesus truly rose from the dead, then his life cannot be reduced to a moral example or an inspiring story. He claimed to be "the way, the truth, and the life" (John 14:6) — not simply offering advice, but inviting people into reconciliation with God.',
    learnJesusWhyP2:
      "For Christians, faith in Jesus is not merely belief in a doctrine, but trust in a living person — one who offers forgiveness, purpose, and eternal hope.",
    learnJesusReadGospels: "Read the Gospels",
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
