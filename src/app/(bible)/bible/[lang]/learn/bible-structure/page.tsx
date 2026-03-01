"use client";

import { useParams } from "next/navigation";
import { LearnAccordion } from "@/components/Bible/Learn/LearnAccordion";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

const OT_SECTIONS = [
  { nameKey: 0, descKey: 0, books: 5 },
  { nameKey: 1, descKey: 1, books: 12 },
  { nameKey: 2, descKey: 2, books: 5 },
  { nameKey: 3, descKey: 3, books: 17 },
] as const;

const NT_SECTIONS = [
  { nameKey: 0, descKey: 0, books: 4 },
  { nameKey: 1, descKey: 1, books: 1 },
  { nameKey: 2, descKey: 2, books: 21 },
  { nameKey: 3, descKey: 3, books: 1 },
] as const;

const STATS = [
  { v: "66", labelKey: 0 },
  { v: "39", labelKey: 1 },
  { v: "27", labelKey: 2 },
  { v: "~40", labelKey: 3 },
] as const;

const EN = {
  moduleNum: "01 / 04",
  title: "What Is the Bible?",
  introParts: [
    "The Bible is not just a single book — it is a collection of ",
    "66 writings",
    " shaped across ",
    "1,500 years",
    " by around ",
    "40 different authors",
    ". Yet through all its diversity, it tells one unified story: God's relentless pursuit to redeem humanity through Jesus Christ.",
  ] as const,
  statLabels: ["Books total", "Old Testament", "New Testament", "Authors"],
  otTitle: "Old Testament",
  otIntro:
    "It tells the story of creation, human rebellion, and God's unfolding promise — working through Israel to prepare the way for a coming Saviour.",
  otSections: {
    name: ["Law", "History", "Poetry & Wisdom", "Prophets"],
    desc: [
      "Genesis through Deuteronomy — creation, the fall, and God's covenant with Israel.",
      "Joshua through Esther — Israel's story in the Promised Land, kings, exile, and return.",
      "Job through Song of Solomon — reflection on suffering, praise, wisdom, and love.",
      "Isaiah through Malachi — God's messengers calling Israel back, pointing forward to Christ.",
    ],
  },
  ntTitle: "New Testament",
  ntIntro:
    "It begins with the life of Jesus, follows the birth of the early church, and closes with a vision of how history ultimately finds its fulfillment in Christ.",
  ntSections: {
    name: ["Gospels", "History", "Letters", "Prophecy"],
    desc: [
      "Matthew, Mark, Luke, John — four accounts of Jesus's life, ministry, death, and resurrection.",
      "Acts — the story of the early church spreading from Jerusalem to the ends of the earth.",
      "Romans through Jude — Paul and others writing to churches and individuals about faith and life.",
      "Revelation — a vision of the end of history and the victory of Christ.",
    ],
  },
  centralTitle: "Central Theme",
  centralBody:
    "Though written across centuries by many voices, the Bible tells one grand story: God creates a good world. Humanity turns away. God begins a patient rescue plan through Israel. That plan reaches its climax in Jesus Christ — whose death and resurrection open the way for restoration and renewed life with God.",
  glossaryTitle: "Quick Glossary",
  glossary: [
    { term: "Covenant", def: "A sacred agreement or promise between God and his people, central to both Old and New Testaments." },
    { term: "Gospel", def: "Literally \"good news\" — referring to the message of Jesus Christ's life, death, and resurrection." },
    { term: "Prophet", def: "A person called by God to speak his message to the people, often calling people back to faithfulness and, at times, revealing what God would do in the future." },
    { term: "Grace", def: "God's unmerited favour — his love and mercy given freely, not earned by human effort." },
  ],
};

