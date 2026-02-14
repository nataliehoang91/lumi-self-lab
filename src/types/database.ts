/**
 * Database Types
 *
 * These types are generated from Prisma schema.
 * Import from @prisma/client for the actual types used in code.
 *
 * This file serves as documentation/reference for the database structure.
 */

import type {
  Experiment as PrismaExperiment,
  ExperimentField as PrismaExperimentField,
  ExperimentCheckIn as PrismaExperimentCheckIn,
  ExperimentFieldResponse as PrismaExperimentFieldResponse,
} from "@prisma/client";

// Re-export Prisma types for convenience
export type Experiment = PrismaExperiment;
export type ExperimentField = PrismaExperimentField;
export type ExperimentCheckIn = PrismaExperimentCheckIn;
export type ExperimentFieldResponse = PrismaExperimentFieldResponse;

// Types with relations included
export type ExperimentWithRelations = PrismaExperiment & {
  fields: ExperimentField[];
  checkIns: ExperimentCheckIn[];
};

export type ExperimentFieldWithRelations = PrismaExperimentField & {
  experiment: PrismaExperiment;
  responses: PrismaExperimentFieldResponse[];
};

export type ExperimentCheckInWithRelations = PrismaExperimentCheckIn & {
  experiment: PrismaExperiment;
  responses: ExperimentFieldResponseWithRelations[];
};

export type ExperimentFieldResponseWithRelations = PrismaExperimentFieldResponse & {
  checkIn: PrismaExperimentCheckIn;
  field: PrismaExperimentField;
};
