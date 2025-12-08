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
      const api = DataService("admin");
      const res = await api.post(API.ADMIN_LOGIN, { email, password });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-200 animate-fadeIn">
        
        {/* Logo + Heading */}
        <div className="text-center mb-6">
          <img
            src="https://desertplanners.net/desertplanners_logo.png"
            className="w-20 mx-auto mb-2"
            alt="logo"
          />
          <h2 className="text-3xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-gray-500 text-sm">Access your admin dashboard</p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-600 text-center bg-red-100 p-2 rounded-lg mb-4 border border-red-200">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Password</label>
            <div className="relative mt-1">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                required
              />
              <span
                className="absolute right-4 top-3 text-xl cursor-pointer text-gray-500"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition shadow-md"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <div className="text-center mt-5">
          <Link
            to="/admin/forgot-password"
            className="text-red-600 text-sm font-medium hover:underline"
          >
            Forgot Password?
          </Link>

          <p className="text-gray-600 text-sm mt-3">
            Don’t have an account?{" "}
            <Link to="/admin/register" className="text-red-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* Fade Animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn .5s ease-out;
          }
        `}
      </style>
    </div>
  );
}
