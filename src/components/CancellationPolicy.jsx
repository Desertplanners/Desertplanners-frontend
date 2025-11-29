// src/pages/CancellationPolicy.jsx

import { FaArrowLeft, FaFileContract } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function CancellationPolicy() {
  const [seo, setSEO] = useState(null);

  // ⭐ Fetch SEO Dynamically for page "cancellation-policy"
  useEffect(() => {
    const loadSEO = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_SEO("page", "cancellation-refund-policy"));
        if (res.data?.seo) setSEO(res.data.seo);
      } catch (err) {
        console.log("SEO fetch error:", err);
      }
    };

    loadSEO();
  }, []);

  // ⭐ Fallback Values
  const pageTitle =
    seo?.seoTitle || "Cancellation & Refund Policy | Desert Planners UAE";

  const pageDesc =
    seo?.seoDescription ||
    "Learn about the cancellation and refund policies for Desert Planners UAE tours, tickets and holiday packages. Transparent and customer-friendly rules.";

  const pageKeywords = seo?.seoKeywords || "";

  const canonicalURL =
    "https://www.desertplanners.net/cancellation-policy";

  const ogImage =
    seo?.seoOgImage || "/images/dubai-common-banner.jpg";

  return (
    <>
      {/* ⭐⭐⭐ DYNAMIC SEO TAGS ⭐⭐⭐ */}
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
        <meta property="og:type" content="article" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={ogImage} />

        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: pageTitle,
            description: pageDesc,
            url: canonicalURL,
            image: ogImage,
          })}
        </script>

        {/* FAQ Schema (Dynamic) */}
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

      {/* ⭐⭐⭐ PAGE CONTENT ⭐⭐⭐ */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-[#e82429] transition-colors mb-6 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#e82429] rounded-lg">
                <FaFileContract className="text-white text-2xl" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Cancellation & Refund Policy
              </h1>
            </div>

            <p className="text-lg text-gray-600">Desert Planners Tourism LLC</p>
          </div>

          {/* Policy Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-8">

              {/* Cancellation & No-Show */}
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Cancellation & No-Show
                </h2>

                <div className="space-y-3 text-gray-700">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <p>
                      <strong className="text-green-700">Full Refund:</strong> 
                      Cancellations made more than 24 hours before the tour start time.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <p>
                      <strong className="text-red-700">100% Charge:</strong>
                      For no-shows or cancellations within 24 hours.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <p><strong>No Refund:</strong> After the service/tour has started.</p>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <p><strong>Partial Usage:</strong> No refunds for partially used packages.</p>
                  </div>
                </div>
              </section>

              {/* Non-Refundable */}
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Non-Refundable Items
                </h2>

                <div className="space-y-3 text-gray-700">
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p><strong className="text-orange-700">Strictly Non-Refundable:</strong> Dated/specific-time tickets.</p>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p><strong className="text-orange-700">Excursion Tickets:</strong> Non-changeable and non-refundable.</p>
                  </div>
                </div>
              </section>

              {/* Refund Method */}
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Refund Method & Timeline
                </h2>

                <div className="space-y-3 text-gray-700">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p><strong className="text-blue-700">Payment Mode:</strong> Refunds go to original payment method only.</p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p><strong className="text-blue-700">Timeline:</strong> 10–20 working days (bank dependent).</p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p><strong className="text-blue-700">Fees:</strong> Bank & FX charges non-refundable.</p>
                  </div>
                </div>
              </section>

              {/* Rates & Changes */}
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Rates & Changes
                </h2>

                <div className="space-y-3 text-gray-700">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p>Rates subject to change based on season & supplier.</p>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p>Confirmed bookings stay fixed unless guest requests changes.</p>
                  </div>
                </div>
              </section>

              {/* Child Policy */}
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Child & Age Policy
                </h2>

                <div className="space-y-3 text-gray-700">
                  <div className="p-3 bg-teal-50 rounded-lg">
                    <p><strong>Under 3 years:</strong> Free.</p>
                  </div>

                  <div className="p-3 bg-teal-50 rounded-lg">
                    <p><strong>Child Rate:</strong> Applicable up to 10 years.</p>
                  </div>

                  <div className="p-3 bg-teal-50 rounded-lg">
                    <p><strong>Suitability:</strong> All tours suitable unless mentioned.</p>
                  </div>
                </div>
              </section>

              {/* Tour Duration */}
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Tour Duration & Logistics
                </h2>

                <div className="space-y-3 text-gray-700">
                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p>Total duration includes pickup & drop.</p>
                  </div>

                  <div className="p-3 bg-indigo-50 rounded-lg">
                    <p>Pickup window applies for shared tours.</p>
                  </div>
                </div>
              </section>

              {/* Personal Belongings */}
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Personal Belongings
                </h2>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <p>Not responsible for unattended items. Assistance provided where possible.</p>
                </div>
              </section>

              {/* Supplier Fees */}
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Supplier/Operator Fees
                </h2>

                <div className="p-4 bg-rose-50 rounded-lg">
                  <p>Extra supplier/operator charges may apply.</p>
                </div>
              </section>

              {/* Rescheduling */}
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Rescheduling & Amendments
                </h2>

                <div className="space-y-3 text-gray-700">
                  <div className="p-3 bg-cyan-50 rounded-lg">
                    <p><strong>24+ Hours Before:</strong> Allowed with fees/price difference.</p>
                  </div>

                  <div className="p-3 bg-red-50 rounded-lg">
                    <p><strong>Within 24 Hours:</strong> Not allowed.</p>
                  </div>
                </div>
              </section>

              {/* Force Majeure */}
              <section className="border-b border-gray-200 pb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Force Majeure
                </h2>

                <div className="p-4 bg-sky-50 rounded-lg">
                  <p>Full refund or reschedule if cancellation due to natural causes.</p>
                </div>
              </section>

              {/* Definitions */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#e82429] rounded-full"></span>
                  Definitions
                </h2>

                <div className="space-y-3 text-gray-700">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p><strong>Tour Start Time:</strong> Stated on voucher/confirmation.</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p><strong>Working Days:</strong> Excludes UAE weekends & holidays.</p>
                  </div>
                </div>
              </section>

            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              For any questions regarding our cancellation policy, contact{" "}
              <a
                href="mailto:info@desertplanners.net"
                className="text-[#e82429] hover:underline"
              >
                info@desertplanners.net
              </a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
