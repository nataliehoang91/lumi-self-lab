"use client";

import { LearnWhatIsBibleIntro } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleIntro";
import { LearnWhatIsBibleStats } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleStats";
import { LearnWhatIsBibleTestamentSection } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleTestamentSection";
import {
  LearnWhatIsBibleGlossary,
  type GlossaryItem,
} from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleGlossary";
import {
  OT_SECTIONS,
  NT_SECTIONS,
} from "@/components/Bible/Learn/WhatIsBible/shared-components/constants";
import {
  NAME_JESUS_VN,
  LANG_HEBREW_VN,
  LANG_ARAMAIC_VN,
  LANG_GREEK_VN,
  PLACE_ISRAEL_VN,
  PLACE_JERUSALEM_VN,
  NAME_PAUL_VN,
  BOOK_DEUTERONOMY_VN,
  BOOK_ESTHER_VN,
  BOOK_JOB_VN,
  BOOK_ISAIAH_VN,
  BOOK_MALACHI_VN,
  BOOK_MATTHEW_VN,
  BOOK_MARK_VN,
  BOOK_LUKE_VN,
  BOOK_JOHN_VN,
  BOOK_ACTS_VN,
  BOOK_ROMANS_VN,
  BOOK_JUDE_VN,
  BOOK_REVELATION_VN,
  BOOK_2_SAMUEL_VN,
  BOOK_AMOS_VN,
  BOOK_DANIEL_VN,
  BOOK_COLOSSIANS_VN,
  BOOK_2_TIMOTHY_VN,
  TERM_GOD_VN,
  TERM_BIBLE_VN,
  TERM_CHRIST_VN,
  TERM_OLD_TESTAMENT_VN,
  TERM_NEW_TESTAMENT_VN,
} from "@/components/Bible/Learn/constants";
import { LearnWhyItMatters } from "../shared-components/why-it-matters";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import type { BibleBook } from "@/components/Bible/Read/types";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import { LearnWhatIsBibleAuthorsSection } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleAuthorsSection";
import { QuoteCard } from "@/components/GeneralComponents/QuoteCard";

const VN_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: TERM_OLD_TESTAMENT_VN,
    def: `Phần đầu của ${TERM_BIBLE_VN}, ghi lại lịch sử, luật pháp, thơ ca và lời tiên tri của dân ${PLACE_ISRAEL_VN} trước thời Chúa ${NAME_JESUS_VN}.`,
  },
  {
    term: TERM_NEW_TESTAMENT_VN,
    def: `Phần sau của ${TERM_BIBLE_VN}, bắt đầu với bốn sách Phúc Âm kể về cuộc đời Chúa ${NAME_JESUS_VN} và tiếp tục với sự hình thành của Hội Thánh đầu tiên.`,
  },
  {
    term: "Chính điển",
    def: "Danh sách các sách được cộng đồng đức tin công nhận là có thẩm quyền và được đọc công khai trong sự thờ phượng.",
  },
  {
    term: "Giao ước",
    def: `Một sự cam kết mang tính quan hệ giữa ${TERM_GOD_VN} và con người. Chủ đề này xuất hiện xuyên suốt cả ${TERM_OLD_TESTAMENT_VN} và ${TERM_NEW_TESTAMENT_VN}.`,
  },
  {
    term: "Phúc âm",
    def: `Nghĩa là "Tin Lành" hay "tin vui" — thuật ngữ thường dùng để chỉ sứ điệp về Chúa ${NAME_JESUS_VN} và ý nghĩa của cuộc đời, sự chết và sự sống lại của Ngài.`,
  },
  {
    term: "Tiên tri",
    def: `Người được kêu gọi để truyền đạt sứ điệp của ${TERM_GOD_VN} trong bối cảnh lịch sử cụ thể, thường kêu gọi dân sự trở lại và sống trung tín.`,
  },
  {
    term: BOOK_REVELATION_VN,
    def: "Một thể loại văn học mang tính biểu tượng và hình ảnh, thường nói về sự phán xét, hy vọng và sự hoàn tất của lịch sử.",
  },
];

