// src/pages/VisaList.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { FaClock, FaStar } from "react-icons/fa";

export default function VisaList() {
  const { categorySlug } = useParams(); // 👈 categorySlug route se milega
  const [visas, setVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = DataService();

  // ✅ Fetch visas (agar categorySlug mila hai to uske hisaab se)
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
    } catch (err) {
      console.error("Error fetching visas:", err);
      setVisas([]);
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
      {/* Banner */}
      <div className="relative w-full h-64 md:h-96 overflow-hidden">
        <img
          src="https://i.pinimg.com/736x/3e/2a/a5/3e2aa5d6ad915a7f64e2ce799a38de76.jpg"
          alt="Visa Services Banner"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center drop-shadow-lg tracking-wide max-w-[1200px] px-4">
            Visa Services
          </h1>
        </div>
      </div>

      {/* Visa Cards */}
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {visas.map((v) => (
            <Link
              key={v._id}
              to={`/visa/${v.visaCategory?.slug || categorySlug || ""}/${
                v.slug
              }`}
              className="group relative block rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              {/* Image with gradient overlay */}
              <div className="relative h-56 w-full overflow-hidden rounded-t-3xl">
                <img
                  src={v.gallery?.[0] || v.img}
                  alt={v.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
              <div className="p-5 bg-white rounded-b-3xl space-y-3">
                <h3 className="text-lg font-semibold text-[#404041] transition-colors group-hover:text-[#e82429]">
                  {v.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {v.overview}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-[#e82429] font-bold text-lg">
                    AED {v.price}
                  </div>
                  <div className="text-sm text-gray-500">per application</div>
                </div>

                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={`${
                        idx < 4 ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-500 text-xs">(4.0)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
