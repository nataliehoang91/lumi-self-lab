"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, X, Send, BookOpen, Hash, GraduationCap, Map,
  ArrowRight, Search, Brain, BookMarked, Lightbulb, Trash2, Plus, LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

// ── Types ────────────────────────────────────────────────────────────────────

interface NavLink { label: string; href: string; type: "topic" | "book" | "learn" | "page" | "overview" }
interface Message { role: "user" | "assistant"; content: string; links?: NavLink[]; id: string }

interface Topic {
  id: string;
  label: string;
  messages: Message[];
}

const LINKS_MARKER = "\n\nLINKS:";
const USAGE_MARKER = "\n\nUSAGE:";
const TOPICS_KEY = "bible-ai-topics-v2";
const VERSION_PREF_KEY = "bible-ai-version-pref";
const MAX_MESSAGES = 100;
const MAX_TOPICS = 3;

type BibleVersionPref = "vi" | "niv" | "kjv";
const VERSION_LABELS: Record<BibleVersionPref, string> = { vi: "VI 1925", niv: "NIV", kjv: "KJV" };

// ── Static maps ──────────────────────────────────────────────────────────────

const LINK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  topic: Hash, book: BookOpen, learn: GraduationCap, page: Map, overview: BookMarked,
};

const LINK_COLORS: Record<string, string> = {
  topic:    "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100 dark:bg-violet-950/30 dark:border-violet-800/40 dark:text-violet-300",
  book:     "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:border-amber-800/40 dark:text-amber-300",
  learn:    "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-800/40 dark:text-emerald-300",
  page:     "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/30 dark:border-blue-800/40 dark:text-blue-300",
  overview: "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-800/40 dark:text-indigo-300",
};

// ── Thinking indicator ───────────────────────────────────────────────────────

const THINKING_EN = [
  { icon: Brain,      text: "Understanding your question…" },
  { icon: Search,     text: "Searching Bible topics…" },
  { icon: BookMarked, text: "Finding relevant passages…" },
  { icon: Lightbulb,  text: "Putting it together…" },
];
const THINKING_VI = [
  { icon: Brain,      text: "Đang hiểu câu hỏi của bạn…" },
  { icon: Search,     text: "Đang tìm kiếm chủ đề Kinh Thánh…" },
  { icon: BookMarked, text: "Đang tìm đoạn Kinh Thánh liên quan…" },
  { icon: Lightbulb,  text: "Đang tổng hợp câu trả lời…" },
];

function ThinkingIndicator({ isVi }: { isVi: boolean }) {
  const steps = isVi ? THINKING_VI : THINKING_EN;
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % steps.length), 1800);
    return () => clearInterval(id);
  }, [steps.length]);
  const { icon: Icon, text } = steps[step]!;
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2.5 text-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="text-foreground">{text}</span>
            <span className="ml-0.5 inline-flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block h-1 w-1 rounded-full bg-primary/60"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Markdown / answer rendering ──────────────────────────────────────────────

type Token = string | { bold: string };

function parseTokens(raw: string): Token[] {
  let text = raw
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^---+$/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const tokens: Token[] = [];
  const boldRe = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = boldRe.exec(text)) !== null) {
    if (m.index > last) tokens.push(text.slice(last, m.index));
    tokens.push({ bold: m[1]! });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push(text.slice(last));
  return tokens;
}

function PopAnswer({ text, animate }: { text: string; animate: boolean }) {
  const tokens = parseTokens(text);
  const units: { word: string; bold: boolean }[] = [];
  for (const token of tokens) {
    if (typeof token === "string") {
      for (const w of token.split(/(\s+)/)) { if (w) units.push({ word: w, bold: false }); }
    } else {
      for (const w of token.bold.split(/(\s+)/)) { if (w) units.push({ word: w, bold: true }); }
    }
  }
  if (!animate) {
    return (
      <span>
        {units.map((u, i) => u.bold ? <strong key={i}>{u.word}</strong> : <span key={i}>{u.word}</span>)}
      </span>
    );
  }
  return (
    <span>
      {units.map((u, i) => {
        const Tag = u.bold ? "strong" : "span";
        return (
          <motion.span key={i} initial={{ opacity: 0, scale: 0.55, y: 5 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 22, delay: i * 0.028 }}
            className="inline-block" style={{ marginRight: /^\s+$/.test(u.word) ? 0 : "0.22em" }}>
            <Tag>{u.word}</Tag>
          </motion.span>
        );
      })}
    </span>
  );
}

function NavCard({ link, index, animate }: { link: NavLink; index: number; animate: boolean }) {
  const Icon = LINK_ICONS[link.type] ?? Hash;
  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.85, y: 8 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 24, delay: animate ? 0.1 + index * 0.07 : 0 }}
    >
      <Link href={link.href} className={cn("flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]", LINK_COLORS[link.type])}>
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="flex-1 truncate">{link.label}</span>
        <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
      </Link>
    </motion.div>
  );
}

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy.slice(0, n);
}

const STARTER_POOL_EN = [
  "What does the Bible say about anxiety?",
  "Where should I start reading?",
  "Topics related to relationships?",
  "Tell me about faith",
  "What does the Bible say about fear?",
  "Tell me about prayer",
  "Who is the Holy Spirit?",
  "What is the Gospel?",
  "Bible verses about hope",
  "What does the Bible say about forgiveness?",
  "How do I understand the Old Testament?",
  "What are the books of the Bible?",
  "What does the Bible say about anger?",
  "Bible verses about grief and loss",
  "What does the Bible say about loneliness?",
  "How to find joy in the Bible?",
  "What does the Bible say about trust?",
  "What does the Bible say about worship?",
  "Who is Jesus Christ?",
  "What does the Bible say about salvation?",
  "What happens after death?",
  "What does the Bible say about love?",
  "What does the Bible say about marriage?",
  "What does the Bible say about friendship?",
  "What does the Bible say about wisdom?",
  "How to find God's purpose for my life?",
  "What does the Bible say about work?",
  "What does the Bible say about suffering?",
  "What does the Bible say about doubt?",
  "What does the Bible say about healing?",
  "What does the Bible say about humility?",
  "What does the Bible say about gratitude?",
  "What does the Bible say about courage?",
  "What does the Bible say about patience?",
  "What is the New Testament about?",
  "What does the Bible say about money?",
  "What does the Bible say about sin?",
  "What does the Bible say about heaven?",
  "Who wrote the Bible?",
  "What is grace?",
];

const STARTER_POOL_VI = [
  "Kinh Thánh nói gì về lo lắng?",
  "Tôi nên bắt đầu đọc từ đâu?",
  "Chủ đề về các mối quan hệ?",
  "Cho tôi biết về đức tin",
  "Kinh Thánh nói gì về sự sợ hãi?",
  "Cho tôi biết về cầu nguyện",
  "Đức Thánh Linh là ai?",
  "Tin Lành là gì?",
  "Câu Kinh Thánh về hy vọng",
  "Kinh Thánh nói gì về sự tha thứ?",
  "Làm thế nào để hiểu Cựu Ước?",
  "Kinh Thánh có những sách nào?",
  "Kinh Thánh nói gì về sự tức giận?",
  "Câu Kinh Thánh về đau buồn và mất mát",
  "Kinh Thánh nói gì về sự cô đơn?",
  "Làm thế nào để tìm niềm vui trong Kinh Thánh?",
  "Kinh Thánh nói gì về sự tin tưởng?",
  "Kinh Thánh nói gì về sự thờ phượng?",
  "Chúa Giêsu là ai?",
  "Kinh Thánh nói gì về sự cứu rỗi?",
  "Điều gì xảy ra sau khi chết?",
  "Kinh Thánh nói gì về tình yêu?",
  "Kinh Thánh nói gì về hôn nhân?",
  "Kinh Thánh nói gì về tình bạn?",
  "Kinh Thánh nói gì về sự khôn ngoan?",
  "Làm thế nào để tìm mục đích của Đức Chúa Trời cho cuộc đời tôi?",
  "Kinh Thánh nói gì về công việc?",
  "Kinh Thánh nói gì về sự đau khổ?",
  "Kinh Thánh nói gì về sự nghi ngờ?",
  "Kinh Thánh nói gì về sự chữa lành?",
  "Kinh Thánh nói gì về sự khiêm nhường?",
  "Kinh Thánh nói gì về lòng biết ơn?",
  "Kinh Thánh nói gì về sự dũng cảm?",
  "Kinh Thánh nói gì về sự kiên nhẫn?",
  "Tân Ước nói về điều gì?",
  "Kinh Thánh nói gì về tiền bạc?",
  "Kinh Thánh nói gì về tội lỗi?",
  "Kinh Thánh nói gì về thiên đàng?",
  "Ai đã viết Kinh Thánh?",
  "Ân điển là gì?",
];

