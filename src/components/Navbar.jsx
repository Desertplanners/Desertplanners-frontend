import { useState } from "react";
import { FiMenu, FiX, FiChevronDown, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    {
      title: "Tours",
      path: "/tours",
      subLinks: [
        {
          name: "Abu Dhabi City Tour",
          path: "/tours/abu-dhabi-city-tour",
          subSubLinks: [
            {
              name: "Abu Dhabi City Tour With Ferrari World On Sharing Basis",
              path: "/tours/abu-dhabi-city-tour/abu-dhabi-city-tour-with-ferrari-world-on-sharing-basis",
            },
            {
              name: "Abu Dhabi City Tour With Shiekh Zayad Grand Mosque On Sharing Basis",
              path: "/tours/abu-dhabi-city-tour/abu-dhabi-city-tour-with-shiekh-zayad-grand-mosque-on-sharing-basis",
            },
            {
              name: "Abu Dhabi City Tour",
              path: "/tours/abu-dhabi-city-tour/abu-dhabi-city-tour",
            },
          ],
        },
        {
          name: "Adventure Tour",
          path: "/tours/adventure-tour",
          subSubLinks: [
            {
              name: "The Dubai Balloon",
              path: "/tours/adventure-tour/the-dubai-balloon",
            },
            {
              name: "Img Theme Park Ticket",
              path: "/tours/adventure-tour/img-theme-park-ticket",
            },
          ],
        },
        {
          name: "Burj Khalifa",
          path: "/tours/burj-khalifa",
          subSubLinks: [
            {
              name: "Burj Khalifa - 124th + 125th Floor Non-Prime Hours",
              path: "/tours/burj-khalifa/burj-khalifa---124th-+-125th-floor-non-prime-hours",
            },
            {
              name: "Burj Khalifa - 148 + 124th + 125th Floor Non-Prime Hours",
              path: "/tours/burj-khalifa/burj-khalifa---148-+-124th-+-125th-floor-non-prime-hours",
            },
            {
              name: "At The Top (Level 124 - 125) - Treats At The Cafe",
              path: "/tours/burj-khalifa/at-the-top-(level-124---125)---treats-at-the-cafe",
            },
            {
              name: "At The Top (Level 124 - 125)",
              path: "/tours/burj-khalifa/at-the-top-(level-124---125)",
            },
          ],
        },
        {
          name: "Desert Safari with Dinner",
          path: "/tours/desert-safari",
          subSubLinks: [
            {
              name: "Desert Safari With BBQ Dinner By 4*4 Vechicle On Sharing Basis",
              path: "/tours/desert-safari/desert-safari-with-bbq-dinner-by-4*4-vechicle-on-sharing-basis",
            },
            {
              name: "Desert Safari With BBQ Dinner By 4*4 Vechicle With Quad Bike On Sharing Basis",
              path: "/tours/desert-safari/desert-safari-with-bbq-dinner-by-4*4-vechicle-with-quad-bike-on-sharing-basis",
            },
            {
              name: "Desert Safari With BBQ Dinner",
              path: "/tours/desert-safari/desert-safari-with-bbq-dinner",
            },
            {
              name: "Desert Safari With BBQ Dinner With Quad Bike",
              path: "/tours/desert-safari/desert-safari-with-bbq-dinner-with-quad-bike",
            },
          ],
        },
        {
          name: "Dhow Cruise",
          path: "/tours/dhow-cruise",
          subSubLinks: [
            {
              name: "Lotus Mega Yacht Dinner - Food & Soft Quenchers",
              path: "/tours/dhow-cruise/lotus-mega-yacht-dinner---food-&-soft-quenchers",
            },
            {
              name: "Lotus Mega Yacht Dinner - Food & Unlimited Alcoholic Drinks",
              path: "/tours/dhow-cruise/lotus-mega-yacht-dinner---food-&-unlimited-alcoholic-drinks",
            },
            {
              name: "Lotus Mega Yacht Dinner - VIP",
              path: "/tours/dhow-cruise/lotus-mega-yacht-dinner---vip",
            },
            {
              name: "Marina Dhow Cruise Dinner With Transfers On Sharing Basis",
              path: "/tours/dhow-cruise/marina-dhow-cruise-dinner-with-transfers-on-sharing-basis",
            },
          ],
        },
        {
          name: "Dubai City Tour",
          path: "/tours/dubai-city-tour",
          subSubLinks: [
            {
              name: "Dubai Half Day City Tour ON Sharing Basis",
              path: "/tours/dubai-city-tour/dubai-half-day-city-tour-on-sharing-basis",
            },
            {
              name: "Dubai City Tour",
              path: "/tours/dubai-city-tour/dubai-city-tour",
            },
          ],
        },
        {
          name: "Dubai Aquarium",
          path: "/tours/dubai-aquarium",
          subSubLinks: [
            {
              name: "Dauz - Ultimate Experience",
              path: "/tours/dubai-aquarium/dauz---ultimate-experience",
            },
            {
              name: "Dauz - All Access Pass",
              path: "/tours/dubai-aquarium/dauz---all-access-pass",
            },
            {
              name: "Dolphin Show Dubai Dolphinarium",
              path: "/tours/dubai-aquarium/dolphin-show-dubai-dolphinarium",
            },
            {
              name: "Dubai Aquarium & Underwater Zoo + Penguin Cove",
              path: "/tours/dubai-aquarium/dubai-aquarium-&-underwater-zoo-+-penguin-cove",
            },
          ],
        },
        {
          name: "Helicopter Tour",
          path: "/tours/helicopter-tour",
          subSubLinks: [
            {
              name: "12 Mins Iconic Helicopter Tour Dubai",
              path: "/tours/helicopter-tour/12-mins-iconic-helicopter-tour-dubai",
            },
            {
              name: "17 Min The Palm Helicopter Tour Dubai",
              path: "/tours/helicopter-tour/17-min-the-palm-helicopter-tour-dubai",
            },
            {
              name: "22 Min Vision Helicopter Tour Dubai",
              path: "/tours/helicopter-tour/22-min-vision-helicopter-tour-dubai",
            },
            {
              name: "30 Min Grand Helicopter Tour Dubai",
              path: "/tours/helicopter-tour/30-min-grand-helicopter-tour-dubai",
            },
            {
              name: "Fun Ride - 15 Min Flight",
              path: "/tours/helicopter-tour/30-min-grand-helicopter-tour-dubai",
            },
            {
              name: "Pearl Heli Tour - 12 Min Flight",
              path: "/tours/helicopter-tour/12-mins-iconic-helicopter-tour-dubai",
            },
            {
              name: "The Iconic Tour - 17 Min Flight",
              path: "/tours/helicopter-tour/17-min-the-palm-helicopter-tour-dubai",
            },
          ],
        },
        {
          name: "Yas Island Theme Park",
          path: "/tours/yas-island",
          subSubLinks: [
            {
              name: "Yas WaterPark With Meal",
              path: "/tours/yas-island/yas-waterpark-with-mealt",
            },
            {
              name: "Yas WaterPark Standard",
              path: "/tours/yas-island/yas-waterpark-standardt",
            },
            {
              name: "Warner Bros",
              path: "/tours/yas-island/warner-bros-world-ticket",
            },
            { name: "SeaWorld", path: "/tours/yas-island/seaworld" },
            {
              name: "1 Day (Ferrari World + Any 1 Park)",
              path: "/tours/yas-island/1-day-(ferrari-world-+-any-1-park)",
            },
            { name: "2 Park Ticket", path: "/tours/yas-island/2-park-ticket" },
            { name: "3 Park Ticket", path: "/tours/yas-island/3-park-ticket" },
            { name: "Ferrari World", path: "/tours/yas-island/ferrari-world" },
          ],
        },
        {
          name: "Excursion Tickets",
          path: "/tours/excursion-tickets",
          subSubLinks: [
            {
              name: "AI Ain Tour",
              path: "/tours/excursion-tickets/ai-ain-tour",
            },
            {
              name: "City Circuit - 25 Min. Flight",
              path: "/tours/excursion-tickets/city-circuit---25-min.-flight",
            },
            {
              name: "Dubai Miracle Garden",
              path: "/tours/excursion-tickets/dubai-miracle-garden",
            },
            {
              name: "Explorer Ticket",
              path: "/tours/excursion-tickets/explorer-ticket",
            },
            {
              name: "Fujairah City Tour",
              path: "/tours/excursion-tickets/fujairah-city-tour",
            },
            { name: "Img World", path: "/tours/excursion-tickets/img-world" },
            {
              name: "Legoland Theme Park",
              path: "/tours/excursion-tickets/legoland-theme-park",
            },
            {
              name: "Regular Zoo Entry",
              path: "/tours/excursion-tickets/regular-zoo-entry",
            },
            {
              name: "Sharjah City Tour",
              path: "/tours/excursion-tickets/sharjah-city-tour",
            },
          ],
        },
        {
          name: "Combo Packages",
          path: "/tours/combo-packages",
          subSubLinks: [
            {
              name: "City + Safari",
              path: "/tours/combo-packages/city-+-safari-combo",
            },
            {
              name: "Burj + Aquarium",
              path: "/tours/combo-packages/burj-+-aquarium-combo",
            },
          ],
        },
      ],
    },
    {
      title: "Holiday Packages",
      path: "/holidays",
      subLinks: [
        {
          name: "3 Nights - 4 Day Dubai Package",
          path: "/holidays/3-nights-4-day-dubai-package",
        },
        {
          name: "5 Nights - 6 Day Dubai Package",
          path: "/holidays/5-nights-6-day-dubai-package",
        },
        {
          name: "4 Nights - 5 Day Dubai Package",
          path: "/holidays/4-nights-5-day-dubai-package",
        },
      ],
    },
    {
      title: "Visa Services",
      path: "/visa",
      subLinks: [
        {
          name: "30 Days Tourist Visa Single Entry",
          path: "/visa/30-days-tourist-visa-single-entry",
        },
        {
          name: "30 Days Business Visa Multiple Entry",
          path: "/visa/30-days-business-visa-multiple-entry",
        },
        {
          name: "60 Days A2A Visa Changes",
          path: "/visa/60-days-a2a-visa-changes",
        },
        {
          name: "60 Days Tourist Visa Single Entry",
          path: "/visa/60-days-tourist-visa-single-entry",
        },
        {
          name: "60 Days Tourist Visa Multiple Entry",
          path: "/visa/60-days-tourist-visa-multiple-entry",
        },
        {
          name: "90 Days Leisure Visa Single Entry",
          path: "/visa/90-days-leisure-visa-single-entry",
        },
        {
          name: "A2A 30 Days Visa Changes",
          path: "/visa/a2a-30-days-visa-changes",
        },
      ],
    },
    { title: "Contact Us", path: "/contact" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => {
            setMenuOpen(false);
            window.location.href = "/"; // Forces full reload and goes to home
          }}
        >
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
                {link.subLinks && <FiChevronDown size={16} />}
              </Link>

              {/* Submenu */}
              {link.subLinks && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 z-50">
                  <ul className="py-3">
                    {link.subLinks.map((sublink, j) => (
                      <li key={j} className="relative group/sub">
                        <Link
                          to={sublink.path}
                          className="flex justify-between items-center px-5 py-2 text-sm font-medium text-[#404041] hover:bg-[#e82429]/10 hover:text-[#e82429] rounded-md transition-all duration-300"
                        >
                          {sublink.name}
                          {sublink.subSubLinks && (
                            <FiChevronDown className="ml-2 transform group-hover/sub:rotate-90 transition-transform duration-200" />
                          )}
                        </Link>

                        {/* Sub–Submenu */}
                        {sublink.subSubLinks && (
                          <ul className="absolute left-full top-0 mt-0 ml-2 w-56 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transform translate-x-3 group-hover/sub:translate-x-0 transition-all duration-300 z-50">
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
              placeholder="Search for Packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e82429] transition w-64"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          <Link
            to="/contact"
            className="ml-4 px-6 py-2 rounded-lg font-semibold text-white bg-[#e82429] hover:bg-[#c51b22] transition-transform duration-300 hover:scale-105 shadow-md"
          >
            Contact Us
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-[#404041]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col px-5 py-4 space-y-2">
            {navLinks.map((link, i) => (
              <div key={i} className="border-b border-gray-100">
                {link.subLinks ? (
                  <>
                    <div className="flex justify-between items-center">
                      <Link
                        to={link.path}
                        onClick={() => setMenuOpen(false)} // 🔥 auto close
                        className="px-4 py-2 font-medium text-[#404041] rounded-md hover:bg-[#e82429]/10 hover:text-[#e82429] flex-1"
                      >
                        {link.title}
                      </Link>
                      <button
                        onClick={() =>
                          setActiveDropdown(activeDropdown === i ? null : i)
                        }
                      >
                        <FiChevronDown
                          className={`transition-transform ${
                            activeDropdown === i ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Submenu */}
                    {activeDropdown === i && (
                      <div className="pl-4">
                        {link.subLinks.map((sublink, j) => (
                          <div key={j}>
                            <div className="flex justify-between items-center">
                              <Link
                                to={sublink.path}
                                onClick={() => setMenuOpen(false)} // 🔥 auto close
                                className="block px-4 py-2 text-sm text-[#404041] hover:bg-[#e82429]/10 hover:text-[#e82429] rounded"
                              >
                                {sublink.name}
                              </Link>
                              {sublink.subSubLinks && (
                                <button
                                  onClick={() =>
                                    setActiveSubDropdown(
                                      activeSubDropdown === `${i}-${j}`
                                        ? null
                                        : `${i}-${j}`
                                    )
                                  }
                                  className="px-2"
                                >
                                  <FiChevronDown
                                    className={`transition-transform ${
                                      activeSubDropdown === `${i}-${j}`
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </button>
                              )}
                            </div>

                            {/* Sub–submenu */}
                            {activeSubDropdown === `${i}-${j}` && (
                              <div className="pl-6">
                                {sublink.subSubLinks.map((sub, k) => (
                                  <Link
                                    key={k}
                                    to={sub.path}
                                    onClick={() => setMenuOpen(false)} // 🔥 auto close
                                    className="block px-4 py-1 text-sm text-gray-600 hover:bg-[#e82429]/10 hover:text-[#e82429] rounded transition"
                                  >
                                    {sub.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)} // 🔥 auto close
                    className="block px-4 py-2 font-medium text-[#404041] hover:bg-[#e82429]/10 hover:text-[#e82429] rounded"
                  >
                    {link.title}
                  </Link>
                )}
              </div>
            ))}

            {/* Search (Mobile) */}
            <form onSubmit={handleSearch} className="relative mt-3">
              <input
                type="text"
                placeholder="Search for Packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#e82429] transition"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>

            {/* Contact Button */}
            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)} // 🔥 auto close
              className="block px-4 py-2 mt-2 rounded-md font-semibold text-white bg-[#e82429] hover:bg-[#c51b22] text-center transition-transform hover:scale-105"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