const VERSE_PREVIEW_VN_AUTHORS: Record<string, string> = {
  "II Sa-mu-ên 5:4-5":
    "Đa-vít đã được ba mươi tuổi khi lên làm vua; người cai trị bốn mươi năm. Tại Hếp-rôn, người cai trị Giu-đa bảy năm sáu tháng; rồi tại Giê-ru-sa-lem, người cai trị cả Y-sơ-ra-ên và Giu-đa ba mươi ba năm.",
  "A-mốt 1:1": "Lời của A-mốt, người trong bọn chăn chiên ở Thê-cô-a...",
  "Đa-ni-ên 2:48":
    "Vua tôn Đa-ni-ên lên chức trọng, ban cho nhiều quà lớn... lập người làm quan cai trị cả tỉnh Ba-by-lôn.",
  "Cô-lô-se 4:14": "Lu-ca, thầy thuốc rất yêu dấu, và Đê-ma chào thăm anh em.",
  "Ma-thi-ơ 4:18-21":
    "Đức Chúa Jêsus đi dọc theo biển Ga-li-lê... thấy hai anh em là Si-môn gọi là Phi-e-rơ, và Anh-rê em người, đương quăng lưới xuống biển... Ngài phán cùng họ rằng: Hãy theo ta.",
  "Ma-thi-ơ 10:3": "Phi-líp với Ba-tô-lô-my; Thô-ma với Ma-thi-ơ là người thâu thuế...",
  "II Ti-mô-thê 3:16":
    "Cả Kinh Thánh đều là bởi Đức Chúa Trời cảm động mà viết ra, có ích cho sự dạy dỗ, bẻ trách, sửa trị, dạy người trong sự công bình.",
  "II Phi-e-rơ 1:21":
    "Vì chẳng hề có lời tiên tri nào bởi ý riêng người ta mà ra; nhưng người ta đã được Đức Thánh Linh cảm động mà nói bởi Đức Chúa Trời.",
};

function buildReadHrefVi(
  bookId: string | null,
  chapter: number,
  verse: number,
  testament: "ot" | "nt"
): string {
  if (!bookId) return "#";
  const sp = new URLSearchParams();
  sp.set("version1", "vi");
  sp.set("sync", "true");
  sp.set("book1", bookId);
  sp.set("chapter1", String(chapter));
  sp.set("testament1", testament);
  sp.set("verse1", String(verse));
  return `/bible/vi/read?${sp.toString()}`;
}

