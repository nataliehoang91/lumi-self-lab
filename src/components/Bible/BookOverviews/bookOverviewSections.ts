/**
 * Bible book section grouping for the book-overviews TOC.
 * Matches the structure used in /bible/[lang]/learn/bible-structure (What Is the Bible).
 */

export interface BookSectionConfig {
  title: string;
  bookCount: number;
  description: string;
}

/** OT: Law (5), History (12), Poetry & Wisdom (5), Prophets (17) = 39 */
export const OT_SECTIONS: BookSectionConfig[] = [
  {
    title: "Law",
    bookCount: 5,
    description:
      "Genesis through Deuteronomy — creation, the fall, and God's covenant with Israel.",
  },
  {
    title: "History",
    bookCount: 12,
    description:
      "Joshua through Esther — Israel's story in the Promised Land, kings, exile, and return.",
  },
  {
    title: "Poetry & Wisdom",
    bookCount: 5,
    description:
      "Job through Song of Solomon — reflection on suffering, praise, wisdom, and love.",
  },
  {
    title: "Prophets",
    bookCount: 17,
    description:
      "Isaiah through Malachi — God's messengers calling Israel back, pointing forward to Christ.",
  },
];

/** NT: Gospels (4), History (1), Letters (21), Prophecy (1) = 27 */
export const NT_SECTIONS: BookSectionConfig[] = [
  {
    title: "Gospels",
    bookCount: 4,
    description:
      "Matthew, Mark, Luke, John — four accounts of Jesus' life, ministry, death, and resurrection.",
  },
  {
    title: "History",
    bookCount: 1,
    description:
      "Acts — the story of the early church spreading from Jerusalem to the ends of the earth.",
  },
  {
    title: "Letters",
    bookCount: 21,
    description:
      "Romans through Jude — Paul and others writing to churches and individuals about faith and life.",
  },
  {
    title: "Prophecy",
    bookCount: 1,
    description:
      "Revelation — a vision of the end of history and the victory of Christ.",
  },
];
