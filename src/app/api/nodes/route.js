import { NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

export async function POST(request) {
  try {
    const nodeData = await request.json();

    const query = `
      CREATE (n:${nodeData.type} $properties)
      RETURN id(n) as id, labels(n)[0] as type, properties(n) as properties, n.name as name
    `;

    const params = {
      properties: {
        name: nodeData.name,
        ...nodeData.properties,
      },
    };

    const result = await runQuery(query, params);

    if (result.length > 0) {
      const newNode = {
        id: result[0].id.toString(),
        name: result[0].name,
        type: result[0].type,
        properties: result[0].properties,
      };

      return NextResponse.json(newNode);
    }

    throw new Error("Failed to create node");
  } catch (error) {
    console.error("Error creating node:", error);
    return NextResponse.json(
      { error: "Failed to create node" },
      { status: 500 }
    );
  }
}
