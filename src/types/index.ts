/**
 * Types Index
 * 
 * Central export point for all types in the application.
 * Import types from here: import type { Experiment, UIExperiment } from "@/types";
 * 
 * Note: We use Prisma for database operations and basic search (contains queries).
 * Typesense is NOT needed - Prisma search is sufficient for this use case.
 */

// Database types (Prisma-generated)
export type {
  Experiment,
  ExperimentField,
  ExperimentCheckIn,
  ExperimentFieldResponse,
  ExperimentWithRelations,
  ExperimentFieldWithRelations,
  ExperimentCheckInWithRelations,
  ExperimentFieldResponseWithRelations,
} from "./database";

// Domain types (experiments)
export type {
  ExperimentStatus,
  ExperimentFrequency,
  FieldType,
  TextType,
  EmojiCount,
  CustomField,
  UIExperiment,
  UIExperimentDetail,
  UICheckIn,
  UIFieldResponse,
  CreateExperimentRequest,
  UpdateExperimentRequest,
  CreateFieldRequest,
  CreateCheckInRequest,
  CreateFieldResponseRequest,
  ExperimentFilterStatus,
  ExperimentFilters,
} from "./experiments";
