import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import DataService from "../config/DataService";
import { API } from "../config/API";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import { Helmet } from "react-helmet-async";
import {
  FaClock,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPassport,
  FaListUl,
  FaInfoCircle,
  FaFileUpload,
  FaWhatsapp,
} from "react-icons/fa";

export default function VisaDetails() {
  const { categorySlug, visaSlug } = useParams();
  const [visa, setVisa] = useState(null);
  const [relatedVisas, setRelatedVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = DataService();
  const [seo, setSeo] = useState(null);

  // ✅ Static banner path (use your own image if you want)
  const staticBanner = "/visa_details_banner.jpg";

  // ✅ Fetch Visa Details
  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const res = await api.get(API.GET_VISA_BY_SLUG(visaSlug));

        setVisa(res.data.visa); // 👈 Correct
        setSeo(res.data.seo); // 👈 Optional: For SEO later
      } catch (err) {
        console.error("❌ Error fetching visa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVisa();
  }, [visaSlug]);

  // ✅ Fetch Related Visas
  useEffect(() => {
    if (!visa) return;
    const fetchRelatedVisas = async () => {
      try {
        const res = await api.get(API.GET_VISAS);
        const filtered = (res.data || []).filter((v) => v._id !== visa._id);
        setRelatedVisas(filtered);
      } catch (err) {
        console.error("❌ Error fetching related visas:", err);
        setRelatedVisas([]);
      }
    };
    fetchRelatedVisas();
  }, [visa]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading visa details...
      </div>
    );

  if (!visa)
    return (
      <div className="text-center py-10 text-xl text-red-600">
        Visa not found
      </div>
    );

  return (
    <div className="bg-gray-50 pb-20">
      <Helmet>
        <title>{seo?.seoTitle || visa.title}</title>

        <meta
          name="description"
          content={seo?.seoDescription || visa.overview?.[0] || ""}
        />

        <meta
          name="keywords"
          content={
            seo?.seoKeywords || "uae visa, dubai visa, dubai tourist visa"
          }
        />

        <link
          rel="canonical"
          href={`https://www.desertplanners.net/visa/${categorySlug}/${visaSlug}`}
        />

        {/* OG Tags */}
        <meta property="og:title" content={seo?.seoTitle || visa.title} />
        <meta
          property="og:description"
          content={seo?.seoDescription || visa.overview?.[0]}
        />
        <meta property="og:image" content={seo?.seoOgImage || visa.img} />
        <meta
          property="og:url"
          content={`https://www.desertplanners.net/visa/${categorySlug}/${visaSlug}`}
        />
        <meta property="og:type" content="article" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo?.seoTitle || visa.title} />
        <meta
          name="twitter:description"
          content={seo?.seoDescription || visa.overview?.[0]}
        />
        <meta name="twitter:image" content={seo?.seoOgImage || visa.img} />

        {/* ⭐ PRODUCT SCHEMA for Visa ⭐ */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: seo?.seoTitle || visa.title,
            description: seo?.seoDescription || visa.overview?.[0],
            image: [seo?.seoOgImage || visa.img],
            brand: { "@type": "Brand", name: "Desert Planners" },
            offers: {
              "@type": "Offer",
              url: window.location.href,
              priceCurrency: "AED",
              price: visa.price,
              availability: "https://schema.org/InStock",
            },
          })}
        </script>

        {/* ⭐ FAQ Schema (if available) ⭐ */}
        {seo?.faqs?.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: seo.faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            })}
          </script>
        )}

        {/* ⭐ Breadcrumb ⭐ */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://desertplanners.net",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Visa",
                item: "https://desertplanners.net/visa",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: visa.title,
                item: window.location.href,
              },
            ],
          })}
        </script>
      </Helmet>

      {/* ✅ STATIC HERO SECTION */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={staticBanner}
          alt="Visa Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center uppercase text-white text-center px-4">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold mb-3"
          >
            {visa.title}
          </motion.h1>

          <a
            href="#apply-now"
            className="mt-6 bg-[#e82429] hover:bg-[#721011] text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Apply Now
          </a>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1200px] mx-auto mt-10 px-4 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT SIDE */}
        <div className="lg:col-span-8 space-y-10">
          {/* QUICK FACTS */}
          <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                icon: <FaClock />,
                label: "Processing Time",
                value: visa.processingTime,
              },
              {
                icon: <FaPassport />,
                label: "Visa Type",
                value: visa.visaType,
              },
              {
                icon: <FaListUl />,
                label: "Entry Type",
                value: visa.entryType,
              },
              {
                icon: <FaCheckCircle />,
                label: "Validity",
                value: visa.validity,
              },
              {
                icon: <FaTimesCircle />,
                label: "Stay Duration",
                value: visa.stayDuration,
              },
              {
                icon: <FaInfoCircle />,
                label: "Fees",
                value: `AED ${visa.price}`,
              },
            ].map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow hover:shadow-lg transition flex items-start gap-3"
              >
                <div className="text-[#e82429] text-2xl">{fact.icon}</div>
                <div>
                  <p className="font-semibold text-gray-800">{fact.label}</p>
                  <p className="text-gray-600 text-sm">{fact.value}</p>
                </div>
              </motion.div>
            ))}
          </section>

          {/* OVERVIEW */}
          {visa.overview?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 p-10 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#fff0f0] via-[#ffeaea] to-[#fff5f5] opacity-60 rounded-3xl -z-10" />
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#e82429]/10 rounded-full">
                  <FaInfoCircle className="text-[#e82429] text-2xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#2e2e2e]">
                  Overview
                </h2>
              </div>
              <ul className="space-y-4">
                {visa.overview.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 bg-gradient-to-r from-white to-[#fff7f7] hover:from-[#fff2f2] border border-gray-100 rounded-xl p-4 transition-all hover:shadow-md"
                  >
                    <div className="p-2 bg-[#e82429]/10 rounded-full">
                      <FaCheckCircle className="text-[#e82429]" />
                    </div>
                    <p className="text-gray-700 leading-relaxed">{item}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* HOW TO APPLY */}
          {visa.howToApply?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-white to-[#fff4f4] border border-[#ffe3e3] rounded-3xl shadow-xl p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#e82429]/10 rounded-full">
                  <FaPassport className="text-[#e82429] text-2xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#2e2e2e]">
                  How to Apply
                </h2>
              </div>

              <ol className="relative border-l-2 border-[#e82429]/30 ml-6 space-y-8">
                {visa.howToApply.map((step, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="ml-4 bg-white/70 backdrop-blur-md rounded-xl p-5 border border-gray-100"
                  >
                    <span className="absolute -left-[33px] flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#e82429] to-[#721011] text-white font-semibold shadow-lg">
                      {idx + 1}
                    </span>
                    <p className="text-gray-800 font-medium">{step}</p>
                  </motion.li>
                ))}
              </ol>
            </motion.section>
          )}

          {/* DOCUMENTS */}
          {visa.documents?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 rounded-3xl shadow-lg border border-gray-100 p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#e82429]/10 rounded-full">
                  <FaCheckCircle className="text-[#e82429] text-2xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#2b2b2b]">
                  Required Documents
                </h2>
              </div>
              <ul className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
                {visa.documents.map((doc, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 bg-white/80 border border-gray-100 rounded-2xl p-5"
                  >
                    <div className="p-2 bg-gradient-to-br from-[#e82429] to-[#721011] rounded-lg text-white">
                      <FaCheckCircle className="text-white" />
                    </div>
                    <p className="text-gray-800">{doc}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* TERMS & CONDITIONS */}
          {visa.termsAndConditions?.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-[#fff] via-[#fff7f7] to-[#ffecec] border border-[#ffd6d6] rounded-3xl shadow-xl p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#e82429]/10 rounded-full">
                  <FaCheckCircle className="text-[#e82429] text-2xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#2e2e2e]">
                  Terms & Conditions
                </h2>
              </div>
              <ul className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
                {visa.termsAndConditions.map((t, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-start gap-3 bg-white/80 border border-gray-100 rounded-2xl p-5"
                  >
                    <div className="p-2 bg-[#e82429]/10 rounded-full mt-1">
                      <FaCheckCircle className="text-[#e82429]" />
                    </div>
                    <p className="text-gray-800">{t}</p>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}
          {relatedVisas?.length > 0 && (
            <div className="mt-10">
              <h3 className="font-bold text-xl text-[#2e2e2e] mb-4">
                Related Visa Options
              </h3>

              <Swiper
                modules={[Autoplay]} // 👈 Navigation hat gaya
                navigation={false} // 👈 Left-Right buttons hide
                loop={true} // 👈 Infinite loop ON
                spaceBetween={20}
                slidesPerView={1}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                className="pb-10"
              >
                {relatedVisas.map((rv, i) => (
                  <SwiperSlide key={rv._id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Link
                        to={`/visa/${rv.visaCategory?.slug}/${rv.slug}`}
                        className="block bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-200"
                      >
                        {/* IMAGE */}
                        <div className="relative h-48 w-full overflow-hidden rounded-t-3xl">
                          <img
                            src={
                              rv.gallery?.[0] ||
                              rv.img ||
                              rv.image ||
                              rv.thumbnail ||
                              (rv.images?.length > 0
                                ? rv.images[0]
                                : "/visa-card.jpg")
                            }
                            alt={rv.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                          {rv.processingTime && (
                            <span className="absolute top-3 left-3 bg-[#e82429] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                              <FaClock className="inline-block mr-1 text-[10px]" />
                              {rv.processingTime}
                            </span>
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="p-5 space-y-3">
                          <h4 className="text-lg font-semibold text-[#404041] line-clamp-2">
                            {rv.title}
                          </h4>

                          <p className="text-gray-600 text-sm line-clamp-2">
                            {rv.overview}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <div className="text-[#e82429] font-bold text-lg">
                                AED {rv.price}
                              </div>
                              <p className="text-gray-500 text-xs">
                                per application
                              </p>
                            </div>

                            <span className="text-[#721011] font-bold text-sm flex items-center gap-1">
                              View Details <FaInfoCircle />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          {/* ⭐ VISA FAQ SECTION – SAME DESIGN AS TOUR FAQ */}
          {seo?.faqs?.length > 0 && (
            <div className="bg-gradient-to-br from-[#fff4f4] to-[#ffeaea] rounded-3xl shadow-xl p-8 space-y-8 border border-[#e82429]/20 hover:shadow-2xl transition duration-300">
              {/* Header */}
              <div className="flex items-center gap-2">
                <FaInfoCircle className="text-[#e82429] text-3xl" />
                <h2 className="text-3xl font-extrabold text-[#721011]">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {seo.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="group bg-white border border-[#e82429]/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <details className="p-0">
                      {/* Summary (Question) */}
                      <summary className="cursor-pointer list-none flex items-center justify-between p-5 text-lg font-semibold text-gray-800 group-hover:bg-[#fff4f4] transition-all">
                        <span>{faq.question}</span>

                        {/* Icon */}
                        <span className="text-[#e82429] text-xl transition-transform duration-300 group-open:rotate-180">
                          ▼
                        </span>
                      </summary>

                      {/* Answer */}
                      <div className="px-5 pb-5 text-gray-700 leading-relaxed border-t border-gray-200 bg-white animate-fadeIn">
                        {faq.answer}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="lg:col-span-4">
          <div
            id="apply-now"
            className="sticky top-24 bg-white rounded-3xl shadow-xl p-6 flex flex-col gap-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#404041]">Apply Now</h2>
              <span className="bg-[#e82429] text-white px-3 py-1 rounded-full text-sm">
                Popular
              </span>
            </div>

            <div className="bg-[#fff4f4] p-3 rounded-xl border border-[#e82429]/30 text-sm">
              <div className="flex items-center gap-2">
                <FaClock className="text-[#e82429]" /> Processing:{" "}
                <strong>{visa.processingTime}</strong>
              </div>
            </div>

            <label className="text-sm text-gray-600">Upload Documents</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center text-gray-500 hover:bg-gray-50 transition">
              <FaFileUpload className="mx-auto text-3xl mb-2 text-[#e82429]" />
              <p>Drag & drop files here or click to upload</p>
              <input type="file" multiple className="hidden" />
            </div>

            <Link
              to={`/visa/${categorySlug}/${visaSlug}/apply?visaId=${visa._id}`}
              className="w-full block text-center bg-gradient-to-r from-[#e82429] to-[#721011] text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all"
            >
              Proceed to Apply
            </Link>

            <a
              href="https://wa.me/918003155718"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 text-[#25D366] font-semibold mt-2"
            >
              <FaWhatsapp /> Need Help? Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
