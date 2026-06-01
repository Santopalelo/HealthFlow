const Reminder = require("../models/Reminder");
const Medication = require("../models/Medication");
const responseUtil = require("../utils/responseUtil");
const validators = require("../utils/validators");
const { asyncHandler } = require("../middleware/errorHandler");
const { REMINDER_STATUS } = require("../config/constants");

const reminderController = {
  // Create Reminder
  createReminder: asyncHandler(async (req, res) => {
    const {
      patientId,
      medicationId,
      title,
      description,
      scheduledTime,
      frequency,
      daysOfWeek,
      startDate,
      endDate,
      quantity,
      unit,
      notificationMethod,
      enabledDevices,
    } = req.body;

    // Validate time format
    if (!validators.isValidTimeFormat(scheduledTime)) {
      return responseUtil.error(
        res,
        "Invalid time format. Use HH:MM",
        "INVALID_TIME_FORMAT",
        400,
      );
    }

    // Check medication exists
    const medication = await Medication.findById(medicationId);
    if (!medication) {
      return responseUtil.error(
        res,
        "Medication not found",
        "MEDICATION_NOT_FOUND",
        404,
      );
    }

    const reminder = new Reminder({
      patientId,
      medicationId,
      title,
      description,
      scheduledTime,
      frequency,
      daysOfWeek,
      startDate,
      endDate,
      quantity,
      unit,
      notificationMethod,
      enabledDevices,
    });

    await reminder.save();
    await reminder.populate("medicationId");

    responseUtil.success(res, reminder, "Reminder created successfully", 201);
  }),

  // Get All Reminders for Patient
  getReminders: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { page = 1, limit = 10, status, isActive } = req.query;

    const skip = (page - 1) * limit;
    const filter = { patientId };

    if (status) filter.status = status;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const reminders = await Reminder.find(filter)
      .populate("medicationId")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ startDate: -1 });

    const total = await Reminder.countDocuments(filter);

    responseUtil.list(
      res,
      reminders,
      total,
      parseInt(page),
      parseInt(limit),
      "Reminders retrieved successfully",
    );
  }),

  // Get Single Reminder
  getReminder: asyncHandler(async (req, res) => {
    const { reminderId } = req.params;

    const reminder =
      await Reminder.findById(reminderId).populate("medicationId");

    if (!reminder) {
      return responseUtil.error(
        res,
        "Reminder not found",
        "REMINDER_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, reminder, "Reminder retrieved successfully");
  }),

  // Update Reminder
  updateReminder: asyncHandler(async (req, res) => {
    const { reminderId } = req.params;
    const {
      title,
      description,
      scheduledTime,
      frequency,
      daysOfWeek,
      endDate,
      quantity,
      unit,
      notificationMethod,
      isActive,
    } = req.body;

    // Validate time format if provided
    if (scheduledTime && !validators.isValidTimeFormat(scheduledTime)) {
      return responseUtil.error(
        res,
        "Invalid time format. Use HH:MM",
        "INVALID_TIME_FORMAT",
        400,
      );
    }

    const reminder = await Reminder.findByIdAndUpdate(
      reminderId,
      {
        $set: {
          title,
          description,
          scheduledTime,
          frequency,
          daysOfWeek,
          endDate,
          quantity,
          unit,
          notificationMethod,
          isActive,
        },
      },
      { new: true, runValidators: true },
    ).populate("medicationId");

    if (!reminder) {
      return responseUtil.error(
        res,
        "Reminder not found",
        "REMINDER_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, reminder, "Reminder updated successfully");
  }),

  // Update Reminder Status
  updateReminderStatus: asyncHandler(async (req, res) => {
    const { reminderId } = req.params;
    const { status, completedAt, notes } = req.body;

    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
      return responseUtil.error(
        res,
        "Reminder not found",
        "REMINDER_NOT_FOUND",
        404,
      );
    }

    // Add to completion history
    reminder.completionHistory.push({
      date: new Date(),
      status,
      completedAt:
        completedAt ||
        (status === REMINDER_STATUS.COMPLETED ? new Date() : null),
      notes,
    });

    reminder.status = status;

    // Update stats
    if (status === REMINDER_STATUS.MISSED) {
      reminder.missedCount += 1;
    }

    // Calculate completion rate
    if (reminder.completionHistory.length > 0) {
      const completed = reminder.completionHistory.filter(
        (h) => h.status === REMINDER_STATUS.COMPLETED,
      ).length;
      reminder.completionRate = Math.round(
        (completed / reminder.completionHistory.length) * 100,
      );
    }

    await reminder.save();

    responseUtil.success(res, reminder, "Reminder status updated successfully");
  }),

  // Delete Reminder
  deleteReminder: asyncHandler(async (req, res) => {
    const { reminderId } = req.params;

    const reminder = await Reminder.findByIdAndDelete(reminderId);

    if (!reminder) {
      return responseUtil.error(
        res,
        "Reminder not found",
        "REMINDER_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, {}, "Reminder deleted successfully");
  }),

  // Get Pending Reminders for Patient
  getPendingReminders: asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    const reminders = await Reminder.find({
      patientId,
      isActive: true,
      status: REMINDER_STATUS.PENDING,
    })
      .populate("medicationId")
      .sort({ startDate: 1 });

    responseUtil.success(
      res,
      reminders,
      "Pending reminders retrieved successfully",
    );
  }),

  // Get Today's Reminders
  getTodayReminders: asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const reminders = await Reminder.find({
      patientId,
      isActive: true,
      startDate: { $gte: today, $lt: tomorrow },
    })
      .populate("medicationId")
      .sort({ scheduledTime: 1 });

    responseUtil.success(
      res,
      reminders,
      "Today reminders retrieved successfully",
    );
  }),

  // Snooze Reminder
  snoozeReminder: asyncHandler(async (req, res) => {
    const { reminderId } = req.params;
    const { snoozeMinutes = 15 } = req.body;

    const reminder = await Reminder.findById(reminderId);

    if (!reminder) {
      return responseUtil.error(
        res,
        "Reminder not found",
        "REMINDER_NOT_FOUND",
        404,
      );
    }

    reminder.status = REMINDER_STATUS.SNOOZED;
    reminder.snoozeCount += 1;
    reminder.lastSnoozedUntil = new Date(
      Date.now() + snoozeMinutes * 60 * 1000,
    );

    await reminder.save();

    responseUtil.success(
      res,
      reminder,
      `Reminder snoozed for ${snoozeMinutes} minutes`,
    );
  }),

  // Get Reminders by Medication
  getRemindersByMedication: asyncHandler(async (req, res) => {
    const { patientId, medicationId } = req.params;

    const reminders = await Reminder.find({
      patientId,
      medicationId,
    })
      .populate("medicationId")
      .sort({ startDate: -1 });

    responseUtil.success(res, reminders, "Reminders retrieved successfully");
  }),

  // Bulk Update Reminders Status
  bulkUpdateStatus: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { reminderIds, status } = req.body;

    if (!Array.isArray(reminderIds) || reminderIds.length === 0) {
      return responseUtil.error(
        res,
        "No reminders provided",
        "INVALID_INPUT",
        400,
      );
    }

    const result = await Reminder.updateMany(
      { _id: { $in: reminderIds }, patientId },
      { $set: { status } },
    );

    responseUtil.success(
      res,
      {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount,
      },
      "Reminders updated successfully",
    );
  }),
};

module.exports = reminderController;
