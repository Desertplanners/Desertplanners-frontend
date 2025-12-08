import { useState } from "react";
import DataService from "../../config/DataService";
import { API } from "../../config/API";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ⭐ Use DataService — ensures correct BASE_URL (localhost:5000)
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Admin Forgot Password
        </h2>

        {message && (
          <p className="mb-4 text-center text-blue-600 font-semibold">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Email Address</label>
          <input
            type="email"
            className="w-full p-3 border rounded mb-4"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
