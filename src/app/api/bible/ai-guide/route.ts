import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { anthropic } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";

const FREE_LIMIT = 30;
const PRO_LIMIT = 300;

const TOPICS_DATA = [
  { slug: "faith", nameEn: "Faith", nameVi: "Đức tin", category: "faith" },
  { slug: "salvation", nameEn: "Salvation", nameVi: "Sự cứu rỗi", category: "faith" },
  { slug: "grace", nameEn: "Grace", nameVi: "Ân điển", category: "faith" },
  { slug: "repentance", nameEn: "Repentance", nameVi: "Sự ăn năn", category: "faith" },
  { slug: "baptism", nameEn: "Baptism", nameVi: "Báp-têm", category: "faith" },
  { slug: "holy-spirit", nameEn: "Holy Spirit", nameVi: "Đức Thánh Linh", category: "faith" },
  { slug: "evangelism", nameEn: "Sharing Your Faith", nameVi: "Chia sẻ đức tin", category: "faith" },
  { slug: "anxiety", nameEn: "Anxiety", nameVi: "Lo lắng", category: "emotions" },
  { slug: "fear", nameEn: "Fear", nameVi: "Sự sợ hãi", category: "emotions" },
  { slug: "grief", nameEn: "Grief", nameVi: "Nỗi đau buồn", category: "emotions" },
  { slug: "joy", nameEn: "Joy", nameVi: "Niềm vui", category: "emotions" },
  { slug: "anger", nameEn: "Anger", nameVi: "Sự tức giận", category: "emotions" },
  { slug: "loneliness", nameEn: "Loneliness", nameVi: "Sự cô đơn", category: "emotions" },
  { slug: "hope", nameEn: "Hope", nameVi: "Hy vọng", category: "emotions" },
  { slug: "peace", nameEn: "Peace", nameVi: "Bình an", category: "emotions" },
  { slug: "depression", nameEn: "Depression", nameVi: "Trầm cảm", category: "emotions" },
  { slug: "shame", nameEn: "Shame & Guilt", nameVi: "Xấu hổ & Tội lỗi", category: "emotions" },
  { slug: "gratitude", nameEn: "Gratitude", nameVi: "Lòng biết ơn", category: "emotions" },
  { slug: "contentment", nameEn: "Contentment", nameVi: "Sự thỏa lòng", category: "emotions" },
  { slug: "love", nameEn: "Love", nameVi: "Tình yêu thương", category: "relationships" },
  { slug: "marriage", nameEn: "Marriage", nameVi: "Hôn nhân", category: "relationships" },
  { slug: "family", nameEn: "Family", nameVi: "Gia đình", category: "relationships" },
  { slug: "friendship", nameEn: "Friendship", nameVi: "Tình bạn", category: "relationships" },
  { slug: "forgiveness", nameEn: "Forgiveness", nameVi: "Sự tha thứ", category: "relationships" },
  { slug: "conflict", nameEn: "Conflict", nameVi: "Xung đột", category: "relationships" },
  { slug: "parenting", nameEn: "Parenting", nameVi: "Làm cha mẹ", category: "relationships" },
  { slug: "mother", nameEn: "Mother", nameVi: "Người mẹ", category: "relationships" },
  { slug: "father", nameEn: "Father", nameVi: "Người cha", category: "relationships" },
  { slug: "children", nameEn: "Children", nameVi: "Con cái", category: "relationships" },
  { slug: "siblings", nameEn: "Brothers & Sisters", nameVi: "Anh chị em", category: "relationships" },
  { slug: "elderly", nameEn: "Honoring the Elderly", nameVi: "Kính trọng người lớn", category: "relationships" },
  { slug: "gods-will", nameEn: "God's Will", nameVi: "Ý muốn Chúa", category: "guidance" },
  { slug: "decision-making", nameEn: "Decision Making", nameVi: "Ra quyết định", category: "guidance" },
  { slug: "trust", nameEn: "Trust in God", nameVi: "Tin tưởng Chúa", category: "guidance" },
  { slug: "obedience", nameEn: "Obedience", nameVi: "Sự vâng lời", category: "guidance" },
  { slug: "money", nameEn: "Money & Wealth", nameVi: "Tiền bạc & Tài sản", category: "guidance" },
  { slug: "work", nameEn: "Work & Purpose", nameVi: "Công việc & Ý nghĩa", category: "guidance" },
  { slug: "generosity", nameEn: "Generosity & Giving", nameVi: "Sự hào phóng", category: "guidance" },
  { slug: "rest", nameEn: "Rest & Sabbath", nameVi: "Nghỉ ngơi & An nghỉ", category: "guidance" },
  { slug: "leadership", nameEn: "Leadership", nameVi: "Lãnh đạo", category: "guidance" },
  { slug: "justice", nameEn: "Justice & Mercy", nameVi: "Công lý & Thương xót", category: "guidance" },
  { slug: "identity-in-christ", nameEn: "Identity in Christ", nameVi: "Danh tính trong Chúa", category: "identity" },
  { slug: "worth", nameEn: "Worth & Value", nameVi: "Giá trị bản thân", category: "identity" },
  { slug: "calling", nameEn: "Calling & Purpose", nameVi: "Sứ mệnh & Mục đích", category: "identity" },
  { slug: "humility", nameEn: "Humility", nameVi: "Sự khiêm nhường", category: "identity" },
  { slug: "courage", nameEn: "Courage", nameVi: "Sự can đảm", category: "identity" },
  { slug: "prayer", nameEn: "Prayer", nameVi: "Cầu nguyện", category: "prayer" },
  { slug: "praise", nameEn: "Praise & Worship", nameVi: "Ngợi khen & Thờ phượng", category: "prayer" },
  { slug: "fasting", nameEn: "Fasting", nameVi: "Kiêng ăn", category: "prayer" },
  { slug: "thanksgiving", nameEn: "Thanksgiving", nameVi: "Tạ ơn", category: "prayer" },
  { slug: "wisdom", nameEn: "Wisdom", nameVi: "Sự khôn ngoan", category: "wisdom" },
  { slug: "discernment", nameEn: "Discernment", nameVi: "Sự phân biệt", category: "wisdom" },
  { slug: "patience", nameEn: "Patience", nameVi: "Sự kiên nhẫn", category: "wisdom" },
  { slug: "integrity", nameEn: "Integrity", nameVi: "Sự liêm chính", category: "wisdom" },
  { slug: "suffering", nameEn: "Suffering & Trials", nameVi: "Khổ đau & Thử thách", category: "wisdom" },
  { slug: "temptation", nameEn: "Temptation", nameVi: "Cám dỗ", category: "wisdom" },
  { slug: "healing", nameEn: "Healing & Sickness", nameVi: "Chữa lành & Bệnh tật", category: "wisdom" },
  { slug: "perseverance", nameEn: "Perseverance", nameVi: "Sự kiên trì", category: "wisdom" },
  { slug: "community", nameEn: "Community & Church", nameVi: "Cộng đồng & Hội thánh", category: "wisdom" },
  { slug: "heaven", nameEn: "Heaven", nameVi: "Thiên đàng", category: "eternity" },
  { slug: "eternal-life", nameEn: "Eternal Life", nameVi: "Sự sống đời đời", category: "eternity" },
  { slug: "resurrection", nameEn: "Resurrection", nameVi: "Sự phục sinh", category: "eternity" },
  { slug: "second-coming", nameEn: "Second Coming", nameVi: "Sự tái lâm", category: "eternity" },
  { slug: "death-dying", nameEn: "Death & Dying", nameVi: "Cái chết", category: "eternity" },
];

