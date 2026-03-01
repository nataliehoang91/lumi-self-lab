"use client";

import { useState } from "react";
import type { MapLocationId } from "@/components/Bible/Learn/LearnOriginMap";
import { LearnBibleOriginIntro } from "@/components/Bible/Learn/BibleOrigin/shared-components/LearnBibleOriginIntro";
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

function getMapLabels(loc: Record<MapLocationId, MapLocationInfo>): Record<MapLocationId, string> {
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
    desc: "Trung tâm thuộc linh của dân Y-sơ-ra-ên xưa, nơi Đền thờ được xây dựng và Lời Chúa được đọc công khai.",
  },
  qumran: {
    label: "Qumran",
    desc: "Vùng gần Biển Chết, nơi Cuộn Sách Biển Chết được phát hiện năm 1947, xác nhận độ chính xác của bản thảo Cựu Ước.",
  },
  alexandria: {
    label: "A-léc-xan-ri-a",
    desc: "Thành phố cảng lớn với cộng đồng Do Thái đông đảo, nơi bản dịch Hy Lạp của Cựu Ước (Bản Bảy Mươi) được hình thành.",
  },
  rome: {
    label: "Rô-ma",
    desc: "Thủ đô Đế quốc La Mã, nơi Hội thánh sơ khai được gây dựng và bản dịch Latin Vulgate có ảnh hưởng sâu rộng.",
  },
  antioch: {
    label: "An-ti-ốt",
    desc: 'Nơi các môn đồ lần đầu tiên được gọi là "Cơ Đốc nhân" và là điểm xuất phát của nhiều chuyến hành trình truyền giáo của Phao-lô.',
  },
  sinai: {
    label: "Núi Si-na-i",
    desc: "Nơi Môi-se nhận Luật pháp theo tường thuật Kinh Thánh — điểm khởi đầu quan trọng của văn bản Kinh Thánh.",
  },
};

const VN_TIMELINE: readonly TimelineItem[] = [
  {
    year: "~1400 TCN",
    event: "Các sách Cựu Ước sớm nhất được viết (Ngũ Kinh)",
    desc: "Ngũ Kinh đặt nền tảng cho đức tin Israel — bao gồm luật pháp, lịch sử khởi nguyên và giao ước giữa Đức Chúa Trời với dân Ngài.",
  },
  {
    year: "~450 TCN",
    event: "Canon Cựu Ước cơ bản hoàn chỉnh",
    desc: "Luật pháp và các sách Tiên tri được xác lập vững chắc trong đời sống thờ phượng Do Thái, hình thành cốt lõi của chính điển Hê-bơ-rơ.",
  },
  {
    year: "~250 TCN",
    event: "Bản Bảy Mươi ra đời tại Alexandria",
    desc: "Bản dịch Hy Lạp đầu tiên của Cựu Ước giúp Kinh Thánh tiếp cận thế giới Hy Lạp hóa và được sử dụng rộng rãi trong Hội Thánh đầu tiên.",
  },
  {
    year: "50–95 SCN",
    event: "Các sách Tân Ước được viết",
    desc: "Các thư tín và sách Tin Lành được sao chép, lưu hành giữa các Hội Thánh khắp Đế quốc La Mã, dần được xem là có thẩm quyền thuộc linh.",
  },
  {
    year: "367 SCN",
    event: "Athanasius liệt kê 27 sách Tân Ước",
    desc: "Lần đầu tiên danh sách 27 sách Tân Ước được ghi lại rõ ràng, phản ánh những bản văn đã được sử dụng rộng rãi trong Hội Thánh.",
  },
  {
    year: "400 SCN",
    event: "Jerome hoàn thành Vulgate",
    desc: "Bản dịch Kinh Thánh sang tiếng Latin này trở thành bản văn chuẩn tại Tây phương suốt hơn một thiên niên kỷ.",
  },
  {
    year: "1947",
    event: "Cuộn Sách Biển Chết được phát hiện",
    desc: "Các bản thảo cổ từ thế kỷ thứ ba TCN cho thấy văn bản Cựu Ước được bảo tồn với độ chính xác đáng kinh ngạc qua nhiều thế kỷ.",
  },
];

