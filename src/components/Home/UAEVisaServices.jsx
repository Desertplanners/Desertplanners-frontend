import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation

const visaServices = [
  { name: "30-Days Tourist Visa Single Entry", price: "AED 350", img: "https://plus.unsplash.com/premium_photo-1726863229625-6e3eda258d03?auto=format&fit=crop&q=80&w=1154" },
  { name: "30-Days Business Visa Multiple Entry", price: "AED 450", img: "https://images.unsplash.com/photo-1601914196574-8b79db884f73?auto=format&fit=crop&q=80&w=735" },
  { name: "60-Days A2A Visa Changes", price: "AED 500", img: "https://images.unsplash.com/photo-1579192975267-9f7e7bb10afb?auto=format&fit=crop&q=80&w=1074" },
  { name: "60-Days Tourist Visa Single Entry", price: "AED 600", img: "https://images.unsplash.com/photo-1538512126441-b70b1d71c50b?auto=format&fit=crop&q=80&w=1170" },
  { name: "60-Days Tourist Visa Multiple Entry", price: "AED 400", img: "https://plus.unsplash.com/premium_photo-1694475218266-b93569487419?auto=format&fit=crop&q=80&w=1170" },
  { name: "A2A 30-Day Visa Changes", price: "AED 550", img: "https://plus.unsplash.com/premium_photo-1694475183306-4efa6a24f59c?auto=format&fit=crop&q=80&w=1171" },
];

export default function UAEVisaServicesSlider() {
  const [current, setCurrent] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const navigate = useNavigate(); // ✅ Initialize navigate

  // Responsive cards per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setCardsPerView(4);
      else if (window.innerWidth >= 640) setCardsPerView(2);
      else setCardsPerView(1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % visaServices.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + visaServices.length) % visaServices.length);

  const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
  const handleTouchMove = (e) => setTouchEndX(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStartX - touchEndX > 50) nextSlide();
    if (touchEndX - touchStartX > 50) prevSlide();
  };

  const getVisible = () => {
    const visible = [];
    for (let i = 0; i < cardsPerView; i++) {
      visible.push(visaServices[(current + i) % visaServices.length]);
    }
    return visible;
  };

  const visibleVisas = getVisible();
  const totalPages = Math.ceil(visaServices.length / cardsPerView);

  // ✅ Function to create slug for details page
  const getSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 relative">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-left" style={{ color: "#404041" }}>
          UAE Visa Services
        </h2>

        <div
          className="relative flex items-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Button */}
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition hidden sm:block"
          >
            <FiChevronLeft size={24} />
          </button>

          {/* Cards */}
          <div className="flex gap-6 overflow-hidden w-full">
            {visibleVisas.map((visa, idx) => (
              <div
                key={idx}
                className={`relative flex-shrink-0 rounded-xl shadow-lg bg-white transition-transform duration-500 flex flex-col justify-between cursor-pointer ${
                  cardsPerView === 4 ? "w-[23%]" : cardsPerView === 2 ? "w-[48%]" : "w-full"
                }`}
              >
                <div
                  className="overflow-hidden rounded-t-xl"
                  onClick={() => navigate(`/visa/${getSlug(visa.name)}`)} // ✅ Card click
                >
                  <img
                    src={visa.img}
                    alt={visa.name}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-5 flex flex-col items-center space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800 text-center">{visa.name}</h3>
                  <p className="text-[#e82429] font-bold text-lg">{visa.price}</p>
                </div>

                <div className="p-5 w-full">
                  <button
                    onClick={() => navigate("/contact")} // ✅ Enquire Now click
                    className="w-full px-4 py-2 bg-[#e82429] text-white rounded-lg text-sm font-semibold hover:bg-[#721011] transition"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-100 transition hidden sm:block"
          >
            <FiChevronRight size={24} />
          </button>
        </div>

        {/* Dots for Mobile/Tablet */}
        <div className="flex justify-center mt-6 gap-2 sm:hidden">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx * cardsPerView)}
              className={`w-3 h-3 rounded-full transition ${
                idx === Math.floor(current / cardsPerView) ? "bg-[#e82429]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
