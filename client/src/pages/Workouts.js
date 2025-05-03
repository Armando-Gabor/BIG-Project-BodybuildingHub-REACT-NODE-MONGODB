// Stranica za kreiranje, upravljanje i pregled treninga
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import MuscleGroupSelector from "../components/workouts/MuscleGroupSelector";
import ExerciseList from "../components/workouts/ExerciseList";
import WorkoutFilter from "../components/workouts/WorkoutFilter";
import WorkoutList from "../components/workouts/WorkoutList";
import TemplateSelector from "../components/workouts/TemplateSelector";
import {
  initialExercise,
  initialSet,
  formatDate,
  validateWorkout,
  formatExercisesForSubmission,
  createTemplateFromWorkout,
  buildWorkoutsUrl,
} from "../utils/workoutUtils";
import { generatePdfReport } from "../utils/pdfGenerator";

function Workouts() {
  const { t } = useTranslation(); // Hook za prijevode
  const [tab, setTab] = useState(0); // Stanje za praćenje aktivnog taba

  // Stanja za unos podataka o treningu
  const [workoutName, setWorkoutName] = useState(""); // Stanje za naziv treninga
  const [targetMuscles, setTargetMuscles] = useState([]); // Stanje za ciljane mišićne skupine
  const [workoutDate, setWorkoutDate] = useState(formatDate(new Date())); // Stanje za datum treninga
  const [exercises, setExercises] = useState([]); // Stanje za vježbe u treningu
  const [exerciseInput, setExerciseInput] = useState({ ...initialExercise }); // Stanje za podatke za novu vježbu
  const [error, setError] = useState(""); // Stanje za poruke o greškama
  const [showTemplateSelector, setShowTemplateSelector] = useState(false); // Stanje za prikaz izbornika predložaka

  // Stanja za spremljene treninge
  const [savedWorkouts, setSavedWorkouts] = useState([]); // Stanje za spremljene treninge
  const [expandedWorkout, setExpandedWorkout] = useState(null); // Stanje za prošireni prikaz treninga

  // Stanja za filtere na spremljenim treninzima
  const [filterMuscles, setFilterMuscles] = useState([]); // Stanje za filtriranja po mišićnim skupinama
  const [startDate, setStartDate] = useState(""); // Stanje za početni datum za filtriranje
  const [endDate, setEndDate] = useState(""); // Stanje za krajnji datum za filtriranje
  const [sortOrder, setSortOrder] = useState("desc"); // Stanje za redoslijed sortiranja

  // Dohvaćanje treninga prilikom promjene taba ili filtera
  useEffect(() => {
    if (tab === 1) {
      fetchWorkouts();
    }
  }, [tab, filterMuscles, startDate, endDate, sortOrder]);

  // Funkcija za dohvaćanje treninga sa servera
  const fetchWorkouts = async () => {
    try {
      const url = buildWorkoutsUrl(
        filterMuscles,
        startDate,
        endDate,
        sortOrder
      );

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.ok) {
        const data = await res.json();
        setSavedWorkouts(Array.isArray(data) ? data : []);
      } else {
        setSavedWorkouts([]);
      }
    } catch (error) {
      console.error("Error fetching workouts:", error);
      setSavedWorkouts([]);
    }
  };

  // Funkcija za promjenu ciljanih mišićnih skupina
  const handleMuscleChange = (muscle) => {
    if (targetMuscles.includes(muscle)) {
      setTargetMuscles(targetMuscles.filter((m) => m !== muscle));
    } else {
      setTargetMuscles([...targetMuscles, muscle]);
    }
  };

  // Funkcija za promjenu filtera mišićnih skupina
  const handleFilterMuscleChange = (muscle) => {
    if (filterMuscles.includes(muscle)) {
      setFilterMuscles(filterMuscles.filter((m) => m !== muscle));
    } else {
      setFilterMuscles([...filterMuscles, muscle]);
    }
  };

  // Funkcija za dodavanje nove vježbe u trening
  const addExercise = () => {
    if (!exerciseInput.name) return;

    setExercises([
      ...exercises,
      {
        name: exerciseInput.name,
        sets: [],
      },
    ]);

    setExerciseInput({ ...initialExercise });
  };

  // Funkcija za dodavanje novog seta u vježbu
  const addSet = (exerciseIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.push({ ...initialSet });
    setExercises(updatedExercises);
  };

  // Funkcija za ažuriranje vrijednosti seta
  const updateSetValue = (exerciseIndex, setIndex, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updatedExercises);
  };

  // Funkcija za uklanjanje vježbe iz treninga
  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  // Funkcija za uklanjanje seta iz vježbe
  const removeSet = (exerciseIndex, setIndex) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets.splice(setIndex, 1);
    setExercises(updatedExercises);
  };

  // Funkcija za spremanje treninga
  const completeWorkout = async () => {
    // Validacija podataka treninga
    const errorMessage = validateWorkout(
      workoutName,
      exercises,
      targetMuscles,
      t
    );
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError("");

    try {
      // Formatiranje vježbi za slanje na API
      const formattedExercises = formatExercisesForSubmission(exercises);

      // Slanje zahtjeva za spremanje treninga
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: workoutName,
          date: workoutDate,
          targetMuscles,
          exercises: formattedExercises,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || t("workouts.errorSaving"));
      }

      // Resetiranje obrasca nakon uspješnog spremanja
      setWorkoutName("");
      setTargetMuscles([]);
      setWorkoutDate(formatDate(new Date()));
      setExercises([]);
      setExerciseInput({ ...initialExercise });

      // Prebacivanje na tab spremljenih treninga
      setTab(1);
    } catch (error) {
      console.error("Error saving workout:", error);
      setError(t("workouts.errorSaving"));
    }
  };

  // Funkcija za brisanje treninga
  const handleDeleteWorkout = async (workoutId) => {
    if (!window.confirm(t("workouts.confirmDelete"))) return;

    try {
      const res = await fetch(`/api/workouts/${workoutId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        throw new Error(t("workouts.errorDeleting"));
      }

      setSavedWorkouts(
        savedWorkouts.filter((workout) => workout._id !== workoutId)
      );
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert(t("workouts.errorDeleting"));
    }
  };

  // Funkcija za korištenje spremljenog treninga kao predloška s prethodnim vrijednostima kao placeholderima
  const useWorkoutAsTemplate = (workout) => {
    const templateExercises = createTemplateFromWorkout(workout);
    setTargetMuscles([...workout.targetMuscles]);
    setExercises(templateExercises);
    setShowTemplateSelector(false);
    setTab(0);
  };

  // Funkcija za prikazivanje/skrivanje izbornika predložaka
  const toggleTemplateSelector = () => {
    if (!showTemplateSelector) {
      fetchWorkouts();
    }
    setShowTemplateSelector(!showTemplateSelector);
  };

  // Funkcija za generiranje PDF izvještaja
  const handleGeneratePdfReport = () => {
    generatePdfReport(
      savedWorkouts,
      filterMuscles,
      startDate,
      endDate,
      sortOrder,
      t
    );
  };

  // Funkcija za brisanje svih filtera
  const clearFilters = () => {
    setFilterMuscles([]);
    setStartDate("");
    setEndDate("");
    setSortOrder("desc");
  };

  return (
    <main className="container mx-auto pt-20 px-4 flex justify-center">
      <div className="w-full max-w-2xl p-4">
        <h2 className="text-[34px] font-extrabold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8">
          {t("workouts.title")}
        </h2>

        {/* Tabovi za navigaciju */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg transition-all duration-300 cursor-pointer ${
              tab === 0
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                : "bg-gray-800 text-gray-300"
            }`}
            onClick={() => setTab(0)}
          >
            {t("workouts.newWorkout")}
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-bold text-lg transition-all duration-300 cursor-pointer ${
              tab === 1
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105"
                : "bg-gray-800 text-gray-300"
            }`}
            onClick={() => setTab(1)}
          >
            {t("workouts.completedWorkouts")}
          </button>
        </div>

        {/* Tab za dodavanje novog treninga */}
        {tab === 0 && (
          <div className="add-workout-form shadow-xl rounded-2xl p-8 mb-8">
            {/* Unos naziva treninga */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-300">
                {t("workouts.workoutName")}
              </label>
              <input
                type="text"
                placeholder={t("workouts.workoutNamePlaceholder")}
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Gumb za korištenje predloška */}
            <button
              onClick={toggleTemplateSelector}
              className="max-w-[75%] mb-4 p-2 bg-purple-600 rounded mx-auto flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-purple-700 transition-all flex items-center justify-center"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                />
              </svg>
              {t("workouts.useAsTemplate")}
            </button>

            {/* Odabir ciljanih mišićnih skupina */}
            <MuscleGroupSelector
              selectedMuscles={targetMuscles}
              onMuscleChange={handleMuscleChange}
              label={t("workouts.targetMuscles")}
            />

            {/* Unos datuma treninga */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-300">
                {t("workouts.workoutDate")}
              </label>
              <input
                type="date"
                value={workoutDate}
                onChange={(e) => setWorkoutDate(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Komponenta za popis vježbi */}
            <ExerciseList
              exercises={exercises}
              exerciseInput={exerciseInput}
              setExerciseInput={setExerciseInput}
              addExercise={addExercise}
              removeExercise={removeExercise}
              addSet={addSet}
              removeSet={removeSet}
              updateSetValue={updateSetValue}
            />

            {/* Prikaz poruke o grešci */}
            {error && (
              <div className="text-red-400 mb-4 text-center">{error}</div>
            )}

            {/* Gumb za spremanje treninga */}
            <button
              onClick={completeWorkout}
              className="w-full py-3 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg cursor-pointer hover:opacity-90 transition-opacity"
              type="button"
            >
              {t("workouts.completeWorkout")}
            </button>
          </div>
        )}

        {/* Tab za prikaz spremljenih treninga */}
        {tab === 1 && (
          <div>
            {/* Komponenta za filtriranje treninga */}
            <WorkoutFilter
              filterMuscles={filterMuscles}
              handleFilterMuscleChange={handleFilterMuscleChange}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              clearFilters={clearFilters}
              generatePdfReport={handleGeneratePdfReport}
            />

            {/* Komponenta za prikaz spremljenih treninga */}
            <WorkoutList
              savedWorkouts={savedWorkouts}
              expandedWorkout={expandedWorkout}
              setExpandedWorkout={setExpandedWorkout}
              handleDeleteWorkout={handleDeleteWorkout}
            />
          </div>
        )}

        {/* Komponenta za odabir predloška koja se prikazuje samo kad je aktivirana */}
        {showTemplateSelector && (
          <TemplateSelector
            savedWorkouts={savedWorkouts}
            toggleTemplateSelector={toggleTemplateSelector}
            useWorkoutAsTemplate={useWorkoutAsTemplate}
          />
        )}
      </div>
    </main>
  );
}

export default Workouts;
