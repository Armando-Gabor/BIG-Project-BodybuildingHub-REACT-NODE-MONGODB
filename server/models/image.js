// Model za pohranu i upravljanje slikama u aplikaciji
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
      index: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    filename: {
      type: String,
      trim: true,
    },
    // Jedinstveni ključ za identifikaciju slike u S3 pohrani
    s3Key: {
      type: String,
      required: true,
      trim: true,
    },
    // Javni URL za pristup slici
    url: {
      type: String,
      required: true,
      trim: true,
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
const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
