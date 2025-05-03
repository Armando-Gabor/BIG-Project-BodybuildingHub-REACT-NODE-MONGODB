// Komponenta za izračun vremena potrebnog za postizanje ciljane težine
// Procjenjuje trajanje dijete na temelju trenutne težine, ciljane težine i dnevnog deficita kalorija
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { unitConversions } from "../../utils/calculatorUtils";

function DietTimeForm({ unitSystem }) {
  const { t } = useTranslation(); // Hook za prijevode
  const [current, setCurrent] = useState(""); // Stanje za trenutnu težinu
  const [target, setTarget] = useState(""); // Stanje za ciljanu težinu
  const [deficit, setDeficit] = useState(""); // Stanje za dnevni deficit kalorija
  const [result, setResult] = useState(null); // Stanje za rezultat izračuna
  const [message, setMessage] = useState(""); // Stanje za prateću poruku

  // Funkcija za obradu predaje forme
  const handleSubmit = (e) => {
    e.preventDefault();

    let currentInKg = current;
    let targetInKg = target;

    // Konverzija težine u kilograme ovisno o sustavu mjernih jedinica
    if (unitSystem === "imperial") {
      currentInKg = parseFloat(current) * unitConversions.lbsToKg;
      targetInKg = parseFloat(target) * unitConversions.lbsToKg;
    } else {
      currentInKg = parseFloat(current);
      targetInKg = parseFloat(target);
    }

    // Provjera validnosti unosa
    const weightLoss = currentInKg - targetInKg;
    if (weightLoss <= 0)
      return setResult(t("calculators.dietTime.targetError"));

    // Izračun potrebnih tjedana uz pretpostavku da 1kg masti sadrži oko 7700 kalorija
    const weeks = (weightLoss * 7700) / (deficit * 7);
    setResult(weeks > 0 ? weeks.toFixed(1) : null);
    setMessage(t("calculators.dietTime.message"));
  };

  // Komponenta forme s poljima za unos trenutne težine, ciljane težine i dnevnog deficita kalorija
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">
          {t("calculators.dietTime.currentWeight")} (
          {unitSystem === "imperial" ? t("units.lbs") : t("units.kg")}):
        </label>
        <input
          type="number"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          style={{ MozAppearance: "textfield" }}
          required
        />
      </div>
      <div>
        <label className="block mb-1">
          {t("calculators.dietTime.targetWeight")} (
          {unitSystem === "imperial" ? t("units.lbs") : t("units.kg")}):
        </label>
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          style={{ MozAppearance: "textfield" }}
          required
        />
      </div>
      <div>
        <label className="block mb-1">
          {t("calculators.dietTime.deficit")}
        </label>
        <input
          type="number"
          value={deficit}
          onChange={(e) => setDeficit(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          style={{ MozAppearance: "textfield" }}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold cursor-pointer"
      >
        {t("calculators.dietTime.calculate")}
      </button>
      {result && (
        <div className="mt-4 text-center font-semibold">
          {t("calculators.dietTime.estimatedTime")} {result}{" "}
          {t("calculators.dietTime.weeks")}
          <div className="mt-2 text-sm text-gray-300">{message}</div>
        </div>
      )}
    </form>
  );
}

export default DietTimeForm;
