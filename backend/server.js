// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");


// Create an Express application
const app = express();
const corsOptions = {
  origin: "http://localhost:3000", // Your React app URL
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));

// Import routes 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leaveRoutes = require('./routes/LeaveRoute');
const contractRoutes = require('./routes/Contracts');
const newsletterRoutes = require('./routes/newsletter');
const employeeRoutes = require('./routes/employeeRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const departmentRouter = require("./routes/DepartmentRoutes");

/* ===========================
    MIDDLEWARE
=========================== */
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());


/* ===========================
    DATABASE
=========================== */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

/* ===========================
    ROUTES
=========================== */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api", departmentRouter); 




app.post("/api/assign-department", (req, res) => {
  const { employeeId, departmentId } = req.body;

  if (!employeeId || !departmentId) {
    return res.status(400).json({ message: "Missing employee or department ID" });
  }

  assignments.push({ employeeId, departmentId });
  console.log("Assignments:", assignments);

  res.json({ message: "Department assigned successfully!" });
});

/* ===========================
    ERROR HANDLING
=========================== */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

/* ===========================
    START SERVER
=========================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
