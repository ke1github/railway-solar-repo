// lib/utils/form-helpers.ts
import { z } from "zod";

/**
 * Validates form data using a Zod schema and returns the result
 * @param schema The Zod schema to validate against
 * @param formData The form data to validate
 * @returns An object with the validation result
 */
export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData
): { success: boolean; data?: T; errors?: Record<string, string[]> } {
  // Extract data from FormData
  const data: Record<string, unknown> = {};

  formData.forEach((value, key) => {
    // Handle multiple values for the same key (like checkboxes)
    if (data[key]) {
      if (Array.isArray(data[key])) {
        (data[key] as unknown[]).push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }

    // Convert "true" and "false" strings to boolean values
    if (value === "true") data[key] = true;
    if (value === "false") data[key] = false;

    // Convert empty strings to undefined for optional fields
    if (value === "") data[key] = undefined;

    // Convert numeric strings to numbers
    if (
      typeof value === "string" &&
      !isNaN(Number(value)) &&
      value.trim() !== ""
    ) {
      data[key] = Number(value);
    }
  });

  // Validate with Zod
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format the errors by field name
      const errors: Record<string, string[]> = {};

      error.issues.forEach((err) => {
        const field = err.path.join(".");
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(err.message);
      });

      return { success: false, errors };
    }

    // Handle other errors
    return {
      success: false,
      errors: { _form: ["An unexpected error occurred"] },
    };
  }
}

/**
 * Formats validation errors from Zod for display in forms
 * @param errors The validation errors object
 * @returns A formatted error message string
 */
export function formatValidationErrors(
  errors: Record<string, string[]>
): string {
  return Object.entries(errors)
    .map(([field, messages]) => {
      const fieldName = field === "_form" ? "Form" : field;
      return `${fieldName}: ${messages.join(", ")}`;
    })
    .join("; ");
}

/**
 * Extracts specific fields from a form submission
 * @param formData The form data to extract from
 * @param fields The fields to extract
 * @returns An object with the extracted fields
 */
export function extractFormFields(
  formData: FormData,
  fields: string[]
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  fields.forEach((field) => {
    const value = formData.get(field);
    if (value !== null) {
      result[field] = value;
    }
  });

  return result;
}

/**
 * Creates a form submission handler with Zod validation
 * @param schema The Zod schema to validate against
 * @param onSubmit The function to call with validated data
 * @returns A form submission handler function
 */
export function createFormHandler<T>(
  schema: z.ZodSchema<T>,
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>
) {
  return async function handleSubmit(formData: FormData) {
    // Validate the form data
    const validationResult = validateFormData(schema, formData);

    if (!validationResult.success || !validationResult.data) {
      const errorMessage = validationResult.errors
        ? formatValidationErrors(validationResult.errors)
        : "Invalid form data";
      return { success: false, error: errorMessage };
    }

    // Submit the validated data
    return await onSubmit(validationResult.data);
  };
}
