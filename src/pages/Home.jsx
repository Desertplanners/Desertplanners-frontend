import BannerSection from "../components/Home/BannerSection";
import HolidayPackages from "../components/Home/HolidayPackages";
import PopularExperiences from "../components/Home/PopularExperiences";
import TestimonialSection from "../components/Home/TestimonialSection";
import TopAttractions from "../components/Home/TopAttractions";
import TopCities from "../components/Home/TopCities";
import TopThingsToDo from "../components/Home/TopThingsToDo";
import TravelInspiration from "../components/Home/TravelInspiration";
import UAEVisaServices from "../components/Home/UAEVisaServices";
import WhyBookWithUs from "../components/Home/WhyBookWithUs";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";

export default function Home() {
  const [seo, setSEO] = useState(null);

  // ⭐ Fetch Home Page SEO from backend
  useEffect(() => {
    const loadSEO = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_SEO("page", "home"));
        if (res.data?.seo) setSEO(res.data.seo);
      } catch (err) {
        console.log("SEO fetch error:", err);
      }
    };

    loadSEO();
  }, []);

  // ⭐ Fallbacks
  const pageTitle =
    seo?.seoTitle || "Dubai Tours, Attractions & Visa Services | Desert Planners UAE";

  const pageDesc =
    seo?.seoDescription ||
    "Explore Dubai tours, desert safaris, attractions, and UAE visa services with Desert Planners.";

  const pageKeywords =
    seo?.seoKeywords ||
    " ";

  const canonicalURL = "https://www.desertplanners.net/";

  const ogImage =
    seo?.seoOgImage || "/images/dubai-common-banner.jpg";

  return (
    <>
      {/* ⭐⭐⭐ HOME PAGE SEO ⭐⭐⭐ */}
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

        {/* ⭐ Schema — Home Page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: pageTitle,
            url: canonicalURL,
            description: pageDesc,
            image: ogImage,
            publisher: {
              "@type": "Organization",
              name: "Desert Planners UAE",
              logo: ogImage,
            },
          })}
        </script>

        {/* ⭐ FAQ Schema (if available) */}
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
      {/* ⭐⭐⭐ END SEO ⭐⭐⭐ */}

      <BannerSection />
      <TopCities />
      <TopAttractions />
      <PopularExperiences />
      <UAEVisaServices />
      <WhyBookWithUs />
      <TravelInspiration />
      <TestimonialSection />
    </>
  );
}
