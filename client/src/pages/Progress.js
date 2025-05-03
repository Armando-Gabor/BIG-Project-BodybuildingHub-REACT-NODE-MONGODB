// Stranica za praćenje napretka u obliku tjelesnih mjerama
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import BodyDataForm from "../components/progress/BodyDataForm";
import ProgressGallery from "../components/progress/ProgressGallery";

const Progress = () => {
  const { t } = useTranslation(); // Hook za prijevode
  const [view, setView] = useState("body"); // Stanje za praćenje trenutnog taba

  return (
    <main className="container mx-auto pt-20 px-4 flex justify-center">
      <div className="w-[75%] max-w-2xl p-4">
        <h2 className="text-[34px] font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
          {t("progress.title")}
        </h2>

        {/* Navigacijski gumbi za promjenu prikaza */}
        <div className="flex justify-center gap-4">
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg transition-colors shadow-md cursor-pointer focus:outline-none ${
              view === "body"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setView("body")}
          >
            {t("progress.bodyData")}
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg transition-colors shadow-md cursor-pointer focus:outline-none ${
              view === "gallery"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
            onClick={() => setView("gallery")}
          >
            {t("progress.progressGallery")}
          </button>
        </div>

        {/* Komponenta za unos tjelesnih podataka */}
        {view === "body" && <BodyDataForm />}

        {/* Komponenta za galeriju napretka */}
        {view === "gallery" && (
          <div className="mt-8 mb-8">
            <ProgressGallery />
          </div>
        )}
      </div>
    </main>
  );
};

export default Progress;
