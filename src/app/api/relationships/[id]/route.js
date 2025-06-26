// src/app/api/relationships/[id]/route.js (adjust path based on your project structure)
import { NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

export async function DELETE(request, context) {
  try {
    const { params } = await context; // Await the context to get params
    const { id } = params; // Safely destructure id

    const query = `
      MATCH ()-[r]-() WHERE id(r) = $id
      DELETE r
    `;

    await runQuery(query, { id: Number.parseInt(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting relationship:", error);
    return NextResponse.json(
      { error: "Failed to delete relationship" },
      { status: 500 }
    );
  }
}
