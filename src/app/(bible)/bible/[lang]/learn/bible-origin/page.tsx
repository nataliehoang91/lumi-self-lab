"use client";

import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LearnAccordion } from "@/components/Bible/Learn/LearnAccordion";
import { BibleHeading } from "@/components/Bible/BibleHeading";
import {
  LearnMiniMap,
  LearnMapPopover,
  LearnOriginMapFullWidth,
  type MapLocationId,
} from "@/components/Bible/Learn/LearnOriginMap";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import { useRef, useState, useEffect } from "react";

const TIMELINE_LOCATION_IDS: MapLocationId[] = [
  "sinai",
  "jerusalem",
  "alexandria",
  "antioch",
  "alexandria",
  "rome",
  "qumran",
];

const LANG_SCRIPT = [
  { pct: "79%", script: "עִבְרִית" },
  { pct: "18%", script: "Κοινή" },
  { pct: "3%", script: "ܐܪܡܝܐ" },
] as const;

const EN = {
  moduleNum: "02 / 04",
  title: "Bible Origin & Canon Formation",
  intro:
    "How did 66 books, written by more than 40 authors across 1,500 years and three continents, come to be recognised as a single authoritative text? The story spans ancient Israel, the early church, manuscript transmission, and archaeological discoveries that continue to shape our understanding today.",
  originalLanguages: "Original Languages",
  lang: ["Hebrew", "Greek", "Aramaic"],
  langNote: [
    "The primary language of the Old Testament — the language of Israel's law, poetry, and prophecy.",
    "Koine Greek — the common language of the Roman Empire and the original language of the New Testament.",
    "A related Semitic language used in parts of Daniel and Ezra, and widely spoken in the time of Jesus.",
  ],
  timeline: "Manuscript Timeline",
  timelineItems: [
    { year: "~1400 BC", event: "Earliest Old Testament Books Written (Pentateuch)", desc: "The Pentateuch laid the foundation of Israel's faith — including the Law, the primeval history, and the covenant between God and His people." },
    { year: "~450 BC", event: "Old Testament Canon Largely Established", desc: "The Law and the Prophets were firmly established in Jewish worship and community life, forming the core of the Hebrew canon." },
    { year: "~250 BC", event: "The Septuagint Produced in Alexandria", desc: "The first Greek translation of the Old Testament made the Scriptures accessible to the Hellenistic world and was widely used in the early Church." },
    { year: "50–95 AD", event: "New Testament Books Written", desc: "The Gospels and apostolic letters were copied and circulated among churches throughout the Roman Empire, gradually being recognised as carrying spiritual authority." },
    { year: "367 AD", event: "Athanasius Lists the 27 New Testament Books", desc: "For the first time, the full list of the 27 New Testament books was clearly recorded, reflecting the writings already widely used in the Church." },
    { year: "~400 AD", event: "Jerome Completes the Vulgate", desc: "The Latin translation became the standard Bible of Western Christianity for over a millennium." },
    { year: "1947", event: "Discovery of the Dead Sea Scrolls", desc: "Manuscripts dating as early as the third century BC demonstrated the remarkable preservation of the Old Testament text across many centuries of transmission." },
  ],
  mapTitle: "Biblical Manuscript Map",
  mapBody: "A few of the key locations where Scripture was written, copied, translated, and preserved.",
  mapLocations: {
    jerusalem: { label: "Jerusalem", desc: "The spiritual centre of ancient Israel and the site of the Temple, where the Law was read and preserved." },
    qumran: { label: "Qumran", desc: "Desert community near the Dead Sea where the Dead Sea Scrolls were discovered in 1947, confirming the reliability of Old Testament manuscripts." },
    alexandria: { label: "Alexandria", desc: "A major centre of learning in the ancient world, where Jewish scholars produced the Greek translation of the Old Testament (the Septuagint)." },
    rome: { label: "Rome", desc: "Capital of the Roman Empire, where early Christian communities formed and key Latin translations like the Vulgate were produced." },
    antioch: { label: "Antioch", desc: "One of the first major Gentile churches; a launching point for Paul's missionary journeys and the spread of the New Testament." },
    sinai: { label: "Mount Sinai", desc: "The traditional site where Moses received the Law — the beginning of Israel's written Scriptures." },
  },
  reliableTitle: "Why Is the Bible Considered Reliable?",
  reliableP1: "The New Testament is supported by more manuscript evidence than any other work of ancient literature — over 5,800 Greek manuscripts and more than 25,000 in total across ancient languages. The time gap between the original writings and our earliest surviving copies is comparatively short, often within a few generations.",
  reliableP2: "The discovery of the Dead Sea Scrolls demonstrated that the Hebrew Scriptures had been preserved with extraordinary consistency over centuries of careful copying. Jewish scribal tradition was highly meticulous, contributing to the stability of the biblical text over time.",
  faqTitle: "Common Questions",
  faq: [
    { q: "Why do Protestant and Catholic Bibles differ in length?", a: "Catholic Bibles include seven additional books often called the Deuterocanonical books, written during the intertestamental period. Protestant Reformers followed the traditional Hebrew canon, which did not include these writings — resulting in 66 books in most Protestant Bibles and 73 in Catholic editions." },
    { q: "What are the Dead Sea Scrolls and why do they matter?", a: "Discovered in 1947 near the Dead Sea, the scrolls contain some of the oldest known manuscripts of the Hebrew Bible, dating as early as the third century BC. When compared with later medieval manuscripts, the text shows remarkable consistency, providing strong evidence for careful transmission over time." },
    { q: "What languages was the Bible originally written in?", a: "The Old Testament was written primarily in Hebrew, with portions in Aramaic. The New Testament was written in Koine Greek, the widely spoken language of the eastern Roman Empire in the first century." },
    { q: "How was the New Testament canon recognised?", a: "Early Christian communities evaluated writings based on apostolic connection, consistency with established teaching, and widespread usage in churches. By the fourth century, the 27 books of the New Testament were broadly recognised across the Christian world. Church councils later affirmed what had already become widely accepted." },
  ],
} as const;

