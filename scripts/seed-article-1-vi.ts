/**
 * Seeds the Vietnamese translation of "The Light of the Gospel"
 * and updates sourceUrl/sourceLabel on both EN and VI records.
 * Source reference: Bob Hoekstra, "Day by Day by Grace" — Blue Letter Bible
 * https://www.blueletterbible.org/devotionals/dbdbg/view.cfm
 * Content is an AI translation of the EN article (not copied from source).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const slug = "the-light-of-the-gospel";

  // Update source fields on EN record
  await prisma.bibleDeepDive.update({
    where: { slug_lang: { slug, lang: "en" } },
    data: {
      sourceUrl: "https://www.blueletterbible.org/devotionals/dbdbg/view.cfm",
      sourceLabel: "Bob Hoekstra, \"Day by Day by Grace\" — Blue Letter Bible",
    },
  });
  console.log("✓ Updated sourceUrl/sourceLabel on EN record");

  // Upsert VI translation
  await prisma.bibleDeepDive.upsert({
    where: { slug_lang: { slug, lang: "vi" } },
    create: {
      slug,
      lang: "vi",
      title: "Ánh Sáng Phúc Âm",
      scriptureRef: "2 Cô-rinh-tô 4:4–5",
      scriptureText:
        "Trong số đó, thần của đời này đã làm mù lòng những kẻ chẳng tin, hầu cho họ không trông thấy sự sáng láng của Tin lành về sự vinh hiển của Đấng Christ, là ảnh tượng của Đức Chúa Trời. Vì chúng tôi chẳng giảng chính mình tôi, nhưng giảng Đức Chúa Jêsus Christ, tức là Chúa; còn chúng tôi chỉ là tôi tớ của anh em, vì cớ Đức Chúa Jêsus.\n— 2 Cô-rinh-tô 4:4–5 (BTT)",
      coverImage:
        "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=1200&auto=format&fit=crop&q=80",
      sourceUrl: "https://www.blueletterbible.org/devotionals/dbdbg/view.cfm",
      sourceLabel: "Bob Hoekstra, \"Day by Day by Grace\" — Blue Letter Bible",
      reflection: `<p>Kẻ thù của linh hồn con người muốn giữ những người đang hư mất trong sự mù quáng thuộc linh. Ảnh hưởng của hắn len lỏi qua từng hệ thống của thế giới không tin Chúa — chính trị, văn hóa, giáo dục — với một mục tiêu duy nhất: ngăn ánh sáng Phúc Âm không chiếu rọi vào.</p>

<p>Thế nhưng, vào trong thế giới tối tăm này, chúng ta đến mang theo điều phi thường — <em>"ánh sáng của Phúc Âm chiếu rọi sự vinh hiển của Đấng Christ."</em> Đây không chỉ là thông tin. Đây là ánh sáng. Và ánh sáng, theo bản chất của nó, sẽ thắng bóng tối.</p>

<p>Chúa Jêsus đã nói rõ: <em>"Ta là sự sáng của thế gian; người nào theo ta sẽ chẳng đi trong nơi tối tăm, nhưng có ánh sáng của sự sống"</em> (Giăng 8:12). Khi ánh sáng của Đấng Christ chiếu vào linh hồn con người, nó không chỉ thông báo — nó biến đổi. Nó dẫn người đó từ bóng tối sang ánh sáng, từ quyền lực của Sa-tan đến với Đức Chúa Trời (Công vụ 26:18).</p>

<h2>Không Phải Chính Mình, Nhưng Là Đấng Christ</h2>

<p>Phao-lô cẩn thận làm rõ thông điệp này <em>không</em> về điều gì. Đó không phải về sứ giả. <em>"Vì chúng tôi chẳng giảng chính mình tôi, nhưng giảng Đức Chúa Jêsus Christ, tức là Chúa."</em> Điều này vừa là sự giải phóng vừa là sự chỉnh sửa.</p>

<p>Là sự giải phóng — vì gánh nặng cứu rỗi thế giới không đặt trên tính cách, sự khéo léo, hay thành tích đạo đức của chúng ta. Chúng ta là tôi tớ. Thông điệp là Đấng Christ.</p>

<p>Là sự chỉnh sửa — vì dễ dàng, ngay cả trong chức vụ, ta làm cho mọi thứ ngầm xoay quanh bản thân: danh tiếng, nền tảng, sự chấp thuận của chúng ta. Phao-lô loại bỏ điều đó. Sự vinh hiển thuộc về Đấng Christ. Chúng ta chỉ là những chiếc bình.</p>

<p>Điều khiến điều này trở nên khả thi là chính Đức Chúa Trời, Đấng đã phán <em>"Hãy có sự sáng"</em> trong bóng tối, đã làm sự sáng của Ngài chiếu vào lòng chúng ta (c.6). Chúng ta mang ánh sáng thật sự — không phải của chúng ta, nhưng là của Ngài — và điều đó là quá đủ.</p>`,
      application: `<ul>
<li>Hãy thành thật hỏi bản thân: trong các cuộc trò chuyện tuần này, bạn đang hướng người khác đến Đấng Christ — hay đến bản thân, ý kiến, thành tích của mình?</li>
<li>Suy ngẫm Ê-phê-sô 5:8: <em>"Vì anh em đã từng là sự tối tăm, mà bây giờ là sự sáng trong Chúa; hãy bước đi như là con cái của sự sáng."</em> Sống trong danh tính đó ngày hôm nay trông như thế nào?</li>
<li>Nếu có ai đó trong cuộc sống của bạn dường như "bị mù quáng" — không phản hồi thuộc linh — hãy cầu nguyện đặc biệt cho họ. Cầu xin Đức Chúa Trời xuyên thủng bóng tối của họ, như Ngài đã từng xuyên thủng bóng tối của bạn.</li>
</ul>`,
      prayer:
        "Lạy Chúa vinh hiển, cảm ơn Ngài đã đưa con ra khỏi bóng tối và vào trong ánh sáng của Ngài. Xin gìn giữ con khỏi việc biến chức vụ — hay ngay cả cuộc sống hàng ngày — thành về bản thân con. Xin cho lời nói và bước đi của con hướng rõ ràng về Ngài. Khi con bị cám dỗ tìm kiếm sự công nhận của riêng mình, xin nhắc nhở con: Phúc Âm là về vinh hiển của Ngài, không phải của con. Xin chiếu sáng qua con ngày hôm nay. Amen.",
      isPublished: true,
      publishedAt: new Date("2025-05-18"),
      createdBy: "admin",
    },
    update: {
      title: "Ánh Sáng Phúc Âm",
      scriptureRef: "2 Cô-rinh-tô 4:4–5",
      scriptureText:
        "Trong số đó, thần của đời này đã làm mù lòng những kẻ chẳng tin, hầu cho họ không trông thấy sự sáng láng của Tin lành về sự vinh hiển của Đấng Christ, là ảnh tượng của Đức Chúa Trời. Vì chúng tôi chẳng giảng chính mình tôi, nhưng giảng Đức Chúa Jêsus Christ, tức là Chúa; còn chúng tôi chỉ là tôi tớ của anh em, vì cớ Đức Chúa Jêsus.\n— 2 Cô-rinh-tô 4:4–5 (BTT)",
      sourceUrl: "https://www.blueletterbible.org/devotionals/dbdbg/view.cfm",
      sourceLabel: "Bob Hoekstra, \"Day by Day by Grace\" — Blue Letter Bible",
      isPublished: true,
    },
  });
  console.log("✓ Upserted VI translation");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
