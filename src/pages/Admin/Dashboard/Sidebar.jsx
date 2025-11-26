import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Plane,
  Grid,
  CalendarCheck,
  CreditCard,
  Users,
  Mail,
  Settings,
  Menu,
  X,
  Layers,
  FileSpreadsheet,
  ImageIcon,
  Search,
} from "lucide-react";

const ITEMS = [
  { tab: "overview", label: "Dashboard", icon: <LayoutDashboard size={18} /> },

  // Tours Section
  { tab: "tours", label: "Tours", icon: <Briefcase size={18} /> },

  // Visa Section
  { tab: "visa", label: "Visa", icon: <Plane size={18} /> },

  // Holiday
  { tab: "holidayManagement", label: "Holiday Tours", icon: <Briefcase size={18} /> },

  // Visa Categories
  { tab: "visaCategory", label: "Visa Categories", icon: <FileSpreadsheet size={18} /> },

  // Holiday categories
  { tab: "holidayCategory", label: "Holiday Categories", icon: <Grid size={18} /> },

  // Tour Categories
  { tab: "category", label: "Tour Categories", icon: <Grid size={18} /> },

  // Home Section Editor
  { tab: "sections", label: "Sections", icon: <Layers size={18} /> },

  // Bookings
  { tab: "bookings", label: "Tour Bookings", icon: <CalendarCheck size={18} /> },

  // Visa Bookings
  { tab: "visaBookings", label: "Visa Bookings", icon: <CalendarCheck size={18} /> },

  // Payments
  { tab: "payments", label: "Payments", icon: <CreditCard size={18} /> },

  // Users
  { tab: "users", label: "Users", icon: <Users size={18} /> },

  // Enquiries
  { tab: "enquiries", label: "Enquiries", icon: <Mail size={18} /> },

  // Banners
  { tab: "banner", label: "Banners", icon: <ImageIcon size={18} /> },

  // ⭐ NEW — SEO Manager
  { tab: "seo", label: "SEO Manager", icon: <Search size={18} /> },

  // Settings
  { tab: "settings", label: "Settings", icon: <Settings size={18} /> },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) {
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <aside
      className={`flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white shadow-lg border-r border-gray-100`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
              sidebarOpen
                ? "bg-gradient-to-r from-[#e82429] to-[#721011]"
                : "bg-[#e82429]"
            }`}
          >
            DP
          </div>
          {sidebarOpen && (
            <h1 className="font-bold text-lg text-[#721011]">Admin Panel</h1>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          className="text-[#404041] hover:text-[#e82429] transition-colors"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {ITEMS.map((item) => {
          const active = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-[#e82429] to-[#721011] text-white shadow"
                  : "text-[#404041] hover:bg-[#f9e9e9]"
              }`}
            >
              <div className={`${active ? "text-white" : "text-[#e82429]"}`}>
                {item.icon}
              </div>

              {sidebarOpen && (
                <span
                  className={`text-sm font-medium ${
                    active ? "text-white" : "text-[#404041]"
                  }`}
                >
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-gray-200 text-center">
        {sidebarOpen ? (
          <div className="text-xs text-gray-400">
            Made with <span className="text-[#721011] font-semibold">❤️</span>{" "}
            by Desert Planners
          </div>
        ) : (
          <div className="text-xs text-gray-400">DP</div>
        )}
      </div>
    </aside>
  );
}
