// Model za praćenje tjelesnih mjera i napretka korisnika
// Omogućava spremanje i analizu tjelesnih parametara kroz vrijeme
const mongoose = require("mongoose");
const { Schema } = mongoose;

// --- Definicija sheme za praćenje tjelesnih parametara ---
// Struktura podataka uključuje sve relevantne tjelesne mjere i dimenzije
const bodyTrackingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Indeksiranje za brže upite po korisniku
    },
    gender: {
      type: String,
      enum: ["male", "female"], // Ograničeno na muški ili ženski spol
      required: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 0, // Težina ne može biti negativna
    },
    height: {
      type: Number,
      required: true,
      min: 0, // Visina ne može biti negativna
    },
    measurements: {
      neck: { type: Number, required: true, min: 0 }, // Opseg vrata
      shoulders: { type: Number, required: true, min: 0 }, // Opseg ramena
      chest: { type: Number, required: true, min: 0 }, // Opseg prsa
      waist: { type: Number, required: true, min: 0 }, // Opseg struka
      hips: { type: Number, required: true, min: 0 }, // Opseg bokova
      leftThigh: { type: Number, required: true, min: 0 }, // Opseg lijevog bedra
      rightThigh: { type: Number, required: true, min: 0 }, // Opseg desnog bedra
      leftUpperArm: { type: Number, required: true, min: 0 }, // Opseg lijeve nadlaktice
      rightUpperArm: { type: Number, required: true, min: 0 }, // Opseg desne nadlaktice
      leftLowerArm: { type: Number, required: true, min: 0 }, // Opseg lijeve podlaktice
      rightLowerArm: { type: Number, required: true, min: 0 }, // Opseg desne podlaktice
      leftCalf: { type: Number, required: true, min: 0 }, // Opseg lijeve potkoljenice
      rightCalf: { type: Number, required: true, min: 0 }, // Opseg desne potkoljenice
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatski postavlja datum stvaranja zapisa
      index: true, // Indeksiranje za brže upite po vremenu
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
// Ovaj model se koristi za sve operacije s podacima o tjelesnim mjerama
const BodyTracking = mongoose.model("BodyTracking", bodyTrackingSchema);

module.exports = BodyTracking;
