import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import DataService from "../../config/DataService";
import { API } from "../../config/API";

export default function TopAttractionsCarousel() {
  const [attractions, setAttractions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const navigate = useNavigate();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // ✅ Section ID for “Top Attractions”
  const sectionId = "69083cc3dda693d673b550fd";

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const api = DataService();
        const res = await api.get(API.GET_SECTION_ITEMS(sectionId));
        setAttractions(res.data || []);
      } catch (error) {
        console.error("Error fetching attractions:", error);
      }
    };
    fetchAttractions();
  }, [sectionId]);

  // ✅ Handle responsiveness
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

  // ✅ Auto slide every 5 seconds
  useEffect(() => {
    if (attractions.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % attractions.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [attractions]);

  // ✅ Next / Prev buttons
  const next = () => setCurrent((prev) => (prev + 1) % attractions.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + attractions.length) % attractions.length);

  // ✅ Swipe support
  const handleTouchStart = (e) => (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e) => (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // ✅ Get visible items
  const getVisible = () => {
    const visible = [];
    for (let i = 0; i < cardsPerView; i++) {
      visible.push(attractions[(current + i) % attractions.length]);
    }
    return visible;
  };

  const visibleAttractions = getVisible();
  const totalPages = Math.ceil(attractions.length / cardsPerView);

  // ✅ No loading or "no data" message — simply return nothing if empty
  if (!attractions.length) {
    return null;
  }

  // ✅ Main UI
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-[1200px] mx-auto px-4 relative">
        <h2
          className="text-3xl sm:text-4xl font-bold mb-6 text-left"
          style={{ color: "#404041" }}
        >
          Top Attractions
        </h2>

        <div
          className="relative flex items-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Button */}
          <button
            onClick={prev}
            className="absolute left-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition hidden sm:flex"
          >
            <FiChevronLeft size={22} />
          </button>

          {/* Cards */}
          <div className="flex gap-6 overflow-hidden w-full transition-transform duration-500">
            {visibleAttractions.map((item, idx) => (
              <div
                key={idx}
                onClick={() => item.link && navigate(item.link)}
                className="relative flex-shrink-0 rounded-xl shadow-md overflow-hidden bg-white transition-transform duration-500 cursor-pointer hover:scale-[1.03]"
                style={{ width: `${100 / cardsPerView - 1.5}%` }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-80 object-cover transform transition duration-500 hover:scale-105"
                />
                {/* Text inside image */}
                <div className="absolute bottom-0 left-0 w-full bg-black/50 backdrop-blur-sm px-5 py-4 flex flex-col items-start">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-1 tracking-wide">
                    {item.name}
                  </h3>

                  {item.price && (
                    <div className="flex items-center gap-1 text-sm sm:text-base text-gray-200">
                      <span className="text-white/90">From</span> AED
                      <span className="text-[#ff4d4d] font-semibold">
                        {item.price}
                      </span>
                      <span className="text-white/80">/ person</span>
                    </div>
                  )}
                </div>
                {/* <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4">
  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 leading-tight drop-shadow-md">
    {item.name}
  </h3>

  {item.price && (
    <p className="text-sm sm:text-base text-gray-200 font-medium">
      From{" "}
      <span className="text-[#ffb703] font-semibold">
        {item.price}
      </span>{" "}
      / person
    </p>
  )}
</div> */}
              </div>
            ))}
          </div>

          {/* Right Button */}
          <button
            onClick={next}
            className="absolute right-0 z-10 bg-white bg-opacity-70 hover:bg-opacity-100 p-2 rounded-full shadow-md transition hidden sm:flex"
          >
            <FiChevronRight size={22} />
          </button>
        </div>

        {/* Pagination Dots (Mobile) */}
        <div className="flex justify-center mt-6 gap-2 sm:hidden">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx * cardsPerView)}
              className={`w-3 h-3 rounded-full transition ${
                idx === Math.floor(current / cardsPerView)
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
