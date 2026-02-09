/**
 * Phase 1.2: Validate check-in responses against experiment field definitions.
 * Used by POST and PATCH check-in routes.
 */

export type FieldForValidation = {
  id: string;
  type: string;
  required: boolean;
  minValue: number | null;
  maxValue: number | null;
  emojiCount: number | null;
  selectOptions: string[];
};

export type ResponseForValidation = {
  fieldId: string;
  responseText?: string | null;
  responseNumber?: number | null;
  responseBool?: boolean | null;
  selectedOption?: string | null;
};

export type ValidationError = {
  error: "Invalid field response";
  fieldId: string;
  reason: string;
};

/**
 * Validate all responses against field definitions.
 * Returns the first validation error, or null if valid.
 */
export function validateCheckInResponses(
  fields: FieldForValidation[],
  responses: ResponseForValidation[] | undefined | null
): ValidationError | null {
  const responseList = Array.isArray(responses) ? responses : [];
  const fieldMap = new Map(fields.map((f) => [f.id, f]));

  // Check required fields have a valid response
  for (const field of fields) {
    if (!field.required) continue;
    const resp = responseList.find((r) => r.fieldId === field.id);
    const err = validateOneResponse(field, resp);
    if (err) return err;
  }

  // Validate each submitted response
  for (const resp of responseList) {
    const field = fieldMap.get(resp.fieldId);
    if (!field) {
      return {
        error: "Invalid field response",
        fieldId: resp.fieldId,
        reason: "Field does not belong to this experiment.",
      };
    }
    const err = validateOneResponse(field, resp);
    if (err) return err;
  }

  return null;
}

function validateOneResponse(
  field: FieldForValidation,
  response: ResponseForValidation | undefined
): ValidationError | null {
  switch (field.type) {
    case "text": {
      const value = response?.responseText;
      if (field.required && (value === undefined || value === null || String(value).trim() === "")) {
        return { error: "Invalid field response", fieldId: field.id, reason: "Required text field is empty." };
      }
      if (value !== undefined && value !== null && typeof value !== "string") {
        return { error: "Invalid field response", fieldId: field.id, reason: "Text field must be a string." };
      }
      return null;
    }

    case "number": {
      const value = response?.responseNumber;
      if (field.required && (value === undefined || value === null)) {
        return { error: "Invalid field response", fieldId: field.id, reason: "Required number field is missing." };
      }
      if (value !== undefined && value !== null) {
        const n = Number(value);
        if (Number.isNaN(n)) {
          return { error: "Invalid field response", fieldId: field.id, reason: "Number field must be a valid number." };
        }
        if (field.minValue != null && n < field.minValue) {
          return { error: "Invalid field response", fieldId: field.id, reason: `Value must be at least ${field.minValue}.` };
        }
        if (field.maxValue != null && n > field.maxValue) {
          return { error: "Invalid field response", fieldId: field.id, reason: `Value must be at most ${field.maxValue}.` };
        }
      }
      return null;
    }

    case "yesno": {
      const value = response?.responseBool;
      if (field.required && (value === undefined || value === null)) {
        return { error: "Invalid field response", fieldId: field.id, reason: "Required yes/no field is missing." };
      }
      if (value !== undefined && value !== null && typeof value !== "boolean") {
        return { error: "Invalid field response", fieldId: field.id, reason: "Yes/no field must be true or false." };
      }
      return null;
    }

    case "emoji": {
      const value = response?.responseNumber;
      if (field.required && (value === undefined || value === null)) {
        return { error: "Invalid field response", fieldId: field.id, reason: "Required emoji field is missing." };
      }
      const count = field.emojiCount ?? 0;
      if (count <= 0) {
        return { error: "Invalid field response", fieldId: field.id, reason: "Emoji field has invalid configuration." };
      }
      if (value !== undefined && value !== null) {
        const n = Number(value);
        if (!Number.isInteger(n) || n < 1 || n > count) {
          return { error: "Invalid field response", fieldId: field.id, reason: `Value must be between 1 and ${count}.` };
        }
      }
      return null;
    }

    case "select": {
      const value = response?.selectedOption;
      if (field.required && (value === undefined || value === null || String(value).trim() === "")) {
        return { error: "Invalid field response", fieldId: field.id, reason: "Required select field is missing." };
      }
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        const options = field.selectOptions ?? [];
        if (!options.includes(value)) {
          return { error: "Invalid field response", fieldId: field.id, reason: "Selected option is not allowed." };
        }
      }
      return null;
    }

    default:
      return { error: "Invalid field response", fieldId: field.id, reason: `Unknown field type: ${field.type}.` };
  }
}
