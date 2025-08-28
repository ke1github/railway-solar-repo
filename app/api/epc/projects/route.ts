// app/api/epc/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getEPCProjects } from "@/lib/actions/epc-actions";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    // Ensure MongoDB connection is established
    await connectToDatabase();

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || undefined;
    const priority = searchParams.get("priority") || undefined;

    console.log(
      `API: Fetching EPC projects - page ${page}, limit ${limit}, status: ${
        status || "any"
      }, priority: ${priority || "any"}`
    );

    // Call the server action to get EPC projects
    const result = await getEPCProjects(page, limit, status, priority);

    if (!result.success) {
      console.error(`API Error: ${result.error}`);
      return NextResponse.json(
        { error: result.error || "Failed to fetch EPC projects" },
        { status: 500 }
      );
    }

    // Return successful response
    const projectCount = result.projects?.length || 0;
    console.log(`API: Successfully fetched ${projectCount} EPC projects`);

    return NextResponse.json({
      projects: result.projects,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("API error in EPC projects route:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
