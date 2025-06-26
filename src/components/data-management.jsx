// components/data-management.js
"use client";

import { useState } from "react";
import { useData } from "@/lib/data-context";
import NodeForm from "./node-form";
import RelationshipForm from "./relationship-form";
import DataTable from "./data-table";

export default function DataManagement() {
  const { data, loading, addNode, addRelationship, loadData } = useData();
  const [activeSection, setActiveSection] = useState("nodes");
  const [editingNode, setEditingNode] = useState(null);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [showRelForm, setShowRelForm] = useState(false);
  const [cypherQueries, setCypherQueries] = useState(""); // Initialize as empty string
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast({ show: false, message: "", type: "success" }),
      3000
    );
  };

  const handleExecuteQueries = async () => {
    if (!cypherQueries.trim()) {
      showToast("Please enter some Cypher queries to execute.", "error");
      return;
    }

    try {
      setIsExecuting(true);
      setExecutionResults(null);

      const response = await fetch("/api/execute-queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          queries: cypherQueries,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setExecutionResults(result);
        if (result.success) {
          showToast(
            `${result.successfulQueries} queries executed successfully.`,
            "success"
          );
          await loadData();
        } else {
          showToast(
            `Partial success: ${result.successfulQueries} of ${result.totalQueries} queries executed.`,
            "warning"
          );
        }
      } else {
        throw new Error(result.error || "Failed to execute queries");
      }
    } catch (error) {
      console.error("Error executing queries:", error);
      showToast(`Error executing queries: ${error.message}`, "error");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetQueries = () => {
    setCypherQueries("");
    setExecutionResults(null);
    showToast("Queries and results cleared.", "success");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg text-white flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-green-600"
                : toast.type === "error"
                ? "bg-red-600"
                : "bg-yellow-600"
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() =>
                setToast({ show: false, message: "", type: "success" })
              }
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Data Management
        </h2>
        <p className="text-slate-600 mb-6">
          Manage your knowledge graph data. Add, edit, or delete nodes and
          relationships.
        </p>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "nodes", label: "Nodes", count: data.nodes.length },
            {
              id: "relationships",
              label: "Relationships",
              count: data.relationships.length,
            },
            { id: "import", label: "Import Data" },
          ].map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeSection === section.id
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-600"
              }`}
            >
              {section.label}
              {section.count !== undefined && (
                <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {activeSection === "nodes" && (
            <button
              onClick={() => setShowNodeForm(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Add Node
            </button>
          )}
          {activeSection === "relationships" && (
            <button
              onClick={() => setShowRelForm(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Add Relationship
            </button>
          )}
        </div>
      </div>

      {/* Content Sections */}
      {activeSection === "nodes" && (
        <DataTable
          type="nodes"
          data={data.nodes}
          onEdit={(node) => {
            setEditingNode(node);
            setShowNodeForm(true);
          }}
        />
      )}

      {activeSection === "relationships" && (
        <DataTable
          type="relationships"
          data={data.relationships}
          nodes={data.nodes}
        />
      )}

      {activeSection === "import" && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Import Data</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Neo4j Queries
              </label>
              <textarea
                className="w-full h-40 px-3 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-slate-800"
                value={cypherQueries}
                onChange={(e) => setCypherQueries(e.target.value)}
                placeholder="Enter Neo4j  queries (e.g., CREATE (n:Person {name: 'John'}))"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleExecuteQueries}
                disabled={isExecuting || !cypherQueries.trim()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isExecuting ? "Executing..." : "Execute Queries"}
              </button>
              <button
                onClick={handleResetQueries}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Execution Results */}
            {executionResults && (
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-800 mb-3">
                  Execution Results
                </h4>
                <div className="space-y-2 text-sm text-slate-800">
                  <div className="flex gap-4 justify-start">
                    <span>Total Queries:</span>
                    <span className="font-medium">
                      {executionResults.totalQueries}
                    </span>
                  </div>
                  <div className="flex gap-4 justify-start">
                    <span>Successful:</span>
                    <span className="font-medium text-green-600">
                      {executionResults.successfulQueries}
                    </span>
                  </div>
                  <div className="flex gap-4 justify-start">
                    <span>Failed:</span>
                    <span className="font-medium text-red-600">
                      {executionResults.failedQueries}
                    </span>
                  </div>
                </div>

                {executionResults.errors.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-red-800 mb-2">Errors:</h5>
                    <div className="space-y-2">
                      {executionResults.errors.map((error, index) => (
                        <div
                          key={index}
                          className="p-2 bg-red-50 border border-red-200 rounded text-sm"
                        >
                          <div className="font-medium text-red-800">
                            Query {error.queryIndex}:
                          </div>
                          <div className="text-red-600">{error.error}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showNodeForm && (
        <NodeForm
          node={editingNode}
          onClose={() => {
            setShowNodeForm(false);
            setEditingNode(null);
          }}
        />
      )}

      {showRelForm && (
        <RelationshipForm
          nodes={data.nodes}
          onClose={() => setShowRelForm(false)}
        />
      )}
    </div>
  );
}
