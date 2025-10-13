import React from "react";
import TourBanner from "../components/Tour/TourBanner";
import TourList from "../components/Tour/TourList";
import FaqSection from "../components/Tour/FaqSection";

export default function ToursPage() {
  return (
    <>
      {/* Banner Section */}
      <TourBanner />

      {/* Tour List Section */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <TourList />
        </div>
      </section>

      {/* Faq Section */}
      <FaqSection />
    </>
  );
}
