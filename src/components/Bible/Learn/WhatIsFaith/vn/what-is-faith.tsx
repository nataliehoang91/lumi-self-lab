"use client";

import { LearnWhatIsFaithIntro } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithIntro";
import { LearnWhatIsFaithGraceSection } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithGraceSection";
import { LearnWhatIsFaithRepentanceSection } from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithRepentanceSection";
import {
  LearnWhatIsFaithPrayerSection,
  type PrayerStep,
} from "@/components/Bible/Learn/WhatIsFaith/shared-components/LearnWhatIsFaithPrayerSection";
import { LearnWhyItMatters } from "../../WhatIsBible/shared-components/why-it-matters";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import {
  type GlossaryItem,
  LearnWhatIsFaithGlossary,
} from "../shared-components/LearnWhatIsFaithGlossary";
import { NAME_JESUS_VN, TERM_GOD_VN } from "../../constants";

const PRAYER_STEPS_VN: readonly PrayerStep[] = [
  {
    letter: "A",
    stepName: "Tôn thờ (Adoration)",
    desc: "Bắt đầu bằng việc nhìn biết Đức Chúa Trời là ai — không phải điều bạn muốn, mà chính Ngài là ai. Ca ngợi Ngài.",
  },
  {
    letter: "C",
    stepName: "Xưng tội (Confession)",
    desc: "Thành thật về những chỗ bạn đã vấp ngã. Đức Chúa Trời đã biết; đây là cho sự tự do của bạn.",
  },
  {
    letter: "T",
    stepName: "Tạ ơn (Thanksgiving)",
    desc: "Kể ra những điều cụ thể bạn biết ơn, dù nhỏ đến đâu.",
  },
  {
    letter: "S",
    stepName: "Cầu xin (Supplication)",
    desc: "Dâng lên những lời cầu xin — cho chính bạn, cho người khác, cho thế giới.",
  },
];

const VN_GLOSSARY: readonly GlossaryItem[] = [
  {
    term: "Ân điển",
    def: `Sự ban cho không xứng đáng từ ${TERM_GOD_VN}. Trong đức tin Cơ Đốc, sự cứu rỗi không dựa trên công đức của con người, mà là món quà từ Ngài.`,
  },
  {
    term: "Cứu rỗi",
    def: `Được giải cứu khỏi tội lỗi và được hòa giải với ${TERM_GOD_VN}, mở ra một mối quan hệ mới với Ngài.`,
  },
  {
    term: "Ăn năn",
    def: `Sự thay đổi hướng đi thật sự — quay khỏi tội lỗi và trở về với ${TERM_GOD_VN}. Không chỉ là cảm giác hối lỗi, mà là một quyết định.`,
  },
  {
    term: "Tin Lành",
    def: `Tin tức tốt lành về sự cứu rỗi qua Chúa ${NAME_JESUS_VN} — rằng Ngài đã chết và sống lại để đem lại sự tha thứ và hy vọng.`,
  },
  {
    term: "Hội Thánh",
    def: `Cộng đồng những người tin theo Chúa ${NAME_JESUS_VN}. Không chỉ là một tòa nhà, mà là một gia đình đức tin.`,
  },
  {
    term: "Cầu nguyện",
    def: `Sự trò chuyện với ${TERM_GOD_VN}. Không phải nghi thức phức tạp, mà là mối quan hệ.`,
  },
];

