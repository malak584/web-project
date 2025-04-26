// Load environment variables from the .env file
require("dotenv").config();  
// Import the Express framework for handling HTTP requests
const express = require("express");
// Import CORS (Cross-Origin Resource Sharing) to allow frontend requests from different origins
const cors = require("cors");
// Import Cookie Parser to handle cookies in HTTP requests
const cookieParser = require("cookie-parser");
// Import Mongoose to interact with MongoDB
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const authRoutes = require('./routes/authRoutes');
// const jobRoutes = require('./routes/jobs'); // Commented out as file does not exist
const newsletterRoutes = require('./routes/newsletter');
const employeeRoutes = require('./routes/employeeRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
// Create an Express application
const app = express();


/* ===========================
    MIDDLEWARE CONFIGURATION
   =========================== */


// Middleware to parse incoming JSON requests (needed for POST/PUT requests)
app.use(express.json());


// Enable CORS to allow frontend requests from "http://localhost:3000"
// "credentials: true" allows sending cookies with requests
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


// Use cookie-parser middleware to handle cookies in HTTP requests
app.use(cookieParser());


/* ===========================
    DATABASE CONNECTION
   =========================== */
   
// Connect to MongoDB using the URI stored in the .env file
mongoose
  .connect(process.env.MONGO_URI)  // Retrieve MongoDB URI from the .env file
  .then(() => console.log("MongoDB Connected"))  // Log success message if connection is successful
  .catch((err) => console.error(err));  // Log error message if connection fails


/* ===========================
    ROUTES CONFIGURATION
   =========================== */


// Import and use authentication routes (register, login, logout)
app.use("/api/auth", authRoutes);
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const LeaveRoutes = require("./routes/LeaveRoute");
app.use("/api/leave", LeaveRoutes);
// Routes
// app.use('/api/jobs', jobRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/attendance', attendanceRoutes);  

/* ===========================
    START THE SERVER
   =========================== */


// Define the port to listen on (default is 5001 if not specified in .env)
const PORT = process.env.PORT || 5001;


// Start the server and listen for incoming requests
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
