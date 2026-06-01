const errorHandler = {
  // Global Error Handler
  errorHandler: (err, req, res, next) => {
    console.error("Error:", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        code: "VALIDATION_ERROR",
        details: messages,
      });
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        code: "DUPLICATE_ENTRY",
        field,
      });
    }

    // JWT Errors
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    // MongoDB Cast Error
    if (err.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
        code: "INVALID_ID_FORMAT",
      });
    }

    // Default Error Response
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal server error",
      code: err.code || "INTERNAL_SERVER_ERROR",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  },

  // 404 Not Found Handler
  notFoundHandler: (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      code: "NOT_FOUND",
    });
  },

  // Async Error Wrapper
  asyncHandler: (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  },

  // Custom Error Class
  AppError: class AppError extends Error {
    constructor(message, statusCode, code) {
      super(message);
      this.statusCode = statusCode;
      this.code = code;
      Error.captureStackTrace(this, this.constructor);
    }
  },
};

module.exports = errorHandler;
