const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Get All Users (READ)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// Get User by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error fetching user ${req.params.id}:`, error);
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

// Create New User (CREATE)
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ 
      firstName, 
      lastName, 
      email, 
      password,
      role: role || 'employee'
    });
    
    await newUser.save();
    
    // Don't return the password
    const userResponse = newUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

// Update User (UPDATE)
router.put("/:id", async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      emergencyContact, 
      emergencyPhone 
    } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        firstName, 
        lastName, 
        email, 
        phone, 
        address, 
        emergencyContact, 
        emergencyPhone 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(`Error updating user ${req.params.id}:`, error);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

// Delete User (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(`Error deleting user ${req.params.id}:`, error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

module.exports = router;
