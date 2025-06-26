"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/data-context";

export default function DataTable({ type, data, nodes, onEdit }) {
  const { deleteNode, deleteRelationship } = useData();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [confirmText, setConfirmText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 13;

  // Check for duplicate IDs in the data array
  if (data) {
    const idSet = new Set(data.map((item) => item.id));
    if (idSet.size !== data.length) {
      console.warn(
        "Duplicate IDs detected in data:",
        data.map((item) => item.id)
      );
    }
  }

  // Calculate pagination data
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleDelete = async (item) => {
    setItemToDelete(item);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (confirmText.toLowerCase() === "yes" && itemToDelete) {
      try {
        if (type === "nodes") {
          await deleteNode(itemToDelete.id);
        } else {
          await deleteRelationship(itemToDelete.id);
        }
        setShowModal(false);
        setConfirmText("");
        setItemToDelete(null);
        // Adjust current page if necessary
        if (paginatedData.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Error deleting item. Please try again.");
      }
    }
  };

  const handleResultClick = (result) => {
    if (result.type === "node") {
      router.push(`/details/node/${result.id}`);
    } else {
      router.push(`/details/relationship/${result.id}`);
    }
  };

  const getNodeName = (nodeId) => {
    const node = nodes?.find((n) => n.id === nodeId);
    return node ? node.name : nodeId;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 capitalize">{type}</h3>
        <p className="text-slate-600 mt-1">{totalItems} items</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {type === "nodes" ? (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Properties
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </>
              ) : (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Target
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {paginatedData.map((item, index) => (
              <tr key={`${item.id}-${index}`} className="hover:bg-slate-50">
                {type === "nodes" ? (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="font-medium text-teal-600 hover:text-teal-800 cursor-pointer"
                        onClick={() =>
                          handleResultClick({ type: "node", id: item.id })
                        }
                      >
                        {item.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {Object.entries(item.properties || {})
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium">{key}:</span>{" "}
                              {value}
                            </div>
                          ))}
                        {Object.keys(item.properties || {}).length > 2 && (
                          <div className="text-xs text-slate-500">
                            +{Object.keys(item.properties).length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => onEdit?.(item)}
                        className="text-teal-600 hover:text-teal-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-teal-600 hover:text-teal-800 cursor-pointer"
                        onClick={() =>
                          handleResultClick({ type: "node", id: item.source })
                        }
                      >
                        {getNodeName(item.source)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="text-sm font-medium text-teal-600 hover:text-teal-800 cursor-pointer"
                        onClick={() =>
                          handleResultClick({ type: "node", id: item.target })
                        }
                      >
                        {getNodeName(item.target)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 text-slate-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 Utilization 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-6m-10 0h6m0 0v5a2 2 0 002 2h2a2 2 0 002-2v-5"
              />
            </svg>
            <p className="text-slate-500">No {type} found</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center py-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-teal-600 hover:text-teal-800 disabled:text-slate-400"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === index + 1
                  ? "bg-teal-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-teal-100"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-teal-600 hover:text-teal-800 disabled:text-slate-400"
          >
            Next
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0  bg-teal-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-slate-600 mb-4">
              Are you sure you want to delete this {type.slice(0, -1)}? Type
              "Yes" to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full p-2 text-teal-900 bg-gray-100 rounded-lg placeholder:text-slate-400 focus:outline-none border-none pr-12"
              placeholder="Type 'Yes' to confirm"
            />
            <div className="flex justify-end space-x-3 mt-3.5">
              <button
                onClick={() => {
                  setShowModal(false);
                  setConfirmText("");
                  setItemToDelete(null);
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={confirmText.toLowerCase() !== "yes"}
                className="px-4 py-2 bg-teal-800 text-white rounded-md hover:bg-teal-700 disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