const VI = {
  moduleNum: "02 / 04",
  title: "Nguồn gốc Kinh thánh & Hình thành Chính Điển",
  intro:
    "Làm thế nào 66 sách, được viết bởi hàng chục tác giả qua 1.500 năm, được công nhận là một văn bản có thẩm quyền? Câu trả lời trải dài từ bản thảo cổ đại, tranh luận trong Hội thánh sơ khai, đến các khám phá khảo cổ.",
  originalLanguages: "Ngôn ngữ gốc",
  lang: ["Hê-bơ-rơ", "Hy Lạp", "A-ram"],
  langNote: [
    "Phần lớn Cựu Ước",
    "Toàn bộ Tân Ước",
    "Một số đoạn trong Đa-ni-ên & E-xơ-ra",
  ],
  timeline: "Dòng thời gian bản thảo",
  timelineItems: [
    { year: "~1400 TCN", event: "Các sách Cựu Ước sớm nhất được viết (Ngũ Kinh)", desc: "Ngũ Kinh đặt nền tảng cho đức tin Israel — bao gồm luật pháp, lịch sử khởi nguyên và giao ước giữa Đức Chúa Trời với dân Ngài." },
    { year: "~450 TCN", event: "Canon Cựu Ước cơ bản hoàn chỉnh", desc: "Luật pháp và các sách Tiên tri được xác lập vững chắc trong đời sống thờ phượng Do Thái, hình thành cốt lõi của chính điển Hê-bơ-rơ." },
    { year: "~250 TCN", event: "Bản Bảy Mươi ra đời tại Alexandria", desc: "Bản dịch Hy Lạp đầu tiên của Cựu Ước giúp Kinh Thánh tiếp cận thế giới Hy Lạp hóa và được sử dụng rộng rãi trong Hội Thánh đầu tiên." },
    { year: "50–95 SCN", event: "Các sách Tân Ước được viết", desc: "Các thư tín và sách Tin Lành được sao chép, lưu hành giữa các Hội Thánh khắp Đế quốc La Mã, dần được xem là có thẩm quyền thuộc linh." },
    { year: "367 SCN", event: "Athanasius liệt kê 27 sách Tân Ước", desc: "Lần đầu tiên danh sách 27 sách Tân Ước được ghi lại rõ ràng, phản ánh những bản văn đã được sử dụng rộng rãi trong Hội Thánh." },
    { year: "400 SCN", event: "Jerome hoàn thành Vulgate", desc: "Bản dịch Kinh Thánh sang tiếng Latin này trở thành bản văn chuẩn tại Tây phương suốt hơn một thiên niên kỷ." },
    { year: "1947", event: "Cuộn Sách Biển Chết được phát hiện", desc: "Các bản thảo cổ từ thế kỷ thứ ba TCN cho thấy văn bản Cựu Ước được bảo tồn với độ chính xác đáng kinh ngạc qua nhiều thế kỷ." },
  ],
  mapTitle: "Bản đồ bản thảo Kinh thánh",
  mapBody: "Một vài địa điểm trọng yếu nơi Kinh thánh được viết, sao chép, dịch và được gìn giữ qua nhiều thế kỷ.",
  mapLocations: {
    jerusalem: { label: "Giê-ru-sa-lem", desc: "Trung tâm thuộc linh của dân Y-sơ-ra-ên xưa, nơi Đền thờ được xây dựng và Lời Chúa được đọc công khai." },
    qumran: { label: "Qumran", desc: "Vùng gần Biển Chết, nơi Cuộn Sách Biển Chết được phát hiện năm 1947, xác nhận độ chính xác của bản thảo Cựu Ước." },
    alexandria: { label: "A-léc-xan-ri-a", desc: "Thành phố cảng lớn với cộng đồng Do Thái đông đảo, nơi bản dịch Hy Lạp của Cựu Ước (Bản Bảy Mươi) được hình thành." },
    rome: { label: "Rô-ma", desc: "Thủ đô Đế quốc La Mã, nơi Hội thánh sơ khai được gây dựng và bản dịch Latin Vulgate có ảnh hưởng sâu rộng." },
    antioch: { label: "An-ti-ốt", desc: 'Nơi các môn đồ lần đầu tiên được gọi là "Cơ Đốc nhân" và là điểm xuất phát của nhiều chuyến hành trình truyền giáo của Phao-lô.' },
    sinai: { label: "Núi Si-na-i", desc: "Nơi Môi-se nhận Luật pháp theo tường thuật Kinh Thánh — điểm khởi đầu quan trọng của văn bản Kinh Thánh." },
  },
  reliableTitle: "Tại sao Kinh thánh được xem là đáng tin?",
  reliableP1: "Tân Ước có nhiều bằng chứng bản thảo hơn bất kỳ tài liệu cổ đại nào — hơn 5.800 bản thảo Hy Lạp, so với chưa đến 650 bản cho Iliad của Homer. Khoảng cách thời gian giữa bản gốc và bản thảo còn lại sớm nhất cũng rất ngắn (vài thập kỷ, không phải thế kỷ).",
  reliableP2: "Cuộn Sách Biển Chết xác nhận văn bản Cựu Ước được bảo tồn với độ chính xác phi thường qua hơn một ngàn năm sao chép. Truyền thống kinh sư trong Do Thái giáo rất tỉ mỉ — một lỗi trên một trang có thể khiến phải hủy toàn bộ cuộn.",
  faqTitle: "Câu hỏi thường gặp",
  faq: [
    { q: "Tại sao Kinh thánh Tin Lành và Công giáo khác nhau về độ dài?", a: "Kinh thánh Công giáo gồm thêm 7 sách gọi là Deuterocanonical (hoặc Apocrypha), viết giữa thời Cựu Ước và Tân Ước. Các nhà Cải chính Tin Lành theo canon Hê-bơ-rơ, loại trừ các sách này, nên hầu hết Kinh thánh Tin Lành có 66 sách còn Kinh thánh Công giáo có 73." },
    { q: "Cuộn Sách Biển Chết là gì và tại sao quan trọng?", a: "Được phát hiện năm 1947 gần Biển Chết, các cuộn là bản thảo Hê-bơ-rơ cổ nhất — một số từ khoảng 200 TCN. So với bản thảo sau này, văn bản được bảo tồn đáng kinh ngạc, cung cấp bằng chứng mạnh mẽ cho sự truyền tải chính xác của Kinh thánh qua nhiều thế kỷ." },
    { q: "Kinh thánh ban đầu được viết bằng ngôn ngữ nào?", a: "Cựu Ước chủ yếu viết bằng tiếng Hê-bơ-rơ, một phần nhỏ bằng tiếng A-ram. Tân Ước viết bằng tiếng Hy Lạp Koine — ngôn ngữ phổ thông của thế giới Địa Trung Hải thế kỷ nhất." },
    { q: "Canon Tân Ước được quyết định như thế nào?", a: "Hội thánh sơ khai kiểm tra các tác phẩm theo ba tiêu chí: tác giả sứ đồ (viết bởi sứ đồ hoặc người gần gũi), nhất quán với giáo lý đã được thiết lập, và được sử dụng rộng rãi trong các Hội thánh. Đến thế kỷ 4, 27 sách Tân Ước đã được công nhận rộng rãi." },
  ],
} as const;

