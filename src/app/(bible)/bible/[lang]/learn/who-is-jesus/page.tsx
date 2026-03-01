"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useBibleApp } from "@/components/Bible/BibleAppContext";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";

const PROPHECY_ITEMS = [
  { prophecyKey: 0, refKey: 0, fulfilledKey: 0 },
  { prophecyKey: 1, refKey: 1, fulfilledKey: 1 },
  { prophecyKey: 2, refKey: 2, fulfilledKey: 2 },
  { prophecyKey: 3, refKey: 3, fulfilledKey: 3 },
  { prophecyKey: 4, refKey: 4, fulfilledKey: 4 },
  { prophecyKey: 5, refKey: 5, fulfilledKey: 5 },
] as const;

const EN = {
  moduleNum: "03 / 04",
  title: "Who Is Jesus?",
  intro1:
    "For over two thousand years, people have debated who Jesus really was. ",
  intro1Quote:
    "A teacher? A prophet? A revolutionary? A myth? A Son of God? Or someone who is far greater than we can imagine?",
  intro2:
    "Jesus of Nazareth is the central figure of the entire Bible — not just the New Testament. Everything in the Old Testament points toward him; everything after him flows from him.",
  fullyTitle: "Fully God. Fully Man.",
  humanTitle: "Fully Human",
  humanBody:
    "Jesus was born, grew up in an ordinary family, felt hunger and exhaustion, experienced sorrow, and ultimately faced death. He entered the human condition fully — not from a distance, but from within.",
  humanRef: "John 11:35 · Hebrews 4:15",
  divineTitle: "Fully Divine",
  divineBody:
    "Yet he also forgave sins, commanded the wind and waves, received worship, and rose from the dead. The New Testament presents him not merely as a messenger of God, but as God incarnate.",
  divineRef: "John 1:1 · Colossians 2:9",
  crossTitle: "The Cross & Resurrection",
  crossP1:
    "Around 30 AD, Jesus was crucified under the Roman governor Pontius Pilate. Christians believe this was not a tragic accident of history, but the center of God's redemptive plan. On the cross, he willingly bore the weight of human sin — opening the way for forgiveness and reconciliation with God.",
  crossP2:
    "Three days later, he rose bodily from the dead. This resurrection was proclaimed from the earliest days of the church, supported by eyewitness testimony and multiple independent accounts. For Christians, it is not a symbol, but the decisive turning point of history.",
  crossRef: "1 Corinthians 15:3–8",
  prophecyTitle: "Fulfilment of Prophecy",
  prophecyIntro:
    "Long before Jesus was born, the Hebrew Scriptures spoke of a coming Messiah — describing his birthplace, his suffering, and even the manner of his death. Christians believe these promises converged in him. Here are six examples.",
  prophecies: ["Born in Bethlehem", "Born of a virgin", "Entered Jerusalem on a donkey", "Betrayed for 30 pieces of silver", "Crucified, hands and feet pierced", "Rose from the dead"],
  refs: ["Micah 5:2", "Isaiah 7:14", "Zechariah 9:9", "Zechariah 11:12", "Psalm 22:16", "Psalm 16:10"],
  fulfilled: ["Matthew 2:1", "Luke 1:27", "Mark 11:7", "Matthew 26:15", "Luke 24:39", "Acts 2:31"],
  whyTitle: "Why Does Jesus Matter Today?",
  whyP1:
    "If Jesus truly rose from the dead, then his life cannot be reduced to a moral example or an inspiring story. He claimed to be \"the way, the truth, and the life\" (John 14:6) — not simply offering advice, but inviting people into reconciliation with God.",
  whyP2:
    "For Christians, faith in Jesus is not merely belief in a doctrine, but trust in a living person — one who offers forgiveness, purpose, and eternal hope.",
  readGospels: "Read the Gospels",
};

