// Komponenta za unos i ažuriranje tjelesnih podataka korisnika
// Omogućuje unos podataka o tjelesnim mjerama (spol, težina, visina, opsezi mišića) i odabir mjernog sustava
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MeasurementsInput from "./MeasurementsInput";
import {
  initialMeasurements,
  formatMeasurements,
} from "../../utils/progressUtils";

const BodyDataForm = () => {
  const { t } = useTranslation(); // Hook za prijevode
  const [gender, setGender] = useState(""); // Stanje za spol korisnika
  const [weight, setWeight] = useState(""); // Stanje za težinu
  const [height, setHeight] = useState(""); // Stanje za visinu
  const [feet, setFeet] = useState(""); // Stanje za visinu u stopama
  const [inches, setInches] = useState(""); // Stanje za visinu u inčima
  const [measurements, setMeasurements] = useState(initialMeasurements); // Stanje za ostale tjelesne mjere
  const [message, setMessage] = useState(""); // Stanje za prikazivanje poruke korisniku
  const [unitSystem, setUnitSystem] = useState("metric"); // Stanje za odabir mjernog sustava

  // Učitavanje posljednjih unesenih podataka prilikom inicijalizacije komponente
  useEffect(() => {
    const fetchLatestBody = async () => {
      try {
        // Provjera tokena za autorizaciju
        const token = localStorage.getItem("token");
        const res = await fetch("/api/body/latest", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        // Ako je token valjan, učitaj podatke
        if (res.ok) {
          const data = await res.json();
          setGender(data.gender || "");

          // Postavljanje mjernog sustava iz prethodno spremljenih podataka
          const savedUnitSystem = data.unitSystem || "metric";
          setUnitSystem(savedUnitSystem);

          // Postavljanje težine ovisno o mjernom sustavu
          setWeight(data.weight?.toString() || "");

          // Postavljanje visine ovisno o mjernom sustavu
          if (savedUnitSystem === "metric") {
            setHeight(data.height?.toString() || "");
          } else {
            // Ako je imperijalni sustav, izračunaj stope i inče iz spremljene vrijednosti
            const heightInInches = parseFloat(data.height || 0);
            if (heightInInches > 0) {
              const calculatedFeet = Math.floor(heightInInches / 12);
              const calculatedInches =
                Math.round((heightInInches % 12) * 10) / 10;
              setFeet(calculatedFeet.toString());
              setInches(calculatedInches.toString());
            } else {
              setFeet("");
              setInches("");
            }
          }

          // Formatiranje mjera iz API odgovora
          setMeasurements(formatMeasurements(data));
        }
      } catch {
        // Ignoriranje grešaka, nema ispunjavanja podataka
      }
    };
    fetchLatestBody();
  }, []); // Izvršava se samo pri početnom renderu

  // Funkcija za promjenu mjernog sustava
  const handleUnitSystemChange = (newSystem) => {
    if (newSystem === unitSystem) return;

    // Resetiranje svih vrijednosti pri promjeni mjernog sustava
    setWeight("");
    if (newSystem === "metric") {
      setHeight("");
    } else {
      setFeet("");
      setInches("");
    }
    setMeasurements(initialMeasurements);
    setUnitSystem(newSystem);

    // Provjeriti postoje li spremljeni podaci sa istim mjernim sustavom i učitati ih
    fetchBodyDataForUnitSystem(newSystem);
  };

  // Funkcija za dohvat podataka prema mjernom sustavu
  const fetchBodyDataForUnitSystem = async (selectedUnitSystem) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/body/latest", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.ok) {
        const data = await res.json();

        // Provjeri odgovara li spremljeni mjerni sustav odabranom
        if (data.unitSystem === selectedUnitSystem) {
          setGender(data.gender || "");
          setWeight(data.weight?.toString() || "");

          // Postavljanje visine ovisno o mjernom sustavu
          if (selectedUnitSystem === "metric") {
            setHeight(data.height?.toString() || "");
          } else {
            // Ako je imperijalni sustav, izračunaj stope i inče iz spremljene vrijednosti
            const heightInInches = parseFloat(data.height || 0);
            if (heightInInches > 0) {
              const calculatedFeet = Math.floor(heightInInches / 12);
              const calculatedInches =
                Math.round((heightInInches % 12) * 10) / 10;
              setFeet(calculatedFeet.toString());
              setInches(calculatedInches.toString());
            }
          }

          // Formatiranje mjera iz API odgovora
          setMeasurements(formatMeasurements(data));
        }
        // Ako mjerni sustav ne odgovara, zadržavamo prazna polja (već postavljeno iznad u handleUnitSystemChange)
      }
    } catch {
      // Ignoriranje grešaka, zadržavamo prazna polja
    }
  };

  // Funkcija za ažuriranje stanja mjera prilikom promjene u formi
  const handleMeasurementChange = (e) => {
    setMeasurements({
      ...measurements,
      [e.target.name]: e.target.value,
    });
  };

  // Funkcija za slanje podataka na server
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Izračun visine prema mjernom sustavu za pohranu
    let heightValue;
    if (unitSystem === "metric") {
      heightValue = height;
    } else {
      // Za imperijalni sustav, visina se pohranjuje kao ukupan broj inča
      const feetValue = parseFloat(feet) || 0;
      const inchesValue = parseFloat(inches) || 0;
      heightValue = (feetValue * 12 + inchesValue).toString();
    }

    try {
      // Provjera tokena za autorizaciju i slanje podataka na server
      const token = localStorage.getItem("token");
      const API_URL = "/api/body";
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          gender,
          weight,
          height: heightValue,
          measurements,
          unitSystem,
        }),
      });
      if (res.ok) {
        setMessage(t("progress.dataSaved"));
      } else {
        setMessage(t("progress.errorSaving"));
      }
    } catch {
      setMessage(t("progress.networkError"));
    }
  };

  return (
    <form className="shadow-xl rounded-2xl p-8 mb-8" onSubmit={handleSubmit}>
      {/* Prebacivanje između mjernih sustava */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg cursor-pointer ${
              unitSystem === "metric"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => handleUnitSystemChange("metric")}
          >
            {t("calculators.metric")}
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg cursor-pointer ${
              unitSystem === "imperial"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => handleUnitSystemChange("imperial")}
          >
            {t("calculators.imperial")}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-column gap-8">
        {/* Unos tjelesnih podataka */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-200">
              {t("progress.gender")}
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="border-2 border-gray-400 rounded-lg w-full py-2 px-3 bg-gray-900 text-gray-100 outline-none transition hover:border-pink-400 focus:border-pink-400"
            >
              <option value="">{t("common.selectGender")}</option>
              <option value="male">{t("common.male")}</option>
              <option value="female">{t("common.female")}</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-200">
              {t("progress.weight")}{" "}
              {unitSystem === "metric" ? "(kg)" : "(lbs)"}
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
              className="border-2 border-gray-400 rounded-lg w-full py-2 px-3 bg-gray-900 text-gray-100 outline-none transition appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none hover:border-pink-400 focus:border-pink-400"
              min="0"
              step="0.01"
              style={{ MozAppearance: "textfield" }}
            />
          </div>

          {/* Unosa visine ovisno o mjernom sustavu */}
          {unitSystem === "metric" ? (
            <div>
              <label className="block mb-1 font-semibold text-gray-200">
                {t("progress.height")} (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                className="border-2 border-gray-400 rounded-lg w-full py-2 px-3 bg-gray-900 text-gray-100 outline-none transition appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none hover:border-pink-400 focus:border-pink-400"
                min="0"
                step="0.01"
                style={{ MozAppearance: "textfield" }}
              />
            </div>
          ) : (
            <div>
              <label className="block mb-1 font-semibold text-gray-200">
                {t("progress.height")}
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block mb-1 text-sm text-gray-400">
                    {t("progress.feet")}
                  </label>
                  <input
                    type="number"
                    value={feet}
                    onChange={(e) => setFeet(e.target.value)}
                    required
                    className="border-2 border-gray-400 rounded-lg w-full py-2 px-3 bg-gray-900 text-gray-100 outline-none transition appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none hover:border-pink-400 focus:border-pink-400"
                    min="0"
                    step="0.01"
                    style={{ MozAppearance: "textfield" }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 text-sm text-gray-400">
                    {t("progress.inches")}
                  </label>
                  <input
                    type="number"
                    value={inches}
                    onChange={(e) => setInches(e.target.value)}
                    required
                    className="border-2 border-gray-400 rounded-lg w-full py-2 px-3 bg-gray-900 text-gray-100 outline-none transition appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none hover:border-pink-400 focus:border-pink-400"
                    min="0"
                    max="11"
                    step="0.01"
                    style={{ MozAppearance: "textfield" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Komponenta za unos ostalih tjelesnih mjera */}
        <MeasurementsInput
          measurements={measurements}
          handleMeasurementChange={handleMeasurementChange}
          unitSystem={unitSystem}
        />
      </div>

      {/* Gumb za spremanje podataka */}
      <button
        type="submit"
        className="w-full mt-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
      >
        {t("progress.save")}
      </button>
      {/* Prikaz poruke o uspjehu/neuspjehu */}
      {message && (
        <div className="mt-4 text-center text-sm font-semibold text-green-400">
          {message}
        </div>
      )}
    </form>
  );
};

export default BodyDataForm;
