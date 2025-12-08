import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DataService from "../../config/DataService";
import { API } from "../../config/API";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const api = DataService(); // ⭐ MUST USE THIS

      await api.post(API.ADMIN_RESET_PASSWORD(token), {
        password,
      });

      setMessage("Password updated successfully! Redirecting...");
      setTimeout(() => navigate("/admin/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f6f9] px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-gray-200 animate-fadeIn">
        
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src="https://desertplanners.net/desertplanners_logo.png"
            alt="Desert Planners"
            className="w-20 mx-auto mb-3"
          />
          <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter a new password for your admin account.
          </p>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center mb-4 p-3 rounded-lg text-sm font-medium border ${
              message.includes("successfully")
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* New Password */}
          <div>
            <label className="text-gray-700 font-medium text-sm">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                required
              />
              <span
                className="absolute right-4 top-3 text-xl text-gray-500 cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Button */}
          <button
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all"
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>

      {/* Animation */}
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
