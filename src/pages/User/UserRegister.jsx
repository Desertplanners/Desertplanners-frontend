import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import DataService from "../../config/DataService";
import { API } from "../../config/API";

// ⚡ Import PhoneInput Component
import PhoneInput from "../../components/PhoneInput";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+971",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ---------------------- SUBMIT --------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const fullPhone = formData.countryCode + formData.mobile;

    if (fullPhone.length < 8) {
      setError("Please enter a valid mobile number");
      return;
    }

    setLoading(true);

    try {
      const api = DataService();

      await api.post(API.USER_REGISTER, {
        name: formData.name,
        email: formData.email.toLowerCase(),
        mobile: fullPhone,
        password: formData.password,
      });

      toast.success("Registration successful! Please sign in.", {
        duration: 4000,
        style: {
          background: "#4BB543",
          color: "#fff",
          fontWeight: "600",
        },
      });

      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);

      toast.error(msg, {
        duration: 4000,
        style: {
          background: "#ff4d4d",
          color: "#fff",
          fontWeight: "600",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------- UI --------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#f0f4f8] to-[#d9e2ec]">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

          {/* Name */}
          <div className="relative">
            <input
              type="text"
              name="name"
              required
              autoComplete="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-3 
                focus:outline-none focus:ring-2 focus:ring-[#e82429] shadow-sm"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm 
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-base transition-all">
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-5 pb-3 
                focus:outline-none focus:ring-2 focus:ring-[#e82429] shadow-sm"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-gray-500 text-sm 
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-base transition-all">
              Email Address
            </label>
          </div>

          {/* PhoneInput Component */}
          <PhoneInput
            value={formData.countryCode + formData.mobile}
            onChange={(phone, meta) => {
              if (!meta || !meta.countryCallingCode) return; // Safe guard

              const dial = "+" + meta.countryCallingCode;
              const local = phone.replace(dial, "");

              setFormData({
                ...formData,
                countryCode: dial,
                mobile: local,
              });
            }}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 
                focus:outline-none focus:ring-2 focus:ring-[#e82429] shadow-sm"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 
                focus:outline-none focus:ring-2 focus:ring-[#e82429] shadow-sm"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white py-3 
              rounded-xl font-bold shadow-lg hover:scale-105 transition-transform"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            className="text-[#e82429] cursor-pointer font-semibold"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
