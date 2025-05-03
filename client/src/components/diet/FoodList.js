// Komponenta za prikaz liste dodanih namirnica
// Prikazuje sve dodane namirnice s njihovim nutritivnim vrijednostima i ukupnim zbrojem
import React from "react";
import { useTranslation } from "react-i18next";
import { calculateTotalMacros } from "../../utils/dietUtils";

const FoodList = ({ foods, setFoods }) => {
  const { t } = useTranslation(); // Hook za prijevode

  // Funkcija za uklanjanje namirnice iz liste
  const removeFood = (idx) => {
    setFoods((prev) => prev.filter((_, i) => i !== idx));
  };

  // Izračun ukupnih nutritivnih vrijednosti svih namirnica
  const total = calculateTotalMacros(foods);

  return (
    <>
      {/* Lista pojedinačnih namirnica */}
      <ul className="mb-4">
        {foods.map((f, idx) => (
          <li
            key={idx}
            className="mb-1 flex items-center justify-between bg-gray-800 rounded p-2"
          >
            <span>
              <span className="font-semibold text-purple-300">{f.name}</span> -{" "}
              {f.grams}g | {t("diet.protein")}: {f.protein}g, {t("diet.carbs")}:{" "}
              {f.carbs}g, {t("diet.fats")}: {f.fats}g, {t("diet.calories")}:{" "}
              {f.calories}
            </span>
            {/* Gumb za uklanjanje namirnice */}
            <button
              onClick={() => removeFood(idx)}
              className="ml-2 px-2 py-1 bg-red-600 rounded text-white text-xs cursor-pointer hover:bg-red-700 transition-all"
            >
              {t("diet.remove")}
            </button>
          </li>
        ))}
      </ul>
      {/* Prikaz ukupnih nutritivnih vrijednosti */}
      {foods.length > 0 && (
        <div className="mb-4 font-semibold text-center text-lg text-gray-200">
          {t("diet.total")}: {t("diet.protein")}: {total.protein.toFixed(2)}g,{" "}
          {t("diet.carbs")}: {total.carbs.toFixed(2)}g, {t("diet.fats")}:{" "}
          {total.fats.toFixed(2)}g, {t("diet.calories")}:{" "}
          {total.calories.toFixed(2)}
        </div>
      )}
    </>
  );
};

export default FoodList;
