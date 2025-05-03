// Rute za upravljanje prehranom i obrocima korisnika
const express = require("express");
const router = express.Router();
const { Meal } = require("../db");
const { authMiddleware } = require("../auth");

/**
 * POST /
 * Ruta za spremanje novog obroka s pripadajućim namirnicama
 * Prima naziv obroka i polje namirnica s nutritivnim vrijednostima
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, foods } = req.body;

    // Validacija osnovnih podataka o obroku
    // Provjerava postoji li naziv i barem jedna namirnica
    if (!name || !foods || !Array.isArray(foods) || foods.length === 0) {
      return res
        .status(400)
        .json({ message: "Meal name and foods are required." });
    }

    // Validacija svake pojedinačne namirnice
    // Osigurava da svaka namirnica ima sve potrebne nutritivne podatke
    for (const food of foods) {
      if (
        !food.name ||
        typeof food.grams !== "number" ||
        typeof food.protein !== "number" ||
        typeof food.carbs !== "number" ||
        typeof food.fats !== "number" ||
        typeof food.calories !== "number"
      ) {
        return res.status(400).json({
          message:
            "Each food must have name, grams, protein, carbs, fats, and calories (all numbers except name).",
        });
      }
    }

    // Stvaranje i spremanje novog obroka
    // Povezuje se s trenutno prijavljenim korisnikom
    const meal = new Meal({ userId: req.user.id, name, foods });
    await meal.save();
    res.status(201).json({ message: "Meal saved.", meal });
  } catch (err) {
    // Obrada grešaka pri spremanju obroka
    res.status(500).json({
      message: "Failed to save meal.",
      error: err.message,
    });
  }
});

/**
 * GET /
 * Dohvaća sve obroke za prijavljenog korisnika
 * Vraća kronološki popis obroka za planiranje prehrane
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Dohvaćanje svih obroka korisnika sortiranih od najnovijih
    const meals = await Meal.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(meals);
  } catch (err) {
    // Obrada grešaka pri dohvaćanju obroka
    res.status(500).json({
      message: "Failed to fetch meals.",
      error: err.message,
    });
  }
});

/**
 * DELETE /:id
 * Briše obrok prema ID-u
 * Omogućuje korisnicima uklanjanje obroka iz svoje povijesti
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Pronalaženje i brisanje obroka koji pripada trenutnom korisniku
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    // Provjera je li obrok pronađen
    if (!meal) {
      return res.status(404).json({ message: "Meal not found." });
    }

    // Slanje potvrde o uspješnom brisanju
    res.json({ message: "Meal deleted." });
  } catch (err) {
    // Obrada grešaka pri brisanju obroka
    res.status(500).json({
      message: "Failed to delete meal.",
      error: err.message,
    });
  }
});

module.exports = router;
