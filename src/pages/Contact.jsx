// src/pages/ContactUs.jsx
import React, { useState } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { API } from "../config/API";
import DataService from "../config/DataService";
import toast from "react-hot-toast";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    services: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const api = DataService();
      const response = await api.post(API.CREATE_ENQUIRY, formData);

      // ✅ Handle success by HTTP status also (201 = created)
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

      // 🔹 Backend error could be from nodemailer / timeout
      if (err.response) {
        toast.error(
          err.response.data?.message ||
            "Server responded with an error. Try again later."
        );
      } else {
        toast.error("Network issue or server not reachable. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
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
        {/* Left: Form */}
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e82429] focus:outline-none transition-all"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e82429] focus:outline-none transition-all"
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
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e82429] focus:outline-none transition-all"
                  required
                />
                <select
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#e82429] focus:outline-none transition-all"
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
                className="w-full border border-gray-300 rounded-xl px-4 py-3 h-40 focus:ring-2 focus:ring-[#e82429] focus:outline-none transition-all"
                required
              />

              {/* Submit Button */}
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

        {/* Right: Contact Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {[
            {
              icon: <FaMapMarkerAlt className="text-[#e82429] text-3xl" />,
              title: "Address",
              text: "123 Travel Street, Dubai, UAE",
            },
            {
              icon: <FaPhoneAlt className="text-[#e82429] text-3xl" />,
              title: "Phone",
              text: "+971 55 123 4567",
            },
            {
              icon: <FaEnvelope className="text-[#e82429] text-3xl" />,
              title: "Email",
              text: "info@travelcompany.com",
            },
            {
              icon: <FaClock className="text-[#e82429] text-3xl" />,
              title: "Hours",
              text: "Mon - Fri: 9:00 AM - 6:00 PM",
            },
          ].map((card, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-2xl hover:shadow-3xl transition-all cursor-pointer"
            >
              <div className="p-4 bg-[#e82429]/20 rounded-full">{card.icon}</div>
              <div>
                <h3 className="font-bold text-[#721011] text-lg">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-width Map */}
      <div className="w-full mt-10">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.243947104038!2d55.23623471500779!3d25.204849983868447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f4349b1a8d4f1%3A0x12b6ec4b12345678!2sDubai%2C%20UAE!5e0!3m2!1sen!2sin!4v1694567890123!5m2!1sen!2sin"
          width="100%"
          height="400"
          className="border-0"
          allowFullScreen=""
          loading="lazy"
          title="Google Map"
        ></iframe>
      </div>
    </div>
  );
}
