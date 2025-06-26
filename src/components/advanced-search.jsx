// components/advanced-search.jsx
"use client";

import { useState } from "react";
import { useData } from "@/lib/data-context";
import { convertNeo4jValue } from "@/lib/neo4j";

export default function AdvancedSearch({ onSearchResults, onClose }) {
  const [filters, setFilters] = useState({
    nodeType: "",
    relationshipType: "",
    propertyKey: "",
    propertyValue: "",
    dateRange: {
      start: "",
      end: "",
    },
  });
  const [isSearching, setIsSearching] = useState(false);
  const { data } = useData();

  const nodeTypes = [...new Set(data.nodes.map((n) => n.type))];
  const relationshipTypes = [...new Set(data.relationships.map((r) => r.type))];

  const handleAdvancedSearch = () => {
    setIsSearching(true);
    const results = [];

    // Filter nodes
    data.nodes.forEach((node) => {
      let matches = true;

      if (filters.nodeType && node.type !== filters.nodeType) {
        matches = false;
      }

      if (filters.propertyKey && filters.propertyValue) {
        const propValue = node.properties?.[filters.propertyKey];
        if (
          !propValue ||
          !propValue
            .toString()
            .toLowerCase()
            .includes(filters.propertyValue.toLowerCase())
        ) {
          matches = false;
        }
      }

      if (filters.dateRange.start || filters.dateRange.end) {
        const dateProps = ["startDate", "founded", "endDate"].filter(
          (key) => node.properties?.[key]
        );
        if (dateProps.length > 0) {
          let dateMatches = false;
          for (const key of dateProps) {
            const dateValue = node.properties[key];
            if (dateValue) {
              const nodeDate = new Date(dateValue);
              const startFilter = filters.dateRange.start
                ? new Date(filters.dateRange.start)
                : null;
              const endFilter = filters.dateRange.end
                ? new Date(filters.dateRange.end)
                : null;

              let dateValid = true;
              if (startFilter && nodeDate < startFilter) dateValid = false;
              if (endFilter && nodeDate > endFilter) dateValid = false;

              if (dateValid) {
                dateMatches = true;
                break;
              }
            }
          }
          if (!dateMatches) matches = false;
        } else {
          matches = false;
        }
      }

      if (matches) {
        results.push({
          type: "node",
          item: node,
          matchedFields: ["advanced_filter"],
          relevance: 100,
        });
      }
    });

    // Filter relationships
    data.relationships.forEach((rel) => {
      let matches = true;

      if (filters.relationshipType && rel.type !== filters.relationshipType) {
        matches = false;
      }

      if (matches) {
        const sourceNode = data.nodes.find((n) => n.id === rel.source);
        const targetNode = data.nodes.find((n) => n.id === rel.target);

        results.push({
          type: "relationship",
          item: rel,
          sourceNode,
          targetNode,
          matchedFields: ["advanced_filter"],
          relevance: 100,
        });
      }
    });

    setIsSearching(false);
    onSearchResults(results);
  };

  const clearFilters = () => {
    setFilters({
      nodeType: "",
      relationshipType: "",
      propertyKey: "",
      propertyValue: "",
      dateRange: { start: "", end: "" },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background text-foreground rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto font-sans">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Advanced Search</h3>
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
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Node Filters</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Node Type
                </label>
                <select
                  value={filters.nodeType}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      nodeType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {nodeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Property Key
                </label>
                <input
                  type="text"
                  value={filters.propertyKey}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      propertyKey: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., department, role"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Property Value
                </label>
                <input
                  type="text"
                  value={filters.propertyValue}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      propertyValue: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search in property values"
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Relationship Filters</h4>
            <div>
              <label className="block text-sm font-medium mb-2">
                Relationship Type
              </label>
              <select
                value={filters.relationshipType}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    relationshipType: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Relationships</option>
                {relationshipTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Date Range</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 flex justify-between">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Clear Filters
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdvancedSearch}
              disabled={isSearching}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
