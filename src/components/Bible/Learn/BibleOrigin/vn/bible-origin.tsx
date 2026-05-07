"use client";

import { useState } from "react";
import type { MapLocationId } from "@/components/Bible/Learn/LearnOriginMap";
import { LearnBibleOriginIntro } from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginIntro";
import { useBibleFontClasses } from "@/components/Bible/useBibleFontClasses";
import { cn } from "@/lib/utils";
import { LearnBibleOriginLanguages } from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginLanguages";
import {
  LearnBibleOriginTimeline,
  type TimelineItem,
  type MapLocationInfo,
} from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginTimeline";
import { LearnBibleOriginMapSection } from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginMapSection";
import { LearnBibleOriginReliable } from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginReliable";
import {
  LearnBibleOriginFaq,
  type FaqItem,
} from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginFaq";
import { RevealSection } from "@/components/Bible/Learn/shared-components/RevealSection";
import { LearnHeroImage } from "@/components/Bible/Learn/shared-components/LearnHeroImage";

function getMapLabels(
  loc: Record<MapLocationId, MapLocationInfo>
): Record<MapLocationId, string> {
  return {
    jerusalem: loc.jerusalem.label,
    qumran: loc.qumran.label,
    alexandria: loc.alexandria.label,
    rome: loc.rome.label,
    antioch: loc.antioch.label,
    sinai: loc.sinai.label,
  };
}

const VN_MAP_LOCATIONS: Record<MapLocationId, MapLocationInfo> = {
  jerusalem: {
    label: "Giê-ru-sa-lem",
    desc: "Trung tâm của dân Y-sơ-ra-ên, nơi Đền thờ được xây dựng và Kinh Thánh được đọc công khai.",
  },
  qumran: {
    label: "Qumran",
    desc: "Nơi phát hiện Cuộn Sách Biển Chết năm 1947, cho thấy bản Cựu Ước được giữ rất chính xác qua thời gian.",
  },
  alexandria: {
    label: "A-léc-xan-ri-a",
    desc: "Thành phố lớn nơi Cựu Ước được dịch sang tiếng Hy Lạp, giúp nhiều người có thể đọc Kinh Thánh.",
  },
  rome: {
    label: "Rô-ma",
    desc: "Thủ đô La Mã, nơi Hội Thánh phát triển mạnh và Kinh Thánh được phổ biến rộng rãi tại phương Tây.",
  },
  antioch: {
    label: "An-ti-ốt",
    desc: 'Nơi các môn đồ lần đầu được gọi là "Cơ Đốc nhân" và là điểm xuất phát của nhiều hành trình truyền giáo.',
  },
  sinai: {
    label: "Núi Si-na-i",
    desc: "Theo Kinh Thánh, nơi Môi-se nhận Luật pháp — một phần nền tảng của Cựu Ước.",
  },
};

const VN_TIMELINE: readonly TimelineItem[] = [
  {
    year: "~1400 TCN",
    event: "Những phần đầu tiên của Cựu Ước được viết",
    desc: "Đặt nền tảng cho đức tin Y-sơ-ra-ên — bao gồm luật pháp, lịch sử ban đầu và giao ước giữa Đức Chúa Trời với dân Ngài.",
  },
  {
    year: "~450 TCN",
    event: "Cựu Ước dần được xác lập",
    desc: "Các sách luật và tiên tri được sử dụng rộng rãi trong đời sống đức tin, hình thành nền tảng của Cựu Ước.",
  },
  {
    year: "~250 TCN",
    event: "Kinh Thánh được dịch sang tiếng Hy Lạp",
    desc: "Bản dịch này giúp Kinh Thánh đến gần hơn với nhiều người ngoài Do Thái và được sử dụng rộng rãi.",
  },
  {
    year: "50–95 SCN",
    event: "Các sách Tân Ước được viết",
    desc: "Các sách về Chúa Giê-xu và Hội Thánh đầu tiên được viết và lưu hành giữa các cộng đồng tín hữu.",
  },
  {
    year: "367 SCN",
    event: "Danh sách 27 sách Tân Ước được ghi nhận",
    desc: "Danh sách này phản ánh những sách đã được sử dụng rộng rãi trong Hội Thánh.",
  },
  {
    year: "400 SCN",
    event: "Kinh Thánh được dịch sang tiếng Latin",
    desc: "Bản dịch này trở thành bản Kinh Thánh phổ biến tại phương Tây trong nhiều thế kỷ.",
  },
  {
    year: "1947",
    event: "Phát hiện Cuộn Sách Biển Chết",
    desc: "Cho thấy bản Cựu Ước đã được bảo tồn rất chính xác qua hàng ngàn năm.",
  },
];

