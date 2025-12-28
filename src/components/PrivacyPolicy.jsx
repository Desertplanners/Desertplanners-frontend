import { useState, useEffect } from "react";
import { 
  FaShieldAlt, 
  FaDatabase,
  FaEye,
  FaShareAlt,
  FaLock,
  FaUserShield,
  FaLink,
  FaChild,
  FaSync,
  FaEnvelope,
  FaPhone,
  FaGlobeAmericas,
  FaCookie
} from 'react-icons/fa';
import { Helmet } from "react-helmet-async";
import DataService from "../config/DataService";
import { API } from "../config/API";

export default function PrivacyPolicy() {

  // ⭐ Date
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  // ⭐ SEO State
  const [seo, setSEO] = useState(null);

  // ⭐ Load SEO for privacy-policy page
  useEffect(() => {
    const loadSEO = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_SEO("page", "privacy-policy"));

        if (res.data?.seo) setSEO(res.data.seo);
      } catch (err) {
        console.log("SEO fetch failed:", err);
      }
    };

    loadSEO();
  }, []);

  // ⭐ Canonical URL
  const canonicalURL = "https://www.desertplanners.net/privacy-policy";

  // ⭐ CONTENT SECTIONS (unchanged)
  const sections = [
    {
      icon: FaShieldAlt,
      title: "Introduction",
      content:
        "Welcome to Desert Planners Tourism LLC. We are committed to protecting your privacy and ensuring that your personal information is handled responsibly and transparently.",
      note:
        "This Privacy Policy explains how we collect, use, store, and protect your data when you visit our website or use our services, including tours, visa assistance, hotel bookings, and travel arrangements.",
    },
    {
      icon: FaDatabase,
      title: "Information We Collect",
      items: [
        "Personal Information: Name, contact details, passport information, payment details, travel preferences",
        "Non-Personal Information: Browser type, IP address, device information, usage data, cookies",
      ],
    },
    {
      icon: FaDatabase,
      title: "How We Collect Your Information",
      items: [
        "Online forms (booking forms, contact forms, registration)",
        "Email or phone communications",
        "Newsletter signups and subscriptions",
        "Payment transactions and processing",
        "Social media interactions and engagements",
      ],
    },
    {
      icon: FaEye,
      title: "How We Use Your Information",
      items: [
        "Process and confirm your bookings and reservations",
        "Provide customer support and assistance",
        "Send booking confirmations, updates, and important notices",
        "Improve our services and user experience",
        "Comply with legal and regulatory requirements",
        "Send promotional offers (only with your consent)",
      ],
    },
    {
      icon: FaShareAlt,
      title: "Data Sharing and Disclosure",
      content:
        "We may share your data with trusted third parties solely for service fulfillment and legal compliance.",
      items: [
        "Travel Partners: Hotels, tour operators, transportation providers",
        "Payment Processors: Secure payment processing services",
        "Government Authorities: Visa processing and legal compliance",
        "IT Service Providers: Website maintenance and data storage",
      ],
      warning:
        "We do not sell or trade your personal data to third parties for marketing purposes.",
    },
    {
      icon: FaDatabase,
      title: "Data Retention",
      content:
        "We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected.",
      note:
        "After the retention period, your data is securely deleted or anonymized. We follow UAE data protection regulations for specific retention periods.",
    },
    {
      icon: FaCookie,
      title: "Cookies and Tracking Technologies",
      content:
        "Our website uses cookies and similar technologies to enhance your browsing experience and analyze website traffic.",
      items: [
        "Essential Cookies: Required for basic website functionality",
        "Analytics Cookies: Help us understand how visitors use our site",
        "Marketing Cookies: Used to display relevant advertisements",
      ],
      note:
        "You can control cookie settings through your browser, but disabling cookies may affect website functionality.",
    },
    {
      icon: FaLock,
      title: "Data Security",
      items: [
        "SSL encryption for all data transmission",
        "Secure servers with advanced firewalls",
        "Restricted access to personal data",
        "Regular security audits and updates",
        "Employee training on data protection protocols",
      ],
      warning:
        "While we implement robust security measures, no online system can guarantee 100% security.",
    },
    {
      icon: FaUserShield,
      title: "Your Rights",
      items: [
        "Access: Request a copy of your personal data we hold",
        "Correction: Update or correct inaccurate information",
        "Deletion: Request deletion of your personal data",
        "Restriction: Limit how we use your data",
        "Withdraw Consent: Opt-out of marketing communications at any time",
      ],
      note: "To exercise your rights, contact us at info@desertplanners.net",
    },
    {
      icon: FaLink,
      title: "Third-Party Links",
      content: "Our website may contain links to external websites and services.",
      warning:
        "We are not responsible for the privacy practices or content of these third-party sites. Please review their privacy policies separately.",
    },
    {
      icon: FaChild,
      title: "Children's Privacy",
      content: "Our services are not directed at individuals under the age of 18.",
      warning:
        "We do not knowingly collect or process personal data from children. If we become aware of such collection, we will take steps to delete the information immediately.",
    },
    {
      icon: FaSync,
      title: "Changes to This Policy",
      content:
        "We may update this Privacy Policy to reflect changes in our practices or legal requirements.",
      note:
        "The latest version will always be posted on our website with the updated effective date. We encourage you to review this policy periodically.",
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

        {/* Schema */}
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
              <FaShieldAlt className="text-white text-3xl" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <div className="bg-white rounded-2xl shadow-sm p-6 inline-block">
            <p className="text-gray-600 text-lg">
              Last updated:{" "}
              <span className="font-semibold text-[#e82429]">
                {currentDate}
              </span>
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaLock className="text-green-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Data Protection</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Your personal information is encrypted and securely stored
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUserShield className="text-blue-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">Your Control</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Full control over your data and privacy preferences
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaShareAlt className="text-purple-600 text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900">No Data Selling</h3>
            </div>
            <p className="text-gray-600 text-sm">
              We never sell your data to third parties
            </p>
          </div>
        </div>

        {/* Privacy Sections */}
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
            <h2 className="text-3xl font-bold mb-2">Privacy Questions?</h2>
            <p className="text-red-100">
              Contact our privacy team for any concerns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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

            <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-3 bg-white/20 rounded-lg">
                <FaGlobeAmericas className="text-xl" />
              </div>
              <div>
                <h3 className="font-semibold">Visit Us</h3>
                <p className="text-red-100">desertplanners.net</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acceptance Note */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            By using our services, you acknowledge that you have read,
            understood, and agree to our Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
