// Komponenta za izračun Indeksa tjelesne mase (BMI)
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { calculateBMI, getBMIMessage } from "../../utils/calculatorUtils";

function BMIForm({ unitSystem }) {
  const { t } = useTranslation(); // Hook za prijevode
  const [weight, setWeight] = useState(""); // Stanje za težinu
  const [height, setHeight] = useState(""); // Stanje za visinu
  const [feet, setFeet] = useState(""); // Stanje za stope
  const [inches, setInches] = useState(""); // Stanje za inče
  const [age, setAge] = useState(""); // Stanje za dob
  const [gender, setGender] = useState(""); // Stanje za spol
  const [result, setResult] = useState(null); // Stanje za rezultat BMI izračuna
  const [message, setMessage] = useState(""); // Stanje za poruku o rezultatu

  // Funkcija za obradu predaje forme
  const handleSubmit = (e) => {
    e.preventDefault();

    // Provjera da li su svi potrebni podaci uneseni
    if (!weight || (!height && unitSystem === "metric") || !age || !gender)
      return;
    if (unitSystem === "imperial" && !feet && !inches) return;

    // Promjena visine u inče ako je odabran imperijalni sustav
    let heightValue;
    if (unitSystem === "imperial") {
      heightValue = (parseInt(feet) || 0) * 12 + (parseInt(inches) || 0);
    } else {
      heightValue = height;
    }

    // Izračun BMI vrijednosti i postavljanje rezultata
    const bmi = calculateBMI(weight, heightValue, unitSystem);
    setResult(bmi);
    setMessage(getBMIMessage(bmi, t));
  };

  // Komponenta forme s uvjetnim prikazom polja ovisno o odabranom sustavu jedinica
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1">{t("calculators.bmi.gender")}</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          required
        >
          <option value="">{t("common.select")}</option>
          <option value="male">{t("common.male")}</option>
          <option value="female">{t("common.female")}</option>
        </select>
      </div>
      <div>
        <label className="block mb-1">{t("calculators.bmi.age")}</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full p-2 rounded bg-gray-800"
          style={{ MozAppearance: "textfield" }}
          required
        />
      </div>
      <div>
        <label className="block mb-1">
          {t("calculators.bmi.weight")} (
          {unitSystem === "imperial" ? "lbs" : "kg"}):
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

      {unitSystem === "imperial" ? (
        <div>
          <label className="block mb-1">{t("calculators.bmi.height")}:</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block mb-1 text-sm">
                {t("calculators.bmi.feet")}
              </label>
              <input
                type="number"
                value={feet}
                onChange={(e) => setFeet(e.target.value)}
                className="w-full p-2 rounded bg-gray-800"
                style={{ MozAppearance: "textfield" }}
                min="0"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm">
                {t("calculators.bmi.inches")}
              </label>
              <input
                type="number"
                value={inches}
                onChange={(e) => setInches(e.target.value)}
                className="w-full p-2 rounded bg-gray-800"
                style={{ MozAppearance: "textfield" }}
                min="0"
                max="11"
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <label className="block mb-1">
            {t("calculators.bmi.height")} (cm):
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full p-2 rounded bg-gray-800"
            style={{ MozAppearance: "textfield" }}
            required
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold cursor-pointer"
      >
        {t("calculators.bmi.calculate")}
      </button>
      {result && (
        <div className="mt-4 text-center font-semibold">
          {t("calculators.bmi.result")} {result}
          <div className="mt-2 text-sm text-gray-300">{message}</div>
        </div>
      )}
    </form>
  );
}

export default BMIForm;
