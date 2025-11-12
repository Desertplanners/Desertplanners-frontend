// src/pages/VisaDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import DataService from "../config/DataService";
import { API } from "../config/API";
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
  const [mainImage, setMainImage] = useState("");
  const [relatedVisas, setRelatedVisas] = useState([]);
  const [loading, setLoading] = useState(true);
  const api = DataService();

  // ✅ Fetch Visa Details
  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const res = await api.get(API.GET_VISA_BY_SLUG(visaSlug));
        setVisa(res.data);
        setMainImage(res.data.gallery?.[0] || res.data.img);
      } catch (err) {
        console.error("Error fetching visa:", err);
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
        console.error("Error fetching related visas:", err);
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
      {/* HERO SECTION */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={mainImage}
          alt={visa.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center px-4">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-extrabold mb-3"
          >
            {visa.title}
          </motion.h1>
          <p className="text-lg flex items-center gap-2 justify-center">
            <FaMapMarkerAlt /> United Arab Emirates
          </p>
          <a
            href="#apply-now"
            className="mt-6 bg-[#e82429] hover:bg-[#721011] text-white px-6 py-3 rounded-full font-semibold transition"
          >
            Apply Now
          </a>
        </div>
      </div>

      {/* IMAGE GALLERY */}
      {visa.gallery && visa.gallery.length > 1 && (
        <div className="max-w-[1200px] mx-auto px-4 mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {visa.gallery.map((img, idx) => (
            <motion.img
              key={idx}
              src={img}
              alt={`${visa.title} ${idx + 1}`}
              className={`w-full h-28 object-cover rounded-xl cursor-pointer border-2 transition ${
                mainImage === img ? "border-[#e82429]" : "border-transparent"
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      )}

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

          {/* OVERVIEW (list) */}
          {visa.overview && visa.overview.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 p-10 overflow-hidden"
            >
              {/* Gradient Accent Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#fff0f0] via-[#ffeaea] to-[#fff5f5] opacity-60 rounded-3xl -z-10" />

              {/* Heading */}
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#e82429]/10 rounded-full">
                  <FaInfoCircle className="text-[#e82429] text-2xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#2e2e2e] tracking-tight">
                  Overview
                </h2>
              </div>

              {/* Description List */}
              <ul className="space-y-4">
                {visa.overview.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex items-start gap-3 bg-gradient-to-r from-white to-[#fff7f7] hover:from-[#fff2f2] hover:to-white border border-gray-100 rounded-xl p-4 transition-all duration-300 hover:shadow-md"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="p-2 bg-[#e82429]/10 rounded-full group-hover:scale-110 transition-transform">
                        <FaCheckCircle className="text-[#e82429]" />
                      </div>
                    </div>

                    {/* Text */}
                    <p className="text-gray-700 leading-relaxed text-[15px]">
                      {item}
                    </p>
                  </motion.li>
                ))}
              </ul>

              {/* Decorative corner gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#e82429]/10 blur-3xl rounded-full -z-10" />
            </motion.section>
          )}

          {/* HOW TO APPLY */}
          {visa.howToApply && visa.howToApply.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-white to-[#fff4f4] border border-[#ffe3e3] rounded-3xl shadow-xl p-10 overflow-hidden"
            >
              {/* background glow */}
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-[#e82429]/10 blur-3xl rounded-full -z-10" />

              {/* heading */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#e82429]/10 rounded-full">
                  <FaPassport className="text-[#e82429] text-2xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#2e2e2e] tracking-tight">
                  How to Apply
                </h2>
              </div>

              {/* steps */}
              <ol className="relative border-l-2 border-[#e82429]/30 ml-6 space-y-8">
                {visa.howToApply.map((step, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="ml-4 relative bg-white/70 backdrop-blur-md rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-100 transition-all"
                  >
                    {/* number bubble */}
                    <span className="absolute -left-[33px] flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#e82429] to-[#721011] text-white font-semibold shadow-lg">
                      {idx + 1}
                    </span>

                    {/* step text */}
                    <p className="text-gray-800 font-medium leading-relaxed">
                      {step}
                    </p>
                  </motion.li>
                ))}
              </ol>

              {/* decorative corner glow */}
              <div className="absolute bottom-0 left-0 w-52 h-52 bg-[#721011]/5 blur-3xl -z-10" />
            </motion.section>
          )}

          {/* DOCUMENTS */}
          {visa.documents && visa.documents.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg border border-gray-100 p-10 relative overflow-hidden"
            >
              {/* gradient glow */}
              <div className="absolute -top-10 -right-10 w-60 h-60 bg-gradient-to-br from-[#e82429]/10 to-[#721011]/10 blur-3xl rounded-full -z-10" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tl from-[#e82429]/10 to-[#721011]/5 blur-3xl rounded-full -z-10" />

              {/* header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#e82429]/10 rounded-full">
                    <FaCheckCircle className="text-[#e82429] text-2xl" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#2b2b2b]">
                    Required Documents
                  </h2>
                </div>
                <span className="text-sm uppercase tracking-widest text-[#e82429]/70 font-semibold">
                  Must Have Before Apply
                </span>
              </div>

              {/* documents list */}
              <ul className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
                {visa.documents.map((doc, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 bg-white/80 border border-gray-100 rounded-2xl p-5 hover:border-[#e82429]/40 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-2 bg-gradient-to-br from-[#e82429] to-[#721011] rounded-lg text-white shadow">
                      <FaCheckCircle className="text-white" />
                    </div>
                    <p className="text-gray-800 text-[15.5px] leading-relaxed font-medium">
                      {doc}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* fallback message (if empty) */}
          {(!visa.documents || !visa.documents.length) && (
            <section className="bg-white/60 backdrop-blur-md rounded-3xl shadow p-8 text-center text-gray-500 italic border">
              Documents details will be shared after submission.
            </section>
          )}
          {/* TERMS & CONDITIONS */}
          {visa.termsAndConditions && visa.termsAndConditions.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-br from-[#fff] via-[#fff7f7] to-[#ffecec] border border-[#ffd6d6] rounded-3xl shadow-xl p-10 overflow-hidden"
            >
              {/* soft gradient glow */}
              <div className="absolute -top-10 right-0 w-64 h-64 bg-[#e82429]/10 blur-3xl rounded-full -z-10" />

              {/* section heading */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#e82429]/10 rounded-full">
                  <FaCheckCircle className="text-[#e82429] text-2xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-[#2e2e2e] tracking-tight">
                  Terms & Conditions
                </h2>
              </div>

              {/* list items */}
              <ul className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
                {visa.termsAndConditions.map((t, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="relative flex items-start gap-3 bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-gray-100 hover:border-[#e82429]/40 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* icon bubble */}
                    <div className="p-2 bg-[#e82429]/10 rounded-full mt-1">
                      <FaCheckCircle className="text-[#e82429]" />
                    </div>

                    {/* condition text */}
                    <p className="text-gray-800 text-[15.5px] leading-relaxed">
                      {t}
                    </p>

                    {/* subtle glow */}
                    <span className="absolute top-0 right-0 w-2 h-2 bg-[#e82429]/30 rounded-full animate-pulse" />
                  </motion.li>
                ))}
              </ul>

              {/* decorative corner glow */}
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#721011]/5 blur-3xl -z-10" />
            </motion.section>
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

            <button className="w-full bg-gradient-to-r from-[#e82429] to-[#721011] text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all">
              Proceed to Apply
            </button>

            <a
              href="https://wa.me/918003155718"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 text-[#25D366] font-semibold mt-2"
            >
              <FaWhatsapp /> Need Help? Chat on WhatsApp
            </a>

            {/* related visas short list */}
            {relatedVisas && relatedVisas.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  You may also need
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {relatedVisas.slice(0, 5).map((rv) => (
                    <Link
                      key={rv._id}
                      to={`/visa/${rv.visaCategory?.slug || "uae"}/${rv.slug}`}
                      className="flex justify-between items-center text-sm text-gray-600 hover:text-[#e82429]"
                    >
                      <span>{rv.title}</span>
                      <span className="font-semibold text-gray-800">
                        AED {rv.price}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
