// Model za upravljanje obrocima i praćenje prehrane korisnika
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Shema za pojedinačne namirnice (kao poddokument)
// Definira strukturu podataka za svaku namirnicu unutar obroka
const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  //Broj unosnih grama namirnice
  grams: {
    type: Number,
    required: true,
    min: 0,
  },
  // Podaci o nutritivnim vrijednostima namirnice na 100 grama
  protein: {
    type: Number,
    required: true,
    min: 0,
  },
  carbs: {
    type: Number,
    required: true,
    min: 0,
  },
  fats: {
    type: Number,
    required: true,
    min: 0,
  },
  calories: {
    type: Number,
    required: true,
    min: 0,
  },
});

// Shema za obrok
// Struktura podataka za pohranu kompletnih obroka s pripadajućim namirnicama
const mealSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Ime obroka
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // Polje namirnica koje čine obrok
    foods: [foodSchema],
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
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
const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
