import React, { useEffect, useState } from "react";
import Card from "./Card";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { Loader2 } from "lucide-react";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const adminToken = localStorage.getItem("adminToken");

  const fetchOverview = async () => {
    try {
      const api = DataService("admin"); // token auto add
      
      const res = await api.get(API.ADMIN_OVERVIEW); // ❗ remove headers part
  
      setStats(res.data);
    } catch (err) {
      console.log("ERROR:", err);
      setError(err.response?.data?.message || "Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };
    

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin w-8 h-8 text-[#e82429]" />
      </div>
    );

  if (error)
    return <p className="text-red-500 text-center mt-6">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-[#404041] mb-4">
        Dashboard Overview
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Tours" value={stats.totalTours} />
        <Card title="Total Bookings" value={stats.totalBookings} />
        <Card
          title="Total Revenue"
          value={`AED ${stats.totalRevenue.toLocaleString()}`}
        />
        <Card title="Active Users" value={stats.activeUsers} />
      </div>

      {/* Chart Section */}
      <div className="mt-8 bg-white shadow-lg rounded-xl p-6">
        <h3 className="text-xl font-medium text-[#404041] mb-4">
          Monthly Booking Overview
        </h3>
        {stats.monthlyStats?.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f3f3" />
              <XAxis dataKey="month" stroke="#404041" />
              <YAxis allowDecimals={false} stroke="#404041" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#e82429"
                strokeWidth={3}
                dot={{ fill: "#721011" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-10">
            No booking data available.
          </p>
        )}
      </div>
    </div>
  );
}
