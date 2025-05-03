// Komponenta za odabir predloška treninga
// Prikazuje modalni prozor s listom spremljenih treninga za odabir kao predložak
import React from "react";
import { useTranslation } from "react-i18next";

const TemplateSelector = ({
  savedWorkouts,
  toggleTemplateSelector,
  useWorkoutAsTemplate,
}) => {
  const { t } = useTranslation(); // Hook za prijevode

  return (
    <div className="fixed inset-0 bg-opacity-70 backdrop-blur-xl flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-[80%] md:max-w-xl max-h-[80vh] overflow-y-auto p-6">
        {/* Zaglavlje modalnog prozora s naslovom i gumbom za zatvaranje */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">
            {t("workouts.template.select")}
          </h3>
          <button
            onClick={toggleTemplateSelector}
            className="text-gray-400 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Prikaz poruke ako nema spremljenih treninga */}
        {savedWorkouts.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            {t("workouts.template.noSavedWorkouts")}
          </div>
        ) : (
          /* Lista spremljenih treninga za odabir */
          <div className="space-y-3">
            {savedWorkouts.map((workout) => (
              <div
                key={workout._id}
                className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 cursor-pointer transition-colors"
                onClick={() => useWorkoutAsTemplate(workout)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-purple-300">
                      {workout.name}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {new Date(workout.date).toLocaleDateString()} •{" "}
                      {workout.exercises.length}{" "}
                      {t("workouts.exercises").toLowerCase()}
                    </p>
                  </div>
                  {/* Prikaz ciljanih mišićnih skupina */}
                  <div className="flex flex-wrap gap-1 max-w-[40%] justify-end">
                    {workout.targetMuscles.map((muscle) => (
                      <span
                        key={muscle}
                        className="px-2 py-0.5 bg-gray-700 rounded-full text-xs capitalize text-gray-300"
                      >
                        {t(`muscles.${muscle}`)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prikaz vježbi u treningu */}
                <div className="mt-2 text-sm text-gray-400">
                  <span>{t("workouts.template.exercises")} </span>
                  {workout.exercises.map((ex, i) => (
                    <span key={i}>
                      {ex.name}
                      {i < workout.exercises.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gumb za otkazivanje odabira predloška */}
        <button
          onClick={toggleTemplateSelector}
          className="w-full py-2 mt-4 bg-gray-700 hover:bg-gray-600 rounded text-white font-semibold"
        >
          {t("workouts.template.cancel")}
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;
