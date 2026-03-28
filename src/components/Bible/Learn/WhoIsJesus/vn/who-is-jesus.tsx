"use client";

import { LearnLessonIntro } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnLessonIntro";
import { LearnFullyGodManSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnFullyGodManSection";
import { LearnVerseBulletItem } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnVerseBulletItem";
import { LearnCrossSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnCrossSection";
import {
  LearnProphecySection,
  type ProphecyConfidenceLevel,
} from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnProphecySection";
import { LearnWhyCtaSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnWhyCtaSection";
import {
  NAME_JESUS_VN,
  PLACE_JERUSALEM_VN,
  BOOK_MATTHEW_VN,
  BOOK_LUKE_VN,
  BOOK_MARK_VN,
  BOOK_ACTS_VN,
  BOOK_ISAIAH_VN,
  BOOK_PSALMS_VN,
  BOOK_MICAH_VN,
  BOOK_ZECHARIAH_VN,
  TERM_GOD_VN,
  TERM_BIBLE_VN,
  TERM_OLD_TESTAMENT_VN,
  TERM_NEW_TESTAMENT_VN,
} from "@/components/Bible/Learn/constants";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import {
  LearnWhatIsBibleGlossary,
  type GlossaryItem,
} from "../../WhatIsBible/shared-components/LearnWhatIsBibleGlossary";
import type { BibleBook } from "@/components/Bible/Read/types";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";

const VN_JESUS_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: "Đấng Mê-si (Messiah)",
    def: (
      <>
        Từ Hê-bơ-rơ nghĩa là “Đấng được xức dầu.” Trong Kinh Thánh, danh xưng này chỉ về
        vị vua và Đấng giải cứu mà dân Y-sơ-ra-ên trông đợi. Các sách Tân Ước trình bày{" "}
        <strong>Chúa Giê-xu</strong> là Đấng Mê-si ấy.
      </>
    ),
  },
  {
    term: "Sự nhập thể (Incarnation)",
    def: (
      <>
        Niềm tin rằng <strong>Đức Chúa Trời</strong> đã đến trong thân thể con người nơi{" "}
        <strong>Chúa Giê-xu</strong>. Không chỉ là một sứ giả, mà là{" "}
        <strong>Đức Chúa Trời</strong> bước vào lịch sử loài người.
      </>
    ),
  },
  {
    term: "Sự phục sinh (Resurrection)",
    def: (
      <>
        Niềm tin rằng <strong>Chúa Giê-xu</strong> đã sống lại cách thân thể vào ngày thứ
        ba sau khi bị đóng đinh. Đối với Cơ Đốc nhân, đây là trung tâm của đức tin và là
        dấu mốc quyết định của lịch sử.
      </>
    ),
  },
];

/** Verse text for hover preview; stored locally, no API. */
const VERSE_PREVIEW_VN: Record<string, string> = {
  "Giăng 11:35": "Đức Chúa Jêsus khóc.",
  "Hê-bơ-rơ 4:15":
    "Vì chúng ta không có thầy tế lễ thượng phẩm không thể cảm thương sự yếu đuối chúng ta, bèn là Đấng đã bị cám dỗ trong mọi sự như chúng ta, song chẳng phạm tội.",
  "Giăng 1:1":
    "Ban đầu có Ngôi Lời, Ngôi Lời ở cùng Đức Chúa Trời, và Ngôi Lời là Đức Chúa Trời.",
  "Cô-lô-se 2:9":
    "Vì chính trong Đấng ấy mà bản tính đầy đủ của Đức Chúa Trời hiện diện trong thân thể.",
  "Mác 3:5": "Ngài đưa mắt xem họ với cơn giận, buồn vì lòng họ chai đá.",
  "Giăng 19:28": "Đức Chúa Jêsus phán: Ta khát.",
  "Mác 4:39":
    "Ngài bèn thức dậy, quở gió và phán cùng biển rằng: Hãy im đi, lặng đi. Gió liền dừng và đất lặng như tờ.",
  "Lu-ca 5:20":
    "Khi Ngài thấy đức tin của họ, Ngài bèn phán cùng người bại rằng: Hỡi bạn, tội lỗi ngươi đã được tha.",
  "Giăng 11:43": "Ngài phán điều đó rồi, bèn kêu lên rằng: La-xơ ơi, hãy ra!",
  "Giăng 11:43-44":
    "Ngài phán điều đó rồi, bèn kêu lên rằng: La-xơ ơi, hãy ra! Người chết đi ra, chân tay buộc bằng vải liệm và mặt thì phủ khăn.",
  "1 Cô-rinh-tô 15:3-8":
    "Đấng Christ chịu chết vì tội lỗi chúng ta theo lời Kinh Thánh; Ngài đã bị chôn, đến ngày thứ ba sống lại theo lời Kinh Thánh.",
  // Prophecy section (fixed content for popover)
  "Mi-chê 5:2":
    "Nhưng hỡi Bết-lê-hem Ép-ra-ta... từ nơi ngươi sẽ ra cho ta một Đấng cai trị trong Y-sơ-ra-ên.",
  "Ma-thi-ơ 2:1": "Khi Đức Chúa Jêsus đã sanh tại Bết-lê-hem...",
  "Ê-sai 7:14": "Này, một gái đồng trinh sẽ chịu thai, sanh một con trai...",
  "Lu-ca 1:27": "...đến cùng một người nữ đồng trinh tên là Ma-ri...",
  "Xa-cha-ri 9:9": "Này, Vua ngươi đến cùng ngươi... cỡi lừa con.",
  "Mác 11:7": "Chúng dẫn lừa con đến cho Đức Chúa Jêsus, lấy áo mình trải trên nó...",
  "Xa-cha-ri 11:12": "...Họ bèn cân cho ta ba chục miếng bạc.",
  "Ma-thi-ơ 26:15": "...Họ bèn cân cho người ba chục miếng bạc.",
  "Thi thiên 22:16": "Chúng đã đâm tay và chân tôi.",
  "Lu-ca 24:39": "Xem tay chân ta...",
  "Thi thiên 16:10": "Vì Chúa chẳng để linh hồn tôi trong âm phủ...",
  "Công vụ 2:31": "...Đấng Christ sống lại...",
};

type ProphecyRefDef = {
  bookVi: string;
  bookEn: string;
  chapter: number;
  verse: number;
  verseEnd?: number;
};

type ProphecySourceVN = {
  title: string;
  confidenceLevel: ProphecyConfidenceLevel;
  confidence: string;
  explanation: string;
  otRef: ProphecyRefDef;
  ntRef: ProphecyRefDef;
};

function versePreviewKeyVi(ref: ProphecyRefDef): string {
  if (ref.verseEnd != null && ref.verseEnd !== ref.verse) {
    return `${ref.bookVi} ${ref.chapter}:${ref.verse}-${ref.verseEnd}`;
  }
  return `${ref.bookVi} ${ref.chapter}:${ref.verse}`;
}

function refLinkLabelVi(ref: ProphecyRefDef): string {
  if (ref.verseEnd != null && ref.verseEnd !== ref.verse) {
    return `${ref.bookVi} ${ref.chapter}:${ref.verse}–${ref.verseEnd}`;
  }
  return `${ref.bookVi} ${ref.chapter}:${ref.verse}`;
}

const PROPHECY_SOURCES_VN: ProphecySourceVN[] = [
  {
    title: "Sinh tại Bết-lê-hem",
    confidenceLevel: "very_clear",
    confidence: "Rất rõ",
    explanation:
      "Mi-chê nói về nơi xuất hiện của vị cai trị được mong đợi, và sách Ma-thi-ơ ghi lại Chúa Giê-xu sinh tại Bết-lê-hem.",
    otRef: { bookVi: BOOK_MICAH_VN, bookEn: "Micah", chapter: 5, verse: 2 },
    ntRef: { bookVi: BOOK_MATTHEW_VN, bookEn: "Matthew", chapter: 2, verse: 1 },
  },
  {
    title: "Sinh bởi nữ đồng trinh",
    confidenceLevel: "widely_discussed",
    confidence: "Được đối chiếu rộng rãi",
    explanation:
      "Ê-sai 7:14 nói về sự giáng sinh đặc biệt của Đấng Mê-si, và sách Lu-ca ghi lại sự giáng sinh của Chúa Giê-xu.",
    otRef: { bookVi: BOOK_ISAIAH_VN, bookEn: "Isaiah", chapter: 7, verse: 14 },
    ntRef: { bookVi: BOOK_LUKE_VN, bookEn: "Luke", chapter: 1, verse: 27 },
  },
  {
    title: `Vào ${PLACE_JERUSALEM_VN} trên lưng lừa`,
    confidenceLevel: "very_clear",
    confidence: "Rất rõ",
    explanation:
      "Xa-cha-ri mô tả vị vua khiêm nhường cỡi lừa; các sách Phúc Âm ghi lại Chúa Giê-xu vào thành theo cách tương tự.",
    otRef: { bookVi: BOOK_ZECHARIAH_VN, bookEn: "Zechariah", chapter: 9, verse: 9 },
    ntRef: { bookVi: BOOK_MARK_VN, bookEn: "Mark", chapter: 11, verse: 7 },
  },
  {
    title: "Bị phản bội với 30 miếng bạc",
    confidenceLevel: "very_clear",
    confidence: "Rất rõ",
    explanation:
      "Xa-cha-ri nhắc đến mức công đức bị định giá, và sách Ma-thi-ơ ghi Giuda nhận ba mươi miếng bạc.",
    otRef: { bookVi: BOOK_ZECHARIAH_VN, bookEn: "Zechariah", chapter: 11, verse: 12 },
    ntRef: { bookVi: BOOK_MATTHEW_VN, bookEn: "Matthew", chapter: 26, verse: 15 },
  },
  {
    title: "Bị đóng đinh, tay chân bị đâm",
    confidenceLevel: "widely_discussed",
    confidence: "Được đối chiếu rộng rãi",
    explanation:
      "Thi thiên 22 có hình ảnh đau khổ gần với cảnh thập tự, và sách Lu-ca ghi lời Chúa Giê-xu mời xem vết thương.",
    otRef: { bookVi: BOOK_PSALMS_VN, bookEn: "Psalms", chapter: 22, verse: 16 },
    ntRef: { bookVi: BOOK_LUKE_VN, bookEn: "Luke", chapter: 24, verse: 39 },
  },
  {
    title: "Sống lại từ cõi chết",
    confidenceLevel: "very_clear",
    confidence: "Rất rõ",
    explanation:
      "Thi thiên nói linh hồn không bị giữ trong âm phủ mãi, và sách Công vụ trích dẫn để nói về sự phục sinh của Đấng Christ.",
    otRef: { bookVi: BOOK_PSALMS_VN, bookEn: "Psalms", chapter: 16, verse: 10 },
    ntRef: { bookVi: BOOK_ACTS_VN, bookEn: "Acts", chapter: 2, verse: 31 },
  },
];

function getProphecyItems(
  books: BibleBook[],
  findBookId: (books: BibleBook[], nameVi: string, nameEn?: string) => string | null,
  bodyTitleClassUp: string
) {
  return PROPHECY_SOURCES_VN.map((item) => {
    const otBookId = findBookId(books, item.otRef.bookVi, item.otRef.bookEn);
    const ntBookId = findBookId(books, item.ntRef.bookVi, item.ntRef.bookEn);
    const otKey = versePreviewKeyVi(item.otRef);
    const ntKey = versePreviewKeyVi(item.ntRef);

    return {
      title: item.title,
      confidenceLevel: item.confidenceLevel,
      confidence: item.confidence,
      explanation: item.explanation,
      otQuote: VERSE_PREVIEW_VN[otKey],
      ntQuote: VERSE_PREVIEW_VN[ntKey],
      otLink: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={otBookId}
          chapter={item.otRef.chapter}
          verse={item.otRef.verse}
          verseEnd={item.otRef.verseEnd}
          testament="ot"
          linkOnly
          triggerClassName={cn(
            bodyTitleClassUp,
            " text-second-600! hover:text-second-800! inline-block text-xs underline underline-offset-4"
          )}
        >
          {refLinkLabelVi(item.otRef)}
        </BibleVerseLink>
      ),
      ntLink: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={ntBookId}
          chapter={item.ntRef.chapter}
          verse={item.ntRef.verse}
          verseEnd={item.ntRef.verseEnd}
          testament="nt"
          linkOnly
          triggerClassName={cn(
            bodyTitleClassUp,
            " text-sage-600! hover:text-sage-800! inline-block text-xs underline underline-offset-4"
          )}
        >
          {refLinkLabelVi(item.ntRef)}
        </BibleVerseLink>
      ),
    };
  });
}

