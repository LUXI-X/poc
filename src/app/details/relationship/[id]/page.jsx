"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useData } from "@/lib/data-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RelationshipForm from "@/components/relationship-form";

export default function RelationshipDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data, loading } = useData();
  const [activeTab, setActiveTab] = useState("details");
  const [showEditForm, setShowEditForm] = useState(false);
  const [relationship, setRelationship] = useState(null);
  const [connectedNodes, setConnectedNodes] = useState({
    source: null,
    target: null,
  });

  useEffect(() => {
    if (!loading && data && params.id) {
      const foundRelationship = data.relationships.find(
        (rel) => rel.id === params.id
      );
      if (foundRelationship) {
        setRelationship(foundRelationship);

        // Get connected nodes
        const sourceNode = data.nodes.find(
          (node) => node.id === foundRelationship.source
        );
        const targetNode = data.nodes.find(
          (node) => node.id === foundRelationship.target
        );

        setConnectedNodes({ source: sourceNode, target: targetNode });
      }
    }
  }, [data, loading, params]);

  const getNodeIcon = (type) => {
    switch (type) {
      case "Company":
        return (
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        );
      case "Employee":
        return (
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      case "Project":
        return (
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        );
      default:
        return (
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
              d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
            />
          </svg>
        );
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Company":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "Employee":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Project":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getRelationshipTypeColor = (type) => {
    switch (type) {
      case "WORKS_FOR":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "MANAGES":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "WORKS_ON":
        return "bg-green-100 text-green-800 border-green-200";
      case "COLLABORATES_WITH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "REPORTS_TO":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading relationship details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!relationship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Relationship Not Found
          </h1>
          <p className="text-slate-600 mb-8">
            The requested relationship could not be found.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="hover:text-teal-600 transition-colors"
          >
            Home
          </button>
          <span>›</span>
          <span className="text-slate-800 font-medium">
            Relationship: {relationship.type}
          </span>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-teal-900 bg-opacity-20 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {relationship.type}
                </h1>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getRelationshipTypeColor(
                      relationship.type
                    )} bg-white`}
                  >
                    Relationship
                  </span>
                  <span className="text-purple-100">ID: {relationship.id}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditForm(true)}
                className="bg-white bg-opacity-20 text-black px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </button>
              <button
                onClick={() => router.back()}
                className="bg-white bg-opacity-20 text-black px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>

        {/* Connected Nodes */}
        <div className="bg-white rounded-xl shadow-sm mb-8 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            Connected Nodes
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Source Node */}
            {connectedNodes.source && (
              <div className="flex-1 w-full">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-teal-800 rounded-full flex items-center justify-center">
                      {getNodeIcon(connectedNodes.source.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-teal-800">
                        {connectedNodes.source.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          connectedNodes.source.type
                        )}`}
                      >
                        {connectedNodes.source.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/details/node/${connectedNodes.source.id}`)
                    }
                    className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm font-medium text-slate-600">
                    Source
                  </span>
                </div>
              </div>
            )}

            {/* Relationship Arrow */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getRelationshipTypeColor(
                  relationship.type
                )}`}
              >
                {relationship.type}
              </span>
            </div>

            {/* Target Node */}
            {connectedNodes.target && (
              <div className="flex-1 w-full">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-teal-800 rounded-full flex items-center justify-center">
                      {getNodeIcon(connectedNodes.target.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-800">
                        {connectedNodes.target.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          connectedNodes.target.type
                        )}`}
                      >
                        {connectedNodes.target.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      router.push(`/details/node/${connectedNodes.target.id}`)
                    }
                    className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors text-sm"
                  >
                    View Details
                  </button>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm font-medium text-slate-600">
                    Target
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex border-b border-slate-200">
            {[
              { id: "details", label: "Details", icon: "📋" },
              { id: "properties", label: "Properties", icon: "🏷️" },
              { id: "analytics", label: "Analytics", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? "text-teal-600 border-teal-600 bg-purple-50"
                    : "text-slate-600 border-transparent hover:text-teal-600 hover:bg-slate-50"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === "details" && (
              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <span className="text-slate-600 font-medium text-sm uppercase tracking-wide mb-2 block">
                        Relationship Type
                      </span>
                      <span className="text-slate-800 font-semibold text-lg">
                        {relationship.type}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <span className="text-slate-600 font-medium text-sm uppercase tracking-wide mb-2 block">
                        Relationship ID
                      </span>
                      <span className="text-slate-800 font-semibold text-lg font-mono">
                        {relationship.id}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <span className="text-slate-600 font-medium text-sm uppercase tracking-wide mb-2 block">
                        Source Node
                      </span>
                      <span className="text-slate-800 font-semibold text-lg">
                        {connectedNodes.source
                          ? connectedNodes.source.name
                          : relationship.source}
                      </span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                      <span className="text-slate-600 font-medium text-sm uppercase tracking-wide mb-2 block">
                        Target Node
                      </span>
                      <span className="text-slate-800 font-semibold text-lg">
                        {connectedNodes.target
                          ? connectedNodes.target.name
                          : relationship.target}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-purple-800">
                        Direction
                      </h4>
                      <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-purple-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-800">
                      Directed
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-blue-800">
                        Properties
                      </h4>
                      <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {relationship.properties
                        ? Object.keys(relationship.properties).length
                        : 0}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-green-800">
                        Status
                      </h4>
                      <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-green-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "properties" && (
              <div className="space-y-8">
                {relationship.properties &&
                Object.keys(relationship.properties).length > 0 ? (
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                      Relationship Properties
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(relationship.properties).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-slate-50 rounded-xl p-6 border border-slate-200"
                          >
                            <div className="flex flex-col">
                              <span className="text-slate-600 font-medium text-sm uppercase tracking-wide mb-2">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </span>
                              <span className="text-slate-800 font-semibold text-lg break-words">
                                {typeof value === "string" &&
                                value.length > 100 ? (
                                  <span>
                                    {value.substring(0, 100)}
                                    <span className="text-slate-500">...</span>
                                  </span>
                                ) : (
                                  String(value)
                                )}
                              </span>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🏷️</div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                      No Properties
                    </h3>
                    <p className="text-slate-600">
                      This relationship doesn't have any additional properties.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-8">
                {/* Relationship Metrics */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Connection Strength
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">
                          Relationship Weight:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {relationship.properties?.weight || "1.0"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Connection Type:</span>
                        <span className="font-semibold text-slate-800">
                          {relationship.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Bidirectional:</span>
                        <span className="font-semibold text-slate-800">No</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Metadata
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Created:</span>
                        <span className="font-semibold text-slate-800">
                          {relationship.properties?.created ||
                            new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Last Updated:</span>
                        <span className="font-semibold text-slate-800">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <span className="font-semibold text-green-600">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network Impact */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">
                    Network Impact
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-8 h-8 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-slate-800 mb-1">
                        Direct
                      </div>
                      <div className="text-sm text-slate-600">
                        Connection Type
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-8 h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-slate-800 mb-1">
                        High
                      </div>
                      <div className="text-sm text-slate-600">Importance</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg
                          className="w-8 h-8 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-2xl font-bold text-slate-800 mb-1">
                        Stable
                      </div>
                      <div className="text-sm text-slate-600">
                        Relationship Health
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Form Modal */}
      {showEditForm && (
        <RelationshipForm
          relationship={relationship}
          onClose={() => setShowEditForm(false)}
        />
      )}

      <Footer />
    </div>
  );
}
