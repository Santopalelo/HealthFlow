const Joi = require("joi");

const validationMiddleware = {
  // Validate request body using Joi schema
  validateRequest: (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = {
        field: error.details[0].path.join("."),
        message: error.details[0].message,
      };

      return res.status(400).json({
        success: false,
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details,
      });
    }

    req.body = value;
    next();
  },

  // Validate query parameters
  validateQuery: (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details,
      });
    }

    req.query = value;
    next();
  },

  // Validate URL parameters
  validateParams: (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details,
      });
    }

    req.params = value;
    next();
  },
};

// Joi Schemas
const schemas = {
  // User Registration
  registerSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().optional(),
    dateOfBirth: Joi.date().optional(),
    gender: Joi.string().valid("male", "female", "other").optional(),
  }),

  // User Login
  loginSchema: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  // Create Medication
  medicationSchema: Joi.object({
    patientId: Joi.string().required(),
    name: Joi.string().required(),
    genericName: Joi.string().optional(),
    dosage: Joi.string().required(),
    unit: Joi.string()
      .valid("mg", "ml", "mcg", "g", "iu", "units", "other")
      .required(),
    medicationType: Joi.string().required(),
    purpose: Joi.string().required(),
    prescribedDate: Joi.date().required(),
    expirationDate: Joi.date().optional(),
    prescribedBy: Joi.string().optional(),
  }),

  // Create Reminder
  reminderSchema: Joi.object({
    patientId: Joi.string().required(),
    medicationId: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    scheduledTime: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required(),
    frequency: Joi.string()
      .valid("daily", "weekly", "monthly", "as_needed")
      .required(),
    daysOfWeek: Joi.array().items(Joi.number().min(1).max(7)).optional(),
    startDate: Joi.date().required(),
    endDate: Joi.date().optional(),
    quantity: Joi.number().optional(),
    notificationMethod: Joi.string()
      .valid("push", "email", "sms", "all")
      .optional(),
  }),

  // Update Reminder Status
  updateReminderStatusSchema: Joi.object({
    status: Joi.string()
      .valid("pending", "completed", "missed", "snoozed")
      .required(),
    completedAt: Joi.date().optional(),
    notes: Joi.string().optional(),
  }),

  // Create Compliance Log
  complianceLogSchema: Joi.object({
    patientId: Joi.string().required(),
    medicationId: Joi.string().optional(),
    reminderId: Joi.string().optional(),
    medicationTaken: Joi.boolean().required(),
    quantityTaken: Joi.number().optional(),
    reasonIfMissed: Joi.string().optional(),
    moodLevel: Joi.number().min(1).max(10).optional(),
    energyLevel: Joi.number().min(1).max(10).optional(),
    sleepHours: Joi.number().optional(),
    notes: Joi.string().optional(),
  }),

  // Create Device
  deviceSchema: Joi.object({
    patientId: Joi.string().required(),
    deviceName: Joi.string().required(),
    deviceType: Joi.string().required(),
    manufacturer: Joi.string().optional(),
    model: Joi.string().optional(),
    serialNumber: Joi.string().optional(),
    connectionType: Joi.string()
      .valid("bluetooth", "wifi", "cellular", "usb")
      .optional(),
  }),

  // Sync Device Data
  deviceDataSchema: Joi.object({
    patientId: Joi.string().required(),
    deviceId: Joi.string().required(),
    dataType: Joi.string().required(),
    dataTimestamp: Joi.date().required(),
    value: Joi.any().optional(),
  }),

  // Pagination Query
  paginationSchema: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    sort: Joi.string().optional(),
  }),

  // ID Validation
  idSchema: Joi.object({
    id: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

module.exports = {
  validationMiddleware,
  schemas,
};