const VI = {
  moduleNum: "03 / 04",
  title: "Chúa Jêsus Là Ai?",
  intro1:
    "Trong suốt hơn hai nghìn năm, con người vẫn tranh luận về thân vị của Chúa Jêsus. ",
  intro1Quote:
    "Ngài là một thầy giáo? Một nhà tiên tri? Một nhà cách mạng? Một huyền thoại? Con Đức Chúa Trời? Hay là Đấng vượt xa mọi tưởng tượng của chúng ta?",
  intro2:
    "Chúa Jêsus người Na-xa-rét là nhân vật trung tâm của toàn bộ Kinh Thánh — không chỉ riêng Tân Ước. Mọi điều trong Cựu Ước đều hướng về Ngài; và mọi điều sau Ngài đều xuất phát từ Ngài.",
  fullyTitle: "Trọn Vẹn Là Đức Chúa Trời. Trọn Vẹn Là Con Người.",
  humanTitle: "Hoàn Toàn Là Con Người",
  humanBody:
    "Chúa Jêsus được sinh ra, lớn lên trong một gia đình bình thường, biết đói, biết mệt, từng buồn khóc và cuối cùng đối diện với sự chết. Ngài bước vào thân phận con người cách trọn vẹn — không từ xa, nhưng từ bên trong.",
  humanRef: "Giăng 11:35 · Hê-bơ-rơ 4:15",
  divineTitle: "Hoàn Toàn Là Đức Chúa Trời",
  divineBody:
    "Tuy nhiên, Ngài cũng tha tội, khiến gió và biển phải vâng lời, nhận sự thờ phượng, và sống lại từ cõi chết. Tân Ước không chỉ trình bày Ngài như một sứ giả của Đức Chúa Trời, nhưng là Đức Chúa Trời nhập thể.",
  divineRef: "Giăng 1:1 · Cô-lô-se 2:9",
  crossTitle: "Thập Tự Giá & Sự Phục Sinh",
  crossP1:
    "Khoảng năm 30 sau Công Nguyên, Chúa Jêsus bị đóng đinh dưới thời tổng đốc La Mã Bôn-xơ Phi-lát. Người tin Chúa tin rằng đây không phải là một tai nạn lịch sử, nhưng là trung tâm của kế hoạch cứu chuộc của Đức Chúa Trời. Trên thập tự giá, Ngài tự nguyện gánh lấy tội lỗi nhân loại — mở đường cho sự tha thứ và sự hòa giải với Đức Chúa Trời.",
  crossP2:
    "Ba ngày sau, Ngài sống lại cách thân thể. Sự phục sinh này được công bố ngay từ những ngày đầu của Hội Thánh, được xác nhận bởi nhiều nhân chứng và nhiều nguồn tường thuật độc lập. Đối với người tin Chúa, đây không chỉ là biểu tượng, mà là bước ngoặt quyết định của lịch sử.",
  crossRef: "I Cô-rinh-tô 15:3–8",
  prophecyTitle: "Sự Ứng Nghiệm Lời Tiên Tri",
  prophecyIntro:
    "Từ nhiều thế kỷ trước khi Chúa Jêsus ra đời, Kinh Thánh đã nói về một Đấng Mê-si sẽ đến — mô tả nơi sinh, sự chịu khổ, và thậm chí cách Ngài chịu chết. Người tin Chúa tin rằng những lời hứa ấy đã được ứng nghiệm nơi Ngài. Dưới đây là sáu ví dụ tiêu biểu.",
  prophecies: ["Sinh tại Bết-lê-hem", "Sinh bởi nữ đồng trinh", "Vào Giê-ru-sa-lem trên lưng lừa", "Bị phản bội với 30 miếng bạc", "Bị đóng đinh, tay chân bị đâm", "Sống lại từ cõi chết"],
  refs: ["Mi-chê 5:2", "Ê-sai 7:14", "Xa-cha-ri 9:9", "Xa-cha-ri 11:12", "Thi Thiên 22:16", "Thi Thiên 16:10"],
  fulfilled: ["Ma-thi-ơ 2:1", "Lu-ca 1:27", "Mác 11:7", "Ma-thi-ơ 26:15", "Lu-ca 24:39", "Công Vụ 2:31"],
  whyTitle: "Vì Sao Chúa Jêsus Vẫn Quan Trọng Ngày Nay?",
  whyP1:
    "Nếu Chúa Jêsus thật sự đã sống lại từ cõi chết, thì cuộc đời Ngài không thể chỉ được xem như một tấm gương đạo đức hay một câu chuyện truyền cảm hứng. Ngài tự xưng là \"đường đi, lẽ thật và sự sống\" (Giăng 14:6) — không chỉ đưa ra lời khuyên, mà mời gọi con người bước vào mối tương giao với Đức Chúa Trời.",
  whyP2:
    "Đối với người tin Chúa, đức tin nơi Ngài không chỉ là chấp nhận một giáo lý, mà là đặt lòng tin nơi một Đấng đang sống — Đấng ban sự tha thứ, mục đích sống và hy vọng đời đời.",
  readGospels: "Đọc Phúc Âm",
};

