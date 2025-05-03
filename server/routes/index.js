// Glavni router modul koji objedinjuje sve API rute u aplikaciji
// Ovaj modul služi kao centralna točka za organizaciju svih API endpointova
const express = require("express");
const router = express.Router();

// Uvoz pojedinačnih router modula iz odvojenih datoteka
// Svaki modul upravlja specifičnim funkcionalnim područjem aplikacije
const authRoutes = require("./auth.routes"); // Autentifikacija i autorizacija
const userRoutes = require("./user.routes"); // Upravljanje korisničkim profilima
const bodyRoutes = require("./body.routes"); // Praćenje tjelesnih mjera
const mealRoutes = require("./meal.routes"); // Upravljanje obrocima i prehranom
const workoutRoutes = require("./workout.routes"); // Upravljanje treninzima
const imageRoutes = require("./image.routes"); // Upravljanje slikama i fotografijama
const openaiRoutes = require("./openai.routes"); // Integracija s OpenAI API-jem

// Registracija svih router modula s odgovarajućim prefiksima putanja
// Ovi prefiksi definiraju strukturu API-ja (npr. /api/auth/login, /api/auth/register)
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/body", bodyRoutes);
router.use("/meals", mealRoutes);
router.use("/workouts", workoutRoutes);
router.use("/images", imageRoutes);
router.use("/openai", openaiRoutes);

// Izvoz glavnog routera koji se koristi u server.js
module.exports = router;
