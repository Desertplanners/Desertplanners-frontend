import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-b from-gray-50 to-white p-8 text-center">
      <img
        src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
        alt="Success"
        className="w-32 h-32 mb-6 animate-bounce"
      />
      <h2 className="text-3xl font-bold text-[#721011] mb-2">
        Booking Confirmed 🎉
      </h2>
      <p className="text-gray-700 mb-6">
        Thank you, {booking?.name || "Guest"}!  
        We've received your booking. You’ll get a confirmation email shortly.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-6 py-3 rounded-xl hover:scale-105 transition"
      >
        Back to Home
      </button>
    </div>
  );
}
