// components/search-results.jsx
"use client";

import { useState } from "react";
import { convertNeo4jValue } from "@/lib/neo4j";
import { useRouter } from "next/navigation";

export default function SearchResults({ results, onClose, onSelectResult }) {
  const [sortBy, setSortBy] = useState("relevance");
  const [filterType, setFilterType] = useState("all");
  const router = useRouter();

  const filteredResults = results.filter((result) => {
    if (filterType === "all") return true;
    if (filterType === "nodes") return result.type === "node";
    if (filterType === "relationships") return result.type === "relationship";
    return true;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === "relevance") return b.relevance - a.relevance;
    if (sortBy === "name") {
      const aName = a.type === "node" ? a.item.name : a.item.type;
      const bName = b.type === "node" ? b.item.name : b.item.type;
      return aName.localeCompare(bName);
    }
    if (sortBy === "type") {
      const aType = a.type === "node" ? a.item.type : "relationship";
      const bType = b.type === "node" ? b.item.type : "relationship";
      return aType.localeCompare(bType);
    }
    return 0;
  });

  const handleResultClick = (result) => {
    if (result.type === "node") {
      router.push(`/details/node/${result.item.id}`);
    } else {
      router.push(`/details/relationship/${result.item.id}`);
    }
  };

  return (
    <div className="bg-teal-600 text-foreground rounded-xl shadow-lg font-sans">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">
            Search Results ({results.length} found)
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option className="text-black" value="all">
                All Results
              </option>
              <option className="text-black" value="nodes">
                Nodes Only
              </option>
              <option className="text-black" value="relationships">
                Relationships Only
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2  border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option className="text-black" value="relevance ">
                Relevance
              </option>
              <option className="text-black" value="name">
                Name
              </option>
              <option className="text-black" value="type">
                Type
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {sortedResults.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="w-12 h-12 text-slate-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
            <p>No results match your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {sortedResults.map((result, index) => (
              <div
                key={`${result.type}-${result.item.id}-${index}`}
                onClick={() => handleResultClick(result)}
                className="p-4 hover:bg-teal-900 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          result.type === "node"
                            ? result.item.type === "Company"
                              ? "bg-blue-100 text-blue-800"
                              : result.item.type === "Project"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {result.type === "node"
                          ? result.item.type
                          : "Relationship"}
                      </span>

                      <div className="flex items-center gap-1">
                        <span className="text-xs">Relevance:</span>
                        {/* <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.round(result.relevance / 20)
                                  ? "text-yellow-400"
                                  : "text-slate-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs ml-1">
                            ({Math.round(result.relevance)}%)
                          </span>
                        </div> */}
                      </div>
                    </div>

                    <div className="font-medium mb-1">
                      {result.type === "node" ? (
                        result.item.name
                      ) : (
                        <span>
                          {result.sourceNode?.name} →{" "}
                          <span className="text-blue-600 font-semibold">
                            {result.item.type}
                          </span>{" "}
                          → {result.targetNode?.name}
                        </span>
                      )}
                    </div>

                    {result.matchedFields.length > 0 &&
                      !result.matchedFields.includes("advanced_filter") && (
                        <div className="text-xs mb-2">
                          <span className="font-medium">Matched in:</span>{" "}
                          {result.matchedFields.join(", ")}
                        </div>
                      )}

                    {result.type === "node" && result.item.properties && (
                      <div className="text-xs">
                        {Object.entries(result.item.properties)
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div key={key} className="inline-block mr-4">
                              <span className="font-medium">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>{" "}
                              {value} {/* Data is already converted */}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                      Click to view details
                    </span>
                    <svg
                      className="w-5 h-5 text-teal-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
