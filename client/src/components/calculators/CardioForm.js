// Komponenta za izračun potrošenih kalorija tijekom kardio aktivnosti
// Izračunava kalorije potrošene na temelju vrste aktivnosti, trajanja i težine korisnika
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { calculateCaloriesBurned } from "../../utils/calculatorUtils";

function CardioForm({ unitSystem }) {
  const { t } = useTranslation(); // Hook za prijevode
  const [activity, setActivity] = useState(""); // Stanje za vrstu aktivnosti
  const [minutes, setMinutes] = useState(""); // Stanje za trajanje aktivnosti u minutama
  const [weight, setWeight] = useState(""); // Stanje za težinu korisnika
  const [result, setResult] = useState(null); // Stanje za rezultat izračuna
  const [message, setMessage] = useState(""); // Stanje za prateću poruku

  // Popis kardio aktivnosti koje korisnik može odabrati
  const cardioActivities = [
    { value: "running", label: t("activities.running") },
    { value: "jogging", label: t("activities.jogging") },
    { value: "cycling", label: t("activities.cycling") },
    { value: "swimming", label: t("activities.swimming") },
    { value: "walking", label: t("activities.walking") },
    { value: "hiking", label: t("activities.hiking") },
    { value: "aerobics", label: t("activities.aerobics") },
    { value: "dancing", label: t("activities.dancing") },
    { value: "basketball", label: t("activities.basketball") },
    { value: "football", label: t("activities.football") },
    { value: "tennis", label: t("activities.tennis") },
    { value: "elliptical", label: t("activities.elliptical") },
    { value: "rowing", label: t("activities.rowing") },
  ];

  // Funkcija za obradu predaje forme
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activity || !minutes || !weight) return;

    // Izračun potrošenih kalorija pomoću pomoćne funkcije
    const calories = calculateCaloriesBurned(
      activity,
      minutes,
      weight,
      unitSystem
    );
    setResult(calories);
    setMessage(t("calculators.cardio.message"));
  };

  // Komponenta forme s poljima za unos vrste aktivnosti, trajanja i težine
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">{t("calculators.cardio.activity")}</label>
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          required
        >
          <option value="">{t("common.select")}</option>
          {cardioActivities.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">{t("calculators.cardio.minutes")}</label>
        <input
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          style={{ MozAppearance: "textfield" }}
          required
        />
      </div>
      <div>
        <label className="block mb-1">
          {t("calculators.cardio.weight")} (
          {unitSystem === "imperial" ? t("units.lbs") : t("units.kg")}):
        </label>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          style={{ MozAppearance: "textfield" }}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold cursor-pointer"
      >
        {t("calculators.cardio.calculate")}
      </button>
      {result && (
        <div className="mt-4 text-center font-semibold">
          {t("calculators.cardio.caloriesBurned")} {result}
          <div className="mt-2 text-sm text-gray-300">{message}</div>
        </div>
      )}
    </form>
  );
}

export default CardioForm;
