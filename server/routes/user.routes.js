// Rute za upravljanje korisničkim profilima i administraciju korisnika
// Omogućuje dohvaćanje profila, kreiranje korisnika i administrativne funkcije
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

/**
 * POST /
 * Stvara novog korisnika (Administrativna krajnja točka)
 * Koristi se za administrativno kreiranje korisnika bez registracije
 */
router.post("/", async (req, res) => {
  try {
    // Kreiranje i spremanje novog korisnika
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    // Obrada potencijalnih grešaka poput duplikata korisničkog imena/emaila
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }
    // Obrada ostalih grešaka
    res.status(500).json({
      message: "Error creating user",
      error: err.message,
    });
  }
});

/**
 * GET /
 * Dohvaća sve korisnike (Administrativna krajnja točka)
 * Koristi se za administrativni pregled svih korisnika u sustavu
 */
router.get("/", async (req, res) => {
  try {
    // Dohvaćanje svih korisnika iz baze
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    // Obrada grešaka pri dohvaćanju korisnika
    res.status(500).json({
      message: "Error fetching users",
      error: err.message,
    });
  }
});

module.exports = router;
