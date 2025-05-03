// Komponenta za izračun dnevnog unosa kalorija
// Koristi BMR, razinu aktivnosti i ciljeve korisnika za preporuku dnevnog kalorijskog unosa
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { activityLevels, unitConversions } from "../../utils/calculatorUtils";

function CalorieIntakeForm({ unitSystem }) {
  const { t } = useTranslation(); // Hook za prijevode
  const [bmr, setBmr] = useState(""); // Stanje za bazalni metabolizam
  const [activity, setActivity] = useState(1); // Stanje za razinu aktivnosti
  const [goal, setGoal] = useState("maintain"); // Stanje za cilj (održavanje, gubitak ili dobitak težine)
  const [weightChange, setWeightChange] = useState(""); // Stanje za količinu promjene težine
  const [result, setResult] = useState(null); // Stanje za rezultat izračuna kalorija
  const [message, setMessage] = useState(""); // Stanje za poruku objašnjenja

  // Funkcija za obradu predaje forme
  const handleSubmit = (e) => {
    e.preventDefault();
    let calories = bmr * activity; // Osnovni izračun kalorija prema BMR-u i aktivnosti
    let msg = t("calculators.calorieIntake.defaultMessage");

    // Ako se koristi imperijalni sustav, promjena težine je u lbs (pa pretvorba u kg za izračun)
    const weightChangeKg =
      unitSystem === "imperial"
        ? parseFloat(weightChange) * unitConversions.lbsToKg
        : parseFloat(weightChange);

    // Izračuni za različite ciljeve: gubitak težine, dobitak težine ili održavanje
    if (goal === "lose" && weightChange) {
      // Ako je unesena količina gubitka težine
      const weeklyDeficit = weightChangeKg * 7700; // 7700 kalorija = 1kg masti
      const dailyDeficit = weeklyDeficit / 7; // Dnevni deficit za postizanje tjednog cilja
      calories -= dailyDeficit;
      msg = t("calculators.calorieIntake.deficitMessage", {
        weight: weightChange,
        unit: unitSystem === "imperial" ? t("units.lbs") : t("units.kg"),
        deficit: dailyDeficit.toFixed(0),
      });
    } else if (goal === "lose") {
      // Gubitak bez unesene količine težine
      calories -= 500;
      msg = t("calculators.calorieIntake.defaultDeficitMessage");
    } else if (goal === "gain" && weightChange) {
      // Ako je unesena količina dobitka težine
      const weeklySurplus = weightChangeKg * 7700; // 7700 kalorija = 1kg
      const dailySurplus = weeklySurplus / 7; // Dnevni višak za postizanje tjednog cilja
      calories += dailySurplus;
      msg = t("calculators.calorieIntake.surplusMessage", {
        weight: weightChange,
        unit: unitSystem === "imperial" ? t("units.lbs") : t("units.kg"),
        surplus: dailySurplus.toFixed(0),
      });
    } else if (goal === "gain") {
      // Dobitak bez unesene količine težine
      calories += 500;
      msg = t("calculators.calorieIntake.defaultSurplusMessage");
    }

    setResult(calories.toFixed(0));
    setMessage(msg);
  };

  // Komponenta forme s uvjetnim prikazom polja ovisno o odabranom cilju
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">
          {t("calculators.calorieIntake.bmr")}
        </label>
        <input
          type="number"
          value={bmr}
          onChange={(e) => setBmr(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          style={{ MozAppearance: "textfield" }}
          required
        />
      </div>
      <div>
        <label className="block mb-1">
          {t("calculators.calorieIntake.activity")}
        </label>
        <select
          value={activity}
          onChange={(e) => setActivity(Number(e.target.value))}
          className="w-full p-2 rounded bg-gray-800"
        >
          {activityLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {t(`calculators.calorieIntake.activityLevels.${level.value}`)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1">
          {t("calculators.calorieIntake.goal")}
        </label>
        <select
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
        >
          <option value="maintain">
            {t("calculators.calorieIntake.maintain")}
          </option>
          <option value="lose">{t("calculators.calorieIntake.lose")}</option>
          <option value="gain">{t("calculators.calorieIntake.gain")}</option>
        </select>
      </div>
      {goal === "lose" && (
        <div>
          <label className="block mb-1">
            {t("calculators.calorieIntake.weightToLose")} (
            {unitSystem === "imperial" ? t("units.lbs") : t("units.kg")}):
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={weightChange}
            onChange={(e) => setWeightChange(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
            style={{ MozAppearance: "textfield" }}
            placeholder={unitSystem === "imperial" ? "e.g. 1.0" : "e.g. 0.5"}
          />
        </div>
      )}
      {goal === "gain" && (
        <div>
          <label className="block mb-1">
            {t("calculators.calorieIntake.weightToGain")} (
            {unitSystem === "imperial" ? t("units.lbs") : t("units.kg")}
            ):
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={weightChange}
            onChange={(e) => setWeightChange(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
            style={{ MozAppearance: "textfield" }}
            placeholder={unitSystem === "imperial" ? "e.g. 0.5" : "e.g. 0.25"}
          />
        </div>
      )}
      <button
        type="submit"
        className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold cursor-pointer"
      >
        {t("calculators.calorieIntake.calculate")}
      </button>
      {result && (
        <div className="mt-4 text-center font-semibold">
          {t("calculators.calorieIntake.dailyCalories")} {result} kcal
          <div className="mt-2 text-sm text-gray-300">{message}</div>
        </div>
      )}
    </form>
  );
}

export default CalorieIntakeForm;
