// Rute za upravljanje korisničkim profilima i administraciju korisnika
const express = require("express");
const router = express.Router();
const { User } = require("../db");
const { authMiddleware } = require("../auth");

/**
 * GET /profile
 * Vraća informacije o profilu prijavljenog korisnika
 * Dohvaća dekriptirano korisničko ime i email adresu
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Pronalazak korisnika prema ID-u iz autentifikacijskog middleware-a
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Vraćanje dekriptiranog korisničkog imena
    // Koristi se posebna metoda za dekriptiranje korisničkog imena
    res.json({
      username: user.getDecryptedUsername(),
      email: user.email,
    });
  } catch (err) {
    // Obrada grešaka pri dohvaćanju profila
    res.status(500).json({
      message: "Error fetching profile",
      error: err.message,
    });
  }
});

module.exports = router;
