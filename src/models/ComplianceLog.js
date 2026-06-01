const mongoose = require("mongoose");
const { COMPLIANCE_STATUS, SYMPTOM_SEVERITY } = require("../config/constants");

const complianceLogSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
    },
    reminderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reminder",
    },
    logDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    timeOfDay: {
      type: String,
      enum: ["morning", "afternoon", "evening", "night"],
    },
    medicationTaken: {
      type: Boolean,
      required: true,
    },
    quantityTaken: Number,
    quantityPrescribed: Number,
    reasonIfMissed: {
      type: String,
      enum: [
        "forgot",
        "side_effects",
        "unavailable",
        "too_busy",
        "not_needed",
        "cost",
        "other",
      ],
    },
    symptoms: [
      {
        symptom: String,
        severity: {
          type: String,
          enum: Object.values(SYMPTOM_SEVERITY),
        },
        notes: String,
      },
    ],
    sideEffectsObserved: [String],
    moodLevel: {
      type: Number,
      min: 1,
      max: 10,
    },
    energyLevel: {
      type: Number,
      min: 1,
      max: 10,
    },
    painLevel: {
      type: Number,
      min: 0,
      max: 10,
    },
    waterIntake: Number, // in ml
    foodIntake: String,
    exerciseMinutes: Number,
    sleepHours: Number,
    notes: String,
    deviceDataSynced: {
      type: Boolean,
      default: false,
    },
    syncedDevices: [
      {
        deviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Device",
        },
        syncedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Virtual for compliance rate
complianceLogSchema.virtual("complianceRate").get(function complianceRate() {
  if (!this.quantityPrescribed) return null;
  return (this.quantityTaken / this.quantityPrescribed) * 100;
});

// Indexes for efficient querying
complianceLogSchema.index({ patientId: 1, logDate: -1 });
complianceLogSchema.index({ medicationId: 1, logDate: -1 });
complianceLogSchema.index({ reminderId: 1 });
complianceLogSchema.index({ logDate: 1 });

// Compound index for date range queries
complianceLogSchema.index({ patientId: 1, logDate: 1 });

module.exports = mongoose.model("ComplianceLog", complianceLogSchema);
