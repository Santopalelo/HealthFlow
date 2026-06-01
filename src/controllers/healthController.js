const Medication = require("../models/Medication");
const Reminder = require("../models/Reminder");
const ComplianceLog = require("../models/ComplianceLog");
const DeviceData = require("../models/DeviceData");
const responseUtil = require("../utils/responseUtil");
const { asyncHandler } = require("../middleware/errorHandler");

const healthController = {
  // Create Medication
  createMedication: asyncHandler(async (req, res) => {
    const {
      patientId,
      name,
      genericName,
      dosage,
      unit,
      medicationType,
      purpose,
      prescribedDate,
      expirationDate,
      prescribedBy,
      refillsRemaining,
      prescriptionNumber,
      sideEffects,
      interactions,
      notes,
    } = req.body;

    const medication = new Medication({
      patientId,
      name,
      genericName,
      dosage,
      unit,
      medicationType,
      purpose,
      prescribedDate,
      expirationDate,
      prescribedBy,
      refillsRemaining,
      prescriptionNumber,
      sideEffects,
      interactions,
      notes,
    });

    await medication.save();

    responseUtil.success(
      res,
      medication,
      "Medication created successfully",
      201,
    );
  }),

  // Get Patient Medications
  getMedications: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { page = 1, limit = 10, isActive } = req.query;

    const skip = (page - 1) * limit;
    const filter = { patientId };

    if (isActive !== undefined) filter.isActive = isActive === "true";

    const medications = await Medication.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ prescribedDate: -1 });

    const total = await Medication.countDocuments(filter);

    responseUtil.list(
      res,
      medications,
      total,
      parseInt(page),
      parseInt(limit),
      "Medications retrieved successfully",
    );
  }),

  // Get Single Medication
  getMedication: asyncHandler(async (req, res) => {
    const { medicationId } = req.params;

    const medication = await Medication.findById(medicationId);

    if (!medication) {
      return responseUtil.error(
        res,
        "Medication not found",
        "MEDICATION_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, medication, "Medication retrieved successfully");
  }),

  // Update Medication
  updateMedication: asyncHandler(async (req, res) => {
    const { medicationId } = req.params;
    const updates = req.body;

    const medication = await Medication.findByIdAndUpdate(
      medicationId,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!medication) {
      return responseUtil.error(
        res,
        "Medication not found",
        "MEDICATION_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, medication, "Medication updated successfully");
  }),

  // Delete Medication
  deleteMedication: asyncHandler(async (req, res) => {
    const { medicationId } = req.params;

    const medication = await Medication.findByIdAndDelete(medicationId);

    if (!medication) {
      return responseUtil.error(
        res,
        "Medication not found",
        "MEDICATION_NOT_FOUND",
        404,
      );
    }

    // Delete associated reminders
    await Reminder.deleteMany({ medicationId });

    responseUtil.success(res, {}, "Medication deleted successfully");
  }),

  // Get Dashboard Overview
  getDashboardOverview: asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    // Get counts
    const activeMedications = await Medication.countDocuments({
      patientId,
      isActive: true,
    });

    const activeReminders = await Reminder.countDocuments({
      patientId,
      isActive: true,
    });

    const todayLogs = await ComplianceLog.countDocuments({
      patientId,
      logDate: {
        $gte: new Date().setHours(0, 0, 0, 0),
        $lte: new Date().setHours(23, 59, 59, 999),
      },
    });

    // Get compliance rate for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentLogs = await ComplianceLog.find({
      patientId,
      logDate: { $gte: sevenDaysAgo },
    });

    const medicationsTaken = recentLogs.filter(
      (log) => log.medicationTaken,
    ).length;
    const complianceRate =
      recentLogs.length > 0
        ? Math.round((medicationsTaken / recentLogs.length) * 100)
        : 0;

    // Get latest device data
    const latestDeviceData = await DeviceData.findOne({ patientId }).sort({
      dataTimestamp: -1,
    });

    const overview = {
      activeMedications,
      activeReminders,
      todayLogsCount: todayLogs,
      complianceRate,
      complianceDays: 7,
      latestHealthData: latestDeviceData || null,
    };

    responseUtil.success(
      res,
      overview,
      "Dashboard overview retrieved successfully",
    );
  }),

  // Get Health Timeline
  getHealthTimeline: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { days = 30, limit = 50 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const timeline = await ComplianceLog.find({
      patientId,
      logDate: { $gte: startDate },
    })
      .sort({ logDate: -1 })
      .limit(parseInt(limit));

    responseUtil.success(
      res,
      timeline,
      "Health timeline retrieved successfully",
    );
  }),

  // Get Health Metrics Summary
  getHealthMetricsSummary: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const metrics = {
      heartRate: await DeviceData.find({
        patientId,
        dataType: "heart_rate",
        dataTimestamp: { $gte: startDate },
      })
        .sort({ dataTimestamp: -1 })
        .limit(100),

      bloodPressure: await DeviceData.find({
        patientId,
        dataType: "blood_pressure",
        dataTimestamp: { $gte: startDate },
      })
        .sort({ dataTimestamp: -1 })
        .limit(100),

      steps: await DeviceData.find({
        patientId,
        dataType: "steps",
        dataTimestamp: { $gte: startDate },
      })
        .sort({ dataTimestamp: -1 })
        .limit(100),

      sleep: await DeviceData.find({
        patientId,
        dataType: "sleep",
        dataTimestamp: { $gte: startDate },
      })
        .sort({ dataTimestamp: -1 })
        .limit(100),

      glucose: await DeviceData.find({
        patientId,
        dataType: "glucose",
        dataTimestamp: { $gte: startDate },
      })
        .sort({ dataTimestamp: -1 })
        .limit(100),
    };

    responseUtil.success(
      res,
      metrics,
      "Health metrics summary retrieved successfully",
    );
  }),

  // Get Medication Interactions
  getMedicationInteractions: asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    const medications = await Medication.find({
      patientId,
      isActive: true,
    });

    const interactions = [];

    // Check for interactions between medications
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const med1 = medications[i];
        const med2 = medications[j];

        if (med1.interactions && med1.interactions.includes(med2.name)) {
          interactions.push({
            medications: [med1.name, med2.name],
            severity: "moderate",
            recommendation: "Consult with healthcare provider",
          });
        }
      }
    }

    responseUtil.success(
      res,
      {
        medicationCount: medications.length,
        interactions,
        medications: medications.map((m) => ({
          id: m._id,
          name: m.name,
          dosage: m.dosage,
        })),
      },
      "Medication interactions retrieved successfully",
    );
  }),

  // Export Health Data
  exportHealthData: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { format = "json", startDate, endDate } = req.query;

    const filter = { patientId };

    if (startDate || endDate) {
      filter.logDate = {};
      if (startDate) filter.logDate.$gte = new Date(startDate);
      if (endDate) filter.logDate.$lte = new Date(endDate);
    }

    const logs = await ComplianceLog.find(filter)
      .populate("medicationId")
      .sort({ logDate: -1 });

    if (format === "csv") {
      // TODO: Implement CSV export
      responseUtil.success(
        res,
        {
          message: "CSV export not yet implemented",
          format: "json",
        },
        "Health data export prepared (JSON format)",
      );
    } else {
      responseUtil.success(
        res,
        {
          exportedAt: new Date(),
          dataCount: logs.length,
          data: logs,
        },
        "Health data exported successfully",
      );
    }
  }),
};

module.exports = healthController;
