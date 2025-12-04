import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const search = new URLSearchParams(window.location.search);

  // bookingId from URL
  const bookingId = search.get("bookingId") || search.get("id");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------------
  // 1️⃣ FETCH BOOKING DETAILS
  // -------------------------------------
  useEffect(() => {
    if (!bookingId) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        setBooking(data.booking);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookingId]);

  // -------------------------------------
  // 2️⃣ FIRE META PURCHASE EVENT
  // -------------------------------------
  useEffect(() => {
    if (!booking) return;

    if (typeof fbq === "function") {
      fbq("track", "Purchase", {
        value: booking.totalPrice,
        currency: "AED",
        contents: booking.items.map((item) => ({
          id: item.tourId?._id,
          quantity: item.adultCount + item.childCount,
        })),
        content_ids: booking.items.map((item) => item.tourId?._id),
        content_type: "product",
      });

      console.log("🔥 Meta Purchase Event Fired!");
    }
  }, [booking]);

  // -------------------------------------
  // LOADING / ERROR UI
  // -------------------------------------
  if (loading) {
    return <div className="p-10 text-center text-lg">Loading...</div>;
  }

  if (!booking) {
    return (
      <div className="p-10 text-center text-red-600 text-lg">
        Booking not found ❌
      </div>
    );
  }

  // -------------------------------------
  // 3️⃣ MAIN UI
  // -------------------------------------
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-8 shadow-lg rounded-xl border">
      <div className="text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/845/845646.png"
          alt="Success"
          className="w-24 h-24 mx-auto mb-4 animate-bounce"
        />
        <h2 className="text-3xl font-bold text-[#721011] mb-2">
          Booking Confirmed 🎉
        </h2>
        <p className="text-gray-600">
          Your payment has been received successfully.
        </p>
      </div>

      {/* Booking Info */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2 text-[#721011]">
          Booking Details
        </h3>

        <div className="grid grid-cols-2 gap-3 text-gray-700">
          <p>
            <b>Booking ID:</b> {booking._id}
          </p>
          <p>
            <b>Status:</b>{" "}
            <span className="text-green-600 font-semibold">
              {booking.status}
            </span>
          </p>
          <p>
            <b>Payment:</b>{" "}
            <span className="text-green-600 font-semibold">
              {booking.paymentStatus}
            </span>
          </p>
          <p>
            <b>Subtotal:</b>{" "}
            <span className="font-semibold">AED {booking.subtotal}</span>
          </p>
          <p>
            <b>Transaction Fee:</b>{" "}
            <span className="font-semibold">AED {booking.transactionFee}</span>
          </p>
          <p>
            <b>Total Amount:</b>{" "}
            <span className="text-[#e82429] font-bold">
              AED {booking.totalPrice}
            </span>
          </p>
        </div>
      </div>

      {/* User Details */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold mb-2 text-[#721011]">
          Customer Information
        </h3>

        <div className="text-gray-700">
          <p>
            <b>Name:</b> {booking.guestName || booking.userName}
          </p>
          <p>
            <b>Email:</b> {booking.guestEmail || booking.userEmail}
          </p>
          <p>
            <b>Contact:</b> {booking.guestContact || "---"}
          </p>

          <p>
            <b>Pickup:</b> {booking.pickupPoint || "N/A"}
          </p>
          <p>
            <b>Drop:</b> {booking.dropPoint || "N/A"}
          </p>

          <p>
            <b>Special Request:</b> {booking.specialRequest || "None"}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-xl font-semibold mb-4 text-[#721011]">
          Tour Summary
        </h3>

        {booking.items.map((item, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg mb-3 bg-gray-50 shadow-sm"
          >
            <p>
              <b>Tour:</b> {item.tourId?.title}
            </p>
            <p>
              <b>Date:</b>{" "}
              {new Date(item.date).toLocaleDateString("en-GB")}
            </p>
            <p>
              <b>Adults:</b> {item.adultCount} × {item.adultPrice}
            </p>
            <p>
              <b>Children:</b> {item.childCount} × {item.childPrice}
            </p>
            <p>
              <b>Tour Total:</b>{" "}
              <b className="text-[#e82429]">
                AED{" "}
                {item.adultCount * item.adultPrice +
                  item.childCount * item.childPrice}
              </b>
            </p>
          </div>
        ))}
      </div>

      {/* Invoice */}
      <div className="text-center mt-8">
        <button
          onClick={() =>
            window.open(
              `${import.meta.env.VITE_API_URL}/api/bookings/invoice/${booking._id}`,
              "_blank"
            )
          }
          className="bg-gradient-to-r from-[#721011] to-[#e82429] text-white px-6 py-3 rounded-xl mr-3 hover:scale-105 transition"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
}
