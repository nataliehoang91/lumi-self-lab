import type { PrismaClient } from "@prisma/client";

/** Fixed flash card sets (categories). No create-form; add more here if needed. */
const FIXED_SETS = [
  { name: "Default", sortOrder: 0 },
  { name: "Favorites", sortOrder: 1 },
  { name: "Memorizing", sortOrder: 2 },
  { name: "Review", sortOrder: 3 },
];

export async function seedFlashCardSets(prisma: PrismaClient) {
  const count = await prisma.flashCardSet.count();
  if (count > 0) {
    console.log("FlashCardSet already has data, skipping seed.");
    return;
  }
  await prisma.flashCardSet.createMany({
    data: FIXED_SETS.map((s) => ({ name: s.name, sortOrder: s.sortOrder })),
  });
  console.log(`Seeded ${FIXED_SETS.length} flash card sets.`);
}
