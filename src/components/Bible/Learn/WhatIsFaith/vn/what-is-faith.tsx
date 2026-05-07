"use client";

import Link from "next/link";
import { LearnWhatIsFaithIntro } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithIntro";
import { LearnWhatIsFaithGraceSection } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithGraceSection";
import { LearnWhatIsFaithRepentanceSection } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithRepentanceSection";
import { LearnWhatIsFaithPrayerSection } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithPrayerSection";
import { LearnWhatIsFaithRelationshipBlock } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithRelationshipBlock";
import { LearnWhyItMatters } from "../../WhatIsBible/shared-components/why-it-matters";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import {
  LearnWhatIsBibleGlossaryGrid,
  type GlossaryGridItem,
} from "../../WhatIsBible/shared-components/LearnWhatIsBibleGlossaryGrid";
import { RevealSection } from "../../shared-components/RevealSection";
import { LearnHeroImage } from "../../shared-components/LearnHeroImage";
import { NAME_JESUS_VN, TERM_GOD_VN } from "../../constants";
import type { BibleBook } from "@/components/Bible/Read/types";
import { Gift, Shield, RotateCcw, Sparkles, Users, MessageCircle } from "lucide-react";

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

const VN_GLOSSARY: readonly GlossaryGridItem[] = [
  {
    term: "Ân điển",
    def: `Sự ban cho không xứng đáng từ ${TERM_GOD_VN}. Trong đức tin Cơ Đốc, sự cứu rỗi không dựa trên công đức của con người, mà là món quà từ Ngài.`,
    icon: Gift,
  },
  {
    term: "Cứu rỗi",
    def: `Được giải cứu khỏi tội lỗi và được hòa giải với ${TERM_GOD_VN}, mở ra một mối quan hệ mới với Ngài.`,
    icon: Shield,
  },
  {
    term: "Ăn năn",
    def: `Sự thay đổi hướng đi thật sự — quay khỏi tội lỗi và trở về với ${TERM_GOD_VN}. Không chỉ là cảm giác hối lỗi, mà là một quyết định.`,
    icon: RotateCcw,
  },
  {
    term: "Tin Lành",
    def: `Tin tức tốt lành về sự cứu rỗi qua Chúa ${NAME_JESUS_VN} — rằng Ngài đã chết và sống lại để đem lại sự tha thứ và hy vọng.`,
    icon: Sparkles,
  },
  {
    term: "Hội Thánh",
    def: `Cộng đồng những người tin theo Chúa ${NAME_JESUS_VN}. Không chỉ là một tòa nhà, mà là một gia đình đức tin.`,
    icon: Users,
  },
  {
    term: "Cầu nguyện",
    def: `Sự trò chuyện với ${TERM_GOD_VN}. Không phải nghi thức phức tạp, mà là mối quan hệ.`,
    icon: MessageCircle,
  },
];

const VN_FLASHCARD_FONT = "font-vietnamese-flashcard";

