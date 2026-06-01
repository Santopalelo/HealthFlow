const express = require("express");
const complianceController = require("../controllers/complianceController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validationMiddleware,
  schemas,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Protect all routes
router.use(authMiddleware.verifyToken);

/**
 * @route   POST /api/compliance
 * @desc    Create compliance log
 * @access  Private
 * @body    {patientId, medicationId, reminderId, medicationTaken, ...}
 */
router.post(
  "/",
  validationMiddleware.validateRequest(schemas.complianceLogSchema),
  complianceController.createComplianceLog,
);

/**
 * @route   GET /api/compliance/patient/:patientId
 * @desc    Get compliance logs for patient
 * @access  Private
 * @query   {page, limit, startDate, endDate, medicationId}
 */
router.get("/patient/:patientId", complianceController.getComplianceLogs);

/**
 * @route   GET /api/compliance/:logId
 * @desc    Get single compliance log
 * @access  Private
 */
router.get("/:logId", complianceController.getComplianceLog);

/**
 * @route   PUT /api/compliance/:logId
 * @desc    Update compliance log
 * @access  Private
 * @body    {medicationTaken, notes, symptoms, ...}
 */
router.put("/:logId", complianceController.updateComplianceLog);

/**
 * @route   DELETE /api/compliance/:logId
 * @desc    Delete compliance log
 * @access  Private
 */
router.delete("/:logId", complianceController.deleteComplianceLog);

/**
 * @route   GET /api/compliance/patient/:patientId/rate
 * @desc    Get compliance rate for patient
 * @access  Private
 * @query   {startDate, endDate}
 */
router.get("/patient/:patientId/rate", complianceController.getComplianceRate);

/**
 * @route   GET /api/compliance/patient/:patientId/medication/:medicationId
 * @desc    Get compliance logs by medication
 * @access  Private
 */
router.get(
  "/patient/:patientId/medication/:medicationId",
  complianceController.getComplianceByMedication,
);

/**
 * @route   GET /api/compliance/patient/:patientId/trends
 * @desc    Get health trends
 * @access  Private
 * @query   {days}
 */
router.get("/patient/:patientId/trends", complianceController.getHealthTrends);

/**
 * @route   GET /api/compliance/patient/:patientId/missed
 * @desc    Get missed medications report
 * @access  Private
 * @query   {days}
 */
router.get(
  "/patient/:patientId/missed",
  complianceController.getMissedMedicationsReport,
);

/**
 * @route   GET /api/compliance/patient/:patientId/side-effects
 * @desc    Get side effects report
 * @access  Private
 */
router.get(
  "/patient/:patientId/side-effects",
  complianceController.getSideEffectsReport,
);

module.exports = router;
