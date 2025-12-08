import { useState } from "react";
import DataService from "../../config/DataService";
import { API } from "../../config/API";
import { Link } from "react-router-dom";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const api = DataService();
      const res = await api.post(API.ADMIN_FORGOT_PASSWORD, { email });

      setMessage("Reset link sent to your email! ✔");
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong, try again!"
      );
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
            alt="logo"
            className="w-20 mx-auto mb-3"
          />
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your admin email to receive reset instructions.
          </p>
        </div>

        {/* Message */}
        {message && (
          <p className="text-center mb-4 p-3 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            {message}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-gray-700 font-medium text-sm">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="youremail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* Back to login */}
        <p className="text-center mt-5 text-gray-600 text-sm">
          Remember your password?{" "}
          <Link
            to="/admin/login"
            className="text-red-600 font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>
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
