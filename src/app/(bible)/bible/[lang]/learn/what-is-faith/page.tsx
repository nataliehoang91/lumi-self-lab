"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

const PRAYER_STEPS = [
  { letter: "A", stepKey: 0, descKey: 0 },
  { letter: "C", stepKey: 1, descKey: 1 },
  { letter: "T", stepKey: 2, descKey: 2 },
  { letter: "S", stepKey: 3, descKey: 3 },
] as const;

const EN = {
  moduleNum: "04 / 04",
  title: "What Is Faith?",
  intro:
    "Faith is not blind optimism or religious effort. In the Bible, faith means trusting God — specifically, trusting that what he says is true and that Jesus is who he claimed to be.",
  graceTitle: "Salvation by Grace",
  graceBody:
    "The Christian message is that salvation — being made right with God — is not earned by good behaviour. It is received as a gift, through trusting in what Jesus did.",
  graceQuote: "For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God.",
  graceRef: "Ephesians 2:8",
  repentanceTitle: "Repentance",
  repentanceBody:
    "Repentance means a genuine change of direction — turning from a self-directed life toward God. It is not about feeling guilty, but about choosing a different way. Jesus' first recorded words in Mark's Gospel are: \"Repent and believe the good news.\"",
  repentanceRef: "Mark 1:15",
  prayerTitle: "A Beginner's Prayer Guide",
  prayerIntro: "Prayer is simply talking to God. A simple structure used for centuries is ACTS:",
  prayerSteps: ["Adoration", "Confession", "Thanksgiving", "Supplication"],
  prayerDescs: [
    "Begin by acknowledging who God is — not what you want, just who he is. Praise him.",
    "Be honest about where you have fallen short. God already knows; this is for your freedom.",
    "Name specific things you are grateful for, however small.",
    "Bring your requests — for yourself, for others, for the world.",
  ],
  relationshipTitle: "A Relationship, Not a Religion",
  relationshipP1:
    "Christianity at its core is not a set of rules to follow but a person to know. Jesus said he came so that people \"may have life, and have it to the full\" (John 10:10). The goal is not perfect behaviour but an ongoing, honest relationship with God.",
  relationshipP2:
    "Reading Scripture, praying, and gathering with other believers are all ways of growing in that relationship — not conditions for earning it.",
  ctaTitle: "Ready to start a 7-day reading plan?",
  ctaBody: "Seven days, one chapter a day, starting with the Gospel of John.",
  ctaButton: "Start 7-Day Plan",
};

const VI = {
  moduleNum: "04 / 04",
  title: "Đức tin là gì?",
  intro:
    "Đức tin không phải là sự lạc quan mù quáng hay nỗ lực tôn giáo. Trong Kinh Thánh, đức tin có nghĩa là tin cậy Đức Chúa Trời — cụ thể là tin rằng những gì Ngài phán là thật và Chúa Jêsus đúng là Đấng Ngài xưng nhận.",
  graceTitle: "Sự Cứu Rỗi Bởi Ân Điển",
  graceBody:
    "Sứ điệp Cơ Đốc là sự cứu rỗi — được hòa giải với Đức Chúa Trời — không phải do việc lành đạt được, mà được nhận như một món quà, qua việc tin cậy những gì Chúa Jêsus đã làm.",
  graceQuote: "Ấy là nhờ ân điển, bởi đức tin, mà anh em được cứu, điều đó không phải đến từ anh em, bèn là sự ban cho của Đức Chúa Trời.",
  graceRef: "Ê-phê-sô 2:8",
  repentanceTitle: "Sự Ăn Năn",
  repentanceBody:
    "Ăn năn có nghĩa là thay đổi hướng đi thật sự — quay khỏi đời sống tự chủ hướng về Đức Chúa Trời. Không phải là cảm giác tội lỗi, mà là chọn một con đường khác. Lời đầu tiên của Chúa Jêsus được ghi lại trong Mác là: \"Hãy ăn năn và tin Tin Lành.\"",
  repentanceRef: "Mác 1:15",
  prayerTitle: "Hướng Dẫn Cầu Nguyện Cho Người Mới",
  prayerIntro: "Cầu nguyện đơn giản là trò chuyện với Đức Chúa Trời. Một cấu trúc đơn giản được dùng qua nhiều thế kỷ là ACTS:",
  prayerSteps: ["Tôn thờ (Adoration)", "Xưng tội (Confession)", "Tạ ơn (Thanksgiving)", "Cầu xin (Supplication)"],
  prayerDescs: [
    "Bắt đầu bằng việc nhìn biết Đức Chúa Trời là ai — không phải điều bạn muốn, mà chính Ngài là ai. Ca ngợi Ngài.",
    "Thành thật về những chỗ bạn đã vấp ngã. Đức Chúa Trời đã biết; đây là cho sự tự do của bạn.",
    "Kể ra những điều cụ thể bạn biết ơn, dù nhỏ đến đâu.",
    "Dâng lên những lời cầu xin — cho chính bạn, cho người khác, cho thế giới.",
  ],
  relationshipTitle: "Mối Quan Hệ, Không Phải Tôn Giáo",
  relationshipP1:
    "Cơ Đốc giáo cốt lõi không phải là một bộ quy tắc để tuân theo mà là một Đấng để biết. Chúa Jêsus phán Ngài đến để con người \"được sự sống, và sự sống dư dật\" (Giăng 10:10). Mục đích không phải là hành vi hoàn hảo mà là mối quan hệ chân thật, liên tục với Đức Chúa Trời.",
  relationshipP2:
    "Đọc Kinh Thánh, cầu nguyện và nhóm với anh em tin Chúa là những cách để lớn lên trong mối quan hệ ấy — không phải điều kiện để giành lấy nó.",
  ctaTitle: "Sẵn sàng bắt đầu kế hoạch đọc 7 ngày?",
  ctaBody: "Bảy ngày, mỗi ngày một chương, bắt đầu với Phúc Âm Giăng.",
  ctaButton: "Bắt đầu Kế Hoạch 7 Ngày",
};

