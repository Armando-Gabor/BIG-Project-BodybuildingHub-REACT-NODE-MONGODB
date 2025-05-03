// Rute za upravljanje treninzima i vježbama korisnika
const express = require("express");
const router = express.Router();
const { Workout } = require("../db");
const { authMiddleware } = require("../auth");

/**
 * POST /
 * Ruta za spremanje novog treninga s vježbama
 * Prima naziv, datum, ciljane mišićne skupine i popis vježbi
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, date, targetMuscles, exercises } = req.body;

    // Validacija obaveznih polja
    if (!name || !date || !targetMuscles || !exercises) {
      return res.status(400).json({
        message: "Name, date, target muscles, and exercises are required.",
      });
    }

    // Validacija formata vježbi - mora postojati barem jedna vježba
    if (!Array.isArray(exercises) || exercises.length === 0) {
      return res.status(400).json({
        message: "At least one exercise is required.",
      });
    }

    // Validacija ciljanih mišićnih skupina - mora postojati barem jedna
    if (!Array.isArray(targetMuscles) || targetMuscles.length === 0) {
      return res.status(400).json({
        message: "At least one target muscle is required.",
      });
    }

    // Validacija da svaka vježba ima setove
    for (const exercise of exercises) {
      if (
        !exercise.name ||
        !exercise.sets ||
        !Array.isArray(exercise.sets) ||
        exercise.sets.length === 0
      ) {
        return res.status(400).json({
          message: "Each exercise must have a name and at least one set.",
        });
      }

      // Validacija da svaki set ima težinu i ponavljanja
      for (const set of exercise.sets) {
        if (typeof set.weight !== "number" || typeof set.reps !== "number") {
          return res.status(400).json({
            message: "Each set must have weight and reps as numbers.",
          });
        }
      }
    }

    // Stvaranje i spremanje novog treninga
    // Povezuje se s trenutno prijavljenim korisnikom
    const workout = new Workout({
      userId: req.user.id,
      name,
      date,
      targetMuscles,
      exercises,
    });

    await workout.save();
    res.status(201).json({ message: "Workout saved successfully.", workout });
  } catch (err) {
    // Obrada grešaka pri spremanju treninga
    res.status(500).json({
      message: "Failed to save workout.",
      error: err.message,
    });
  }
});

/**
 * GET /
 * Dohvaća treninge korisnika s opcijama filtriranja
 * Podržava filtriranje po mišićnim skupinama i vremenskom razdoblju
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { muscles, startDate, endDate, sort = "desc" } = req.query;

    // Osnovni upit s ID-om korisnika za filtriranje podataka
    const query = { userId: req.user.id };

    // Primjena filtera po mišićnim skupinama ako je naveden
    if (muscles) {
      const muscleList = muscles.split(",");
      query.targetMuscles = { $in: muscleList };
    }

    // Primjena filtera po rasponu datuma ako su navedeni
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        // Dodajemo jedan dan kako bi uključili i krajnji datum u potpunosti
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        query.date.$lt = nextDay;
      }
    }

    // Sortiranje po datumu (uzlazno ili silazno)
    const sortOption = sort === "asc" ? { date: 1 } : { date: -1 };

    // Dohvaćanje treninga prema zadanim filterima
    const workouts = await Workout.find(query).sort(sortOption);
    res.json(workouts);
  } catch (err) {
    // Obrada grešaka pri dohvaćanju treninga
    res.status(500).json({
      message: "Failed to fetch workouts.",
      error: err.message,
    });
  }
});

/**
 * GET /:id
 * Dohvaća specifični trening prema ID-u
 * Koristi se za detaljan prikaz pojedinačnog treninga
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    // Pronalaženje treninga koji pripada trenutnom korisniku
    const workout = await Workout.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    // Provjera je li trening pronađen
    if (!workout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    // Slanje pronađenog treninga klijentu
    res.json(workout);
  } catch (err) {
    // Obrada grešaka pri dohvaćanju treninga
    res.status(500).json({
      message: "Failed to fetch workout.",
      error: err.message,
    });
  }
});

/**
 * DELETE /:id
 * Briše trening prema ID-u
 * Omogućuje korisnicima uklanjanje treninga iz svoje povijesti
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Pronalaženje i brisanje treninga koji pripada trenutnom korisniku
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    // Provjera je li trening pronađen i obrisan
    if (!workout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    // Slanje potvrde o uspješnom brisanju
    res.json({ message: "Workout deleted successfully." });
  } catch (err) {
    // Obrada grešaka pri brisanju treninga
    res.status(500).json({
      message: "Failed to delete workout.",
      error: err.message,
    });
  }
});

module.exports = router;
