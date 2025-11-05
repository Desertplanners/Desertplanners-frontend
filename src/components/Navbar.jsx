import { useState, useEffect } from "react";
import { FiMenu, FiX, FiChevronDown, FiSearch, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import DataService from "../config/DataService";
import { API } from "../config/API";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tourCategories, setTourCategories] = useState([]);
  const [holidayCategory, setHolidayCategory] = useState(null);
  const [visas, setVisas] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // ✅ Detect login/logout in real-time (no refresh needed)
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("userToken");
      setUserLoggedIn(!!token);
    };

    checkLogin();

    // Listen for changes from other components or tabs
    window.addEventListener("userLoginChange", checkLogin);
    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("userLoginChange", checkLogin);
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  // ✅ Fetch categories and visas
  useEffect(() => {
    const api = DataService();

    const fetchCategories = async () => {
      try {
        const res = await api.get(API.GET_CATEGORIES);
        const categories = res.data || [];

        const formatted = await Promise.all(
          categories.map(async (cat) => {
            const slug =
              cat.slug ||
              cat.categorySlug ||
              cat.name?.toLowerCase().replace(/\s+/g, "-");
            try {
              const toursRes = await api.get(API.GET_TOURS_BY_CATEGORY(slug));
              return { ...cat, slug, tours: toursRes.data || [] };
            } catch {
              return { ...cat, slug, tours: [] };
            }
          })
        );

        const holiday = formatted.find(
          (cat) =>
            cat.name.toLowerCase().includes("holiday") ||
            cat.slug === "holiday-packages"
        );

        const otherCategories = formatted.filter(
          (cat) =>
            !cat.name.toLowerCase().includes("holiday") &&
            cat.slug !== "holiday-packages"
        );

        setTourCategories(otherCategories);
        setHolidayCategory(holiday);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    const fetchVisas = async () => {
      try {
        const res = await api.get(API.GET_VISAS);
        setVisas(res.data || []);
      } catch (err) {
        console.error("Error fetching visas:", err);
        setVisas([]);
      }
    };

    fetchCategories();
    fetchVisas();
  }, []);

  const navLinks = [
    {
      title: "Tours",
      path: "/tours",
      subLinks:
        tourCategories.map((cat) => ({
          name: cat.name,
          path: `/tours/${cat.slug}`,
          subSubLinks:
            cat.tours?.map((tour) => ({
              name: tour.title,
              path: `/tours/${cat.slug}/${tour.slug}`,
            })) || [],
        })) || [],
    },
    {
      title: "Holiday Packages",
      path: holidayCategory?.slug
        ? `/tours/${holidayCategory.slug}`
        : "/holidays",
      subLinks:
        holidayCategory?.tours?.map((tour) => ({
          name: tour.title,
          path: `/tours/holidays/${tour.slug}`,
        })) || [],
    },
    {
      title: "Visa Services",
      path: "/visa",
      subLinks: visas.map((v) => ({
        name: v.title,
        path: `/visa/${v.slug}`,
      })),
    },
    { title: "Contact Us", path: "/contact-us" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <img
            src="/desertplanners_logo.png"
            alt="Logo"
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {navLinks.map((link, i) => (
            <div key={i} className="relative group">
              <Link
                to={link.path}
                className="flex items-center gap-1 font-medium text-[#404041] hover:text-[#e82429] transition-colors duration-300"
              >
                {link.title}
                {link.subLinks?.length > 0 && <FiChevronDown size={16} />}
              </Link>

              {/* Dropdown */}
              {link.subLinks?.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 invisible group-hover:visible translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-[9999]">
                  <ul className="py-3">
                    {link.subLinks.map((sublink, j) => (
                      <li key={j} className="relative group/sub">
                        <Link
                          to={sublink.path}
                          className="flex justify-between items-center px-5 py-2 text-sm font-medium text-[#404041] hover:bg-[#e82429]/10 hover:text-[#e82429] rounded-md transition-all duration-300"
                        >
                          {sublink.name}
                          {sublink.subSubLinks?.length > 0 && (
                            <FiChevronDown className="ml-2 transform group-hover/sub:rotate-90 transition-transform duration-200" />
                          )}
                        </Link>

                        {sublink.subSubLinks?.length > 0 && (
                          <ul className="absolute left-full top-0 ml-2 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible translate-x-3 group-hover/sub:translate-x-0 transition-all duration-300 z-[9999]">
                            {sublink.subSubLinks.map((sub, k) => (
                              <li key={k}>
                                <Link
                                  to={sub.path}
                                  className="block px-4 py-2 text-sm text-[#404041] hover:bg-[#e82429]/10 hover:text-[#e82429] rounded-md transition-all duration-300"
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

          {/* Search */}
          <form onSubmit={handleSearch} className="ml-6 relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#e82429] transition w-44"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          {/* Contact Button */}
          <Link
            to="/contact"
            className="ml-4 px-6 py-2 rounded-lg font-semibold text-white bg-[#e82429] hover:bg-[#c51b22] transition-transform duration-300 hover:scale-105 shadow-md"
          >
            Contact Us
          </Link>

          {/* ✅ Profile menu refreshes automatically on login/logout */}
          <ProfileMenu key={userLoggedIn ? "loggedIn" : "loggedOut"} />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-[#404041]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* ✅ Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t shadow-md">
          <ul className="flex flex-col p-4 space-y-2">
            {navLinks.map((link, i) => (
              <li key={i}>
                <div
                  className="flex justify-between items-center font-medium text-[#404041] hover:text-[#e82429] cursor-pointer py-2"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span>{link.title}</span>
                  {link.subLinks?.length > 0 && (
                    <FiChevronDown
                      className={`transform transition-transform duration-300 ${
                        openIndex === i ? "rotate-180 text-[#e82429]" : ""
                      }`}
                    />
                  )}
                </div>

                {openIndex === i && link.subLinks?.length > 0 && (
                  <ul className="pl-4 mt-1 space-y-1">
                    {link.subLinks.map((sublink, j) => (
                      <li key={j}>
                        <Link
                          to={sublink.path}
                          className="block text-sm text-gray-700 hover:text-[#e82429] py-1"
                          onClick={() => setMenuOpen(false)}
                        >
                          {sublink.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {/* ✅ Mobile Profile Options */}
            <li className="mt-3 border-t pt-3">
              {userLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-gray-700 hover:text-[#e82429] py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiUser /> My Profile
                  </Link>
                  <Link
                    to="/my-orders"
                    className="flex items-center gap-2 text-gray-700 hover:text-[#e82429] py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiUser /> My Orders
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("userToken");
                      localStorage.removeItem("userName");
                      window.dispatchEvent(new Event("userLoginChange"));
                      setUserLoggedIn(false);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 text-gray-700 hover:text-red-600 py-2 w-full text-left"
                  >
                    <FiUser /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-gray-700 hover:text-[#e82429] py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiUser /> Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 text-gray-700 hover:text-[#e82429] py-2"
                    onClick={() => setMenuOpen(false)}
                  >
                    <FiUser /> Sign Up
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
