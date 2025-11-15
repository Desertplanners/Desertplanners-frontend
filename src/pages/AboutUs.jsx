import React from "react";
import { motion } from "framer-motion";
import {
  FaPassport,
  FaUmbrellaBeach,
  FaSuitcaseRolling,
  FaStar,
} from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="bg-white">
      {/* ⭐ HERO BANNER */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden p-0 m-0 bg-[#7a0f13]">

        {/* Gradient Overlay (Better visibility) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent"></div>

        {/* Floating Blurs */}
        <div className="absolute w-64 h-40 bg-[#e82429]/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-56 h-46 bg-white/10 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>

        {/* Content */}
        <div className="relative text-center px-4 z-10 -mt-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold text-white tracking-tight drop-shadow-xl"
          >
            About Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white/90 max-w-2xl mx-auto mt-3 text-lg leading-relaxed"
          >
            Discover the story, passion, and vision behind Desert Planners Tourism LLC - your trusted partner for unforgettable UAE travel experiences.
          </motion.p>
        </div>
      </section>

      {/* ⭐ INTRO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-[#721011]">
              Welcome to Desert Planners
            </h2>

            <p className="text-gray-700 leading-relaxed">
              Desert Planners Tourism LLC, based in Dubai, specializes in
              creating unforgettable travel experiences - from iconic city tours
              and desert adventures to customized holiday packages and smooth
              visa assistance.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Guided by a customer-first philosophy, we ensure every journey is
              easy, enjoyable, and memorable.
            </p>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            src="https://images.unsplash.com/photo-1526779259212-939e64788e3c"
            className="rounded-3xl shadow-xl w-full"
            alt="Dubai View"
          />
        </div>
      </section>

      {/* ⭐ WHO WE ARE */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2"
            alt="Who We Are"
            className="rounded-3xl shadow-xl w-full object-cover"
          />

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl font-bold text-[#721011]">Who We Are</h2>

            <p className="text-gray-700">
              Desert Planners Tourism LLC is a professional Destination
              Management Company (DMC) offering a full suite of travel and
              tourism services across the UAE.
            </p>

            <p className="text-gray-700">
              We collaborate with luxury hospitality brands, certified guides
              and trusted operators to deliver premium experiences.
            </p>

            <p className="text-gray-700">
              Our team blends deep UAE knowledge with outstanding customer
              service to ensure smooth and memorable journeys.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ⭐ WHAT WE OFFER */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-[#721011] text-center mb-8">
          What We Offer
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-7 bg-white shadow-xl rounded-3xl border text-center"
          >
            <FaUmbrellaBeach className="text-[#e82429] text-5xl mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-1">UAE Tours</h3>
            <p className="text-gray-600">
              Desert adventures, theme parks, city tours & more.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-7 bg-white shadow-xl rounded-3xl border text-center"
          >
            <FaSuitcaseRolling className="text-[#e82429] text-5xl mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-1">Holiday Packages</h3>
            <p className="text-gray-600">
              Customizable & affordable travel packages.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-7 bg-white shadow-xl rounded-3xl border text-center"
          >
            <FaPassport className="text-[#e82429] text-5xl mx-auto mb-3" />
            <h3 className="text-xl font-semibold mb-1">Visa Services</h3>
            <p className="text-gray-600">
              Fast & reliable UAE visa processing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ⭐ WHY CHOOSE US */}
      <section className="bg-gray-50 py-8 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-[#721011] text-center mb-10">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              "Trusted by thousands of travelers",
              "Professional & transparent service",
              "Dedicated customer support",
              "Verified tours ensuring comfort & safety",
              "Exclusive discounts & special deals",
              "Personalized support for families & groups",
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="flex items-center p-4 bg-white rounded-2xl shadow border"
              >
                <FaStar className="text-[#e82429] text-xl mr-3" />
                <p className="text-gray-700">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ⭐ CTA */}
      <section className="py-8 text-center bg-gradient-to-r from-[#721011] to-[#e82429] text-white">
        <h2 className="text-4xl font-bold mb-3">Plan Your UAE Journey With Us</h2>

        <p className="text-white/90 text-lg max-w-2xl mx-auto mb-5">
          From desert safaris to visa support - we make your UAE travel smooth and unforgettable.
        </p>

        <button className="px-8 py-4 bg-white text-[#721011] rounded-xl shadow-lg font-semibold hover:scale-105 transition">
          Start Booking
        </button>
      </section>
    </div>
  );
}
