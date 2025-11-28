import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";

export default function TourCategoryPage() {
  const { slug } = useParams();
  const [tours, setTours] = useState([]);
  const [category, setCategory] = useState(null);
  const [seo, setSEO] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = DataService();
  const fallbackBanner = "/images/dubai-common-banner.jpg";

  // ⭐ STEP 1 — Fetch Category Tours
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get(API.GET_TOURS_BY_CATEGORY(slug));
        const list = res.data || [];

        setTours(list);

        if (list.length > 0) {
          setCategory(list[0].category);
        }
      } catch (err) {
        console.error(err);
        setTours([]);
      }
    };

    requestIdleCallback(loadData);
  }, [slug]);

  // ⭐ STEP 2 — Fetch SEO (using correct backend type "tourCategory")
  useEffect(() => {
    if (!category?._id) return;

    const fetchSEO = async () => {
      try {
        const res = await api.get(API.GET_SEO("tourCategory", category._id));
        setSEO(res.data?.seo || null);
      } catch (err) {
        console.log("SEO missing => using fallback");
      } finally {
        setLoading(false);
      }
    };

    fetchSEO();
  }, [category]);

  if (loading) return <h2 className="text-center py-10">Loading...</h2>;

  if (!tours.length)
    return (
      <h2 className="text-center py-10 text-2xl text-red-600">
        No tours found for this category
      </h2>
    );

  // ⭐ Dynamic SEO Fallbacks
  const pageTitle =
    seo?.seoTitle || `${category?.name} – Dubai Tour Packages`;
  const pageDesc =
    seo?.seoDescription ||
    `Discover top Dubai tours under ${category?.name}. View prices, details & book online.`;
  const pageKeywords = seo?.seoKeywords || `${category?.name}, Dubai Tours`;
  const ogImage = seo?.seoOgImage || tours[0]?.mainImage || fallbackBanner;

  const canonicalURL = `https://www.desertplanners.net/tours/${slug}`;

  return (
    <div className="w-full">

      {/* ⭐⭐⭐ Dynamic SEO Start ⭐⭐⭐ */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={canonicalURL} />

        {/* OG Tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={canonicalURL} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />

        {/* Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: pageTitle,
            description: pageDesc,
            image: ogImage,
            url: canonicalURL,
            about: { "@type": "Thing", name: category?.name },
          })}
        </script>

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

      {/* Banner */}
      <div className="relative w-full h-[200px] md:h-[260px] lg:h-[320px] rounded-2xl overflow-hidden shadow-lg bg-black">
        <img
          src={ogImage}
          alt={category?.name}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = fallbackBanner)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase">
            {category?.name}
          </h1>
        </div>
      </div>

      {/* ⭐ SEO Description Under Banner */}
      {seo?.seoDescription && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-0 mt-8">
          <div className="bg-white rounded-2xl shadow p-6 border">
            <p className="text-gray-700 text-lg leading-relaxed">
              {seo.seoDescription}
            </p>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => (
          <Link
            key={tour._id}
            to={`/tours/${slug}/${tour.slug}`}
            className="block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition"
          >
            <div className="h-64 overflow-hidden rounded-t-3xl">
              <img
                src={
                  tour.mainImage?.startsWith("http")
                    ? tour.mainImage
                    : `${import.meta.env.VITE_API_URL}/${tour.mainImage}`
                }
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="p-6 h-56 flex flex-col">
              <h2 className="text-xl font-bold text-[#e82429] mb-3">
                {tour.title}
              </h2>

              <p className="text-gray-700 font-semibold mb-4">
                From AED {tour.price}
              </p>

              <div className="mt-auto text-center bg-[#404041] hover:bg-[#e82429] text-white py-3 rounded-2xl transition">
                View Trip
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
