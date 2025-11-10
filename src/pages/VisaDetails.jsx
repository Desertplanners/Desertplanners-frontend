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
  FaStar,
  FaFileUpload,
  FaWhatsapp,
  FaUserCircle,
} from "react-icons/fa";

export default function VisaDetails() {
  // ✅ Corrected Params
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
              { icon: <FaClock />, label: "Processing Time", value: visa.processingTime },
              { icon: <FaPassport />, label: "Visa Type", value: visa.visaType },
              { icon: <FaListUl />, label: "Entry Type", value: visa.entryType },
              { icon: <FaCheckCircle />, label: "Validity", value: visa.validity },
              { icon: <FaTimesCircle />, label: "Stay Duration", value: visa.stayDuration },
              { icon: <FaInfoCircle />, label: "Fees", value: `AED ${visa.price}` },
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
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-md p-8 space-y-4"
          >
            <h2 className="text-2xl font-bold text-[#404041] flex items-center gap-2">
              <FaInfoCircle className="text-[#e82429]" /> Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-5 items-start">
              <div>
                <p className="text-gray-700 leading-relaxed">{visa.overview}</p>
                <p className="text-gray-700 leading-relaxed mt-3">{visa.details}</p>
              </div>
              <img
                src={visa.gallery?.[0] || "/fallback-image.jpg"}
                alt={visa.title}
                className="w-full h-60 object-cover rounded-2xl shadow"
              />
            </div>
          </motion.section>

          {/* DOCUMENTS */}
          <section className="bg-gradient-to-br from-[#fff4f4] to-[#ffeaea] rounded-2xl shadow p-8">
            <h2 className="text-2xl font-bold text-[#721011] mb-4">
              Required Documents
            </h2>
            <ul className="space-y-3 text-gray-700">
              {(visa.documents || []).map((doc, i) => (
                <li key={i} className="flex items-center gap-2">
                  <FaCheckCircle className="text-[#e82429]" /> {doc}
                </li>
              ))}
            </ul>
          </section>
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
          </div>
        </div>
      </div>
    </div>
  );
}
