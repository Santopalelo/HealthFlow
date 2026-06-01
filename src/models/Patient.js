const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    medicalHistory: {
      allergies: [String],
      chronicConditions: [String],
      pastSurgeries: [String],
      familyHistory: String,
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      groupNumber: String,
      expirationDate: Date,
    },
    preferredHospital: String,
    preferredDoctor: String,
    bloodType: {
      type: String,
      enum: ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "Unknown"],
      default: "Unknown",
    },
    height: Number, // in cm
    weight: Number, // in kg
    medications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medication",
      },
    ],
    caregiversAssigned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    linkedDevices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
      },
    ],
    healthGoals: [String],
    notes: String,
    timezone: {
      type: String,
      default: "UTC",
    },
    preferredNotificationMethod: {
      type: String,
      enum: ["email", "sms", "push", "all"],
      default: "push",
    },
    consentGiven: {
      dataUsage: {
        type: Boolean,
        default: false,
      },
      privacyPolicy: {
        type: Boolean,
        default: false,
      },
      thirdPartySharing: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
patientSchema.index({ userId: 1 });
patientSchema.index({ medicalHistory: 1 });
patientSchema.index({ linkedDevices: 1 });

// Populate user info on find
patientSchema.pre(/^find/, function populate() {
  this.populate({
    path: "userId",
    select: "firstName lastName email phone",
  });
});

module.exports = mongoose.model("Patient", patientSchema);