export function VnWhatIsFaithPage({ books }: { books: BibleBook[] }) {
  const { bodyClassUp } = useBibleFontClasses();
  const vnBodyClass = cn(bodyClassUp, VN_FLASHCARD_FONT);
  const johnHref = buildReadHrefVi(findBookIdByVi(books, "Giăng", "John"), 10, 10, "nt");
  return (
    <article className="text-foreground" aria-label="Đức tin là gì?">
      <LearnWhatIsFaithIntro
        bodyBright
        locale="vi"
        moduleNum="05 / 05"
        title="Đức tin là gì?"
        intro="Đức tin không phải là sự lạc quan mù quáng hay cố gắng trở nên tốt hơn bằng nỗ lực riêng.

Trong Kinh Thánh, đức tin là đặt lòng tin nơi Đức Chúa Trời, tin rằng điều Ngài phán là thật, và Chúa Giê-xu chính là Đấng Ngài đã bày tỏ."
      />

      <RevealSection>
        <LearnHeroImage
          src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80"
          alt="Kinh Thánh mở ra trong ánh sáng ấm"
          credit="Ảnh: Unsplash"
          creditHref="https://unsplash.com"
        />
      </RevealSection>

      <RevealSection>
        <LearnWhatIsFaithRelationshipBlock
          locale="vi"
          title="Mối Quan Hệ, Không Phải Tôn Giáo"
          main={
            <>
              Cơ Đốc giáo không chỉ là một hệ thống luật lệ để tuân theo, mà là một mối quan
              hệ để bước vào. Chúa Giê-xu phán Ngài đến để con người &quot;được sự sống, và
              sự sống dư dật&quot;{" "}
              <Link
                href={johnHref}
                className="text-md text-second-600 hover:text-second-800 font-mono underline
                  underline-offset-4 transition-colors"
              >
                (Giăng 10:10)
              </Link>
              . Mục đích không phải là đạt đến sự hoàn hảo, mà là bước đi trong mối quan hệ
              thật với Đức Chúa Trời.
            </>
          }
          footer={
            <>
              Đọc Kinh Thánh, cầu nguyện và sinh hoạt cùng Hội Thánh là những cách để lớn
              lên trong mối quan hệ đó, đây không phải điều kiện để được chấp nhận.
            </>
          }
        />
      </RevealSection>

      <RevealSection>
        <LearnWhatIsFaithGraceSection
          bodyBright
          locale="vi"
          graceTitle="Sự Cứu Rỗi Bởi Ân Điển"
          graceBody="Sứ điệp trung tâm của Cơ Đốc giáo là sự cứu rỗi, được hòa giải với Đức Chúa Trời. Điều này không đạt được bởi việc lành, mà được nhận như một món quà, qua đức tin nơi điều Chúa Giê-xu đã làm."
          graceQuote="Ấy là nhờ ân điển, bởi đức tin, mà anh em được cứu, điều đó không phải đến từ anh em, bèn là sự ban cho của Đức Chúa Trời."
          graceRef="Ê-phê-sô 2:8"
          graceFootnoteHref={buildReadHrefVi(
            findBookIdByVi(books, "Ê-phê-sô", "Ephesians"),
            2,
            8,
            "nt"
          )}
        />
      </RevealSection>

      <RevealSection>
        <LearnWhatIsFaithRepentanceSection
          bodyBright
          locale="vi"
          repentanceTitle="Sự Ăn Năn"
          repentanceBody='Ăn năn không chỉ là cảm giác hối lỗi. Đó là sự thay đổi hướng đi — quay khỏi con đường tự mình làm chủ để trở về với Đức Chúa Trời. Khi bắt đầu chức vụ, Chúa Giê-xu phán: "Hãy ăn năn và tin Tin Lành."'
          repentanceRef="Mác 1:15"
          repentanceRefHref={buildReadHrefVi(
            findBookIdByVi(books, "Mác", "Mark"),
            1,
            15,
            "nt"
          )}
        />
      </RevealSection>

      <RevealSection>
        <LearnWhatIsFaithPrayerSection
          bodyBright
          locale="vi"
          prayerTitle="Đức tin bắt đầu từ đâu?"
          prayerIntro="Đức tin không bắt đầu bằng việc làm cho mình trở nên tốt hơn. Nó bắt đầu bằng sự tin cậy — tin rằng Đức Chúa Trời là thật và Chúa Giê-xu là Đấng Ngài bày tỏ."
          steps={[
            {
              letter: "1",
              stepName: "Nghe",
              desc: "Lắng nghe sứ điệp Tin Lành — điều Kinh Thánh nói về Đức Chúa Trời và con người.",
            },
            {
              letter: "2",
              stepName: "Tin",
              desc: "Đặt lòng tin nơi Chúa Giê-xu, không phải nơi nỗ lực của chính mình.",
            },
            {
              letter: "3",
              stepName: "Đọc",
              desc: "Bắt đầu đọc Kinh Thánh — đặc biệt là các sách Phúc Âm — để hiểu rõ hơn Chúa Giê-xu là ai.",
            },
            {
              letter: "4",
              stepName: "Bước theo",
              desc: "Sống với sự tin cậy ấy mỗi ngày, dù còn nhiều điều chưa hiểu hết.",
            },
          ]}
        />
      </RevealSection>

      <RevealSection>
        <LearnWhyItMatters locale="vi" title="Vì sao đức tin quan trọng?">
          <div className="space-y-4">
            <p className={cn("leading-relaxed", vnBodyClass)}>
              Mỗi người đều đang tin vào điều gì đó, về giá trị của mình, về điều đem lại hy
              vọng, và về điều giúp mình đứng vững khi mọi thứ rung chuyển. Câu hỏi không
              phải là bạn có đức tin hay không, mà là bạn đang đặt đức tin nơi đâu.
            </p>

            <p className={cn("leading-relaxed", vnBodyClass)}>
              Nếu đức tin chỉ là suy nghĩ tích cực, nó sẽ dễ dàng sụp đổ khi hoàn cảnh thay
              đổi. Nhưng nếu{" "}
              <span className="font-semibold">đức tin đặt nơi Chúa Giê-xu</span> Đấng đã
              sống lại và không thay đổi, thì nó trở thành một{" "}
              <span className="font-semibold">nền tảng vững chắc</span> giữa những lo âu và
              bất định.
            </p>

            <p className={cn("leading-relaxed", vnBodyClass)}>
              <span className="font-semibold">Kinh Thánh</span> nói rằng qua Ngài, con người
              có thể được tha thứ, có một đời sống mới có ý nghĩa, và một hy vọng vượt qua
              cả cái chết — đó là <span className="font-semibold">sự sống đời đời </span>
              sau khi chết
            </p>
            <p className={cn("leading-relaxed", vnBodyClass)}>
              Đức tin không chỉ là biết về Chúa, mà là{" "}
              <span className="font-semibold">tin cậy Ngài</span>, bước theo Ngài, và để
              Ngài dẫn dắt cuộc đời bạn.
            </p>

            <p className={cn("pt-1 leading-relaxed font-semibold", vnBodyClass)}>
              Vậy bạn đang đặt đức tin của mình vào điều gì?
              <br />
              Và bạn có sẵn sàng bắt đầu tin vào Chúa Giê-xu không?
            </p>
          </div>
        </LearnWhyItMatters>
      </RevealSection>

      <RevealSection>
        <LearnWhatIsBibleGlossaryGrid
          glossaryTitle="Từ vựng nhanh"
          items={VN_GLOSSARY}
          locale="vi"
        />
      </RevealSection>
    </article>
  );
}
