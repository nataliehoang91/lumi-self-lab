"use client";

import type { BibleBook } from "@/components/Bible/Read/types";
import { LearnWhatIsBibleIntro } from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleIntro";
import { LearnLibraryBlock } from "@/components/Bible/Learn/shared-components/LearnLibraryBlock";
import { LearnWhatHappensAfterDeathLifeContinues } from "@/components/Bible/Learn/WhatHappensAfterDeath/shared-components/LearnWhatHappensAfterDeathLifeContinues";
import { LearnWhatHappensAfterDeathAccountability } from "@/components/Bible/Learn/WhatHappensAfterDeath/shared-components/LearnWhatHappensAfterDeathAccountability";
import { LearnWhatHappensAfterDeathTwoDestinies } from "@/components/Bible/Learn/WhatHappensAfterDeath/shared-components/LearnWhatHappensAfterDeathTwoDestinies";
import { LearnHopeBridge } from "@/components/Bible/Learn/WhatHappensAfterDeath/shared-components/LearnHopeBridge";
import { LearnWhyItMatters } from "@/components/Bible/Learn/WhatIsBible/shared-components/why-it-matters";
import {
  LearnWhatIsBibleGlossaryGrid,
  type GlossaryGridItem,
} from "@/components/Bible/Learn/WhatIsBible/shared-components/LearnWhatIsBibleGlossaryGrid";
import { RevealSection } from "@/components/Bible/Learn/shared-components/RevealSection";
import { LearnHeroImage } from "@/components/Bible/Learn/shared-components/LearnHeroImage";
import { NAME_JESUS_VN, TERM_GOD_VN } from "@/components/Bible/Learn/constants";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { BibleVerseLink } from "@/components/Bible/GeneralComponents/BibleVerseLink";
import { Heart, Scale, Clock, Cloud, Flame, Anchor } from "lucide-react";

const VN_DEATH_GLOSSARY: readonly GlossaryGridItem[] = [
  {
    term: "Linh hồn",
    def: `Phần bên trong con người còn tồn tại sau khi thân thể chết — cái tôi có ý thức mà bài học nói đến khi nhắc rằng con người không biến mất hoàn toàn.`,
    icon: Heart,
  },
  {
    term: "Phán xét",
    def: `Việc đứng trước mặt ${TERM_GOD_VN} để chịu trách nhiệm về đời sống; Kinh Thánh dạy mỗi người chỉ chết một lần, rồi sau đó là phán xét.`,
    icon: Scale,
  },
  {
    term: "Sự sống đời đời",
    def: `Đời sống không chấm dứt sau cái chết thể xác — trạng thái tiếp tục mãi mãi, hoặc ở cùng ${TERM_GOD_VN} hoặc tách khỏi Ngài.`,
    icon: Clock,
  },
  {
    term: "Thiên đàng",
    def: `Theo Kinh Thánh, nơi con người được ở với ${TERM_GOD_VN} trong sự bình an và niềm vui, không còn đau khổ hay nước mắt.`,
    icon: Cloud,
  },
  {
    term: "Địa ngục",
    def: `Theo Kinh Thánh, trạng thái tách khỏi ${TERM_GOD_VN} và những gì Ngài ban — không còn đầy đủ sự sống và mối quan hệ với Ngài.`,
    icon: Flame,
  },
  {
    term: "Hy vọng (trong Kinh Thánh)",
    def: `Không chỉ là cảm giác lạc quan, mà là tin cậy vào điều ${TERM_GOD_VN} đã làm — đặc biệt qua Chúa ${NAME_JESUS_VN} — để con người có thể được tha thứ và nhận sự sống đời đời.`,
    icon: Anchor,
  },
];

const COMPARISON = [
  {
    title: "Thiên đàng",
    description:
      "Nơi con người được ở với Đức Chúa Trời — không còn đau khổ, không còn nước mắt, chỉ còn sự bình an và niềm vui.",
    verses: "Giăng 14:2–3 · Khải Huyền 21:4",
  },
  {
    title: "Địa ngục",
    description:
      "Nơi con người sống tách khỏi Đức Chúa Trời — không còn sự sống và mối quan hệ mà Ngài ban.",
    verses: "2 Tê-sa-lô-ni-ca 1:9 · Khải Huyền 20:15",
  },
] as const;

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