const BOOKS_DATA = [
  { id: 1, nameEn: "Genesis", nameVi: "Sáng Thế Ký", slugEn: "genesis" },
  { id: 2, nameEn: "Exodus", nameVi: "Xuất Ê-díp-tô Ký", slugEn: "exodus" },
  { id: 3, nameEn: "Leviticus", nameVi: "Lê-vi Ký", slugEn: "leviticus" },
  { id: 4, nameEn: "Numbers", nameVi: "Dân Số Ký", slugEn: "numbers" },
  { id: 5, nameEn: "Deuteronomy", nameVi: "Phục Truyền Luật Lệ Ký", slugEn: "deuteronomy" },
  { id: 6, nameEn: "Joshua", nameVi: "Giô-suê", slugEn: "joshua" },
  { id: 7, nameEn: "Judges", nameVi: "Các Quan Xét", slugEn: "judges" },
  { id: 8, nameEn: "Ruth", nameVi: "Ru-tơ", slugEn: "ruth" },
  { id: 9, nameEn: "1 Samuel", nameVi: "1 Sa-mu-ên", slugEn: "1-samuel" },
  { id: 10, nameEn: "2 Samuel", nameVi: "2 Sa-mu-ên", slugEn: "2-samuel" },
  { id: 11, nameEn: "1 Kings", nameVi: "1 Các Vua", slugEn: "1-kings" },
  { id: 12, nameEn: "2 Kings", nameVi: "2 Các Vua", slugEn: "2-kings" },
  { id: 13, nameEn: "1 Chronicles", nameVi: "1 Sử Ký", slugEn: "1-chronicles" },
  { id: 14, nameEn: "2 Chronicles", nameVi: "2 Sử Ký", slugEn: "2-chronicles" },
  { id: 15, nameEn: "Ezra", nameVi: "E-xơ-ra", slugEn: "ezra" },
  { id: 16, nameEn: "Nehemiah", nameVi: "Nê-hê-mi", slugEn: "nehemiah" },
  { id: 17, nameEn: "Esther", nameVi: "Ê-xơ-tê", slugEn: "esther" },
  { id: 18, nameEn: "Job", nameVi: "Gióp", slugEn: "job" },
  { id: 19, nameEn: "Psalms", nameVi: "Thi Thiên", slugEn: "psalms" },
  { id: 20, nameEn: "Proverbs", nameVi: "Châm Ngôn", slugEn: "proverbs" },
  { id: 21, nameEn: "Ecclesiastes", nameVi: "Truyền Đạo", slugEn: "ecclesiastes" },
  { id: 22, nameEn: "Song of Solomon", nameVi: "Nhã Ca", slugEn: "song-of-solomon" },
  { id: 23, nameEn: "Isaiah", nameVi: "Ê-sai", slugEn: "isaiah" },
  { id: 24, nameEn: "Jeremiah", nameVi: "Giê-rê-mi", slugEn: "jeremiah" },
  { id: 25, nameEn: "Lamentations", nameVi: "Ca Thương", slugEn: "lamentations" },
  { id: 26, nameEn: "Ezekiel", nameVi: "Ê-xê-chi-ên", slugEn: "ezekiel" },
  { id: 27, nameEn: "Daniel", nameVi: "Đa-ni-ên", slugEn: "daniel" },
  { id: 28, nameEn: "Hosea", nameVi: "Ô-sê", slugEn: "hosea" },
  { id: 29, nameEn: "Joel", nameVi: "Giô-ên", slugEn: "joel" },
  { id: 30, nameEn: "Amos", nameVi: "A-mốt", slugEn: "amos" },
  { id: 31, nameEn: "Obadiah", nameVi: "Áp-đia", slugEn: "obadiah" },
  { id: 32, nameEn: "Jonah", nameVi: "Giô-na", slugEn: "jonah" },
  { id: 33, nameEn: "Micah", nameVi: "Mi-chê", slugEn: "micah" },
  { id: 34, nameEn: "Nahum", nameVi: "Na-hum", slugEn: "nahum" },
  { id: 35, nameEn: "Habakkuk", nameVi: "Ha-ba-cúc", slugEn: "habakkuk" },
  { id: 36, nameEn: "Zephaniah", nameVi: "Xô-phô-ni", slugEn: "zephaniah" },
  { id: 37, nameEn: "Haggai", nameVi: "A-ghê", slugEn: "haggai" },
  { id: 38, nameEn: "Zechariah", nameVi: "Xa-cha-ri", slugEn: "zechariah" },
  { id: 39, nameEn: "Malachi", nameVi: "Ma-la-chi", slugEn: "malachi" },
  { id: 40, nameEn: "Matthew", nameVi: "Ma-thi-ơ", slugEn: "matthew" },
  { id: 41, nameEn: "Mark", nameVi: "Mác", slugEn: "mark" },
  { id: 42, nameEn: "Luke", nameVi: "Lu-ca", slugEn: "luke" },
  { id: 43, nameEn: "John", nameVi: "Giăng", slugEn: "john" },
  { id: 44, nameEn: "Acts", nameVi: "Công Vụ", slugEn: "acts" },
  { id: 45, nameEn: "Romans", nameVi: "Rô-ma", slugEn: "romans" },
  { id: 46, nameEn: "1 Corinthians", nameVi: "1 Cô-rinh-tô", slugEn: "1-corinthians" },
  { id: 47, nameEn: "2 Corinthians", nameVi: "2 Cô-rinh-tô", slugEn: "2-corinthians" },
  { id: 48, nameEn: "Galatians", nameVi: "Ga-la-ti", slugEn: "galatians" },
  { id: 49, nameEn: "Ephesians", nameVi: "Ê-phê-sô", slugEn: "ephesians" },
  { id: 50, nameEn: "Philippians", nameVi: "Phi-líp", slugEn: "philippians" },
  { id: 51, nameEn: "Colossians", nameVi: "Cô-lô-se", slugEn: "colossians" },
  { id: 52, nameEn: "1 Thessalonians", nameVi: "1 Tê-sa-lô-ni-ca", slugEn: "1-thessalonians" },
  { id: 53, nameEn: "2 Thessalonians", nameVi: "2 Tê-sa-lô-ni-ca", slugEn: "2-thessalonians" },
  { id: 54, nameEn: "1 Timothy", nameVi: "1 Ti-mô-thê", slugEn: "1-timothy" },
  { id: 55, nameEn: "2 Timothy", nameVi: "2 Ti-mô-thê", slugEn: "2-timothy" },
  { id: 56, nameEn: "Titus", nameVi: "Tít", slugEn: "titus" },
  { id: 57, nameEn: "Philemon", nameVi: "Phi-lê-môn", slugEn: "philemon" },
  { id: 58, nameEn: "Hebrews", nameVi: "Hê-bơ-rơ", slugEn: "hebrews" },
  { id: 59, nameEn: "James", nameVi: "Gia-cơ", slugEn: "james" },
  { id: 60, nameEn: "1 Peter", nameVi: "1 Phi-e-rơ", slugEn: "1-peter" },
  { id: 61, nameEn: "2 Peter", nameVi: "2 Phi-e-rơ", slugEn: "2-peter" },
  { id: 62, nameEn: "1 John", nameVi: "1 Giăng", slugEn: "1-john" },
  { id: 63, nameEn: "2 John", nameVi: "2 Giăng", slugEn: "2-john" },
  { id: 64, nameEn: "3 John", nameVi: "3 Giăng", slugEn: "3-john" },
  { id: 65, nameEn: "Jude", nameVi: "Giu-đe", slugEn: "jude" },
  { id: 66, nameEn: "Revelation", nameVi: "Khải Huyền", slugEn: "revelation" },
];

