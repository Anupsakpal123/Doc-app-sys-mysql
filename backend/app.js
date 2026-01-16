const express = require("express");
require("dotenv").config();
const cors = require("cors");

// 🔹 DB + Models
require("./models");
const { testConnection } = require("./config/db");

// 🔹 Routes
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");              // ✅ REQUIRED
const notificationRoutes = require("./routes/notificationRoutes"); // ✅ REQUIRED

const app = express();
const port = process.env.PORT || 7005;

// 🔹 DB Connection Test
testConnection();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Static folder for profile images
app.use("/uploads", express.static("uploads"));

// 🔹 API Routes
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

// 🔹 Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// 🔹 Server Start
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
