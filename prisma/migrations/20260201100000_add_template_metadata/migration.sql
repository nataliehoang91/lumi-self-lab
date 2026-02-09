-- AlterTable (Phase T.2 — template metadata for UI)
ALTER TABLE "ExperimentTemplate" ADD COLUMN     "categories" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "ExperimentTemplate" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "ExperimentTemplate" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "ExperimentTemplate" ADD COLUMN     "difficulty" TEXT;
ALTER TABLE "ExperimentTemplate" ADD COLUMN     "rating" DOUBLE PRECISION;
ALTER TABLE "ExperimentTemplate" ADD COLUMN     "usageCount" INTEGER;
