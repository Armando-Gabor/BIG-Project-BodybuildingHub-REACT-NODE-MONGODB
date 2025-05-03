// Model za pohranu i upravljanje slikama u aplikaciji
// Omogućava praćenje korisničkog napretka kroz vizualne dokaze
const mongoose = require("mongoose");
const { Schema } = mongoose;

// --- Definicija sheme modela za slike ---
// Struktura podataka za pohranu i dohvaćanje slika korisnika
const imageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Indeksiranje za brže upite po korisniku
    },
    uploadDate: {
      type: Date,
      default: Date.now, // Automatski postavlja datum učitavanja slike
      index: true, // Indeks za sortiranje po datumu učitavanja
    },
    filename: {
      type: String,
      trim: true, // Uklanja razmake s početka i kraja naziva datoteke
    },
    s3Key: {
      type: String,
      required: true,
      trim: true, // Jedinstveni ključ za identifikaciju slike u S3 pohrani
    },
    url: {
      type: String,
      required: true,
      trim: true, // Javni URL za pristup slici
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
// Ovaj model se koristi za pohranu metapodataka o slikama korisnika
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
