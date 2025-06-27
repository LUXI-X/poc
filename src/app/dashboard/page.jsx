"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import DashboardNavbar from "@/components/dashboard-navbar";
import GraphVisualization from "@/components/graph-visualization";
import CompanyStats from "@/components/company-stats";
import ProjectsList from "@/components/projects-list";
import EmployeesList from "@/components/employees-list";
import DataManagement from "@/components/data-management";
import SearchBar from "@/components/search-bar";
import AdvancedSearch from "@/components/advanced-search";
import SearchResults from "@/components/search-results";
import { DataProvider } from "@/lib/data-context";
import Footer from "@/components/footer";
import DatabaseOverview from "@/components/database-overview";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchResults, setSearchResults] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Map tabs to their IDs
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "graphs", label: "Graphs" },
    { id: "knowledge-graph", label: "Knowledge Graph" },
    { id: "projects", label: "Projects" },
    { id: "employees", label: "Employees" },
    { id: "manage", label: "Data Management" },
  ];

  // Set active tab based on URL hash only on initial render
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const validTab = tabs.find((tab) => tab.id === hash);
    if (validTab) {
      setActiveTab(hash);
    }
    // Empty dependency array ensures this runs only once on mount
  }, []);

  // Update URL hash when activeTab changes
  useEffect(() => {
    const currentHash = window.location.hash.replace("#", "");
    if (activeTab === "overview" && currentHash !== "") {
      window.location.hash = ""; // Clear hash for overview
    } else if (activeTab !== "overview" && currentHash !== activeTab) {
      window.location.hash = activeTab; // Set hash for other tabs
    }
  }, [activeTab]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  const handleClearSearch = () => {
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-teal-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-600 mb-4"></div>
        <p className="text-slate-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect will happen via useEffect
  }

  return (
    <DataProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <DashboardNavbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">
              Company Knowledge Graph
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
              Explore organizational relationships, project assignments, and
              team structures through interactive graph visualization
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
              <SearchBar
                onSearchResults={handleSearchResults}
                onClearSearch={handleClearSearch}
              />
            </div>
          </div>
          {showSearchResults && (
            <div className="mb-8">
              <SearchResults
                results={searchResults}
                onClose={() => setShowSearchResults(false)}
              />
            </div>
          )}
          <div className="flex flex-wrap justify-center mb-8 bg-white rounded-xl shadow-sm p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-teal-600 text-white shadow-md"
                    : "text-slate-600 hover:text-teal-600 hover:bg-teal-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab === "overview" && <CompanyStats />}
          {activeTab === "graphs" && <DatabaseOverview />}
          {activeTab === "knowledge-graph" && (
            <GraphVisualization
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          )}
          {activeTab === "projects" && <ProjectsList />}
          {activeTab === "employees" && <EmployeesList />}
          {activeTab === "manage" && <DataManagement />}
        </main>
        <Footer />
        {showAdvancedSearch && (
          <AdvancedSearch
            onSearchResults={handleSearchResults}
            onClose={() => setShowAdvancedSearch(false)}
          />
        )}
      </div>
    </DataProvider>
  );
}
