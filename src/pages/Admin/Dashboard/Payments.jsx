import React, { useEffect, useState } from "react";
import Section from "../Dashboard/Section";
import { API } from "../../../config/API";

export default function Payments() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}${API.GET_ALL_PAYMENTS}`
      );

      const data = await res.json();
      if (data.success) {
        setPayments(data.payments);
      }

      setLoading(false);
    } catch (err) {
      console.error("Payment Fetch Error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Section title="Payments & Transactions">
      <div className="bg-white shadow-md rounded-xl p-6">

        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading payments...</p>
        ) : payments.length === 0 ? (
          <p className="text-center py-10 text-gray-400">No payments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f5f5f5] text-left text-gray-600 text-sm">
                  <th className="p-3 border">Payment ID</th>
                  <th className="p-3 border">Customer</th>
                  <th className="p-3 border">Amount</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="text-sm border-b hover:bg-gray-50">

                    <td className="p-3">{p._id}</td>

                    <td className="p-3">
                      {p.bookingId?.guestName || "N/A"}
                      <br />
                      <span className="text-xs text-gray-500">
                        {p.bookingId?.guestEmail}
                      </span>
                    </td>

                    <td className="p-3 font-bold text-[#e82429]">
                      AED {p.amount}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          p.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : p.status === "failed"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      <a
                        href={`/admin?tab=bookings&id=${p.bookingId?._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Booking
                      </a>  
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Section>
  );
}
