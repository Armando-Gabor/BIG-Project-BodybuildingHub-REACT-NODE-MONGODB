// Model za praćenje tjelesnih mjera i napretka korisnika
const mongoose = require("mongoose");
const { Schema } = mongoose;

// --- Definicija sheme za praćenje tjelesnih parametara ---
const bodyTrackingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    unitSystem: {
      type: String,
      enum: ["metric", "imperial"],
      required: true,
      default: "metric",
    },
    weight: {
      type: Number,
      required: true,
      min: 0,
    },
    height: {
      type: Number,
      required: true,
      min: 0,
    },
    // Tjelesne mjere
    measurements: {
      neck: { type: Number, required: true, min: 0 },
      shoulders: { type: Number, required: true, min: 0 },
      chest: { type: Number, required: true, min: 0 },
      waist: { type: Number, required: true, min: 0 },
      hips: { type: Number, required: true, min: 0 },
      leftThigh: { type: Number, required: true, min: 0 },
      rightThigh: { type: Number, required: true, min: 0 },
      leftUpperArm: { type: Number, required: true, min: 0 },
      rightUpperArm: { type: Number, required: true, min: 0 },
      leftLowerArm: { type: Number, required: true, min: 0 },
      rightLowerArm: { type: Number, required: true, min: 0 },
      leftCalf: { type: Number, required: true, min: 0 },
      rightCalf: { type: Number, required: true, min: 0 },
    },
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
const BodyTracking = mongoose.model("BodyTracking", bodyTrackingSchema);

module.exports = BodyTracking;
