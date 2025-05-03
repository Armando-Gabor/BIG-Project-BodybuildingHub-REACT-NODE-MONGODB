// Rute za integraciju s OpenAI API-jem
// Omogućuje AI funkcionalnosti i pristup jezičnim modelima u aplikaciji
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../auth");

/**
 * GET /openrouter-key
 * Zaštićena ruta za dohvaćanje OpenRouter API ključa
 * Ključ se koristi za direktnu komunikaciju s AI servisom
 */
router.get("/key", authMiddleware, (req, res) => {
  try {
    // Provjera je li API ključ konfiguriran u okolišnim varijablama
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(404).json({
        message: "API key not configured",
      });
    }

    // Slanje API ključa klijentu (sigurno zbog autentifikacije)
    res.json({ key: process.env.OPENROUTER_API_KEY });
  } catch (error) {
    // Obrada grešaka pri dohvaćanju ključa
    res.status(500).json({
      message: "Failed to get API key",
      error: error.message,
    });
  }
});

module.exports = router;
