// src/pages/VisaList.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { FaClock, FaStar } from "react-icons/fa";

export default function VisaList() {
  const { categorySlug } = useParams();
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");
  const api = DataService();

  const fetchVisas = async () => {
    try {
      let res;
      if (categorySlug) {
        res = await api.get(`${API.GET_VISAS}?categorySlug=${categorySlug}`);
      } else {
        res = await api.get(API.GET_VISAS);
      }

      const visaArray = Array.isArray(res.data)
        ? res.data
        : res.data.visas || [];

      setVisas(visaArray);

      if (visaArray.length > 0 && visaArray[0].visaCategory?.name) {
        setCategoryName(visaArray[0].visaCategory.name);
      } else if (categorySlug) {
        const formatted = categorySlug.replace(/-/g, " ");
        setCategoryName(formatted.charAt(0).toUpperCase() + formatted.slice(1));
      } else {
        setCategoryName("Visa Services");
      }
    } catch (err) {
      console.error("Error fetching visas:", err);
      setVisas([]);
      setCategoryName("Visa Services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisas();
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-700 text-xl">
        Loading visas...
      </div>
    );
  }

  if (visas.length === 0) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-700 text-xl">
        No visas available.
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* ===== Compact Category Banner ===== */}
      <div className="relative w-full h-[160px] sm:h-[200px] md:h-[240px] lg:h-[260px] overflow-hidden">
        <img
          src="/visa-banner.png"
          alt={categoryName || "Visa Services"}
          className="w-full h-full object-cover brightness-[0.65]"
          loading="lazy"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center drop-shadow-lg tracking-wide px-4 capitalize">
            {categoryName || "Visa Services"}
          </h1>
        </div>
      </div>

      {/* ===== Visa Cards ===== */}
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visas.map((v) => (
            <div
              key={v._id}
              className="relative block rounded-3xl overflow-hidden shadow-lg bg-white"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
                <img
                  src={v.gallery?.[0] || v.img}
                  alt={v.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {v.processingTime && (
                  <span className="absolute top-3 left-3 bg-[#e82429] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    <FaClock className="inline-block mr-1 text-[10px]" />
                    {v.processingTime}
                  </span>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 rounded-b-3xl space-y-3">
                <h3 className="text-lg font-semibold text-[#404041] transition-colors group-hover:text-[#e82429]">
                  {v.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {v.overview}
                </p>

                {/* Price + Button Section */}
                <div className="flex items-end justify-between mt-5">
                  <div>
                    <div className="text-[#e82429] font-bold text-lg">
                      AED {v.price}
                    </div>
                    <div className="text-sm text-gray-500">per application</div>
                  </div>

                  {/* ✨ Stylish View Details Button */}
                  <Link
                    to={`/visa/${v.visaCategory?.slug || categorySlug || ""}/${v.slug}`}
                    className="relative inline-flex items-center justify-center px-4 py-1.5 text-sm font-semibold text-white 
                    bg-gradient-to-r from-[#e82429] to-[#ff4b2b] rounded-full shadow-md transition-all duration-300 
                    hover:from-[#ff4b2b] hover:to-[#e82429] hover:shadow-lg hover:scale-105"
                  >
                    View Details
                    <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </Link>
                </div>

                {/* Ratings */}
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
