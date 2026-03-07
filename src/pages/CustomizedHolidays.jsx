import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function CustomizedHolidays() {
  const api = DataService();

  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [packages, setPackages] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH CATEGORIES =================

  useEffect(() => {
    api.get(API.GET_HOLIDAY_CATEGORIES).then((res) => {
      const customized = (res.data || []).filter(
        (c) => c.type === "customized"
      );

      setCategories(customized);

      Promise.all(
        customized.map((cat) =>
          api.get(API.GET_PACKAGES_BY_CATEGORY2(cat.slug))
        )
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
        className="relative h-[420px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>

        <div className="relative max-w-[1200px] mx-auto px-4 h-full flex flex-col justify-center text-white">
          <h1 className="text-5xl font-bold mb-4 leading-tight">
            Customized Holiday Packages
          </h1>

          <p className="text-lg opacity-90 max-w-xl">
            Design your dream holiday with personalized travel experiences,
            luxury stays and flexible itineraries.
          </p>

          <Link
            to="/contact-us"
            className="mt-6 inline-block bg-[#e82429] hover:bg-[#c51b22] text-white px-6 py-3 rounded-lg font-semibold w-fit"
          >
            Plan My Trip
          </Link>
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="max-w-[1200px] mx-auto px-4 py-12">
        {/* CATEGORY TABS */}

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

        {/* ================= PACKAGES ================= */}

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
                to={`/holidays/customized/${pkg.slug}`}
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
                    Popular
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
                      View
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ================= CTA ================= */}

      <div className="bg-[#721011] text-white py-14 mt-16">
        <div className="max-w-[1100px] mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Let Our Experts Plan Your Perfect Holiday
          </h2>

          <p className="opacity-90 mb-6">
            Share your travel preferences and we will create a customized
            itinerary just for you.
          </p>

          <Link
            to="/contact-us"
            className="bg-white text-[#721011] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Get Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
