const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    // 1. Get data from request body
    let { firstName, lastName, name, email, password, role } = req.body;

    // 2. INTELLIGENT FIX: If frontend sent 'name' but no 'firstName', split it automatically
    if (!firstName && name) {
      const nameParts = name.trim().split(" ");
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(" ");
    }

    // 3. Validation: Ensure we have both parts now
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "Please provide both First Name and Last Name" });
    }

    // 4. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // 5. Create User
    const user = new User({ firstName, lastName, email, password, role });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.cookie("token", token, { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 }); // 8 hours
    
    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};