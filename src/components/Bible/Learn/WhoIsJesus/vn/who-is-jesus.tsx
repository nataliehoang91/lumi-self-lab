"use client";

import { LearnLessonIntro } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnLessonIntro";
import { LearnFullyGodManSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnFullyGodManSection";
import { LearnCrossSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnCrossSection";
import { LearnProphecySection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnProphecySection";
import { LearnWhyCtaSection } from "@/components/Bible/Learn/WhoIsJesus/shared-components/LearnWhyCtaSection";

const PROPHECY_ITEMS = [
  { prophecy: "Sinh tại Bết-lê-hem", ref: "Mi-chê 5:2", fulfilled: "Ma-thi-ơ 2:1" },
  { prophecy: "Sinh bởi nữ đồng trinh", ref: "Ê-sai 7:14", fulfilled: "Lu-ca 1:27" },
  {
    prophecy: "Vào Giê-ru-sa-lem trên lưng lừa",
    ref: "Xa-cha-ri 9:9",
    fulfilled: "Mác 11:7",
  },
  {
    prophecy: "Bị phản bội với 30 miếng bạc",
    ref: "Xa-cha-ri 11:12",
    fulfilled: "Ma-thi-ơ 26:15",
  },
  {
    prophecy: "Bị đóng đinh, tay chân bị đâm",
    ref: "Thi Thiên 22:16",
    fulfilled: "Lu-ca 24:39",
  },
  {
    prophecy: "Sống lại từ cõi chết",
    ref: "Thi Thiên 16:10",
    fulfilled: "Công Vụ 2:31",
  },
];

export function VnWhoIsJesus() {
  return (
    <article aria-label="Bài học Chúa Jêsus Là Ai?">
      <LearnLessonIntro
        moduleNum="03 / 04"
        title="Chúa Jêsus Là Ai?"
        intro1={
          <>
            Trong suốt hơn hai nghìn năm, con người vẫn tranh luận về thân vị của{" "}
            <strong>Chúa Jêsus</strong>.{" "}
          </>
        }
        intro1Quote={
          <>
            <strong>Ngài</strong> là một thầy giáo? Một nhà tiên tri? Một nhà cách mạng? Một huyền
            thoại? Con Đức Chúa Trời? Hay là Đấng vượt xa mọi tưởng tượng của chúng ta?
          </>
        }
      >
        <>
          <strong>Chúa Jêsus</strong> người Na-xa-rét là nhân vật trung tâm của toàn bộ Kinh Thánh —
          không chỉ riêng Tân Ước. Mọi điều trong Cựu Ước đều hướng về <strong>Ngài</strong>; và mọi
          điều sau <strong>Ngài</strong> đều xuất phát từ <strong>Ngài</strong>.
        </>
      </LearnLessonIntro>

      <LearnFullyGodManSection
        sectionTitle="Trọn Vẹn Là Đức Chúa Trời. Trọn Vẹn Là Con Người."
        leftTitle="Hoàn Toàn Là Con Người"
        leftBody={
          <>
            Chúa Jêsus được sinh ra, lớn lên trong một gia đình bình thường, biết đói, biết mệt,
            từng buồn khóc và cuối cùng đối diện với sự chết. <strong>Ngài</strong> bước vào thân
            phận con người cách trọn vẹn — không từ xa, nhưng từ bên trong.
          </>
        }
        leftRef="Giăng 11:35 · Hê-bơ-rơ 4:15"
        rightTitle="Hoàn Toàn Là Đức Chúa Trời"
        rightBody={
          <>
            Tuy nhiên, <strong>Ngài</strong> cũng tha tội, khiến gió và biển phải vâng lời, nhận sự
            thờ phượng, và sống lại từ cõi chết. Tân Ước không chỉ trình bày <strong>Ngài</strong>{" "}
            như một sứ giả của Đức Chúa Trời, nhưng là Đức Chúa Trời nhập thể.
          </>
        }
        rightRef="Giăng 1:1 · Cô-lô-se 2:9"
      />

      <LearnCrossSection
        title="Thập Tự Giá & Sự Phục Sinh"
        paragraph1={
          <>
            Khoảng năm 30 sau Công Nguyên, Chúa Jêsus bị đóng đinh dưới thời tổng đốc La Mã Bôn-xơ
            Phi-lát. Người tin Chúa tin rằng đây không phải là một tai nạn lịch sử, nhưng là trung
            tâm của kế hoạch cứu chuộc của Đức Chúa Trời. Trên thập tự giá, <strong>Ngài</strong> tự
            nguyện gánh lấy tội lỗi nhân loại — mở đường cho sự tha thứ và sự hòa giải với Đức Chúa
            Trời.
          </>
        }
        paragraph2={
          <>
            Ba ngày sau, <strong>Ngài</strong> sống lại cách thân thể. Sự phục sinh này được công bố
            ngay từ những ngày đầu của Hội Thánh, được xác nhận bởi nhiều nhân chứng và nhiều nguồn
            tường thuật độc lập. Đối với người tin Chúa, đây không chỉ là biểu tượng, mà là bước
            ngoặt quyết định của lịch sử.
          </>
        }
        refText="I Cô-rinh-tô 15:3–8"
      />

      <LearnProphecySection
        title="Sự Ứng Nghiệm Lời Tiên Tri"
        intro={
          <>
            Từ nhiều thế kỷ trước khi Chúa Jêsus ra đời, Kinh Thánh đã nói về một Đấng Mê-si sẽ đến
            — mô tả nơi sinh, sự chịu khổ, và thậm chí cách <strong>Ngài</strong> chịu chết. Người
            tin Chúa tin rằng những lời hứa ấy đã được ứng nghiệm nơi <strong>Ngài</strong>. Dưới
            đây là sáu ví dụ tiêu biểu.
          </>
        }
        items={PROPHECY_ITEMS}
      />

      <LearnWhyCtaSection
        title="Vì Sao Chúa Jêsus Vẫn Quan Trọng Ngày Nay?"
        paragraph1={
          <>
            Nếu Chúa Jêsus thật sự đã sống lại từ cõi chết, thì cuộc đời <strong>Ngài</strong> không
            thể chỉ được xem như một tấm gương đạo đức hay một câu chuyện truyền cảm hứng.{" "}
            <strong>Ngài</strong> tự xưng là &quot;đường đi, lẽ thật và sự sống&quot; (Giăng 14:6) —
            không chỉ đưa ra lời khuyên, mà mời gọi con người bước vào mối tương giao với Đức Chúa
            Trời.
          </>
        }
        paragraph2={
          <>
            Đối với người tin Chúa, đức tin nơi <strong>Ngài</strong> không chỉ là chấp nhận một
            giáo lý, mà là đặt lòng tin nơi một Đấng đang sống — Đấng ban sự tha thứ, mục đích sống
            và hy vọng đời đời.
          </>
        }
        linkHref="/bible/vi/read"
        linkLabel="Đọc Phúc Âm"
      />
    </article>
  );
}
