// Modul za konfiguraciju baze podataka i povezivanje s MongoDB bazom podataka
const mongoose = require("mongoose");

// Uvoz modela podataka aplikacije
const User = require("./models/User"); // Model za korisničke račune
const BodyTracking = require("./models/BodyTracking"); // Model za praćenje tjelesnih mjera
const Meal = require("./models/Meal"); // Model za prehranu i obroke
const Workout = require("./models/Workout"); // Model za vježbe i treninge
const Image = require("./models/image"); // Model za slike napretka

// MongoDB konfiguracija - URI za povezivanje s bazom dolazi iz env varijabli
const mongoUri = process.env.MONGODB_URI;

// Dodatne postavke povezivanja s MongoDB-om
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Maksimalno vrijeme za odabir servera (5 sekundi)
  connectTimeoutMS: 10000, // Maksimalno vrijeme za uspostavljanje veze (10 sekundi)
};

// Funkcija za povezivanje s MongoDB bazom
const connectDB = async () => {
  // Pokušaj povezivanje s MongoDB bazom koristeći Mongoose
  try {
    await mongoose.connect(mongoUri, mongooseOptions);
    console.log("MongoDB connected successfully using Mongoose");
    console.log(`Connected to database: ${mongoose.connection.name}`);
  } catch (err) {
    // Obrada greške pri povezivanju
    console.error("MongoDB connection error:", err);
    process.exit(1); // Izlaz iz aplikacije u slučaju greške
  }
};

// Poziv funkcije za povezivanje s bazom prilikom pokretanja aplikacije
connectDB();

// Upravljanje događajima MongoDB veze
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err); // Obrada grešaka koje mogu nastati tijekom rada s bazom
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Attempting to reconnect..."); // Detekcija prekida veze s bazom
});

mongoose.connection.on("reconnected", () => {
  console.info("MongoDB reconnected successfully"); // Uspješno ponovno povezivanje nakon prekida
});

// Rukovanje s prekidom rada aplikacije
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error during MongoDB disconnection:", err);
    process.exit(1);
  }
});

// Izvoz modela podataka za korištenje u ostatku aplikacije
module.exports = {
  User,
  BodyTracking,
  Meal,
  Workout,
  Image,
};
