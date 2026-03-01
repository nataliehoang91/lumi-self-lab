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
  LANG_HEBREW_VN,
  TERM_GOD_VN,
  TERM_BIBLE_VN,
  TERM_OLD_TESTAMENT_VN,
  TERM_NEW_TESTAMENT_VN,
} from "@/components/Bible/Learn/constants";
import { useLearnFontClasses } from "../../useLearnFontClasses";
import { cn } from "@/lib/utils";
import {
  LearnWhatIsBibleGlossary,
  type GlossaryItem,
} from "../../WhatIsBible/shared-components/LearnWhatIsBibleGlossary";

const VN_JESUS_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: "Đấng Mê-si (Messiah)",
    def: "Từ Hê-bơ-rơ nghĩa là “Đấng được xức dầu.” Trong Kinh Thánh, danh xưng này chỉ về vị vua và Đấng giải cứu mà dân Y-sơ-ra-ên trông đợi. Các sách Tân Ước trình bày Chúa Giê-xu là Đấng Mê-si ấy.",
  },
  {
    term: "Sự nhập thể (Incarnation)",
    def: "Niềm tin rằng Đức Chúa Trời đã đến trong thân thể con người nơi Chúa Giê-xu. Không chỉ là một sứ giả, mà là Đức Chúa Trời bước vào lịch sử loài người.",
  },
  {
    term: "Sự phục sinh (Resurrection)",
    def: "Niềm tin rằng Chúa Giê-xu đã sống lại cách thân thể vào ngày thứ ba sau khi bị đóng đinh. Đối với Cơ Đốc nhân, đây là trung tâm của đức tin và là dấu mốc quyết định của lịch sử.",
  },
];

