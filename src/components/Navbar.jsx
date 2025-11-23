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

  const [userLoggedIn, setUserLoggedIn] = useState(false);

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
                API.GET_PACKAGES_BY_CATEGORY(cat.slug)
              );

              return {
                ...cat,
                slug: cat.slug,
                packages: packagesRes.data?.tours || [],
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

    {
      title: "Visa Services",
      path: "/visa",
      subLinks: visaCategories.map((vCat) => ({
        name: vCat.name,
        path: `/visa/${vCat.slug}`,
        subSubLinks:
          vCat.visas?.map((visa) => ({
            name: visa.title,
            path: `/visa/${vCat.slug}/${visa.slug}`,
          })) || [],
      })),
    },

    { title: "About Us", path: "/about-us" },
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
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                  <ul className="py-3">
                    {link.subLinks.map((sublink, j) => (
                      <li key={j} className="relative group/sub">
                        <Link
                          to={sublink.path}
                          className="flex justify-between items-center px-5 py-2 text-sm text-[#404041] hover:bg-[#f7e6e6]"
                        >
                          {sublink.name}
                          {sublink.subSubLinks?.length > 0 && (
                            <FiChevronDown className="ml-2" />
                          )}
                        </Link>

                        {/* NESTED SUBMENU */}
                        {sublink.subSubLinks?.length > 0 && (
                          <ul className="absolute left-full top-0 ml-2 w-56 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all">
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

                {openIndex === i && link.subLinks?.length > 0 && (
                  <ul className="pl-4 mt-2 space-y-1">
                    {link.subLinks.map((sublink, j) => (
                      <li key={j}>
                        <Link
                          to={sublink.path}
                          className="block py-1 text-sm"
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

            {/* PROFILE */}
            <li className="border-t pt-3">
              {userLoggedIn ? (
                <>
                  <Link to="/profile" className="block py-2">
                    Profile
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
                  <Link to="/login" className="block py-2">
                    Sign In
                  </Link>
                  <Link to="/register" className="block py-2">
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
