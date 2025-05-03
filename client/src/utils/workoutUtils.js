// Utility funkcije za upravljanje treninzima i vježbama

// Mišićne skupine koje se mogu odabrati za treninge
export const muscleGroups = [
  "chest", // Prsa
  "back", // Leđa
  "shoulders", // Ramena
  "biceps", // Bicepsi
  "triceps", // Tricepsi
  "hamstrings", // Zadnja loža
  "quadriceps", // Prednja loža
  "calves", // Listovi
  "gluteus", // Stražnjica
  "abs", // Trbušni mišići
  "forearms", // Podlaktice
  "neck", // Vrat
];

// Početno stanje za novu vježbu
// Koristi se za inicijalizaciju nove vježbe u treningu
export const initialExercise = {
  name: "", // Naziv vježbe
  sets: [], // Prazna lista setova
};

// Početno stanje za novi set
// Koristi se za dodavanje novog seta u vježbu
export const initialSet = {
  weight: "", // Težina (kg/lbs)
  reps: "", // Broj ponavljanja
};

// Formatiranje datuma
// Pretvara JavaScript Date objekt u standardni format datuma
export function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

// Validacija podataka o treningu prije slanja na server
export function validateWorkout(workoutName, exercises, targetMuscles, t) {
  if (!workoutName) {
    return t("workouts.validation.nameRequired");
  }

  if (exercises.length === 0) {
    return t("workouts.validation.exerciseRequired");
  }

  if (targetMuscles.length === 0) {
    return t("workouts.validation.muscleRequired");
  }

  // Validacija da svaka vježba ima barem jedan set
  for (const exercise of exercises) {
    if (exercise.sets.length === 0) {
      return t("workouts.validation.setsRequired", { exercise: exercise.name });
    }

    // Validacija da svaki set ima težinu i broj ponavljanja
    for (const [index, set] of exercise.sets.entries()) {
      if (!set.weight || !set.reps) {
        return t("workouts.validation.setIncomplete", {
          setNumber: index + 1,
          exercise: exercise.name,
        });
      }
    }
  }

  return "";
}

// Formatiranje vježbi za slanje na API
export function formatExercisesForSubmission(exercises) {
  return exercises.map((exercise) => ({
    name: exercise.name,
    sets: exercise.sets.map((set) => ({
      weight: parseFloat(set.weight),
      reps: parseInt(set.reps, 10),
    })),
  }));
}

// Stvaranje predloška vježbi iz spremljenog treninga
// Omogućuje ponovno korištenje strukture prethodnog treninga
export function createTemplateFromWorkout(workout) {
  return workout.exercises.map((exercise) => ({
    name: exercise.name,
    sets: exercise.sets.map((set) => ({
      weight: "", // Prazna vrijednost za novi unos
      reps: "", // Prazna vrijednost za novi unos
      lastWeight: set.weight, // Pohrana prethodne težine za placeholder
      lastReps: set.reps, // Pohrana prethodnog broja ponavljanja za placeholder
    })),
  }));
}

// Izgradnja URL-a s filterima za dohvaćanje treninga
// Stvara URL s parametrima za filtriranje treninga na serveru
export function buildWorkoutsUrl(filterMuscles, startDate, endDate, sortOrder) {
  let url = "/api/workouts";
  const params = new URLSearchParams();

  // Dodavanje filtera za mišićne skupine
  if (filterMuscles.length > 0) {
    params.append("muscles", filterMuscles.join(","));
  }

  // Dodavanje filtera za početni datum
  if (startDate) {
    params.append("startDate", startDate);
  }

  // Dodavanje filtera za završni datum
  if (endDate) {
    params.append("endDate", endDate);
  }

  // Dodavanje smjera sortiranja
  params.append("sort", sortOrder);

  // Dodavanje parametara na URL ako postoje
  if (params.toString()) {
    url += `?${params.toString()}`;
  }

  return url;
}
