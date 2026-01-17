/**
 * Experiment Domain Types
 * 
 * UI-facing types and business logic types for experiments.
 * These may differ from database types for presentation purposes.
 */

import type { Experiment, ExperimentField, ExperimentCheckIn } from "./database";

// ============================================================================
// Enums
// ============================================================================

export type ExperimentStatus = "draft" | "active" | "completed";
export type ExperimentFrequency = "daily" | "every-2-days" | "weekly";
export type FieldType = "text" | "number" | "select" | "emoji" | "yesno";
export type TextType = "short" | "long";
export type EmojiCount = 3 | 5 | 7;

// ============================================================================
// Field Types
// ============================================================================

export interface CustomField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  order: number;
  
  // Type-specific options
  options?: string[]; // For select type
  minValue?: number; // For number type
  maxValue?: number; // For number type
  textType?: TextType; // For text fields
  emojiCount?: EmojiCount; // For emoji fields (3, 5, or 7)
}

// ============================================================================
// UI Experiment Types (transformed from database)
// ============================================================================

export interface UIExperiment {
  id: string;
  title: string;
  status: ExperimentStatus;
  duration: number; // transformed from durationDays
  frequency: ExperimentFrequency;
  daysCompleted: number; // calculated from check-ins count
  startDate: string | null; // formatted from startedAt
  hypothesis: string;
  whyMatters?: string;
}

export interface UIExperimentDetail extends UIExperiment {
  whyMatters: string;
  faithEnabled: boolean;
  scriptureNotes?: string;
  fields: CustomField[];
  checkIns: UICheckIn[];
}

export interface UICheckIn {
  id: string;
  checkInDate: string; // ISO date string
  notes?: string;
  aiSummary?: string;
  responses: UIFieldResponse[];
}

export interface UIFieldResponse {
  id: string;
  fieldId: string;
  field: CustomField;
  // Only one of these will be set (depends on field.type)
  responseText?: string;
  responseNumber?: number; // For number OR emoji (1-based)
  responseBool?: boolean;
  selectedOption?: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateExperimentRequest {
  title: string;
  whyMatters?: string;
  hypothesis?: string;
  durationDays: number;
  frequency: ExperimentFrequency;
  faithEnabled?: boolean;
  scriptureNotes?: string;
  status?: ExperimentStatus;
  fields?: Omit<CustomField, "id">[]; // id will be generated on server
}

export interface UpdateExperimentRequest extends Partial<CreateExperimentRequest> {
  id: string;
}

export interface CreateFieldRequest {
  label: string;
  type: FieldType;
  required?: boolean;
  order: number;
  textType?: TextType;
  minValue?: number;
  maxValue?: number;
  emojiCount?: EmojiCount;
  selectOptions?: string[];
}

export interface CreateCheckInRequest {
  checkInDate?: string; // ISO date string, defaults to now
  notes?: string;
  aiSummary?: string;
  responses: CreateFieldResponseRequest[];
}

export interface CreateFieldResponseRequest {
  fieldId: string;
  responseText?: string;
  responseNumber?: number;
  responseBool?: boolean;
  selectedOption?: string;
}

// ============================================================================
// Filter Types
// ============================================================================

export type ExperimentFilterStatus = "all" | ExperimentStatus;

export interface ExperimentFilters {
  status?: ExperimentStatus;
  search?: string; // Search in title, whyMatters, hypothesis
}
