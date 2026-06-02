const Reminder = require("../src/models/Reminder");
const PushSubscription = require("../src/models/PushSubscription");
const Patient = require("../src/models/Patient");
const { sendPushNotification } = require("../src/utils/webPushUtil");
const { sendEmail } = require("../src/utils/emailUtil");

const buildReminderPayload = (reminder) => ({
  title: reminder.title || "Medication Reminder",
  body: `Time to take ${reminder.medicationId?.name || "your medication"} at ${reminder.scheduledTime}.`,
  url: "/reminders",
});

const buildEmailBody = (reminder) => {
  const medicationName = reminder.medicationId?.name || "your medication";
  return {
    subject: `Reminder: ${reminder.title}`,
    text: `It's time to take ${medicationName} at ${reminder.scheduledTime}. Note: ${reminder.description || "No notes provided."}`,
    html: `<p>It's time to take <strong>${medicationName}</strong> at <strong>${reminder.scheduledTime}</strong>.</p>
           <p>${reminder.description || "No notes provided."}</p>`,
  };
};

const buildDueWindow = () => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  start.setMinutes(start.getMinutes() - 3);
  end.setMinutes(end.getMinutes() + 3);
  return { start, end };
};

const parseScheduledTime = (scheduledTime, baseDate) => {
  if (!scheduledTime) return null;
  const [hour, minute] = scheduledTime.split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return null;
  const date = new Date(baseDate);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const getDueReminders = async () => {
  const now = new Date();
  const startDate = new Date(now);
  startDate.setHours(0, 0, 0, 0);

  const tomorrow = new Date(startDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const rawReminders = await Reminder.find({
    isActive: true,
    notificationMethod: { $in: ["push", "email", "all"] },
    startDate: { $lte: tomorrow },
    $or: [{ endDate: null }, { endDate: { $gte: startDate } }],
  }).populate("medicationId");

  const { start: windowStart, end: windowEnd } = buildDueWindow();

  return rawReminders.filter((reminder) => {
    const scheduledAt = parseScheduledTime(reminder.scheduledTime, now);
    if (!scheduledAt) return false;

    if (scheduledAt < windowStart || scheduledAt > windowEnd) return false;
    if (
      reminder.lastNotificationSentAt &&
      now - new Date(reminder.lastNotificationSentAt) < 1000 * 60 * 5
    ) {
      return false;
    }

    return true;
  });
};

const notifyReminder = async (reminder) => {
  const patient = await Patient.findById(reminder.patientId);
  if (!patient) return;

  const payload = buildReminderPayload(reminder);

  if (["push", "all"].includes(reminder.notificationMethod)) {
    const subscriptions = await PushSubscription.find({
      patientId: reminder.patientId,
    });
    await Promise.all(
      subscriptions.map((sub) =>
        sendPushNotification(sub, {
          title: payload.title,
          body: payload.body,
          url: payload.url,
        }),
      ),
    );
  }

  if (["email", "all"].includes(reminder.notificationMethod) && patient.email) {
    const email = buildEmailBody(reminder);
    await sendEmail({
      to: patient.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
  }

  reminder.lastNotificationSentAt = new Date();
  await reminder.save();
};

const runReminderNotifications = async () => {
  try {
    const reminders = await getDueReminders();
    await Promise.all(reminders.map((reminder) => notifyReminder(reminder)));
  } catch (error) {
    console.error("Reminder notification scheduler error:", error);
  }
};

const startReminderNotificationScheduler = () => {
  runReminderNotifications();
  setInterval(runReminderNotifications, 60 * 1000);
};

module.exports = {
  startReminderNotificationScheduler,
};
