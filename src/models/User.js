const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES } = require("../config/constants");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't return password by default
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    phone: {
      type: String,
      match: [
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        "Please provide a valid phone number",
      ],
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.PATIENT,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLockedUntil: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Hash password before saving
userSchema.pre("save", async function hash(next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

// Virtual for full name
userSchema.virtual("fullName").get(function fullName() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to compare passwords
userSchema.methods.comparePassword = async function comparePassword(
  enteredPassword,
) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Method to check if account is locked
userSchema.methods.isAccountLocked = function isAccountLocked() {
  if (this.accountLockedUntil && this.accountLockedUntil > new Date()) {
    return true;
  }
  return false;
};

// Method to increment failed login attempts
userSchema.methods.incrementFailedLoginAttempts =
  async function incrementFailedLoginAttempts() {
    this.failedLoginAttempts += 1;

    if (this.failedLoginAttempts >= 5) {
      // Lock account for 30 minutes
      this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    return this.save();
  };

// Method to reset failed login attempts
userSchema.methods.resetFailedLoginAttempts =
  async function resetFailedLoginAttempts() {
    this.failedLoginAttempts = 0;
    this.accountLockedUntil = null;
    this.lastLogin = new Date();
    return this.save();
  };

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model("User", userSchema);
