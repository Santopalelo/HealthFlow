const validators = {
  // Validate MongoDB ObjectId
  isValidObjectId: (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  // Validate Email
  isValidEmail: (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  },

  // Validate Phone Number
  isValidPhone: (phone) => {
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  },

  // Validate Time Format (HH:MM)
  isValidTimeFormat: (time) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  },

  // Validate Blood Pressure
  isValidBloodPressure: (systolic, diastolic) => {
    return (
      systolic >= 60 && systolic <= 200 && diastolic >= 30 && diastolic <= 130
    );
  },

  // Validate Glucose Level
  isValidGlucoseLevel: (level) => {
    return level >= 20 && level <= 600;
  },

  // Validate Heart Rate
  isValidHeartRate: (bpm) => {
    return bpm >= 20 && bpm <= 200;
  },

  // Validate BMI
  isValidBMI: (weight, height) => {
    if (weight <= 0 || height <= 0) return false;
    const bmi = weight / (height / 100) ** 2;
    return bmi >= 10 && bmi <= 100;
  },

  // Validate Date Range
  isValidDateRange: (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start < end;
  },

  // Validate Percentage
  isValidPercentage: (value) => {
    return value >= 0 && value <= 100;
  },

  // Validate Medication Dosage
  isValidDosage: (dosage, unit) => {
    const validUnits = ["mg", "ml", "mcg", "g", "iu", "units"];
    return dosage > 0 && validUnits.includes(unit);
  },

  // Sanitize String (remove special characters)
  sanitizeString: (str) => {
    return str.trim().replace(/[^a-zA-Z0-9\s\-.,]/g, "");
  },

  // Check Age from Date of Birth
  calculateAge: (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age -= 1;
    }

    return age;
  },

  // Check if medication is expired
  isMedicationExpired: (expirationDate) => {
    return new Date(expirationDate) < new Date();
  },

  // Check if reminder is within active period
  isReminderActive: (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    return now >= start && (!end || now <= end);
  },

  // Calculate medication compliance rate
  calculateComplianceRate: (totalDoses, completedDoses) => {
    if (totalDoses === 0) return 0;
    return Math.round((completedDoses / totalDoses) * 100);
  },

  // Generate unique device identifier
  generateDeviceId: () => {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Validate heart rate zone
  validateHeartRateZone: (bpm, age) => {
    const maxHeartRate = 220 - age;
    return {
      zone1: {
        min: maxHeartRate * 0.5,
        max: maxHeartRate * 0.6,
        name: "Very Light",
      },
      zone2: {
        min: maxHeartRate * 0.6,
        max: maxHeartRate * 0.7,
        name: "Light",
      },
      zone3: {
        min: maxHeartRate * 0.7,
        max: maxHeartRate * 0.8,
        name: "Moderate",
      },
      zone4: { min: maxHeartRate * 0.8, max: maxHeartRate * 0.9, name: "Hard" },
      zone5: { min: maxHeartRate * 0.9, max: maxHeartRate, name: "Maximum" },
    };
  },
};

module.exports = validators;
