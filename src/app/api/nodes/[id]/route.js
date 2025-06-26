import { NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

export async function PUT(request, { params }) {
  try {
    const { id } = params; // ✅ No await needed here

    const nodeData = await request.json();

    const query = `
      MATCH (n) WHERE id(n) = $id
      SET n += $properties
      RETURN id(n) as id, labels(n)[0] as type, properties(n) as properties, n.name as name
    `;

    const queryParams = {
      id: Number.parseInt(id),
      properties: {
        name: nodeData.name,
        ...nodeData.properties,
      },
    };

    const result = await runQuery(query, queryParams);

    if (result.length > 0) {
      const updatedNode = {
        id: result[0].id.toString(),
        name: result[0].name,
        type: result[0].type,
        properties: result[0].properties,
      };

      return NextResponse.json(updatedNode);
    }

    return NextResponse.json({ error: "Node not found" }, { status: 404 });
  } catch (error) {
    console.error("Error updating node:", error);
    return NextResponse.json(
      { error: "Failed to update node" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params; // ✅ No await needed here
    console.log("DELETE /api/nodes/[id] - ID:", id); // Debug log

    const query = `
      MATCH (n) WHERE id(n) = $id
      DETACH DELETE n
    `;

    await runQuery(query, { id: Number.parseInt(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting node:", error);
    return NextResponse.json(
      { error: "Failed to delete node" },
      { status: 500 }
    );
  }
}
