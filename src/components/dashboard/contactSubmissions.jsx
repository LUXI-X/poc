"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  fetchContactSubmissions,
  deleteContactSubmission,
} from "@/lib/fetchFunctions/checkEmail";
import DashboardNavbar from "../dashboard-navbar";
import Footer from "../footer";

export default function ContactSubmissionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(
        `/login?redirectTo=${encodeURIComponent("/contact-submissions")}`
      );
    }
  }, [user, authLoading, router]);

  // Fetch contact submissions
  useEffect(() => {
    const loadSubmissions = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await fetchContactSubmissions();
      if (error) {
        setError(error);
      } else {
        setSubmissions(data || []);
      }
      setLoading(false);
    };
    loadSubmissions();
  }, [user]);

  // Handle delete submission
  const handleDeleteClick = (id) => {
    setSubmissionToDelete(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!submissionToDelete) return;
    const { error } = await deleteContactSubmission(submissionToDelete);
    if (error) {
      setError(error);
    } else {
      setSubmissions((prev) =>
        prev.filter((submission) => submission.id !== submissionToDelete)
      );
    }
    setShowModal(false);
    setSubmissionToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSubmissionToDelete(null);
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
        <DashboardNavbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading submissions...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Contact Submissions
          </h1>
          <p className="text-teal-100">
            View and manage contact form submissions from users
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

        {/* Submissions Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-slate-800 mb-6">
            All Submissions ({submissions.length})
          </h2>
          {submissions.length === 0 ? (
            <p className="text-slate-500 text-center py-8">
              No submissions found
            </p>
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
                      Subject
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Message
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
                  {submissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-b border-slate-200 hover:bg-teal-50"
                    >
                      <td className="px-4 py-3 text-slate-800">
                        {submission.name}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {submission.email}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {submission.subject}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {submission.message.length > 50
                          ? `${submission.message.substring(0, 50)}...`
                          : submission.message}
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteClick(submission.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Custom Delete Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
              <h3 className="text-xl font-semibold text-teal-800 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this submission? This action
                cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-200 text-slate-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