const LEARN_ARTICLES = [
  { slug: "what-is-bible", titleEn: "What Is the Bible?", titleVi: "Kinh Thánh là gì?" },
  { slug: "bible-origin", titleEn: "The Origin of the Bible", titleVi: "Nguồn gốc Kinh Thánh" },
  { slug: "who-is-jesus", titleEn: "Who Is Jesus?", titleVi: "Chúa Giêsu là ai?" },
  { slug: "what-happens-after-death", titleEn: "What Happens After Death?", titleVi: "Điều gì xảy ra sau khi chết?" },
  { slug: "what-is-faith", titleEn: "What Is Faith?", titleVi: "Đức tin là gì?" },
];

function searchTopics(query: string, category?: string) {
  const q = query.toLowerCase();
  return TOPICS_DATA.filter((t) => {
    const matchesCategory = !category || t.category === category;
    const matchesQuery =
      t.nameEn.toLowerCase().includes(q) ||
      t.nameVi.toLowerCase().includes(q) ||
      t.slug.includes(q) ||
      t.category.includes(q);
    return matchesCategory && matchesQuery;
  }).slice(0, 5);
}

function normalizeBookName(s: string): string {
  return s.toLowerCase().replace(/[-\s]/g, "");
}

function searchBooks(query: string) {
  const q = query.toLowerCase();
  const qNorm = normalizeBookName(query);
  return BOOKS_DATA.filter((b) => {
    const enLow = b.nameEn.toLowerCase();
    const viLow = b.nameVi.toLowerCase();
    const viNorm = normalizeBookName(b.nameVi);
    const enNorm = normalizeBookName(b.nameEn);
    return (
      enLow.includes(q) ||
      viLow.includes(q) ||
      b.slugEn.includes(q) ||
      viNorm.includes(qNorm) ||
      enNorm.includes(qNorm) ||
      qNorm.includes(viNorm) ||
      qNorm.includes(enNorm)
    );
  }).slice(0, 5);
}

