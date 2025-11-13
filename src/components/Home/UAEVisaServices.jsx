import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function VisaBanner() {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col w-full items-center py-8 bg-gradient-to-b from-gray-50 to-white">

      {/* Container for heading + banner */}
      <div className="w-full max-w-[1200px] px-4 sm:px-0">

        {/* ✨ Left-Aligned Heading inside Container */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold mb-6 text-left 
                      
                     bg-clip-text  text-[#404041]"
        >
          Explore UAE Visa
        </motion.h1>

        {/* Banner */}
        <div
          className="relative w-full rounded-3xl overflow-hidden cursor-pointer shadow-xl group"
          onClick={() => navigate("/visa")}
        >
          {/* Background Image */}
          <img
            src="/Visa_home_banner.png"
            alt="Visa Services"
            className="w-full h-[400px] object-cover object-center transition-transform duration-700"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-500"></div>

          {/* Banner Text */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-center items-start px-10 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-lg">
              Explore Dubai Visa Services
            </h2>

            <p className="text-lg md:text-xl mb-6 text-gray-100 max-w-[600px] drop-shadow-md">
              Quick, easy, and hassle-free visa processing for your next adventure.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold shadow-md hover:bg-gray-200 transition-all"
            >
              View All Visas <FaArrowRight />
            </motion.button>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
