"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useData } from "@/lib/data-context";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import NodeForm from "@/components/node-form";
import DashboardNavbar from "@/components/dashboard-navbar";
import { useAuth } from "@/lib/auth-context"; // Import useAuth

export default function DetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data, loading } = useData();
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state
  const [activeTab, setActiveTab] = useState("details");
  const [showEditForm, setShowEditForm] = useState(false);
  const [item, setItem] = useState(null);
  const [relatedData, setRelatedData] = useState({
    incoming: [],
    outgoing: [],
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!loading && data && params.type && params.id) {
      const foundItem = data.nodes.find((node) => node.id === params.id);
      if (foundItem) {
        setItem(foundItem);

        // Get related relationships
        const incoming = data.relationships
          .filter((rel) => rel.target === params.id)
          .map((rel) => ({
            relationship: rel,
            node: data.nodes.find((n) => n.id === rel.source),
          }))
          .filter((item) => item.node);

        const outgoing = data.relationships
          .filter((rel) => rel.source === params.id)
          .map((rel) => ({
            relationship: rel,
            node: data.nodes.find((n) => n.id === rel.target),
          }))
          .filter((item) => item.node);

        setRelatedData({ incoming, outgoing });
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

  // Show loading state if either auth or data is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading details...</p>
        </div>
        <Footer />
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <DashboardNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Item Not Found
          </h1>
          <p className="text-slate-600 mb-8">
            The requested item could not be found.
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
      <DashboardNavbar />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="hover:text-teal-600 transition-colors"
          >
            Home
          </button>
          <span> &gt; </span>

          <span className="text-slate-800 font-medium">{item.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-teal-800 bg-opacity-20 rounded-2xl flex items-center justify-center">
                {getNodeIcon(item.type)}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {item.name}
                </h1>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getTypeColor(
                      item.type
                    )} bg-white`}
                  >
                    {item.type}
                  </span>
                  <span className="text-teal-100">ID: {item.id}</span>
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="flex border-b border-slate-200">
            {[
              { id: "details", label: "Details", icon: "📋" },
              { id: "relationships", label: "Relationships", icon: "🔗" },
              { id: "analytics", label: "Analytics", icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 ${
                  activeTab === tab.id
                    ? "text-teal-600 border-teal-600 bg-teal-50"
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
                {/* Properties */}
                {item.properties && Object.keys(item.properties).length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                      Properties
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(item.properties).map(([key, value]) => (
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
                                value
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-6 border border-teal-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-teal-800">
                        Total Connections
                      </h4>
                      <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-teal-700"
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
                    </div>
                    <div className="text-3xl font-bold text-teal-800">
                      {relatedData.incoming.length +
                        relatedData.outgoing.length}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl p-6 border border-cyan-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-cyan-800">
                        Properties
                      </h4>
                      <div className="w-10 h-10 bg-cyan-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-cyan-700"
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
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-cyan-800">
                      {item.properties
                        ? Object.keys(item.properties).length
                        : 0}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-emerald-800">
                        Network Centrality
                      </h4>
                      <div className="w-10 h-10 bg-emerald-200 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-emerald-700"
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
                    </div>
                    <div className="text-3xl font-bold text-emerald-800">
                      {Math.round(
                        ((relatedData.incoming.length +
                          relatedData.outgoing.length) /
                          Math.max(data.nodes.length - 1, 1)) *
                          100
                      )}
                      %
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "relationships" && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Incoming Relationships */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-teal-800 rounded-full"></span>
                    Incoming Relationships ({relatedData.incoming.length})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {relatedData.incoming.length === 0 ? (
                      <p className="text-slate-500 text-center py-8">
                        No incoming relationships
                      </p>
                    ) : (
                      relatedData.incoming.map((rel, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-teal-800  rounded-full flex items-center justify-center">
                              {getNodeIcon(rel.node.type)}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-800">
                                {rel.node.name}
                              </div>
                              <div className="text-sm text-green-600 font-medium">
                                {rel.relationship.type}
                              </div>
                              <div className="text-xs text-slate-500">
                                {rel.node.type}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                router.push(`/details/node/${rel.node.id}`)
                              }
                              className="text-teal-600 hover:text-teal-800 p-2 rounded-lg hover:bg-teal-50 transition-colors"
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
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Outgoing Relationships */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-800 rounded-full"></span>
                    Outgoing Relationships ({relatedData.outgoing.length})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {relatedData.outgoing.length === 0 ? (
                      <p className="text-slate-500 text-center py-8">
                        No outgoing relationships
                      </p>
                    ) : (
                      relatedData.outgoing.map((rel, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-lg p-4 border border-slate-200 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center">
                              {getNodeIcon(rel.node.type)}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-slate-800">
                                {rel.node.name}
                              </div>
                              <div className="text-sm text-blue-600 font-medium">
                                {rel.relationship.type}
                              </div>
                              <div className="text-xs text-slate-500">
                                {rel.node.type}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                router.push(`/details/node/${rel.node.id}`)
                              }
                              className="text-teal-600 hover:text-teal-800 p-2 rounded-lg hover:bg-teal-50 transition-colors"
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
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-8">
                {/* Relationship Types Chart */}
                <div className="bg-white border border-slate-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">
                    Relationship Types Distribution
                  </h3>
                  <div className="space-y-4">
                    {[
                      ...new Set([
                        ...relatedData.incoming.map((r) => r.relationship.type),
                        ...relatedData.outgoing.map((r) => r.relationship.type),
                      ]),
                    ].map((type) => {
                      const count = [
                        ...relatedData.incoming,
                        ...relatedData.outgoing,
                      ].filter((r) => r.relationship.type === type).length;
                      const total =
                        relatedData.incoming.length +
                        relatedData.outgoing.length;
                      const percentage =
                        total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={type} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-medium text-slate-700">
                            {type}
                          </div>
                          <div className="flex-1 bg-slate-200 rounded-full h-3">
                            <div
                              className="bg-teal-500 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-16 text-sm text-slate-600 text-right">
                            {count} ({percentage}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Network Position */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Network Position
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">
                          Degree Centrality:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {Math.round(
                            ((relatedData.incoming.length +
                              relatedData.outgoing.length) /
                              Math.max(data.nodes.length - 1, 1)) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">In-Degree:</span>
                        <span className="font-semibold text-slate-800">
                          {relatedData.incoming.length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Out-Degree:</span>
                        <span className="font-semibold text-slate-800">
                          {relatedData.outgoing.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      Data Completeness
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-600">
                          Properties Filled:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {item.properties
                            ? Object.keys(item.properties).length
                            : 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">
                          Has Relationships:
                        </span>
                        <span className="font-semibold text-slate-800">
                          {relatedData.incoming.length +
                            relatedData.outgoing.length >
                          0
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Last Updated:</span>
                        <span className="font-semibold text-slate-800">
                          {new Date().toLocaleDateString()}
                        </span>
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
        <NodeForm node={item} onClose={() => setShowEditForm(false)} />
      )}

      <Footer />
    </div>
  );
}
