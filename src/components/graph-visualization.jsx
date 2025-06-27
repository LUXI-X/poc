"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/lib/data-context";

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

export default function GraphVisualization({
  selectedNode,
  setSelectedNode,
  data: propData,
  highlightType,
}) {
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [positionedNodes, setPositionedNodes] = useState([]);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [layoutType, setLayoutType] = useState("circular"); // Track current layout
  const { data: contextData } = useData();
  const data = propData || contextData;

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(600, container.clientHeight),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Circular layout
  const circularGraphLayout = () => {
    if (!data?.nodes) return;

    const { nodes } = data;
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const minRadius = Math.min(width, height) / 3;
    const maxNodesPerRing = 10;

    const initialNodes = nodes.map((node, index) => {
      if (node.type === "Company") {
        return { ...node, x: centerX, y: centerY };
      }

      const ringIndex = Math.floor(index / maxNodesPerRing);
      const nodesInRing = Math.min(
        nodes.length - 1 - ringIndex * maxNodesPerRing,
        maxNodesPerRing
      );
      const angle = ((index % maxNodesPerRing) * 2 * Math.PI) / nodesInRing;
      const nodeRadius = minRadius * (1 + ringIndex * 0.3);

      return {
        ...node,
        x: centerX + Math.cos(angle) * nodeRadius,
        y: centerY + Math.sin(angle) * nodeRadius,
      };
    });

    setPositionedNodes(initialNodes);
    setLayoutType("circular");
  };

  // Grid layout
  const gridGraphLayout = () => {
    if (!data?.nodes) return;

    const { nodes } = data;
    const { width, height } = dimensions;
    const cols = Math.ceil(Math.sqrt(nodes.length));
    const rows = Math.ceil(nodes.length / cols);
    const cellWidth = width / cols;
    const cellHeight = height / rows;

    const initialNodes = nodes.map((node, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const x = col * cellWidth + cellWidth / 2;
      const y = row * cellHeight + cellHeight / 2;

      return {
        ...node,
        x: Math.max(50, Math.min(width - 50, x)),
        y: Math.max(50, Math.min(height - 50, y)),
      };
    });

    setPositionedNodes(initialNodes);
    setLayoutType("grid");
  };

  // Initialize node positions
  useEffect(() => {
    circularGraphLayout();
  }, [data, dimensions]);

  // Toggle layout between circular and grid
  const toggleLayout = () => {
    if (layoutType === "circular") {
      gridGraphLayout();
    } else {
      circularGraphLayout();
    }
  };

  // Render SVG graph
  useEffect(() => {
    if (!svgRef.current || !data?.nodes || !data?.relationships) return;

    const svg = svgRef.current;
    svg.innerHTML = "";

    const { relationships } = data;
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    svg.appendChild(svgElement);

    // Add definitions for arrowheads and shadows
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#4b5563" />
      </marker>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
    `;
    svg.appendChild(defs);

    // Draw relationships (edges)
    relationships.forEach((rel) => {
      const sourceNode = positionedNodes.find((n) => n.id === rel.source);
      const targetNode = positionedNodes.find((n) => n.id === rel.target);

      if (sourceNode && targetNode) {
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const offset = getNodeRadius(sourceNode.type);
        const x1 = sourceNode.x + (dx * offset) / length;
        const y1 = sourceNode.y + (dy * offset) / length;
        const x2 = targetNode.x - (dx * offset) / length;
        const y2 = targetNode.y - (dy * offset) / length;

        const isHighlighted = highlightType && rel.type === highlightType;
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", isHighlighted ? "#f59e0b" : "#4b5563");
        line.setAttribute("stroke-width", isHighlighted ? "4" : "2");
        line.setAttribute("opacity", isHighlighted ? "0.9" : "0.7");
        line.setAttribute("marker-end", "url(#arrowhead)");
        svgElement.appendChild(line);

        if (isHighlighted) {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
          );
          text.setAttribute("x", (x1 + x2) / 2);
          text.setAttribute("y", (y1 + y2) / 2 - 5);
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("fill", "#f59e0b");
          text.setAttribute("font-size", "10");
          text.setAttribute("font-weight", "bold");
          text.textContent = rel.type;
          text.style.userSelect = "none";
          svgElement.appendChild(text);
        }
      }
    });

    // Draw nodes
    positionedNodes.forEach((node) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.style.cursor = "pointer";
      group.setAttribute("class", "node-group");
      group.setAttribute("role", "button");
      group.setAttribute("aria-label", `Node: ${node.name}`);
      group.style.userSelect = "none";

      const isHighlighted = highlightType && node.type === highlightType;
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", 0);
      circle.setAttribute("cy", 0);
      circle.setAttribute(
        "r",
        isHighlighted ? getNodeRadius(node.type) + 5 : getNodeRadius(node.type)
      );
      circle.setAttribute("fill", getNodeColor(node.type));
      circle.setAttribute("stroke", isHighlighted ? "#f59e0b" : "#ffffff");
      circle.setAttribute("stroke-width", isHighlighted ? "4" : "3");
      circle.setAttribute("opacity", isHighlighted ? "1" : "0.9");
      if (isHighlighted) {
        circle.setAttribute("filter", "url(#shadow)");
      }

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", 0);
      text.setAttribute("y", 5);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#ffffff");
      text.setAttribute("font-size", isHighlighted ? "14" : "12");
      text.setAttribute("font-weight", "bold");
      text.textContent =
        node.name.length > 10 ? node.name.substring(0, 10) + "..." : node.name;
      text.style.userSelect = "none";

      group.appendChild(circle);
      group.appendChild(text);
      group.setAttribute("transform", `translate(${node.x}, ${node.y})`);

      // Drag and click handling
      let isDragging = false;
      group.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isDragging = false;
        setDraggingNodeId(node.id);
      });

      group.addEventListener("mousemove", () => {
        if (draggingNodeId === node.id) {
          isDragging = true;
        }
      });

      group.addEventListener("mouseup", (e) => {
        e.preventDefault();
        if (!isDragging) {
          setSelectedNode(node);
        }
        setDraggingNodeId(null);
        isDragging = false;
      });

      // Hover effects
      group.addEventListener("mouseenter", () => {
        circle.setAttribute(
          "r",
          (isHighlighted
            ? getNodeRadius(node.type) + 5
            : getNodeRadius(node.type)) * 1.1
        );
        circle.setAttribute("filter", "url(#shadow)");
      });

      group.addEventListener("mouseleave", () => {
        circle.setAttribute(
          "r",
          isHighlighted
            ? getNodeRadius(node.type) + 5
            : getNodeRadius(node.type)
        );
        circle.setAttribute("filter", isHighlighted ? "url(#shadow)" : "");
      });

      group.addEventListener("contextmenu", (e) => {
        e.preventDefault();
      });

      svgElement.appendChild(group);
    });

    // Handle drag movement
    const handleMouseMove = (e) => {
      if (!draggingNodeId) return;

      e.preventDefault();
      const rect = svg.getBoundingClientRect();
      const x = Math.max(0, Math.min(dimensions.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(dimensions.height, e.clientY - rect.top));

      setPositionedNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === draggingNodeId ? { ...node, x, y } : node
        )
      );
    };

    const handleMouseUp = (e) => {
      e.preventDefault();
      setDraggingNodeId(null);
    };

    svg.addEventListener("click", (e) => {
      e.preventDefault();
      if (
        e.target === svg ||
        e.target.tagName === "line" ||
        e.target.tagName === "text"
      ) {
        setSelectedNode(null);
      }
    });

    svg.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    svg.addEventListener("mousemove", handleMouseMove);
    svg.addEventListener("mouseup", handleMouseUp);
    svg.addEventListener("mouseleave", handleMouseUp);

    return () => {
      svg.removeEventListener("mousemove", handleMouseMove);
      svg.removeEventListener("mouseup", handleMouseUp);
      svg.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [
    data,
    dimensions,
    positionedNodes,
    draggingNodeId,
    setSelectedNode,
    highlightType,
  ]);

  const getNodeRadius = (type) => {
    switch (type) {
      case "Company":
        return 40;
      case "Project":
        return 30;
      case "Employee":
        return 25;
      default:
        return 20;
    }
  };

  const getNodeColor = (type) => {
    switch (type) {
      case "Company":
        return "#1e40af";
      case "Project":
        return "#7c3aed";
      case "Employee":
        return "#059669";
      default:
        return "#6b7280";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <style>
        {`
          .node-group { transition: transform 0.1s ease-out; }
          .node-circle { transition: r 0.2s ease-out; }
          .relationship-line { transition: all 0.1s ease-out; }
          svg { user-select: none; }
          .refresh-button, .toggle-button { transition: all 0.2s ease-out; }
          .refresh-button:hover, .toggle-button:hover { transform: translateY(-1px); }
        `}
      </style>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {highlightType
              ? `${highlightType} Knowledge Graph`
              : "Knowledge Graph"}
          </h2>
          <div className="mb-4 flex gap-2">
            <button
              onClick={circularGraphLayout}
              className="refresh-button px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors"
              aria-label="Reset graph to circular layout"
            >
              Reset Graph Layout
            </button>
            <button
              onClick={toggleLayout}
              className="toggle-button px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-lg transition-colors"
              aria-label={`Switch to ${
                layoutType === "circular" ? "grid" : "circular"
              } layout`}
            >
              Switch to {layoutType === "circular" ? "Grid" : "Circular"} Layout
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Click and drag nodes to reposition. Click a node to view details.
          </p>
          <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              className="w-full h-auto"
              role="img"
              aria-label="Knowledge Graph Visualization"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-700"></div>
              <span className="text-sm text-slate-600">Company</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-violet-600"></div>
              <span className="text-sm text-slate-600">Project</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-600"></div>
              <span className="text-sm text-slate-600">Employee</span>
            </div>
            {highlightType && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                <span className="text-sm text-slate-600">
                  Highlighted: {highlightType}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="lg:w-80">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            Node Details
          </h3>
          {selectedNode ? (
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-bold text-lg text-teal-700 mb-2">
                {selectedNode.name}
              </h4>
              <p className="text-sm text-slate-600 mb-3">
                Type: {selectedNode.type}
              </p>
              {selectedNode.properties && (
                <div className="space-y-2">
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
          ) : (
            <div className="bg-slate-50 rounded-lg p-4 text-center text-slate-500">
              Click on a node to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
