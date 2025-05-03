// Početna stranica aplikacije
// Prikazuje uvodni sadržaj i poziv na registraciju/prijavu
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation(); // Hook za prijevode

  return (
    <main className="min-h-screen w-full overflow-x-hidden pt-16">
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        {/* Pozadina */}
        <div className="fixed inset-0 bg-gradient-to-b from-purple-900 to-black opacity-80 -z-10"></div>

        {/* Glavni sadržaj */}
        <div className="relative text-center px-4 max-w-[90%] w-full mx-auto">
          {/* Naslov */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 md:mb-6 leading-normal">
            {t("home.welcome")}
          </h1>

          {/* Podnaslov */}
          <p className="text-lg text-gray-300 mb-8">{t("home.tagline")}</p>

          {/* Animirani gumb za prijavu/registraciju */}
          <Link
            to="/login"
            className="w-auto max-w-[160px] min-h-[160px] mx-auto flex items-center justify-center text-shadow-sm text-shadow-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-gray-900 hover:scale-110 transition-transform duration-300 animate-[pulse_1.5s_ease-in-out_infinite] shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:animate-none shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-shadow"
          >
            {t("home.signup")} <br /> {t("home.or")} <br />
            {t("home.login")}
          </Link>

          {/* Kartice s funkcionalnostima aplikacije */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-8 sm:mt-12 mb-8 sm:mb-12">
            <FeatureCard
              title={t("navbar.progress")}
              description={t("home.features.progress")}
            />
            <FeatureCard
              title={t("navbar.workouts")}
              description={t("home.features.workouts")}
            />
            <FeatureCard
              title={t("navbar.diet")}
              description={t("home.features.diet")}
            />
            <FeatureCard
              title={t("navbar.calculators")}
              description={t("home.features.calculators")}
            />
            <FeatureCard
              title={t("chat.title")}
              description={t("home.features.chat")}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

// Komponenta za prikaz pojedine funkcionalnosti
// Prikazuje karticu s naslovom i opisom funkcionalnosti
const FeatureCard = ({ title, description }) => (
  <div className="w-full sm:w-64 md:w-48 p-3 sm:p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300 mb-3 sm:mb-0">
    <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
      {title}
    </h3>
    <p className="text-sm text-gray-300">{description}</p>
  </div>
);

export default Home;
