-- CreateTable
CREATE TABLE "ExperimentReminder" (
    "experimentId" TEXT NOT NULL,
    "pausedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperimentReminder_pkey" PRIMARY KEY ("experimentId")
);

-- AddForeignKey
ALTER TABLE "ExperimentReminder" ADD CONSTRAINT "ExperimentReminder_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
