"use client";

import { LearnPageIntro } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageIntro";
import { LearnPageModuleCard } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageModuleCard";
import { LearnPageVerseCta } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageVerseCta";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

const SEGMENTS = [
  "what-is-bible",
  "bible-origin",
  "what-happens-after-death",
  "who-is-jesus",
  "what-is-faith",
] as const;

const MODULES = [
  {
    num: "01",
    title: "Kinh thánh là gì?",
    desc: "Kinh Thánh không chỉ là một tập hợp sách cổ về tôn giáo. Mà là kể câu chuyện về Đức Chúa Trời, con người và ý nghĩa của cuộc sống.",
    min: 5,
  },
  {
    num: "02",
    title: "Kinh Thánh đến với chúng ta như thế nào?",
    desc: "Kinh Thánh được viết cách đây hàng ngàn năm. Làm sao chúng ta biết nội dung ngày nay vẫn đúng với bản gốc và đáng tin cậy?",
    min: 8,
  },

  {
    num: "03",
    title: "Cái chết không phải là hết – Thật không?",
    desc: "Sau khi con người chết, điều gì sẽ xảy ra? Kinh Thánh nói gì về điều chờ đợi chúng ta phía sau cái chết?",
    min: 5,
  },
  {
    num: "04",
    title: "Chúa Giê-xu là ai?",
    desc: (
      <>
        Chúa Giê-xu là nhân vật trung tâm của Kinh Thánh. Ngài là ai, Ngài đã làm gì, và
        tại sao cái chết cùng sự sống lại của Ngài lại quan trọng?
      </>
    ),
    min: 6,
  },
  {
    num: "05",
    title: "Đức tin là gì?",
    desc: (
      <>
        Đức tin là gì? Tin Chúa có phải chỉ là theo một tôn giáo, hay là điều gì sâu xa
        hơn?
      </>
    ),
    min: 5,
  },
] as const;

export function VnLearnPage({ verseHref }: { verseHref: string }) {
  const { bodyClass, bodyTitleClassUp } = useBibleFontClasses();

  return (
    <article aria-label="Học - Bắt đầu tại đây">
      <LearnPageIntro
        locale="vi"
        eyebrow="Bắt đầu tại đây"
        title="Bạn có bao giờ tự hỏi…"
        subtitle={
          <>
            <span className="font-semibold">Kinh Thánh</span> là gì?{" "}
            <span className="font-semibold">Chúa Giê-xu</span> là ai? Liệu có thiên đàng
            và địa ngục thật không? Những phần đọc ngắn dưới đây giúp bạn khám phá câu trả
            lời mà Kinh Thánh đưa ra.
          </>
        }
      />

      <p className={cn("font-vietnamese-flashcard mb-4 text-sm", bodyTitleClassUp)}>
        Bạn có thể đọc theo thứ tự, hoặc bắt đầu từ câu hỏi bạn quan tâm nhất.
      </p>

      <div className="space-y-4">
        {MODULES.map((m, i) => (
          <LearnPageModuleCard
            key={m.num}
            locale="vi"
            num={m.num}
            title={m.title}
            desc={m.desc}
            min={m.min}
            minLabel="phút đọc"
            readLabel="Đọc"
            href={`/bible/vi/learn/${SEGMENTS[i]}`}
            ariaLabel={`${m.title}, ${m.min} phút đọc`}
            segmentKey={SEGMENTS[i]}
          />
        ))}
      </div>

      <LearnPageVerseCta
        locale="vi"
        verseText="Lời Chúa là ngọn đèn cho chân tôi, Ánh sáng cho đường lối tôi."
        verseRef="THI THIÊN 119:105"
        ctaTitle="Bạn đã có nền tảng?"
        ctaSubtitle="Đừng chỉ học về Kinh Thánh — hãy tự mình khám phá."
        ctaLabel="Mở Kinh thánh"
        readHref="/bible/vi/read"
        verseHref={verseHref}
      />
    </article>
  );
}
