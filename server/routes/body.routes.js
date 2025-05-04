// Rute za praćenje tjelesnih parametara korisnika
const express = require("express");
const router = express.Router();
const { BodyTracking } = require("../db");
const { authMiddleware } = require("../auth");

/**
 * POST /
 * Ruta za spremanje novih tjelesnih mjera za autentificiranog korisnika
 * Prima podatke o spolu, težini, visini, odabranom mjernom sustavu i detaljnim mjerama dijelova tijela
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { gender, weight, height, measurements, unitSystem } = req.body;

    // Validacija da su svi potrebni podaci prisutni
    if (
      !gender ||
      !weight ||
      !height ||
      !measurements ||
      !unitSystem ||
      Object.values(measurements).some((v) => v === undefined || v === "")
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Stvaranje i spremanje novog zapisa o tjelesnim mjerama
    // Povezuje se s trenutno prijavljenim korisnikom preko ID-a
    const entry = new BodyTracking({
      userId: req.user.id,
      gender,
      weight,
      height,
      measurements,
      unitSystem,
    });

    await entry.save();
    res.status(201).json({ message: "Body data saved.", entry });
  } catch (err) {
    // Obrada grešaka pri spremanju podataka
    res.status(500).json({
      message: "Failed to save body data.",
      error: err.message,
    });
  }
});

/**
 * GET /latest
 * Dohvaća najnovije tjelesne mjere za prijavljenog korisnika
 * Koristi se za prikaz trenutnih podataka na korisničkom sučelju
 */
router.get("/latest", authMiddleware, async (req, res) => {
  try {
    // Pronalazi najnoviji zapis sortiranjem po datumu stvaranja (od najnovijeg)
    const latest = await BodyTracking.findOne({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    // Provjera je li pronađen zapis
    if (!latest) {
      return res.status(404).json({ message: "No body data found." });
    }

    // Slanje najnovijeg zapisa klijentu
    res.json(latest);
  } catch (err) {
    // Obrada grešaka pri dohvaćanju podataka
    res.status(500).json({
      message: "Failed to fetch body data.",
      error: err.message,
    });
  }
});

module.exports = router;
