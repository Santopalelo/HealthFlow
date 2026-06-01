const jwt = require("jsonwebtoken");
const { ROLES } = require("../config/constants");

const authMiddleware = {
  // Verify JWT Token
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
        code: "NO_TOKEN",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
        code: "INVALID_TOKEN",
      });
    }
  },

  // Check if user has required role
  checkRole:
    (...allowedRoles) =>
    (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
          code: "FORBIDDEN",
        });
      }
      next();
    },

  // Verify patient owns the data
  checkPatientOwnership: (req, res, next) => {
    const patientId = req.params.patientId || req.body.patientId;

    if (req.user.role === ROLES.PATIENT && req.user.id !== patientId) {
      return res.status(403).json({
        success: false,
        message: "Cannot access other patients data",
        code: "FORBIDDEN",
      });
    }

    next();
  },

  // Generate JWT Token
  generateToken: (user) => {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName || `${user.firstName} ${user.lastName}`,
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION || "7d",
    });
  },
};

module.exports = authMiddleware;
