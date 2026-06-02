const mongoose = require("mongoose");

const pushSubscriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },
    expirationTime: Date,
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("PushSubscription", pushSubscriptionSchema);