export function VnWhatIsFaithPage() {
  const { bodyClass, bodyTitleClass } = useBibleFontClasses();
  return (
    <div>
      <LearnWhatIsFaithIntro
        moduleNum="04 / 04"
        title="Đức tin là gì?"
        intro="Đức tin không phải là sự lạc quan mù quáng hay một nỗ lực tôn giáo để trở nên tốt hơn. Trong Kinh Thánh, đức tin là sự tin cậy đặt nơi Đức Chúa Trời — tin rằng điều Ngài phán là thật và Chúa Giê-xu đúng là Đấng Ngài bày tỏ."
      />

      <blockquote
        className="bg-primary-light/5 border-l-primary mb-12 space-y-4 rounded-r-xl
          border-l-4 py-6 pr-6 pl-6 not-italic"
      >
        <p className={cn("font-vietnamese leading-snug font-semibold", bodyTitleClass)}>
          Mối Quan Hệ, Không Phải Tôn Giáo
        </p>
        <p className={cn("leading-relaxed opacity-90", bodyClass)}>
          Cơ Đốc giáo không chỉ là một hệ thống luật lệ để tuân theo, mà là một mối quan
          hệ để bước vào. Chúa Giê-xu phán Ngài đến để con người &quot;được sự sống, và sự
          sống dư dật&quot; (Giăng 10:10). Mục đích không phải là đạt đến sự hoàn hảo, mà
          là bước đi trong mối quan hệ thật với Đức Chúa Trời.
        </p>
        <p className={cn("border-border border-t pt-4 leading-relaxed opacity-80", bodyClass)}>
          Đọc Kinh Thánh, cầu nguyện và sinh hoạt cùng Hội Thánh là những cách để lớn lên
          trong mối quan hệ đó — không phải điều kiện để được chấp nhận.
        </p>
      </blockquote>

      <LearnWhatIsFaithGraceSection
        graceTitle="Sự Cứu Rỗi Bởi Ân Điển"
        graceBody="Sứ điệp trung tâm của Cơ Đốc giáo là sự cứu rỗi — được hòa giải với Đức Chúa Trời. Điều này không đạt được bởi việc lành, mà được nhận như một món quà, qua đức tin nơi điều Chúa Giê-xu đã làm."
        graceQuote="Ấy là nhờ ân điển, bởi đức tin, mà anh em được cứu, điều đó không phải đến từ anh em, bèn là sự ban cho của Đức Chúa Trời."
        graceRef="Ê-phê-sô 2:8"
      />

      <LearnWhatIsFaithRepentanceSection
        repentanceTitle="Sự Ăn Năn"
        repentanceBody='Ăn năn không chỉ là cảm giác hối lỗi. Đó là sự thay đổi hướng đi — quay khỏi con đường tự mình làm chủ để trở về với Đức Chúa Trời. Khi bắt đầu chức vụ, Chúa Giê-xu phán: "Hãy ăn năn và tin Tin Lành."'
        repentanceRef="Mác 1:15"
      />

      <LearnWhatIsFaithPrayerSection
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

      <LearnWhyItMatters title="Vì sao đức tin quan trọng?">
        <p className={cn("leading-relaxed", bodyClass)}>
          Mỗi người đều đang tin điều gì đó — về giá trị của mình, về điều gì đem lại hy
          vọng, về điều gì có thể giữ mình đứng vững khi mọi thứ rung chuyển. Câu hỏi
          không phải là bạn có đức tin hay không, mà là bạn đang đặt đức tin nơi đâu.
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClass)}>
          Nếu đức tin chỉ là suy nghĩ tích cực, nó sẽ sụp đổ khi hoàn cảnh thay đổi. Nhưng
          nếu đức tin đặt nơi Đức Chúa Trời — Đấng không thay đổi — thì nó trở thành một
          nền tảng vững chắc giữa những lo âu, thất bại và những ngày không chắc chắn.
        </p>

        <p className={cn("mt-4 leading-relaxed", bodyClass)}>
          Đức tin Cơ Đốc không chỉ trả lời câu hỏi “Tôi phải làm gì?” mà còn trả lời “Tôi
          là ai?” và “Tôi thuộc về ai?”. Vì thế, nó không chỉ thay đổi hành vi — mà thay
          đổi cả nền tảng bạn đang sống trên đó.
        </p>
      </LearnWhyItMatters>
      <LearnWhatIsFaithGlossary glossaryTitle="Từ vựng nhanh" glossary={VN_GLOSSARY} />
    </div>
  );
}
