import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function HolidayBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      const api = DataService("admin");
      const res = await api.get(API.GET_ALL_HOLIDAY_BOOKINGS);

      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Error loading holiday bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const text = `
      ${b.guestName}
      ${b.guestEmail}
      ${b.packageTitle}
      ${b.status}
      ${b.totalPrice}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#fef6f6] to-[#fdfdfd]">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-extrabold text-[#721011]">
          🏝 Holiday Bookings
        </h2>

        <input
          type="text"
          placeholder="Search bookings..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-full w-full md:w-80"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-10 h-10 text-[#e82429] animate-spin" />
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center text-lg py-10">
          No Holiday bookings found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white">
              <tr>
                <th className="p-4 text-left">#</th>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Package</th>
                <th className="p-4 text-left">Travel Date</th>
                <th className="p-4 text-left">Guests</th>
                <th className="p-4 text-left">Total</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((b, index) => {
                const bookingDate = new Date(b.createdAt).toLocaleDateString(
                  "en-GB",
                  { day: "2-digit", month: "short", year: "numeric" }
                );

                return (
                  <motion.tr
                    key={b._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b hover:bg-[#fdf1f1]"
                  >
                    <td className="p-4">{index + 1}</td>

                    <td className="p-4 font-semibold">{b.guestName}</td>

                    <td className="p-4 text-gray-500">{b.guestEmail}</td>

                    <td className="p-4">{b.packageTitle}</td>

                    <td className="p-4">
                      {new Date(b.travelDate).toLocaleDateString("en-GB")}
                    </td>

                    <td className="p-4">
                      {b.adults} Adult
                      {b.children > 0 && `, ${b.children} Child`}
                    </td>

                    <td className="p-4 font-bold text-[#721011]">
                      AED {b.totalPrice}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          b.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="p-4">{bookingDate}</td>
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
