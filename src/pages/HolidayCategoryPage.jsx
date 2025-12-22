import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";

export default function HolidayCategoryPage() {
  const { categorySlug } = useParams();

  const [packages, setPackages] = useState([]);
  const [category, setCategory] = useState(null);
  const [categoryDescription, setCategoryDescription] = useState(""); // ⭐ NEW
  const [seo, setSEO] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = DataService();

  const fallbackBanner =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

  const categoryName = categorySlug.replaceAll("-", " ").toUpperCase();

  /* ======================================
   STEP 1 — Fetch Holiday Packages (MISSING FIX)
====================================== */
useEffect(() => {
  const loadPackages = async () => {
    try {
      const res = await api.get(
        API.GET_PACKAGES_BY_CATEGORY(categorySlug)
      );
      console.log("PACKAGES API:", res.data); // 🔥 DEBUG
      setPackages(res.data || []);
    } catch (err) {
      console.error("Failed to load packages", err);
      setPackages([]);
    }
  };

  loadPackages();
}, [categorySlug]);

  /* ======================================
     STEP 1 — Fetch Holiday Packages
     ====================================== */
  /* ======================================
   STEP 1.5 — Fetch Holiday Category (FIX)
====================================== */
/* ======================================
   STEP 1.5 — Fetch Holiday Category (FIX)
====================================== */
useEffect(() => {
  const fetchCategory = async () => {
    try {
      const res = await api.get(
        API.GET_HOLIDAY_CATEGORY_BY_SLUG(categorySlug)
      );
      setCategory(res.data);
      setCategoryDescription(res.data?.description || "");
    } catch (err) {
      console.error("Failed to load holiday category", err);
    }
  };

  fetchCategory();
}, [categorySlug]);


  /* ======================================
     STEP 2 — Fetch Holiday Category Description (IMPORTANT)
     ====================================== */
  // useEffect(() => {
  //   if (!category?._id) return;

  //   const fetchCategory = async () => {
  //     try {
  //       const res = await api.get(
  //         API.GET_HOLIDAY_CATEGORY_BY_ID(category._id)
  //       );
  //       setCategoryDescription(res.data?.description || "");
  //     } catch (err) {
  //       console.error("Failed to load holiday category description", err);
  //     }
  //   };

  //   fetchCategory();
  // }, [category]);

  /* ======================================
     STEP 3 — Fetch SEO
     ====================================== */
     useEffect(() => {
      if (!category?. _id) return;
    
      const fetchSEO = async () => {
        const res = await api.get(
          API.GET_SEO("holidayCategory", category._id)
        );
        setSEO(res.data?.seo || null);
        setLoading(false);
      };
    
      fetchSEO();
    }, [category]);
    

  // LOADING
  if (loading)
    return <h2 className="text-center py-10 text-xl">Loading...</h2>;

  // NO PACKAGES
  if (!packages.length)
    return (
      <h2 className="text-center py-10 text-2xl text-red-600">
        No holiday packages found for this category.
      </h2>
    );

  /* ======================================
     SEO FALLBACKS
     ====================================== */
  const pageTitle =
    seo?.seoTitle || `${categoryName} Holiday Packages`;

  const pageDesc =
    seo?.seoDescription ||
    `Explore the best ${categoryName} holiday packages with Desert Planners.`;

  const pageKeywords =
    seo?.seoKeywords || `${categoryName}, Holiday Packages`;

  const ogImage =
    seo?.seoOgImage ||
    packages[0]?.sliderImages?.[0] ||
    fallbackBanner;

  const canonicalURL = `https://www.desertplanners.net/holidays/${categorySlug}`;

  return (
    <div className="w-full">
      {/* ================= SEO ================= */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={canonicalURL} />

        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalURL} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ================= BANNER ================= */}
      <div className="relative w-full h-44 sm:h-52 md:h-60 lg:h-64 mb-10 rounded-xl overflow-hidden bg-black">
        <img
          src={ogImage}
          alt={categoryName}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = fallbackBanner)}
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="absolute inset-0 flex items-center justify-center text-white text-3xl sm:text-4xl font-extrabold tracking-wider">
          {categoryName}
        </h1>
      </div>

      {/* ================= CATEGORY DESCRIPTION (⭐ SAME AS TOUR / VISA ⭐) ================= */}
      {categoryDescription && (
        <section className="w-full bg-gradient-to-b from-[#fffdf9] via-[#f7f3ee] to-[#ffffff]">
          <div className="max-w-[1200px] mx-auto px-4 py-12">
            <div className="relative pl-6 md:pl-8">
              {/* GRADIENT ACCENT LINE */}
              <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-gradient-to-b from-[#e82429] to-[#721011] rounded-full" />

              <div
                className="
                  prose prose-base
                  max-w-full

                  prose-h2:text-2xl
                  md:prose-h2:text-3xl
                  prose-h2:font-extrabold
                  prose-h2:text-gray-900
                  prose-h2:mb-5

                  prose-h3:text-lg
                  prose-h3:font-semibold
                  prose-h3:text-gray-800
                  prose-h3:mt-6
                  prose-h3:mb-3

                  prose-p:text-gray-700
                  prose-p:text-[17px]
                  prose-p:leading-relaxed
                  prose-p:mb-4

                  prose-a:text-[#e82429]
                  prose-a:font-semibold
                  prose-a:no-underline
                  hover:prose-a:text-[#721011]

                  prose-ul:list-disc
                  prose-ul:pl-5
                  prose-li:marker:text-[#e82429]
                "
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(categoryDescription),
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ================= PACKAGE CARDS ================= */}
      <div className="max-w-[1200px] mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <ImageCard
              key={pkg._id}
              pkg={pkg}
              categorySlug={categorySlug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===============================
   HOLIDAY PACKAGE CARD
=============================== */
function ImageCard({ pkg, categorySlug }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!pkg.sliderImages || pkg.sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) =>
        prev + 1 < pkg.sliderImages.length ? prev + 1 : 0
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [pkg.sliderImages]);

  return (
    <Link
      to={`/holidays/${categorySlug}/${pkg.slug}`}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden"
    >
      <div className="h-60 w-full overflow-hidden relative bg-gray-200">
        <img
          src={pkg.sliderImages?.[index] || "/no-image.png"}
          alt={pkg.title}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />

        {pkg.duration && (
          <div className="absolute bottom-3 right-3 px-4 py-1.5 rounded-full bg-[#e82429] text-white text-[12.5px] font-bold shadow">
            {pkg.duration}
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-bold text-[#404041] group-hover:text-[#e82429] transition w-[70%] leading-snug">
            {pkg.title}
          </h3>
          <p className="text-[#e82429] font-bold text-lg whitespace-nowrap">
            $ {pkg.priceAdult}
          </p>
        </div>

        <p className="text-gray-600 text-sm h-10 overflow-hidden">
          Enjoy an unforgettable holiday experience in {pkg.title}.
        </p>

        <div className="pt-1">
          <span className="inline-block px-4 py-2 bg-[#e82429] text-white rounded-xl text-sm font-medium shadow hover:bg-[#c71f24] transition">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
