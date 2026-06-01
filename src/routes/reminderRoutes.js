const express = require("express");
const reminderController = require("../controllers/reminderController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validationMiddleware,
  schemas,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Protect all routes
router.use(authMiddleware.verifyToken);

/**
 * @route   POST /api/reminders
 * @desc    Create a new reminder
 * @access  Private
 * @body    {patientId, medicationId, title, scheduledTime, frequency, ...}
 */
router.post(
  "/",
  validationMiddleware.validateRequest(schemas.reminderSchema),
  reminderController.createReminder,
);

/**
 * @route   GET /api/reminders/patient/:patientId
 * @desc    Get all reminders for a patient
 * @access  Private
 * @query   {page, limit, status, isActive}
 */
router.get("/patient/:patientId", reminderController.getReminders);

/**
 * @route   GET /api/reminders/:reminderId
 * @desc    Get single reminder
 * @access  Private
 */
router.get("/:reminderId", reminderController.getReminder);

/**
 * @route   PUT /api/reminders/:reminderId
 * @desc    Update reminder
 * @access  Private
 * @body    {title, description, scheduledTime, frequency, ...}
 */
router.put("/:reminderId", reminderController.updateReminder);

/**
 * @route   PATCH /api/reminders/:reminderId/status
 * @desc    Update reminder status
 * @access  Private
 * @body    {status, completedAt, notes}
 */
router.patch("/:reminderId/status", reminderController.updateReminderStatus);

/**
 * @route   DELETE /api/reminders/:reminderId
 * @desc    Delete reminder
 * @access  Private
 */
router.delete("/:reminderId", reminderController.deleteReminder);

/**
 * @route   GET /api/reminders/patient/:patientId/pending
 * @desc    Get pending reminders for patient
 * @access  Private
 */
router.get(
  "/patient/:patientId/pending",
  reminderController.getPendingReminders,
);

/**
 * @route   GET /api/reminders/patient/:patientId/today
 * @desc    Get today's reminders for patient
 * @access  Private
 */
router.get("/patient/:patientId/today", reminderController.getTodayReminders);

/**
 * @route   POST /api/reminders/:reminderId/snooze
 * @desc    Snooze reminder
 * @access  Private
 * @body    {snoozeMinutes}
 */
router.post("/:reminderId/snooze", reminderController.snoozeReminder);

/**
 * @route   GET /api/reminders/patient/:patientId/medication/:medicationId
 * @desc    Get reminders by medication
 * @access  Private
 */
router.get(
  "/patient/:patientId/medication/:medicationId",
  reminderController.getRemindersByMedication,
);

/**
 * @route   PATCH /api/reminders/bulk-update
 * @desc    Bulk update reminders status
 * @access  Private
 * @body    {patientId, reminderIds, status}
 */
router.patch("/bulk/update-status", reminderController.bulkUpdateStatus);

module.exports = router;
