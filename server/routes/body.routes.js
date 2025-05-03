// Rute za praćenje tjelesnih parametara korisnika
// Omogućuju spremanje, dohvaćanje i praćenje tjelesnih mjera kroz vrijeme
const express = require("express");
const router = express.Router();
const { BodyTracking } = require("../db");
const { authMiddleware } = require("../auth");

/**
 * POST /
 * Ruta za spremanje novih tjelesnih mjera za autentificiranog korisnika
 * Prima podatke o spolu, težini, visini i detaljnim mjerama
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { gender, weight, height, measurements } = req.body;

    // Validacija da su svi potrebni podaci prisutni
    // Provjerava se jesu li sve mjere unesene i imaju li vrijednost
    if (
      !gender ||
      !weight ||
      !height ||
      !measurements ||
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
 * Koristi se za prikaz trenutnog stanja i izračune
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

/**
 * GET /history
 * Dohvaća povijest tjelesnih mjera za analizu napretka korisnika
 * Vraća kronološki poredane podatke za izradu grafikona i trendova
 */
router.get("/history", authMiddleware, async (req, res) => {
  try {
    // Dohvaća sve zapise korisnika sortirane od najnovijeg prema najstarijem
    const history = await BodyTracking.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    // Slanje povijesnih podataka klijentu
    res.json(history);
  } catch (err) {
    // Obrada grešaka pri dohvaćanju povijesnih podataka
    res.status(500).json({
      message: "Failed to fetch body history.",
      error: err.message,
    });
  }
});

module.exports = router;
