import React, { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const attractions = [
  { name: "Burj Khalifa", price: "AED 350", img: "https://plus.unsplash.com/premium_photo-1694475634077-e6e4b623b574?auto=format&fit=crop&w=1071&q=80" },
  { name: "Desert Safari", price: "AED 250", img: "https://images.unsplash.com/photo-1588310558566-b983c7d257e4?auto=format&fit=crop&w=688&q=80" },
  { name: "Ferrari World", price: "AED 450", img: "https://images.unsplash.com/photo-1578152882785-df9744e359e5?auto=format&fit=crop&w=735&q=80" },
  { name: "Palm Jumeirah", price: "AED 200", img: "https://images.unsplash.com/photo-1682410601904-24ec1d9858e6?auto=format&fit=crop&w=1074&q=80" },
  { name: "Dubai Marina", price: "AED 150", img: "https://images.unsplash.com/photo-1459787915554-b34915863013?auto=format&fit=crop&w=633&q=80" },
  { name: "Global Village", price: "AED 100", img: "https://images.unsplash.com/photo-1671949047848-847819cdc705?auto=format&fit=crop&w=1074&q=80" },
];

export default function TopAttractionsCarousel() {
  const [current, setCurrent] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

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

  const next = () => setCurrent((prev) => (prev + 1) % attractions.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + attractions.length) % attractions.length);

  const getVisible = () => {
    const visible = [];
    for (let i = 0; i < cardsPerView; i++) {
      visible.push(attractions[(current + i) % attractions.length]);
    }
    return visible;
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const visibleAttractions = getVisible();

  // ✅ Auto slide effect (every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % attractions.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Total pages for dots
  const totalPages = Math.ceil(attractions.length / cardsPerView);

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
                className="relative flex-shrink-0 rounded-xl shadow-lg group overflow-hidden transition-transform duration-500"
                style={{ width: `${100 / cardsPerView - 1.5}%` }}
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-80 object-cover transform transition duration-500 group-hover:scale-105"
                />
                <span className="absolute top-2 left-2 bg-[#e82429] text-white px-3 py-1 rounded-full font-semibold text-sm">
                  {item.price}
                </span>
                <div className="absolute bottom-0 w-full bg-black/40 backdrop-blur-sm px-4 py-3 text-white font-semibold text-lg text-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                  {item.name}
                </div>
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

        {/* Pagination Dots (Mobile & Tablet) */}
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
