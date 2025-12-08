import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../config/API";

export default function AdminResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(API.ADMIN_RESET_PASSWORD(token), {
        password,
      });

      setMessage("Password updated successfully!");

      setTimeout(() => {
        navigate("/admin/login");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Reset Admin Password
        </h2>

        {message && (
          <p className="mb-4 text-center text-blue-600 font-semibold">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">New Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded mb-4"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
