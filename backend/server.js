require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

// --- 1. Middleware ---
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// --- 2. Database Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));


/* ===========================
    ROUTES
=========================== */
// Notice we are requiring the new short names we just created
app.use("/api/auth", require('./routes/auth'));           // BEFORE: require('./routes/authRoutes')
app.use("/api/users", require('./routes/users'));         // BEFORE: require('./routes/userRoutes')
app.use("/api/leave", require('./routes/leave'));         // BEFORE: require('./routes/LeaveRoute')
app.use("/api/contracts", require('./routes/contracts')); // BEFORE: require('./routes/Contracts')
app.use("/api/newsletter", require('./routes/newsletter'));
app.use("/api/candidates", require('./routes/candidate')); // BEFORE: require('./routes/candidateRoutes')
app.use("/api/attendance", require('./routes/attendance')); // BEFORE: require('./routes/attendanceRoutes')
app.use("/api/departments", require("./routes/departments"));
app.use("/api/reports", require("./routes/reports"));     // BEFORE: require('./routes/reportRoutes')

// --- 4. Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));