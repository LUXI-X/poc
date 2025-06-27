"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  fetchAllProfiles,
  updateProfile,
  deleteProfile,
} from "@/lib/fetchFunctions/checkEmail";
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
  const [activeTab, setActiveTab] = useState("users");
  const [editingProfile, setEditingProfile] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    age: "",
    phone: "",
    role: "",
    type: "",
  });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Check authentication and user type
  useEffect(() => {
    const checkUser = async () => {
      if (authLoading) return;
      if (!user) {
        router.push(`/login?redirectTo=${encodeURIComponent("/dashboard")}`);
        return;
      }

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
          setError("Access denied: Only Company can view this page");
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

  // Toggle password visibility
  const togglePasswordVisibility = (id) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Start editing
  const startEditing = (profile) => {
    setEditingProfile(profile.id);
    setEditForm({
      name: profile.name || "",
      age: profile.age || "",
      phone: profile.phone || "",
      role: profile.role || "",
      type: profile.type || "",
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingProfile(null);
    setEditForm({ name: "", age: "", phone: "", role: "", type: "" });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit edited profile
  const handleUpdateProfile = async (id) => {
    try {
      const { error } = await updateProfile(id, editForm);
      if (error) {
        setError(error);
        return;
      }
      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === id ? { ...profile, ...editForm } : profile
        )
      );
      setEditingProfile(null);
      setEditForm({ name: "", age: "", phone: "", role: "", type: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  // Open delete modal
  const openDeleteModal = (id) => {
    setDeleteModal({ open: true, id });
    setDeleteConfirmText("");
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setDeleteModal({ open: false, id: null });
    setDeleteConfirmText("");
  };

  // Handle delete profile
  const handleDeleteProfile = async () => {
    if (deleteConfirmText.toLowerCase() !== "yes") return;
    try {
      const { error } = await deleteProfile(deleteModal.id);
      if (error) {
        setError(error);
        return;
      }
      setProfiles((prev) =>
        prev.filter((profile) => profile.id !== deleteModal.id)
      );
      closeDeleteModal();
    } catch (err) {
      setError(err.message);
    }
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

  // Access denied
  if (!isCompanyUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-100 flex flex-col">
        <DashboardNavbar />
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col items-center text-center">
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
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            User Management
          </h1>
          <p className="text-teal-100">
            Manage all user profiles (Company only)
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-slide-down">
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

        {/* Users Tab Content */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
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
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile) => (
                      <tr
                        key={profile.id}
                        className="border-b border-slate-200 hover:bg-teal-50 transition-colors duration-200"
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
                                ? profile.password || "Not Available 😉"
                                : "******"}
                            </span>
                            <button
                              onClick={() =>
                                togglePasswordVisibility(profile.id)
                              }
                              className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
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
                        <td className="px-4 py-3 text-slate-800">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(profile)}
                              className="px-3 py-1 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => openDeleteModal(profile.id)}
                              className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-teal-800 focus:ring-2 focus:ring-red-200 transition-all duration-200"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab Content (Placeholder) */}
        {/* {activeTab === "settings" && (
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Settings
            </h2>
            <p className="text-slate-500">Settings content coming soon...</p>
          </div>
        )} */}

        {/* Edit Modal */}
        {editingProfile && (
          <div className="fixed inset-0 bg-teal-700 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 transform transition-all duration-300 scale-95 hover:scale-100">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                Edit Profile
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-teal-900 bg-gray-100 rounded-lg placeholder:text-slate-400 focus:outline-none border-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={editForm.age}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-teal-900 bg-gray-100 rounded-lg placeholder:text-slate-400 focus:outline-none border-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-teal-900 bg-gray-100 rounded-lg placeholder:text-slate-400 focus:outline-none border-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={editForm.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-teal-900 bg-gray-100 rounded-lg placeholder:text-slate-400 focus:outline-none border-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600">
                    Type
                  </label>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 text-teal-900 bg-gray-100 rounded-lg placeholder:text-slate-400 focus:outline-none border-none"
                  >
                    <option value="">Select Type</option>
                    <option value="Company">Company</option>
                    <option value="Employee">Employee</option>
                    <option value="Project">Project</option>
                    <option value="Department">Department</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={cancelEditing}
                  className="px-4 py-2 bg-gray-300 text-slate-800 rounded-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdateProfile(editingProfile)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-200 transition-all duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.open && (
          <div className="fixed inset-0 bg-teal-700 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-95 hover:scale-100">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                Confirm Deletion
              </h2>
              <p className="text-slate-600 mb-4">
                Are you sure you want to delete this profile? This action cannot
                be undone.
              </p>
              <p className="text-slate-600 mb-4">
                Type <span className="font-semibold">"yes"</span> to confirm:
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-4 py-3 text-teal-900 bg-gray-100 rounded-lg placeholder:text-slate-400 focus:outline-none border-none"
                placeholder="Type 'yes' to confirm"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 bg-gray-300 text-slate-800 rounded-lg hover:bg-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProfile}
                  disabled={deleteConfirmText.toLowerCase() !== "yes"}
                  className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
                    deleteConfirmText.toLowerCase() === "yes"
                      ? "bg-gray-600 hover:bg-teal-800 focus:ring-2 focus:ring-red-200"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
