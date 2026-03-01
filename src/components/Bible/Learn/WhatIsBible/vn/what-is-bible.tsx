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
  TERM_GOD_VN,
  TERM_BIBLE_VN,
  TERM_CHRIST_VN,
  TERM_OLD_TESTAMENT_VN,
  TERM_NEW_TESTAMENT_VN,
} from "@/components/Bible/Learn/constants";
import { LearnWhyItMatters } from "../shared-components/why-it-matters";
import { useLearnFontClasses } from "../../useLearnFontClasses";
import { cn } from "@/lib/utils";

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

export function VnWhatIsBiblePage() {
  const { bodyClass } = useLearnFontClasses();
  return (
    <article aria-label="Kinh thánh là gì?">
      <LearnWhatIsBibleIntro
        moduleNum="01 / 04"
        title="Kinh thánh là gì?"
        introParts={[
          "Kinh Thánh không chỉ là một quyển sách — đó là một tuyển tập gồm ",
          "66 sách",
          " được viết trong suốt khoảng ",
          "1.500 năm",
          " bởi gần ",
          "40 tác giả khác nhau",
          <>
            . Dù được hình thành qua nhiều thế kỷ và bối cảnh khác nhau, nhiều người tin rằng toàn
            bộ <strong>{TERM_BIBLE_VN}</strong> cùng kể một câu chuyện thống nhất — câu chuyện về mối
            quan hệ giữa <strong>{TERM_GOD_VN}</strong> và con người.
          </>,
        ]}
      />

      <blockquote className="mb-12 pl-6 pr-6 py-6 border-l-4 bg-primary-light/5 border-l-primary rounded-r-xl not-italic space-y-4">
        <p className="font-bible-english text-lg font-semibold  leading-snug">
          Kinh Thánh là thư viện, không phải một cuốn sách đơn lẻ.
        </p>
        <p className="leading-relaxed text-sm opacity-90">
          Từ <strong>&ldquo;Bible&rdquo;</strong> bắt nguồn từ tiếng Hy Lạp{" "}
          <strong>&ldquo;biblia&rdquo;</strong>, nghĩa là &ldquo;những cuốn sách&rdquo;. Hiểu điều
          này giúp chúng ta tránh việc đọc <strong>{TERM_BIBLE_VN}</strong> như một cuốn sách đồng nhất,
          mà thay vào đó là một thư viện gồm nhiều tác phẩm liên kết với nhau.
        </p>
        <p className="leading-relaxed text-sm opacity-80 border-t border-border pt-4">
          <strong>{TERM_BIBLE_VN}</strong> bao gồm nhiều thể loại: lịch sử, thơ ca, luật pháp, thư tín,
          khải tượng. Vì vậy, không thể đọc mọi phần theo cùng một cách.
        </p>
      </blockquote>

      <LearnWhatIsBibleStats statLabels={["Sách tổng cộng", "Cựu Ước", "Tân Ước", "Tác giả"]} />

      <LearnWhatIsBibleTestamentSection
        title={TERM_OLD_TESTAMENT_VN}
        intro={
          <p className={cn(" mb-5 leading-relaxed", bodyClass)}>
            Được viết chủ yếu bằng tiếng{" "}
            <strong>
              <em>{LANG_HEBREW_VN}</em>
            </strong>{" "}
            (và một phần tiếng{" "}
            <strong>
              <em>{LANG_ARAMAIC_VN}</em>
            </strong>
            ), <strong>{TERM_OLD_TESTAMENT_VN}</strong> ghi lại từ sự sáng tạo vũ trụ cho đến thời kỳ ngay trước khi{" "}
            <strong>Chúa {NAME_JESUS_VN}</strong> giáng sinh. Đây là câu chuyện về{" "}
            <strong>{TERM_GOD_VN}</strong>, về dân{" "}
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
      />

      <LearnWhatIsBibleTestamentSection
        title={TERM_NEW_TESTAMENT_VN}
        intro={
          <p className={cn(" mb-5 leading-relaxed", bodyClass)}>
            Được viết bằng tiếng{" "}
            <strong>
              <em>{LANG_GREEK_VN}</em>
            </strong>
            , <strong>{TERM_NEW_TESTAMENT_VN}</strong> mở đầu bằng bốn sách Phúc Âm kể về cuộc đời, chức vụ, sự chết
            và sự sống lại của <strong>Chúa {NAME_JESUS_VN}</strong>. Sau đó là câu chuyện về Hội Thánh đầu
            tiên lan rộng ra khắp thế giới, và kết thúc bằng khải tượng về sự hoàn tất của lịch sử
            trong <strong>{TERM_CHRIST_VN}</strong>.
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
            — bốn tường thuật về cuộc đời, chức vụ, sự chết và sống lại của <strong>Chúa {NAME_JESUS_VN}</strong>
            .
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
            — <strong><em>{NAME_PAUL_VN}</em></strong> và những người khác viết cho các Hội thánh và cá nhân
            về đức tin và đời sống.
          </>,
          <>
            <strong>
              <em>{BOOK_REVELATION_VN}</em>
            </strong>{" "}
            — khải tượng về sự kết thúc lịch sử và sự chiến thắng của <strong>{TERM_CHRIST_VN}</strong>.
          </>,
        ]}
        sections={NT_SECTIONS}
      />

      <LearnWhyItMatters title="Câu chuyện trung tâm — và vì sao nó quan trọng">
        <p className={cn(" leading-relaxed", bodyClass)}>
          Dù được viết bởi nhiều con người khác nhau qua nhiều thế kỷ, <strong>{TERM_BIBLE_VN}</strong>{" "}
          trình bày một đại câu chuyện: <strong>{TERM_GOD_VN}</strong> tạo dựng thế giới, con người
          phản nghịch, và một hành trình dài của sự hứa hẹn, hy vọng và phục hồi. Theo các sách Tân
          Ước cho rằng câu chuyện đó đạt đến đỉnh điểm trong <strong>Đức Chúa {NAME_JESUS_VN} Christ</strong>
          . Nếu <strong>{TERM_BIBLE_VN}</strong> chỉ là một tập hợp văn bản cổ đại, nó đơn thuần là tài
          liệu lịch sử.{" "}
        </p>

        <p className={cn("mt-4  leading-relaxed", bodyClass)}>
          Nhưng nếu nó thực sự kể một câu chuyện thống nhất về <strong>{TERM_GOD_VN}</strong> và con
          người, thì những gì nó tuyên bố về sự sống, đau khổ và hy vọng trở nên đáng để suy nghĩ
          nghiêm túc.
        </p>
      </LearnWhyItMatters>
      <LearnWhatIsBibleGlossary glossaryTitle="Từ vựng nhanh" glossary={VN_GLOSSARY} />
    </article>
  );
}
