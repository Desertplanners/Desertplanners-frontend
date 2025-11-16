import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  FaUpload,
  FaUser,
  FaPassport,
  FaPlane,
  FaFileAlt,
} from "react-icons/fa";

import DataService from "../config/DataService";
import { API } from "../config/API";
import toast from "react-hot-toast";

// --------------------------------------------------------
// PURE MEMOIZED INPUT COMPONENT (NO FOCUS LOSS)
// --------------------------------------------------------
const FormInput = React.memo(({ label, name, type = "text", value, onChange }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-[#404041]">
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        className="px-4 py-3 rounded-xl bg-white border border-gray-300 
                   outline-none focus:border-[#e82429] transition-all"
      />
    </div>
  );
});

// --------------------------------------------------------
// PURE FILE UPLOAD COMPONENT
// --------------------------------------------------------
const FileUpload = React.memo(({ label, name, onChange }) => {
  return (
    <label
      className="border-2 border-dashed border-gray-400 rounded-xl p-6
                 flex flex-col gap-2 items-center cursor-pointer
                 hover:border-[#e82429] hover:bg-[#e8242908] transition"
    >
      <FaUpload className="text-[#e82429] text-2xl" />
      <span className="text-gray-600 text-sm">{label}</span>
      <input
        type="file"
        className="hidden"
        onChange={(e) => onChange(name, e.target.files[0])}
      />
    </label>
  );
});

export default function VisaBooking() {
  const [fields, setFields] = useState({});
  const [files, setFiles] = useState({});
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const visaId = params.get("visaId");

  const api = DataService();

  // --------------------------------------------------------
  // FETCH VISA DETAILS BY ID
  // --------------------------------------------------------
  useEffect(() => {
    if (!visaId) return;

    const fetchVisa = async () => {
      try {
        const res = await api.get(API.GET_VISA_BY_ID(visaId));

        if (!res.data?.visa) {
          console.error("Visa not found");
          return;
        }

        const v = res.data.visa;
        setSelectedVisa(v);

        // Auto-fill required booking fields
        setFields((prev) => ({
          ...prev,
          visaId,
          visaTitle: v.title,
          totalPrice: v.price,
          processingTime: v.processingTime,
        }));
      } catch (err) {
        console.error("❌ Visa fetch error:", err);
      }
    };

    fetchVisa();
  }, [visaId]);

  // --------------------------------------------------------
  // INPUT HANDLERS
  // --------------------------------------------------------
  const handleChange = useCallback((key, val) => {
    setFields((prev) => ({ ...prev, [key]: val }));
  }, []);

  const handleFile = useCallback((key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  }, []);

  // --------------------------------------------------------
  // SUBMIT BOOKING + PAYMENT
  // --------------------------------------------------------
  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (!selectedVisa) return toast.error("Visa not loaded!");

      const formData = new FormData();

      // attach text fields
      Object.keys(fields).forEach((key) => {
        formData.append(key, fields[key]);
      });

      // attach file fields
      Object.keys(files).forEach((key) => {
        formData.append(key, files[key]);
      });

      const guest = DataService("guest");

      // 1️⃣ CREATE VISA BOOKING
      const bookingRes = await guest.post(API.CREATE_VISA_BOOKING, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const booking = bookingRes.data?.booking;
      if (!booking) return toast.error("Booking failed!");

      // 2️⃣ CREATE VISA PAYMENT
      const payRes = await guest.post(API.CREATE_VISA_PAYMENT, {
        bookingId: booking._id,
      });

      const link = payRes.data?.paymentLink;
      if (!link) return toast.error("Payment link failed!");

      // 3️⃣ REDIRECT
      window.location.href = link;
    } catch (err) {
      console.error("❌ Submit Error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------
  // UI STARTS HERE
  // --------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-[#fafafa] py-16 px-6"
    >
      {/* VISA SUMMARY CARD */}
      {selectedVisa && (
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 mb-10 border border-gray-200">
          <h2 className="text-2xl font-bold text-[#721011] mb-2">
            You are applying for:
          </h2>

          <div className="flex justify-between text-lg">
            <p>
              <strong>Visa:</strong> {selectedVisa.title}
            </p>
            <p>
              <strong>Price:</strong> AED {selectedVisa.price}
            </p>
          </div>

          <div className="text-gray-600 mt-2">
            <strong>Processing:</strong> {selectedVisa.processingTime}
          </div>
        </div>
      )}

      {/* FORM CARD */}
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-10 border">

        <h1 className="text-3xl font-bold text-[#721011] mb-8">
          Visa Application Form
        </h1>

        {/* PERSONAL DETAILS */}
        <div className="grid md:grid-cols-2 gap-8">
          <FormInput label="Full Name" name="fullName" value={fields.fullName} onChange={handleChange} />
          <FormInput label="Email" name="email" value={fields.email} onChange={handleChange} />
          <FormInput label="Phone Number" name="phone" value={fields.phone} onChange={handleChange} />
          <FormInput label="WhatsApp Number" name="whatsapp" value={fields.whatsapp} onChange={handleChange} />
          <FormInput label="Date of Birth" name="dob" type="date" value={fields.dob} onChange={handleChange} />
          <FormInput label="Gender" name="gender" value={fields.gender} onChange={handleChange} />
        </div>

        {/* PASSPORT */}
        <div className="my-10 h-[1px] bg-gray-200" />
        <div className="grid md:grid-cols-2 gap-8">
          <FormInput label="Passport Number" name="passportNumber" value={fields.passportNumber} onChange={handleChange} />
          <FormInput label="Issue Place" name="issuePlace" value={fields.issuePlace} onChange={handleChange} />
          <FormInput label="Issue Date" name="issueDate" type="date" value={fields.issueDate} onChange={handleChange} />
          <FormInput label="Expiry Date" name="expiryDate" type="date" value={fields.expiryDate} onChange={handleChange} />
        </div>

        {/* TRAVEL INFO */}
        <div className="my-10 h-[1px] bg-gray-200" />
        <div className="grid md:grid-cols-2 gap-8">
          <FormInput label="Entry Date" name="entryDate" type="date" value={fields.entryDate} onChange={handleChange} />
          <FormInput label="Return Date" name="returnDate" type="date" value={fields.returnDate} onChange={handleChange} />
          <FormInput label="Visa Type" name="visaType" value={fields.visaType} onChange={handleChange} />
          <FormInput label="Purpose of Visit" name="purpose" value={fields.purpose} onChange={handleChange} />
        </div>

        {/* FILE UPLOADS */}
        <div className="my-10 h-[1px] bg-gray-200" />
        <div className="grid md:grid-cols-2 gap-8">
          <FileUpload label="Passport Front Page" name="passportFront" onChange={handleFile} />
          <FileUpload label="Passport Back Page" name="passportBack" onChange={handleFile} />
          <FileUpload label="Passport Cover" name="passportCover" onChange={handleFile} />
          <FileUpload label="Photo (White BG)" name="photo" onChange={handleFile} />
          <FileUpload label="Accommodation Proof" name="accommodation" onChange={handleFile} />
          <FileUpload label="Emirates ID" name="emiratesId" onChange={handleFile} />
          <FileUpload label="Additional ID" name="extraId" onChange={handleFile} />
          <FileUpload label="Old Visa (Optional)" name="oldVisa" onChange={handleFile} />
        </div>

        {/* SUBMIT */}
        <div className="text-center mt-14">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-14 py-4 text-lg font-semibold rounded-2xl 
                       bg-gradient-to-r from-[#e82429] to-[#721011] 
                       text-white shadow-xl hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : `Pay AED ${selectedVisa?.price}`}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
