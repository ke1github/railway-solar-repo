// lib/utils/response.ts
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { handleError } from "../handler/error";

/**
 * Standard API response format
 */
export interface ApiResponseType<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    type: string;
    details?: Record<string, unknown>;
  };
  message?: string;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

/**
 * Create a success response
 */
export function successResponse<T = unknown>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiResponseType<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  status: number = 400,
  details?: Record<string, unknown>
): NextResponse<ApiResponseType> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        type: "error",
        details,
      },
    },
    { status }
  );
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T = unknown>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number,
  message?: string
): NextResponse<ApiResponseType<T[]>> {
  const totalPages = Math.ceil(totalItems / limit);

  return NextResponse.json(
    {
      success: true,
      data,
      message,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
    },
    { status: 200 }
  );
}

/**
 * Create a not found response
 */
export function notFoundResponse(
  entity: string,
  id?: string
): NextResponse<ApiResponseType> {
  const message = id
    ? `${entity} with id ${id} not found`
    : `${entity} not found`;

  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        type: "not_found",
      },
    },
    { status: 404 }
  );
}

/**
 * Handle errors and convert to standardized API responses
 */
export function handleApiError(error: unknown): NextResponse {
  return handleError(error);
}

/**
 * Validate request data with Zod schema
 */
export function validateRequest<T>(
  schema: { parse: (data: unknown) => T },
  data: unknown
): { success: true; data: T } | { success: false; error: ZodError } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}
