// Komponenta za unos nove namirnice u plan prehrane
// Omogućava unos naziva namirnice i nutritivnih vrijednosti
import React from "react";
import { useTranslation } from "react-i18next";
import { initialFood, calculateMacros } from "../../utils/dietUtils";

const FoodInput = ({ foodInput, setFoodInput, foods, setFoods }) => {
  const { t } = useTranslation(); // Hook za prijevode

  // Funkcija za ažuriranje stanja namirnice prilikom promjene u formi
  const handleFoodChange = (e) => {
    const { name, value } = e.target;
    setFoodInput((prev) => ({ ...prev, [name]: value }));
  };

  // Funkcija za dodavanje namirnice u listu namirnica
  const addFood = () => {
    if (!foodInput.name || !foodInput.grams) return;
    setFoods((prev) => [...prev, calculateMacros(foodInput)]);
    setFoodInput(initialFood);
  };

  return (
    <div className="mx-auto max-w-[75%] mb-8">
      {/* Unos naziva namirnice */}
      <div className="text-xs font-semibold text-gray-400 text-center mb-2">
        {t("diet.foodName")}
      </div>
      <input
        type="text"
        name="name"
        placeholder={t("diet.foodNamePlaceholder")}
        value={foodInput.name}
        onChange={handleFoodChange}
        className="p-2 mb-2 rounded bg-gray-800 text-white mx-auto w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      {/* Naslovi stupaca za nutritivne vrijednosti */}
      <div className="grid grid-cols-4 gap-2 mb-2 text-xs font-semibold text-gray-400 text-center">
        <div>{t("diet.grams")}</div>
        <div>{t("diet.proteinPer100g")}</div>
        <div>{t("diet.carbsPer100g")}</div>
        <div>{t("diet.fatsPer100g")}</div>
      </div>
      {/* Polja za unos nutritivnih vrijednosti */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <input
          type="number"
          name="grams"
          placeholder="g"
          value={foodInput.grams}
          onChange={handleFoodChange}
          min={0}
          className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ MozAppearance: "textfield" }}
        />
        <input
          type="number"
          name="protein"
          placeholder="g"
          value={foodInput.protein}
          onChange={handleFoodChange}
          min={0}
          className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ MozAppearance: "textfield" }}
        />
        <input
          type="number"
          name="carbs"
          placeholder="g"
          value={foodInput.carbs}
          onChange={handleFoodChange}
          min={0}
          className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ MozAppearance: "textfield" }}
        />
        <input
          type="number"
          name="fats"
          placeholder="g"
          value={foodInput.fats}
          onChange={handleFoodChange}
          min={0}
          className="p-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{ MozAppearance: "textfield" }}
        />
      </div>
      {/* Gumb za dodavanje namirnice */}
      <button
        onClick={addFood}
        className="px-3 py-2 bg-purple-600 rounded text-white font-bold cursor-pointer hover:bg-purple-700 transition-all w-full"
        type="button"
      >
        {t("diet.add")}
      </button>
    </div>
  );
};

export default FoodInput;
