// lib/utils/data-validation.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from "zod";
import { solarInstallationSchema, energyProductionSchema } from "../schemas";

/**
 * Sanitize user input to prevent XSS and other injection attacks
 * @param input Input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return input;

  // Basic sanitization: remove HTML tags and normalize whitespace
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .trim();
}

/**
 * Sanitize an object's string properties
 * @param obj Object to sanitize
 * @returns Sanitized object
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj } as Record<string, unknown>;

  Object.keys(result).forEach((key) => {
    const value = result[key];

    if (typeof value === "string") {
      result[key] = sanitizeInput(value);
    } else if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    }
  });

  return result as T;
}

/**
 * Parse and validate solar installation data
 * @param data Data to validate
 * @returns Validation result
 */
export function validateSolarInstallation(data: unknown) {
  try {
    const sanitizedData =
      typeof data === "object" && data !== null
        ? sanitizeObject(data as Record<string, unknown>)
        : data;

    const result = solarInstallationSchema.safeParse(sanitizedData);

    if (!result.success) {
      return {
        valid: false,
        errors: formatZodErrors(result.error),
        data: null,
      };
    }

    return {
      valid: true,
      errors: null,
      data: result.data,
    };
  } catch (_) {
    return {
      valid: false,
      errors: { _general: ["Invalid data format"] },
      data: null,
    };
  }
}

/**
 * Parse and validate energy production data
 * @param data Data to validate
 * @returns Validation result
 */
export function validateEnergyProduction(data: unknown) {
  try {
    const sanitizedData =
      typeof data === "object" && data !== null
        ? sanitizeObject(data as Record<string, unknown>)
        : data;

    const result = energyProductionSchema.safeParse(sanitizedData);

    if (!result.success) {
      return {
        valid: false,
        errors: formatZodErrors(result.error),
        data: null,
      };
    }

    return {
      valid: true,
      errors: null,
      data: result.data,
    };
  } catch (_) {
    return {
      valid: false,
      errors: { _general: ["Invalid data format"] },
      data: null,
    };
  }
}

/**
 * Format Zod validation errors into a more user-friendly structure
 * @param error Zod validation error
 * @returns Formatted errors object
 */
export function formatZodErrors(error: z.ZodError) {
  const errors: Record<string, string[]> = {};

  // Process formatted errors from Zod
  const formatted = error.format();

  // Helper function to extract errors from Zod format
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractErrors = (obj: any, prefix = "") => {
    // Check if the current object has _errors
    if (obj._errors && obj._errors.length > 0) {
      const path = prefix || "_general";
      if (!errors[path]) errors[path] = [];
      errors[path].push(...obj._errors);
    }

    // Process child objects (excluding _errors key)
    for (const key in obj) {
      if (
        key !== "_errors" &&
        typeof obj[key] === "object" &&
        obj[key] !== null
      ) {
        const newPrefix = prefix ? `${prefix}.${key}` : key;
        extractErrors(obj[key], newPrefix);
      }
    }
  };

  extractErrors(formatted);
  return errors;
}

/**
 * Format validation errors into human-readable messages
 * @param errors Validation errors object
 * @returns Array of formatted error messages
 */
export function formatValidationErrorMessages(
  errors: Record<string, string[]>
): string[] {
  return Object.entries(errors).map(([field, messages]) => {
    const fieldName =
      field === "_general"
        ? "General"
        : field
            .split(".")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ");

    return `${fieldName}: ${messages.join(", ")}`;
  });
}

/**
 * Validate query parameters against a schema
 * @param query Query parameters object
 * @param schema Zod schema for validation
 * @returns Validated and typed query parameters
 */
export function validateQueryParams<T>(
  query: Record<string, string | string[] | undefined>,
  schema: z.ZodSchema<T>
): { valid: boolean; data?: T; errors?: Record<string, string[]> } {
  try {
    // Convert query params to appropriate types
    const processedQuery: Record<string, unknown> = {};

    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return;

      if (typeof value === "string") {
        // Try to convert to number if it looks like a number
        if (value === "true") {
          processedQuery[key] = true;
        } else if (value === "false") {
          processedQuery[key] = false;
        } else if (!isNaN(Number(value)) && value.trim() !== "") {
          processedQuery[key] = Number(value);
        } else {
          processedQuery[key] = value;
        }
      } else {
        processedQuery[key] = value;
      }
    });

    // Validate with schema
    const result = schema.safeParse(processedQuery);

    if (!result.success) {
      return {
        valid: false,
        errors: formatZodErrors(result.error),
      };
    }

    return {
      valid: true,
      data: result.data,
    };
  } catch (_) {
    return {
      valid: false,
      errors: { _general: ["Invalid query parameters"] },
    };
  }
}

/**
 * Apply data transformations to prepare data for database
 * @param data Raw data object
 * @param transformations Data transformation functions
 * @returns Transformed data
 */
export function applyDataTransformations<T extends Record<string, unknown>>(
  data: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformations: Record<string, (value: any) => unknown>
): T {
  const result = { ...data } as Record<string, unknown>;

  Object.entries(transformations).forEach(([field, transform]) => {
    if (field in result) {
      result[field] = transform(result[field]);
    }
  });

  return result as T;
}

/**
 * Common data transformations for solar installation data
 */
export const solarInstallationTransformations = {
  installationDate: (value: string | Date) => new Date(value),
  commissionDate: (value: string | Date | undefined) =>
    value ? new Date(value) : undefined,
  lastMaintenance: (value: string | Date | undefined) =>
    value ? new Date(value) : undefined,
  capacity: (value: string | number) =>
    typeof value === "string" ? parseFloat(value) : value,
  numberOfPanels: (value: string | number) =>
    typeof value === "string" ? parseInt(value, 10) : value,
  installedArea: (value: string | number) =>
    typeof value === "string" ? parseFloat(value) : value,
  expectedLifespan: (value: string | number) =>
    typeof value === "string" ? parseInt(value, 10) : value,
  warrantyPeriod: (value: string | number | undefined) =>
    typeof value === "string" ? parseInt(value, 10) : value,
  totalCost: (value: string | number | undefined) =>
    typeof value === "string" ? parseFloat(value) : value,
};

/**
 * Common data transformations for energy production data
 */
export const energyProductionTransformations = {
  date: (value: string | Date) => new Date(value),
  energyProduced: (value: string | number) =>
    typeof value === "string" ? parseFloat(value) : value,
  peakOutput: (value: string | number) =>
    typeof value === "string" ? parseFloat(value) : value,
  sunHours: (value: string | number) =>
    typeof value === "string" ? parseFloat(value) : value,
  temperature: (value: string | number | undefined) =>
    typeof value === "string" ? parseFloat(value) : value,
};
