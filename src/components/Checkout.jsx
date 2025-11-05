import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import {
  FaCalendarAlt,
  FaUser,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = location.state?.cart || [];

  // 🧠 Logged-in user (if any)
  const user = JSON.parse(localStorage.getItem("userInfo") || "{}");
  const token = user?.token || localStorage.getItem("token");

  const [form, setForm] = useState({
    guestName: user?.name || "",
    guestEmail: user?.email || "",
    guestContact: user?.phone || "",
    pickupPoint: "",
    dropPoint: "",
    specialRequest: "",
  });

  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.tourId?.price || 0) * (item.guests || 1),
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.guestName ||
      !form.guestEmail ||
      !form.pickupPoint ||
      !form.dropPoint
    ) {
      toast.error("⚠️ Please fill all required fields!");
      return;
    }

    setLoading(true);
    try {
      const api = DataService();

      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const bookingData = {
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestContact: form.guestContact,
        pickupPoint: form.pickupPoint,
        dropPoint: form.dropPoint,
        specialRequest: form.specialRequest,
        totalPrice,
        items: cart.map((item) => ({
          tourId: item.tourId?._id || item.tourId,
          date: item.date,
          guests: item.guests,
          pickupPoint: form.pickupPoint,
          dropPoint: form.dropPoint,
        })),
      };

      const res = await api.post(API.CREATE_BOOKING, bookingData, { headers });

      if (res.data?.success) {
        toast.success("🎉 Booking confirmed successfully!");
        navigate("/booking-success", { state: { booking: res.data.booking } });
      } else {
        toast.error(res.data.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Booking Error:", err);
      toast.error(
        err.response?.data?.message || "Something went wrong while booking."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-12 p-8 bg-gradient-to-br from-[#ffffff] via-[#f9f7ff] to-[#fff1f3] rounded-3xl shadow-2xl">
      {/* 🏖️ Heading */}
      <h2 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-[#8000ff] to-[#e5006e] text-transparent bg-clip-text drop-shadow-lg">
        Checkout & Confirm Your Booking
      </h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* 🧾 Booking Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
          <h3 className="text-2xl font-semibold mb-5 text-[#721011] flex items-center gap-2">
            <FaCalendarAlt className="text-[#e82429]" /> Booking Summary
          </h3>

          {cart.length > 0 ? (
            <div className="space-y-5">
              {cart.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-5 border-b pb-4 border-gray-200 hover:bg-gray-50 rounded-xl transition-all p-2"
                >
                  <img
                    src={
                      item.tourId?.mainImage
                        ? `https://desetplanner-backend.onrender.com/${item.tourId.mainImage}`
                        : "https://cdn-icons-png.flaticon.com/512/854/854878.png"
                    }
                    alt={item.tourId?.title}
                    className="w-28 h-24 object-cover rounded-2xl shadow"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">
                      {item.tourId?.title}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      <FaCalendarAlt className="inline text-[#e82429] mr-1" />
                      {item.date
                        ? new Date(item.date).toDateString()
                        : "Not selected"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Guests: {item.guests}
                    </p>
                    <p className="text-[#e82429] font-bold">
                      AED {(item.tourId?.price || 0) * (item.guests || 1)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="flex justify-between pt-4 border-t border-gray-200 text-lg">
                <span className="font-bold text-gray-800">Total Price:</span>
                <span className="font-bold text-[#e82429]">
                  AED {totalPrice}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-10">No items in cart 🛒</p>
          )}
        </div>

        {/* 🧍 Traveler Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
          <h3 className="text-2xl font-semibold mb-5 text-[#721011] flex items-center gap-2">
            <FaUser className="text-[#e82429]" /> Traveler Information
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                name="guestName"
                value={form.guestName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full pl-10 border p-3 rounded-xl focus:ring-2 focus:ring-[#e82429] outline-none"
                required
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="guestEmail"
                value={form.guestEmail}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full pl-10 border p-3 rounded-xl focus:ring-2 focus:ring-[#e82429] outline-none"
                required
              />
            </div>

            <div className="relative">
              <FaPhoneAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                name="guestContact"
                value={form.guestContact}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full pl-10 border p-3 rounded-xl focus:ring-2 focus:ring-[#e82429] outline-none"
                required
              />
            </div>

            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                name="pickupPoint"
                value={form.pickupPoint}
                onChange={handleChange}
                placeholder="Pickup Point"
                className="w-full pl-10 border p-3 rounded-xl focus:ring-2 focus:ring-[#e82429] outline-none"
                required
              />
            </div>

            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                name="dropPoint"
                value={form.dropPoint}
                onChange={handleChange}
                placeholder="Drop Point"
                className="w-full pl-10 border p-3 rounded-xl focus:ring-2 focus:ring-[#e82429] outline-none"
                required
              />
            </div>

            <textarea
              name="specialRequest"
              value={form.specialRequest}
              onChange={handleChange}
              placeholder="Special Request (Optional)"
              className="w-full border p-3 rounded-xl h-24 focus:ring-2 focus:ring-[#e82429] outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#e82429] to-[#721011] text-white py-3 rounded-xl font-semibold text-lg hover:scale-[1.03] transition-transform"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
