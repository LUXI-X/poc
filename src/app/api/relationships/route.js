import { NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

export async function POST(request) {
  try {
    const relationshipData = await request.json();

    const query = `
      MATCH (a), (b)
      WHERE id(a) = $sourceId AND id(b) = $targetId
      CREATE (a)-[r:${relationshipData.type}]->(b)
      RETURN id(r) as id, id(a) as source, id(b) as target, type(r) as type
    `;

    const params = {
      sourceId: Number.parseInt(relationshipData.source),
      targetId: Number.parseInt(relationshipData.target),
    };

    const result = await runQuery(query, params);

    if (result.length > 0) {
      const newRelationship = {
        id: result[0].id.toString(),
        source: result[0].source.toString(),
        target: result[0].target.toString(),
        type: result[0].type,
      };

      return NextResponse.json(newRelationship);
    }

    throw new Error("Failed to create relationship");
  } catch (error) {
    console.error("Error creating relationship:", error);
    return NextResponse.json(
      { error: "Failed to create relationship" },
      { status: 500 }
    );
  }
}
