"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { fetchAllProfiles } from "@/lib/fetchFunctions/checkEmail";
import DashboardNavbar from "../dashboard-navbar";
import Footer from "@/components/footer";
import { supabase } from "@/lib/supabase";

export default function UserListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCompanyUser, setIsCompanyUser] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({});

  // Check authentication and user type
  useEffect(() => {
    const checkUser = async () => {
      if (authLoading) return;
      if (!user) {
        router.push(`/login?redirectTo=${encodeURIComponent("/dashboard")}`);
        return;
      }

      // Fetch user profile to check type
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("type")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          setError("Unable to verify user type");
          setLoading(false);
          return;
        }

        if (data.type === "Company") {
          setIsCompanyUser(true);
        } else {
          setError("Access denied: Only Company users can view this page");
          setLoading(false);
        }
      } catch (err) {
        console.error("Unexpected error checking user type:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };

    checkUser();
  }, [user, authLoading, router]);

  // Fetch all profiles if user is Company
  useEffect(() => {
    const loadProfiles = async () => {
      if (!user || !isCompanyUser) return;
      setLoading(true);
      const { data, error } = await fetchAllProfiles();
      if (error) {
        setError(error);
      } else {
        setProfiles(data || []);
        // Initialize password visibility state
        const visibility = {};
        data.forEach((profile) => {
          visibility[profile.id] = false;
        });
        setPasswordVisibility(visibility);
      }
      setLoading(false);
    };
    loadProfiles();
  }, [user, isCompanyUser]);

  // Toggle password visibility for a specific profile
  const togglePasswordVisibility = (id) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
        <DashboardNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading user list...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Access denied for non-Company users
  if (!isCompanyUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-100 flex flex-col">
        {/* Assuming DashboardNavbar is a separate component */}
        <DashboardNavbar />
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col items-center text-center">
              {/* Custom SVG Lock Icon */}
              <svg
                className="w-16 h-16 text-teal-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0-1.1-.9-2-2-2s-2 .9-2 2v3h4v-3zm-2 5a3 3 0 100-6 3 3 0 000 6zm0 2c-4.4 0-8 1.8-8 4v2h16v-2c0-2.2-3.6-4-8-4z"
                />
              </svg>
              <h1 className="text-3xl font-bold text-slate-800 mb-3">
                Access Denied
              </h1>
              <p className="text-teal-600 text-base mb-6 leading-relaxed">
                {error || "You don't have permission to access this page."}
              </p>
              <a
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:ring-4 focus:ring-teal-200 transition-all duration-200"
                aria-label="Return to Dashboard"
              >
                {/* Custom SVG Back Arrow */}
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Dashboard
              </a>
            </div>
          </div>
        </main>
        {/* Assuming Footer is a separate component */}
        <Footer />
        <style jsx>{`
          main {
            animation: fadeIn 0.5s ease-out;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">User List</h1>
          <p className="text-teal-100">
            View all user profiles (Company users only)
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Profiles Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            All Users ({profiles.length})
          </h2>
          {profiles.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No users found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-teal-50 text-teal-800">
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Password
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Age
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Phone
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr
                      key={profile.id}
                      className="border-b border-slate-200 hover:bg-teal-50"
                    >
                      <td className="px-4 py-3 text-slate-800">
                        {profile.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {profile.email}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        <div className="flex items-center">
                          <span className="mr-2">
                            {passwordVisibility[profile.id]
                              ? profile.password || "N/A"
                              : "******"}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(profile.id)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            {passwordVisibility[profile.id] ? (
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
                                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                />
                              </svg>
                            ) : (
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {profile.age || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {profile.phone || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {profile.role || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {profile.type || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
