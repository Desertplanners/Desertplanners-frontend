import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

export default function VisaBanner() {
  const navigate = useNavigate();

  return (
    <section className="flex justify-center py-10 bg-gradient-to-b from-gray-50 to-white">
      <div
        className="relative w-full max-w-[1200px] rounded-3xl overflow-hidden cursor-pointer shadow-xl group"
        onClick={() => navigate("/visa")}
      >
        {/* Background Image */}
        <img
  src="/visabanner.png"
  alt="Visa Services"
  className="w-full h-[400px] object-contain object-center transition-transform duration-700 bg-black"
/>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all duration-500"></div>

        {/* Content */}
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
    </section>
  );
}
