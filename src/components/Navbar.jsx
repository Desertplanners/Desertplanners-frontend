import { useState, useEffect } from "react";
import { FiMenu, FiX, FiChevronDown, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [tourCategories, setTourCategories] = useState([]);
  const [holidayCategories, setHolidayCategories] = useState([]);
  const [visaCategories, setVisaCategories] = useState([]);

  const [openIndex, setOpenIndex] = useState(null);
  const [openSubIndex, setOpenSubIndex] = useState({});
  const [openVisaIndex, setOpenVisaIndex] = useState(null);

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [visaTree, setVisaTree] = useState([]);

  useEffect(() => {
    const api = DataService();
    api
      .get(API.GET_VISA_NAVBAR)
      .then((res) => setVisaTree(res.data || []))
      .catch(() => console.log("Visa navbar load failed"));
  }, []);
  // ================================
  // CHECK IF USER LOGGED IN
  // ================================
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("userToken");
      setUserLoggedIn(!!token);
    };

    checkLogin();

    window.addEventListener("userLoginChange", checkLogin);
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("userLoginChange", checkLogin);
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  // ================================
  // FETCH ALL CATEGORIES
  // ================================
  useEffect(() => {
    const api = DataService();

    // ⭐ 1. Fetch Tour Categories
    const getTourCategories = async () => {
      try {
        const res = await api.get(API.GET_CATEGORIES);
        const categories = res.data || [];

        const formatted = await Promise.all(
          categories.map(async (cat) => {
            const slug =
              cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");

            try {
              const toursRes = await api.get(API.GET_TOURS_BY_CATEGORY(slug));
              return { ...cat, slug, tours: toursRes.data || [] };
            } catch {
              return { ...cat, slug, tours: [] };
            }
          })
        );

        setTourCategories(formatted);
      } catch (err) {
        console.log("Error fetching tour categories:", err);
      }
    };

    // ⭐ 2. Fetch Holiday Categories (FIXED)
    const getHolidayCategories = async () => {
      try {
        const res = await api.get(API.GET_HOLIDAY_CATEGORIES);
        const holidayCats = res.data || [];

        const formatted = await Promise.all(
          holidayCats.map(async (cat) => {
            try {
              const packagesRes = await api.get(
                API.GET_PACKAGES_BY_CATEGORY2(cat.slug)
              );

              return {
                ...cat,
                slug: cat.slug,
                packages: packagesRes.data || [], // ✅ FIX HERE
              };
            } catch {
              return { ...cat, slug: cat.slug, packages: [] };
            }
          })
        );

        setHolidayCategories(formatted);
      } catch (err) {
        console.log("Error fetching holiday categories:", err);
      }
    };

    // ⭐ 3. Fetch Visa Categories
    const getVisaCategories = async () => {
      try {
        const visaRes = await api.get(API.GET_VISA_CATEGORIES);
        const visaCats = visaRes.data || [];

        const formatted = await Promise.all(
          visaCats.map(async (vCat) => {
            try {
              const visasRes = await api.get(
                `${API.GET_VISAS}?category=${vCat._id}`
              );
              return { ...vCat, visas: visasRes.data || [] };
            } catch {
              return { ...vCat, visas: [] };
            }
          })
        );

        setVisaCategories(formatted);
      } catch (err) {
        console.log("Error fetching visa categories:", err);
      }
    };

    getTourCategories();
    getHolidayCategories();
    getVisaCategories();
  }, []);

  // ================================
  // NAV STRUCTURE
  // ================================
  const navLinks = [
    {
      title: "Tours",
      path: "/tours",
      subLinks: tourCategories.map((cat) => ({
        name: cat.name,
        path: `/tours/${cat.slug}`,
        subSubLinks:
          cat.tours?.map((tour) => ({
            name: tour.title,
            path: `/tours/${cat.slug}/${tour.slug}`,
          })) || [],
      })),
    },

    // ⭐ FIXED HOLIDAY SECTION
    {
      title: "Holiday Packages",
      path: "/holidays",
      subLinks: holidayCategories.map((cat) => ({
        name: cat.name,
        path: `/holidays/${cat.slug}`,
        subSubLinks:
          cat.packages?.map((pkg) => ({
            name: pkg.title,
            path: `/holidays/${cat.slug}/${pkg.slug}`,
          })) || [],
      })),
    },
  ];

  // ================================
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-4">
        {/* LOGO */}
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img
            src="/desertplanners_logo.png"
            alt="Logo"
            className="h-12 w-auto"
          />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden lg:flex items-center space-x-6">
          {/* ================= NORMAL NAV LINKS ================= */}
          {navLinks.map((link, i) => (
            <div key={i} className="relative group">
              <Link
                to={link.path}
                className="flex items-center gap-1 font-medium text-[#404041] hover:text-[#e82429]"
              >
                {link.title}
                {link.subLinks?.length > 0 && <FiChevronDown size={16} />}
              </Link>

              {/* DROPDOWN */}
              {link.subLinks?.length > 0 && (
                <div
                  className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl
                      opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                >
                  <ul className="py-3">
                    {link.subLinks.map((sublink, j) => (
                      <li key={j} className="relative group/sub">
                        <Link
                          to={sublink.path}
                          className="flex justify-between items-center px-5 py-2 text-sm text-[#404041] hover:bg-[#f7e6e6]"
                        >
                          {sublink.name}
                          {sublink.subSubLinks?.length > 0 && (
                            <FiChevronDown size={14} />
                          )}
                        </Link>

                        {/* LEVEL 2 */}
                        {sublink.subSubLinks?.length > 0 && (
                          <ul
                            className="absolute left-full top-0 ml-2 w-56 bg-white rounded-xl shadow-lg
                                opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all"
                          >
                            {sublink.subSubLinks.map((sub, k) => (
                              <li key={k}>
                                <Link
                                  to={sub.path}
                                  className="block px-4 py-2 text-sm hover:bg-[#f7e6e6]"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* ================= VISA SERVICES – MEGA MENU ================= */}

          <div className="relative group">
            {/* TRIGGER */}
            <Link
              to="/visa"
              className="flex items-center gap-2   transition"
            >
              <span className="relative">
                Visa Services
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-[#e82429] group-hover:w-full transition-all"></span>
              </span>
              <FiChevronDown size={16} />
            </Link>

            {/* DROPDOWN */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-full mt-4
      w-[980px]
      bg-white
      rounded-3xl
      shadow-[0_28px_80px_rgba(0,0,0,0.18)]
      border border-[#e82429]/10
      p-7
      opacity-0 invisible translate-y-4
      group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
      transition-all duration-300 ease-out
    "
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-[#721011]">
                    🌍 Visa Services by Destination
                  </h3>
                 
                </div>
                <Link
                  to="/visa"
                  className="text-sm text-[#e82429] font-medium hover:underline"
                >
                  Explore All →
                </Link>
              </div>

              {/* GRID */}
              <div
                className="  grid
  grid-cols-2
  md:grid-cols-3
  lg:grid-cols-6
  gap-5
  max-h-[380px]
  overflow-y-auto
  pr-2"
              >
                {visaTree.map((region) => (
                  <div key={region._id}>
                    {/* REGION TITLE */}
                    <div className="mb-3">
                      <h4 className="text-xs font-extrabold tracking-wider text-[#721011] uppercase">
                        {region.name}
                      </h4>
                      <div className="h-[2px] w-10 bg-[#e82429] mt-1 rounded-full"></div>
                    </div>

                    {/* COUNTRY LIST */}
                    <ul className="space-y-2">
                      {region.subCategories?.map((country) => (
                        <li key={country._id}>
                          <Link
                            to={`/visa/${region.slug}/${country.slug}`}
                            className="
                    group/item
                    flex items-center gap-3
                    px-3 py-2
                    rounded-xl
                    text-sm
                    bg-transparent
                    hover:bg-gradient-to-r hover:from-[#fbeaea] hover:to-white
                    transition-all duration-200
                  "
                          >
                            {/* BIG FLAG */}
                            {country.countryCode && (
                              <img
                                src={`https://flagcdn.com/w40/${country.countryCode.toLowerCase()}.png`}
                                alt={country.countryCode}
                                className="
                        w-8 h-5
                        rounded-md
                        border
                        shadow-md
                        group-hover/item:scale-110
                        transition-transform
                      "
                              />
                            )}

                            {/* COUNTRY NAME */}
                            <span className="text-[15px] font-semibold text-gray-700 group-hover/item:text-[#721011]">
                              {country.name}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Trusted visa experts • High success rate • Fast processing
                </span>
                <Link
                  to="/contact-us"
                  className="text-sm px-5 py-2 rounded-lg bg-[#e82429] text-white hover:bg-[#c51b22] transition"
                >
                  Get Assistance
                </Link>
              </div>
            </div>
          </div>

          {/* ABOUT US – AFTER VISA SERVICES */}
          <Link
            to="/about-us"
            className="flex items-center font-medium text-[#404041] hover:text-[#e82429]"
          >
            About Us
          </Link>

          {/* SEARCH */}
          <form onSubmit={(e) => e.preventDefault()} className="relative ml-4">
            <input
              type="text"
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 w-40"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          {/* CONTACT */}
          <Link
            to="/contact-us"
            className="ml-4 px-6 py-2 rounded-lg bg-[#e82429] text-white shadow hover:bg-[#c51b22]"
          >
            Contact Us
          </Link>

          <ProfileMenu />
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="lg:hidden text-[#404041]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t shadow-md">
          <ul className="flex flex-col p-4 space-y-2">
            {navLinks.map((link, i) => (
              <li key={i}>
                <div className="flex justify-between items-center">
                  <Link
                    to={link.path}
                    className="flex-1 font-medium"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.title}
                  </Link>

                  {link.subLinks?.length > 0 && (
                    <button
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    >
                      <FiChevronDown
                        className={`transition ${
                          openIndex === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* LEVEL 2 */}
                {openIndex === i && link.subLinks?.length > 0 && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {link.subLinks.map((sublink, j) => (
                      <li key={j}>
                        <div className="flex justify-between items-center">
                          <Link
                            to={sublink.path}
                            className="block py-1 text-sm font-medium"
                            onClick={() => setMenuOpen(false)}
                          >
                            {sublink.name}
                          </Link>

                          {sublink.subSubLinks?.length > 0 && (
                            <button
                              onClick={() =>
                                setOpenSubIndex((prev) => ({
                                  ...prev,
                                  [i]: prev[i] === j ? null : j,
                                }))
                              }
                            >
                              <FiChevronDown
                                size={14}
                                className={`transition ${
                                  openSubIndex[i] === j ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* LEVEL 3 */}
                        {openSubIndex[i] === j &&
                          sublink.subSubLinks?.length > 0 && (
                            <ul className="pl-4 mt-1 space-y-1">
                              {sublink.subSubLinks.map((sub, k) => (
                                <li key={k}>
                                  <Link
                                    to={sub.path}
                                    className="block py-1 text-xs text-gray-600"
                                    onClick={() => setMenuOpen(false)}
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {/* VISA SERVICES MOBILE */}
            <li>
              <div className="flex justify-between items-center">
                <Link
                  to="/visa"
                  className="flex-1 font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Visa Services
                </Link>

                {visaTree?.length > 0 && (
                  <button
                    onClick={() =>
                      setOpenVisaIndex(openVisaIndex === 0 ? null : 0)
                    }
                  >
                    <FiChevronDown
                      className={`transition ${
                        openVisaIndex === 0 ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* LEVEL 2 – REGION */}
              {openVisaIndex === 0 && (
                <ul className="pl-4 mt-2 space-y-2">
                  {visaTree.map((region, rIndex) => (
                    <li key={region._id}>
                      <div className="font-medium text-sm">{region.name}</div>

                      {/* LEVEL 3 – COUNTRY */}
                      <ul className="pl-4 mt-1 space-y-1">
                        {region.subCategories?.map((country) => (
                          <li key={country._id}>
                            <Link
                              to={`/visa/${region.slug}/${country.slug}`}
                              className="block py-1 text-xs text-gray-600"
                              onClick={() => setMenuOpen(false)}
                            >
                              {country.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            {/* ABOUT US */}
            <li>
              <Link
                to="/about-us"
                className="block  font-medium"
                onClick={() => setMenuOpen(false)}
              >
                About Us
              </Link>
            </li>

            {/* CONTACT US */}
            <li>
              <Link
                to="/contact-us"
                className="block  font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Contact Us
              </Link>
            </li>
            {/* PROFILE */}
            <li className="border-t pt-3">
              {/* ⭐ CHECK BOOKING (Always show) */}
              <Link
                to="/check-booking"
                className="block py-2"
                onClick={() => setMenuOpen(false)}
              >
                Check Booking
              </Link>

              {userLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/my-orders"
                    className="block py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Orders
                  </Link>

                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.dispatchEvent(new Event("userLoginChange"));
                      setMenuOpen(false);
                    }}
                    className="block py-2 text-left w-full"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="block py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
