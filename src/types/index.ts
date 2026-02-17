/**
 * Shared types used across the app.
 */

// Re-export experiment and database types so existing "@/types" imports keep working
export type {
  ExperimentStatus,
  ExperimentFrequency,
  FieldType,
  TextType,
  EmojiCount,
  CustomField,
  UIExperiment,
  UIExperimentDetail,
  CreateExperimentRequest,
  CreateFieldResponseRequest,
  UICheckIn,
  ExperimentFilterStatus,
  ExperimentFilters,
} from "./experiments";
export type {
  Experiment,
  ExperimentField,
  ExperimentCheckIn,
  ExperimentFieldResponse,
  ExperimentWithRelations,
  ExperimentFieldWithRelations,
} from "./database";

// ---------------------------------------------------------------------------
// Error handling (for catch blocks, API errors)
// ---------------------------------------------------------------------------

/**
 * Error shape commonly returned by APIs (e.g. Clerk, form validation):
 * optional `errors` array with objects that have an optional `message`.
 */
export type ErrorWithErrors = {
  errors?: Array<{ message?: string }>;
};

/**
 * Get a user-facing error message from an unknown catch value.
 * Use in catch blocks instead of typing `err: any` or repeating the same cast.
 *
 * @param err - The caught value (unknown)
 * @param fallback - Message to return when no message is found
 * @returns The first error message, or the fallback
 */
export function getErrorMessage(err: unknown, fallback: string): string {
  const withErrors = err as ErrorWithErrors;
  return withErrors?.errors?.[0]?.message ?? fallback;
}
