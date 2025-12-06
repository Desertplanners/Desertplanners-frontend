import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function VisaSuccess() {
  const navigate = useNavigate();
  const search = new URLSearchParams(window.location.search);

  const bookingId = search.get("bookingId");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // -------------------------------
  // Fetch visa booking
  // -------------------------------
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

  // -------------------------------
  // FIRE PURCHASE EVENT (GA4 + META)
  // -------------------------------
  useEffect(() => {
    if (!booking) return;

    // prevent multiple firing
    if (window.__visaPurchaseFired) return;
    window.__visaPurchaseFired = true;

    // GA4 Purchase
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "purchase",
      item_type: "visa",
    
      transaction_id: booking._id,
      value: Number(booking.finalAmount),
      currency: "AED",
    
      tax: Number(booking.transactionFee || 0),
      shipping: 0, // Visa me no shipping
    
      items: [
        {
          item_id: booking.visaId,
          item_name: booking.visaTitle,
          item_category: "Visa",
          price: Number(booking.basePrice),
          quantity: 1,
        },
      ],
    
      // extra context (optional but good)
      visa_id: booking.visaId,
      visa_name: booking.visaTitle,
      processing_time: booking.processingTime,
      transaction_fee: booking.transactionFee,
    
      applicant: {
        name: booking.fullName,
        email: booking.email,
        phone: booking.phone,
      },
    });

    console.log("📡 DATA LAYER — purchase (visa) fired");

    // META Purchase
    if (typeof fbq === "function") {
      fbq("track", "Purchase", {
        value: booking.finalAmount,
        currency: "AED",
        contents: [
          {
            id: booking.visaId,
            quantity: 1,
          },
        ],
        content_type: "visa",
      });

      console.log("🔥 META — Purchase (visa) fired");
    }
  }, [booking]);

  // -------------------------------
  // UI Handling
  // -------------------------------
  if (loading)
    return <div className="p-10 text-center text-lg">Loading...</div>;

  if (!booking)
    return (
      <div className="p-10 text-center text-red-600 text-lg">
        Visa Booking not found ❌
      </div>
    );

  // Format number
  const format = (n) =>
    Number(n || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white mt-8 shadow-xl rounded-2xl border border-gray-200">
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
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-3 text-[#721011]">
          Visa Booking Details
        </h3>

        <div className="grid grid-cols-2 gap-3 text-gray-800">
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
            <b>Visa Type:</b> {booking.visaTitle}
          </p>
          <p>
            <b>Processing:</b> {booking.processingTime}
          </p>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-3 text-[#721011]">
          Payment Summary
        </h3>

        <div className="bg-gray-50 p-5 rounded-xl border">
          <div className="flex justify-between text-gray-700 mb-2">
            <span>Base Price</span>
            <span className="font-semibold">
              AED {format(booking.basePrice)}
            </span>
          </div>

          <div className="flex justify-between text-gray-700 mb-2">
            <span>Transaction Fee (3.75%)</span>
            <span className="font-semibold">
              AED {format(booking.transactionFee)}
            </span>
          </div>

          <div className="flex justify-between mt-3 pt-3 border-t text-lg">
            <span className="font-bold">Total Paid</span>
            <span className="font-bold text-[#e82429]">
              AED {format(booking.finalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-3 text-[#721011]">
          Applicant Information
        </h3>

        <div className="text-gray-800 space-y-1">
          <p>
            <b>Name:</b> {booking.fullName}
          </p>
          <p>
            <b>Email:</b> {booking.email}
          </p>
          <p>
            <b>Phone:</b> {booking.phone}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="text-center mt-10 flex justify-center gap-4 flex-wrap">
        <a
          href={`${import.meta.env.VITE_API_URL}/api/visa-bookings/invoice/${
            booking._id
          }`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-md"
        >
          Download Invoice
        </a>

        <button
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-[#721011] to-[#e82429] text-white px-6 py-3 rounded-xl hover:scale-105 transition shadow-md"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}
