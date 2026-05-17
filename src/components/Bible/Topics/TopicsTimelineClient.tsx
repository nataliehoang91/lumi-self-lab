"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { getTopicBySlug } from "@/lib/bible-topics-data";
import { ChevronDown } from "lucide-react";

// Pastel warm-to-cool spectrum: OT = warm (rose→amber→orange→yellow→pink→fuchsia)
//                               NT = cool  (violet→indigo→sky)
interface Era {
  id: string;
  nameEn: string;
  nameVi: string;
  period: string;
  booksEn: string;
  booksVi: string;
  descEn: string;
  descVi: string;
  topicSlugs: string[];
  testament: "ot" | "nt";
  dotColor: string;  // Tailwind bg class for dot
  pill: string;      // Tailwind classes for badge
  accent: string;    // Tailwind left-border class for card
}

// Rainbow spectrum: red → orange → yellow → lime → emerald → teal → sky → indigo → violet
// Each era gets a clearly distinct hue
const ERAS: Era[] = [
  {
    id: "creation",
    nameEn: "Creation & Fall",
    nameVi: "Sáng Tạo & Sa Ngã",
    period: "~4000 BC",
    booksEn: "Genesis 1–11",
    booksVi: "Sáng-thế Ký 1–11",
    descEn: "God creates the world and humanity. Adam and Eve walk with God in the garden — then sin enters through one act of disobedience, changing everything.",
    descVi: "Đức Chúa Trời dựng nên thế giới và con người. A-đam và Ê-va sống với Ngài trong vườn — rồi tội lỗi xâm nhập qua một sự bất tuân, thay đổi tất cả.",
    topicSlugs: ["identity-in-christ", "worth", "marriage", "faith"],
    testament: "ot",
    dotColor: "bg-red-300 dark:bg-red-400",
    pill: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/40",
    accent: "border-l-red-300 dark:border-l-red-600/50",
  },
  {
    id: "patriarchs",
    nameEn: "The Patriarchs",
    nameVi: "Thời Các Tổ Phụ",
    period: "~2000–1700 BC",
    booksEn: "Genesis 12–50",
    booksVi: "Sáng-thế Ký 12–50",
    descEn: "God calls Abraham to leave everything and follow. Through Abraham, Isaac, Jacob, and Joseph — a family becomes a nation and God's promises take shape.",
    descVi: "Đức Chúa Trời kêu gọi Áp-ra-ham rời bỏ tất cả. Qua Áp-ra-ham, Y-sác, Gia-cốp, Giô-sép — một gia đình trở thành một dân tộc.",
    topicSlugs: ["faith", "gods-will", "trust", "calling"],
    testament: "ot",
    dotColor: "bg-orange-300 dark:bg-orange-400",
    pill: "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800/40",
    accent: "border-l-orange-300 dark:border-l-orange-600/50",
  },
  {
    id: "exodus",
    nameEn: "Exodus & the Law",
    nameVi: "Xuất Hành & Luật Pháp",
    period: "~1450–1400 BC",
    booksEn: "Exodus – Deuteronomy",
    booksVi: "Xuất Ê-díp-tô – Phục Truyền",
    descEn: "God rescues Israel from 400 years of slavery in Egypt and gives the Ten Commandments — a law for how to live in relationship with God and each other.",
    descVi: "Đức Chúa Trời giải cứu Y-sơ-ra-ên khỏi 400 năm nô lệ tại Ai Cập và ban Mười Điều Răn — luật sống trong mối quan hệ với Đức Chúa Trời và nhau.",
    topicSlugs: ["salvation", "obedience", "prayer", "mother", "father"],
    testament: "ot",
    dotColor: "bg-yellow-300 dark:bg-yellow-400",
    pill: "bg-yellow-100 text-yellow-800 border border-yellow-300 dark:bg-yellow-950/30 dark:text-yellow-300 dark:border-yellow-800/40",
    accent: "border-l-yellow-300 dark:border-l-yellow-600/50",
  },
  {
    id: "conquest",
    nameEn: "Conquest & Judges",
    nameVi: "Chiếm Đất & Các Quan Xét",
    period: "~1400–1050 BC",
    booksEn: "Joshua – Ruth",
    booksVi: "Giô-suê – Ru-tơ",
    descEn: "Israel enters the Promised Land. A cycle of faithfulness and failure follows — the nation repeatedly turns away, then returns to God.",
    descVi: "Y-sơ-ra-ên vào Đất Hứa. Một chu kỳ trung thành và thất bại tiếp diễn — dân tộc liên tục quay lưng rồi trở về với Đức Chúa Trời.",
    topicSlugs: ["courage", "trust", "leadership", "family", "friendship"],
    testament: "ot",
    dotColor: "bg-teal-300 dark:bg-teal-400",
    pill: "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/30 dark:text-teal-300 dark:border-teal-800/40",
    accent: "border-l-teal-300 dark:border-l-teal-600/50",
  },
  {
    id: "kingdom",
    nameEn: "The Kingdom of Israel",
    nameVi: "Vương Quốc Y-sơ-ra-ên",
    period: "~1050–586 BC",
    booksEn: "Samuel, Kings, Psalms, Proverbs",
    booksVi: "Sa-mu-ên, Các Vua, Thi Thiên, Châm Ngôn",
    descEn: "Saul, David, and Solomon rule Israel. David writes the Psalms — raw, honest prayers. Solomon compiles Proverbs — practical wisdom for everyday life.",
    descVi: "Sau-lơ, Đa-vít và Sa-lô-môn trị vì. Đa-vít viết Thi Thiên — những lời cầu nguyện chân thật. Sa-lô-môn viết Châm Ngôn — sự khôn ngoan thực tiễn.",
    topicSlugs: ["wisdom", "prayer", "praise", "humility", "leadership", "anger"],
    testament: "ot",
    dotColor: "bg-cyan-300 dark:bg-cyan-400",
    pill: "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-300 dark:border-cyan-800/40",
    accent: "border-l-cyan-300 dark:border-l-cyan-600/50",
  },
  {
    id: "prophets",
    nameEn: "Prophets & Exile",
    nameVi: "Tiên Tri & Lưu Đày",
    period: "~800–400 BC",
    booksEn: "Isaiah – Malachi, 2 Kings",
    booksVi: "Ê-sai – Ma-la-chi, 2 Các Vua",
    descEn: "God sends prophets to warn Israel. The nation falls into exile — yet through the darkness come promises of a coming Savior who will make things right.",
    descVi: "Đức Chúa Trời sai tiên tri cảnh báo Y-sơ-ra-ên. Dân tộc bị lưu đày — nhưng giữa bóng tối, những lời hứa về Đấng Cứu Thế vẫn vang lên.",
    topicSlugs: ["repentance", "hope", "justice", "suffering", "perseverance", "grief"],
    testament: "ot",
    dotColor: "bg-blue-300 dark:bg-blue-400",
    pill: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/40",
    accent: "border-l-blue-300 dark:border-l-blue-600/50",
  },
  {
    id: "jesus",
    nameEn: "The Life of Jesus",
    nameVi: "Cuộc Đời Chúa Giê-xu",
    period: "~4 BC – 30 AD",
    booksEn: "Matthew, Mark, Luke, John",
    booksVi: "Ma-thi-ơ, Mác, Lu-ca, Giăng",
    descEn: "Jesus is born in Bethlehem, grows up, and begins teaching at 30. He heals the sick, loves the outcast, dies on a cross — and rises from the dead three days later.",
    descVi: "Chúa Giê-xu sinh tại Bê-them, bắt đầu rao giảng lúc 30 tuổi. Ngài chữa lành người bệnh, yêu người bị ruồng bỏ, chết trên thập tự và sống lại sau ba ngày.",
    topicSlugs: ["salvation", "grace", "forgiveness", "love", "healing", "baptism"],
    testament: "nt",
    dotColor: "bg-sky-300 dark:bg-sky-400",
    pill: "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/30 dark:text-sky-300 dark:border-sky-800/40",
    accent: "border-l-sky-300 dark:border-l-sky-600/50",
  },
  {
    id: "early-church",
    nameEn: "The Early Church",
    nameVi: "Hội Thánh Đầu Tiên",
    period: "30–100 AD",
    booksEn: "Acts, Romans – Jude",
    booksVi: "Công Vụ, Rô-ma – Giu-đe",
    descEn: "The Holy Spirit comes and the church spreads across the Roman world. Paul writes letters to young churches about how to live as followers of Jesus.",
    descVi: "Đức Thánh Linh đến và hội thánh lan rộng khắp đế quốc La Mã. Phao-lô viết thư cho các hội thánh trẻ về cách sống theo Chúa Giê-xu.",
    topicSlugs: ["holy-spirit", "community", "evangelism", "suffering", "prayer", "generosity"],
    testament: "nt",
    dotColor: "bg-indigo-300 dark:bg-indigo-400",
    pill: "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800/40",
    accent: "border-l-indigo-300 dark:border-l-indigo-600/50",
  },
  {
    id: "eternity",
    nameEn: "Eternity",
    nameVi: "Đời Đời",
    period: "~95 AD → Forever",
    booksEn: "Revelation",
    booksVi: "Khải Huyền",
    descEn: "John receives a vision of the end of history: God defeats evil, the dead are raised, and God makes all things new. Heaven comes to earth.",
    descVi: "Giăng nhận được khải tượng về sự kết thúc lịch sử: Đức Chúa Trời đánh bại sự ác, kẻ chết sống lại, và Ngài làm mọi sự trở nên mới. Thiên đàng đến với trái đất.",
    topicSlugs: ["heaven", "eternal-life", "resurrection", "second-coming", "death-dying", "hope"],
    testament: "nt",
    dotColor: "bg-violet-300 dark:bg-violet-400",
    pill: "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/30 dark:text-violet-300 dark:border-violet-800/40",
    accent: "border-l-violet-300 dark:border-l-violet-600/50",
  },
];

