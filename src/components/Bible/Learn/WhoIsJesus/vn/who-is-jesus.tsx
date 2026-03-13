"use client";

import { LearnLessonIntro } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnLessonIntro";
import { LearnFullyGodManSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnFullyGodManSection";
import { LearnCrossSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnCrossSection";
import { LearnProphecySection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnProphecySection";
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
  "I Cô-rinh-tô 15:3-8":
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

function getProphecyItems(
  books: BibleBook[],
  findBookId: (books: BibleBook[], nameVi: string, nameEn?: string) => string | null,
  subBodyClassUp: string
) {
  return [
    {
      prophecy: "Sinh tại Bết-lê-hem",
      ref: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_MICAH_VN, "Micah")}
          chapter={5}
          verse={2}
          testament="ot"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_MICAH_VN} 5:2`]}
        >
          {BOOK_MICAH_VN} 5:2
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_MATTHEW_VN, "Matthew")}
          chapter={2}
          verse={1}
          testament="nt"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_MATTHEW_VN} 2:1`]}
        >
          {BOOK_MATTHEW_VN} 2:1
        </BibleVerseLink>
      ),
    },
    {
      prophecy: "Sinh bởi nữ đồng trinh",
      ref: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_ISAIAH_VN, "Isaiah")}
          chapter={7}
          verse={14}
          testament="ot"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_ISAIAH_VN} 7:14`]}
        >
          {BOOK_ISAIAH_VN} 7:14
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_LUKE_VN, "Luke")}
          chapter={1}
          verse={27}
          testament="nt"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_LUKE_VN} 1:27`]}
        >
          {BOOK_LUKE_VN} 1:27
        </BibleVerseLink>
      ),
    },
    {
      prophecy: `Vào ${PLACE_JERUSALEM_VN} trên lưng lừa`,
      ref: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_ZECHARIAH_VN, "Zechariah")}
          chapter={9}
          verse={9}
          testament="ot"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_ZECHARIAH_VN} 9:9`]}
        >
          {BOOK_ZECHARIAH_VN} 9:9
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_MARK_VN, "Mark")}
          chapter={11}
          verse={7}
          testament="nt"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_MARK_VN} 11:7`]}
        >
          {BOOK_MARK_VN} 11:7
        </BibleVerseLink>
      ),
    },
    {
      prophecy: "Bị phản bội với 30 miếng bạc",
      ref: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_ZECHARIAH_VN, "Zechariah")}
          chapter={11}
          verse={12}
          testament="ot"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_ZECHARIAH_VN} 11:12`]}
        >
          {BOOK_ZECHARIAH_VN} 11:12
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_MATTHEW_VN, "Matthew")}
          chapter={26}
          verse={15}
          testament="nt"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_MATTHEW_VN} 26:15`]}
        >
          {BOOK_MATTHEW_VN} 26:15
        </BibleVerseLink>
      ),
    },
    {
      prophecy: "Bị đóng đinh, tay chân bị đâm",
      ref: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_PSALMS_VN, "Psalms")}
          chapter={22}
          verse={16}
          testament="ot"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_PSALMS_VN} 22:16`]}
        >
          {BOOK_PSALMS_VN} 22:16
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_LUKE_VN, "Luke")}
          chapter={24}
          verse={39}
          testament="nt"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_LUKE_VN} 24:39`]}
        >
          {BOOK_LUKE_VN} 24:39
        </BibleVerseLink>
      ),
    },
    {
      prophecy: "Sống lại từ cõi chết",
      ref: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_PSALMS_VN, "Psalms")}
          chapter={16}
          verse={10}
          testament="ot"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_PSALMS_VN} 16:10`]}
        >
          {BOOK_PSALMS_VN} 16:10
        </BibleVerseLink>
      ),
      fulfilled: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookId(books, BOOK_ACTS_VN, "Acts")}
          chapter={2}
          verse={31}
          testament="nt"
          triggerClassName={subBodyClassUp}
          previewText={VERSE_PREVIEW_VN[`${BOOK_ACTS_VN} 2:31`]}
        >
          {BOOK_ACTS_VN} 2:31
        </BibleVerseLink>
      ),
    },
  ];
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
  const { bodyClass, subBodyClassUp, bodyClassUp } = useBibleFontClasses();
  const vnBodyClass = cn(bodyClassUp, VN_FLASHCARD_FONT);
  return (
    <article
      aria-label={`Bài học Chúa ${NAME_JESUS_VN} Là Ai?`}
      className="text-foreground"
    >
      <LearnLessonIntro
        bodyBright
        locale="vi"
        moduleNum="03 / 04"
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
            <strong>Chúa {NAME_JESUS_VN}</strong> sống như một con người thật. Ngài trải
            nghiệm những điều rất quen thuộc với đời sống con người:
            <ul className={cn("mt-3 space-y-1", vnBodyClass)}>
              <li>
                • Khóc vì đau buồn
                <span className="px-1">-</span>
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
              </li>
              <li>
                • Giận trước điều sai
                <span className="px-1">-</span>
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
              </li>
              <li>
                • Khát khi chịu đau đớn
                <span className="px-1">-</span>
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
              </li>
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
            Đồng thời, <strong>Chúa {NAME_JESUS_VN}</strong> cũng làm những điều vượt quá
            khả năng của con người:
            <ul className={cn("mt-3 space-y-1", vnBodyClass)}>
              <li>
                • Làm phép lạ và khiến thiên nhiên vâng lời
                <span className="px-1">-</span>
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
              </li>
              <li>
                • Có quyền tha tội
                <span className="px-1">-</span>
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
              </li>
              <li>
                • Khiến người chết sống lại
                <span className="px-1">-</span>
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
              </li>
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
        title="Thập Tự Giá & Sự Phục Sinh"
        paragraph1={
          <>
            Khoảng năm 30 sau Công Nguyên, <strong>Chúa {NAME_JESUS_VN}</strong> bị đóng
            đinh dưới thời tổng đốc La Mã Bôn-xơ Phi-lát. Người tin Chúa tin rằng đây
            không chỉ là một biến cố lịch sử, nhưng là trung tâm của kế hoạch cứu chuộc
            của <strong>{TERM_GOD_VN}</strong>. Trên thập tự giá, <strong>Ngài</strong>{" "}
            được hiểu là đã gánh lấy tội lỗi nhân loại — mở ra con đường tha thứ và hòa
            giải với <strong>{TERM_GOD_VN}</strong>.
          </>
        }
        paragraph2={
          <>
            Đến ngày thứ ba, <strong>Ngài</strong> sống lại cách thân thể. Sự phục sinh
            này được công bố ngay từ những ngày đầu của Hội Thánh, với lời chứng của nhiều
            nhân chứng được ghi lại trong các sách {TERM_NEW_TESTAMENT_VN}. Đối với người
            tin Chúa, đây không chỉ là biểu tượng, mà là bước ngoặt của lịch sử.
          </>
        }
        refText={
          <BibleVerseLink
            langSegment="vi"
            version1="vi"
            bookId={findBookIdByVi(books, "I Cô-rinh-tô")}
            chapter={15}
            verse={3}
            verseEnd={8}
            testament="nt"
            previewText={VERSE_PREVIEW_VN["I Cô-rinh-tô 15:3-8"]}
            triggerClassName={subBodyClassUp}
          >
            I Cô-rinh-tô 15:3–8
          </BibleVerseLink>
        }
      />

      <LearnProphecySection
        bodyBright
        locale="vi"
        title="Sự Ứng Nghiệm Lời Tiên Tri"
        intro={
          <>
            Từ nhiều thế kỷ trước khi <strong>Chúa {NAME_JESUS_VN}</strong> ra đời,{" "}
            {TERM_BIBLE_VN} đã nói về một Đấng Mê-si sẽ đến — mô tả nơi sinh, sự chịu khổ,
            và thậm chí cách <strong>Ngài</strong> chịu chết. Nhiều người tin Chúa thấy sự
            tương ứng rõ ràng giữa các lời tiên tri ấy và cuộc đời của{" "}
            <strong>Ngài</strong>. Tuy nhiên, cách hiểu và diễn giải những lời tiên tri
            này vẫn là chủ đề được thảo luận trong nhiều thế kỷ.
          </>
        }
        items={getProphecyItems(books, findBookIdByVi, subBodyClassUp)}
      />

      <LearnWhyCtaSection
        locale="vi"
        title={`Vì Sao Chúa ${NAME_JESUS_VN} Vẫn Quan Trọng Ngày Nay?`}
        paragraph1={
          <>
            Nếu <strong>Chúa {NAME_JESUS_VN}</strong> thực sự đã sống lại từ cõi chết, thì{" "}
            <strong>Ngài</strong> không thể chỉ được xem như một thầy giáo đạo đức hay một
            câu chuyện truyền cảm hứng.
          </>
        }
        paragraph2={
          <>
            Đối với người tin Chúa, đức tin nơi <strong>Ngài</strong> không chỉ là chấp
            nhận một giáo lý, mà là đặt lòng tin nơi một Đấng đang sống — Đấng ban sự tha
            thứ, mục đích sống và hy vọng đời đời.
          </>
        }
        linkHref="/bible/vi/read"
        linkLabel="Đọc Phúc Âm"
      />
      <LearnWhatIsBibleGlossary
        glossaryTitle="Từ vựng nhanh"
        glossary={VN_JESUS_GLOSSARY}
        locale="vi"
      />
    </article>
  );
}
