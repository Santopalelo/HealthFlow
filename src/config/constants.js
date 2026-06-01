module.exports = {
  // User Roles
  ROLES: {
    ADMIN: "admin",
    PATIENT: "patient",
    CAREGIVER: "caregiver",
    DOCTOR: "doctor",
  },

  // Reminder Statuses
  REMINDER_STATUS: {
    PENDING: "pending",
    COMPLETED: "completed",
    MISSED: "missed",
    SNOOZED: "snoozed",
  },

  // Medication Types
  MEDICATION_TYPES: {
    TABLET: "tablet",
    CAPSULE: "capsule",
    LIQUID: "liquid",
    INJECTION: "injection",
    INHALER: "inhaler",
    OTHER: "other",
  },

  // Frequency Units
  FREQUENCY_UNITS: {
    DAILY: "daily",
    WEEKLY: "weekly",
    MONTHLY: "monthly",
    AS_NEEDED: "as_needed",
  },

  // Device Types
  DEVICE_TYPES: {
    SMARTWATCH: "smartwatch",
    FITNESS_BAND: "fitness_band",
    BLOOD_PRESSURE_MONITOR: "bp_monitor",
    GLUCOSE_METER: "glucose_meter",
    SCALE: "scale",
    SMARTPHONE: "smartphone",
  },

  // Symptom Severity Levels
  SYMPTOM_SEVERITY: {
    MILD: "mild",
    MODERATE: "moderate",
    SEVERE: "severe",
  },

  // Compliance Status
  COMPLIANCE_STATUS: {
    EXCELLENT: "excellent", // 90-100%
    GOOD: "good", // 70-89%
    FAIR: "fair", // 50-69%
    POOR: "poor", // <50%
  },

  // Error Messages
  ERROR_MESSAGES: {
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_NOT_FOUND: "User not found",
    EMAIL_EXISTS: "Email already registered",
    INVALID_TOKEN: "Invalid or expired token",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden access",
    VALIDATION_ERROR: "Validation error",
    DATABASE_ERROR: "Database error",
    DEVICE_SYNC_FAILED: "Failed to sync device data",
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    LOGIN_SUCCESS: "Login successful",
    REGISTRATION_SUCCESS: "Registration successful",
    PROFILE_UPDATED: "Profile updated successfully",
    REMINDER_CREATED: "Reminder created successfully",
    REMINDER_UPDATED: "Reminder updated successfully",
    REMINDER_DELETED: "Reminder deleted successfully",
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Pagination Defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // Time Constants (in milliseconds)
  TIME_CONSTANTS: {
    ONE_HOUR: 3600000,
    ONE_DAY: 86400000,
    ONE_WEEK: 604800000,
    ONE_MONTH: 2592000000,
  },

  // Data Retention (days)
  DATA_RETENTION: {
    COMPLIANCE_LOGS: 365,
    HEALTH_DATA: 365,
    DEVICE_LOGS: 90,
  },
};