type Lang = "en" | "vi";
const CONTENT: Record<Lang, typeof EN> = { en: EN, vi: VI };

export default function WhoIsJesusLangPage() {
  const params = useParams();
  const lang = (params?.lang as string)?.toLowerCase();
  if (lang !== "en" && lang !== "vi") notFound();

  const content = CONTENT[lang as Lang];
  const { fontSize } = useBibleApp();

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

        <p className="mt-4 text-muted-foreground leading-relaxed">
          {content.intro1}
        </p>

        <blockquote className="mt-3 pl-4 border-l-2 border-primary/40 not-italic">
          <p className="font-semibold text-foreground leading-relaxed">
            &ldquo;{content.intro1Quote}&rdquo;
          </p>
        </blockquote>

        <p className="mt-4 text-muted-foreground leading-relaxed">
          {content.intro2}
        </p>
      </div>

      <section className="mb-10">
        <h2 className="font-bible-english text-2xl font-semibold text-foreground mb-4">
          {content.fullyTitle}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-5 bg-card border border-sage-dark/20 rounded-2xl">
            <p className="font-semibold text-foreground mb-2">{content.humanTitle}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {content.humanBody}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-3 font-mono">
              {content.humanRef}
            </p>
          </div>

          <div className="p-5 bg-card border border-sage-dark/20 rounded-2xl">
            <p className="font-semibold text-foreground mb-2">{content.divineTitle}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {content.divineBody}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-3 font-mono">
              {content.divineRef}
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10 p-6 bg-card border border-sage-dark/20 rounded-2xl">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-3">
          {content.crossTitle}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {content.crossP1}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {content.crossP2}
        </p>
        <p className="text-xs font-mono text-muted-foreground/60 mt-4">
          {content.crossRef}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-bible-english text-xl font-semibold text-foreground mb-2">
          {content.prophecyTitle}
        </h2>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          {content.prophecyIntro}
        </p>
        <div className="space-y-2">
          {PROPHECY_ITEMS.map((p, i) => (
            <div
              key={i}
              className="flex items-start gap-4 px-4 py-3 bg-card border border-sage-dark/20 rounded-xl"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0 mt-2" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  {content.prophecies[p.prophecyKey]}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-0.5 font-mono">
                  {content.refs[p.refKey]} → {content.fulfilled[p.fulfilledKey]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 p-6 bg-primary-light/10 gap-6 border border-primary-dark/30 rounded-2xl">
        <h2 className="font-bible-english text-xl font-semibold mb-3">
          {content.whyTitle}
        </h2>
        <p className="text-sm leading-relaxed opacity-80">
          {content.whyP1}
        </p>
        <p className="text-sm leading-relaxed opacity-80 mt-3">
          {content.whyP2}
        </p>
        <Link
          href={`/bible/${lang}/read`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium opacity-90 hover:opacity-100 transition-opacity"
        >
          {content.readGospels} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
