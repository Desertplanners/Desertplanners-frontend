import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { FaUpload, FaPlaneArrival, FaPassport } from "react-icons/fa";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DataService from "../config/DataService";
import { API } from "../config/API";
import toast from "react-hot-toast";

// ------------------------------------------------------------------
// MODERN DATE PICKER WITH MONTH + YEAR DROPDOWN
// ------------------------------------------------------------------
const DateInput = React.memo(({ label, name, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-semibold text-gray-800">{label}</label>

      <DatePicker
        selected={value ? new Date(value) : null}
        onChange={(date) => onChange(name, date)}
        dateFormat="dd MMM yyyy"
        placeholderText={`Select ${label}`}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 
                   shadow-sm focus:border-red-500 outline-none transition-all"
        calendarClassName="rounded-2xl shadow-2xl border bg-white"
        popperClassName="z-50"
      />
    </div>
  );
});

// ------------------------------------------------------------------
// TEXT INPUT
// ------------------------------------------------------------------
const FormInput = React.memo(({ label, name, type = "text", value, onChange }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-semibold text-gray-800">{label}</label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(name, e.target.value)}
      className="px-4 py-3 rounded-xl bg-white border border-gray-300 shadow-sm 
                 focus:border-red-500 outline-none transition-all"
    />
  </div>
));

