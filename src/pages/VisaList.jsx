import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";

export default function VisaCategoryPage() {
  const { categorySlug } = useParams();

  const [visas, setVisas] = useState([]);
  const [category, setCategory] = useState(null);

  const [categoryDescription, setCategoryDescription] = useState(""); // ⭐ NEW
  const [seo, setSEO] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = DataService();
  const fallbackBanner = "/visa-banner.png";

  /* -------------------------------
     ⭐ STEP 1 — Fetch Visas by Category
  ------------------------------- */
  useEffect(() => {
    const loadCategoryVisas = async () => {
      try {
        const res = await api.get(
          `${API.GET_VISAS}?categorySlug=${categorySlug}`
        );

        const visaList = Array.isArray(res.data)
          ? res.data
          : res.data.visas || [];

        setVisas(visaList);

        if (visaList.length > 0 && visaList[0].visaCategory) {
          setCategory(visaList[0].visaCategory);
        } else {
          setCategory({
            name: categorySlug
              .replace(/-/g, " ")
              .replace(/^\w/, (c) => c.toUpperCase()),
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
     ⭐ STEP 2 — Fetch Visa Category Description (IMPORTANT)
  ------------------------------- */
  useEffect(() => {
    if (!category?._id) return;

    const fetchCategoryContent = async () => {
      try {
        const res = await api.get(
          API.GET_VISA_CATEGORY_BY_ID(category._id)
        );
        setCategoryDescription(res.data?.description || "");
      } catch (err) {
        console.error("Failed to load visa category description", err);
      }
    };

    fetchCategoryContent();
  }, [category]);

  /* -------------------------------
     ⭐ STEP 3 — Fetch SEO
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
      } catch {
        console.log("SEO Not Found => Using fallbacks");
      } finally {
        setLoading(false);
      }
    };

    loadSEO();
  }, [category]);

  if (loading)
    return <h2 className="text-center py-10 text-xl">Loading...</h2>;

  if (visas.length === 0)
    return (
      <h2 className="text-center py-14 text-2xl text-red-600">
        No visa packages found under this category.
      </h2>
    );

  /* -------------------------------
     ⭐ SEO FALLBACKS
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
    fallbackBanner;

  const canonicalURL = `https://www.desertplanners.net/visa/${categorySlug}`;

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
      <div className="relative w-full h-[200px] md:h-[260px] lg:h-[320px] rounded-2xl overflow-hidden shadow-lg bg-black">
        <img
          src={fallbackBanner}
          alt={category?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white uppercase">
            {category?.name}
          </h1>
        </div>
      </div>

      {/* ================= CATEGORY DESCRIPTION (⭐ SAME AS TOUR CATEGORY ⭐) ================= */}
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

      {/* ================= VISA CARDS ================= */}
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
