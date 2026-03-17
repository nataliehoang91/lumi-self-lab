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
import { LearnWhyItMatters } from "../shared-components/why-it-matters";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import type { BibleBook } from "@/components/Bible/Read/types";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import { LearnWhatIsBibleAuthorsSection } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleAuthorsSection";
import { LearnLibraryBlock } from "@/components/Bible/Learn/shared-components/LearnLibraryBlock";
import { QuoteCard } from "@/components/GeneralComponents/QuoteCard";
import { useLocaleFonts } from "@/components/Bible/global/utils";

const VN_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: "Cựu Ước",
    def: "Phần đầu của Kinh Thánh, ghi lại lịch sử, luật pháp, thơ ca và lời tiên tri của dân Y-sơ-ra-ên trước thời Chúa Giê-xu.",
  },
  {
    term: "Tân Ước",
    def: "Phần sau của Kinh Thánh, bắt đầu với bốn sách Phúc Âm kể về cuộc đời Chúa Giê-xu và tiếp tục với sự hình thành của Hội Thánh đầu tiên.",
  },
  {
    term: "Chính điển",
    def: "Danh sách các sách được cộng đồng đức tin công nhận là có thẩm quyền và được đọc công khai trong sự thờ phượng.",
  },
  {
    term: "Giao ước",
    def: "Một sự cam kết mang tính quan hệ giữa Đức Chúa Trời và con người. Chủ đề này xuất hiện xuyên suốt cả Cựu Ước và Tân Ước.",
  },
  {
    term: "Phúc âm",
    def: 'Nghĩa là "Tin Lành" hay "tin vui" — thuật ngữ thường dùng để chỉ sứ điệp về Chúa Giê-xu và ý nghĩa của cuộc đời, sự chết và sự sống lại của Ngài.',
  },
  {
    term: "Tiên tri",
    def: "Người được kêu gọi để truyền đạt sứ điệp của Đức Chúa Trời trong bối cảnh lịch sử cụ thể, thường kêu gọi dân sự trở lại và sống trung tín.",
  },
  {
    term: "Khải huyền",
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

const AuthorsSectionBulletItems = ({
  key,
  bookId,
  chapter,
  verse,
  verseEnd,
  testament,
  title,
  verseLinkText,
}: {
  bookId: string | null;
  chapter: number;
  verse: number;
  verseEnd: number;
  testament: "ot" | "nt";
  title: string;
  verseLinkText: string;
  key: string;
}) => {
  const { bodyClassUp } = useBibleFontClasses();
  const { bodyFont } = useLocaleFonts("vi");
  return (
    <div key={key} className="d:items-baseline mt-8 flex flex-col gap-x-2 md:flex-row">
      <span className={cn(bodyClassUp)}>• {title}</span>
      <span className="hidden shrink-0 md:block">-</span>
      <div className="flex justify-end gap-x-2 text-right">
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={bookId}
          chapter={chapter}
          verse={verse}
          verseEnd={verseEnd}
          testament={testament}
          triggerClassName={cn(
            "underline underline-offset-2 theme-warm:text-sage-600 theme-warm:dark:text-sage-800",
            bodyClassUp,
            bodyFont
          )}
          previewText={VERSE_PREVIEW_VN_AUTHORS["II Sa-mu-ên 5:4-5"]}
        >
          {verseLinkText}
        </BibleVerseLink>
      </div>
    </div>
  );
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

export function VnWhatIsBiblePage({ books }: { books: BibleBook[] }) {
  const { bodyClass, bodyClassUp } = useBibleFontClasses();
  const { bodyFont } = useLocaleFonts("vi");
  return (
    <article aria-label="Kinh thánh là gì?" className="text-foreground">
      <LearnWhatIsBibleIntro
        locale="vi"
        moduleNum="01 / 05"
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
            . Dù được viết trong nhiều thời đại và bối cảnh khác nhau,{" "}
            <span className="font-semibold">Kinh Thánh</span> vẫn cùng kể một câu chuyện:
            câu chuyện về <span className="font-semibold">Đức Chúa Trời</span> và con
            người.
          </>,
        ]}
      />

      <LearnLibraryBlock
        locale="vi"
        title="Kinh Thánh là một “thư viện”, không phải chỉ một cuốn sách."
        firstParagraph={
          <>
            Điều này cho thấy Kinh Thánh gồm nhiều tác phẩm khác nhau nhưng liên kết với
            nhau.
          </>
        }
        secondParagraph={
          <>
            Kinh Thánh bao gồm nhiều thể loại như lịch sử, thơ ca, luật pháp, thư tín và
            khải huyền. Vì vậy, mỗi phần cần được đọc và hiểu theo cách phù hợp.
          </>
        }
      />

      <LearnWhatIsBibleStats
        locale="vi"
        statLabels={["Sách tổng cộng", "Cựu Ước", "Tân Ước", "Tác giả"]}
      />

      <LearnWhatIsBibleAuthorsSection
        locale="vi"
        title="Ai đã viết Kinh Thánh?"
        intro={
          <span className={cn("leading-relaxed", bodyClassUp, bodyFont)}>
            Kinh Thánh được viết bởi khoảng 40 tác giả khác nhau trong suốt hơn 2000 năm.
            Những người này đến từ nhiều nghề nghiệp và hoàn cảnh khác nhau.
          </span>
        }
        bulletItems={[
          <AuthorsSectionBulletItems
            key="1"
            bookId={findBookIdByVi(books, "2 Sa-mu-ên", "2 Samuel")}
            title="Vua - như Đa-vít"
            chapter={5}
            verse={4}
            verseEnd={5}
            testament="ot"
            verseLinkText="II Sa-mu-ên 5:4-5"
          />,

          <div key="2" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className={cn(bodyClassUp)}>• Người chăn chiên - như A-mốt</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, "A-mốt", "Amos")}
                chapter={1}
                verse={1}
                testament="ot"
                triggerClassName={bodyClass}
                previewText={VERSE_PREVIEW_VN_AUTHORS["A-mốt 1:1"]}
              >
                A-mốt 1:1
              </BibleVerseLink>
            </div>
          </div>,
          <div key="3" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className={cn(bodyClassUp)}>• Quan chức triều đình - như Đa-ni-ên</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, "Đa-ni-ên", "Daniel")}
                chapter={2}
                verse={48}
                testament="ot"
                triggerClassName={bodyClass}
                previewText={VERSE_PREVIEW_VN_AUTHORS["Đa-ni-ên 2:48"]}
              >
                Đa-ni-ên 2:48
              </BibleVerseLink>
            </div>
          </div>,
          <div key="4" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className={cn(bodyClassUp)}>• Bác sĩ - như Lu-ca</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, "Cô-lô-se", "Colossians")}
                chapter={4}
                verse={14}
                testament="nt"
                triggerClassName={bodyClass}
                previewText={VERSE_PREVIEW_VN_AUTHORS["Cô-lô-se 4:14"]}
              >
                Cô-lô-se 4:14
              </BibleVerseLink>
            </div>
          </div>,
          <div key="5" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className={cn(bodyClassUp)}>• Người đánh cá - như Phi-e-rơ</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, "Ma-thi-ơ", "Matthew")}
                chapter={4}
                verse={18}
                verseEnd={21}
                testament="nt"
                triggerClassName={bodyClass}
                previewText={VERSE_PREVIEW_VN_AUTHORS["Ma-thi-ơ 4:18-21"]}
              >
                Ma-thi-ơ 4:18-21
              </BibleVerseLink>
            </div>
          </div>,
          <div key="6" className="flex flex-col gap-x-2 md:flex-row md:items-baseline">
            <span className={cn(bodyClassUp)}>• Người thu thuế - như Ma-thi-ơ</span>
            <span className="hidden shrink-0 md:block">-</span>
            <div className="flex justify-end gap-x-2 text-right">
              <BibleVerseLink
                langSegment="vi"
                version1="vi"
                bookId={findBookIdByVi(books, "Ma-thi-ơ", "Matthew")}
                chapter={10}
                verse={3}
                testament="nt"
                triggerClassName={bodyClass}
                previewText={VERSE_PREVIEW_VN_AUTHORS["Ma-thi-ơ 10:3"]}
              >
                Ma-thi-ơ 10:3
              </BibleVerseLink>
            </div>
          </div>,
        ]}
        conclusion={
          <p className={cn("mt-6 leading-relaxed", bodyClassUp, bodyFont)}>
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
              findBookIdByVi(books, "2 Ti-mô-thê", "2 Timothy"),
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
        locale="vi"
        title="Cựu Ước"
        intro={
          <p className={cn("mb-5 leading-relaxed", bodyClassUp, bodyFont)}>
            Cựu Ước được viết chủ yếu bằng tiếng Hê-bơ-rơ (và một phần tiếng A-ram). Phần
            này kể từ lúc thế giới được tạo dựng cho đến trước khi Chúa Giê-xu ra đời. Đây
            là câu chuyện về Đức Chúa Trời, về dân Y-sơ-ra-ên, và về lời hứa rằng một Đấng
            Cứu Thế sẽ đến.
          </p>
        }
        sectionNames={["Luật pháp", "Lịch sử", "Thi ca & Khôn ngoan", "Tiên tri"]}
        sectionDescs={[
          <>
            Sáng thế ký đến Phục truyền— sáng thế, sự sa ngã và giao ước của Đức Chúa Trời
            với Y-sơ-ra-ên.
          </>,
          <>
            Giô-sué đến Ê-xơ-tê — câu chuyện Y-sơ-ra-ên trong Đất Hứa, các vua, lưu đày và
            trở về. trong Đất Hứa, các vua, lưu đày và trở về.
          </>,
          <>Gióp đến Nhã Ca — suy ngẫm về đau khổ, ca ngợi, khôn ngoan và tình yêu.</>,
          <>
            Ê-sai đến Ma-la-chi — sứ giả của Đức Chúa Trời kêu gọi Y-sơ-ra-ên trở lại, chỉ
            về Đấng Christ.
          </>,
        ]}
        sections={OT_SECTIONS}
        bookLabelSingular="sách"
        bookLabelPlural="sách"
      />

      <LearnWhatIsBibleTestamentSection
        bodyBright
        locale="vi"
        title="Tân Ước"
        intro={
          <p className={cn("mb-5 leading-relaxed", bodyClassUp, bodyFont)}>
            Tân Ước được viết bằng tiếng Hy Lạp. Phần này bắt đầu với bốn sách Phúc Âm, kể
            về cuộc đời, sự chết và sự sống lại của Chúa Giê-xu. Sau đó là câu chuyện Hội
            Thánh lan rộng, và kết thúc với bức tranh về tương lai khi mọi sự được hoàn
            tất trong Ngài.
          </p>
        }
        sectionNames={["Phúc âm", "Lịch sử", "Thư tín", "Khải tượng"]}
        sectionDescs={[
          <>
            Ma-thi-ơ, Mác, Lu-ca, Giăng — bốn tường thuật về cuộc đời, chức vụ, sự chết và
            sự sống lại của Chúa Giê-xu.
          </>,
          <>
            Công vụ — câu chuyện Hội thánh đầu tiên lan ra từ Giê-ru-sa-lem đến tận cùng
            trái đất. — câu chuyện Hội thánh đầu tiên lan ra từ đến tận cùng trái đất.
          </>,
          <>
            Rô-ma đến Giu-đe — Phao-lô và những người khác viết cho các Hội thánh và cá
            nhân về đức tin và đời sống. và những người khác viết cho các Hội thánh và cá
            nhân về đức tin và đời sống.
          </>,
          <>
            Khải huyền — khải tượng về sự kết thúc lịch sử và sự chiến thắng của Chúa
            Giê-xu.
          </>,
        ]}
        sections={NT_SECTIONS}
        bookLabelSingular="sách"
        bookLabelPlural="sách"
      />

      <LearnWhyItMatters locale="vi" title="Vì sao Kinh Thánh quan trọng">
        <p className={cn("leading-relaxed", bodyClassUp, bodyFont)}>
          Nếu Kinh Thánh chỉ là một cuốn sách cổ, thì nó chỉ kể chuyện của người xưa. Bạn
          có thể tôn trọng nó, nhưng không nhất thiết phải quan tâm.
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClassUp, bodyFont)}>
          Nhưng thật sự, Kinh Thánh nói về câu chuyện lớn của con người — từ lúc thế giới
          được tạo dựng cho đến tương lai của nhân loại. Và trong câu chuyện đó, bạn cũng
          ở trong đó. Thì bạn có nên quan tâm không?
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClassUp, bodyFont)}>
          Vậy câu hỏi quan trọng không phải &quot;
          <span className="font-semibold">Kinh Thánh nói gì?</span>&quot;, mà là: &quot;
          <span className="font-semibold">
            Bạn muốn biết tương lai của chính mình không?
          </span>
          &quot;
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
