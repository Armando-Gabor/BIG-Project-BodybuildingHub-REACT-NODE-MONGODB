// Model za upravljanje i praćenje treninga korisnika
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Shema za pojedinačne setove vježbi (kao poddokument)
const setSchema = new Schema({
  // Težina opterećenja u kilogramima
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
  // Broj ponavljanja
  reps: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Shema za pojedinačne vježbe (kao poddokument)
const exerciseSchema = new Schema({
  // Naziv vježbe
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // Polje setova koje čine vježbu
  sets: [setSchema],
});

// Definicija sheme za treninge
const workoutSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Naziv treninga
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    // Polje ciljanih mišićnih skupina
    targetMuscles: [
      {
        type: String,
        required: true,
      },
    ],
    // Polje vježbi koje čine trening
    exercises: [exerciseSchema],
    createdAt: {
      type: Date,
      default: Date.now,
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
const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
