// Komponenta za odabir mišićnih skupina
// Prikazuje gumbe za odabir ciljanih mišićnih skupina u treningu
import React from "react";
import { useTranslation } from "react-i18next";
import { muscleGroups } from "../../utils/workoutUtils";

const MuscleGroupSelector = ({ selectedMuscles, onMuscleChange, label }) => {
  const { t } = useTranslation(); // Hook za prijevode

  return (
    <div className="mb-6">
      {/* Naslov za gumbe za odabir mišićnih skupina */}
      <label className="block mb-2 font-semibold text-gray-300">
        {label || t("workouts.targetMuscles")}
      </label>
      {/* Gumbi za odabir mišićnih skupina */}
      <div className="flex flex-wrap gap-2">
        {muscleGroups.map((muscle) => (
          <button
            key={muscle}
            type="button"
            onClick={() => onMuscleChange(muscle)}
            className={`px-3 py-1 rounded-full text-sm capitalize ${
              selectedMuscles.includes(muscle)
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {t(`muscles.${muscle}`)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MuscleGroupSelector;
