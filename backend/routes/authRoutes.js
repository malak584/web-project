const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
// Register User


router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    // Split full name into firstName and lastName
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ") || "";

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "Please provide full name (first and last)." });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // ✅ now declared before use

    // Create new user with required fields
    user = new User({ firstName, lastName, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });


    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });


    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Create user object without password for the response
    const userResponse = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      position: user.position,
      department: user.department
    };

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ 
      message: "Login successful", 
      token, 
      role: user.role,
      userId: user._id,
      user: userResponse
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Logout User
router.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out" });
});


module.exports = router;