"use client";

import { useState, useEffect, useRef } from "react";
import { useData } from "@/lib/data-context";

export default function NodeForm({ node, onClose }) {
  const { addNode, updateNode } = useData();
  const [formData, setFormData] = useState({
    name: "",
    type: "Employee",
    properties: {},
  });
  const [loading, setLoading] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [newPropertyKey, setNewPropertyKey] = useState("");
  const propertyInputRef = useRef(null);

  useEffect(() => {
    if (node) {
      setFormData({
        name: node.name || "",
        type: node.type || "Employee",
        properties: node.properties || {},
      });
    }
  }, [node]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (node) {
        // Only update properties, keep name and type unchanged
        await updateNode(node.id, { properties: formData.properties });
      } else {
        await addNode(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving node:", error);
      alert("Error saving node. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      properties: {
        ...prev.properties,
        [key]: value,
      },
    }));
  };

  const addProperty = () => {
    setShowPropertyModal(true);
  };

  const handlePropertyModalSubmit = (e) => {
    e.preventDefault();
    if (newPropertyKey && !formData.properties[newPropertyKey]) {
      handlePropertyChange(newPropertyKey, "");
      setNewPropertyKey("");
      setShowPropertyModal(false);
    } else if (formData.properties[newPropertyKey]) {
      alert("Property name already exists.");
    }
  };

  const removeProperty = (key) => {
    setFormData((prev) => ({
      ...prev,
      properties: Object.fromEntries(
        Object.entries(prev.properties).filter(([k]) => k !== key)
      ),
    }));
  };

  useEffect(() => {
    if (showPropertyModal && propertyInputRef.current) {
      propertyInputRef.current.focus();
    }
  }, [showPropertyModal]);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-teal-800">
            {node ? "Edit Node" : "Add New Node"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-teal-800 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`w-full px-3 py-2 border-2 border-teal-900 rounded-lg text-teal-900 bg-white ${
                  node ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                required
                readOnly={node ? true : false}
                disabled={node ? true : false}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-teal-800 mb-2">
                Type *
              </label>
              <input
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className={`w-full px-3 py-2 border border-teal-900 rounded-lg text-teal-900 bg-white ${
                  node ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                required
                disabled={node ? true : false}
              ></input>
            </div>
          </div>

          {/* Properties */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-teal-800">
                Properties
              </label>
              <button
                type="button"
                onClick={addProperty}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                + Add Property
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(formData.properties).map(([key, value]) => (
                <div key={key} className="flex gap-3">
                  <input
                    type="text"
                    value={key}
                    readOnly
                    className="w-1/3 px-3 py-2 border-2 border-teal-900 rounded-lg text-teal-900 bg-white"
                  />
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handlePropertyChange(key, e.target.value)}
                    className="flex-1 px-3 py-2 border-2 border-teal-900 rounded-lg text-teal-900 bg-white"
                    placeholder="Property value"
                  />
                  <button
                    type="button"
                    onClick={() => removeProperty(key)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-teal-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : node ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>

      {/* Property Name Modal */}
      {showPropertyModal && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-60 p-4 font-sans">
          <div className="bg-white text-teal-900 rounded-xl shadow-xl max-w-md w-full">
            <form
              onSubmit={handlePropertyModalSubmit}
              className="p-6 space-y-4 text-teal-900"
            >
              <h3 className="text-lg font-semibold">Add Property</h3>
              <div>
                <label className="block text-sm font-medium text-teal-800 mb-2">
                  Property Name *
                </label>
                <input
                  type="text"
                  value={newPropertyKey}
                  onChange={(e) => setNewPropertyKey(e.target.value)}
                  ref={propertyInputRef}
                  className="w-full px-3 py-2 outline-none border-2 border-teal-900 rounded-lg text-teal-900 bg-white"
                  placeholder="Enter property name"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setNewPropertyKey("");
                    setShowPropertyModal(false);
                  }}
                  className="px-4 py-2 text-teal-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
