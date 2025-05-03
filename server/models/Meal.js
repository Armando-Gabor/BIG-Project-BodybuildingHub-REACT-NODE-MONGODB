// Model za upravljanje obrocima i praćenje prehrane korisnika
// Omogućava pohranu, praćenje i analizu prehrambenih navika
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Shema za pojedinačne namirnice (kao poddokument)
// Definira strukturu podataka za svaku namirnicu unutar obroka
const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Uklanja razmake s početka i kraja naziva
  },
  grams: {
    type: Number,
    required: true,
    min: 0, // Količina u gramima ne može biti negativna
  },
  protein: {
    type: Number,
    required: true,
    min: 0, // Količina proteina u gramima
  },
  carbs: {
    type: Number,
    required: true,
    min: 0, // Količina ugljikohidrata u gramima
  },
  fats: {
    type: Number,
    required: true,
    min: 0, // Količina masti u gramima
  },
  calories: {
    type: Number,
    required: true,
    min: 0, // Kalorijska vrijednost namirnice
  },
});

// --- Definicija sheme za obroke ---
// Struktura podataka za pohranu kompletnih obroka s pripadajućim namirnicama
const mealSchema = new Schema(
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
      trim: true, // Naziv obroka (npr. "Doručak", "Ručak", "Međuobrok")
    },
    foods: [foodSchema], // Polje namirnica koje čine obrok
    createdAt: {
      type: Date,
      default: Date.now, // Automatski postavlja datum stvaranja obroka
      index: true, // Indeks za sortiranje po vremenu
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
// Ovaj model se koristi za sve operacije s podacima o obrocima korisnika
const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
