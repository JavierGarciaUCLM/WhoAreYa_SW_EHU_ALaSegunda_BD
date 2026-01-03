const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { autoIndex: true });
    console.log("[DB] Connected to MongoDB (HPC)");
  } catch (err) {
    console.error("[DB] Connection error:", err.message);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("[DB] Runtime error:", err);
});

module.exports = connectDB ;