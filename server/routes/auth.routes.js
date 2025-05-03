// Rute za autentifikaciju korisnika - omogućuju registraciju i prijavu
const express = require("express");
const router = express.Router();
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../auth");
const mongoose = require("mongoose");

/**
 * POST /register
 * Ruta za registraciju novog korisnika
 * Prima korisničko ime, email i lozinku, stvara novi korisnički račun
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Provjera je li veza s bazom podataka aktivna
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Database connection is not ready");
    }

    // Validacija korisničkog imena
    if (!username || typeof username !== "string" || username.length < 3) {
      return res.status(400).json({
        message: "Validation error",
        details: { username: "Username must be at least 3 characters long" },
      });
    }

    // Stvaranje i spremanje novog korisnika u bazu
    // Hashiranje i kriptiranje se odvija automatski u modelu
    const user = new User({ username, email, password });
    const savedUser = await user.save();

    // Generiranje JWT tokena i slanje odgovora klijentu
    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET);
    res.status(201).json({ token });
  } catch (err) {
    // Obrada grešaka za dupliranje ključeva (korisničko ime/email već postoji)
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Username or email already exists",
        details: err.keyPattern,
      });
    }

    // Obrada grešaka validacije Mongoose modela
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        details: Object.values(err.errors).map((e) => e.message),
      });
    }

    // Obrada ostalih nepredviđenih grešaka
    res.status(500).json({
      message: "Error creating user",
      details: err.message,
    });
  }
});

/**
 * POST /login
 * Ruta za prijavu korisnika
 * Autentificira korisničke podatke i izdaje JWT token za pristup aplikaciji
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Provjera jesu li svi potrebni podaci prisutni
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Pronalazak korisnika po email adresi
    const user = await User.findOne({ email });

    // Provjera postoji li korisnik i odgovara li lozinka (metoda modela)
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generiranje i slanje JWT tokena za autorizirani pristup
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    // Obrada grešaka tijekom procesa prijave
    res.status(500).json({
      message: "Error during login process",
      details: err.message,
    });
  }
});

module.exports = router;
