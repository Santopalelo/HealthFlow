const mongoose = require("mongoose");
const { REMINDER_STATUS, FREQUENCY_UNITS } = require("../config/constants");

const reminderSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Reminder title is required"],
    },
    description: String,
    scheduledTime: {
      type: String, // Format: HH:MM (24-hour format)
      required: [true, "Scheduled time is required"],
    },
    frequency: {
      type: String,
      enum: Object.values(FREQUENCY_UNITS),
      required: true,
    },
    daysOfWeek: {
      // For weekly reminders: [1,3,5] for Monday, Wednesday, Friday (1-7)
      type: [Number],
      default: [],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: Date,
    quantity: Number,
    unit: String,
    status: {
      type: String,
      enum: Object.values(REMINDER_STATUS),
      default: REMINDER_STATUS.PENDING,
    },
    notificationMethod: {
      type: String,
      enum: ["push", "email", "sms", "all"],
      default: "push",
    },
        lastNotificationSentAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    enabledDevices: [
      {
        deviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Device",
        },
        syncToDevice: {
          type: Boolean,
          default: true,
        },
      },
    ],
    completionHistory: [
      {
        date: Date,
        status: {
          type: String,
          enum: Object.values(REMINDER_STATUS),
        },
        completedAt: Date,
        notes: String,
      },
    ],
    snoozeCount: {
      type: Number,
      default: 0,
    },
    lastSnoozedUntil: Date,
    missedCount: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

// Calculate completion rate when reminder is updated
reminderSchema.pre("save", async function calculateCompletionRate() {
  if (this.completionHistory && this.completionHistory.length > 0) {
    const completed = this.completionHistory.filter(
      (h) => h.status === REMINDER_STATUS.COMPLETED,
    ).length;
    this.completionRate = Math.round(
      (completed / this.completionHistory.length) * 100,
    );
  }
});

// Indexes for efficient querying
reminderSchema.index({ patientId: 1, isActive: 1 });
reminderSchema.index({ medicationId: 1 });
reminderSchema.index({ status: 1 });
reminderSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model("Reminder", reminderSchema);
