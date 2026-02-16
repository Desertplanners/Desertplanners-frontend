import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";

export default function VisaSubCategoryPage() {
  const { categorySlug } = useParams();

  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [categoryDescription, setCategoryDescription] = useState("");
  const [seo, setSEO] = useState(null);
  const [loading, setLoading] = useState(true);

  const api = DataService();
  const fallbackImage = "/visa-banner.png";

  /* ================= GET CATEGORY ================= */
  useEffect(() => {
    const loadCategory = async () => {
      try {
        const res = await api.get(API.GET_VISA_CATEGORIES);
        const found = res.data.find((c) => c.slug === categorySlug);

        if (found) {
          setCategory(found);

          const detail = await api.get(API.GET_VISA_CATEGORY_BY_ID(found._id));
          setCategoryDescription(detail.data?.description || "");
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadCategory();
  }, [categorySlug]);

  /* ================= GET SUBCATEGORIES ================= */
  useEffect(() => {
    const loadSubCategories = async () => {
      try {
        const res = await api.get(
          `/api/visa-sub-categories?categorySlug=${categorySlug}`
        );
        setSubCategories(res.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    loadSubCategories();
  }, [categorySlug]);

  /* ================= GET SEO ================= */
  useEffect(() => {
    if (!category?._id) return;

    const fetchSEO = async () => {
      try {
        const res = await api.get(API.GET_SEO("visaCategory", category._id));
        setSEO(res.data?.seo || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSEO();
  }, [category]);

  if (loading)
    return <div className="pt-20 pb-12 text-center text-xl">Loading...</div>;

  /* ================= SEO ================= */
  const pageTitle =
    seo?.seoTitle || `${category?.name} Visa Services – Desert Planners`;

  const pageDesc =
    seo?.seoDescription ||
    `Explore ${category?.name} visa services with fast processing & expert support.`;

  const pageKeywords = seo?.seoKeywords || `${category?.name}, Visa Services`;

  const canonicalURL = `https://www.desertplanners.net/visa/${categorySlug}`;
  const ogImage = seo?.seoOgImage || fallbackImage;

  /* ================= SCHEMA ================= */

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.desertplanners.net",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Visa",
        item: "https://www.desertplanners.net/visa",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category?.name,
        item: canonicalURL,
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: subCategories.map((sub, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: sub.name,
      url: `${canonicalURL}/${sub.slug}`,
    })),
  };

  const faqSchema =
    seo?.faqs?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: seo.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9fafc] via-white to-[#fff5f5]">
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

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>

        {faqSchema && (
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        )}
      </Helmet>

      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-r from-[#721011] to-[#e82429] py-20 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          {category?.name} Visa Services
        </h1>
        <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
          Choose your destination country and explore available visa options.
        </p>
      </div>

      {/* ================= CATEGORY DESCRIPTION (TOUR STYLE) ================= */}
      {categoryDescription && (
        <section className="w-full bg-gradient-to-b from-[#fffdf9] via-[#f7f3ee] to-[#ffffff]">
          <div className="max-w-[1200px] mx-auto px-4 pt-10 pb-4">
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

      {/* ================= SUBCATEGORY CARDS ================= */}
      {subCategories.length === 0 ? (
        <div className="text-center text-gray-500 text-xl py-16">
          No visa destinations available.
        </div>
      ) : (
        <div className="max-w-[1300px] mx-auto px-6 pt-4 pb-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {subCategories.map((sub) => (
              <Link
                key={sub._id}
                to={`/visa/${categorySlug}/${sub.slug}`}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                {/* FLAG IMAGE */}
                <div className="h-56 flex items-center justify-center bg-gradient-to-br from-white to-gray-100 overflow-hidden">
                  {sub.countryCode ? (
                    <img
                      src={`https://flagcdn.com/w640/${sub.countryCode.toLowerCase()}.png`}
                      alt={sub.name}
                      className="h-32 object-contain drop-shadow-xl group-hover:scale-110 transition duration-700"
                    />
                  ) : (
                    <div className="text-gray-400">No Flag</div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-6 text-center">
                  <h2 className="text-2xl font-bold text-[#721011] mb-2 group-hover:text-[#e82429] transition">
                    {sub.name}
                  </h2>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {sub.description ||
                      `Apply for ${sub.name} visa with fast processing & expert support.`}
                  </p>

                  <div className="mt-5 inline-block bg-gradient-to-r from-[#e82429] to-[#721011] text-white px-5 py-2 rounded-full text-sm font-medium shadow-md group-hover:scale-105 transition">
                    View Visa Options →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
