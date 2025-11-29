import { useState, useEffect } from "react";
import {
  FaShieldAlt,
  FaFileContract,
  FaMoneyBillWave,
  FaPlane,
  FaPassport,
  FaExclamationTriangle,
  FaPhone,
  FaEnvelope,
  FaGlobeAmericas,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function TermsAndConditions() {
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  // ⭐ SEO STATE
  const [seo, setSEO] = useState(null);

  // ⭐ Load SEO → terms-and-conditions page
  useEffect(() => {
    const loadSEO = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_SEO("page", "terms-and-conditions"));

        if (res.data?.seo) setSEO(res.data.seo);
      } catch (err) {
        console.log("SEO Fetch Error:", err);
      }
    };

    loadSEO();
  }, []);

  // ⭐ Canonical URL
  const canonicalURL = "https://www.desertplanners.net/terms-and-conditions";

  // ⭐ CONTENT SECTIONS (unchanged)
  const sections = [
    {
      icon: FaShieldAlt,
      title: "Introduction",
      content:
        "Welcome to Desert Planners Tourism LLC. These Terms & Conditions govern your use of our website and your purchase of our travel, tour, excursion, accommodation, visa and other services. By accessing our Website or booking our Services, you accept these Terms & Conditions in full.",
      warning:
        "If you disagree with any part of these Terms, please do not use the Website or book our Services.",
    },
    {
      icon: FaFileContract,
      title: "Definitions",
      items: [
        "Customer / You / Your: any individual or entity using the Website or engaging our Services.",
        "Booking: reservation made for tours, excursions, accommodation, visa services, etc.",
        "Services: includes all our travel-related offerings.",
        "Price: cost of the Services as confirmed at booking.",
      ],
    },
    {
      icon: FaCheckCircle,
      title: "Booking, Confirmation and Payment",
      content:
        "All bookings must be made through our Website or via direct contact. A booking is confirmed only after written confirmation and payment are received.",
      note: "Payment terms will be specified at booking, and prices are subject to availability until confirmation.",
    },
    {
      icon: FaTimesCircle,
      title: "Changes and Cancellation by Customer",
      content:
        "If you wish to cancel or modify a booking, notify us in writing. Cancellation or change fees may apply depending on timing.",
      warning: "Some services may not be refundable.",
    },
    {
      icon: FaExclamationTriangle,
      title: "Changes or Cancellation by Desert Planners",
      content:
        "We may cancel or modify bookings due to circumstances beyond our control (e.g. weather, supplier issues, visa delays).",
      note: "We will attempt to offer alternatives or refunds but are not liable for additional costs or inconvenience.",
    },
    {
      icon: FaPassport,
      title: "Visa / Travel Documentation",
      content: "You must provide accurate personal information and documentation.",
      warning: "We are not responsible for visa rejections or delays by authorities.",
    },
    {
      icon: FaShieldAlt,
      title: "Liability and Responsibility",
      content:
        "We act as an intermediary for suppliers and are not liable for losses or damages caused by third parties or events beyond our control.",
      note: "Our liability is limited to the amount paid for the affected service.",
    },
    {
      icon: FaPlane,
      title: "Travel Requirements, Health and Safety",
      content:
        "You are responsible for ensuring compliance with entry, visa, and health requirements. You must follow local laws and customs.",
      warning: "We are not liable for non-compliance.",
    },
    {
      icon: FaGlobeAmericas,
      title: "Intellectual Property",
      content:
        "All materials on our Website (text, images, logos, etc.) are protected by intellectual property laws.",
      warning: "You may not reuse content without written consent.",
    },
    {
      icon: FaShieldAlt,
      title: "Privacy",
      content: "We collect personal information to process bookings.",
      note: "See our Privacy Policy for details on data handling.",
    },
    {
      icon: FaMoneyBillWave,
      title: "Pricing, Taxes and Fees",
      content: "Unless stated otherwise, prices exclude applicable taxes or local fees.",
      note: "Any additional charges will be communicated before booking confirmation.",
    },
    {
      icon: FaMoneyBillWave,
      title: "Refunds",
      content: "Refund eligibility depends on service type and cancellation timing.",
      warning:
        "Some services may not be refundable. Refunds will be processed in the same manner as payment.",
    },
    {
      icon: FaGlobeAmericas,
      title: "Governing Law and Dispute Resolution",
      content: "These Terms are governed by UAE law.",
      note: "Disputes will be subject to UAE court jurisdiction.",
    },
    {
      icon: FaFileContract,
      title: "Amendments",
      content: "We may update these Terms & Conditions at any time.",
      note: "Continued use of our Website implies acceptance of the revised terms.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">

      {/* ⭐⭐⭐ FULL DYNAMIC SEO ⭐⭐⭐ */}
      <Helmet>
        <title>{seo?.seoTitle}</title>
        <meta name="description" content={seo?.seoDescription} />
        <meta name="keywords" content={seo?.seoKeywords} />

        <link rel="canonical" href={canonicalURL} />

        {/* OG TAGS */}
        <meta property="og:title" content={seo?.seoTitle} />
        <meta property="og:description" content={seo?.seoDescription} />
        <meta property="og:image" content={seo?.seoOgImage} />
        <meta property="og:url" content={canonicalURL} />
        <meta property="og:type" content="website" />

        {/* TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo?.seoTitle} />
        <meta name="twitter:description" content={seo?.seoDescription} />
        <meta name="twitter:image" content={seo?.seoOgImage} />

        {/* WebPage Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: seo?.seoTitle,
            url: canonicalURL,
            description: seo?.seoDescription,
            image: seo?.seoOgImage,
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
      {/* ⭐⭐⭐ END SEO ⭐⭐⭐ */}

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#e82429] rounded-2xl shadow-lg">
              <FaFileContract className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <div className="bg-white rounded-2xl shadow-sm p-6 inline-block">
            <p className="text-gray-600 text-lg">
              Last updated:{" "}
              <span className="font-semibold text-[#e82429]">{currentDate}</span>
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Easy Booking</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Simple and transparent booking process with instant confirmation
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaShieldAlt className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Secure Payments</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Your payments and personal information are always protected
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaPassport className="text-purple-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Travel Support</h3>
            </div>
            <p className="text-gray-600 text-sm">
              24/7 customer support for all your travel needs
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="border-l-4 border-[#e82429]">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#e82429] rounded-xl shadow-md">
                      <section.icon className="text-white text-xl" />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {index + 1}. {section.title}
                      </h2>

                      {section.content && (
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {section.content}
                        </p>
                      )}

                      {section.items && (
                        <ul className="space-y-3 mb-4">
                          {section.items.map((item, itemIndex) => (
                            <li
                              key={itemIndex}
                              className="flex items-start gap-3"
                            >
                              <div className="w-2 h-2 bg-[#e82429] rounded-full mt-2"></div>
                              <span className="text-gray-700 leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.note && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                          <p className="text-blue-800 text-sm leading-relaxed">
                            💡 <strong>Note:</strong> {section.note}
                          </p>
                        </div>
                      )}

                      {section.warning && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <p className="text-red-800 text-sm leading-relaxed">
                            ⚠️ <strong>Important:</strong> {section.warning}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-[#e82429] to-[#721011] rounded-2xl shadow-2xl p-8 mt-12 text-white">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2">Need Help?</h2>
            <p className="text-red-100">We're here to assist you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-3 bg-white/20 rounded-lg">
                <FaEnvelope className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-red-100">info@desertplanners.net</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-3 bg-white/20 rounded-lg">
                <FaPhone className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-red-100">+971 50 369 4525</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acceptance */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            By using our services, you acknowledge that you have read,
            understood, and agree to our Terms & Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}
