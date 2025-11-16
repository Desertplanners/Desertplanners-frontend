import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VisaSuccess() {
  const navigate = useNavigate();
  const search = new URLSearchParams(window.location.search);

  const bookingId = search.get("bookingId");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch visa booking
  useEffect(() => {
    if (!bookingId) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/visa-bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Visa fetch error:", err);
        setLoading(false);
      });
  }, [bookingId]);

  if (loading)
    return <div className="p-10 text-center text-lg">Loading...</div>;

  if (!booking)
    return (
      <div className="p-10 text-center text-red-600 text-lg">
        Visa Booking not found ❌
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-8 shadow-lg rounded-xl border">
      <div className="text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Success"
          className="w-24 h-24 mx-auto mb-4 animate-bounce"
        />
        <h2 className="text-3xl font-bold text-[#721011] mb-2">
          Visa Application Submitted 🎉
        </h2>
        <p className="text-gray-600">
          Your payment has been received successfully.
        </p>
      </div>

      {/* Booking Details */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2 text-[#721011]">
          Visa Booking Details
        </h3>

        <div className="grid grid-cols-2 gap-3 text-gray-700">
          <p><b>Booking ID:</b> {booking._id}</p>
          <p><b>Status:</b> <span className="text-green-600">{booking.status}</span></p>
          <p><b>Total Amount:</b> <span className="text-[#e82429] font-bold">AED {booking.totalPrice}</span></p>
          <p><b>Visa Type:</b> {booking.visaTitle}</p>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2 text-[#721011]">Applicant Information</h3>

        <div className="text-gray-700">
          <p><b>Name:</b> {booking.fullName}</p>
          <p><b>Email:</b> {booking.email}</p>
          <p><b>Phone:</b> {booking.phone}</p>
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-[#721011] to-[#e82429] text-white px-6 py-3 rounded-xl hover:scale-105 transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
