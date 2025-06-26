"use client";

import { useState, useEffect, useRef } from "react";
import { useData } from "@/lib/data-context";
import { useRouter } from "next/navigation";

export default function SearchBar({ onSearchResults, onClearSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { data } = useData();
  const searchRef = useRef();
  const debounceRef = useRef();
  const router = useRouter();

  // Debounced search function
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setShowResults(false);
      onClearSearch?.();
      return;
    }

    setIsSearching(true);

    debounceRef.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 300); // 300ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, data]);

  const performSearch = (term) => {
    const results = [];
    const searchLower = term.toLowerCase();

    // Search in nodes
    data.nodes.forEach((node) => {
      let matches = false;
      let matchedFields = [];

      // Search in name
      if (node.name?.toLowerCase()?.includes(searchLower)) {
        matches = true;
        matchedFields.push("name");
      }

      // Search in type
      if (node.type?.toLowerCase()?.includes(searchLower)) {
        matches = true;
        matchedFields.push("type");
      }

      // Search in properties
      if (node.properties) {
        Object.entries(node.properties).forEach(([key, value]) => {
          const convertedValue = String(value ?? ""); // Handle null/undefined
          if (convertedValue.toLowerCase().includes(searchLower)) {
            matches = true;
            matchedFields.push(key);
          }
        });
      }

      if (matches) {
        results.push({
          type: "node",
          item: node,
          matchedFields,
          relevance: calculateRelevance(node, searchLower, matchedFields),
        });
      }
    });

    // Search in relationships
    data.relationships.forEach((rel) => {
      let matches = false;
      let matchedFields = [];

      if (rel.type?.toLowerCase()?.includes(searchLower)) {
        matches = true;
        matchedFields.push("type");
      }

      // Get source and target node names for context
      const sourceNode = data.nodes.find((n) => n.id === rel.source);
      const targetNode = data.nodes.find((n) => n.id === rel.target);

      if (sourceNode?.name?.toLowerCase()?.includes(searchLower)) {
        matches = true;
        matchedFields.push("source");
      }

      if (targetNode?.name?.toLowerCase()?.includes(searchLower)) {
        matches = true;
        matchedFields.push("target");
      }

      if (matches) {
        results.push({
          type: "relationship",
          item: rel,
          sourceNode,
          targetNode,
          matchedFields,
          relevance: calculateRelevance(rel, searchLower, matchedFields),
        });
      }
    });

    // Sort by relevance and limit to 2 results
    const limitedResults = results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 2);

    setSearchResults(limitedResults);
    setShowResults(true);
    setIsSearching(false);
    onSearchResults?.(limitedResults);
  };

  const calculateRelevance = (item, searchTerm, matchedFields) => {
    let score = 0;

    // Higher score for exact matches
    if (item.name?.toLowerCase() === searchTerm) score += 100;
    else if (item.name?.toLowerCase()?.startsWith(searchTerm)) score += 50;
    else if (item.name?.toLowerCase()?.includes(searchTerm)) score += 25;

    // Score for type matches
    if (item.type?.toLowerCase() === searchTerm) score += 75;
    else if (item.type?.toLowerCase()?.includes(searchTerm)) score += 15;

    // Score for number of matched fields
    score += matchedFields.length * 10;

    return score;
  };

  const handleResultClick = (result) => {
    if (result.type === "node") {
      router.push(`/details/node/${result.item.id}`);
    } else {
      router.push(`/details/relationship/${result.item.id}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
    onClearSearch?.();
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
          ) : (
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg bg-white text-black font-sans"
          placeholder="Search nodes, relationships, properties..."
        />

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          >
            <svg
              className="h-5 w-5"
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
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 bg-teal-600 w-full mt-1 border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto font-sans">
          <div className="p-2">
            <div className="text-xs text-white mb-2">
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} found
            </div>

            {searchResults.map((result, index) => (
              <div
                key={`${result.type}-${result.item.id}-${index}`}
                onClick={() => handleResultClick(result)}
                className="p-3 hover:bg-teal-900 rounded-lg cursor-pointer border-b border-slate-100 last:border-b-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
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
                      <span className="text-xs text-white">
                        Relevance: {Math.round(result.relevance)}%
                      </span>
                    </div>

                    <div className="font-medium text-white mb-1">
                      {result.type === "node" ? (
                        result.item.name
                      ) : (
                        <span>
                          {result.sourceNode?.name ?? "Unknown"} →{" "}
                          <span className="text-white">{result.item.type}</span>{" "}
                          → {result.targetNode?.name ?? "Unknown"}
                        </span>
                      )}
                    </div>

                    {result.matchedFields.length > 0 && (
                      <div className="text-xs text-white">
                        Matched in: {result.matchedFields.join(", ")}
                      </div>
                    )}

                    {result.type === "node" && result.item.properties && (
                      <div className="mt-2 text-xs text-white">
                        {Object.entries(result.item.properties)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>{" "}
                              {value}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <svg
                    className="w-4 h-4 text-slate-400 ml-2"
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
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {showResults &&
        searchResults.length === 0 &&
        searchTerm.trim() !== "" &&
        !isSearching && (
          <div className="absolute z-50 w-full mt-1 bg-teal-700 border border-slate-200 rounded-lg shadow-lg p-4 text-center font-sans">
            <svg
              className="w-8 h-8 text-teal-950 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6 m-6-4h6 m2 6a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-medium text-white">
              No results found for "{searchTerm}"
            </p>
            <p className="text-xs text-white">
              Try searching for nodes, relationships, or properties
            </p>
          </div>
        )}
    </div>
  );
}
