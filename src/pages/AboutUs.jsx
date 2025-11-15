import React from "react";
import { motion } from "framer-motion";
import {
  FaPassport,
  FaUmbrellaBeach,
  FaSuitcaseRolling,
  FaHandshake,
  FaStar,
  FaUsers,
} from "react-icons/fa";

export default function AboutUs() {
  return (
    <div className="bg-white">
      
      {/* HERO SECTION */}
      <section className="relative bg-[#f3f3f3] py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-extrabold text-[#721011] tracking-tight"
          >
            About Us
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 max-w-2xl mx-auto mt-4 text-lg"
          >
            Discover who we are and how Desert Planners Tourism LLC brings your 
            UAE journey to life.
          </motion.p>
        </div>
      </section>

      {/* INTRO SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-5"
          >
            <h2 className="text-3xl font-bold text-[#721011]">Welcome to Desert Planners</h2>
            
            <p className="text-gray-700 leading-relaxed">
              Desert Planners Tourism LLC, based in Dubai, specializes in creating 
              unforgettable travel experiences — from iconic city tours and desert 
              adventures to customized holiday packages and smooth visa assistance.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Guided by a customer-first philosophy, we ensure every journey is 
              easy, enjoyable, and memorable. Whether it’s your first UAE visit or 
              your tenth, we make it extraordinary.
            </p>
          </motion.div>

          <motion.img
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
            className="rounded-3xl shadow-xl w-full"
            alt="Dubai View"
          />
        </div>
      </section>

      {/* WHO WE ARE SECTION */}
      <section className="bg-gray-50 py-16 border-t">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-[#721011] text-center mb-10">
            Who We Are
          </h2>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-lg rounded-3xl p-10 border"
          >
            <p className="text-gray-700 mb-4 leading-relaxed">
              Desert Planners Tourism LLC is a professional Destination Management 
              Company (DMC) offering a complete range of tourism and travel solutions 
              across the United Arab Emirates.
            </p>

            <p className="text-gray-700 mb-4 leading-relaxed">
              We collaborate with certified tour guides, luxury hospitality brands, 
              and trusted activity providers to deliver high-quality travel 
              experiences that exceed expectations.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Our team brings strong experience in tourism, customer service, and 
              itinerary planning — delivering local UAE insights with international 
              service standards.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section className="max-w-6xl mx-auto px-6 py-16">

        <h2 className="text-3xl font-bold text-[#721011] text-center mb-12">
          What We Offer
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* UAE Tours */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white shadow-xl rounded-3xl border text-center"
          >
            <FaUmbrellaBeach className="text-[#e82429] text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">UAE Tours</h3>
            <p className="text-gray-600 leading-relaxed">
              Sightseeing, desert adventures, theme parks, guided cultural tours 
              & more for families, couples, and corporate guests.
            </p>
          </motion.div>

          {/* Holiday Packages */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white shadow-xl rounded-3xl border text-center"
          >
            <FaSuitcaseRolling className="text-[#e82429] text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Holiday Packages</h3>
            <p className="text-gray-600 leading-relaxed">
              Customizable & affordable holiday packages with premium stays, 
              transfers, activities & curated itineraries.
            </p>
          </motion.div>

          {/* Visa Services */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="p-8 bg-white shadow-xl rounded-3xl border text-center"
          >
            <FaPassport className="text-[#e82429] text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Visa Services</h3>
            <p className="text-gray-600 leading-relaxed">
              Fast & reliable UAE visa processing with document support, updates, 
              and smooth assistance.
            </p>
          </motion.div>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-gray-50 py-16 border-t">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-[#721011] text-center mb-12">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {[
              "Trusted by thousands of travelers",
              "Professional & transparent service",
              "Dedicated customer support",
              "Verified tours ensuring comfort & safety",
              "Exclusive discounts & special deals",
              "Personalized support for families & groups",
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="flex items-center p-5 bg-white rounded-2xl shadow border"
              >
                <FaStar className="text-[#e82429] text-xl mr-4" />
                <p className="text-gray-700">{item}</p>
              </motion.div>
            ))}

          </div>

        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-10">

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-3xl font-bold text-[#721011] mb-3">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To provide travelers with smooth, enjoyable, and memorable UAE 
              experiences through curated tours, reliable services, and 
              international-standard hospitality.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="text-3xl font-bold text-[#721011] mb-3">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To become one of the UAE’s most trusted and customer-preferred 
              tourism companies, recognized for excellence and reliability.
            </p>
          </motion.div>

        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 text-center bg-gradient-to-r from-[#721011] to-[#e82429] text-white">
        <h2 className="text-4xl font-bold mb-4">Plan Your UAE Journey With Us</h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto mb-6">
          From desert safaris to visa support — Desert Planners Tourism LLC makes 
          your UAE travel smooth, safe, and unforgettable.
        </p>

        <button className="px-8 py-4 bg-white text-[#721011] rounded-xl shadow-lg font-semibold hover:scale-105 transition">
          Start Booking
        </button>
      </section>
    </div>
  );
}
