import type { PrismaClient } from "@prisma/client";

/** Initial collections for user to choose from. Admin can add more later. */
const FIXED_COLLECTIONS = [
  { name: "This month", sortOrder: 0 },
  { name: "Favorites", sortOrder: 1 },
  { name: "Collection 2026", sortOrder: 2 },
  { name: "To memorize", sortOrder: 3 },
];

export async function seedFlashCardCollections(prisma: PrismaClient) {
  const count = await prisma.flashCardCollection.count();
  if (count > 0) {
    console.log("FlashCardCollection already has data, skipping seed.");
    return;
  }
  await prisma.flashCardCollection.createMany({
    data: FIXED_COLLECTIONS.map((c) => ({ name: c.name, sortOrder: c.sortOrder })),
  });
  console.log(`Seeded ${FIXED_COLLECTIONS.length} flash card collections.`);
}