function EraCard({
  era, segment, isVi, index,
}: {
  era: Era; segment: string; isVi: boolean; index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const { bodyClass, bodyClassUp, bodyTitleClassUp } = useBibleFontClasses();

  const resolvedTopics = era.topicSlugs
    .map((slug) => getTopicBySlug(slug))
    .filter(Boolean) as NonNullable<ReturnType<typeof getTopicBySlug>>[];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.04, ease: "easeOut" }}
      className="relative flex gap-5 sm:gap-7"
    >
      {/* Dot */}
      <div className="relative z-10 flex-shrink-0">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.35, delay: index * 0.04 + 0.18, type: "spring", stiffness: 220 }}
          className={cn(
            "mt-5 h-4 w-4 rounded-full ring-2 ring-white dark:ring-[#050408]",
            era.dotColor
          )}
        />
      </div>

      {/* Card */}
      <div
        className={cn(
          "bg-card mb-5 flex-1 cursor-pointer overflow-hidden rounded-2xl border border-border/50 border-l-4 transition-all duration-300",
          era.accent,
          expanded ? "shadow-md" : "hover:shadow-sm"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="px-5 pt-5 pb-4">
          {/* Period + books */}
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold", era.pill)}>
              {era.period}
            </span>
            <span className={cn("text-muted-foreground font-mono text-xs", isVi && "font-vietnamese-flashcard")}>
              {isVi ? era.booksVi : era.booksEn}
            </span>
          </div>

          {/* Title + chevron */}
          <div className="flex items-start justify-between gap-3">
            <h2 className={cn("text-foreground font-semibold leading-snug", bodyTitleClassUp, isVi && "font-vietnamese-flashcard")}>
              {isVi ? era.nameVi : era.nameEn}
            </h2>
            <motion.div
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.22 }}
              className="text-muted-foreground mt-0.5 flex-shrink-0"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </div>

          {/* Description */}
          <p className={cn("text-muted-foreground mt-2 leading-relaxed", bodyClass, isVi && "font-vietnamese-flashcard")}>
            {isVi ? era.descVi : era.descEn}
          </p>
        </div>

        {/* Topic pills */}
        {resolvedTopics.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 pb-4">
            {resolvedTopics.map((topic, ti) => (
              <motion.div
                key={topic.slug}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.25, delay: index * 0.04 + 0.25 + ti * 0.035 }}
              >
                <Link
                  href={`/bible/${segment}/topics/${topic.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all hover:opacity-70 active:scale-95",
                    era.pill,
                    isVi && "font-vietnamese-flashcard"
                  )}
                >
                  {isVi ? topic.nameVi : topic.nameEn}
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Expanded detail */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-border/40 mx-5 mb-4 border-t pt-3">
                <p className={cn("text-muted-foreground text-xs leading-relaxed", bodyClass, isVi && "font-vietnamese-flashcard")}>
                  {isVi
                    ? `${resolvedTopics.length} chủ đề được khai thác trong giai đoạn này. Nhấn vào từng chủ đề để đọc các câu Kinh Thánh liên quan.`
                    : `${resolvedTopics.length} topics explored in this era. Tap any topic to read the related Bible verses.`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function TopicsTimelineClient({ segment }: { segment: string }) {
  const isVi = segment === "vi";
  const { h1Class, bodyClass, bodyClassUp, bodyTitleClassUp } = useBibleFontClasses();
  const [filter, setFilter] = useState<"all" | "ot" | "nt">("all");

  const otEras = ERAS.filter((e) => e.testament === "ot");
  const ntEras = ERAS.filter((e) => e.testament === "nt");

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="mb-10 max-w-2xl"
      >
        <p className={cn("text-primary mb-2 font-mono text-xs font-semibold uppercase tracking-widest", isVi && "font-vietnamese-flashcard")}>
          {isVi ? "Hành Trình Qua Kinh Thánh" : "Journey Through the Bible"}
        </p>
        <h1 className={cn("text-foreground font-serif font-semibold leading-tight", h1Class, isVi && "font-vietnamese-flashcard")}>
          {isVi ? "Dòng Thời Gian Các Chủ Đề" : "Topics Timeline"}
        </h1>
        <p className={cn("text-muted-foreground mt-4 leading-relaxed", bodyClassUp, isVi && "font-vietnamese-flashcard")}>
          {isVi
            ? "Khám phá cách các chủ đề lớn của cuộc sống — tình yêu, hy vọng, sự tha thứ, sự sợ hãi — xuất hiện và phát triển qua toàn bộ câu chuyện Kinh Thánh."
            : "Discover how life's biggest themes — love, hope, forgiveness, fear — appear and evolve across the entire story of the Bible."}
        </p>
      </motion.div>

      {/* Filter pills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-10 flex gap-2"
      >
        {(["all", "ot", "nt"] as const).map((key) => {
          const labels = {
            all: { en: "All", vi: "Tất cả" },
            ot:  { en: "Old Testament", vi: "Cựu Ước" },
            nt:  { en: "New Testament", vi: "Tân Ước" },
          };
          const active = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                bodyClass,
                isVi && "font-vietnamese-flashcard",
                active
                  ? "bg-primary border-primary text-white shadow-sm"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {isVi ? labels[key].vi : labels[key].en}
            </button>
          );
        })}
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
          style={{ transformOrigin: "top" }}
          className="bg-border absolute top-0 bottom-0 left-[7px] w-px"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {filter !== "nt" && (
              <>
                <div className="mb-5 flex items-center gap-4 pl-9">
                  <span className={cn("text-muted-foreground font-mono text-xs font-semibold uppercase tracking-widest")}>
                    {isVi ? "Cựu Ước" : "Old Testament"}
                  </span>
                  <div className="bg-border h-px flex-1" />
                  <span className="text-muted-foreground font-mono text-xs opacity-50">
                    39 {isVi ? "sách" : "books"}
                  </span>
                </div>
                {otEras.map((era, i) => (
                  <EraCard key={era.id} era={era} segment={segment} isVi={isVi} index={i} />
                ))}
              </>
            )}

            {filter !== "ot" && (
              <>
                <div className={cn("mb-5 flex items-center gap-4 pl-9", filter !== "nt" && "mt-6")}>
                  <span className={cn("text-muted-foreground font-mono text-xs font-semibold uppercase tracking-widest")}>
                    {isVi ? "Tân Ước" : "New Testament"}
                  </span>
                  <div className="bg-border h-px flex-1" />
                  <span className="text-muted-foreground font-mono text-xs opacity-50">
                    27 {isVi ? "sách" : "books"}
                  </span>
                </div>
                {ntEras.map((era, i) => (
                  <EraCard
                    key={era.id}
                    era={era}
                    segment={segment}
                    isVi={isVi}
                    index={filter === "all" ? otEras.length + i : i}
                  />
                ))}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="border-border bg-card mt-4 overflow-hidden rounded-2xl border"
      >
        <div className="bg-primary/5 p-6 text-center">
          <p className={cn("text-foreground font-medium", bodyTitleClassUp, isVi && "font-vietnamese-flashcard")}>
            {isVi ? "Khám phá tất cả các chủ đề" : "Explore all topics"}
          </p>
          <p className={cn("text-muted-foreground mt-1", bodyClass, isVi && "font-vietnamese-flashcard")}>
            {isVi ? "Tìm kiếm và lọc theo danh mục" : "Search and filter by category"}
          </p>
          <Link
            href={`/bible/${segment}/topics`}
            className={cn(
              "bg-primary hover:bg-primary/90 text-white mt-4 inline-flex items-center rounded-full px-5 py-2 text-sm font-medium transition-all hover:scale-105 active:scale-95",
              isVi && "font-vietnamese-flashcard"
            )}
          >
            {isVi ? "Xem tất cả chủ đề →" : "Browse all topics →"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