/**
 * Resolve book id by Vietnamese name (case-insensitive), with optional fallback by English name.
 * Seed uses e.g. "Thi thiên" for Psalms; constants may use "Thi Thiên". nameEn fallback helps when nameVi differs.
 */
function findBookIdByVi(
  books: BibleBook[],
  nameVi: string,
  nameEn?: string
): string | null {
  const v = nameVi.trim().toLowerCase();
  const byVi = books.find((b) => b.nameVi.trim().toLowerCase() === v);
  if (byVi) return byVi.id;
  if (nameEn) {
    const byEn = books.find((b) => b.nameEn === nameEn);
    if (byEn) return byEn.id;
  }
  return null;
}

const VN_FLASHCARD_FONT = "font-vietnamese-flashcard";

export function VnWhoIsJesus({ books }: { books: BibleBook[] }) {
  const { subBodyClassUp, bodyClassUp } = useBibleFontClasses();
  const vnBodyClass = cn(bodyClassUp, VN_FLASHCARD_FONT);
  return (
    <article
      aria-label={`Bài học Chúa ${NAME_JESUS_VN} Là Ai?`}
      className="text-foreground"
    >
      <LearnLessonIntro
        bodyBright
        locale="vi"
        moduleNum="04 / 05"
        title={`Chúa ${NAME_JESUS_VN} Là Ai?`}
        intro1={
          <p className={cn("my-4 leading-relaxed", vnBodyClass)}>
            Trong suốt hơn hai nghìn năm, con người vẫn tranh luận về thân vị của{" "}
            <strong>Chúa {NAME_JESUS_VN}</strong>.{" "}
          </p>
        }
        intro1Quote={
          <>
            <strong>Ngài</strong> là một thầy giáo? Một nhà tiên tri? Một nhà cách mạng?
            Một huyền thoại? Con <strong>{TERM_GOD_VN}</strong>? Hay là Đấng vượt xa mọi
            tưởng tượng của chúng ta?
          </>
        }
      >
        <p className={cn("my-4 leading-relaxed", vnBodyClass)}>
          <strong>Chúa {NAME_JESUS_VN}</strong> người Na-xa-rét là nhân vật trung tâm của{" "}
          {TERM_NEW_TESTAMENT_VN} và giữ vị trí đặc biệt trong toàn bộ {TERM_BIBLE_VN}.
          Nhiều người tin rằng các sách {TERM_OLD_TESTAMENT_VN} chuẩn bị cho sự xuất hiện
          của <strong>Ngài</strong>, và mọi điều sau đó đều chịu ảnh hưởng sâu sắc từ{" "}
          <strong>Ngài</strong>.
        </p>
      </LearnLessonIntro>

      <LearnFullyGodManSection
        bodyBright
        locale="vi"
        sectionTitle={`Vừa Là ${TERM_GOD_VN}, Vừa Là Con Người`}
        leftTitle="Hoàn Toàn Là Con Người"
        leftBody={
          <>
            Chúa Giê-xu không sống xa cách đời sống con người. Kinh Thánh ghi lại rằng
            Ngài đã khóc, buồn, mệt, khát và chịu đau đớn như chúng ta.
            <ul className={cn("my-8 space-y-1", vnBodyClass)}>
              <LearnVerseBulletItem
                label="Khóc vì đau buồn"
                reference={
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "Giăng")}
                    chapter={11}
                    verse={35}
                    testament="nt"
                    previewText={VERSE_PREVIEW_VN["Giăng 11:35"]}
                    triggerClassName={subBodyClassUp}
                  >
                    Giăng 11:35
                  </BibleVerseLink>
                }
              />
              <LearnVerseBulletItem
                label="Giận trước điều sai"
                reference={
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "Mác")}
                    chapter={3}
                    verse={5}
                    testament="nt"
                    previewText={VERSE_PREVIEW_VN["Mác 3:5"]}
                    triggerClassName={subBodyClassUp}
                  >
                    Mác 3:5
                  </BibleVerseLink>
                }
              />
              <LearnVerseBulletItem
                label="Khát khi chịu đau đớn"
                reference={
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "Giăng")}
                    chapter={19}
                    verse={28}
                    testament="nt"
                    previewText={VERSE_PREVIEW_VN["Giăng 19:28"]}
                    triggerClassName={subBodyClassUp}
                  >
                    Giăng 19:28
                  </BibleVerseLink>
                }
              />
            </ul>
            <p className={cn("mt-3", vnBodyClass)}>
              Những điều này cho thấy <strong>Ngài</strong> thật sự bước vào đời sống con
              người, chứ không đứng bên ngoài nó.
            </p>
          </>
        }
        rightTitle={`Hoàn Toàn Là ${TERM_GOD_VN}`}
        rightBody={
          <>
            Đồng thời, Chúa Giê-xu làm những việc vượt quá khả năng của con người: Ngài
            khiến gió yên, tha tội, và gọi kẻ chết sống lại.
            <ul className={cn("my-8 space-y-1", vnBodyClass)}>
              <LearnVerseBulletItem
                label="Làm phép lạ và khiến thiên nhiên vâng lời"
                reference={
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "Mác")}
                    chapter={4}
                    verse={39}
                    testament="nt"
                    previewText={VERSE_PREVIEW_VN["Mác 4:39"]}
                    triggerClassName={subBodyClassUp}
                  >
                    Mác 4:39
                  </BibleVerseLink>
                }
              />
              <LearnVerseBulletItem
                label="Có quyền tha tội"
                reference={
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "Lu-ca")}
                    chapter={5}
                    verse={20}
                    testament="nt"
                    previewText={VERSE_PREVIEW_VN["Lu-ca 5:20"]}
                    triggerClassName={subBodyClassUp}
                  >
                    Lu-ca 5:20
                  </BibleVerseLink>
                }
              />
              <LearnVerseBulletItem
                label="Khiến người chết sống lại"
                reference={
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "Giăng")}
                    chapter={11}
                    verse={43}
                    verseEnd={44}
                    testament="nt"
                    previewText={VERSE_PREVIEW_VN["Giăng 11:43-44"]}
                    triggerClassName={subBodyClassUp}
                  >
                    Giăng 11:43-44
                  </BibleVerseLink>
                }
              />
            </ul>
            <p className={cn("mt-3", vnBodyClass)}>
              Vì vậy nhiều người tin rằng Ngài không chỉ là một giáo sư hay tiên tri, mà
              là Con của <strong>{TERM_GOD_VN}</strong>.
            </p>
          </>
        }
      />

      <LearnCrossSection
        bodyBright
        locale="vi"
        title="Sự Chết Và Sự Phục Sinh"
        paragraph1={
          <>
            Theo các sách Tân Ước, Chúa Giê-xu đã bị đóng đinh dưới thời Bôn-xơ Phi-lát.
            Với nhiều người tin Chúa, cái chết của Ngài không chỉ là một biến cố lịch sử,
            mà còn là hành động cứu chuộc.
          </>
        }
        paragraph2={
          <>
            Theo các sách {TERM_NEW_TESTAMENT_VN}, đến ngày thứ ba, <strong>Ngài</strong>{" "}
            đã sống lại. Đây không chỉ là biểu tượng, mà là nền tảng của niềm hy vọng và
            đức tin.
          </>
        }
        refText={
          <BibleVerseLink
            langSegment="vi"
            version1="vi"
            bookId={findBookIdByVi(books, "1 Cô-rinh-tô", "1 Corinthians")}
            chapter={15}
            verse={3}
            verseEnd={8}
            testament="nt"
            previewText={VERSE_PREVIEW_VN["1 Cô-rinh-tô 15:3-8"]}
            triggerClassName={subBodyClassUp}
          >
            1 Cô-rinh-tô 15:3–8
          </BibleVerseLink>
        }
      />

      <LearnProphecySection
        bodyBright
        locale="vi"
        title="Những Lời Tiên Tri Thường Được Đối Chiếu"
        intro={
          <>
            Trong Cựu Ước, có nhiều đoạn được người tin Chúa hiểu là hướng về Đấng Mê-si.
            Phần này trình bày một số lời tiên tri thường được đối chiếu với cuộc đời, sự
            chết và sự phục sinh của Chúa Giê-xu. Một số chỗ được nhìn nhận rất rõ, trong
            khi một số chỗ vẫn còn được thảo luận theo nhiều cách khác nhau.
          </>
        }
        items={getProphecyItems(books, findBookIdByVi, subBodyClassUp)}
      />

      <LearnWhyCtaSection
        locale="vi"
        title="Vì Sao Điều Này Vẫn Quan Trọng?"
        paragraph1={
          <>
            Nếu Chúa {NAME_JESUS_VN} thật sự đã sống lại từ cõi chết, thì Ngài không chỉ
            là một nhân vật trong lịch sử hay một thầy dạy đạo đức. Điều đó có nghĩa là
            Ngài vẫn đang sống — và lời hứa về hy vọng, sự tha thứ không chỉ là giả
            thuyết, mà là điều sẽ trở thành thật trong cuộc đời con người.
          </>
        }
        paragraph2={
          <div>
            Nhưng điều này không chỉ để biết, mà để đáp lại. Kinh Thánh nói rằng để nhận
            được những lời hứa ấy, con người cần có đức tin. Đức tin không chỉ là tin một
            thông tin, mà là đặt lòng tin của mình nơi Chúa {NAME_JESUS_VN}.{" "}
            <p className="mt-4 font-semibold">
              Vậy đức tin thực sự là gì? Và điều đó có liên quan gì đến bạn?
            </p>
          </div>
        }
        linkHref="/bible/vi/read"
        linkLabel="Đọc Kinh Thánh"
      />

      <LearnWhatIsBibleGlossary
        glossaryTitle="Từ vựng nhanh"
        glossary={VN_JESUS_GLOSSARY}
        locale="vi"
      />
    </article>
  );
}
