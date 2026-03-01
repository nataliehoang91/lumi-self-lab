"use client";

import { LearnPageIntro } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageIntro";
import { LearnPageModuleCard } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageModuleCard";
import { LearnPageVerseCta } from "@/components/Bible/Learn/LearnPage/shared-components/LearnPageVerseCta";

const SEGMENTS = ["bible-structure", "bible-origin", "who-is-jesus", "what-is-faith"] as const;

const MODULES = [
  {
    num: "01",
    title: "Kinh thánh là gì?",
    desc: "Kinh Thánh không chỉ là một tập hợp sách cổ. Đây là một câu chuyện thống nhất về sự sáng tạo, sự sa ngã và kế hoạch cứu chuộc xuyên suốt lịch sử.",
    min: 5,
  },
  {
    num: "02",
    title: "Nguồn gốc & Chính điển Kinh thánh",
    desc: "Kinh Thánh được viết và lưu truyền qua hàng ngàn năm. Làm sao chúng ta biết nội dung ngày nay phản ánh trung thực bản gốc?",
    min: 8,
  },
  {
    num: "03",
    title: "Chúa Giê-xu là ai?",
    desc: (
      <>
        Chúa Giê-xu là nhân vật trung tâm của Kinh Thánh. Ngài tuyên bố điều gì về chính mình — và
        tại sao cái chết và sự sống lại của Ngài được xem là bước ngoặt của lịch sử?
      </>
    ),
    min: 6,
  },
  {
    num: "04",
    title: "Đức tin là gì?",
    desc: (
      <>
        Đức tin không chỉ là tin một ý tưởng. Vậy tin cậy Đức Chúa Trời nghĩa là gì — và điều đó ảnh
        hưởng thế nào đến cách bạn sống mỗi ngày?
      </>
    ),
    min: 5,
  },
] as const;

export function VnLearnPage() {
  return (
    <article aria-label="Học - Bắt đầu tại đây">
      <LearnPageIntro
        eyebrow="Bắt đầu tại đây"
        title="Bắt đầu từ nền tảng."
        subtitle={
          <>
            Trước khi đọc từng câu Kinh Thánh, hãy hiểu bức tranh lớn — Kinh Thánh kể câu chuyện gì,{" "}
            <strong>Chúa Giê-xu</strong> là ai, và đức tin thực sự thay đổi điều gì trong cuộc sống.
          </>
        }
      />

      <p className="text-sm opacity-70 mb-4">
        Bạn có thể đọc theo thứ tự, hoặc bắt đầu từ câu hỏi bạn quan tâm nhất.
      </p>

      <div className="space-y-3">
        {MODULES.map((m, i) => (
          <LearnPageModuleCard
            key={m.num}
            num={m.num}
            title={m.title}
            desc={m.desc}
            min={m.min}
            minLabel="phút đọc"
            readLabel="Đọc"
            href={`/bible/vi/learn/${SEGMENTS[i]}`}
            ariaLabel={`${m.title}, ${m.min} phút đọc`}
          />
        ))}
      </div>

      <LearnPageVerseCta
        verseText="Lời Chúa là ngọn đèn cho chân tôi, Ánh sáng cho đường lối tôi."
        verseRef="THI THIÊN 119:105"
        ctaTitle="Bạn đã có nền tảng?"
        ctaSubtitle="Đừng chỉ học về Kinh Thánh — hãy tự mình khám phá."
        ctaLabel="Mở Kinh thánh"
        readHref="/bible/vi/read"
      />
    </article>
  );
}
