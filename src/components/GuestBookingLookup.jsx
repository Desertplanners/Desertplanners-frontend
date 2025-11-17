import React, { useState } from "react";
import { motion } from "framer-motion";
import DataService from "../config/DataService";
import { API } from "../config/API";

import {
  FaSearch,
  FaEnvelope,
  FaHashtag,
  FaCalendar,
  FaUser,
  FaCreditCard,
  FaMapMarkerAlt,
  FaDownload,
  FaListUl,
  FaPassport,
} from "react-icons/fa";

export default function GuestBookingLookup() {
  const api = DataService();

  const [mode, setMode] = useState("tour"); // tour | visa
  const [bookingId, setBookingId] = useState("");
  const [email, setEmail] = useState("");
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async () => {
    setError("");
    setBooking(null);

    if (!bookingId || !email) {
      setError("Please enter both Booking ID and Email.");
      return;
    }

    setLoading(true);

    try {
      let res;

      if (mode === "tour") {
        res = await api.get(API.LOOKUP_BOOKING(bookingId.trim(), email.trim()));
      } else {
        res = await api.get(
          API.LOOKUP_VISA_BOOKING(bookingId.trim(), email.trim())
        );
      }

      setBooking(res.data.booking);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to find booking. Try again!"
      );
    }

    setLoading(false);
  };

  const handleDownloadInvoice = () => {
    const url = `${API.BASE_URL}${API.INVOICE_DOWNLOAD(booking._id)}`;
    window.open(url, "_blank");
  };

  const handleDownloadVisaInvoice = () => {
    const url = `${API.BASE_URL}${API.VISA_INVOICE_DOWNLOAD(booking._id)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/50 backdrop-blur-2xl shadow-2xl rounded-3xl border border-white/30 p-10"
      >
        <motion.h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-[#e82429] to-[#721011] bg-clip-text text-transparent mb-3">
          Check Your Booking
        </motion.h1>

        <p className="text-center text-gray-600 mb-10">
          Enter your Booking ID and Email to check details.
        </p>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode("tour")}
            className={`px-5 py-2 rounded-full font-semibold ${
              mode === "tour"
                ? "bg-[#e82429] text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Tour Booking
          </button>

          <button
            onClick={() => setMode("visa")}
            className={`px-5 py-2 rounded-full font-semibold ${
              mode === "visa"
                ? "bg-[#e82429] text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            Visa Booking
          </button>
        </div>

        <div className="space-y-7">
          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2">
              <FaHashtag className="text-[#e82429]" /> Booking ID
            </label>
            <input
              type="text"
              placeholder="e.g. 67ab3f92c98d4"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/70 border"
            />
          </div>

          <div>
            <label className="text-gray-700 font-medium flex items-center gap-2">
              <FaEnvelope className="text-[#e82429]" /> Email Address
            </label>
            <input
              type="email"
              placeholder="Email used during booking"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl bg-white/70 border"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleLookup}
            className="w-full bg-gradient-to-r from-[#e82429] to-[#721011] text-white py-3 rounded-xl text-lg font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <FaSearch /> {loading ? "Searching..." : "Check Booking"}
          </motion.button>

          {error && (
            <p className="text-center text-red-600 font-semibold">{error}</p>
          )}
        </div>

        {booking && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 bg-white/70 backdrop-blur-xl border shadow-xl rounded-3xl p-8"
          >
            {/* TOUR BOOKING */}
            {mode === "tour" && (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-bold text-[#2e2e2e]">
                    Booking Summary
                  </h2>

                  <button
                    onClick={handleDownloadInvoice}
                    className="flex items-center gap-2 bg-[#e82429] hover:bg-[#721011] text-white px-4 py-2 rounded-full text-sm"
                  >
                    <FaDownload /> Download Invoice
                  </button>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaUser className="text-[#e82429]" />
                    <b>Name:</b> {booking.guestName}
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <FaEnvelope className="text-[#e82429]" />
                    <b>Email:</b> {booking.guestEmail}
                  </div>

                  <div className="flex items-center gap-2 text-gray-700">
                    <FaMapMarkerAlt className="text-[#e82429]" />
                    <b>Contact:</b> {booking.guestContact}
                  </div>
                </div>

                <hr className="my-4" />

                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <FaListUl className="text-[#e82429]" /> Tours Booked
                </h3>

                {booking.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white shadow-md border p-5 rounded-2xl mb-4"
                  >
                    <p className="text-gray-800 text-lg font-semibold mb-1">
                      {item.tourId?.title}
                    </p>

                    <p className="text-gray-600 flex items-center gap-2">
                      <FaCalendar className="text-[#e82429]" />
                      <b>Date:</b>{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </p>

                    <p className="text-gray-700 mt-1">
                      <b>Adults:</b> {item.adultCount} × AED {item.adultPrice}
                    </p>

                    <p className="text-gray-700 mt-1">
                      <b>Children:</b> {item.childCount} × AED {item.childPrice}
                    </p>
                  </motion.div>
                ))}

                <div className="mt-5">
                  <p className="font-bold text-2xl text-[#e82429]">
                    Total: AED {booking.totalPrice}
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-gray-800">
                    <FaCreditCard className="text-[#e82429]" /> <b>Payment:</b>{" "}
                    <span
                      className={
                        booking.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {booking.paymentStatus}
                    </span>
                  </p>

                  <p className="mt-1 text-gray-800">
                    <b>Status:</b>{" "}
                    <span className="capitalize text-[#721011]">
                      {booking.status}
                    </span>
                  </p>
                </div>
              </>
            )}

            {/* VISA BOOKING */}
            {mode === "visa" && (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-2xl font-bold text-[#2e2e2e]">
                    Visa Booking Summary
                  </h2>

                  <button
                    onClick={handleDownloadVisaInvoice}
                    className="flex items-center gap-2 bg-[#e82429] hover:bg-[#721011] text-white px-4 py-2 rounded-full text-sm"
                  >
                    <FaDownload /> Download Invoice
                  </button>
                </div>

                <div className="space-y-3">
                  {/* 🔥 VISA TITLE FROM Visa MODEL (POPULATED) */}
                  {booking.visaId?.title && (
                    <p>
                      <b>Visa Package:</b>{" "}
                      <span className="text-[#e82429] font-semibold">
                        {booking.visaId.title}
                      </span>
                    </p>
                  )}

                  <p>
                    <b>Name:</b> {booking.fullName}
                  </p>
                  <p>
                    <b>Email:</b> {booking.email}
                  </p>
                  <p>
                    <b>Phone:</b> {booking.phone}
                  </p>
                  <p>
                    <b>Nationality:</b> {booking.nationality}
                  </p>
                  <p>
                    <b>Passport No:</b> {booking.passportNumber}
                  </p>
                  <p>
                    <b>Visa Type:</b> {booking.visaType}
                  </p>
                  <p>
                    <b>Status:</b> {booking.status}
                  </p>

                  <hr className="my-3" />

                  <h3 className="font-bold flex items-center gap-2 text-[#e82429]">
                    <FaPassport /> Uploaded Documents
                  </h3>

                  <ul className="text-gray-700">
                    {booking.passportFront && <li>Passport Front</li>}
                    {booking.passportBack && <li>Passport Back</li>}
                    {booking.passportCover && <li>Passport Cover</li>}
                    {booking.photo && <li>Photo</li>}
                    {booking.accommodation && <li>Accommodation</li>}
                    {booking.emiratesId && <li>Emirates ID</li>}
                    {booking.extraId && <li>Extra ID</li>}
                    {booking.oldVisa && <li>Old Visa</li>}
                    {booking.flightTicket && <li>Flight Ticket</li>}
                  </ul>
                </div>
              </>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
