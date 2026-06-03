require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const dbConfig = require("./config/database");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const complianceRoutes = require("./routes/complianceRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const healthRoutes = require("./routes/healthRoutes");
const logger = require("./middleware/logger");
const pushSubscriptionRoutes = require("./routes/pushSubscriptionRoutes");
const {
  startReminderNotificationScheduler,
} = require("../services/reminderNotificationService");

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

// Security Middleware
app.use(helmet());
app.use(cors());

// Body Parsing Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Logging Middleware
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
app.use(logger);

// ============================================
// ROUTES
// ============================================

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/push-subscriptions", pushSubscriptionRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/health-data", healthRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// ============================================
// DATABASE & SERVER START
// ============================================

const startServer = async () => {
  try {
    // Connect to MongoDB
    await dbConfig.connect();
    console.log("✓ MongoDB connected successfully");

    // Start Express Server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}`);
      console.log(`✓ API Base: http://localhost:${PORT}/api`);
      startReminderNotificationScheduler();
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(
          `✗ Port ${PORT} is already in use. Change PORT in .env or stop the process using this port.`,
        );
      } else {
        console.error("✗ Server error:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("✗ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  try {
    await mongoose.connection.close();
    console.log("✓ MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

// Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
