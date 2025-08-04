// lib/utils/api-response.ts

/**
 * Standard API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: Record<string, unknown>;
}

/**
 * Create a successful API response
 * @param data Response data
 * @param meta Optional metadata
 * @returns Formatted API response
 */
export function successResponse<T>(
  data: T,
  meta?: Record<string, unknown>
): ApiResponse<T> {
  return {
    success: true,
    data,
    ...(meta ? { meta } : {}),
  };
}

/**
 * Create an error API response
 * @param message Error message
 * @param errors Optional detailed errors
 * @param meta Optional metadata
 * @returns Formatted API error response
 */
export function errorResponse(
  message: string,
  errors?: Record<string, string[]>,
  meta?: Record<string, unknown>
): ApiResponse<never> {
  return {
    success: false,
    error: message,
    ...(errors ? { errors } : {}),
    ...(meta ? { meta } : {}),
  };
}

/**
 * Create a paginated API response
 * @param data Response data array
 * @param page Current page number
 * @param limit Items per page
 * @param total Total items count
 * @param additionalMeta Optional additional metadata
 * @returns Formatted paginated API response
 */
export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  additionalMeta?: Record<string, unknown>
): ApiResponse<T[]> {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    meta: {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
      ...(additionalMeta || {}),
    },
  };
}

/**
 * Create a validation error response
 * @param validationErrors Validation errors
 * @returns Formatted validation error response
 */
export function validationErrorResponse(
  validationErrors: Record<string, string[]>
): ApiResponse<never> {
  return {
    success: false,
    error: "Validation failed",
    errors: validationErrors,
  };
}

/**
 * Create a not found error response
 * @param resourceType Type of resource that wasn't found
 * @param id Identifier that was looked up
 * @returns Formatted not found error response
 */
export function notFoundResponse(
  resourceType: string,
  id?: string | number
): ApiResponse<never> {
  const message = id
    ? `${resourceType} not found with ID: ${id}`
    : `${resourceType} not found`;

  return {
    success: false,
    error: message,
  };
}

/**
 * Create an unauthorized error response
 * @param message Custom error message
 * @returns Formatted unauthorized error response
 */
export function unauthorizedResponse(
  message: string = "Unauthorized access"
): ApiResponse<never> {
  return {
    success: false,
    error: message,
  };
}

/**
 * Format a server error response
 * @param error Error object or message
 * @returns Formatted server error response
 */
export function serverErrorResponse(error: Error | string): ApiResponse<never> {
  // In production, don't expose internal error details
  const isProd = process.env.NODE_ENV === "production";

  const errorMessage = typeof error === "string" ? error : error.message;

  return {
    success: false,
    error: isProd ? "An internal server error occurred" : errorMessage,
    ...(isProd
      ? {}
      : { meta: { stack: typeof error === "string" ? null : error.stack } }),
  };
}

/**
 * Format a response for a newly created resource
 * @param data Resource data
 * @param resourceType Type of resource created
 * @param meta Optional metadata
 * @returns Formatted creation success response
 */
export function creationSuccessResponse<T>(
  data: T,
  resourceType: string,
  meta?: Record<string, unknown>
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      message: `${resourceType} created successfully`,
      ...(meta || {}),
    },
  };
}

/**
 * Format a response for an updated resource
 * @param data Updated resource data
 * @param resourceType Type of resource updated
 * @param meta Optional metadata
 * @returns Formatted update success response
 */
export function updateSuccessResponse<T>(
  data: T,
  resourceType: string,
  meta?: Record<string, unknown>
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta: {
      message: `${resourceType} updated successfully`,
      ...(meta || {}),
    },
  };
}

/**
 * Format a response for a deleted resource
 * @param resourceType Type of resource deleted
 * @param id Identifier of the deleted resource
 * @returns Formatted deletion success response
 */
export function deletionSuccessResponse(
  resourceType: string,
  id: string | number
): ApiResponse<null> {
  return {
    success: true,
    data: null,
    meta: {
      message: `${resourceType} with ID ${id} deleted successfully`,
    },
  };
}
