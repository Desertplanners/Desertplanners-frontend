// src/pages/admin/AdminBookings.jsx
import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  // ✅ Fetch all bookings (admin)
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

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);
      const api = DataService("admin");
      await api.put(API.UPDATE_BOOKING_STATUS(id), { status });
      fetchBookings(); // refresh after update
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdating(null);
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
                <th className="p-4 text-left font-semibold">Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b, index) => {
                const userName = b.user?.name || b.guestName || "Guest";
                const userEmail = b.user?.email || b.guestEmail || "—";
                const contact = b.guestContact || b.user?.phone || "—";
                const tourTitle = b.items[0]?.tourId?.title || "—";
                const guests = b.items[0]?.guests || "-";

                return (
                  <motion.tr
                    key={b._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-[#fdf1f1] transition-all duration-200"
                  >
                    {/* ✅ Serial number */}
                    <td className="p-4 text-sm font-medium text-[#404041]">
                      {index + 1}
                    </td>

                    {/* ✅ Customer Name */}
                    <td className="p-4 text-sm text-[#404041] font-semibold">
                      {userName}
                      <div className="text-xs text-gray-500">
                        {b.user ? "Registered User" : "Guest Booking"}
                      </div>
                    </td>

                    {/* ✅ Email */}
                    <td className="p-4 text-sm text-gray-500">{userEmail}</td>

                    {/* ✅ Tour details */}
                    <td className="p-4 text-sm text-[#404041]">
                      {tourTitle}
                      {b.items.length > 1 && (
                        <span className="text-gray-400 text-xs ml-1">
                          (+{b.items.length - 1} more)
                        </span>
                      )}
                    </td>

                    {/* ✅ Guests */}
                    <td className="p-4 text-sm text-[#404041]">{guests}</td>

                    {/* ✅ Total */}
                    <td className="p-4 text-sm font-semibold text-[#721011]">
                      AED {b.totalPrice}
                    </td>

                    {/* ✅ Status */}
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

                    {/* ✅ Action Buttons */}
                    <td className="p-4 flex gap-3">
                      <button
                        onClick={() => updateStatus(b._id, "confirmed")}
                        disabled={updating === b._id}
                        className="flex items-center gap-1 bg-[#404041] hover:bg-[#721011] text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 disabled:opacity-50"
                      >
                        {updating === b._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Confirm
                      </button>

                      <button
                        onClick={() => updateStatus(b._id, "cancelled")}
                        disabled={updating === b._id}
                        className="flex items-center gap-1 bg-[#e82429] hover:bg-[#721011] text-white px-3 py-1.5 rounded-lg text-sm transition-all duration-200 disabled:opacity-50"
                      >
                        {updating === b._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        Cancel
                      </button>
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
