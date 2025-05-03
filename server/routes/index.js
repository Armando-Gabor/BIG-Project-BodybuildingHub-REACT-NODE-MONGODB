// Glavni router modul koji objedinjuje sve API rute u aplikaciji
// Ovaj modul služi kao centralna točka za organizaciju svih API endpointova
const express = require("express");
const router = express.Router();

// Uvoz pojedinačnih router modula iz odvojenih datoteka
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const bodyRoutes = require("./body.routes");
const mealRoutes = require("./meal.routes");
const workoutRoutes = require("./workout.routes");
const imageRoutes = require("./image.routes");
const openaiRoutes = require("./openai.routes");

// Registracija svih router modula s odgovarajućim prefiksima putanja
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/body", bodyRoutes);
router.use("/meals", mealRoutes);
router.use("/workouts", workoutRoutes);
router.use("/images", imageRoutes);
router.use("/openai", openaiRoutes);

// Izvoz glavnog routera koji se koristi u server.js
module.exports = router;
