-- CreateTable
CREATE TABLE "BibleStudyList" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BibleStudyList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BibleStudyList_clerkUserId_idx" ON "BibleStudyList"("clerkUserId");