type Lang = "en" | "vi";

const CONTENT: Record<Lang, typeof EN> = { en: EN, vi: VI };

function getMapLabels(loc: typeof EN.mapLocations): Record<MapLocationId, string> {
  return {
    jerusalem: loc.jerusalem.label,
    qumran: loc.qumran.label,
    alexandria: loc.alexandria.label,
    rome: loc.rome.label,
    antioch: loc.antioch.label,
    sinai: loc.sinai.label,
  };
}

export default function BibleOriginLangPage() {
  const params = useParams();
  const lang = (params?.lang as string)?.toLowerCase();
  if (lang !== "en" && lang !== "vi") notFound();

  const content = CONTENT[lang as Lang];
  const { fontSize } = useBibleApp();
  const mapPopoverRef = useRef<HTMLDivElement>(null);
  const [mapActiveLocation, setMapActiveLocation] = useState<MapLocationId | null>(null);

  useEffect(() => {
    if (mapActiveLocation === null) return;
    const handler = (e: MouseEvent) => {
      if (mapPopoverRef.current && !mapPopoverRef.current.contains(e.target as Node)) {
        setMapActiveLocation(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mapActiveLocation]);

  const bodyClass =
    fontSize === "small" ? "text-xs" : fontSize === "large" ? "text-base" : "text-sm";
  const mapLabels = getMapLabels(content.mapLocations);

  return (
    <div>
      <div className="mb-12">
        <p className="text-xs font-mono text-second mb-3">{content.moduleNum}</p>
        <BibleHeading
          level="h1"
          className="font-bible-english font-semibold text-foreground leading-tight text-balance"
        >
          {content.title}
        </BibleHeading>
        <p className={cn("mt-4 text-muted-foreground leading-relaxed", bodyClass)}>
          {content.intro}
        </p>
      </div>

      <section className="mb-10">
        <BibleHeading level="h2" className="font-bible-english font-semibold text-foreground mb-4">
          {content.originalLanguages}
        </BibleHeading>
        <div className="grid grid-cols-3 gap-3">
          {LANG_SCRIPT.map((l, i) => (
            <div
              key={i}
              className="p-4 bg-card border border-sage-dark/20 rounded-xl text-center"
            >
              <p className="font-bible-english text-xl text-muted-foreground/30 select-none leading-none">
                {l.script}
              </p>
              <p className="font-bible-english text-3xl font-semibold text-foreground mt-1">
                {l.pct}
              </p>
              <p className={cn("font-medium text-foreground mt-1", bodyClass)}>
                {content.lang[i]}
              </p>
              <p className={cn("text-muted-foreground mt-0.5 leading-snug", bodyClass)}>
                {content.langNote[i]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-14">
        <BibleHeading level="h2" className="font-serif font-semibold text-foreground mb-6">
          {content.timeline}
        </BibleHeading>
        <div className="relative">
          <div className="absolute left-[106px] top-3 bottom-3 w-px border border-dashed" />
          <div className="space-y-6">
            {content.timelineItems.map((t, i) => {
              const locationId = TIMELINE_LOCATION_IDS[i];
              const loc = content.mapLocations[locationId];
              return (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-24 shrink-0 text-right pt-4">
                    <span className="text-xs font-mono text-muted-foreground/70 whitespace-nowrap block">
                      {t.year}
                    </span>
                  </div>
                  <div className="shrink-0 size-4 -ml-3 rounded-full bg-primary/80 border-2 border-background mt-4 z-10" />
                  <div className="flex-1 min-w-0 rounded-2xl max-w-3xl bg-card border border-border shadow-sm overflow-hidden">
                    <div className="flex gap-0 h-full items-center">
                      <div className="flex-1 min-w-0 px-4 py-4">
                        <p className="text-sm font-semibold text-foreground leading-snug">
                          {t.event}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                          {t.desc}
                        </p>
                        <div className="mt-3">
                          <LearnMapPopover
                            locationId={locationId}
                            label={loc.label}
                            desc={loc.desc}
                            miniMapLabels={mapLabels}
                          >
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full hover:bg-muted/80 transition-colors cursor-pointer">
                              <MapPin className="w-3 h-3" />
                              {loc.label}
                            </span>
                          </LearnMapPopover>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            className="hidden sm:block w-52 bg-muted/30 h-full cursor-zoom-in mr-4"
                          >
                            <LearnMiniMap
                              activeId={locationId}
                              variant="inline"
                              labels={mapLabels}
                            />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl border-none bg-transparent p-0 shadow-none">
                          <div className="rounded-2xl overflow-hidden border border-border bg-card">
                            <LearnMiniMap activeId={locationId} labels={mapLabels} />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mb-10">
        <BibleHeading level="h2" className="font-bible-english font-semibold text-foreground mb-2">
          {content.mapTitle}
        </BibleHeading>
        <p className={cn("text-muted-foreground mb-5 leading-relaxed", bodyClass)}>
          {content.mapBody}
        </p>
        <LearnOriginMapFullWidth
          activeId={mapActiveLocation}
          onActiveChange={setMapActiveLocation}
          labels={mapLabels}
          renderPopover={(id) => content.mapLocations[id]}
        />
      </section>

      <section className="mb-10 p-6 bg-primary-light/10 gap-6 border border-primary-dark/30 rounded-2xl space-y-4 animate-in fade-in duration-300">
        <BibleHeading
          level="h2"
          className="font-bible-english font-semibold text-foreground text-xl md:text-2xl"
        >
          {content.reliableTitle}
        </BibleHeading>
        <p className={cn("leading-relaxed", bodyClass)}>{content.reliableP1}</p>
        <p className={cn("leading-relaxed", bodyClass)}>{content.reliableP2}</p>
      </section>

      <section className="mb-14">
        <BibleHeading
          level="h2"
          className="font-bible-english font-semibold text-foreground mb-4 text-xl md:text-2xl"
        >
          {content.faqTitle}
        </BibleHeading>
        <LearnAccordion
          items={content.faq.map((f) => ({ term: f.q, def: f.a }))}
        />
      </section>
    </div>
  );
}
