import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";

export default function VisaCategoryPage() {
  const { categorySlug, subCategorySlug } = useParams();

  const [visas, setVisas] = useState([]);
  const [subCategory, setSubCategory] = useState(null);
  const [subCategoryDescription, setSubCategoryDescription] = useState("");
  const [seo, setSEO] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = DataService();
  const fallbackBanner = "/visa-banner.png";
  const fallbackImage = "/visa-banner.png";

  /* ===============================
     STEP 1 — FETCH SUBCATEGORY BY SLUG
  =============================== */
  useEffect(() => {
    const loadSubCategory = async () => {
      try {
        const res = await api.get(
          `/api/visa-sub-categories?categorySlug=${categorySlug}`
        );

        const found = res.data.find((s) => s.slug === subCategorySlug);

        if (found) {
          setSubCategory(found);
          setSubCategoryDescription(found.description || "");
        }
      } catch (err) {
        console.log("SubCategory load error:", err);
      }
    };

    loadSubCategory();
  }, [categorySlug, subCategorySlug]);

  /* ===============================
     STEP 2 — FETCH VISAS
  =============================== */
  useEffect(() => {
    const loadVisas = async () => {
      try {
        const res = await api.get(
          `${API.GET_VISAS}?categorySlug=${categorySlug}&subCategorySlug=${subCategorySlug}`
        );

        const visaList = Array.isArray(res.data)
          ? res.data
          : res.data?.visas || [];

        setVisas(visaList);
      } catch (err) {
        console.log("Visa fetch error:", err);
        setVisas([]);
      }
    };

    loadVisas();
  }, [categorySlug, subCategorySlug]);

  /* ===============================
     STEP 3 — FETCH SEO
  =============================== */
  useEffect(() => {
    if (!subCategory || !subCategory._id) return;

    const loadSEO = async () => {
      try {
        const res = await api.get(
          API.GET_SEO("visaSubCategory", subCategory._id)
        );

        setSEO(res.data?.seo || null);
      } catch {
        console.log("SEO fallback active");
      } finally {
        setLoading(false);
      }
    };

    loadSEO();
  }, [subCategory]);

  if (loading)
    return (
      <div className="text-center py-20 text-xl font-semibold">
        Loading visa packages...
      </div>
    );

  /* ===============================
     SEO FALLBACKS
  =============================== */
  const pageTitle =
    seo?.seoTitle || `${subCategory?.name} Visa Services – Apply Online`;

  const pageDesc =
    seo?.seoDescription ||
    `Apply for ${subCategory?.name} visa with fast approval and expert assistance. View available visa types and pricing.`;

  const pageKeywords =
    seo?.seoKeywords || `${subCategory?.name}, Visa Services, Apply Online`;

  const ogImage = seo?.seoOgImage || visas[0]?.gallery?.[0] || fallbackBanner;

  const canonicalURL = `https://www.desertplanners.net/visa/${categorySlug}/${subCategorySlug}`;

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

        {/* Service Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: pageTitle,
            description: pageDesc,
            provider: {
              "@type": "Organization",
              name: "Desert Planners",
              url: "https://www.desertplanners.net",
            },
            areaServed: subCategory?.name,
          })}
        </script>

        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Visa",
                item: "https://www.desertplanners.net/visa",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: subCategory?.name,
                item: canonicalURL,
              },
            ],
          })}
        </script>
      </Helmet>

      {/* ================= HERO ================= */}
      <div className="relative w-full h-[260px] md:h-[320px] rounded-3xl overflow-hidden shadow-xl bg-black">
        <img
          src={fallbackBanner}
          alt={subCategory?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white uppercase text-center">
            {subCategory?.name} Visa
          </h1>
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      {subCategoryDescription && (
        <section className="bg-gradient-to-b from-[#fffdf9] to-white py-14">
          <div className="max-w-[1200px] mx-auto px-6">
            <div
              className="prose max-w-full"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(subCategoryDescription),
              }}
            />
          </div>
        </section>
      )}

      {/* ================= EMPTY STATE ================= */}
      {/* ================= EMPTY STATE ================= */}
      {!visas.length && (
        <div className="relative py-24 px-6 bg-gradient-to-br from-[#f9fafc] via-white to-[#fff5f5]">
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
            {/* Icon Circle */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#e82429] to-[#721011] flex items-center justify-center text-white text-4xl shadow-lg animate-pulse">
              🌍
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#721011] mb-4">
              Visa Packages Coming Soon
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto mb-8">
              We are currently updating visa options for{" "}
              <span className="font-semibold text-[#e82429]">
                {subCategory?.name}
              </span>
              .
              <br />
              Our team is working hard to bring you the best visa services with
              fast approval & expert support.
            </p>

            {/* Divider */}
            <div className="w-24 h-1 mx-auto mb-8 bg-gradient-to-r from-[#e82429] to-[#721011] rounded-full" />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link
                to="/visa"
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#e82429] to-[#721011] text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition duration-300"
              >
                Explore Other Destinations →
              </Link>

              <Link
                to="/contact-us"
                className="px-8 py-3 rounded-xl border-2 border-[#e82429] text-[#e82429] font-semibold hover:bg-[#e82429] hover:text-white transition duration-300"
              >
                Talk To Visa Expert
              </Link>
            </div>

            {/* Small Note */}
            <p className="text-sm text-gray-400 mt-10">
              Need urgent assistance? Our experts are available 24/7.
            </p>
          </div>
        </div>
      )}

      {/* ================= VISA CARDS ================= */}
      {visas.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {visas.map((v) => (
            <Link
              key={v._id}
              to={`/visa/${categorySlug}/${subCategorySlug}/${v.slug}`}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden"
            >
              <div className="h-64 overflow-hidden">
                <img
                  src={v.gallery?.[0] || v.img || fallbackImage}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-6 flex flex-col h-56">
                <h2 className="text-xl font-bold text-[#721011] mb-3 group-hover:text-[#e82429] transition">
                  {v.title}
                </h2>

                <p className="text-lg font-semibold text-gray-800 mb-4">
                  AED {v.price}
                </p>

                <div className="mt-auto bg-gradient-to-r from-[#e82429] to-[#721011] text-white text-center py-3 rounded-xl font-semibold group-hover:scale-105 transition">
                  View Visa Details →
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
