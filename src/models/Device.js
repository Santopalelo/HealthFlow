const mongoose = require("mongoose");
const { DEVICE_TYPES } = require("../config/constants");

const deviceSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    deviceName: {
      type: String,
      required: [true, "Device name is required"],
    },
    deviceType: {
      type: String,
      enum: Object.values(DEVICE_TYPES),
      required: [true, "Device type is required"],
    },
    manufacturer: String,
    model: String,
    serialNumber: String,
    firmwareVersion: String,
    hardwareVersion: String,
    bluetoothAddress: String,
    imei: String,
    apiKey: {
      type: String,
      select: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "disconnected", "error"],
      default: "active",
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
    connectionType: {
      type: String,
      enum: ["bluetooth", "wifi", "cellular", "usb"],
    },
    lastConnectedAt: Date,
    lastSyncAt: Date,
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
    },
    batteryStatus: {
      type: String,
      enum: ["charging", "charged", "discharging"],
    },
    operatingSystem: String,
    appVersion: String,
    supportedDataTypes: [
      {
        type: String,
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
    ],
    syncInterval: {
      type: Number,
      default: 300000, // 5 minutes in milliseconds
    },
    dataRetentionDays: {
      type: Number,
      default: 90,
    },
    notificationSettings: {
      syncReminderEnabled: {
        type: Boolean,
        default: true,
      },
      medicationReminderEnabled: {
        type: Boolean,
        default: true,
      },
      anomalyAlertEnabled: {
        type: Boolean,
        default: true,
      },
      vibrationType: {
        type: String,
        enum: ["none", "light", "medium", "strong"],
        default: "medium",
      },
    },
    locationTracking: {
      enabled: {
        type: Boolean,
        default: false,
      },
      privacyMode: {
        type: Boolean,
        default: false,
      },
    },
    healthDataPermissions: {
      canReadHeartRate: {
        type: Boolean,
        default: true,
      },
      canReadSteps: {
        type: Boolean,
        default: true,
      },
      canReadSleep: {
        type: Boolean,
        default: true,
      },
      canReadBloodPressure: {
        type: Boolean,
        default: true,
      },
      canReadGlucose: {
        type: Boolean,
        default: false,
      },
    },
    errorLogs: [
      {
        timestamp: Date,
        error: String,
        severity: {
          type: String,
          enum: ["info", "warning", "error", "critical"],
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    notes: String,
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient querying
deviceSchema.index({ patientId: 1, isActive: 1 });
deviceSchema.index({ deviceType: 1 });
deviceSchema.index({ isConnected: 1 });
deviceSchema.index({ bluetoothAddress: 1 });

module.exports = mongoose.model("Device", deviceSchema);
