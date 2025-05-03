// Komponenta za prikaz liste spremljenih treninga
// Prikazuje sve spremljene treninge s mogućnošću proširivanja detalja i brisanja
import React from "react";
import { useTranslation } from "react-i18next";

const WorkoutList = ({
  savedWorkouts,
  expandedWorkout,
  setExpandedWorkout,
  handleDeleteWorkout,
}) => {
  const { t } = useTranslation(); // Hook za prijevode

  return (
    <div className="flex flex-col gap-4 mt-4">
      {/* Poruka ako nema spremljenih treninga */}
      {savedWorkouts.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          {t("workouts.noWorkouts")}
        </div>
      ) : (
        // Prikaz spremljenih treninga
        savedWorkouts.map((workout) => {
          const expanded = expandedWorkout === workout._id;
          return (
            <div
              key={workout._id}
              className="bg-gray-800 rounded-xl shadow-lg cursor-pointer"
            >
              {/* Zaglavlje treninga s imenom, datumom i ciljanim mišićnim skupinama */}
              <div
                className="w-full flex items-center justify-between px-4 py-3"
                onClick={() =>
                  setExpandedWorkout(expanded ? null : workout._id)
                }
              >
                <div className="flex-1 flex items-center justify-between gap-2">
                  <div>
                    <div className="mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-xl">
                      {workout.name}
                    </div>
                    <div className="flex flex items-center gap-2 justify-between">
                      <div className="text-sm text-gray-400">
                        {new Date(workout.date).toLocaleDateString()}
                      </div>
                      {/* Prikaz ciljanih mišićnih skupina */}
                      <div className="flex flex-wrap gap-1">
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
                  </div>

                  {/* Ikona za proširivanje/sažimanje detalja treninga */}
                  <span
                    className={`ml-2 transition-transform duration-200 ${
                      expanded ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-chevron-right text-gray-400"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Prošireni detalji treninga (prikazuju se samo kad je trening proširen klikom na ikonu) */}
              {expanded && (
                <div className="px-6 pb-4">
                  <div className="space-y-4 mb-4">
                    {/* Prikaz vježbi u treningu */}
                    {workout.exercises.map((exercise, exerciseIndex) => (
                      <div
                        key={exerciseIndex}
                        className="bg-gray-700 rounded-lg p-3"
                      >
                        <h3 className="font-bold text-purple-300 mb-2">
                          {exercise.name}
                        </h3>

                        {/* Naslovi stupaca za setove vježbe */}
                        <div className="grid grid-cols-3 gap-2 mb-1 text-xs font-semibold text-gray-400">
                          <div>{t("workouts.set")}</div>
                          <div>{t("workouts.weight")}</div>
                          <div>{t("workouts.reps")}</div>
                        </div>

                        {/* Prikaz setova za vježbu */}
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className="grid grid-cols-3 gap-2 text-sm text-gray-300"
                          >
                            <div>{setIndex + 1}</div>
                            <div>{set.weight}</div>
                            <div>{set.reps}</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Gumb za brisanje treninga */}
                  <div className="flex justify-end mt-4">
                    <button
                      className="p-2 bg-black bg-opacity-60 rounded-full text-white cursor-pointer hover:bg-red-500 transition-all duration-150"
                      title={t("common.delete")}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkout(workout._id);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 7.5v10.125c0 .621.504 1.125 1.125 1.125h8.25c.621 0 1.125-.504 1.125-1.125V7.5m-12 0h13.5m-10.125 0V6.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V7.5"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default WorkoutList;
