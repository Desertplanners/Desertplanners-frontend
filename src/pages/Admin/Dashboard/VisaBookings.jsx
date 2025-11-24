import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { FaFilePdf } from "react-icons/fa";

export default function VisaBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return <div className="text-center p-10">Loading visa bookings...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-[#721011] mb-6">
        Visa Bookings
      </h2>

      {list.length === 0 ? (
        <p className="text-gray-500 text-center">No visa bookings found.</p>
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
              {list.map((b) => (
                <tr key={b._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{b.fullName}</td>
                  <td className="p-3">{b.email}</td>
                  <td className="p-3">{b.phone}</td>

                  {/* ⭐ UPDATED → Show Visa Package Title */}
                  <td className="p-3">
                    {b.visaTitle || b.visaType || "---"}
                  </td>

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
