const Device = require("../models/Device");
const DeviceData = require("../models/DeviceData");
const responseUtil = require("../utils/responseUtil");
const { asyncHandler } = require("../middleware/errorHandler");

const deviceController = {
  // Register Device
  registerDevice: asyncHandler(async (req, res) => {
    const {
      patientId,
      deviceName,
      deviceType,
      manufacturer,
      model,
      serialNumber,
      bluetoothAddress,
      imei,
      connectionType,
      supportedDataTypes,
    } = req.body;

    const device = new Device({
      patientId,
      deviceName,
      deviceType,
      manufacturer,
      model,
      serialNumber,
      bluetoothAddress,
      imei,
      connectionType,
      supportedDataTypes,
    });

    await device.save();

    responseUtil.success(res, device, "Device registered successfully", 201);
  }),

  // Get Patient Devices
  getDevices: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { page = 1, limit = 10, isActive, isConnected } = req.query;

    const skip = (page - 1) * limit;
    const filter = { patientId };

    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (isConnected !== undefined) filter.isConnected = isConnected === "true";

    const devices = await Device.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Device.countDocuments(filter);

    responseUtil.list(
      res,
      devices,
      total,
      parseInt(page),
      parseInt(limit),
      "Devices retrieved successfully",
    );
  }),

  // Get Single Device
  getDevice: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;

    const device = await Device.findById(deviceId);

    if (!device) {
      return responseUtil.error(
        res,
        "Device not found",
        "DEVICE_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, device, "Device retrieved successfully");
  }),

  // Update Device
  updateDevice: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const updates = req.body;

    const device = await Device.findByIdAndUpdate(
      deviceId,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!device) {
      return responseUtil.error(
        res,
        "Device not found",
        "DEVICE_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, device, "Device updated successfully");
  }),

  // Delete Device
  deleteDevice: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;

    const device = await Device.findByIdAndDelete(deviceId);

    if (!device) {
      return responseUtil.error(
        res,
        "Device not found",
        "DEVICE_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, {}, "Device deleted successfully");
  }),

  // Connect Device
  connectDevice: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;

    const device = await Device.findByIdAndUpdate(
      deviceId,
      {
        $set: {
          isConnected: true,
          status: "active",
          lastConnectedAt: new Date(),
        },
      },
      { new: true },
    );

    if (!device) {
      return responseUtil.error(
        res,
        "Device not found",
        "DEVICE_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, device, "Device connected successfully");
  }),

  // Disconnect Device
  disconnectDevice: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;

    const device = await Device.findByIdAndUpdate(
      deviceId,
      {
        $set: {
          isConnected: false,
          status: "disconnected",
        },
      },
      { new: true },
    );

    if (!device) {
      return responseUtil.error(
        res,
        "Device not found",
        "DEVICE_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, device, "Device disconnected successfully");
  }),

  // Update Battery Status
  updateBatteryStatus: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { batteryLevel, batteryStatus } = req.body;

    const device = await Device.findByIdAndUpdate(
      deviceId,
      {
        $set: {
          batteryLevel,
          batteryStatus,
        },
      },
      { new: true },
    );

    if (!device) {
      return responseUtil.error(
        res,
        "Device not found",
        "DEVICE_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, device, "Battery status updated successfully");
  }),

  // Sync Device Data (Receive data from smartwatch)
  syncDeviceData: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { patientId, dataPoints } = req.body;

    // Verify device exists
    const device = await Device.findById(deviceId);
    if (!device) {
      return responseUtil.error(
        res,
        "Device not found",
        "DEVICE_NOT_FOUND",
        404,
      );
    }

    // Process each data point
    const savedDataPoints = [];

    if (Array.isArray(dataPoints) && dataPoints.length > 0) {
      for (const dataPoint of dataPoints) {
        const deviceData = new DeviceData({
          patientId,
          deviceId,
          dataTimestamp: dataPoint.timestamp || new Date(),
          dataType: dataPoint.type,
          value: dataPoint.value,
          unit: dataPoint.unit,
          // Handle different data types
          ...(dataPoint.type === "heart_rate" && { heartRate: dataPoint.data }),
          ...(dataPoint.type === "blood_pressure" && {
            bloodPressure: dataPoint.data,
          }),
          ...(dataPoint.type === "sleep" && { sleep: dataPoint.data }),
          ...(dataPoint.type === "activity" && { activity: dataPoint.data }),
          ...(dataPoint.type === "glucose" && { glucose: dataPoint.data }),
          ...(dataPoint.type === "weight" && { weight: dataPoint.data }),
          ...(dataPoint.type === "temperature" && {
            temperature: dataPoint.data,
          }),
          ...(dataPoint.type === "SpO2" && {
            oxygenSaturation: dataPoint.data,
          }),
          ...(dataPoint.type === "location" && { location: dataPoint.data }),
          ...(dataPoint.type === "stress_level" && {
            stressLevel: dataPoint.data,
          }),
          ...(dataPoint.type === "hydration" && { hydration: dataPoint.data }),
          syncStatus: "synced",
        });

        await deviceData.save();
        savedDataPoints.push(deviceData);
      }
    }

    // Update device sync timestamp
    await Device.findByIdAndUpdate(deviceId, {
      $set: {
        lastSyncAt: new Date(),
        isConnected: true,
        status: "active",
      },
    });

    responseUtil.success(
      res,
      {
        deviceId,
        syncedDataPoints: savedDataPoints.length,
        dataPoints: savedDataPoints,
      },
      "Device data synced successfully",
      201,
    );
  }),

  // Get Device Data
  getDeviceData: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { page = 1, limit = 10, dataType, startDate, endDate } = req.query;

    const skip = (page - 1) * limit;
    const filter = { deviceId };

    if (dataType) filter.dataType = dataType;

    if (startDate || endDate) {
      filter.dataTimestamp = {};
      if (startDate) filter.dataTimestamp.$gte = new Date(startDate);
      if (endDate) filter.dataTimestamp.$lte = new Date(endDate);
    }

    const data = await DeviceData.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ dataTimestamp: -1 });

    const total = await DeviceData.countDocuments(filter);

    responseUtil.list(
      res,
      data,
      total,
      parseInt(page),
      parseInt(limit),
      "Device data retrieved successfully",
    );
  }),

  // Get Latest Device Data by Type
  getLatestDeviceData: asyncHandler(async (req, res) => {
    const { deviceId, dataType } = req.params;

    const latestData = await DeviceData.findOne({
      deviceId,
      dataType,
    }).sort({ dataTimestamp: -1 });

    if (!latestData) {
      return responseUtil.error(res, "No data found", "DATA_NOT_FOUND", 404);
    }

    responseUtil.success(
      res,
      latestData,
      "Latest device data retrieved successfully",
    );
  }),

  // Get Device Health Summary
  getDeviceHealthSummary: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { days = 7 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const device = await Device.findById(deviceId);
    if (!device) {
      return responseUtil.error(
        res,
        "Device not found",
        "DEVICE_NOT_FOUND",
        404,
      );
    }

    // Get all data types available from device
    const dataTypes = device.supportedDataTypes;

    const summary = {
      device: device.deviceName,
      dataTypes: dataTypes,
      lastSync: device.lastSyncAt,
      isConnected: device.isConnected,
      batteryLevel: device.batteryLevel,
    };

    // Get latest values for each data type
    for (const type of dataTypes) {
      const latestData = await DeviceData.findOne({
        deviceId,
        dataType: type,
        dataTimestamp: { $gte: startDate },
      }).sort({ dataTimestamp: -1 });

      if (latestData) {
        summary[type] = latestData;
      }
    }

    responseUtil.success(
      res,
      summary,
      "Device health summary retrieved successfully",
    );
  }),

  // Update Device Notification Settings
  updateNotificationSettings: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { notificationSettings } = req.body;

    const device = await Device.findByIdAndUpdate(
      deviceId,
      { $set: { notificationSettings } },
      { new: true },
    );

    if (!device) {
      return responseUtil.error(
        res,
        "Device not found",
        "DEVICE_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(
      res,
      device,
      "Notification settings updated successfully",
    );
  }),

  // Update Health Data Permissions
  updateHealthDataPermissions: asyncHandler(async (req, res) => {
    const { deviceId } = req.params;
    const { healthDataPermissions } = req.body;

    const device = await Device.findByIdAndUpdate(
      deviceId,
      { $set: { healthDataPermissions } },
      { new: true },
    );

    if (!device) {
      return responseUtil.error(
        res,
        "Device not found",
        "DEVICE_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(
      res,
      device,
      "Health data permissions updated successfully",
    );
  }),
};

module.exports = deviceController;
