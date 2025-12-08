import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaTimes, FaUserShield } from "react-icons/fa";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");

  // ----------------- FETCH USERS -------------------
  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const api = DataService("admin");
      const res = await api.get(API.ADMIN_GET_USERS);
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ----------------- DELETE USER -------------------
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      const api = DataService("admin");
      await api.delete(API.ADMIN_DELETE_USER(id));
      setSuccessMsg("User deleted successfully!");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    }
  };

  // ----------------- PROMOTE ADMIN -------------------
  const promoteUser = async (id) => {
    if (!window.confirm("Give admin access to this user?")) return;

    try {
      const api = DataService("admin");
      await api.put(API.ADMIN_PROMOTE_USER, { userId: id });
      setSuccessMsg("User promoted to admin!");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to promote user");
    }
  };

  // ----------------- REMOVE ADMIN -------------------
  const removeAdmin = async (id) => {
    if (!window.confirm("Remove admin access from this user?")) return;

    try {
      const api = DataService("admin");
      await api.put(API.REMOVE_ADMIN, { userId: id });
      setSuccessMsg("Admin access removed!");
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove admin");
    }
  };

  // ----------------- OPEN EDIT MODAL -------------------
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // ----------------- UPDATE USER -------------------
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const api = DataService("admin");

      await api.put(API.ADMIN_UPDATE_USER(selectedUser._id), {
        name: selectedUser.name,
        email: selectedUser.email,
        mobile: selectedUser.mobile,
        country: selectedUser.country,
      });

      setSuccessMsg("User updated successfully!");
      setEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    }
  };

  // ----------------- FILTER SEARCH -------------------
  const filteredUsers = users.filter((u) => {
    const text = `
      ${u.name}
      ${u.email}
      ${u.mobile}
      ${u.country}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  // ----------------- UI START -------------------
  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Loading users...
      </p>
    );

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

    {/* HEADER */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
      <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">
        User Management
      </h2>
  
      {/* SEARCH BAR */}
      <div className="relative w-full md:w-1/3 mt-4 md:mt-0">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-12 py-3 rounded-full bg-white border border-gray-300 shadow-lg focus:ring-2 focus:ring-red-500 outline-none transition-all"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
          🔍
        </span>
      </div>
    </div>
  
    {/* SUCCESS MESSAGE */}
    {successMsg && (
      <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm shadow">
        {successMsg}
      </div>
    )}
  
    {/* TABLE */}
    <div className="overflow-x-auto bg-white shadow-2xl rounded-2xl border border-gray-200">
      <table className="min-w-full text-gray-700">
        <thead className="bg-gradient-to-r from-red-600 to-red-800 text-white">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">User</th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Mobile</th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Role</th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Created</th>
            <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Actions</th>
          </tr>
        </thead>
  
        <tbody>
          {filteredUsers.map((user) => (
            <tr
              key={user._id}
              className="border-b hover:bg-gray-50 transition-all cursor-pointer"
            >
              {/* USER NAME */}
              <td className="px-6 py-4 font-semibold text-gray-900">
                {user.name}
              </td>
  
              {/* EMAIL */}
              <td className="px-6 py-4">{user.email}</td>
  
              {/* MOBILE */}
              <td className="px-6 py-4">
                {user.country && (
                  <span className="text-gray-600 font-medium">{user.country} </span>
                )}
                {user.mobile}
              </td>
  
              {/* ROLE */}
              <td className="px-6 py-4">
                {user.isAdmin ? (
                  <span className="px-4 py-1 rounded-full text-sm bg-green-100 text-green-800 font-semibold shadow-sm flex items-center gap-2 w-fit">
                    <FaUserShield className="text-green-700" /> Admin
                  </span>
                ) : (
                  <span className="px-4 py-1 rounded-full text-sm bg-gray-200 text-gray-700 w-fit">
                    User
                  </span>
                )}
              </td>
  
              {/* DATE */}
              <td className="px-6 py-4 text-gray-600">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "-"}
              </td>
  
              {/* ACTION BUTTONS */}
              <td className="px-6 py-4 flex items-center gap-3">
  
                {/* EDIT */}
                <button
                  className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition shadow-sm"
                  onClick={() => openEditModal(user)}
                >
                  <FaEdit />
                </button>
  
                {/* DELETE */}
                <button
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition shadow-sm"
                  onClick={() => deleteUser(user._id)}
                >
                  <FaTrash />
                </button>
  
                {/* ADMIN TOGGLE */}
                {user.isAdmin ? (
                  <button
                    className="px-3 py-1 rounded-lg bg-yellow-100 text-yellow-700 hover:bg-yellow-200 shadow-sm font-semibold"
                    onClick={() => removeAdmin(user._id)}
                  >
                    Remove Admin
                  </button>
                ) : (
                  <button
                    className="px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 shadow-sm font-semibold"
                    onClick={() => promoteUser(user._id)}
                  >
                    Make Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    {/* EDIT MODAL */}
    {editModalOpen && selectedUser && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
        <div className="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn scale-100">
  
          <button
            className="absolute top-4 right-4 text-gray-600 hover:text-black"
            onClick={() => setEditModalOpen(false)}
          >
            <FaTimes size={18} />
          </button>
  
          <h3 className="text-2xl font-bold mb-5 text-gray-800">
            Edit User Details
          </h3>
  
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div>
              <label className="font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
              />
            </div>
  
            <div>
              <label className="font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
              />
            </div>
  
            <div>
              <label className="font-medium text-gray-700">Country</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                value={selectedUser.country || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    country: e.target.value,
                  })
                }
              />
            </div>
  
            <div>
              <label className="font-medium text-gray-700">Mobile</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-red-500 outline-none"
                value={selectedUser.mobile || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    mobile: e.target.value,
                  })
                }
              />
            </div>
  
            <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-red-700 mt-3 transition">
              Update User
            </button>
          </form>
        </div>
      </div>
    )}
  
  </div>
  
  );
}
