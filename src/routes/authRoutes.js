const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validationMiddleware,
  schemas,
} = require("../middleware/validationMiddleware");

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    {email, password, firstName, lastName, phone, dateOfBirth, gender}
 */
router.post(
  "/register",
  validationMiddleware.validateRequest(schemas.registerSchema),
  authController.register,
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @body    {email, password}
 */
router.post(
  "/login",
  validationMiddleware.validateRequest(schemas.loginSchema),
  authController.login,
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", authMiddleware.verifyToken, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", authMiddleware.verifyToken, authController.getCurrentUser);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 * @body    {firstName, lastName, phone, gender, profilePicture}
 */
router.put(
  "/profile",
  authMiddleware.verifyToken,
  authController.updateProfile,
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password
 * @access  Private
 * @body    {currentPassword, newPassword}
 */
router.post(
  "/change-password",
  authMiddleware.verifyToken,
  authController.changePassword,
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email
 * @access  Public
 * @body    {token}
 */
router.post("/verify-email", authController.verifyEmail);

module.exports = router;
