// Komponenta za prikaz spremljenih obroka
// Prikazuje listu spremljenih obroka s mogućnošću proširivanja i brisanja
import React from "react";
import { useTranslation } from "react-i18next";

const SavedMeals = ({
  savedMeals,
  expandedMeal,
  setExpandedMeal,
  handleDeleteMeal,
}) => {
  const { t } = useTranslation(); // Hook za prijevode

  return (
    <div className="flex flex-col gap-4">
      {/* Poruka ako nema spremljenih obroka */}
      {savedMeals.length === 0 && (
        <div className="text-center text-gray-400">
          {t("diet.noSavedMeals")}
        </div>
      )}

      {/* Prikaz spremljenih obroka */}
      {savedMeals.map((meal) => {
        const expanded = expandedMeal === meal._id;
        return (
          <div
            key={meal._id}
            className="bg-gray-800 rounded-xl shadow-lg cursor-pointer"
            onClick={() => setExpandedMeal(expanded ? null : meal._id)}
          >
            {/* Zaglavlje obroka s nazivom i ikonom proširivanja */}
            <div className="w-full flex items-center justify-between px-4 py-3">
              <button className="flex-1 flex items-center justify-between text-xl font-bold cursor-pointer focus:outline-none text-left">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {meal.name}
                </span>
                <span
                  className={`ml-2 transition-transform duration-200 ${
                    expanded ? "rotate-90" : "rotate-0"
                  }`}
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-chevron-right text-gray-400"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </span>
              </button>
            </div>
            {/* Prošireni sadržaj s detaljima o obroku (prikazuje se samo ako je obrok proširen klikom na ikonu) */}
            {expanded && (
              <div className="px-6 pb-4">
                {/* Lista namirnica u obroku */}
                <ul className="mb-2 mt-2">
                  {meal.foods.map((f, idx) => (
                    <li key={idx}>
                      <span className="font-semibold text-purple-300">
                        {f.name}
                      </span>{" "}
                      - {f.grams}g | {t("diet.protein")}: {f.protein}g,{" "}
                      {t("diet.carbs")}: {f.carbs}g,
                      {t("diet.fats")}: {f.fats}g, {t("diet.calories")}:{" "}
                      {f.calories}
                    </li>
                  ))}
                </ul>
                {/* Ukupne nutritivne vrijednosti obroka */}
                <div className="font-semibold text-center">
                  {t("diet.total")}: {t("diet.protein")}:{" "}
                  {meal.foods.reduce((a, f) => a + f.protein, 0).toFixed(2)}
                  g, {t("diet.carbs")}:{" "}
                  {meal.foods.reduce((a, f) => a + f.carbs, 0).toFixed(2)}
                  g, {t("diet.fats")}:{" "}
                  {meal.foods.reduce((a, f) => a + f.fats, 0).toFixed(2)}
                  g, {t("diet.calories")}:{" "}
                  {meal.foods.reduce((a, f) => a + f.calories, 0).toFixed(2)}
                </div>
                {/* Gumb za brisanje obroka */}
                <div className="flex justify-end mt-4">
                  <button
                    className="p-2 bg-black bg-opacity-60 rounded-full text-white cursor-pointer hover:bg-red-500 transition-all duration-150"
                    title={t("diet.deleteMeal")}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMeal(meal);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 7.5v10.125c0 .621.504 1.125 1.125 1.125h8.25c.621 0 1.125-.504 1.125-1.125V7.5m-12 0h13.5m-10.125 0V6.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SavedMeals;
