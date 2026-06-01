const mongoose = require("mongoose");
const { MEDICATION_TYPES } = require("../config/constants");

const medicationSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Medication name is required"],
    },
    genericName: String,
    dosage: {
      type: String,
      required: [true, "Dosage is required"],
    },
    unit: {
      type: String,
      enum: ["mg", "ml", "mcg", "g", "iu", "units", "other"],
      required: true,
    },
    medicationType: {
      type: String,
      enum: Object.values(MEDICATION_TYPES),
      required: true,
    },
    purpose: {
      type: String,
      required: [true, "Medication purpose is required"],
    },
    prescribedDate: {
      type: Date,
      required: true,
    },
    expirationDate: Date,
    prescribedBy: String,
    refillsRemaining: {
      type: Number,
      default: 0,
    },
    prescriptionNumber: String,
    sideEffects: [String],
    interactions: [String],
    foodInteractions: [String],
    storageInstructions: String,
    notes: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
medicationSchema.index({ patientId: 1 });
medicationSchema.index({ isActive: 1 });

module.exports = mongoose.model("Medication", medicationSchema);
