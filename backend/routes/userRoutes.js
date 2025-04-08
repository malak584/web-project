const express = require("express");
const User = require("../models/User");
const router = express.Router();


//  Get All Users (READ)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//  Create New User (CREATE)
router.post("/create", async (req, res) => {
  try {
    const { name, email, password } = req.body;
     // Check if user exists
     let user = await User.findOne({ email });
     if (user) return res.status(400).json({ message: "User already exists" });
 
 
     // Create new user
     X = new User({ name, email, password });
     await X.save();
 
 
     res.status(201).json(X);
   } catch (err) {
     res.status(500).json({ message: err.message });
   }
 });
 
 
 //  Update User (UPDATE)
 router.put("/:id", async (req, res) => {
try {
     const { name, email } = req.body;
     const updatedUser = await User.findByIdAndUpdate(
       req.params.id,
       { name, email },
       { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//  Delete User (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
