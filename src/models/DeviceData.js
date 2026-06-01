const mongoose = require("mongoose");

const deviceDataSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
      required: true,
    },
    dataTimestamp: {
      type: Date,
      required: true,
    },
    dataType: {
      type: String,
      required: true,
      enum: [
        "heart_rate",
        "steps",
        "calories",
        "sleep",
        "blood_pressure",
        "glucose",
        "weight",
        "temperature",
        "SpO2",
        "activity",
        "location",
        "stress_level",
        "hydration",
      ],
    },
    value: mongoose.Schema.Types.Mixed, // Flexible for different data types
    unit: String,
    // Heart Rate Data
    heartRate: {
      bpm: Number,
      quality: {
        type: String,
        enum: ["good", "fair", "poor"],
      },
    },
    // Blood Pressure Data
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
      pulse: Number,
    },
    // Sleep Data
    sleep: {
      duration: Number, // in minutes
      quality: {
        type: String,
        enum: ["poor", "fair", "good", "excellent"],
      },
      deepSleep: Number,
      lightSleep: Number,
      remSleep: Number,
      awakenings: Number,
    },
    // Activity Data
    activity: {
      steps: Number,
      distance: Number, // in km
      calories: Number,
      duration: Number, // in minutes
      activityType: String,
      intensity: {
        type: String,
        enum: ["low", "medium", "high"],
      },
    },
    // Glucose Data
    glucose: {
      level: Number,
      mealType: {
        type: String,
        enum: ["fasting", "preprandial", "postprandial", "bedtime"],
      },
    },
    // Weight Data
    weight: {
      value: Number, // in kg
      bmi: Number,
    },
    // Temperature
    temperature: {
      value: Number, // in Celsius
    },
    // SpO2 (Oxygen Saturation)
    oxygenSaturation: {
      percentage: Number,
    },
    // Location Data
    location: {
      latitude: Number,
      longitude: Number,
      altitude: Number,
      accuracy: Number,
    },
    // Stress Level
    stressLevel: {
      level: {
        type: String,
        enum: ["relaxed", "normal", "stressed", "high_stress"],
      },
      score: {
        type: Number,
        min: 0,
        max: 100,
      },
    },
    // Hydration
    hydration: {
      waterIntake: Number, // in ml
    },
    // Flag for anomalies
    isAnomalous: {
      type: Boolean,
      default: false,
    },
    anomalyReason: String,
    // Associated compliance log
    associatedComplianceLog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ComplianceLog",
    },
    // Data quality flags
    isVerified: {
      type: Boolean,
      default: false,
    },
    syncStatus: {
      type: String,
      enum: ["pending", "synced", "failed"],
      default: "synced",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient querying
deviceDataSchema.index({ patientId: 1, dataTimestamp: -1 });
deviceDataSchema.index({ deviceId: 1, dataTimestamp: -1 });
deviceDataSchema.index({ dataType: 1, dataTimestamp: -1 });
deviceDataSchema.index({ patientId: 1, dataType: 1, dataTimestamp: -1 });
deviceDataSchema.index({ isAnomalous: 1 });

// Compound index for time range queries
deviceDataSchema.index({ patientId: 1, dataTimestamp: 1 });

module.exports = mongoose.model("DeviceData", deviceDataSchema);
