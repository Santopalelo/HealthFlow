const express = require("express");
const patientController = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all routes
router.use(authMiddleware.verifyToken);

/**
 * @route   GET /api/patients/:patientId
 * @desc    Get patient profile
 * @access  Private
 */
router.get("/:patientId", patientController.getProfile);

/**
 * @route   GET /api/patients/user/:userId
 * @desc    Get patient profile by user ID
 * @access  Private
 */
router.get("/user/:userId", patientController.getPatientByUserId);

/**
 * @route   PUT /api/patients/:patientId
 * @desc    Update patient profile
 * @access  Private
 * @body    {medicalHistory, emergencyContact, insuranceInfo, ...}
 */
router.put("/:patientId", patientController.updateProfile);

/**
 * @route   POST /api/patients/:patientId/caregivers
 * @desc    Add caregiver to patient
 * @access  Private
 * @body    {caregiverId}
 */
router.post("/:patientId/caregivers", patientController.addCaregliver);

/**
 * @route   DELETE /api/patients/:patientId/caregivers
 * @desc    Remove caregiver from patient
 * @access  Private
 * @body    {caregiverId}
 */
router.delete("/:patientId/caregivers", patientController.removeCaregliver);

/**
 * @route   POST /api/patients/:patientId/devices
 * @desc    Link device to patient
 * @access  Private
 * @body    {deviceId}
 */
router.post("/:patientId/devices", patientController.linkDevice);

/**
 * @route   DELETE /api/patients/:patientId/devices
 * @desc    Unlink device from patient
 * @access  Private
 * @body    {deviceId}
 */
router.delete("/:patientId/devices", patientController.unlinkDevice);

/**
 * @route   PUT /api/patients/:patientId/consent
 * @desc    Update patient consent
 * @access  Private
 * @body    {dataUsage, privacyPolicy, thirdPartySharing}
 */
router.put("/:patientId/consent", patientController.updateConsent);

/**
 * @route   GET /api/patients/:patientId/health-summary
 * @desc    Get patient health summary
 * @access  Private
 */
router.get("/:patientId/health-summary", patientController.getHealthSummary);

module.exports = router;
