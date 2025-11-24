import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";

export default function VisaBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // ⭐ NEW SEARCH

  const api = DataService("admin");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(API.GET_ALL_VISA_BOOKINGS);
        setList(res.data);
      } catch (err) {
        console.error("❌ Visa bookings error:", err);
        setList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ⭐ SEARCH FILTER
  const filteredList = list.filter((b) => {
    const text = `
      ${b.fullName}
      ${b.email}
      ${b.phone}
      ${b.visaTitle}
      ${b.visaType}
      ${b.status}
      ${b.totalPrice}
      ${new Date(b.createdAt).toLocaleDateString()}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  if (loading)
    return <div className="text-center p-10">Loading visa bookings...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      
      {/* HEADER WITH RIGHT-SIDE SEARCH BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-[#721011]">
          Visa Bookings
        </h2>

        {/* ⭐ PREMIUM SEARCH BAR */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search visa bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full px-12 py-2
              rounded-full
              bg-white/70 backdrop-blur-md
              border border-gray-300
              shadow-md
              hover:shadow-lg
              focus:ring-2 focus:ring-red-500
              outline-none
              transition-all duration-300
            "
          />

          {/* Left Icon */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
            🔍
          </span>

          {/* Clear Button */}
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-600 transition text-lg"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      {filteredList.length === 0 ? (
        <p className="text-gray-500 text-center">No matching visa bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-xl">
            <thead className="bg-[#721011] text-white">
              <tr>
                <th className="p-3 text-left">Applicant</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Visa Type</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredList.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{b.fullName}</td>
                  <td className="p-3">{b.email}</td>
                  <td className="p-3">{b.phone}</td>

                  <td className="p-3">{b.visaTitle || b.visaType || "---"}</td>

                  <td className="p-3 font-semibold text-[#e82429]">
                    AED {b.totalPrice || 0}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        b.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : b.status === "processing"
                          ? "bg-blue-100 text-blue-700"
                          : b.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
