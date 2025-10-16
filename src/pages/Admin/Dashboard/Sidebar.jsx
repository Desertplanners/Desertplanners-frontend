import React from "react";
import {
  FaChartBar,
  FaSuitcase,
  FaUsers,
  FaMoneyBill,
  FaCalendarCheck,
  FaEnvelope,
  FaCogs,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const ITEMS = [
  { tab: "overview", label: "Dashboard", icon: <FaChartBar /> },
  { tab: "tours", label: "Tours", icon: <FaSuitcase /> },
  { tab: "bookings", label: "Bookings", icon: <FaCalendarCheck /> },
  { tab: "payments", label: "Payments", icon: <FaMoneyBill /> },
  { tab: "users", label: "Users", icon: <FaUsers /> },
  { tab: "enquiries", label: "Enquiries", icon: <FaEnvelope /> },
  { tab: "settings", label: "Settings", icon: <FaCogs /> },
];

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-[var(--color-white)] shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center justify-between p-4 border-b border-[var(--color-light-gray)]">
        <h1 className={`font-bold text-lg text-[var(--color-primary)] ${sidebarOpen ? "block" : "hidden"}`}>
          Admin Panel
        </h1>
        <button onClick={toggleSidebar} className="text-[var(--color-neutral)]">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <nav className="flex flex-col gap-2 mt-4">
        {ITEMS.map((item) => (
          <button
            key={item.tab}
            onClick={() => setActiveTab(item.tab)}
            className={`flex items-center gap-3 p-3 mx-2 rounded-md transition-all ${
              activeTab === item.tab
                ? "bg-[var(--color-primary)] text-[var(--color-white)]"
                : "text-[var(--color-neutral)] hover:bg-[var(--color-light-gray)]"
            }`}
          >
            {item.icon}
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
