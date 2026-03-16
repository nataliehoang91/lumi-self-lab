"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LearnLessonIntro } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnLessonIntro";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";

const COMPARISON = [
  {
    title: "Thiên đàng",
    description:
      "Nơi con người sống trong sự hiện diện của Đức Chúa Trời — đầy bình an, niềm vui và không còn đau khổ.",
    verses: "Giăng 14:2–3 · Khải Huyền 21:4",
  },
  {
    title: "Địa ngục",
    description:
      "Sự xa cách khỏi Đức Chúa Trời — kết quả của việc từ chối Ngài và sự sống mà Ngài ban.",
    verses: "Ma-thi-ơ 8:12 · Khải Huyền 20:15",
  },
] as const;

export function VnWhatHappensAfterDeathPage() {
  const { bodyClass, bodyClassUp } = useBibleFontClasses();

  return (
    <article
      className="font-vietnamese-flashcard text-foreground"
      aria-label="Cái chết không phải là hết – Thật không?"
    >
      <LearnLessonIntro
        locale="vi"
        bodyBright
        moduleNum="04 / 05"
        title="Sau khi chết sẽ ra sao?"
        intro1="Cái chết không phải là kết thúc. Kinh Thánh dạy rằng sau khi chết, con người sẽ đứng trước Đức Chúa Trời và bước vào đời sống đời đời."
        intro1Quote="Con người phải chết một lần, rồi sau đó chịu phán xét."
      >
        <>
          Bài học này giúp bạn hiểu điều Kinh Thánh nói về đời sống sau khi chết, hai điểm
          đến đời đời, và hy vọng mà Chúa Giê-xu mang lại.
        </>
      </LearnLessonIntro>

      {/* Câu hỏi mà mọi nền văn hóa đều đặt ra */}
      <section className="mb-10">
        <p className={cn("text-muted-foreground mb-4 leading-relaxed", bodyClassUp)}>
          Trong mọi nền văn hóa, con người đều đặt ra cùng một câu hỏi:
          <strong> sau khi chết sẽ ra sao?</strong>
        </p>

        <p className={cn("text-muted-foreground leading-relaxed", bodyClassUp)}>
          Có người tin rằng chết là hết, có người tin vào luân hồi hoặc một dạng tồn tại
          khác. Nhưng Kinh Thánh nói rằng đời sống sau khi chết là có thật, và Đức Chúa
          Trời bày tỏ điều đó cho chúng ta.
        </p>
      </section>

      {/* Life Continues */}
      <section className="mb-10">
        <h2
          className="font-vietnamese-flashcard text-foreground mb-4 text-2xl
            font-semibold"
        >
          Cái chết không phải là kết thúc
        </h2>
        <p className={cn("text-muted-foreground mb-4 leading-relaxed", bodyClassUp)}>
          Kinh Thánh dạy rằng sau khi chết, con người không biến mất hoàn toàn. Thân thể
          chúng ta trở về đất, nhưng linh hồn vẫn tiếp tục tồn tại.
        </p>
        <p className={cn("text-muted-foreground leading-relaxed", bodyClassUp)}>
          Khi Chúa Giê-xu chịu đóng đinh, Ngài nói với người trộm bên cạnh: &ldquo;Hôm nay
          ngươi sẽ ở với Ta trong thiên đàng&rdquo; (Lu-ca 23:43). Điều đó cho thấy rằng
          sau khi chết, con người vẫn tiếp tục sống theo một cách khác — trong sự hiện
          diện của Đức Chúa Trời.
        </p>
      </section>

      {/* Accountability */}
      <section className="border-border bg-card mb-10 rounded-2xl border p-6">
        <h2
          className="font-vietnamese-flashcard text-foreground mb-3 text-xl font-semibold"
        >
          Mỗi người đều sẽ đứng trước Đức Chúa Trời
        </h2>
        <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClassUp)}>
          &ldquo;Con người phải chết một lần, rồi sau đó chịu phán xét&rdquo; (Hê-bơ-rơ
          9:27).
        </p>
        <p className={cn("text-muted-foreground leading-relaxed", bodyClassUp)}>
          Kinh Thánh nói rằng một ngày nào đó, mỗi người sẽ đứng trước Đức Chúa Trời. Điều
          này cho thấy cuộc sống của chúng ta có ý nghĩa — những gì chúng ta làm, cách
          chúng ta sống, đều quan trọng trước mặt Ngài.
        </p>
      </section>

      {/* Two Destinies */}
      <section className="mb-10">
        <h2
          className="font-vietnamese-flashcard text-foreground mb-5 text-xl font-semibold"
        >
          Hai điểm đến đời đời
        </h2>
        <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClassUp)}>
          Kinh Thánh nói rằng sau khi chết, con người sẽ bước vào một trong hai thực tại
          đời đời.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {COMPARISON.map((item) => (
            <div
              key={item.title}
              className="border-border bg-card rounded-2xl border p-5"
            >
              <p className="text-foreground mb-2 font-semibold">{item.title}</p>
              <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClass)}>
                {item.description}
              </p>
              <p className="text-muted-foreground/60 font-mono text-xs">{item.verses}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The Hope */}
      <section className="border-primary/30 bg-primary/10 mb-10 rounded-2xl border p-6">
        <h2
          className="font-vietnamese-flashcard text-foreground mb-3 text-xl font-semibold"
        >
          Hy vọng mà Kinh Thánh mang lại
        </h2>
        <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClassUp)}>
          Thông điệp của Kinh Thánh không nhằm làm con người sợ hãi. Trái lại, nó mang đến
          hy vọng.
        </p>
        <p className={cn("text-muted-foreground mb-3 leading-relaxed", bodyClassUp)}>
          Chúa Giê-xu đã chết trên thập tự giá và sống lại. Qua Ngài, con người có thể
          được tha thứ và được nối lại mối quan hệ với Đức Chúa Trời.
        </p>
        <p className={cn("text-muted-foreground leading-relaxed", bodyClassUp)}>
          Vì vậy đối với những ai tin cậy Chúa Giê-xu, cái chết không còn là dấu chấm hết
          — mà là cánh cửa bước vào đời sống đời đời với Đức Chúa Trời.
        </p>
      </section>

      {/* Call to action */}
      <section className="bg-foreground text-background mb-10 rounded-2xl p-6">
        <h2 className="font-vietnamese-flashcard mb-3 text-xl font-semibold">
          Còn bạn thì sao?
        </h2>
        <p className="mb-3 text-sm leading-relaxed opacity-90">
          Câu hỏi về đời sống sau khi chết không chỉ là ý tưởng triết học. Nó liên quan
          đến tương lai đời đời của mỗi người.
        </p>
        <p className="mb-5 text-sm leading-relaxed opacity-90">
          Kinh Thánh nói rằng hy vọng thật sự được tìm thấy nơi Chúa Giê-xu — Đấng đem con
          người trở lại với Đức Chúa Trời và ban cho sự sống đời đời.
        </p>
        <Link
          href="/bible/vi/learn/what-is-faith"
          className="inline-flex items-center gap-2 text-sm font-medium opacity-90
            transition-opacity hover:opacity-100"
        >
          Tiếp theo: Đức tin là gì? <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </article>
  );
}
