import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";

export default function HolidayCategoryPage() {
  const { categorySlug } = useParams();
  const [packages, setPackages] = useState([]);
  const [seo, setSEO] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = DataService();

  const fallbackBanner =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80";

  const categoryName = categorySlug.replaceAll("-", " ").toUpperCase();

  // ⭐ STEP 1 — Fetch Holiday Packages
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get(API.GET_PACKAGES_BY_CATEGORY(categorySlug));
        setPackages(res.data || []);
      } catch (err) {
        console.error(err);
        setPackages([]);
      }
    };

    requestIdleCallback(loadData);
  }, [categorySlug]);

  // ⭐ STEP 2 — Fetch SEO (dynamic only, no fallback)
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const res = await api.get(API.GET_SEO("holidayCategory", categorySlug));
        setSEO(res.data?.seo || null);
      } catch (err) {
        console.log("SEO not found");
      } finally {
        setLoading(false);
      }
    };

    fetchSEO();
  }, [categorySlug]);

  if (loading) return <h2 className="text-center py-10">Loading...</h2>;

  if (!packages.length)
    return (
      <h2 className="text-center py-10 text-2xl text-red-600">
        No holiday packages found for this category.
      </h2>
    );

  // ⭐ NO FALLBACK — Pure Dynamic SEO
  const pageTitle = seo?.seoTitle || "";
  const pageDesc = seo?.seoDescription || "";
  const pageKeywords = seo?.seoKeywords || "";
  const ogImage =
    seo?.seoOgImage || packages[0]?.sliderImages?.[0] || fallbackBanner;

  const canonicalURL = `https://www.desertplanners.net/holidays/${categorySlug}`;

  return (
    <div className="w-full">
      {/* ⭐⭐⭐ Dynamic SEO Start ⭐⭐⭐ */}
      <Helmet>
        {pageTitle && <title>{pageTitle}</title>}
        {pageDesc && <meta name="description" content={pageDesc} />}
        {pageKeywords && <meta name="keywords" content={pageKeywords} />}
        <link rel="canonical" href={canonicalURL} />

        {/* OG Tags (only dynamic if available) */}
        {pageTitle && <meta property="og:title" content={pageTitle} />}
        {pageDesc && <meta property="og:description" content={pageDesc} />}
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalURL} />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        {pageTitle && <meta name="twitter:title" content={pageTitle} />}
        {pageDesc && <meta name="twitter:description" content={pageDesc} />}
        <meta name="twitter:image" content={ogImage} />

        {/* Schema only if dynamic description exists */}
        {(pageTitle || pageDesc) && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: pageTitle || categoryName,
              description: pageDesc || "",
              image: ogImage,
              url: canonicalURL,
              about: { "@type": "Thing", name: categoryName },
            })}
          </script>
        )}

        {/* FAQ Schema */}
        {seo?.faqs?.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: seo.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            })}
          </script>
        )}
      </Helmet>
      {/* ⭐⭐⭐ Dynamic SEO End ⭐⭐⭐ */}

      {/* TOP BANNER */}
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

      {/* Compact SEO Description */}
      {pageDesc && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 mt-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <p className="text-gray-700 text-[15px] leading-snug">
              {pageDesc}
            </p>
          </div>
        </div>
      )}

      {/* CARDS */}
      <div className="max-w-[1200px] mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <ImageCard key={pkg._id} pkg={pkg} categorySlug={categorySlug} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------
   CARD COMPONENT
------------------------------ */
function ImageCard({ pkg, categorySlug }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!pkg.sliderImages || pkg.sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1 < pkg.sliderImages.length ? prev + 1 : 0));
    }, 2500);

    return () => clearInterval(interval);
  }, [pkg.sliderImages]);

  return (
    <Link
      to={`/holidays/${categorySlug}/${pkg.slug}`}
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden"
    >
      {/* IMAGE */}
      <div className="h-60 w-full overflow-hidden relative bg-gray-200">
        <img
          src={pkg.sliderImages?.[index] || "/no-image.png"}
          alt={pkg.title}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />

        {/* Duration */}
        {pkg.duration && (
          <div className="absolute bottom-3 right-3 px-4 py-1.5 rounded-full bg-[#e82429] text-white text-[12.5px] font-bold shadow border border-white/20">
            {pkg.duration}
          </div>
        )}

        {/* Slider Dots */}
        {pkg.sliderImages?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {pkg.sliderImages.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  index === i ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* CONTENT */}
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
