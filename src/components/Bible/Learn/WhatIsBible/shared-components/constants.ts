export interface TestamentSectionConfig {
  nameKey: 0 | 1 | 2 | 3;
  descKey: 0 | 1 | 2 | 3;
  books: number;
}

export const OT_SECTIONS: TestamentSectionConfig[] = [
  { nameKey: 0, descKey: 0, books: 5 },
  { nameKey: 1, descKey: 1, books: 12 },
  { nameKey: 2, descKey: 2, books: 5 },
  { nameKey: 3, descKey: 3, books: 17 },
];

export const NT_SECTIONS: TestamentSectionConfig[] = [
  { nameKey: 0, descKey: 0, books: 4 },
  { nameKey: 1, descKey: 1, books: 1 },
  { nameKey: 2, descKey: 2, books: 21 },
  { nameKey: 3, descKey: 3, books: 1 },
];

export const STATS = [
  { v: "66", labelKey: 0 },
  { v: "39", labelKey: 1 },
  { v: "27", labelKey: 2 },
  { v: "~40", labelKey: 3 },
] as const;