const VI = {
  moduleNum: "01 / 04",
  title: "Kinh thánh là gì?",
  introParts: [
    "Kinh Thánh không chỉ là một quyển sách — đó là một tuyển tập gồm ",
    "66 sách",
    " được viết trong suốt khoảng ",
    "1.500 năm",
    " bởi gần ",
    "40 tác giả khác nhau",
    ". Dù được hình thành qua nhiều thế kỷ và bối cảnh khác nhau, toàn bộ Kinh Thánh cùng kể một câu chuyện duy nhất: kế hoạch cứu chuộc của Đức Chúa Trời dành cho nhân loại, được hoàn tất trong Đức Chúa Jêsus Christ.",
  ] as const,
  statLabels: ["Sách tổng cộng", "Cựu Ước", "Tân Ước", "Tác giả"],
  otTitle: "Cựu Ước",
  otIntro:
    "Được viết chủ yếu bằng tiếng Hê-bơ-rơ (và một phần tiếng A-ram), Cựu Ước ghi lại từ sự sáng tạo vũ trụ cho đến thời kỳ ngay trước khi Chúa Jêsus giáng sinh. Đây là câu chuyện về Đức Chúa Trời, về dân Y-sơ-ra-ên, và về lời hứa lâu dài về một Đấng Cứu Thế sẽ đến.",
  otSections: {
    name: ["Luật pháp", "Lịch sử", "Thi ca & Khôn ngoan", "Tiên tri"],
    desc: [
      "Sáng thế ký đến Phục truyền — sáng thế, sự sa ngã và giao ước của Đức Chúa Trời với Y-sơ-ra-ên.",
      "Giô-sué đến Ê-xơ-tê — câu chuyện Y-sơ-ra-ên trong Đất Hứa, các vua, lưu đày và trở về.",
      "Gióp đến Nhã Ca — suy ngẫm về đau khổ, ca ngợi, khôn ngoan và tình yêu.",
      "Ê-sai đến Ma-la-chi — sứ giả của Đức Chúa Trời kêu gọi Y-sơ-ra-ên trở lại, chỉ về Đấng Christ.",
    ],
  },
  ntTitle: "Tân Ước",
  ntIntro:
    "Được viết bằng tiếng Hy Lạp, Tân Ước mở đầu bằng bốn sách Phúc Âm kể về cuộc đời, chức vụ, sự chết và sự sống lại của Chúa Jêsus. Sau đó là câu chuyện về Hội Thánh đầu tiên lan rộng ra khắp thế giới, và kết thúc bằng khải tượng về sự hoàn tất của lịch sử trong Đấng Christ.",
  ntSections: {
    name: ["Phúc âm", "Lịch sử", "Thư tín", "Khải tượng"],
    desc: [
      "Ma-thi-ơ, Mác, Lu-ca, Giăng — bốn tường thuật về cuộc đời, chức vụ, sự chết và sống lại của Chúa Jêsus.",
      "Công vụ — câu chuyện Hội thánh đầu tiên lan ra từ Giê-ru-sa-lem đến tận cùng trái đất.",
      "Rô-ma đến Giu-đe — Phao-lô và những người khác viết cho các Hội thánh và cá nhân về đức tin và đời sống.",
      "Khải huyền — khải tượng về sự kết thúc lịch sử và sự chiến thắng của Đấng Christ.",
    ],
  },
  centralTitle: "Chủ đề trung tâm",
  centralBody:
    "Dù được viết bởi nhiều con người khác nhau qua nhiều thế kỷ, Kinh Thánh chỉ kể một đại câu chuyện: Đức Chúa Trời tạo dựng một thế giới tốt lành. Con người chọn sự phản nghịch. Đức Chúa Trời bắt đầu một kế hoạch giải cứu lâu dài qua dân Y-sơ-ra-ên. Kế hoạch đó đạt đến đỉnh điểm trong Đức Chúa Jêsus Christ — Đấng đã chết và sống lại, mở ra con đường để con người được hòa giải và phục hồi mối tương giao với Đức Chúa Trời.",
  glossaryTitle: "Từ vựng nhanh",
  glossary: [
    { term: "Giao ước", def: "Một sự cam kết thiêng liêng giữa Đức Chúa Trời và con người. Giao ước là nền tảng xuyên suốt cả Cựu Ước lẫn Tân Ước." },
    { term: "Phúc âm", def: "Nghĩa là \"Tin Lành\" hay \"tin vui\" — nói về cuộc đời, sự chết và sự sống lại của Chúa Jêsus vì nhân loại." },
    { term: "Tiên tri", def: "Người được Đức Chúa Trời kêu gọi để truyền đạt sứ điệp của Ngài, kêu gọi dân sự ăn năn và sống trung tín." },
    { term: "Ân điển", def: "Tình yêu và lòng thương xót mà Đức Chúa Trời ban cho con người cách nhưng không — không phải do công trạng, mà bởi lòng nhân từ của Ngài." },
  ],
};

