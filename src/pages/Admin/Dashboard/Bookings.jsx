// src/pages/admin/AdminBookings.jsx
import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const api = DataService("admin");
      const res = await api.get(API.GET_ALL_BOOKINGS);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error loading bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#fef6f6] to-[#fdfdfd]">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold mb-8 tracking-tight text-[#721011]"
      >
        🧾 All Bookings
      </motion.h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-10 h-10 text-[#e82429] animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-[#404041] text-lg py-10">
          No bookings found.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-[#eaeaea]">
          <table className="min-w-full border-collapse">
            <thead className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white">
              <tr>
                <th className="p-4 text-left font-semibold">#</th>
                <th className="p-4 text-left font-semibold">Customer</th>
                <th className="p-4 text-left font-semibold">Email</th>
                <th className="p-4 text-left font-semibold">Tour</th>
                <th className="p-4 text-left font-semibold">Guests</th>
                <th className="p-4 text-left font-semibold">Total</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b, index) => {
                const userName = b.user?.name || b.guestName || "Guest";
                const userEmail = b.user?.email || b.guestEmail || "—";
                const tourTitle = b.items[0]?.tourId?.title || "—";

                const firstItem = b.items[0];
                const adultCount = Number(firstItem?.adultCount || 0);
                const childCount = Number(firstItem?.childCount || 0);

                const guests =
                  adultCount > 0 || childCount > 0
                    ? `${adultCount} Adult${adultCount > 1 ? "s" : ""}${
                        childCount > 0
                          ? `, ${childCount} Child${childCount > 1 ? "ren" : ""}`
                          : ""
                      }`
                    : "0";

                const bookingDate = new Date(b.createdAt).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                );

                return (
                  <motion.tr
                    key={b._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-[#fdf1f1] transition-all duration-200"
                  >
                    <td className="p-4 text-sm font-medium text-[#404041]">
                      {index + 1}
                    </td>

                    <td className="p-4 text-sm text-[#404041] font-semibold">
                      {userName}
                      <div className="text-xs text-gray-500">
                        {b.user ? "Registered User" : "Guest Booking"}
                      </div>
                    </td>

                    <td className="p-4 text-sm text-gray-500">{userEmail}</td>

                    <td className="p-4 text-sm text-[#404041]">
                      {tourTitle}
                      {b.items.length > 1 && (
                        <span className="text-gray-400 text-xs ml-1">
                          (+{b.items.length - 1} more)
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-sm text-[#404041]">{guests}</td>

                    <td className="p-4 text-sm font-semibold text-[#721011]">
                      AED {b.totalPrice}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "cancelled"
                            ? "bg-[#ffe0e0] text-[#e82429]"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>

                    {/* UPDATED DATE COLUMN */}
                    <td className="p-4 text-sm text-[#404041]">
                      {bookingDate}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
