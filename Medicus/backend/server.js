const path = require("path");
// Load environment variables from backend/.env to ensure MONGODB_URI is available when run from project root
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();
// CORS configuration for frontend at localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
connectDB();
app.use("/api", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/inventory", inventoryRoutes);
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running", timestamp: new Date() });
});
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({ message: "Server error", error: error.message });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(" Medicus Backend Running on http://localhost:" + PORT);
  console.log(" API Health: http://localhost:" + PORT + "/api/health");
});
