import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DataService from "../../config/DataService";
import { API } from "../../config/API";

export default function TopCitiesSlider() {
  const [cities, setCities] = useState([]);
  const [current, setCurrent] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const navigate = useNavigate();

  // ✅ Your section ID from MongoDB
  const sectionId = "69082fb8544d61ec230a8054";

  // ✅ Fetch city items from backend
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_SECTION_ITEMS(sectionId));
        setCities(res.data || []);
      } catch (error) {
        console.error("Error fetching top cities:", error);
      }
    };
    fetchCities();
  }, []);

  // ✅ Responsive visible card count
  const getVisibleCards = () => {
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 4;
  };

  useEffect(() => {
    const handleResize = () => setVisibleCards(getVisibleCards());
    window.addEventListener("resize", handleResize);
    setVisibleCards(getVisibleCards());
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Auto slide effect
  useEffect(() => {
    if (cities.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % cities.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [cities]);

  // ✅ Next / Prev
  const nextSlide = () => setCurrent((prev) => (prev + 1) % cities.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + cities.length) % cities.length);

  // ✅ Swipe gestures
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const threshold = 40;
    if (distance > threshold) nextSlide();
    else if (distance < -threshold) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  // ✅ Slice visible cards
  const getVisibleCities = () => {
    const result = [];
    for (let i = 0; i < visibleCards; i++) {
      result.push(cities[(current + i) % cities.length]);
    }
    return result;
  };

  const visibleCities = getVisibleCities();
  const totalPages = Math.ceil(cities.length / visibleCards);

  // ✅ Empty state only (no "Loading..." message)
  if (!cities.length) {
    return null; // kuch bhi render nahi karega jab tak data na aaye
  }

  // ✅ UI
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1200px] mx-auto relative px-4">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-6 text-left"
          style={{ color: "#404041" }}
        >
          Top Cities to Visit
        </h2>

        <div className="relative flex items-center justify-center">
          <button
            onClick={prevSlide}
            className="absolute left-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition hidden sm:block"
          >
            <FiChevronLeft size={22} />
          </button>

          <div
            className="flex justify-between gap-5 overflow-hidden w-full transition-transform duration-700 ease-in-out touch-pan-x touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {visibleCities.map((city, index) => (
              <div
                key={index}
                onClick={() => city.link && navigate(city.link)}
                className="flex-shrink-0 transition-transform duration-700 ease-in-out cursor-pointer"
                style={{
                  width:
                    visibleCards === 4
                      ? "23%"
                      : visibleCards === 2
                      ? "48%"
                      : "100%",
                }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg group select-none">
                  <img
                    src={city.img}
                    alt={city.name}
                    className="w-full h-72 sm:h-80 object-cover transform group-hover:scale-105 transition duration-700 ease-in-out"
                    draggable="false"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-300" />
                  <h3 className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-2xl font-semibold tracking-wide drop-shadow-lg">
                    {city.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition hidden sm:block"
          >
            <FiChevronRight size={22} />
          </button>
        </div>

        <div className="flex justify-center mt-6 gap-2 sm:hidden">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx * visibleCards)}
              className={`w-3 h-3 rounded-full transition ${
                idx === Math.floor(current / visibleCards)
                  ? "bg-[#e82429]"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
