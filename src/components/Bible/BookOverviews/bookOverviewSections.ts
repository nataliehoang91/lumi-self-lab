/**
 * Bible book section grouping for the book-overviews TOC.
 * Matches the structure used in /bible/[lang]/learn/bible-structure (What Is the Bible).
 */

export interface BookSectionConfig {
  title: string;
  titleVi?: string;
  bookCount: number;
  description: string;
  descriptionVi?: string;
}

/** OT: Law (5), History (12), Poetry & Wisdom (5), Prophets (17) = 39 */
export const OT_SECTIONS: BookSectionConfig[] = [
  {
    title: "Law",
    titleVi: "Luật pháp",
    bookCount: 5,
    description:
      "Genesis through Deuteronomy — creation, the fall, and God's covenant with Israel.",
    descriptionVi:
      "Sáng thế ký đến Phục truyền Luật lệ ký — sáng thế, sự sa ngã và giao ước của Đức Chúa Trời với dân Ít-ra-ên.",
  },
  {
    title: "History",
    titleVi: "Lịch sử",
    bookCount: 12,
    description:
      "Joshua through Esther — Israel's story in the Promised Land, kings, exile, and return.",
    descriptionVi:
      "Giô-suê đến Ê-xơ-tê — câu chuyện của Ít-ra-ên trong Đất Hứa, các vua, lưu đày và trở về.",
  },
  {
    title: "Poetry & Wisdom",
    titleVi: "Thi ca & Khôn ngoan",
    bookCount: 5,
    description:
      "Job through Song of Solomon — reflection on suffering, praise, wisdom, and love.",
    descriptionVi:
      "Gióp đến Nhã ca — suy ngẫm về đau khổ, ngợi khen, khôn ngoan và tình yêu.",
  },
  {
    title: "Prophets",
    titleVi: "Tiên tri",
    bookCount: 17,
    description:
      "Isaiah through Malachi — God's messengers calling Israel back, pointing forward to Christ.",
    descriptionVi:
      "Ê-sai đến Ma-la-chi — các sứ giả của Đức Chúa Trời kêu gọi Ít-ra-ên trở lại và chỉ về Đấng Christ.",
  },
];

/** NT: Gospels (4), History (1), Letters (21), Prophecy (1) = 27 */
export const NT_SECTIONS: BookSectionConfig[] = [
  {
    title: "Gospels",
    titleVi: "Phúc Âm",
    bookCount: 4,
    description:
      "Matthew, Mark, Luke, John — four accounts of Jesus' life, ministry, death, and resurrection.",
    descriptionVi:
      "Ma-thi-ơ, Mác, Lu-ca, Giăng — bốn sách ghi lại cuộc đời, chức vụ, sự chết và sự sống lại của Chúa Jêsus.",
  },
  {
    title: "History",
    titleVi: "Lịch sử",
    bookCount: 1,
    description:
      "Acts — the story of the early church spreading from Jerusalem to the ends of the earth.",
    descriptionVi:
      "Công vụ các Sứ đồ — câu chuyện về Hội Thánh đầu tiên lan rộng từ Giê-ru-sa-lem đến khắp thế giới.",
  },
  {
    title: "Letters",
    titleVi: "Thư tín",
    bookCount: 21,
    description:
      "Romans through Jude — Paul and others writing to churches and individuals about faith and life.",
    descriptionVi:
      "Rô-ma đến Giu-đe — Phao-lô và các tác giả khác viết cho Hội Thánh và các cá nhân về đức tin và đời sống.",
  },
  {
    title: "Prophecy",
    titleVi: "Khải huyền",
    bookCount: 1,
    description:
      "Revelation — a vision of the end of history and the victory of Christ.",
    descriptionVi:
      "Khải Huyền — khải tượng về kết thúc của lịch sử và chiến thắng của Đấng Christ.",
  },
];
