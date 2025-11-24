import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [search, setSearch] = useState(""); // ⭐ NEW SEARCH BAR

  const adminToken = localStorage.getItem("adminToken");

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");

    if (!adminToken) {
      setError("Admin not logged in");
      setLoading(false);
      return;
    }

    try {
      const api = DataService();
      const res = await api.get(API.ADMIN_GET_USERS, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const api = DataService();
      await api.delete(API.ADMIN_DELETE_USER(id), {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setSuccessMsg("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  // Open modal for editing
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // Update user details
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const api = DataService();
      await api.put(
        API.ADMIN_UPDATE_USER(selectedUser._id),
        {
          name: selectedUser.name,
          email: selectedUser.email,
          mobile: selectedUser.mobile,
          countryCode: selectedUser.countryCode,
        },
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        }
      );
      setSuccessMsg("User updated successfully!");
      setEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ⭐ FILTER USERS BY SEARCH
  const filteredUsers = users.filter((u) => {
    const text = `
      ${u.name}
      ${u.email}
      ${u.mobile}
      ${u.countryCode}
      ${new Date(u.createdAt).toLocaleDateString()}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading users...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER + SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">

        <h2 className="text-3xl font-bold text-gray-800">
          All Users
        </h2>

        {/* ⭐ PREMIUM SEARCH BAR */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full px-12 py-2
              rounded-full
              bg-white/70 backdrop-blur-md
              border border-gray-300
              shadow-md
              hover:shadow-lg
              focus:ring-2 focus:ring-red-500
              outline-none
              transition-all duration-300
            "
          />

          {/* Icon */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
            🔍
          </span>

          {/* Clear */}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500 text-lg"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {successMsg && (
        <p className="text-green-600 font-medium mb-4">{successMsg}</p>
      )}

      {/* USERS TABLE */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl">
        <table className="min-w-full border-collapse text-gray-700">
          <thead className="bg-gradient-to-r from-red-500 to-red-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left uppercase tracking-wider">Mobile</th>
              <th className="px-6 py-3 text-left uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 font-medium">{user.name}</td>

                  <td className="px-6 py-4">{user.email}</td>

                  <td className="px-6 py-4">
                    <span className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                      {user.countryCode || ""} {user.mobile || ""}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 flex gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700 transition"
                      onClick={() => openEditModal(user)}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="text-red-500 hover:text-red-700 transition"
                      onClick={() => deleteUser(user._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">

            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <FaTimes />
            </button>

            <h3 className="text-xl font-bold mb-4 text-gray-800">Edit User Details</h3>

            <form onSubmit={handleUpdateUser} className="space-y-4">

              <div>
                <label className="block text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedUser.name}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, name: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="w-1/3">
                  <label className="block text-gray-600 mb-1">Code</label>
                  <input
                    type="text"
                    value={selectedUser.countryCode || ""}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, countryCode: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                  />
                </div>

                <div className="w-2/3">
                  <label className="block text-gray-600 mb-1">Mobile</label>
                  <input
                    type="text"
                    value={selectedUser.mobile || ""}
                    onChange={(e) =>
                      setSelectedUser({ ...selectedUser, mobile: e.target.value })
                    }
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-none"
                  />
                </div>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition">
                Update User
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
