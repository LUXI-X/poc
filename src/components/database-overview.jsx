"use client";

import { useState, useEffect, useCallback } from "react";
import { useData } from "@/lib/data-context";
import GraphVisualization from "./graph-visualization";
import { v4 as uuidv4 } from "uuid";

// Utility to convert Neo4j types to JavaScript primitives
const convertNeo4jValue = (value) => {
  if (value && typeof value === "object" && "low" in value && "high" in value) {
    return value.low;
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (value && typeof value === "object") {
    return JSON.stringify(value);
  }
  return value;
};

export default function DatabaseOverview() {
  const { data } = useData();
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const [selectedRelationType, setSelectedRelationType] = useState(null);
  const [filteredData, setFilteredData] = useState({
    nodes: [],
    relationships: [],
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [databaseStats, setDatabaseStats] = useState({
    nodeTypes: {},
    relationshipTypes: {},
    totalNodes: 0,
    totalRelationships: 0,
    propertyKeys: [],
  });

  // Calculate database statistics
  useEffect(() => {
    if (!data?.nodes || !data?.relationships) return;

    const nodeTypes = {};
    const relationshipTypes = {};
    const propertyKeys = new Set();

    data.nodes.forEach((node) => {
      nodeTypes[node.type] = (nodeTypes[node.type] || 0) + 1;
      if (node.properties) {
        Object.keys(node.properties).forEach((key) => propertyKeys.add(key));
      }
    });

    data.relationships.forEach((rel) => {
      relationshipTypes[rel.type] = (relationshipTypes[rel.type] || 0) + 1;
      if (rel.properties) {
        Object.keys(rel.properties).forEach((key) => propertyKeys.add(key));
      }
    });

    setDatabaseStats({
      nodeTypes,
      relationshipTypes,
      totalNodes: data.nodes.length,
      totalRelationships: data.relationships.length,
      propertyKeys: Array.from(propertyKeys),
    });
  }, [data]);

  // Filter data based on selected type
  useEffect(() => {
    if (!data?.nodes || !data?.relationships) {
      setFilteredData({ nodes: [], relationships: [] });
      return;
    }

    if (selectedNodeType) {
      const filteredNodes = data.nodes.filter(
        (node) => node.type === selectedNodeType
      );
      const nodeIds = new Set(filteredNodes.map((node) => node.id));
      const filteredRelationships = data.relationships.filter(
        (rel) => nodeIds.has(rel.source) || nodeIds.has(rel.target)
      );
      setFilteredData({
        nodes: filteredNodes,
        relationships: filteredRelationships,
      });
    } else if (selectedRelationType) {
      const filteredRelationships = data.relationships.filter(
        (rel) => rel.type === selectedRelationType
      );
      const nodeIds = new Set();
      filteredRelationships.forEach((rel) => {
        nodeIds.add(rel.source);
        nodeIds.add(rel.target);
      });
      const filteredNodes = data.nodes.filter((node) => nodeIds.has(node.id));
      setFilteredData({
        nodes: filteredNodes,
        relationships: filteredRelationships,
      });
    } else {
      setFilteredData(data);
    }
  }, [selectedNodeType, selectedRelationType, data]);

  const handleNodeTypeClick = useCallback((nodeType) => {
    setSelectedNodeType(nodeType);
    setSelectedRelationType(null);
    setSelectedNode(null);
  }, []);

  const handleRelationTypeClick = useCallback((relationType) => {
    setSelectedRelationType(relationType);
    setSelectedNodeType(null);
    setSelectedNode(null);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedNodeType(null);
    setSelectedRelationType(null);
    setSelectedNode(null);
  }, []);

  const getNodeTypeColor = (type) => {
    const colors = {
      Company: "bg-blue-500 hover:bg-blue-600",
      Employee: "bg-green-500 hover:bg-green-600",
      Project: "bg-purple-500 hover:bg-purple-600",
      Department: "bg-orange-500 hover:bg-orange-600",
    };
    return colors[type] || "bg-gray-500 hover:bg-gray-600";
  };

  const getRelationTypeColor = (type) => {
    const colors = {
      EMPLOYS: "bg-indigo-500 hover:bg-indigo-600",
      WORKS_ON: "bg-teal-500 hover:bg-teal-600",
      MANAGES: "bg-red-500 hover:bg-red-600",
      LEADS: "bg-yellow-500 hover:bg-yellow-600",
      HANDLES: "bg-pink-500 hover:bg-pink-600",
      OWNS: "bg-cyan-500 hover:bg-cyan-600",
    };
    return colors[type] || "bg-gray-500 hover:bg-gray-600";
  };

  return (
    <div className="space-y-6">
      <style>
        {`
          .filter-button { transition: all 0.2s ease-out; }
          .filter-button:hover { transform: translateY(-1px); }
          .relationship-card { transition: all 0.2s ease-out; }
          .relationship-card:hover { transform: translateY(-2px); }
        `}
      </style>
      {/* Database Information Panel */}
      <div className="bg-white text-black rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Database Information</h2>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">
            Nodes ({databaseStats.totalNodes})
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(databaseStats.nodeTypes).map(([type, count]) => (
              <button
                key={type}
                onClick={() => handleNodeTypeClick(type)}
                className={`filter-button px-4 py-2 rounded-full text-white font-medium ${getNodeTypeColor(
                  type
                )} ${
                  selectedNodeType === type
                    ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800"
                    : ""
                }`}
                aria-label={`Filter by ${type} nodes`}
              >
                {type} ({count})
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">
            Relationships ({databaseStats.totalRelationships})
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(databaseStats.relationshipTypes).map(
              ([type, count]) => (
                <button
                  key={type}
                  onClick={() => handleRelationTypeClick(type)}
                  className={`filter-button px-4 py-2 rounded-full text-white font-medium ${getRelationTypeColor(
                    type
                  )} ${
                    selectedRelationType === type
                      ? "ring-2 ring-white ring-offset-2 ring-offset-slate-800"
                      : ""
                  }`}
                  aria-label={`Filter by ${type} relationships`}
                >
                  {type} ({count})
                </button>
              )
            )}
          </div>
        </div>
        {/* <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">
            Property Keys ({databaseStats.propertyKeys.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {databaseStats.propertyKeys.map((key) => (
              <span
                key={key}
                className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-200"
              >
                {key}
              </span>
            ))}
          </div>
        </div> */}
        {(selectedNodeType || selectedRelationType) && (
          <button
            onClick={handleClearFilter}
            className="px-4 py-2 bg-slate-500 text-white hover:bg-teal-800 rounded-lg transition-colors"
            aria-label="Clear all filters"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Current Filter Display */}
      {(selectedNodeType || selectedRelationType) && (
        <div className="   rounded-lg p-4">
          <h3 className="font-semibold text-teal-800 text-xl mb-2">
            Currently Viewing: {selectedNodeType || selectedRelationType}
          </h3>
          <p className="text-teal-600 text-sm">
            {selectedNodeType
              ? `Showing ${filteredData.nodes.length} nodes of type "${selectedNodeType}" and their ${filteredData.relationships.length} relationships`
              : `Showing ${filteredData.relationships.length} relationships of type "${selectedRelationType}" and their connected ${filteredData.nodes.length} nodes`}
          </p>
        </div>
      )}

      {/* Graph Visualization */}
      <GraphVisualization
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        data={filteredData}
        highlightType={selectedNodeType || selectedRelationType}
      />

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            Node Details & Relationships
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-bold text-lg text-teal-700 mb-2">
                {selectedNode.name}
              </h4>
              <p className="text-sm text-slate-600 mb-3">
                Type: {selectedNode.type}
              </p>
              {selectedNode.properties && (
                <div className="space-y-2">
                  <h5 className="font-semibold text-slate-700">Properties:</h5>
                  {Object.entries(selectedNode.properties).map(
                    ([key, value]) => (
                      <div
                        key={`${selectedNode.id}-${key}`}
                        className="flex justify-between"
                      >
                        <span className="text-sm font-medium text-slate-700 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:
                        </span>
                        <span className="text-sm text-slate-600">
                          {convertNeo4jValue(value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <h5 className="font-semibold text-slate-700 mb-3">
                Connected Relationships:
              </h5>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredData.relationships
                  .filter(
                    (rel) =>
                      rel.source === selectedNode.id ||
                      rel.target === selectedNode.id
                  )
                  .map((rel) => {
                    const otherNodeId =
                      rel.source === selectedNode.id ? rel.target : rel.source;
                    const otherNode = filteredData.nodes.find(
                      (n) => n.id === otherNodeId
                    );

                    return (
                      <button
                        key={uuidv4()} // Generate a unique ID
                        onClick={() => handleRelationTypeClick(rel.type)}
                        className="relationship-card w-full text-left p-3 bg-white rounded border hover:bg-teal-50 hover:border-teal-300 transition-colors"
                        aria-label={`View ${rel.type} relationship with ${
                          otherNode?.name || "Unknown"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-slate-700">
                            {rel.type}
                          </span>
                          <span className="text-xs text-slate-500">
                            Click to view
                          </span>
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          {rel.source === selectedNode.id ? "→" : "←"}{" "}
                          {otherNode?.name || "Unknown"}
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
