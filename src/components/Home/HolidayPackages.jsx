import React, { useEffect, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DataService from "../../config/DataService";
import { API } from "../../config/API";

export default function HolidayPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🆔 Replace with actual section id
  const sectionId = "69084852dda693d673b55be3";

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_SECTION_ITEMS(sectionId));
        setPackages(res.data || []);
      } catch (err) {
        console.error("❌ Error fetching holiday packages:", err);
        setError("Unable to load holiday packages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleEnquiry = () => navigate("/contact");

  const handleViewTrip = (title) => {
    const slug = title
      ?.toLowerCase()
      ?.trim()
      ?.replace(/[^a-z0-9]+/g, "-")
      ?.replace(/^-+|-+$/g, "");
    navigate(`/holidays/${slug}`);
  };

  // ✅ Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="h-64 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  // ✅ Error state
  if (error) {
    return (
      <div className="py-16 text-center text-red-500 font-medium">{error}</div>
    );
  }

  // ✅ Main render
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-left bg-gradient-to-r from-[#8000ff] to-[#e5006e] bg-clip-text text-transparent">
          Holiday Packages
        </h2>

        {/* ✅ Skeleton Loader while fetching */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : packages.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              >
                {/* Image */}
                <div
                  className="relative h-64 overflow-hidden cursor-pointer"
                  onClick={() => handleViewTrip(pkg.name || pkg.title)}
                >
                  <img
                    src={pkg.img}
                    alt={pkg.name || pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  {pkg.label && (
                    <span className="absolute top-3 left-3 bg-[#e82429] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {pkg.label}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div className="flex items-center text-gray-500 text-sm font-medium mb-1">
                    <FiCalendar className="mr-2" />{" "}
                    {pkg.duration || "Duration N/A"}
                  </div>

                  <h3
                    className="text-xl font-semibold text-gray-800 mb-3 hover:text-[#e82429] transition cursor-pointer"
                    onClick={() => handleViewTrip(pkg.name || pkg.title)}
                  >
                    {pkg.name || pkg.title}
                  </h3>

                  <p className="text-[#e82429] font-bold mb-5">
                    From AED {pkg.price || "—"} / Person
                  </p>

                  <div className="flex gap-4 mt-auto">
                    <button
                      onClick={handleEnquiry}
                      className="flex-1 py-3 rounded-lg font-semibold bg-gradient-to-r from-[#e82429] to-[#ff5a4d] text-white hover:opacity-90 transition duration-300"
                    >
                      Enquiry Now
                    </button>
                    <button
                      onClick={() => handleViewTrip(pkg.name || pkg.title)}
                      className="flex-1 py-3 rounded-lg font-semibold border-2 border-[#e82429] text-[#e82429] hover:bg-[#e82429] hover:text-white transition duration-300"
                    >
                      View Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-gray-500 text-lg">
            No holiday packages found.
          </div>
        )}
      </div>
    </section>
  );
}
