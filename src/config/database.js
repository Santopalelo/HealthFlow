const mongoose = require("mongoose");

const dbConfig = {
  connect: async () => {
    try {
      const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/medication_compliance_db";
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });

      // Log successful connection
      mongoose.connection.on("connected", () => {
        console.log(`Mongoose connected to ${uri}`);
      });

      mongoose.connection.on("error", (err) => {
        console.error("Mongoose connection error:", err);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("Mongoose disconnected");
      });
    } catch (error) {
      console.error("Database connection error:", error.message);
      throw error;
    }
  },

  disconnect: async () => {
    await mongoose.connection.close();
  },
};

module.exports = dbConfig;
