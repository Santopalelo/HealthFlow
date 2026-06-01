const ComplianceLog = require("../models/ComplianceLog");
const Medication = require("../models/Medication");
const Reminder = require("../models/Reminder");
const responseUtil = require("../utils/responseUtil");
const validators = require("../utils/validators");
const { asyncHandler } = require("../middleware/errorHandler");

const complianceController = {
  // Create Compliance Log
  createComplianceLog: asyncHandler(async (req, res) => {
    const {
      patientId,
      medicationId,
      reminderId,
      medicationTaken,
      quantityTaken,
      reasonIfMissed,
      symptoms,
      sideEffectsObserved,
      moodLevel,
      energyLevel,
      painLevel,
      waterIntake,
      foodIntake,
      exerciseMinutes,
      sleepHours,
      notes,
    } = req.body;

    const complianceLog = new ComplianceLog({
      patientId,
      medicationId,
      reminderId,
      medicationTaken,
      quantityTaken,
      reasonIfMissed,
      symptoms,
      sideEffectsObserved,
      moodLevel,
      energyLevel,
      painLevel,
      waterIntake,
      foodIntake,
      exerciseMinutes,
      sleepHours,
      notes,
      logDate: new Date(),
    });

    await complianceLog.save();

    // Update reminder status if linked
    if (reminderId) {
      await Reminder.findByIdAndUpdate(reminderId, {
        $set: { status: medicationTaken ? "completed" : "missed" },
      });
    }

    responseUtil.success(
      res,
      complianceLog,
      "Compliance log created successfully",
      201,
    );
  }),

  // Get Compliance Logs for Patient
  getComplianceLogs: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      medicationId,
    } = req.query;

    const skip = (page - 1) * limit;
    const filter = { patientId };

    // Date range filter
    if (startDate || endDate) {
      filter.logDate = {};
      if (startDate) filter.logDate.$gte = new Date(startDate);
      if (endDate) filter.logDate.$lte = new Date(endDate);
    }

    if (medicationId) filter.medicationId = medicationId;

    const logs = await ComplianceLog.find(filter)
      .populate("medicationId")
      .populate("reminderId")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ logDate: -1 });

    const total = await ComplianceLog.countDocuments(filter);

    responseUtil.list(
      res,
      logs,
      total,
      parseInt(page),
      parseInt(limit),
      "Compliance logs retrieved successfully",
    );
  }),

  // Get Single Compliance Log
  getComplianceLog: asyncHandler(async (req, res) => {
    const { logId } = req.params;

    const log = await ComplianceLog.findById(logId)
      .populate("medicationId")
      .populate("reminderId");

    if (!log) {
      return responseUtil.error(
        res,
        "Compliance log not found",
        "LOG_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, log, "Compliance log retrieved successfully");
  }),

  // Update Compliance Log
  updateComplianceLog: asyncHandler(async (req, res) => {
    const { logId } = req.params;
    const updates = req.body;

    const log = await ComplianceLog.findByIdAndUpdate(
      logId,
      { $set: updates },
      { new: true, runValidators: true },
    )
      .populate("medicationId")
      .populate("reminderId");

    if (!log) {
      return responseUtil.error(
        res,
        "Compliance log not found",
        "LOG_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, log, "Compliance log updated successfully");
  }),

  // Delete Compliance Log
  deleteComplianceLog: asyncHandler(async (req, res) => {
    const { logId } = req.params;

    const log = await ComplianceLog.findByIdAndDelete(logId);

    if (!log) {
      return responseUtil.error(
        res,
        "Compliance log not found",
        "LOG_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, {}, "Compliance log deleted successfully");
  }),

  // Get Compliance Rate for Patient
  getComplianceRate: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { startDate, endDate } = req.query;

    const filter = { patientId };

    if (startDate || endDate) {
      filter.logDate = {};
      if (startDate) filter.logDate.$gte = new Date(startDate);
      if (endDate) filter.logDate.$lte = new Date(endDate);
    }

    const logs = await ComplianceLog.find(filter);

    if (logs.length === 0) {
      return responseUtil.success(
        res,
        {
          complianceRate: 0,
          totalLogs: 0,
          medicationsTaken: 0,
          medicationsMissed: 0,
        },
        "Compliance rate retrieved successfully",
      );
    }

    const medicationsTaken = logs.filter((log) => log.medicationTaken).length;
    const medicationsMissed = logs.length - medicationsTaken;
    const complianceRate = Math.round((medicationsTaken / logs.length) * 100);

    responseUtil.success(
      res,
      {
        complianceRate,
        totalLogs: logs.length,
        medicationsTaken,
        medicationsMissed,
        averageMoodLevel:
          logs.reduce((sum, log) => sum + (log.moodLevel || 0), 0) /
          logs.length,
        averageEnergyLevel:
          logs.reduce((sum, log) => sum + (log.energyLevel || 0), 0) /
          logs.length,
      },
      "Compliance rate retrieved successfully",
    );
  }),

  // Get Compliance by Medication
  getComplianceByMedication: asyncHandler(async (req, res) => {
    const { patientId, medicationId } = req.params;

    const logs = await ComplianceLog.find({
      patientId,
      medicationId,
    })
      .populate("medicationId")
      .sort({ logDate: -1 });

    if (logs.length === 0) {
      return responseUtil.success(
        res,
        {
          medication: medicationId,
          complianceRate: 0,
          totalLogs: 0,
        },
        "Compliance logs retrieved successfully",
      );
    }

    const medicationsTaken = logs.filter((log) => log.medicationTaken).length;
    const complianceRate = Math.round((medicationsTaken / logs.length) * 100);

    responseUtil.success(
      res,
      {
        medication: logs[0].medicationId,
        complianceRate,
        totalLogs: logs.length,
        medicationsTaken,
        medicationsMissed: logs.length - medicationsTaken,
        logs,
      },
      "Compliance logs retrieved successfully",
    );
  }),

  // Get Health Trends
  getHealthTrends: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const logs = await ComplianceLog.find({
      patientId,
      logDate: { $gte: startDate },
    }).sort({ logDate: 1 });

    const trends = {
      moodTrend: logs.map((log) => ({
        date: log.logDate,
        value: log.moodLevel,
      })),
      energyTrend: logs.map((log) => ({
        date: log.logDate,
        value: log.energyLevel,
      })),
      painTrend: logs.map((log) => ({
        date: log.logDate,
        value: log.painLevel,
      })),
      sleepTrend: logs.map((log) => ({
        date: log.logDate,
        value: log.sleepHours,
      })),
      waterIntakeTrend: logs.map((log) => ({
        date: log.logDate,
        value: log.waterIntake,
      })),
      exerciseTrend: logs.map((log) => ({
        date: log.logDate,
        value: log.exerciseMinutes,
      })),
    };

    responseUtil.success(res, trends, "Health trends retrieved successfully");
  }),

  // Get Missed Medications Report
  getMissedMedicationsReport: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const missedLogs = await ComplianceLog.find({
      patientId,
      medicationTaken: false,
      logDate: { $gte: startDate },
    })
      .populate("medicationId")
      .sort({ logDate: -1 });

    const reasonCounts = {};
    missedLogs.forEach((log) => {
      const reason = log.reasonIfMissed || "not_specified";
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });

    responseUtil.success(
      res,
      {
        totalMissed: missedLogs.length,
        missedLogs,
        reasonBreakdown: reasonCounts,
      },
      "Missed medications report retrieved successfully",
    );
  }),

  // Get Side Effects Report
  getSideEffectsReport: asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    const logsWithSideEffects = await ComplianceLog.find({
      patientId,
      sideEffectsObserved: { $exists: true, $ne: [] },
    })
      .populate("medicationId")
      .sort({ logDate: -1 });

    const sideEffectCounts = {};
    logsWithSideEffects.forEach((log) => {
      log.sideEffectsObserved.forEach((effect) => {
        sideEffectCounts[effect] = (sideEffectCounts[effect] || 0) + 1;
      });
    });

    responseUtil.success(
      res,
      {
        totalLogsWithSideEffects: logsWithSideEffects.length,
        sideEffectsBreakdown: sideEffectCounts,
        recentLogs: logsWithSideEffects.slice(0, 10),
      },
      "Side effects report retrieved successfully",
    );
  }),
};

module.exports = complianceController;
