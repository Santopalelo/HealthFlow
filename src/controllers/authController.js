const User = require("../models/User");
const Patient = require("../models/Patient");
const responseUtil = require("../utils/responseUtil");
const authMiddleware = require("../middleware/authMiddleware");
const { asyncHandler } = require("../middleware/errorHandler");

const authController = {
  // Register User
  register: asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, phone, dateOfBirth, gender } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return responseUtil.error(
        res,
        "Email already registered",
        "DUPLICATE_EMAIL",
        409,
      );
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      dateOfBirth,
      gender,
    });

    await user.save();

    // Create patient profile
    const patient = new Patient({
      userId: user._id,
    });

    await patient.save();

    // Generate token
    const token = authMiddleware.generateToken(user);

    responseUtil.success(
      res,
      {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          patientId: patient._id,
        },
        token,
      },
      "User registered successfully",
      201,
    );
  }),

  // Login User
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return responseUtil.error(
        res,
        "Invalid email or password",
        "INVALID_CREDENTIALS",
        401,
      );
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      return responseUtil.error(
        res,
        "Account temporarily locked. Please try again later.",
        "ACCOUNT_LOCKED",
        403,
      );
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      await user.incrementFailedLoginAttempts();
      return responseUtil.error(
        res,
        "Invalid email or password",
        "INVALID_CREDENTIALS",
        401,
      );
    }

    // Reset failed login attempts
    await user.resetFailedLoginAttempts();

    // Generate token
    const token = authMiddleware.generateToken(user);

    // include patientId on login so frontend can call patient endpoints
    const patient = await Patient.findOne({ userId: user._id });

    responseUtil.success(
      res,
      {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          patientId: patient?._id || null,
        },
        token,
      },
      "Login successful",
    );
  }),

  // Get Current User
  getCurrentUser: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);

    if (!user) {
      return responseUtil.error(res, "User not found", "USER_NOT_FOUND", 404);
    }

    responseUtil.success(
      res,
      {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      },
      "User retrieved successfully",
    );
  }),

  // Update User Profile
  updateProfile: asyncHandler(async (req, res) => {
    const { firstName, lastName, phone, gender, profilePicture } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          firstName,
          lastName,
          phone,
          gender,
          profilePicture,
        },
      },
      { new: true, runValidators: true },
    );

    if (!user) {
      return responseUtil.error(res, "User not found", "USER_NOT_FOUND", 404);
    }

    responseUtil.success(
      res,
      {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          phone: user.phone,
          gender: user.gender,
          profilePicture: user.profilePicture,
        },
      },
      "Profile updated successfully",
    );
  }),

  // Change Password
  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return responseUtil.error(res, "User not found", "USER_NOT_FOUND", 404);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return responseUtil.error(
        res,
        "Current password is incorrect",
        "INVALID_PASSWORD",
        401,
      );
    }

    // Update password
    user.password = newPassword;
    await user.save();

    responseUtil.success(res, {}, "Password changed successfully");
  }),

  // Logout (client-side, but endpoint for completeness)
  logout: asyncHandler(async (req, res) => {
    // In a stateless JWT system, logout is primarily handled on the client side
    // But we can track logout on server if needed (optional)

    responseUtil.success(res, {}, "Logout successful");
  }),

  // Verify Email (placeholder for email verification)
  verifyEmail: asyncHandler(async (req, res) => {
    const { token } = req.body;

    // TODO: Implement email verification logic
    // This would typically verify a token sent in an email

    responseUtil.success(res, {}, "Email verified successfully");
  }),
};

module.exports = authController;
