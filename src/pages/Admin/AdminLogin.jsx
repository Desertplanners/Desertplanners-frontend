import React, { useState } from "react";
import DataService from "../../config/DataService";
import { API } from "../../config/API";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const api = DataService();
      const res = await api.post(API.ADMIN_LOGIN, { email, password });
      localStorage.setItem("adminToken", res.data.token);
      alert("Admin logged in successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />

          {/* PASSWORD WITH EYE */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <span
              className="absolute right-4 top-3 text-xl cursor-pointer text-gray-600"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-900 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            Login
          </button>
        </form>

        {/* ⭐ Forgot Password Link ✔ */}
        <p className="text-center mt-4 text-sm">
          <Link to="/admin/forgot-password" className="text-blue-600 font-semibold">
            Forgot Password?
          </Link>
        </p>

        <p className="text-center mt-2 text-sm">
          Don't have an admin account?{" "}
          <Link to="/admin/register" className="text-red-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
