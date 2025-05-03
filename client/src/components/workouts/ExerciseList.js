// Komponenta za prikaz i upravljanje listom vježbi u treningu
// Omogućava dodavanje vježbi, setova i praćenje težina i ponavljanja
import React from "react";
import { useTranslation } from "react-i18next";

const ExerciseList = ({
  exercises,
  exerciseInput,
  setExerciseInput,
  addExercise,
  removeExercise,
  addSet,
  removeSet,
  updateSetValue,
}) => {
  const { t } = useTranslation(); // Hook za prijevode

  return (
    <div className="mb-6">
      <label className="font-semibold text-gray-300">
        {t("workouts.exercises")}
      </label>
      {/* Forma za dodavanje vježbe - prikazuje se samo ako još nema vježbi */}
      {exercises.length === 0 && (
        <div className="w-[75%] mx-auto flex items-center mt-2 justify-center sm:w-full">
          <input
            type="text"
            placeholder={t("workouts.exerciseNamePlaceholder")}
            value={exerciseInput.name}
            onChange={(e) =>
              setExerciseInput({
                ...exerciseInput,
                name: e.target.value,
              })
            }
            className="p-2 rounded-l bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={addExercise}
            className="px-3 py-2 bg-purple-600 rounded-r text-white ring-2 ring-purple-600 font-bold cursor-pointer hover:bg-purple-700 transition-all"
            type="button"
          >
            {t("workouts.addExercise")}
          </button>
        </div>
      )}

      {/* Poruka ako nema vježbi */}
      {exercises.length === 0 ? (
        <div className="text-center text-gray-400 py-4">
          {t("workouts.noExercises")}
        </div>
      ) : (
        /* Lista vježbi s njihovim setovima */
        <div className="space-y-4">
          {exercises.map((exercise, exerciseIndex) => (
            <div key={exerciseIndex} className="bg-gray-800 rounded-lg p-4">
              {/* Zaglavlje s nazivom vježbe i gumbom za uklanjanje */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg text-purple-300">
                  {exercise.name}
                </h3>
                <button
                  onClick={() => removeExercise(exerciseIndex)}
                  className="px-2 py-1 bg-red-600 rounded text-white text-xs cursor-pointer hover:bg-red-700 transition-all"
                  type="button"
                >
                  {t("workouts.remove")}
                </button>
              </div>

              {/* Prikaz setova za vježbu */}
              {exercise.sets.length > 0 && (
                <div className="mb-3">
                  {/* Naslovi stupaca za setove */}
                  <div className="grid grid-cols-3 gap-2 mb-2 text-xs font-semibold text-gray-400">
                    <div className="pl-2">{t("workouts.set")}</div>
                    <div>{t("workouts.weight")}</div>
                    <div>{t("workouts.reps")}</div>
                  </div>

                  {/* Prikaz pojedinačnih setova sa poljima za unos težine i ponavljanja */}
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className="grid grid-cols-3 gap-2 mb-2 items-center"
                    >
                      <div className="flex items-center">
                        <span className="px-2 py-1 bg-gray-700 rounded-full text-xs mr-2">
                          {setIndex + 1}
                        </span>
                        <button
                          onClick={() => removeSet(exerciseIndex, setIndex)}
                          className="text-white bg-red-500 cursor-pointer hover:bg-red-600 rounded-full p-1 flex items-center justify-center w-6 h-6"
                          type="button"
                          title={t("workouts.removeSet")}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                      {/* Polje za unos težine */}
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) =>
                          updateSetValue(
                            exerciseIndex,
                            setIndex,
                            "weight",
                            e.target.value
                          )
                        }
                        className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder={
                          set.lastWeight
                            ? `PB: ${set.lastWeight}`
                            : t("workouts.weight")
                        }
                        min="0"
                        step="0.5"
                        style={{ MozAppearance: "textfield" }}
                      />
                      {/* Polje za unos broja ponavljanja */}
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) =>
                          updateSetValue(
                            exerciseIndex,
                            setIndex,
                            "reps",
                            e.target.value
                          )
                        }
                        className="p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder={
                          set.lastReps
                            ? `PB: ${set.lastReps}`
                            : t("workouts.reps")
                        }
                        min="0"
                        style={{ MozAppearance: "textfield" }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Gumb za dodavanje novog seta za ovu vježbu */}
              <button
                onClick={() => addSet(exerciseIndex)}
                className="w-full py-2 mt-2 bg-indigo-600 rounded text-white font-semibold cursor-pointer hover:bg-indigo-700 transition-all"
                type="button"
              >
                {t("workouts.addSet")}
              </button>
            </div>
          ))}

          {/* Forma za dodavanje nove vježbe - prikazuje se ispod postojećih vježbi */}
          <div className="w-[75%] mx-auto flex flex-row gap-0 items-center justify-center mt-4">
            <input
              type="text"
              placeholder={t("workouts.exerciseNamePlaceholder")}
              value={exerciseInput.name}
              onChange={(e) =>
                setExerciseInput({
                  ...exerciseInput,
                  name: e.target.value,
                })
              }
              className="p-2 rounded-l bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              onClick={addExercise}
              className="sm:w-auto px-4 py-2 bg-purple-600 rounded-r ring-2 ring-purple-600 sm:rounded-r text-white font-bold cursor-pointer hover:bg-purple-700 transition-all"
              type="button"
            >
              {t("workouts.addExercise")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
