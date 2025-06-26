// import { NextResponse } from "next/server";
// import { runQuery } from "@/lib/neo4j";

// export async function GET() {
//   try {
//     // Fetch all nodes
//     const nodesQuery = `
//       MATCH (n)
//       RETURN
//         id(n) as id,
//         labels(n)[0] as type,
//         properties(n) as properties,
//         n.name as name
//     `;

//     // Fetch all relationships
//     const relationshipsQuery = `
//       MATCH (a)-[r]->(b)
//       RETURN
//         id(r) as id,
//         id(a) as source,
//         id(b) as target,
//         type(r) as type,
//         properties(r) as properties
//     `;

//     const [nodeResults, relationshipResults] = await Promise.all([
//       runQuery(nodesQuery),
//       runQuery(relationshipsQuery),
//     ]);

//     const nodes = nodeResults.map((record) => ({
//       id: record.id.toString(),
//       name: record.name || "Unnamed",
//       type: record.type,
//       properties: record.properties || {},
//     }));

//     const relationships = relationshipResults.map((record) => ({
//       id: record.id.toString(),
//       source: record.source.toString(),
//       target: record.target.toString(),
//       type: record.type,
//       properties: record.properties || {},
//     }));

//     return NextResponse.json({ nodes, relationships });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch data" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     const { query, params } = await request.json();

//     const result = await runQuery(query, params);

//     return NextResponse.json({ success: true, result });
//   } catch (error) {
//     console.error("Error executing query:", error);
//     return NextResponse.json(
//       { error: "Failed to execute query" },
//       { status: 500 }
//     );
//   }
// }
// src/pages/api/data.js
import { NextResponse } from "next/server";
import { runQuery } from "@/lib/neo4j";

export async function GET() {
  try {
    // Fetch all nodes
    const nodesQuery = `
      MATCH (n) 
      RETURN 
        id(n) as id,
        labels(n)[0] as type,
        properties(n) as properties,
        n.name as name
    `;

    // Fetch all relationships
    const relationshipsQuery = `
      MATCH (a)-[r]->(b)
      RETURN 
        id(r) as id,
        id(a) as source,
        id(b) as target,
        type(r) as type,
        properties(r) as properties
    `;

    const [nodeResults, relationshipResults] = await Promise.all([
      runQuery(nodesQuery),
      runQuery(relationshipsQuery),
    ]);

    const nodes = nodeResults.map((record) => ({
      id: String(record.id), // Ensure ID is string
      name: record.name || "Unnamed",
      type: record.type,
      properties: record.properties || {},
    }));

    const relationships = relationshipResults.map((record) => ({
      id: String(record.id), // Ensure ID is string
      source: String(record.source), // Ensure source is string
      target: String(record.target), // Ensure target is string
      type: record.type,
      properties: record.properties || {},
    }));

    return NextResponse.json({ nodes, relationships });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { query, params } = await request.json();
    const result = await runQuery(query, params);

    // Convert IDs in POST results
    const convertedResult = result.map((record) => {
      const converted = {};
      for (const [key, value] of Object.entries(record)) {
        if (key === "id" || key === "source" || key === "target") {
          converted[key] = String(value);
        } else {
          converted[key] = value;
        }
      }
      return converted;
    });

    return NextResponse.json({ success: true, result: convertedResult });
  } catch (error) {
    console.error("Error executing query:", error);
    return NextResponse.json(
      { error: "Failed to execute query" },
      { status: 500 }
    );
  }
}
