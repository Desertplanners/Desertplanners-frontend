import React, { useEffect, useState } from "react";

export default function HolidayBookingSuccess() {

  const search = new URLSearchParams(window.location.search);
  const bookingId = search.get("bookingId");

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!bookingId) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/holiday-bookings/${bookingId}`)
      .then((res) => res.json())
      .then((data) => {
        setBooking(data.booking);
        setLoading(false);
      })
      .catch(() => setLoading(false));

  }, [bookingId]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!booking) {
    return <div className="p-10 text-center text-red-600">Booking not found</div>;
  }

  const isPaid = booking.paymentStatus === "Paid";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-8 shadow-lg rounded-xl border">

      <div className="text-center">

        <h2 className="text-3xl font-bold text-[#721011]">
          {isPaid ? "Holiday Booking Confirmed 🎉" : "Booking Pending"}
        </h2>

        <p className="text-gray-600 mt-2">
          Booking ID: {booking._id}
        </p>

      </div>

      <div className="mt-6 border-t pt-4">

        <h3 className="text-xl font-semibold text-[#721011] mb-3">
          Booking Details
        </h3>

        <p><b>Package:</b> {booking.packageTitle}</p>
        <p><b>Travel Date:</b> {new Date(booking.travelDate).toLocaleDateString()}</p>
        <p><b>Adults:</b> {booking.adults}</p>
        <p><b>Children:</b> {booking.children}</p>

        <p className="mt-3">
          <b>Total Price:</b>
          <span className="text-[#e82429] font-bold ml-2">
            AED {booking.totalPrice}
          </span>
        </p>

      </div>

      <div className="mt-6 border-t pt-4">

        <h3 className="text-xl font-semibold text-[#721011] mb-3">
          Customer Info
        </h3>

        <p><b>Name:</b> {booking.guestName}</p>
        <p><b>Email:</b> {booking.guestEmail}</p>
        <p><b>Phone:</b> {booking.guestContact}</p>

      </div>

    </div>
  );
}