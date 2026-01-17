/*
  Warnings:

  - You are about to drop the column `userId` on the `Experiment` table. All the data in the column will be lost.
  - You are about to drop the `ExperimentCheckin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExperimentCheckinResponse` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clerkUserId` to the `Experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Experiment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ExperimentCheckin" DROP CONSTRAINT "ExperimentCheckin_experimentId_fkey";

-- DropForeignKey
ALTER TABLE "ExperimentCheckinResponse" DROP CONSTRAINT "ExperimentCheckinResponse_checkinId_fkey";

-- DropForeignKey
ALTER TABLE "ExperimentCheckinResponse" DROP CONSTRAINT "ExperimentCheckinResponse_fieldId_fkey";

-- DropForeignKey
ALTER TABLE "ExperimentField" DROP CONSTRAINT "ExperimentField_experimentId_fkey";

-- AlterTable
ALTER TABLE "Experiment" DROP COLUMN "userId",
ADD COLUMN     "clerkUserId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "ExperimentCheckin";

-- DropTable
DROP TABLE "ExperimentCheckinResponse";

-- CreateTable
CREATE TABLE "ExperimentCheckIn" (
    "id" TEXT NOT NULL,
    "experimentId" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "checkInDate" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "aiSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperimentCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentFieldResponse" (
    "id" TEXT NOT NULL,
    "checkInId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "responseText" TEXT,
    "responseNumber" INTEGER,
    "responseEmoji" TEXT,
    "responseBool" BOOLEAN,
    "selectedOption" TEXT,
    "aiFeedback" TEXT,

    CONSTRAINT "ExperimentFieldResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExperimentCheckIn_experimentId_idx" ON "ExperimentCheckIn"("experimentId");

-- CreateIndex
CREATE INDEX "ExperimentCheckIn_clerkUserId_idx" ON "ExperimentCheckIn"("clerkUserId");

-- CreateIndex
CREATE INDEX "ExperimentFieldResponse_checkInId_idx" ON "ExperimentFieldResponse"("checkInId");

-- CreateIndex
CREATE INDEX "ExperimentFieldResponse_fieldId_idx" ON "ExperimentFieldResponse"("fieldId");

-- CreateIndex
CREATE INDEX "Experiment_clerkUserId_idx" ON "Experiment"("clerkUserId");

-- CreateIndex
CREATE INDEX "ExperimentField_experimentId_idx" ON "ExperimentField"("experimentId");

-- AddForeignKey
ALTER TABLE "ExperimentField" ADD CONSTRAINT "ExperimentField_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentCheckIn" ADD CONSTRAINT "ExperimentCheckIn_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentFieldResponse" ADD CONSTRAINT "ExperimentFieldResponse_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "ExperimentCheckIn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentFieldResponse" ADD CONSTRAINT "ExperimentFieldResponse_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ExperimentField"("id") ON DELETE CASCADE ON UPDATE CASCADE;