const PROPHECY_ITEMS = [
  { prophecy: "Sinh tại Bết-lê-hem", ref: "Mi-chê 5:2", fulfilled: `${BOOK_MATTHEW_VN} 2:1` },
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

export function VnWhoIsJesus() {
  const { bodyClass } = useLearnFontClasses();
  return (
    <article aria-label={`Bài học Chúa ${NAME_JESUS_VN} Là Ai?`}>
      <LearnLessonIntro
        moduleNum="03 / 04"
        title={`Chúa ${NAME_JESUS_VN} Là Ai?`}
        intro1={
          <p className={cn("leading-relaxed my-4 text-muted-foreground", bodyClass)}>
            Trong suốt hơn hai nghìn năm, con người vẫn tranh luận về thân vị của{" "}
            <strong>Chúa {NAME_JESUS_VN}</strong>.{" "}
          </p>
        }
        intro1Quote={
          <>
            <strong>Ngài</strong> là một thầy giáo? Một nhà tiên tri? Một nhà cách mạng? Một huyền
            thoại? Con {TERM_GOD_VN}? Hay là Đấng vượt xa mọi tưởng tượng của chúng ta?
          </>
        }
      >
        <p className={cn("leading-relaxed my-4 text-muted-foreground", bodyClass)}>
          <strong>Chúa {NAME_JESUS_VN}</strong> người Na-xa-rét là nhân vật trung tâm của{" "}
          {TERM_NEW_TESTAMENT_VN} và giữ vị trí đặc biệt trong toàn bộ {TERM_BIBLE_VN}. Nhiều người
          tin rằng các sách {TERM_OLD_TESTAMENT_VN} chuẩn bị cho sự xuất hiện của{" "}
          <strong>Ngài</strong>, và mọi điều sau đó đều chịu ảnh hưởng sâu sắc từ{" "}
          <strong>Ngài</strong>.
        </p>
      </LearnLessonIntro>

      <LearnFullyGodManSection
        sectionTitle={`Trọn Vẹn Là ${TERM_GOD_VN}. Trọn Vẹn Là Con Người.`}
        leftTitle="Hoàn Toàn Là Con Người"
        leftBody={
          <>
            Chúa {NAME_JESUS_VN} được sinh ra, lớn lên trong một gia đình bình thường, biết đói,
            biết mệt, từng buồn khóc và cuối cùng đối diện với sự chết. <strong>Ngài</strong> bước
            vào thân phận con người cách trọn vẹn — không từ xa, nhưng từ bên trong.
          </>
        }
        leftRef={`Giăng 11:35 · ${LANG_HEBREW_VN} 4:15`}
        rightTitle={`Hoàn Toàn Là ${TERM_GOD_VN}`}
        rightBody={
          <>
            Tuy nhiên, <strong>Ngài</strong> cũng tha tội, khiến gió và biển phải vâng lời, nhận sự
            thờ phượng, và sống lại từ cõi chết. {TERM_NEW_TESTAMENT_VN} trình bày{" "}
            <strong>Ngài</strong> không chỉ như một sứ giả của {TERM_GOD_VN}, mà như chính{" "}
            {TERM_GOD_VN} đến trong thân thể con người.
          </>
        }
        rightRef="Giăng 1:1 · Cô-lô-se 2:9"
      />

      <LearnCrossSection
        title="Thập Tự Giá & Sự Phục Sinh"
        paragraph1={
          <>
            Khoảng năm 30 sau Công Nguyên, Chúa {NAME_JESUS_VN} bị đóng đinh dưới thời tổng đốc La
            Mã Bôn-xơ Phi-lát. Người tin Chúa tin rằng đây không chỉ là một biến cố lịch sử, nhưng
            là trung tâm của kế hoạch cứu chuộc. Trên thập tự giá, <strong>Ngài</strong> được hiểu
            là đã gánh lấy tội lỗi nhân loại — mở ra con đường tha thứ và hòa giải với {TERM_GOD_VN}
            .
          </>
        }
        paragraph2={
          <>
            Đến ngày thứ ba, <strong>Ngài</strong> sống lại cách thân thể. Sự phục sinh này được
            công bố ngay từ những ngày đầu của Hội Thánh, với lời chứng của nhiều nhân chứng được
            ghi lại trong các sách {TERM_NEW_TESTAMENT_VN}. Đối với người tin Chúa, đây không chỉ là
            biểu tượng, mà là bước ngoặt của lịch sử.
          </>
        }
        refText="I Cô-rinh-tô 15:3–8"
      />

      <LearnProphecySection
        title="Sự Ứng Nghiệm Lời Tiên Tri"
        intro={
          <>
            Từ nhiều thế kỷ trước khi Chúa {NAME_JESUS_VN} ra đời, {TERM_BIBLE_VN} đã nói về một
            Đấng Mê-si sẽ đến — mô tả nơi sinh, sự chịu khổ, và thậm chí cách <strong>Ngài</strong>{" "}
            chịu chết. Nhiều người tin Chúa thấy sự tương ứng rõ ràng giữa các lời tiên tri ấy và
            cuộc đời của <strong>Ngài</strong>. Tuy nhiên, cách hiểu và diễn giải những lời tiên tri
            này vẫn là chủ đề được thảo luận trong nhiều thế kỷ.
          </>
        }
        items={PROPHECY_ITEMS}
      />

      <LearnWhyCtaSection
        title={`Vì Sao Chúa ${NAME_JESUS_VN} Vẫn Quan Trọng Ngày Nay?`}
        paragraph1={
          <>
            Nếu Chúa {NAME_JESUS_VN} thực sự đã sống lại từ cõi chết, thì <strong>Ngài</strong>{" "}
            không thể chỉ được xem như một thầy giáo đạo đức hay một câu chuyện truyền cảm hứng.
          </>
        }
        paragraph2={
          <>
            Đối với người tin Chúa, đức tin nơi <strong>Ngài</strong> không chỉ là chấp nhận một
            giáo lý, mà là đặt lòng tin nơi một Đấng đang sống — Đấng ban sự tha thứ, mục đích sống
            và hy vọng đời đời.
          </>
        }
        linkHref="/bible/vi/read"
        linkLabel="Đọc Phúc Âm"
      />
      <LearnWhatIsBibleGlossary glossaryTitle="Từ vựng nhanh" glossary={VN_JESUS_GLOSSARY} />
    </article>
  );
}
