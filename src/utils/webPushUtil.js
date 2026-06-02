const webPush = require("web-push");

const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.VALID_PUBLIC_KEY;
const privateKey =
  process.env.VAPID_PRIVATE_KEY || process.env.VALID_PRIVATE_KEY;
const contactEmail =
  process.env.VAPID_CONTACT_EMAIL || "mailto:no-reply@example.com";

let webPushConfigured = false;

const initializeWebPush = () => {
  if (webPushConfigured) return;

  if (!publicKey || !privateKey) {
    console.warn(
      "Web push notifications are disabled: VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY is not configured.",
    );
    return;
  }

  try {
    webPush.setVapidDetails(contactEmail, publicKey, privateKey);
    webPushConfigured = true;
  } catch (error) {
    console.error(
      "Failed to initialize web push VAPID details:",
      error.message,
    );
  }
};

const sendPushNotification = async (subscription, payload) => {
  initializeWebPush();

  if (!webPushConfigured) {
    console.warn(
      "Cannot send push notification because web push is not configured.",
    );
    return;
  }

  await webPush.sendNotification(subscription, JSON.stringify(payload));
};

module.exports = {
  sendPushNotification,
};
