// lib/handler/error.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";

/**
 * Standard error types used across the application
 */
export enum ErrorType {
  VALIDATION = "validation_error",
  NOT_FOUND = "not_found",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  DATABASE = "database_error",
  SERVER = "server_error",
  EXTERNAL_SERVICE = "external_service_error",
  BAD_REQUEST = "bad_request",
}

/**
 * ApiError class for standardized error handling
 */
export class ApiError extends Error {
  public statusCode: number;
  public type: ErrorType;
  public details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    type: ErrorType = ErrorType.SERVER,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.type = type;
    this.details = details;
  }

  /**
   * Create a formatted response from the error
   */
  toResponse(): NextResponse {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: this.message,
          type: this.type,
          details: this.details,
        },
      },
      { status: this.statusCode }
    );
  }

  /**
   * Create a not found error
   */
  static notFound(entity: string, details?: Record<string, unknown>): ApiError {
    return new ApiError(
      `${entity} not found`,
      404,
      ErrorType.NOT_FOUND,
      details
    );
  }

  /**
   * Create a validation error
   */
  static validation(
    message: string,
    details?: Record<string, unknown>
  ): ApiError {
    return new ApiError(message, 400, ErrorType.VALIDATION, details);
  }

  /**
   * Create an unauthorized error
   */
  static unauthorized(
    message: string = "Unauthorized",
    details?: Record<string, unknown>
  ): ApiError {
    return new ApiError(message, 401, ErrorType.UNAUTHORIZED, details);
  }

  /**
   * Create a forbidden error
   */
  static forbidden(
    message: string = "Forbidden",
    details?: Record<string, unknown>
  ): ApiError {
    return new ApiError(message, 403, ErrorType.FORBIDDEN, details);
  }

  /**
   * Create a database error
   */
  static database(
    message: string = "Database error",
    details?: Record<string, unknown>
  ): ApiError {
    return new ApiError(message, 500, ErrorType.DATABASE, details);
  }

  /**
   * Create a bad request error
   */
  static badRequest(
    message: string = "Bad request",
    details?: Record<string, unknown>
  ): ApiError {
    return new ApiError(message, 400, ErrorType.BAD_REQUEST, details);
  }

  /**
   * Create an external service error
   */
  static externalService(
    service: string,
    message?: string,
    details?: Record<string, unknown>
  ): ApiError {
    return new ApiError(
      message || `Error from external service: ${service}`,
      503,
      ErrorType.EXTERNAL_SERVICE,
      details
    );
  }
}

/**
 * Handle errors in a consistent way across the application
 */
export function handleError(error: unknown): NextResponse {
  console.error("Error caught by handler:", error);

  // Handle ZodError (validation errors)
  if (error instanceof ZodError) {
    const formattedErrors = formatZodErrors(error);
    return new ApiError("Validation error", 400, ErrorType.VALIDATION, {
      validationErrors: formattedErrors,
    }).toResponse();
  }

  // Handle ApiError (our custom error)
  if (error instanceof ApiError) {
    return error.toResponse();
  }

  // Handle mongoose unique constraint errors
  if (
    isMongooseError(error) &&
    error.name === "MongoServerError" &&
    error.code === 11000
  ) {
    const field = Object.keys(error.keyPattern || {})[0] || "field";
    return new ApiError(`Duplicate ${field} value`, 409, ErrorType.VALIDATION, {
      field,
    }).toResponse();
  }

  // Handle generic Error
  if (error instanceof Error) {
    return new ApiError(error.message, 500, ErrorType.SERVER).toResponse();
  }

  // Handle unknown errors
  return new ApiError(
    "An unexpected error occurred",
    500,
    ErrorType.SERVER
  ).toResponse();
}

/**
 * Check if an error is a Mongoose error
 */
interface MongooseErrorLike {
  name: string;
  code?: number;
  keyPattern?: Record<string, unknown>;
}

function isMongooseError(error: unknown): error is MongooseErrorLike {
  const err = error as MongooseErrorLike;
  return (
    !!err &&
    typeof err === "object" &&
    typeof err.name === "string" &&
    [
      "MongooseError",
      "ValidationError",
      "CastError",
      "MongoServerError",
    ].includes(err.name)
  );
}

/**
 * Format Zod validation errors to be more user-friendly
 */
function formatZodErrors(error: ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  error.format()._errors.forEach((message) => {
    if (!errors["_general"]) {
      errors["_general"] = [];
    }
    errors["_general"].push(message);
  });

  // Get nested errors from formErrors

  const processFormattedErrors = (
    obj: Record<string, unknown>,
    path: string = ""
  ) => {
    for (const key in obj) {
      if (key === "_errors" && Array.isArray(obj[key]) && obj[key].length > 0) {
        const currentPath = path || "_general";

        if (!errors[currentPath]) {
          errors[currentPath] = [];
        }

        errors[currentPath].push(...obj[key]);
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        const newPath = path ? `${path}.${key}` : key;
        processFormattedErrors(obj[key] as Record<string, unknown>, newPath);
      }
    }
  };

  processFormattedErrors(error.format());

  return errors;
}
