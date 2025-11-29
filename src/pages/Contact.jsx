// src/pages/ContactUs.jsx
import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { API } from "../config/API";
import DataService from "../config/DataService";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    services: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // ⭐ SEO STATE
  const [seo, setSEO] = useState(null);

  // ⭐ Fetch SEO for Contact Us page
  useEffect(() => {
    const loadSEO = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_SEO("page", "contact-us"));
        if (res.data?.seo) setSEO(res.data.seo);
      } catch (err) {
        console.log("SEO fetch error:", err);
      }
    };

    loadSEO();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const api = DataService();
      const response = await api.post(API.CREATE_ENQUIRY, formData);

      if (response.status === 200 || response.status === 201) {
        toast.success("Message submitted! Admin will contact you soon. ✅");
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          services: "",
          message: "",
        });
      } else {
        toast.error(
          response?.data?.message || "Something went wrong. Please try again."
        );
      }
    } catch (err) {
      console.error("❌ Enquiry submission error:", err);
      if (err.response) {
        toast.error(
          err.response.data?.message ||
            "Server responded with an error. Try again later."
        );
      } else {
        toast.error("Network issue or server not reachable.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Canonical URL
  const canonicalURL = "https://www.desertplanners.net/contact-us";

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      
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

        {/* TWITTER TAGS */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo?.seoTitle} />
        <meta name="twitter:description" content={seo?.seoDescription} />
        <meta name="twitter:image" content={seo?.seoOgImage} />

        {/* Website Schema */}
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

      {/* Hero Section */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          alt="Contact Us Banner"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 flex justify-center items-center">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold drop-shadow-lg text-center px-4">
            Get in Touch
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#e82429]/30 rounded-full blur-3xl animate-pulse"></div>
            <h2 className="text-3xl font-bold text-[#721011] relative z-10">
              Contact Form
            </h2>
            <p className="text-gray-600 relative z-10">
              Have questions? Fill out the form below and we'll get back to you!
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              
              {/* Name & Email */}
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e82429] transition-all"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e82429] transition-all"
                  required
                />
              </div>

              {/* Contact Number & Services */}
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Your Contact Number"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e82429] transition-all"
                  required
                />
                <select
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e82429] transition-all"
                  required
                >
                  <option value="">Select a Service</option>
                  <option value="Dubai Tour">Dubai Tour</option>
                  <option value="Holiday Tour">Holiday Tour</option>
                  <option value="Visa Service">Visa Service</option>
                </select>
              </div>

              {/* Message */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 h-40 focus:ring-2 focus:ring-[#e82429] transition-all"
                required
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-[#e82429] to-[#721011] text-white py-3 font-semibold rounded-xl shadow-lg hover:scale-105 transition-all ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {[
            {
              icon: <FaMapMarkerAlt className="text-[#e82429] text-3xl" />,
              title: "Address",
              text: "Desert Planners Tourism LLC\nP.O. Box: 43710, Dubai, UAE",
            },
            {
              icon: <FaPhoneAlt className="text-[#e82429] text-3xl" />,
              title: "Phone",
              text: "+97143546677",
            },
            {
              icon: <FaEnvelope className="text-[#e82429] text-3xl" />,
              title: "Email",
              text: "info@desertplanners.net",
            },
            {
              icon: <FaClock className="text-[#e82429] text-3xl" />,
              title: "Hours",
              text: "Mon - Fri: 9:00 AM - 6:00 PM",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-2xl hover:shadow-3xl transition-all"
            >
              <div className="p-4 bg-[#e82429]/20 rounded-full">{card.icon}</div>
              <div>
                <h3 className="font-bold text-[#721011] text-lg">
                  {card.title}
                </h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {card.text}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Map */}
      <div className="w-full mt-10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12..."
          width="100%"
          height="400"
          className="border-0"
          loading="lazy"
          title="Google Map"
          allowFullScreen
        ></iframe>
      </div>

    </div>
  );
}
