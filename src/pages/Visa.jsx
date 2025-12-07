import { useEffect, useState } from "react";
import DataService from "../config/DataService";
import { useNavigate } from "react-router-dom";
import {
  FaStar,
  FaClock,
  FaCalendarCheck,
  FaCheckCircle,
} from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { API } from "../config/API";

export default function VisaPage() {
  const [visaTypes, setVisaTypes] = useState([]);
  const [visaImages, setVisaImages] = useState({});
  const [seo, setSEO] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const api = DataService();

    // ⭐ Fetch SEO for Visa Page
    const fetchSEO = async () => {
      try {
        const res = await api.get(API.GET_SEO("page", "visa"));
        if (res.data?.seo) setSEO(res.data.seo);
      } catch (err) {
        console.log("Visa Page SEO Error:", err);
      }
    };

    fetchSEO();

    // ⭐ Fetch Visa Categories
    api.get("/api/visa-categories").then((res) => {
      const list = res.data || [];
      setVisaTypes(list);
      list.forEach((v) => fetchVisaImage(v));
    });

    // ⭐ Fetch First Visa Image Per Category
    const fetchVisaImage = async (visa) => {
      try {
        const res = await api.get(`/api/visas?categorySlug=${visa.slug}`);
        const items = res.data || [];
        const firstVisa = items[0] || {};

        const firstImage =
          firstVisa.gallery?.[0] ||
          firstVisa.img ||
          firstVisa.image ||
          firstVisa.thumbnail ||
          (firstVisa.images?.length > 0 ? firstVisa.images[0] : null);

        setVisaImages((prev) => ({ ...prev, [visa.slug]: firstImage }));
      } catch (err) {
        console.log("Visa image load error:", err);
      }
    };
  }, []);

  return (
    <div className="w-full">

      {/* ⭐⭐⭐ SEO START ⭐⭐⭐ */}
      {seo && (
        <Helmet>
          <title>{seo.seoTitle}</title>
          <meta name="description" content={seo.seoDescription} />
          <meta name="keywords" content={seo.seoKeywords} />
          <link rel="canonical" href="https://www.desertplanners.net/visa" />

          {/* OG Tags */}
          <meta property="og:title" content={seo.seoTitle} />
          <meta property="og:description" content={seo.seoDescription} />
          <meta property="og:image" content={seo.seoOgImage} />
          <meta property="og:url" content="https://www.desertplanners.net/visa" />
          <meta property="og:type" content="website" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seo.seoTitle} />
          <meta name="twitter:description" content={seo.seoDescription} />
          <meta name="twitter:image" content={seo.seoOgImage} />

          {/* PAGE SCHEMA */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: seo.seoTitle,
              description: seo.seoDescription,
              url: "https://www.desertplanners.net/visa",
              image: seo.seoOgImage,
              publisher: {
                "@type": "Organization",
                name: "Desert Planners UAE",
              },
            })}
          </script>

          {/* FAQ SCHEMA */}
          {seo.faqs?.length > 0 && (
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: seo.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.question,
                  acceptedAnswer: { "@type": "Answer", text: f.answer },
                })),
              })}
            </script>
          )}
        </Helmet>
      )}
      {/* ⭐⭐⭐ SEO END ⭐⭐⭐ */}

      {/* ⭐⭐⭐ VISA BANNER ⭐⭐⭐ */}
      <section className="bg-gradient-to-br from-[#f9fafc] via-[#f5f6f9] to-[#f8f8fb] py-16">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-10">
          
          {/* LEFT TEXT */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1c1c1c] leading-snug">
              Visa Services | UAE Visa, Tourist Visa & Express Processing
            </h1>

            <ul className="space-y-4 text-gray-700 text-lg">
              <li className="flex items-center gap-3">
                <FaCalendarCheck className="text-[#e82429]" size={22} />
                Fast processing & verified visa consultants.
              </li>
              <li className="flex items-center gap-3">
                <FaStar className="text-[#e82429]" size={22} />
                High approval rate & secure documentation.
              </li>
              <li className="flex items-center gap-3">
                <FaClock className="text-[#e82429]" size={22} />
                Support for urgent & express visa requests.
              </li>
            </ul>

            <button className="mt-6 bg-[#e82429] text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-[#b9191c] transition-all duration-300">
              Explore Visa Options
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <div className="md:w-1/2 flex justify-center relative">
            <div className="absolute inset-0 bg-[#e82429]/10 blur-3xl rounded-full -z-10"></div>
            <img
              src="https://i.pinimg.com/736x/d0/d2/ee/d0d2ee92bbf5ec268cbb9a1696e0aa3c.jpg"
              alt="Visa Banner"
              className="rounded-2xl shadow-xl w-full h-[350px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ⭐ CATEGORY CARDS ⭐ */}
      <div className="max-w-[1200px] mx-auto py-12 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#1c1c1c]">Visa Categories</h2>

        <div className="space-y-8">
          {visaTypes.map((visa) => (
            <div
              key={visa._id}
              onClick={() => navigate(`/visa/${visa.slug}`)}
              className="bg-white border border-gray-200 rounded-2xl shadow-md 
                 p-5 flex flex-col md:flex-row gap-6 hover:shadow-xl 
                 transition-all duration-300 cursor-pointer"
            >
              
              {/* IMAGE */}
              <div className="md:w-1/3 w-full overflow-hidden rounded-xl">
                <img
                  src={visaImages[visa.slug]}
                  alt={visa.name}
                  className="w-full h-52 md:h-60 object-cover rounded-xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="flex-1 flex flex-col justify-center space-y-3">
                <h2 className="text-2xl font-bold text-[#1c1c1c]">{visa.name}</h2>
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  Fast & easy UAE visa processing with expert support, verified 
                  documents and high approval success rate.
                </p>

                <div className="flex items-center gap-3 text-sm text-gray-600 pt-1">
                  <span className="flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" /> Verified service
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarCheck className="text-[#721011]" /> Flexible plans
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock className="text-gray-500" /> 24×7 support
                  </span>
                </div>

                <span className="text-[#e82429] font-semibold text-sm mt-1 inline-block">
                  Explore {visa.name} Options →
                </span>
              </div>

              {/* CTA BOX */}
              <div className="md:w-1/4 w-full md:border-l border-t md:border-t-0 border-gray-200 
                   flex flex-col justify-center pt-3 md:pt-0 md:pl-6 space-y-4"
              >
                <div className="bg-[#fff5f5] border border-[#e82429]/20 rounded-xl p-4">
                  <p className="text-[#721011] font-bold text-lg">Popular Visa Type</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Trusted visa applications with high approval success.
                  </p>
                </div>

                <button
                  className="bg-gradient-to-r from-[#e82429] to-[#721011] text-white 
                     font-semibold py-2.5 px-4 rounded-lg shadow hover:scale-[1.02] 
                     transition-all duration-300"
                >
                  View Details
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
