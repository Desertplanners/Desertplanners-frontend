import React from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaMoneyBillWave,
  FaLock,
  FaRegClock,
  FaHeadset,
  FaSmileBeam,
  FaGlobeAmericas,
  FaCertificate,
} from "react-icons/fa";

export default function WhyBookWithUs() {
  const features = [
    {
      icon: <FaCalendarCheck className="text-primary" />,
      title: "Free & Easy Booking",
      desc: (
        <>
          Planning your Dubai adventure has never been simpler! At Desert
          Planners, you can book Dubai tours and activities online in just a few
          clicks no registration fees and instant confirmation. Whether you’re
          reserving a{" "}
          <Link
            to="/tours/dubai-city-tour"
            className="text-primary font-semibold hover:underline"
          >
            Dubai City Tour
          </Link>{" "}
          or Abu Dhabi Sightseeing Package, our process is quick, secure, and
          hassle-free.
        </>
      ),
    },
    {
      icon: <FaMoneyBillWave className="text-primary" />,
      title: "Best Price Guarantee",
      desc: (
        <>
          Get the best deals on Dubai tour packages guaranteed! Desert Planners
          partners directly with top operators to ensure you always get the
          lowest rates on Desert Safari, Theme Park Tickets and City Tours.
          Premium experiences at unbeatable prices.
        </>
      ),
    },
    {
      icon: <FaLock className="text-primary" />,
      title: "100% Secure Online Payment",
      desc: (
        <>
          Your security is our top priority. All online payments on
          DesertPlanners.net are SSL-protected and encrypted to safeguard your
          data. Book with confidence knowing your transactions are completely
          safe.
        </>
      ),
    },
    {
      icon: <FaRegClock className="text-primary" />,
      title: "Instant Confirmation & Easy Refund Policy",
      desc: (
        <>
          No waiting, no stress! Once your booking is complete, you’ll receive
          an instant confirmation email. And if plans change, our transparent
          and simple refund process makes it worry-free.
        </>
      ),
    },
    {
      icon: <FaHeadset className="text-primary" />,
      title: "24x7 WhatsApp & Live Chat Support",
      desc: (
        <>
          Our expert travel consultants are available round-the-clock. Whether
          you need help customizing your Desert Safari or planning a family
          holiday, we’re here via WhatsApp, phone, or live chat anytime,
          anywhere.
        </>
      ),
    },
    {
      icon: <FaSmileBeam className="text-primary" />,
      title: "Thousands of Happy Travelers Worldwide",
      desc: (
        <>
          With thousands of satisfied guests, Desert Planners is one of Dubai’s
          most trusted names in tourism. Our guests love our punctuality,
          professionalism, and unforgettable experiences.
        </>
      ),
    },
    {
      icon: <FaGlobeAmericas className="text-primary" />,
      title: "Experience Dubai Like Never Before",
      desc: (
        <>
          From thrilling{" "}
          <Link
            to="/tours/desert-safari-with-bbq-dinner"
            className="text-primary font-semibold hover:underline"
          >
            Desert Safaris
          </Link>{" "}
          to Burj Khalifa Tours, IMG World Tickets, and Abu Dhabi Packages
          Desert Planners is your one-stop destination for unforgettable Dubai
          adventures.
        </>
      ),
    },
    {
      icon: <FaCertificate className="text-primary" />,
      title: "Licensed & Trusted Dubai Tour Operator",
      desc: (
        <>
          Desert Planners is a DTCM-approved DMC offering safe, authentic, and
          memorable tours across Dubai and the UAE. With certified guides and
          years of experience, we’re your trusted travel partner in the region.
        </>
      ),
    },
  ];

  return (
    <section className="bg-gray-50 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* HEADING */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-[#FF6B00] via-[#FF0080] to-[#7000FF] bg-clip-text text-transparent">
          Why Book With Us?
        </h2>

        <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-10">
          Desert Planners – Your Trusted Dubai Travel Partner
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {features.map((item, index) => (
            <div
              key={index}
              className="
                bg-white 
                p-4 sm:p-6 md:p-8
                rounded-xl md:rounded-2xl
                shadow-sm md:shadow-md
                hover:shadow-lg hover:-translate-y-1
                border border-gray-100
                transition-all duration-300
                text-left
              "
            >
              {/* ICON + TITLE */}
              <div className="flex items-center gap-3 mb-3">
                {/* ICON */}
                <div className="bg-primary/10 p-2 sm:p-3 rounded-lg flex items-center justify-center shrink-0 w-10 h-10">
                  {React.cloneElement(item.icon, { size: 18 })}
                </div>

                {/* TITLE */}
                <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-900 leading-tight">
                  {item.title}
                </h3>
              </div>
              {/* DESCRIPTION */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
