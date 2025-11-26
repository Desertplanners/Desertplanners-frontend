import React, { useEffect, useState } from "react";
import DataService from "../../../config/DataService";
import { API } from "../../../config/API";
import { Edit3, ArrowRight, Tag, Globe } from "lucide-react";

export default function SEOManagement({ setActiveTab, setSelectedSEO }) {
  const [type, setType] = useState("tour");
  const [data, setData] = useState([]);

  const api = DataService();

  const fetchList = async () => {
    try {
      let res = [];

      if (type === "tour") res = await api.get(API.GET_TOURS);
      else if (type === "visa") res = await api.get(API.GET_VISAS);
      else res = await api.get(API.GET_ALL_HOLIDAY_TOURS);

      setData(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchList();
  }, [type]);

  return (
    <div className="p-6">

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#721011]">
            SEO Manager
          </h1>
          <p className="text-gray-500 mt-1">
            Manage SEO for Tours, Visa, and Holiday Packages
          </p>
        </div>

        {/* Type Selector */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 rounded-xl bg-white border shadow-sm text-sm font-medium"
        >
          <option value="tour">Tours</option>
          <option value="visa">Visa</option>
          <option value="holiday">Holiday Tours</option>
        </select>
      </div>

      {/* MAIN LIST */}
      <div className="bg-white rounded-2xl shadow p-5">

        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 py-3 border-b font-semibold text-gray-600">
          <div className="col-span-6 flex items-center gap-2">
            <Tag size={16} className="text-[#e82429]" />
            Title
          </div>
          <div className="col-span-3">Type</div>
          <div className="col-span-3 text-right">Action</div>
        </div>

        {/* Rows */}
        {data.map((item) => (
          <div
            key={item._id}
            className="grid grid-cols-12 gap-4 py-4 border-b hover:bg-gray-50 transition cursor-pointer"
          >
            {/* Title */}
            <div className="col-span-6 font-medium text-gray-800">
              {item.title}
            </div>

            {/* Type Tag */}
            <div className="col-span-3">
              <span className="px-3 py-1 rounded-full text-xs bg-[#ffe8e8] text-[#721011]">
                {type.toUpperCase()}
              </span>
            </div>

            {/* Action */}
            <div className="col-span-3 text-right">
              <button
                onClick={() => {
                  setSelectedSEO({ type, id: item._id });
                  setActiveTab("seoEditor");
                }}
                className="flex items-center float-right gap-2 bg-[#e82429] text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition"
              >
                <Edit3 size={16} />
                Edit
              </button>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {!data.length && (
          <p className="text-center py-6 text-gray-500">
            No records found...
          </p>
        )}
      </div>
    </div>
  );
}
