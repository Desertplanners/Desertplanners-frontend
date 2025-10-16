import React from "react";
import Card from "./Card";

export default function Overview() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-[var(--color-neutral)] mb-4">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Tours" value="48" />
        <Card title="Total Bookings" value="322" />
        <Card title="Total Revenue" value="$54,800" />
        <Card title="Active Users" value="1,245" />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium text-[var(--color-neutral)] mb-3">
          Monthly Booking Overview
        </h3>
        <div className="h-48 bg-[var(--color-white)] shadow rounded-md flex items-center justify-center text-gray-400">
          [Chart Placeholder]
        </div>
      </div>
    </div>
  );
}
