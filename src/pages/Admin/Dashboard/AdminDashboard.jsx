import React, { useState } from "react";
import Sidebar from "./Sidebar";

// Import all sections
import Overview from "./Overview";
import ToursManagement from "./ToursManagement";
import TourCategory from "./TourCategory";
import VisaCategory from "./VisaCategory";
import HolidayCategory from "./HolidayCategory";
import Bookings from "./Bookings";
import Payments from "./Payments";
import Users from "./Users";
import Enquiries from "./Enquiries";
import Settings from "./Settings";
import Visa from "./Visa";
import SectionsManagement from "./SectionsManagement";
import BannerManagement from "./BannerManagement";
import VisaBookings from "./VisaBookings";
import HolidayManagement from "./HolidayManagement";
import BlogCategory from "./BlogCategory";
import SEOManagement from "./SEOManagement";
import AdminSEOEditor from "./AdminSEOEditor";
import BlogManagement from "./BlogManagement";
import CouponManagement from "./CouponManagement";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // ⭐ REQUIRED FOR SIDEBAR TOGGLE
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ⭐ for SEO editor
  const [selectedSEO, setSelectedSEO] = useState(null);

  const TABS = {
    overview: Overview,
    tours: ToursManagement,
    visa: Visa,
    visaCategory: VisaCategory,
    holidayManagement: HolidayManagement,
    holidayCategory: HolidayCategory,
    blogCategory: BlogCategory,
    blogManagement: BlogManagement, // ⭐ NEW
    category: TourCategory,
    sections: SectionsManagement,
    bookings: Bookings,
    visaBookings: VisaBookings,
    payments: Payments,
    users: Users,
    enquiries: Enquiries,
    banner: BannerManagement,
    coupons: CouponManagement,

    // ⭐ SEO list screen
    seo: () => (
      <SEOManagement
        setActiveTab={setActiveTab}
        setSelectedSEO={setSelectedSEO}
      />
    ),

    // ⭐ SEO Editor Screen
    seoEditor: () =>
      selectedSEO ? (
        <AdminSEOEditor 
          data={selectedSEO}
          setActiveTab={setActiveTab}
        />
      ) : (
        <div className="p-8 text-center text-red-600">No SEO Selected</div>
      ),
    

    settings: Settings,
  };

  const ActiveComponent = TABS[activeTab];

  return (
    <div className="flex h-screen bg-[var(--color-light-gray)]">
      {/* ⭐ FIX – sidebarOpen & setSidebarOpen pass karo */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        {ActiveComponent ? <ActiveComponent /> : <p>Component not found</p>}
      </main>
    </div>
  );
}