export function VnWhatHappensAfterDeathPage({ books }: { books: BibleBook[] }) {
  const { bodyClassUp } = useBibleFontClasses();

  const twoDestinyItems = [
    {
      title: COMPARISON[0].title,
      description: COMPARISON[0].description,
      verses: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookIdByVi(books, "Khải Huyền", "Revelation")}
          chapter={21}
          verse={4}
          testament="nt"
          triggerClassName="text-second-600 hover:text-second-800 font-mono underline underline-offset-4 decoration-second-600 hover:decoration-second-800 transition-colors"
          previewText="Ngài sẽ lau ráo hết nước mắt khỏi mắt chúng; sẽ không có sự chết, cũng không có than khóc, kêu ca, hay là đau đớn nữa; vì những sự thứ nhứt đã qua rồi."
        >
          Khải Huyền 21:4
        </BibleVerseLink>
      ),
    },
    {
      title: COMPARISON[1].title,
      description: COMPARISON[1].description,
      verses: (
        <BibleVerseLink
          langSegment="vi"
          version1="vi"
          bookId={findBookIdByVi(books, "2 Tê-sa-lô-ni-ca", "2 Thessalonians")}
          chapter={1}
          verse={9}
          testament="nt"
          triggerClassName="text-second-600 hover:text-second-800 font-mono underline underline-offset-4 decoration-second-600 hover:decoration-second-800 transition-colors"
          previewText="Họ sẽ bị hình phạt hư mất đời đời, xa cách mặt Chúa và sự vinh hiển của quyền phép Ngài."
        >
          2 Tê-sa-lô-ni-ca 1:9
        </BibleVerseLink>
      ),
    },
  ] as const;

  return (
    <article
      className="font-vietnamese-flashcard text-foreground"
      aria-label="Cái chết không phải là hết – Thật không?"
    >
      <LearnWhatIsBibleIntro
        locale="vi"
        bodyBright
        moduleNum="03 / 05"
        title="Cái chết không phải là hết – Thật không?"
        intro={
          <>
            Cái chết có phải là kết thúc?{" "}
            <span className="font-semibold">Kinh Thánh</span> dạy rằng sau khi chết, con
            người sẽ đứng trước Đức Chúa Trời và bước vào đời sống đời đời. Bài đọc này
            giúp bạn hiểu điều <span className="font-semibold">Kinh Thánh </span> nói về
            đời sống sau khi chết, hai điểm đến đời đời, và hy vọng mà{" "}
            <span className="font-semibold">Chúa Giê-xu</span> mang lại.
          </>
        }
      />

      <RevealSection>
        <LearnHeroImage
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80"
          alt="Núi lúc bình minh — hình ảnh về điều chờ đợi phía trước"
          credit="Ảnh: Unsplash"
          creditHref="https://unsplash.com"
        />
      </RevealSection>

      <RevealSection>
        <LearnLibraryBlock
          locale="vi"
          title="Câu hỏi mà mọi nền văn hóa đều đặt ra"
          firstParagraph={
            <>
              Trong mọi nền văn hóa, con người đều từng đặt ra cùng một câu hỏi:{" "}
              <span className="font-semibold">sau khi chết sẽ ra sao?</span>
            </>
          }
          secondParagraph={
            <>
              Có người tin rằng chết là hết. Có người tin vào luân hồi hoặc một dạng tồn tại
              khác. Nhưng <span className="font-semibold">Kinh Thánh</span> nói rằng đời
              sống sau khi chết là có thật — và{" "}
              <span className="font-semibold">Đức Chúa Trời</span> đã bày tỏ điều đó cho con
              người.
            </>
          }
        />
      </RevealSection>

      <RevealSection>
        <LearnWhatHappensAfterDeathLifeContinues
          locale="vi"
          heading="Con Người Tiếp Tục Tồn Tại"
          lead={
            <>
              Khi con người chết, thân thể trở về đất, nhưng con người không biến mất hoàn
              toàn. Chúng ta vẫn tiếp tục tồn tại theo một cách khác — linh hồn, cái tôi có
              ý thức, vẫn sống tiếp.
            </>
          }
          quote={<>&ldquo;Hôm nay ngươi sẽ ở với Ta trong thiên đàng&rdquo;</>}
          reference={
            <BibleVerseLink
              langSegment="vi"
              version1="vi"
              bookId={findBookIdByVi(books, "Lu-ca", "Luke")}
              chapter={23}
              verse={43}
              testament="nt"
              linkOnly
              triggerClassName="text-second-600 hover:text-second-800 font-mono underline underline-offset-4 decoration-second-600 hover:decoration-second-800 transition-colors"
            >
              Lu-ca 23:43
            </BibleVerseLink>
          }
          explanation={
            <>
              Đây là lời Chúa Giê-xu nói với người trộm trên thập tự giá — chứng tỏ rằng{" "}
              <strong>ngay sau cái chết, con người gặp Chúa</strong>.
            </>
          }
        />
      </RevealSection>

      <RevealSection>
        <LearnWhatHappensAfterDeathAccountability
          locale="vi"
          heading="Mỗi Người Đều Sẽ Đứng Trước Đức Chúa Trời"
          quote={<>Con người phải chết một lần, rồi sau đó chịu phán xét</>}
          reference={
            <BibleVerseLink
              langSegment="vi"
              version1="vi"
              bookId={findBookIdByVi(books, "Hê-bơ-rơ", "Hebrews")}
              chapter={9}
              verse={27}
              testament="nt"
              linkOnly
              triggerClassName="text-second-600 hover:text-second-800 font-mono underline underline-offset-4 decoration-second-600 hover:decoration-second-800 transition-colors"
            >
              Hê-bơ-rơ 9:27
            </BibleVerseLink>
          }
          body1={
            <>
              <span className="mr-1 font-semibold">Kinh Thánh</span> nói rằng{" "}
              <span className="mx-1 font-semibold">Đức Chúa Trời</span> biết rõ về con người
              — không chỉ những gì chúng ta làm, mà cả những điều kín giấu trong lòng.
            </>
          }
          body2={
            <>
              Vì vậy, cuộc sống không phải là ngẫu nhiên. Những gì bạn chọn và cách bạn sống
              hôm nay đều có ý nghĩa và dẫn đến một kết quả đời đời.
            </>
          }
        />
      </RevealSection>

      <RevealSection>
        <LearnWhatHappensAfterDeathTwoDestinies
          locale="vi"
          heading="Hai điểm đến đời đời"
          intro={
            <>Kinh Thánh nói rằng sau khi chết, mỗi người sẽ đi về một trong hai nơi.</>
          }
          items={twoDestinyItems}
        />
      </RevealSection>

      <RevealSection>
        <LearnHopeBridge locale="vi">
          Những điều này nghe có vẻ nghiêm túc? Và đúng là như vậy. Nhưng{" "}
          <span className="font-semibold">Kinh Thánh</span> không dừng lại ở sự phán xét.
          Kinh Thánh nói về <span className="font-semibold">Hy Vọng</span>.
        </LearnHopeBridge>
      </RevealSection>

      <RevealSection>
        <LearnWhyItMatters locale="vi" title="Vì sao điều này quan trọng?">
          <p className={cn("mt-4 leading-relaxed", bodyClassUp)}>
            Kinh Thánh nói rằng <span className="font-semibold">Đức Chúa Trời</span> không
            muốn con người bị xa cách Ngài. Vì vậy, Ngài đã mở ra một hy vọng cho con người:
            chúng ta không bị bỏ lại trong sự đổ vỡ hay tuyệt vọng.
          </p>

          <p className={cn("mt-4 leading-relaxed", bodyClassUp)}>
            Đấng đó là <strong>Chúa Giê-xu</strong>. Qua Ngài, con người có thể được tha thứ
            và nhận sự sống đời đời.
          </p>

          <p className={cn("mt-4 leading-relaxed", bodyClassUp)}>
            Nếu điều này là thật, thì điều quan trọng là:{" "}
            <span className="font-semibold">Chúa Giê-xu</span> là ai, và{" "}
            <span className="font-semibold">Ngài</span> có ý nghĩa gì đối với bạn?
          </p>
        </LearnWhyItMatters>
      </RevealSection>

      <RevealSection>
        <LearnWhatIsBibleGlossaryGrid
          glossaryTitle="Từ vựng nhanh"
          items={VN_DEATH_GLOSSARY}
          locale="vi"
        />
      </RevealSection>
    </article>
  );
}