type Lang = "en" | "vi";
const CONTENT: Record<Lang, typeof EN> = { en: EN, vi: VI };

export default function BibleStructureLangPage() {
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
        <p className="text-sm font-mono text-second mb-3">{content.moduleNum}</p>
        <h1
          className={cn(
            "font-bible-english font-semibold text-foreground leading-tight text-balance",
            h1Class
          )}
        >
          {content.title}
        </h1>
        <p className={cn("mt-4 text-muted-foreground leading-relaxed", bodyClass)}>
          {content.introParts[0]}
          <strong className="font-semibold text-foreground">{content.introParts[1]}</strong>
          {content.introParts[2]}
          <strong className="font-semibold text-foreground">{content.introParts[3]}</strong>
          {content.introParts[4]}
          <strong className="font-semibold text-foreground">{content.introParts[5]}</strong>
          {content.introParts[6]}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
        {STATS.map((s, i) => (
          <div
            key={i}
            className="bg-card border border-sage-dark/20 rounded-xl px-4 py-4 text-center"
          >
            <p className="font-bible-english text-3xl font-semibold text-primary-dark">{s.v}</p>
            <p className={cn("font-semibold mt-1", bodyClass)}>{content.statLabels[s.labelKey]}</p>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-2">
          {content.otTitle}
        </h2>
        <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClass)}>
          {content.otIntro}
        </p>
        <div className="space-y-2">
          {OT_SECTIONS.map((s, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-card border border-sage-dark/20 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-second/30 flex items-center justify-center shrink-0 text-sm font-semibold font-mono">
                {s.books}
              </div>
              <div className="min-w-0">
                <p className={cn("font-medium text-foreground", bodyClass)}>
                  {content.otSections.name[s.nameKey]}
                </p>
                <p className={cn("text-muted-foreground mt-0.5 leading-relaxed", bodyClass)}>
                  {content.otSections.desc[s.descKey]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-2">
          {content.ntTitle}
        </h2>
        <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClass)}>
          {content.ntIntro}
        </p>
        <div className="space-y-2">
          {NT_SECTIONS.map((s, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-card border border-sage-dark/20 rounded-xl"
            >
              <div className="w-10 h-10 rounded-full bg-second/30 flex items-center justify-center shrink-0 text-sm font-semibold font-mono">
                {s.books}
              </div>
              <div className="min-w-0">
                <p className={cn("font-medium text-foreground", bodyClass)}>
                  {content.ntSections.name[s.nameKey]}
                </p>
                <p className={cn("text-muted-foreground mt-0.5 leading-relaxed", bodyClass)}>
                  {content.ntSections.desc[s.descKey]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 p-6 bg-primary-light/10 gap-6 border border-primary-dark/30 rounded-xl">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-3">
          {content.centralTitle}
        </h2>
        <p className={cn("leading-relaxed", bodyClass)}>{content.centralBody}</p>
      </section>

      <section className="mb-14">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-4">
          {content.glossaryTitle}
        </h2>
        <LearnAccordion items={content.glossary} />
      </section>
    </div>
  );
}
