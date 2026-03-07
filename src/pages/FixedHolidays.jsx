import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function FixedHolidays() {
  const api = DataService();

  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [packages, setPackages] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH CATEGORIES =================

  useEffect(() => {
    api.get(API.GET_HOLIDAY_CATEGORIES).then((res) => {
      const fixed = (res.data || []).filter((c) => c.type === "fixed");

      setCategories(fixed);

      Promise.all(
        fixed.map((cat) => api.get(API.GET_PACKAGES_BY_CATEGORY2(cat.slug)))
      ).then((results) => {
        const merged = results.flatMap((r) => r.data || []);

        setAllPackages(merged);
        setPackages(merged);

        setLoading(false);
      });
    });
  }, []);

  // ================= TAB CHANGE =================

  const changeTab = async (slug) => {
    setActiveTab(slug);

    if (slug === "all") {
      setPackages(allPackages);
      return;
    }

    setLoading(true);

    const res = await api.get(API.GET_PACKAGES_BY_CATEGORY2(slug));

    setPackages(res.data || []);
    setLoading(false);
  };

  return (
    <div className="bg-[#f6f8fb]">
      {/* ================= HERO BANNER ================= */}

      <div
        className="relative h-[500px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470)",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        {/* Content */}
        <div className="relative max-w-[1200px] mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Fixed Departure <br />
              <span className="text-[#ffb703]">Holiday Packages</span>
            </h1>

            <p className="text-lg opacity-90 mb-6">
              Explore curated travel experiences with unbeatable deals, expert
              itineraries and seamless bookings for your next adventure.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/holidays"
                className="bg-[#e82429] hover:bg-[#c51b22] px-6 py-3 rounded-lg font-semibold shadow-lg"
              >
                Explore Packages
              </Link>

              <Link
                to="/contact-us"
                className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition"
              >
                Enquire Now
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-8 text-sm opacity-90">
              <div>
                <p className="text-2xl font-bold text-white">120+</p>
                <p>Destinations</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">5K+</p>
                <p>Happy Travelers</p>
              </div>

              <div>
                <p className="text-2xl font-bold text-white">300+</p>
                <p>Holiday Packages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Features Card */}
      </div>

      {/* ================= CATEGORY TABS ================= */}

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          <button
            onClick={() => changeTab("all")}
            className={`px-6 py-2 rounded-full font-medium transition
            ${
              activeTab === "all"
                ? "bg-[#721011] text-white"
                : "bg-white border hover:bg-[#f1f1f1]"
            }`}
          >
            All
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => changeTab(cat.slug)}
              className={`px-6 py-2 rounded-full font-medium transition
              ${
                activeTab === cat.slug
                  ? "bg-[#721011] text-white"
                  : "bg-white border hover:bg-[#f1f1f1]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* ================= PACKAGE GRID ================= */}

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <Link
                key={pkg._id}
                to={`/holidays/fixed/${pkg.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow hover:shadow-2xl transition"
              >
                {/* IMAGE */}

                <div className="relative overflow-hidden">
                  <img
                    src={pkg.sliderImages?.[0]}
                    className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* duration */}

                  <span className="absolute top-3 right-3 bg-[#e82429] text-white text-xs px-3 py-1 rounded-full">
                    {pkg.duration}
                  </span>

                  {/* badge */}

                  <span className="absolute top-3 left-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                    Trending
                  </span>
                </div>

                {/* CONTENT */}

                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-[#e82429]">
                    {pkg.title}
                  </h3>

                  {/* SHORT DESCRIPTION */}

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {pkg.description
                      ? pkg.description.replace(/<[^>]*>?/gm, "").slice(0, 110)
                      : `Enjoy an amazing ${pkg.title} with luxury stay and unforgettable experiences.`}
                  </p>

                  <div className="flex justify-between items-center">
                    {/* PRICE LOGIC */}

                    {Number(pkg.priceAdult) ? (
                      <div>
                        {/* OLD PRICE */}

                        <span className="text-sm text-gray-400 line-through mr-2">
                          AED {Math.floor(Number(pkg.priceAdult) * 1.2)}
                        </span>

                        {/* CURRENT PRICE */}

                        <span className="text-xl font-bold text-[#721011]">
                          AED {pkg.priceAdult}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-[#721011]">
                        {pkg.priceAdult}
                      </span>
                    )}

                    <span className="px-4 py-1 text-sm rounded-lg bg-gradient-to-r from-[#721011] to-[#e82429] text-white">
                      Book Now
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ================= CTA SECTION ================= */}

      <div className="bg-[#721011] text-white py-14 mt-16">
        <div className="max-w-[1100px] mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Need Help Planning Your Holiday?
          </h2>

          <p className="opacity-90 mb-6">
            Our travel experts will help you plan the perfect trip.
          </p>

          <Link
            to="/contact-us"
            className="bg-white text-[#721011] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Talk to Travel Expert
          </Link>
        </div>
      </div>
    </div>
  );
}
