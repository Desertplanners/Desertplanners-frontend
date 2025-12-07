import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { Edit3, Tag, Home, Plane, Briefcase, Grid, Layers, Files } from "lucide-react";
import AdminSEOEditor from "./AdminSEOEditor";

export default function SEOManagement() {
  const api = DataService();

  // 🔥 Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedSEOData, setSelectedSEOData] = useState(null);

  const [tab, setTab] = useState("page");
  const [search, setSearch] = useState(""); // ⭐ SEARCH FIELD

  // STATIC PAGES
  const [staticPages] = useState([
    { id: "home", title: "Home" },
    { id: "about-us", title: "About Us" },
    { id: "contact-us", title: "Contact Us" },
    { id: "privacy-policy", title: "Privacy Policy" },
    { id: "terms-and-conditions", title: "Terms & Conditions" },
    { id: "cancellation-refund-policy", title: "Cancellation & Refund Policy" }, // ⭐ NEW
    { id: "tours", title: "Tours Page" },
    { id: "visa", title: "Visa Page" },
    { id: "holidays", title: "Holidays Page" },
  ]);
  

  const [tours, setTours] = useState([]);
  const [visas, setVisas] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [tourCategories, setTourCategories] = useState([]);
  const [visaCategories, setVisaCategories] = useState([]);
  const [holidayCategories, setHolidayCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setTours((await api.get(API.GET_TOURS)).data || []);
        setVisas((await api.get(API.GET_VISAS)).data || []);
        setHolidays((await api.get(API.GET_ALL_HOLIDAY_TOURS)).data?.tours || []);

        setTourCategories((await api.get(API.GET_CATEGORIES)).data || []);
        setVisaCategories((await api.get(API.GET_VISA_CATEGORIES)).data || []);
        setHolidayCategories((await api.get(API.GET_HOLIDAY_CATEGORIES)).data || []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const lists = {
    page: staticPages,
    tour: tours,
    visa: visas,
    holiday: holidays,
    tourCategory: tourCategories,
    visaCategory: visaCategories,
    holidayCategory: holidayCategories,
  };

  const tabs = [
    { key: "page", label: "Static Pages", icon: <Home size={16} /> },
    { key: "tour", label: "Tours", icon: <Briefcase size={16} /> },
    { key: "visa", label: "Visa", icon: <Plane size={16} /> },
    { key: "holiday", label: "Holiday Packages", icon: <Files size={16} /> },
    { key: "tourCategory", label: "Tour Categories", icon: <Grid size={16} /> },
    { key: "visaCategory", label: "Visa Categories", icon: <Grid size={16} /> },
    { key: "holidayCategory", label: "Holiday Categories", icon: <Layers size={16} /> },
  ];

  // ⭐ FILTERED LIST ACCORDING TO SEARCH
  const filteredList = lists[tab]?.filter((item) => {
    const title = (item.title || item.name || "").toLowerCase();
    return title.includes(search.toLowerCase());
  });

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        <div>
          <h1 className="text-4xl font-extrabold text-[#721011]">SEO Manager</h1>
          <p className="text-gray-500 font-medium mt-1 text-lg">
            Manage SEO for all pages, categories & listings
          </p>
        </div>

        {/* ⭐ SEARCH BAR LIKE PAYMENTS PAGE */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search..."
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

          {/* Icon */}
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
            🔍
          </span>

          {/* Clear */}
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

      {/* TABS */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-3 no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 flex items-center gap-2 rounded-xl text-sm font-medium shadow 
              transition-all duration-300 whitespace-nowrap 
              ${
                tab === t.key
                  ? "bg-gradient-to-r from-[#721011] to-[#e82429] text-white shadow-lg scale-105"
                  : "bg-white border text-gray-700 hover:bg-gray-100"
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100">

        <div className="grid grid-cols-12 gap-4 py-3 border-b font-semibold text-gray-600">
          <div className="col-span-6 flex items-center gap-2">
            <Tag size={16} className="text-[#e82429]" /> 
            {tabs.find((x) => x.key === tab)?.label}
          </div>
          <div className="col-span-3">Type</div>
          <div className="col-span-3 text-right">Action</div>
        </div>

        {filteredList?.length ? (
          filteredList.map((item) => (
            <div
              key={item._id || item.id}
              className="grid grid-cols-12 gap-4 py-4 border-b hover:bg-gray-50 transition-all"
            >
              <div className="col-span-6 font-medium text-gray-900">
                {item.title || item.name}
              </div>

              <div className="col-span-3">
                <span className="px-3 py-1 rounded-full text-xs bg-[#ffe8e8] text-[#721011]">
                  {tabs.find((x) => x.key === tab)?.label}
                </span>
              </div>

              <div className="col-span-3 text-right">
                <button
                  onClick={() => {
                    setSelectedSEOData({
                      type: tab,
                      id: item._id || item.id,
                      title: item.title || item.name,
                    });
                    setShowModal(true);
                  }}
                  className="bg-[#e82429] text-white px-4 py-2 rounded-lg shadow hover:shadow-md flex items-center gap-2 float-right"
                >
                  <Edit3 size={16} /> Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-gray-500">No matching records...</p>
        )}
      </div>

      {/* MODAL POPUP */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto relative">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-lg"
            >
              Close
            </button>

            <AdminSEOEditor
              data={selectedSEOData}
              closeModal={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