const STARTER_ANSWERS_EN: Record<string, { text: string; links: NavLink[] }> = {
  "What does the Bible say about anxiety?": {
    text: "**Philippians** 4:6-7 is one of the most powerful verses on anxiety: \"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.\" **Matthew** 6:25-34 also reminds us that God cares for even the birds and flowers — how much more will He care for you. Casting your worries on Him through prayer is the Bible's consistent answer to anxiety.",
    links: [
      { label: "Anxiety", href: "/bible/en/topics/anxiety", type: "topic" },
      { label: "Peace", href: "/bible/en/topics/peace", type: "topic" },
      { label: "Philippians — Read", href: "/bible/en/read?version1=niv&book1=philippians&chapter1=4&testament1=nt", type: "book" },
    ],
  },
  "Where should I start reading?": {
    text: "The best starting point for most people is the Gospel of **John** — it tells the story of Jesus in a deeply personal way and answers the big question: who is He? After John, try **Psalms** for honest prayers about every human emotion, and **Proverbs** for practical daily wisdom. If you want the full story from the beginning, **Genesis** is where it all starts.",
    links: [
      { label: "Start Learning", href: "/bible/en/learn", type: "learn" },
      { label: "John — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=1&testament1=nt", type: "book" },
      { label: "John — Overview", href: "/bible/en/book-overviews/john", type: "overview" },
      { label: "Psalms — Read", href: "/bible/en/read?version1=niv&book1=psalms&chapter1=1&testament1=ot", type: "book" },
      { label: "Who Is Jesus?", href: "/bible/en/learn/who-is-jesus", type: "learn" },
    ],
  },
  "Topics related to relationships?": {
    text: "Scripture has rich wisdom on every kind of relationship. **1 Corinthians** 13 defines love beautifully. **Ephesians** 5 speaks to marriage. **Proverbs** 17:17 says \"A friend loves at all times.\" There are dedicated topics for love, marriage, family, forgiveness, and conflict — each with curated verses to guide you.",
    links: [
      { label: "Love", href: "/bible/en/topics/love", type: "topic" },
      { label: "Marriage", href: "/bible/en/topics/marriage", type: "topic" },
      { label: "Forgiveness", href: "/bible/en/topics/forgiveness", type: "topic" },
      { label: "Family", href: "/bible/en/topics/family", type: "topic" },
    ],
  },
  "Tell me about faith": {
    text: "**Hebrews** 11:1 gives the classic definition: \"Faith is confidence in what we hope for and assurance about what we do not see.\" Faith in the Bible is not just belief — it is trust and action. **Romans** 10:17 says faith comes from hearing the Word of God. The entire book of **James** shows that true faith produces works. Faith is the foundation of the Christian life.",
    links: [
      { label: "Faith", href: "/bible/en/topics/faith", type: "topic" },
      { label: "What Is Faith?", href: "/bible/en/learn/what-is-faith", type: "learn" },
      { label: "Hebrews — Read", href: "/bible/en/read?version1=niv&book1=hebrews&chapter1=11&testament1=nt", type: "book" },
      { label: "Romans — Read", href: "/bible/en/read?version1=niv&book1=romans&chapter1=10&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about fear?": {
    text: "**Isaiah** 41:10 is one of the most comforting verses: \"Do not fear, for I am with you; do not be dismayed, for I am your God.\" **2 Timothy** 1:7 reminds us that \"God has not given us a spirit of fear, but of power, love and a sound mind.\" **Psalm** 23 walks through the valley of the shadow of death with confidence — because God is present. Fear is addressed throughout Scripture with the same answer: trust in God's presence.",
    links: [
      { label: "Fear", href: "/bible/en/topics/fear", type: "topic" },
      { label: "Isaiah 41 — Read", href: "/bible/en/read?version1=niv&book1=isaiah&chapter1=41&testament1=ot", type: "book" },
      { label: "Psalm 23 — Read", href: "/bible/en/read?version1=niv&book1=psalms&chapter1=23&testament1=ot", type: "book" },
    ],
  },
  "Tell me about prayer": {
    text: "Jesus himself taught us how to pray in **Matthew** 6:9-13 — the Lord's Prayer. **Philippians** 4:6-7 says to pray about everything and God's peace will guard your heart. **James** 5:16 tells us \"the prayer of a righteous person is powerful and effective.\" Prayer is a direct conversation with God — honest, persistent, and transforming.",
    links: [
      { label: "Prayer", href: "/bible/en/topics/prayer", type: "topic" },
      { label: "Matthew 6 — Read", href: "/bible/en/read?version1=niv&book1=matthew&chapter1=6&testament1=nt", type: "book" },
      { label: "Philippians 4 — Read", href: "/bible/en/read?version1=niv&book1=philippians&chapter1=4&testament1=nt", type: "book" },
    ],
  },
  "Who is the Holy Spirit?": {
    text: "The Holy Spirit is the third person of the Trinity — fully God, not just a force. **John** 14:26 says Jesus sent the Holy Spirit as a Helper and Teacher who \"will remind you of everything I have said.\" **Acts** 2 shows the Spirit arriving at Pentecost with power. **Romans** 8 describes the Spirit praying for us and confirming we are God's children. The Spirit lives in every believer and produces love, joy, peace, and patience (Galatians 5:22).",
    links: [
      { label: "Who Is Jesus?", href: "/bible/en/learn/who-is-jesus", type: "learn" },
      { label: "John 14 — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=14&testament1=nt", type: "book" },
      { label: "Acts 2 — Read", href: "/bible/en/read?version1=niv&book1=acts&chapter1=2&testament1=nt", type: "book" },
    ],
  },
  "What is the Gospel?": {
    text: "The Gospel means \"good news.\" **John** 3:16 sums it up: God loved the world so much He sent His Son so that anyone who believes in Him will not perish but have eternal life. Humanity is separated from God by sin; Jesus died as the substitute, rose from the dead, and offers forgiveness and new life to all who trust Him. **Romans** 1:16 calls it \"the power of God that brings salvation to everyone who believes.\"",
    links: [
      { label: "John 3 — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=3&testament1=nt", type: "book" },
      { label: "Romans — Read", href: "/bible/en/read?version1=niv&book1=romans&chapter1=1&testament1=nt", type: "book" },
      { label: "What Is the Bible?", href: "/bible/en/learn/what-is-bible", type: "learn" },
    ],
  },
  "Bible verses about hope": {
    text: "**Jeremiah** 29:11 is one of the most beloved hope verses: \"For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.\" **Romans** 15:13 says \"May the God of hope fill you with all joy and peace as you trust in him.\" **Lamentations** 3:22-23 reminds us that God's mercies are new every morning — hope rooted in who God is, not in circumstances.",
    links: [
      { label: "Hope", href: "/bible/en/topics/hope", type: "topic" },
      { label: "Jeremiah 29 — Read", href: "/bible/en/read?version1=niv&book1=jeremiah&chapter1=29&testament1=ot", type: "book" },
      { label: "Romans 15 — Read", href: "/bible/en/read?version1=niv&book1=romans&chapter1=15&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about forgiveness?": {
    text: "**Matthew** 6:14-15 is direct: \"If you forgive others their trespasses, your heavenly Father will also forgive you.\" **Ephesians** 4:32 says \"Forgive one another, just as God in Christ has forgiven you.\" Forgiveness in Scripture is not excusing sin — it is releasing the debt to God. **Colossians** 3:13 adds: \"Bear with each other and forgive one another if any of you has a grievance against someone.\"",
    links: [
      { label: "Forgiveness", href: "/bible/en/topics/forgiveness", type: "topic" },
      { label: "Matthew 6 — Read", href: "/bible/en/read?version1=niv&book1=matthew&chapter1=6&testament1=nt", type: "book" },
      { label: "Ephesians 4 — Read", href: "/bible/en/read?version1=niv&book1=ephesians&chapter1=4&testament1=nt", type: "book" },
    ],
  },
  "How do I understand the Old Testament?": {
    text: "The Old Testament covers creation, Israel's history, God's law, prophecy, and poetry — all pointing forward to Jesus. **Luke** 24:27 says Jesus explained how all the Scriptures pointed to Him. The Old Testament shows *who God is* (holy, faithful, just) and *what humanity needs* (rescue, a Savior). The New Testament shows how God fulfilled every promise. Reading **Genesis**, **Psalms**, and **Isaiah** is a great start for the Old Testament.",
    links: [
      { label: "What Is the Bible?", href: "/bible/en/learn/what-is-bible", type: "learn" },
      { label: "Bible Origin", href: "/bible/en/learn/bible-origin", type: "learn" },
      { label: "Genesis — Read", href: "/bible/en/read?version1=niv&book1=genesis&chapter1=1&testament1=ot", type: "book" },
      { label: "Isaiah — Read", href: "/bible/en/read?version1=niv&book1=isaiah&chapter1=1&testament1=ot", type: "book" },
    ],
  },
  "What are the books of the Bible?": {
    text: "The Bible has **66 books** — 39 in the Old Testament and 27 in the New Testament. The Old Testament includes the Law (Genesis–Deuteronomy), History (Joshua–Esther), Poetry (Job–Song of Solomon), and Prophecy (Isaiah–Malachi). The New Testament has the Gospels (Matthew, Mark, Luke, John), Acts, Letters (Romans–Jude), and Revelation. Each book was written by different human authors over ~1,500 years, but tells one unified story.",
    links: [
      { label: "What Is the Bible?", href: "/bible/en/learn/what-is-bible", type: "learn" },
      { label: "Bible Origin", href: "/bible/en/learn/bible-origin", type: "learn" },
      { label: "Start Reading", href: "/bible/en/read?version1=niv&book1=john&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about anger?": {
    text: "**Ephesians** 4:26 says \"In your anger do not sin\" — anger itself is not forbidden, but what we do with it matters. **James** 1:19-20 warns: \"Be slow to speak and slow to become angry, because human anger does not produce the righteousness that God desires.\" **Proverbs** 15:1 says \"A gentle answer turns away wrath.\" Jesus showed righteous anger in the temple but never held personal grudges.",
    links: [
      { label: "Anger", href: "/bible/en/topics/anger", type: "topic" },
      { label: "Ephesians 4 — Read", href: "/bible/en/read?version1=niv&book1=ephesians&chapter1=4&testament1=nt", type: "book" },
      { label: "James 1 — Read", href: "/bible/en/read?version1=niv&book1=james&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "Bible verses about grief and loss": {
    text: "**Psalm** 34:18 says \"The Lord is close to the brokenhearted and saves those who are crushed in spirit.\" **Matthew** 5:4 promises \"Blessed are those who mourn, for they will be comforted.\" **John** 11 shows Jesus weeping at Lazarus's tomb — God is not distant from our grief. **Revelation** 21:4 gives the ultimate hope: \"He will wipe every tear from their eyes.\"",
    links: [
      { label: "Grief", href: "/bible/en/topics/grief", type: "topic" },
      { label: "Psalm 34 — Read", href: "/bible/en/read?version1=niv&book1=psalms&chapter1=34&testament1=ot", type: "book" },
      { label: "John 11 — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=11&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about loneliness?": {
    text: "**Deuteronomy** 31:6 promises: \"The Lord your God goes with you; he will never leave you nor forsake you.\" **Psalm** 68:6 says \"God sets the lonely in families.\" Even Jesus experienced loneliness — crying out in **Matthew** 27:46 — yet God did not abandon Him. The church in **Acts** 2 shows God's design: a community where no one is alone.",
    links: [
      { label: "Loneliness", href: "/bible/en/topics/loneliness", type: "topic" },
      { label: "Psalm 68 — Read", href: "/bible/en/read?version1=niv&book1=psalms&chapter1=68&testament1=ot", type: "book" },
      { label: "Acts 2 — Read", href: "/bible/en/read?version1=niv&book1=acts&chapter1=2&testament1=nt", type: "book" },
    ],
  },
  "How to find joy in the Bible?": {
    text: "Biblical joy is different from happiness — it is not based on circumstances. **Philippians** 4:4 says \"Rejoice in the Lord always\" — written from prison! **Nehemiah** 8:10 declares \"The joy of the Lord is your strength.\" **John** 15:11 records Jesus saying His joy is meant to be in us, and that our joy may be complete. Joy comes from knowing God, not from life going well.",
    links: [
      { label: "Joy", href: "/bible/en/topics/joy", type: "topic" },
      { label: "Philippians 4 — Read", href: "/bible/en/read?version1=niv&book1=philippians&chapter1=4&testament1=nt", type: "book" },
      { label: "John 15 — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=15&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about trust?": {
    text: "**Proverbs** 3:5-6 is the classic verse: \"Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.\" **Psalm** 46:10 says \"Be still, and know that I am God.\" Trusting God in Scripture means releasing control — not passive resignation, but active confidence in His character and promises.",
    links: [
      { label: "Trust", href: "/bible/en/topics/trust", type: "topic" },
      { label: "Proverbs 3 — Read", href: "/bible/en/read?version1=niv&book1=proverbs&chapter1=3&testament1=ot", type: "book" },
      { label: "Psalm 46 — Read", href: "/bible/en/read?version1=niv&book1=psalms&chapter1=46&testament1=ot", type: "book" },
    ],
  },
  "What does the Bible say about worship?": {
    text: "**John** 4:24 says God seeks worshippers who worship \"in the Spirit and in truth\" — not just rituals, but genuine heart engagement. **Romans** 12:1 expands worship beyond songs: offering your body as a living sacrifice is your \"true and proper worship.\" **Psalm** 150 ends the book of Psalms with a full-throated call to praise God with every instrument and breath.",
    links: [
      { label: "Worship", href: "/bible/en/topics/worship", type: "topic" },
      { label: "John 4 — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=4&testament1=nt", type: "book" },
      { label: "Psalm 150 — Read", href: "/bible/en/read?version1=niv&book1=psalms&chapter1=150&testament1=ot", type: "book" },
    ],
  },
  "Who is Jesus Christ?": {
    text: "**John** 1:1,14 opens with: \"In the beginning was the Word... and the Word became flesh.\" Jesus is fully God and fully human — born of a virgin, lived sinlessly, died on the cross as the substitute for sin, rose on the third day, and ascended to heaven. **Colossians** 1:15 calls Him \"the image of the invisible God.\" **John** 14:6 records Jesus saying \"I am the way, the truth, and the life.\"",
    links: [
      { label: "Who Is Jesus?", href: "/bible/en/learn/who-is-jesus", type: "learn" },
      { label: "John 1 — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=1&testament1=nt", type: "book" },
      { label: "Colossians — Overview", href: "/bible/en/book-overviews/colossians", type: "overview" },
    ],
  },
  "What does the Bible say about salvation?": {
    text: "**Ephesians** 2:8-9 is the clearest summary: \"For it is by grace you have been saved, through faith — and this is not from yourselves, it is the gift of God — not by works.\" Salvation is not earned; it is received. **Romans** 10:9-10 says confessing with your mouth and believing in your heart that Jesus rose from the dead brings salvation. God saves, we respond in faith.",
    links: [
      { label: "Salvation", href: "/bible/en/topics/salvation", type: "topic" },
      { label: "Romans 10 — Read", href: "/bible/en/read?version1=niv&book1=romans&chapter1=10&testament1=nt", type: "book" },
      { label: "Ephesians 2 — Read", href: "/bible/en/read?version1=niv&book1=ephesians&chapter1=2&testament1=nt", type: "book" },
    ],
  },
  "What happens after death?": {
    text: "**John** 11:25-26: Jesus said \"I am the resurrection and the life. Whoever believes in me will live, even though they die.\" **Revelation** 21 describes a new heaven and new earth — no more death, pain, or mourning. **2 Corinthians** 5:8 says to be absent from the body is to be present with the Lord. The Bible's consistent message is that death is not the end — resurrection and eternal life await those who trust in Christ.",
    links: [
      { label: "What Happens After Death?", href: "/bible/en/learn/what-happens-after-death", type: "learn" },
      { label: "John 11 — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=11&testament1=nt", type: "book" },
      { label: "Revelation 21 — Read", href: "/bible/en/read?version1=niv&book1=revelation&chapter1=21&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about love?": {
    text: "**1 Corinthians** 13 is the most famous passage: love is patient, kind, not envious or boastful. **1 John** 4:8 says \"God is love\" — love is not merely an attribute of God, it is His very nature. **John** 15:13 says \"Greater love has no one than this: to lay down one's life for one's friends.\" The entire Bible is a story of God's relentless love for humanity.",
    links: [
      { label: "Love", href: "/bible/en/topics/love", type: "topic" },
      { label: "1 Corinthians 13 — Read", href: "/bible/en/read?version1=niv&book1=1-corinthians&chapter1=13&testament1=nt", type: "book" },
      { label: "1 John 4 — Read", href: "/bible/en/read?version1=niv&book1=1-john&chapter1=4&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about marriage?": {
    text: "**Genesis** 2:24 establishes marriage from the beginning: \"A man leaves his father and mother and is united to his wife, and they become one flesh.\" **Ephesians** 5:22-33 uses marriage as a picture of Christ's relationship to the church — mutual love and sacrifice. **Proverbs** 31 and **Song of Solomon** celebrate the beauty of covenant love. Marriage in Scripture is a lifelong, sacrificial commitment.",
    links: [
      { label: "Marriage", href: "/bible/en/topics/marriage", type: "topic" },
      { label: "Ephesians 5 — Read", href: "/bible/en/read?version1=niv&book1=ephesians&chapter1=5&testament1=nt", type: "book" },
      { label: "Genesis 2 — Read", href: "/bible/en/read?version1=niv&book1=genesis&chapter1=2&testament1=ot", type: "book" },
    ],
  },
  "What does the Bible say about friendship?": {
    text: "**Proverbs** 17:17 says \"A friend loves at all times, and a brother is born for a time of adversity.\" **Proverbs** 27:17: \"As iron sharpens iron, so one person sharpens another.\" Jesus called His disciples friends in **John** 15:15. The friendship of David and Jonathan in **1 Samuel** 18-20 is one of Scripture's most beautiful examples — loyal, sacrificial, and God-honoring.",
    links: [
      { label: "Friendship", href: "/bible/en/topics/friendship", type: "topic" },
      { label: "Proverbs 17 — Read", href: "/bible/en/read?version1=niv&book1=proverbs&chapter1=17&testament1=ot", type: "book" },
      { label: "John 15 — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=15&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about wisdom?": {
    text: "**James** 1:5 gives a direct promise: \"If any of you lacks wisdom, you should ask God, who gives generously to all.\" **Proverbs** 1:7 says \"The fear of the Lord is the beginning of wisdom.\" The entire book of **Proverbs** is a treasure of practical wisdom for daily life. **Proverbs** 3:13 says \"Blessed are those who find wisdom, those who gain understanding.\"",
    links: [
      { label: "Wisdom", href: "/bible/en/topics/wisdom", type: "topic" },
      { label: "Proverbs — Read", href: "/bible/en/read?version1=niv&book1=proverbs&chapter1=1&testament1=ot", type: "book" },
      { label: "James 1 — Read", href: "/bible/en/read?version1=niv&book1=james&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "How to find God's purpose for my life?": {
    text: "**Jeremiah** 29:11 assures us God has plans for us. **Romans** 8:28 says \"In all things God works for the good of those who love him, who have been called according to his purpose.\" **Ephesians** 2:10 says \"We are God's handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.\" Purpose in Scripture flows from relationship with God — seek Him, and He clarifies the path.",
    links: [
      { label: "Purpose", href: "/bible/en/topics/purpose", type: "topic" },
      { label: "Romans 8 — Read", href: "/bible/en/read?version1=niv&book1=romans&chapter1=8&testament1=nt", type: "book" },
      { label: "Ephesians 2 — Read", href: "/bible/en/read?version1=niv&book1=ephesians&chapter1=2&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about work?": {
    text: "Work was part of God's design before sin — **Genesis** 2:15 says God placed Adam in the garden to \"work it and take care of it.\" **Colossians** 3:23 says \"Whatever you do, work at it with all your heart, as working for the Lord.\" **Proverbs** is full of wisdom about diligence and stewardship. The Bible elevates ordinary work as a way to serve God and love others.",
    links: [
      { label: "Work", href: "/bible/en/topics/work", type: "topic" },
      { label: "Colossians 3 — Read", href: "/bible/en/read?version1=niv&book1=colossians&chapter1=3&testament1=nt", type: "book" },
      { label: "Proverbs — Read", href: "/bible/en/read?version1=niv&book1=proverbs&chapter1=1&testament1=ot", type: "book" },
    ],
  },
  "What does the Bible say about suffering?": {
    text: "**Romans** 5:3-4 says suffering produces perseverance, character, and hope. **James** 1:2-4 says to \"consider it pure joy\" when facing trials — not because pain is good, but because God uses it. **2 Corinthians** 4:17 calls present sufferings \"light and momentary\" compared to eternal glory. The entire book of **Job** wrestles honestly with suffering. Jesus himself suffered — so He understands ours completely.",
    links: [
      { label: "Suffering", href: "/bible/en/topics/suffering", type: "topic" },
      { label: "Romans 5 — Read", href: "/bible/en/read?version1=niv&book1=romans&chapter1=5&testament1=nt", type: "book" },
      { label: "Job — Overview", href: "/bible/en/book-overviews/job", type: "overview" },
    ],
  },
  "What does the Bible say about doubt?": {
    text: "Doubt is not the opposite of faith — it often coexists with it. **John** 20 shows Thomas doubting the resurrection; Jesus appeared specifically for him, saying \"Stop doubting and believe.\" **Mark** 9:24 records a man crying out: \"I believe; help my unbelief!\" — one of the most honest prayers in Scripture. **Jude** 1:22 says be \"merciful to those who doubt.\" God welcomes honest questions.",
    links: [
      { label: "Faith", href: "/bible/en/topics/faith", type: "topic" },
      { label: "John 20 — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=20&testament1=nt", type: "book" },
      { label: "What Is Faith?", href: "/bible/en/learn/what-is-faith", type: "learn" },
    ],
  },
  "What does the Bible say about healing?": {
    text: "**James** 5:14-15 instructs the church to pray over the sick with anointing oil, believing \"the prayer offered in faith will make the sick person well.\" **Isaiah** 53:5 says \"By his wounds we are healed\" — pointing to both physical and spiritual healing through Christ. Jesus healed throughout the Gospels, demonstrating God's compassion. **Psalm** 103:3 praises God who \"heals all your diseases.\"",
    links: [
      { label: "Healing", href: "/bible/en/topics/healing", type: "topic" },
      { label: "James 5 — Read", href: "/bible/en/read?version1=niv&book1=james&chapter1=5&testament1=nt", type: "book" },
      { label: "Isaiah 53 — Read", href: "/bible/en/read?version1=niv&book1=isaiah&chapter1=53&testament1=ot", type: "book" },
    ],
  },
  "What does the Bible say about humility?": {
    text: "**Philippians** 2:3-4 says \"Do nothing out of selfish ambition or vain conceit. Rather, in humility value others above yourselves.\" Jesus is the supreme model — **Philippians** 2:5-8 describes God becoming a servant and dying on a cross. **Proverbs** 11:2 says \"When pride comes, then comes disgrace, but with humility comes wisdom.\" Humility is not thinking less of yourself — it is thinking of yourself less.",
    links: [
      { label: "Humility", href: "/bible/en/topics/humility", type: "topic" },
      { label: "Philippians 2 — Read", href: "/bible/en/read?version1=niv&book1=philippians&chapter1=2&testament1=nt", type: "book" },
      { label: "Proverbs 11 — Read", href: "/bible/en/read?version1=niv&book1=proverbs&chapter1=11&testament1=ot", type: "book" },
    ],
  },
  "What does the Bible say about gratitude?": {
    text: "**1 Thessalonians** 5:18 says \"Give thanks in all circumstances; for this is God's will for you in Christ Jesus.\" **Psalm** 100:4 says \"Enter his gates with thanksgiving.\" **Colossians** 3:15-17 links gratitude to peace and Christ-centered living. In Scripture, gratitude is not just politeness — it is a posture of the heart that acknowledges every good thing comes from God.",
    links: [
      { label: "Gratitude", href: "/bible/en/topics/gratitude", type: "topic" },
      { label: "Psalm 100 — Read", href: "/bible/en/read?version1=niv&book1=psalms&chapter1=100&testament1=ot", type: "book" },
      { label: "1 Thessalonians 5 — Read", href: "/bible/en/read?version1=niv&book1=1-thessalonians&chapter1=5&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about courage?": {
    text: "**Joshua** 1:9 is the rallying cry: \"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.\" **2 Timothy** 1:7 says God gives a spirit of power, not timidity. **Psalm** 27:1 declares \"The Lord is my light and my salvation — whom shall I fear?\" Biblical courage is not the absence of fear — it is acting despite fear, rooted in God's presence.",
    links: [
      { label: "Courage", href: "/bible/en/topics/courage", type: "topic" },
      { label: "Joshua 1 — Read", href: "/bible/en/read?version1=niv&book1=joshua&chapter1=1&testament1=ot", type: "book" },
      { label: "Psalm 27 — Read", href: "/bible/en/read?version1=niv&book1=psalms&chapter1=27&testament1=ot", type: "book" },
    ],
  },
  "What does the Bible say about patience?": {
    text: "**Romans** 5:3-4 shows patience is forged through suffering. **James** 1:3-4 says the testing of faith produces perseverance. **Psalm** 27:14 says \"Wait for the Lord; be strong and take heart.\" **Lamentations** 3:25-26 promises \"The Lord is good to those whose hope is in him, to the one who seeks him; it is good to wait quietly for the salvation of the Lord.\"",
    links: [
      { label: "Patience", href: "/bible/en/topics/patience", type: "topic" },
      { label: "Romans 5 — Read", href: "/bible/en/read?version1=niv&book1=romans&chapter1=5&testament1=nt", type: "book" },
      { label: "James 1 — Read", href: "/bible/en/read?version1=niv&book1=james&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "What is the New Testament about?": {
    text: "The New Testament has 27 books written after the life, death, and resurrection of Jesus. The four **Gospels** (Matthew, Mark, Luke, John) record Jesus's life. **Acts** tells the early church story. **Paul's letters** (Romans–Philemon) explain the theology of grace and salvation. The **General Letters** (Hebrews–Jude) address Christian living. **Revelation** closes with God's ultimate victory. The New Testament fulfills everything the Old Testament promised.",
    links: [
      { label: "What Is the Bible?", href: "/bible/en/learn/what-is-bible", type: "learn" },
      { label: "John — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=1&testament1=nt", type: "book" },
      { label: "Romans — Read", href: "/bible/en/read?version1=niv&book1=romans&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about money?": {
    text: "**1 Timothy** 6:10 warns \"the love of money is a root of all kinds of evil\" — not money itself, but love of it. **Matthew** 6:24 says you cannot serve both God and money. Yet **Proverbs** has much positive wisdom about diligence and stewardship. **2 Corinthians** 9:7 says \"God loves a cheerful giver.\" The Bible is more about the posture of our hearts toward money than a prohibition on wealth.",
    links: [
      { label: "Money", href: "/bible/en/topics/money", type: "topic" },
      { label: "Matthew 6 — Read", href: "/bible/en/read?version1=niv&book1=matthew&chapter1=6&testament1=nt", type: "book" },
      { label: "Proverbs — Read", href: "/bible/en/read?version1=niv&book1=proverbs&chapter1=1&testament1=ot", type: "book" },
    ],
  },
  "What does the Bible say about sin?": {
    text: "**Romans** 3:23 says \"All have sinned and fall short of the glory of God.\" Sin in Scripture is not just bad behavior — it is a broken relationship with God, the root of all other brokenness. **Romans** 6:23 continues: \"The wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord.\" **1 John** 1:9 gives the remedy: confess, and God is faithful to forgive.",
    links: [
      { label: "Sin", href: "/bible/en/topics/sin", type: "topic" },
      { label: "Romans 3 — Read", href: "/bible/en/read?version1=niv&book1=romans&chapter1=3&testament1=nt", type: "book" },
      { label: "1 John 1 — Read", href: "/bible/en/read?version1=niv&book1=1-john&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "What does the Bible say about heaven?": {
    text: "**Revelation** 21-22 gives the fullest picture: a new heaven and new earth where God dwells with His people, no more death or pain, a city of pure gold and living water. **John** 14:2-3 records Jesus saying \"In my Father's house are many rooms... I am going there to prepare a place for you.\" **1 Corinthians** 2:9 says \"No eye has seen, no ear has heard... what God has prepared for those who love him.\"",
    links: [
      { label: "Heaven", href: "/bible/en/topics/heaven", type: "topic" },
      { label: "Revelation 21 — Read", href: "/bible/en/read?version1=niv&book1=revelation&chapter1=21&testament1=nt", type: "book" },
      { label: "John 14 — Read", href: "/bible/en/read?version1=niv&book1=john&chapter1=14&testament1=nt", type: "book" },
    ],
  },
  "Who wrote the Bible?": {
    text: "The Bible was written by about **40 different human authors** over roughly 1,500 years — kings, shepherds, fishermen, doctors, and prophets. Yet Christians believe it has one divine Author: **2 Timothy** 3:16 says \"All Scripture is God-breathed.\" **2 Peter** 1:21 explains that \"men spoke from God as they were carried along by the Holy Spirit.\" The remarkable unity of its message across so many centuries is itself evidence of divine authorship.",
    links: [
      { label: "Bible Origin", href: "/bible/en/learn/bible-origin", type: "learn" },
      { label: "What Is the Bible?", href: "/bible/en/learn/what-is-bible", type: "learn" },
    ],
  },
  "What is grace?": {
    text: "Grace is God's undeserved favor — giving us what we could never earn. **Ephesians** 2:8-9: \"It is by grace you have been saved, through faith — not by works.\" **Romans** 5:8 shows grace in action: \"While we were still sinners, Christ died for us.\" **2 Corinthians** 12:9 says God's grace is sufficient even in weakness. Grace is the heartbeat of the Gospel — God's love freely given, not earned.",
    links: [
      { label: "Grace", href: "/bible/en/topics/grace", type: "topic" },
      { label: "Romans 5 — Read", href: "/bible/en/read?version1=niv&book1=romans&chapter1=5&testament1=nt", type: "book" },
      { label: "Ephesians 2 — Read", href: "/bible/en/read?version1=niv&book1=ephesians&chapter1=2&testament1=nt", type: "book" },
    ],
  },
};

const STARTER_ANSWERS_VI: Record<string, { text: string; links: NavLink[] }> = {
  "Kinh Thánh nói gì về lo lắng?": {
    text: "**Phi-líp** 4:6-7 là một trong những câu Kinh Thánh mạnh mẽ nhất về sự lo lắng: \"Chớ lo phiền chi hết, nhưng trong mọi sự hãy dùng lời cầu nguyện, nài xin, và sự tạ ơn mà trình các sự cầu xin của mình cho Đức Chúa Trời.\" **Ma-thi-ơ** 6:25-34 cũng nhắc nhở rằng Đức Chúa Trời chăm sóc cho cả chim trời và hoa cỏ — huống chi là bạn. Cầu nguyện và phó thác là câu trả lời nhất quán của Kinh Thánh cho sự lo âu.",
    links: [
      { label: "Lo lắng", href: "/bible/vi/topics/anxiety", type: "topic" },
      { label: "Bình an", href: "/bible/vi/topics/peace", type: "topic" },
      { label: "Phi-líp — Đọc", href: "/bible/vi/read?version1=vi&book1=philippians&chapter1=4&testament1=nt", type: "book" },
    ],
  },
  "Tôi nên bắt đầu đọc từ đâu?": {
    text: "Điểm bắt đầu tốt nhất cho hầu hết mọi người là Phúc âm **Giăng** — kể câu chuyện về Chúa Giêsu một cách sâu sắc và trả lời câu hỏi lớn: Ngài là ai? Sau Giăng, hãy đọc **Thi Thiên** để tìm những lời cầu nguyện chân thật về mọi cảm xúc con người, và **Châm Ngôn** cho sự khôn ngoan thực tế hàng ngày.",
    links: [
      { label: "Bắt đầu học", href: "/bible/vi/learn", type: "learn" },
      { label: "Giăng — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=1&testament1=nt", type: "book" },
      { label: "Giăng — Tổng quan", href: "/bible/vi/book-overviews/john", type: "overview" },
      { label: "Thi Thiên — Đọc", href: "/bible/vi/read?version1=vi&book1=psalms&chapter1=1&testament1=ot", type: "book" },
      { label: "Chúa Giêsu là ai?", href: "/bible/vi/learn/who-is-jesus", type: "learn" },
    ],
  },
  "Chủ đề về các mối quan hệ?": {
    text: "Kinh Thánh có nhiều lời khuyên quý báu về mọi loại mối quan hệ. **1 Cô-rinh-tô** 13 định nghĩa tình yêu một cách đẹp đẽ. **Ê-phê-sô** 5 nói về hôn nhân. **Châm Ngôn** 17:17 nói \"Bạn hữu thương nhau luôn luôn.\" Có nhiều chủ đề về tình yêu, hôn nhân, gia đình, sự tha thứ và xung đột.",
    links: [
      { label: "Tình yêu thương", href: "/bible/vi/topics/love", type: "topic" },
      { label: "Hôn nhân", href: "/bible/vi/topics/marriage", type: "topic" },
      { label: "Sự tha thứ", href: "/bible/vi/topics/forgiveness", type: "topic" },
      { label: "Gia đình", href: "/bible/vi/topics/family", type: "topic" },
    ],
  },
  "Cho tôi biết về đức tin": {
    text: "**Hê-bơ-rơ** 11:1 đưa ra định nghĩa kinh điển: \"Đức tin là sự biết chắc vững vàng của những điều mình đang trông mong.\" Đức tin trong Kinh Thánh không chỉ là tin tưởng — mà còn là hành động. **Rô-ma** 10:17 nói đức tin đến bởi nghe Lời Đức Chúa Trời. Sách **Gia-cơ** cho thấy đức tin thật sự sinh ra việc làm tốt lành.",
    links: [
      { label: "Đức tin", href: "/bible/vi/topics/faith", type: "topic" },
      { label: "Đức tin là gì?", href: "/bible/vi/learn/what-is-faith", type: "learn" },
      { label: "Hê-bơ-rơ — Đọc", href: "/bible/vi/read?version1=vi&book1=hebrews&chapter1=11&testament1=nt", type: "book" },
      { label: "Rô-ma — Đọc", href: "/bible/vi/read?version1=vi&book1=romans&chapter1=10&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự sợ hãi?": {
    text: "**Ê-sai** 41:10 là câu an ủi sâu sắc: \"Đừng sợ, vì Ta ở với ngươi; đừng kinh hãi, vì Ta là Đức Chúa Trời ngươi.\" **2 Ti-mô-thê** 1:7 nhắc nhở: \"Đức Chúa Trời không ban cho chúng ta tinh thần nhút nhát, bèn là tinh thần mạnh mẽ, yêu thương và tự chủ.\" **Thi Thiên** 23 bước qua thung lũng tối tăm với sự bình an — vì Đức Chúa Trời ở cùng.",
    links: [
      { label: "Sợ hãi", href: "/bible/vi/topics/fear", type: "topic" },
      { label: "Ê-sai 41 — Đọc", href: "/bible/vi/read?version1=vi&book1=isaiah&chapter1=41&testament1=ot", type: "book" },
      { label: "Thi Thiên 23 — Đọc", href: "/bible/vi/read?version1=vi&book1=psalms&chapter1=23&testament1=ot", type: "book" },
    ],
  },
  "Cho tôi biết về cầu nguyện": {
    text: "Chúa Giêsu đích thân dạy chúng ta cầu nguyện qua **Ma-thi-ơ** 6:9-13 — Bài Cầu Nguyện Chúa. **Phi-líp** 4:6-7 nói hãy cầu nguyện về mọi sự và sự bình an của Đức Chúa Trời sẽ gìn giữ lòng bạn. **Gia-cơ** 5:16 nói \"Lời cầu nguyện của người công bình có hiệu lực rất lớn.\" Cầu nguyện là cuộc trò chuyện trực tiếp với Đức Chúa Trời.",
    links: [
      { label: "Cầu nguyện", href: "/bible/vi/topics/prayer", type: "topic" },
      { label: "Ma-thi-ơ 6 — Đọc", href: "/bible/vi/read?version1=vi&book1=matthew&chapter1=6&testament1=nt", type: "book" },
      { label: "Phi-líp 4 — Đọc", href: "/bible/vi/read?version1=vi&book1=philippians&chapter1=4&testament1=nt", type: "book" },
    ],
  },
  "Đức Thánh Linh là ai?": {
    text: "Đức Thánh Linh là ngôi thứ ba trong Ba Ngôi — hoàn toàn là Đức Chúa Trời. **Giăng** 14:26 nói Chúa Giêsu sai Đức Thánh Linh đến là Đấng Phù Hộ và Dạy Dỗ, \"Ngài sẽ nhắc nhở các ngươi nhớ mọi điều Ta đã phán.\" **Công Vụ** 2 cho thấy Đức Thánh Linh đến trong ngày Lễ Ngũ Tuần với quyền năng. **Rô-ma** 8 mô tả Đức Thánh Linh cầu nguyện cho chúng ta và xác nhận chúng ta là con cái Đức Chúa Trời.",
    links: [
      { label: "Chúa Giêsu là ai?", href: "/bible/vi/learn/who-is-jesus", type: "learn" },
      { label: "Giăng 14 — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=14&testament1=nt", type: "book" },
      { label: "Công Vụ 2 — Đọc", href: "/bible/vi/read?version1=vi&book1=acts&chapter1=2&testament1=nt", type: "book" },
    ],
  },
  "Tin Lành là gì?": {
    text: "Tin Lành có nghĩa là \"tin mừng.\" **Giăng** 3:16 tóm tắt: Đức Chúa Trời yêu thương thế gian đến nỗi ban Con Một Ngài, hễ ai tin vào Ngài thì không bị hư mất mà được sự sống đời đời. Nhân loại bị ngăn cách khỏi Đức Chúa Trời vì tội lỗi; Chúa Giêsu chết thay, sống lại, và ban sự tha thứ cùng sự sống mới cho tất cả những ai tin Ngài.",
    links: [
      { label: "Giăng 3 — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=3&testament1=nt", type: "book" },
      { label: "Rô-ma — Đọc", href: "/bible/vi/read?version1=vi&book1=romans&chapter1=1&testament1=nt", type: "book" },
      { label: "Kinh Thánh là gì?", href: "/bible/vi/learn/what-is-bible", type: "learn" },
    ],
  },
  "Câu Kinh Thánh về hy vọng": {
    text: "**Giê-rê-mi** 29:11 là câu được yêu thích nhất: \"Vì Ta biết những ý tưởng Ta nghĩ đến các ngươi, là ý tưởng bình an, không phải tai họa, để cho các ngươi một tương lai và một hi vọng.\" **Rô-ma** 15:13 nói \"Nguyện Đức Chúa Trời là nguồn hy vọng đổ đầy anh em mọi thứ vui mừng và bình an.\" **Ca Thương** 3:22-23 nhắc nhở rằng ân điển của Đức Chúa Trời mới mỗi buổi sáng.",
    links: [
      { label: "Hy vọng", href: "/bible/vi/topics/hope", type: "topic" },
      { label: "Giê-rê-mi 29 — Đọc", href: "/bible/vi/read?version1=vi&book1=jeremiah&chapter1=29&testament1=ot", type: "book" },
      { label: "Rô-ma 15 — Đọc", href: "/bible/vi/read?version1=vi&book1=romans&chapter1=15&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự tha thứ?": {
    text: "**Ma-thi-ơ** 6:14-15 rõ ràng: \"Nếu các ngươi tha lỗi cho người ta, thì Cha các ngươi ở trên trời cũng sẽ tha lỗi cho các ngươi.\" **Ê-phê-sô** 4:32 nói \"Hãy tha thứ nhau, như Đức Chúa Trời đã tha thứ anh em trong Đấng Christ.\" Sự tha thứ trong Kinh Thánh không phải là bỏ qua tội lỗi — mà là phó gánh nặng đó cho Đức Chúa Trời.",
    links: [
      { label: "Sự tha thứ", href: "/bible/vi/topics/forgiveness", type: "topic" },
      { label: "Ma-thi-ơ 6 — Đọc", href: "/bible/vi/read?version1=vi&book1=matthew&chapter1=6&testament1=nt", type: "book" },
      { label: "Ê-phê-sô 4 — Đọc", href: "/bible/vi/read?version1=vi&book1=ephesians&chapter1=4&testament1=nt", type: "book" },
    ],
  },
  "Làm thế nào để hiểu Cựu Ước?": {
    text: "Cựu Ước bao gồm sự sáng tạo, lịch sử dân Israel, luật pháp Đức Chúa Trời, tiên tri và thơ ca — tất cả đều hướng về Chúa Giêsu. **Lu-ca** 24:27 nói Chúa Giêsu giải thích cách mọi Kinh Thánh đều chỉ về Ngài. Cựu Ước cho thấy *Đức Chúa Trời là ai* và *con người cần gì*. Đọc **Sáng Thế Ký**, **Thi Thiên** và **Ê-sai** là điểm khởi đầu tốt.",
    links: [
      { label: "Kinh Thánh là gì?", href: "/bible/vi/learn/what-is-bible", type: "learn" },
      { label: "Nguồn gốc Kinh Thánh", href: "/bible/vi/learn/bible-origin", type: "learn" },
      { label: "Sáng Thế Ký — Đọc", href: "/bible/vi/read?version1=vi&book1=genesis&chapter1=1&testament1=ot", type: "book" },
    ],
  },
  "Kinh Thánh có những sách nào?": {
    text: "Kinh Thánh có **66 sách** — 39 sách Cựu Ước và 27 sách Tân Ước. Cựu Ước gồm Luật Pháp (Sáng Thế Ký–Phục Truyền), Lịch sử (Giô-suê–Ê-xơ-tê), Thơ ca (Gióp–Nhã Ca) và Tiên tri (Ê-sai–Ma-la-chi). Tân Ước gồm Phúc Âm (Ma-thi-ơ, Mác, Lu-ca, Giăng), Công Vụ, Thư tín (Rô-ma–Giu-đe) và Khải Huyền.",
    links: [
      { label: "Kinh Thánh là gì?", href: "/bible/vi/learn/what-is-bible", type: "learn" },
      { label: "Nguồn gốc Kinh Thánh", href: "/bible/vi/learn/bible-origin", type: "learn" },
      { label: "Bắt đầu đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự tức giận?": {
    text: "**Ê-phê-sô** 4:26 nói \"Hãy nổi giận nhưng đừng phạm tội\" — sự tức giận không bị cấm, nhưng điều chúng ta làm với nó mới quan trọng. **Gia-cơ** 1:19-20 cảnh báo \"Hãy mau nghe, chậm nói, chậm giận; vì cơn giận của người không làm ra sự công bình của Đức Chúa Trời.\" **Châm Ngôn** 15:1 nói \"Lời êm ái làm nguôi cơn giận.\"",
    links: [
      { label: "Sự tức giận", href: "/bible/vi/topics/anger", type: "topic" },
      { label: "Ê-phê-sô 4 — Đọc", href: "/bible/vi/read?version1=vi&book1=ephesians&chapter1=4&testament1=nt", type: "book" },
      { label: "Gia-cơ 1 — Đọc", href: "/bible/vi/read?version1=vi&book1=james&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "Câu Kinh Thánh về đau buồn và mất mát": {
    text: "**Thi Thiên** 34:18 nói \"Đức Giê-hô-va ở gần những kẻ có lòng tan vỡ.\" **Ma-thi-ơ** 5:4 hứa \"Phước cho những kẻ than khóc, vì sẽ được yên ủi.\" **Giăng** 11 cho thấy Chúa Giêsu khóc trước mộ La-xa-rơ — Đức Chúa Trời không xa cách nỗi đau của chúng ta. **Khải Huyền** 21:4 ban hy vọng tối thượng: \"Ngài sẽ lau ráo hết nước mắt khỏi mắt họ.\"",
    links: [
      { label: "Đau buồn", href: "/bible/vi/topics/grief", type: "topic" },
      { label: "Thi Thiên 34 — Đọc", href: "/bible/vi/read?version1=vi&book1=psalms&chapter1=34&testament1=ot", type: "book" },
      { label: "Giăng 11 — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=11&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự cô đơn?": {
    text: "**Phục Truyền** 31:6 hứa rằng \"Đức Giê-hô-va Đức Chúa Trời ngươi đi cùng ngươi; Ngài chẳng lìa ngươi, chẳng từ bỏ ngươi đâu.\" **Thi Thiên** 68:6 nói \"Đức Chúa Trời lập kẻ cô độc thành hộ gia đình.\" Chúa Giêsu cũng trải qua sự cô đơn — nhưng Đức Chúa Trời không bỏ rơi Ngài. Hội thánh trong **Công Vụ** 2 cho thấy thiết kế của Đức Chúa Trời: một cộng đồng không ai cô đơn.",
    links: [
      { label: "Cô đơn", href: "/bible/vi/topics/loneliness", type: "topic" },
      { label: "Thi Thiên 68 — Đọc", href: "/bible/vi/read?version1=vi&book1=psalms&chapter1=68&testament1=ot", type: "book" },
      { label: "Công Vụ 2 — Đọc", href: "/bible/vi/read?version1=vi&book1=acts&chapter1=2&testament1=nt", type: "book" },
    ],
  },
  "Làm thế nào để tìm niềm vui trong Kinh Thánh?": {
    text: "Niềm vui trong Kinh Thánh khác với hạnh phúc — nó không phụ thuộc vào hoàn cảnh. **Phi-líp** 4:4 nói \"Hãy vui mừng trong Chúa luôn luôn\" — được viết từ trong tù! **Nê-hê-mi** 8:10 tuyên bố \"Sự vui vẻ của Đức Giê-hô-va là sức lực của các ngươi.\" **Giăng** 15:11 ghi lại lời Chúa Giêsu rằng niềm vui của Ngài là để ở trong chúng ta.",
    links: [
      { label: "Niềm vui", href: "/bible/vi/topics/joy", type: "topic" },
      { label: "Phi-líp 4 — Đọc", href: "/bible/vi/read?version1=vi&book1=philippians&chapter1=4&testament1=nt", type: "book" },
      { label: "Giăng 15 — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=15&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự tin tưởng?": {
    text: "**Châm Ngôn** 3:5-6 là câu kinh điển: \"Hãy hết lòng tin cậy Đức Giê-hô-va, chớ nương cậy vào sự thông sáng của con; phàm trong các việc làm của con, hãy nhận biết Ngài, thì Ngài sẽ chỉ dẫn các nẻo của con.\" **Thi Thiên** 46:10 nói \"Hãy yên lặng và biết rằng Ta là Đức Chúa Trời.\"",
    links: [
      { label: "Tin tưởng", href: "/bible/vi/topics/trust", type: "topic" },
      { label: "Châm Ngôn 3 — Đọc", href: "/bible/vi/read?version1=vi&book1=proverbs&chapter1=3&testament1=ot", type: "book" },
      { label: "Thi Thiên 46 — Đọc", href: "/bible/vi/read?version1=vi&book1=psalms&chapter1=46&testament1=ot", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự thờ phượng?": {
    text: "**Giăng** 4:24 nói Đức Chúa Trời tìm kiếm những người thờ phượng \"trong tâm thần và lẽ thật\" — không chỉ nghi lễ, mà là tấm lòng chân thật. **Rô-ma** 12:1 mở rộng sự thờ phượng ra ngoài bài hát: dâng thân mình làm của lễ sống chính là sự thờ phượng thật. **Thi Thiên** 150 kết thúc toàn bộ sách Thi Thiên bằng lời kêu gọi ca ngợi Đức Chúa Trời bằng mọi nhạc cụ.",
    links: [
      { label: "Thờ phượng", href: "/bible/vi/topics/worship", type: "topic" },
      { label: "Giăng 4 — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=4&testament1=nt", type: "book" },
      { label: "Thi Thiên 150 — Đọc", href: "/bible/vi/read?version1=vi&book1=psalms&chapter1=150&testament1=ot", type: "book" },
    ],
  },
  "Chúa Giêsu là ai?": {
    text: "**Giăng** 1:1,14 mở đầu: \"Ban đầu có Ngôi Lời... Ngôi Lời đã trở nên xác thịt.\" Chúa Giêsu vừa hoàn toàn là Đức Chúa Trời vừa hoàn toàn là con người — sinh từ trinh nữ, sống vô tội, chết trên thập tự giá thay cho tội lỗi, sống lại ngày thứ ba và thăng thiên. **Cô-lô-se** 1:15 gọi Ngài là \"hình ảnh của Đức Chúa Trời vô hình.\" **Giăng** 14:6: \"Ta là đường đi, lẽ thật và sự sống.\"",
    links: [
      { label: "Chúa Giêsu là ai?", href: "/bible/vi/learn/who-is-jesus", type: "learn" },
      { label: "Giăng 1 — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=1&testament1=nt", type: "book" },
      { label: "Cô-lô-se — Tổng quan", href: "/bible/vi/book-overviews/colossians", type: "overview" },
    ],
  },
  "Kinh Thánh nói gì về sự cứu rỗi?": {
    text: "**Ê-phê-sô** 2:8-9 là tóm tắt rõ ràng nhất: \"Vì nhờ ân điển, bởi đức tin, mà anh em được cứu — điều đó không phải đến từ anh em, bèn là sự ban cho của Đức Chúa Trời; không phải bởi việc làm.\" Sự cứu rỗi không thể kiếm được; nó được nhận lãnh. **Rô-ma** 10:9-10 nói nhận Chúa và tin Ngài sống lại thì được cứu.",
    links: [
      { label: "Sự cứu rỗi", href: "/bible/vi/topics/salvation", type: "topic" },
      { label: "Rô-ma 10 — Đọc", href: "/bible/vi/read?version1=vi&book1=romans&chapter1=10&testament1=nt", type: "book" },
      { label: "Ê-phê-sô 2 — Đọc", href: "/bible/vi/read?version1=vi&book1=ephesians&chapter1=2&testament1=nt", type: "book" },
    ],
  },
  "Điều gì xảy ra sau khi chết?": {
    text: "**Giăng** 11:25-26: Chúa Giêsu nói \"Ta là sự sống lại và sự sống; kẻ nào tin Ta thì sẽ sống, dù đã chết.\" **Khải Huyền** 21 mô tả trời mới đất mới — không còn sự chết, đau đớn hay than khóc. **2 Cô-rinh-tô** 5:8 nói xa cách thân xác là ở cùng Chúa. Sứ điệp nhất quán của Kinh Thánh: sự chết không phải là kết thúc — sự phục sinh và sự sống đời đời chờ đón những người tin Chúa.",
    links: [
      { label: "Điều gì xảy ra sau khi chết?", href: "/bible/vi/learn/what-happens-after-death", type: "learn" },
      { label: "Giăng 11 — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=11&testament1=nt", type: "book" },
      { label: "Khải Huyền 21 — Đọc", href: "/bible/vi/read?version1=vi&book1=revelation&chapter1=21&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về tình yêu?": {
    text: "**1 Cô-rinh-tô** 13 là đoạn nổi tiếng nhất: tình yêu nhịn nhục, nhân từ, không ghen ghét hay khoe mình. **1 Giăng** 4:8 nói \"Đức Chúa Trời là tình yêu\" — tình yêu không chỉ là thuộc tính của Ngài mà là bản chất của Ngài. **Giăng** 15:13: \"Chẳng có tình yêu nào lớn hơn là người vì bạn hữu mình mà bỏ mạng sống.\"",
    links: [
      { label: "Tình yêu thương", href: "/bible/vi/topics/love", type: "topic" },
      { label: "1 Cô-rinh-tô 13 — Đọc", href: "/bible/vi/read?version1=vi&book1=1-corinthians&chapter1=13&testament1=nt", type: "book" },
      { label: "1 Giăng 4 — Đọc", href: "/bible/vi/read?version1=vi&book1=1-john&chapter1=4&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về hôn nhân?": {
    text: "**Sáng Thế Ký** 2:24 thiết lập hôn nhân từ buổi ban đầu: \"Người đàn ông lìa cha mẹ mà kết hợp với vợ mình, hai người thành một thịt.\" **Ê-phê-sô** 5:22-33 dùng hôn nhân làm hình ảnh về mối quan hệ của Chúa Giêsu với Hội thánh — yêu thương và hy sinh lẫn nhau. Hôn nhân trong Kinh Thánh là giao ước trọn đời.",
    links: [
      { label: "Hôn nhân", href: "/bible/vi/topics/marriage", type: "topic" },
      { label: "Ê-phê-sô 5 — Đọc", href: "/bible/vi/read?version1=vi&book1=ephesians&chapter1=5&testament1=nt", type: "book" },
      { label: "Sáng Thế Ký 2 — Đọc", href: "/bible/vi/read?version1=vi&book1=genesis&chapter1=2&testament1=ot", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về tình bạn?": {
    text: "**Châm Ngôn** 17:17 nói \"Bạn hữu thương nhau luôn luôn, và anh em được sinh ra để giúp đỡ trong hoạn nạn.\" **Châm Ngôn** 27:17: \"Sắt mài sắt thế nào, thì người mài bén người khác thể ấy.\" Chúa Giêsu gọi các môn đồ là bạn hữu trong **Giăng** 15:15. Tình bạn của Đa-vít và Giô-na-than là một trong những ví dụ đẹp nhất trong Kinh Thánh.",
    links: [
      { label: "Tình bạn", href: "/bible/vi/topics/friendship", type: "topic" },
      { label: "Châm Ngôn 17 — Đọc", href: "/bible/vi/read?version1=vi&book1=proverbs&chapter1=17&testament1=ot", type: "book" },
      { label: "Giăng 15 — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=15&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự khôn ngoan?": {
    text: "**Gia-cơ** 1:5 hứa trực tiếp: \"Nếu ai trong anh em thiếu sự khôn ngoan, hãy cầu xin Đức Chúa Trời, Ngài ban cho mọi người cách rộng rãi.\" **Châm Ngôn** 1:7 nói \"Kính sợ Đức Giê-hô-va là khởi đầu sự khôn ngoan.\" Toàn bộ sách **Châm Ngôn** là kho báu của sự khôn ngoan thực tế cho cuộc sống hàng ngày.",
    links: [
      { label: "Sự khôn ngoan", href: "/bible/vi/topics/wisdom", type: "topic" },
      { label: "Châm Ngôn — Đọc", href: "/bible/vi/read?version1=vi&book1=proverbs&chapter1=1&testament1=ot", type: "book" },
      { label: "Gia-cơ 1 — Đọc", href: "/bible/vi/read?version1=vi&book1=james&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "Làm thế nào để tìm mục đích của Đức Chúa Trời cho cuộc đời tôi?": {
    text: "**Giê-rê-mi** 29:11 đảm bảo Đức Chúa Trời có kế hoạch cho chúng ta. **Rô-ma** 8:28 nói \"Mọi sự hiệp lại làm ích cho kẻ yêu mến Đức Chúa Trời, tức là cho kẻ được gọi theo ý muốn Ngài.\" **Ê-phê-sô** 2:10 nói \"Chúng ta là công việc của Ngài, đã được dựng nên trong Đức Chúa Giêsu Christ để làm việc lành.\" Mục đích đến từ mối quan hệ với Đức Chúa Trời.",
    links: [
      { label: "Mục đích", href: "/bible/vi/topics/purpose", type: "topic" },
      { label: "Rô-ma 8 — Đọc", href: "/bible/vi/read?version1=vi&book1=romans&chapter1=8&testament1=nt", type: "book" },
      { label: "Ê-phê-sô 2 — Đọc", href: "/bible/vi/read?version1=vi&book1=ephesians&chapter1=2&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về công việc?": {
    text: "Công việc là một phần trong thiết kế của Đức Chúa Trời trước khi tội lỗi — **Sáng Thế Ký** 2:15 nói Đức Chúa Trời đặt A-đam trong vườn để \"trồng trọt và giữ gìn.\" **Cô-lô-se** 3:23 nói \"Hễ làm việc gì, hãy hết lòng mà làm, như làm cho Chúa.\" Kinh Thánh nâng cao công việc bình thường như một cách phục vụ Đức Chúa Trời và yêu thương người khác.",
    links: [
      { label: "Công việc", href: "/bible/vi/topics/work", type: "topic" },
      { label: "Cô-lô-se 3 — Đọc", href: "/bible/vi/read?version1=vi&book1=colossians&chapter1=3&testament1=nt", type: "book" },
      { label: "Châm Ngôn — Đọc", href: "/bible/vi/read?version1=vi&book1=proverbs&chapter1=1&testament1=ot", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự đau khổ?": {
    text: "**Rô-ma** 5:3-4 nói sự đau khổ sinh ra sự nhịn nhục, phẩm giá và hy vọng. **Gia-cơ** 1:2-4 kêu gọi \"xem sự thử thách là điều vui mừng\" — không phải vì đau đớn là tốt, mà vì Đức Chúa Trời dùng nó. Sách **Gióp** đương đầu thành thật với sự đau khổ. Chúa Giêsu đau khổ — nên Ngài hoàn toàn hiểu nỗi đau của chúng ta.",
    links: [
      { label: "Đau khổ", href: "/bible/vi/topics/suffering", type: "topic" },
      { label: "Rô-ma 5 — Đọc", href: "/bible/vi/read?version1=vi&book1=romans&chapter1=5&testament1=nt", type: "book" },
      { label: "Gióp — Tổng quan", href: "/bible/vi/book-overviews/job", type: "overview" },
    ],
  },
  "Kinh Thánh nói gì về sự nghi ngờ?": {
    text: "Sự nghi ngờ không phải là đối lập với đức tin — chúng thường cùng tồn tại. **Giăng** 20 cho thấy Thô-ma nghi ngờ sự phục sinh; Chúa Giêsu hiện ra đặc biệt cho ông. **Mác** 9:24 ghi lại lời cầu nguyện thành thật: \"Tôi tin! Xin Ngài giúp lòng tin yếu kém của tôi!\" **Giu-đe** 1:22 nói hãy thương xót những người nghi ngờ. Đức Chúa Trời chào đón những câu hỏi thành thật.",
    links: [
      { label: "Đức tin", href: "/bible/vi/topics/faith", type: "topic" },
      { label: "Giăng 20 — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=20&testament1=nt", type: "book" },
      { label: "Đức tin là gì?", href: "/bible/vi/learn/what-is-faith", type: "learn" },
    ],
  },
  "Kinh Thánh nói gì về sự chữa lành?": {
    text: "**Gia-cơ** 5:14-15 hướng dẫn Hội thánh cầu nguyện cho người bệnh với dầu xức, tin rằng \"lời cầu nguyện bởi đức tin sẽ chữa lành kẻ bệnh.\" **Ê-sai** 53:5 nói \"Bởi những vết thương Ngài mà chúng ta được lành\" — chỉ về sự chữa lành cả thể xác lẫn tâm linh qua Đấng Christ. **Thi Thiên** 103:3 ca ngợi Đức Chúa Trời \"chữa lành mọi bệnh tật của ngươi.\"",
    links: [
      { label: "Sự chữa lành", href: "/bible/vi/topics/healing", type: "topic" },
      { label: "Gia-cơ 5 — Đọc", href: "/bible/vi/read?version1=vi&book1=james&chapter1=5&testament1=nt", type: "book" },
      { label: "Ê-sai 53 — Đọc", href: "/bible/vi/read?version1=vi&book1=isaiah&chapter1=53&testament1=ot", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự khiêm nhường?": {
    text: "**Phi-líp** 2:3-4 nói \"Chớ làm chi vì lòng tư lợi; nhưng hãy lấy lòng khiêm nhường coi người khác trọng hơn mình.\" Chúa Giêsu là tấm gương tối thượng — **Phi-líp** 2:5-8 mô tả Đức Chúa Trời trở thành đầy tớ và chết trên thập tự giá. **Châm Ngôn** 11:2 nói \"Kiêu ngạo đến thì sỉ nhục đến; nhưng khôn ngoan ở với người khiêm tốn.\"",
    links: [
      { label: "Sự khiêm nhường", href: "/bible/vi/topics/humility", type: "topic" },
      { label: "Phi-líp 2 — Đọc", href: "/bible/vi/read?version1=vi&book1=philippians&chapter1=2&testament1=nt", type: "book" },
      { label: "Châm Ngôn 11 — Đọc", href: "/bible/vi/read?version1=vi&book1=proverbs&chapter1=11&testament1=ot", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về lòng biết ơn?": {
    text: "**1 Tê-sa-lô-ni-ca** 5:18 nói \"Hãy tạ ơn trong mọi hoàn cảnh; vì ý muốn Đức Chúa Trời trong Đức Chúa Giêsu Christ đối với anh em là như vậy.\" **Thi Thiên** 100:4 nói \"Hãy vào các cổng Ngài với sự cảm tạ.\" Trong Kinh Thánh, lòng biết ơn không chỉ là phép lịch sự — đó là tư thế của tấm lòng nhận biết mọi điều tốt lành đến từ Đức Chúa Trời.",
    links: [
      { label: "Lòng biết ơn", href: "/bible/vi/topics/gratitude", type: "topic" },
      { label: "Thi Thiên 100 — Đọc", href: "/bible/vi/read?version1=vi&book1=psalms&chapter1=100&testament1=ot", type: "book" },
      { label: "1 Tê-sa-lô-ni-ca 5 — Đọc", href: "/bible/vi/read?version1=vi&book1=1-thessalonians&chapter1=5&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự dũng cảm?": {
    text: "**Giô-suê** 1:9 là lời kêu gọi mạnh mẽ: \"Hãy vững lòng bền chí! Đừng sợ hãi, đừng kinh khiếp; vì Giê-hô-va Đức Chúa Trời ngươi ở cùng ngươi trong mọi nơi ngươi đi.\" **2 Ti-mô-thê** 1:7 nói Đức Chúa Trời ban tinh thần mạnh mẽ, không phải nhút nhát. **Thi Thiên** 27:1: \"Đức Giê-hô-va là ánh sáng và sự cứu rỗi của tôi; tôi sẽ sợ ai?\"",
    links: [
      { label: "Sự dũng cảm", href: "/bible/vi/topics/courage", type: "topic" },
      { label: "Giô-suê 1 — Đọc", href: "/bible/vi/read?version1=vi&book1=joshua&chapter1=1&testament1=ot", type: "book" },
      { label: "Thi Thiên 27 — Đọc", href: "/bible/vi/read?version1=vi&book1=psalms&chapter1=27&testament1=ot", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về sự kiên nhẫn?": {
    text: "**Rô-ma** 5:3-4 cho thấy sự kiên nhẫn được rèn giũa qua thử thách. **Gia-cơ** 1:3-4 nói sự thử thách đức tin sinh ra sự nhịn nhục. **Thi Thiên** 27:14 nói \"Hãy trông đợi Đức Giê-hô-va; hãy vững lòng, bền chí.\" **Ca Thương** 3:25-26 hứa \"Đức Giê-hô-va là tốt lành cho kẻ trông đợi Ngài; hầu đến cùng linh hồn tìm kiếm Ngài.\"",
    links: [
      { label: "Sự kiên nhẫn", href: "/bible/vi/topics/patience", type: "topic" },
      { label: "Rô-ma 5 — Đọc", href: "/bible/vi/read?version1=vi&book1=romans&chapter1=5&testament1=nt", type: "book" },
      { label: "Gia-cơ 1 — Đọc", href: "/bible/vi/read?version1=vi&book1=james&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "Tân Ước nói về điều gì?": {
    text: "Tân Ước có 27 sách được viết sau cuộc đời, cái chết và sự phục sinh của Chúa Giêsu. Bốn **Phúc Âm** (Ma-thi-ơ, Mác, Lu-ca, Giăng) ghi lại cuộc đời Chúa Giêsu. **Công Vụ** kể câu chuyện Hội thánh đầu tiên. **Các thư của Phao-lô** giải thích thần học về ân điển và sự cứu rỗi. **Khải Huyền** kết thúc bằng chiến thắng tối thượng của Đức Chúa Trời.",
    links: [
      { label: "Kinh Thánh là gì?", href: "/bible/vi/learn/what-is-bible", type: "learn" },
      { label: "Giăng — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=1&testament1=nt", type: "book" },
      { label: "Rô-ma — Đọc", href: "/bible/vi/read?version1=vi&book1=romans&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về tiền bạc?": {
    text: "**1 Ti-mô-thê** 6:10 cảnh báo \"Sự tham tiền bạc là cội rễ mọi điều ác\" — không phải tiền bạc, mà là tình yêu đối với tiền bạc. **Ma-thi-ơ** 6:24 nói bạn không thể phục vụ cả Đức Chúa Trời lẫn tiền bạc. **2 Cô-rinh-tô** 9:7 nói \"Đức Chúa Trời yêu người dâng hiến vui lòng.\" Kinh Thánh quan tâm đến thái độ của lòng chúng ta đối với tiền bạc hơn là việc cấm giàu có.",
    links: [
      { label: "Tiền bạc", href: "/bible/vi/topics/money", type: "topic" },
      { label: "Ma-thi-ơ 6 — Đọc", href: "/bible/vi/read?version1=vi&book1=matthew&chapter1=6&testament1=nt", type: "book" },
      { label: "Châm Ngôn — Đọc", href: "/bible/vi/read?version1=vi&book1=proverbs&chapter1=1&testament1=ot", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về tội lỗi?": {
    text: "**Rô-ma** 3:23 nói \"Mọi người đều đã phạm tội, thiếu mất sự vinh hiển của Đức Chúa Trời.\" Tội lỗi trong Kinh Thánh không chỉ là hành vi xấu — mà là mối quan hệ tan vỡ với Đức Chúa Trời. **Rô-ma** 6:23 tiếp tục: \"Tiền công của tội lỗi là sự chết; nhưng sự ban cho của Đức Chúa Trời là sự sống đời đời.\" **1 Giăng** 1:9 cho biết cách chữa lành: xưng tội, và Đức Chúa Trời thành tín tha thứ.",
    links: [
      { label: "Tội lỗi", href: "/bible/vi/topics/sin", type: "topic" },
      { label: "Rô-ma 3 — Đọc", href: "/bible/vi/read?version1=vi&book1=romans&chapter1=3&testament1=nt", type: "book" },
      { label: "1 Giăng 1 — Đọc", href: "/bible/vi/read?version1=vi&book1=1-john&chapter1=1&testament1=nt", type: "book" },
    ],
  },
  "Kinh Thánh nói gì về thiên đàng?": {
    text: "**Khải Huyền** 21-22 cho bức tranh đầy đủ nhất: trời mới đất mới nơi Đức Chúa Trời ngự với dân Ngài, không còn sự chết hay đau đớn. **Giăng** 14:2-3 ghi lời Chúa Giêsu: \"Nhà Cha Ta có nhiều chỗ ở... Ta đi sắm sẵn cho các ngươi một chỗ.\" **1 Cô-rinh-tô** 2:9 nói \"Mắt chưa thấy, tai chưa nghe... những điều Đức Chúa Trời đã sắm sẵn cho kẻ yêu mến Ngài.\"",
    links: [
      { label: "Thiên đàng", href: "/bible/vi/topics/heaven", type: "topic" },
      { label: "Khải Huyền 21 — Đọc", href: "/bible/vi/read?version1=vi&book1=revelation&chapter1=21&testament1=nt", type: "book" },
      { label: "Giăng 14 — Đọc", href: "/bible/vi/read?version1=vi&book1=john&chapter1=14&testament1=nt", type: "book" },
    ],
  },
  "Ai đã viết Kinh Thánh?": {
    text: "Kinh Thánh được viết bởi khoảng **40 tác giả người** trong khoảng 1.500 năm — vua chúa, mục đồng, ngư dân, bác sĩ và tiên tri. Nhưng người tin Chúa tin rằng Kinh Thánh có một Tác Giả thần thượng: **2 Ti-mô-thê** 3:16 nói \"Cả Kinh Thánh đều là bởi Đức Chúa Trời soi dẫn.\" **2 Phi-e-rơ** 1:21 giải thích rằng \"người ta được Đức Thánh Linh dẫn động mà nói.\"",
    links: [
      { label: "Nguồn gốc Kinh Thánh", href: "/bible/vi/learn/bible-origin", type: "learn" },
      { label: "Kinh Thánh là gì?", href: "/bible/vi/learn/what-is-bible", type: "learn" },
    ],
  },
  "Ân điển là gì?": {
    text: "Ân điển là ân huệ không xứng đáng của Đức Chúa Trời — ban cho chúng ta những gì chúng ta không bao giờ có thể kiếm được. **Ê-phê-sô** 2:8-9: \"Vì nhờ ân điển, bởi đức tin, mà anh em được cứu — không phải bởi việc làm.\" **Rô-ma** 5:8 thể hiện ân điển trong hành động: \"Đức Chúa Trời tỏ lòng yêu thương Ngài đối với chúng ta, khi chúng ta còn là người có tội, thì Đấng Christ vì chúng ta chịu chết.\"",
    links: [
      { label: "Ân điển", href: "/bible/vi/topics/grace", type: "topic" },
      { label: "Rô-ma 5 — Đọc", href: "/bible/vi/read?version1=vi&book1=romans&chapter1=5&testament1=nt", type: "book" },
      { label: "Ê-phê-sô 2 — Đọc", href: "/bible/vi/read?version1=vi&book1=ephesians&chapter1=2&testament1=nt", type: "book" },
    ],
  },
};

function uid() { return Math.random().toString(36).slice(2); }

function newTopic(): Topic {
  return { id: uid(), label: "", messages: [] };
}

function topicLabel(t: Topic, isVi: boolean) {
  const first = t.messages.find((m) => m.role === "user");
  if (first) return first.content.slice(0, 28) + (first.content.length > 28 ? "…" : "");
  return isVi ? "Cuộc trò chuyện mới" : "New conversation";
}

function loadTopics(): Topic[] {
  try {
    const raw = localStorage.getItem(TOPICS_KEY);
    const parsed = raw ? (JSON.parse(raw) as Topic[]) : [];
    return parsed.length > 0 ? parsed : [newTopic()];
  } catch { return [newTopic()]; }
}

function saveTopics(topics: Topic[]) {
  try { localStorage.setItem(TOPICS_KEY, JSON.stringify(topics)); } catch { /* ignore */ }
}

// ── Main component ────────────────────────────────────────────────────────────

export function BibleAIGuide({ lang }: { lang: string }) {
  const isVi = lang === "vi";
  const { isSignedIn, isLoaded } = useUser();
  const defaultVersion: BibleVersionPref = isVi ? "vi" : "niv";
  const [open, setOpen] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [activeTopicId, setActiveTopicId] = useState<string>("");
  const [newestId, setNewestId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [prefVersion, setPrefVersion] = useState<BibleVersionPref>(defaultVersion);
  const [showVersionPicker, setShowVersionPicker] = useState(false);
  const [usage, setUsage] = useState<{ used: number; limit: number } | null>(null);
  const [aiLimitReached, setAiLimitReached] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const topicStartersRef = useRef<Record<string, string[]>>({});

  // Load topics on mount
  useEffect(() => {
    const loaded = loadTopics();
    setTopics(loaded);
    setActiveTopicId(loaded[0]!.id);
    try {
      const v = localStorage.getItem(VERSION_PREF_KEY) as BibleVersionPref | null;
      if (v && (v === "vi" || v === "niv" || v === "kjv")) setPrefVersion(v);
    } catch { /* ignore */ }
  }, []);

  // Fetch usage on mount (when signed in)
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/bible/ai-guide")
      .then((r) => r.json())
      .then((data: { used: number; limit: number }) => {
        setUsage(data);
        if (data.used >= data.limit) setAiLimitReached(true);
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn]);

  // Persist whenever topics change
  useEffect(() => {
    if (topics.length > 0) saveTopics(topics);
  }, [topics]);

  // Listen for global open event (from study reader or other surfaces)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ initialMessage?: string }>).detail;
      setOpen(true);
      if (detail?.initialMessage) {
        // Create a new topic for this context if current active has messages
        setTopics((prev) => {
          const active = prev.find((t) => t.id === activeTopicId);
          if (active && active.messages.length > 0 && prev.length < MAX_TOPICS) {
            const newT = newTopic();
            const next = [...prev, newT];
            setActiveTopicId(newT.id);
            return next;
          }
          return prev;
        });
        setTimeout(() => setInput(detail.initialMessage!), 50);
      }
    };
    window.addEventListener("bible-ai-open", handler);
    return () => window.removeEventListener("bible-ai-open", handler);
  }, [activeTopicId]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [topics, loading, activeTopicId]);

  const activeTopic = topics.find((t) => t.id === activeTopicId) ?? topics[0];
  const messages = activeTopic?.messages ?? [];
  const totalMessages = topics.reduce((s, t) => s + t.messages.filter((m) => m.role === "user").length, 0);

  const setVersion = (v: BibleVersionPref) => {
    setPrefVersion(v);
    setShowVersionPicker(false);
    try { localStorage.setItem(VERSION_PREF_KEY, v); } catch { /* ignore */ }
  };

  const updateActiveMessages = useCallback((updater: (prev: Message[]) => Message[]) => {
    setTopics((prev) => prev.map((t) =>
      t.id === activeTopicId ? { ...t, messages: updater(t.messages) } : t
    ));
  }, [activeTopicId]);

  const clearActiveTopic = useCallback(() => {
    updateActiveMessages(() => []);
    setNewestId(null);
  }, [updateActiveMessages]);

  const addTopic = () => {
    if (topics.length >= MAX_TOPICS) return;
    const t = newTopic();
    setTopics((prev) => [...prev, t]);
    setActiveTopicId(t.id);
  };

  const closeTopic = (id: string) => {
    setTopics((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        const fresh = newTopic();
        setActiveTopicId(fresh.id);
        return [fresh];
      }
      if (id === activeTopicId) {
        setActiveTopicId(next[next.length - 1]!.id);
      }
      return next;
    });
  };

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text, id: uid() };
    updateActiveMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const currentMessages = activeTopic?.messages ?? [];
    try {
      const history = currentMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/bible/ai-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang, history, recentTopics: [], preferredVersion: prefVersion }),
      });
      if (res.status === 429) {
        const data = await res.json() as { used: number; limit: number };
        setUsage({ used: data.used, limit: data.limit });
        setAiLimitReached(true);
        updateActiveMessages((prev) => prev.slice(0, -1)); // remove optimistic user msg
        setInput(text);
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
      }
      // Parse USAGE
      const usageIdx = buffer.lastIndexOf(USAGE_MARKER);
      if (usageIdx >= 0) {
        try { setUsage(JSON.parse(buffer.slice(usageIdx + USAGE_MARKER.length)) as { used: number; limit: number }); } catch { /* ignore */ }
        buffer = buffer.slice(0, usageIdx);
      }
      // Parse LINKS
      const linksIdx = buffer.lastIndexOf(LINKS_MARKER);
      const textPart = linksIdx >= 0 ? buffer.slice(0, linksIdx) : buffer;
      let links: NavLink[] = [];
      if (linksIdx >= 0) {
        try { links = JSON.parse(buffer.slice(linksIdx + LINKS_MARKER.length)) as NavLink[]; } catch { /* ignore */ }
      }
      const id = uid();
      setNewestId(id);
      updateActiveMessages((prev) => [...prev, { role: "assistant", content: textPart, links, id }]);
    } catch {
      const id = uid();
      setNewestId(id);
      updateActiveMessages((prev) => [...prev, {
        role: "assistant", id,
        content: isVi ? "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại." : "Sorry, something went wrong. Please try again.",
        links: [],
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, activeTopic, lang, prefVersion, isVi, updateActiveMessages]);

  const starters = useMemo(() => {
    const pool = isVi ? STARTER_POOL_VI : STARTER_POOL_EN;
    if (!topicStartersRef.current[activeTopicId]) {
      topicStartersRef.current[activeTopicId] = pickRandom(pool, 4);
    }
    return topicStartersRef.current[activeTopicId]!;
  }, [activeTopicId, isVi]);
  const atLimit = messages.length >= MAX_MESSAGES || aiLimitReached;

  const sendInstant = useCallback((text: string) => {
    const answers = isVi ? STARTER_ANSWERS_VI : STARTER_ANSWERS_EN;
    const preset = answers[text];
    if (!preset) { void send(text); return; }
    const userMsg: Message = { role: "user", content: text, id: uid() };
    const assistantId = uid();
    setNewestId(assistantId);
    updateActiveMessages((prev) => [
      ...prev,
      userMsg,
      { role: "assistant", content: preset.text, links: preset.links, id: assistantId },
    ]);
  }, [isVi, send, updateActiveMessages]);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg hover:bg-primary/90"
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">{isVi ? "Hỏi AI" : "Ask AI"}</span>
            {totalMessages > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">
                {totalMessages}
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sliding panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed right-0 top-14 bottom-0 z-40 flex w-full flex-col border-l border-border bg-background/95 shadow-2xl backdrop-blur-sm sm:w-[480px]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {isVi ? "Hướng dẫn Kinh Thánh" : "Bible Guide"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {isVi ? "Hỏi bất cứ điều gì" : "Ask anything"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Version badge */}
                <div className="relative">
                  <button type="button" onClick={() => setShowVersionPicker((v) => !v)}
                    className="rounded-full border border-primary/30 bg-primary/8 px-2 py-0.5 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/15">
                    {VERSION_LABELS[prefVersion]}
                  </button>
                  <AnimatePresence>
                    {showVersionPicker && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }} transition={{ duration: 0.15 }}
                        className="absolute right-0 top-7 z-50 flex flex-col gap-1 rounded-xl border border-border bg-background p-1.5 shadow-lg"
                      >
                        {(["vi", "niv", "kjv"] as BibleVersionPref[]).map((v) => (
                          <button key={v} type="button" onClick={() => setVersion(v)}
                            className={cn("rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors",
                              prefVersion === v ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted")}>
                            {VERSION_LABELS[v]}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {messages.length > 0 && (
                  <button type="button" onClick={clearActiveTopic} title={isVi ? "Xóa cuộc trò chuyện" : "Clear conversation"}
                    className="text-muted-foreground hover:text-destructive rounded-lg p-1.5 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button type="button" onClick={() => setOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-muted/60 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Auth gate */}
            {isLoaded && !isSignedIn && (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    {isVi ? "Đăng nhập để hỏi AI" : "Sign in to use Bible Guide"}
                  </p>
                  <p className="mt-1.5 text-sm text-muted-foreground max-w-[260px]">
                    {isVi
                      ? "Tạo tài khoản miễn phí để đặt câu hỏi về Kinh Thánh và lưu lịch sử trò chuyện."
                      : "Create a free account to ask questions about Scripture and save your conversation history."}
                  </p>
                </div>
                <div className="flex flex-col gap-2.5 w-full max-w-[220px]">
                  <Link href={`/sign-in?redirect_url=/bible/${lang}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                    <LogIn className="h-4 w-4" />
                    {isVi ? "Đăng nhập" : "Sign in"}
                  </Link>
                  <Link href={`/sign-up?redirect_url=/bible/${lang}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                    {isVi ? "Tạo tài khoản miễn phí" : "Create free account"}
                  </Link>
                </div>
              </div>
            )}

            {/* Chat UI — only when signed in */}
            {(!isLoaded || isSignedIn) && <>
              {/* Topic tabs */}
              <div className="flex items-center gap-1 border-b border-border px-3 pt-2 pb-0 overflow-x-auto">
                {topics.map((t) => {
                  const isActive = t.id === activeTopicId;
                  return (
                    <div key={t.id}
                      className={cn("group flex shrink-0 items-center gap-1 rounded-t-lg border-b-2 px-3 py-1.5 transition-colors cursor-pointer",
                        isActive ? "border-primary text-foreground bg-primary/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50")}
                      onClick={() => setActiveTopicId(t.id)}
                    >
                      <span className="max-w-[120px] truncate text-xs font-medium">
                        {topicLabel(t, isVi)}
                      </span>
                      {topics.length > 1 && (
                        <button type="button"
                          onClick={(e) => { e.stopPropagation(); closeTopic(t.id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive ml-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
                {topics.length < MAX_TOPICS && (
                  <button type="button" onClick={addTopic} title={isVi ? "Thêm chủ đề" : "New topic"}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors mb-1">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
                {messages.length === 0 ? (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                      <p className="text-xs font-semibold text-foreground mb-2">
                        {isVi ? "Bản dịch ưa thích của bạn?" : "Your preferred Bible version?"}
                      </p>
                      <div className="flex gap-2">
                        {(["vi", "niv", "kjv"] as BibleVersionPref[]).map((v) => (
                          <button key={v} type="button" onClick={() => setVersion(v)}
                            className={cn("flex-1 rounded-lg border py-1.5 text-xs font-semibold transition-colors",
                              prefVersion === v ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground")}>
                            {VERSION_LABELS[v]}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        {isVi ? "Bạn có thể đổi bất cứ lúc nào ở góc trên." : "You can change this anytime from the top."}
                      </p>
                    </div>
                    <p className="text-[11px] text-center text-muted-foreground">
                      {isVi ? "Hỏi tôi về chủ đề, sách Kinh Thánh, hoặc cách điều hướng" : "Ask me about topics, Bible books, or how to navigate"}
                    </p>
                    <div className="space-y-2">
                      {starters.map((s, i) => (
                        <motion.button key={s} type="button" onClick={() => sendInstant(s)}
                          initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 25 }}
                          whileHover={{ x: 3 }}
                          className="w-full text-left rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-foreground hover:border-primary/30 hover:bg-primary/5 transition-colors">
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                      const isNew = msg.id === newestId;
                      return (
                        <motion.div key={msg.id} layout
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                          className={cn("flex flex-col gap-1", msg.role === "user" ? "items-end" : "items-start")}
                        >
                          <div className={cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                            msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm")}>
                            {msg.role === "assistant" ? <PopAnswer text={msg.content} animate={isNew} /> : msg.content}
                          </div>
                          {msg.links && msg.links.length > 0 && (
                            <div className="mt-1 w-full space-y-1.5">
                              {msg.links.map((link, j) => <NavCard key={j} link={link} index={j} animate={isNew} />)}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
                {loading && <ThinkingIndicator isVi={isVi} />}
                {atLimit && !loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-2 text-center text-[10px] text-muted-foreground">
                    {isVi ? "Đã đạt giới hạn. Xóa cuộc trò chuyện để tiếp tục." : "Limit reached. Clear conversation to continue."}
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-border p-3 space-y-2">
                {aiLimitReached ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50/80 dark:border-amber-800/40 dark:bg-amber-950/20 px-3 py-2.5 text-center">
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      {isVi ? `Đã dùng hết ${usage?.limit ?? 30} tin nhắn miễn phí tháng này` : `You've used all ${usage?.limit ?? 30} free messages this month`}
                    </p>
                    <p className="mt-0.5 text-[10px] text-amber-600 dark:text-amber-400">
                      {isVi ? "Nâng cấp để tiếp tục hoặc chờ đến tháng sau" : "Upgrade to continue or wait until next month"}
                    </p>
                    <Link href="/pricing" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                      {isVi ? "Nâng cấp" : "Upgrade"}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ) : (
                  <div className={cn("flex items-center gap-2 rounded-xl border bg-muted/40 pl-3 pr-1.5 py-1.5 transition-colors focus-within:border-primary/40",
                    atLimit ? "opacity-50 pointer-events-none" : "border-border")}>
                    <input ref={inputRef} type="text" value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(input); } }}
                      placeholder={isVi ? "Hỏi gì đó..." : "Ask something..."}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                      disabled={loading || atLimit} />
                    <motion.button type="button" onClick={() => void send(input)}
                      disabled={!input.trim() || loading || atLimit} whileTap={{ scale: 0.9 }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity disabled:opacity-40">
                      <Send className="h-3 w-3" />
                    </motion.button>
                  </div>
                )}
                {!aiLimitReached && (
                  <div className="flex items-center gap-2">
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary/50 transition-all"
                        style={{ width: usage ? `${Math.min(100, (usage.used / usage.limit) * 100)}%` : "0%" }} />
                    </div>
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {usage ? `${usage.used}/${usage.limit}` : `0/30`} {isVi ? "tin nhắn" : "msgs"}
                    </span>
                  </div>
                )}
              </div>
            </>}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
