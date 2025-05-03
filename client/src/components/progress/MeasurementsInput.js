// Komponenta za unos tjelesnih mjera
// Prikazuje polja za unos različitih tjelesnih mjera (opsezi dijelova tijela)
import React from "react";
import { useTranslation } from "react-i18next";
import { measurementLabels } from "../../utils/progressUtils";

const MeasurementsInput = ({
  measurements,
  handleMeasurementChange,
  unitSystem = "metric",
}) => {
  const { t } = useTranslation(); // Hook za prijevode

  return (
    <div className="flex-1">
      {/* Naslov sekcije za unos tjelesnih mjera */}
      <h3 className="font-semibold text-lg text-gray-100 mb-4 text-center">
        {t("progress.bodyMeasurements")}{" "}
        {unitSystem === "metric"
          ? `(${t("units.cm")})`
          : `(${t("units.inches")})`}
      </h3>
      {/* Struktura za polja unosa tjelesnih mjera */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Prikaz polja za unos za svaku mjeru */}
        {Object.entries(measurementLabels).map(([key, label]) => (
          <div key={key}>
            <label className="block mb-1 text-gray-300">
              {t(`progress.measurements.${key}`)}
            </label>
            <input
              type="number"
              name={key}
              value={measurements[key]}
              onChange={handleMeasurementChange}
              className="border-2 border-gray-400 rounded-lg w-full py-2 px-3 bg-gray-900 text-gray-100 outline-none transition appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none hover:border-pink-400 focus:border-pink-400"
              min="0"
              step="0.01"
              required
              style={{ MozAppearance: "textfield" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeasurementsInput;
