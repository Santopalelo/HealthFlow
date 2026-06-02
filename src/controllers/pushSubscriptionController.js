const PushSubscription = require("../models/pushSubscription");
const responseUtil = require("../utils/responseUtil");

const pushSubscriptionController = {
  createSubscription: async (req, res) => {
    const { patientId, subscription } = req.body;

    if (!patientId || !subscription?.endpoint) {
      return responseUtil.error(
        res,
        "patientId and subscription are required",
        "INVALID_INPUT",
        400,
      );
    }

    const savedSubscription = await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        patientId,
        expirationTime: subscription.expirationTime,
        keys: subscription.keys,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return responseUtil.success(
      res,
      savedSubscription,
      "Push subscription saved successfully",
      201,
    );
  },

  getSubscriptionsByPatient: async (req, res) => {
    const { patientId } = req.params;

    const subscriptions = await PushSubscription.find({ patientId });

    return responseUtil.success(
      res,
      subscriptions,
      "Push subscriptions retrieved successfully",
    );
  },
};

module.exports = pushSubscriptionController;
