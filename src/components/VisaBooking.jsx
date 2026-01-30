// VisaBooking.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import {
  FaUpload,
  FaPassport,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import DataService from "../config/DataService";
import { API } from "../config/API";
import toast from "react-hot-toast";
import PhoneInput from "../components/PhoneInput";

// ------------------------------------------------------------------
// MODERN DATE PICKER WITH MONTH + YEAR DROPDOWN
// ------------------------------------------------------------------
const DateInput = React.memo(
  ({ label, name, value, onChange, placeholder }) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-semibold text-gray-700">{label}</label>

        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={(date) => onChange(name, date)}
          dateFormat="dd MMM yyyy"
          placeholderText={placeholder || `Select ${label}`}
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
  }
);

// ------------------------------------------------------------------
// TEXT INPUT
// ------------------------------------------------------------------
const FormInput = React.memo(
  ({ label, name, type = "text", value, onChange, placeholder }) => (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        value={value || ""}
        placeholder={placeholder || label}
        onChange={(e) => onChange(name, e.target.value)}
        className="px-4 py-3 rounded-xl bg-white border border-gray-300 shadow-sm 
                 focus:border-red-500 outline-none transition-all"
      />
    </div>
  )
);

// ------------------------------------------------------------------
// SELECT FIELD
// ------------------------------------------------------------------
const FormSelect = React.memo(({ label, name, value, onChange, options }) => (
  <div className="flex flex-col w-full gap-2">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
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
const FileUpload = React.memo(
  ({ label, name, file, onChange, optional = false, accept }) => (
    <div className="flex flex-col gap-2">
      <label
        className={`border-2 ${
          optional
            ? "border-dashed border-yellow-400"
            : "border-dashed border-gray-400"
        } 
                 rounded-xl p-4 flex flex-col items-start gap-2 cursor-pointer
                 hover:border-red-500 hover:bg-red-50 transition-all w-full`}
      >
        <div className="flex items-center gap-3 w-full">
          <FaUpload className="text-red-600 text-2xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2 justify-between">
              <span className="text-gray-700 font-medium">{label}</span>
              {optional ? (
                <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                  Optional
                </span>
              ) : (
                <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  Required
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Click to upload {optional ? "(optional)" : ""}
            </p>
          </div>
        </div>

        <input
          type="file"
          accept={accept || "*/*"}
          className="hidden"
          onChange={(e) => onChange(name, e.target.files[0])}
        />
      </label>

      {file && (
        <div className="flex items-center gap-2">
          <FaCheckCircle className="text-green-500" />
          <p className="text-sm text-gray-700 truncate">✔ {file.name}</p>
        </div>
      )}
    </div>
  )
);

// ------------------------------------------------------------------
// HELPER: Format currency
// ------------------------------------------------------------------
const formatAED = (val) => {
  if (val === undefined || val === null || isNaN(Number(val))) return "-";
  return Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// ==================================================================
// MAIN COMPONENT
// ==================================================================
export default function VisaBooking() {
  const [fields, setFields] = useState({
    // personal
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: null,
    // passport
    passportNumber: "",
    issuePlace: "",
    issueDate: null,
    expiryDate: null,
    // travel
    entryDate: null,
    returnDate: null,
    // extra
    visaId: "",
    visaTitle: "",
    totalPrice: 0,
    processingTime: "",
  });

  const [files, setFiles] = useState({
    passportFront: null,
    passportBack: null,
    passportCover: null,
    extraId: null, // optional
  });

  const [selectedVisa, setSelectedVisa] = useState(null);
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const visaId = params.get("visaId");
  const [beginCheckoutFired, setBeginCheckoutFired] = useState(false);

  const api = useMemo(() => DataService(), []);

  // ----------------------------------------------------------------
  // Fetch Visa Details (when visaId present)
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!visaId) return;

    const loadVisa = async () => {
      try {
        const res = await api.get(API.GET_VISA_BY_ID(visaId));
        const v = res.data?.visa;

        if (!v) {
          toast.error("Visa not found");
          return;
        }

        setSelectedVisa(v);

        setFields((prev) => ({
          ...prev,
          visaId,
          visaTitle: v.title || "",
          totalPrice: v.price ?? 0,
          processingTime: v.processingTime || "",
        }));
      } catch (err) {
        console.error("Load visa error:", err);
        toast.error("Failed to load visa details");
      }
    };

    loadVisa();
  }, [visaId, api]);

  // ⭐ DATA LAYER — BEGIN CHECKOUT (Visa)
  useEffect(() => {
    if (!selectedVisa || beginCheckoutFired) return;

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "begin_checkout",
      item_type: "visa",
      visa_id: selectedVisa._id,
      visa_name: selectedVisa.title,
      visa_type: selectedVisa.visaType,
      entry_type: selectedVisa.entryType,
      processing_time: selectedVisa.processingTime,
      price: Number(selectedVisa.price || 0),
      currency: "AED",
    });

    console.log("📡 DATA LAYER — begin_checkout (visa) fired");

    setBeginCheckoutFired(true);
  }, [selectedVisa, beginCheckoutFired]);

  // ----------------------------------------------------------------
  // Updaters
  // ----------------------------------------------------------------
  const handleChange = (key, val) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  const handleFile = (key, file) =>
    setFiles((prev) => ({ ...prev, [key]: file }));

  // ----------------------------------------------------------------
  // Pricing: transaction fee 3.75%
  // ----------------------------------------------------------------
  const TRANSACTION_RATE = 0.0375;

  const basePrice = useMemo(() => {
    const p = selectedVisa?.price ?? fields.totalPrice ?? 0;
    return Number(p) || 0;
  }, [selectedVisa, fields.totalPrice]);

  const transactionFee = useMemo(() => {
    return +(basePrice * TRANSACTION_RATE);
  }, [basePrice]);

  const finalAmount = useMemo(() => {
    return +(basePrice + transactionFee);
  }, [basePrice, transactionFee]);

  // ----------------------------------------------------------------
  // Validation: required fields + files (optional list)
  // ----------------------------------------------------------------
  const requiredFieldKeys = [
    "fullName",
    "email",
    "phone",
    "gender",
    "dob",
    "passportNumber",
    "issuePlace",
    "issueDate",
    "expiryDate",
    "visaId",
  ];

  const requiredFileKeys = ["passportFront", "passportBack", "passportCover"];

  const validateBeforeSubmit = () => {
    // fields
    for (const key of requiredFieldKeys) {
      const v = fields[key];
      if (v === null || v === undefined || v === "") {
        const label = key.replace(/([A-Z])/g, " $1");
        return { ok: false, message: `Please fill ${label}` };
      }
    }

    // email basic check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      return { ok: false, message: "Please enter a valid email address" };
    }

    // phone basic check (digits 6-15)
    if (!/^\+?[\d\s\-]{6,15}$/.test(fields.phone)) {
      return { ok: false, message: "Please enter a valid phone number" };
    }

    // passport number
    if (!fields.passportNumber || fields.passportNumber.length < 3) {
      return { ok: false, message: "Please enter a valid passport number" };
    }

    // files
    for (const key of requiredFileKeys) {
      if (!files[key]) {
        const label = key.replace(/([A-Z])/g, " $1");
        return { ok: false, message: `Please upload ${label}` };
      }
    }

    // date checks: expiry must be after issue, return after entry
    if (fields.issueDate && fields.expiryDate) {
      if (new Date(fields.expiryDate) <= new Date(fields.issueDate)) {
        return { ok: false, message: "Expiry date must be after issue date" };
      }
    }

    if (fields.entryDate && fields.returnDate) {
      if (new Date(fields.returnDate) < new Date(fields.entryDate)) {
        return { ok: false, message: "Return date must be after entry date" };
      }
    }

    // everything ok
    return { ok: true };
  };

  // ----------------------------------------------------------------
  // Submit
  // ----------------------------------------------------------------
  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      const v = validateBeforeSubmit();
      if (!v.ok) {
        toast.error(v.message);
        setLoading(false);
        return;
      }

      // ⭐ DATA LAYER — ADD PAYMENT INFO (Visa)
      window.dataLayer = window.dataLayer || [];

      window.dataLayer.push({
        event: "add_payment_info",
        payment_type: "online",
        item_type: "visa",

        value: +finalAmount,
        currency: "AED",

        items: [
          {
            item_id: fields.visaId,
            item_name: fields.visaTitle,
            item_category: "Visa",
            price: basePrice,
            quantity: 1,
          },
        ],

        visa_id: fields.visaId,
        visa_name: fields.visaTitle,
        visa_price: basePrice,
        transaction_fee: transactionFee,

        applicant: {
          name: fields.fullName,
          email: fields.email,
          phone: fields.phone,
          gender: fields.gender,
        },
      });
      console.log("📡 DATA LAYER — add_payment_info (visa) fired");

      const fd = new FormData();

      // fields (convert dates to ISO strings)
      Object.keys(fields).forEach((k) => {
        const val = fields[k];
        if (val instanceof Date) {
          fd.append(k, val.toISOString());
        } else if (val !== undefined && val !== null) {
          fd.append(k, val);
        }
      });

      // append computed amounts for server-side clarity
      fd.append("basePrice", String(basePrice));
      fd.append("transactionFee", String(+transactionFee.toFixed(2)));
      fd.append("finalAmount", String(+finalAmount.toFixed(2)));

      // files
      Object.keys(files).forEach((k) => {
        if (files[k]) fd.append(k, files[k]);
      });

      // send as guest (like existing code)
      const guest = DataService("guest");

      // create booking
      const bookingRes = await guest.post(API.CREATE_VISA_BOOKING, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const booking = bookingRes.data?.booking;
      if (!booking) {
        toast.error("Booking failed. Please try again.");
        setLoading(false);
        return;
      }

      // create payment (server should use finalAmount)
      const payRes = await guest.post(API.CREATE_VISA_PAYMENT, {
        bookingId: booking._id,
      });

      const paymentLink = payRes.data?.paymentLink;
      if (!paymentLink) {
        toast.error("Payment initialization failed.");
        setLoading(false);
        return;
      }

      // redirect to payment
      window.location.href = paymentLink;
    } catch (e) {
      console.error("Submit error:", e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fields, files, basePrice, transactionFee, finalAmount]);

  // ----------------------------------------------------------------
  // Small helpers for UI (display missing required field/file counts)
  // ----------------------------------------------------------------
  const missingFieldCount = useMemo(() => {
    return requiredFieldKeys.reduce((acc, k) => {
      const v = fields[k];
      if (v === null || v === undefined || v === "") return acc + 1;
      return acc;
    }, 0);
  }, [fields]);
  

  const missingFileCount = useMemo(() => {
    return requiredFileKeys.reduce((acc, k) => {
      if (!files[k]) return acc + 1;
      return acc;
    }, 0);
  }, [files]);
  
  // ----------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-100 min-h-screen py-12 px-4"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8 items-start">
        {/* LEFT: Visa Card + Price Summary */}
        <div className="lg:col-span-1">
          <div className="relative mb-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-900 blur-xl opacity-30 rounded-2xl"></div>
            <div className="relative bg-white p-6 rounded-2xl shadow-xl border">
              <div className="flex items-center gap-4">
                <FaPassport className="text-red-600 text-4xl" />
                <div>
                  <h3 className="text-xl font-extrabold text-red-900">
                    {selectedVisa?.title || fields.visaTitle || "Visa"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {fields.processingTime ||
                      selectedVisa?.processingTime ||
                      "Processing time info"}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Base Price</p>
                      <p className="text-lg font-bold">
                        AED {formatAED(basePrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Transaction Fee</p>
                      <p className="text-lg font-semibold">
                        AED {formatAED(transactionFee)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Payable</p>
                      <p className="text-2xl font-extrabold text-red-700">
                        AED {formatAED(finalAmount)}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      <p>incl. Transition fee</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 text-xs text-gray-600 bg-yellow-50 rounded-lg border">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="text-yellow-700 mt-0.5" />
                    <div>
                      <strong>Note:</strong> The final amount includes a{" "}
                      <strong> transaction fee</strong>. The server will
                      validate and charge the same amount during payment
                      creation.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick checklist */}
          <div className="bg-white rounded-2xl p-5 shadow border">
            <h4 className="font-bold text-gray-800 mb-3">Checklist</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> All personal
                details filled
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-green-500" /> Passport & photo
                uploaded
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xs bg-yellow-100 px-2 py-1 rounded-full text-yellow-800">
                  Optional
                </span>{" "}
                Emirates ID / Additional ID / Old Visa
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT: Main Form (span 2 columns) */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-2xl p-8 rounded-3xl border">
            <h1 className="text-3xl text-center font-extrabold text-red-900 mb-6">
              Visa Application Form
            </h1>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={fields.fullName}
                  onChange={handleChange}
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={fields.email}
                  onChange={handleChange}
                />

                {/* NEW PHONE INPUT WITH COUNTRY CODE */}
                <PhoneInput
                  value={fields.phone}
                  onChange={(val) => handleChange("phone", val)}
                />

                <FormSelect
                  label="Gender"
                  name="gender"
                  value={fields.gender}
                  onChange={handleChange}
                  options={["Male", "Female", "Other"]}
                />

                <DateInput
                  label="Date of Birth"
                  name="dob"
                  value={fields.dob}
                  onChange={handleChange}
                />
              </div>

              {/* Passport Info */}
              <div className="space-y-4">
                <FormInput
                  label="Passport Number"
                  name="passportNumber"
                  value={fields.passportNumber}
                  onChange={handleChange}
                />
                <FormInput
                  label="Issue Place"
                  name="issuePlace"
                  value={fields.issuePlace}
                  onChange={handleChange}
                />
                <DateInput
                  label="Passport Issue Date"
                  name="issueDate"
                  value={fields.issueDate}
                  onChange={handleChange}
                />
                <DateInput
                  label="Passport Expiry Date"
                  name="expiryDate"
                  value={fields.expiryDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="my-8 h-[1px] bg-gray-100" />

            {/* Travel Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <DateInput
                label="Entry Date"
                name="entryDate"
                value={fields.entryDate}
                onChange={handleChange}
              />
              <DateInput
                label="Return Date"
                name="returnDate"
                value={fields.returnDate}
                onChange={handleChange}
              />
            </div>

            <div className="my-8 h-[1px] bg-gray-100" />

            {/* Upload Documents */}
            <h2 className="text-xl font-bold text-red-800 mb-4">
              Upload Documents
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <FileUpload
                label="Passport Front Page"
                name="passportFront"
                file={files.passportFront}
                onChange={handleFile}
                accept="image/*,application/pdf"
              />

              <FileUpload
                label="Passport Back Page"
                name="passportBack"
                file={files.passportBack}
                onChange={handleFile}
                accept="image/*,application/pdf"
              />

              <FileUpload
                label="Passport Cover"
                name="passportCover"
                file={files.passportCover}
                onChange={handleFile}
                accept="image/*,application/pdf"
              />

              {/* Optional */}
              <FileUpload
                label="Additional ID"
                name="extraId"
                file={files.extraId}
                onChange={handleFile}
                optional
                accept="image/*,application/pdf"
              />
            </div>

            <div className="my-8 h-[1px] bg-gray-100" />

            {/* Hidden/Extra fields summary (kept but visible to user for confirmation) */}
            <div className="bg-gray-50 border p-4 rounded-xl mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Visa</p>
                  <p className="font-semibold text-gray-800">
                    {selectedVisa?.title || fields.visaTitle || "Selected Visa"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Processing</p>
                  <p className="font-semibold text-gray-800">
                    {fields.processingTime ||
                      selectedVisa?.processingTime ||
                      "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-6 grid md:grid-cols-2 gap-6 items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Please complete all required details before submitting.
                </p>
              </div>

              <div className="text-right">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-900 text-white text-lg font-semibold shadow-xl hover:scale-105 transition disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : `Pay AED ${formatAED(finalAmount)}`}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              By clicking Pay you agree to our terms. The final payable amount
              includes a transaction fee.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
