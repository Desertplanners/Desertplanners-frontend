// src/pages/VisaCategoryPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";

export default function VisaCategoryPage() {
  const { categorySlug } = useParams();

  const [visas, setVisas] = useState([]);
  const [category, setCategory] = useState(null);
  const [seo, setSEO] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = DataService();

  /* -------------------------------
     ⭐ STEP 1 — Fetch Visas in Category
  ------------------------------- */
  useEffect(() => {
    const loadCategoryVisas = async () => {
      try {
        const res = await api.get(`${API.GET_VISAS}?categorySlug=${categorySlug}`);

        const visaList = Array.isArray(res.data)
          ? res.data
          : res.data.visas || [];

        setVisas(visaList);

        if (visaList.length > 0 && visaList[0].visaCategory) {
          setCategory(visaList[0].visaCategory);
        } else {
          setCategory({
            name: categorySlug.replace(/-/g, " ").replace(/^\w/, (c) =>
              c.toUpperCase()
            ),
          });
        }
      } catch (err) {
        console.log("Visa Category Fetch Error:", err);
        setVisas([]);
      }
    };

    loadCategoryVisas();
  }, [categorySlug]);

  /* -------------------------------
     ⭐ STEP 2 — Fetch SEO for Visa Category
  ------------------------------- */
  useEffect(() => {
    if (!category?._id) {
      setLoading(false);
      return;
    }

    const loadSEO = async () => {
      try {
        const res = await api.get(API.GET_SEO("visaCategory", category._id));
        setSEO(res.data?.seo || null);
      } catch (err) {
        console.log("SEO Not Found => Using fallbacks");
      } finally {
        setLoading(false);
      }
    };

    loadSEO();
  }, [category]);

  if (loading) return <h2 className="text-center py-10 text-xl">Loading...</h2>;

  if (visas.length === 0)
    return (
      <h2 className="text-center py-14 text-2xl text-red-600">
        No visa packages found under this category.
      </h2>
    );

  /* -------------------------------
     ⭐ STEP 3 — Dynamic SEO Values
  ------------------------------- */
  const pageTitle =
    seo?.seoTitle || `${category?.name} – UAE Visa Services`;

  const pageDesc =
    seo?.seoDescription ||
    `Browse UAE visa packages under ${category?.name}. View details, prices & apply online.`;

  const pageKeywords = seo?.seoKeywords || `${category?.name}, UAE Visa`;

  const ogImage =
    seo?.seoOgImage ||
    visas[0]?.gallery?.[0] ||
    "/visa-banner.png"; // fallback for og but NOT for banner

  const canonicalURL = `https://www.desertplanners.net/visa/${categorySlug}`;

  /* -------------------------------
     ⭐ PAGE RETURN
  ------------------------------- */
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
                acceptedAnswer: {
                  "@type": "Answer",
                  text: f.answer,
                },
              })),
            })}
          </script>
        )}
      </Helmet>
      {/* ⭐⭐⭐ Dynamic SEO End ⭐⭐⭐ */}

      {/* ⭐ FIXED BANNER IMAGE (Always /visa-banner.png) ⭐ */}
      <div className="relative w-full h-[200px] md:h-[260px] lg:h-[320px] rounded-2xl overflow-hidden shadow-lg">
        <img
          src="/visa-banner.png"
          alt={category?.name || "Visa Services"}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase drop-shadow-lg">
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

      {/* Visa Cards */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-0 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {visas.map((v) => (
          <Link
            key={v._id}
            to={`/visa/${categorySlug}/${v.slug}`}
            className="block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition"
          >
            <div className="h-64 overflow-hidden rounded-t-3xl">
              <img
                src={v.gallery?.[0] || v.img}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            <div className="p-6 h-56 flex flex-col">
              <h2 className="text-xl font-bold text-[#e82429] mb-3">
                {v.title}
              </h2>

              <p className="text-gray-700 font-semibold mb-4">
                AED {v.price}
              </p>

              <div className="mt-auto text-center bg-[#404041] hover:bg-[#e82429] text-white py-3 rounded-2xl transition">
                View Visa Details
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