const VN_FAQ: readonly FaqItem[] = [
  {
    q: "Tại sao Kinh thánh Tin Lành và Công giáo khác nhau về độ dài?",
    a: "Kinh thánh Công giáo bao gồm thêm 7 sách thường được gọi là Deuterocanonical (hoặc Apocrypha). Các sách này được viết trong giai đoạn giữa Cựu Ước và Tân Ước. Truyền thống Tin Lành theo danh sách các sách Cựu Ước của Do Thái giáo, nên không bao gồm các sách này. Vì vậy Kinh thánh Tin Lành có 66 sách, còn Kinh thánh Công giáo có 73.",
  },
  {
    q: "Cuộn Sách Biển Chết là gì và tại sao quan trọng?",
    a: "Được phát hiện năm 1947 gần Biển Chết, các cuộn là bản thảo Hê-bơ-rơ cổ nhất — một số từ khoảng 200 TCN. So với bản thảo sau này, văn bản được bảo tồn đáng kinh ngạc, cung cấp bằng chứng mạnh mẽ cho sự truyền tải chính xác của Kinh thánh qua nhiều thế kỷ.",
  },
  {
    q: "Kinh thánh ban đầu được viết bằng ngôn ngữ nào?",
    a: "Cựu Ước chủ yếu viết bằng tiếng Hê-bơ-rơ, một phần nhỏ bằng tiếng A-ram. Tân Ước viết bằng tiếng Hy Lạp Koine — ngôn ngữ phổ thông của thế giới Địa Trung Hải thế kỷ nhất.",
  },
  {
    q: "Danh sách 27 sách Tân Ước được quyết định như thế nào?",
    a: "Hội thánh sơ khai kiểm tra các tác phẩm theo ba tiêu chí: tác giả sứ đồ (viết bởi sứ đồ hoặc người gần gũi), nhất quán với giáo lý đã được thiết lập, và được sử dụng rộng rãi trong các Hội thánh. Đến thế kỷ 4, 27 sách Tân Ước đã được công nhận rộng rãi.",
  },
];

export function VnBibleOriginPage() {
  const [mapActiveLocation, setMapActiveLocation] = useState<MapLocationId | null>(null);
  const { bodyClassUp } = useBibleFontClasses();
  const mapLabels = getMapLabels(VN_MAP_LOCATIONS);

  return (
    <article
      aria-label="Kinh Thánh đến với chúng ta như thế nào?"
      className="text-foreground"
    >
      <LearnBibleOriginIntro
        bodyBright
        locale="vi"
        moduleNum="02 / 05"
        title="Kinh Thánh đến với chúng ta như thế nào?"
        intro={
          <>
            <p className={cn("mb-6 leading-relaxed")}>
              Nhiều người từng đặt câu hỏi:{" "}
              <span className="font-semibold">Kinh Thánh</span> được viết cách đây hàng
              ngàn năm — vậy làm sao chúng ta biết nội dung ngày nay vẫn đáng tin?
            </p>

            <p className={cn("mb-10 leading-relaxed")}>
              Phần này giúp bạn nhìn lại hành trình của{" "}
              <span className="font-semibold">Kinh Thánh</span> từ lúc được viết, sao
              chép, cho đến khi trở thành cuốn sách mà chúng ta có ngày hôm nay.
            </p>
          </>
        }
      />

      <RevealSection>
        <LearnHeroImage
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80"
          alt="Thư viện cổ với những cuốn sách lịch sử"
          credit="Ảnh: Janko Ferlič / Unsplash"
          creditHref="https://unsplash.com/photos/sfL_QOnmy00"
        />
      </RevealSection>

      <RevealSection>
        <LearnBibleOriginLanguages
          locale="vi"
          originalLanguages="Ngôn ngữ gốc"
          lang={["Hê-bơ-rơ", "Hy Lạp", "A-ram"]}
          langNote={[
            "Phần lớn Cựu Ước",
            "Toàn bộ Tân Ước",
            "Một số đoạn trong Đa-ni-ên & E-xơ-ra",
          ]}
        />
      </RevealSection>

      <RevealSection>
        <LearnBibleOriginTimeline
          locale="vi"
          timeline="Dòng thời gian bản thảo"
          timelineItems={VN_TIMELINE}
          mapLocations={VN_MAP_LOCATIONS}
          mapLabels={mapLabels}
        />
      </RevealSection>

      <RevealSection>
        <LearnBibleOriginMapSection
          bodyBright
          locale="vi"
          mapTitle="Bản đồ bản thảo Kinh thánh"
          mapBody="Một vài địa điểm trọng yếu nơi Kinh thánh được viết, sao chép, dịch và được gìn giữ qua nhiều thế kỷ."
          activeId={mapActiveLocation}
          onActiveChange={setMapActiveLocation}
          labels={mapLabels}
          renderPopover={(id) => VN_MAP_LOCATIONS[id]}
        />
      </RevealSection>

      <RevealSection>
        <LearnBibleOriginReliable
          locale="vi"
          reliableTitle="Tại sao Kinh Thánh được xem là đáng tin?"
          reliableP1="Kinh Thánh không chỉ tồn tại qua thời gian — nó còn được bảo tồn với độ chính xác cao. Tân Ước có hàng ngàn bản chép cổ, nhiều hơn hầu hết các tác phẩm cổ đại."
          reliableP2="Dù có khác biệt nhỏ giữa các bản chép, nội dung chính vẫn giữ nguyên. Cuộn Sách Biển Chết (1947) cho thấy bản Cựu Ước gần như không thay đổi sau hàng ngàn năm."
          reliableP3={
            <>
              Nếu Kinh Thánh đáng tin đến vậy, câu hỏi không còn là{" "}
              <strong>&quot;Kinh Thánh có đúng không?&quot; </strong>
              nữa. Mà là:{" "}
              <strong>&quot;Kinh Thánh nói gì về tương lai của chính bạn?&quot;</strong>
            </>
          }
        />
      </RevealSection>

      <RevealSection>
        <LearnBibleOriginFaq locale="vi" faqTitle="Câu hỏi thường gặp" faq={VN_FAQ} />
      </RevealSection>
    </article>
  );
}
