import { NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

export async function POST(request) {
  try {
    const { queries } = await request.json();

    if (!queries || typeof queries !== "string") {
      return NextResponse.json(
        { error: "Queries parameter is required and must be a string" },
        { status: 400 }
      );
    }

    // Split queries by semicolon and filter out empty ones
    const queryList = queries
      .split(";")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    if (queryList.length === 0) {
      return NextResponse.json(
        { error: "No valid queries found" },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    // Execute each query
    for (let i = 0; i < queryList.length; i++) {
      const query = queryList[i];
      try {
        console.log(`Executing query ${i + 1}:`, query);
        const result = await runQuery(query);
        results.push({
          query: query,
          success: true,
          result: result,
          affectedRows: result.length,
        });
      } catch (error) {
        console.error(`Error in query ${i + 1}:`, error);
        errors.push({
          query: query,
          error: error.message,
          queryIndex: i + 1,
        });
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      totalQueries: queryList.length,
      successfulQueries: results.length,
      failedQueries: errors.length,
      results: results,
      errors: errors,
      message:
        errors.length === 0
          ? `All ${queryList.length} queries executed successfully`
          : `${results.length} of ${queryList.length} queries executed successfully`,
    });
  } catch (error) {
    console.error("Error executing queries:", error);
    return NextResponse.json(
      { error: "Failed to execute queries", details: error.message },
      { status: 500 }
    );
  }
}
