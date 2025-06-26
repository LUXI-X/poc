"use client";

import { useState, useEffect } from "react";
import { useData } from "@/lib/data-context";

export default function RelationshipForm({ relationship, onClose }) {
  const { data, addRelationship, updateRelationship } = useData();
  const [formData, setFormData] = useState({
    source: "",
    target: "",
    type: "WORKS_ON",
  });
  const [loading, setLoading] = useState(false);

  // Initialize form data when editing
  useEffect(() => {
    if (relationship) {
      setFormData({
        source: relationship.source || "",
        target: relationship.target || "",
        type: relationship.type || "WORKS_ON",
      });
    }
  }, [relationship]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (relationship) {
        // Update existing relationship
        await updateRelationship(relationship.id, formData);
      } else {
        // Create new relationship
        await addRelationship(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving relationship:", error);
      alert("Error saving relationship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const relationshipTypes = [
    "EMPLOYS",
    "WORKS_ON",
    "LEADS",
    "OWNS",
    "MANAGES",
    "REPORTS_TO",
    "COLLABORATES_WITH",
  ];

  // Get nodes from data context, with fallback to empty array
  const nodes = data?.nodes || [];

  return (
    <div className="fixed inset-0 bg-teal-800 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-800">
            {relationship ? "Edit Relationship" : "Add New Relationship"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Source Node *
            </label>
            <select
              value={formData.source}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, source: e.target.value }))
              }
              className="w-full px-4 py-3 text-teal-900 bg-gray-100 rounded-lg placeholder:text-slate-400 focus:outline-none border-none"
              required
            >
              <option value="">Select source node</option>
              {nodes.length > 0 ? (
                nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name} ({node.type})
                  </option>
                ))
              ) : (
                <option disabled>No nodes available</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Relationship Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full px-4 py-3 text-teal-900 bg-gray-100 rounded-lg placeholder:text-slate-400 focus:outline-none border-none"
              required
            >
              {relationshipTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Target Node *
            </label>
            <select
              value={formData.target}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, target: e.target.value }))
              }
              className="w-full px-4 py-3 text-teal-900 bg-gray-100 rounded-lg placeholder:text-slate-400 focus:outline-none border-none"
              required
            >
              <option value="">Select target node</option>
              {nodes.length > 0 ? (
                nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.name} ({node.type})
                  </option>
                ))
              ) : (
                <option disabled>No nodes available</option>
              )}
            </select>
          </div>

          {nodes.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    No nodes available
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      You need to create some nodes before you can create
                      relationships between them.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || nodes.length === 0}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? relationship
                  ? "Updating..."
                  : "Creating..."
                : relationship
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
