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

  // 🔥 Discount helper
  const getDiscountPercent = (actual, discounted) => {
    if (!actual || !discounted) return null;
    return Math.round(((actual - discounted) / actual) * 100);
  };

  // ================= FETCH TOURS =================
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get(API.GET_TOURS_BY_CATEGORY(slug));
        const list = res.data || [];
        setTours(list);
        if (list.length > 0) setCategory(list[0].category);
      } catch (err) {
        console.error(err);
        setTours([]);
      }
    };

    requestIdleCallback(loadData);
  }, [slug]);

  // ================= FETCH SEO =================
  useEffect(() => {
    if (!category?._id) return;

    const fetchSEO = async () => {
      try {
        const res = await api.get(API.GET_SEO("tourCategory", category._id));
        setSEO(res.data?.seo || null);
      } catch {
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

  // ================= SEO FALLBACKS =================
  const pageTitle = seo?.seoTitle || `${category?.name} – Dubai Tour Packages`;
  const pageDesc =
    seo?.seoDescription ||
    `Discover top Dubai tours under ${category?.name}. View prices, details & book online.`;
  const pageKeywords = seo?.seoKeywords || `${category?.name}, Dubai Tours`;
  const ogImage = seo?.seoOgImage || tours[0]?.mainImage || fallbackBanner;
  const canonicalURL = `https://www.desertplanners.net/tours/${slug}`;

  return (
    <div className="w-full">
      {/* ================= SEO ================= */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords" content={pageKeywords} />
        <link rel="canonical" href={canonicalURL} />

        {/* OG */}
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

        {/* CollectionPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: pageTitle,
            description: pageDesc,
            image: ogImage,
            url: canonicalURL,
            about: {
              "@type": "Thing",
              name: category?.name,
            },
          })}
        </script>

        {/* FAQ Schema (RESTORED) */}
        {seo?.faqs?.length > 0 && (
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

      {/* ================= BANNER ================= */}
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

      {/* ================= CARDS ================= */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour) => {
          const discount = getDiscountPercent(
            tour.priceAdult || tour.price,
            tour.discountPriceAdult
          );

          return (
            <Link
              key={tour._id}
              to={`/tours/${slug}/${tour.slug}`}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition overflow-hidden"
            >
              {/* IMAGE + % OFF */}
              <div className="relative h-64 overflow-hidden">
                {discount && (
                  <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#e82429] to-[#ff5a5f] text-white text-sm font-extrabold px-3 py-1 rounded-full shadow-lg">
                    {discount}% OFF
                  </div>
                )}

                <img
                  src={
                    tour.mainImage?.startsWith("http")
                      ? tour.mainImage
                      : `${import.meta.env.VITE_API_URL}/${tour.mainImage}`
                  }
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-black/10" />
              </div>

              {/* CONTENT */}
              <div className="p-6 h-56 flex flex-col">
                <h2 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                  {tour.title}
                </h2>

                {/* PRICE */}
                <div className="mb-4">
                  {tour.discountPriceAdult ? (
                    <>
                      <div className="relative inline-block mr-2">
                        <span className="text-sm text-gray-400">
                          AED {tour.priceAdult || tour.price}
                        </span>
                        <span className="absolute left-0 right-0 top-1/2 h-[1px] bg-[#e82429]/70" />
                      </div>

                      <span className="text-xl font-extrabold text-[#e82429]">
                        AED {tour.discountPriceAdult}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-800">
                      AED {tour.priceAdult || tour.price}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-auto text-center bg-[#404041] group-hover:bg-[#e82429] text-white py-3 rounded-2xl transition">
                  View Trip
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
