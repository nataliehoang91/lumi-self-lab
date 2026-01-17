-- CreateTable
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "whyMatters" TEXT,
    "hypothesis" TEXT,
    "durationDays" INTEGER NOT NULL,
    "frequency" TEXT NOT NULL,
    "faithEnabled" BOOLEAN NOT NULL DEFAULT false,
    "scriptureNotes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Experiment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentField" (
    "id" TEXT NOT NULL,
    "experimentId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "textType" TEXT,
    "emojiCount" INTEGER,
    "minValue" INTEGER,
    "maxValue" INTEGER,
    "selectOptions" TEXT[],

    CONSTRAINT "ExperimentField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentCheckin" (
    "id" TEXT NOT NULL,
    "experimentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "checkinDate" TIMESTAMP(3) NOT NULL,
    "aiSummary" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperimentCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentCheckinResponse" (
    "id" TEXT NOT NULL,
    "checkinId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "responseText" TEXT,
    "responseNumber" INTEGER,
    "responseEmoji" TEXT,
    "responseBool" BOOLEAN,
    "selectedOption" TEXT,
    "aiFeedback" TEXT,

    CONSTRAINT "ExperimentCheckinResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExperimentField" ADD CONSTRAINT "ExperimentField_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentCheckin" ADD CONSTRAINT "ExperimentCheckin_experimentId_fkey" FOREIGN KEY ("experimentId") REFERENCES "Experiment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentCheckinResponse" ADD CONSTRAINT "ExperimentCheckinResponse_checkinId_fkey" FOREIGN KEY ("checkinId") REFERENCES "ExperimentCheckin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExperimentCheckinResponse" ADD CONSTRAINT "ExperimentCheckinResponse_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "ExperimentField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
