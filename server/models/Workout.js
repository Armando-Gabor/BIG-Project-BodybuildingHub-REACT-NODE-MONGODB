// Model za upravljanje i praćenje treninga korisnika
// Omogućava strukturiranje i analizu treninga s pripadajućim vježbama
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Shema za pojedinačne setove vježbi (kao poddokument)
// Definira strukturu podataka za praćenje opterećenja i ponavljanja
const setSchema = new Schema({
  weight: {
    type: Number,
    required: true,
    min: 0, // Težina opterećenja u kilogramima (ne može biti negativna)
  },
  reps: {
    type: Number,
    required: true,
    min: 0, // Broj ponavljanja (ne može biti negativan)
  },
});

// Shema za pojedinačne vježbe (kao poddokument)
// Definira strukturu podataka za svaku vježbu unutar treninga
const exerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Naziv vježbe (npr. "Bench Press", "Squat", "Deadlift")
  },
  sets: [setSchema], // Polje setova koje čine vježbu
});

// --- Definicija sheme za treninge ---
// Struktura podataka za pohranu kompletnih treninga s pripadajućim vježbama
const workoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Indeksiranje za brže upite po korisniku
    },
    name: {
      type: String,
      required: true,
      trim: true, // Naziv treninga (npr. "Prsa i triceps", "Noge", "Pull day")
    },
    date: {
      type: Date,
      required: true,
      index: true, // Indeksiranje za brže upite po datumu
    },
    targetMuscles: [
      {
        type: String,
        required: true, // Polje ciljanih mišićnih skupina (npr. "chest", "legs")
      },
    ],
    exercises: [exerciseSchema], // Polje vježbi koje čine trening
    createdAt: {
      type: Date,
      default: Date.now, // Automatski postavlja vrijeme stvaranja zapisa
    },
  },
  {
    timestamps: true, // Automatski dodaje i održava createdAt i updatedAt polja
    toJSON: {
      // Transformacija pri pretvorbi u JSON - uklanja nepotrebna polja
      transform: function (doc, ret) {
        delete ret.__v; // Uklanjanje interne Mongoose verzije
        return ret;
      },
    },
  }
);

// Stvaranje modela iz definirane sheme
// Ovaj model se koristi za sve operacije s podacima o treninzima korisnika
const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
