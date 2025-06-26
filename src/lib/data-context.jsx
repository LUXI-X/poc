"use client";

import { createContext, useContext, useState, useEffect } from "react";

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

export function DataProvider({ children }) {
  const [data, setData] = useState({
    nodes: [],
    relationships: [],
  });
  const [loading, setLoading] = useState(true);

  // Load data from API on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/data");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNode = async (nodeData) => {
    try {
      const response = await fetch("/api/nodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nodeData),
      });

      if (response.ok) {
        const newNode = await response.json();
        setData((prev) => ({
          ...prev,
          nodes: [...prev.nodes, newNode],
        }));
        return newNode;
      }
    } catch (error) {
      console.error("Error adding node:", error);
      throw error;
    }
  };

  const updateNode = async (nodeId, nodeData) => {
    try {
      const response = await fetch(`/api/nodes/${nodeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nodeData),
      });

      if (response.ok) {
        const updatedNode = await response.json();
        setData((prev) => ({
          ...prev,
          nodes: prev.nodes.map((node) =>
            node.id === nodeId ? updatedNode : node
          ),
        }));
        return updatedNode;
      }
    } catch (error) {
      console.error("Error updating node:", error);
      throw error;
    }
  };

  const deleteNode = async (nodeId) => {
    try {
      const response = await fetch(`/api/nodes/${nodeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData((prev) => ({
          nodes: prev.nodes.filter((node) => node.id !== nodeId),
          relationships: prev.relationships.filter(
            (rel) => rel.source !== nodeId && rel.target !== nodeId
          ),
        }));
      }
    } catch (error) {
      console.error("Error deleting node:", error);
      throw error;
    }
  };

  const addRelationship = async (relationshipData) => {
    try {
      const response = await fetch("/api/relationships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(relationshipData),
      });

      if (response.ok) {
        const newRelationship = await response.json();
        setData((prev) => ({
          ...prev,
          relationships: [...prev.relationships, newRelationship],
        }));
        return newRelationship;
      }
    } catch (error) {
      console.error("Error adding relationship:", error);
      throw error;
    }
  };

  const deleteRelationship = async (relationshipId) => {
    try {
      const response = await fetch(`/api/relationships/${relationshipId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setData((prev) => ({
          ...prev,
          relationships: prev.relationships.filter(
            (rel) => rel.id !== relationshipId
          ),
        }));
      }
    } catch (error) {
      console.error("Error deleting relationship:", error);
      throw error;
    }
  };
  const updateRelationship = async (relationshipId, relationshipData) => {
    try {
      const response = await fetch(`/api/relationships/${relationshipId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(relationshipData),
      });

      if (response.ok) {
        const updatedRelationship = await response.json();
        setData((prev) => ({
          ...prev,
          relationships: prev.relationships.map((rel) =>
            rel.id === relationshipId ? updatedRelationship : rel
          ),
        }));
        return updatedRelationship;
      }
    } catch (error) {
      console.error("Error updating relationship:", error);
      throw error;
    }
  };

  const value = {
    data,
    loading,
    loadData,
    addNode,
    updateNode,
    deleteNode,
    addRelationship,
    deleteRelationship,
    updateRelationship,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
