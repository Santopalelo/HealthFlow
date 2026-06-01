const express = require("express");
const healthController = require("../controllers/healthController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validationMiddleware,
  schemas,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Protect all routes
router.use(authMiddleware.verifyToken);

// =============== MEDICATION ENDPOINTS ===============

/**
 * @route   POST /api/health-data/medications
 * @desc    Create medication
 * @access  Private
 * @body    {patientId, name, dosage, unit, medicationType, purpose, ...}
 */
router.post(
  "/medications",
  validationMiddleware.validateRequest(schemas.medicationSchema),
  healthController.createMedication,
);

/**
 * @route   GET /api/health-data/medications/patient/:patientId
 * @desc    Get patient medications
 * @access  Private
 * @query   {page, limit, isActive}
 */
router.get("/medications/patient/:patientId", healthController.getMedications);

/**
 * @route   GET /api/health-data/medications/:medicationId
 * @desc    Get single medication
 * @access  Private
 */
router.get("/medications/:medicationId", healthController.getMedication);

/**
 * @route   PUT /api/health-data/medications/:medicationId
 * @desc    Update medication
 * @access  Private
 * @body    {name, dosage, unit, purpose, ...}
 */
router.put("/medications/:medicationId", healthController.updateMedication);

/**
 * @route   DELETE /api/health-data/medications/:medicationId
 * @desc    Delete medication
 * @access  Private
 */
router.delete("/medications/:medicationId", healthController.deleteMedication);

// =============== DASHBOARD ENDPOINTS ===============

/**
 * @route   GET /api/health-data/patient/:patientId/dashboard
 * @desc    Get patient dashboard overview
 * @access  Private
 */
router.get(
  "/patient/:patientId/dashboard",
  healthController.getDashboardOverview,
);

/**
 * @route   GET /api/health-data/patient/:patientId/timeline
 * @desc    Get health timeline
 * @access  Private
 * @query   {days, limit}
 */
router.get("/patient/:patientId/timeline", healthController.getHealthTimeline);

/**
 * @route   GET /api/health-data/patient/:patientId/metrics
 * @desc    Get health metrics summary
 * @access  Private
 * @query   {days}
 */
router.get(
  "/patient/:patientId/metrics",
  healthController.getHealthMetricsSummary,
);

/**
 * @route   GET /api/health-data/patient/:patientId/interactions
 * @desc    Get medication interactions
 * @access  Private
 */
router.get(
  "/patient/:patientId/interactions",
  healthController.getMedicationInteractions,
);

/**
 * @route   GET /api/health-data/patient/:patientId/export
 * @desc    Export health data
 * @access  Private
 * @query   {format, startDate, endDate}
 */
router.get("/patient/:patientId/export", healthController.exportHealthData);

module.exports = router;
