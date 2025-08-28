import { NextRequest, NextResponse } from "next/server";
import { getSites } from "@/lib/actions/site-actions";

export async function GET(request: NextRequest) {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || undefined;
    const cluster = searchParams.get("cluster") || undefined;

    // Call the existing getSites function
    const result = await getSites(page, limit, search, cluster);

    // Return the data
    return NextResponse.json(result);
  } catch (error) {
    console.error("API error in /api/sites:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching sites",
      },
      { status: 500 }
    );
  }
}
