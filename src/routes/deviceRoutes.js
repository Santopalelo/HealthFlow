const express = require("express");
const deviceController = require("../controllers/deviceController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validationMiddleware,
  schemas,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Protect all routes
router.use(authMiddleware.verifyToken);

/**
 * @route   POST /api/devices
 * @desc    Register a new device
 * @access  Private
 * @body    {patientId, deviceName, deviceType, manufacturer, model, ...}
 */
router.post(
  "/",
  validationMiddleware.validateRequest(schemas.deviceSchema),
  deviceController.registerDevice,
);

/**
 * @route   GET /api/devices/patient/:patientId
 * @desc    Get all devices for patient
 * @access  Private
 * @query   {page, limit, isActive, isConnected}
 */
router.get("/patient/:patientId", deviceController.getDevices);

/**
 * @route   GET /api/devices/:deviceId
 * @desc    Get single device
 * @access  Private
 */
router.get("/:deviceId", deviceController.getDevice);

/**
 * @route   PUT /api/devices/:deviceId
 * @desc    Update device information
 * @access  Private
 * @body    {deviceName, manufacturer, firmware, ...}
 */
router.put("/:deviceId", deviceController.updateDevice);

/**
 * @route   DELETE /api/devices/:deviceId
 * @desc    Delete device
 * @access  Private
 */
router.delete("/:deviceId", deviceController.deleteDevice);

/**
 * @route   POST /api/devices/:deviceId/connect
 * @desc    Connect device
 * @access  Private
 */
router.post("/:deviceId/connect", deviceController.connectDevice);

/**
 * @route   POST /api/devices/:deviceId/disconnect
 * @desc    Disconnect device
 * @access  Private
 */
router.post("/:deviceId/disconnect", deviceController.disconnectDevice);

/**
 * @route   PATCH /api/devices/:deviceId/battery
 * @desc    Update device battery status
 * @access  Private
 * @body    {batteryLevel, batteryStatus}
 */
router.patch("/:deviceId/battery", deviceController.updateBatteryStatus);

/**
 * @route   POST /api/devices/:deviceId/sync
 * @desc    Sync data from smartwatch/device
 * @access  Private
 * @body    {patientId, dataPoints: [{type, timestamp, value, data}, ...]}
 */
router.post("/:deviceId/sync", deviceController.syncDeviceData);

/**
 * @route   GET /api/devices/:deviceId/data
 * @desc    Get device health data
 * @access  Private
 * @query   {page, limit, dataType, startDate, endDate}
 */
router.get("/:deviceId/data", deviceController.getDeviceData);

/**
 * @route   GET /api/devices/:deviceId/data/:dataType/latest
 * @desc    Get latest device data by type
 * @access  Private
 */
router.get(
  "/:deviceId/data/:dataType/latest",
  deviceController.getLatestDeviceData,
);

/**
 * @route   GET /api/devices/:deviceId/health-summary
 * @desc    Get device health summary
 * @access  Private
 * @query   {days}
 */
router.get(
  "/:deviceId/health-summary",
  deviceController.getDeviceHealthSummary,
);

/**
 * @route   PATCH /api/devices/:deviceId/notifications
 * @desc    Update device notification settings
 * @access  Private
 * @body    {notificationSettings: {...}}
 */
router.patch(
  "/:deviceId/notifications",
  deviceController.updateNotificationSettings,
);

/**
 * @route   PATCH /api/devices/:deviceId/permissions
 * @desc    Update health data permissions
 * @access  Private
 * @body    {healthDataPermissions: {...}}
 */
router.patch(
  "/:deviceId/permissions",
  deviceController.updateHealthDataPermissions,
);

module.exports = router;
