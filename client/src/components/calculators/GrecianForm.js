// Komponenta za izračun idealnih proporcija prema grčkom idealu
// Izračunava idealne tjelesne mjere na temelju opsega zgloba
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { unitConversions } from "../../utils/calculatorUtils";

function GrecianForm({ unitSystem }) {
  const { t } = useTranslation(); // Hook za prijevode
  const [wrist, setWrist] = useState(""); // Stanje za opseg zgloba
  const [result, setResult] = useState(null); // Stanje za rezultat izračuna
  const [message, setMessage] = useState(""); // Stanje za prateću poruku
  const [unit, setUnit] = useState(t("units.cm")); // Stanje za mjerne jedinice

  // Funkcija za obradu predaje forme
  const handleSubmit = (e) => {
    e.preventDefault();
    let w = parseFloat(wrist);
    if (!w) return;

    // Konverzija u centimetre ako je odabran imperijalni sustav
    if (unitSystem === "imperial") {
      w = w * unitConversions.inchesToCm;
    }

    // Izračun idealnih proporcija prema Grecian formuli
    const chest = w * 6.5;
    const waist = w * 4.5;
    const hips = w * 6.0;
    const biceps = w * 2.5;
    const forearm = w * 2.0;
    const thigh = w * 3.0;
    const calve = w * 2.0;
    const neck = w * 1.9;
    const shoulder = waist * 1.618; // Omjer zlatnog reza

    // Postavljanje rezultata u odgovarajućim mjernim jedinicama
    if (unitSystem === "imperial") {
      setResult({
        chest: chest * unitConversions.cmToInches,
        waist: waist * unitConversions.cmToInches,
        hips: hips * unitConversions.cmToInches,
        biceps: biceps * unitConversions.cmToInches,
        forearm: forearm * unitConversions.cmToInches,
        thigh: thigh * unitConversions.cmToInches,
        calve: calve * unitConversions.cmToInches,
        neck: neck * unitConversions.cmToInches,
        shoulder: shoulder * unitConversions.cmToInches,
      });
      setUnit(t("units.inches"));
      setMessage(t("calculators.grecian.message"));
    } else {
      setResult({
        chest,
        waist,
        hips,
        biceps,
        forearm,
        thigh,
        calve,
        neck,
        shoulder,
      });
      setUnit(t("units.cm"));
      setMessage(t("calculators.grecian.message"));
    }
  };

  // Komponenta forme s poljem za unos opsega zgloba i prikazom idealnih proporcija
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">
          {t("calculators.grecian.wrist")} (
          {unitSystem === "imperial" ? t("units.inches") : t("units.cm")}):
        </label>
        <input
          type="number"
          value={wrist}
          onChange={(e) => setWrist(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          style={{ MozAppearance: "textfield" }}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold cursor-pointer"
      >
        {t("calculators.grecian.calculate")}
      </button>
      {result && (
        <div className="mt-4 text-center font-semibold">
          <div>
            {t("calculators.grecian.chest")} {result.chest.toFixed(1)} {unit}
          </div>
          <div>
            {t("calculators.grecian.waist")} {result.waist.toFixed(1)} {unit}
          </div>
          <div>
            {t("calculators.grecian.hip")} {result.hips.toFixed(1)} {unit}
          </div>
          <div>
            {t("calculators.grecian.bicep")} {result.biceps.toFixed(1)} {unit}
          </div>
          <div>
            {t("calculators.grecian.forearm")} {result.forearm.toFixed(1)}{" "}
            {unit}
          </div>
          <div>
            {t("calculators.grecian.thigh")} {result.thigh.toFixed(1)} {unit}
          </div>
          <div>
            {t("calculators.grecian.calve")} {result.calve.toFixed(1)} {unit}
          </div>
          <div>
            {t("calculators.grecian.neck")} {result.neck.toFixed(1)} {unit}
          </div>
          <div>
            {t("calculators.grecian.shoulder")} {result.shoulder.toFixed(1)}{" "}
            {unit}
          </div>
          <div className="mt-2 text-sm text-gray-300">{message}</div>
        </div>
      )}
    </form>
  );
}

export default GrecianForm;