type Lang = "en" | "vi";
const CONTENT: Record<Lang, typeof EN> = { en: EN, vi: VI };

export default function WhatIsFaithPage() {
  const params = useParams();
  const lang = (params?.lang as string)?.toLowerCase();
  if (lang !== "en" && lang !== "vi") notFound();

  const content = CONTENT[lang as Lang];
  const { fontSize } = useBibleApp();

  const bodyClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";
  const h1Class =
    fontSize === "small"
      ? "text-3xl md:text-4xl"
      : fontSize === "large"
        ? "text-5xl md:text-6xl"
        : "text-4xl md:text-5xl";

  return (
    <div>
      <div className="mb-12">
        <p className="text-xs font-mono text-second mb-3">{content.moduleNum}</p>
        <h1
          className={cn(
            "font-bible-english font-semibold text-foreground leading-tight text-balance",
            h1Class
          )}
        >
          {content.title}
        </h1>
        <p className={cn("mt-4 text-muted-foreground leading-relaxed", bodyClass)}>
          {content.intro}
        </p>
      </div>

      <section className="mb-10">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-3">
          {content.graceTitle}
        </h2>
        <p className={cn("text-muted-foreground leading-relaxed mb-3", bodyClass)}>
          {content.graceBody}
        </p>
        <blockquote className="border-l-2 border-border pl-4 py-2">
          <p className="font-bible-english text-base text-foreground italic leading-relaxed">
            &ldquo;{content.graceQuote}&rdquo;
          </p>
          <p className="text-xs text-muted-foreground mt-2 font-mono">{content.graceRef}</p>
        </blockquote>
      </section>

      <section className="mb-10 p-6 bg-card border border-sage-dark/20 rounded-2xl">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-3">
          {content.repentanceTitle}
        </h2>
        <p className={cn("text-muted-foreground leading-relaxed", bodyClass)}>
          {content.repentanceBody}
        </p>
        <p className="text-xs font-mono text-muted-foreground/60 mt-4">{content.repentanceRef}</p>
      </section>

      <section className="mb-10">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-2">
          {content.prayerTitle}
        </h2>
        <p className={cn("text-muted-foreground mb-5", bodyClass)}>{content.prayerIntro}</p>
        <div className="space-y-2">
          {PRAYER_STEPS.map((p) => (
            <div
              key={p.letter}
              className="flex gap-4 p-4 bg-card border border-sage-dark/20 rounded-xl"
            >
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 font-mono text-xs text-muted-foreground font-semibold">
                {p.letter}
              </div>
              <div>
                <p className={cn("font-medium text-foreground", bodyClass)}>
                  {content.prayerSteps[p.stepKey]}
                </p>
                <p className={cn("text-muted-foreground mt-0.5 leading-relaxed", bodyClass)}>
                  {content.prayerDescs[p.descKey]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 p-6 bg-foreground text-background rounded-2xl">
        <h2 className="font-bible-english text-xl font-semibold mb-3">
          {content.relationshipTitle}
        </h2>
        <p className={cn("leading-relaxed opacity-80 mb-4", bodyClass)}>
          {content.relationshipP1}
        </p>
        <p className={cn("leading-relaxed opacity-80", bodyClass)}>
          {content.relationshipP2}
        </p>
      </section>

      <section className="p-6 bg-card border border-sage-dark/20 rounded-2xl space-y-3 mb-8">
        <p className="font-semibold text-foreground">{content.ctaTitle}</p>
        <p className={cn("text-muted-foreground", bodyClass)}>{content.ctaBody}</p>
        <Link
          href="/bible/plans"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {content.ctaButton} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
