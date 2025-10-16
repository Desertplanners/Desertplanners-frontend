import React, { useState } from "react";
import Sidebar from "./Sidebar";

// Import all sections
import Overview from "./Overview";
import ToursManagement from "./ToursManagement";
import Bookings from "./Bookings";
import Payments from "./Payments";
import Users from "./Users";
import Enquiries from "./Enquiries";
import Settings from "./Settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const TABS = {
    overview: Overview,
    tours: ToursManagement,
    bookings: Bookings,
    payments: Payments,
    users: Users,
    enquiries: Enquiries,
    settings: Settings,
  };

  const ActiveComponent = TABS[activeTab];

  return (
    <div className="flex h-screen bg-[var(--color-light-gray)]">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <ActiveComponent />
      </div>
    </div>
  );
}
