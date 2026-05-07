"use client";

import Image from "next/image";
import { LearnWhatIsBibleIntro } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleIntro";
import { LearnWhatIsBibleStats } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleStats";
import { LearnWhatIsBibleTestamentSection } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleTestamentSection";
import {
  LearnWhatIsBibleGlossaryGrid,
  type GlossaryGridItem,
} from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleGlossaryGrid";
import { RevealSection } from "@/components/Bible/Learn/shared-components/RevealSection";
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
import { AuthorOccupationGrid } from "@/components/Bible/Learn/WhatIsBible/shared-components/AuthorOccupationGrid";
import { BibleTestamentSplitBlock } from "@/components/Bible/Learn/WhatIsBible/shared-components/BibleTestamentSplitBlock";
import { LearnLibraryBlock } from "@/components/Bible/Learn/shared-components/LearnLibraryBlock";
import { BibleSacredQuote } from "@/components/Bible/Learn/WhatIsBible/shared-components/BibleSacredQuote";
import { useLocaleFonts } from "@/components/Bible/global/utils";
import {
  BookMarked,
  BookOpen,
  Eye,
  Handshake,
  ListChecks,
  Megaphone,
  Sparkles,
} from "lucide-react";

const VN_GLOSSARY_ITEMS = [
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

const VN_GLOSSARY_GRID_ITEMS: readonly GlossaryGridItem[] = VN_GLOSSARY_ITEMS.map(
  (item, i) => ({
    ...item,
    icon: [
      BookOpen,
      BookMarked,
      ListChecks,
      Handshake,
      Sparkles,
      Megaphone,
      Eye,
    ][i]!,
  })
);

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

export function VnWhatIsBiblePage({ books }: { books: BibleBook[] }) {
  const { bodyClassUp } = useBibleFontClasses();
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

      <RevealSection className="my-8 flex justify-center px-0 md:my-10">
        <figure>
          <Image
            src="/images/understand/vn-what-is-bible-authors-timeline.png"
            alt="Dòng thời gian: các tác giả Kinh Thánh qua hơn 2000 năm."
            width={1200}
            height={675}
            className="border-border/50 h-auto w-full max-w-2xl rounded-xl border shadow-sm"
            sizes="(max-width: 672px) 100vw, 672px"
          />
        </figure>
      </RevealSection>

      <RevealSection>
        <LearnLibraryBlock
          locale="vi"
          title={`Kinh Thánh là một "thư viện", không phải chỉ một cuốn sách.`}
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
      </RevealSection>

      <RevealSection>
        <LearnWhatIsBibleStats
          locale="vi"
          statLabels={["Sách tổng cộng", "Cựu Ước", "Tân Ước", "Tác giả"]}
        />
      </RevealSection>

      <RevealSection>
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
          <AuthorOccupationGrid
            key="grid"
            locale="vi"
            cards={[
              {
                icon: "crown",
                role: "Vua",
                person: "như Đa-vít",
                verseLink: (
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "2 Sa-mu-ên", "2 Samuel")}
                    chapter={5}
                    verse={4}
                    verseEnd={5}
                    testament="ot"
                    triggerClassName="underline underline-offset-2 text-second theme-warm:text-second-400 dark:text-second"
                    previewText={VERSE_PREVIEW_VN_AUTHORS["II Sa-mu-ên 5:4-5"]}
                  >
                    II Sa-mu-ên 5:4-5
                  </BibleVerseLink>
                ),
              },
              {
                icon: "shepherd",
                role: "Người chăn chiên",
                person: "như A-mốt",
                verseLink: (
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "A-mốt", "Amos")}
                    chapter={1}
                    verse={1}
                    testament="ot"
                    triggerClassName="underline underline-offset-2 text-second theme-warm:text-second-400 dark:text-second"
                    previewText={VERSE_PREVIEW_VN_AUTHORS["A-mốt 1:1"]}
                  >
                    A-mốt 1:1
                  </BibleVerseLink>
                ),
              },
              {
                icon: "scroll",
                role: "Quan chức triều đình",
                person: "như Đa-ni-ên",
                verseLink: (
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "Đa-ni-ên", "Daniel")}
                    chapter={2}
                    verse={48}
                    testament="ot"
                    triggerClassName="underline underline-offset-2 text-second theme-warm:text-second-400 dark:text-second"
                    previewText={VERSE_PREVIEW_VN_AUTHORS["Đa-ni-ên 2:48"]}
                  >
                    Đa-ni-ên 2:48
                  </BibleVerseLink>
                ),
              },
              {
                icon: "cross",
                role: "Bác sĩ",
                person: "như Lu-ca",
                verseLink: (
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "Cô-lô-se", "Colossians")}
                    chapter={4}
                    verse={14}
                    testament="nt"
                    triggerClassName="underline underline-offset-2 text-second theme-warm:text-second-400 dark:text-second"
                    previewText={VERSE_PREVIEW_VN_AUTHORS["Cô-lô-se 4:14"]}
                  >
                    Cô-lô-se 4:14
                  </BibleVerseLink>
                ),
              },
              {
                icon: "fish",
                role: "Người đánh cá",
                person: "như Phi-e-rơ",
                verseLink: (
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "Ma-thi-ơ", "Matthew")}
                    chapter={4}
                    verse={18}
                    verseEnd={21}
                    testament="nt"
                    triggerClassName="underline underline-offset-2 text-second theme-warm:text-second-400 dark:text-second"
                    previewText={VERSE_PREVIEW_VN_AUTHORS["Ma-thi-ơ 4:18-21"]}
                  >
                    Ma-thi-ơ 4:18-21
                  </BibleVerseLink>
                ),
              },
              {
                icon: "coins",
                role: "Người thu thuế",
                person: "như Ma-thi-ơ",
                verseLink: (
                  <BibleVerseLink
                    langSegment="vi"
                    version1="vi"
                    bookId={findBookIdByVi(books, "Ma-thi-ơ", "Matthew")}
                    chapter={10}
                    verse={3}
                    testament="nt"
                    triggerClassName="underline underline-offset-2 text-second theme-warm:text-second-400 dark:text-second"
                    previewText={VERSE_PREVIEW_VN_AUTHORS["Ma-thi-ơ 10:3"]}
                  >
                    Ma-thi-ơ 10:3
                  </BibleVerseLink>
                ),
              },
            ]}
          />,
        ]}
        conclusion={
          <p className={cn("mt-6 leading-relaxed", bodyClassUp, bodyFont)}>
            Dù được viết bởi nhiều người trong nhiều thời đại khác nhau, người tin Chúa
            tin rằng Đức Chúa Trời đã hướng dẫn họ khi viết.
          </p>
        }
        quoteContainerClassName="mt-6"
        quoteBlocks={[
          <BibleSacredQuote
            key="2tim316"
            quote="Cả Kinh Thánh đều là bởi Đức Chúa Trời soi dẫn, có ích cho sự dạy dỗ, bẻ trách, sửa trị, dạy người trong sự công bình."
            reference="II Ti-mô-thê 3:16"
            referenceHref={buildReadHrefVi(
              findBookIdByVi(books, "2 Ti-mô-thê", "2 Timothy"),
              3,
              16,
              "nt"
            )}
            locale="vi"
          />,
        ]}
      />
      </RevealSection>

      <RevealSection className="mt-12 border-border/40 border-t pt-10">
        <h2
          className={cn(
            "text-foreground mb-3 text-xl font-semibold",
            "font-vietnamese-flashcard"
          )}
        >
          Hai phần chính: Cựu Ước và Tân Ước
        </h2>
        <p className={cn("leading-relaxed", bodyClassUp, bodyFont)}>
          Kinh Thánh thường được tóm lược thành hai phần lớn — mỗi phần dùng ngôn ngữ và
          thể loại khác nhau, nhưng cùng kể một câu chuyện xuyên suốt. Phần dưới giúp bạn
          hình dung nhanh sự khác biệt và mối liên hệ giữa hai phần đó.
        </p>
      </RevealSection>

      <RevealSection>
      <BibleTestamentSplitBlock
        className="mt-8"
        locale="vi"
        otTitle="Cựu Ước"
        ntTitle="Tân Ước"
        otLang="Tiếng Hê-bơ-rơ & A-ram"
        ntLang="Tiếng Hy Lạp"
        otTagline="Tạo dựng · Luật pháp · Lời hứa"
        ntTagline="Chúa Giê-xu · Hội Thánh"
        otDesc="Cựu Ước được viết chủ yếu bằng tiếng Hê-bơ-rơ (và một phần tiếng A-ram). Phần này kể từ lúc thế giới được tạo dựng cho đến trước khi Chúa Giê-xu ra đời. Đây là câu chuyện về Đức Chúa Trời, về dân Y-sơ-ra-ên, và về lời hứa rằng một Đấng Cứu Thế sẽ đến."
        ntDesc="Tân Ước được viết bằng tiếng Hy Lạp. Phần này bắt đầu với bốn sách Phúc Âm, kể về cuộc đời, sự chết và sự sống lại của Chúa Giê-xu. Sau đó là câu chuyện Hội Thánh lan rộng, và kết thúc với bức tranh về tương lai khi mọi sự được hoàn tất trong Ngài."
      />
      </RevealSection>

      <RevealSection>
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
      </RevealSection>

      <RevealSection>
        <LearnWhatIsBibleGlossaryGrid
          glossaryTitle="Từ vựng nhanh"
          items={VN_GLOSSARY_GRID_ITEMS}
          locale="vi"
        />
      </RevealSection>
    </article>
  );
}