function getLearnArticles() {
  return LEARN_ARTICLES;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ used: 0, limit: FREE_LIMIT });

  const { getUserFeatureAccess } = await import("@/lib/feature-access");
  const features = await getUserFeatureAccess(userId);
  const isPro = features.bible_study_unlimited === true;
  const limit = isPro ? PRO_LIMIT : FREE_LIMIT;

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) return Response.json({ used: 0, limit });

  const now = new Date();
  const resetAt = user.aiMsgResetAt;
  const needsReset = !resetAt || resetAt.getFullYear() < now.getFullYear() || resetAt.getMonth() < now.getMonth();
  const used = needsReset ? 0 : user.aiMsgCount;

  return Response.json({ used, limit });
}

export async function POST(req: NextRequest) {
  // Auth check
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { message, lang, history = [], recentTopics = [], preferredVersion } = (await req.json()) as {
    message: string;
    lang: "en" | "vi";
    history: { role: "user" | "assistant"; content: string }[];
    recentTopics?: string[];
    preferredVersion?: "vi" | "niv" | "kjv";
  };
  const bookVersion = preferredVersion ?? (lang === "vi" ? "vi" : "niv");

  if (!message?.trim()) {
    return new Response("Missing message", { status: 400 });
  }

  // Check AI message limit
  const { getUserFeatureAccess } = await import("@/lib/feature-access");
  const features = await getUserFeatureAccess(userId);
  const isPro = features.bible_study_unlimited === true;
  const limit = isPro ? PRO_LIMIT : FREE_LIMIT;

  // Get or create user record, check monthly reset
  let user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    user = await prisma.user.create({ data: { clerkUserId: userId } });
  }

  const now = new Date();
  const resetAt = user.aiMsgResetAt;
  const needsReset = !resetAt || resetAt.getFullYear() < now.getFullYear() || resetAt.getMonth() < now.getMonth();
  const currentCount = needsReset ? 0 : user.aiMsgCount;

  if (currentCount >= limit) {
    return new Response(
      JSON.stringify({ error: "limit_reached", used: currentCount, limit }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const isVi = lang === "vi";

  const systemPrompt = isVi
    ? `Bạn là hướng dẫn viên Kinh Thánh thông thái của ứng dụng Scripture·Space. Bạn có kiến thức sâu về Kinh Thánh, thần học, lịch sử Kinh Thánh và các nhân vật. Trả lời bằng văn xuôi tự nhiên, ấm áp — không emoji, không tiêu đề (###), không gạch ngang (---), không dấu đầu dòng, không liên kết [text](url). Chỉ viết câu văn thuần túy. Dùng **in đậm** cho tên sách Kinh Thánh (ví dụ: **Rô-ma**, **Giăng**, **Ê-phê-sô**). Trả lời 2-4 câu, đủ ý nhưng súc tích. Dùng tên sách Kinh Thánh tiếng Việt (Sáng Thế Ký, Ma-thi-ơ, Lu-ca, Ê-phê-sô, v.v.). Khi đề cập sách cụ thể, LUÔN gọi search_books ngay để cung cấp liên kết. Khi đề cập chủ đề, gọi search_topics. Ứng dụng có: đọc Kinh Thánh VI/NIV/KJV, 64+ chủ đề, danh sách học tập, bài học nền tảng.`
    : `You are a knowledgeable and warm Bible guide for Scripture·Space. You have deep knowledge of Scripture, theology, biblical history, and characters. Write in natural conversational prose — no emojis, no headers, no horizontal rules, no bullet points, no inline links. Plain sentences only. Use **bold** for Bible book names (e.g. **Romans**, **John**, **Ephesians**). 2-4 sentences per response — thorough but concise. Whenever you mention a specific Bible book, ALWAYS call search_books immediately. Whenever you mention a topic, call search_topics. The app has: Bible reading (VI/NIV/KJV), 64+ topics, study lists, and learn articles.`;

  const tools: Parameters<typeof anthropic.messages.create>[0]["tools"] = [
    {
      name: "search_topics",
      description: "Search Bible topics by keyword or category. Returns up to 5 matching topics.",
      input_schema: {
        type: "object" as const,
        properties: {
          query: { type: "string", description: "Search query" },
          category: {
            type: "string",
            enum: ["faith", "emotions", "relationships", "guidance", "identity", "prayer", "wisdom", "eternity"],
            description: "Optional category filter",
          },
        },
        required: ["query"],
      },
    },
    {
      name: "search_books",
      description: "Search for Bible books by name.",
      input_schema: {
        type: "object" as const,
        properties: {
          query: { type: "string", description: "Book name to search for" },
        },
        required: ["query"],
      },
    },
    {
      name: "get_learn_articles",
      description: "Get the list of available learn articles in the app.",
      input_schema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
  ];

  const contextNote =
    recentTopics.length > 0
      ? isVi
        ? `\n\nChủ đề gần đây của người dùng: ${recentTopics.join(", ")}`
        : `\n\nUser's recent topics: ${recentTopics.join(", ")}`
      : "";

  const messages: Parameters<typeof anthropic.messages.create>[0]["messages"] = [
    ...history.map((h) => ({ role: h.role, content: h.content })),
    { role: "user", content: message + contextNote },
  ];

  // Agentic loop: run tools until Claude stops calling them
  let currentMessages = messages;
  let toolLinks: { label: string; href: string; type: "topic" | "book" | "learn" | "page" }[] = [];

  while (true) {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: systemPrompt,
      tools,
      messages: currentMessages,
    });

    if (response.stop_reason === "end_turn") {
      const textContent = response.content.find((c) => c.type === "text");
      const finalText = textContent && textContent.type === "text" ? textContent.text : "";

      // Increment message count
      await prisma.user.update({
        where: { clerkUserId: userId },
        data: {
          aiMsgCount: needsReset ? 1 : { increment: 1 },
          aiMsgResetAt: needsReset ? now : undefined,
        },
      });

      const encoder = new TextEncoder();
      const linksJson = JSON.stringify(toolLinks);
      const usageJson = JSON.stringify({ used: currentCount + 1, limit });
      const fullResponse = finalText + "\n\nLINKS:" + linksJson + "\n\nUSAGE:" + usageJson;

      const readable = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(fullResponse));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter((c) => c.type === "tool_use");
      const toolResults: Parameters<typeof anthropic.messages.create>[0]["messages"][number] = {
        role: "user",
        content: toolUseBlocks.map((block) => {
          if (block.type !== "tool_use") return { type: "tool_result" as const, tool_use_id: "", content: "" };

          const input = block.input as Record<string, string>;
          let result: unknown;

          if (block.name === "search_topics") {
            const matches = searchTopics(input.query, input.category);
            result = matches;
            matches.forEach((t) => {
              toolLinks.push({
                label: isVi ? t.nameVi : t.nameEn,
                href: `/bible/${lang}/topics/${t.slug}`,
                type: "topic",
              });
            });
          } else if (block.name === "search_books") {
            const matches = searchBooks(input.query);
            result = matches;
            matches.forEach((b) => {
              const testament = b.id >= 40 ? "&testament1=nt" : "&testament1=ot";
              const bookName = isVi ? b.nameVi : b.nameEn;
              toolLinks.push({
                label: isVi ? `${bookName} — Tổng quan` : `${bookName} — Overview`,
                href: `/bible/${lang}/book-overviews/${b.slugEn}`,
                type: "book",
              });
              toolLinks.push({
                label: isVi ? `${bookName} — Đọc` : `${bookName} — Read`,
                href: `/bible/${lang}/read?version1=${bookVersion}&book1=${b.slugEn}&chapter1=1${testament}`,
                type: "book",
              });
            });
          } else if (block.name === "get_learn_articles") {
            const articles = getLearnArticles();
            result = articles;
            articles.forEach((a) => {
              toolLinks.push({
                label: isVi ? a.titleVi : a.titleEn,
                href: `/bible/${lang}/learn/${a.slug}`,
                type: "learn",
              });
            });
          }

          return {
            type: "tool_result" as const,
            tool_use_id: block.id,
            content: JSON.stringify(result),
          };
        }),
      };

      currentMessages = [
        ...currentMessages,
        { role: "assistant" as const, content: response.content },
        toolResults,
      ];
    } else {
      // Unexpected stop reason — bail out
      break;
    }
  }

  return new Response("Error processing request", { status: 500 });
}
