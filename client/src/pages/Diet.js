// Stranica za planiranje prehrane i praćenje obroka
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import FoodInput from "../components/diet/FoodInput";
import FoodList from "../components/diet/FoodList";
import SavedMeals from "../components/diet/SavedMeals";
import { initialFood } from "../utils/dietUtils";

function Diet() {
  const { t } = useTranslation(); // Hook za prijevode
  const [tab, setTab] = useState(0); // Stanje za praćenje aktivnog taba
  const [mealName, setMealName] = useState(""); // Stanje za naziv obroka
  const [foods, setFoods] = useState([]); // Stanje za popis namirnica u obroku
  const [foodInput, setFoodInput] = useState(initialFood); // Stanje za unos nove namirnice
  const [savedMeals, setSavedMeals] = useState([]); // Stanje za spremljene obroke
  const [expandedMeal, setExpandedMeal] = useState(null); // Stanje za prošireni prikaz obroka
  const [error, setError] = useState(""); // Stanje za poruke o greškama

  // Dohvaćanje spremljenih obroka prilikom promjene taba
  useEffect(() => {
    if (tab === 1) {
      fetch("/api/meals", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => setSavedMeals(Array.isArray(data) ? data : []))
        .catch(() => setSavedMeals([]));
    }
  }, [tab]);

  // Funkcija za spremanje novog obroka
  const saveMeal = async () => {
    setError("");
    // Validacija unosa
    if (!mealName) {
      setError(t("diet.nameRequired"));
      return;
    }
    if (foods.length === 0) {
      setError(t("diet.foodsRequired"));
      return;
    }
    try {
      // Slanje podataka o obroku na server
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: mealName, foods }),
      });
      if (!res.ok) throw new Error();

      // Resetiranje forme nakon uspješnog spremanja
      setMealName("");
      setFoods([]);
      setTab(1); // Prebacivanje na tab sa spremljenim obrocima
    } catch (e) {
      setError(t("diet.errorSaving"));
    }
  };

  // Funkcija za brisanje obroka
  const handleDeleteMeal = async (meal) => {
    // Potvrda prije brisanja
    if (!window.confirm(t("diet.deleteConfirm"))) return;
    try {
      const token = localStorage.getItem("token");
      // Slanje zahtjeva za brisanje obroka
      const res = await fetch(`/api/meals/${meal._id}`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error(t("diet.errorDeleting"));

      // Ažuriranje lokalnog stanja nakon brisanja
      setSavedMeals((prev) => prev.filter((m) => m._id !== meal._id));
    } catch (e) {
      alert(t("diet.errorDeleting"));
    }
  };

  return (
    <main className="container mx-auto pt-20 px-4 flex justify-center">
      <div className="w-full max-w-2xl p-4">
        <h2 className="text-[34px] font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
          {t("diet.title") || "Plan Your Diet"}
        </h2>

        {/* Navigacijski tabovi */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg transition-all duration-300 cursor-pointer ${
              tab === 0
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                : "bg-gray-800 text-gray-300"
            }`}
            onClick={() => setTab(0)}
          >
            {t("diet.addNewMeal")}
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg transition-all duration-300 cursor-pointer ${
              tab === 1
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                : "bg-gray-800 text-gray-300"
            }`}
            onClick={() => setTab(1)}
          >
            {t("diet.savedMeals")}
          </button>
        </div>

        {/* Tab za dodavanje novog obroka */}
        {tab === 0 && (
          <div className="add-meal-form">
            {/* Unos naziva obroka */}
            <div className="mb-6">
              <label
                className="block mb-1 font-semibold text-gray-300"
                htmlFor="mealName"
              >
                {t("diet.mealName")}
              </label>
              <input
                id="mealName"
                type="text"
                placeholder={t("diet.mealName")}
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Komponenta za unos namirnica */}
            <FoodInput
              foodInput={foodInput}
              setFoodInput={setFoodInput}
              foods={foods}
              setFoods={setFoods}
            />

            {/* Prikaz unesenih namirnica */}
            <FoodList foods={foods} setFoods={setFoods} />

            {/* Prikaz poruke o grešci */}
            {error && (
              <div className="text-red-400 mb-2 text-center">{error}</div>
            )}

            {/* Gumb za spremanje obroka */}
            <button
              onClick={saveMeal}
              className="w-full py-3 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold mt-2 text-lg shadow-lg cursor-pointer"
            >
              {t("diet.saveMeal")}
            </button>
          </div>
        )}

        {/* Tab za prikaz spremljenih obroka */}
        {tab === 1 && (
          <SavedMeals
            savedMeals={savedMeals}
            expandedMeal={expandedMeal}
            setExpandedMeal={setExpandedMeal}
            handleDeleteMeal={handleDeleteMeal}
          />
        )}
      </div>
    </main>
  );
}

export default Diet;
