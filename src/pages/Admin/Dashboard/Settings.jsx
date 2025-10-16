import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";

// Utility to get initials safely
const getInitials = (name) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => (n[0] ? n[0].toUpperCase() : ""))
    .join("");
};

export default function Settings() {
  const [adminData, setAdminData] = useState({ name: "", email: "" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const api = DataService(token);
      const res = await api.get(API.ADMIN_PROFILE);
      setAdminData({ name: res.data.name, email: res.data.email });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch admin data");
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const api = DataService(token);
      const res = await api.put(API.ADMIN_UPDATE_PROFILE, {
        name: adminData.name,
        password: password || undefined,
      });
      setAdminData({ name: res.data.name, email: res.data.email });
      setPassword("");
      setSuccess("Profile updated successfully!");
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  const theme = {
    primary: "from-red-600",
    secondary: "to-red-900",
    accent: "text-white",
    inputBg: "bg-gray-100",
    inputFocus: "focus:ring-red-500",
    success: "text-green-500",
    error: "text-red-500",
    loading: "text-blue-500",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-xl mt-6 sm:mt-10">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-red-600 to-red-900 text-white rounded-full flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-lg mb-4 sm:mb-0">
          {getInitials(adminData.name) || "A"}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold">{adminData.name || "Admin"}</h2>
          <p className="text-gray-500 text-sm sm:text-base">{adminData.email}</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Last login: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {loading && <p className={`${theme.loading} mb-4`}>Loading...</p>}
      {error && <p className={`${theme.error} mb-4`}>{error}</p>}
      {success && <p className={`${theme.success} mb-4`}>{success}</p>}
    
      {/* Welcome / Tips Card */}
      <div className="p-4 mb-6 bg-red-50 rounded-lg border-l-4 border-red-600 text-center sm:text-left">
        <h3 className="font-semibold text-red-700 mb-1 text-sm sm:text-base">
          Welcome, {adminData.name || "Admin"}!
        </h3>
        <p className="text-red-600 text-xs sm:text-sm">
          Keep your profile updated and manage your account securely.
        </p>
      </div>

      {/* Update Form */}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1 text-sm sm:text-base">Name</label>
          <input
            type="text"
            value={adminData.name}
            onChange={(e) =>
              setAdminData({ ...adminData, name: e.target.value })
            }
            className={`w-full p-3 sm:p-4 border rounded-md ${theme.inputBg} focus:outline-none focus:ring-2 ${theme.inputFocus}`}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-sm sm:text-base">Email</label>
          <input
            type="email"
            value={adminData.email}
            disabled
            className={`w-full p-3 sm:p-4 border rounded-md ${theme.inputBg}`}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-sm sm:text-base">Password</label>
          <input
            type="password"
            placeholder="Leave blank to keep current"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 sm:p-4 border rounded-md ${theme.inputBg} focus:outline-none focus:ring-2 ${theme.inputFocus}`}
          />
        </div>

        <button
          type="submit"
          className={`w-full bg-gradient-to-r ${theme.primary} ${theme.secondary} ${theme.accent} py-3 sm:py-4 rounded-lg font-semibold hover:opacity-90 transition`}
        >
          Update Profile
        </button>
      </form>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <button
          onClick={() => alert("Redirect to Change Password page")}
          className="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Change Password
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.reload();
          }}
          className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
