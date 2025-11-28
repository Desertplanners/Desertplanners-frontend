import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { Edit3, Tag, Home, Plane, Briefcase, Grid, Layers, Files } from "lucide-react";

export default function SEOManagement({ setActiveTab, setSelectedSEO }) {
  const api = DataService();

  // ⭐ Active Tab
  const [tab, setTab] = useState("page");

  // ⭐ All cached data
  const [staticPages] = useState([
    { id: "home", title: "Home" },
    { id: "about-us", title: "About Us" },
    { id: "contact-us", title: "Contact Us" },
    { id: "privacy-policy", title: "Privacy Policy" },
    { id: "terms-and-conditions", title: "Terms & Conditions" },
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

  // ⭐ FETCH ALL ONCE
  useEffect(() => {
    (async () => {
      try {
        const t = await api.get(API.GET_TOURS);
        setTours(t.data || []);

        const v = await api.get(API.GET_VISAS);
        setVisas(v.data?.visas || []);

        const h = await api.get(API.GET_ALL_HOLIDAY_TOURS);
        setHolidays(h.data?.tours || []);

        const tc = await api.get(API.GET_CATEGORIES);
        setTourCategories(tc.data || []);

        const vc = await api.get(API.GET_VISA_CATEGORIES);
        setVisaCategories(vc.data || []);

        const hc = await api.get(API.GET_HOLIDAY_CATEGORIES);
        setHolidayCategories(hc.data || []);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  // ⭐ FIXED – Backend compatible keys
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

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#721011]">
          SEO Manager
        </h1>
        <p className="text-gray-500 font-medium mt-1 text-lg">
          Manage SEO for all pages, categories & listings
        </p>
      </div>

      {/* ⭐ Modern Tabs */}
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
            {tabs.find(x => x.key === tab)?.label}
          </div>
          <div className="col-span-3">Type</div>
          <div className="col-span-3 text-right">Action</div>
        </div>

        {lists[tab]?.length > 0 ? (
          lists[tab].map((item) => (
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
                    setSelectedSEO({
                      type: tab, // Backend compatible
                      id: item._id || item.id,
                      backTab: tab,
                    });
                    setActiveTab("seoEditor");
                  }}
                  className="bg-[#e82429] text-white px-4 py-2 rounded-lg shadow hover:shadow-md flex items-center gap-2 float-right"
                >
                  <Edit3 size={16} /> Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-gray-500">No records found...</p>
        )}
      </div>
    </div>
  );
}
