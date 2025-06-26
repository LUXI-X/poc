"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/lib/data-context";

// Utility function to convert Neo4j types to JavaScript primitives
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

export default function GraphVisualization({ selectedNode, setSelectedNode }) {
  const svgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const { data } = useData();
  const [positionedNodes, setPositionedNodes] = useState([]);
  const [draggingNodeId, setDraggingNodeId] = useState(null);

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

  // Initialize node positions with improved spacing
  useEffect(() => {
    const { nodes } = data;
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const minRadius = Math.min(width, height) / 2.5;
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
  }, [data, dimensions]);

  // Render SVG graph
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    svg.innerHTML = "";

    const { relationships } = data;
    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    svg.appendChild(svgElement);

    // Draw relationships (edges) with arrows and labels
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

        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line"
        );
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "#4b5563");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("opacity", "0.7");
        line.setAttribute("class", "relationship-line");
        line.setAttribute("marker-end", "url(#arrowhead)");
        svgElement.appendChild(line);

        const label = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text"
        );
        label.setAttribute("x", (x1 + x2) / 2);
        label.setAttribute("y", (y1 + y2) / 2 - 5);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("fill", "#4b5563");
        label.setAttribute("font-size", "10");
        label.textContent = rel.type;
        svgElement.appendChild(label);
      }
    });

    // Draw nodes
    positionedNodes.forEach((node) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.style.cursor = "pointer";
      group.setAttribute("class", "node-group");
      group.style.transition = "transform 0.1s ease-out";

      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", 0);
      circle.setAttribute("cy", 0);
      circle.setAttribute("r", getNodeRadius(node.type));
      circle.setAttribute("fill", getNodeColor(node.type));
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "3");
      circle.setAttribute("class", "node-circle");

      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", 0);
      text.setAttribute("y", 5);
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("fill", "#ffffff");
      text.setAttribute("font-size", "12");
      text.setAttribute("font-weight", "bold");
      text.textContent =
        node.name.length > 12 ? node.name.substring(0, 12) + "..." : node.name;

      group.appendChild(circle);
      group.appendChild(text);

      group.setAttribute("transform", `translate(${node.x}, ${node.y})`);

      // Combined drag and click handler
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
        if (!isDragging) {
          console.log("Node selected:", node); // Debug log
          setSelectedNode(node);
        }
        setDraggingNodeId(null);
        isDragging = false;
      });

      // Hover effects
      group.addEventListener("mouseenter", () => {
        circle.setAttribute("filter", "url(#shadow)");
        circle.setAttribute("r", getNodeRadius(node.type) * 1.1);
      });
      group.addEventListener("mouseleave", () => {
        circle.setAttribute("filter", "");
        circle.setAttribute("r", getNodeRadius(node.type));
      });

      svgElement.appendChild(group);
    });

    // Add arrowhead marker and shadow filter
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "marker"
    );
    marker.setAttribute("id", "arrowhead");
    marker.setAttribute("markerWidth", "10");
    marker.setAttribute("markerHeight", "7");
    marker.setAttribute("refX", "8");
    marker.setAttribute("refY", "3.5");
    marker.setAttribute("orient", "auto");
    const polygon = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon"
    );
    polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
    polygon.setAttribute("fill", "#4b5563");
    marker.appendChild(polygon);
    defs.appendChild(marker);

    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    filter.setAttribute("id", "shadow");
    filter.innerHTML = `
      <feDropShadow dx="0" dy="0" stdDeviation="2" flood-color="#000000" flood-opacity="0.3"/>
    `;
    defs.appendChild(filter);
    svg.appendChild(defs);

    // Handle drag movement
    const handleMouseMove = (e) => {
      if (!draggingNodeId) return;

      const rect = svg.getBoundingClientRect();
      const x = Math.max(0, Math.min(dimensions.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(dimensions.height, e.clientY - rect.top));

      setPositionedNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === draggingNodeId ? { ...node, x, y } : node
        )
      );
    };

    // Stop dragging
    const handleMouseUp = () => {
      setDraggingNodeId(null);
    };

    // SVG background click to reset selection only if not on a node
    svg.addEventListener("click", (e) => {
      if (
        e.target === svg ||
        e.target.tagName === "line" ||
        e.target.tagName === "text"
      ) {
        console.log("SVG background clicked, resetting selectedNode"); // Debug log
        setSelectedNode(null);
      }
    });

    svg.addEventListener("mousemove", handleMouseMove);
    svg.addEventListener("mouseup", handleMouseUp);
    svg.addEventListener("mouseleave", handleMouseUp);

    return () => {
      svg.removeEventListener("mousemove", handleMouseMove);
      svg.removeEventListener("mouseup", handleMouseUp);
      svg.removeEventListener("mouseleave", handleMouseUp);
      svg.removeEventListener("click", () => setSelectedNode(null));
    };
  }, [positionedNodes, draggingNodeId, setSelectedNode, data, dimensions]);

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
          .node-group {
            transition: transform 0.1s ease-out;
          }
          .node-circle {
            transition: r 0.2s ease-out;
          }
          .relationship-line {
            transition: all 0.1s ease-out;
          }
        `}
      </style>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Graph Container */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Knowledge Graph
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Click and drag nodes to reposition. Click a node to view details.
          </p>
          <div className="border-2 border-slate-200 rounded-lg overflow-hidden">
            <svg
              ref={svgRef}
              width={dimensions.width}
              height={dimensions.height}
              className="w-full h-auto"
            />
          </div>

          {/* Legend */}
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
          </div>
        </div>

        {/* Node Details Panel */}
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
