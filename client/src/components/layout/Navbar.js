// Komponenta za navigacijsku traku
// Prikazuje glavnu navigaciju aplikacije (stranice, prijava/odjava, jezik)
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Stanje za otvaranje/zatvaranje mobilnog menija
  const navigate = useNavigate(); // Hook za navigaciju
  const location = useLocation(); // Hook za praćenje trenutne lokacije
  const token = localStorage.getItem("token"); // Dohvaćanje tokena za provjeru autentikacije
  const { t, i18n } = useTranslation(); // Hook za prijevode

  // Funkcija za zatvaranje mobilnog menija
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Zatvori meni kad se promijeni lokacija
  useEffect(() => {
    closeMenu();
  }, [location]);

  // Funkcija za odjavu korisnika
  const handleLogout = () => {
    localStorage.removeItem("token");
    closeMenu();
    navigate("/");
  };

  // Funkcija za promjenu jezika aplikacije
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full backdrop-blur-xl z-50">
      <nav className="text-white p-4 w-full">
        <div className="container mx-auto flex flex-wrap justify-between items-center relative">
          {/* Naslov stranice */}
          <Link
            to="/"
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent p-1"
          >
            {t("app.title")}
          </Link>
          {/* Gumb za otvaranje mobilnog menija (vidljiv samo na malim ekranima) */}
          <button
            className="lg:hidden hover:text-purple-400 transition-colors duration-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Glavni navigacijski meni */}
          <ul
            className={`${
              isMobileMenuOpen ? "" : "hidden"
            } w-full lg:flex lg:w-auto lg:space-x-8 text-xl flex-col lg:flex-row space-y-4 lg:space-y-0 mt-4 lg:mt-0 bg-gray-900/95 lg:bg-transparent absolute top-full left-0 lg:relative lg:top-0 p-4 lg:p-0`}
          >
            {/* Linkovi za prijavljene korisnike */}
            {token && (
              <>
                <li>
                  <Link
                    to="/body"
                    className="block px-3 py-3 rounded-md hover:text-purple-400 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300"
                    onClick={closeMenu}
                  >
                    {t("navbar.progress")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/workouts"
                    className="block px-3 py-3 rounded-md hover:text-purple-400 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300"
                    onClick={closeMenu}
                  >
                    {t("navbar.workouts")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/diet"
                    className="block px-3 py-3 rounded-md hover:text-purple-400 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300"
                    onClick={closeMenu}
                  >
                    {t("navbar.diet")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/calculators"
                    className="block px-3 py-3 rounded-md hover:text-purple-400 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300"
                    onClick={closeMenu}
                  >
                    {t("navbar.calculators")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/chat"
                    className="block px-3 py-3 rounded-md hover:text-purple-400 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300"
                    onClick={closeMenu}
                  >
                    {t("navbar.chat")}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-3 rounded-md hover:text-purple-400 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300 cursor-pointer"
                  >
                    {t("navbar.logout")}
                  </button>
                </li>
                {/* Gumbi za promjenu jezika */}
                <li>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`py-4 px-2 text-sm rounded cursor-pointer ${
                      i18n.language === "en"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => changeLanguage("hr")}
                    className={`py-4 px-2 text-sm rounded ml-1 cursor-pointer ${
                      i18n.language === "hr"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400"
                    }`}
                  >
                    HR
                  </button>
                </li>
              </>
            )}
            {/* Linkovi za neprijavljene korisnike */}
            {!token && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="block px-3 py-3 rounded-md hover:text-purple-400 hover:bg-gray-700 hover:scale-105 transform transition-all duration-300"
                    onClick={closeMenu}
                  >
                    {t("navbar.login")}
                  </Link>
                </li>
                {/* Gumbi za promjenu jezika */}
                <li>
                  <button
                    onClick={() => changeLanguage("en")}
                    className={`py-4 px-2 text-sm rounded cursor-pointer ${
                      i18n.language === "en"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => changeLanguage("hr")}
                    className={`py-4 px-2 text-sm rounded ml-1 cursor-pointer ${
                      i18n.language === "hr"
                        ? "bg-purple-600 text-white"
                        : "text-gray-400"
                    }`}
                  >
                    HR
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
