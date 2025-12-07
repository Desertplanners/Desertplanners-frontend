import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import DataService from "../config/DataService";
import { API } from "../config/API";

import TourBanner from "../components/Tour/TourBanner";
import TourList from "../components/Tour/TourList";
import FaqSection from "../components/Tour/FaqSection";

export default function ToursPage() {
  const [seo, setSEO] = useState(null);

  // ⭐ Fetch SEO for Tours Page
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_SEO("page", "tours"));

        if (res.data?.seo) {
          setSEO(res.data.seo);
        }
      } catch (err) {
        console.log("Tours Page SEO Error:", err);
      }
    };

    fetchSEO();
  }, []);

  return (
    <>
      {/* ⭐⭐⭐ SEO START ⭐⭐⭐ */}
      {seo && (
        <Helmet>
          <title>{seo.seoTitle}</title>
          <meta name="description" content={seo.seoDescription} />
          <meta name="keywords" content={seo.seoKeywords} />
          <link
            rel="canonical"
            href="https://www.desertplanners.net/tours"
          />

          {/* OG Tags */}
          <meta property="og:title" content={seo.seoTitle} />
          <meta property="og:description" content={seo.seoDescription} />
          <meta property="og:image" content={seo.seoOgImage} />
          <meta
            property="og:url"
            content="https://www.desertplanners.net/tours"
          />
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
              url: "https://www.desertplanners.net/tours",
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

      {/* Banner Section */}
      <TourBanner />

      {/* Tour List Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <TourList />
        </div>
      </section>

      {/* Faq Section */}
      <FaqSection />
    </>
  );
}
