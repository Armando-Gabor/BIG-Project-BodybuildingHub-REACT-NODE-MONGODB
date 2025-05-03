// Stranica s kalkulatorima za fitnes i prehranu
// Omogućuje pristup različitim kalkulatorima za izračune
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import BMIForm from "../components/calculators/BMIForm";
import BMRForm from "../components/calculators/BMRForm";
import CalorieIntakeForm from "../components/calculators/CalorieIntakeForm";
import DietTimeForm from "../components/calculators/DietTimeForm";
import CardioForm from "../components/calculators/CardioForm";
import GrecianForm from "../components/calculators/GrecianForm";

const Calculators = () => {
  const { t } = useTranslation(); // Hook za prijevode
  const [selected, setSelected] = useState("bmi"); // Stanje za odabrani kalkulator
  const [unitSystem, setUnitSystem] = useState("metric"); // Stanje za sustav mjernih jedinica

  // Niz konfiguracija kalkulatora s prijevodima
  // Definira sve dostupne kalkulatore i njihove komponente
  const calculators = useMemo(
    () => [
      {
        key: "bmi",
        label: t("calculators.bmi.title"),
        description: t("calculators.bmi.description"),
        Form: BMIForm, // Kalkulator indeksa tjelesne mase
      },
      {
        key: "bmr",
        label: t("calculators.bmr.title"),
        description: t("calculators.bmr.description"),
        Form: BMRForm, // Kalkulator bazalnog metabolizma
      },
      {
        key: "calorieIntake",
        label: t("calculators.calorieIntake.title"),
        description: t("calculators.calorieIntake.description"),
        Form: CalorieIntakeForm, // Kalkulator dnevnog unosa kalorija
      },
      {
        key: "dietTime",
        label: t("calculators.dietTime.title"),
        description: t("calculators.dietTime.description"),
        Form: DietTimeForm, // Kalkulator vremena potrebnog za dijetu
      },
      {
        key: "cardio",
        label: t("calculators.cardio.title"),
        description: t("calculators.cardio.description"),
        Form: CardioForm, // Kalkulator potrošnje kalorija pri kardio vježbama
      },
      {
        key: "grecian",
        label: t("calculators.grecian.title"),
        description: t("calculators.grecian.description"),
        Form: GrecianForm, // Kalkulator grčke idealne tjelesne građe
      },
    ],
    [t]
  );

  // Pronalazak odabranog kalkulatora iz niza
  const selectedCalc = calculators.find((c) => c.key === selected);
  const FormComponent = selectedCalc.Form; // Dinamičko dohvaćanje komponente kalkulatora

  return (
    <main className="container mx-auto pt-20 px-4 flex justify-center">
      <div className="w-full max-w-2xl p-4">
        <h2 className="text-[34px] font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
          {t("calculators.title")}
        </h2>

        {/* Prekidač za mjerne jedinice (metrički/imperijalni) */}
        <div className="mb-4 flex justify-center">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setUnitSystem("metric")}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg cursor-pointer ${
                unitSystem === "metric"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {t("calculators.metric")}
            </button>
            <button
              onClick={() => setUnitSystem("imperial")}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg cursor-pointer ${
                unitSystem === "imperial"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {t("calculators.imperial")}
            </button>
          </div>
        </div>

        {/* Padajući izbornik za odabir kalkulatora */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">
            {t("calculators.selectCalculator")}
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 text-white"
          >
            {calculators.map((calc) => (
              <option key={calc.key} value={calc.key}>
                {calc.label}
              </option>
            ))}
          </select>
        </div>

        {/* Opis odabranog kalkulatora */}
        <div className="mb-4 text-gray-300 text-center">
          {selectedCalc.description}
        </div>

        {/* Prikaz odabranog kalkulatora */}
        <FormComponent unitSystem={unitSystem} />
      </div>
    </main>
  );
};

export default Calculators;
