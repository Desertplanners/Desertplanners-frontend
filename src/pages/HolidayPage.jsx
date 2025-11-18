import React, { useState } from "react";
import {
  FaClock,
  FaStar,
  FaCalendarAlt,
  FaBed,
  FaUtensils,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";

export default function HolidayPage() {
  const tour = {
    title: "Winter Escape: Dubai Highlights",
    duration: "3N - 4D",
    category: { name: "Winter Package" },
    priceAdult: 1399,
    priceChild: 999,
    description:
      "Experience the best of Dubai with our luxury travel packages and unforgettable adventures. Comfortable stays, curated sightseeing and thrilling desert experiences.",

    timings: "Flexible",

    inclusions: [
      "Accommodation as per hotel category",
      "Daily breakfast",
      "Airport transfers (arrival & departure)",
      "Desert safari with BBQ dinner",
    ],

    exclusions: [
      "Personal expenses",
      "Tips & gratuities",
      "Any optional tours",
    ],

    itinerary: [
      "DUBAI AIRPORT ARRIVAL TRANSFERS",
      "DUBAI HALF DAY CITY TOUR + DUBAI FRAME + MARINA DHOW CRUISE (DINNER ON SHARING BASIS)",
      "DESERT SAFARI WITH BBQ DINNER BY 4 X 4 VEHICLE ON SHARING BASIS",
      "DUBAI AIRPORT DEPARTURE",
    ],

    knowBefore: [
      "Pick-up and drop-off included in most tours",
      "Comfortable clothing recommended",
      "Duration may vary depending on traffic",
      "Free cancellation up to 24 hours in advance",
      "Guided tours with professional staff",
    ],

    terms: `• The Quote is valid only for the above mentioned no of passengers and Any change in the number of passengers will lead to a revision of the Price.
• Vehicle type and cost are considered based on guests arriving and departing together as a unified group on the same flight.
• Hotels may require mandatory refundable deposits at check-in.
• Standard Check-In Time @ 02.00 pm & Check-Out Time @ 12.00 pm.
• Rooms and rates are subject to availability during booking.
• From 01st March 2025, Burj Khalifa tickets are non-refundable & require 100% payment.`,
  };

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    selectedTour: "Dubai Highlights",
    location: "",
    message: "",
  });

  const sampleTours = [
    "Dubai Highlights",
    "Desert Adventure",
    "Luxury Dubai Stay",
    "Family Fun Package",
  ];

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Enquiry submitted successfully!");
  };

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* LEFT CONTENT */}
      <div className="md:col-span-2 space-y-10">
        {/* Image */}
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80"
            alt="Holiday"
            className="w-full h-[420px] md:h-[480px] object-cover hover:scale-105 transition-all duration-700"
          />
        </div>

        {/* Hero Card (Updated & Modern) */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg p-7 border border-[#e82429]/10 hover:shadow-2xl transition-all duration-400">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Title Section */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-[2.3rem] leading-tight font-extrabold text-[#721011] drop-shadow-sm">
                {tour.title}
              </h1>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap gap-3">
                {/* Duration */}
                <span className="bg-[#ffe4e4] px-4 py-1.5 rounded-full text-sm md:text-base font-semibold text-[#721011] flex items-center gap-2 shadow-sm border border-[#e82429]/20">
                  <FaClock className="text-[#e82429]" />
                  {tour.duration}
                </span>

                {/* Category */}
                <span className="bg-[#fff4f4] px-4 py-1.5 rounded-full text-sm md:text-base font-semibold text-[#721011] shadow-sm border border-[#e82429]/20">
                  {tour.category.name}
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex flex-col items-start md:items-end">
              <p className="text-4xl md:text-[3rem] font-black text-[#e82429] leading-tight drop-shadow-sm tracking-tight">
                AED {tour.priceAdult}
              </p>

              {tour.priceChild && (
                <span className="mt-1 px-3 py-1 bg-[#ffe0e0] rounded-full text-xs md:text-sm font-semibold text-[#721011] border border-[#e82429]/20 shadow-sm">
                  Child Price: AED {tour.priceChild}
                </span>
              )}

              <p className="text-gray-500 text-xs md:text-sm mt-1">
                (Per Person)
              </p>

              {/* Rating */}
              <div className="flex items-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className="text-yellow-500 drop-shadow-sm text-lg"
                  />
                ))}
                <span className="text-gray-600 text-sm md:text-base font-medium">
                  4.9 • 134 reviews
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="mt-5 text-gray-700 text-[0.95rem] md:text-base leading-relaxed">
            {tour.description}
          </p>
        </div>

        {/* HIGHLIGHTS */}
        <div className="bg-white shadow-xl rounded-3xl p-6 border border-[#e82429]/20">
          <h3 className="text-2xl font-bold text-[#721011] mb-4">
            Package Highlights
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex gap-3">
              <FaCalendarAlt className="text-[#e82429] text-xl" />
              <div>
                <p className="font-semibold">NO OF NIGHT</p>
                <p>3N - 4D</p>
              </div>
            </div>

            <div className="flex gap-3">
              <FaUser className="text-[#e82429] text-xl" />
              <div>
                <p className="font-semibold">NO OF PERSON</p>
                <p>02 ADULTS (MIN)</p>
              </div>
            </div>

            <div className="flex gap-3">
              <FaBed className="text-[#e82429] text-xl" />
              <div>
                <p className="font-semibold">NO OF ROOM</p>
                <p>01 STANDARD DOUBLE ROOM</p>
              </div>
            </div>

            <div className="flex gap-3">
              <FaUtensils className="text-[#e82429] text-xl" />
              <div>
                <p className="font-semibold">MEAL PLAN</p>
                <p>Bed & Breakfast</p>
              </div>
            </div>
          </div>
        </div>

        {/* NEED TO KNOW */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#e82429]/20">
          <h2 className="text-2xl font-bold text-[#404041] mb-4 border-b pb-2">
            Need to Know
          </h2>

          <ul className="space-y-3">
            <li className="flex gap-3 bg-[#fff4f4] p-3 rounded-xl border border-[#e82429]/20 hover:bg-[#ffeaea] transition">
              <span className="text-xl">⏰</span>
              <span className="font-medium text-gray-700">
                Timings: {tour.timings}
              </span>
            </li>
          </ul>

          {/* Inclusions */}
          <h3 className="text-xl font-semibold text-[#e82429] mt-6 mb-2">
            Inclusions
          </h3>
          <ul className="space-y-2">
            {tour.inclusions.map((x, i) => (
              <li
                key={i}
                className="flex gap-2 p-2 bg-[#fff4f4] rounded-md border border-[#e82429]/20"
              >
                <span>✅</span> {x}
              </li>
            ))}
          </ul>

          {/* Exclusions */}
          <h3 className="text-xl font-semibold text-[#e82429] mt-6 mb-2">
            Exclusions
          </h3>
          <ul className="space-y-2">
            {tour.exclusions.map((x, i) => (
              <li
                key={i}
                className="flex gap-2 p-2 bg-[#fff4f4] rounded-md border border-[#e82429]/20"
              >
                <span>❌</span> {x}
              </li>
            ))}
          </ul>
        </div>

        {/* ITINERARY SECTION - Modern Timeline */}
        <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#e82429]/20">
          <h2 className="text-2xl font-bold text-[#404041] mb-6">
            Suggested Itinerary
          </h2>

          <div className="relative border-l-4 border-[#e82429]/30 pl-6 space-y-8">
            {tour.itinerary.map((item, index) => (
              <div key={index} className="relative">
                {/* Gradient Dot */}
                <div className="absolute -left-3 top-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#e82429] to-[#791418] shadow-md border-2 border-white"></div>

                {/* Card */}
                <div className="bg-[#fff6f6] hover:bg-[#ffeaea] transition-all rounded-xl shadow-md p-4 border border-[#e82429]/10">
                  <h3 className="text-lg font-bold text-[#721011] mb-1">
                    DAY {index + 1}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CANCELLATION & REFUND POLICY – Modern Section */}
        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6 hover:shadow-2xl transition-shadow duration-300 border border-[#e82429]/20">
          {/* Heading */}
          <h2 className="text-2xl font-bold text-[#404041] mb-3 border-b border-[#e82429]/30 pb-2 flex items-center gap-2">
            <span className="text-[#e82429] text-2xl">❌</span>
            Cancellation & Refund Policy
          </h2>

          {/* Content Box */}
          <div className="bg-[#fff4f4] rounded-2xl p-6 border border-[#e82429]/20 text-gray-700 text-sm md:text-base leading-relaxed space-y-3">
            <p>• Free cancellation up to 24 hours before the tour date.</p>
            <p>
              • 50% refund applicable if cancelled between 24 - 48 hours before
              service.
            </p>
            <p>
              • No refund applicable for cancellations made within 24 hours of
              travel.
            </p>
            <p>
              • Certain activities such as Burj Khalifa, theme parks or special
              events may be fully non-refundable.
            </p>
            <p>
              • Refunds may take 7–14 business days to reflect in your account.
            </p>
            <p>
              • Any changes in booking are subject to availability and may incur
              charges.
            </p>
          </div>
        </div>

        {/* TERMS */}
        {/* TERMS & CONDITIONS – Modern Design */}
        <div className="bg-white rounded-3xl shadow-xl p-7 border border-[#e82429]/20 relative overflow-hidden">
          {/* Decorative Top Gradient Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#e82429] via-[#ff8a8a] to-[#721011]"></div>

          {/* Heading */}
          <h2 className="text-2xl font-bold text-[#404041] mb-5 flex items-center gap-2">
            <span className="text-[#e82429] text-3xl">📄</span>
            Terms & Conditions
          </h2>

          {/* Content */}
          <div className="space-y-4 text-gray-700 text-sm md:text-base leading-relaxed">
            {tour.terms
              .split("•")
              .filter((line) => line.trim())
              .map((line, index) => (
                <div
                  key={index}
                  className="flex gap-4 bg-[#fff7f7] p-4 rounded-xl border border-[#e82429]/10 hover:bg-[#ffecec] transition-all duration-200"
                >
                  {/* Number Bubble */}
                  <div className="min-w-[32px] h-[32px] flex items-center justify-center bg-gradient-to-br from-[#e82429] to-[#721011] text-white font-bold rounded-full shadow">
                    {index + 1}
                  </div>

                  {/* Text */}
                  <p className="flex-1">{line.trim()}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* RIGHT STICKY FORM */}
      <aside className="md:col-span-1">
  <div className="sticky top-24 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-7 border border-[#e82429]/20 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">

    {/* Decorative top line */}
    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e82429] via-[#ff8484] to-[#721011]"></div>

    {/* Heading */}
    <h3 className="text-2xl font-extrabold text-[#721011] mb-6">
      Enquire Now
    </h3>

    {/* FORM START */}
    <form className="space-y-4" onSubmit={handleSubmit}>
      
      {/* First / Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder=" "
            className="peer p-3 border rounded-xl w-full focus:border-[#e82429] focus:ring-2 focus:ring-[#e82429]/40 transition-all outline-none"
          />
          <label className="absolute left-3 top-3 text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#e82429] bg-white px-1">
            First Name
          </label>
        </div>

        <div className="relative">
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder=" "
            className="peer p-3 border rounded-xl w-full focus:border-[#e82429] focus:ring-2 focus:ring-[#e82429]/40 transition-all outline-none"
          />
          <label className="absolute left-3 top-3 text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#e82429] bg-white px-1">
            Last Name
          </label>
        </div>
      </div>

      {/* Email */}
      <div className="relative">
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder=" "
          className="peer p-3 border rounded-xl w-full focus:border-[#e82429] focus:ring-2 focus:ring-[#e82429]/40 transition-all outline-none"
        />
        <label className="absolute left-3 top-3 text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#e82429] bg-white px-1">
          Email
        </label>
      </div>

      {/* Contact Number */}
      <div className="relative">
        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder=" "
          className="peer p-3 border rounded-xl w-full focus:border-[#e82429] focus:ring-2 focus:ring-[#e82429]/40 transition-all outline-none"
        />
        <label className="absolute left-3 top-3 text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#e82429] bg-white px-1">
          Contact Number
        </label>
      </div>

      {/* Select Tour */}
      <div className="relative">
        <select
          name="selectedTour"
          value={form.selectedTour}
          onChange={handleChange}
          className="peer p-3 border rounded-xl w-full bg-white focus:border-[#e82429] focus:ring-2 focus:ring-[#e82429]/40 transition-all outline-none"
        >
          {sampleTours.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <label className="absolute left-3 -top-2 text-xs text-[#e82429] bg-white px-1">
          Select Tour
        </label>
      </div>

      {/* Location */}
      <div className="relative">
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder=" "
          className="peer p-3 border rounded-xl w-full focus:border-[#e82429] focus:ring-2 focus:ring-[#e82429]/40 transition-all outline-none"
        />
        <label className="absolute left-3 top-3 text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#e82429] bg-white px-1">
          Your Location
        </label>
      </div>

      {/* Message */}
      <div className="relative">
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder=" "
          className="peer p-3 border rounded-xl w-full h-28 focus:border-[#e82429] focus:ring-2 focus:ring-[#e82429]/40 transition-all outline-none"
        ></textarea>
        <label className="absolute left-3 top-3 text-gray-500 pointer-events-none transition-all peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[#e82429] bg-white px-1">
          Message / Enquiry
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e82429] to-[#721011] text-white font-bold shadow-lg hover:shadow-xl transition-all tracking-wide"
      >
        Submit Enquiry
      </button>
    </form>

    {/* Contact Footer */}
    <div className="mt-6 bg-[#fff5f5] border border-[#e82429]/20 p-4 rounded-xl text-sm text-gray-700">
      📞 Need help?  
      <span className="font-bold text-[#721011]"> +971 50 000 0000</span>
      <br />
      Our team will contact you within minutes.
    </div>
  </div>
</aside>

    </div>
  );
}
