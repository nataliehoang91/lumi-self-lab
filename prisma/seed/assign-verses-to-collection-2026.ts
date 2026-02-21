import type { PrismaClient } from "@prisma/client";

const COLLECTION_NAME = "Collection 2026";
const SORT_ORDER = 2;

/** Ensure "Collection 2026" exists (sortOrder 2) and assign all current verses to it. */
export async function assignVersesToCollection2026(prisma: PrismaClient) {
  let collection = await prisma.flashCardCollection.findFirst({
    where: { name: COLLECTION_NAME },
  });
  if (!collection) {
    collection = await prisma.flashCardCollection.create({
      data: { name: COLLECTION_NAME, sortOrder: SORT_ORDER },
    });
    console.log(`Created collection: ${COLLECTION_NAME} (sortOrder ${SORT_ORDER}).`);
  } else if (collection.sortOrder !== SORT_ORDER) {
    collection = await prisma.flashCardCollection.update({
      where: { id: collection.id },
      data: { sortOrder: SORT_ORDER },
    });
    console.log(`Updated ${COLLECTION_NAME} sortOrder to ${SORT_ORDER}.`);
  }

  const result = await prisma.flashVerse.updateMany({
    data: { collectionId: collection.id },
  });
  console.log(`Assigned ${result.count} verse(s) to "${COLLECTION_NAME}".`);
}