const VN_FAQ: readonly FaqItem[] = [
  {
    q: "Tại sao Kinh thánh Tin Lành và Công giáo khác nhau về độ dài?",
    a: "Kinh thánh Công giáo gồm thêm 7 sách gọi là Deuterocanonical (hoặc Apocrypha), viết giữa thời Cựu Ước và Tân Ước. Các nhà Cải chính Tin Lành theo canon Hê-bơ-rơ, loại trừ các sách này, nên hầu hết Kinh thánh Tin Lành có 66 sách còn Kinh thánh Công giáo có 73.",
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
    q: "Canon Tân Ước được quyết định như thế nào?",
    a: "Hội thánh sơ khai kiểm tra các tác phẩm theo ba tiêu chí: tác giả sứ đồ (viết bởi sứ đồ hoặc người gần gũi), nhất quán với giáo lý đã được thiết lập, và được sử dụng rộng rãi trong các Hội thánh. Đến thế kỷ 4, 27 sách Tân Ước đã được công nhận rộng rãi.",
  },
];

export function VnBibleOriginPage() {
  const [mapActiveLocation, setMapActiveLocation] = useState<MapLocationId | null>(null);
  const mapLabels = getMapLabels(VN_MAP_LOCATIONS);

  return (
    <article aria-label="Nguồn gốc Kinh thánh & Hình thành Chính Điển">
      <LearnBibleOriginIntro
        moduleNum="02 / 04"
        title="Nguồn gốc Kinh thánh & Hình thành Chính Điển"
        intro="Làm thế nào 66 sách, được viết bởi hàng chục tác giả qua 1.500 năm, được công nhận là một văn bản có thẩm quyền? Câu trả lời trải dài từ bản thảo cổ đại, tranh luận trong Hội thánh sơ khai, đến các khám phá khảo cổ."
      />

      <LearnBibleOriginLanguages
        originalLanguages="Ngôn ngữ gốc"
        lang={["Hê-bơ-rơ", "Hy Lạp", "A-ram"]}
        langNote={["Phần lớn Cựu Ước", "Toàn bộ Tân Ước", "Một số đoạn trong Đa-ni-ên & E-xơ-ra"]}
      />

      <LearnBibleOriginTimeline
        timeline="Dòng thời gian bản thảo"
        timelineItems={VN_TIMELINE}
        mapLocations={VN_MAP_LOCATIONS}
        mapLabels={mapLabels}
      />

      <LearnBibleOriginMapSection
        mapTitle="Bản đồ bản thảo Kinh thánh"
        mapBody="Một vài địa điểm trọng yếu nơi Kinh thánh được viết, sao chép, dịch và được gìn giữ qua nhiều thế kỷ."
        activeId={mapActiveLocation}
        onActiveChange={setMapActiveLocation}
        labels={mapLabels}
        renderPopover={(id) => VN_MAP_LOCATIONS[id]}
      />

      <LearnBibleOriginReliable
        reliableTitle="Tại sao Kinh thánh được xem là đáng tin?"
        reliableP1="Tân Ước có nhiều bằng chứng bản thảo hơn bất kỳ tài liệu cổ đại nào — hơn 5.800 bản thảo Hy Lạp, so với chưa đến 650 bản cho Iliad của Homer. Khoảng cách thời gian giữa bản gốc và bản thảo còn lại sớm nhất cũng rất ngắn (vài thập kỷ, không phải thế kỷ)."
        reliableP2="Cuộn Sách Biển Chết xác nhận văn bản Cựu Ước được bảo tồn với độ chính xác phi thường qua hơn một ngàn năm sao chép. Truyền thống kinh sư trong Do Thái giáo rất tỉ mỉ — một lỗi trên một trang có thể khiến phải hủy toàn bộ cuộn."
      />

      <LearnBibleOriginFaq faqTitle="Câu hỏi thường gặp" faq={VN_FAQ} />
    </article>
  );
}
