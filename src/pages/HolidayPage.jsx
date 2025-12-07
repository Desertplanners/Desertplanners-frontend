import { useEffect, useState } from "react";
import DataService from "../config/DataService";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../config/API";
import {
  FaStar,
  FaClock,
  FaCalendarCheck,
  FaCheckCircle,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";

export default function HolidayPage() {
  const [categories, setCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState({});
  const [seo, setSEO] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const api = DataService();

    // ⭐ Fetch SEO for Holiday Page
    const fetchSEO = async () => {
      try {
        const res = await api.get(API.GET_SEO("page", "holidays"));
        if (res.data?.seo) setSEO(res.data.seo);
      } catch (err) {
        console.log("Holiday SEO Error:", err);
      }
    };

    fetchSEO();

    // ⭐ Fetch Holiday Categories
    api.get("/api/holiday-categories").then((res) => {
      const list = res.data || [];
      setCategories(list);

      list.forEach((cat) => fetchCategoryImage(cat));
    });

    // ⭐ Fetch First Package Image Per Category
    const fetchCategoryImage = async (cat) => {
      try {
        const res = await api.get(API.GET_PACKAGES_BY_CATEGORY(cat.slug));
        const packages = res.data || [];

        const firstImage =
          packages?.[0]?.sliderImages?.[0] ||
          packages?.[0]?.bannerImage ||
          packages?.[0]?.image ||
          null;

        setCategoryImages((prev) => ({
          ...prev,
          [cat.slug]: firstImage,
        }));
      } catch (err) {
        console.log("Image load error:", err);
      }
    };
  }, []);

  return (
    <div className="w-full">

      {/* ⭐⭐⭐ SEO START ⭐⭐⭐ */}
      {seo && (
        <Helmet>
          <title>{seo.seoTitle}</title>
          <meta name="description" content={seo.seoDescription} />
          <meta name="keywords" content={seo.seoKeywords} />
          <link rel="canonical" href="https://www.desertplanners.net/holidays" />

          {/* OG Tags */}
          <meta property="og:title" content={seo.seoTitle} />
          <meta property="og:description" content={seo.seoDescription} />
          <meta property="og:image" content={seo.seoOgImage} />
          <meta property="og:url" content="https://www.desertplanners.net/holidays" />
          <meta property="og:type" content="website" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.seoTitle} />
          <meta name="twitter:description" content={seo.seoDescription} />
          <meta name="twitter:image" content={seo.seoOgImage} />

          {/* Page Schema */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: seo.seoTitle,
              description: seo.seoDescription,
              url: "https://www.desertplanners.net/holidays",
              image: seo.seoOgImage,
              publisher: {
                "@type": "Organization",
                name: "Desert Planners UAE",
              },
            })}
          </script>

          {/* FAQ Schema */}
          {seo.faqs?.length > 0 && (
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: seo.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: f.answer,
                  },
                })),
              })}
            </script>
          )}
        </Helmet>
      )}
      {/* ⭐⭐⭐ SEO END ⭐⭐⭐ */}

      {/* ⭐⭐⭐ HOLIDAY BANNER ⭐⭐⭐ */}
      <section className="bg-gradient-to-br from-[#f9fafc] via-[#f5f6f9] to-[#f8f8fb] py-16">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-10">
          
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1c1c1c] leading-snug">
              Holiday Packages | International Trips, Family Tours & Honeymoon Packages
            </h1>

            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-center gap-3">
                <FaCalendarCheck className="text-[#e82429]" size={22} />
                Best curated international holiday trips.
              </li>
              <li className="flex items-center gap-3">
                <FaStar className="text-[#e82429]" size={22} />
                Handpicked itineraries & customizable packages.
              </li>
              <li className="flex items-center gap-3">
                <FaClock className="text-[#e82429]" size={22} />
                24/7 expert travel assistance.
              </li>
            </ul>

            <button className="mt-6 bg-[#e82429] text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-[#b9191c] transition-all duration-300">
              Explore Holidays
            </button>
          </div>

          <div className="md:w-1/2 flex justify-center relative">
            <div className="absolute inset-0 bg-[#e82429]/10 blur-3xl rounded-full -z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1612010863789-40e90e0f5112?q=80&w=1170&auto=format&fit=crop"
              alt="Holiday Banner"
              className="rounded-2xl shadow-xl w-full h-[350px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ⭐ CATEGORY CARDS ⭐ */}
      <div className="max-w-[1200px] mx-auto py-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#1c1c1c]">
          Holiday Categories
        </h2>

        <div className="space-y-8">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/holidays/${cat.slug}`)}
              className="bg-white border border-gray-200 rounded-2xl shadow-md 
                 p-5 flex flex-col md:flex-row gap-6 hover:shadow-xl 
                 transition-all duration-300 cursor-pointer"
            >
              {/* IMAGE LEFT */}
              <div className="md:w-1/3 w-full overflow-hidden rounded-xl">
                <img
                  src={categoryImages[cat.slug]}
                  alt={cat.name}
                  className="w-full h-52 md:h-60 object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* CONTENT MIDDLE */}
              <div className="flex-1 flex flex-col justify-center space-y-3">
                <h2 className="text-2xl font-bold text-[#1c1c1c]">
                  {cat.name}
                </h2>

                <p className="text-gray-700 text-[15px] leading-relaxed">
                  Handpicked holiday experiences including stays, sightseeing,
                  and guided tours. Ideal for families, couples and solo travelers.
                </p>

                <div className="flex items-center gap-3 text-sm text-gray-600 pt-1">
                  <span className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" /> Verified packages
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarCheck className="text-[#721011]" /> Flexible plans
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-gray-500" /> 24×7 support
                  </span>
                </div>

                <span className="text-[#e82429] font-semibold text-sm mt-1 inline-block">
                  Explore {cat.name} Packages →
                </span>
              </div>

              {/* CTA BOX */}
              <div className="md:w-1/4 w-full md:border-l border-t md:border-t-0 border-gray-200 
                   flex flex-col justify-center pt-3 md:pt-0 md:pl-6 space-y-4"
              >
                <div className="bg-[#fff5f5] border border-[#e82429]/20 rounded-xl p-4">
                  <p className="text-[#721011] font-bold text-lg">
                    Popular Category
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Best-selling holiday packages curated by travel experts.
                  </p>
                </div>

                <button
                  className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white 
                     font-semibold py-2.5 px-4 rounded-lg shadow hover:scale-[1.02] 
                     transition-all duration-300"
                >
                  View Packages
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
