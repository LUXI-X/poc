// import neo4j from "neo4j-driver";

// const driver = neo4j.driver(
//   process.env.NEO4J_URI,
//   neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
// );

// export async function runQuery(query, params = {}) {
//   const session = driver.session();
//   try {
//     const result = await session.run(query, params);
//     return result.records.map((record) => record.toObject());
//   } catch (error) {
//     console.error("Neo4j query error:", error);
//     throw error;
//   } finally {
//     await session.close();
//   }
// }

// export async function closeDriver() {
//   await driver.close();
// }

// export default driver;
// lib/neo4j.js
// lib/neo4j.js

// lib/neo4j.js
import neo4j from "neo4j-driver";

// Utility function to convert Neo4j types to JavaScript primitives
export const convertNeo4jValue = (value) => {
  if (neo4j.isInt(value)) {
    return Number(value.toString());
  }
  if (
    neo4j.isDate(value) ||
    neo4j.isDateTime(value) ||
    neo4j.isLocalDateTime(value)
  ) {
    return value.toString();
  }
  if (Array.isArray(value)) {
    return value.map(convertNeo4jValue);
  }
  if (value && typeof value === "object" && !neo4j.isInt(value)) {
    const converted = {};
    for (const [key, val] of Object.entries(value)) {
      converted[key] = convertNeo4jValue(val);
    }
    return converted;
  }
  return value;
};

// Convert Neo4j record fields to JavaScript primitives
const convertRecord = (record) => {
  const converted = {};
  record.keys.forEach((key) => {
    converted[key] = convertNeo4jValue(record.get(key));
  });
  return converted;
};

// Validate environment variables
const NEO4J_URI =
  process.env.NEO4J_URI || "neo4j+s://3fb6172a.databases.neo4j.io";
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || "neo4j";
const NEO4J_PASSWORD =
  process.env.NEO4J_PASSWORD || "TdQpKHuhp-thSpqoQdFYSdHUftMfu4ZKwONg1MpfPkI";

if (!NEO4J_URI) {
  throw new Error(
    "NEO4J_URI environment variable is not set. Please set it in your .env.local file (e.g., NEO4J_URI=neo4j+s://<your-database>.neo4j.io)."
  );
}
if (!NEO4J_USERNAME) {
  throw new Error(
    "NEO4J_USERNAME environment variable is not set. Please set it in your .env.local file."
  );
}
if (!NEO4J_PASSWORD) {
  throw new Error(
    "NEO4J_PASSWORD environment variable is not set. Please set it in your .env.local file."
  );
}

const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
);

export async function runQuery(query, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(query, params);
    return result.records.map(convertRecord);
  } catch (error) {
    console.error("Neo4j query error:", error);
    throw error;
  } finally {
    await session.close();
  }
}

export async function closeDriver() {
  await driver.close();
}

export default driver;