// ------------------------------------------------------------------
// SELECT FIELD
// ------------------------------------------------------------------
const FormSelect = React.memo(({ label, name, value, onChange, options }) => (
  <div className="flex flex-col w-full gap-1">
    <label className="text-sm font-semibold text-gray-800">{label}</label>
    <select
      value={value || ""}
      onChange={(e) => onChange(name, e.target.value)}
      className="px-4 py-3 bg-white border border-gray-300 rounded-xl 
                 shadow-sm focus:border-red-500 outline-none transition-all"
    >
      <option value="">Select {label}</option>
      {options.map((opt, index) => (
        <option key={index} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
));

// ------------------------------------------------------------------
// FILE UPLOAD
// ------------------------------------------------------------------
const FileUpload = React.memo(({ label, name, file, onChange }) => (
  <div>
    <label
      className="border-2 border-dashed border-gray-400 rounded-xl p-6
                 flex flex-col items-center gap-2 cursor-pointer
                 hover:border-red-500 hover:bg-red-50 transition-all"
    >
      <FaUpload className="text-red-600 text-2xl" />
      <span className="text-gray-600 text-sm font-medium">{label}</span>

      <input
        type="file"
        className="hidden"
        onChange={(e) => onChange(name, e.target.files[0])}
      />
    </label>

    {file && (
      <p className="text-green-600 text-sm font-medium mt-2 truncate">
        ✔ {file.name}
      </p>
    )}
  </div>
));

// ==================================================================
// MAIN COMPONENT
// ==================================================================
export default function VisaBooking() {
  const [fields, setFields] = useState({});
  const [files, setFiles] = useState({});
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [loading, setLoading] = useState(false);

  const [params] = useSearchParams();
  const visaId = params.get("visaId");

  const api = DataService();

  // FETCH VISA DETAILS  
  useEffect(() => {
    if (!visaId) return;

    const loadVisa = async () => {
      try {
        const res = await api.get(API.GET_VISA_BY_ID(visaId));
        const v = res.data?.visa;

        if (!v) return toast.error("Visa not found");

        setSelectedVisa(v);

        setFields((prev) => ({
          ...prev,
          visaId,
          visaTitle: v.title,
          totalPrice: v.price,
          processingTime: v.processingTime,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    loadVisa();
  }, [visaId]);

  // UPDATERS
  const handleChange = (key, val) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  const handleFile = (key, file) =>
    setFiles((prev) => ({ ...prev, [key]: file }));

  // SUBMIT FORM
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const fd = new FormData();
      Object.keys(fields).forEach((k) => fd.append(k, fields[k]));
      Object.keys(files).forEach((k) => fd.append(k, files[k]));

      const guest = DataService("guest");

      const bookingRes = await guest.post(API.CREATE_VISA_BOOKING, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const booking = bookingRes.data?.booking;
      if (!booking) return toast.error("Booking failed");

      const payRes = await guest.post(API.CREATE_VISA_PAYMENT, {
        bookingId: booking._id,
      });

      window.location.href = payRes.data?.paymentLink;
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================================
  // UI STARTS
  // ==================================================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-100 min-h-screen py-16 px-4"
    >

      {/* VISA CARD */}
      {selectedVisa && (
        <div className="max-w-4xl mx-auto relative mb-10">

          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-900 blur-xl opacity-40 rounded-3xl"></div>

          <div className="relative bg-white p-8 rounded-3xl shadow-2xl border">
            <div className="flex gap-4 items-center">
              <FaPassport className="text-red-600 text-4xl" />
              <h2 className="text-3xl font-extrabold text-red-900">
                {selectedVisa.title}
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 mt-6 gap-6">
              <div className="bg-gray-100 p-4 rounded-xl shadow">
                <p className="text-sm">Price</p>
                <h3 className="text-xl text-green-600 font-bold">
                  AED {selectedVisa.price}
                </h3>
              </div>

              <div className="bg-gray-100 p-4 rounded-xl shadow">
                <p className="text-sm">Processing</p>
                <h3 className="text-xl text-blue-700 font-bold">
                  {selectedVisa.processingTime}
                </h3>
              </div>

              <div className="bg-gray-100 p-4 rounded-xl shadow flex gap-2">
                <FaPlaneArrival className="text-red-600 mt-1" />
                <div>
                  <p className="text-sm">Type</p>
                  <h3 className="text-lg font-bold">Tourist Visa</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORM CARD */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl p-10 rounded-3xl border">

        <h1 className="text-3xl text-center font-extrabold text-red-900 mb-8">
          Visa Application Form
        </h1>

        {/* PERSONAL INFO */}
        <div className="grid md:grid-cols-2 gap-8">
          <FormInput label="Full Name" name="fullName" value={fields.fullName} onChange={handleChange} />
          <FormInput label="Email" name="email" value={fields.email} onChange={handleChange} />
          <FormInput label="Phone Number" name="phone" value={fields.phone} onChange={handleChange} />

          <FormSelect
            label="Gender"
            name="gender"
            value={fields.gender}
            onChange={handleChange}
            options={["Male", "Female"]}
          />

          <DateInput label="Date of Birth" name="dob" value={fields.dob} onChange={handleChange} />
        </div>

        <div className="my-10 h-[1px] bg-gray-200" />

        {/* PASSPORT INFO */}
        <div className="grid md:grid-cols-2 gap-8">
          <FormInput label="Passport Number" name="passportNumber" value={fields.passportNumber} onChange={handleChange} />
          <FormInput label="Issue Place" name="issuePlace" value={fields.issuePlace} onChange={handleChange} />

          <DateInput label="Issue Date" name="issueDate" value={fields.issueDate} onChange={handleChange} />
          <DateInput label="Expiry Date" name="expiryDate" value={fields.expiryDate} onChange={handleChange} />
        </div>

        <div className="my-10 h-[1px] bg-gray-200" />

        {/* TRAVEL INFO (UPDATED) */}
        <div className="grid md:grid-columns-2 gap-8">
          <DateInput label="Entry Date" name="entryDate" value={fields.entryDate} onChange={handleChange} />
          <DateInput label="Return Date" name="returnDate" value={fields.returnDate} onChange={handleChange} />
        </div>

        <div className="my-10 h-[1px] bg-gray-200" />

        {/* UPLOAD DOCUMENTS */}
        <h2 className="text-xl font-bold text-red-800 mb-4">Upload Documents</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <FileUpload label="Passport Front Page" name="passportFront" file={files.passportFront} onChange={handleFile} />
          <FileUpload label="Passport Back Page" name="passportBack" file={files.passportBack} onChange={handleFile} />
          <FileUpload label="Passport Cover" name="passportCover" file={files.passportCover} onChange={handleFile} />
          <FileUpload label="Photo (White BG)" name="photo" file={files.photo} onChange={handleFile} />
          <FileUpload label="Accommodation Proof" name="accommodation" file={files.accommodation} onChange={handleFile} />
          <FileUpload label="Emirates ID" name="emiratesId" file={files.emiratesId} onChange={handleFile} />
          <FileUpload label="Additional ID" name="extraId" file={files.extraId} onChange={handleFile} />
          <FileUpload label="Old Visa (Optional)" name="oldVisa" file={files.oldVisa} onChange={handleFile} />
          <FileUpload label="Return Ticket" name="flightTicket" file={files.flightTicket} onChange={handleFile} />
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-14 py-4 rounded-2xl bg-gradient-to-r 
                       from-red-600 to-red-900 text-white text-lg 
                       font-semibold shadow-xl hover:scale-105 
                       transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : `Pay AED ${selectedVisa?.price}`}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
