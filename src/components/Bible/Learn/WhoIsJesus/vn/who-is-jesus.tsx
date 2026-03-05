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
import Link from "next/link";

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

const PROPHECY_ITEMS = [
  {
    prophecy: "Sinh tại Bết-lê-hem",
    ref: "Mi-chê 5:2",
    fulfilled: `${BOOK_MATTHEW_VN} 2:1`,
  },
  {
    prophecy: "Sinh bởi nữ đồng trinh",
    ref: `${BOOK_ISAIAH_VN} 7:14`,
    fulfilled: `${BOOK_LUKE_VN} 1:27`,
  },
  {
    prophecy: `Vào ${PLACE_JERUSALEM_VN} trên lưng lừa`,
    ref: "Xa-cha-ri 9:9",
    fulfilled: `${BOOK_MARK_VN} 11:7`,
  },
  {
    prophecy: "Bị phản bội với 30 miếng bạc",
    ref: "Xa-cha-ri 11:12",
    fulfilled: `${BOOK_MATTHEW_VN} 26:15`,
  },
  {
    prophecy: "Bị đóng đinh, tay chân bị đâm",
    ref: "Thi Thiên 22:16",
    fulfilled: `${BOOK_LUKE_VN} 24:39`,
  },
  {
    prophecy: "Sống lại từ cõi chết",
    ref: "Thi Thiên 16:10",
    fulfilled: `${BOOK_ACTS_VN} 2:31`,
  },
];

function findBookIdByVi(books: BibleBook[], nameVi: string): string | null {
  const book = books.find((b) => b.nameVi === nameVi);
  return book?.id ?? null;
}

export function VnWhoIsJesus({ books }: { books: BibleBook[] }) {
  const { bodyClass } = useBibleFontClasses();
  return (
    <article aria-label={`Bài học Chúa ${NAME_JESUS_VN} Là Ai?`}>
      <LearnLessonIntro
        moduleNum="03 / 04"
        title={`Chúa ${NAME_JESUS_VN} Là Ai?`}
        intro1={
          <p className={cn("text-muted-foreground my-4 leading-relaxed", bodyClass)}>
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
        <p className={cn("text-muted-foreground my-4 leading-relaxed", bodyClass)}>
          <strong>Chúa {NAME_JESUS_VN}</strong> người Na-xa-rét là nhân vật trung tâm của{" "}
          {TERM_NEW_TESTAMENT_VN} và giữ vị trí đặc biệt trong toàn bộ {TERM_BIBLE_VN}.
          Nhiều người tin rằng các sách {TERM_OLD_TESTAMENT_VN} chuẩn bị cho sự xuất hiện
          của <strong>Ngài</strong>, và mọi điều sau đó đều chịu ảnh hưởng sâu sắc từ{" "}
          <strong>Ngài</strong>.
        </p>
      </LearnLessonIntro>

      <LearnFullyGodManSection
        sectionTitle={`Vừa Là Con ${TERM_GOD_VN}, Vừa Là Con Người`}
        leftTitle="Hoàn Toàn Là Con Người"
        leftBody={
          <>
            <strong>Chúa {NAME_JESUS_VN}</strong> được sinh ra như một con người thật.
            Ngài lớn lên trong một gia đình bình thường, biết đói, biết mệt, từng buồn và
            đã khóc. Ngài cũng chịu đau đớn và đối diện với sự chết. <strong>Ngài</strong>{" "}
            không đứng ngoài cuộc sống con người — Ngài sống trọn vẹn trong đó.
          </>
        }
        leftRef={
          <>
            <BibleVerseLink
              langSegment="vi"
              version1="vi"
              bookId={findBookIdByVi(books, "Giăng")}
              chapter={11}
              verse={35}
              testament="nt"
            >
              Giăng 11:35
            </BibleVerseLink>
            {" · "}
            <BibleVerseLink
              langSegment="vi"
              version1="vi"
              bookId={findBookIdByVi(books, "Hê-bơ-rơ")}
              chapter={4}
              verse={15}
              testament="nt"
            >
              Hê-bơ-rơ 4:15
            </BibleVerseLink>
          </>
        }
        rightTitle={`Hoàn Toàn Là Con ${TERM_GOD_VN}`}
        rightBody={
          <>
            Đồng thời, <strong>Ngài</strong> làm những phép lạ: chữa lành người bệnh,
            khiến gió và biển phải vâng lời, cho người chết sống lại. Những hành động ấy
            khiến nhiều người tin rằng Ngài không chỉ là một giáo sư hay tiên tri, mà là{" "}
            <strong>{TERM_GOD_VN}</strong> — Ngôi Hai trong Ba Ngôi.
          </>
        }
        rightRef={
          <>
            <BibleVerseLink
              langSegment="vi"
              version1="vi"
              bookId={findBookIdByVi(books, "Giăng")}
              chapter={1}
              verse={1}
              testament="nt"
            >
              Giăng 1:1
            </BibleVerseLink>
            {" · "}
            <BibleVerseLink
              langSegment="vi"
              version1="vi"
              bookId={findBookIdByVi(books, "Cô-lô-se")}
              chapter={2}
              verse={9}
              testament="nt"
            >
              Cô-lô-se 2:9
            </BibleVerseLink>
          </>
        }
      />

      <LearnCrossSection
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
        refText="I Cô-rinh-tô 15:3–8"
      />

      <LearnProphecySection
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
        items={PROPHECY_ITEMS}
      />

      <LearnWhyCtaSection
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
      />
    </article>
  );
}

interface BibleVerseLinkProps {
  langSegment: "en" | "vi" | "zh";
  version1?: "vi" | "niv" | "kjv" | "zh";
  bookId: string | null;
  chapter: number;
  verse: number;
  testament: "ot" | "nt";
  children: React.ReactNode;
}

function BibleVerseLink({
  langSegment,
  version1,
  bookId,
  chapter,
  verse,
  testament,
  children,
}: BibleVerseLinkProps) {
  if (!bookId) return <span className="text-muted-foreground/80">{children}</span>;

  const sp = new URLSearchParams();
  if (version1) sp.set("version1", version1);
  sp.set("sync", "true");
  sp.set("book1", bookId);
  sp.set("chapter1", String(chapter));
  sp.set("testament1", testament);
  sp.set("verse1", String(verse));

  const href = `/bible/${langSegment}/read?${sp.toString()}`;

  return (
    <Link
      href={href}
      className="text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
    >
      {children}
    </Link>
  );
}
