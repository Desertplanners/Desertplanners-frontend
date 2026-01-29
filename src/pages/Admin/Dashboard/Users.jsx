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

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("adminAuth");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log("CURRENT USER 👉", user);
      setCurrentUser(user);
    } else {
      console.log("NO adminAuth FOUND");
      setCurrentUser(null);
    }
  }, []);

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

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            User Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage users, roles & admin permissions
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/80 backdrop-blur border border-gray-200 shadow-md focus:ring-2 focus:ring-red-500 outline-none transition"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
            🔍
          </span>
        </div>
      </div>

      {/* SUPER ADMIN INDICATOR */}
      {currentUser?.isSuperAdmin && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100 px-5 py-4 shadow-sm">
          <span className="text-2xl">👑</span>
          <div className="text-sm text-purple-800">
            <p className="font-bold">Logged in as Super Admin</p>
            <p className="opacity-80">
              You can grant or revoke admin access for users.
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {successMsg && (
        <div className="mb-5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 shadow-sm">
          {successMsg}
        </div>
      )}

      {/* TABLE CARD */}
      <div className="rounded-2xl bg-white/80 backdrop-blur shadow-2xl border border-gray-200 overflow-hidden">
        <table className="min-w-full text-gray-700">
          <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-b last:border-none hover:bg-red-50/40 transition"
              >
                {/* USER */}
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">
                    {user.name}
                    {currentUser?._id === user._id && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">
                        You
                      </span>
                    )}
                  </div>
                </td>

                {/* EMAIL */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>

                {/* MOBILE */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.country && <span>{user.country} </span>}
                  {user.mobile}
                </td>

                {/* ROLE */}
                <td className="px-6 py-4">
                  {user.isSuperAdmin ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1 text-sm font-bold text-purple-800">
                      <FaUserShield /> Super Admin
                    </span>
                  ) : user.isAdmin ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm font-bold text-green-800">
                      <FaUserShield /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-gray-200 px-4 py-1 text-sm font-medium text-gray-700">
                      User
                    </span>
                  )}
                </td>

                {/* DATE */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "-"}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4 flex flex-wrap gap-2">
                  {/* EDIT */}
                  {/* <button
                    className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition shadow-sm"
                    onClick={() => openEditModal(user)}
                  >
                    <FaEdit />
                  </button> */}

                  {/* DELETE */}
                  {!user.isSuperAdmin && (
                    <button
                      className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition shadow-sm"
                      onClick={() => deleteUser(user._id)}
                    >
                      <FaTrash />
                    </button>
                  )}

                  {/* ADMIN ACCESS TOGGLE */}
                  {currentUser?.isSuperAdmin &&
                    !user.isSuperAdmin &&
                    currentUser._id !== user._id &&
                    (user.isAdmin ? (
                      <button
                        className="px-4 py-2 rounded-xl bg-yellow-100 text-yellow-800 font-semibold text-xs hover:bg-yellow-200 transition"
                        onClick={() => removeAdmin(user._id)}
                      >
                        🔒 Remove Admin
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 rounded-xl bg-green-100 text-green-800 font-semibold text-xs hover:bg-green-200 transition"
                        onClick={() => promoteUser(user._id)}
                      >
                        🔓 Make Admin
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
