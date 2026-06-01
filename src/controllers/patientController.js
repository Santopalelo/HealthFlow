const Patient = require("../models/Patient");
const User = require("../models/User");
const responseUtil = require("../utils/responseUtil");
const { asyncHandler } = require("../middleware/errorHandler");

const patientController = {
  // Get Patient Profile
  getProfile: asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId)
      .populate("userId", "firstName lastName email phone")
      .populate("medications")
      .populate("caregiversAssigned", "firstName lastName email")
      .populate("linkedDevices");

    if (!patient) {
      return responseUtil.error(
        res,
        "Patient not found",
        "PATIENT_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(
      res,
      patient,
      "Patient profile retrieved successfully",
    );
  }),

  // Get Patient by User ID
  getPatientByUserId: asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const patient = await Patient.findOne({ userId })
      .populate("userId", "firstName lastName email phone")
      .populate("medications")
      .populate("caregiversAssigned", "firstName lastName email")
      .populate("linkedDevices");

    if (!patient) {
      return responseUtil.error(
        res,
        "Patient not found",
        "PATIENT_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(
      res,
      patient,
      "Patient profile retrieved successfully",
    );
  }),

  // Update Patient Profile
  updateProfile: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const {
      medicalHistory,
      emergencyContact,
      insuranceInfo,
      preferredHospital,
      preferredDoctor,
      bloodType,
      height,
      weight,
      healthGoals,
      notes,
      timezone,
      preferredNotificationMethod,
    } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $set: {
          medicalHistory,
          emergencyContact,
          insuranceInfo,
          preferredHospital,
          preferredDoctor,
          bloodType,
          height,
          weight,
          healthGoals,
          notes,
          timezone,
          preferredNotificationMethod,
        },
      },
      { new: true, runValidators: true },
    ).populate("userId", "firstName lastName email phone");

    if (!patient) {
      return responseUtil.error(
        res,
        "Patient not found",
        "PATIENT_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, patient, "Patient profile updated successfully");
  }),

  // Add Caregiver to Patient
  addCaregliver: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { caregiverId } = req.body;

    // Check if caregiver exists
    const caregiver = await User.findById(caregiverId);
    if (!caregiver) {
      return responseUtil.error(
        res,
        "Caregiver not found",
        "CAREGIVER_NOT_FOUND",
        404,
      );
    }

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $addToSet: { caregiversAssigned: caregiverId } },
      { new: true },
    ).populate("caregiversAssigned", "firstName lastName email");

    if (!patient) {
      return responseUtil.error(
        res,
        "Patient not found",
        "PATIENT_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, patient, "Caregiver added successfully");
  }),

  // Remove Caregiver from Patient
  removeCaregliver: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { caregiverId } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $pull: { caregiversAssigned: caregiverId } },
      { new: true },
    ).populate("caregiversAssigned", "firstName lastName email");

    if (!patient) {
      return responseUtil.error(
        res,
        "Patient not found",
        "PATIENT_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, patient, "Caregiver removed successfully");
  }),

  // Link Device to Patient
  linkDevice: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { deviceId } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $addToSet: { linkedDevices: deviceId } },
      { new: true },
    ).populate("linkedDevices");

    if (!patient) {
      return responseUtil.error(
        res,
        "Patient not found",
        "PATIENT_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, patient, "Device linked successfully");
  }),

  // Unlink Device from Patient
  unlinkDevice: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { deviceId } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      { $pull: { linkedDevices: deviceId } },
      { new: true },
    ).populate("linkedDevices");

    if (!patient) {
      return responseUtil.error(
        res,
        "Patient not found",
        "PATIENT_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, patient, "Device unlinked successfully");
  }),

  // Update Consent
  updateConsent: asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    const { dataUsage, privacyPolicy, thirdPartySharing } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      patientId,
      {
        $set: {
          "consentGiven.dataUsage": dataUsage,
          "consentGiven.privacyPolicy": privacyPolicy,
          "consentGiven.thirdPartySharing": thirdPartySharing,
        },
      },
      { new: true },
    );

    if (!patient) {
      return responseUtil.error(
        res,
        "Patient not found",
        "PATIENT_NOT_FOUND",
        404,
      );
    }

    responseUtil.success(res, patient, "Consent updated successfully");
  }),

  // Get Patient Health Summary
  getHealthSummary: asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId)
      .populate("medications")
      .populate("linkedDevices");

    if (!patient) {
      return responseUtil.error(
        res,
        "Patient not found",
        "PATIENT_NOT_FOUND",
        404,
      );
    }

    const summary = {
      patientId: patient._id,
      fullName: patient.userId.firstName || "",
      bloodType: patient.bloodType,
      medicalHistory: patient.medicalHistory,
      allergies: patient.medicalHistory.allergies,
      chronicConditions: patient.medicalHistory.chronicConditions,
      activemedications: patient.medications ? patient.medications.length : 0,
      linkedDevices: patient.linkedDevices ? patient.linkedDevices.length : 0,
      emergencyContact: patient.emergencyContact,
    };

    responseUtil.success(res, summary, "Health summary retrieved successfully");
  }),
};

module.exports = patientController;