function findBookIdByVi(
  books: BibleBook[] | undefined,
  nameVi: string,
  nameEn?: string
): string | null {
  if (!books?.length) return null;
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

export function VnWhatIsBiblePage({ books }: { books: BibleBook[] }) {
  const { bodyClass, bodyTitleClass, subBodyClassUp } = useBibleFontClasses();
  const vnBodyClass = cn(bodyClass, VN_FLASHCARD_FONT);
  return (
    <article aria-label="Kinh thánh là gì?" className="text-foreground">
      <LearnWhatIsBibleIntro
        locale="vi"
        moduleNum="01 / 04"
        title="Kinh thánh là gì?"
        bodyBright
        introParts={[
          "Kinh Thánh không chỉ là một quyển sách, đó là một tuyển tập gồm ",
          "66 sách",
          " được viết trong suốt khoảng ",
          "2000 năm",
          " bởi gần ",
          "40 tác giả khác nhau",
          <>
            . Dù được hình thành qua nhiều thế kỷ và bối cảnh khác nhau, nhiều người tin
            rằng toàn bộ <strong>{TERM_BIBLE_VN}</strong> cùng kể một câu chuyện thống
            nhất — câu chuyện về mối quan hệ giữa <strong>{TERM_GOD_VN}</strong> và con
            người.
          </>,
        ]}
      />

      <blockquote
        className="bg-primary-light/5 border-l-primary mb-12 space-y-4 rounded-r-xl
          border-l-4 py-6 pr-6 pl-6 not-italic"
      >
        <p
          className={cn(VN_FLASHCARD_FONT, "leading-snug font-semibold", bodyTitleClass)}
        >
          Kinh Thánh là thư viện, không phải một cuốn sách đơn lẻ.
        </p>
        <p className={cn("leading-relaxed", vnBodyClass)}>
          Từ <strong>&ldquo;Bible&rdquo;</strong> bắt nguồn từ tiếng Hy Lạp{" "}
          <strong>&ldquo;biblia&rdquo;</strong>, nghĩa là &ldquo;những cuốn sách&rdquo;.
          Hiểu điều này giúp chúng ta tránh việc đọc <strong>{TERM_BIBLE_VN}</strong> như
          một cuốn sách đồng nhất, mà thay vào đó là một thư viện gồm nhiều tác phẩm liên
          kết với nhau.
        </p>
        <p className={cn("border-border border-t pt-4 leading-relaxed", vnBodyClass)}>
          <strong>{TERM_BIBLE_VN}</strong> bao gồm nhiều thể loại: lịch sử, thơ ca, luật
          pháp, thư tín, khải tượng. Vì vậy, không thể đọc mọi phần theo cùng một cách.
        </p>
      </blockquote>

      <LearnWhatIsBibleStats
        statLabels={["Sách tổng cộng", "Cựu Ước", "Tân Ước", "Tác giả"]}
      />

      <LearnWhatIsBibleAuthorsSection
        title="Ai đã viết Kinh Thánh?"
        intro={
          <>
            Kinh Thánh được viết bởi khoảng <strong>40 tác giả</strong> khác nhau trong
            suốt hơn 2000 năm. Những người này đến từ nhiều nghề nghiệp và hoàn cảnh khác
            nhau.
          </>
        }
        bulletItems={[
          <div key="1" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className="">• Vua - như Đa-vít</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, BOOK_2_SAMUEL_VN, "2 Samuel")}
                chapter={5}
                verse={4}
                verseEnd={5}
                testament="ot"
                triggerClassName={subBodyClassUp}
                previewText={VERSE_PREVIEW_VN_AUTHORS["II Sa-mu-ên 5:4-5"]}
              >
                II Sa-mu-ên 5:4-5
              </BibleVerseLink>
            </div>
          </div>,
          <div key="2" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className="">• Người chăn chiên - như A-mốt</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, BOOK_AMOS_VN, "Amos")}
                chapter={1}
                verse={1}
                testament="ot"
                triggerClassName={subBodyClassUp}
                previewText={VERSE_PREVIEW_VN_AUTHORS["A-mốt 1:1"]}
              >
                A-mốt 1:1
              </BibleVerseLink>
            </div>
          </div>,
          <div key="3" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className="">• Quan chức triều đình - như Đa-ni-ên</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, BOOK_DANIEL_VN, "Daniel")}
                chapter={2}
                verse={48}
                testament="ot"
                triggerClassName={subBodyClassUp}
                previewText={VERSE_PREVIEW_VN_AUTHORS["Đa-ni-ên 2:48"]}
              >
                Đa-ni-ên 2:48
              </BibleVerseLink>
            </div>
          </div>,
          <div key="4" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className="">• Bác sĩ - như Lu-ca</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, BOOK_COLOSSIANS_VN, "Colossians")}
                chapter={4}
                verse={14}
                testament="nt"
                triggerClassName={subBodyClassUp}
                previewText={VERSE_PREVIEW_VN_AUTHORS["Cô-lô-se 4:14"]}
              >
                Cô-lô-se 4:14
              </BibleVerseLink>
            </div>
          </div>,
          <div key="5" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className="">• Người đánh cá - như Phi-e-rơ</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, BOOK_MATTHEW_VN, "Matthew")}
                chapter={4}
                verse={18}
                verseEnd={21}
                testament="nt"
                triggerClassName={subBodyClassUp}
                previewText={VERSE_PREVIEW_VN_AUTHORS["Ma-thi-ơ 4:18-21"]}
              >
                Ma-thi-ơ 4:18-21
              </BibleVerseLink>
            </div>
          </div>,
          <div key="6" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className="">• Người thu thuế - như Ma-thi-ơ</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, BOOK_MATTHEW_VN, "Matthew")}
                chapter={10}
                verse={3}
                testament="nt"
                triggerClassName={subBodyClassUp}
                previewText={VERSE_PREVIEW_VN_AUTHORS["Ma-thi-ơ 10:3"]}
              >
                Ma-thi-ơ 10:3
              </BibleVerseLink>
            </div>
          </div>,
        ]}
        conclusion={
          <p className={cn("mt-6 leading-relaxed", vnBodyClass)}>
            Dù được viết bởi nhiều người trong nhiều thời đại khác nhau, người tin Chúa
            tin rằng Đức Chúa Trời đã hướng dẫn họ khi viết.
          </p>
        }
        quoteBlocks={[
          <QuoteCard
            key="2tim316"
            quote="Cả Kinh Thánh đều là bởi Đức Chúa Trời soi dẫn...."
            footnote="II Ti-mô-thê 3:16"
            footnoteAlign="center"
            footnoteHref={buildReadHrefVi(
              findBookIdByVi(books, BOOK_2_TIMOTHY_VN, "2 Timothy"),
              3,
              16,
              "nt"
            )}
          />,
        ]}
      />

      <div className="my-8 h-px" />

      <LearnWhatIsBibleTestamentSection
        bodyBright
        title={TERM_OLD_TESTAMENT_VN}
        intro={
          <p className={cn("mb-5 leading-relaxed", vnBodyClass)}>
            Được viết chủ yếu bằng tiếng{" "}
            <strong>
              <em>{LANG_HEBREW_VN}</em>
            </strong>{" "}
            (và một phần tiếng{" "}
            <strong>
              <em>{LANG_ARAMAIC_VN}</em>
            </strong>
            ), <strong>{TERM_OLD_TESTAMENT_VN}</strong> ghi lại từ sự sáng tạo vũ trụ cho
            đến thời kỳ ngay trước khi <strong>Chúa {NAME_JESUS_VN}</strong> giáng sinh.
            Đây là câu chuyện về <strong>{TERM_GOD_VN}</strong>, về dân{" "}
            <strong>
              <em>{PLACE_ISRAEL_VN}</em>
            </strong>
            , và về lời hứa lâu dài về một Đấng Cứu Thế sẽ đến.
          </p>
        }
        sectionNames={["Luật pháp", "Lịch sử", "Thi ca & Khôn ngoan", "Tiên tri"]}
        sectionDescs={[
          <>
            Sáng thế ký đến{" "}
            <strong>
              <em>{BOOK_DEUTERONOMY_VN}</em>
            </strong>{" "}
            — sáng thế, sự sa ngã và giao ước của <strong>{TERM_GOD_VN}</strong> với{" "}
            <strong>
              <em>{PLACE_ISRAEL_VN}</em>
            </strong>
            .
          </>,
          <>
            Giô-sué đến{" "}
            <strong>
              <em>{BOOK_ESTHER_VN}</em>
            </strong>{" "}
            — câu chuyện{" "}
            <strong>
              <em>{PLACE_ISRAEL_VN}</em>
            </strong>{" "}
            trong Đất Hứa, các vua, lưu đày và trở về.
          </>,
          <>
            <strong>
              <em>{BOOK_JOB_VN}</em>
            </strong>{" "}
            đến Nhã Ca — suy ngẫm về đau khổ, ca ngợi, khôn ngoan và tình yêu.
          </>,
          <>
            <strong>
              <em>{BOOK_ISAIAH_VN}</em>
            </strong>{" "}
            đến{" "}
            <strong>
              <em>{BOOK_MALACHI_VN}</em>
            </strong>{" "}
            — sứ giả của <strong>{TERM_GOD_VN}</strong> kêu gọi{" "}
            <strong>
              <em>{PLACE_ISRAEL_VN}</em>
            </strong>{" "}
            trở lại, chỉ về <strong>{TERM_CHRIST_VN}</strong>.
          </>,
        ]}
        sections={OT_SECTIONS}
        bookLabelSingular="sách"
        bookLabelPlural="sách"
      />

      <LearnWhatIsBibleTestamentSection
        bodyBright
        title={TERM_NEW_TESTAMENT_VN}
        intro={
          <p className={cn("mb-5 leading-relaxed", vnBodyClass)}>
            Được viết bằng tiếng{" "}
            <strong>
              <em>{LANG_GREEK_VN}</em>
            </strong>
            , <strong>{TERM_NEW_TESTAMENT_VN}</strong> mở đầu bằng bốn sách Phúc Âm kể về
            cuộc đời, chức vụ, sự chết và sự sống lại của{" "}
            <strong>Chúa {NAME_JESUS_VN}</strong>. Sau đó là câu chuyện về Hội Thánh đầu
            tiên lan rộng ra khắp thế giới, và kết thúc bằng khải tượng về sự hoàn tất của
            lịch sử trong <strong>Chúa {NAME_JESUS_VN}</strong>.
          </p>
        }
        sectionNames={["Phúc âm", "Lịch sử", "Thư tín", "Khải tượng"]}
        sectionDescs={[
          <>
            <strong>
              <em>{BOOK_MATTHEW_VN}</em>
            </strong>
            ,{" "}
            <strong>
              <em>{BOOK_MARK_VN}</em>
            </strong>
            ,{" "}
            <strong>
              <em>{BOOK_LUKE_VN}</em>
            </strong>
            ,{" "}
            <strong>
              <em>{BOOK_JOHN_VN}</em>
            </strong>{" "}
            — bốn tường thuật về cuộc đời, chức vụ, sự chết và sống lại của{" "}
            <strong>Chúa {NAME_JESUS_VN}</strong>.
          </>,
          <>
            <strong>
              <em>{BOOK_ACTS_VN}</em>
            </strong>{" "}
            — câu chuyện Hội thánh đầu tiên lan ra từ{" "}
            <strong>
              <em>{PLACE_JERUSALEM_VN}</em>
            </strong>{" "}
            đến tận cùng trái đất.
          </>,
          <>
            <strong>
              <em>{BOOK_ROMANS_VN}</em>
            </strong>{" "}
            đến{" "}
            <strong>
              <em>{BOOK_JUDE_VN}</em>
            </strong>{" "}
            —{" "}
            <strong>
              <em>{NAME_PAUL_VN}</em>
            </strong>{" "}
            và những người khác viết cho các Hội thánh và cá nhân về đức tin và đời sống.
          </>,
          <>
            <strong>
              <em>{BOOK_REVELATION_VN}</em>
            </strong>{" "}
            — khải tượng về sự kết thúc lịch sử và sự chiến thắng của{" "}
            <strong>{NAME_JESUS_VN}</strong>.
          </>,
        ]}
        sections={NT_SECTIONS}
        bookLabelSingular="sách"
        bookLabelPlural="sách"
      />

      <LearnWhyItMatters title="Câu chuyện trung tâm — và vì sao nó quan trọng">
        <p className={cn("leading-relaxed", vnBodyClass)}>
          Dù được viết bởi nhiều người trong nhiều thế kỷ khác nhau,{" "}
          <strong>{TERM_BIBLE_VN}</strong> không phải là những câu chuyện rời rạc. Nó kể
          một câu chuyện lớn: <strong>{TERM_GOD_VN}</strong> tạo dựng con người, con người
          rời xa <strong>Ngài</strong>, và <strong>Ngài</strong> tìm cách đưa họ trở lại.
          Câu chuyện đó tập trung vào <strong>Chúa {NAME_JESUS_VN}</strong>.
        </p>

        <p className={cn("mt-4 leading-relaxed", vnBodyClass)}>
          Nếu <strong>{TERM_BIBLE_VN}</strong> chỉ là sách cổ, thì nó chỉ thuộc về quá
          khứ. Nhưng nếu câu chuyện này là thật, thì nó liên quan trực tiếp đến bạn — đến
          việc bạn là ai, vì sao thế giới có quá nhiều đổ vỡ, và liệu còn hy vọng nào cho
          con người hay không.
        </p>

        <p className={cn("mt-4 leading-relaxed", vnBodyClass)}>
          Vì thế, tin theo <strong>Chúa {NAME_JESUS_VN}</strong> không chỉ là sống tốt
          hơn, mà là bước vào mối quan hệ với Đức Chúa Trời.
        </p>
      </LearnWhyItMatters>
      <LearnWhatIsBibleGlossary
        glossaryTitle="Từ vựng nhanh"
        glossary={VN_GLOSSARY}
        locale="vi"
      />
    </article>
  );
}
