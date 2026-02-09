-- CreateTable
CREATE TABLE "ExperimentTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "durationDays" INTEGER,
    "frequency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExperimentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExperimentTemplateField" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "textType" TEXT,
    "minValue" INTEGER,
    "maxValue" INTEGER,
    "emojiCount" INTEGER,
    "selectOptions" TEXT[],

    CONSTRAINT "ExperimentTemplateField_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExperimentTemplate_key_key" ON "ExperimentTemplate"("key");

-- CreateIndex
CREATE INDEX "ExperimentTemplate_key_idx" ON "ExperimentTemplate"("key");

-- CreateIndex
CREATE INDEX "ExperimentTemplateField_templateId_idx" ON "ExperimentTemplateField"("templateId");

-- AddForeignKey
ALTER TABLE "ExperimentTemplateField" ADD CONSTRAINT "ExperimentTemplateField_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ExperimentTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;
